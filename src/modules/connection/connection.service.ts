import {
  Global,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createPool, Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConnectionService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.promise().query('SELECT 1');
      console.log(`✅ Connect Database.`);
    } catch (error) {
      console.log(`Database Init Error: ${error}`);
    }
  }

  async onModuleDestroy() {
    this.pool.end();
  }

  async query<T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
  ): Promise<T | null> {
    try {
      const [rows] = await this.pool.promise().query<T>(sql);

      return rows;
    } catch (error) {
      throw error;
    }
  }
}
