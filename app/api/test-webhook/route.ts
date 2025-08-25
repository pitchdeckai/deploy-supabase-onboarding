import { type NextRequest, NextResponse } from "next/server"

// Test endpoint to simulate webhook events for development
export async function POST(request: NextRequest) {
  try {
    const { eventType, data } = await request.json()

    // Simulate webhook payload
    const webhookPayload = {
      id: `evt_test_${Date.now()}`,
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: data,
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null,
      },
      type: eventType,
    }

    // Send to our webhook handler
    const webhookResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/stripe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "test_signature", // This would normally be verified
        },
        body: JSON.stringify(webhookPayload),
      },
    )

    const result = await webhookResponse.json()

    return NextResponse.json({
      success: true,
      webhookResponse: result,
      simulatedEvent: webhookPayload,
    })
  } catch (error: any) {
    console.error("Test webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
