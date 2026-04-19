import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

async function checkTables() {
  const client = new Client({ connectionString });
  await client.connect();
  
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  
  console.log("Tables in public schema:");
  res.rows.forEach(row => console.log(`- ${row.table_name}`));
  
  await client.end();
}

checkTables();
