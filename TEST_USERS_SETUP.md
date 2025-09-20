# Test Users and Data Setup

This document outlines the test users and data that have been created for development and testing purposes.

## Test User Accounts

### 1. Developer Users

#### Fully Onboarded Developer
- **Email**: `evil.pocket.money@gmail.com`
- **Name**: Sam Smith
- **Business**: Smith Tech Solutions (Individual)
- **Status**: Fully onboarded and active
- **Stripe Account**: `acct_test_complete_dev`
- **Capabilities**: Can accept payments, receive payouts
- **Admin Role**: Regular admin with limited permissions

#### Partially Onboarded Developer  
- **Email**: `penix83288@evoxury.com`
- **Name**: Test Developer
- **Business**: Test Dev Company (Company)
- **Status**: Partially onboarded (restricted)
- **Stripe Account**: `acct_test_partial_dev`
- **Pending Requirements**: Business profile URL, external account
- **Capabilities**: Can accept payments, but no payouts yet

#### New Developer (Pending)
- **Email**: `newdev@example.com`
- **Name**: New Developer
- **Business**: Startup Inc (Company)
- **Status**: Just started onboarding
- **Stripe Account**: Not created yet
- **Pending Requirements**: Business profile, external account, ToS acceptance

### 2. Admin Users

#### Super Administrator
- **Email**: `pitchdeck.official@gmail.com`
- **Name**: John Doe
- **Role**: `super_admin`
- **Permissions**: Full access to all platform features
- **Capabilities**: Can manage all users, developers, view audit logs

#### Platform Administrator
- **Email**: `evil.pocket.money@gmail.com` (dual role)
- **Name**: Sam Smith
- **Role**: `admin`
- **Permissions**: Limited admin access (users, developers, analytics)
- **Capabilities**: Can manage users and developers, view analytics

## Test Data Created

### Products
1. **SaaS Basic Plan** - $29.99/month (Sam Smith)
2. **SaaS Pro Plan** - $99.99/month (Sam Smith)
3. **Mobile App Premium** - $19.99/month (Test Developer)

### Customers
- **customer1@example.com** - John Customer (subscribed to Basic Plan)
- **customer2@example.com** - Jane Customer (subscribed to Pro Plan)
- **customer3@example.com** - Bob Customer (subscribed to Mobile App Premium)

### Subscriptions
- 3 active subscriptions across different products and developers
- Monthly billing cycles with realistic period dates
- Platform fees calculated at 5% of subscription amount

### Financial Data
- **Application Fees**: Platform revenue from subscription charges
- **Payouts**: One completed payout for Sam Smith ($114.00 net after fees)
- **Credits**: $50.00 in credits for Sam Smith with transaction history

### Platform Features
- **Subscription Plans**: Starter (Free), Professional ($29.99), Enterprise ($99.99)
- **Audit Logging**: Admin actions are tracked for compliance
- **Network Events**: Sample API calls and external service interactions logged

## Authentication & Authorization

### Row Level Security (RLS)
- All sensitive tables have RLS policies enabled
- Users can only access their own data unless they have admin privileges
- Admins have appropriate access based on their role level

### Admin Functions
- `is_admin()` - Check if current user has admin privileges
- `has_admin_role(role)` - Check for specific admin role
- Audit logging for all admin actions

### Future Stripe Connect Integration
- Test Stripe account IDs are set up for different onboarding states
- Webhook handling structure in place
- Platform fee calculation logic implemented

## Usage for Development

### Testing Different User States
1. **Complete Developer Flow**: Login as Sam Smith to test full platform features
2. **Partial Onboarding**: Login as Test Developer to test restricted access
3. **Admin Functions**: Login as John Doe for admin panel testing
4. **Customer Experience**: Use customer emails for subscription testing

### API Testing Endpoints
- Use the existing API routes with test data
- Webhook testing with sample Stripe events
- Payout calculations with test financial data

### Database Testing
- Sample data covers all major use cases
- Realistic relationships between entities
- Platform fee and commission calculations

## Security Considerations

⚠️ **Important**: These are test accounts for development only
- Do not use in production
- Test Stripe account IDs are not real
- Passwords should be reset for any production deployment
- Admin roles should be carefully managed in production

## Next Steps

1. **Frontend Integration**: Update login forms to work with test accounts
2. **Stripe Connect**: Implement actual Stripe Connect onboarding flow  
3. **Admin Dashboard**: Build admin interface using the role system
4. **Webhook Testing**: Test webhook endpoints with sample events
5. **API Documentation**: Document API endpoints with test data examples

---

*Generated on: September 20, 2025*
*Database Schema Version: Latest with admin roles and test data*
