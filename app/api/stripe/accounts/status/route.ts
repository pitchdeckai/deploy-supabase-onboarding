import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil" as any,
})

export async function GET(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY environment variable is not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("account_id")

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
    }

    // Get account status directly from Stripe API as requested
    const account = await stripe.accounts.retrieve(accountId)

    return NextResponse.json({
      id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements,
      business_profile: account.business_profile,
    })
  } catch (error) {
    console.error("Account status retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve account status" }, { status: 500 })
  }
}
