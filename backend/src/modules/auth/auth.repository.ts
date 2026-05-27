import { db } from '../../config/db.js';

export class AuthRepository {
  async findUserByEmail(email: string) {
    const query = `
      SELECT u.id, u.uuid, u.email, u.password, u.role_id, r.role_name 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  async createUser(userData: any) {
    const query = `
      INSERT INTO users (name, email, password, business_name, business_type, role_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, uuid, email, name;
    `;
    const values = [
      userData.name, 
      userData.email, 
      userData.password, 
      userData.business_name, 
      userData.business_type, 
      userData.role_id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}
