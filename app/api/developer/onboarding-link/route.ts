import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { developerId } = await request.json()

    if (!developerId) {
      return NextResponse.json({ error: "Developer ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get developer's Stripe account ID
    const { data: developer, error } = await supabase
      .from("developers")
      .select("stripe_account_id, onboarding_complete")
      .eq("id", developerId)
      .single()

    if (error || !developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 })
    }

    if (developer.onboarding_complete) {
      return NextResponse.json({ error: "Onboarding already complete" }, { status: 400 })
    }

    // Create new onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: developer.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/developer/onboard/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/developer/dashboard`,
      type: "account_onboarding",
    })

    return NextResponse.json({
      onboardingUrl: accountLink.url,
    })
  } catch (error: any) {
    console.error("Create onboarding link error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
