import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🔄 Running migration...');
    const sql = fs.readFileSync(path.join(__dirname, '../migrations/0001_initial.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('📊 Tables created: students, modules, quiz_results');
  } catch (err) {
    console.error('❌ Migration error:', err);
    throw err;
  } finally {
    await pool.end();
  }
}

runMigration().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
