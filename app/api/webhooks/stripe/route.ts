import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "account.updated": {
        // Developer completed onboarding
        const account = event.data.object
        console.log("[v0] Account updated:", account.id, {
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
        })

        if (account.charges_enabled && account.payouts_enabled) {
          const { error } = await supabase
            .from("developers")
            .update({
              onboarding_complete: true,
              payouts_enabled: true,
            })
            .eq("stripe_account_id", account.id)

          if (error) {
            console.error("Failed to update developer onboarding status:", error)
          } else {
            console.log("[v0] Developer ready for payouts:", account.id)
          }
        }
        break
      }

      case "invoice.payment_succeeded": {
        // Customer paid subscription - track for developer payout
        const invoice = event.data.object
        console.log("[v0] Invoice payment succeeded:", {
          subscription: invoice.subscription,
          customer: invoice.customer,
          amount: invoice.amount_paid,
        })

        // This is from YOUR platform account (not connected account)
        if (!event.account) {
          const { error } = await supabase.from("subscriptions").upsert(
            {
              stripe_subscription_id: invoice.subscription,
              stripe_customer_id: invoice.customer,
              customer_email: invoice.customer_email,
              amount: invoice.amount_paid,
              status: "active",
            },
            {
              onConflict: "stripe_subscription_id",
            },
          )

          if (error) {
            console.error("Failed to store subscription:", error)
          } else {
            console.log("[v0] Subscription payment recorded")
          }
        }
        break
      }

      case "invoice.payment_failed": {
        // Customer payment failed - update subscription status
        const invoice = event.data.object
        console.log("[v0] Invoice payment failed:", invoice.subscription)

        if (!event.account) {
          const { error } = await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription)

          if (error) {
            console.error("Failed to update subscription status:", error)
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        // Subscription cancelled
        const subscription = event.data.object
        console.log("[v0] Subscription cancelled:", subscription.id)

        if (!event.account) {
          const { error } = await supabase
            .from("subscriptions")
            .update({ status: "cancelled" })
            .eq("stripe_subscription_id", subscription.id)

          if (error) {
            console.error("Failed to update subscription status:", error)
          }
        }
        break
      }

      case "transfer.created": {
        // Money transferred to developer
        const transfer = event.data.object
        console.log("[v0] Transfer created:", {
          destination: transfer.destination,
          amount: transfer.amount,
          transfer_id: transfer.id,
        })

        // Update payout record with transfer ID
        if (transfer.metadata?.developer_id) {
          const { error } = await supabase
            .from("payouts")
            .update({
              stripe_transfer_id: transfer.id,
              status: "completed",
            })
            .eq("developer_id", transfer.metadata.developer_id)
            .is("stripe_transfer_id", null)
            .order("created_at", { ascending: false })
            .limit(1)

          if (error) {
            console.error("Failed to update payout with transfer ID:", error)
          }
        }
        break
      }

      case "transfer.failed": {
        // Transfer failed
        const transfer = event.data.object
        console.log("[v0] Transfer failed:", transfer.id, transfer.failure_message)

        const { error } = await supabase
          .from("payouts")
          .update({ status: "failed" })
          .eq("stripe_transfer_id", transfer.id)

        if (error) {
          console.error("Failed to update failed transfer:", error)
        }
        break
      }

      case "payout.created": {
        // Money sent to developer's bank (this happens on the connected account)
        const payout = event.data.object
        console.log("[v0] Payout to bank created:", {
          amount: payout.amount,
          account: event.account,
        })

        // Update payout record with payout ID
        if (event.account) {
          const { error } = await supabase
            .from("payouts")
            .update({ stripe_payout_id: payout.id })
            .eq("stripe_transfer_id", payout.source_transaction)

          if (error) {
            console.error("Failed to update payout with payout ID:", error)
          }
        }
        break
      }

      case "payout.failed": {
        // Payout to bank failed
        const payout = event.data.object
        console.log("[v0] Payout failed:", payout.id, payout.failure_message)

        if (event.account) {
          const { error } = await supabase
            .from("payouts")
            .update({ status: "failed" })
            .eq("stripe_payout_id", payout.id)

          if (error) {
            console.error("Failed to update failed payout:", error)
          }
        }
        break
      }

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
