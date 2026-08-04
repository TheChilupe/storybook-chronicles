# Shared helpers for the local:up / local:status / local:down scripts.
#
# Dot-source this file; it defines functions only and performs no side effects.
# Written for Windows PowerShell 5.1 so the npm scripts work without pwsh 7.

# PowerShell 7.3+ makes native commands honour $ErrorActionPreference = 'Stop'.
# We probe exit codes deliberately (docker info, supabase status), so turn that
# off when the variable exists.
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -Scope Global -ErrorAction SilentlyContinue) {
  $global:PSNativeCommandUseErrorActionPreference = $false
}

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok {
  param([string]$Message)
  Write-Host "    OK   $Message" -ForegroundColor Green
}

function Write-Info {
  param([string]$Message)
  Write-Host "         $Message" -ForegroundColor DarkGray
}

function Write-Warn {
  param([string]$Message)
  Write-Host "    WARN $Message" -ForegroundColor Yellow
}

function Write-Fail {
  param([string]$Message)
  Write-Host "    FAIL $Message" -ForegroundColor Red
}

function Write-Guidance {
  # Prints an actionable block instead of dumping raw tool output at the owner.
  param(
    [string]$Title,
    [string[]]$Lines
  )
  Write-Host ""
  Write-Host "  $Title" -ForegroundColor Yellow
  foreach ($line in $Lines) {
    Write-Host "    $line" -ForegroundColor Gray
  }
  Write-Host ""
}

function Test-IsWindowsHost {
  # $IsWindows only exists in PowerShell 6+. Its absence means Windows PowerShell.
  $flag = Get-Variable -Name IsWindows -ErrorAction SilentlyContinue
  if ($null -eq $flag) { return $true }
  return [bool]$flag.Value
}

function Assert-NotWsl {
  <#
    Phase 1 is a Windows-PowerShell workflow. Docker Desktop's named pipe and the
    Supabase CLI's host ports do not line up the same way from inside a WSL
    distro, so stop early with an instruction rather than a confusing failure.
  #>
  $reason = $null

  if ($env:WSL_DISTRO_NAME) {
    $reason = "WSL distro detected: $env:WSL_DISTRO_NAME"
  }
  elseif ($env:WSL_INTEROP) {
    $reason = "WSL interop socket detected"
  }
  elseif (Test-Path -LiteralPath '/proc/version') {
    $procVersion = Get-Content -LiteralPath '/proc/version' -ErrorAction SilentlyContinue
    if ($procVersion -match '(?i)microsoft') {
      $reason = "Linux kernel reports a Microsoft/WSL build"
    }
    else {
      $reason = "Running on a Linux host, not Windows"
    }
  }
  elseif (-not (Test-IsWindowsHost)) {
    $reason = "PowerShell reports a non-Windows platform"
  }

  if ($reason) {
    Write-Fail "This script must run in Windows PowerShell."
    Write-Guidance -Title "$reason" -Lines @(
      "Close this shell and open Windows PowerShell on Windows itself:",
      "",
      "  1. Press Start and open 'Windows PowerShell' (or 'Terminal').",
      "  2. cd to the repository, e.g.",
      "       cd C:\Users\thech\source\repos\storybook-chronicles",
      "  3. Re-run the command, e.g. npm run local:up",
      "",
      "In VS Code: open the terminal dropdown and pick 'PowerShell',",
      "not 'WSL' or 'Ubuntu'."
    )
    return $false
  }

  Write-Ok "Running in Windows PowerShell (v$($PSVersionTable.PSVersion))"
  return $true
}

