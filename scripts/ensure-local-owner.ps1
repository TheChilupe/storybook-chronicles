<#
  Idempotently provisions the allowlisted owner in LOCAL Supabase Auth.

  Safety:
    - refuses every non-loopback Supabase URL
    - reads credentials only from ignored .env.local
    - never prints the password or service-role key
    - creates/updates only the configured allowlisted owner
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$RepoRoot
)

$ErrorActionPreference = 'Stop'

function Read-LocalSetting {
  param([string]$Path, [string]$Name)
  $line = Get-Content -LiteralPath $Path | Where-Object {
    $_ -match "^$([regex]::Escape($Name))="
  } | Select-Object -Last 1
  if (-not $line) { return $null }
  return (($line -split '=', 2)[1]).Trim().Trim('"').Trim("'")
}

$envPath = Join-Path $RepoRoot '.env.local'
if (-not (Test-Path -LiteralPath $envPath)) {
  throw "Local owner provisioning requires ignored file: $envPath"
}

$supabaseUrl = Read-LocalSetting -Path $envPath -Name 'SUPABASE_URL'
$serviceKey = Read-LocalSetting -Path $envPath -Name 'SUPABASE_SERVICE_ROLE_KEY'
$ownerEmail = Read-LocalSetting -Path $envPath -Name 'LOCAL_OWNER_EMAIL'
$ownerPassword = Read-LocalSetting -Path $envPath -Name 'LOCAL_OWNER_PASSWORD'

$uri = $null
if (-not [uri]::TryCreate($supabaseUrl, [System.UriKind]::Absolute, [ref]$uri) -or
    $uri.Scheme -ne 'http' -or
    $uri.Host -notin @('127.0.0.1', 'localhost', '::1')) {
  throw 'Refusing to provision Auth: SUPABASE_URL must be a local loopback HTTP URL.'
}
if (-not $serviceKey) { throw 'SUPABASE_SERVICE_ROLE_KEY is missing from .env.local.' }
if ($ownerEmail -ne 'thechilupe@gmail.com') {
  throw 'LOCAL_OWNER_EMAIL must match the project owner allowlist.'
}
if (-not $ownerPassword -or $ownerPassword.Length -lt 10) {
  throw 'LOCAL_OWNER_PASSWORD must contain at least 10 characters.'
}

$headers = @{
  apikey = $serviceKey
  Authorization = "Bearer $serviceKey"
}
$authBase = "$($uri.GetLeftPart([System.UriPartial]::Authority))/auth/v1/admin"
$users = Invoke-RestMethod -Method Get -Uri "$authBase/users?per_page=1000" -Headers $headers
$owner = @($users.users | Where-Object { $_.email -eq $ownerEmail }) | Select-Object -First 1
$body = @{
  email = $ownerEmail
  password = $ownerPassword
  email_confirm = $true
  user_metadata = @{ local_development_owner = $true }
} | ConvertTo-Json -Depth 3

if ($owner) {
  Invoke-RestMethod -Method Put -Uri "$authBase/users/$($owner.id)" -Headers $headers `
    -ContentType 'application/json' -Body $body | Out-Null
  Write-Host '    OK   Local development owner account is ready' -ForegroundColor Green
}
else {
  Invoke-RestMethod -Method Post -Uri "$authBase/users" -Headers $headers `
    -ContentType 'application/json' -Body $body | Out-Null
  Write-Host '    OK   Local development owner account created' -ForegroundColor Green
}
