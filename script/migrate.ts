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
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Run migrations in order

    console.log('🔄 Running migrations...');
    
    for (const file of files) {
      console.log(`  📄 Executing: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
      console.log(`  ✅ Completed: ${file}`);
    }
    
    console.log('✅ All migrations completed successfully!');
    console.log('📊 Tables: students, modules, quiz_results');
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
