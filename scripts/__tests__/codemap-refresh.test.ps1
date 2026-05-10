# scripts/__tests__/codemap-refresh.test.ps1
# Pester tests for codemap-refresh.ps1 (dual-mode default user-scope vs --Internal).
# Per CLAUDE.md scaffold rule: every script under scripts/ gets a sibling test.
# Sprint 059 T3 / TASK-146 / ADR-037 user-scope split.

# Requires Pester >=5.x. If not installed: Install-Module Pester -Force -SkipPublisherCheck

BeforeAll {
    $script:scriptPath = Join-Path $PSScriptRoot '..\codemap-refresh.ps1' | Resolve-Path
}

Describe 'codemap-refresh.ps1 — dual-mode user-scope (Sprint 059 ADR-037)' {

    Context 'Default mode (adopter project scan)' {
        BeforeAll {
            $script:tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("codemap-test-user-" + [guid]::NewGuid().ToString().Substring(0,8))
            New-Item -ItemType Directory -Path $script:tempRoot -Force | Out-Null
            New-Item -ItemType Directory -Path (Join-Path $script:tempRoot 'src') -Force | Out-Null
            New-Item -ItemType Directory -Path (Join-Path $script:tempRoot 'api') -Force | Out-Null
            Set-Content -Path (Join-Path $script:tempRoot 'README.md') -Value '# Test Project`n[link to api](api/route.md)' -Encoding UTF8
            Set-Content -Path (Join-Path $script:tempRoot 'api\route.md') -Value '# API`nbacklink [README](../README.md)' -Encoding UTF8

            $env:CLAUDE_PROJECT_DIR = $script:tempRoot
            Remove-Item Env:\CLAUDE_PLUGIN_ROOT -ErrorAction SilentlyContinue
        }

        AfterAll {
            Remove-Item -LiteralPath $script:tempRoot -Recurse -Force -ErrorAction SilentlyContinue
            Remove-Item Env:\CLAUDE_PROJECT_DIR -ErrorAction SilentlyContinue
        }

        It 'scans adopter project root (CLAUDE_PROJECT_DIR), not dev-flow plugin' {
            $output = & $script:scriptPath
            $LASTEXITCODE | Should -Be 0
            $output | Should -Match 'user \(adopter project scan\)'
        }

        It 'writes docs/codemap/CODEMAP.md to scan root' {
            $codemapPath = Join-Path $script:tempRoot 'docs\codemap\CODEMAP.md'
            Test-Path -LiteralPath $codemapPath | Should -Be $true
        }

        It 'CODEMAP.md frontmatter mode field = user' {
            $codemapPath = Join-Path $script:tempRoot 'docs\codemap\CODEMAP.md'
            $content = Get-Content -LiteralPath $codemapPath -Raw
            $content | Should -Match 'mode: user'
        }

        It 'Modules section enumerates src + api dynamically (no hardcoded list)' {
            $codemapPath = Join-Path $script:tempRoot 'docs\codemap\CODEMAP.md'
            $content = Get-Content -LiteralPath $codemapPath -Raw
            $content | Should -Match 'src/'
            $content | Should -Match 'api/'
        }

        It 'unknown modules emit "(no description - add via .claude/codemap-modules.json)" hint' {
            $codemapPath = Join-Path $script:tempRoot 'docs\codemap\CODEMAP.md'
            $content = Get-Content -LiteralPath $codemapPath -Raw
            $content | Should -Match 'no description.*codemap-modules\.json'
        }
    }

    Context '--Internal mode (dev-flow plugin self-audit)' {
        BeforeAll {
            # Use the actual dev-flow repo root for internal mode validation.
            $script:devFlowRoot = Join-Path $PSScriptRoot '..\..' | Resolve-Path
            $env:CLAUDE_PLUGIN_ROOT = $script:devFlowRoot
            Remove-Item Env:\CLAUDE_PROJECT_DIR -ErrorAction SilentlyContinue
        }

        AfterAll {
            Remove-Item Env:\CLAUDE_PLUGIN_ROOT -ErrorAction SilentlyContinue
        }

        It '-Internal flag scans dev-flow plugin root (CLAUDE_PLUGIN_ROOT)' {
            $output = & $script:scriptPath -Internal
            $LASTEXITCODE | Should -Be 0
            $output | Should -Match 'internal \(dev-flow self-audit\)'
        }

        It 'preserves curated dev-flow module list (agents · skills · hooks · ...)' {
            $codemapPath = Join-Path $script:devFlowRoot 'docs\codemap\CODEMAP.md'
            $content = Get-Content -LiteralPath $codemapPath -Raw
            $content | Should -Match 'agents/'
            $content | Should -Match 'skills/'
            $content | Should -Match 'hooks/'
        }

        It 'preserves curated one-liner descriptions (no fallback hint)' {
            $codemapPath = Join-Path $script:devFlowRoot 'docs\codemap\CODEMAP.md'
            $content = Get-Content -LiteralPath $codemapPath -Raw
            $content | Should -Match 'Agent definitions.*orchestrator role.*specialists'
            $content | Should -Not -Match '\(no description - add via'
        }
    }
}
