"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Mail, Calendar, CreditCard, Search, Eye, TrendingUp, DollarSign, Package, Clock } from "lucide-react"

interface Customer {
  id: string
  stripe_customer_id: string
  email: string
  name: string
  created_at: string
  subscriptions: Array<{
    id: string
    status: string
    amount_cents: number
    currency: string
    current_period_start: string
    current_period_end: string
    products: {
      name: string
      price_cents: number
      currency: string
      billing_interval: string
    }
  }>
}

interface CustomerDetails {
  customer: Customer
  totalSpent: number
  subscriptionCount: number
  activeSubscriptions: number
  firstSubscription: string
  lastActivity: string
}

export default function CustomersPage() {
  const [user, setUser] = useState<any>(null)
  const [developer, setDeveloper] = useState<any>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    averageRevenue: 0,
    churnRate: 0,
  })
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

      const { data: developerData } = await supabase
        .from("developers")
        .select("id, stripe_account_id, onboarding_complete")
        .eq("user_id", user.id)
        .single()

      if (developerData) {
        setDeveloper(developerData)
        await loadCustomers(developerData.id)
      }
    }
    getUser()
  }, [router])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const loadCustomers = async (developerId: string) => {
    try {
      const supabase = createClient()

      const { data: customersData, error } = await supabase
        .from("customers")
        .select(`
          *,
          subscriptions!inner (
            id,
            status,
            amount_cents,
            currency,
            current_period_start,
            current_period_end,
            products (
              name, 
              price_cents, 
              currency,
              billing_interval
            )
          )
        `)
        .eq("developer_id", developerId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setCustomers(customersData || [])

      const totalCustomers = customersData?.length || 0
      const activeCustomers =
        customersData?.filter((customer) => customer.subscriptions.some((sub: any) => sub.status === "active"))
          .length || 0

      const totalRevenue =
        customersData?.reduce((total, customer) => {
          return (
            total +
            customer.subscriptions.reduce((subTotal: number, sub: any) => {
              return sub.status === "active" ? subTotal + (sub.amount_cents || 0) : subTotal
            }, 0)
          )
        }, 0) || 0

      const averageRevenue = totalCustomers > 0 ? totalRevenue / 100 / totalCustomers : 0
      const churnRate = totalCustomers > 0 ? ((totalCustomers - activeCustomers) / totalCustomers) * 100 : 0

      setStats({
        totalCustomers,
        activeCustomers,
        averageRevenue,
        churnRate,
      })
    } catch (error) {
      console.error("[v0] Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const viewCustomerDetails = async (customer: Customer) => {
    const totalSpent =
      customer.subscriptions.reduce((total, sub) => {
        return total + (sub.amount_cents || 0)
      }, 0) / 100

    const subscriptionCount = customer.subscriptions.length
    const activeSubscriptions = customer.subscriptions.filter((sub) => sub.status === "active").length

    const firstSubscription =
      customer.subscriptions.length > 0
        ? customer.subscriptions.sort(
            (a, b) => new Date(a.current_period_start).getTime() - new Date(b.current_period_start).getTime(),
          )[0].current_period_start
        : customer.created_at

    const lastActivity =
      customer.subscriptions.length > 0
        ? customer.subscriptions.sort(
            (a, b) => new Date(b.current_period_end).getTime() - new Date(a.current_period_end).getTime(),
          )[0].current_period_end
        : customer.created_at

    setSelectedCustomer({
      customer,
      totalSpent,
      subscriptionCount,
      activeSubscriptions,
      firstSubscription,
      lastActivity,
    })
    setShowCustomerDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
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

  if (!mounted || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Customer Management</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {!developer?.onboarding_complete && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Complete your onboarding</h3>
                    <p className="text-sm">Finish setting up your Stripe account to start receiving customers.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0}% of
                  total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Revenue/Customer</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.averageRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.churnRate.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Customer List */}
          <Card>
            <CardHeader>
              <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              <CardDescription>Manage your customer relationships and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? "No customers found" : "No customers yet"}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Customers will appear here when they subscribe to your products"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => {
                    const activeSubscriptions = customer.subscriptions.filter((sub) => sub.status === "active")
                    const totalValue =
                      customer.subscriptions.reduce((total, sub) => total + (sub.amount_cents || 0), 0) / 100

                    return (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{customer.name || "Unknown"}</h3>
                              {activeSubscriptions.length > 0 && (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {customer.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Joined {formatDate(customer.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                {customer.subscriptions.length} subscription
                                {customer.subscriptions.length !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">${totalValue.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">Total Value</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => viewCustomerDetails(customer)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Customer Details Dialog */}
      {mounted && selectedCustomer && (
        <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedCustomer?.customer.name || "Customer Details"}
              </DialogTitle>
              <DialogDescription>{selectedCustomer?.customer.email}</DialogDescription>
            </DialogHeader>

            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Total Spent</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-2xl font-bold">{selectedCustomer.activeSubscriptions}</div>
                          <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Timeline */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Customer Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined: {formatDate(selectedCustomer.customer.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>First Subscription: {formatDate(selectedCustomer.firstSubscription)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Last Activity: {formatDate(selectedCustomer.lastActivity)}</span>
                    </div>
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Subscriptions ({selectedCustomer.subscriptionCount})</h4>
                  <div className="space-y-2">
                    {selectedCustomer.customer.subscriptions.map((subscription, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{subscription.products?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(subscription.current_period_start)} -{" "}
                            {formatDate(subscription.current_period_end)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Billed {subscription.products?.billing_interval}ly
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                          <span className="font-semibold">
                            {formatPrice(subscription.amount_cents || 0, subscription.currency || "usd")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
