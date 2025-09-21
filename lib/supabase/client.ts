import { createBrowserClient } from "@supabase/ssr"
import { createMockClient } from "./mock-client"

// Check if we're in development mode and if the Supabase URL is invalid
const isDevelopment = process.env.NODE_ENV === 'development'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use mock client if:
// 1. We're in development mode AND
// 2. Either the URL or key is missing/invalid
// NOTE: qgpybicovgofmklvsyts is a REAL project, not mock!
const shouldUseMockClient = isDevelopment && (
  !supabaseUrl || 
  !supabaseKey || 
  supabaseUrl.includes('your-placeholder-project') // Only mock for placeholder projects
)

export function createClient() {
  // TEMPORARY: Force real client for debugging
  console.log('🔗 [FORCED] Using real Supabase client for testing')
  console.log('Debug info:', {
    isDev: isDevelopment,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    url: supabaseUrl,
    shouldUseMock: shouldUseMockClient
  })
  
  return createBrowserClient(supabaseUrl!, supabaseKey!, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web',
      },
    },
  })
  
  // Original logic (commented out for testing):
  // if (shouldUseMockClient) {
  //   console.log('🧪 [DEV] Using mock Supabase client for local development')
  //   return createMockClient() as any
  // }
  // 
  // console.log('🔗 [PROD] Using real Supabase client')
  // return createBrowserClient(supabaseUrl!, supabaseKey!)
}
