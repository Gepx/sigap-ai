import type {
  PermissionBodySchema,
  PermissionUpdatePayloadSchema,
} from "../schemas/permissions.schema.js";
import type { Permission } from "../types/permission.type.js";
import {
  createQueryParams,
  type PaginationInterfaceHelper,
} from "../utils/queryHelper.js";
import { BaseModel } from "./base.model.js";

export class PermissionModel extends BaseModel {
  async createPermission(payload: PermissionBodySchema) {
    const query = `
      INSERT INTO permissions (route, permission_name, method, is_menu)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await this._db.query(query, [
      payload.route,
      payload.permission_name,
      payload.method,
      payload.is_menu,
    ]);

    return result.rows[0] as Permission;
  }

  async getAllPermissions(options: PaginationInterfaceHelper) {
    const { limit = 10, page = 1, ...filters } = options;
    const offset = (page - 1) * limit;

    const { conditions, values, nextIndex } = createQueryParams(filters);

    const query = `
      SELECT *, COUNT(*) OVER() as total
      FROM permissions
      WHERE deleted_at IS NULL ${conditions}
      ORDER BY updated_at DESC NULLS LAST
      LIMIT $${nextIndex} OFFSET $${nextIndex + 1}
    `;

    const result = await this._db.query(query, [...values, limit, offset]);
    const rows = result.rows as (Permission & { total: number })[];
    const total = rows[0]?.total ?? "0";

    return {
      data: result.rows as Permission[],
      total: Number(total),
      limit: Number(limit ?? 0),
    };
  }

  async getPermissionById(uuid: string) {
    const query =
      "SELECT * FROM permissions WHERE uuid = $1 AND deleted_at IS NULL";
    const result = await this._db.query(query, [uuid]);
    return result.rows[0] as Permission;
  }

  async updatePermission(uuid: string, payload: PermissionUpdatePayloadSchema) {
    const { route, permission_name, method, is_menu } = payload;
    const query = `
      UPDATE permissions
      SET route = $1, permission_name = $2, method = $3, is_menu = $4, updated_at = NOW()
      WHERE uuid = $5
      RETURNING *
    `;

    const result = await this._db.query(query, [
      route,
      permission_name,
      method,
      is_menu,
      uuid,
    ]);
    return result.rows[0] as Permission;
  }

  async deletePermission(uuid: string) {
    const query =
      "update permissions SET deleted_at = NOW() WHERE uuid = $1 RETURNING *";
    const result = await this._db.query(query, [uuid]);
    return result.rows[0] as Permission;
  }

  async getIdByUuidBulk(uuids: string[]) {
    const placeholders = uuids.map((_, i) => `$${i + 1}`).join(", ");
    const query = `SELECT id FROM permissions WHERE uuid IN (${placeholders})`;
    const result = await this._db.query(query, uuids);
    const ids = result.rows.map((row) => row.id as number);
    return ids as number[];
  }

  async getPermissionWithOutMenu() {
    const query = `
      SELECT * FROM permissions
      WHERE is_menu = false AND deleted_at IS NULL
    `;
    const result = await this._db.query(query);
    return result.rows as Permission[];
  }

  async getPermissionMenu() {
    const query = `
      SELECT * FROM permissions
      WHERE is_menu = true AND deleted_at IS NULL
    `;
    const result = await this._db.query(query);
    return result.rows as Permission[];
  }
}
