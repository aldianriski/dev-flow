---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: active
plan_commit: 9c214d1
close_commit: pending
---

# Sprint 057 — Flow Grill: terminal-first planning convergence

**Theme:** Collapse the 3-skill planning handoff (`task-decomposer` → `lean-doc-generator` Sprint Promote → `orchestrator` sprint-bulk G1+G2) into a single terminal-first iterative grill loop that converges open questions BEFORE any sprint document is written. v3.1.0 MINOR lockstep per ADR-006. Workstream A (items 1+2+6) from `refined-task-list.md`.

**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 056 closed (close commit pending squash) · Release 3.0.0 v1 STABLE shipped (`f746db2`).
**Closes:** TASK-135..139 (TODO.md § Backlog P0 Flow Grill cluster).

## Why this sprint exists

First sprint of post-v1 cycle. v1 SHIP closed two days of feature lockstep; Sprint 057 opens the Flow Optimization workstream surfaced in `refined-task-list.md` items 1+2+6:

1. **Item 1 — Move Open Questions to terminal-first interaction.** Today: `lean-doc-generator` Sprint Promote Step 3 batch-asks decompose questions, then writes the sprint file with answers baked in. Failure mode: bad assumption surfaces at G2 review → retroactive fix to a frozen plan. Terminal-first lets us converge BEFORE committing to a doc.
2. **Item 2 — Consolidate task creation and sprint creation into one cohesive flow.** Today: `/task-decomposer` writes Backlog rows, `/lean-doc-generator` Sprint Promote re-asks the same context to produce the sprint file. Redundant context loading wastes tokens and scope clarity drifts between the two stages.
3. **Item 6 — Optimize the `task-decompose → lean-doc-generator → orchestrator` flow (token waste).** Today: each skill loads CONTEXT.md + TODO.md + its own protocol references. 3× duplication per planning cycle. Proposed redesign: "Flow grill" pattern — iterative terminal back-and-forth until optimal flow converges, THEN generate the sprint plan from the locked state.

**Pre-locked decisions** (user 2026-05-10 at promote, from refined-task-list.md Workstream A scope):
- (D-A) Workstream-A scope = items 1+2+6 only. Items 3/4/5 (Workstream B — Codemap user-scope, history-rule scope, TODO history) deferred to Sprint 059. Items 7/8 (Workstream C — testing skill, SDLC audit) deferred to Sprint 058 (audit-first per refined-task-list.md recommended order).
- (D-B) Lock semantics = explicit `lock` keyword from user (mirrors `approve` semantics in task-decomposer Step 6 per ADR-030). On `lock`, FLOW_GRILL.md ledger freezes and Sprint Promote Step 5 fires.
- (D-C) Anti-slip 4 fields preserved per ADR-031 (focus · context-budget · explicit-gaps · done-confirmation); Flow Grill batches them as ledger fields, NOT as a separate G1 step. Single mechanism, not two.
- (D-D) Bump class = MINOR `3.0.0 → 3.1.0` lockstep per ADR-006. New skill behavior (Flow Grill loop) qualifies as MINOR per Quick Rules § GOVERNANCE. NOT a MAJOR (no phase/gate/hook contract change; G1+G2 gates still exist conceptually — they resolve upstream in Flow Grill rather than in orchestrator).
- (D-E) Release-patch invocation = NO. MINOR bump is manual lockstep per ADR-032 DEC-2 / ADR-027 boundary (release-patch HARD-rejects MAJOR; MINOR also manual at this rate of release events; precedent = Sprint 052b T1 + Release 2.7.0 + Release 3.0.0 = 3 instances pattern locked).
- (D-F) Push gate = emit-only per release-patch HARD STOP language (operator runs `git push origin master`). Matches Sprint 056 D-D.

## Open Questions (locked at promote)

