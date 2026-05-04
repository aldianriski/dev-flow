---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: superpowers run-hook.cmd shape changes OR dev-flow hook count crosses adoption threshold
status: current
---

# Superpowers `run-hook.cmd` shim audit + dev-flow shim shape

**Sprint:** 042 T2 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | Lines | License |
|:--------|:-------|:--------|------:|:--------|
| `obra/superpowers` | gh CLI raw `repos/obra/superpowers/contents/hooks/run-hook.cmd` | `e7a2d16476bf` | 47 | MIT |
| Companion script | gh CLI raw `repos/obra/superpowers/contents/hooks/session-start` (bash, polyglot target) | `e7a2d16476bf` | 57 | MIT |

## Verbatim source

```bat
: << 'CMDBLOCK'
@echo off
REM Cross-platform polyglot wrapper for hook scripts.
REM On Windows: cmd.exe runs the batch portion, which finds and calls bash.
REM On Unix: the shell interprets this as a script (: is a no-op in bash).
REM
REM Hook scripts use extensionless filenames (e.g. "session-start" not
REM "session-start.sh") so Claude Code's Windows auto-detection -- which
REM prepends "bash" to any command containing .sh -- doesn't interfere.
REM
REM Usage: run-hook.cmd <script-name> [args...]

if "%~1"=="" (
    echo run-hook.cmd: missing script name >&2
    exit /b 1
)

set "HOOK_DIR=%~dp0"

REM Try Git for Windows bash in standard locations
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    "C:\Program Files (x86)\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM Try bash on PATH (e.g. user-installed Git Bash, MSYS2, Cygwin)
where bash >nul 2>nul
if %ERRORLEVEL% equ 0 (
    bash "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM No bash found - exit silently rather than error
REM (plugin still works, just without SessionStart context injection)
exit /b 0
CMDBLOCK

# Unix: run the named script directly
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_NAME="$1"
shift
exec bash "${SCRIPT_DIR}/${SCRIPT_NAME}" "$@"
```

## Dispatch-pattern walkthrough

1. **Polyglot trick:** `: << 'CMDBLOCK'` is a bash no-op heredoc. Bash skips the entire batch portion. cmd.exe sees `:` as a label and `<<` as malformed input, then `@echo off` and proceeds with batch.
2. **Windows path (cmd):** Try `C:\Program Files\Git\bin\bash.exe` → `C:\Program Files (x86)\Git\bin\bash.exe` → `where bash` → silent exit 0 (graceful — plugin works without context injection).
3. **Unix path (bash):** Skips CMDBLOCK heredoc, executes the bash tail: cd to script dir, exec bash with `${SCRIPT_NAME}` + remaining args.
4. **Filename convention:** Extensionless hook scripts (e.g. `session-start`, NOT `session-start.sh`). Reason: Claude Code Windows auto-detection prepends `bash` to any command containing `.sh`, which would interfere with this shim.
5. **Error handling:** Missing script-name → exit 1; bash not found → silent exit 0 (plugin gracefully degrades).

## Windows compatibility

| Aspect | superpowers shim | dev-flow current |
|:-------|:-----------------|:-----------------|
| Cross-platform | Windows + Unix (bash) | Windows-only (PowerShell) |
| Hook script extension | extensionless | `.ps1` |
| Direct-call vs dispatcher | dispatcher (one shim → many hook scripts) | direct call (`powershell -File <script>`) |
| Bash dependency on Windows | required (Git for Windows OR PATH bash) | none (PowerShell native) |
| Indirection layers | 2 (`hooks.json` → `run-hook.cmd` → `<script-name>`) | 1 (`hooks.json` → `<script.ps1>`) |

## dev-flow shim shape (PROPOSED — not implementing this sprint)

If adopted as `scripts/run-hook.ps1`:

```powershell
# scripts/run-hook.ps1 — proposed dev-flow shim (NOT IMPLEMENTED)
param(
    [Parameter(Mandatory, Position=0)][string]$ScriptName,
    [Parameter(ValueFromRemainingArguments)][string[]]$RemainingArgs
)

$ErrorActionPreference = 'Stop'
$HookDir   = Split-Path -Parent $PSCommandPath
$ScriptPath = Join-Path (Split-Path -Parent $HookDir) "scripts\$ScriptName.ps1"

if (-not (Test-Path -LiteralPath $ScriptPath)) {
    Write-Error "run-hook.ps1: hook script not found: $ScriptPath"
    exit 1
}

& $ScriptPath @RemainingArgs
exit $LASTEXITCODE
```

`hooks.json` would then change from:
```json
"command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PLUGIN_ROOT}/scripts/session-start.ps1\""
```
to:
```json
"command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PLUGIN_ROOT}/scripts/run-hook.ps1\" session-start"
```

## Adopt-vs-defer evaluation

| Criterion | Verdict |
|:----------|:--------|
| Solves cross-platform problem? | ✗ — dev-flow Windows-only per ADR-016 |
| Reduces `hooks.json` complexity? | ✗ — adds 1 indirection layer; current direct-call is simpler |
| Centralizes hook discovery? | partial — useful at high hook counts (10+); dev-flow has 3 |
| Aids debugging? | ✗ — extra layer between `hooks.json` invocation and script |
| Maintenance burden | + — one more script to test on Windows path-with-spaces |
| Future-proofing for Linux/macOS adopters | + — IF dev-flow goes cross-platform (currently no) |

**Net: DEFER.** Per locked OQ(c) — note-only this sprint, no implementation. Shim adoption only justified if dev-flow grows past ~5 hooks OR reconsiders cross-platform support. Current trajectory: neither.

## Recommendation feeding T4 (ADR-021)

- DEC-3: defer `run-hook.ps1` shim adoption. Rationale: superpowers shim solves cross-platform polyglot for a Windows+Unix plugin; dev-flow is Windows-only per ADR-016. Direct-call pattern (`powershell -File <script.ps1>`) is simpler, more debuggable, and adequate for current 3-hook scale.
- **No backlog task created** per OQ(c) lock. Re-evaluate trigger conditions documented above.

## Lessons from superpowers shim worth keeping (even without adoption)

1. **Extensionless hook script filenames** to avoid Claude Code Windows auto-detection appending `bash`. dev-flow doesn't hit this (uses `.ps1` extension explicitly invoked via `powershell -File`), but worth documenting.
2. **Silent graceful degradation** (exit 0 when bash missing). dev-flow PowerShell scripts already follow this pattern in codemap-refresh hook (Sprint 039 DEC-5: warn-only on failure, never block `git commit`).
3. **Polyglot pattern (`: << 'CMDBLOCK'`)** is genuinely clever — a single file works on cmd.exe AND bash without two scripts. dev-flow has no need for it but worth noting in the shim research record.

## Re-audit cadence

Re-evaluate adoption when EITHER:
- dev-flow hook count crosses 5 (current: 3), OR
- dev-flow reconsiders cross-platform support (unlikely per ADR-016).
