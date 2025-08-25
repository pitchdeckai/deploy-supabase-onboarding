# Stripe Connect Setup Guide

## Issues Fixed

### 1. Parameter Conflict
The Stripe Connect system had a conflict where both `type` and `controller` parameters were being passed to the Stripe account creation API, which are mutually exclusive.

### 2. API Version Issue  
Using an invalid API version `"2025-07-30.basil"` which caused initialization errors.

### 3. Platform Responsibility Configuration
When using Express dashboard (`stripe_dashboard.type: "express"`), Stripe requires the platform to control losses. This is a mandatory requirement.

### 4. Database Schema Mismatch
Missing required fields in database inserts causing constraint violations.

### 5. Embedded Onboarding JavaScript Error
The error `stripe.accountOnboarding is not a function` was caused by using wrong Stripe library.

**All issues have been fixed by:**
1. **Removed `type` parameter** from account creation when using `controller`
2. **Removed hardcoded API version** to use account default
3. **Added required losses controller** to meet Express dashboard requirements
4. **Added missing database fields** for proper schema compliance
5. **Updated to Stripe Connect JS** for embedded onboarding
6. **Added domain configuration** in `next.config.mjs`

## Required Environment Variables

Make sure you have these environment variables set:

```env
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Your app URL (or production URL)
STRIPE_WEBHOOK_SECRET=whsec_...  # Your Stripe webhook secret
```

## Files Modified

1. **`app/api/developer/create-account-session/route.ts`** - Fixed the main account creation flow
2. **`app/api/developer/create-account/route.ts`** - Updated for consistency  
3. **`app/developer/onboard/page.tsx`** - Fixed embedded onboarding implementation
4. **`next.config.mjs`** - Added domain support configuration
5. **`types/stripe.d.ts`** - Added StripeConnect type definitions

## Testing the Integration

### Method 1: Debug Endpoint (Recommended First)

```bash
# Test basic Stripe functionality
curl -X POST http://localhost:3000/api/debug/stripe-test \
  -H "Content-Type: application/json" \
  -d '{"testEmail":"debug@example.com"}'
```

This will test both basic account creation and controller-based creation to identify any remaining issues.

### Method 2: Test the Full Onboarding Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/developer/onboard`

3. Fill in the form and click "Continue to Account Setup"

4. The embedded Stripe onboarding should load without errors

## Expected Behavior

- ✅ Account creation works without type/controller parameter conflicts
- ✅ Embedded onboarding loads properly
- ✅ Webhook handling is consistent
- ✅ Platform fee collection is configured (5% platform fee)

## Platform Configuration

The system is configured as a platform that:

- **Collects fees**: 5% platform fee on all transactions
- **Handles losses**: Platform takes responsibility for refunds/chargebacks  
- **Provides dashboard**: Developers get access to Stripe Express dashboard
- **Manages transfers**: Platform controls when and how payouts are made

## Troubleshooting

### Common Issues and Solutions:

1. **500 Internal Server Error during onboarding:**
   - Run the debug endpoint first: `POST /api/debug/stripe-test`
   - Check server console logs for detailed error messages
   - Verify all environment variables are set correctly

2. **Platform responsibility warnings:**
   - Review your Stripe Connect platform profile at https://dashboard.stripe.com/settings/connect/platform-profile
   - The system now uses a simplified controller configuration to avoid platform liability issues

3. **Database errors:**
   - Ensure your Supabase database schema matches the expected structure
   - Check that the `developers` table exists with all required columns

4. **Authentication errors:**
   - Verify you're logged in to the application
   - Check Supabase authentication is working properly

### Debugging Steps:
1. **Check environment variables** are properly set
2. **Run debug endpoint** to isolate Stripe issues  
3. **Check server logs** for detailed error information
4. **Verify database schema** matches requirements
5. **Review Stripe dashboard** for account creation attempts

## Next Steps

1. Set up webhook endpoints in your Stripe dashboard
2. Test the full payment flow with real Stripe accounts
3. Configure production environment variables
4. Set up proper error monitoring for webhook failures
