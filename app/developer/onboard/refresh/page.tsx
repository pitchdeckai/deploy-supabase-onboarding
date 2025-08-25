"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingRefreshPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const refreshOnboarding = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get developer ID from localStorage or session
      const developerId = localStorage.getItem("developerId")
      if (!developerId) {
        router.push("/developer/onboard")
        return
      }

      const res = await fetch("/api/developer/onboarding-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developerId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to refresh onboarding")
      }

      // Redirect to new onboarding link
      window.location.href = data.onboardingUrl
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Onboarding Interrupted</CardTitle>
            <CardDescription>Your onboarding session has expired or was interrupted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t worry! You can continue where you left off. Click the button below to resume your onboarding
              process.
            </p>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button onClick={refreshOnboarding} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Continue Onboarding"
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push("/developer/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
