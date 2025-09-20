import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/developer/dashboard"
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  // Handle errors from Supabase
  if (error) {
    console.error("Auth callback error:", error, error_description)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      // Exchange code for session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error("Code exchange error:", exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        )
      }

      // Check if this is a new user (first time confirming email)
      if (data?.user) {
        const { data: developer } = await supabase
          .from("developers")
          .select("id")
          .eq("user_id", data.user.id)
          .single()

        // If no developer profile exists, redirect to onboarding
        if (!developer) {
          return NextResponse.redirect(new URL("/developer/onboard", requestUrl.origin))
        }
        
        // For existing users with developer profile, go to dashboard
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }
    } catch (err) {
      console.error("Unexpected error in auth callback:", err)
      return NextResponse.redirect(
        new URL("/auth/login?error=unexpected_error", requestUrl.origin)
      )
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}
