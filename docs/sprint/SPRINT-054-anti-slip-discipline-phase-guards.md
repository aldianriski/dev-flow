---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: in_progress
plan_commit: TBD
close_commit: TBD
---

# Sprint 054 — Anti-Slip Discipline at G1 + Phase Guards (TASK-130)

**Theme:** Reduce AI decision-slip / task-miss risk via pre-task explicit field discipline (focus · context-budget · explicit-gaps · done-confirmation) + Active Sprint guard at sprint-bulk Phase 1 + Mid-Sprint Friction Protocol explicit trigger conditions. ADR-031 locks anti-slip discipline. Sprint 054b carries doc-wire cleanup (TASK-131 — ADR-030 init citation · Path B citation · orphan invocation verification).
**Closes:** TASK-130 (Orchestrator Anti-Slip Discipline at G1 + Phase Guards).
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 053 closed `a9b1f05` (TASK-124 + ADR-030 template canonical ownership).
**Successor:** Sprint 054b — Orchestrator Doc-Wire Cleanup.

---

## Why this sprint exists

User finding 2026-05-09 (post-Sprint-053): "consider slip of error AI decision, is to optimal sprint we need to consider gap limit goals, focus or context we must state, because i still see when assign a task have a possibility to miss and slip the task." User pain: tasks get missed or scope-slip during execution. Existing G1 Scope Checklist captures `goal · size · constraints · layers · red flags` but does NOT explicitly state:

- **Focus:** single-concern statement (what NOT to drift to)
- **Context-budget:** token limit or no-limit declaration before halt
- **Explicit-gaps:** deferred items + explicit out-of-scope list
- **Done-confirmation:** measurable outcome that proves task done

Current `acceptance:` field is closest but not consistently formatted as measurable outcome. Existing Mid-Sprint Friction Protocol (Sprint 052 F5(C)) handles slip mid-execution via fix/defer/block — but anti-slip at G1 prevents slip from happening in the first place. Two additional gaps surfaced at recon:

1. **sprint-bulk Phase 1 doesn't pre-check Active Sprint state.** If Active Sprint empty (sprint:none OR zero `[ ]` tasks), Phase 1 attempts Sprint Scope Batch G1 against nothing. Should halt + redirect to /lean-doc Sprint Promote (mirrors Sprint 053 T2 backflow but inverse direction).
2. **Mid-Sprint Friction Protocol triggers underspecified.** phases.md:227 says "AI surfaces an issue mid-task OR human types `friction`" — but WHAT counts as AI surfacing an issue? Currently behavioral honor-system. Need explicit AI invocation conditions list.

**Locked decisions (G1 Scope Batch):**
- ADR-031 warranted (4-criteria match: non-trivial choice · team-wide pattern · constrains future G1 sub-fields · hard-to-reverse). Draft FIRST per Sprint 053 T0.5 pattern.
- Anti-slip is BEHAVIORAL discipline (type:rigid skill; agent enforces fields). Automated lint deferred to TASK-116-v2 Sprint 054b/055.
- Sprint 054b will carry doc-wire cleanup (ADR-030 init citation + Path B citation + orphan invocation verification).

---

## Open Questions (locked at promote)

