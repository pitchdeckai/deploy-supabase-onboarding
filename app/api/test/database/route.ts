import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const tests = []

    // Test 1: Check if all tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", [
        "developers",
        "customers",
        "products",
        "subscriptions",
        "customer_attributions",
        "payouts",
        "transactions",
      ])

    tests.push({
      name: "Tables Exist",
      passed: !tablesError && tables?.length === 7,
      details: `Found ${tables?.length || 0} out of 7 required tables`,
      error: tablesError?.message,
    })

    // Test 2: Check helper functions
    try {
      const { data: platformRevenue, error: revenueError } = await supabase.rpc("get_platform_revenue")
      tests.push({
        name: "Platform Revenue Function",
        passed: !revenueError,
        details: platformRevenue ? "Function returns data" : "Function exists but no data",
        error: revenueError?.message,
      })
    } catch (error: any) {
      tests.push({
        name: "Platform Revenue Function",
        passed: false,
        details: "Function call failed",
        error: error.message,
      })
    }

    // Test 3: Check data integrity function
    try {
      const { data: integrityCheck, error: integrityError } = await supabase.rpc("validate_data_integrity")
      tests.push({
        name: "Data Integrity Validation",
        passed: !integrityError,
        details: integrityCheck ? `Found ${integrityCheck.length} integrity issues` : "No integrity issues",
        error: integrityError?.message,
      })
    } catch (error: any) {
      tests.push({
        name: "Data Integrity Validation",
        passed: false,
        details: "Integrity check failed",
        error: error.message,
      })
    }

    // Test 4: Check views
    const { data: dashboardSummary, error: dashboardError } = await supabase
      .from("developer_dashboard_summary")
      .select("*")
      .limit(1)

    tests.push({
      name: "Dashboard Summary View",
      passed: !dashboardError,
      details: dashboardSummary ? "View accessible" : "View exists but no data",
      error: dashboardError?.message,
    })

    // Test 5: Check subscription analytics view
    const { data: subscriptionAnalytics, error: analyticsError } = await supabase
      .from("subscription_analytics")
      .select("*")
      .limit(1)

    tests.push({
      name: "Subscription Analytics View",
      passed: !analyticsError,
      details: subscriptionAnalytics ? "View accessible" : "View exists but no data",
      error: analyticsError?.message,
    })

    const passedTests = tests.filter((test) => test.passed).length
    const totalTests = tests.length

    return NextResponse.json({
      success: passedTests === totalTests,
      summary: `${passedTests}/${totalTests} tests passed`,
      tests,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
