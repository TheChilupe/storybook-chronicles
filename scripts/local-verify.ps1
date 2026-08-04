<#
  Read-only verification of the canonical Adam Story / The Giver / Ezra Zone
  import against the LOCAL Supabase database.

  Run it through npm from Windows PowerShell:
      npm run local:verify

  Verifies the results of:
      supabase/migrations/20260729090000_import_canonical_adam_story_and_ezra_zone_profiles.sql

  Safety properties:
    - Every query runs with default_transaction_read_only=on, enforced by the
      PostgreSQL server, so an INSERT/UPDATE/DELETE would be rejected even if one
      were introduced by mistake.
    - Queries reach the database through `docker exec` into the LOCAL container
      only. There is no network path to the remote Supabase project, and no
      connection string, password, key or token is ever constructed or printed.
    - Nothing is started, stopped, reset or migrated.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'lib\local-common.ps1')

Write-Host ""
Write-Host "Storybook Chronicles - local:verify" -ForegroundColor White

# --- Guards -------------------------------------------------------------------
Write-Step "Checking the shell"
if (-not (Assert-NotWsl)) {
  Write-Summary -Success $false -Title "Wrong shell" -Lines @("Re-run from Windows PowerShell.")
  exit 1
}

Write-Step "Checking the repository"
$repoRoot = Resolve-RepoRoot -ScriptDirectory $PSScriptRoot
if ($null -eq $repoRoot) {
  Write-Summary -Success $false -Title "Repository check failed"
  exit 1
}

Write-Step "Checking required tools"
if (-not (Assert-RequiredTools -Tools @('docker'))) {
  Write-Summary -Success $false -Title "Missing tools"
  exit 1
}

Write-Step "Checking Docker Desktop"
$engineState = Get-DockerEngineState
if ($engineState -eq 'unresponsive') {
  Write-Fail "Docker Desktop is running, but its engine did not answer."
  Show-DockerUnresponsiveGuidance
  Write-Summary -Success $false -Title "Docker engine is unresponsive"
  exit 1
}
if ($engineState -ne 'healthy') {
  Write-Fail "The Docker engine is not running."
  Write-Guidance -Title "Nothing to verify yet" -Lines @(
    "The local database must be running before it can be verified.",
    "",
    "Start it with:  npm run local:up"
  )
  Write-Summary -Success $false -Title "Docker is not running"
  exit 1
}
Write-Ok "Docker engine is responding"

# --- Resolve the local database container -------------------------------------
# Derived from supabase/config.toml rather than hard-coded, so the script follows
# the project rather than one machine.
Write-Step "Locating the local database container"
$configPath = Join-Path (Join-Path $repoRoot 'supabase') 'config.toml'
$configText = Get-Content -LiteralPath $configPath -Raw
if ($configText -notmatch 'project_id\s*=\s*"([^"]+)"') {
  Write-Fail "Could not read project_id from supabase/config.toml"
  Write-Summary -Success $false -Title "Cannot identify the local database"
  exit 1
}
$projectId = $Matches[1]
$script:DbContainer = "supabase_db_$projectId"

$running = & docker ps --filter "name=$($script:DbContainer)" --filter 'status=running' --format '{{.Names}}' 2>$null
if (-not $running) {
  Write-Fail "Local database container '$($script:DbContainer)' is not running."
  Write-Guidance -Title "The local stack is not up" -Lines @(
    "Start it with:  npm run local:up",
    "Then re-run:    npm run local:verify"
  )
  Write-Summary -Success $false -Title "Local database is not running"
  exit 1
}
Write-Ok "Database container: $($script:DbContainer)"
Write-Info "Queries run read-only (default_transaction_read_only=on), local container only."

# --- SQL plumbing -------------------------------------------------------------
function Invoke-Sql {
  <# Runs one read-only query and returns its single scalar result as text. #>
  param([Parameter(Mandatory = $true)][string]$Sql)

  $previousEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $raw = & docker exec `
      -e PGOPTIONS='-c default_transaction_read_only=on' `
      $script:DbContainer `
      psql -U postgres -d postgres -v ON_ERROR_STOP=1 -At -c $Sql 2>&1
    $code = $LASTEXITCODE
  }
  finally {
    $ErrorActionPreference = $previousEap
  }

  $text = (($raw | ForEach-Object { [string]$_ }) -join "`n").Trim()
  return [pscustomobject]@{ ExitCode = $code; Text = $text }
}

