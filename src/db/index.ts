import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
    const url = new URL(process.env.DATABASE_URL);
    if (
      ["require", "prefer", "verify-ca"].includes(
        url.searchParams.get("sslmode") || "",
      )
    )
      url.searchParams.set("sslmode", "verify-full");
    db = drizzle({
      client: new Pool({
        connectionString: url.toString(),
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 10000,
      }),
      schema,
    });
  }
  return db;
}
