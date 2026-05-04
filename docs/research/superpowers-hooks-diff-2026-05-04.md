---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: upstream superpowers hooks.json changes OR dev-flow hooks.json changes
status: current
---

# Superpowers `hooks.json` diff — vs dev-flow

**Sprint:** 042 T1 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | Lines | License |
|:--------|:-------|:--------|------:|:--------|
| `obra/superpowers` | gh CLI raw `repos/obra/superpowers/contents/hooks/hooks.json` | `e7a2d16476bf` (upstream main) | 16 | MIT |
| `dev-flow` | local `hooks/hooks.json` (HEAD) | `828b200` (Sprint 042 plan-lock) | 40 | — |

Both fetched / read 2026-05-04. License of upstream verified via `gh api repos/obra/superpowers/license`.

## Verbatim superpowers `hooks.json`

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start",
            "async": false
          }
        ]
      }
    ]
  }
}
```

## Side-by-side matcher comparison

| Hook event | superpowers matcher | dev-flow matcher | Delta |
|:-----------|:--------------------|:-----------------|:------|
| SessionStart | `startup\|clear\|compact` | `startup\|resume\|clear\|compact` | dev-flow has extra `resume` (covers session-resume case) |
| PreToolUse | (absent) | `Bash(git add*)` chain-guard | dev-flow-only |
| PostToolUse | (absent) | `Bash(git commit*)` codemap-refresh | dev-flow-only |

## Hook-event coverage matrix

| Event | superpowers (in `hooks.json`) | dev-flow (in `hooks.json`) | Notes |
|:------|:------:|:------:|:------|
| SessionStart | ✓ | ✓ | both inject context at session boundaries |
| PreToolUse | ✗ | ✓ (`Bash(git add*)`) | dev-flow chain-guard prevents `git add && git commit` chains so lint hook fires |
| PostToolUse | ✗ | ✓ (`Bash(git commit*)`) | dev-flow codemap auto-refresh per Sprint 039 TASK-098 |
| Stop | ✗ | ✗ | neither; both leave session-end uninstrumented |
| UserPromptSubmit | ✗ | ✗ | neither uses; caveman plugin uses this independently |

## `${CLAUDE_PLUGIN_ROOT}` quoting check

| Project | Quoting present? | Method |
|:--------|:----------------:|:-------|
| superpowers | ✓ | `"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd"` (double-quoted in JSON command string) |
| dev-flow | ✓ | `"${CLAUDE_PLUGIN_ROOT}/scripts/session-start.ps1"` (double-quoted) |

Both projects quote the env-var path (matches MEMORY: `feedback_windows_hook_quoting` — Windows home with space breaks unquoted paths). No regression risk on either side.

## Invocation pattern divergence

| Project | SessionStart invocation | Reason |
|:--------|:------------------------|:-------|
| superpowers | `"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd" session-start` (shim dispatcher routes to `hooks/session-start` polyglot bash script) | cross-platform polyglot (cmd.exe + bash); single entrypoint per script-name |
| dev-flow | `powershell -NoProfile -ExecutionPolicy Bypass -File "${CLAUDE_PLUGIN_ROOT}/scripts/session-start.ps1"` (direct call) | Windows-only per ADR-016 decision; no shim layer needed for single-platform |

T2 audits the `run-hook.cmd` shim in detail — see `docs/research/superpowers-run-hook-shim-2026-05-04.md`.

## Recommendation: matcher reconciliation

**Keep-superset (option ii) — locked at promote.** Reasons:
1. dev-flow's `resume` matcher is HARMLESS — fires SessionStart hook on session resume in addition to startup/clear/compact. No regression.
2. Aligning down (dropping `resume`) would lose Claude Code harness signal coverage for session-resume scenarios (user reopens an existing session).
3. Upstream PR to superpowers is OUT OF SCOPE for this sprint (would belong in a contributing-back sprint, post-v1 ship).
4. Document divergence in this research note (already done) + ADR-021 § Decision-1.

**No change to dev-flow `hooks.json` matcher.** Status: keep `startup|resume|clear|compact`.

## Side-findings worth flagging

1. **superpowers `hooks.json` is minimal (1 hook, 16 lines).** dev-flow has 3 hooks across 3 event types (40 lines). dev-flow's hook surface is RICHER than superpowers — the audit was framed as "what can dev-flow learn from superpowers?" but the matcher analysis shows dev-flow already extends superpowers' baseline.
2. **superpowers uses `async: false` field.** dev-flow does not set `async` (defaults to false per Claude Code spec). No behavior delta. Could add `async: false` explicitly for clarity if convention forms.
3. **superpowers SessionStart hook injects `using-superpowers` SKILL.md content as `additionalContext`** (per `hooks/session-start` script). dev-flow SessionStart hook (per `scripts/session-start.ps1`) does verification only, no context injection. Different design philosophies — superpowers loads skills proactively; dev-flow lets `/prime` skill handle ordered loads on demand. No reconciliation needed; intentional dev-flow choice per Sprint 039 `/prime` design.
4. **superpowers `hooks/session-start` is bash, not PowerShell.** Lands on Windows via `run-hook.cmd` polyglot shim. dev-flow chose PowerShell-direct per ADR-016 to avoid cross-platform shim maintenance. T2 evaluates whether to change that.

## Re-diff cadence

Re-fetch via gh CLI when superpowers main SHA changes. Bump SHA pin in this file + ADR-021. Annual cadence likely sufficient; superpowers `hooks.json` rarely changes.
