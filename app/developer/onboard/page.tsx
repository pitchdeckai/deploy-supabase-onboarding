"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Shield, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"

export default function DeveloperOnboardPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [businessName, setBusinessName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showEmbeddedOnboarding, setShowEmbeddedOnboarding] = useState(false)
  const [accountSession, setAccountSession] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
      setBusinessName(user.user_metadata?.name || "")
    }
    getUser()
  }, [router])

  useEffect(() => {
    if (showEmbeddedOnboarding && accountSession) {
      // Check if StripeConnect is already loaded
      if (window.StripeConnect) {
        initializeEmbeddedOnboarding()
        return
      }

      const script = document.createElement("script")
      // Use the Connect onboarding script
      script.src = "https://connect-js.stripe.com/v1.0/connect.js"
      script.async = true
      script.onload = () => {
        initializeEmbeddedOnboarding()
      }
      script.onerror = () => {
        console.error("[v0] Failed to load Stripe Connect script")
        setError("Failed to load payment provider. Please refresh and try again.")
        setShowEmbeddedOnboarding(false)
      }
      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [showEmbeddedOnboarding, accountSession])

  const checkOnboardingStatus = async () => {
    try {
      const supabase = createClient()
      const { data: developer } = await supabase
        .from("developers")
        .select("onboarding_complete, charges_enabled, payouts_enabled")
        .eq("user_id", user?.id)
        .single()

      if (developer?.onboarding_complete) {
        console.log("[v0] Onboarding complete, redirecting to dashboard")
        router.push("/developer/dashboard")
      } else {
        console.log("[v0] Onboarding not yet complete")
        // User exited without completing, they can retry
      }
    } catch (error) {
      console.error("[v0] Error checking onboarding status:", error)
    }
  }

  const initializeEmbeddedOnboarding = () => {
    console.log("[v0] Initializing embedded onboarding...")
    console.log("[v0] StripeConnect available:", !!window.StripeConnect)
    console.log("[v0] Account session available:", !!accountSession)
    console.log("[v0] Publishable key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Not set")

    if (typeof window !== "undefined" && window.StripeConnect && accountSession) {
      try {
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          throw new Error("Stripe publishable key is not configured")
        }

        const stripeConnectInstance = window.StripeConnect(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

        const embeddedComponentManager = stripeConnectInstance.create("account-onboarding", {
          collectionOptions: {
            fields: 'currently_due',
            futureRequirements: 'include',
          },
          onExit: () => {
            console.log("[v0] User exited onboarding")
            setShowEmbeddedOnboarding(false)
            // Check if onboarding was completed
            checkOnboardingStatus()
          },
        })

        embeddedComponentManager.setClientSecret(accountSession)
        embeddedComponentManager.mount("#account-onboarding")
        console.log("[v0] Embedded onboarding mounted successfully")
      } catch (error) {
        console.error("[v0] Error initializing embedded onboarding:", error)
        setError(error instanceof Error ? error.message : "Failed to initialize onboarding. Please try again.")
        setShowEmbeddedOnboarding(false)
      }
    } else {
      console.warn("[v0] Missing requirements for embedded onboarding")
      if (!window.StripeConnect) {
        console.warn("[v0] StripeConnect not loaded yet")
      }
      if (!accountSession) {
        console.warn("[v0] Account session not available")
      }
    }
  }

  const startOnboarding = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/developer/create-account-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: businessName || user.user_metadata?.name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account session")
      }

      console.log("[v0] Account session received:", data.clientSecret ? "Yes" : "No")
      setAccountSession(data.clientSecret)
      setShowEmbeddedOnboarding(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (showEmbeddedOnboarding) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-foreground">Complete Your Account Setup</h1>
            <p className="text-muted-foreground mt-2">Fill out the information below to start receiving payouts</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div id="account-onboarding" className="min-h-[600px]">
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading Stripe Connect onboarding...</p>
                    <p className="text-xs text-muted-foreground mt-2">This may take a few seconds</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setShowEmbeddedOnboarding(false)}>
              ← Back to Setup
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Welcome, {user.user_metadata?.name || "Developer"}!</h1>
            <p className="text-muted-foreground mt-2 text-lg">Let&apos;s set up your payout account to start earning</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Setup Progress</span>
              <span>Step 1 of 3</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Secure Setup</h3>
                <p className="text-sm text-muted-foreground mt-2">Bank-level security powered by Stripe</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Quick Verification</h3>
                <p className="text-sm text-muted-foreground mt-2">Simple identity and bank verification</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Start Earning</h3>
                <p className="text-sm text-muted-foreground mt-2">Receive 70% of subscription revenue</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Account Information</CardTitle>
              <CardDescription>This information will be used for your payout account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="business-name">Business Name (Optional)</Label>
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="Your business or personal name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">This will appear on your payout statements</p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={startOnboarding} disabled={loading} className="w-full" size="lg">
                  {loading ? "Setting up account..." : "Continue to Account Setup →"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Complete your account setup without leaving this page
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