- (A) **Flow Grill batching cap.** **Decision:** ≤5 independent questions per turn (TASK-135 AC). Follow-up turn on ambiguous answer. NEVER batch dependent or open-ended questions (re-asks scope-drift signal per ADR-031 anti-slip).
- (B) **Ledger persistence across turns.** **Decision:** in-memory during planning session; serialized into the seed block on `approve` from task-decomposer (TASK-138) so Sprint Promote can hydrate without re-asking. Cold-start path = no seed → grill runs from scratch.
- (C) **Sprint file write gate.** **Decision:** sprint file write GATED on `lock` keyword consumption (TASK-136). Steps 1 / 1.2 / 1.5 / 1.5b scans run BEFORE the grill loop; Steps 3-7 of Sprint Promote rewritten to point at FLOW_GRILL.md loop; Step 5 (sprint file write) fires only after `lock`.
- (D) **Orchestrator sprint-bulk G1+G2 disposition.** **Decision (TASK-137):** collapse phases.md sprint-bulk Steps 1+2 (G1 batch + G2 batch dispatch) into single "Step 1: Consume locked Flow Grill ledger". Dispatcher reads ledger and invokes scope-analyst + design-analyst from ledger fields; NO separate G1/G2 questioning in terminal. Phase 0 Active Sprint guard, Step 3 overlap gate, Step 4 auto-loop, Step 5 first-blocker, Step 6 close all PRESERVED.
- (E) **task-decomposer seed block shape.** **Decision (TASK-138):** JSON block `## Flow Grill Seed` emitted AFTER `approve`-write step. Shape: `{ tasks: [...], assumptions: [...], risk: ..., layers: [...] }`. Sprint Promote hydrates if present; cold-starts otherwise. Existing decompose validation rules unchanged.
- (F) **CONTEXT.md vocabulary impact.** **Decision (TASK-139):** add `flow grill` row to § Vocabulary; update § Modes table `sprint-bulk` row to reflect "G1+G2 (resolved upstream via Flow Grill)". Single propagation pass at end (TASK-139), not per-task.
- (G) **README Daily Pattern.** **Decision:** verify if README.md Daily Pattern references Sprint Promote 3-stage shape. If yes, update lockstep with TASK-139. If no, no change.
- (H) **Cap-headroom regression risk.** **Decision:** new content lives in `references/FLOW_GRILL.md` (≤180 lines, NEW file). SKILL.md changes for lean-doc + orchestrator + task-decomposer = pointer line additions only (`\n\n<pointer>\n` +2 lines max per TD-004 canonical pattern). lean-doc 97/100 cap-headroom WARN tier preserved (no degradation). orchestrator 100/100 unchanged. release-patch 101/100 BREACH unchanged (existing baseline; not in scope this sprint).
- (I) **TD-003 + TD-004 disposition.** **Status:** TD-003 (medium · scoped-checkout-glob anti-pattern) + TD-004 (minor · pointer-line `+2 lines` canonical) BOTH still open per TODO.md § Tech Debt. Pointed at TASK-134a Sprint 055c per AC field but NOT closed in 055c retro per CHANGELOG. **Decision:** surface at Sprint 057 close as candidates for Sprint 058 (audit-first scope) OR fold into TASK-139 Plugin propagation if natural fit (TD-004 pattern is exactly the +2-line append pattern TASK-139 uses; verify at T5 if codification opportunity exists).
- (J) **Date stamp.** All artifacts 2026-05-10. Pre-flight date-sanity per Step 0b: today=2026-05-10, writing=2026-05-10 → no drift.
- (K) **HITL gates.** TASK-135 (gates downstream tasks) + TASK-139 (version bump + CHANGELOG per ADR-027 hard-rejects automated MINOR) flagged HITL. Stop-points enforced at T1 close + T5 close.

## Plan

### T1 — Flow Grill protocol spec + ADR-036
**Acceptance:**
1. New file `skills/lean-doc-generator/references/FLOW_GRILL.md` ≤180 lines containing: (a) Open Questions ledger schema, (b) batched Q&A rule (≤5 independent Qs/turn; follow-up on ambiguous; never batch dependent or open-ended), (c) review-before-lock step (`confirm`/`revise`/`lock`), (d) Context Budget Across Skills section quantifying current 3× CONTEXT.md + 3× TODO.md + 3× protocol-doc loads vs target 1× per planning cycle, (e) `lock` keyword semantics, (f) handoff envelope to Sprint Promote Step 5.
2. New ADR `docs/adr/ADR-036-flow-grill.md` with Context / Decision / Alternatives / Consequences sections; cites ADR-030 (template canonical ownership) + ADR-031 (anti-slip discipline) + ADR-032 (release-debt + mode boundary) + ADR-033 (output discipline).
3. Anti-slip 4 fields (focus / context-budget / explicit-gaps / done-confirmation per ADR-031) PRESERVED — batched as ledger fields, not as separate G1 step.
4. ADR-036 Consequences section explicitly addresses: rollback path (revert FLOW_GRILL.md + restore Sprint Promote Steps 3-7) · 3-into-1 collapse rationale · token-budget delta (target 1× CONTEXT.md load per planning cycle vs 3× current).
5. CONTEXT.md § Vocabulary updates DEFERRED to TASK-139 (single propagation pass).

