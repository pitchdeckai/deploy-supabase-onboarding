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
          Use these pre-configured test accounts to sign in during development:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {TEST_CREDENTIALS.map((cred, index) => (
          <div key={index} className="bg-white p-3 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-sm text-orange-800 mb-2">{cred.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{cred.email}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(cred.email, 'Email')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Password:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{cred.password}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(cred.password, 'Password')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can also create new accounts using the sign-up form with any email/password combination. 
            This mock system will automatically "register" new users for development purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}