$script:Assertions = New-Object System.Collections.Generic.List[object]

function Format-AssertionLabel {
  <# '3' -> '03 ', '3a' -> '03a', so numbered and sub-lettered ids stay aligned. #>
  param([string]$Id)
  if ($Id -match '^(\d+)([A-Za-z]*)$') {
    $label = ('{0:00}{1}' -f [int]$Matches[1], $Matches[2])
  }
  else {
    $label = $Id
  }
  return $label.PadRight(3)
}

function Write-AssertionResult {
  <#
    Renders one result. $Evidence makes the basis of the check explicit:
      'db'     - observed in the live local database
      'static' - observed by inspecting the canonical migration file
  #>
  param(
    [string]$Label,
    [string]$Evidence,
    [string]$Description,
    [bool]$Passed,
    [string]$Detail
  )

  $status = if ($Passed) { 'PASS' } else { 'FAIL' }
  $colour = if ($Passed) { 'Green' } else { 'Red' }
  Write-Host ("  {0}  [{1}] {2} {3}" -f $status, $Label, $Evidence.PadRight(6), $Description) -ForegroundColor $colour
  if (-not $Passed -and $Detail) {
    Write-Host ("            {0}" -f $Detail) -ForegroundColor DarkGray
  }
}

function Test-Assertion {
  <# Assertion backed by live-database evidence. #>
  param(
    [Parameter(Mandatory = $true)][string]$Id,
    [Parameter(Mandatory = $true)][string]$Description,
    [Parameter(Mandatory = $true)][string]$Sql,
    [string]$Expected = 'true'
  )

  $result = Invoke-Sql -Sql $Sql
  $label = Format-AssertionLabel -Id $Id

  if ($result.ExitCode -ne 0) {
    Write-AssertionResult -Label $label -Evidence 'db' -Description $Description -Passed $false -Detail ("query error: {0}" -f $result.Text)
    $script:Assertions.Add([pscustomobject]@{ Label = $label.Trim(); Passed = $false; Evidence = 'db' })
    return
  }

  $passed = ($result.Text -eq $Expected)
  $detail = if ($passed) { '' } else { "expected '$Expected' but got '$($result.Text)'" }
  Write-AssertionResult -Label $label -Evidence 'db' -Description $Description -Passed $passed -Detail $detail
  $script:Assertions.Add([pscustomobject]@{ Label = $label.Trim(); Passed = $passed; Evidence = 'db' })
}

function Test-StaticAssertion {
  <#
    Assertion backed by static inspection of the canonical migration file rather
    than by database state. Used where the database alone cannot prove intent -
    for example that a row was updated in place instead of deleted and recreated.
  #>
  param(
    [Parameter(Mandatory = $true)][string]$Id,
    [Parameter(Mandatory = $true)][string]$Description,
    [Parameter(Mandatory = $true)][scriptblock]$Check
  )

  $label = Format-AssertionLabel -Id $Id
  $passed = $false
  $detail = ''
  try {
    $passed = [bool](& $Check)
    if (-not $passed) { $detail = 'static inspection of the canonical migration did not match the expected structure' }
  }
  catch {
    $passed = $false
    $detail = "static check error: $($_.Exception.Message)"
  }

  Write-AssertionResult -Label $label -Evidence 'static' -Description $Description -Passed $passed -Detail $detail
  $script:Assertions.Add([pscustomobject]@{ Label = $label.Trim(); Passed = $passed; Evidence = 'static' })
}

# Fields a visitor can see without unlocking spoilers. spoiler_md is deliberately
# excluded - it is the one place secret-identity information is allowed to live.
$PublicFields = "concat_ws(' ', name, alias, role, eyebrow, tagline, canon_summary_md, identity_md, story_role_md, core_conflict_md)"

# Every stored profile field, public and spoiler alike. A retired title must not
# survive anywhere, not merely in the publicly rendered fields.
$AllProfileFields = "concat_ws(' ', name, alias, role, eyebrow, tagline, canon_summary_md, identity_md, story_role_md, spoiler_md, core_conflict_md)"

