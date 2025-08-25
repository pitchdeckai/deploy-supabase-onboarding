import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get customer details with subscription history
    const { data: customerHistory, error } = await supabase.rpc("get_customer_history", { customer_uuid: params.id })

    if (error) {
      console.error("Error fetching customer history:", error)
      return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 })
    }

    // Get customer basic info
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", params.id)
      .eq("developer_id", developer.id)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      customer,
      history: customerHistory || [],
    })
  } catch (error: any) {
    console.error("Customer details error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
