<#
  Starts the local Supabase stack for Storybook Chronicles.

  Run it through npm from Windows PowerShell:
      npm run local:up

  What it does NOT do, by design:
    - never touches the remote Supabase project
    - never runs `supabase db reset` or `supabase db push`
    - never creates or deletes Docker containers itself (Supabase owns those)
#>
[CmdletBinding()]
param(
  # How long to wait for the Docker engine to answer before giving up.
  [int]$DockerTimeoutSeconds = 180
)

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'lib\local-common.ps1')

Write-Host ""
Write-Host "Storybook Chronicles - local:up" -ForegroundColor White

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
  Write-Summary -Success $false -Title "Missing tools" -Lines @("Install the tools listed above, then re-run npm run local:up.")
  exit 1
}

$supabase = Get-SupabaseInvocation -RepoRoot $repoRoot
Write-Ok "Supabase CLI: $($supabase.Source)"

# --- 4. Docker health ---------------------------------------------------------
Write-Step "Checking Docker Desktop"
$engineState = Get-DockerEngineState

if ($engineState -eq 'unresponsive') {
  # Docker Desktop is already up, so relaunching it would achieve nothing.
  # Only the owner can safely decide how to restart a wedged engine.
  Write-Fail "Docker Desktop is running, but its engine did not answer."
  Show-DockerUnresponsiveGuidance
  Write-Summary -Success $false -Title "Docker engine is unresponsive" -Lines @(
    "Restart Docker Desktop using the steps above, then re-run npm run local:up.",
    "Nothing was started, stopped or deleted."
  )
  exit 1
}

if ($engineState -eq 'healthy') {
  Write-Ok "Docker engine is already running"
}
else {
  Write-Info "Docker engine is not running yet."
  $launched = Start-DockerDesktopIfInstalled

  if (-not $launched) {
    Write-Fail "Docker Desktop could not be started automatically."
    Show-DockerNotReadyGuidance
    Write-Summary -Success $false -Title "Docker is not available" -Lines @("Start Docker Desktop manually, then re-run npm run local:up.")
    exit 1
  }

  Write-Info "Waiting for the Docker engine (up to ${DockerTimeoutSeconds}s)..."
  if (-not (Wait-DockerHealthy -TimeoutSeconds $DockerTimeoutSeconds)) {
    Show-DockerNotReadyGuidance
    Write-Summary -Success $false -Title "Docker did not become ready" -Lines @("Open Docker Desktop, wait for 'Engine running', then re-run npm run local:up.")
    exit 1
  }
}

# --- 5. Start Supabase --------------------------------------------------------
# Only reached once Docker is confirmed healthy.
Write-Step "Starting the local Supabase stack"
Write-Info "This can take several minutes the first time while images download."

Push-Location $repoRoot
try {
  $startResult = Invoke-Supabase -Invocation $supabase -Arguments @('start')

  if ($startResult.ExitCode -ne 0) {
    # `already running` is a benign outcome; treat it as success and fall through
    # to the status report rather than failing the whole command.
    if ($startResult.Output -match '(?i)already running') {
      Write-Warn "The stack was already running - continuing to the status report."
    }
    else {
      Write-Fail "supabase start exited with code $($startResult.ExitCode)"
      Show-SupabaseFailureGuidance -Output $startResult.Output -Operation 'start'
      Write-Summary -Success $false -Title "Local Supabase did not start" -Lines @("Follow the guidance above, then re-run npm run local:up.")
      exit 1
    }
  }
  else {
    Write-Ok "supabase start completed"
  }

  # --- 6. Status report -------------------------------------------------------
  Write-Step "Reading local Supabase status"
  $statusResult = Invoke-Supabase -Invocation $supabase -Arguments @('status')

  if ($statusResult.ExitCode -ne 0) {
    Write-Warn "supabase status exited with code $($statusResult.ExitCode)"
    Show-SupabaseFailureGuidance -Output $statusResult.Output -Operation 'status'
    Write-Summary -Success $false -Title "Started, but status could not be read" -Lines @(
      "The containers may still be settling.",
      "Wait about 30 seconds, then run: npm run local:status"
    )
    exit 1
  }
}
finally {
  Pop-Location
}

# --- 7. Summary ---------------------------------------------------------------
Write-Summary -Success $true -Title "Local Supabase is running" -Lines @(
  "The URLs and keys above belong to your LOCAL stack only.",
  "",
  "Check it later with:  npm run local:status",
  "Shut it down with:    npm run local:down   (your local data is kept)",
  "",
  "Start the app with:   npm run dev"
)
exit 0
