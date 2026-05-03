---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03
update_trigger: ADR status change
status: decided
sprint: 038
---

# ADR-016: Kill Node hook scripts (session-start.js + read-guard.js residual)

**Date**: 2026-05-03
**Status**: decided
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Both remaining Node hook scripts (`scripts/session-start.js`, `scripts/read-guard.js`) repeatedly fail on Windows installations where the user home contains a space (`C:\Users\HYPE AMD\...`). The failure mode is `node:internal/modules/cjs/loader:1368` — Node's CommonJS loader cannot resolve module paths through the unquoted `${CLAUDE_PLUGIN_ROOT}` / `$CLAUDE_PROJECT_DIR` env-var substitution that Claude Code's hook contract uses.

5 attempts to fix the path quoting (memory entry: "Quote env-var paths in hooks") all regress. The most recent attempt (commit 6e47cb8, this sprint) wraps the env vars in `\"...\"` — still fragile because the wrapping must survive shell expansion across `hooks.json`, `.claude/settings.json`, and the underlying `cmd.exe` invocation. Each layer has its own quoting rules. The cost of debugging this exceeds the value of the hooks themselves.

ADR-013 (Sprint 29) retired `scripts/read-guard.js` in principle — the script became a no-op and the PreToolUse hook entry was removed from `hooks/hooks.json`. The script file was deleted from the source tree at that time. However, lingering documentation references and hook-config drift (settings.json overrides) made the kill incomplete. ADR-016 finishes the arc and extends it to `session-start.js`.

## Decision

1. `scripts/session-start.js` is deleted along with its test file `scripts/__tests__/session-start.test.js`. The SessionStart hook entry is removed from both `hooks/hooks.json` and `.claude/settings.json`.
2. Any residual `read-guard.js` documentation and config references discovered during this arc are scrubbed in the companion task TASK-096; the script file itself is already gone (per ADR-013).
3. The PowerShell SessionStart replacement lands separately in TASK-101 (same sprint, depends on this commit). The window between TASK-095 commit and TASK-101 commit has no SessionStart hook running — accepted gap.
4. CC plugin hook scripts will be PowerShell-only on this codebase going forward. Node remains usable for non-hook scripts (`bin/`, `audit-baseline.js`, `eval-skills.js`) where Claude Code's env-var substitution is not in the call path.

## Alternatives considered

| Option | Reason rejected |
|:-------|:----------------|
| 6th attempt at Node path quoting | Five prior attempts failed across `hooks.json`, `settings.json`, and shell layers; pattern is unstable and the failure mode recurs on every plugin reinstall |
| `cmd.exe /c` wrapper around `node` | Adds another quoting layer; does not resolve the `loader:1368` root cause and increases hook startup cost |
| Migrate hook scripts to a `bin/run-hook.cmd` shim | Shim layer hides the same underlying Node path problem; still fragile on space-in-path installs |
| Keep Node hooks, document the failure mode | Failure is not soft — `loader:1368` aborts the hook before any check runs, and Claude Code reports it as a hook failure on every session start |

## Consequences

**Positive**:
- `loader:1368` hook errors stop appearing on every session start
- PowerShell hooks (TASK-101 and the post-commit AST hook in Sprint 039 TASK-098) have no module-resolution surface area on Windows
- Hook startup cost drops — no Node process spawn per session

**Negative** (trade-offs accepted):
- Bootstrap checks (settings.local presence, CLAUDE.md size, skill staleness, sprint-plan-doc presence, etc.) are absent between the TASK-095 commit and the TASK-101 commit
- Cross-platform parity lost — the PowerShell replacement does not run on adopter machines that lack PowerShell. Adopters on macOS/Linux must port to bash. This is acceptable for a meta-repo currently used by a single Windows developer; revisit if adopter base expands
- 241 lines of session-start logic and ~100 lines of test coverage are removed from the repo

**Neutral**:
- `hooks/hooks.json` retains the `Bash(git add*)` chain-guard entry (untouched)
- Historical CHANGELOG, sprint-plan, and audit references to `session-start.js` and `read-guard.js` are preserved per the Sprint 038 D2.B decision (loose acceptance, history is immutable)