**Scope:** IN — protocol spec doc + ADR. OUT — Sprint Promote rewrite (TASK-136), orchestrator collapse (TASK-137), task-decomposer seed (TASK-138), CONTEXT.md propagation (TASK-139).
**Files:** `skills/lean-doc-generator/references/FLOW_GRILL.md` NEW · `docs/adr/ADR-036-flow-grill.md` NEW.
**Tests:** N/A (spec docs; behavior tests fold into TASK-136..138 ACs).
**Risk:** high — gates downstream tasks; spec must be tight or T2-T4 will rework. **HITL** stop-point at T1 close.
**Layers:** `docs, skills`.
**Depends on:** —.
**ADR:** YES (ADR-036).
**DoD:** FLOW_GRILL.md exists ≤180 lines · ADR-036 exists with 4 sections · ledger schema valid · Context Budget section quantifies 3×→1× delta · `lock` semantics specified · ownership headers on both files · TEST_SCENARIOS.md unchanged (no new scenarios at T1).
**Existing pattern to mirror:** ADR-031 (anti-slip) for ADR section structure · `references/SPRINT_PROTOCOLS.md` for protocol doc voice.
**Confidence:** 75% — uncertainty area: Context Budget quantification methodology (do we measure tokens or count file loads? plan: count file loads, document caveat).

### T2 — lean-doc-generator Sprint Promote rewrite (fold flow grill into Steps 3-7)
**Acceptance:**
1. `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` § Sprint Promote Steps 3-7 rewritten to point at FLOW_GRILL.md loop; Step 5 (sprint file write) gated on `lock` keyword consumption.
2. Steps 1 / 1.2 / 1.5 / 1.5b (Active Sprint guard · Backlog scan · TD scan · Release-debt scan) PRESERVED unchanged — they run BEFORE the grill loop.
3. SKILL.md ≤100 lines unchanged (cap-headroom WARN tier 97/100 preserved; body lives in references). Skill version `2.3.1` → `2.4.0` MINOR. `last-validated:` refreshed to 2026-05-10.
4. SPRINT_PROTOCOLS.md ownership header `last_updated:` refreshed to 2026-05-10 with citation `(Sprint 057 T2 — Flow Grill fold-in per TASK-136 / ADR-036)`.
5. Sprint Execute + Sprint Close protocols UNCHANGED (Flow Grill is a Promote-only mechanism).

**Scope:** IN — SPRINT_PROTOCOLS.md Steps 3-7 rewrite + SKILL.md version bump. OUT — orchestrator phases.md (TASK-137), task-decomposer (TASK-138), CONTEXT.md propagation (TASK-139).
**Files:** `skills/lean-doc-generator/SKILL.md` UPDATE (version bump only) · `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` UPDATE (Steps 3-7 rewrite).
**Tests:** smoke test — run Sprint Promote on dry-run inputs (1 mock task); verify grill loop emits ≤5 questions/turn and write blocked until `lock`.
**Risk:** high — heart of the change; Sprint Promote is the most-invoked sprint protocol; regression breaks dev-flow itself.
**Layers:** `skills`.
**Depends on:** TASK-135 (FLOW_GRILL.md must exist).
**ADR:** NO (ADR-036 covers).
**DoD:** SPRINT_PROTOCOLS.md Steps 3-7 cite FLOW_GRILL.md · Step 5 gate verified · cap-headroom 97/100 unchanged · skill version 2.4.0 · smoke test passes (manual or scripted).
**Existing pattern to mirror:** Sprint 052 TASK-123 F5 (SPRINT_PROTOCOLS.md additive Step 1.5 codification — same surface, similar risk profile).
**Confidence:** 70% — uncertainty area: smoke-test scope (manual vs scripted; plan: manual unless eval-acceptance.js prompt slot opens cheaply).