# The exact retired title for The Giver, per project canon. This is the
# authoritative check for assertion 10.
$RetiredGiverTitle = 'prince\s+of\s+crime'

# SEPARATE legacy-placeholder wording, carried by the pre-canonical Giver rows the
# Room, Jennifer and Fez imports created. These are NOT the retired canonical
# title; they are checked independently as assertion 21 so the two concerns are
# never conflated.
$LegacyPlaceholderPhrases = 'mysterious power-granting|power-granting controller|power-granting experimenter'

# The canonical migration whose result this script verifies.
$MigrationFile = Join-Path (Join-Path (Join-Path $repoRoot 'supabase') 'migrations') '20260729090000_import_canonical_adam_story_and_ezra_zone_profiles.sql'
if (-not (Test-Path -LiteralPath $MigrationFile)) {
  Write-Fail "Canonical migration not found: $MigrationFile"
  Write-Summary -Success $false -Title "Cannot perform static verification"
  exit 1
}
$MigrationText = Get-Content -LiteralPath $MigrationFile -Raw

Write-Step "Verifying the Adam Story / The Giver / Ezra Zone import"
Write-Info "Evidence column:"
Write-Info "  db      = observed in the live local database"
Write-Info "  static  = observed by inspecting the canonical migration file"
Write-Host ""
Write-Host "  CHARACTER RECORDS" -ForegroundColor White

Test-Assertion 1 "Exactly one character exists for each of adam-story, giver, ezra-zone" @"
select (
  (select count(*) from public.characters where slug='adam-story')=1 and
  (select count(*) from public.characters where slug='giver')=1 and
  (select count(*) from public.characters where slug='ezra-zone')=1
)::text;
"@

Test-Assertion 2 "All three characters have distinct UUIDs" @"
select (count(distinct id)=3 and count(*)=3)::text
from public.characters where slug in ('adam-story','giver','ezra-zone');
"@

# Assertion 3 concerns preservation of the Giver record. The original UUID is
# generated dynamically by the earlier Room import, so no literal expected UUID
# exists anywhere to compare against, and none is claimed here. Preservation is
# instead established by two pieces of live evidence plus one static one.
Test-Assertion '3a' "The Giver record predates the Adam/Ezra canonical import" @"
select (g.created_at < least(a.created_at, e.created_at))::text
from (select created_at from public.characters where slug='giver') g,
     (select created_at from public.characters where slug='adam-story') a,
     (select created_at from public.characters where slug='ezra-zone') e;
"@

Test-Assertion '3b' "Existing Room, Jennifer and Fez relationships still target the current Giver record" @"
select (count(distinct src.slug)=3)::text
from public.character_relationships r
join public.characters src on src.id = r.character_id
where src.slug in ('room','jennifer','fez')
  and r.related_character_id = (select id from public.characters where slug='giver');
"@

Test-StaticAssertion '3c' "Canonical migration selects and updates the existing Giver in place, never deleting and recreating it" {
  # The existing row is located and captured into giver_id ...
  $selectsExisting = $MigrationText -match 'INTO\s+candidate_count,\s*giver_id'
  # ... then updated in place by primary key ...
  $updatesInPlace = $MigrationText -match '(?s)UPDATE\s+public\.characters.*?WHERE\s+id\s*=\s*giver_id\s*;'
  # ... and no character row is ever deleted by this migration.
  $neverDeletes = -not ($MigrationText -match 'DELETE\s+FROM\s+public\.characters')
  return ($selectsExisting -and $updatesInPlace -and $neverDeletes)
}

Test-Assertion 4 "All three are canon, published, not archived, and linked to Story 1" @"
select (count(*)=3)::text
from public.characters c
join public.character_stories cs on cs.character_id = c.id
join public.stories s on s.id = cs.story_id and s.number = 1
where c.slug in ('adam-story','giver','ezra-zone')
  and c.canon_status = 'canon'
  and c.status = 'published'
  and c.archived_at is null;
"@

Write-Host ""
Write-Host "  ADAM STORY" -ForegroundColor White

Test-Assertion 5 "Adam's public alias is null or empty" @"
select (coalesce(trim(alias),'') = '')::text
from public.characters where slug='adam-story';
"@

