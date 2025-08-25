import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get all developers with their earnings from active subscriptions
    const { data: attributions, error } = await supabase
      .from("customer_attributions")
      .select(`
        developer_id,
        attribution_percentage,
        developers (
          id,
          email,
          name,
          stripe_account_id,
          payouts_enabled,
          onboarding_complete
        ),
        subscriptions (
          id,
          amount,
          status,
          customer_email,
          created_at
        )
      `)
      .eq("subscriptions.status", "active")

    if (error) {
      console.error("Error fetching attributions:", error)
      return NextResponse.json({ error: "Failed to fetch earnings data" }, { status: 500 })
    }

    // Group by developer and calculate totals
    const developerEarnings: Record<string, any> = {}

    attributions?.forEach((record: any) => {
      const devId = record.developer_id
      if (!developerEarnings[devId]) {
        developerEarnings[devId] = {
          developer: record.developers,
          totalEarnings: 0,
          subscriptionCount: 0,
          subscriptions: [],
        }
      }

      // Calculate developer's share based on attribution percentage
      const attributionPercent = record.attribution_percentage || 70
      const devShare = Math.floor((record.subscriptions.amount * attributionPercent) / 100)

      developerEarnings[devId].totalEarnings += devShare
      developerEarnings[devId].subscriptionCount += 1
      developerEarnings[devId].subscriptions.push({
        ...record.subscriptions,
        developerShare: devShare,
        attributionPercent,
      })
    })

    // Get existing payouts to calculate unpaid earnings
    const { data: existingPayouts } = await supabase
      .from("payouts")
      .select("developer_id, amount, status")
      .in("status", ["completed", "pending"])

    // Calculate unpaid earnings
    const paidAmounts: Record<string, number> = {}
    existingPayouts?.forEach((payout) => {
      if (!paidAmounts[payout.developer_id]) {
        paidAmounts[payout.developer_id] = 0
      }
      paidAmounts[payout.developer_id] += payout.amount
    })

    // Calculate final payout summary
    const payoutSummary = Object.values(developerEarnings).map((item: any) => ({
      ...item,
      totalPaid: paidAmounts[item.developer.id] || 0,
      unpaidEarnings: item.totalEarnings - (paidAmounts[item.developer.id] || 0),
    }))

    return NextResponse.json({
      payoutSummary,
      totalDevelopers: payoutSummary.length,
      totalUnpaidAmount: payoutSummary.reduce((sum, dev) => sum + dev.unpaidEarnings, 0),
    })
  } catch (error: any) {
    console.error("Calculate payouts error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
