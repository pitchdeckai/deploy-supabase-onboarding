// Test User Credentials for Development
// Use these credentials for testing different user flows

export const TEST_USERS = {
  // Fully onboarded developer with admin privileges
  COMPLETE_DEVELOPER: {
    email: 'evil.pocket.money@gmail.com',
    name: 'Sam Smith',
    role: 'developer',
    adminRole: 'admin',
    business: 'Smith Tech Solutions',
    stripeAccountId: 'acct_test_complete_dev',
    onboardingComplete: true,
    paymentsEnabled: true,
    payoutsEnabled: true,
    features: ['products', 'subscriptions', 'payouts', 'analytics']
  },

  // Partially onboarded developer  
  PARTIAL_DEVELOPER: {
    email: 'penix83288@evoxury.com',
    name: 'Test Developer',
    role: 'developer',
    business: 'Test Dev Company',
    stripeAccountId: 'acct_test_partial_dev',
    onboardingComplete: false,
    paymentsEnabled: true,
    payoutsEnabled: false,
    pendingRequirements: ['business_profile.url', 'external_account'],
    features: ['products', 'subscriptions']
  },

  // Super administrator
  SUPER_ADMIN: {
    email: 'pitchdeck.official@gmail.com',
    name: 'John Doe',
    role: 'admin',
    adminRole: 'super_admin',
    permissions: ['all'],
    features: ['admin_panel', 'user_management', 'platform_analytics', 'audit_logs']
  },

  // New developer (pending onboarding)
  NEW_DEVELOPER: {
    email: 'newdev@example.com',
    name: 'New Developer',
    role: 'developer',
    business: 'Startup Inc',
    onboardingComplete: false,
    paymentsEnabled: false,
    payoutsEnabled: false,
    pendingRequirements: ['business_profile', 'external_account', 'tos_acceptance'],
    features: []
  }
};

export const TEST_CUSTOMERS = {
  CUSTOMER_1: {
    email: 'customer1@example.com',
    name: 'John Customer',
    stripeCustomerId: 'cus_test_customer_1',
    subscription: 'SaaS Basic Plan',
    monthlyAmount: 29.99,
    status: 'active'
  },
  CUSTOMER_2: {
    email: 'customer2@example.com',
    name: 'Jane Customer',
    stripeCustomerId: 'cus_test_customer_2',
    subscription: 'SaaS Pro Plan',
    monthlyAmount: 99.99,
    status: 'active'
  },
  CUSTOMER_3: {
    email: 'customer3@example.com',
    name: 'Bob Customer',
    stripeCustomerId: 'cus_test_customer_3',
    subscription: 'Mobile App Premium',
    monthlyAmount: 19.99,
    status: 'active'
  }
};

export const TEST_PRODUCTS = {
  SAAS_BASIC: {
    id: 'prod_test_saas_basic',
    name: 'SaaS Basic Plan',
    price: 2999, // cents
    interval: 'month',
    developer: 'evil.pocket.money@gmail.com'
  },
  SAAS_PRO: {
    id: 'prod_test_saas_pro',
    name: 'SaaS Pro Plan',
    price: 9999, // cents
    interval: 'month',
    developer: 'evil.pocket.money@gmail.com'
  },
  MOBILE_PREMIUM: {
    id: 'prod_test_app_premium',
    name: 'Mobile App Premium',
    price: 1999, // cents
    interval: 'month',
    developer: 'penix83288@evoxury.com'
  }
};

// Helper functions for testing
export const getTestUserByRole = (role) => {
  return Object.values(TEST_USERS).find(user => user.role === role);
};

export const getTestUserByEmail = (email) => {
  return Object.values(TEST_USERS).find(user => user.email === email);
};

export const isTestUser = (email) => {
  return Object.values(TEST_USERS).some(user => user.email === email);
};

// Test scenarios for different user flows
export const TEST_SCENARIOS = {
  COMPLETE_DEVELOPER_LOGIN: {
    user: TEST_USERS.COMPLETE_DEVELOPER,
    expectedFeatures: ['dashboard', 'products', 'customers', 'payouts', 'settings'],
    expectedData: {
      products: 2,
      activeSubscriptions: 2,
      monthlyRevenue: 12998, // cents
      availablePayout: 11400 // cents after fees
    }
  },

  PARTIAL_DEVELOPER_LOGIN: {
    user: TEST_USERS.PARTIAL_DEVELOPER,
    expectedFeatures: ['dashboard', 'products', 'customers', 'onboarding'],
    expectedData: {
      products: 1,
      activeSubscriptions: 1,
      monthlyRevenue: 1999, // cents
      payoutBlocked: true
    }
  },

  ADMIN_LOGIN: {
    user: TEST_USERS.SUPER_ADMIN,
    expectedFeatures: ['admin_panel', 'developers', 'analytics', 'audit_logs'],
    expectedData: {
      totalDevelopers: 4,
      totalRevenue: 14997, // cents
      platformFees: 650 // cents
    }
  },

  NEW_USER_ONBOARDING: {
    user: TEST_USERS.NEW_DEVELOPER,
    expectedFeatures: ['onboarding'],
    expectedData: {
      onboardingStep: 1,
      requiredFields: ['business_profile', 'external_account', 'tos_acceptance']
    }
  }
};

console.log('Test user credentials loaded. Available users:');
console.table(Object.keys(TEST_USERS).map(key => ({
  Key: key,
  Email: TEST_USERS[key].email,
  Role: TEST_USERS[key].role,
  AdminRole: TEST_USERS[key].adminRole || 'none',
  OnboardingComplete: TEST_USERS[key].onboardingComplete || false
})));
