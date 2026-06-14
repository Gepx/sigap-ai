import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// const pool = new Pool({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: Number(process.env.DATABASE_PORT),
//   ssl: { rejectUnauthorized: false },
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to Supabase!");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export { pool };
export default connectDB;
