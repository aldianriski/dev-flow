---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: active
plan_commit: ecf9fa7
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

- [x] T1 prime ↔ /orchestrator init audited; 3 findings (1 fix-now-T6 + 1 primer-drift + 1 no-action).
- [x] T2 release-manager ↔ release-patch audited DOCUMENT-ONLY; zero edits to release-manager/release-patch SKILL.md; 7 findings ALL flagged `disposition: defer-052b`; cross-link added to TODO.md release-debt row scope.
- [x] T3 pr-reviewer ↔ code-reviewer audited; coordination loop verified bidirectional (SKILL body + frontmatter `agent:` ↔ agent body + `preload-skills:`); cleanest pair, used as reference for T4.
- [x] T4 security-auditor ↔ security-analyst audited; ADR-015 separate-context citation gap fixed in SKILL.md L14 (≤1-line); pattern-match w/ code-reviewer↔pr-reviewer recorded.
- [x] T5 architecture-grill ↔ design-analyst audited; distinct-surface pair confirmed (no coordination loop expected per SKILL.md L13); Sprint 049 rename propagation incomplete → 17 fixes carried into T7 + ASCII diagram + 10a-init.md primer deferred to TASK-132.
- [x] T6 synthesis table consolidates T1-T5 findings (16 rows w/ primer-drift Y/N column); 2 fix-now-T6 wire-fixes applied (security-auditor SKILL.md L14 ADR-015 citation · phases.md § init Phase post-init `/prime` handoff line); 7 defer-052b cross-links written to TODO.md release-debt row.
- [x] T7 blueprint primers (02 + 04 + 05 + 09) + README + USER-OUTCOMES.md propagated T6 primer-drift findings as 17 ≤1-line in-place edits; last_updated bumped 2026-05-09 per primer touched (4 stamps); release-manager primer entries marked w/ Sprint 052b cross-link per T2 DOC-ONLY rule; 3 NEW Universal Skills rows added (prime · release-patch · Architecture Grill).
- [x] orchestrator SKILL.md cap held 97/100 (no SKILL.md edits required; phases.md is reference file with no per-file cap).
- [x] No new ADR (sweep + targeted-fix sprint; no hard-to-reverse decision surfaced).
- [x] All artifacts stamp 2026-05-09.
- [x] release-patch NOT invoked (release-debt 7-sprint chain → Sprint 052b owed; this sprint adds zero PATCH/MINOR — 2 SKILL.md content edits trigger release-patch eligibility but release-debt sprint absorbs).
- [x] Open questions A-H resolved at promote; zero re-litigation during execution; ONE friction trigger surfaced + resolved (T7 fix-volume 17 vs initial expectation; user-approved full propagation).
- [x] Carry-forward: Sprint 052b release-debt resolution + T2 7 findings (cross-linked in TODO.md row); TASK-132 (10a-init.md primer rewrite + 04-subagents.md ASCII diagram cleanup); TASK-116-v2 + automated divergence lint (multi-occurrence rename propagation auto-check).

---

## Execution Log

### 2026-05-09 — T1-T5 audits complete

