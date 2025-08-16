import Database from '@/lib/database';
import { QueryResult } from 'pg';

export abstract class BaseRepository {
  protected db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  protected async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.db.query(text, params);
  }

  protected async queryOne<T>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.query(text, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  protected async queryMany<T>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.query(text, params);
    return result.rows;
  }
}