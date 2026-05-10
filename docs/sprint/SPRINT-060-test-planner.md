---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: planning
plan_commit: pending
close_commit: pending
---

# Sprint 060 — test-planner skill (v4.1.0 MINOR)

**Theme:** NEW skill `test-planner` — fills the Testing-phase PRIMARY gap surfaced in Sprint 058 SDLC audit. Distinct from `tdd` (writes tests) / `pr-reviewer` (reviews code) / `code-reviewer` agent (post-impl review). Covers test PLANNING + GROUPING with 4-group canonical convention (unit · integration · e2e · regression). Closes Workstream C item 7 from `refined-task-list.md`. v4.1.0 MINOR lockstep per ADR-006.

**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 059 closed (`e71dfab`) · v4.0.0 audit-driven cleanup shipped.
**Closes:** TASK-151..153 (TODO.md § Backlog P0 cluster). **Final sprint of post-v1-feedback workstream** — refined-task-list.md fully addressed after this.
**Promote method:** Flow Grill v3.1.0+ (3rd dogfood; loop ran inline from source FLOW_GRILL.md).

## Why this sprint exists

Sprint 058 audit T1 surfaced Testing as the highest-rank phase gap: 5 PRIMARY components but all are gates/reviews (pr-reviewer · code-reviewer · security-auditor · security-analyst · performance-analyst); only `tdd` actively produces tests during Implementation, and even tdd doesn't PLAN the test set. Refined-list item 7 explicitly asked for "dedicated testing skill with grouping conventions". Sprint 060 builds it.

The audit's remediation T3 pre-locked 3 task seeds with sizes/risks/outcomes; this sprint executes those seeds + one MINOR bump.

## Pre-locked decisions (5)

- (D-A) **Test grouping convention = unit / integration / e2e / regression.** 4-group canonical · industry standard · matches refined-list item 7 wording. No 5th group; no per-project flexibility (adopters can extend in their own conventions but plugin-bundled skill ships with this set).
- (D-B) **Manual MINOR bump.** release-patch HARD-rejects MINOR per ADR-027 boundary; manual sprint-less bump pattern (6th instance: Sprint 052b T1 + Releases 2.7.0 / 3.0.0 / 3.1.0 / 4.0.0 / this 4.1.0).
- (D-C) **HITL gates at T1 + T3.** T1 = skill-trigger description quality (gates downstream wiring); T3 = version bump + CHANGELOG per ADR-027.
- (D-D) **User-outcome lens carries forward** (Sprint 058 D-G as standing principle). test-planner row in USER-OUTCOMES.md tags O8 reliability + O4 rework.
- (D-E) **Push gate emit-only** per release-patch HARD STOP language. Carries forward Sprints 057-059 D-F.

## Anti-slip (G1 fields per ADR-031)

- **focus**: build `test-planner` skill ONLY · do NOT extend `tdd` or `pr-reviewer` · no coverage tooling (anti-outcome per USER-OUTCOMES.md)
- **context-budget**: ~12-15k (T1 ~7k SKILL+references · T2 ~3k wire · T3 ~3k bump)
- **explicit-gaps**: Workstream A/B/C all closed after this sprint · no remaining items from refined-task-list.md · push gate stays operator-only · no test-COVERAGE measurement (different surface)
- **done-confirmation**: [test-planner skill exists with ≤100-line SKILL.md + references/TEST_GROUPING.md AND wired in skill-dispatch.md AND v4.1.0 lockstep bumped AND eval-skills passes test-planner] WHEN [TASK-153 close commit lands]

## Plan

### T1 — NEW skill `test-planner` (HITL gate)

**Acceptance:**
1. New `skills/test-planner/SKILL.md` ≤100 lines (cap respected): frontmatter (name · description · version 1.0.0 · last-validated · user-invocable: true · argument-hint · type: rigid); body with Q&A planning protocol + 4-group convention table + Red Flags ≥3 + References pointer.
2. New `skills/test-planner/references/TEST_GROUPING.md` (~80-120 lines): full grouping definitions (per group: scope · examples · counter-examples · common pitfalls) + decision tree (which group covers a given scenario) + skip-when guidance + integration with `tdd` skill (test-planner plans → tdd writes).
3. `docs/USER-OUTCOMES.md` § Skills count 15 → 16; new test-planner row mapping to **O8 reliability** + **O4 rework**; non-tautological skip-when ("when feature is throwaway prototype where tests outlast use" or similar).
4. Description starts with "Use when…"; ≤500 chars.

