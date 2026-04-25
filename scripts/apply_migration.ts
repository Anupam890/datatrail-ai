import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🐘 Connected to Postgres');

    const sqlPath = path.join(process.cwd(), 'supabase', 'update_execute_sql.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Applying migration...');
    await client.query(sql);
    console.log('✅ Migration applied successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
