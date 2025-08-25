import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[v0] Creating account session for:", email)

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

    // Check if developer already exists
    const { data: existingDeveloper } = await supabase
      .from("developers")
      .select("stripe_account_id")
      .eq("user_id", user.id)
      .single()

    let stripeAccountId = existingDeveloper?.stripe_account_id

    // Create Stripe account if it doesn't exist
    if (!stripeAccountId) {
      console.log("[v0] Creating new Stripe account")
      const account = await stripe.accounts.create({
        type: "express",
        email: email,
        capabilities: {
          transfers: { requested: true },
        },
        business_profile: {
          name: name || undefined,
        },
      })

      stripeAccountId = account.id

      // Store in database
      const { error: insertError } = await supabase.from("developers").insert({
        user_id: user.id,
        email: email,
        name: name || null,
        stripe_account_id: stripeAccountId,
        onboarding_completed: false,
      })

      if (insertError) {
        console.log("[v0] Database insert error:", insertError)
        return NextResponse.json({ error: "Failed to store developer account" }, { status: 500 })
      }
    }

    // Create account session for embedded onboarding
    console.log("[v0] Creating account session for account:", stripeAccountId)
    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: { enabled: true },
      },
    })

    console.log("[v0] Account session created successfully")

    return NextResponse.json({
      clientSecret: accountSession.client_secret,
      accountId: stripeAccountId,
    })
  } catch (error) {
    console.error("[v0] Account session creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account session" },
      { status: 500 },
    )
  }
}
