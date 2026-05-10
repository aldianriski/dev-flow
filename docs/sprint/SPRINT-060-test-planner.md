---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: closed
plan_commit: e411f2e
close_commit: f8e70e9
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

- **T1 close 2026-05-10** — test-planner skill body + references + USER-OUTCOMES row. `skills/test-planner/SKILL.md` NEW 88/100 lines (12-line headroom OK tier); description leads with "Use when…" + clear distinction from tdd/pr-reviewer; 5-Q batched planning protocol; 4-group convention summary table; output format spec; 5 Red Flags; references pointer. `skills/test-planner/references/TEST_GROUPING.md` NEW 175 lines (over the ~80-120 estimate but justified by 4-group × ~25-line depth + decision tree + skip-when + tdd hand-off envelope + anti-outcomes); per-group covers scope/examples/counter-examples/pitfalls/speed-budget. `docs/USER-OUTCOMES.md` § Skills 15 → 16; new test-planner row mapping O8 reliability + O4 rework with non-tautological skip-when (trivial change OR coverage-% anti-outcome). HITL gate fired post-commit per D-C.
- **T2 close 2026-05-10** — test-planner wired into orchestrator skill-dispatch.md. New row in Always-On table between tdd and existing rows: `G1 task-type = feature / new-behavior · pre-tdd planning step → test-planner → propose y/n (skip if tdd already covers informally)`. Notes section gains 1-line clarification on test-planner vs tdd pairing (planner plans · tdd writes). No CONTEXT.md vocabulary change needed (judgment call: 4-group convention details live in TEST_GROUPING.md, not as canonical CONTEXT vocab). Single-file edit · 0 friction.
- **T3 close 2026-05-10** — Plugin propagation + lockstep MINOR bump 4.0.0 → 4.1.0 (HITL gate cleared by user `lock`). plugin.json + marketplace.json bumped lockstep per ADR-006. CHANGELOG v4.1.0 prepended outcome-led per ADR-026 (O8 reliability + O4 rework + O5 flow lead; ≤12 lines headline + 6 bullets max per ADR-034). README banner v4.0.0 → v4.1.0 + components table Skills 15 → 16. Eval gates: eval-skills.js test-planner row PASSES R1-R7 (frontmatter · "Use when…" · ≤500 chars · ≤100 SKILL.md · Red Flags section); 13 pass / 3 PRE-EXISTING R7 violations carry (codemap-refresh + prime + release-patch). cap-headroom lint: 16 skills · 14 OK / 2 WARN (lean-doc 96/100 + orchestrator 98/100 carry from Sprint 059) / 0 BREACH; test-planner 89/100 = 11-line OK headroom. Manual MINOR sprint-less bump 6th-instance pattern (Sprint 052b T1 + Releases 2.7.0 / 3.0.0 / 3.1.0 / 4.0.0 / this 4.1.0); release-patch NOT invoked per ADR-027 boundary.

## Files Changed

- `skills/test-planner/SKILL.md` | T1 | NEW (88/100 lines · 12-line headroom OK) — protocol entry: description "Use when…" + 5-Q batched planning + 4-group table + output format + 5 Red Flags + references pointer | risk: low (additive new skill) | test: deferred to T3 eval-skills run
- `skills/test-planner/references/TEST_GROUPING.md` | T1 | NEW (175 lines · over ~80-120 target but content-justified) — full per-group definitions × 4 + decision tree + skip-when + tdd hand-off envelope + anti-outcomes | risk: low | test: N/A
- `docs/USER-OUTCOMES.md` | T1 | EDIT — § Skills heading 15 → 16; new test-planner row mapping O8 + O4 with non-tautological skip-when | risk: low | test: N/A
- `skills/orchestrator/references/skill-dispatch.md` | T2 | EDIT — new test-planner row in Always-On table between tdd row + lean-doc row; notes section clarifies planner vs tdd pairing | risk: low (additive table row + 1-line note) | test: N/A
- `.claude-plugin/plugin.json` | T3 | EDIT — version 4.0.0 → 4.1.0 lockstep | risk: low | test: N/A
- `.claude-plugin/marketplace.json` | T3 | EDIT — version 4.0.0 → 4.1.0 lockstep | risk: low | test: N/A
- `docs/CHANGELOG.md` | T3 | EDIT — v4.1.0 row prepended outcome-led O8+O4+O5 per ADR-026 lens; History Hygiene cap respected | risk: low | test: N/A
- `README.md` | T3 | EDIT — banner v4.0.0 → v4.1.0; components table Skills 15 → 16; agents 6 unchanged | risk: low | test: N/A

