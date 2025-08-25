import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, priceId, developerId } = await request.json()

    if (!customerEmail || !priceId) {
      return NextResponse.json({ error: "Customer email and price ID are required" }, { status: 400 })
    }

    // Create or retrieve Stripe customer
    let customer
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
      })
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })

    const supabase = await createClient()

    // Store subscription in database
    const { data: subscriptionRecord, error: subError } = await supabase
      .from("subscriptions")
      .insert({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customer.id,
        customer_email: customerEmail,
        amount: subscription.items.data[0].price.unit_amount,
        status: subscription.status,
      })
      .select()
      .single()

    if (subError) {
      console.error("Failed to store subscription:", subError)
      return NextResponse.json({ error: "Failed to store subscription" }, { status: 500 })
    }

    // Create attribution if developer ID provided
    if (developerId) {
      const { error: attrError } = await supabase.from("customer_attributions").insert({
        subscription_id: subscriptionRecord.id,
        developer_id: developerId,
        attribution_percentage: 70,
      })

      if (attrError) {
        console.error("Failed to create attribution:", attrError)
      }
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        client_secret: subscription.latest_invoice.payment_intent.client_secret,
      },
      customer: {
        id: customer.id,
        email: customer.email,
      },
    })
  } catch (error: any) {
    console.error("Create subscription error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
