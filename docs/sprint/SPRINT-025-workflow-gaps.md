---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-30
update_trigger: sprint open / close / status change
status: complete
plan_commit: —
close_commit: —
---

# Sprint 025 — workflow-gaps

**Theme:** Close 4 workflow gaps from IMPROVEMENT.md audit: session-close doc coverage (L1), session-resume warm-up (L2), skill-dispatch table (L3), sprint skill integration (L4).
**PRD:** Internal — IMPROVEMENT.md loopholes audit 2026-04-30.

---

## Plan

### T1 — TASK-105: Phase 10 — advisory doc-sync checklist

**Why:** Phase 10 mandates session close but doesn't name which docs to review. Without a bound list, AI skips or inconsistently checks — doc drift accumulates across sessions.

**Acceptance:**
1. `phases.md` Phase 10 Session Close template gains "Doc sync review" advisory section
2. Section lists: `README.md` · `docs/blueprint/*` · `CHANGELOG.md` · `CONTRIBUTING.md` · `.claude/CLAUDE.md`
3. Format: checklist table with `affected? yes/no/n-a` column per doc
4. Labeled advisory — not a hard stop
5. Line caps respected

**Files (likely):** `.claude/skills/dev-flow/references/phases.md`

**Tests:** none (doc-only)

**Risk:** low — additive change; no existing steps removed

**Depends on:** none

**ADR needed:** no

**DoD:**
- [x] phases.md Phase 10 has doc-sync advisory section
- [x] Section matches "Docs to keep in sync" list from TODO.md header
- [x] Format is table with `affected?` column
- [x] Clearly labeled advisory (not hard stop)

**Confidence:** 95%

---

### T2 — TASK-106: Phase 0 — session start warm-up protocol

**Why:** New session starts cold — Phase 0 reads TODO.md but doesn't surface prior Phase 10 "Recommended next-session updates". Recommended actions silently skipped → drift accumulates.

**Acceptance:**
1. `phases.md` Phase 0 gains "Session warm-up" as first sub-bullet
2. Step: check for non-empty "Recommended next-session updates" from prior Phase 10 output → surface list before task parse proceeds
3. Doc-only — no script changes
4. Line caps respected

**Files (likely):** `.claude/skills/dev-flow/references/phases.md`

**Tests:** none (doc-only)

**Risk:** low — additive step only

**Depends on:** none

**ADR needed:** no

**DoD:**
- [x] Phase 0 has session warm-up as first bullet
- [x] Step references "Recommended next-session updates" from Phase 10 output
- [x] No code changes

**Confidence:** 90%

---

### T3 — TASK-107: Skill-dispatch table — layers → required skills

**Why:** 10+ scaffolding skills exist but no binding between task `layers` and which skills to invoke. Each dev-AI pair picks freely → inconsistent patterns across team.

**Acceptance:**
1. `skills/dev-flow/references/skill-dispatch.md` created with dispatch table
2. Table maps all `layers` values → required skill(s) to invoke before/during Phase 3
3. Covers layer values: `governance, docs, harness, scripts, skills, agents, templates, examples, ci` + cross-cutting (`api`, `fe`, `be`, `mobile`)
4. Gate 0 scope confirmation template (phases.md) gains "Required skills: [advisory list]" field
5. phases.md Phase 0 Parse gains dispatch lookup bullet
6. DECISIONS.md gains ADR entry for skill-dispatch governance
7. Line caps respected

**Files (likely):** `.claude/skills/dev-flow/references/skill-dispatch.md` (new) · `.claude/skills/dev-flow/references/phases.md` · `docs/DECISIONS.md`

**Tests:** none (doc-only)

**Risk:** medium — Gate 0 format change affects every flow; must not break existing Gate 0 prompt

**Depends on:** none

**ADR needed:** yes

**DoD:**
- [x] skill-dispatch.md created with full dispatch table
- [x] Gate 0 template has "Required skills" advisory field
- [x] Phase 0 has dispatch lookup step
- [x] DECISIONS.md gains ADR entry

**Confidence:** 85%

---

### T4 — TASK-108: Wire skill-dispatch into sprint mode

**Why:** Sprint mode plans tasks in bulk but doesn't surface required skills per task — dev doesn't know which skills to invoke during sprint execution.

**Acceptance:**
1. `mode-sprint.md` Step 2 Sprint Plan table gains "Skills" column (from dispatch table lookup per task `layers`)
2. Step 3 execute section gains per-task advisory before Gate 0: "Required skills: [list]"
3. Advisory only — not a hard stop

**Files (likely):** `.claude/skills/dev-flow/references/mode-sprint.md`

**Tests:** none (doc-only)

**Risk:** low — additive column + advisory step

**Depends on:** TASK-107

**ADR needed:** no

**DoD:**
- [x] mode-sprint.md Step 2 table has Skills column
- [x] Step 3 surfaces required skills advisory per task before Gate 0

**Confidence:** 90%

---

## Execution Log

- TASK-105 done 2026-04-30: phases.md Phase 10 Session Close template gains "Doc sync review" advisory table listing 5 core docs with affected?/action columns.
- TASK-106 done 2026-04-30: phases.md Phase 0 gains "Session warm-up" as first bullet — surfaces prior Phase 10 "Recommended next-session updates" before task parse.
- TASK-107 done 2026-04-30: skill-dispatch.md created with full dispatch table (meta-repo layers + product layers); Gate 0 template gains "Required skills" advisory field; Phase 0 gains dispatch lookup bullet; ADR-011 appended to DECISIONS.md.
- TASK-108 done 2026-04-30: mode-sprint.md Step 2 table gains "Skills" column; Step 3 gains pre-task advisory skill-dispatch lookup.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `.claude/skills/dev-flow/references/phases.md` | TASK-105 | Phase 10: advisory doc-sync review table added | low | no |
| `.claude/skills/dev-flow/references/phases.md` | TASK-106 | Phase 0: session warm-up bullet added (first step) | low | no |
| `.claude/skills/dev-flow/references/skill-dispatch.md` | TASK-107 | new — layers-to-skills dispatch table (meta + product) | low | no |
| `.claude/skills/dev-flow/references/phases.md` | TASK-107 | Gate 0 template: "Required skills" advisory field added; Phase 0: dispatch lookup bullet | low | no |
| `docs/DECISIONS.md` | TASK-107 | ADR-011: skill-dispatch governance decision | low | no |
| `.claude/skills/dev-flow/references/mode-sprint.md` | TASK-108 | Step 2 table: Skills column; Step 3: skill-dispatch advisory before Gate 0 | low | no |

---

## Decisions

*(append during sprint — architectural or significant tactical decisions)*

---

## Open Questions for Review

*(append during sprint — surface to Tech Lead at next pause)*

---

## Retro

*(fill at sprint close — Worked / Friction / Pattern candidate)*
