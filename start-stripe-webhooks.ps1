# Stripe CLI Webhook Forwarding Script
# This script forwards Stripe webhooks to your local development server

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Stripe CLI Webhook Forwarding   " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Set the Stripe CLI path
$stripePath = "C:\Users\nasan\AppData\Local\Microsoft\WinGet\Packages\Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe\stripe.exe"

# Check if local server is running
$localServer = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
if (-not $localServer) {
    Write-Host "⚠️  Warning: localhost:3000 is not responding" -ForegroundColor Yellow
    Write-Host "   Make sure your Next.js dev server is running:" -ForegroundColor Yellow
    Write-Host "   pnpm dev" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Choose webhook endpoint to forward:" -ForegroundColor Yellow
Write-Host "1. Stripe Connect webhooks (/api/webhooks/stripe-connect)" -ForegroundColor White
Write-Host "2. Platform webhooks (/api/webhooks/stripe)" -ForegroundColor White
Write-Host "3. Both (run two terminals)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select option (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting Stripe Connect webhook forwarding..." -ForegroundColor Green
        Write-Host "   Endpoint: http://localhost:3000/api/webhooks/stripe-connect" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 IMPORTANT: Copy the webhook signing secret that appears below" -ForegroundColor Yellow
        Write-Host "   and add it to your .env.local file as:" -ForegroundColor Yellow
        Write-Host "   STRIPE_WEBHOOK_SECRET=whsec_..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Press Ctrl+C to stop forwarding" -ForegroundColor Gray
        Write-Host ""
        
        & $stripePath listen --forward-to localhost:3000/api/webhooks/stripe-connect --events account.updated,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed,payout.created,payout.failed
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting platform webhook forwarding..." -ForegroundColor Green
        Write-Host "   Endpoint: http://localhost:3000/api/webhooks/stripe" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 IMPORTANT: Copy the webhook signing secret that appears below" -ForegroundColor Yellow
        Write-Host "   and add it to your .env.local file as:" -ForegroundColor Yellow
        Write-Host "   STRIPE_WEBHOOK_SECRET=whsec_..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Press Ctrl+C to stop forwarding" -ForegroundColor Gray
        Write-Host ""
        
        & $stripePath listen --forward-to localhost:3000/api/webhooks/stripe --events transfer.created,transfer.failed
    }
    "3" {
        Write-Host ""
        Write-Host "📌 To forward both endpoints, you need two terminals:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Terminal 1 - Run this for Connect webhooks:" -ForegroundColor Cyan
        Write-Host "stripe listen --forward-to localhost:3000/api/webhooks/stripe-connect" -ForegroundColor Green
        Write-Host ""
        Write-Host "Terminal 2 - Run this for platform webhooks:" -ForegroundColor Cyan
        Write-Host "stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting Connect webhooks in this terminal..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        
        & $stripePath listen --forward-to localhost:3000/api/webhooks/stripe-connect
    }
    default {
        Write-Host "Invalid option. Exiting..." -ForegroundColor Red
    }
}
