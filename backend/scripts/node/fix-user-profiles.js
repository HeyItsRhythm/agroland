// Script to fix user profiles
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUserProfiles() {
  console.log('Fixing user profiles...');
  
  try {
    // Get all auth users
    console.log('\nFetching auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError.message);
      console.log('Note: You need admin access to list all users. Creating test users instead.');
      
      // Create test users if we can't list existing users
      await createTestUsers();
      return;
    }
    
    console.log(`Found ${authUsers.users.length} auth users`);
    
    // Get all user profiles
    console.log('\nFetching user profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError.message);
      return;
    }
    
    console.log(`Found ${profiles.length} user profiles`);
    
    // Find users without profiles
    const profileIds = profiles.map(profile => profile.id);
    const usersWithoutProfiles = authUsers.users.filter(user => !profileIds.includes(user.id));
    
    console.log(`Found ${usersWithoutProfiles.length} users without profiles`);
    
    // Create profiles for users without them
    if (usersWithoutProfiles.length > 0) {
      console.log('\nCreating missing user profiles...');
      
      for (const user of usersWithoutProfiles) {
        const profileData = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: user.user_metadata?.role || 'buyer',
          phone: user.user_metadata?.mobile || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single();
        
        if (createError) {
          console.error(`Error creating profile for ${user.email}:`, createError.message);
        } else {
          console.log(`Created profile for ${user.email} with role ${newProfile.role}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error fixing user profiles:', error);
  }
}

async function createTestUsers() {
  console.log('\nCreating test users...');
  
  const testUsers = [
    { email: 'seller1@example.com', password: 'password123', role: 'seller', name: 'Test Seller 1' },
    { email: 'seller2@example.com', password: 'password123', role: 'seller', name: 'Test Seller 2' },
    { email: 'buyer1@example.com', password: 'password123', role: 'buyer', name: 'Test Buyer 1' }
  ];
  
  for (const user of testUsers) {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.name,
            role: user.role
          }
        }
      });
      
      if (error) {
        console.error(`Error creating ${user.email}:`, error.message);
        continue;
      }
      
      console.log(`Created auth user ${user.email}`);
      
      // Create user profile
      const profileData = {
        id: data.user.id,
        email: user.email,
        full_name: user.name,
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData);
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`Created profile for ${user.email}`);
      }
      
    } catch (error) {
      console.error(`Error creating test user ${user.email}:`, error);
    }
  }
}

fixUserProfiles();


