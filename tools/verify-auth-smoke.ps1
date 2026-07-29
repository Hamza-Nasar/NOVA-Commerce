$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$apiLog = Join-Path $PSScriptRoot "auth-smoke-api.log"
$apiErr = Join-Path $PSScriptRoot "auth-smoke-api.err.log"

if (Test-Path $apiLog) { Remove-Item -LiteralPath $apiLog -Force }
if (Test-Path $apiErr) { Remove-Item -LiteralPath $apiErr -Force }

$api = $null

try {
  $base = "http://localhost:4000/api/v1"
  try {
    Invoke-RestMethod -Method Get -Uri "$base/health" -TimeoutSec 5 | Out-Null
  } catch {
    $api = Start-Process -FilePath "pnpm.cmd" -ArgumentList @("--filter", "@nova/api", "start") -WorkingDirectory $root -RedirectStandardOutput $apiLog -RedirectStandardError $apiErr -PassThru -WindowStyle Hidden
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
      Start-Sleep -Seconds 2
      try {
        Invoke-RestMethod -Method Get -Uri "$base/health" -TimeoutSec 5 | Out-Null
        $ready = $true
        break
      } catch {
        $ready = $false
      }
    }
    if (-not $ready) {
      throw "API health did not become ready"
    }
  }
  $health = Invoke-RestMethod -Method Get -Uri "$base/health"

  $stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $email = "smoke+$stamp@nova.test"
  $password = "SmokePass1"

  $registerBody = @{
    firstName = "Smoke"
    lastName = "User"
    email = $email
    password = $password
  } | ConvertTo-Json

  $registered = Invoke-RestMethod -Method Post -Uri "$base/auth/register" -ContentType "application/json" -Body $registerBody
  $access = $registered.data.accessToken
  $refresh = $registered.data.refreshToken
  $headers = @{ Authorization = "Bearer $access" }

  $me = Invoke-RestMethod -Method Get -Uri "$base/auth/me" -Headers $headers

  $profile = Invoke-RestMethod -Method Patch -Uri "$base/users/profile" -Headers $headers -ContentType "application/json" -Body (@{
    firstName = "Smoke"
    lastName = "Verified"
  } | ConvertTo-Json)

  $addressBody = @{
    title = "Home"
    fullName = "Smoke Verified"
    phone = "+14155550124"
    country = "United States"
    province = "CA"
    city = "Los Angeles"
    postalCode = "90001"
    addressLine1 = "100 Test Street"
    isDefault = $true
  } | ConvertTo-Json
  $address = Invoke-RestMethod -Method Post -Uri "$base/users/addresses" -Headers $headers -ContentType "application/json" -Body $addressBody
  $addresses = Invoke-RestMethod -Method Get -Uri "$base/users/addresses" -Headers $headers

  $refreshed = Invoke-RestMethod -Method Post -Uri "$base/auth/refresh" -ContentType "application/json" -Body (@{ refreshToken = $refresh } | ConvertTo-Json)
  $logout = Invoke-RestMethod -Method Post -Uri "$base/auth/logout" -ContentType "application/json" -Body (@{ refreshToken = $refreshed.data.refreshToken } | ConvertTo-Json)

  "HEALTH=$($health.data.status)"
  "REGISTER_USER=$($registered.data.user.email)"
  "ME_USER=$($me.data.email)"
  "PROFILE_NAME=$($profile.data.fullName)"
  "ADDRESS_COUNT=$($addresses.data.Count)"
  "ADDRESS_DEFAULT=$($address.data.isDefault)"
  "REFRESH_TOKEN_ROTATED=$([bool]$refreshed.data.accessToken)"
  "LOGOUT=$($logout.data.loggedOut)"
} finally {
  if ($api -and -not $api.HasExited) { Stop-Process -Id $api.Id -Force }
}
