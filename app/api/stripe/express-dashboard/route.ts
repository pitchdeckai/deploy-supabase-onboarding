import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

import Stripe from "stripe"
import { withTrace, traceExternal } from "@/lib/observability"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export const POST = withTrace(async (request: NextRequest, { requestId }) => {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: developer } = await supabase.from("developers").select("*").eq("user_id", user.id).single()

    if (!developer?.stripe_account_id) {
      return NextResponse.json({ error: "No Stripe account found" }, { status: 404 })
    }

    // Create Express Dashboard login link
    const loginLink = await traceExternal({
      requestId,
      target: "stripe",
      operation: "accounts.createLoginLink",
      metadata: { account: developer.stripe_account_id },
      exec: () => stripe.accounts.createLoginLink(developer.stripe_account_id)
    })

    return NextResponse.json({ url: loginLink.url })
  } catch (error) {
    console.error("Error creating Express dashboard link:", error)
    return NextResponse.json({ error: "Failed to create dashboard link" }, { status: 500 })
  }
})
