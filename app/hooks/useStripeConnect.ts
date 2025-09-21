"use client";

import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { createClient } from "@/lib/supabase/client";

export function useStripeConnect() {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch accountId from Supabase
  useEffect(() => {
    async function fetchAccountId() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("User not authenticated");
        
        const { data: developer, error } = await supabase
          .from("developers")
          .select("stripe_account_id")
          .eq("user_id", user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          throw error;
        }
        
        if (!developer?.stripe_account_id) {
          // Create new account if none exists
          const res = await fetch("/api/developer/create-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: user.email, 
              name: user.user_metadata?.name 
            }),
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to create account");
          }
          
          const { account } = await res.json();
          setAccountId(account);
          
          // Update Supabase with the new account ID
          await supabase
            .from("developers")
            .upsert({
              user_id: user.id,
              stripe_account_id: account,
              email: user.email,
              name: user.user_metadata?.name || null,
              onboarding_complete: false,
              charges_enabled: false,
              payouts_enabled: false,
              stripe_account_status: 'pending'
            }, {
              onConflict: 'user_id'
            });
        } else {
          setAccountId(developer.stripe_account_id);
        }
      } catch (err) {
        console.error("[useStripeConnect] Error:", err);
        setError(err instanceof Error ? err.message : "Failed to load account");
      }
    }
    
    fetchAccountId();
  }, []);

  // Initialize Stripe Connect when accountId is ready
  useEffect(() => {
    if (accountId && !stripeConnectInstance) {
      const fetchClientSecret = async () => {
        try {
          const res = await fetch("/api/developer/create-account-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountId }),
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch client secret");
          }
          
          const { clientSecret } = await res.json();
          return clientSecret;
        } catch (err) {
          console.error("[fetchClientSecret] Error:", err);
          setError(err instanceof Error ? err.message : "Failed to fetch session");
          throw err;
        }
      };

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        setError("Stripe publishable key not configured");
        return;
      }

      try {
        const instance = loadConnectAndInitialize({
          publishableKey,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: { 
              colorPrimary: "#635bff",
              borderRadius: "8px",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            },
          },
        });
        
        setStripeConnectInstance(instance);
      } catch (err) {
        console.error("[loadConnectAndInitialize] Error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize Stripe Connect");
      }
    }
  }, [accountId, stripeConnectInstance]);

  return { stripeConnectInstance, error, accountId };
}