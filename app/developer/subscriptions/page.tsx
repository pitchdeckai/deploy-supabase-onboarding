"use client"

export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, CreditCard, TrendingUp, Calendar, Mail, Package } from "lucide-react"

interface Subscription {
  id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  products: {
    name: string
    price_cents: number
    currency: string
  }
  customers: {
    email: string
    name: string
  }
}

interface Customer {
  id: string
  stripe_customer_id: string
  email: string
  name: string
  created_at: string
}

export default function SubscriptionsPage() {
  const [user, setUser] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
      await loadData(user.id)
    }
    getUser()
  }, [router])

  const loadData = async (userId: string) => {
    try {
      const supabase = createClient()

      // Load subscriptions with product and customer data
      const { data: subscriptionsData, error: subsError } = await supabase
        .from("subscriptions")
        .select(`
          *,
          products (name, price_cents, currency),
          customers (email, name)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (subsError) throw subsError

      // Load customers
      const { data: customersData, error: customersError } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (customersError) throw customersError

      setSubscriptions(subscriptionsData || [])
      setCustomers(customersData || [])

      // Calculate stats
      const activeSubscriptions = subscriptionsData?.filter((sub) => sub.status === "active") || []
      const monthlyRevenue = activeSubscriptions.reduce((total, sub) => {
        return total + (sub.products?.price_cents || 0)
      }, 0)

      setStats({
        totalSubscriptions: subscriptionsData?.length || 0,
        activeSubscriptions: activeSubscriptions.length,
        monthlyRevenue: monthlyRevenue / 100,
        totalCustomers: customersData?.length || 0,
      })
    } catch (error) {
      console.error("[v0] Error loading subscription data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      case "unpaid":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            <CreditCard className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Subscriptions</h1>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : subscriptions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
                    <p className="text-muted-foreground text-center">
                      Subscriptions will appear here when customers subscribe to your products
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <Card key={subscription.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              {subscription.products?.name || "Unknown Product"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Mail className="h-4 w-4" />
                              {subscription.customers?.email}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium">Price</p>
                            <p className="text-2xl font-bold">
                              {formatPrice(
                                subscription.products?.price_cents || 0,
                                subscription.products?.currency || "usd",
                              )}
                              <span className="text-sm font-normal text-muted-foreground">/month</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Current Period</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(subscription.current_period_start)} -{" "}
                              {formatDate(subscription.current_period_end)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Customer</p>
                            <p className="text-sm text-muted-foreground">
                              {subscription.customers?.name || subscription.customers?.email}
                            </p>
                          </div>
                        </div>
                        {subscription.cancel_at_period_end && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                              This subscription will cancel at the end of the current period
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : customers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No customers yet</h3>
                    <p className="text-muted-foreground text-center">
                      Customers will appear here when they subscribe to your products
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {customers.map((customer) => (
                    <Card key={customer.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {customer.name || "Unknown"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {customer.email}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Joined {formatDate(customer.created_at)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
