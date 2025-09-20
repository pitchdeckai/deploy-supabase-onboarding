"use client"

import { TEST_CREDENTIALS } from "@/lib/supabase/mock-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export function TestCredentialsHelper() {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
          🧪 Development Mode - Test Credentials
        </CardTitle>
        <CardDescription className="text-orange-700">
          Create new test accounts or use existing ones to test the authentication flow:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-sm text-orange-800 mb-3">📝 Quick Test Setup</h4>
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-green-800 font-medium mb-2">✨ Ready-to-Use Test Accounts:</p>
              <ol className="text-green-700 space-y-1 list-decimal list-inside">
                <li>Go to the <strong>Sign Up</strong> page</li>
                <li>Use one of the test emails below (e.g., <code className="bg-green-100 px-1 rounded">developer@test.com</code>)</li>
                <li>Use password: <code className="bg-green-100 px-1 rounded">password123</code></li>
                <li>The system will automatically create your profile and data</li>
                <li>Then you can <strong>Login</strong> with the same credentials</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-blue-800 font-medium mb-2">🔑 Or Use These Test Emails:</p>
              {TEST_CREDENTIALS.map((cred, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-mono text-xs">{cred.email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(cred.email, 'Email')}
                      className="h-5 w-5 p-0 text-blue-600"
                    >
                      <Copy size={10} />
                    </Button>
                  </div>
                </div>
              ))}
              <p className="text-blue-600 text-xs mt-2">Password: <code className="bg-blue-100 px-1 rounded">password123</code></p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded border border-amber-200">
          <p className="text-amber-800 text-sm">
            <strong>⚠️ Important:</strong> Create the account via sign-up first, then use it to log in. 
            The dashboard requires a developer profile to function properly.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}