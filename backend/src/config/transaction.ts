import type { PoolClient } from "pg";
import { pool } from "./database.js";

export const createTransaction =
  (db: typeof pool) =>
  async <T>(cb: (trx: PoolClient) => Promise<T>): Promise<T> => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");
      const result = await cb(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };
