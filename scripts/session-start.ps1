# scripts/session-start.ps1
# SessionStart hook - replaces deleted scripts/session-start.js (ADR-016).
# PowerShell 5.1+ compatible. No external dependencies. Quoted paths survive Windows space-in-path.
#
# Exit 1 = fail (CLAUDE.md missing - required); Exit 0 = ok or warnings only.
# Stderr = warnings (non-blocking); stdout = info report.

$ErrorActionPreference = 'Stop'
$started = Get-Date

# Resolve project root: prefer CLAUDE_PROJECT_DIR, fall back to CLAUDE_PLUGIN_ROOT, then PWD.
$rootSource = 'CLAUDE_PROJECT_DIR'
$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR }
        elseif ($env:CLAUDE_PLUGIN_ROOT) { $rootSource = 'CLAUDE_PLUGIN_ROOT'; $env:CLAUDE_PLUGIN_ROOT }
        else { $rootSource = 'PWD (fallback - both env vars unset)'; (Get-Location).Path }

$claude  = Join-Path $root '.claude\CLAUDE.md'
$local   = Join-Path $root '.claude\settings.local.json'
$todo    = Join-Path $root 'TODO.md'

Write-Output '=== SESSION START REPORT ==='
Write-Output ''
Write-Output '[INFO]'
if ($rootSource -like 'PWD*') { Write-Output "[WARN] root resolved via $rootSource (CLAUDE_PROJECT_DIR + CLAUDE_PLUGIN_ROOT both unset)" }

# Check 1: CLAUDE.md required
if (-not (Test-Path -LiteralPath $claude)) {
    Write-Error "FAIL: .claude/CLAUDE.md missing at '$claude' - cannot bootstrap session."
    exit 1
}
Write-Output "[OK] .claude/CLAUDE.md present"

# Check 2: settings.local.json (warn only)
if (-not (Test-Path -LiteralPath $local)) {
    Write-Output "[WARN] .claude/settings.local.json missing - per-machine allowlist not configured"
} else {
    Write-Output "[OK] .claude/settings.local.json present"
}

# Check 3: active sprint detectable
if (Test-Path -LiteralPath $todo) {
    $head = Get-Content -LiteralPath $todo -TotalCount 30 -Encoding UTF8
    $sprintNum = $null
    foreach ($line in $head) {
        if ($line -match '^sprint:\s*(\S+)') { $sprintNum = $matches[1]; break }
    }
    if ($sprintNum -and $sprintNum -ne 'none' -and $sprintNum -ne '-') {
        Write-Output "[OK] Active sprint detected: $sprintNum"
    } else {
        Write-Output "[WARN] No active sprint in TODO.md frontmatter (sprint: none)"
    }
} else {
    Write-Output "[WARN] TODO.md missing - sprint state unknown"
}

$elapsedMs = [int]((Get-Date) - $started).TotalMilliseconds
Write-Output ''
Write-Output "Elapsed: $elapsedMs ms"
Write-Output '============================'
exit 0
