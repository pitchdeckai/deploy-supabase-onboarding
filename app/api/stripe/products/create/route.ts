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

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get developer record with Stripe account
    const { data: developer, error: devError } = await supabase
      .from("developers")
      .select("id, stripe_account_id")
      .eq("user_id", user.id)
      .single()

    if (devError || !developer?.stripe_account_id) {
      return NextResponse.json({ error: "Developer not found or not onboarded" }, { status: 404 })
    }

    const { name, description, priceInCents, currency = "usd", interval = "month" } = await request.json()

    // Create product directly on vendor's connected account for better attribution
    const product = await stripe.products.create(
      {
        name: name,
        description: description,
      },
      {
        stripeAccount: developer.stripe_account_id, // Create on vendor's account
      }
    )

    // Create price on vendor's account
    const price = await stripe.prices.create(
      {
        currency: currency,
        unit_amount: priceInCents,
        product: product.id,
        recurring: interval !== "one_time" ? { interval: interval } : undefined,
      },
      {
        stripeAccount: developer.stripe_account_id,
      }
    )

    // Store in database for easier querying
    const { error: dbError } = await supabase.from("products").insert({
      stripe_product_id: product.id,
      stripe_price_id: price.id,
      connected_account_id: developer.stripe_account_id,
      user_id: user.id,
      developer_id: developer.id,
      name,
      description,
      price_cents: priceInCents,
      currency,
      interval,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to store product" }, { status: 500 })
    }

    return NextResponse.json({
      productId: product.id,
      priceId: price.id,
      message: "Product created successfully on vendor account",
    })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}