import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/payout-utils"
import { Users, DollarSign, CreditCard, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // For demo purposes, we'll assume admin access
  // In production, you'd check for admin role/permissions

  // Get overview statistics
  const [
    { data: developers, count: developerCount },
    { data: subscriptions },
    { data: payouts },
    { data: attributions },
  ] = await Promise.all([
    supabase.from("developers").select("*", { count: "exact" }),
    supabase.from("subscriptions").select("*").eq("status", "active"),
    supabase.from("payouts").select("*"),
    supabase.from("customer_attributions").select("*"),
  ])

  const totalRevenue = subscriptions?.reduce((sum, sub) => sum + sub.amount, 0) || 0
  const totalPayouts = payouts?.reduce((sum, payout) => sum + payout.amount, 0) || 0
  const activeDevelopers = developers?.filter((dev) => dev.onboarding_complete).length || 0

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage developers, payouts, and platform revenue</p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Developers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{developerCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {activeDevelopers} active, {(developerCount || 0) - activeDevelopers} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{subscriptions?.length || 0} active subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPayouts)}</div>
              <p className="text-xs text-muted-foreground">{payouts?.length || 0} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue - totalPayouts)}</div>
              <p className="text-xs text-muted-foreground">30% platform fee</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="/admin/payouts"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">Manage Payouts</h3>
                  <p className="text-sm text-muted-foreground">Calculate and execute developer payouts</p>
                </div>
                <span className="text-primary">→</span>
              </a>
              <a
                href="/admin/developers"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">Developer Management</h3>
                  <p className="text-sm text-muted-foreground">View and manage developer accounts</p>
                </div>
                <span className="text-primary">→</span>
              </a>
              <a
                href="/admin/attributions"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">Customer Attributions</h3>
                  <p className="text-sm text-muted-foreground">Link customers to developers</p>
                </div>
                <span className="text-primary">→</span>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts?.slice(0, 5).map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={payout.status === "completed" ? "default" : "secondary"}>{payout.status}</Badge>
                      <span className="text-sm">Payout {formatCurrency(payout.amount)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {(!payouts || payouts.length === 0) && (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
