---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: active
plan_commit: tbd
close_commit: tbd
---

# Sprint 053b — Feature-Usage Audit Sweep (TASK-125)

**Theme:** Broader audit covering the gap from Sprint 053 F6's narrow scope (TASK-124 audited ONE pair: task-decomposer ↔ lean-doc-generator). TASK-125 sweeps ALL remaining skill/agent pairs for collaboration patterns + naming consistency + dispatch wiring + blueprint primer propagation. Five pairs in scope: `prime` ↔ `/orchestrator init` · `release-manager` ↔ `release-patch` · `pr-reviewer` skill ↔ `code-reviewer` agent · `security-auditor` skill ↔ `security-analyst` agent · `architecture-grill` skill ↔ `design-analyst` agent. T2 release-manager↔release-patch is DOCUMENT-ONLY this sprint — actual fixes deferred to Sprint 052b release-debt resolution sprint. T7 propagates skill/agent findings into `docs/blueprint/` primers (04 + 05 + 08) post-T6.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 054b closed `65e74c5` (TASK-131 orchestrator doc-wire cleanup).
**Closes:** TASK-125 (Broader feature-usage audit sweep).

---

## Why this sprint exists

User finding 2026-05-08: "audit all feature usage" was broader than F6 alone. Sprint 053 (F6 / TASK-124) audited the task-decomposer ↔ lean-doc-generator pair only — locked ADR-030 template canonical ownership + Step 1.2 backflow + lean-doc Step 6 + procedure.md Step 6 template-read. But four other skill/agent pairs and one skill/skill pair (`release-manager` ↔ `release-patch`) remained unaudited. Sprint 052 F4 wired 6 ORPHAN skills into orchestrator skill-dispatch (TASK-123), but did NOT verify collaboration COHERENCE between PAIRED surfaces.

**What "audit" means here:** for each pair, verify (a) collaboration pattern documented (who fires, when, what handoff state); (b) naming consistency (skill name ↔ agent name ↔ slash command ↔ dispatch table reference); (c) dispatch wiring (skill-dispatch.md row matches actual SKILL.md trigger + agent.md preloads); (d) doc citations bidirectional where coordination loops exist.

**Why DOCUMENT-ONLY for T2:** release-manager + release-patch sit at the center of release-debt 7-sprint chain (Sprint 049 MINOR + 050/051a/051b/052/053/054 PATCH chain accumulating). Touching them now risks compound-changing release-debt resolution scope. TASK-125 surfaces drift; Sprint 052b release-debt resolution APPLIES fixes alongside MINOR+PATCH reconcile.

**Locked decisions (G1 Scope Batch):**
- No new ADR this sprint — TASK-125 is sweep + report + targeted wire-fix (≤1-line edits per pair). Hard-to-reverse decisions surface at synthesis (T6) → escalate to 052b or future ADR if needed.
- T2 DOCUMENT-ONLY scope locked at promote — actual release-manager ↔ release-patch fixes deferred to Sprint 052b release-debt sprint.
- Behavioral enforcement only this sprint; no new acceptance harness work (TASK-116-v2 Sprint 055).

---

## Open Questions (locked at promote)

