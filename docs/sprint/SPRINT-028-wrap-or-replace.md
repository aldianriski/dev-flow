---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change
status: active
plan_commit: —
close_commit: —
---

# Sprint 028 — wrap-or-replace CC primitives

**Theme:** Decide and apply wrap-vs-replace for all Claude Code primitive overlaps in v2
**Scope:** EPIC-E (TASK-086..089). TASK-090 (sweep) → Sprint 029.

---

## Plan

### T1 — TASK-086: Audit CC primitive overlap; draft ADR-012

**Why:** v2 skills/agents overlap with CC built-ins (`/review`, TaskCreate/TaskList, `/init`). No explicit decision exists. Without it, contributors may inconsistently mix CC primitives and custom skill behavior.

**Acceptance:**
1. `docs/research/r9-primitive-audit.md` created (3 cols: CC primitive | current handling | delta)
2. ADR-012 appended to `docs/DECISIONS.md` — decision: replace vs wrap, rationale, alternatives
3. All 3 overlap rows covered

**Files:** `docs/research/r9-primitive-audit.md` · `docs/DECISIONS.md`
**Risk:** low · **ADR needed:** yes (ADR-012) · **Depends on:** none

**DoD:**
- [x] r9-primitive-audit.md created with 3 overlap rows
- [x] ADR-012 appended with decision + rationale + alternatives

---

### T2 — TASK-087: Apply decision to review + security steps

**Why:** ADR-012 must be reflected in `dev-flow/SKILL.md` review step and `code-reviewer` agent description to be authoritative.

**Acceptance:**
1. `dev-flow/SKILL.md` Review phase explicitly notes CC `/review` is **not used** — `code-reviewer` agent is canonical
2. `agents/code-reviewer.md` description references ADR-012
3. r9-primitive-audit.md row for `/review` marked "resolved"

**Files:** `skills/dev-flow/SKILL.md` · `agents/code-reviewer.md` · `docs/research/r9-primitive-audit.md`
**Risk:** low · **ADR needed:** no · **Depends on:** TASK-086

**DoD:**
- [x] dev-flow/SKILL.md review step updated
- [x] code-reviewer.md description references ADR-012
- [x] audit row marked resolved

---

### T3 — TASK-088: Apply decision to task tracking

**Why:** ADR-012 must be reflected in skill phases that reference task progress — prevents contributors from wiring in TaskCreate/TaskList.

**Acceptance:**
1. `dev-flow/SKILL.md` quick/mvp phases reference `TODO.md` as canonical — CC TaskCreate/TaskList **not used**
2. `references/phases.md` Session Close confirms TODO.md write-back, not CC task update
3. r9-primitive-audit.md row for TaskCreate/TaskList marked "resolved"

**Files:** `skills/dev-flow/SKILL.md` · `skills/dev-flow/references/phases.md` · `docs/research/r9-primitive-audit.md`
**Risk:** low · **ADR needed:** no · **Depends on:** TASK-086

**DoD:**
- [x] dev-flow/SKILL.md phases updated
- [x] phases.md Session Close confirms TODO.md
- [x] audit row marked resolved

---

### T4 — TASK-089: Apply decision to init mode

**Why:** `dev-flow init` mode must be explicit that it replaces CC `/init` — not supplemental.

**Acceptance:**
1. `dev-flow/SKILL.md` init phase notes CC `/init` is **not used** — `dev-flow init` is canonical for this scaffold
2. r9-primitive-audit.md row for `/init` marked "resolved"

**Files:** `skills/dev-flow/SKILL.md` · `docs/research/r9-primitive-audit.md`
**Risk:** low · **ADR needed:** no · **Depends on:** TASK-086

**DoD:**
- [x] dev-flow/SKILL.md init phase updated
- [x] audit row marked resolved

---

## Execution Log

- TASK-086 done 2026-05-01: r9-primitive-audit.md created; ADR-012 appended to DECISIONS.md
- TASK-087 done 2026-05-01: dev-flow/SKILL.md Replaces note added; code-reviewer.md references ADR-012
- TASK-088 done 2026-05-01: phases.md Session Close notes TODO.md canonical; SKILL.md Replaces note covers TaskCreate/TaskList
- TASK-089 done 2026-05-01: SKILL.md Replaces note covers init → CC `/init`

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/research/r9-primitive-audit.md` | TASK-086 | created — 3-row CC primitive audit | low | no |
| `docs/DECISIONS.md` | TASK-086 | ADR-012 appended — replace over wrap decision | low | no |
| `skills/dev-flow/SKILL.md` | TASK-087/088/089 | Replaces note added covering all 3 CC primitives | low | no |
| `agents/code-reviewer.md` | TASK-087 | description references ADR-012 | low | no |
| `skills/dev-flow/references/phases.md` | TASK-088 | Session Close notes TODO.md canonical, CC tasks not used | low | no |

---

## Decisions

ADR-012 — see `docs/DECISIONS.md`

---

## Retro

*(fill at sprint close)*
