import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

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

    // Create Standard connected account
    const account = await stripe.accounts.create({
      type: "standard",
      email: email,
      business_profile: {
        name: name || "Developer Account",
        mcc: "5734", // Computer Software Stores
      },
    })

    const { data, error } = await supabase
      .from("developers")
      .insert({
        user_id: user.id,
        email: email,
        name: name,
        stripe_account_id: account.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Failed to store developer account")
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
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