- (A) **Audit output format.** **Decision:** per-pair findings table with columns `pair · finding (1-line) · severity (high/med/low) · disposition (fix-now-T6 / defer-052b / defer-116v2 / no-action)`. Synthesis at T6 consolidates + applies wire-fixes. Aggregate findings table appended to sprint file Files Changed adjacent.
- (B) **Severity threshold for fix-now vs defer.** **Decision:** `high` = blocks user invocation flow (e.g., dispatch table refers to non-existent skill OR coordination loop one-sided causing user-visible failure); `med` = naming inconsistency surfacing in user-facing output OR stale citation; `low` = internal drift not visible to users. T6 fixes high + med where ≤1-line change; defers structural to follow-up sprints.
- (C) **T2 DOCUMENT-ONLY scope.** **Decision:** audit + record findings only. Zero edits to release-manager/SKILL.md OR release-patch/SKILL.md. Findings table notes `disposition: defer-052b`. Sprint 052b promote will read T2 findings as input.
- (D) **Naming consistency canonical.** **Decision:** skill = SKILL.md `name:` frontmatter field; agent = filename `agents/<slug>.md`; slash command = `/<skill-or-agent-slug>`; dispatch reference = backtick-quoted slug in skill-dispatch.md. T6 verifies all 4 align per pair.
- (E) **Coordination loop expectation.** **Decision:** any pair where skill A defers/dispatches to skill/agent B at boundary X must redirect from B back to A at inverse boundary (Sprint 053 T2 + Sprint 054 T1 pattern). Per-pair audit checks both directions.
- (F) **Cap discipline.** orchestrator SKILL.md 97/100 (Sprint 054b close). T6 wire-fixes likely touch skill-dispatch.md (separate file, no cap pressure) + targeted SKILL.md/agent.md edits. Each fix in-place single-line per Sprint 054b validated pattern.
- (G) **release-debt continues.** Sprint 049 MINOR + 050/051a/051b/052/053/054 PATCH chain. Sprint 052b owed. Sprint 053b adds zero PATCH/MINOR (doc-only audit).
- (H) **Date stamp.** All artifacts 2026-05-09.

---

## Plan

### T1 — `prime` ↔ `/orchestrator init` audit
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: prime SKILL.md handoff state to orchestrator init explicit; orchestrator init Phase reads prime output expectations; no orphan dispatch row)*
**Acceptance:**
- (a) Read `skills/prime/SKILL.md` + `skills/orchestrator/SKILL.md` § Phases § init + `skills/orchestrator/references/phases.md` § init Phase + `skills/orchestrator/references/skill-dispatch.md` Always-On row 1 (`prime`).
- (b) Verify: prime declares output contract (what files read · what NEXT line emitted · cache markers). orchestrator init Phase reads prime output OR explicitly states fresh-init alternative. Dispatch row 1 invocation = "user-invoked OR session-start hook; never orchestrator-triggered" — verify.
- (c) Findings recorded in synthesis table T6 with severity + disposition.
- (d) Sprint file § Files Changed row recorded if edits applied at T6.
**Source:** TASK-125 user finding 2026-05-08.
**Depends on:** none.

### T2 — `release-manager` ↔ `release-patch` audit (DOCUMENT-ONLY; defer fixes to 052b)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: zero edits to release-manager/SKILL.md OR release-patch/SKILL.md; findings recorded for Sprint 052b input)*
**Acceptance:**
- (a) Read `skills/release-manager/SKILL.md` + `skills/release-patch/SKILL.md` + `skills/orchestrator/references/skill-dispatch.md` Always-On rows 9 (`release-manager`).
- (b) Verify: release-manager fires for MINOR/MAJOR; release-patch auto-detects PATCH path. Boundary explicit. Coordination loop documented in BOTH SKILL.md files OR cross-cited. Dispatch row 9 trigger language matches SKILL.md trigger phrases.
- (c) **DOCUMENT-ONLY:** record findings for Sprint 052b input. NO edits this sprint.
- (d) Findings recorded in synthesis table T6 with `disposition: defer-052b` regardless of severity.
- (e) Cross-link added to Sprint 052b promote-time scope (TODO.md Backlog row OR sprint plan when promoted).
**Source:** TASK-125 user finding 2026-05-08 + release-debt 7-sprint chain context.
**Depends on:** none.

