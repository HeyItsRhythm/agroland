require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
// User can provide MONGODB_URI in .env or as first argument
const mongoUri = process.env.MONGODB_URI || process.argv[2];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

if (!mongoUri) {
  console.error('Missing MongoDB connection string. Please add MONGODB_URI to .env or pass it as an argument.');
  console.error('Usage: node scripts/node/migrate_to_mongo.js <mongodb_uri>');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const client = new MongoClient(mongoUri);

// Known tables to migrate if dynamic discovery fails
const KNOWN_TABLES = [
  'user_profiles',
  'users',
  'properties',
  'contact_messages',
  'system_settings',
  'press_releases',
  'inquiries',
  'favorites',
  'notifications'
];

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(); // Uses the database defined in the URI

    // 1. Discover tables
    let tables = [];
    console.log('Discovering Supabase tables...');
    
    try {
      // Try to list tables using a common method if stored proc exists, 
      // otherwise fallback to known tables.
      // Note: standard supabase client doesn't list tables easily without specific permissions or helper functions.
      // We will try a likely table discovery query if the rpc exists (as seen in check-database.js)
       const { data: tablesData, error: tablesError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `
      });

      if (!tablesError && tablesData) {
        tables = tablesData.map(t => t.table_name);
        console.log('Found tables via RPC:', tables);
      } else {
        throw new Error('RPC not available');
      }
    } catch (e) {
      console.log('Could not dynamically list tables (RPC might be missing/restricted). Using fallback list.');
      // Verify which known tables actually exist
      for (const table of KNOWN_TABLES) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (!error) {
          tables.push(table);
        }
      }
      console.log('Verified existing tables:', tables);
    }

    if (tables.length === 0) {
      console.error('No tables found to migrate.');
      process.exit(1);
    }

    // 2. Migrate each table
    for (const table of tables) {
      console.log(`\nMigrating table: ${table}...`);
      
      // Fetch all data (paginate if necessary, but for simplicity assuming fits in memory or single batch for now)
      // Supabase defaults to 1000 rows. We need to paginate.
      let allRows = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          console.error(`Error fetching data from ${table}:`, error.message);
          break;
        }

        if (data.length > 0) {
          allRows = allRows.concat(data);
          page++;
          if (data.length < pageSize) hasMore = false;
        } else {
          hasMore = false;
        }
      }

      console.log(`Fetched ${allRows.length} rows from ${table}.`);

      if (allRows.length > 0) {
        const collection = db.collection(table);
        // Optional: clear existing data? request says "convert", implies fresh start or overwrite.
        // Let's drop and recreate to be clean, or just insert. 
        // Dropping is safer for a "convert" task to avoid duplicates if run multiple times.
        await collection.deleteMany({}); 
        
        const result = await collection.insertMany(allRows);
        console.log(`Inserted ${result.insertedCount} documents into MongoDB collection '${table}'.`);
      } else {
        console.log(`Skipping insert for ${table} (empty).`);
      }
    }

    console.log('\nMigration completed successfully!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.close();
  }
}

migrate();
