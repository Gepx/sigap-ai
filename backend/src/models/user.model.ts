import { BaseModel } from "../models/base.model.js";
import type { UpdateUserBodySchema, UpdateProfileBodySchema } from "../schemas/user.schema.js";
import type { User } from "../types/user.type.js";
import {
  createQueryParams,
  type PaginationInterfaceHelper,
} from "../utils/queryHelper.js";

export class UserModel extends BaseModel {
  async getAllUser(options: PaginationInterfaceHelper) {
    const { limit = 10, page = 1, ...filters } = options;
    const offset = (page - 1) * limit;

    const { conditions, values, nextIndex } = createQueryParams(filters);

    const query = `
          SELECT 
            users.*, 
            r.role_name,
            COALESCE(
              json_agg(
                json_build_object(
                  'permission_name', p.permission_name,
                  'route', p.route,
                  'method', p.method,
                  'is_menu', p.is_menu
                )
              ) FILTER (WHERE p.id IS NOT NULL),
              '[]'
            ) AS permissions,
            COUNT(*) OVER() AS total 
          FROM 
            users 
            JOIN roles r ON users.role_id = r.id 
            LEFT JOIN role_permissions rp ON rp.role_id = r.id
            LEFT JOIN permissions p ON p.id = rp.permission_id AND p.deleted_at IS NULL
          WHERE 
            users.deleted_at IS NULL ${conditions}
          GROUP BY users.id, r.role_name
          ORDER BY 
            users.created_at DESC 
          LIMIT 
            $${nextIndex} OFFSET $${nextIndex + 1}
    `;

    const result = await this._db.query(query, [...values, limit, offset]);

    const rows = result.rows as (User & { role_name: string; permissions: unknown[]; total: number })[];
    const total = rows[0]?.total ?? "0";

    return {
      data: rows,
      total: Number(total),
      limit: Number(limit ?? 0),
    };
  }

  async getDetails(email: string) {
    const query = `
      SELECT
        users.*,
        roles.role_name
      FROM users
      JOIN roles ON users.role_id = roles.id
      WHERE users.email = $1 
        AND users.deleted_at IS NULL
    `;

    const result = await this._db.query(query, [email]);
    const user = result.rows[0] as User & {
      role_name: string;
    };

    return user;
  }

  async getUserById(uuid: string) {
    const query = `
      SELECT 
        users.*, 
        r.role_name as role_name 
      FROM users 
      JOIN roles r ON r.id = users.role_id 
      WHERE users.uuid = $1 
        AND users.deleted_at IS NULL
    `;

    const result = await this._db.query(query, [uuid]);
    const user = result.rows[0] as User & {
      role_name: string;
    };
    return user;
  }

  async updateUser(uuid: string, payload: UpdateUserBodySchema) {
    const { name, email, role_id, avatar } = payload;
    const query = `
      UPDATE 
        users 
      SET 
        updated_at = NOW(), 
        name = $1, 
        email = $2, 
        role_id = $3,
        avatar = $4
      WHERE uuid = $5 
        AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [name, email, role_id, avatar, uuid]);
    const user = result.rows[0] as User;
    return user;
  }

  async updateUserProfile(email: string, payload: UpdateProfileBodySchema) {
    const { name, avatar } = payload;
    const query = `
      UPDATE 
        users 
      SET 
        updated_at = NOW(), 
        name = $1, 
        avatar = $2
      WHERE email = $3 
        AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [name, avatar, email]);
    const user = result.rows[0] as User;
    return user;
  }

  async deleteUser(uuid: string) {
    const query = `
      UPDATE 
        users 
      SET 
        deleted_at = NOW() 
      WHERE uuid = $1 
        AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [uuid]);
    const user = result.rows[0] as User;
    return user;
  }

  async changePasswordUser(email: string, newPassword: string) {
    const query = `
      UPDATE 
        users 
      SET 
        password = $1,
        updated_at = NOW()
      WHERE email = $2
        AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [newPassword, email]);
    const user = result.rows[0] as User;
    return user;
  }
}
