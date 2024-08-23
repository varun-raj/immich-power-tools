import { drizzle } from 'drizzle-orm/node-postgres';

import { Client } from "pg";
import { ENV } from "./environment";
import * as schema from "@/schema";

const client = new Client({
  connectionString: ENV.DATABASE_URL,
});

await client.connect();
export const db = drizzle(client, {
  schema
});