- (A) **Anti-slip field set canonical.** **Decision:** 4 new G1 fields — `focus:` (single-concern; one sentence) · `context-budget:` (token estimate OR `no-limit`) · `explicit-gaps:` (deferred items + out-of-scope; bullet list) · `done-confirmation:` (measurable outcome; "[X happens] WHEN [Y trigger]"). Existing `acceptance:` field renamed/extended to `done-confirmation:` for clarity OR kept separate (decide at T3).
- (B) **acceptance vs done-confirmation.** **Decision:** keep `acceptance:` AND add `done-confirmation:`. acceptance = task completion criteria (existing). done-confirmation = OBSERVABLE TEST that proves done (newer; more specific). Different concerns — keep separate to avoid drift.
- (C) **Active Sprint guard placement.** **Decision:** sprint-bulk Phase 0 (NEW pre-check step). Insert before existing Phase 1 (Sprint Scope Batch). Decimal `0.` not `1.0` — phases are numbered 1-6; Phase 0 is the pre-check. Both SKILL.md mode-table and phases.md sprint-bulk Phase need update.
- (D) **Friction Protocol AI invocation conditions.** **Decision:** 5 explicit triggers — (1) scope-creep detected (touching files outside G1 layers/explicit-gaps); (2) 3+ failed test/lint/typecheck runs without progress; (3) unexpected file changes (auto-tooling generated, e.g. lockfile churn); (4) ambiguity blocking task progression (need clarification but Grill skipped at G1); (5) context-budget exceeded (per ADR-031 anti-slip).
- (E) **Friction Protocol human invocation language.** **Decision:** human can type `friction` OR `defer <reason>` OR `block` directly at any task boundary. All three trigger Friction Protocol. `friction` = neutral start (prompts for fix/defer/block); `defer` = direct shortcut (writes TD row + continues); `block` = direct shortcut (halts sprint).
- (F) **Sprint 054b scope.** **Decision:** ADR-030 init phase citation + Path B task-decomposer citation + orphan invocation verification. ~3 tasks, S-M size. Queued post-054.
- (G) **Behavioral enforcement only.** **Decision:** all anti-slip + phase guards rely on type:rigid skill contract. Agents read SKILL.md/phases.md and follow. Automated lint deferred to TASK-116-v2.
- (H) **Cap discipline.** orchestrator SKILL.md 94/100 (Sprint 053 close cap state). T1 + T2 + T3 may add ~3-5 lines total to SKILL.md if inline; must use references/ overflow if cap pressure.
- (I) **release-debt continues.** Sprint 049 MINOR + 050/051a/051b/052/053/054 PATCH (7-sprint chain). Sprint 052b release-debt resolution still owed.
- (J) **Date stamp.** All artifacts 2026-05-09.

---

## Plan

### T0.5 — ADR-031 Anti-Slip Discipline at G1 (FIRST)
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: 4-criteria match documented; 4 new fields canonical; behavioral enforcement scope explicit; cross-links to ADR-030 + Sprint 052 F5(C) + ADR-029)*
**Acceptance:**
- (a) NEW `docs/adr/ADR-031-anti-slip-discipline-at-g1.md` (≤120 lines target ~80).
- (b) Decision: G1 Scope Checklist gains 4 new fields canonical (focus · context-budget · explicit-gaps · done-confirmation). All 4 required at G1 PASS. Behavioral enforcement via type:rigid skill contract.
- (c) Alternatives: keep status quo (rejected — user pain); consolidate into single field (rejected — different concerns); make optional (rejected — defeats purpose).
- (d) Consequences: positive — pre-task slip prevention · clearer goal/scope/test boundary at G1 · matches Mid-Sprint Friction Protocol design (anti-slip at G1 + slip-handling mid-sprint). Negative — G1 checklist longer · 4 more fields to fill per task · behavioral enforcement only until TASK-116-v2 lint.
- (e) Cross-links: ADR-030 (template canonical) · Sprint 052 F5(C) Mid-Sprint Friction Protocol · ADR-029 (CA+DDD) · TASK-116-v2 (Sprint 054b/055 automated lint).
**Source:** TASK-125 user finding 2026-05-09 + design-analyst pattern from Sprint 053 T0.5.
**Depends on:** none (FIRST per ADR-first sequencing pattern).

### T1 — Active Sprint guard at sprint-bulk Phase 0 (orchestrator SKILL.md + phases.md)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: Phase 0 inserted before Phase 1; halt-redirect language clear; SKILL.md cap held)*
**Acceptance:**
- (a) `skills/orchestrator/SKILL.md` § Phases § sprint-bulk — insert NEW Step 0 before existing Step 1 (Sprint Scope Batch G1). Step 0 = "Pre-check: TODO.md frontmatter `sprint:NNN` AND Active Sprint has `[ ]` tasks. If sprint:none OR Active Sprint empty → halt + redirect to `/lean-doc-generator` Sprint Promote."
- (b) `skills/orchestrator/references/phases.md` § sprint-bulk Phase — same Step 0 added with full prompt format: `"Active Sprint not populated (sprint:none OR Active Sprint § empty). Run /lean-doc-generator Sprint Promote first to populate Active Sprint, then return to /orchestrator sprint-bulk. Continue anyway? Default: halt (n). (y/n)"`.
- (c) Soft guard with default halt (mirrors Sprint 053 T2 Step 1.2 pattern). `y` continues for edge cases (manual sprint setup).
- (d) Cap: orchestrator SKILL.md 94→~96/100 (≤97 budget held).
- (e) Sprint file § Files Changed row recorded.
**Source:** ADR-031 + design-analyst pattern from Sprint 053 T2.
**Depends on:** T0.5.