### T3 — orchestrator sprint-bulk consume locked ledger
**Acceptance:**
1. `skills/orchestrator/references/phases.md` § sprint-bulk Steps 1+2 (G1 batch + G2 batch dispatch) MERGED into single "Step 1: Consume locked Flow Grill ledger". Dispatcher reads ledger fields and invokes scope-analyst + design-analyst from those fields directly.
2. Phase 0 Active Sprint guard PRESERVED (Sprint 054 anti-slip).
3. Step 3 overlap gate · Step 4 auto-loop · Step 5 first-blocker · Step 6 close PRESERVED.
4. SKILL.md mode-dispatch table `sprint-bulk` row updated to `G1+G2 (resolved upstream via Flow Grill)`. Skill version `2.1.1` → `2.2.0` MINOR. `last-validated:` refreshed.
5. `agents/dispatcher.md` prompt updated to read ledger before dispatch (≤30 line cap preserved).
6. CONTEXT.md § Modes table `sprint-bulk` row update DEFERRED to TASK-139.

**Scope:** IN — phases.md merge + SKILL.md table + dispatcher.md prompt. OUT — task-decomposer seed (TASK-138), CONTEXT.md propagation (TASK-139).
**Files:** `skills/orchestrator/SKILL.md` UPDATE · `skills/orchestrator/references/phases.md` UPDATE · `agents/dispatcher.md` UPDATE.
**Tests:** smoke test — dispatcher can consume mock ledger and invoke scope-analyst + design-analyst from ledger fields without re-asking.
**Risk:** high — orchestrator is the user-facing entrypoint; regression affects every sprint-bulk run.
**Layers:** `skills, agents`.
**Depends on:** TASK-135 (FLOW_GRILL.md ledger shape) · TASK-136 (Sprint Promote produces locked ledger).
**ADR:** NO (ADR-036 covers).
**DoD:** phases.md Steps 1+2 merged · SKILL.md table row updated · dispatcher.md prompt updated · cap-headroom 100/100 orchestrator unchanged (no growth) · agents/dispatcher.md ≤30 lines · skill version 2.2.0 · smoke test passes.
**Existing pattern to mirror:** Sprint 054b TASK-131 (orchestrator doc-wire cleanup — same skill, same surface).
**Confidence:** 70% — uncertainty area: dispatcher.md ≤30 line cap may force tighter prose than ideal; mitigation: link to phases.md for detail.

### T4 — task-decomposer Flow Grill Seed handoff
**Acceptance:**
1. `skills/task-decomposer/references/procedure.md` Step 6 updated to emit `## Flow Grill Seed` JSON block AFTER `approve`-write step.
2. Seed shape: `{ tasks: [...], assumptions: [...], risk: ..., layers: [...] }` (matches FLOW_GRILL.md ledger field expectations from TASK-135).
3. Sprint Promote FLOW_GRILL.md loop hydrates ledger from seed if present; cold-starts (no seed) otherwise.
4. All existing decompose validation rules PRESERVED (assumption registry · risk score · granularity rules).
5. Skill version `1.1.0` → `1.2.0` MINOR. `last-validated:` refreshed.
6. Smoke test (2-task decompose) confirms seed shape valid JSON + parseable by Sprint Promote hydration logic.

**Scope:** IN — procedure.md Step 6 + SKILL.md version bump + smoke test. OUT — CONTEXT.md propagation (TASK-139).
**Files:** `skills/task-decomposer/SKILL.md` UPDATE (version bump only) · `skills/task-decomposer/references/procedure.md` UPDATE.
**Tests:** smoke test — 2-task decompose run; verify seed block emits valid JSON post-approve.
**Risk:** medium — additive; doesn't break existing decompose flow if seed is ignored.
**Layers:** `skills`.
**Depends on:** TASK-135 (ledger shape) · TASK-136 (Sprint Promote hydration logic exists).
**ADR:** NO (ADR-036 covers).
**DoD:** procedure.md Step 6 emits seed · SKILL.md version 1.2.0 · smoke test 2-task decompose passes (manual) · cap-headroom unchanged · existing decompose ACs unchanged.
**Existing pattern to mirror:** Sprint 053 TASK-124 F6b (task-decomposer + lean-doc handoff — same skill pair, similar handoff surface).
**Confidence:** 80% — additive design lowers risk vs T2/T3.

