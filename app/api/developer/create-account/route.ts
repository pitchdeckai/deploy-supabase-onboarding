import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { email, name, business_name, business_type } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const account = await stripe.accounts.create({
      email: email,
      controller: {
        // Platform handles fee collection
        fees: {
          payer: "application" as const,
        },
        // Platform must control losses when using express dashboard
        losses: {
          payments: "application" as const,
        },
        // Use express dashboard for account management
        stripe_dashboard: {
          type: "express" as const,
        },
      },
      business_profile: {
        name: business_name || name || "Developer Account",
        mcc: "5734", // Computer Software Stores
      },
      capabilities: {
        transfers: { requested: true },
      },
    })

    const { data, error } = await supabase
      .from("developers")
      .insert({
        user_id: user.id,
        email: email,
        name: name,
        business_name: business_name,
        business_type: business_type,
        stripe_account_id: account.id,
        stripe_account_status: "pending",
        onboarding_complete: false,
        charges_enabled: false,
        payouts_enabled: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Failed to store developer account")
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api.forgedai.com"
    const refreshUrl = `${baseUrl}/developer/onboard/refresh`
    const returnUrl = `${baseUrl}/developer/dashboard`

    console.log("[v0] Creating account link with URLs:", { refreshUrl, returnUrl })

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    })

    return NextResponse.json({
      developerId: data.id,
      onboardingUrl: accountLink.url,
    })
  } catch (error: any) {
    console.error("Create account error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
