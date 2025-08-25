import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get developer record
    const { data: developer, error: devError } = await supabase
      .from("developers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (devError || !developer) {
      return NextResponse.json({ error: "Developer profile not found" }, { status: 404 })
    }

    // Get customers with their subscription details using the new schema
    const { data: customers, error } = await supabase
      .from("customer_ltv")
      .select("*")
      .eq("developer_id", developer.id)
      .order("total_spent", { ascending: false })

    if (error) {
      console.error("Error fetching customers:", error)
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
    }

    return NextResponse.json({
      customers: customers || [],
      count: customers?.length || 0,
    })
  } catch (error: any) {
    console.error("Customer list error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
