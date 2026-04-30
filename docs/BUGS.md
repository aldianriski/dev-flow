---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-30
update_trigger: New bug found or bug resolved
status: current
---

# dev-flow — Known Bugs

> **Rule**: when a bug is open, list it here with severity, symptom, root cause, and the tracking task. When resolved, move the entry to `docs/CHANGELOG.md` under the sprint that fixed it as a "Resolved bugs" row, and trim this file back to "No open bugs."

---

### BUG-005: Hook writes raw read-guard errors to BUGS.md with malformed formatting

**Severity:** low — cosmetic corruption, no data loss
**Symptom:** When read-guard fires a blocking error, a hook appends the raw TUI error output to `docs/BUGS.md` under `> New Bugs`. Output is un-sanitized (nested `⎿` table artifacts, line-wrapped mid-path strings). File requires manual `git restore` to clean.
**Root cause:** Unknown hook (PostToolUse or OnError) captures `PreToolUse:Read` block errors and writes them raw to BUGS.md without stripping TUI formatting.
**Tracking task:** TASK-109
**First seen:** 2026-04-30 (Sprint 25 — read-guard correctly blocked orchestrator reads of `DECISIONS.md` + `phases.md` during implement phase)

---

<!-- BUG-006 resolved Sprint 25 — moved to docs/CHANGELOG.md -->
