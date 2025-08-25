"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Download, TrendingUp } from "lucide-react"

interface ExpressDashboardButtonProps {
  stripeAccountId?: string
}

export function ExpressDashboardButton({ stripeAccountId }: ExpressDashboardButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleOpenExpressDashboard = async () => {
    if (!stripeAccountId) {
      alert("No Stripe account found. Please complete onboarding first.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/stripe/express-dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to create dashboard link")
      }

      const { url } = await response.json()
      window.open(url, "_blank")
    } catch (error) {
      console.error("Error opening Express dashboard:", error)
      alert("Failed to open Express dashboard. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleOpenExpressDashboard} disabled={loading}>
      <Eye className="h-4 w-4 mr-2" />
      {loading ? "Opening..." : "View Live"}
    </Button>
  )
}

export function ExportPayoutsButton() {
  const [loading, setLoading] = useState(false)

  const handleExportPayouts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stripe/export-payouts")

      if (!response.ok) {
        throw new Error("Failed to export payouts")
      }

      const { data } = await response.json()

      // Convert to CSV
      if (data.length === 0) {
        alert("No payout data to export")
        return
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map((row: any) => headers.map((header) => `"${row[header]}"`).join(",")),
      ].join("\n")

      // Download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `payouts-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting payouts:", error)
      alert("Failed to export payouts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExportPayouts} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Exporting..." : "Export"}
    </Button>
  )
}

export function GenerateReportButton() {
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stripe/export-payouts")

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      const { data } = await response.json()

      if (data.length === 0) {
        alert("No transaction data available for report generation")
        return
      }

      // Calculate summary statistics
      const totalAmount = data.reduce((sum: number, payout: any) => sum + Number.parseFloat(payout.amount), 0)
      const paidPayouts = data.filter((payout: any) => payout.status === "paid")
      const pendingPayouts = data.filter((payout: any) => payout.status === "pending")

      const reportData = [
        ["Financial Report", ""],
        ["Generated", new Date().toISOString()],
        ["", ""],
        ["Summary", ""],
        ["Total Payouts", data.length],
        ["Total Amount", `$${totalAmount.toFixed(2)}`],
        ["Paid Payouts", paidPayouts.length],
        ["Pending Payouts", pendingPayouts.length],
        ["", ""],
        ["Detailed Transactions", ""],
        ["ID", "Amount", "Status", "Created", "Arrival Date"],
        ...data.map((payout: any) => [
          payout.id,
          `$${payout.amount}`,
          payout.status,
          payout.created,
          payout.arrival_date,
        ]),
      ]

      const csvContent = reportData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

      // Download report
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `financial-report-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert("Financial report generated and downloaded successfully!")
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" className="mt-4 bg-transparent" onClick={handleGenerateReport} disabled={loading}>
      <TrendingUp className="h-4 w-4 mr-2" />
      {loading ? "Generating..." : "Generate Report"}
    </Button>
  )
}
