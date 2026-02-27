require('dotenv').config({ path: '../../fafbe/faf-backend/.env' });
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function run() {
  try {
    const sql = fs.readFileSync('../../fafbe/faf-backend/migrations/add_social_features.sql', 'utf8');
    await pool.query(sql);
    console.log('Migration ADD SOCIAL FEATURES executed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

run();
