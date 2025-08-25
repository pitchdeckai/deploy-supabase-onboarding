import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("[v0] Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("[v0] Processing webhook event:", event.type)

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const connectedAccountId = event.account

        // Get customer info
        const customer = (await stripe.customers.retrieve(subscription.customer as string, {
          stripeAccount: connectedAccountId,
        })) as Stripe.Customer

        const { data: developer } = await supabase
          .from("developers")
          .select("id")
          .eq("stripe_account_id", connectedAccountId)
          .single()

        if (!developer) {
          console.error("Developer not found for account:", connectedAccountId)
          break
        }

        // Get product info
        const { data: product } = await supabase
          .from("products")
          .select("*")
          .eq("stripe_price_id", subscription.items.data[0].price.id)
          .single()

        if (product) {
          const { data: customerRecord } = await supabase
            .from("customers")
            .upsert({
              stripe_customer_id: customer.id,
              email: customer.email!,
              name: customer.name,
              developer_id: developer.id,
            })
            .select()
            .single()

          const { data: subscriptionRecord } = await supabase
            .from("subscriptions")
            .upsert({
              stripe_subscription_id: subscription.id,
              developer_id: developer.id,
              customer_id: customerRecord?.id,
              product_id: product.id,
              stripe_customer_id: customer.id,
              customer_email: customer.email,
              status: subscription.status,
              amount: subscription.items.data[0].price.unit_amount || 0,
              currency: subscription.items.data[0].price.currency,
              connected_account_id: connectedAccountId,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .select()
            .single()

          if (subscriptionRecord && customerRecord) {
            await supabase.from("commissions").upsert({
              subscription_id: subscriptionRecord.id,
              developer_id: developer.id,
              commission_percentage: 5.0, // Platform takes 5%
            })
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account

        await supabase
          .from("developers")
          .update({
            onboarding_complete: account.details_submitted && account.charges_enabled,
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            stripe_account_status: account.charges_enabled ? "active" : "pending",
            requirements_pending: account.requirements?.currently_due || [],
          })
          .eq("stripe_account_id", account.id)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const connectedAccountId = event.account

        if (invoice.subscription && connectedAccountId) {
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("id, developer_id, customer_id, amount")
            .eq("stripe_subscription_id", invoice.subscription)
            .single()

          if (subscription) {
            const platformFee = Math.round(subscription.amount * 0.05)
            const developerAmount = subscription.amount - platformFee

            await supabase.from("credit_transactions").insert({
              credit_id: null, // Will be linked to credits system later
              amount: developerAmount,
              type: "earning",
              description: `Payment for subscription ${invoice.subscription}`,
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 },
    )
  }
}
