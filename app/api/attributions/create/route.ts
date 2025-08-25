import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, developerId, attributionPercentage = 70 } = await request.json()

    if (!subscriptionId || !developerId) {
      return NextResponse.json({ error: "Subscription ID and Developer ID are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify subscription exists
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("id, customer_email, amount")
      .eq("id", subscriptionId)
      .single()

    if (subError || !subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Verify developer exists
    const { data: developer, error: devError } = await supabase
      .from("developers")
      .select("id, email")
      .eq("id", developerId)
      .single()

    if (devError || !developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 })
    }

    // Create attribution
    const { data: attribution, error } = await supabase
      .from("customer_attributions")
      .insert({
        subscription_id: subscriptionId,
        developer_id: developerId,
        attribution_percentage: attributionPercentage,
      })
      .select()
      .single()

    if (error) {
      console.error("Failed to create attribution:", error)
      return NextResponse.json({ error: "Failed to create attribution" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      attribution,
      subscription,
      developer,
    })
  } catch (error: any) {
    console.error("Create attribution error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
