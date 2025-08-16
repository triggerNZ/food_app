import { BaseRepository } from './BaseRepository';
import { Order, OrderStatus, CreateOrderData, OrderWithItems } from '@/types';

export class OrderRepository extends BaseRepository {
  
  async findAll(): Promise<Order[]> {
    const query = `
      SELECT 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      ORDER BY created_at DESC
    `;
    return this.queryMany<Order>(query);
  }

  async findById(id: string): Promise<Order | null> {
    const query = `
      SELECT 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      WHERE id = $1
    `;
    return this.queryOne<Order>(query, [id]);
  }

  async findWithItems(id: string): Promise<OrderWithItems | null> {
    const query = `
      SELECT 
        o.id, 
        o.restaurant_id as "restaurantId",
        o.customer_name as "customerName",
        o.customer_email as "customerEmail", 
        o.customer_phone as "customerPhone",
        o.delivery_address as "deliveryAddress",
        o.status,
        o.subtotal,
        o.tax,
        o.delivery_fee as "deliveryFee",
        o.total,
        o.payment_method as "paymentMethod",
        o.payment_transaction_id as "paymentTransactionId",
        o.estimated_delivery_time as "estimatedDeliveryTime",
        o.actual_delivery_time as "actualDeliveryTime",
        o.special_instructions as "specialInstructions",
        o.created_at as "createdAt",
        o.updated_at as "updatedAt",
        r.name as "restaurantName",
        r.cuisine as "restaurantCuisine",
        r.rating as "restaurantRating",
        r.delivery_time as "restaurantDeliveryTime",
        r.image as "restaurantImage",
        r.description as "restaurantDescription",
        json_agg(
          json_build_object(
            'id', oi.id,
            'orderId', oi.order_id,
            'menuItemId', oi.menu_item_id,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'totalPrice', oi.total_price,
            'createdAt', oi.created_at,
            'menuItem', json_build_object(
              'id', mi.id,
              'restaurantId', mi.restaurant_id,
              'name', mi.name,
              'description', mi.description,
              'price', mi.price,
              'image', mi.image,
              'category', mi.category
            )
          )
        ) as items
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.id = $1
      GROUP BY o.id, r.id
    `;

    const result = await this.queryOne<any>(query, [id]);
    if (!result) return null;

    return {
      id: result.id,
      restaurantId: result.restaurantId,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      customerPhone: result.customerPhone,
      deliveryAddress: result.deliveryAddress,
      status: result.status,
      subtotal: result.subtotal,
      tax: result.tax,
      deliveryFee: result.deliveryFee,
      total: result.total,
      paymentMethod: result.paymentMethod,
      paymentTransactionId: result.paymentTransactionId,
      estimatedDeliveryTime: result.estimatedDeliveryTime,
      actualDeliveryTime: result.actualDeliveryTime,
      specialInstructions: result.specialInstructions,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      restaurant: {
        id: result.restaurantId,
        name: result.restaurantName,
        cuisine: result.restaurantCuisine,
        rating: result.restaurantRating,
        deliveryTime: result.restaurantDeliveryTime,
        image: result.restaurantImage,
        description: result.restaurantDescription
      },
      items: result.items || []
    };
  }

  async findByCustomerEmail(email: string): Promise<Order[]> {
    const query = `
      SELECT 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      WHERE customer_email = $1
      ORDER BY created_at DESC
    `;
    return this.queryMany<Order>(query, [email]);
  }

  async findByRestaurantId(restaurantId: string): Promise<Order[]> {
    const query = `
      SELECT 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      WHERE restaurant_id = $1
      ORDER BY created_at DESC
    `;
    return this.queryMany<Order>(query, [restaurantId]);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const query = `
      SELECT 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      WHERE status = $1
      ORDER BY created_at DESC
    `;
    return this.queryMany<Order>(query, [status]);
  }

  async create(orderData: CreateOrderData): Promise<Order> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const query = `
      INSERT INTO orders (
        id, restaurant_id, customer_name, customer_email, customer_phone,
        delivery_address, status, subtotal, tax, delivery_fee, total,
        payment_method, payment_transaction_id, estimated_delivery_time, special_instructions
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const values = [
      orderId,
      orderData.restaurantId,
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerPhone,
      orderData.deliveryAddress,
      'order_placed',
      orderData.subtotal,
      orderData.tax,
      orderData.deliveryFee,
      orderData.total,
      orderData.paymentMethod,
      orderData.paymentTransactionId,
      orderData.estimatedDeliveryTime?.toISOString(),
      orderData.specialInstructions
    ];

    return this.queryOne<Order>(query, values) as Promise<Order>;
  }

  async updateStatus(id: string, status: OrderStatus, actualDeliveryTime?: Date): Promise<Order | null> {
    const values: any[] = [status, id];
    let query = `
      UPDATE orders 
      SET status = $1
    `;

    if (actualDeliveryTime && status === 'delivered') {
      query += `, actual_delivery_time = $3`;
      values.splice(1, 0, actualDeliveryTime.toISOString());
    }

    query += `
      WHERE id = $${values.length}
      RETURNING 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    return this.queryOne<Order>(query, values);
  }

  async updateEstimatedDeliveryTime(id: string, estimatedDeliveryTime: Date): Promise<Order | null> {
    const query = `
      UPDATE orders 
      SET estimated_delivery_time = $1
      WHERE id = $2
      RETURNING 
        id, 
        restaurant_id as "restaurantId",
        customer_name as "customerName",
        customer_email as "customerEmail", 
        customer_phone as "customerPhone",
        delivery_address as "deliveryAddress",
        status,
        subtotal,
        tax,
        delivery_fee as "deliveryFee",
        total,
        payment_method as "paymentMethod",
        payment_transaction_id as "paymentTransactionId",
        estimated_delivery_time as "estimatedDeliveryTime",
        actual_delivery_time as "actualDeliveryTime",
        special_instructions as "specialInstructions",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    return this.queryOne<Order>(query, [estimatedDeliveryTime.toISOString(), id]);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM orders WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}