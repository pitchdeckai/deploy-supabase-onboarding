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

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL environment variable is not configured" }, { status: 500 })
    }

    const { productId, quantity = 1 } = await request.json()

    const supabase = createServerClient()

    // Get product details from database
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("stripe_product_id", productId)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate application fee (10% of total)
    const applicationFeeAmount = Math.round(product.price_cents * quantity * 0.1)

    // Create checkout session with destination charge
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price_cents,
          },
          quantity: quantity,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: product.connected_account_id,
        },
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/storefront`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout session creation error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
