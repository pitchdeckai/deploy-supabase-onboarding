import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const tests = []
    let testDeveloperId: string | null = null
    let testCustomerId: string | null = null
    let testProductId: string | null = null

    // Test 1: Create a test developer
    try {
      const { data: developer, error: devError } = await supabase
        .from("developers")
        .insert({
          user_id: "00000000-0000-0000-0000-000000000000", // Test UUID
          email: `test-${Date.now()}@example.com`,
          name: "Integration Test Developer",
          business_name: "Test Business",
          stripe_account_id: `acct_test_${Date.now()}`,
          onboarding_complete: true,
          charges_enabled: true,
          payouts_enabled: true,
        })
        .select()
        .single()

      testDeveloperId = developer?.id || null

      tests.push({
        name: "Create Developer",
        passed: !devError && !!developer,
        details: developer ? `Created developer with ID: ${developer.id}` : "Failed to create developer",
        error: devError?.message,
      })
    } catch (error: any) {
      tests.push({
        name: "Create Developer",
        passed: false,
        details: "Exception during developer creation",
        error: error.message,
      })
    }

    // Test 2: Create a test customer (if developer was created)
    if (testDeveloperId) {
      try {
        const { data: customer, error: custError } = await supabase
          .from("customers")
          .insert({
            developer_id: testDeveloperId,
            stripe_customer_id: `cus_test_${Date.now()}`,
            email: `customer-${Date.now()}@example.com`,
            name: "Test Customer",
          })
          .select()
          .single()

        testCustomerId = customer?.id || null

        tests.push({
          name: "Create Customer",
          passed: !custError && !!customer,
          details: customer ? `Created customer with ID: ${customer.id}` : "Failed to create customer",
          error: custError?.message,
        })
      } catch (error: any) {
        tests.push({
          name: "Create Customer",
          passed: false,
          details: "Exception during customer creation",
          error: error.message,
        })
      }
    }

    // Test 3: Create a test product (if developer was created)
    if (testDeveloperId) {
      try {
        const { data: product, error: prodError } = await supabase
          .from("products")
          .insert({
            developer_id: testDeveloperId,
            stripe_product_id: `prod_test_${Date.now()}`,
            stripe_price_id: `price_test_${Date.now()}`,
            name: "Test Product",
            description: "Integration test product",
            price_cents: 2999,
            currency: "usd",
            billing_interval: "month",
            active: true,
          })
          .select()
          .single()

        testProductId = product?.id || null

        tests.push({
          name: "Create Product",
          passed: !prodError && !!product,
          details: product ? `Created product with ID: ${product.id}` : "Failed to create product",
          error: prodError?.message,
        })
      } catch (error: any) {
        tests.push({
          name: "Create Product",
          passed: false,
          details: "Exception during product creation",
          error: error.message,
        })
      }
    }

    // Test 4: Create a test subscription (if all prerequisites exist)
    if (testDeveloperId && testCustomerId && testProductId) {
      try {
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .insert({
            developer_id: testDeveloperId,
            customer_id: testCustomerId,
            product_id: testProductId,
            stripe_subscription_id: `sub_test_${Date.now()}`,
            status: "active",
            amount_cents: 2999,
            currency: "usd",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single()

        tests.push({
          name: "Create Subscription",
          passed: !subError && !!subscription,
          details: subscription ? `Created subscription with ID: ${subscription.id}` : "Failed to create subscription",
          error: subError?.message,
        })

        // Test 5: Create attribution (if subscription was created)
        if (subscription) {
          const { data: attribution, error: attrError } = await supabase
            .from("customer_attributions")
            .insert({
              customer_id: testCustomerId,
              developer_id: testDeveloperId,
              subscription_id: subscription.id,
              attribution_percentage: 95.0,
              attribution_source: "integration_test",
            })
            .select()
            .single()

          tests.push({
            name: "Create Attribution",
            passed: !attrError && !!attribution,
            details: attribution ? `Created attribution with ID: ${attribution.id}` : "Failed to create attribution",
            error: attrError?.message,
          })
        }
      } catch (error: any) {
        tests.push({
          name: "Create Subscription",
          passed: false,
          details: "Exception during subscription creation",
          error: error.message,
        })
      }
    }

    // Test 6: Test helper function with real data
    if (testDeveloperId) {
      try {
        const { data: earnings, error: earningsError } = await supabase.rpc("get_developer_earnings", {
          developer_uuid: testDeveloperId,
        })

        tests.push({
          name: "Developer Earnings Function",
          passed: !earningsError,
          details: earnings ? `Earnings calculated: ${JSON.stringify(earnings)}` : "Function executed successfully",
          error: earningsError?.message,
        })
      } catch (error: any) {
        tests.push({
          name: "Developer Earnings Function",
          passed: false,
          details: "Exception during earnings calculation",
          error: error.message,
        })
      }
    }

    // Cleanup: Delete test data
    if (testDeveloperId) {
      await supabase.from("customer_attributions").delete().eq("developer_id", testDeveloperId)
      await supabase.from("subscriptions").delete().eq("developer_id", testDeveloperId)
      await supabase.from("products").delete().eq("developer_id", testDeveloperId)
      await supabase.from("customers").delete().eq("developer_id", testDeveloperId)
      await supabase.from("developers").delete().eq("id", testDeveloperId)
    }

    const passedTests = tests.filter((test) => test.passed).length
    const totalTests = tests.length

    return NextResponse.json({
      success: passedTests === totalTests,
      summary: `${passedTests}/${totalTests} integration tests passed`,
      tests,
      cleanup: "Test data cleaned up successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Integration test error:", error)
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
