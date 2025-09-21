import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import Stripe from "stripe"
import { withTrace, traceExternal } from "@/lib/observability"
export const POST = withTrace(async (request: NextRequest, { requestId }) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY environment variable is not configured" }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-07-30.basil",
    })
    const { email, name, accountId } = await request.json()

    // If accountId is provided, use it directly (for refresh flow)
    if (accountId) {
      console.log("[v0] Using provided account ID:", accountId)
      const accountSession = await traceExternal({
        requestId,
        target: "stripe",
        operation: "accountSessions.create",
        metadata: { account: accountId },
        exec: () => stripe.accountSessions.create({
          account: accountId,
          components: { account_onboarding: { enabled: true } },
        })
      })

      return NextResponse.json({
        clientSecret: accountSession.client_secret,
        accountId: accountId,
      })
    }

    // Otherwise, require email for new account creation
    if (!email) {
      return NextResponse.json({ error: "Email or accountId is required" }, { status: 400 })
    }

    console.log("[v0] Creating account session for:", email)

    // Create Supabase client
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if developer already exists
    const { data: existingDeveloper } = await supabase
      .from("developers")
      .select("id, stripe_account_id, onboarding_complete")
      .eq("user_id", user.id)
      .single()

    let stripeAccountId = existingDeveloper?.stripe_account_id
    let developerId = existingDeveloper?.id

    // Create Stripe account if it doesn't exist
    if (!stripeAccountId) {
      console.log("[v0] Creating new Stripe account")
      const account = await traceExternal({
        requestId,
        target: "stripe",
        operation: "accounts.create",
        metadata: { email, name },
        exec: () => stripe.accounts.create({
          email: email,
          controller: {
            fees: { payer: "application" as const },
            losses: { payments: "application" as const },
            stripe_dashboard: { type: "express" as const },
          },
          capabilities: { transfers: { requested: true } },
          business_profile: { name: name || undefined },
        })
      })

      stripeAccountId = account.id

      // Upsert developer record
      const { data: upsertedDeveloper, error: upsertError } = await supabase
        .from("developers")
        .upsert({
          user_id: user.id,
          email: email,
          name: name || null,
          stripe_account_id: stripeAccountId,
          onboarding_complete: false,
          charges_enabled: false,
          payouts_enabled: false,
          stripe_account_status: 'pending',
        }, {
          onConflict: 'user_id',
        })
        .select()
        .single()

      if (upsertError) {
        console.log("[v0] Database upsert error:", upsertError)
        // Try to delete the Stripe account if database operation fails
        try {
          await stripe.accounts.del(stripeAccountId)
        } catch (deleteError) {
          console.error("[v0] Failed to cleanup Stripe account:", deleteError)
        }
        return NextResponse.json({ error: "Failed to store developer account" }, { status: 500 })
      }
      
      developerId = upsertedDeveloper?.id
    }

    // Create account session for embedded onboarding
    console.log("[v0] Creating account session for account:", stripeAccountId)
    const accountSession = await traceExternal({
      requestId,
      target: "stripe",
      operation: "accountSessions.create",
      metadata: { account: stripeAccountId },
      exec: () => stripe.accountSessions.create({
        account: stripeAccountId!,
        components: { account_onboarding: { enabled: true } },
      })
    })

    console.log("[v0] Account session created successfully")

    return NextResponse.json({
      clientSecret: accountSession.client_secret,
      accountId: stripeAccountId,
    })
  } catch (error) {
    console.error("[v0] Account session creation error:", error)

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("[v0] Error name:", error.name)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }

    // Provide more specific error messages
    let errorMessage = "Failed to create account session"
    if (error instanceof Error) {
      if (error.message.includes("controller")) {
        errorMessage = "Stripe account configuration error. Please check your platform settings."
      } else if (error.message.includes("database") || error.message.includes("insert")) {
        errorMessage = "Database error while storing account information."
      } else if (error.message.includes("auth")) {
        errorMessage = "Authentication error. Please log in again."
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 },
    )
  }
})
