import { BaseRepository } from './BaseRepository';
import { MenuItem } from '@/types';

export class MenuItemRepository extends BaseRepository {
  
  async findAll(): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      ORDER BY category ASC, name ASC
    `;
    return this.queryMany<MenuItem>(query);
  }

  async findById(id: string): Promise<MenuItem | null> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE id = $1
    `;
    return this.queryOne<MenuItem>(query, [id]);
  }

  async findByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE restaurant_id = $1
      ORDER BY category ASC, name ASC
    `;
    return this.queryMany<MenuItem>(query, [restaurantId]);
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE LOWER(category) = LOWER($1)
      ORDER BY name ASC
    `;
    return this.queryMany<MenuItem>(query, [category]);
  }

  async findByCategoryAndRestaurant(category: string, restaurantId: string): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE LOWER(category) = LOWER($1) AND restaurant_id = $2
      ORDER BY name ASC
    `;
    return this.queryMany<MenuItem>(query, [category, restaurantId]);
  }

  async search(searchTerm: string): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE LOWER(name) LIKE LOWER($1)
         OR LOWER(description) LIKE LOWER($1)
         OR LOWER(category) LIKE LOWER($1)
      ORDER BY name ASC
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.queryMany<MenuItem>(query, [searchPattern]);
  }

  async searchByRestaurant(searchTerm: string, restaurantId: string): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE restaurant_id = $1
        AND (LOWER(name) LIKE LOWER($2)
         OR LOWER(description) LIKE LOWER($2)
         OR LOWER(category) LIKE LOWER($2))
      ORDER BY name ASC
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.queryMany<MenuItem>(query, [restaurantId, searchPattern]);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<MenuItem[]> {
    const query = `
      SELECT id, restaurant_id as "restaurantId", name, description, price, image, category
      FROM menu_items
      WHERE price >= $1 AND price <= $2
      ORDER BY price ASC, name ASC
    `;
    return this.queryMany<MenuItem>(query, [minPrice, maxPrice]);
  }

  async create(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const query = `
      INSERT INTO menu_items (id, restaurant_id, name, description, price, image, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, restaurant_id as "restaurantId", name, description, price, image, category
    `;
    const id = `item_${Date.now()}`;
    const values = [
      id,
      menuItem.restaurantId,
      menuItem.name,
      menuItem.description,
      menuItem.price,
      menuItem.image,
      menuItem.category
    ];
    return this.queryOne<MenuItem>(query, values) as Promise<MenuItem>;
  }

  async update(id: string, menuItem: Partial<Omit<MenuItem, 'id'>>): Promise<MenuItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (menuItem.restaurantId !== undefined) {
      fields.push(`restaurant_id = $${paramIndex++}`);
      values.push(menuItem.restaurantId);
    }
    if (menuItem.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(menuItem.name);
    }
    if (menuItem.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(menuItem.description);
    }
    if (menuItem.price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(menuItem.price);
    }
    if (menuItem.image !== undefined) {
      fields.push(`image = $${paramIndex++}`);
      values.push(menuItem.image);
    }
    if (menuItem.category !== undefined) {
      fields.push(`category = $${paramIndex++}`);
      values.push(menuItem.category);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE menu_items 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, restaurant_id as "restaurantId", name, description, price, image, category
    `;

    return this.queryOne<MenuItem>(query, values);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM menu_items WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteByRestaurantId(restaurantId: string): Promise<number> {
    const query = `DELETE FROM menu_items WHERE restaurant_id = $1`;
    const result = await this.query(query, [restaurantId]);
    return result.rowCount || 0;
  }

  async getCategories(): Promise<string[]> {
    const query = `
      SELECT DISTINCT category
      FROM menu_items
      ORDER BY category ASC
    `;
    const result = await this.queryMany<{ category: string }>(query);
    return result.map(row => row.category);
  }

  async getCategoriesByRestaurant(restaurantId: string): Promise<string[]> {
    const query = `
      SELECT DISTINCT category
      FROM menu_items
      WHERE restaurant_id = $1
      ORDER BY category ASC
    `;
    const result = await this.queryMany<{ category: string }>(query, [restaurantId]);
    return result.map(row => row.category);
  }
}