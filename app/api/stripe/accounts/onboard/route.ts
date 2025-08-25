import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

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

    const { accountId } = await request.json()

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/connect/refresh?account_id=${accountId}`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/connect/return?account_id=${accountId}`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Account link creation error:", error)
    return NextResponse.json({ error: "Failed to create onboarding link" }, { status: 500 })
  }
}
