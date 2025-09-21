"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { CreditCard, Shield, DollarSign } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    loadConnectAndInitialize: (options: {
      publishableKey: string;
      fetchClientSecret: () => Promise<string>;
      appearance?: { theme: string; variables: { [key: string]: string } };
    }) => any;
  }
}

export const dynamic = "force-dynamic";

export default function DeveloperOnboardPage() {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showEmbeddedOnboarding, setShowEmbeddedOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      setBusinessName(user.user_metadata?.name || "");
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (showEmbeddedOnboarding && user && scriptLoaded) {
      initializeEmbeddedOnboarding().catch((error) => {
        console.error("[v0] Failed to initialize onboarding:", error);
        setError(error.message || "Failed to initialize onboarding");
        setShowEmbeddedOnboarding(false);
      });
    }
  }, [showEmbeddedOnboarding, user, scriptLoaded]);

  const checkOnboardingStatus = async () => {
    try {
      const supabase = createClient();
      const { data: developer } = await supabase
        .from("developers")
        .select("onboarding_complete, charges_enabled, payouts_enabled")
        .eq("user_id", user?.id)
        .single();
      if (developer?.onboarding_complete) {
        console.log("[v0] Onboarding complete, redirecting to dashboard");
        router.push("/developer/dashboard");
      } else {
        console.log("[v0] Onboarding not yet complete");
      }
    } catch (error) {
      console.error("[v0] Error checking onboarding status:", error);
    }
  };

  const fetchClientSecret = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      console.log("[v0] Fetching client secret for user:", user.email);
      const res = await fetch("/api/developer/create-account-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: businessName || user.user_metadata?.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account session");
      }
      console.log("[v0] Client secret fetched successfully");
      return data.clientSecret;
    } catch (error) {
      console.error("[v0] Error fetching client secret:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch account session");
      throw error;
    }
  };

  const initializeEmbeddedOnboarding = async () => {
    console.log("[v0] Initializing embedded onboarding...");
    if (typeof window === "undefined" || !user) {
      console.warn("[v0] Missing requirements: window or user");
      return;
    }
    try {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key is not configured");
      }
      if (!window.loadConnectAndInitialize) {
        let attempts = 0;
        const maxAttempts = 100; // 10s timeout
        while (!window.loadConnectAndInitialize && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        if (!window.loadConnectAndInitialize) {
          throw new Error("Stripe Connect script failed to load after timeout. Check network or CDN.");
        }
      }
      console.log("[v0] loadConnectAndInitialize available");

      const stripeConnect = window.loadConnectAndInitialize({
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        fetchClientSecret,
        appearance: {
          theme: "stripe",
          variables: { colorPrimary: "#635bff", colorText: "#30313d" },
        },
      });

      console.log("[v0] StripeConnect instance created successfully");
      console.log("[v0] StripeConnect instance methods:", Object.getOwnPropertyNames(stripeConnect));

      const embeddedComponent = stripeConnect.create("account-onboarding");
      console.log("[v0] Component created successfully");
      console.log("[v0] Component methods:", Object.getOwnPropertyNames(embeddedComponent));

      if (typeof embeddedComponent.mount !== "function") {
        console.error("[v0] Mount method missing. Available methods:", Object.getOwnPropertyNames(embeddedComponent));
        throw new Error("Component does not have mount method. Check Stripe Connect API version or initialization.");
      }

      const container = document.getElementById("account-onboarding");
      if (!container) {
        throw new Error("Container #account-onboarding not found in DOM");
      }
      embeddedComponent.mount("#account-onboarding");
      console.log("[v0] Embedded onboarding mounted successfully");

      embeddedComponent.on("ready", () => console.log("[v0] Onboarding component ready"));
      embeddedComponent.on("exit", () => {
        console.log("[v0] User exited onboarding");
        setShowEmbeddedOnboarding(false);
        checkOnboardingStatus();
      });
      embeddedComponent.on("complete", () => {
        console.log("[v0] Onboarding complete");
        setTimeout(() => router.push("/developer/dashboard"), 1000);
      });
    } catch (error) {
      console.error("[v0] Error initializing embedded onboarding:", error);
      setError(error instanceof Error ? error.message : "Failed to initialize onboarding. Please try again.");
      setShowEmbeddedOnboarding(false);
    }
  };

  const startOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      console.log("[v0] Starting embedded onboarding for user:", user.email);
      setShowEmbeddedOnboarding(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Script
        src="https://js.stripe.com/v1/connect.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("[v0] Stripe Connect script loaded successfully");
          console.log("[v0] loadConnectAndInitialize available:", typeof window.loadConnectAndInitialize === "function");
          setScriptLoaded(true);
        }}
        onError={() => {
          console.error("[v0] Failed to load Stripe Connect script");
          setError("Failed to load payment provider. Please refresh and try again.");
          setLoading(false);
        }}
      />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl">
          {showEmbeddedOnboarding ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-foreground">Complete Your Account Setup</h1>
                <p className="text-muted-foreground mt-2">Fill out the information below to start receiving payouts</p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div id="account-onboarding" className="min-h-[600px]">
                    {error ? (
                      <div className="text-center">
                        <p className="text-destructive">{error}</p>
                        <Button
                          variant="outline"
                          onClick={() => setShowEmbeddedOnboarding(false)}
                          className="mt-4"
                        >
                          ← Back to Setup
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[600px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading Stripe Connect onboarding...</p>
                          <p className="text-xs text-muted-foreground mt-2">This may take a few seconds</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => setShowEmbeddedOnboarding(false)}>
                  ← Back to Setup
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground">
                  Welcome, {user.user_metadata?.name || "Developer"}!
                </h1>
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
          )}
        </div>
      </div>
    </>
  );
}