function Resolve-RepoRoot {
  <#
    Scripts live in <root>/scripts, so the root is the parent of the parent of
    this library. Confirm the required markers before any tool is invoked.
  #>
  param([Parameter(Mandatory = $true)][string]$ScriptDirectory)

  $root = Split-Path -Parent $ScriptDirectory

  $packageJson = Join-Path $root 'package.json'
  $supabaseDir = Join-Path $root 'supabase'
  $configToml = Join-Path $supabaseDir 'config.toml'

  $missing = @()
  if (-not (Test-Path -LiteralPath $packageJson)) { $missing += 'package.json' }
  if (-not (Test-Path -LiteralPath $configToml)) { $missing += 'supabase/config.toml' }

  if ($missing.Count -gt 0) {
    Write-Fail "Not at the repository root - missing: $($missing -join ', ')"
    Write-Guidance -Title "Expected layout" -Lines @(
      "$root",
      "  package.json",
      "  supabase/config.toml",
      "  scripts/local-up.ps1",
      "",
      "Run these commands from the repository root via npm, e.g.",
      "  npm run local:up",
      "rather than calling the .ps1 file from another directory."
    )
    return $null
  }

  Write-Ok "Repository root: $root"
  Write-Info "package.json found"
  Write-Info "supabase/config.toml found"

  # Soft identity check. A missing marker is worth flagging but is not fatal,
  # since routes and migrations get renamed over the life of the project.
  $identityMarkers = @(
    (Join-Path (Join-Path $root 'src') 'routes\storybook-chronicles.tsx'),
    (Join-Path $supabaseDir 'migrations')
  )
  $found = $false
  foreach ($marker in $identityMarkers) {
    if (Test-Path -LiteralPath $marker) { $found = $true; break }
  }
  if ($found) {
    Write-Ok "Looks like the Storybook Chronicles project"
  }
  else {
    Write-Warn "Could not confirm this is Storybook Chronicles (no storybook-chronicles route or supabase/migrations)."
    Write-Info "Continuing anyway - package.json and supabase/config.toml are both present."
  }

  return $root
}

function Assert-RequiredTools {
  <# Confirms node, npm, npx and docker are on PATH and reports versions. #>
  param([string[]]$Tools = @('node', 'npm', 'npx', 'docker'))

  $missing = @()
  foreach ($tool in $Tools) {
    $cmd = Get-Command $tool -ErrorAction SilentlyContinue
    if ($null -eq $cmd) {
      $missing += $tool
      continue
    }

    $version = $null
    try {
      $raw = & $tool --version 2>&1
      if ($LASTEXITCODE -eq 0 -and $raw) {
        $version = (($raw | Select-Object -First 1) -as [string]).Trim()
      }
    }
    catch {
      $version = $null
    }

    if ($version) { Write-Ok "$tool $version" } else { Write-Ok "$tool found" }
  }

  if ($missing.Count -gt 0) {
    Write-Fail "Missing required tool(s): $($missing -join ', ')"
    $lines = @()
    if ($missing -contains 'node' -or $missing -contains 'npm' -or $missing -contains 'npx') {
      $lines += "Install Node.js LTS from https://nodejs.org (this provides node, npm and npx),"
      $lines += "then close and reopen PowerShell so PATH refreshes."
      $lines += ""
    }
    if ($missing -contains 'docker') {
      $lines += "Install Docker Desktop from https://www.docker.com/products/docker-desktop"
      $lines += "then close and reopen PowerShell so PATH refreshes."
    }
    Write-Guidance -Title "How to fix" -Lines $lines
    return $false
  }

  return $true
}

function Get-DockerEngineState {
  <#
    Probes the Docker engine and returns one of:
      'healthy'      - the engine answered
      'unresponsive' - the CLI hung; Docker Desktop is up but its backend is wedged
      'down'         - the CLI returned an error (engine simply not running)

    The timeout matters: a wedged Docker Desktop makes `docker info` block
    forever, which would otherwise hang these scripts indefinitely rather than
    failing with a readable message. The probe is read-only and is killed on
    timeout; nothing about Docker's state is changed either way.
  #>
  param([int]$TimeoutSeconds = 20)

  $dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
  if ($null -eq $dockerCmd) { return 'down' }

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $dockerCmd.Source
  $psi.Arguments = 'info --format {{.ServerVersion}}'
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true

  $proc = $null
  try {
    $proc = [System.Diagnostics.Process]::Start($psi)
    if (-not $proc.WaitForExit($TimeoutSeconds * 1000)) {
      try { $proc.Kill() } catch { }
      return 'unresponsive'
    }
    if ($proc.ExitCode -eq 0) { return 'healthy' }
    return 'down'
  }
  catch {
    return 'down'
  }
  finally {
    if ($proc) { $proc.Dispose() }
  }
}

function Test-DockerHealthy {
  <# True when the Docker engine answers. Never starts or changes anything. #>
  param([int]$TimeoutSeconds = 20)
  return ((Get-DockerEngineState -TimeoutSeconds $TimeoutSeconds) -eq 'healthy')
}

