// Script to create system_settings table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createSystemSettingsTable() {
  console.log('Creating system_settings table...');
  
  try {
    // Create the table using SQL query
    const { error: createTableError } = await supabase
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

    if (createTableError) {
      if (createTableError.code === '42P01') {
        console.error('Table does not exist. Creating table first...');
        
        // Create the table structure first
        const { error: sqlError } = await supabase.rpc('create_system_settings_table');
        
        if (sqlError) {
          console.error('Error creating table:', sqlError);
          return;
        }
        
        // Try inserting again
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
          console.error('Error inserting default settings after table creation:', insertError);
        } else {
          console.log('System settings table created and default settings inserted successfully!');
        }
      } else {
        console.error('Error inserting default settings:', createTableError);
      }
    } else {
      console.log('Default system settings inserted successfully!');
    }
  } catch (error) {
    console.error('Error creating system_settings table:', error);
  }
}

createSystemSettingsTable();


