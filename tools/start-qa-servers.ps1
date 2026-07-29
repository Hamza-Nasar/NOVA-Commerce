$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$apiLog = Join-Path $PSScriptRoot "qa-api.log"
$apiErr = Join-Path $PSScriptRoot "qa-api.err.log"
$webLog = Join-Path $PSScriptRoot "qa-web.log"
$webErr = Join-Path $PSScriptRoot "qa-web.err.log"

if (Test-Path $apiLog) { Clear-Content -LiteralPath $apiLog }
if (Test-Path $apiErr) { Clear-Content -LiteralPath $apiErr }
if (Test-Path $webLog) { Clear-Content -LiteralPath $webLog }
if (Test-Path $webErr) { Clear-Content -LiteralPath $webErr }

$base = "http://localhost:4000/api/v1"
$apiRunning = $false
try {
  Invoke-RestMethod -Method Get -Uri "$base/health" -TimeoutSec 5 | Out-Null
  $apiRunning = $true
} catch {
  $apiRunning = $false
}

if (-not $apiRunning) {
  Start-Process -FilePath "pnpm.cmd" -ArgumentList @("--filter", "@nova/api", "start") -WorkingDirectory $root -RedirectStandardOutput $apiLog -RedirectStandardError $apiErr -WindowStyle Hidden -UseNewEnvironment
}

$webRoot = Join-Path $root "apps\web"
$webRunning = $false
try {
  Invoke-WebRequest -UseBasicParsing "http://localhost:3006" -TimeoutSec 5 | Out-Null
  $webRunning = $true
} catch {
  $webRunning = $false
}

if (-not $webRunning) {
  Start-Process -FilePath "pnpm.cmd" -ArgumentList @("exec", "next", "start", "-p", "3006") -WorkingDirectory $webRoot -RedirectStandardOutput $webLog -RedirectStandardError $webErr -WindowStyle Hidden -UseNewEnvironment
}

Start-Sleep -Seconds 12

try {
  $apiStatus = (Invoke-WebRequest -UseBasicParsing "$base/health" -TimeoutSec 10).StatusCode
} catch {
  $apiStatus = "ERROR: $($_.Exception.Message)"
}

try {
  $webStatus = (Invoke-WebRequest -UseBasicParsing "http://localhost:3006" -TimeoutSec 10).StatusCode
} catch {
  $webStatus = "ERROR: $($_.Exception.Message)"
}

"API_STATUS=$apiStatus"
"WEB_STATUS=$webStatus"