### T3 — `pr-reviewer` skill ↔ `code-reviewer` agent audit
**Scope:** small · **Layers:** skills, agents, docs · **Risk:** low · **HITL** *(reviewer verifies: code-reviewer agent.md preloads pr-reviewer skill; pr-reviewer SKILL.md describes skill role under code-reviewer agent; dispatch row 5 wires correctly)*
**Acceptance:**
- (a) Read `skills/pr-reviewer/SKILL.md` + `agents/code-reviewer.md` + `skills/orchestrator/references/skill-dispatch.md` Always-On row 5 (Post-implement).
- (b) Verify: code-reviewer agent.md states it preloads pr-reviewer skill; pr-reviewer SKILL.md states it is preloaded by code-reviewer agent. Naming consistency: agent slug `code-reviewer` vs skill slug `pr-reviewer` is INTENTIONAL split (agent = orchestration; skill = systematic 7-lens process). Dispatch row 5 reflects.
- (c) Findings recorded in synthesis table T6 with severity + disposition.
- (d) Sprint file § Files Changed row recorded if edits applied at T6.
**Source:** TASK-125 user finding 2026-05-08.
**Depends on:** none.

### T4 — `security-auditor` skill ↔ `security-analyst` agent audit
**Scope:** small · **Layers:** skills, agents, docs · **Risk:** low · **HITL** *(reviewer verifies: security-analyst agent.md preloads security-auditor skill; pattern mirrors code-reviewer↔pr-reviewer; ADR-015 separate-context constraint cited)*
**Acceptance:**
- (a) Read `skills/security-auditor/SKILL.md` + `agents/security-analyst.md` + `skills/orchestrator/references/skill-dispatch.md` Always-On row 10 (Separate `/security-review` session).
- (b) Verify: security-analyst agent.md states it preloads security-auditor skill in separate `/security-review` session; ADR-015 separate-context constraint cited; security-auditor SKILL.md states skill is preloaded by security-analyst agent. Pattern mirrors code-reviewer↔pr-reviewer.
- (c) Findings recorded in synthesis table T6 with severity + disposition.
- (d) Sprint file § Files Changed row recorded if edits applied at T6.
**Source:** TASK-125 user finding 2026-05-08.
**Depends on:** none.

### T5 — `architecture-grill` skill ↔ `design-analyst` agent audit
**Scope:** small · **Layers:** skills, agents, docs · **Risk:** low · **HITL** *(reviewer verifies: design-analyst agent.md preloads architecture-grill skill at G2; G2 design coordination loop documented; Sprint 049 rename `system-design-reviewer`→`architecture-grill` propagated everywhere)*
**Acceptance:**
- (a) Read `skills/architecture-grill/SKILL.md` (verify name post-Sprint-049 rename) + `agents/design-analyst.md` + `skills/orchestrator/references/skill-dispatch.md` (search for architecture-grill OR design-analyst references) + `skills/orchestrator/references/phases.md` § G2 Design.
- (b) Verify: design-analyst agent.md states it preloads architecture-grill skill at G2; architecture-grill SKILL.md states skill is preloaded by design-analyst agent at G2; Sprint 049 rename propagated (no stale `system-design-reviewer` references in active surfaces).
- (c) Findings recorded in synthesis table T6 with severity + disposition.
- (d) Sprint file § Files Changed row recorded if edits applied at T6.
**Source:** TASK-125 user finding 2026-05-08 + Sprint 049 rename context.
**Depends on:** none.