### T2 — Friction Protocol explicit triggers (phases.md § Mid-Sprint Friction Protocol)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: 5 AI invocation conditions explicit; 3 human invocation shortcuts documented; existing fix/defer/block flow preserved)*
**Acceptance:**
- (a) `skills/orchestrator/references/phases.md` § Mid-Sprint Friction Protocol — extend `**Trigger**` line with explicit list of 5 AI invocation conditions:
  1. Scope-creep detected (file changes outside G1 layers OR explicit-gaps)
  2. 3+ failed test/lint/typecheck runs without progress (per orchestrator SKILL.md Red Flag "Same fix attempted 3× without passing")
  3. Unexpected file changes (auto-tooling generated, e.g. lockfile churn, build artifacts)
  4. Ambiguity blocking task progression (Grill should have fired at G1; surfaces mid-task)
  5. Context-budget exceeded (per ADR-031 anti-slip)
- (b) Add explicit human invocation language section. 3 shortcuts:
  - `friction` (neutral start) → prompts fix/defer/block
  - `defer <reason>` (direct shortcut) → writes TD row + continues task
  - `block` (direct shortcut) → halts sprint per First-Blocker Halt rule
- (c) Existing fix/defer/block flow preserved verbatim.
- (d) Sprint file § Files Changed row recorded.
**Source:** ADR-031 + Sprint 052 F5(C) extension.
**Depends on:** T0.5.

### T3 — Anti-Slip G1 Scope Checklist 4 new fields (phases.md G1 Scope Checklist)
**Scope:** small-medium · **Layers:** skills, docs · **Risk:** medium · **HITL** *(reviewer verifies: 4 new fields inserted in G1 checklist template; field formats explicit; backwards-compat for existing G1 patterns)*
**Acceptance:**
- (a) `skills/orchestrator/references/phases.md` § G1 — Scope Checklist — extend existing checklist template with 4 new required fields:
  ```
  focus: <single-concern statement; one sentence; what NOT to drift to>
  context-budget: <token estimate OR `no-limit`>
  explicit-gaps: <deferred items + out-of-scope; bullet list OR `none`>
  done-confirmation: <measurable observable test; "[X happens] WHEN [Y trigger]">
  ```
- (b) `acceptance:` field preserved (different concern: completion criteria vs observable test).
- (c) Insert order: after existing `red flags:` line; before `status:` line. Maintains template flow (verifiable goal → constraints → red flags → anti-slip → final status).
- (d) Add 1-line note: "Anti-slip fields per ADR-031. All 4 required at G1 PASS — partial fill = BLOCK."
- (e) Sprint file § Files Changed row recorded.
**Source:** ADR-031 + design-analyst plan T3.
**Depends on:** T0.5.

### T4 — Validation pass
**Scope:** small · **Layers:** ci, docs · **Risk:** low · **HITL** *(reviewer verifies: all 3 wires syntactically clean; dry-run anti-slip on synthetic task; existing Sprint 053 T1.2 + Sprint 052 F5(C) backflow preserved)*
**Acceptance:**
- (a) Dry-run G1 anti-slip on synthetic task: "Add user profile page". Verify all 4 new fields fillable + meaningful + don't conflict with existing fields.
- (b) Read updated phases.md sprint-bulk Phase + verify Step 0 (Active Sprint guard) precedes Step 1 (Sprint Scope Batch); existing Step 5 (First-blocker halt) + Step 6 (Sprint close) preserved.
- (c) Read updated phases.md Mid-Sprint Friction Protocol + verify 5 AI triggers + 3 human shortcuts + existing fix/defer/block flow all present.
- (d) Cross-check: Sprint 053 T2 SPRINT_PROTOCOLS.md Step 1.2 backflow (lean-doc → task-decomposer) still reads correctly post-Sprint-054 changes.
- (e) Cross-check: Sprint 052 F5(C) on-defer write path (TD row in TODO.md § Tech Debt) still reads correctly + sprint-created field unchanged.
- (f) Friction findings flagged for Sprint 054b OR TASK-125 if applicable.
- (g) Sprint file § Execution Log T4 entry covers a-f outcomes.
**Source:** design-analyst pattern from Sprint 053 T5.
**Depends on:** T1+T2+T3 all complete.

