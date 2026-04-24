// Script to fix property_status enum
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixPropertyStatusEnum() {
  console.log('Fixing property_status enum...');
  
  try {
    // First check if we can query properties with pending_approval status
    const { data: pendingProperties, error: queryError } = await supabase
      .from('properties')
      .select('id, status')
      .eq('status', 'pending_approval')
      .limit(1);
    
    if (queryError) {
      console.error('Error querying properties with pending_approval status:', queryError);
      console.log('Attempting to fix the property_status enum...');
      
      // Try to update any properties with invalid status
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: 'pending' })
        .eq('status', 'pending_approval');
      
      if (updateError) {
        console.error('Error updating properties with pending_approval status:', updateError);
      } else {
        console.log('Successfully updated properties with pending_approval status to pending');
      }
    } else {
      console.log('Property status enum appears to be working correctly.');
      if (pendingProperties && pendingProperties.length > 0) {
        console.log(`Found ${pendingProperties.length} properties with pending_approval status.`);
      } else {
        console.log('No properties with pending_approval status found.');
      }
    }
  } catch (error) {
    console.error('Error fixing property_status enum:', error);
  }
}

fixPropertyStatusEnum();