### T6 — Synthesis + skill/agent wire-fix application
**Scope:** medium · **Layers:** skills, agents, docs · **Risk:** medium · **HITL** *(reviewer verifies: synthesis table covers all 5 pairs; high+med findings fixed where ≤1-line; defer-052b items cross-linked to Sprint 052b scope; Sprint Close protocol followed)*
**Acceptance:**
- (a) Aggregate T1-T5 findings into single synthesis table in this sprint file § Files Changed adjacent. Columns: `pair · finding · severity · disposition · file/line if fix-now-T6 · primer-drift (Y/N for T7)`.
- (b) For each high+med finding with `fix-now-T6` disposition where edit is ≤1-line single-line in-place (Sprint 054b validated pattern): apply fix to skill/agent canonical (SKILL.md / agent.md / skill-dispatch.md). Record in § Files Changed row.
- (c) For each `defer-052b` finding (T2 entire pair + any structural T1/T3/T4/T5 finding): write 1-line entry in TODO.md Backlog row for Sprint 052b OR direct-append to Sprint 052b promote scope when that sprint is promoted.
- (d) For each `defer-116v2` finding (typically: needs automated lint to verify ongoing): append to TASK-116-v2 carry-forward list.
- (e) Cross-check: orchestrator SKILL.md cap held 97/100 (no new lines if SKILL.md edits avoided OR ≤97 if edits required). skill-dispatch.md edits OK (no cap).
- (f) Sprint file § Execution Log T6 entry covers a-e outcomes. T7 follows for primer propagation; Sprint Close per SPRINT_PROTOCOLS.md after T7.
- (g) Bump version: orchestrator stays 2.1.0 (no behavioral contract change); other skills bump PATCH if SKILL.md content edits applied (record in § Files Changed); else no version change.
**Source:** synthesis pattern from Sprint 053 T5 + Sprint 054 T4.
**Depends on:** T1+T2+T3+T4+T5 all complete.

### T7 — Blueprint primer alignment (post-T6 propagation)
**Scope:** small-medium · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: blueprint primers align with post-T6 skill/agent surface state; no stale Sprint-049 architecture-grill rename references; release-manager primer entries flagged for 052b reconcile; last_updated stamp bumped per primer touched)*
**Acceptance:**
- (a) Read `docs/blueprint/04-subagents.md` (last_updated 2026-04-20) + `docs/blueprint/05-skills.md` (last_updated 2026-04-25) + `docs/blueprint/08-orchestrator-prompts.md` (last_updated 2026-05-09). 04+05 lower-likelihood-current; 08 already refreshed Sprint 051b T5.5.
- (b) For each T6 synthesis row flagged `primer-drift: Y` apply ≤1-line wire-fix to relevant primer (single-line in-place per Sprint 054b validated pattern).
- (c) **Sprint 049 rename propagation check:** verify `architecture-grill` references in 04-subagents.md (lines ~64-69 Agent file map: init-analyst row preloads `system-design-reviewer` — verify intentional or stale) + 05-skills.md (lines 56 Flowchart-exempt + 130 Universal Skills + 169 Phase-to-Skill matrix) match Sprint 049 rename outcome. If stale: ≤1-line in-place fix.
- (d) **release-manager primer entries** in 05-skills.md (line 56 Flowchart-exempt + 130 Universal Skills + 184 Phase 9 Close) stay AS-IS per T2 DOCUMENT-ONLY discipline. If T2 surfaced primer-drift: append inline cross-link `(see Sprint 052b scope)` ≤1-line, no edit.
- (e) Sprint file § Files Changed rows recorded per primer file touched.
- (f) `last_updated:` frontmatter stamp bumped to 2026-05-09 for any primer touched (per lean-doc Step 0b date-sanity rule).
- (g) Cap discipline: blueprint primers have no per-file cap; ≤1-line edit per finding rule still holds.
**Source:** User finding 2026-05-09 — blueprint primers contain heavy detail mirroring 5 pairs; drift propagates from canonical skill/agent state.
**Depends on:** T6 complete (primer-drift flag set in synthesis table; only propagate AFTER canonical fixes applied).

---

## Dependency chain

```
T1 (prime ↔ init audit)                    independent
T2 (release-manager ↔ release-patch)       independent — DOCUMENT-ONLY
T3 (pr-reviewer ↔ code-reviewer)           independent
T4 (security-auditor ↔ security-analyst)   independent
T5 (architecture-grill ↔ design-analyst)   independent
T6 (synthesis + skill/agent wire-fix)      depends T1+T2+T3+T4+T5
T7 (blueprint primer propagation)          depends T6
```

T1-T5 parallel-safe (separate file pairs; no overlap). T6 serializes (synthesis + canonical edits). T7 serializes after T6 (primer-drift propagation only after canonical fixes locked).