### T5 — Sprint close
**Scope:** small · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer verifies: standard Sprint Close protocol)*
**Acceptance:** standard Sprint Close per SPRINT_PROTOCOLS.md (now includes Step 0 Active Sprint guard from T1, Step 1.2 Backlog backflow from Sprint 053 T2, Step 1.5 TD Scan from Sprint 052 F5(D)). Bump orchestrator SKILL.md last-validated 2026-05-03→2026-05-09; version 2.0.0→2.1.0 (MINOR per new G1 fields + new Phase 0).
**Depends on:** T0.5+T1+T2+T3+T4.

---

## Dependency chain

```
T0.5 (ADR-031)              independent — FIRST
T1 (Phase 0 guard)          depends T0.5
T2 (Friction triggers)      depends T0.5 (parallel-safe with T1)
T3 (G1 anti-slip fields)    depends T0.5 (parallel-safe with T1+T2)
T4 (validation)             depends T1+T2+T3
T5 (sprint close)           depends T0.5+T1+T2+T3+T4
```

Recommended execution: **T0.5 → T1 → T2 → T3 → T4 → T5** (per ADR-first pattern).

Pairwise file overlap matrix (non-empty):
- (T1, T2, T3) — all touch `phases.md` → serialize T1 → T2 → T3 (different sections; line-shifts after each).
- (T1, T5) — orchestrator SKILL.md (T1 adds Phase 0; T5 last-validated bump — both edit SKILL.md; serialize).
- (T5, T1+T2+T3) — sprint file final close stamps + TODO.md sprint:none.

T0.5 + (T1,T2,T3 serialized) + T4 + T5 = clear path.

---

## Cross-task risks

- **orchestrator SKILL.md cap pressure (94/100).** T1 adds Step 0 inline → ~96/100. T5 last-validated bump = 0 line delta (overwrite). Margin: 4 lines. Mitigation: keep T1 Step 0 to single-line reference-delegation form (full prompt detail in phases.md).
- **G1 Scope Checklist size growth.** Adding 4 new fields makes checklist longer. Risk: humans skip fields under time pressure. Mitigation: ADR-031 declares all 4 required at G1 PASS — partial fill = BLOCK. Behavioral hard-stop.
- **Friction Protocol trigger inflation.** 5 explicit AI conditions could over-trigger if implemented loosely. Risk: noise. Mitigation: each trigger has specific threshold (3+ failed runs · file outside G1 layers · etc.) — not aspirational.
- **Behavioral enforcement only.** All anti-slip + phase guards rely on type:rigid skill contract. Until TASK-116-v2 acceptance harness Sprint 054b/055, no automated verification. Mitigation: documented in ADR-031 Negative Consequences + Sprint 054 retro carry-forward.
- **Backwards compat for in-progress work.** Existing Active Sprint tasks promoted pre-Sprint-054 don't have anti-slip fields. Sprint 054 changes apply to NEXT G1 invocations. No retroactive enforcement. Sprint 054 own G1 (this sprint's promote) retroactively applies — fill 4 fields below.
- **release-debt depth +1 → 7 sprints.** Sprint 049 MINOR + 050/051a/051b/052/053/054 PATCH chain. Sprint 052b release-debt resolution increasingly urgent.

---

## Sprint 054 OWN G1 (anti-slip fields applied retroactively per ADR-031)

```
goal: Reduce AI decision-slip / task-miss risk via 4 new G1 fields + Active Sprint guard + Friction Protocol explicit triggers.
size: M
constraints: orchestrator SKILL.md ≤97/100 cap · phases.md sequential edits T1→T2→T3 · ADR-031 first per ADR-first sequencing pattern.
layers: skills, docs
red flags: cap pressure orchestrator SKILL.md · G1 checklist size growth · trigger inflation if loose
focus: Anti-slip MECHANISM at G1; NOT acceptance harness automation (TASK-116-v2 Sprint 054b/055).
context-budget: no-limit (sprint-bulk session-scoped)
explicit-gaps:
  - Sprint 054b doc-wire cleanup (ADR-030 init + Path B + orphan invocation) — DEFERRED
  - Acceptance harness automated divergence lint — TASK-116-v2 Sprint 054b/055
  - Full orchestrator coherence audit beyond anti-slip — TASK-125 Sprint 053b
done-confirmation: G1 invocation post-Sprint-054 produces 4 new fields filled (focus + context-budget + explicit-gaps + done-confirmation) AND sprint-bulk Phase 0 halts on empty Active Sprint AND Friction Protocol fires per 5 explicit AI triggers OR human shortcut.
status: PASS
```