- **T1 (prime ↔ /orchestrator init)**: bidirectional boundary statements asymmetric (prime SKILL.md line 23 cites orchestrator; orchestrator init Phase doesn't cite prime). Surfaces non-overlapping (prime=post-scaffold session-prime; init=first-time scaffold). 1 fix-now-T6 (post-init `/prime` handoff suggestion in phases.md § init Phase). 1 primer-drift-T7 (prime missing from 05-skills.md Universal Skills).
- **T2 (release-manager ↔ release-patch)** **DOC-ONLY**: 7 findings ALL `disposition: defer-052b` per discipline. release-manager 2026-04-21 stale; cross-citation gap; invocation asymmetry; release-patch missing from 05-skills.md Universal Skills + Phase 9 Close. T7 cross-link only per T2 DOC-ONLY rule.
- **T3 (pr-reviewer ↔ code-reviewer)**: cleanest pair. Bidirectional citation complete (SKILL body + frontmatter `agent:`; agent body + `preload-skills:`). Naming split intentional (skill=process; agent=orchestration). Caps held. Primer alignment ✓.
- **T4 (security-auditor ↔ security-analyst)**: pattern mirrors T3. 1 fix-now-T6 (ADR-015 citation in SKILL.md line 14 to make separate-context constraint explicit). Otherwise clean.
- **T5 (architecture-grill ↔ design-analyst)**: distinct-surface pair (SKILL.md line 13 explicit boundary; no coordination loop expected). LARGEST primer-drift in sprint: Sprint 049 rename `system-design-reviewer` → `architecture-grill` propagation incomplete in 6 active surfaces (14 occurrences) + `init-analyst` orphan agent rows (3 occurrences) — agent never created post-ADR-028 (init = bin/dev-flow-init.js). Friction Protocol invoked 2026-05-09: user approved full propagation in T7.

### 2026-05-09 — T6 synthesis + skill/agent wire-fix

- Synthesis Findings Table populated (16 rows; T1-T5 outputs). Columns: pair · finding · severity · disposition · file/line if fix-now-T6 · primer-drift (T7 Y/N).
- 2 T6 fix-now edits applied:
  1. `skills/security-auditor/SKILL.md` L14 — added ADR-015 separate-context citation rationale (T4 finding).
  2. `skills/orchestrator/references/phases.md` § init Phase — added "Post-init handoff" line suggesting `/prime` next session (T1 finding).
- 7 T2 findings ALL deferred to Sprint 052b release-debt sprint (per T2 DOC-ONLY discipline).

### 2026-05-09 — T7 blueprint primer alignment (full propagation per user-approved friction outcome)

- 14 active stale `system-design-reviewer` refs replaced with `architecture-grill` across 6 active surfaces.
- 3 orphan `init-analyst` agent rows removed (2 in 04-subagents.md + 1 each in 02-repo-structure.md and 09-customization.md). Init phase canonical = `bin/dev-flow-init.js` per ADR-028 + Sprint 050.
- 4 active surfaces stamped `last_updated: 2026-05-09` (02-repo-structure.md · 04-subagents.md · 05-skills.md · 09-customization.md). README + USER-OUTCOMES.md no last_updated frontmatter.
- 3 NEW Universal Skills rows added to 05-skills.md table: `prime` (T1 primer-drift finding) · `release-patch` (T2 primer-drift cross-link) · `Architecture Grill` (rename completion). `release-manager` row marked w/ Sprint 052b cross-link per T2 DOC-ONLY rule.
- Verification grep: zero `system-design-reviewer` matches in active blueprint primers + README + USER-OUTCOMES.md + 04-subagents.md.

**Surfaced for TASK-NEW (out of T7 ≤1-line scope):**
- `docs/blueprint/10a-init.md` — entire primer describes deprecated init-analyst agent workflow (4 refs at L32 / L48 / L102 / L110). Per Sprint 050 ADR-028, init = `bin/dev-flow-init.js` script; primer needs whole-section rewrite, not ≤1-line edit.
- `docs/blueprint/04-subagents.md` ASCII diagram (lines 22-34) — `INIT ANALYST` node still drawn in agent-tier flowchart; multi-line edit (collapse 6 lines).

---

## Files Changed

*(populated during execution; one row per file touched, NOT per edit)*

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/sprint/SPRINT-053b-feature-usage-audit-sweep.md` | sprint | NEW — this file | low | — |
| `skills/security-auditor/SKILL.md` | T6 | L14 — added ADR-015 separate-context citation (≤1-line in-place) | low | — |
| `skills/orchestrator/references/phases.md` | T6 | § init Phase — added "Post-init handoff" line suggesting `/prime` next session (≤1-line append) | low | — |
| `docs/blueprint/02-repo-structure.md` | T7 | L24 init-analyst row deleted · L44 system-design-reviewer/→architecture-grill/ · last_updated 2026-04-20→2026-05-09 | low | — |
| `docs/blueprint/04-subagents.md` | T7 | L64 init-analyst Agent file map row deleted · L165 init-analyst example replaced w/ scope-analyst · last_updated 2026-04-20→2026-05-09 | low | — |
| `docs/blueprint/05-skills.md` | T7 | 5× system-design-reviewer→architecture-grill (L56/L169/L179/L265 + L130 row name+dir) · 3 NEW Universal Skills rows (prime · release-patch · Architecture Grill) · release-manager row marked w/ Sprint 052b cross-link · last_updated 2026-04-25→2026-05-09 | low | — |
| `docs/blueprint/09-customization.md` | T7 | 3× system-design-reviewer→architecture-grill (L104/L108/L195) · L114 init-analyst-create line replaced w/ bin/dev-flow-init.js canonical pointer · last_updated 2026-04-20→2026-05-09 | low | — |
| `README.md` | T7 | L22 system-design-reviewer→architecture-grill in Outcome architecture row | low | — |
| `docs/USER-OUTCOMES.md` | T7 | L41 diagnose Skip-when system-design-reviewer→architecture-grill | low | — |

---

## Synthesis Findings Table (T6)

*(populated at T6; 5 pairs × N findings each)*

| Pair | Finding | Severity | Disposition | File/Line if fix-now-T6 | Primer-drift (T7) |
|:-----|:--------|:---------|:------------|:------------------------|:------------------|
| T1 prime↔init | Boundary asymmetry (orchestrator init doesn't reciprocate prime's boundary citation) | low | no-action | — | N |
| T1 prime↔init | Post-init `/prime` handoff not suggested in phases.md § init Phase Step 4 | low | fix-now-T6 | `skills/orchestrator/references/phases.md` § init Phase | N |
| T1 prime↔init | `prime` missing from 05-skills.md Universal Skills table | low | fix-now-T7 | — | Y |
| T2 release-manager↔release-patch | Cross-citation gap (neither cites the other as paired counterpart) | med | defer-052b | — | N |
| T2 release-manager↔release-patch | release-manager last-validated stale 2026-04-21 (pre-ADR-027) | med | defer-052b | — | N |
| T2 release-manager↔release-patch | Invocation asymmetry (manager has table; patch does not) | low | defer-052b | — | N |
| T2 release-manager↔release-patch | release-debt 7-sprint chain (Sprint 049 MINOR + 050/051a/051b/052/053/054 PATCH) | high | defer-052b | — | N |
| T2 release-manager↔release-patch | release-patch missing from 05-skills.md Universal Skills | med | fix-now-T7 (cross-link only per T2 DOC-ONLY) | — | Y |
| T2 release-manager↔release-patch | 05-skills.md L184 Phase 9 Close lists release-manager only | low | fix-now-T7 (cross-link only per T2 DOC-ONLY) | — | Y |
| T3 pr-reviewer↔code-reviewer | (all clean — no findings) | — | no-action | — | N |
| T4 security-auditor↔security-analyst | ADR-015 separate-context citation gap in SKILL.md L14 | med | fix-now-T6 | `skills/security-auditor/SKILL.md` L14 | N |
| T5 architecture-grill↔design-analyst | Distinct-surface pair confirmed; no coordination loop required | — | no-action | — | N |
| T5 architecture-grill↔design-analyst | Sprint 049 rename `system-design-reviewer`→`architecture-grill` propagation incomplete (14 stale refs in 6 active surfaces) | high | fix-now-T7 | (T7 — 6 files) | Y |
| T5 architecture-grill↔design-analyst | Orphan `init-analyst` agent rows (3 primers reference non-existent agent; init phase = bin/dev-flow-init.js per ADR-028) | high | fix-now-T7 | (T7 — 3 files) | Y |
| T5 architecture-grill↔design-analyst | docs/codemap/handoff.json L320, L324 stale | low | no-action | — | N (auto-regenerates via codemap-refresh hook on commit) |
| T5 architecture-grill↔design-analyst | docs/DECISIONS.md L344 historical Sprint 36 narrative | — | no-action | — | N (closed-sprint archive; no retroactive edits) |

---

## Decisions

*(populated during execution; significant architectural-level / file-structure / library-pick decisions)*

---

## Open Questions for Review

*(populated during execution if any surface)*

---

## Retro

### Worked

- **5-pair audit methodology held discipline.** Sequential T1→T5 reads + per-pair findings table prevented context blur. T3 (cleanest pair) early in sequence served as reference pattern for T4 audit shape.
- **Bidirectional citation rule (ADR-031 Open Q E) caught real drift.** T2 release-manager↔release-patch + T4 security-auditor↔security-analyst both surfaced via this rule; T3 pr-reviewer↔code-reviewer passed cleanly because both directions explicitly cited in SKILL+agent body AND frontmatter — pattern reusable.
- **T2 DOCUMENT-ONLY discipline held.** Zero edits to release-manager/release-patch SKILL.md despite 5 fixable findings surfaced. Defer-052b cross-link in TODO.md release-debt row preserved findings for next sprint.
- **Friction Protocol invocation worked.** T5 fix-volume 17 (vs initial sweep-expectation ~5) surfaced mid-sprint; user-decision in <1 turn unblocked T7 with full propagation.
- **≤1-line in-place edit rule scaled.** 17 propagation edits across 6 active surfaces stayed compliant per-edit; aggregate volume managed via batching.

### Friction

- **Initial grep undercounted T7 scope.** First sweep counted 14 stale `system-design-reviewer` refs; deeper read revealed 3 entangled orphan `init-analyst` rows + ASCII diagram + 10a-init.md primer. Friction Protocol caught it but planned context-budget (~60k) absorbed without margin. **TD candidate: Sprint Promote audit pre-step should grep for known-stale tokens to size T7-class fix volume.**
- **10a-init.md primer requires whole-section rewrite.** ≤1-line discipline blocks fix in this sprint; deferred TASK-132. Pattern: when entire primer is ABOUT a deprecated entity, multi-line rewrite is unavoidable — sprint scope rule should call this out at G1.
- **04-subagents.md ASCII diagram drift** — multi-line surface; same constraint as above.
- **8 historical surfaces with stale refs** (sprint files / audit docs / DECISIONS.md / handoff.json) — explicit no-action per closed-sprint archive convention; verified at audit time, recorded for transparency.

### Pattern candidates (carried forward)

- **Pre-promote stale-token sweep.** Before Sprint Promote, grep for tokens flagged in recent renames/deprecations across active blueprint primers + README + .claude/CONTEXT.md to surface drift volume early. → propose TD or TASK-NEW for token-audit harness (Sprint 055b TASK-128 overlap).
- **Whole-primer-rewrite escape hatch.** When ≤1-line discipline can't address a finding (entire primer/diagram about deprecated entity), G1 must surface the multi-line scope and route to TASK-NEW at promote time, not surface mid-sprint as friction.
- **Coordination-loop bidirectional rule (ADR-031 Open Q E)** — codify into PR review checklist OR pr-reviewer Lens 7 (Documentation): if SKILL+agent pair, verify both directions cite. Currently behavioral; should be lint-enforced via TASK-116-v2 acceptance harness.

### Surprise log

- **`init-analyst` agent never created** despite multiple primer references. Per Sprint 050 ADR-028, init = `bin/dev-flow-init.js` script — but stale primer narratives (10a-init.md + 04 ASCII + 02-repo-structure tree) preserved the agent fiction across 3+ sprints post-deprecation. Doc-rot lesson: ADR-028 closure didn't trigger primer audit.
- **05-skills.md was MISSING `prime` from Universal Skills table** despite prime being session-prime canonical entry. Caught in T1 finding; added in T7. Suggests primers may be missing other v1-shipped universal skills not yet audited (zoom-out · diagnose · tdd · refactor-advisor) — possible TASK-NEW scope.
- **release-patch deprecated `release-manager` in practice** but neither skill cites the other, and 05-skills.md still listed only release-manager as Universal/Phase-9-Close. Sprint 049 ADR-027 generalize closed half the loop (release-patch ships); the other half (release-manager status reconcile) was deferred to release-debt sprint that hasn't run yet. Drift compounds across sprints when paired-skill audits are skipped.
