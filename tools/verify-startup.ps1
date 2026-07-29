$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$apiLog = Join-Path $PSScriptRoot "api-start.log"
$apiErr = Join-Path $PSScriptRoot "api-start.err.log"
$webLog = Join-Path $PSScriptRoot "web-start.log"
$webErr = Join-Path $PSScriptRoot "web-start.err.log"

if (Test-Path $apiLog) { Remove-Item -LiteralPath $apiLog -Force }
if (Test-Path $apiErr) { Remove-Item -LiteralPath $apiErr -Force }
if (Test-Path $webLog) { Remove-Item -LiteralPath $webLog -Force }
if (Test-Path $webErr) { Remove-Item -LiteralPath $webErr -Force }

$api = Start-Process -FilePath "pnpm.cmd" -ArgumentList @("--filter", "@nova/api", "start") -WorkingDirectory $root -RedirectStandardOutput $apiLog -RedirectStandardError $apiErr -PassThru -WindowStyle Hidden
$webRoot = Join-Path $root "apps\web"
$web = Start-Process -FilePath "pnpm.cmd" -ArgumentList @("exec", "next", "start", "-p", "3006") -WorkingDirectory $webRoot -RedirectStandardOutput $webLog -RedirectStandardError $webErr -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 12

try {
  $apiStatus = (Invoke-WebRequest -UseBasicParsing "http://localhost:4000/api/v1/health" -TimeoutSec 10).StatusCode
} catch {
  $apiStatus = "ERROR: $($_.Exception.Message)"
}

try {
  $webStatus = (Invoke-WebRequest -UseBasicParsing "http://localhost:3006" -TimeoutSec 10).StatusCode
} catch {
  $webStatus = "ERROR: $($_.Exception.Message)"
}

if (-not $api.HasExited) { Stop-Process -Id $api.Id -Force }
if (-not $web.HasExited) { Stop-Process -Id $web.Id -Force }

"API_STATUS=$apiStatus"
"WEB_STATUS=$webStatus"
"API_LOG="
Get-Content $apiLog
Get-Content $apiErr
"WEB_LOG="
Get-Content $webLog
Get-Content $webErr
