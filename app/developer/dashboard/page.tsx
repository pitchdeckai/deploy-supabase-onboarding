export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, DollarSign, TrendingUp, Users, CreditCard, Package } from "lucide-react"
import { ExpressDashboardButton } from "./interactive-buttons"
import Link from "next/link"

export default async function DeveloperDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get developer info
  const { data: developer } = await supabase.from("developers").select("*").eq("user_id", user.id).single()

  const { data: subscriptions } = await supabase.from("subscriptions").select("*").eq("developer_id", developer?.id)

  const { data: customers } = await supabase.from("customers").select("*").eq("developer_id", developer?.id)

  const { data: products } = await supabase.from("products").select("*").eq("developer_id", developer?.id)

  // For now, we'll rely on the database for account status
  // Stripe API calls should be made from API routes, not directly in server components
  const stripeAccountId = developer?.stripe_account_id
  const isOnboardingComplete = developer?.onboarding_complete || false

  // Get payout history from database
  const { data: payoutHistory } = await supabase
    .from("payouts")
    .select("*")
    .eq("developer_id", developer?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const totalEarnings = payoutHistory?.reduce((sum, payout) => sum + (payout.amount || 0), 0) || 0
  // These will be fetched from the database or via API routes
  const availableBalance = 0 // TODO: Fetch from Stripe via API route
  const pendingBalance = 0 // TODO: Fetch from Stripe via API route

  const activeSubscriptions = subscriptions?.filter((sub) => sub.status === "active").length || 0
  const totalCustomers = customers?.length || 0
  const totalProducts = products?.length || 0
  const monthlyRevenue =
    subscriptions?.filter((sub) => sub.status === "active").reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Express Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {developer?.business_name || user.user_metadata?.name || user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <ExpressDashboardButton stripeAccountId={stripeAccountId} />
          </div>
        </div>

        {/* Account Status Alert */}
        {!isOnboardingComplete && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-900 dark:text-amber-100">Action Required</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 dark:text-amber-200 mb-4">
                Complete your account setup to start receiving payouts
              </p>
              <Link href="/developer/onboard">
                <Button className="bg-amber-600 hover:bg-amber-700">Complete Setup</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(availableBalance / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready for payout</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(pendingBalance / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalEarnings / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              {isOnboardingComplete ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isOnboardingComplete ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
                ) : (
                  <Badge variant="secondary">Setup Required</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOnboardingComplete ? "Ready to accept payments" : "Complete verification"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/developer/products">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Products</CardTitle>
                </div>
                <CardDescription>Manage your SaaS products and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Products →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/developer/subscriptions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Subscriptions</CardTitle>
                </div>
                <CardDescription>View and manage customer subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  View Subscriptions →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/developer/customers">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Customers</CardTitle>
                </div>
                <CardDescription>Manage customer relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Customers →
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Account Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Account Requirements</CardTitle>
              <CardDescription>Complete these steps to activate your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isOnboardingComplete ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">Account verification pending</span>
                    </div>
                  </div>
                  <Link href="/developer/onboard">
                    <Button className="w-full">Complete Requirements</Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">All requirements completed</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payouts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Your latest payout history</CardDescription>
            </CardHeader>
            <CardContent>
              {payoutHistory && payoutHistory.length > 0 ? (
                <div className="space-y-3">
                  {payoutHistory.slice(0, 5).map((payout: any) => (
                    <div key={payout.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">${(payout.amount / 100).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payout.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={payout.status === "completed" ? "default" : "secondary"}>{payout.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payouts yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
