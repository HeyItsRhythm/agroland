/*
  Apply pending SQL fixes in scripts/sql to the database via Supabase RPC helper 'execute_sql'.
  Requires .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (service role key recommended).
*/
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyMigrations() {
  const sqlDir = path.join(process.cwd(), 'scripts', 'sql');
  console.log(`Applying SQL files from ${sqlDir}...`);

  const files = fs
    .readdirSync(sqlDir)
    .filter((f) => f.toLowerCase().endsWith('.sql'))
    .sort();

  for (const file of files) {
    const fullPath = path.join(sqlDir, file);
    const sql = fs.readFileSync(fullPath, 'utf8');
    console.log(`\n--- Executing ${file} ---`);
    try {
      const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
      if (error) {
        console.error(`Error executing ${file}:`, error);
      } else {
        console.log(`Executed ${file} successfully.`);
      }
    } catch (err) {
      console.error(`Exception executing ${file}:`, err);
    }
  }
  console.log('\nDone.');
}

applyMigrations();


