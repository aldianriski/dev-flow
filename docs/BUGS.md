---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-25
update_trigger: New bug found or bug resolved
status: current
---

# dev-flow — Known Bugs

> **Rule**: when a bug is open, list it here with severity, symptom, root cause, and the tracking task. When resolved, move the entry to `docs/CHANGELOG.md` under the sprint that fixed it as a "Resolved bugs" row, and trim this file back to "No open bugs."

---

## BUG-003: `validate-blueprint.js` MANIFEST `skill.path` accepts `..` traversal

**Status**: open — needs tracking task in Backlog
**Severity**: P2 — local-only tool, no remote input path; defense-in-depth issue
**Symptom**: `.claude/scripts/validate-blueprint.js:31` joins `root` with `skill.path` from `MANIFEST.json` and passes the result to `existsSync`. A crafted MANIFEST with `"path": "../../etc/passwd"` resolves outside `.claude/skills/`. No traversal validation is performed by the consumer or by `checkManifest` in `scaffold-checks.js`.
**Root cause**: `checkManifest` validates JSON shape (version, skills array) but does not constrain `skill.path` to a relative subpath.
**Fix target**: in `scaffold-checks.js` `checkManifest`, reject any `skill.path` that contains `..` segments or is absolute. Add a unit test covering the traversal-attempt case.
**Found by**: Sprint 14 TASK-051 security audit (Phase 7).


---

## BUG-004: `read-guard.js` blocks orchestrator reads of orchestrator-scope files during compact-vulnerable phases

**Status**: open — needs tracking task in Backlog
**Severity**: P2 — workflow friction; workaround is subagent dispatch or phase-clear
**Symptom**: Orchestrator needs to read a script file to determine CI step requirements (e.g. `audit-skill-staleness.js` during implement phase), but `read-guard.js` blocks the Read and returns a hard error. Forces unnecessary subagent dispatch for simple context lookups.
**Root cause**: `ORCHESTRATOR_ALLOWLIST` in `read-guard.js` does not include scripts the orchestrator legitimately needs to inspect (e.g. to check env-var dependencies before writing a CI step). Any file not in the allowlist is blocked during compact-vulnerable phases regardless of whether it is source code or orchestrator-scoped state.
**Fix target**: Audit which file categories the orchestrator legitimately reads during each phase; extend `ORCHESTRATOR_ALLOWLIST` or add a path-prefix rule (e.g. `.claude/scripts/` reads allowed during implement when no source-write has occurred yet).
**Found by**: Sprint 15 TASK-054 implement phase (2026-04-26). Terminal proof:

```
PreToolUse:Read hook returned blocking error
⎿  Orchestrator attempted to Read 'D:/Project/dev-flow/.claude/scripts/audit-skill-staleness.js'
   during phase 'implement'. Per §1 Thin-Coordinator Rule, source-file I/O must happen inside a
   subagent. Dispatch the phase subagent (implementer / test-writer / code-reviewer /
   security-analyst / docs-writer). If this path is orchestrator-scoped state, add it to
   ORCHESTRATOR_ALLOWLIST in read-guard.js.
```
