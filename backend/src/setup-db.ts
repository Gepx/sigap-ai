import { db } from './config/db.js';

async function main() {
  try {
    console.log("[SETUP] Creating tables in Supabase...");

    // 1. Create permissions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id BIGSERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid(),
        permission_name TEXT NOT NULL,
        route TEXT NOT NULL,
        method TEXT[] NOT NULL,
        is_menu BOOLEAN DEFAULT false
      );
    `);
    console.log("- Created table 'permissions'");

    // 2. Create roles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id BIGSERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid(),
        role_name TEXT NOT NULL,
        permission_id INT8[]
      );
    `);
    console.log("- Created table 'roles'");

    // 3. Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        business_name TEXT,
        business_type TEXT,
        role_id INT8 REFERENCES roles(id)
      );
    `);
    console.log("- Created table 'users'");

    // Seed default roles and permissions
    console.log("[SETUP] Seeding default data...");

    // Insert permissions
    const perm1 = await db.query(`
      INSERT INTO permissions (permission_name, route, method, is_menu)
      VALUES ('Read Auth', '/api/auth/profile', '{"GET"}', true)
      RETURNING id;
    `);
    const permId = perm1.rows[0].id;

    // Insert roles (Admin with ID 1, User with ID 2)
    // We force the IDs so they match our logic
    await db.query(`
      INSERT INTO roles (id, role_name, permission_id)
      VALUES 
        (1, 'Admin', ARRAY[${permId}]::int8[]),
        (2, 'Standard User', ARRAY[]::int8[])
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("- Seeded default roles 'Admin' (1) and 'Standard User' (2)");

    console.log("[SETUP] Database tables and seed data created successfully!");
  } catch (err) {
    console.error("[SETUP] Error setting up database:", err);
  } finally {
    await db.end();
  }
}

main();
