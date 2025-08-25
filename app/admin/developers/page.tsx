"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, AlertCircle, Search, RefreshCw } from "lucide-react"

interface Developer {
  id: string
  email: string
  name: string
  stripe_account_id: string
  onboarding_complete: boolean
  payouts_enabled: boolean
  created_at: string
}

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDevelopers()
  }, [])

  useEffect(() => {
    const filtered = developers.filter(
      (dev) =>
        dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dev.name && dev.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredDevelopers(filtered)
  }, [developers, searchTerm])

  const fetchDevelopers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/developers")
      if (res.ok) {
        const data = await res.json()
        setDevelopers(data.developers || [])
      }
    } catch (error) {
      console.error("Failed to fetch developers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (developer: Developer) => {
    if (developer.onboarding_complete && developer.payouts_enabled) {
      return (
        <Badge variant="default" className="bg-primary">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      )
    } else if (developer.stripe_account_id) {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Onboarding
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      )
    }
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Developer Management</h1>
            <p className="text-muted-foreground mt-2">View and manage developer accounts</p>
          </div>
          <Button onClick={fetchDevelopers} disabled={loading} variant="outline">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Developers</CardTitle>
            <CardDescription>Find developers by email or name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : filteredDevelopers.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Developers Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No developers match your search criteria" : "No developers have signed up yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDevelopers.map((developer) => (
              <Card key={developer.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{developer.name || developer.email}</h3>
                        <p className="text-sm text-muted-foreground">{developer.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(developer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(developer)}
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {developer.stripe_account_id ? "Connected" : "Not Connected"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {developer.stripe_account_id
                            ? `ID: ${developer.stripe_account_id.slice(-8)}`
                            : "No Stripe ID"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Developer Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{developers.length}</div>
                <div className="text-sm text-muted-foreground">Total Developers</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {developers.filter((dev) => dev.onboarding_complete && dev.payouts_enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">Active Developers</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {developers.filter((dev) => dev.stripe_account_id && !dev.onboarding_complete).length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Onboarding</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
