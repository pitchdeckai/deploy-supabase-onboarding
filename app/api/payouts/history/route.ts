import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const developerId = searchParams.get("developerId")

    const supabase = await createClient()

    let query = supabase
      .from("payouts")
      .select(`
        *,
        developers (
          id,
          email,
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (developerId) {
      query = query.eq("developer_id", developerId)
    }

    const { data: payouts, error } = await query

    if (error) {
      console.error("Error fetching payout history:", error)
      return NextResponse.json({ error: "Failed to fetch payout history" }, { status: 500 })
    }

    // Calculate summary statistics
    const summary = {
      totalPayouts: payouts?.length || 0,
      totalAmount: payouts?.reduce((sum, payout) => sum + payout.amount, 0) || 0,
      completedPayouts: payouts?.filter((p) => p.status === "completed").length || 0,
      pendingPayouts: payouts?.filter((p) => p.status === "pending").length || 0,
      failedPayouts: payouts?.filter((p) => p.status === "failed").length || 0,
    }

    return NextResponse.json({
      payouts: payouts || [],
      summary,
    })
  } catch (error: any) {
    console.error("Payout history error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