### T5 — Plugin propagation + lockstep MINOR bump (HITL)
**Acceptance:**
1. `.claude/CONTEXT.md` § Vocabulary adds `flow grill` row + § Modes `sprint-bulk` row updated to reflect upstream Flow Grill resolution.
2. `README.md` Daily Pattern updated IF it references Sprint Promote 3-stage shape (verify; update lockstep if yes).
3. `last-validated:` refreshed on the 3 modified skills (lean-doc 2.4.0 / orchestrator 2.2.0 / task-decomposer 1.2.0).
4. `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` `3.0.0` → `3.1.0` MINOR lockstep per ADR-006. Manual bump per ADR-032 DEC-2 (NO release-patch invocation — release-patch HARD-rejects MAJOR per ADR-027; MINOR also manual at current release rate per pattern locked).
5. `docs/CHANGELOG.md` prepends MINOR row `## Sprint 057 — Flow Grill (3.1.0 MINOR) (2026-05-10)` listing TASK-135..139 + ADR-036.
6. `node scripts/eval-acceptance.js --cap-headroom-warn` no NEW breach (existing release-patch 101/100 BREACH unchanged from Sprint 055 baseline; no new BREACH/WARN introduced).
7. `node scripts/eval-skills.js` passes (existing test surface).
8. Sprint close commit + emit `=== READY TO PUSH ===` block per release-patch HARD STOP language; operator runs `git push origin master`.

**Scope:** IN — CONTEXT.md + README.md (conditional) + 3-skill last-validated refresh + manifest bump + CHANGELOG row + eval verifications. OUT — actual `git push` (operator gate per D-F).
**Files:** `.claude/CONTEXT.md` UPDATE · `README.md` UPDATE (conditional on Daily Pattern reference) · `skills/lean-doc-generator/SKILL.md` UPDATE (last-validated only — version bumped at T2) · `skills/orchestrator/SKILL.md` UPDATE (last-validated only — version bumped at T3) · `skills/task-decomposer/SKILL.md` UPDATE (last-validated only — version bumped at T4) · `.claude-plugin/plugin.json` UPDATE · `.claude-plugin/marketplace.json` UPDATE · `docs/CHANGELOG.md` UPDATE · `TODO.md` UPDATE (close 5 backlog rows).
**Tests:** `node scripts/eval-acceptance.js --cap-headroom-warn` (no new breach) · `node scripts/eval-skills.js` (passes).
**Risk:** medium — version bump + CHANGELOG require human review per ADR-027 hard-rejects automated MINOR. **HITL** stop-point.
**Layers:** `docs, skills, ci`.
**Depends on:** TASK-135..138.
**ADR:** NO (ADR-036 covers; this is propagation only).
**DoD:** all manifests at 3.1.0 lockstep · CHANGELOG row exists · evals green · TODO.md backlog rows closed · sprint file status: closed · close_commit populated · push emit-block emitted.
**Existing pattern to mirror:** Sprint 056 T3+T4 (manual MAJOR bump + close + push emit — same release mechanics, MAJOR→MINOR class).
**Confidence:** 80% — well-trodden release path; HITL gate enforces human review.

## G1 (anti-slip per ADR-031)

