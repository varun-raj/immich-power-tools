import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Client, Pool } from "pg";
import { ENV } from "./environment";
import * as schema from "@/schema";
import { sql } from 'drizzle-orm';

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  keepAlive: true,
});

class DatabaseConnectionError extends Error {
  error: string;
  constructor(message: string, error: string) {
    super(message);
    this.name = "DatabaseConnectionError";
    this.error = error;
  }
}
export const connectDB = async (db: NodePgDatabase<typeof schema>) => {
  try {
    await db.execute(sql`SELECT 1`); // Execute a simple query
  } catch (error: any) {
    throw new DatabaseConnectionError(error.message, "Database connection failed");
  }
}

export const db = drizzle(pool, {
  schema
});
