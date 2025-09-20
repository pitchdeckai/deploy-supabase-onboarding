# Supabase MCP Setup Script
# This script helps you configure your Supabase MCP integration

Write-Host "🚀 Supabase MCP Setup for Cursor" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 1: Get Your Supabase Access Token" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Yellow
Write-Host "1. Go to your Supabase Dashboard: https://supabase.com/dashboard"
Write-Host "2. Click on your profile in the top-right corner"
Write-Host "3. Go to 'Settings' → 'Access Tokens'"
Write-Host "4. Click 'Generate new token'"
Write-Host "5. Give it a name like 'Cursor MCP'"
Write-Host "6. Copy the token (it starts with 'sbp_' usually)"
Write-Host ""

Write-Host "STEP 2: Project Reference Check" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow
Write-Host "Current project ref: qgpybicovgofmklvsyts"
Write-Host "Your Supabase URL should be: https://qgpybicovgofmklvsyts.supabase.co"
Write-Host "If this is wrong, we'll update it."
Write-Host ""

# Prompt for access token
$accessToken = Read-Host -Prompt "Enter your Supabase Access Token"

if ([string]::IsNullOrWhiteSpace($accessToken)) {
    Write-Host "❌ No access token provided. Exiting." -ForegroundColor Red
    exit 1
}

# Prompt for project ref confirmation
$projectRef = Read-Host -Prompt "Enter your project ref (or press Enter to use 'qgpybicovgofmklvsyts')"
if ([string]::IsNullOrWhiteSpace($projectRef)) {
    $projectRef = "qgpybicovgofmklvsyts"
}

Write-Host ""
Write-Host "📝 Updating configuration files..." -ForegroundColor Blue

# Update .cursor/mcp.json
$mcpConfigPath = ".cursor\mcp.json"
if (Test-Path $mcpConfigPath) {
    $mcpConfig = Get-Content $mcpConfigPath -Raw
    $mcpConfig = $mcpConfig -replace "PLACEHOLDER_REPLACE_WITH_REAL_TOKEN", $accessToken
    $mcpConfig = $mcpConfig -replace "qgpybicovgofmklvsyts", $projectRef
    $mcpConfig | Set-Content $mcpConfigPath -NoNewline
    Write-Host "✅ Updated .cursor/mcp.json" -ForegroundColor Green
} else {
    Write-Host "❌ .cursor/mcp.json not found!" -ForegroundColor Red
}

# Update .env file
$envPath = ".env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $updatedEnv = @()
    
    foreach ($line in $envContent) {
        if ($line -match "^SUPABASE_ACCESS_TOKEN=") {
            $updatedEnv += "SUPABASE_ACCESS_TOKEN=$accessToken"
        }
        elseif ($line -match "^SUPABASE_PROJECT_REF=") {
            $updatedEnv += "SUPABASE_PROJECT_REF=$projectRef"
        }
        elseif ($line -match "^SUPABASE_URL=" -or $line -match "^NEXT_PUBLIC_SUPABASE_URL=") {
            $url = "https://$projectRef.supabase.co"
            if ($line -match "^SUPABASE_URL=") {
                $updatedEnv += "SUPABASE_URL=$url"
            } else {
                $updatedEnv += "NEXT_PUBLIC_SUPABASE_URL=$url"
            }
        }
        elseif ($line -match "^POSTGRES_HOST=") {
            $updatedEnv += "POSTGRES_HOST=db.$projectRef.supabase.co"
        }
        else {
            $updatedEnv += $line
        }
    }
    
    $updatedEnv | Set-Content $envPath
    Write-Host "✅ Updated .env file" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Configuration Updated!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart Cursor completely (close and reopen)"
Write-Host "2. Go to Cursor Settings → MCP & Integrations"
Write-Host "3. Look for a green 'active' status next to 'supabase'"
Write-Host "4. Test by asking: 'Show me my Supabase database schema'"
Write-Host ""
Write-Host "Features enabled:" -ForegroundColor Green
Write-Host "✅ Full read/write access (no --read-only constraint)"
Write-Host "✅ Project scoped to: $projectRef"
Write-Host "✅ Direct database queries"
Write-Host "✅ Project management tools"
Write-Host ""
Write-Host "If you see connection errors, check that your access token has the right permissions!" -ForegroundColor Cyan