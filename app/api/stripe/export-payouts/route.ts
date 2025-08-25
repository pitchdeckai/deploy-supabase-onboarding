import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: developer } = await supabase.from("developers").select("*").eq("user_id", user.id).single()

    if (!developer?.stripe_account_id) {
      return NextResponse.json({ error: "No Stripe account found" }, { status: 404 })
    }

    // Get all payouts from Stripe
    const payouts = await stripe.payouts.list({
      stripeAccount: developer.stripe_account_id,
      limit: 100,
    })

    // Format data for CSV export
    const csvData = payouts.data.map((payout: any) => ({
      id: payout.id,
      amount: (payout.amount / 100).toFixed(2),
      currency: payout.currency.toUpperCase(),
      status: payout.status,
      created: new Date(payout.created * 1000).toISOString(),
      arrival_date: new Date(payout.arrival_date * 1000).toISOString(),
      method: payout.method,
      type: payout.type,
    }))

    return NextResponse.json({ data: csvData })
  } catch (error) {
    console.error("Error exporting payouts:", error)
    return NextResponse.json({ error: "Failed to export payouts" }, { status: 500 })
  }
}
