// Script to create test auth users through Supabase Auth
// Run this in your Next.js app or through the Supabase dashboard

import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = 'https://qgpybicovgofmklvsyts.supabase.co'
const supabaseServiceKey = 'sbp_89765432109876543210987654321098' // Replace with your service role key

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test users that match your login page
const testUsers = [
  {
    email: 'developer@test.com',
    password: 'password123',
    user_metadata: {
      name: 'Test Developer'
    }
  },
  {
    email: 'admin@test.com',
    password: 'admin123',
    user_metadata: {
      name: 'Test Admin'
    }
  },
  {
    email: 'user@test.com',
    password: 'user123',
    user_metadata: {
      name: 'Test User'
    }
  }
]

async function createTestUsers() {
  console.log('Creating test users...')
  
  for (const user of testUsers) {
    try {
      // Create user with admin client
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: user.user_metadata,
        email_confirm: true // Skip email confirmation
      })
      
      if (error) {
        console.error(`Error creating ${user.email}:`, error.message)
      } else {
        console.log(`✅ Created user: ${user.email} (ID: ${data.user.id})`)
        
        // The trigger will automatically set up the user with appropriate roles
        console.log(`   - Trigger will set up ${user.email} with appropriate data`)
      }
    } catch (err) {
      console.error(`Failed to create ${user.email}:`, err)
    }
  }
}

// Alternative: Create users through the database (if you have direct access)
async function createTestUsersViaSQL() {
  console.log('Creating test users via SQL...')
  
  const queries = testUsers.map(user => `
    SELECT auth.create_user(
      '${user.email}',
      '${user.password}',
      '${JSON.stringify(user.user_metadata)}',
      true -- email_confirm
    );
  `).join('\n')
  
  console.log('Run this SQL in your Supabase SQL editor:')
  console.log(queries)
}

// Check existing test users
async function checkTestUsers() {
  const { data, error } = await supabase
    .from('test_user_status')
    .select('*')
  
  if (error) {
    console.error('Error checking test users:', error)
  } else {
    console.log('Test user status:')
    console.table(data)
  }
}

// Run the functions
if (typeof window === 'undefined') {
  // Node.js environment
  createTestUsers().then(() => {
    setTimeout(checkTestUsers, 2000) // Wait for triggers to complete
  })
} else {
  // Browser environment
  console.log('Test user creation functions loaded. Call createTestUsers() to create users.')
}

export { createTestUsers, checkTestUsers, createTestUsersViaSQL }
