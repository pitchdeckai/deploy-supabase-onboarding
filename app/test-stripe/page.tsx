"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function TestStripePage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(`[TEST] ${message}`);
  };

  useEffect(() => {
    if (scriptLoaded) {
      testStripeAPIs();
    }
  }, [scriptLoaded]);

  const testStripeAPIs = async () => {
    try {
      addLog("Testing Stripe APIs...");
      
      if (window.Stripe) {
        addLog(`✅ window.Stripe available: ${typeof window.Stripe}`);
        addLog(`Stripe methods: ${Object.getOwnPropertyNames(window.Stripe).join(', ')}`);
        
        try {
          const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
          addLog(`✅ Stripe instance created: ${typeof stripe}`);
          addLog(`Stripe instance methods: ${Object.getOwnPropertyNames(stripe).join(', ')}`);
          
          if (stripe.connectAccounts) {
            addLog(`✅ stripe.connectAccounts available: ${typeof stripe.connectAccounts}`);
          } else {
            addLog("❌ stripe.connectAccounts not available");
          }
        } catch (error) {
          addLog(`❌ Error creating Stripe instance: ${error}`);
        }
      } else {
        addLog("❌ window.Stripe not available");
      }

      if ((window as any).loadConnectAndInitialize) {
        addLog(`✅ window.loadConnectAndInitialize available: ${typeof (window as any).loadConnectAndInitialize}`);
      } else {
        addLog("❌ window.loadConnectAndInitialize not available");
      }

      if ((window as any).StripeConnect) {
        addLog(`✅ window.StripeConnect available: ${typeof (window as any).StripeConnect}`);
      } else {
        addLog("❌ window.StripeConnect not available");
      }

      // Check all window properties containing 'stripe' or 'connect'
      const stripeProps = Object.keys(window).filter(key => 
        key.toLowerCase().includes('stripe') || key.toLowerCase().includes('connect')
      );
      if (stripeProps.length > 0) {
        addLog(`Stripe-related window properties: ${stripeProps.join(', ')}`);
      }

    } catch (error) {
      addLog(`❌ Error in testStripeAPIs: ${error}`);
    }
  };

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => {
          addLog("Stripe.js v3 script loaded");
          setScriptLoaded(true);
        }}
        onError={() => {
          addLog("❌ Failed to load Stripe.js v3");
        }}
      />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Stripe Connect API Test</h1>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Debug Logs:</h2>
          <div className="space-y-1 font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className={log.includes('❌') ? 'text-red-600' : log.includes('✅') ? 'text-green-600' : ''}>
                {log}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={testStripeAPIs}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Re-test APIs
          </button>
        </div>
      </div>
    </>
  );
}

declare global {
  interface Window {
    Stripe: any;
  }
}