Test-Assertion 6 "Adam has no structured power links, faction memberships, or relationships" @"
select (
  (select count(*) from public.character_powers p
     where p.character_id = (select id from public.characters where slug='adam-story')) = 0
  and (select count(*) from public.character_factions f
     where f.character_id = (select id from public.characters where slug='adam-story')) = 0
  and (select count(*) from public.character_relationships r
     where r.character_id = (select id from public.characters where slug='adam-story')
        or r.related_character_id = (select id from public.characters where slug='adam-story')) = 0
)::text;
"@

Test-Assertion 7 "Adam's public structured fields do not identify him as The Giver" @"
select ($PublicFields !~* '(giver|boundless king)')::text
from public.characters where slug='adam-story';
"@

Test-Assertion 8 "Adam/Giver identity information exists only in spoiler-controlled text" @"
select (
  coalesce(spoiler_md,'') ~* 'giver'
  and $PublicFields !~* '(giver|boundless king)'
)::text
from public.characters where slug='adam-story';
"@

Write-Host ""
Write-Host "  THE GIVER" -ForegroundColor White

Test-Assertion 9 "The Giver's title is exactly 'Boundless King'" @"
select (trim(coalesce(substring(identity_md from '\*\*Title:\*\*[ \t]*([^\n\r]*)'),'')) = 'Boundless King')::text
from public.characters where slug='giver';
"@

Test-Assertion 10 "The retired title 'Prince of Crime' appears nowhere in the Giver's stored profile (public or spoiler)" @"
select ($AllProfileFields !~* '$RetiredGiverTitle')::text
from public.characters where slug='giver';
"@

Test-Assertion 11 "The Giver has structured links to Erasure and Immortality, and only those" @"
select (
  (select count(*) from public.character_powers cp
     join public.power_systems ps on ps.id = cp.power_system_id
     where cp.character_id = (select id from public.characters where slug='giver')
       and ps.slug in ('erasure','immortality')) = 2
  and (select count(*) from public.character_powers cp
     where cp.character_id = (select id from public.characters where slug='giver')) = 2
)::text;
"@

Test-Assertion 12 "The Giver is linked to The Order as 'Founder and ultimate authority'" @"
select (count(*)=1)::text
from public.character_factions cf
join public.factions f on f.id = cf.faction_id
where cf.character_id = (select id from public.characters where slug='giver')
  and f.slug = 'the-order'
  and cf.role = 'Founder and ultimate authority';
"@

Test-Assertion 13 "Incoming relationships from Room, Jennifer and Fez still point to the preserved Giver UUID" @"
select (count(distinct src.slug)=3)::text
from public.character_relationships r
join public.characters src on src.id = r.character_id
where src.slug in ('room','jennifer','fez')
  and r.related_character_id = (select id from public.characters where slug='giver');
"@

Test-Assertion 14 "The Giver's public fields do not identify him as Adam Story" @"
select ($PublicFields !~* 'adam')::text
from public.characters where slug='giver';
"@

Write-Host ""
Write-Host "  EZRA ZONE" -ForegroundColor White

Test-Assertion 15 "Ezra has only the approved safe public structured relationship to Rush" @"
select (
  (select count(*) from public.character_relationships r
     where r.character_id = e.id) = 1
  and (select count(*) from public.character_relationships r
     join public.characters t on t.id = r.related_character_id
     where r.character_id = e.id and t.slug = 'rush') = 1
  and (select count(*) from public.character_relationships r
     where r.related_character_id = e.id) = 0
)::text
from public.characters e where e.slug='ezra-zone';
"@

Test-Assertion 16 "Ezra has no structured character-power links" @"
select (count(*)=0)::text
from public.character_powers
where character_id = (select id from public.characters where slug='ezra-zone');
"@

Test-Assertion 17 "Ezra is not given a structured Apex membership" @"
select (
  (select count(*) from public.character_factions cf
     join public.factions f on f.id = cf.faction_id
     where cf.character_id = (select id from public.characters where slug='ezra-zone')
       and f.slug = 'apex-dynamics') = 0
  and (select count(*) from public.character_factions cf
     where cf.character_id = (select id from public.characters where slug='ezra-zone')) = 0
)::text;
"@

