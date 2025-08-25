"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Package, DollarSign, Edit, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

interface Product {
  id: string
  stripe_product_id: string
  stripe_price_id: string
  name: string
  description: string
  price_cents: number
  currency: string
  created_at: string
}

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Form state
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("usd")
  const [billingInterval, setBillingInterval] = useState("month")

  useEffect(() => {
    setMounted(true)
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
      await loadProducts(user.id)
    }
    getUser()
  }, [router])

  const loadProducts = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("[v0] Error loading products:", error)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async () => {
    if (!user || !productName || !price) return

    setCreating(true)
    setError(null)

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          description: productDescription,
          price_cents: Math.round(Number.parseFloat(price) * 100),
          currency,
          billing_interval: billingInterval,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product")
      }

      // Reload products
      await loadProducts(user.id)

      // Reset form
      setProductName("")
      setProductDescription("")
      setPrice("")
      setCurrency("usd")
      setBillingInterval("month")
      setShowCreateDialog(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setCreating(false)
    }
  }

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            <Package className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Products</h1>
          </div>
          <div className="ml-auto">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                  <DialogDescription>Create a new SaaS product with subscription pricing</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="My SaaS Product"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="eur">EUR</SelectItem>
                          <SelectItem value="gbp">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="interval">Billing Interval</Label>
                    <Select value={billingInterval} onValueChange={setBillingInterval}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createProduct} disabled={creating || !productName || !price}>
                    {creating ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first SaaS product to start accepting subscriptions
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1">{product.description || "No description"}</CardDescription>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{formatPrice(product.price_cents, product.currency)}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Created {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
