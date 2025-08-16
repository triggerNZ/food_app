import { BaseRepository } from './BaseRepository';
import { Restaurant } from '@/types';

export class RestaurantRepository extends BaseRepository {
  
  async findAll(): Promise<Restaurant[]> {
    const query = `
      SELECT id, name, cuisine, rating, delivery_time as "deliveryTime", image, description
      FROM restaurants
      ORDER BY rating DESC, name ASC
    `;
    return this.queryMany<Restaurant>(query);
  }

  async findById(id: string): Promise<Restaurant | null> {
    const query = `
      SELECT id, name, cuisine, rating, delivery_time as "deliveryTime", image, description
      FROM restaurants
      WHERE id = $1
    `;
    return this.queryOne<Restaurant>(query, [id]);
  }

  async findByCuisine(cuisine: string): Promise<Restaurant[]> {
    const query = `
      SELECT id, name, cuisine, rating, delivery_time as "deliveryTime", image, description
      FROM restaurants
      WHERE LOWER(cuisine) = LOWER($1)
      ORDER BY rating DESC, name ASC
    `;
    return this.queryMany<Restaurant>(query, [cuisine]);
  }

  async search(searchTerm: string): Promise<Restaurant[]> {
    const query = `
      SELECT DISTINCT r.id, r.name, r.cuisine, r.rating, r.delivery_time as "deliveryTime", r.image, r.description
      FROM restaurants r
      LEFT JOIN menu_items m ON r.id = m.restaurant_id
      WHERE LOWER(r.name) LIKE LOWER($1)
         OR LOWER(r.cuisine) LIKE LOWER($1)
         OR LOWER(r.description) LIKE LOWER($1)
         OR LOWER(m.name) LIKE LOWER($1)
         OR LOWER(m.description) LIKE LOWER($1)
      ORDER BY r.rating DESC, r.name ASC
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.queryMany<Restaurant>(query, [searchPattern]);
  }

  async create(restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const query = `
      INSERT INTO restaurants (id, name, cuisine, rating, delivery_time, image, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, cuisine, rating, delivery_time as "deliveryTime", image, description
    `;
    const id = `restaurant_${Date.now()}`;
    const values = [
      id,
      restaurant.name,
      restaurant.cuisine,
      restaurant.rating,
      restaurant.deliveryTime,
      restaurant.image,
      restaurant.description
    ];
    return this.queryOne<Restaurant>(query, values) as Promise<Restaurant>;
  }

  async update(id: string, restaurant: Partial<Omit<Restaurant, 'id'>>): Promise<Restaurant | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (restaurant.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(restaurant.name);
    }
    if (restaurant.cuisine !== undefined) {
      fields.push(`cuisine = $${paramIndex++}`);
      values.push(restaurant.cuisine);
    }
    if (restaurant.rating !== undefined) {
      fields.push(`rating = $${paramIndex++}`);
      values.push(restaurant.rating);
    }
    if (restaurant.deliveryTime !== undefined) {
      fields.push(`delivery_time = $${paramIndex++}`);
      values.push(restaurant.deliveryTime);
    }
    if (restaurant.image !== undefined) {
      fields.push(`image = $${paramIndex++}`);
      values.push(restaurant.image);
    }
    if (restaurant.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(restaurant.description);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE restaurants 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, cuisine, rating, delivery_time as "deliveryTime", image, description
    `;

    return this.queryOne<Restaurant>(query, values);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM restaurants WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async findByRatingRange(minRating: number, maxRating: number): Promise<Restaurant[]> {
    const query = `
      SELECT id, name, cuisine, rating, delivery_time as "deliveryTime", image, description
      FROM restaurants
      WHERE rating >= $1 AND rating <= $2
      ORDER BY rating DESC, name ASC
    `;
    return this.queryMany<Restaurant>(query, [minRating, maxRating]);
  }
}