Pairwise file overlap matrix (non-empty):
- (T1, T6) — orchestrator SKILL.md / phases.md / skill-dispatch.md potential T6 edits if T1 finding fix-now.
- (T3, T4, T5, T6) — skill-dispatch.md potential T6 edits if any finding fix-now.
- (T5, T7) — `architecture-grill` rename propagation may surface in 04-subagents.md / 05-skills.md primers.
- (T6, T7) — T6 synthesis output drives T7 primer-drift fix list.
- (T7, all) — primers `04-subagents.md` / `05-skills.md` / `08-orchestrator-prompts.md` potential T7 edits.
- (close, all) — sprint file § Files Changed + § Execution Log + § Retro at close.

T1-T5 (parallel-safe) + T6 (serialized) + T7 (serialized post-T6) = clear path.

---

## Cross-task risks

- **Synthesis table inflation.** 5 pairs × ~2-4 findings each = 10-20 rows. Risk: table becomes harder to read. Mitigation: high-only highlighted; med/low folded into single-line per pair if redundant.
- **T2 DOCUMENT-ONLY discipline.** Risk: AI sees release-manager/release-patch finding + auto-fixes "while we're here". ANTI-SLIP HARD STOP per ADR-031 focus field — T2 is audit + record only. Any fix attempt = scope-creep mid-sprint trigger.
- **fix-now-T6 ≤1-line discipline.** Sprint 054b validated in-place single-line edit pattern. Risk: AI expands fix to multi-line "while we're here". Mitigation: per-finding line-budget recorded in synthesis table column; >1-line = defer-052b automatically.
- **orchestrator SKILL.md cap pressure (97/100).** Margin: 3 lines. T6 fixes likely target skill-dispatch.md (separate file, no cap) but if SKILL.md fix needed → in-place single-line per Sprint 054b pattern.
- **release-debt depth +0 (doc-only sprint).** Sprint 053b adds zero PATCH/MINOR if no SKILL.md content edits applied at T6 (audit only). If T6 applies wire-fix to any SKILL.md → that skill bumps PATCH; release-debt depth +1 → 8 sprints.
- **Naming-consistency rabbit hole.** Risk: audit surfaces broader rename opportunities outside 5-pair scope. Mitigation: explicit-gaps locks scope to 5 pairs; broader rename = TASK-NEW (defer + record).
- **T7 primer-rewrite scope-creep.** Risk: T7 reads primers and AI sees opportunity to "refresh" beyond drift-driven fixes (architectural narrative reorg, blueprint version bump, etc.). Mitigation: T7 acceptance hard-locks ≤1-line in-place per drift finding from T6 synthesis; no narrative rewrites. Anti-slip per ADR-031 focus field.

---

## Sprint 053b OWN G1 (anti-slip per ADR-031)

```
goal: Sweep 5 skill/agent pairs for collaboration + naming + dispatch coherence; record findings; apply ≤1-line wire-fixes to skill/agent canonical (T6) + propagate drift to docs/blueprint/ primers (T7); defer structural to Sprint 052b OR TASK-116-v2.
size: M
constraints: T2 DOCUMENT-ONLY (zero edits to release-manager/release-patch SKILL.md) · orchestrator SKILL.md ≤97/100 cap · fix-now-T6 + T7 ≤1-line single-line in-place per Sprint 054b pattern · no new ADR this sprint · T7 NO narrative rewrites (drift-only fixes from T6 synthesis primer-drift flag).
layers: skills, agents, docs
red flags: T2 fix-creep · synthesis table inflation · fix-now multi-line expansion · naming-rename scope-creep beyond 5 pairs · T7 primer-rewrite scope-creep
focus: AUDIT 5 pairs + record findings + ≤1-line skill/agent wire-fixes (T6) + ≤1-line blueprint primer drift fixes (T7); NOT release-debt resolution (Sprint 052b); NOT new ADR; NOT acceptance harness work; NOT primer narrative rewrites.
context-budget: ~60k tokens (5 pairs × ~6-8k read budget + synthesis 5k + skill/agent edits 5k + 3 primers × ~3k read + primer edits 3k)
explicit-gaps:
  - release-manager ↔ release-patch ACTUAL fixes — DEFERRED to Sprint 052b release-debt sprint
  - Acceptance harness automated divergence lint — TASK-116-v2 Sprint 055
  - Broader naming-consistency rename beyond 5 in-scope pairs — TASK-NEW if surfaces
  - Token usage optimization audit — TASK-128 Sprint 055b
  - Blueprint primer narrative rewrites beyond drift fixes — out of scope
done-confirmation: 5 audit findings tables exist (T1-T5) consolidated into T6 synthesis table with primer-drift flag column; each finding has severity + disposition; high+med findings with fix-now-T6 disposition applied as ≤1-line skill/agent edits; T7 propagates primer-drift findings to 04+05+08 primers as ≤1-line edits with last_updated stamp bumped 2026-05-09; defer-052b items cross-linked to Sprint 052b scope; orchestrator SKILL.md cap held 97/100; sprint closed via standard SPRINT_PROTOCOLS.md.
status: PASS
```

