export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string | null;
}

export type OrderStatus = 
  | 'order_placed'
  | 'order_confirmed' 
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  restaurantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentTransactionId?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { menuItem: MenuItem })[];
  restaurant: Restaurant;
}

export interface CreateOrderData {
  restaurantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentTransactionId?: string;
  estimatedDeliveryTime?: Date;
  specialInstructions?: string;
  items: CreateOrderItemData[];
}

export interface CreateOrderItemData {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}