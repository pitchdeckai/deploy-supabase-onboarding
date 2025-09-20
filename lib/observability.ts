import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

type EventKind = "request" | "external"

export type NetworkEvent = {
  request_id: string
  parent_request_id?: string | null
  event_kind: EventKind
  route?: string | null
  method?: string | null
  status?: number | null
  duration_ms?: number | null
  user_id?: string | null
  ip?: string | null
  user_agent?: string | null
  referrer?: string | null
  target?: string | null
  operation?: string | null
  metadata?: any
  error?: string | null
}

export function getOrCreateRequestId(): string {
  const h = headers()
  const existing = h.get("x-request-id")
  if (existing) return existing
  const rnd = (globalThis as any).crypto?.randomUUID?.()
  if (rnd) return rnd
  // Fallback UUID v4 generator (non-crypto)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function logNetworkEvent(event: NetworkEvent) {
  try {
    const supabase = await createServerClient()
    await supabase.from("network_events").insert({
      request_id: event.request_id,
      parent_request_id: event.parent_request_id ?? null,
      event_kind: event.event_kind,
      route: event.route ?? null,
      method: event.method ?? null,
      status: event.status ?? null,
      duration_ms: event.duration_ms ?? null,
      user_id: event.user_id ?? null,
      ip: event.ip ?? null,
      user_agent: event.user_agent ?? null,
      referrer: event.referrer ?? null,
      target: event.target ?? null,
      operation: event.operation ?? null,
      metadata: event.metadata ?? null,
      error: event.error ?? null,
    })
  } catch (e) {
    console.error("Failed to log network event", e)
  }
}

export function withTrace(
  handler: (request: NextRequest, context: { requestId: string }) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const start = Date.now()
    const requestId = request.headers.get("x-request-id") || getOrCreateRequestId()

    const ua = request.headers.get("user-agent") || undefined
    const ref = request.headers.get("referer") || undefined
    const ip = request.headers.get("x-forwarded-for") || undefined

    try {
      const response = await handler(request, { requestId })

      // Propagate request id
      response.headers.set("x-request-id", requestId)

      // Best-effort: fetch user id for context
      try {
        const supabase = await createServerClient()
        const { data } = await supabase.auth.getUser()
        const userId = data.user?.id ?? null
        await logNetworkEvent({
          request_id: requestId,
          event_kind: "request",
          route: request.nextUrl?.pathname,
          method: request.method,
          status: response.status,
          duration_ms: Date.now() - start,
          user_id: userId,
          ip: ip || null,
          user_agent: ua || null,
          referrer: ref || null,
          metadata: null,
        })
      } catch (err) {
        console.error("Trace logging failed", err)
      }

      return response
    } catch (err: any) {
      // Record failure
      try {
        await logNetworkEvent({
          request_id: requestId,
          event_kind: "request",
          route: request.nextUrl?.pathname,
          method: request.method,
          status: 500,
          duration_ms: Date.now() - start,
          error: err?.message || String(err),
        })
      } catch {}

      throw err
    }
  }
}

export async function traceExternal<T>(params: {
  requestId: string
  target: string
  operation: string
  exec: () => Promise<T>
  metadata?: any
}): Promise<T> {
  const start = Date.now()
  try {
    const result = await params.exec()
    await logNetworkEvent({
      request_id: params.requestId,
      event_kind: "external",
      target: params.target,
      operation: params.operation,
      duration_ms: Date.now() - start,
      metadata: params.metadata ?? null,
    })
    return result
  } catch (err: any) {
    await logNetworkEvent({
      request_id: params.requestId,
      event_kind: "external",
      target: params.target,
      operation: params.operation,
      duration_ms: Date.now() - start,
      error: err?.message || String(err),
      metadata: params.metadata ?? null,
    })
    throw err
  }
}