function Show-DockerUnresponsiveGuidance {
  Write-Guidance -Title "Docker Desktop is running, but its engine is wedged" -Lines @(
    "'docker info' never returned. This is a Docker Desktop backend problem -",
    "your repository, migrations and local database are not affected.",
    "",
    "Work through these in order and stop as soon as it works:",
    "",
    "  1. Right-click the Docker whale in the system tray -> Quit Docker Desktop.",
    "     Wait ten seconds, reopen it, and wait for 'Engine running'.",
    "  2. If it persists, from Windows PowerShell:  wsl --shutdown",
    "     then reopen Docker Desktop.",
    "  3. If it still persists: Docker Desktop -> Troubleshoot -> Restart.",
    "  4. As a last resort, reboot Windows.",
    "",
    "Then re-run your command.",
    "",
    "Do NOT use 'Clean / Purge data' or 'Reset to factory defaults' - those",
    "delete the local Supabase volumes and your local database content."
  )
}

function Get-DockerDesktopPath {
  <#
    Finds 'Docker Desktop.exe'. Docker Desktop can be installed machine-wide
    under Program Files or per-user under %LOCALAPPDATA%\Programs, so check the
    registry and the docker CLI's own location before falling back to guesses.
  #>

  # 1. Registry install location (covers both per-machine and per-user installs).
  $uninstallKeys = @(
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
  )
  foreach ($key in $uninstallKeys) {
    $entries = Get-ItemProperty -Path $key -ErrorAction SilentlyContinue |
      Where-Object { $_.DisplayName -like 'Docker Desktop*' -and $_.InstallLocation }
    foreach ($entry in $entries) {
      $candidate = Join-Path $entry.InstallLocation 'Docker Desktop.exe'
      if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
  }

  # 2. Derive from the docker CLI, which lives at <install>\resources\bin\docker.exe.
  $dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
  if ($dockerCmd -and $dockerCmd.Source) {
    $dir = Split-Path -Parent $dockerCmd.Source
    for ($i = 0; $i -lt 4 -and $dir; $i++) {
      $candidate = Join-Path $dir 'Docker Desktop.exe'
      if (Test-Path -LiteralPath $candidate) { return $candidate }
      $dir = Split-Path -Parent $dir
    }
  }

  # 3. Known default install paths.
  $candidates = @()
  if ($env:ProgramFiles) {
    $candidates += (Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe')
  }
  if (${env:ProgramFiles(x86)}) {
    $candidates += (Join-Path ${env:ProgramFiles(x86)} 'Docker\Docker\Docker Desktop.exe')
  }
  if ($env:LOCALAPPDATA) {
    $candidates += (Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\Docker Desktop.exe')
    $candidates += (Join-Path $env:LOCALAPPDATA 'Docker\Docker Desktop.exe')
  }

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) { return $candidate }
  }
  return $null
}

function Start-DockerDesktopIfInstalled {
  <# Launches the Docker Desktop app. Does not create or touch containers. #>
  $exe = Get-DockerDesktopPath
  if ($null -eq $exe) {
    Write-Warn "Docker Desktop executable not found in the usual install locations."
    return $false
  }

  Write-Info "Launching Docker Desktop: $exe"
  try {
    Start-Process -FilePath $exe | Out-Null
    return $true
  }
  catch {
    Write-Warn "Could not launch Docker Desktop automatically: $($_.Exception.Message)"
    return $false
  }
}

function Wait-DockerHealthy {
  <# Polls `docker info` until it succeeds or the timeout elapses. #>
  param(
    [int]$TimeoutSeconds = 180,
    [int]$PollSeconds = 5
  )

  $started = Get-Date
  $deadline = $started.AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    # Each probe is individually bounded so a wedged engine cannot stall the loop.
    if ((Get-DockerEngineState -TimeoutSeconds 10) -eq 'healthy') {
      $took = [int]((Get-Date) - $started).TotalSeconds
      Write-Ok "Docker engine is responding (after ${took}s)"
      return $true
    }
    Start-Sleep -Seconds $PollSeconds
    $elapsed = [int]((Get-Date) - $started).TotalSeconds
    Write-Info "Still waiting for the Docker engine... ${elapsed}s / ${TimeoutSeconds}s"
  }

  Write-Fail "Docker engine did not become ready within ${TimeoutSeconds}s."
  return $false
}

