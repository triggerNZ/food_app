import { OrderRepository, OrderItemRepository } from '@/repositories';
import { Order, OrderStatus, CreateOrderData, OrderWithItems, Cart } from '@/types';

export class OrderService {
  private orderRepository: OrderRepository;
  private orderItemRepository: OrderItemRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderItemRepository = new OrderItemRepository();
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const order = await this.orderRepository.create(orderData);
    
    if (orderData.items.length > 0) {
      await this.orderItemRepository.createMany(order.id, orderData.items);
    }

    return order;
  }

  async createOrderFromCart(
    cart: Cart,
    customerInfo: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      deliveryAddress: string;
      specialInstructions?: string;
    },
    paymentInfo: {
      paymentMethod: string;
      paymentTransactionId?: string;
    },
    pricing: {
      subtotal: number;
      tax: number;
      deliveryFee: number;
      total: number;
    }
  ): Promise<Order> {
    if (!cart.restaurantId || cart.items.length === 0) {
      throw new Error('Cart is empty or invalid');
    }

    const estimatedDeliveryTime = this.calculateEstimatedDeliveryTime();

    const orderData: CreateOrderData = {
      restaurantId: cart.restaurantId,
      ...customerInfo,
      ...pricing,
      ...paymentInfo,
      estimatedDeliveryTime,
      items: cart.items.map(cartItem => ({
        menuItemId: cartItem.menuItem.id,
        quantity: cartItem.quantity,
        unitPrice: cartItem.menuItem.price,
        totalPrice: cartItem.menuItem.price * cartItem.quantity
      }))
    };

    return this.createOrder(orderData);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getOrderWithItems(id: string): Promise<OrderWithItems | null> {
    return this.orderRepository.findWithItems(id);
  }

  async getOrdersByCustomerEmail(email: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerEmail(email);
  }

  async getOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
    return this.orderRepository.findByRestaurantId(restaurantId);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.findByStatus(status);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    this.validateStatusTransition(id, status);
    
    const actualDeliveryTime = status === 'delivered' ? new Date() : undefined;
    const updatedOrder = await this.orderRepository.updateStatus(id, status, actualDeliveryTime);
    
    if (updatedOrder && this.shouldRecalculateDeliveryTime(status)) {
      const newEstimatedTime = this.calculateEstimatedDeliveryTimeForStatus(status);
      await this.orderRepository.updateEstimatedDeliveryTime(id, newEstimatedTime);
    }
    
    return updatedOrder;
  }

  async updateEstimatedDeliveryTime(id: string, estimatedDeliveryTime: Date): Promise<Order | null> {
    return this.orderRepository.updateEstimatedDeliveryTime(id, estimatedDeliveryTime);
  }

  async cancelOrder(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (!this.canCancelOrder(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    return this.updateOrderStatus(id, 'cancelled');
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }

  private calculateEstimatedDeliveryTime(): Date {
    const now = new Date();
    const estimatedMinutes = 30 + Math.floor(Math.random() * 30); // 30-60 minutes
    return new Date(now.getTime() + estimatedMinutes * 60 * 1000);
  }

  private calculateEstimatedDeliveryTimeForStatus(status: OrderStatus): Date {
    const now = new Date();
    let additionalMinutes = 0;

    switch (status) {
      case 'order_confirmed':
        additionalMinutes = 25 + Math.floor(Math.random() * 20); // 25-45 minutes
        break;
      case 'preparing':
        additionalMinutes = 20 + Math.floor(Math.random() * 15); // 20-35 minutes
        break;
      case 'ready_for_pickup':
        additionalMinutes = 10 + Math.floor(Math.random() * 10); // 10-20 minutes
        break;
      case 'out_for_delivery':
        additionalMinutes = 5 + Math.floor(Math.random() * 10); // 5-15 minutes
        break;
      default:
        additionalMinutes = 0;
    }

    return new Date(now.getTime() + additionalMinutes * 60 * 1000);
  }

  private shouldRecalculateDeliveryTime(status: OrderStatus): boolean {
    return ['order_confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(status);
  }

  private validateStatusTransition(orderId: string, newStatus: OrderStatus): void {
    // Define valid status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      order_placed: ['order_confirmed', 'cancelled'],
      order_confirmed: ['preparing', 'cancelled'],
      preparing: ['ready_for_pickup', 'cancelled'],
      ready_for_pickup: ['out_for_delivery', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled'],
      delivered: [], // Final state
      cancelled: [] // Final state
    };

    // For now, we'll just validate that the status is a valid OrderStatus
    // In a real implementation, you might want to fetch the current order status
    // and validate the transition
    const validStatuses: OrderStatus[] = [
      'order_placed', 'order_confirmed', 'preparing', 
      'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }
  }

  private canCancelOrder(status: OrderStatus): boolean {
    // Orders can be cancelled before they're out for delivery
    return !['delivered', 'cancelled', 'out_for_delivery'].includes(status);
  }

  async getOrderStatusHistory(orderId: string): Promise<{ status: OrderStatus; timestamp: Date }[]> {
    // This would require a separate order_status_history table in a real implementation
    // For now, we'll return basic info based on the current order
    const order = await this.getOrderById(orderId);
    if (!order) return [];

    return [
      { status: order.status, timestamp: order.updatedAt }
    ];
  }

  async getActiveOrdersForRestaurant(restaurantId: string): Promise<Order[]> {
    const allOrders = await this.getOrdersByRestaurant(restaurantId);
    return allOrders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  }

  async getOrderStatistics(restaurantId?: string): Promise<{
    totalOrders: number;
    ordersByStatus: Record<OrderStatus, number>;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    const orders = restaurantId 
      ? await this.getOrdersByRestaurant(restaurantId)
      : await this.getAllOrders();

    const stats = {
      totalOrders: orders.length,
      ordersByStatus: {} as Record<OrderStatus, number>,
      totalRevenue: 0,
      averageOrderValue: 0
    };

    // Initialize status counts
    const statuses: OrderStatus[] = [
      'order_placed', 'order_confirmed', 'preparing', 
      'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'
    ];
    statuses.forEach(status => {
      stats.ordersByStatus[status] = 0;
    });

    // Calculate statistics
    orders.forEach(order => {
      stats.ordersByStatus[order.status]++;
      if (order.status !== 'cancelled') {
        stats.totalRevenue += order.total;
      }
    });

    stats.averageOrderValue = stats.totalOrders > 0 
      ? stats.totalRevenue / (stats.totalOrders - stats.ordersByStatus.cancelled)
      : 0;

    return stats;
  }
}