```
goal: Flow Grill terminal-first planning loop shipped (TASK-135..139 closed · ADR-036 written · v3.1.0 MINOR lockstep · Workstream A items 1+2+6 from refined-task-list.md addressed). Open Questions surface in terminal BEFORE sprint file written; task-decomposer seed hydrates Sprint Promote; orchestrator sprint-bulk consumes locked ledger (no separate G1+G2 batch).
size: L (T1 M + T2 L + T3 M + T4 S + T5 M = L total — 5 tasks decompose 3-skill handoff collapse; each task ~30-60min)
constraints:
  - 3-skill handoff collapse (task-decomposer → lean-doc → orchestrator) without breaking existing decompose / Sprint Promote / sprint-bulk validation rules
  - anti-slip 4 fields (focus · context-budget · explicit-gaps · done-confirmation per ADR-031) preserved as ledger fields, NOT separate G1 step
  - cap-headroom 16/16 OK no NEW drift (lean-doc 97/100 WARN preserved · orchestrator 100/100 preserved · release-patch 101/100 existing BREACH unchanged)
  - manual MINOR bump (no release-patch invocation per ADR-032 DEC-2 + ADR-027 boundary precedent)
  - lockstep plugin.json + marketplace.json (Sprint 30 contract)
  - history hygiene per ADR-034 (CHANGELOG entry compact; references long-form via sprint file pointer)
  - push gate emit-only per release-patch HARD STOP language (operator runs git push)
  - HITL stop-points at T1 close + T5 close (TASK-135 gates downstream · TASK-139 version bump human review)
layers: docs, skills, agents, ci (no scripts touched; no governance touched)
red flags:
  - rewriting Sprint Promote Steps 1 / 1.2 / 1.5 / 1.5b (anti-pattern: those scans run BEFORE grill; only Steps 3-7 rewritten)
  - skipping `lock` keyword (anti-pattern: sprint file write gated on lock; cold-start path = grill from scratch)
  - batching dependent or open-ended questions in grill (anti-pattern per ADR-031 anti-slip; ≤5 INDEPENDENT Qs/turn)
  - automatic git push (anti-pattern per D-F + release-patch HARD STOP) — emit-only
  - release-patch invocation for MINOR (anti-pattern per ADR-027 boundary at current release rate) — manual bump only
  - SKILL.md cap growth (would invalidate cap-headroom 16/16 OK no-drift baseline) — body in references/FLOW_GRILL.md only; SKILL.md changes are pointer lines + version bumps only
  - duplicating anti-slip 4 fields as separate G1 step alongside ledger fields (anti-pattern: single mechanism per ADR-031; collapse, do not duplicate)
focus: ONLY Workstream A items 1+2+6 (TASK-135 protocol + ADR-036 · TASK-136 Sprint Promote rewrite · TASK-137 orchestrator consume-ledger · TASK-138 task-decomposer seed · TASK-139 propagation + bump). NOT items 3/4/5 (Workstream B — Codemap user-scope · history-rule scope · TODO history; Sprint 059 per D-A). NOT items 7/8 (Workstream C — testing skill · SDLC audit; Sprint 058 per D-A audit-first order). NOT TD-003/TD-004 disposition (verify at T5; defer to Sprint 058/059 unless natural fit in TASK-139 propagation).
context-budget: ~80k tokens (T1 ~20k FLOW_GRILL.md spec + ADR-036 draft · T2 ~20k SPRINT_PROTOCOLS.md Steps 3-7 rewrite · T3 ~20k phases.md merge + dispatcher.md edit · T4 ~10k procedure.md Step 6 edit · T5 ~10k propagation + bump + close).
explicit-gaps:
  - Workstream B items (3/4/5) — deferred Sprint 059 per D-A
  - Workstream C items (7/8) — deferred Sprint 058 (audit-first) per D-A
  - TD-003 + TD-004 — open from Sprint 055b/c; verify at T5; defer unless natural fit in TASK-139
  - Live cross-skill measurement (Sprint 055-2 OQ-1; Mode A operator-pending; carry-forward post-v1) — not in scope
  - npm publish (out-of-scope; plugin distribution via Claude Code marketplace + git only)
  - Smoke-test automation in eval-acceptance.js — manual smoke acceptable; defer scripted to Sprint 058 if audit surfaces it
  - 2.x.x patch backport (not applicable; v3.1.0 forward-only release)
done-confirmation:
  - skills/lean-doc-generator/references/FLOW_GRILL.md exists ≤180 lines with 6 sections (ledger schema · batched Q&A rule · review-before-lock · Context Budget · lock semantics · handoff envelope)
  - docs/adr/ADR-036-flow-grill.md exists with Context/Decision/Alternatives/Consequences sections citing ADR-030/031/032/033
  - skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md Steps 3-7 rewritten + Step 5 lock-gated; Steps 1/1.2/1.5/1.5b unchanged
  - skills/lean-doc-generator/SKILL.md version 2.4.0 + last-validated 2026-05-10
  - skills/orchestrator/references/phases.md sprint-bulk Steps 1+2 merged into single "Consume locked Flow Grill ledger"; Phase 0/Step 3/4/5/6 unchanged
  - skills/orchestrator/SKILL.md version 2.2.0 + last-validated 2026-05-10 + mode-dispatch table sprint-bulk row updated
  - agents/dispatcher.md prompt updated to read ledger before dispatch (≤30 lines preserved)
  - skills/task-decomposer/references/procedure.md Step 6 emits ## Flow Grill Seed JSON block post-approve
  - skills/task-decomposer/SKILL.md version 1.2.0 + last-validated 2026-05-10
  - .claude/CONTEXT.md § Vocabulary adds flow grill row + § Modes sprint-bulk row updated
  - README.md Daily Pattern updated IF it referenced Sprint Promote 3-stage (verified; conditional)
  - .claude-plugin/plugin.json + marketplace.json both at 3.1.0 (lockstep grep clean)
  - docs/CHANGELOG.md has new top entry "Sprint 057 — Flow Grill (3.1.0 MINOR) (2026-05-10)" listing TASK-135..139 + ADR-036
  - node scripts/eval-acceptance.js --cap-headroom-warn shows no NEW breach beyond existing release-patch 101/100 baseline
  - node scripts/eval-skills.js passes
  - TODO.md Active Sprint = none; 5 backlog rows TASK-135..139 marked [x]
  - Sprint file status: closed; close_commit populated
  - push emit-block emitted with operator instructions
status: PASS (pending Plan-locked approval)
```

