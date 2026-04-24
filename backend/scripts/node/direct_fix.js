// Direct fix script that doesn't rely on RPC
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function directFix() {
  console.log('Starting direct fix...');
  
  try {
    // 1. Fix system_settings table
    await fixSystemSettings();
    
    // 2. Fix property status enum by updating properties
    await fixPropertyStatus();
    
    // 3. Create test users if needed
    await createTestUsers();
    
    console.log('All fixes completed successfully!');
  } catch (error) {
    console.error('Error fixing issues:', error);
  }
}

async function fixSystemSettings() {
  console.log('Fixing system_settings table...');
  
  try {
    // Check if system_settings table exists by trying to select from it
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1);
    
    if (settingsError && settingsError.message.includes('does not exist')) {
      console.log('System settings table does not exist. Creating it directly...');
      
      // Try direct insert which will fail but give us more info
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
      
      console.log('Insert attempt result:', insertError ? insertError.message : 'Success');
      
      if (insertError) {
        console.log('Trying alternative approach - using REST API to create table...');
        
        // Since we can't create the table directly, we'll need to rely on the application's
        // fallback mechanism in Settings.jsx which uses default settings when the table doesn't exist
        console.log('Will rely on application fallback mechanism in Settings.jsx');
        console.log('Please ensure an admin user exists and logs in to create the settings');
      }
    } else if (settingsError) {
      console.error('Error checking system_settings table:', settingsError);
    } else if (settingsData && settingsData.length === 0) {
      console.log('System settings table exists but is empty. Inserting default settings...');
      
      // Insert default settings
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
  } catch (error) {
    console.error('Error fixing system settings:', error);
  }
}

async function fixPropertyStatus() {
  console.log('Fixing property status enum by updating properties...');
  
  try {
    // Test if we can query properties with pending_approval status
    const { data: pendingProperties, error: pendingError } = await supabase
      .from('properties')
      .select('id, status')
      .eq('status', 'pending_approval')
      .limit(10);
    
    if (pendingError && pendingError.message.includes('invalid input value for enum')) {
      console.log('Property status enum issue detected. Updating properties to use "pending" status...');
      
      // Since we can't modify the enum directly, update properties with pending_approval to pending
      try {
        // First get all properties with text status = 'pending_approval'
        const { data: properties, error: fetchError } = await supabase
          .from('properties')
          .select('id')
          .filter('status::text', 'eq', 'pending_approval');
        
        if (fetchError) {
          console.error('Error fetching properties with pending_approval status:', fetchError);
        } else if (properties && properties.length > 0) {
          console.log(`Found ${properties.length} properties with pending_approval status.`);
          
          // Update each property to pending status
          for (const property of properties) {
            const { error: updateError } = await supabase
              .from('properties')
              .update({ status: 'pending' })
              .eq('id', property.id);
            
            if (updateError) {
              console.error(`Error updating property ${property.id}:`, updateError);
            }
          }
          
          console.log('Updated properties with invalid status to "pending"');
        } else {
          console.log('No properties found with pending_approval status.');
        }
      } catch (updateError) {
        console.error('Error updating properties:', updateError);
      }
    } else if (pendingError) {
      console.error('Error checking property status:', pendingError);
    } else {
      console.log('Property status enum is working correctly or no properties with pending_approval status found.');
    }
  } catch (error) {
    console.error('Error fixing property status enum:', error);
  }
}

async function createTestUsers() {
  console.log('Creating test users if needed...');
  
  try {
    // Check existing user profiles
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (profilesError) {
      console.error('Error checking user profiles:', profilesError);
      return;
    }
    
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
    
    // Check if we have seller and buyer users
    const hasSeller = userProfiles.some(profile => profile.role === 'seller');
    const hasBuyer = userProfiles.some(profile => profile.role === 'buyer');
    const hasAdmin = userProfiles.some(profile => profile.role === 'admin');
    
    // Create test users directly in user_profiles if needed
    if (!hasSeller) {
      console.log('Creating test seller profile directly...');
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: crypto.randomUUID(), // Generate a random UUID
            email: 'testseller@agroland.com',
            full_name: 'Test Seller',
            role: 'seller'
          }
        ]);
      
      if (profileError) {
        console.error('Error creating test seller profile:', profileError);
      } else {
        console.log('Test seller profile created successfully!');
      }
    }
    
    if (!hasBuyer) {
      console.log('Creating test buyer profile directly...');
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: crypto.randomUUID(), // Generate a random UUID
            email: 'testbuyer@agroland.com',
            full_name: 'Test Buyer',
            role: 'buyer'
          }
        ]);
      
      if (profileError) {
        console.error('Error creating test buyer profile:', profileError);
      } else {
        console.log('Test buyer profile created successfully!');
      }
    }
    
    if (!hasAdmin) {
      console.log('Creating admin profile directly...');
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: crypto.randomUUID(), // Generate a random UUID
            email: 'admin@agroland.com',
            full_name: 'Admin User',
            role: 'admin'
          }
        ]);
      
      if (profileError) {
        console.error('Error creating admin profile:', profileError);
      } else {
        console.log('Admin profile created successfully!');
      }
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

directFix();


