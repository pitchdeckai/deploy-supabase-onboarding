#!/usr/bin/env node

/**
 * Test script to verify Stripe configuration and environment variables
 * Run with: node scripts/test-stripe-config.js
 */

const Stripe = require('stripe');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}=== Stripe Configuration Test ===${colors.reset}\n`);

// Check environment variables
function checkEnvVar(varName, isRequired = true) {
  const value = process.env[varName];
  if (value) {
    console.log(`${colors.green}✓${colors.reset} ${varName}: Set (${value.substring(0, 20)}...)`);
    return true;
  } else if (isRequired) {
    console.log(`${colors.red}✗${colors.reset} ${varName}: Not set (Required)`);
    return false;
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} ${varName}: Not set (Optional)`);
    return true;
  }
}

console.log(`${colors.blue}Checking environment variables:${colors.reset}`);
const envChecks = [
  checkEnvVar('STRIPE_SECRET_KEY'),
  checkEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  checkEnvVar('STRIPE_WEBHOOK_SECRET'),
  checkEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  checkEnvVar('NEXT_PUBLIC_APP_URL')
];

const allEnvSet = envChecks.every(Boolean);

if (!allEnvSet) {
  console.log(`\n${colors.red}Missing required environment variables!${colors.reset}`);
  console.log('Please ensure all required variables are set in your .env.local file');
  process.exit(1);
}

// Test Stripe connection if secret key is available
if (process.env.STRIPE_SECRET_KEY) {
  console.log(`\n${colors.blue}Testing Stripe API connection:${colors.reset}`);
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });

  // Test basic API connection
  stripe.accounts.list({ limit: 1 })
    .then(() => {
      console.log(`${colors.green}✓${colors.reset} Successfully connected to Stripe API`);
      
      // Check if platform account has Connect enabled
      return stripe.account.retrieve();
    })
    .then((account) => {
      console.log(`${colors.green}✓${colors.reset} Platform account ID: ${account.id}`);
      
      // Check for Connect capability
      if (account.type === 'standard') {
        console.log(`${colors.green}✓${colors.reset} Account type: Standard (Connect enabled)`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Account type: ${account.type}`);
      }
      
      console.log(`\n${colors.green}All tests passed! Your Stripe configuration is ready.${colors.reset}`);
    })
    .catch((error) => {
      console.log(`${colors.red}✗${colors.reset} Stripe API error: ${error.message}`);
      
      if (error.message.includes('Invalid API Key')) {
        console.log(`\n${colors.yellow}Tip: Make sure your STRIPE_SECRET_KEY is correct and active.${colors.reset}`);
      } else if (error.message.includes('controller')) {
        console.log(`\n${colors.yellow}Tip: The 'controller' parameter requires platform profile configuration in Stripe.${colors.reset}`);
        console.log(`Visit: https://dashboard.stripe.com/settings/connect/platform-profile${colors.reset}`);
      }
      
      process.exit(1);
    });
} else {
  console.log(`\n${colors.red}Cannot test Stripe connection without STRIPE_SECRET_KEY${colors.reset}`);
  process.exit(1);
}
