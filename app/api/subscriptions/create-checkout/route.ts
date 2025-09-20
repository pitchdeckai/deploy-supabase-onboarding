import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY environment variable is not configured" }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil" as any,
    })

    const supabase = await createServerClient()
    const { priceId, connectedAccountId, successUrl, cancelUrl } = await request.json()

    if (!priceId || !connectedAccountId) {
      return NextResponse.json({ error: "Price ID and connected account ID are required" }, { status: 400 })
    }

    // Get product details for fee calculation
    const { data: product } = await supabase
      .from("products")
      .select("price_cents")
      .eq("stripe_price_id", priceId)
      .single()

    // Calculate 5% platform fee
    const applicationFeePercent = 5

    // Create checkout session with direct charges (customer pays vendor directly)
    // Platform takes 5% application fee
    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        //application_fee_percent: applicationFeePercent, // 5% platform fee
        metadata: {
          connected_account_id: connectedAccountId,
          platform_fee_percent: applicationFeePercent.toString(),
        },
      },
      {
        stripeAccount: connectedAccountId, // Create session on vendor's account
      }
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      applicationFeePercent,
    })
  } catch (error: any) {
    console.error("Checkout session creation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
