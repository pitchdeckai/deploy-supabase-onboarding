# Active Webhook Configuration
**Generated**: 2025-07-30.basil

## 🟢 Current Tunnel Status (Cloudflare)
- **Status**: ONLINE
- **Tunnel URL**: https://api.forgedai.com
- **Forwarding to**: http://localhost:3000 (via Cloudflare Tunnel)

## 📌 Webhook Endpoints to Configure in Stripe

### Primary Webhook
```
https://api.forgedai.com/api/webhooks/stripe
```

### Connect Webhook (if using Connect)
```
https://api.forgedai.com/api/webhooks/stripe-connect
```

## 🔧 Quick Setup Steps

### 1. Configure Stripe Webhooks

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL**: 
   ```
   https://api.forgedai.com/api/webhooks/stripe
   ```
4. **Description**: "Dev - Stripe Webhooks (Cloudflare Tunnel)"
5. **Events to send** - Select:
   - ✅ `account.updated`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`  
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `payout.created`
   - ✅ `payout.failed`

6. Click **"Add endpoint"**

### 2. Get Your Webhook Signing Secret

After creating the endpoint:
1. Click on the webhook you just created
2. Find **"Signing secret"** section
3. Click **"Reveal"**
4. Copy the secret (starts with `whsec_`)

### 3. Update Your .env.local

Add or update this line in your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_[your_secret_here]
```

### 4. Restart Your Dev Server

Stop and restart to load the new environment variable:
```bash
# Press Ctrl+C in the terminal running npm run dev
# Then restart:
npm run dev
```

## 🧪 Test Your Webhook

### Option 1: Use the Stripe Dashboard
1. Go to your webhook endpoint in Stripe Dashboard
2. Click **"Send test webhook"**
3. Select `account.updated` 
4. Click **"Send test webhook"**

### Option 2: Use the Test Script
```powershell
.\scripts\test-webhooks.ps1
```

### Option 3: Manual Test via ngrok Inspector
1. Visit: http://127.0.0.1:4040/inspect/http
2. You'll see all incoming requests in real-time
3. Test the onboarding flow in your app
4. Watch the webhooks arrive

## 📊 Monitor Webhook Activity

- **ngrok Inspector**: http://127.0.0.1:4040
- **Application Logs**: Check your Next.js terminal for processing logs
- **Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks/[your_webhook_id]

## ⚠️ Important Reminders

- This ngrok URL is temporary and will change when you restart ngrok
- Free tier has a 2-hour session limit
- Always use test mode keys for development
- The ngrok warning page is normal - click "Visit Site" to proceed

## 🔄 If ngrok Restarts

When ngrok restarts (new session or after 2 hours):
1. Get the new URL from ngrok window
2. Update the webhook endpoint in Stripe Dashboard
3. No need to change the signing secret

## 📝 Current Test Credentials
- **Test Email**: penix83288@evoxury.com
- **Test User**: test user
- **Account Type**: Developer/Merchant

---
*This file is auto-generated and contains your current active webhook configuration*
