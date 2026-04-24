// Script to fix user management issues
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUserManagement() {
  console.log('Fixing user management issues...');
  
  try {
    // Check if we can query all user profiles
    const { data: userProfiles, error: queryError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .order('created_at', { ascending: false });
    
    if (queryError) {
      console.error('Error querying user profiles:', queryError);
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
      
      // Check if we have any non-admin users
      const nonAdminUsers = userProfiles.filter(profile => profile.role !== 'admin');
      if (nonAdminUsers.length === 0) {
        console.log('No non-admin users found. Creating test users...');
        
        // Create test users with different roles
        const testUsers = [
          { email: 'seller1@example.com', password: 'password123', role: 'seller', full_name: 'Test Seller 1' },
          { email: 'buyer1@example.com', password: 'password123', role: 'buyer', full_name: 'Test Buyer 1' }
        ];
        
        for (const testUser of testUsers) {
          try {
            // Create auth user
            const { data: authUser, error: authError } = await supabase.auth.signUp({
              email: testUser.email,
              password: testUser.password,
              options: {
                data: {
                  full_name: testUser.full_name,
                  role: testUser.role
                }
              }
            });
            
            if (authError) {
              console.error(`Error creating ${testUser.email}:`, authError.message);
              continue;
            }
            
            // Create user profile
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: authUser.user.id,
                email: testUser.email,
                full_name: testUser.full_name,
                role: testUser.role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            
            if (profileError) {
              console.error(`Error creating profile for ${testUser.email}:`, profileError.message);
            } else {
              console.log(`Created test user ${testUser.email} with role ${testUser.role}`);
            }
          } catch (error) {
            console.error(`Error creating test user ${testUser.email}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fixing user management:', error);
  }
}

fixUserManagement();


