import type { Pool, PoolClient } from "pg";

export class BaseModel {
  constructor(protected readonly _db: Pool | PoolClient) {}
}
