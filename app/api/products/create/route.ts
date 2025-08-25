import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { name, description, price_cents, currency, interval } = await request.json()

    if (!name || !price_cents) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    console.log("[v0] Creating product:", { name, price_cents, currency, interval })

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: developer } = await supabase
      .from("developers")
      .select("id, stripe_account_id, onboarding_complete")
      .eq("user_id", user.id)
      .single()

    if (!developer?.stripe_account_id) {
      return NextResponse.json(
        { error: "No connected account found. Please complete onboarding first." },
        { status: 400 },
      )
    }

    if (!developer.onboarding_complete) {
      return NextResponse.json({ error: "Please complete your account onboarding first." }, { status: 400 })
    }

    // Create product in Stripe
    console.log("[v0] Creating Stripe product")
    const product = await stripe.products.create(
      {
        name,
        description: description || undefined,
      },
      {
        stripeAccount: developer.stripe_account_id,
      },
    )

    // Create price in Stripe
    console.log("[v0] Creating Stripe price")
    const price = await stripe.prices.create(
      {
        product: product.id,
        unit_amount: price_cents,
        currency: currency || "usd",
        recurring: {
          interval: interval || "month",
          interval_count: 1,
        },
      },
      {
        stripeAccount: developer.stripe_account_id,
      },
    )

    const { data: dbProduct, error: insertError } = await supabase
      .from("products")
      .insert({
        developer_id: developer.id,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        connected_account_id: developer.stripe_account_id,
        user_id: user.id, // Keep for backward compatibility
        name,
        description: description || null,
        price_cents,
        currency: currency || "usd",
        interval: interval || "month",
        active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.log("[v0] Database insert error:", insertError)
      return NextResponse.json({ error: "Failed to store product" }, { status: 500 })
    }

    console.log("[v0] Product created successfully")

    return NextResponse.json({
      product: dbProduct,
      stripe_product_id: product.id,
      stripe_price_id: price.id,
    })
  } catch (error) {
    console.error("[v0] Product creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    )
  }
}
