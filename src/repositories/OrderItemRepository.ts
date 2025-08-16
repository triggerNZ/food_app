import { BaseRepository } from './BaseRepository';
import { OrderItem, CreateOrderItemData } from '@/types';

export class OrderItemRepository extends BaseRepository {
  
  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const query = `
      SELECT 
        id,
        order_id as "orderId",
        menu_item_id as "menuItemId",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        created_at as "createdAt"
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
    `;
    return this.queryMany<OrderItem>(query, [orderId]);
  }

  async findById(id: string): Promise<OrderItem | null> {
    const query = `
      SELECT 
        id,
        order_id as "orderId",
        menu_item_id as "menuItemId",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        created_at as "createdAt"
      FROM order_items
      WHERE id = $1
    `;
    return this.queryOne<OrderItem>(query, [id]);
  }

  async create(orderId: string, itemData: CreateOrderItemData): Promise<OrderItem> {
    const itemId = `order_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const query = `
      INSERT INTO order_items (
        id, order_id, menu_item_id, quantity, unit_price, total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        order_id as "orderId",
        menu_item_id as "menuItemId",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        created_at as "createdAt"
    `;

    const values = [
      itemId,
      orderId,
      itemData.menuItemId,
      itemData.quantity,
      itemData.unitPrice,
      itemData.totalPrice
    ];

    return this.queryOne<OrderItem>(query, values) as Promise<OrderItem>;
  }

  async createMany(orderId: string, itemsData: CreateOrderItemData[]): Promise<OrderItem[]> {
    if (itemsData.length === 0) return [];

    const values: any[] = [];
    const valueStrings: string[] = [];
    let paramIndex = 1;

    for (const itemData of itemsData) {
      const itemId = `order_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      valueStrings.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5})`);
      values.push(itemId, orderId, itemData.menuItemId, itemData.quantity, itemData.unitPrice, itemData.totalPrice);
      paramIndex += 6;
    }

    const query = `
      INSERT INTO order_items (
        id, order_id, menu_item_id, quantity, unit_price, total_price
      )
      VALUES ${valueStrings.join(', ')}
      RETURNING 
        id,
        order_id as "orderId",
        menu_item_id as "menuItemId",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        created_at as "createdAt"
    `;

    return this.queryMany<OrderItem>(query, values);
  }

  async updateQuantity(id: string, quantity: number, totalPrice: number): Promise<OrderItem | null> {
    const query = `
      UPDATE order_items 
      SET quantity = $1, total_price = $2
      WHERE id = $3
      RETURNING 
        id,
        order_id as "orderId",
        menu_item_id as "menuItemId",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        created_at as "createdAt"
    `;

    return this.queryOne<OrderItem>(query, [quantity, totalPrice, id]);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM order_items WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteByOrderId(orderId: string): Promise<boolean> {
    const query = `DELETE FROM order_items WHERE order_id = $1`;
    const result = await this.query(query, [orderId]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async findByMenuItemId(menuItemId: string): Promise<OrderItem[]> {
    const query = `
      SELECT 
        id,
        order_id as "orderId",
        menu_item_id as "menuItemId",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        created_at as "createdAt"
      FROM order_items
      WHERE menu_item_id = $1
      ORDER BY created_at DESC
    `;
    return this.queryMany<OrderItem>(query, [menuItemId]);
  }

  async getTotalQuantityByMenuItemId(menuItemId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(quantity), 0) as total_quantity
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.menu_item_id = $1 
        AND o.status NOT IN ('cancelled')
    `;
    const result = await this.queryOne<{ total_quantity: number }>(query, [menuItemId]);
    return result?.total_quantity || 0;
  }
}