---

## Sprint DoD

- [ ] T1 prime ↔ /orchestrator init audited; findings recorded with severity + disposition.
- [ ] T2 release-manager ↔ release-patch audited DOCUMENT-ONLY; zero edits applied; findings flagged `disposition: defer-052b`; cross-link added to Sprint 052b scope.
- [ ] T3 pr-reviewer ↔ code-reviewer audited; coordination loop verified bidirectional; findings recorded.
- [ ] T4 security-auditor ↔ security-analyst audited; ADR-015 separate-context constraint cited; pattern-match w/ code-reviewer↔pr-reviewer recorded.
- [ ] T5 architecture-grill ↔ design-analyst audited; Sprint 049 rename propagation verified; G2 coordination loop checked.
- [ ] T6 synthesis table consolidates T1-T5 findings (with primer-drift Y/N column); high+med findings with ≤1-line fix-now-T6 disposition applied to skill/agent canonical; defer-052b + defer-116v2 cross-links written.
- [ ] T7 blueprint primers (04 + 05 + 08) propagate T6 primer-drift findings as ≤1-line in-place edits; last_updated bumped 2026-05-09 per primer touched; release-manager primer entries stay AS-IS per T2 DOCUMENT-ONLY.
- [ ] orchestrator SKILL.md cap held 97/100.
- [ ] No new ADR (sweep + targeted-fix sprint; no hard-to-reverse decision).
- [ ] All artifacts stamp 2026-05-09.
- [ ] release-patch NOT invoked (release-debt 7-sprint chain → Sprint 052b owed).
- [ ] Open questions A-H resolved at promote; zero re-litigation during execution.
- [ ] Carry-forward: Sprint 052b release-debt resolution + T6 defer-052b items; TASK-116-v2 + T6 defer-116v2 items.

---

## Execution Log

*(populated during execution per Sprint Execute Protocol)*

---

## Files Changed

*(populated during execution; one row per file touched, NOT per edit)*

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/sprint/SPRINT-053b-feature-usage-audit-sweep.md` | sprint | NEW — this file | low | — |

---

## Synthesis Findings Table (T6)

*(populated at T6; 5 pairs × N findings each)*

| Pair | Finding | Severity | Disposition | File/Line if fix-now-T6 | Primer-drift (T7) |
|:-----|:--------|:---------|:------------|:------------------------|:------------------|
| *(pending T1-T5 outputs)* | | | | | |

---

## Decisions

*(populated during execution; significant architectural-level / file-structure / library-pick decisions)*

---

## Open Questions for Review

*(populated during execution if any surface)*

---

## Retro

*(populated at Sprint Close)*

### Worked
*(pending)*

### Friction
*(pending)*

### Pattern candidates (carried forward)
*(pending)*

### Surprise log
*(pending)*
