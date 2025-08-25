// Utility functions for payout calculations

export interface DeveloperEarnings {
  developerId: string
  totalEarnings: number
  unpaidEarnings: number
  subscriptionCount: number
  lastPayoutDate?: string
}

export interface PayoutCalculation {
  developerId: string
  amount: number
  subscriptions: Array<{
    id: string
    amount: number
    developerShare: number
    attributionPercent: number
  }>
}

export function calculateMonthlyEarnings(
  subscriptions: Array<{
    amount: number
    attribution_percentage: number
    created_at: string
  }>,
  month: Date,
): number {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  return subscriptions
    .filter((sub) => {
      const subDate = new Date(sub.created_at)
      return subDate >= monthStart && subDate <= monthEnd
    })
    .reduce((total, sub) => {
      const attributionPercent = sub.attribution_percentage || 70
      return total + Math.floor((sub.amount * attributionPercent) / 100)
    }, 0)
}

export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100)
}

export function getPayoutPeriod(date: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return { start, end }
}

export function validatePayoutAmount(amount: number, minAmount = 100): boolean {
  // Minimum payout amount (in cents) - default $1.00
  return amount >= minAmount && amount <= 100000000 // Max $1M
}

export function calculatePlatformFee(subscriptionAmount: number, developerPercentage = 70): number {
  const developerShare = Math.floor((subscriptionAmount * developerPercentage) / 100)
  return subscriptionAmount - developerShare
}
