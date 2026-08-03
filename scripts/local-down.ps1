<#
  Stops the local Supabase stack for Storybook Chronicles.

  Run it through npm from Windows PowerShell:
      npm run local:down

  Data safety:
    - runs a plain `supabase stop`, which keeps the local database volume
    - never passes --no-backup (that flag would discard your local data)
    - never runs `docker system prune`, `docker volume rm` or similar
    - only Supabase's own containers for this project are affected; unrelated
      containers, images and volumes are left completely alone
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'lib\local-common.ps1')

Write-Host ""
Write-Host "Storybook Chronicles - local:down" -ForegroundColor White

# --- 1. Shell check -----------------------------------------------------------
Write-Step "Checking the shell"
if (-not (Assert-NotWsl)) {
  Write-Summary -Success $false -Title "Wrong shell" -Lines @("Re-run from Windows PowerShell.")
  exit 1
}

# --- 2. Repository check ------------------------------------------------------
Write-Step "Checking the repository"
$repoRoot = Resolve-RepoRoot -ScriptDirectory $PSScriptRoot
if ($null -eq $repoRoot) {
  Write-Summary -Success $false -Title "Repository check failed"
  exit 1
}

# --- 3. Tooling check ---------------------------------------------------------
Write-Step "Checking required tools"
if (-not (Assert-RequiredTools -Tools @('node', 'npm', 'npx', 'docker'))) {
  Write-Summary -Success $false -Title "Missing tools" -Lines @("Install the tools listed above, then re-run npm run local:down.")
  exit 1
}

$supabase = Get-SupabaseInvocation -RepoRoot $repoRoot
Write-Ok "Supabase CLI: $($supabase.Source)"

# --- 4. Docker health ----------------------------------------------------------
# If the engine is down the containers are already down with it. That is the
# desired end state, so report it and exit successfully.
Write-Step "Checking Docker Desktop"
$engineState = Get-DockerEngineState

if ($engineState -eq 'unresponsive') {
  # Containers may well still exist, so reporting "nothing to stop" would be a lie.
  Write-Fail "Docker Desktop is running, but its engine did not answer."
  Show-DockerUnresponsiveGuidance
  Write-Summary -Success $false -Title "Cannot stop the stack right now" -Lines @(
    "The Docker engine is wedged, so the Supabase containers cannot be stopped cleanly.",
    "Restart Docker Desktop using the steps above, then re-run npm run local:down.",
    "Your local database data is untouched."
  )
  exit 1
}

if ($engineState -ne 'healthy') {
  Write-Warn "The Docker engine is not running."
  Write-Summary -Success $true -Title "Nothing to stop" -Lines @(
    "Docker is not running, so the local Supabase containers are not running either.",
    "Your local database data is untouched."
  )
  exit 0
}
Write-Ok "Docker engine is responding"

# --- 5. Stop Supabase ----------------------------------------------------------
Write-Step "Stopping the local Supabase stack"
Write-Info "Using a plain 'supabase stop' so the local database is preserved."

Push-Location $repoRoot
try {
  $stopResult = Invoke-Supabase -Invocation $supabase -Arguments @('stop')
}
finally {
  Pop-Location
}

if ($stopResult.ExitCode -ne 0) {
  if ($stopResult.Output -match '(?i)(not running|no containers|nothing to stop)') {
    Write-Summary -Success $true -Title "Nothing to stop" -Lines @(
      "The local Supabase stack was not running.",
      "Your local database data is untouched."
    )
    exit 0
  }

  Write-Fail "supabase stop exited with code $($stopResult.ExitCode)"
  Show-SupabaseFailureGuidance -Output $stopResult.Output -Operation 'stop'
  Write-Summary -Success $false -Title "Local Supabase did not stop cleanly" -Lines @(
    "Check what is still up with:  npm run local:status",
    "",
    "Do not delete Docker containers or volumes by hand to work around this -",
    "that is how local database data gets lost."
  )
  exit 1
}

Write-Summary -Success $true -Title "Local Supabase is stopped" -Lines @(
  "Your local database data has been preserved.",
  "Unrelated Docker containers, images and volumes were not touched.",
  "",
  "Start it again with:  npm run local:up"
)
exit 0
