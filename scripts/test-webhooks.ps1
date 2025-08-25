# Stripe Webhook Testing Script
# This script helps test and monitor webhook events

param(
    [string]$Event = "account.updated"
)

Write-Host "=== Stripe Webhook Testing Tool ===" -ForegroundColor Cyan
Write-Host ""

# Check if Stripe CLI is installed
$stripeCli = Get-Command stripe -ErrorAction SilentlyContinue
if (-not $stripeCli) {
    Write-Host "Stripe CLI is not installed. Would you like to use ngrok instead?" -ForegroundColor Yellow
    Write-Host "Visit: http://127.0.0.1:4040/inspect/http to monitor webhook requests" -ForegroundColor Cyan
    exit 0
}

# Check ngrok status
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -Method Get
    $tunnelUrl = $response.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1 -ExpandProperty public_url
    
    if ($tunnelUrl) {
        Write-Host "ngrok tunnel is active: $tunnelUrl" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== Current Webhook URLs ===" -ForegroundColor Yellow
        Write-Host "Stripe Connect: $tunnelUrl/api/webhooks/stripe-connect" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host "ngrok is not running. Start it with: .\scripts\start-ngrok.bat" -ForegroundColor Yellow
}

# Menu for testing
Write-Host "=== Webhook Test Menu ===" -ForegroundColor Cyan
Write-Host "1. Test account.updated (Connect onboarding completion)" -ForegroundColor White
Write-Host "2. Test customer.subscription.created" -ForegroundColor White
Write-Host "3. Test invoice.payment_succeeded" -ForegroundColor White
Write-Host "4. Monitor live webhooks (Stripe CLI)" -ForegroundColor White
Write-Host "5. Open ngrok inspector" -ForegroundColor White
Write-Host "6. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select an option (1-6)"

switch ($choice) {
    "1" {
        Write-Host "Triggering account.updated event..." -ForegroundColor Green
        stripe trigger account.updated
    }
    "2" {
        Write-Host "Triggering customer.subscription.created event..." -ForegroundColor Green
        stripe trigger customer.subscription.created
    }
    "3" {
        Write-Host "Triggering invoice.payment_succeeded event..." -ForegroundColor Green
        stripe trigger invoice.payment_succeeded
    }
    "4" {
        Write-Host "Starting webhook monitoring (Ctrl+C to stop)..." -ForegroundColor Green
        stripe listen --forward-to localhost:3000/api/webhooks/stripe-connect
    }
    "5" {
        Write-Host "Opening ngrok inspector..." -ForegroundColor Green
        Start-Process "http://127.0.0.1:4040"
    }
    "6" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid option selected" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Check your application logs for webhook processing details" -ForegroundColor Cyan
