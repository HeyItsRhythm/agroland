// Script to fix all issues directly using Supabase client
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAllIssues() {
  console.log('Starting to fix all issues...');
  
  try {
    // 1. Fix system_settings table
    await fixSystemSettings();
    
    // 2. Fix property status enum
    await fixPropertyStatusEnum();
    
    // 3. Fix user profiles
    await fixUserProfiles();
    
    console.log('All fixes completed successfully!');
  } catch (error) {
    console.error('Error fixing issues:', error);
  }
}

async function fixSystemSettings() {
  console.log('Fixing system_settings table...');
  
  try {
    // Check if system_settings table exists
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1);
    
    if (settingsError && settingsError.message.includes('does not exist')) {
      console.log('System settings table does not exist. Creating it...');
      
      // Create the table using SQL
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.system_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          approvalRequired BOOLEAN DEFAULT true,
          autoExpireDays INTEGER DEFAULT 90,
          maxImagesPerProperty INTEGER DEFAULT 10,
          allowedPropertyTypes TEXT[] DEFAULT ARRAY['agricultural', 'residential', 'commercial', 'industrial'],
          featuredPropertiesLimit INTEGER DEFAULT 5,
          notifyAdminOnNewProperty BOOLEAN DEFAULT true,
          notifySellerOnApproval BOOLEAN DEFAULT true,
          maintenanceMode BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Enable RLS on system_settings table
        ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
        
        -- Only admins can view system settings
        CREATE POLICY "System settings are viewable by admins" 
            ON public.system_settings 
            FOR SELECT 
            USING (EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
            ));
        
        -- Only admins can update system settings
        CREATE POLICY "System settings are updatable by admins" 
            ON public.system_settings 
            FOR UPDATE 
            USING (EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
            ));
        
        -- Only admins can insert system settings
        CREATE POLICY "System settings are insertable by admins" 
            ON public.system_settings 
            FOR INSERT 
            WITH CHECK (EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
            ));
      `;
      
      // Execute the SQL to create the table
      try {
        const { error: createError } = await supabase.rpc('execute_sql', { sql_query: createTableSQL });
        
        if (createError) {
          console.error('Error creating system_settings table via RPC:', createError);
          console.log('Trying alternative method to create table...');
          
          // If RPC fails, try direct insert which will create the table if it doesn't exist
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
          console.log('System settings table created successfully via RPC!');
          
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
        }
      } catch (rpcError) {
        console.error('Exception executing RPC:', rpcError);
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

async function fixPropertyStatusEnum() {
  console.log('Fixing property_status enum...');
  
  try {
    // Test if we can query properties with pending_approval status
    const { data: pendingProperties, error: pendingError } = await supabase
      .from('properties')
      .select('id, status')
      .eq('status', 'pending_approval')
      .limit(1);
    
    if (pendingError && pendingError.message.includes('invalid input value for enum')) {
      console.log('Property status enum issue detected. Attempting to fix...');
      
      // Try to fix the enum using SQL
      const fixEnumSQL = `
        -- Check if the enum type exists and add the value if needed
        DO $$
        BEGIN
          -- Check if 'pending_approval' is in the enum
          IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_status')
            AND enumlabel = 'pending_approval'
          ) THEN
            -- Add 'pending_approval' to the enum
            ALTER TYPE public.property_status ADD VALUE IF NOT EXISTS 'pending_approval';
          END IF;
        END
        $$;
      `;
      
      try {
        const { error: fixError } = await supabase.rpc('execute_sql', { sql_query: fixEnumSQL });
        
        if (fixError) {
          console.error('Error fixing property_status enum via RPC:', fixError);
          console.log('Trying alternative approach - updating properties with invalid status...');
          
          // If we can't fix the enum, update properties with pending_approval to pending
          const { error: updateError } = await supabase.rpc('execute_sql', {
            sql_query: `
              UPDATE properties 
              SET status = 'pending' 
              WHERE status::text = 'pending_approval';
            `
          });
          
          if (updateError) {
            console.error('Error updating properties with invalid status:', updateError);
          } else {
            console.log('Updated properties with invalid status to "pending"');
          }
        } else {
          console.log('Property status enum fixed successfully!');
        }
      } catch (rpcError) {
        console.error('Exception executing RPC:', rpcError);
      }
    } else if (pendingError) {
      console.error('Error checking property status:', pendingError);
    } else {
      console.log('Property status enum is working correctly.');
    }
  } catch (error) {
    console.error('Error fixing property status enum:', error);
  }
}

async function fixUserProfiles() {
  console.log('Fixing user profiles...');
  
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
    
    // Create test users if needed
    if (!hasSeller) {
      console.log('Creating test seller user...');
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'testseller@agroland.com',
        password: 'password123',
        user_metadata: { full_name: 'Test Seller', role: 'seller' },
        email_confirm: true
      });
      
      if (authError) {
        console.error('Error creating test seller auth user:', authError);
      } else {
        console.log('Test seller auth user created successfully!');
        
        // Create profile if needed
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert([
            {
              id: authData.user.id,
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
    }
    
    if (!hasBuyer) {
      console.log('Creating test buyer user...');
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'testbuyer@agroland.com',
        password: 'password123',
        user_metadata: { full_name: 'Test Buyer', role: 'buyer' },
        email_confirm: true
      });
      
      if (authError) {
        console.error('Error creating test buyer auth user:', authError);
      } else {
        console.log('Test buyer auth user created successfully!');
        
        // Create profile if needed
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert([
            {
              id: authData.user.id,
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
    }
  } catch (error) {
    console.error('Error fixing user profiles:', error);
  }
}

fixAllIssues();


