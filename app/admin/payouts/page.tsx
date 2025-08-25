"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/payout-utils"
import { RefreshCw, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

interface PayoutSummary {
  developer: {
    id: string
    email: string
    name: string
    stripe_account_id: string
    payouts_enabled: boolean
    onboarding_complete: boolean
  }
  totalEarnings: number
  totalPaid: number
  unpaidEarnings: number
  subscriptionCount: number
}

export default function AdminPayoutsPage() {
  const [payoutSummary, setPayoutSummary] = useState<PayoutSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState<Record<string, string>>({})
  const [payoutDescription, setPayoutDescription] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchPayoutSummary()
  }, [])

  const fetchPayoutSummary = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/payouts/calculate")
      const data = await res.json()
      setPayoutSummary(data.payoutSummary || [])
    } catch (error) {
      console.error("Failed to fetch payout summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const executePayout = async (developerId: string, amount: number, description?: string) => {
    setExecuting(developerId)

    try {
      const res = await fetch("/api/payouts/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developerId,
          amount,
          description: description || `Payout for ${new Date().toLocaleDateString()}`,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert("Payout sent successfully!")
        fetchPayoutSummary()
        // Clear custom inputs
        setCustomAmount((prev) => ({ ...prev, [developerId]: "" }))
        setPayoutDescription((prev) => ({ ...prev, [developerId]: "" }))
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      alert("Error executing payout")
      console.error("Payout error:", error)
    } finally {
      setExecuting(null)
    }
  }

  const handleCustomAmountChange = (developerId: string, value: string) => {
    setCustomAmount((prev) => ({ ...prev, [developerId]: value }))
  }

  const handleDescriptionChange = (developerId: string, value: string) => {
    setPayoutDescription((prev) => ({ ...prev, [developerId]: value }))
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payout Management</h1>
            <p className="text-muted-foreground mt-2">Calculate and execute developer payouts</p>
          </div>
          <Button onClick={fetchPayoutSummary} disabled={loading} variant="outline">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {payoutSummary.length === 0 && !loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Developers Found</h3>
                <p className="text-muted-foreground">No developers with earnings to pay out</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {payoutSummary.map((item) => (
            <Card key={item.developer.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {item.developer.name || item.developer.email}
                      {item.developer.onboarding_complete && item.developer.payouts_enabled ? (
                        <Badge variant="default" className="bg-primary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending Setup
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{item.developer.email}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{formatCurrency(item.unpaidEarnings)}</div>
                    <div className="text-sm text-muted-foreground">Unpaid earnings</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{formatCurrency(item.totalEarnings)}</div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{formatCurrency(item.totalPaid)}</div>
                    <div className="text-sm text-muted-foreground">Already Paid</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{item.subscriptionCount}</div>
                    <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                  </div>
                </div>

                {item.developer.onboarding_complete && item.developer.payouts_enabled && item.unpaidEarnings > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor={`amount-${item.developer.id}`}>Custom Amount (optional)</Label>
                        <Input
                          id={`amount-${item.developer.id}`}
                          type="number"
                          placeholder={`${item.unpaidEarnings / 100}`}
                          value={customAmount[item.developer.id] || ""}
                          onChange={(e) => handleCustomAmountChange(item.developer.id, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave empty to pay full amount</p>
                      </div>
                      <div>
                        <Label htmlFor={`description-${item.developer.id}`}>Description (optional)</Label>
                        <Textarea
                          id={`description-${item.developer.id}`}
                          placeholder="Payout description..."
                          value={payoutDescription[item.developer.id] || ""}
                          onChange={(e) => handleDescriptionChange(item.developer.id, e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const amount = customAmount[item.developer.id]
                            ? Math.floor(Number.parseFloat(customAmount[item.developer.id]) * 100)
                            : item.unpaidEarnings
                          executePayout(item.developer.id, amount, payoutDescription[item.developer.id])
                        }}
                        disabled={executing === item.developer.id}
                        className="flex-1"
                      >
                        {executing === item.developer.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay Out Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {(!item.developer.onboarding_complete || !item.developer.payouts_enabled) && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Developer must complete Stripe onboarding before receiving payouts
                      </span>
                    </div>
                  </div>
                )}

                {item.unpaidEarnings <= 0 && item.developer.onboarding_complete && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">No pending payouts for this developer</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
