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

    const supabase = createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, priceInCents, currency = "usd", connectedAccountId } = await request.json()

    // Create product at platform level as specified
    const product = await stripe.products.create({
      name: name,
      description: description,
      default_price_data: {
        unit_amount: priceInCents,
        currency: currency,
      },
      // Store connected account mapping in metadata
      metadata: {
        connected_account_id: connectedAccountId,
        created_by_user: user.id,
      },
    })

    // Also store in database for easier querying
    const { error: dbError } = await supabase.from("products").insert({
      stripe_product_id: product.id,
      stripe_price_id: product.default_price as string,
      connected_account_id: connectedAccountId,
      user_id: user.id,
      name,
      description,
      price_cents: priceInCents,
      currency,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to store product" }, { status: 500 })
    }

    return NextResponse.json({
      productId: product.id,
      priceId: product.default_price,
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