## Decisions

*(empty — populated during execution for architectural-level decisions; D-A..D-E already captured in Pre-locked decisions section above)*

## Retro

**Worked (≤6 per ADR-034):**

1. Audit-pre-locked seeds (Sprint 058 T3 remediation plan) executed cleanly — 3 task seeds → 3 commits, 0 mid-sprint scope creep, 0 friction. Validates audit-first sequencing discipline (ADR-031 anti-slip + Sprint 058 D-G outcome-lens carry-forward).
2. test-planner skill design fits cleanly into existing tdd/pr-reviewer pairing — distinct surface (planner plans · tdd writes · pr-reviewer reviews) closes Sprint 058 audit T1's Testing-phase gap finding without overlap.
3. References-pattern reused from Sprint 057 (FLOW_GRILL.md) + Sprint 059 (lenses.md): `skills/test-planner/references/TEST_GROUPING.md` keeps SKILL.md at 88/100 (12-line headroom OK); generalized "reference-only growth canon" pattern now 6+ instances locked.
4. Outcome-lens carries forward (Sprint 058 D-G standing principle) — test-planner row in USER-OUTCOMES.md tagged O8+O4 with non-tautological skip-when at design time, not retroactively.
5. eval-skills R1-R7 passed first try for test-planner — frontmatter discipline + "Use when…" + ≤500-char description + ≤100 SKILL.md + Red Flags section all satisfied without iteration.
6. 4-group canonical convention (D-A pre-locked) prevented design oscillation — no mid-sprint debate about adding 5th group or per-project flexibility.

**Friction (≤6):**

1. None. AFK execution clean across all 3 tasks. T1 HITL gate cleared via "continue"-style fast-path from prior sprint's pattern; T3 HITL gate cleared cleanly with eval gates passing.

**Pattern candidates (≤6 — for VALIDATED_PATTERNS.md if user confirms):**

1. **Skill-creation pattern (4th instance)** — SKILL.md ≤100 with Q&A protocol summary + table summary + Red Flags + references pointer · references/<NAME>.md holds full body. Validated across FLOW_GRILL (Sprint 057) · lenses.md (Sprint 059) · TEST_GROUPING.md (this sprint). Reference-only growth canon now strongly validated for both skills and agents (post-Sprint-059 agents/references/ extension).
2. **Audit-driven multi-sprint sequencing** — Sprint 058 audit produced remediation plan with task seeds → Sprint 059 + Sprint 060 each consumed seeds 1:1 with 0 mid-sprint scope creep. Validates audit-first principle for cross-cutting work; recommends future audit-led sprints follow same shape.
3. **4-group test convention as canonical** — unit/integration/e2e/regression as 4-locked-groups (no 5th, no per-project flex in plugin-bundled skill) made test-planner skill design tight; adopters extend in their own conventions, plugin ships canonical. Pattern: lock canonical → adopter extends → plugin doesn't enforce extensions.

**TD prompts (carry-forward / new):**

- TD-003 (medium · open · 055b) — scoped-checkout-glob anti-pattern → carry to next session post-v1-feedback-workstream-close.
- TD-004 (minor · open · 055b) — pointer-line `+2 lines` canonical → T3 CHANGELOG prepend used the pattern; codification opportunity remains for future sprint.
- NO new TD added this sprint.

**Eval gate carry-forward:** cap-headroom 16 skills · 14 OK / 2 WARN (lean-doc 96/100 + orchestrator 98/100 carry from Sprint 059 T2 Dispatcher Role subsection) / 0 BREACH; test-planner 89/100 OK 11-line headroom. eval-skills 13 pass / 3 PRE-EXISTING R7 violations (codemap-refresh + prime + release-patch missing ## Red Flags section) carry forward unchanged from Sprint 037+ baseline. Manual MINOR 4.0.0 → 4.1.0 lockstep verified clean.

**Sprint 060 closes refined-task-list.md FULLY.** Workstream A (Sprint 057 Flow Grill) + B/C audit (Sprint 058 SDLC audit) + B/C cleanup (Sprint 059 v4.0.0) + C testing (this Sprint 060 v4.1.0). Post-v1-feedback workstream complete; next sprints free for new work.
