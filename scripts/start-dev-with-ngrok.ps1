# Development Environment Setup Script with ngrok
# This script starts your Next.js dev server and ngrok tunnel for Stripe webhooks

Write-Host "=== Starting Development Environment with ngrok ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local from .env.example and add your configuration" -ForegroundColor Yellow
    exit 1
}

# Function to check if a port is in use
function Test-Port {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Check if port 3000 is already in use
if (Test-Port -Port 3000) {
    Write-Host "Port 3000 is already in use. Is the dev server already running?" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne 'y') {
        exit 0
    }
} else {
    Write-Host "Starting Next.js development server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-Command", "npm run dev" -WorkingDirectory $PWD
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# Start ngrok
Write-Host ""
Write-Host "Starting ngrok tunnel to expose localhost:3000..." -ForegroundColor Green
Write-Host ""

# Create ngrok config if it doesn't exist
$ngrokConfig = @"
version: 2
authtoken: YOUR_NGROK_AUTH_TOKEN
tunnels:
  stripe-webhooks:
    proto: http
    addr: 3000
    hostname: your-subdomain.ngrok-free.app
"@

$ngrokConfigPath = "$env:USERPROFILE\.ngrok2\ngrok.yml"
if (-not (Test-Path $ngrokConfigPath)) {
    Write-Host "Note: ngrok config not found. Using default settings." -ForegroundColor Yellow
    Write-Host "For a persistent subdomain, sign up at https://ngrok.com and configure authtoken" -ForegroundColor Yellow
    Write-Host ""
}

# Start ngrok in a new window
Write-Host "Starting ngrok tunnel..." -ForegroundColor Green
Start-Process ngrok -ArgumentList "http", "3000" -PassThru

# Wait a moment for ngrok to start
Start-Sleep -Seconds 3

# Get ngrok URL
Write-Host ""
Write-Host "Fetching ngrok tunnel URL..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -Method Get
    $tunnelUrl = $response.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1 -ExpandProperty public_url
    
    if ($tunnelUrl) {
        Write-Host ""
        Write-Host "=== ngrok Tunnel Active ===" -ForegroundColor Green
        Write-Host "Public URL: $tunnelUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "=== Webhook URLs ===" -ForegroundColor Green
        Write-Host "Stripe Webhook: $tunnelUrl/api/webhooks/stripe" -ForegroundColor White
        Write-Host "Stripe Connect Webhook: $tunnelUrl/api/webhooks/stripe-connect" -ForegroundColor White
        Write-Host ""
        Write-Host "=== Next Steps ===" -ForegroundColor Yellow
        Write-Host "1. Go to https://dashboard.stripe.com/webhooks" -ForegroundColor White
        Write-Host "2. Click 'Add endpoint'" -ForegroundColor White
        Write-Host "3. Enter the webhook URL above" -ForegroundColor White
        Write-Host "4. Select these events:" -ForegroundColor White
        Write-Host "   - account.updated" -ForegroundColor Gray
        Write-Host "   - customer.subscription.created" -ForegroundColor Gray
        Write-Host "   - customer.subscription.updated" -ForegroundColor Gray
        Write-Host "   - customer.subscription.deleted" -ForegroundColor Gray
        Write-Host "   - invoice.payment_succeeded" -ForegroundColor Gray
        Write-Host "5. Copy the webhook signing secret and add to .env.local as STRIPE_WEBHOOK_SECRET" -ForegroundColor White
        Write-Host ""
        Write-Host "ngrok Web Interface: http://127.0.0.1:4040" -ForegroundColor Cyan
        Write-Host ""
        
        # Copy URL to clipboard
        $tunnelUrl | Set-Clipboard
        Write-Host "Tunnel URL copied to clipboard!" -ForegroundColor Green
    }
} catch {
    Write-Host "Could not fetch ngrok URL automatically." -ForegroundColor Yellow
    Write-Host "Please check the ngrok window or visit: http://127.0.0.1:4040" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop services
Write-Host "Stopping services..." -ForegroundColor Red
Stop-Process -Name "ngrok" -ErrorAction SilentlyContinue
Stop-Process -Name "node" -ErrorAction SilentlyContinue

Write-Host "Development environment stopped." -ForegroundColor Green
