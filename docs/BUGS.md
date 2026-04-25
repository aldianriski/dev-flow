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
