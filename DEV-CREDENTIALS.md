# 🧪 Development Mode - Authentication Setup

This project is configured to work in **development mode** with mock authentication when the real Supabase instance is not available.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the authentication pages:**
   - Sign Up: http://localhost:3000/auth/sign-up
   - Login: http://localhost:3000/auth/login

3. **Use the test credentials provided on the pages, or create new accounts**

## 🔑 Test Credentials

The following pre-configured test accounts are available:

| Name | Email | Password | Description |
|------|-------|----------|-------------|
| **Test Developer** | `developer@test.com` | `password123` | Primary developer account |
| **Test Admin** | `admin@test.com` | `admin123` | Admin-level access |
| **Test User** | `user@test.com` | `user123` | Standard user account |

## ✨ How It Works

### Mock Authentication System
- **No real backend required** - All authentication is simulated locally
- **Session persistence** - Login state is maintained using localStorage
- **Real-like behavior** - Simulates network delays and error responses
- **Auto-detection** - Automatically switches to mock mode in development

### Features Available
- ✅ Sign up with new accounts (any email/password works)
- ✅ Login with test credentials or created accounts  
- ✅ Session management and logout
- ✅ Error handling and validation
- ✅ Persistent login state across page refreshes

## 🛠️ Technical Details

### Files Modified
- `lib/supabase/client.ts` - Auto-detects and switches to mock client
- `lib/supabase/mock-client.ts` - Complete mock Supabase implementation
- `components/dev/test-credentials.tsx` - Development helper UI
- Authentication pages updated with test credential display

### Mock Detection Logic
The system automatically uses the mock client when:
1. `NODE_ENV === 'development'` AND
2. Supabase URL is missing/invalid OR
3. Supabase URL contains the non-existent project ID

### Data Storage
- **Sessions**: Stored in `localStorage` as `mock-supabase-session`
- **Users**: Hardcoded test users + dynamically created users
- **No database**: All data is ephemeral (resets on page refresh for new signups)

## 🔄 Switching to Real Supabase

When you're ready to use a real Supabase instance:

1. **Get new Supabase credentials:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Create a new project or find your existing one
   - Get your Project URL and API keys

2. **Update environment variables:**
   ```bash
   node update-supabase-config.js <your-supabase-url> <your-anon-key> <your-service-key>
   ```
   
   Or manually edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

The system will automatically detect the valid Supabase credentials and switch to the real client.

## 🐛 Troubleshooting

### "Failed to fetch" Error
This was the original error you encountered. It happened because:
- The Supabase project URL `qgpybicovgofmklvsyts.supabase.co` doesn't exist
- The mock system now handles this gracefully

### Mock Client Not Loading
If you see the real Supabase client being used instead of mock:
1. Check that `NODE_ENV` is set to `development`
2. Verify the console logs show "🧪 [DEV] Using mock Supabase client"
3. Clear localStorage and refresh the page

### Session Issues
If login state isn't persisting:
1. Check browser console for errors
2. Verify localStorage contains `mock-supabase-session`
3. Try clearing all localStorage data and logging in again

## 💡 Tips

- **Test credentials are displayed** directly on the auth pages in development mode
- **Console logging** shows all mock operations for debugging
- **Copy buttons** available for quick credential copying
- **Any email/password combo** works for new signups in mock mode
- **Session persists** across browser refreshes

## 🚀 Production Deployment

Before deploying to production:
1. ✅ Set up a real Supabase project
2. ✅ Update environment variables  
3. ✅ Set `NODE_ENV=production`
4. ✅ Test authentication with real backend
5. ✅ Remove or hide development helpers

---

**Need help?** The mock system provides detailed console logging to help debug any issues!