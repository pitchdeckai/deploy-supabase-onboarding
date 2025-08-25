import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertCircle, DollarSign, TrendingUp, Users, CreditCard, Settings } from "lucide-react"
import { ExpressDashboardButton, ExportPayoutsButton, GenerateReportButton } from "./interactive-buttons"
import Link from "next/link"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

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

  // Get Stripe account details if developer exists
  let stripeAccount = null
  let balance = null
  let payouts = []

  if (developer?.stripe_account_id) {
    try {
      stripeAccount = await stripe.accounts.retrieve(developer.stripe_account_id)
      balance = await stripe.balance.retrieve({ stripeAccount: developer.stripe_account_id })
      const stripePayouts = await stripe.payouts.list({
        stripeAccount: developer.stripe_account_id,
        limit: 10,
      })
      payouts = stripePayouts.data
    } catch (error) {
      console.error("Error fetching Stripe data:", error)
    }
  }

  // Get payout history from database
  const { data: payoutHistory } = await supabase
    .from("payouts")
    .select("*")
    .eq("developer_id", developer?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const totalEarnings = payoutHistory?.reduce((sum, payout) => sum + (payout.amount || 0), 0) || 0
  const availableBalance = balance?.available?.[0]?.amount || 0
  const pendingBalance = balance?.pending?.[0]?.amount || 0

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Express Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {stripeAccount?.business_profile?.name || user.user_metadata?.name || user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/developer/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <ExpressDashboardButton stripeAccountId={developer?.stripe_account_id} />
          </div>
        </div>

        {/* Account Status Alert */}
        {!developer?.onboarding_complete && (
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
              {stripeAccount?.charges_enabled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stripeAccount?.charges_enabled ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
                ) : (
                  <Badge variant="secondary">Setup Required</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stripeAccount?.charges_enabled ? "Ready to accept payments" : "Complete verification"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Account Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Requirements</CardTitle>
                  <CardDescription>Complete these steps to activate your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stripeAccount?.requirements?.currently_due?.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        {stripeAccount.requirements.currently_due.map((requirement: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm capitalize">{requirement.replace(/_/g, " ")}</span>
                          </div>
                        ))}
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

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payouts</CardTitle>
                  <CardDescription>Your latest payout history</CardDescription>
                </CardHeader>
                <CardContent>
                  {payouts.length > 0 ? (
                    <div className="space-y-3">
                      {payouts.slice(0, 5).map((payout: any) => (
                        <div key={payout.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">${(payout.amount / 100).toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payout.created * 1000).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={payout.status === "paid" ? "default" : "secondary"}>{payout.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No payouts yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payout History</CardTitle>
                    <CardDescription>All your payouts and transfers</CardDescription>
                  </div>
                  <ExportPayoutsButton />
                </div>
              </CardHeader>
              <CardContent>
                {payouts.length > 0 ? (
                  <div className="space-y-4">
                    {payouts.map((payout: any) => (
                      <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">${(payout.amount / 100).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payout.created * 1000).toLocaleDateString()} • Arrives{" "}
                              {new Date(payout.arrival_date * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={payout.status === "paid" ? "default" : "secondary"}>{payout.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payouts yet</p>
                    <p className="text-sm text-muted-foreground">Payouts will appear here once you start earning</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Overview</CardTitle>
                <CardDescription>Manage your customer relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No customers yet</p>
                  <p className="text-sm text-muted-foreground">
                    Customer data will appear here once you start processing payments
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Download detailed reports of your earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Reports will be available once you have transaction data</p>
                  <GenerateReportButton />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
