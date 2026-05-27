import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false,
  },
});

db.on('connect', () => {
  console.log('[DATABASE] Connected to Supabase PostgreSQL successfully');
});

db.on('error', (err) => {
  console.error('[DATABASE] Unexpected error on idle client', err);
  process.exit(-1);
});