**Scope:** IN — new skill body + references doc + USER-OUTCOMES row. OUT — skill-dispatch wiring (T2) · version bump (T3).
**Files:** `skills/test-planner/SKILL.md` NEW · `skills/test-planner/references/TEST_GROUPING.md` NEW · `docs/USER-OUTCOMES.md` EDIT.
**Tests:** N/A (skill body; eval-skills runs at T3 to verify R1-R7 structural rules).
**Risk:** medium — new skill cap-headroom + trigger description quality.
**Layers:** `skills, docs`.
**Depends on:** —.
**HITL** stop-point at T1 close.

### T2 — Wire test-planner into orchestrator skill-dispatch

**Acceptance:**
1. `skills/orchestrator/references/skill-dispatch.md` § Always-On table gains row for `test-planner` between `tdd` row and `lean-doc-generator` row: trigger condition `G1 task-type=feature/new-behavior · pre-tdd planning step` · invocation `propose → human y/n` · skip note "skip if tdd already covers planning informally".
2. CONTEXT.md untouched if no vocabulary or agent change needed (test-planner is a skill, not an agent; vocabulary "test grouping" optionally added if useful — judgment call at execution time).
3. Existing skill-dispatch.md notes section gains 1-line update: "test-planner vs tdd — test-planner plans (which tests · which group); tdd writes them (red-green-refactor)".

**Scope:** IN — skill-dispatch.md row + notes update. OUT — actual skill body (T1) · version bump (T3).
**Files:** `skills/orchestrator/references/skill-dispatch.md` EDIT.
**Tests:** N/A.
**Risk:** low — single file edit.
**Layers:** `skills, docs`.
**Depends on:** TASK-151.

### T3 — Plugin propagation + lockstep MINOR bump 4.0.0 → 4.1.0 (HITL gate)

**Acceptance:**
1. `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` 4.0.0 → 4.1.0 lockstep per ADR-006.
2. `docs/CHANGELOG.md` v4.1.0 prepended (outcome-led per ADR-026 · O8 reliability + O4 rework + O5 flow lead; ≤12 lines headline + 6 bullets max per ADR-034 History Hygiene).
3. `README.md` banner v4.0.0 → v4.1.0; "What You Get" components table Skills 15 → 16.
4. Eval gates: `node scripts/eval-skills.js` test-planner row PASS on R1-R7 (frontmatter · name · description · "Use when" lead · ≤500 chars · ≤100 SKILL.md · Red Flags section); `node scripts/eval-acceptance.js --cap-headroom-warn` no NEW BREACH.
5. release-patch NOT invoked per ADR-027 boundary (manual MINOR · 6th-instance pattern).

**Scope:** IN — manifests + CHANGELOG + README + eval verification. OUT — skill body (T1) · wire (T2).
**Files:** `.claude-plugin/plugin.json` EDIT · `.claude-plugin/marketplace.json` EDIT · `docs/CHANGELOG.md` EDIT · `README.md` EDIT.
**Tests:** YES (eval gates).
**Risk:** low — additive bump.
**Layers:** `docs, ci`.
**Depends on:** TASK-151, TASK-152.
**HITL** stop-point at T3 close.

## Open Questions for Review

*(empty at lock — all questions resolved during Flow Grill iteration; ledger fully populated; 0 follow-up triggers fired)*

## Execution Log

*(empty — appended during sprint execution)*

## Files Changed

*(empty — populated during execution; one row per file: `File | Task | Change (one-line WHY) | Risk | Test added`)*

## Decisions

*(empty — populated during execution for architectural-level decisions; D-A..D-E already captured in Pre-locked decisions section above)*

## Retro

*(empty — populated at close: Worked / Friction / Pattern candidates / TD prompts; ≤6 bullets each per ADR-034 History Hygiene)*
