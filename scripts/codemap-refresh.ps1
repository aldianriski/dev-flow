# scripts/codemap-refresh.ps1
# Codemap base knowledge refresh (TASK-098, ADR-016 PS-only hook policy).
# Pure regex file-walk. No LLM. No Node. ASCII-only. PS 5.1+ compatible.
#
# Outputs:
#   docs/codemap/CODEMAP.md   - L1 overview (Hubs, Deps, Modules, L0-overflow)
#   docs/codemap/handoff.json - L2 envelope { nodes, edges, metadata, last_built }
#
# Hub = incoming markdown-link count across all *.md files.
# Edge = explicit [text](path) markdown link only (V1).
# Module = top-level directory at repo root (Test-Path filter; non-existent dirs skipped).
#
# Exit 0 = ok or warn. Failure on PostToolUse hook is non-blocking (warn to stdout).

$ErrorActionPreference = 'Continue'
$started = Get-Date

# Resolve repo root (same ladder as session-start.ps1).
$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR }
        elseif ($env:CLAUDE_PLUGIN_ROOT) { $env:CLAUDE_PLUGIN_ROOT }
        else { (Get-Location).Path }

$codemapDir = Join-Path $root 'docs\codemap'
$codemapMd  = Join-Path $codemapDir 'CODEMAP.md'
$handoffJs  = Join-Path $codemapDir 'handoff.json'

if (-not (Test-Path -LiteralPath $codemapDir)) {
    New-Item -ItemType Directory -Path $codemapDir -Force | Out-Null
}

# Module candidates - top-level dirs (filter to existing only).
$moduleCandidates = @('agents', 'bin', 'docs', 'hooks', 'scripts', 'skills', 'templates', '.claude', '.claude-plugin')
$modules = @()
foreach ($m in $moduleCandidates) {
    $p = Join-Path $root $m
    if (Test-Path -LiteralPath $p -PathType Container) { $modules += $m }
}

# One-liners (hand-curated; updated when new module added).
$moduleOneLiners = @{
    'agents'         = 'Agent definitions (dispatcher + 6 specialists) for /orchestrator dispatch.'
    'bin'            = 'Scaffold CLI - dev-flow-init.js (adopter onboarding entry point).'
    'docs'           = 'Project docs - sprints, ADRs, audit, codemap, routing rules.'
    'hooks'          = 'Plugin hook config (hooks.json) - SessionStart + PreToolUse + PostToolUse.'
    'scripts'        = 'Harness scripts - audit-baseline, eval-skills, codemap-refresh, session-start.ps1.'
    'skills'         = 'SKILL.md files - orchestrator, lean-doc-generator, task-decomposer, etc.'
    'templates'      = 'Doc templates - CLAUDE.md.template + 6 other scaffolds.'
    '.claude'        = 'Project context dir - CLAUDE.md, CONTEXT.md, settings.json, settings.local.json.'
    '.claude-plugin' = 'Plugin manifest dir - plugin.json, marketplace.json (semver tracking).'
}