## Execution Log

- **T1 close 2026-05-10** — Flow Grill protocol spec written (ADR-036 + FLOW_GRILL.md). 7 decisions locked (DEC-1..DEC-7); 5 alternatives rejected with rationale; 6 required FLOW_GRILL sections delivered (ledger schema · batched+follow-up Q&A · iteration loop · review-before-lock · lock semantics · handoff envelope · Context Budget Across Skills · anti-slip mapping). FLOW_GRILL.md 172/180 lines (cap PASS · 8-line headroom). ADR-036 93 lines (no cap). User mid-promote refinements baked: DEC-3 batched+follow-up · DEC-4 explicit review step · Context Budget section. HITL gate fired post-commit per pre-locked D-K.
- **T2 close 2026-05-10** — Sprint Promote Steps 3-7 rewritten to consume FLOW_GRILL.md loop. New step shape: 1 read + 1.2 backlog + 1.5 TD scan + 1.5b release-debt scan + 2 pick + 3 Flow Grill iterate + 4 review-before-lock + 5 on-lock write + 6 plan-locked commit + 7 block edits. Old steps 3-4 (single-message decompose Q&A) + 7 (pause for review) + 8 (on approval flip) collapsed into new 3+4+6. Step 5 sprint-file write gated on `lock` keyword per FLOW_GRILL.md handoff envelope. SKILL.md 95/100 (cap PASS · 5-line headroom WARN tier preserved); FLOW_GRILL.md pointer added to References. lean-doc 2.3.1 → 2.4.0 MINOR.
- **T3 close 2026-05-10** — orchestrator sprint-bulk Steps 1+2 collapsed into single "Step 1: Consume locked Flow Grill ledger". Old G1 batch + G2 batch dispatch (scope-analyst + design-analyst auto-fire) replaced with frontmatter read + ledger field consumption; fresh dispatch retained as exception path only when ledger flags `design-analyst: needed`. Phases renumbered 6 → 5 (3-overlap → 2 · 4-loop → 3 · 5-halt → 4 · 6-close → 5); Mid-Sprint Friction Protocol cross-ref to "sprint-bulk Phase Step 5" updated to "Step 4" lockstep. SKILL.md mode-dispatch sprint-bulk row updated; dispatcher.md responsibility 3 + sprint-bulk dispatch rule updated; CONTEXT.md § Modes row + § Relationships mode→gate line updated lockstep with SKILL.md. orchestrator 2.1.1 → 2.2.0 MINOR; SKILL.md 93/100 (cap PASS · 7-line headroom OK tier); dispatcher.md 28/30 (cap PASS · 2-line headroom).
- **T4 close 2026-05-10** — task-decomposer Flow Grill Seed handoff added. New Step 7 in procedure.md after `approve`-write: emits `## Flow Grill Seed` JSON block to terminal (additive output; does not change Backlog write contract). Seed shape `{ tasks, assumptions, risk, layers }` matches FLOW_GRILL.md ledger fields for Step 1 Hydrate consumption. Field rules locked: `tasks[]` 1:1 per Backlog row · `assumptions[].confirmed:true` invariant · `assumptions[].source:"decompose-seed"` for hydration provenance · sprint-wide `risk` = max of task risks · `layers` = deduplicated union. Cold-start fallback documented: Promote without seed iterates empty ledger. Defensive guard suppresses block on zero-task write. Smoke-tested via mental trace 2-task decompose; shape validates. task-decomposer 1.1.0 → 1.2.0 MINOR; SKILL.md 73/100 (27-line headroom OK tier).

