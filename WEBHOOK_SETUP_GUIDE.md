# Stripe Webhook Setup Guide

## Quick Start

### Step 1: Start Your Development Server
```bash
npm run dev
```
Your app should now be running at http://localhost:3000

### Step 2: Start ngrok Tunnel

#### Option A: Use the PowerShell Script (Recommended)
```powershell
.\scripts\start-dev-with-ngrok.ps1
```
This script will:
- Start your Next.js dev server (if not running)
- Start ngrok tunnel
- Display your webhook URLs
- Copy the tunnel URL to clipboard

#### Option B: Use the Batch Script
```cmd
.\scripts\start-ngrok.bat
```

#### Option C: Manual ngrok Start
```bash
ngrok http 3000
```

### Step 3: Get Your ngrok URL
After starting ngrok, you'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Your webhook URLs will be:
- **Stripe Webhook**: `https://abc123.ngrok-free.app/api/webhooks/stripe`
- **Stripe Connect Webhook**: `https://abc123.ngrok-free.app/api/webhooks/stripe-connect`

### Step 4: Configure Stripe Webhooks

1. Go to [Stripe Dashboard Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your endpoint URL: `https://YOUR_NGROK_URL.ngrok-free.app/api/webhooks/stripe-connect`
4. Select the following events:
   - `account.updated` (for Connect account status)
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

5. Click **"Add endpoint"**

### Step 5: Get Your Webhook Signing Secret

1. After creating the endpoint, click on it in the dashboard
2. Click **"Reveal"** under "Signing secret"
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add it to your `.env.local` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 6: Restart Your Development Server
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## Testing Webhooks

### Using Stripe CLI (Alternative to ngrok)

If you prefer using Stripe CLI instead of ngrok:

1. Install Stripe CLI:
```bash
# Windows (using Scoop)
scoop install stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe-connect
```

4. The CLI will display your webhook signing secret - add it to `.env.local`

### Testing Webhook Events

You can trigger test events from Stripe Dashboard:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your endpoint
3. Click **"Send test webhook"**
4. Select an event type and send

Or use Stripe CLI:
```bash
stripe trigger account.updated
```

## Production Setup

For production deployment:

1. **Update webhook URLs** to your production domain:
   - `https://yourdomain.com/api/webhooks/stripe`
   - `https://yourdomain.com/api/webhooks/stripe-connect`

2. **Create separate webhook endpoints** for production in Stripe Dashboard

3. **Update environment variables** in your production environment:
   - Add production `STRIPE_WEBHOOK_SECRET`
   - Ensure all Stripe keys are production keys (starting with `sk_live_` and `pk_live_`)

## Webhook Event Reference

### Connect Account Events
- `account.updated` - Triggered when a connected account's status changes

### Subscription Events
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled

### Payment Events
- `invoice.payment_succeeded` - Successful payment received

## Troubleshooting

### ngrok Issues

**Issue**: ngrok tunnel expires after 2 hours (free tier)
**Solution**: Sign up for ngrok account for longer sessions or use Stripe CLI

**Issue**: Can't access ngrok URL
**Solution**: 
- Check if ngrok is running: Visit http://127.0.0.1:4040
- Ensure port 3000 is not blocked by firewall
- Try restarting ngrok

### Webhook Issues

**Issue**: Webhook signature verification fails
**Solution**:
- Ensure `STRIPE_WEBHOOK_SECRET` is correct in `.env.local`
- Make sure you're using the right secret for the right endpoint
- Check that the raw body is being passed to verification (not parsed JSON)

**Issue**: Webhooks not being received
**Solution**:
- Check ngrok is running and URL is correct
- Verify webhook is enabled in Stripe Dashboard
- Check your server logs for errors
- Ensure the correct events are selected in Stripe

**Issue**: 404 errors on webhook endpoint
**Solution**:
- Verify the endpoint path is correct: `/api/webhooks/stripe-connect`
- Ensure your Next.js app is running
- Check that the route file exists at `app/api/webhooks/stripe-connect/route.ts`

## Security Notes

- **Never commit** `.env.local` or any file containing secrets
- **Use different webhook secrets** for development and production
- **Validate webhook signatures** in production (already implemented in code)
- **Use HTTPS** in production (ngrok provides this for development)

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Connect Webhooks](https://stripe.com/docs/connect/webhooks)
- [ngrok Documentation](https://ngrok.com/docs)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