---

## Sprint DoD

- [ ] T0.5 ADR-031 written ≤120 lines target ~80; 4-criteria match + 4 new fields canonical + behavioral enforcement scope explicit; cross-links to ADR-030 + ADR-029 + Sprint 052 F5(C) + TASK-116-v2.
- [ ] T1 sprint-bulk Phase 0 inserted (Active Sprint guard) — orchestrator SKILL.md + phases.md; soft-guard with default halt; cap orchestrator SKILL.md ≤97/100.
- [ ] T2 Mid-Sprint Friction Protocol Trigger line extended w/ 5 AI invocation conditions + 3 human shortcuts (`friction` / `defer <reason>` / `block`); existing fix/defer/block flow preserved.
- [ ] T3 G1 Scope Checklist gains 4 new fields (focus · context-budget · explicit-gaps · done-confirmation) inserted after `red flags:` before `status:`; all required at G1 PASS.
- [ ] T4 validation pass: dry-run G1 anti-slip on synthetic task + verify Phase 0 + verify Friction Protocol triggers + cross-check Sprint 053 + Sprint 052 protocols preserved.
- [ ] T5 TODO.md sprint:none; Active Sprint clear; TASK-125 carry-forward updated; Roadmap Sprint 54 done; sprint file closed; CHANGELOG row prepended; orchestrator SKILL.md 2.0.0→2.1.0 last-validated 2026-05-09.
- [ ] All artifacts stamp 2026-05-09.
- [ ] Cap discipline held: orchestrator SKILL.md ≤97/100 · phases.md grows ~25 lines (no cap) · ADR-031 ≤120/120.
- [ ] release-patch NOT invoked (release-debt continues per Sprint 052b owed).
- [ ] Open questions A-J resolved at promote; zero re-litigation during execution (target).
- [ ] Carry-forward: Sprint 054b doc-wire cleanup (ADR-030 init + Path B + orphan invocation); TASK-116-v2 automated divergence lint.

---

## Execution Log

*(populated per task during sprint-bulk auto-loop)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/adr/ADR-031-anti-slip-discipline-at-g1.md` | T0.5 | NEW (≤120) — anti-slip discipline at G1 ADR | low | — |
| `skills/orchestrator/SKILL.md` | T1+T5 | T1: Phase 0 Active Sprint guard reference-delegation · T5: last-validated bump 2026-05-03→2026-05-09; version 2.0.0→2.1.0 | low | T4 |
| `skills/orchestrator/references/phases.md` | T1+T2+T3 | T1: Phase 0 full prompt · T2: Friction Protocol 5 AI triggers + 3 human shortcuts · T3: G1 Scope Checklist 4 new fields | medium | T4 |
| `TODO.md` | T5 | sprint:none; Active Sprint clear; Roadmap Sprint 54 done | low | — |
| `docs/CHANGELOG.md` | T5 | Sprint 054 row prepended | low | — |
| `docs/sprint/SPRINT-054-anti-slip-discipline-phase-guards.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | G1 Scope Checklist gains 4 new fields (focus · context-budget · explicit-gaps · done-confirmation); all required at PASS | User pain: tasks slip without explicit pre-task discipline | ADR-031 |
| DEC-2 | sprint-bulk Phase 0 = Active Sprint guard (halt + redirect to /lean-doc Sprint Promote if empty) | Mirrors Sprint 053 T2 Step 1.2 backflow inverse direction; prevents auto-loop on empty | — |
| DEC-3 | Friction Protocol AI triggers = 5 explicit conditions (scope-creep · 3+ failed runs · unexpected files · ambiguity · context-budget) | Underspecified honor-system → explicit list closes behavioral gap | — |
| DEC-4 | Friction Protocol human shortcuts = 3 (`friction` / `defer <reason>` / `block`) | Direct shortcuts avoid friction prompt overhead for clear cases | — |
| DEC-5 | acceptance: + done-confirmation: kept SEPARATE (not merged) | Different concerns: completion criteria vs observable test; merging causes drift | — |
| DEC-6 | Behavioral enforcement only this sprint; automated lint deferred to TASK-116-v2 | Acceptance harness pattern from Sprint 052 F5(E); skill type:rigid contract is enforcement vehicle | — |

---

## Open Questions for Review

*(populated post-execution)*

---

## Retro

*(populated at sprint close)*