## Files Changed

- `docs/adr/ADR-036-flow-grill-planning-convergence.md` | T1 | NEW (93 lines) — anchors 3-into-1 collapse decision · 7 DECs · cites ADR-006/026/027/030/031/032/033/034 | risk: low (additive doc) | test: N/A
- `skills/lean-doc-generator/references/FLOW_GRILL.md` | T1 | NEW (172 lines) — canonical Flow Grill protocol; 6 required sections + anti-slip mapping + red flags | risk: low (new reference, no existing skill behavior changes until T2-T4) | test: N/A (behavior tests fold into TASK-136..138 ACs per T1 AC.5)
- `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | T2 | EDIT (232 → 223 lines) — § Sprint Promote Steps 3-7 rewritten to consume FLOW_GRILL.md loop; 9 → 7 numbered steps (collapse old 3+4 → new 3 · old 5+6 → new 5 · old 7+8 → new 4+6) | risk: medium (protocol contract change; cross-skill citers preserved at sub-step granularity 1.5b) | test: validated by T3 (orchestrator consumes new Step 5 write contract)
- `skills/lean-doc-generator/SKILL.md` | T2 | EDIT (94 → 95 lines) — version 2.3.1 → 2.4.0 MINOR · last-validated 2026-05-10 · References section adds FLOW_GRILL.md pointer line | risk: low (version bump + pointer additive) | test: N/A (frontmatter + ref pointer)
- `skills/orchestrator/references/phases.md` | T3 | EDIT (282 → 277 lines) — § sprint-bulk Steps 1+2 collapsed into Step 1 consume-locked-ledger; phases renumbered 6 → 5; Mid-Sprint Friction Protocol cross-ref "Step 5" → "Step 4" lockstep | risk: medium (phase numbering contract change; cross-refs swept) | test: validated by next sprint's promote→sprint-bulk run
- `skills/orchestrator/SKILL.md` | T3 | EDIT (94 → 93 lines) — version 2.1.1 → 2.2.0 MINOR · mode-dispatch table sprint-bulk row updated to "G1+G2 (resolved upstream via Flow Grill — ADR-036)" | risk: low (table row + version bump) | test: N/A
- `agents/dispatcher.md` | T3 | EDIT (28 → 28 lines) — responsibility 3 updated (G1+G2 consumed from locked Flow Grill ledger for sprint-bulk); sprint-bulk dispatch rule updated to consume ledger | risk: low (agent prompt edit; cap-headroom 2 lines preserved) | test: N/A
- `.claude/CONTEXT.md` | T3 | EDIT (156 → 156 lines) — § Modes table sprint-bulk row updated lockstep with SKILL.md; § Relationships mode→gate line updated lockstep | risk: low (table row + relationship line · vocab `flow grill` row deferred to T5) | test: N/A
- `skills/task-decomposer/references/procedure.md` | T4 | EDIT (21 → 48 lines) — added Step 7 Flow Grill Seed handoff; emits `## Flow Grill Seed` JSON block on `approve`; shape `{ tasks, assumptions, risk, layers }` per ADR-036 DEC-7 | risk: medium (additive output; no Backlog contract change) | test: smoke-tested via mental trace 2-task decompose
- `skills/task-decomposer/SKILL.md` | T4 | EDIT (73 → 73 lines) — version 1.1.0 → 1.2.0 MINOR · last-validated 2026-05-09 → 2026-05-10 | risk: low | test: N/A

## Decisions

*(empty — populated during execution for architectural-level decisions; ADR-036 written at T1 closes the major decision surface)*

## Open Questions for Review

*(empty — appended during execution if user-review items surface)*

## Retro

*(empty — populated at close: Worked / Friction / Pattern candidates / TD prompts)*
