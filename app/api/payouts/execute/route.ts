import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const { developerId, amount, description } = await request.json()

    if (!developerId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Developer ID and valid amount are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get developer's Stripe account
    const { data: developer, error } = await supabase
      .from("developers")
      .select("stripe_account_id, email, name, payouts_enabled, onboarding_complete")
      .eq("id", developerId)
      .single()

    if (error || !developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 })
    }

    if (!developer.stripe_account_id) {
      return NextResponse.json({ error: "Developer not onboarded with Stripe" }, { status: 400 })
    }

    if (!developer.payouts_enabled || !developer.onboarding_complete) {
      return NextResponse.json({ error: "Developer not ready for payouts" }, { status: 400 })
    }

    // Create payout record first
    const currentDate = new Date()
    const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const periodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const { data: payoutRecord, error: payoutError } = await supabase
      .from("payouts")
      .insert({
        developer_id: developerId,
        amount: amount,
        period_start: periodStart.toISOString().split("T")[0],
        period_end: periodEnd.toISOString().split("T")[0],
        status: "pending",
      })
      .select()
      .single()

    if (payoutError) {
      console.error("Failed to create payout record:", payoutError)
      return NextResponse.json({ error: "Failed to create payout record" }, { status: 500 })
    }

    try {
      // Create transfer from your platform to developer
      const transfer = await stripe.transfers.create({
        amount: amount, // in cents
        currency: "usd",
        destination: developer.stripe_account_id,
        description: description || `Payout to ${developer.email}`,
        metadata: {
          developer_id: developerId,
          payout_record_id: payoutRecord.id,
          type: "developer_payout",
        },
      })

      // Update payout record with transfer ID
      const { error: updateError } = await supabase
        .from("payouts")
        .update({
          stripe_transfer_id: transfer.id,
          status: "completed",
        })
        .eq("id", payoutRecord.id)

      if (updateError) {
        console.error("Failed to update payout record:", updateError)
      }

      console.log("[v0] Transfer created successfully:", {
        transfer_id: transfer.id,
        amount: amount,
        destination: developer.stripe_account_id,
      })

      return NextResponse.json({
        success: true,
        transfer: {
          id: transfer.id,
          amount: transfer.amount,
          destination: transfer.destination,
          created: transfer.created,
        },
        payout: payoutRecord,
      })
    } catch (stripeError: any) {
      // Update payout record to failed status
      await supabase.from("payouts").update({ status: "failed" }).eq("id", payoutRecord.id)

      console.error("Stripe transfer failed:", stripeError)
      return NextResponse.json({ error: `Transfer failed: ${stripeError.message}` }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Execute payout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
