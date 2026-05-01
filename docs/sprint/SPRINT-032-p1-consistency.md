---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change
status: closed
plan_commit: —
close_commit: 58bfd35
backfilled: 2026-05-01 (retroactively documented from commit message)
---

# Sprint 032 — P1 Consistency Sweep

**Theme:** Resolve 8 P1 findings from AUDIT-2026-05-01 — vocab/path drift, plural inconsistency, dispatch-table noise, ADR-012 stray mention, oversized SKILL.md, no-op hooks, archived plan, missing `Do not use when` clauses.
**Scope:** AUDIT-2026-05-01 P1-1..9 (P1-9 partial — see retro).

> **Note:** Backfilled retroactively. Plan reconstructed from commit `58bfd35`.

---

## Plan (reconstructed)

### T1 — P1-1 CONTEXT.md vocab path
**Acceptance:** `skill =` path updated to plugin layout (`${CLAUDE_PLUGIN_ROOT}/skills/`).

### T2 — P1-2 lean-doc-generator dir rename
**Acceptance:** `skills/lean-doc-generator/reference/` → `references/` (plural). SKILL.md path lines updated.

### T3 — P1-3 skill-dispatch.md adopter section
**Acceptance:** Non-bundled adopter skills clearly labeled "Adopter-provided — not bundled."

### T4 — P1-4 code-reviewer ADR-012 stray
**Acceptance:** Inconsistent ADR-012 mention removed from agent description (already covered in skill).

### T5 — P1-5 trim pr-reviewer SKILL.md
**Acceptance:** 120→89 lines. Severity examples + hard rules to `references/review-standards.md`.

### T6 — P1-7 settings.local.json no-op hooks
**Acceptance:** 4 PreToolUse no-op hooks removed.

### T7 — P1-8 archive v2-rewrite-plan
**Acceptance:** `docs/v2-rewrite-plan.md` → `docs/audit/v2-rewrite-plan.md`.

### T8 — P1-9 backfill `Do not use when`
**Acceptance:** 9 skill descriptions gain `Do not use when` clause. **Partial** — `dev-flow` and `task-decomposer` skills still missing (deferred to Phase 3).

---

## Execution Log

- 2026-05-01: All 8 tasks shipped in single commit `58bfd35`.

---

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| `.claude/CONTEXT.md` | T1 | vocab path updated | low |
| `skills/lean-doc-generator/reference/*` → `references/*` | T2 | dir rename + SKILL.md updates | low |
| `skills/dev-flow/references/skill-dispatch.md` | T3 | adopter section labeled | low |
| `agents/code-reviewer.md` | T4 | ADR-012 stray removed | low |
| `skills/pr-reviewer/SKILL.md` | T5 | trimmed 120→89 lines | low |
| `skills/pr-reviewer/references/review-standards.md` | T5 | new — extracted content | low |
| `.claude/settings.local.json` | T6 | 4 no-op hooks removed | low |
| `docs/audit/v2-rewrite-plan.md` | T7 | moved from `docs/` | low |
| `skills/{adr-writer,refactor-advisor,release-manager,security-auditor,system-design-reviewer,zoom-out,dev-flow-compress,lean-doc-generator}/SKILL.md` | T8 | added Do-not-use-when clause | low |

---

## Retro

- **P1-9 partial close:** `dev-flow` and `task-decomposer` skill descriptions still missing the "Do not use when" clause. Phase 0 baseline confirms. Add to Phase 3 (Sprint 37) backlog.
- **Sprint plan absent again** — same drift as Sprint 30. Confirms TASK-117 protocol fix is needed.
