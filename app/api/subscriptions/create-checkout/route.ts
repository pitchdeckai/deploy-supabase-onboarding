import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { price_id, success_url, cancel_url, customer_email } = await request.json()

    if (!price_id) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    console.log("[v0] Creating checkout session for price:", price_id)

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: product } = await supabase
      .from("products")
      .select(`
        *,
        developers!inner(
          id,
          stripe_account_id,
          email,
          name
        )
      `)
      .eq("stripe_price_id", price_id)
      .single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const connectedAccountId = product.developers.stripe_account_id

    // Create checkout session
    console.log("[v0] Creating Stripe checkout session")
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        customer_email: customer_email || undefined,
        payment_intent_data: {
          application_fee_amount: Math.round(product.price_cents * 0.05), // 5% platform fee
        },
        metadata: {
          product_id: product.id,
          developer_id: product.developers.id,
        },
      },
      {
        stripeAccount: connectedAccountId,
      },
    )

    console.log("[v0] Checkout session created successfully")

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
    })
  } catch (error) {
    console.error("[v0] Checkout session creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 },
    )
  }
}
