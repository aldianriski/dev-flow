---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change
status: closed
plan_commit: —
close_commit: f12cfbc
backfilled: 2026-05-01 (retroactively documented from commit message)
---

# Sprint 031 — P0 Workflow Contract

**Theme:** Resolve P0-5..8 from AUDIT-2026-05-01 — agent line-cap violations, phase-numbering mismatch, undocumented `/dev-flow rotate`, email mismatch.
**Scope:** AUDIT-2026-05-01 P0-5, P0-6, P0-7, P0-8.

> **Note:** Backfilled retroactively. Plan reconstructed from commit `f12cfbc`.

---

## Plan (reconstructed)

### T1 — P0-5 trim over-cap agents
**Acceptance:** `orchestrator.md` 51→30, `design-analyst.md` 46→30, `scope-analyst.md` 46→28. Output templates moved to `skills/dev-flow/references/phases.md`.

### T2 — P0-6 drop Phase 6/7 numbered labels
**Acceptance:** Numbered labels removed from `code-reviewer`, `security-analyst` agents and from `pr-reviewer`, `security-auditor` SKILL.md frontmatter/body. Use role names ("Review phase", "/security-review session").

### T3 — P0-7 remove `/dev-flow rotate` references
**Acceptance:** Refs removed from `phases.md`, `task-decomposer/SKILL.md`, and references/. Redirect to `/lean-doc-generator` Sprint Promote.

### T4 — P0-8 email + SECURITY.md
**Acceptance:** `plugin.json` email switched corp→personal; `SECURITY.md` created with canonical reporting address.

---

## Execution Log

- 2026-05-01: All 4 tasks shipped in single commit `f12cfbc`.

---

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| `agents/orchestrator.md` | T1 | trimmed 51→30 (Output template moved) | medium |
| `agents/design-analyst.md` | T1 | trimmed 46→30 | medium |
| `agents/scope-analyst.md` | T1 | trimmed 46→28 | medium |
| `skills/dev-flow/references/phases.md` | T1 | absorbed Output templates | low |
| `agents/code-reviewer.md` | T2 | dropped Phase 6 label | low |
| `agents/security-analyst.md` | T2 | dropped Phase 7 label | low |
| `skills/pr-reviewer/SKILL.md` | T2 | role-name phrasing | low |
| `skills/security-auditor/SKILL.md` | T2 | role-name phrasing | low |
| `skills/task-decomposer/SKILL.md` | T3 | rotate refs removed | low |
| `skills/task-decomposer/references/decomposition-spec.md` | T3 | rotate refs removed | low |
| `skills/task-decomposer/references/procedure.md` | T3 | rotate refs removed | low |
| `.claude-plugin/plugin.json` | T4 | email corp→personal | low |
| `SECURITY.md` | T4 | new — disclosure address | low |

---

## Retro

- **Phase 0 baseline (Sprint 34) caught regression:** `orchestrator` and `design-analyst` are now back at 31 lines (1 over the 30 cap). Trim was tight; small additions during Sprint 32-33 pushed back over. Phase 1/3 to re-trim or amend cap.
