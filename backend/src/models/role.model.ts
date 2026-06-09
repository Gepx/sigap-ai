import type {
  CreateRoleQuery,
  UpdateRolePermissionQuery,
} from "../schemas/role.schema.js";
import type { Role } from "../types/role.type.js";
import {
  createQueryParams,
  type PaginationInterfaceHelper,
} from "../utils/queryHelper.js";
import { BaseModel } from "./base.model.js";

export interface JoinedRolePermission {
  route: string;
  uuid: string;
  permission_name: string;
}

export interface UserPermission {
  route: string;
  method: string[];
}

export interface UserRoleWithPermission extends Role {
  permissions: UserPermission[];
}

export interface RoleWithPermissions extends Role {
  permissions: JoinedRolePermission[];
  total: number;
}

export interface UserRoleWithMenus {
  menus: string[];
}

export class RoleModel extends BaseModel {
  async findRoleByName(role_name: string) {
    const result = await this._db.query(
      `SELECT * FROM roles WHERE role_name = $1`,
      [role_name],
    );
    return result.rows[0] as Role;
  }

  async getDetails(uuid: string) {
    const query = `SELECT * FROM roles WHERE uuid = $1`;
    const result = await this._db.query(query, [uuid]);
    return result.rows[0] as Role;
  }

  async createRole(payload: CreateRoleQuery) {
    const query = `
      WITH new_role AS (
        INSERT INTO roles (role_name)
        VALUES ($1)
        RETURNING *
      ),
      insert_permissions AS (
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT new_role.id, unnest($2::bigint[])
        FROM new_role
      )
      SELECT * FROM new_role;
    `;

    const result = await this._db.query(query, [
      payload.role_name,
      payload.permissions,
    ]);
    return result.rows[0] as Role;
  }

  async getRoles(q: PaginationInterfaceHelper) {
    const { limit = 10, page = 1, ...filters } = q;
    const offset = (page - 1) * limit;

    const { conditions, values, nextIndex } = createQueryParams(filters);

    const query = `
      SELECT 
        r.*, 
        COUNT(*) OVER() AS total,
        COALESCE(
          json_agg(
            json_build_object(
              'route', p.route,
              'uuid', p.uuid,
              'is_menu', p.is_menu,
              'permission_name', p.permission_name
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      LEFT JOIN permissions p ON p.id = rp.permission_id
      WHERE TRUE ${conditions}
      GROUP BY r.id
      ORDER BY r.role_name ASC
      LIMIT $${nextIndex} OFFSET $${nextIndex + 1}
    `;

    const result = await this._db.query(query, [...values, limit, offset]);
    const rows = result.rows as RoleWithPermissions[];
    const total = rows[0]?.total ?? "0";
    return {
      data: rows,
      total: Number(total),
      limit: Number(limit ?? 0),
    };
  }

  async updateRolePermission(uuid: string, payload: UpdateRolePermissionQuery) {
    const { permissions, role_name } = payload;
    const query = `
      WITH updated_role AS (
        UPDATE roles
        SET role_name = $1
        WHERE uuid = $3
        RETURNING *
      ),
      delete_old_permissions AS (
        DELETE FROM role_permissions
        WHERE role_id = (SELECT id FROM updated_role)
      ),
      insert_new_permissions AS (
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT updated_role.id, unnest($2::bigint[])
        FROM updated_role
      )
      SELECT * FROM updated_role;
    `;
    const result = await this._db.query(query, [role_name, permissions, uuid]);
    return result.rows[0] as Role;
  }

  async deleteRole(uuid: string) {
    const query = `
      DELETE FROM roles
      WHERE uuid = $1
      RETURNING *
    `;
    const result = await this._db.query(query, [uuid]);
    return result.rows[0] as Role;
  }

  async getRolePermissionById(id: number) {
    const query = `
    SELECT
        r.*,
        COALESCE(
          json_agg(
            json_build_object(
              'route', p.route,
              'method', to_json(p.method)
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS permissions
      FROM
        roles r
      LEFT JOIN
        role_permissions rp ON rp.role_id = r.id
      LEFT JOIN
        permissions p ON p.id = rp.permission_id AND p.is_menu = false
      WHERE
        r.id = $1
      GROUP BY
        r.id;
    `;
    const result = await this._db.query(query, [id]);
    return result.rows[0] as UserRoleWithPermission;
  }

  async getRoleMenusById(id: number) {
    const query = `
    SELECT
      COALESCE(
        json_agg(p.route) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS menus
    FROM
      roles r
    LEFT JOIN
      role_permissions rp ON rp.role_id = r.id
    LEFT JOIN
      permissions p ON p.id = rp.permission_id AND p.is_menu = true
    WHERE
      r.id = $1
    GROUP BY
      r.id;
    `;

    const result = await this._db.query(query, [id]);
    return result.rows[0] as UserRoleWithMenus;
  }
}
