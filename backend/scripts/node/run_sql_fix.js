// Script to run SQL fix
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSqlFix() {
  console.log('Running SQL fixes...');
  
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('./fix_all_issues.sql', 'utf8');
    
    // Split the SQL into separate statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt.length === 0) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Execute the SQL statement
        const { error } = await supabase.rpc('execute_sql', { sql_query: stmt });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
        }
      } catch (stmtError) {
        console.error(`Exception executing statement ${i + 1}:`, stmtError);
      }
    }
    
    console.log('SQL fixes completed.');
    
    // Now let's check if the system_settings table exists
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1);
    
    if (settingsError) {
      console.error('Error checking system_settings table:', settingsError);
      console.log('Creating system_settings table manually...');
      
      // Try to create the table and insert default settings manually
      const { error: insertError } = await supabase
        .from('system_settings')
        .insert([
          {
            approvalRequired: true,
            autoExpireDays: 90,
            maxImagesPerProperty: 10,
            allowedPropertyTypes: ['agricultural', 'residential', 'commercial', 'industrial'],
            featuredPropertiesLimit: 5,
            notifyAdminOnNewProperty: true,
            notifySellerOnApproval: true,
            maintenanceMode: false
          }
        ]);
      
      if (insertError) {
        console.error('Error inserting default settings:', insertError);
      } else {
        console.log('Default settings inserted successfully!');
      }
    } else {
      console.log('System settings table exists and contains data.');
    }
    
    // Check user profiles
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .limit(10);
    
    if (profilesError) {
      console.error('Error checking user profiles:', profilesError);
    } else {
      console.log(`Found ${userProfiles.length} user profiles.`);
      
      // Log the roles distribution
      const roleCounts = userProfiles.reduce((acc, profile) => {
        acc[profile.role] = (acc[profile.role] || 0) + 1;
        return acc;
      }, {});
      
      console.log('Role distribution:');
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`- ${role}: ${count}`);
      });
    }
    
  } catch (error) {
    console.error('Error running SQL fixes:', error);
  }
}

runSqlFix();