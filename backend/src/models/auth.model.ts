import type { RegisterSchema } from "../schemas/auth.schema.js";
import type { User } from "../types/user.type.js";
import { BaseModel } from "./base.model.js";

export class AuthModel extends BaseModel {
  async createUser(payload: RegisterSchema) {
    const query = `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await this._db.query(query, [
      payload.name,
      payload.email,
      payload.password,
      payload.role_id,
    ]);

    const user = result.rows[0] as User;
    return user;
  }

  async findUser(email: string) {
    const query = `SELECT users.*, r.role_name as role_name FROM users JOIN roles r ON r.id = users.role_id WHERE users.email = $1 AND users.deleted_at IS NULL`;
    const result = await this._db.query(query, [email]);
    const user = result.rows[0] as User & { role_name: string };
    return user;
  }

  async updatePassword(email: string, hashedPassword: string) {
    const query = `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`;
    const result = await this._db.query(query, [hashedPassword, email]);
    const user = result.rows[0] as User;
    return user;
  }

  async updateVerificationCode(email: string, code: string, expiresAt: Date) {
    const query = `UPDATE users SET verification_code = $1, verification_code_expires_at = $2 WHERE email = $3 RETURNING *`;
    const result = await this._db.query(query, [code, expiresAt, email]);
    return result.rows[0] as User;
  }

  async verifyUser(email: string) {
    const query = `UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_code_expires_at = NULL WHERE email = $1 RETURNING *`;
    const result = await this._db.query(query, [email]);
    return result.rows[0] as User;
  }
}
