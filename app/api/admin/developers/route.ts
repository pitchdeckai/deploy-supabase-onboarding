import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all developers with their information
    const { data: developers, error } = await supabase
      .from("developers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching developers:", error)
      return NextResponse.json({ error: "Failed to fetch developers" }, { status: 500 })
    }

    return NextResponse.json({
      developers: developers || [],
      count: developers?.length || 0,
    })
  } catch (error: any) {
    console.error("Admin developers error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