function Show-DockerNotReadyGuidance {
  Write-Guidance -Title "Docker is not ready" -Lines @(
    "1. Open Docker Desktop from the Start menu.",
    "2. Wait for the bottom-left status to read 'Engine running'.",
    "3. First launch after a Windows update can take several minutes.",
    "4. Re-run: npm run local:up",
    "",
    "If Docker Desktop is open but the engine never starts, see",
    "docs/LOCAL_DEVELOPMENT.md -> Troubleshooting.",
    "",
    "Do not use Docker Desktop's 'Clean / Purge data' option - it deletes the",
    "local Supabase database volumes along with everything else."
  )
}

# The Supabase CLI version this workflow is validated against. The npx fallback
# is pinned to it deliberately: an unversioned `npx supabase` resolves to
# whatever happens to be cached or latest, which silently drifts between
# machines and between runs.
$script:SupabaseCliVersion = '2.111.0'

# Services skipped by `local:up -Minimal`, for machines where the full stack does
# not fit in Docker's memory allocation. Studio and the analytics pair
# (logflare + vector) are the memory-hungry optional pieces; postgres-meta only
# serves Studio; imgproxy, mailpit and supavisor are not needed for local schema
# work. What remains is Postgres, Auth, REST, Realtime, Storage and Kong.
$script:MinimalExcludedServices = 'studio,logflare,vector,imgproxy,edge-runtime,postgres-meta,mailpit,supavisor'

function Get-SupabaseInvocation {
  <#
    Resolves the Supabase CLI without depending on a global install.
    Prefers a project-local npm bin shim if one already exists; otherwise falls
    back to a version-pinned `npx --yes supabase@<version>`.
  #>
  param([Parameter(Mandatory = $true)][string]$RepoRoot)

  $binDir = Join-Path (Join-Path $RepoRoot 'node_modules') '.bin'
  foreach ($name in @('supabase.cmd', 'supabase.exe', 'supabase')) {
    $candidate = Join-Path $binDir $name
    if (Test-Path -LiteralPath $candidate) {
      return [pscustomobject]@{
        Exe    = $candidate
        Prefix = @()
        Source = 'project-local (node_modules/.bin)'
      }
    }
  }

  $pinned = "supabase@$($script:SupabaseCliVersion)"
  return [pscustomobject]@{
    Exe    = 'npx'
    Prefix = @('--yes', $pinned)
    Source = "npx $pinned (pinned; first run downloads it)"
  }
}

function Invoke-Supabase {
  <#
    Runs the Supabase CLI, streaming output to the console while capturing it so
    the caller can turn known failures into readable guidance.
    Returns an object with ExitCode and Output.
  #>
  param(
    [Parameter(Mandatory = $true)]$Invocation,
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  $argList = @()
  if ($Invocation.Prefix.Count -gt 0) { $argList += $Invocation.Prefix }
  $argList += $Arguments

  Write-Info "supabase $($Arguments -join ' ')"

  $collected = New-Object System.Collections.Generic.List[string]

  # Windows PowerShell raises a *terminating* NativeCommandError when a native
  # command writes to stderr while $ErrorActionPreference is 'Stop' and stderr is
  # merged with 2>&1. The Supabase CLI writes ordinary diagnostics to stderr, so
  # leaving the preference at 'Stop' here would abort the script before any of the
  # failure guidance below could run. Relax it for this call only.
  $previousEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & $Invocation.Exe @argList 2>&1 | ForEach-Object {
      $line = [string]$_
      Write-Host "    $line"
      $collected.Add($line)
    }
    $code = $LASTEXITCODE
  }
  finally {
    $ErrorActionPreference = $previousEap
  }

  return [pscustomobject]@{
    ExitCode = $code
    Output   = ($collected -join "`n")
  }
}

