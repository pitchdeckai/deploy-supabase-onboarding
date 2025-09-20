# Temporarily Disable Email Confirmation

To troubleshoot the "Database error saving new user" issue, let's temporarily disable email confirmation:

## Steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/qgpybicovgofmklvsyts/auth/providers

2. **Find Email Settings**
   - Scroll down to the "Email" section
   - Look for "Enable email confirmations" toggle

3. **Disable Email Confirmation**
   - Turn OFF the "Enable email confirmations" toggle
   - Click "Save" to apply changes

4. **Test Signup**
   - Try signing up with developer@test.com / password123
   - See if the database error still occurs

## What This Tests:

- **If signup works**: The issue is with the email confirmation flow
- **If signup still fails**: The issue is with the database trigger function

## After Testing:

Once we identify and fix the root cause, we'll re-enable email confirmation.

## Alternative Settings to Check:

If you can't find the toggle, look for these settings:
- "Confirm email" 
- "Enable signup"
- "Enable email confirmations"
- Under Authentication > Settings or Authentication > Providers