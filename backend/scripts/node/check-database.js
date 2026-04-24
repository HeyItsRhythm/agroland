// Script to check database tables and user profiles
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('Checking database tables and user profiles...');
  
  try {
    // Check if system_settings table exists
    console.log('\nChecking system_settings table...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1);
    
    if (settingsError) {
      console.error('Error accessing system_settings table:', settingsError.message);
      if (settingsError.message.includes('relation "public.system_settings" does not exist')) {
        console.log('The system_settings table does not exist. Need to run migrations.');
      }
    } else {
      console.log('system_settings table exists:', settingsData);
    }

    // Check if user_profiles table exists
    console.log('\nChecking user_profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error accessing user_profiles table:', profilesError.message);
      if (profilesError.message.includes('relation "public.user_profiles" does not exist')) {
        console.log('The user_profiles table does not exist. Need to run migrations.');
      }
    } else {
      console.log(`user_profiles table exists with ${profilesData.length} users:`);
      profilesData.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
    }

    // List all tables in the public schema
    console.log('\nListing all tables in public schema...');
    const { data: tablesData, error: tablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
    });

    if (tablesError) {
      console.error('Error listing tables:', tablesError.message);
    } else {
      console.log('Tables in public schema:');
      tablesData.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }

  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase();