# Scan all .md files for [text](path) markdown links.
$mdFiles = Get-ChildItem -LiteralPath $root -Recurse -Filter '*.md' -File -ErrorAction SilentlyContinue |
           Where-Object {
               $rel = $_.FullName.Substring($root.Length).TrimStart('\','/')
               -not ($rel -like '.git\*') -and -not ($rel -like 'node_modules\*')
           }

$linkPattern = '\[[^\]]*\]\(([^)]+)\)'
$edges = New-Object System.Collections.ArrayList
$hubCounts = @{}
$nodes = New-Object System.Collections.ArrayList

foreach ($f in $mdFiles) {
    $relFrom = $f.FullName.Substring($root.Length).TrimStart('\','/').Replace('\','/')
    [void]$nodes.Add(@{ path = $relFrom; kind = 'markdown' })

    $content = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $content) { continue }

    $matches = [regex]::Matches($content, $linkPattern)
    foreach ($mm in $matches) {
        $target = $mm.Groups[1].Value.Trim()
        if ($target -match '^https?:' -or $target -match '^mailto:' -or $target.StartsWith('#')) { continue }
        # Strip anchor fragments
        $target = ($target -split '#')[0].Trim()
        if (-not $target) { continue }
        # Skip square-bracket placeholders (e.g. [scope], [type]) and other non-path tokens
        if ($target -match '[\[\]<>]' -or $target -match '^\s*$') { continue }

        [void]$edges.Add(@{ from = $relFrom; to = $target; kind = 'markdown-link' })
        if ($hubCounts.ContainsKey($target)) { $hubCounts[$target] += 1 }
        else { $hubCounts[$target] = 1 }
    }
}

# Top 10 hubs by incoming-link count.
$topHubs = $hubCounts.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 10

# Top 10 deps = same as hubs, just framed differently (most-referenced paths).
$topDeps = $topHubs

# Write handoff.json.
$handoff = @{
    nodes = $nodes.ToArray()
    edges = $edges.ToArray()
    metadata = @{
        generated_by = 'codemap-refresh'
        repo_root    = $root
        module_count = $modules.Count
        node_count   = $nodes.Count
        edge_count   = $edges.Count
    }
    last_built = (Get-Date).ToString('o')
}
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($handoffJs, ($handoff | ConvertTo-Json -Depth 6), $utf8NoBom)

# Write CODEMAP.md.
$elapsedMs = [int]((Get-Date) - $started).TotalMilliseconds
$nl = [System.Environment]::NewLine

$lines = New-Object System.Collections.ArrayList
[void]$lines.Add('---')
[void]$lines.Add('owner: Tech Lead (Aldian Rizki)')
[void]$lines.Add('last_updated: ' + (Get-Date).ToString('yyyy-MM-dd'))
[void]$lines.Add('update_trigger: auto-generated by /codemap-refresh on every git commit (PostToolUse hook)')
[void]$lines.Add('status: current')
[void]$lines.Add('---')
[void]$lines.Add('')
[void]$lines.Add('# CODEMAP')
[void]$lines.Add('')
[void]$lines.Add('> Auto-generated by `/codemap-refresh` (TASK-098). Do not hand-edit. Edits are overwritten on next commit.')
[void]$lines.Add('')
[void]$lines.Add('## Hubs')
[void]$lines.Add('')
[void]$lines.Add('Top markdown-link targets (incoming-reference count):')
[void]$lines.Add('')
foreach ($h in $topHubs) {
    [void]$lines.Add('- `' + $h.Key + '` - ' + $h.Value + ' refs')
}
[void]$lines.Add('')
[void]$lines.Add('## Deps')
[void]$lines.Add('')
[void]$lines.Add('V1 collapse: Deps = Hubs (same scan, same paths). Differentiation deferred until consumer demand.')
[void]$lines.Add('')
foreach ($d in $topDeps) {
    [void]$lines.Add('- `' + $d.Key + '`')
}
[void]$lines.Add('')
[void]$lines.Add('## Modules')
[void]$lines.Add('')
[void]$lines.Add('Top-level directories at repo root (bare list; descriptions in §L0-overflow below):')
[void]$lines.Add('')
foreach ($m in $modules) {
    [void]$lines.Add('- `' + $m + '/`')
}
[void]$lines.Add('')
[void]$lines.Add('## L0-overflow')
[void]$lines.Add('')
[void]$lines.Add('Canonical L0 view spilled from CLAUDE.md (80-line cap policy). CLAUDE.md `## Codemap (L0)` keeps only the pointer; descriptions live here:')
[void]$lines.Add('')
foreach ($m in $modules) {
    $desc = if ($moduleOneLiners.ContainsKey($m)) { $moduleOneLiners[$m] } else { '(no description)' }
    [void]$lines.Add('- `' + $m + '/` - ' + $desc)
}
[void]$lines.Add('')
[void]$lines.Add('---')
[void]$lines.Add('')
[void]$lines.Add('Generated in ' + $elapsedMs + ' ms.')
[void]$lines.Add('Nodes: ' + $nodes.Count + ' | Edges: ' + $edges.Count + ' | Modules: ' + $modules.Count)

[System.IO.File]::WriteAllText($codemapMd, (($lines -join $nl) + $nl), $utf8NoBom)

Write-Output ('[codemap-refresh] OK - ' + $elapsedMs + ' ms - ' + $nodes.Count + ' nodes / ' + $edges.Count + ' edges / ' + $modules.Count + ' modules')
exit 0
