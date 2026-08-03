<#
  Reports the state of the local Supabase stack for Storybook Chronicles.

  Run it through npm from Windows PowerShell:
      npm run local:status

  This script is READ-ONLY. It never starts, stops, resets or modifies
  anything - not Docker Desktop, not Supabase, not the database. If Docker is
  not running it says so and exits; it will not launch Docker for you.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'lib\local-common.ps1')

Write-Host ""
Write-Host "Storybook Chronicles - local:status" -ForegroundColor White

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
  Write-Summary -Success $false -Title "Missing tools" -Lines @("Install the tools listed above, then re-run npm run local:status.")
  exit 1
}

$supabase = Get-SupabaseInvocation -RepoRoot $repoRoot
Write-Ok "Supabase CLI: $($supabase.Source)"

# --- 4. Docker health (observed, never started) --------------------------------
Write-Step "Checking Docker Desktop"
$engineState = Get-DockerEngineState

if ($engineState -eq 'unresponsive') {
  Write-Fail "Docker Desktop is running, but its engine did not answer."
  Show-DockerUnresponsiveGuidance
  Write-Summary -Success $false -Title "Docker engine is unresponsive" -Lines @(
    "Restart Docker Desktop using the steps above, then re-run npm run local:status.",
    "Nothing was started, stopped or changed."
  )
  exit 1
}

if ($engineState -ne 'healthy') {
  Write-Fail "The Docker engine is not running."
  Write-Guidance -Title "Nothing to report yet" -Lines @(
    "local:status does not start Docker on purpose - it only reports.",
    "",
    "To bring the stack up:  npm run local:up"
  )
  Write-Summary -Success $false -Title "Docker is not running" -Lines @("Run npm run local:up when you are ready to start.")
  exit 1
}
Write-Ok "Docker engine is responding"

# --- 5. Supabase status --------------------------------------------------------
Write-Step "Reading local Supabase status"

Push-Location $repoRoot
try {
  $statusResult = Invoke-Supabase -Invocation $supabase -Arguments @('status')
}
finally {
  Pop-Location
}

if ($statusResult.ExitCode -ne 0) {
  # The usual cause is simply that the stack is not up. That is a normal state,
  # not an error the owner needs to debug.
  if ($statusResult.Output -match '(?i)(not running|no such container|is not running)') {
    Write-Guidance -Title "The local Supabase stack is not running" -Lines @(
      "Docker is up, but this project's containers are not started.",
      "",
      "Start them with:  npm run local:up"
    )
    Write-Summary -Success $false -Title "Local Supabase is stopped" -Lines @("Run npm run local:up to start it.")
    exit 1
  }

  Write-Warn "supabase status exited with code $($statusResult.ExitCode)"
  Show-SupabaseFailureGuidance -Output $statusResult.Output -Operation 'status'
  Write-Summary -Success $false -Title "Could not read local Supabase status"
  exit 1
}

Write-Summary -Success $true -Title "Local Supabase is running" -Lines @(
  "The URLs and keys above belong to your LOCAL stack only.",
  "Nothing was started, stopped or changed by this command."
)
exit 0