Test-Assertion 18 "Ezra's kidnapping, experimentation, crystal powers, Purple War role and death are not in public fields" @"
select ($PublicFields !~* '(kidnap|abduct|experiment|crystal|purple war|\mdeath\M|\mdies\M|\mdied\M|\mkilled\M)')::text
from public.characters where slug='ezra-zone';
"@

Write-Host ""
Write-Host "  IDENTITY SAFETY" -ForegroundColor White

Test-Assertion 19 "There is no structured Adam-to-Giver or Giver-to-Adam relationship" @"
select (count(*)=0)::text
from public.character_relationships r
where (r.character_id = (select id from public.characters where slug='adam-story')
       and r.related_character_id = (select id from public.characters where slug='giver'))
   or (r.character_id = (select id from public.characters where slug='giver')
       and r.related_character_id = (select id from public.characters where slug='adam-story'));
"@

Test-Assertion 20 "No duplicate Adam, Giver, Ezra, Order, Erasure or Immortality records exist" @"
select (
  (select count(*) from public.characters
     where slug='adam-story' or lower(trim(name))='adam story')=1
  and (select count(*) from public.characters
     where slug='giver' or lower(trim(name)) in ('giver','the giver')
        or lower(trim(coalesce(alias,''))) in ('giver','the giver'))=1
  and (select count(*) from public.characters
     where slug in ('ezra-zone','ezra') or lower(trim(name))='ezra zone')=1
  and (select count(*) from public.factions
     where slug='the-order' or lower(trim(name))='the order')=1
  and (select count(*) from public.power_systems
     where slug='erasure' or lower(trim(name))='erasure')=1
  and (select count(*) from public.power_systems
     where slug='immortality' or lower(trim(name))='immortality')=1
)::text;
"@

Write-Host ""
Write-Host "  LEGACY PLACEHOLDER CHECK (separate from the retired canonical title)" -ForegroundColor White

Test-Assertion 21 "No pre-canonical placeholder wording survives in the Giver's stored profile" @"
select (
  name <> 'Unknown'
  and $AllProfileFields !~* '($LegacyPlaceholderPhrases)'
)::text
from public.characters where slug='giver';
"@

# --- Summary ------------------------------------------------------------------
# The @() guards below stop PowerShell collapsing a single-item filter result to
# a scalar, which would leave .Count empty in the summary line. $Assertions is a
# generic List and is counted directly - wrapping it in @() throws.
$total = $script:Assertions.Count
$passed = @($script:Assertions | Where-Object { $_.Passed }).Count
$failed = $total - $passed
$dbCount = @($script:Assertions | Where-Object { $_.Evidence -eq 'db' }).Count
$staticCount = @($script:Assertions | Where-Object { $_.Evidence -eq 'static' }).Count

Write-Host ""
Write-Host ("-" * 64) -ForegroundColor DarkGray
Write-Host ("  EVIDENCE  {0} from the live local database, {1} from static migration inspection" -f $dbCount, $staticCount) -ForegroundColor Gray
if ($failed -eq 0) {
  Write-Host ("  RESULT   {0} of {1} assertions passed, {2} failed" -f $passed, $total, $failed) -ForegroundColor Green
  Write-Host "           The canonical Adam / Giver / Ezra import verified cleanly." -ForegroundColor Gray
  Write-Host "           Nothing was modified - every query was read-only." -ForegroundColor Gray
  Write-Host ("-" * 64) -ForegroundColor DarkGray
  Write-Host ""
  exit 0
}

Write-Host ("  RESULT   {0} of {1} assertions passed, {2} failed" -f $passed, $total, $failed) -ForegroundColor Red
$failedNumbers = ($script:Assertions | Where-Object { -not $_.Passed } | ForEach-Object { $_.Label }) -join ', '
Write-Host ("           Failed assertions: {0}" -f $failedNumbers) -ForegroundColor Gray
Write-Host "           Nothing was modified - every query was read-only." -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "           Do NOT run 'supabase db reset' to react to a failure here." -ForegroundColor Gray
Write-Host "           Investigate the migration and the data first." -ForegroundColor Gray
Write-Host ("-" * 64) -ForegroundColor DarkGray
Write-Host ""
exit 1
