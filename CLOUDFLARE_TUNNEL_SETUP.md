# Cloudflare Tunnel Setup for Stripe Webhooks

This project uses **Cloudflare Tunnel** instead of ngrok for exposing localhost to external services like Stripe webhooks during development.

## Prerequisites

1. **Cloudflare Account** with a domain
2. **Cloudflared CLI** installed
3. **Tunnel configured** to point to your localhost

## Tunnel Configuration

Your tunnel should be configured to forward traffic from your domain (e.g., `api.forgedai.com`) to your local development server:

```bash
# Example tunnel configuration
cloudflared tunnel --url localhost:3000 --hostname api.forgedai.com
```

## Stripe Webhook Configuration

1. **Webhook URL**: `https://api.forgedai.com/api/webhooks/stripe`
2. **Events to listen for**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `payment_intent.succeeded`
   - `account.updated`
   - `transfer.created`
   - `transfer.failed`
   - `payout.created`
   - `payout.failed`

## Environment Variables

Ensure your `.env.local` has the correct webhook secret:

```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Development Workflow

1. **Start your Next.js app**: `pnpm run dev`
2. **Start Cloudflare Tunnel** (if not running persistently)
3. **Test webhook endpoints** using Stripe CLI or dashboard
4. **Monitor webhook logs** in your Next.js console

## Advantages over ngrok

- ✅ **Persistent URL**: Your domain stays the same
- ✅ **No session limits**: Unlike ngrok's free tier
- ✅ **Production-like setup**: Same domain for dev and prod
- ✅ **SSL by default**: Cloudflare provides SSL automatically
- ✅ **Better performance**: Generally faster than ngrok

## Troubleshooting

### Webhook Signature Verification Errors

If you see errors like:
```
Webhook signature verification failed: No signatures found matching the expected signature for payload
```

This is normal during development and means:
1. Stripe is sending test events that don't match your webhook secret
2. Your local server isn't receiving the webhooks properly
3. The webhook secret in your environment doesn't match the one in Stripe dashboard

### Solution:
1. Verify your `STRIPE_WEBHOOK_SECRET` matches the one in Stripe dashboard
2. Ensure your tunnel is properly forwarding requests
3. Check that your webhook endpoint URL in Stripe matches your tunnel URL

## Testing

You can test webhooks using Stripe CLI:

```bash
# Forward webhooks to your tunnel URL
stripe listen --forward-to https://api.forgedai.com/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

## Production Deployment

When deploying to production, ensure:
1. Your production domain points to your deployed app
2. Stripe webhook URL is updated to production domain
3. Environment variables are properly configured
4. Webhook signature verification is working