// Simple script to run SQL against Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('Connecting to Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

// Since Supabase doesn't allow direct SQL execution via the JS client,
// we need to use the Supabase Dashboard SQL Editor or the CLI.
// This script will just verify the connection works.

async function testConnection() {
  try {
    // Test the connection by checking if tables exist
    const { data, error } = await supabase.from('developers').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log(`Found ${data} developers in the database.`);
    
    console.log('\n📝 To run the SQL migration:');
    console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qgpybicovgofmklvsyts/sql/new');
    console.log('2. Copy the contents of scripts/003_enhance_for_platform_fees.sql');
    console.log('3. Paste and run it in the SQL Editor');
    console.log('\nOr use the Supabase CLI if you have it installed.');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

testConnection();
