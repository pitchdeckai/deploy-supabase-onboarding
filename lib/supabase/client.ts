import { createBrowserClient } from "@supabase/ssr"
import { createMockClient } from "./mock-client"

// Check if we're in development mode and if the Supabase URL is invalid
const isDevelopment = process.env.NODE_ENV === 'development'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use mock client if:
// 1. We're in development mode AND
// 2. Either the URL or key is missing/invalid
const shouldUseMockClient = isDevelopment && (
  !supabaseUrl || 
  !supabaseKey || 
  supabaseUrl.includes('qgpybicovgofmklvsyts') // The non-existent project
)

export function createClient() {
  if (shouldUseMockClient) {
    console.log('🧪 [DEV] Using mock Supabase client for local development')
    return createMockClient() as any
  }
  
  console.log('🔗 [PROD] Using real Supabase client')
  return createBrowserClient(supabaseUrl!, supabaseKey!)
}
