#!/usr/bin/env node

/**
 * Test script to verify authentication is working
 * Run with: node scripts/test-auth.js
 */

const https = require('https');
const http = require('http');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}=== Authentication System Test ===${colors.reset}\n`);

// Test if server is running
function testServerConnection() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      console.log(`${colors.green}✓${colors.reset} Server is running on port 3000`);
      console.log(`  Status: ${res.statusCode}`);
      resolve(true);
    });

    req.on('error', (error) => {
      console.log(`${colors.red}✗${colors.reset} Server is not responding on port 3000`);
      console.log(`  Error: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`${colors.red}✗${colors.reset} Server connection timed out`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test auth endpoints
async function testAuthEndpoints() {
  const endpoints = [
    { path: '/auth/login', name: 'Login Page' },
    { path: '/auth/sign-up', name: 'Sign Up Page' },
    { path: '/developer/dashboard', name: 'Dashboard (should redirect)' }
  ];

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, endpoint.name);
  }
}

function testEndpoint(path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓${colors.reset} ${name}: OK (${res.statusCode})`);
      } else if (res.statusCode === 307 || res.statusCode === 302) {
        console.log(`${colors.yellow}→${colors.reset} ${name}: Redirect (${res.statusCode}) to ${res.headers.location}`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} ${name}: Status ${res.statusCode}`);
      }
      resolve(true);
    });

    req.on('error', (error) => {
      console.log(`${colors.red}✗${colors.reset} ${name}: Failed`);
      console.log(`  Error: ${error.message}`);
      resolve(false);
    });

    req.end();
  });
}

// Check environment variables
function checkEnvVars() {
  console.log(`\n${colors.blue}Checking Supabase Configuration:${colors.reset}`);
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl) {
    console.log(`${colors.green}✓${colors.reset} NEXT_PUBLIC_SUPABASE_URL is set`);
    console.log(`  URL: ${supabaseUrl}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} NEXT_PUBLIC_SUPABASE_URL is not set`);
  }
  
  if (supabaseKey) {
    console.log(`${colors.green}✓${colors.reset} NEXT_PUBLIC_SUPABASE_ANON_KEY is set`);
    console.log(`  Key: ${supabaseKey.substring(0, 20)}...`);
  } else {
    console.log(`${colors.red}✗${colors.reset} NEXT_PUBLIC_SUPABASE_ANON_KEY is not set`);
  }
}

// Main test flow
async function runTests() {
  // Test server connection
  const serverRunning = await testServerConnection();
  
  if (!serverRunning) {
    console.log(`\n${colors.yellow}Tip: Make sure the dev server is running with 'npm run dev'${colors.reset}`);
    process.exit(1);
  }
  
  // Test auth endpoints
  console.log(`\n${colors.blue}Testing Authentication Endpoints:${colors.reset}`);
  await testAuthEndpoints();
  
  // Check environment
  checkEnvVars();
  
  console.log(`\n${colors.green}Authentication system test complete!${colors.reset}`);
  console.log(`\n${colors.blue}Next Steps:${colors.reset}`);
  console.log("1. Visit http://localhost:3000/auth/login to test login");
  console.log("2. Visit http://localhost:3000/auth/sign-up to create an account");
  console.log("3. Check browser console for any client-side errors");
}

// Run the tests
runTests().catch(console.error);
