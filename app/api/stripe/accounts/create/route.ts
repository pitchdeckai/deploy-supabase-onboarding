import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Check if STRIPE_SECRET_KEY is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY environment variable is not configured" }, { status: 500 })
    }

    // Initialize Stripe with the latest API version
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

    const { email, businessName } = await request.json()

    // Create connected account with controller properties as specified
    const account = await stripe.accounts.create({
      email,
      controller: {
        // Platform is responsible for pricing and fee collection
        fees: {
          payer: "application" as const,
        },
        // Platform is responsible for losses / refunds / chargebacks
        losses: {
          payments: "application" as const,
        },
        // Give them access to the express dashboard for management
        stripe_dashboard: {
          type: "express" as const,
        },
      },
      // Add business profile information
      business_profile: {
        name: businessName,
      },
      capabilities: {
        transfers: { requested: true },
      },
    })

    // Store the account in our database
    const { error: dbError } = await supabase.from("connected_accounts").insert({
      user_id: user.id,
      stripe_account_id: account.id,
      email,
      business_name: businessName,
      onboarding_complete: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to store account" }, { status: 500 })
    }

    return NextResponse.json({
      accountId: account.id,
      message: "Connected account created successfully",
    })
  } catch (error) {
    console.error("Stripe account creation error:", error)
    return NextResponse.json({ error: "Failed to create connected account" }, { status: 500 })
  }
}