function Show-SupabaseFailureGuidance {
  <#
    Maps the failures the owner is most likely to hit onto concrete next steps.
    Every suggestion here is non-destructive.
  #>
  param(
    [string]$Output,
    [string]$Operation = 'start'
  )

  if ($Output -match '(?i)read-only file system') {
    Write-Guidance -Title "Docker reported a read-only file system" -Lines @(
      "This is a Docker Desktop / WSL backend glitch, not a problem with the",
      "repository or the database. Work through these in order:",
      "",
      "  1. Right-click the Docker whale in the system tray -> Quit Docker Desktop.",
      "     Wait ten seconds, then reopen Docker Desktop and wait for",
      "     'Engine running'.",
      "  2. If it persists, restart the WSL backend from Windows PowerShell:",
      "       wsl --shutdown",
      "     then reopen Docker Desktop.",
      "  3. If it still persists, Docker Desktop -> Troubleshoot -> Restart.",
      "  4. As a last resort, reboot Windows.",
      "",
      "Then re-run: npm run local:up",
      "",
      "Do NOT use 'Clean / Purge data' or 'Reset to factory defaults'. Those",
      "delete the local Supabase volumes and your local database content."
    )
    return
  }

  if ($Output -match '(?i)(address already in use|port is already allocated|bind: an attempt was made)') {
    Write-Guidance -Title "A required port is already taken" -Lines @(
      "Something else is listening on a port Supabase needs (commonly 54321,",
      "54322 or 54323 - another Supabase instance or a local Postgres).",
      "",
      "  1. Stop this project's stack cleanly:  npm run local:down",
      "  2. Re-run:                             npm run local:up",
      "",
      "If it still fails, find the owner of the port, for example:",
      "  Get-NetTCPConnection -LocalPort 54322 | Select-Object OwningProcess",
      "  Get-Process -Id <OwningProcess>",
      "",
      "Stop that program yourself - the script will not kill processes for you."
    )
    return
  }

  if ($Output -match '(?i)(cannot connect to the docker daemon|docker daemon is not running|error during connect)') {
    Show-DockerNotReadyGuidance
    return
  }

  # Check health-check timeouts BEFORE the download branch. A first start often
  # exceeds the CLI's health-check window even though every image pulled fine,
  # and reporting that as a network problem sends the owner down the wrong path.
  if ($Output -match '(?i)(healthcheck|health check|container is not ready|unhealthy)') {
    Write-Guidance -Title "Containers did not report healthy in time" -Lines @(
      "The images downloaded correctly. This is a startup timing or memory",
      "problem, not a network problem.",
      "",
      "  1. If you started the FULL stack with npm run local:up:full, use the",
      "     default reduced stack instead - it is the supported workflow here:",
      "       npm run local:up",
      "  2. If the reduced stack itself failed, free memory by closing browsers",
      "     and other heavy apps, then:",
      "       npm run local:down",
      "       npm run local:up",
      "  3. Check what Docker actually has to work with:",
      "       docker info --format 'CPUs: {{.NCPU}} | Mem: {{.MemTotal}}'",
      "     Raise the limits under Docker Desktop -> Settings -> Resources only",
      "     if the host genuinely has memory to spare.",
      "",
      "A failed start rolls back every container it created, so it leaves nothing",
      "running and does not affect your local database data."
    )
    return
  }

  # 'i/o timeout' is deliberately specific - a bare 'timeout' also matches
  # health-check errors, which are not download failures.
  if ($Output -match '(?i)(no such image|failed to (pull|resolve)|manifest unknown|network is unreachable|i/o timeout|tls handshake)') {
    Write-Guidance -Title "Docker could not download a Supabase image" -Lines @(
      "This is usually a network or Docker Hub hiccup.",
      "",
      "  1. Confirm you have internet access.",
      "  2. Check any VPN or corporate proxy.",
      "  3. Re-run: npm run local:up   (partial downloads resume)"
    )
    return
  }

  if ($Output -match '(?i)(supabase start is already running|already running)') {
    Write-Guidance -Title "The local stack is already running" -Lines @(
      "Check what is up with:  npm run local:status",
      "Stop it with:           npm run local:down"
    )
    return
  }

  Write-Guidance -Title "supabase $Operation failed" -Lines @(
    "The CLI output is above. Common first moves:",
    "",
    "  1. Confirm Docker Desktop shows 'Engine running'.",
    "  2. npm run local:down   then   npm run local:up",
    "  3. See docs/LOCAL_DEVELOPMENT.md -> Troubleshooting",
    "",
    "Do not run 'supabase db reset' to get out of a startup problem - it wipes",
    "the local database."
  )
}

function Write-Summary {
  param(
    [bool]$Success,
    [string]$Title,
    [string[]]$Lines = @()
  )

  Write-Host ""
  Write-Host ("-" * 64) -ForegroundColor DarkGray
  if ($Success) {
    Write-Host "  SUCCESS  $Title" -ForegroundColor Green
  }
  else {
    Write-Host "  FAILED   $Title" -ForegroundColor Red
  }
  foreach ($line in $Lines) {
    Write-Host "           $line" -ForegroundColor Gray
  }
  Write-Host ("-" * 64) -ForegroundColor DarkGray
  Write-Host ""
}
