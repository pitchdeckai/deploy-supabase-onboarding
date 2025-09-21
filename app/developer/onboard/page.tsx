"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { CreditCard, Shield, DollarSign } from "lucide-react";
import { ConnectComponentsProvider, ConnectAccountOnboarding } from "@stripe/react-connect-js";
import { useStripeConnect } from "@/app/hooks/useStripeConnect";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function DeveloperOnboardPage() {
  const { stripeConnectInstance, error, accountId } = useStripeConnect();
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: developer } = await supabase
          .from("developers")
          .select("onboarding_complete")
          .eq("user_id", user.id)
          .single();
        
        if (developer?.onboarding_complete) {
          router.push("/developer/dashboard");
        } else {
          setLoading(false);
        }
      } else {
        router.push("/auth/login");
      }
    };
    
    checkOnboardingStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Account Setup</h1>
          <p className="text-muted-foreground mt-2">Fill out the information below to start receiving payouts</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Setup Progress</span>
            <span>{accountId ? "Step 2 of 3" : "Step 1 of 3"}</span>
          </div>
          <Progress value={accountId ? 66 : 33} className="h-2" />
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
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Onboarding</CardTitle>
            <CardDescription>Complete the setup with Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center p-6">
                <p className="text-destructive mb-4">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : stripeConnectInstance ? (
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <ConnectAccountOnboarding 
                  onExit={() => {
                    console.log("[Onboarding] User exited");
                    setOnboardingExited(true);
                    setTimeout(() => router.push("/developer/dashboard"), 2000);
                  }}
                />
              </ConnectComponentsProvider>
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading onboarding...</p>
                </div>
              </div>
            )}
            
            {onboardingExited && (
              <div className="text-center mt-4">
                <p className="text-muted-foreground">Onboarding exited. Redirecting to dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
