---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 044
---

# ADR-023: GSD (`gsd-build/get-shit-done`) patterns adoption — scale-driven defer + 2 bidirectional findings

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 044 (EPIC-Audit Phase 4e) closes the lineage gap on patterns evaluated from `gsd-build/get-shit-done` (MIT, upstream commit `42ed7cee8d8d`). GSD postdates Sprint 034 external-refs probe — fresh discovery this sprint. Two research notes feed this ADR:
- `docs/research/gsd-phase-pipeline-and-commands-2026-05-04.md` (T1)
- `docs/research/gsd-contexts-plans-and-context-2026-05-04.md` (T2)

`gsd-build/get-shit-done` is NOT in user's local plugin cache — gh CLI is the sole source.

**GSD scale anchor:** ~64 commands + ~80 workflows + ~20 agents = 164+ asset surface. Plus full TypeScript SDK (`/sdk/`, `package.json`, `tsconfig.json`, `vitest.config.ts`), 5-language READMEs, persistent workflow artifacts (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md / ROADMAP.md). dev-flow surface = 24 (17 skills + 7 agents). 6.8× scale gap.

## Decision

**1. NO LIFT on GSD 9-phase pipeline.** GSD's `sketch → spike → discuss → spec → plan → execute → verify → validate → ship` pipeline maps to dev-flow's `init/quick/mvp/sprint-bulk` mode + `G1/G2` gate model at coarser granularity. dev-flow folds GSD's per-phase persistent artifacts (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md) into orchestrator MICRO-TASKS + sprint plan + `docs/research/`. 9-phase ceremony unjustified at 24-asset scale. **Re-eval trigger:** dev-flow grows past ~150 assets. (Sprint 044 DEC-1.)

**2. NO LIFT on `commands/` namespace separate from `skills/`.** GSD splits commands (slash-invokable per-file) from skills/agents (per-dir). dev-flow's `skills/` namespace covers the same surface. Splitting would duplicate dispatcher concerns without scale benefit. (Sprint 044 DEC-2.)

**3. DEFER XML-tagged command body** (`<objective>`, `<routing>`, `<execution_context>`, `<context>`). XML tags improve agent parseability; hurt human readability. Could be considered for `write-a-skill` template if applied selectively to skills that auto-trigger frequently (where AI parsing matters more than human reading). NOT a wholesale change; not adopted this sprint. (Sprint 044 DEC-3.)

**4. NO LIFT on `agent:` + `allowed-tools:` per-command frontmatter fields.** dev-flow uses orchestrator dispatch-table for agent routing (avoids skill-author needing to know agent roster at write time). Per-command tool allowlist is premature at single-author scale; **DEFER and re-eval at adopter scale.** (Sprint 044 DEC-4.)

**5. NO LIFT on persistent workflow artifacts** (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md / ROADMAP.md). dev-flow's `docs/sprint/SPRINT-NNN-*.md` (with structured frontmatter + Plan + Execution Log + Files Changed + Decisions + Open Questions + Retro sections) plus `docs/research/<topic>-<date>.md` covers the same intent without per-phase file proliferation. (Sprint 044 DEC-5.)

**6. Bidirectional finding: dev-flow `sprint-bulk` mode batches G1+G2 once per sprint; GSD has no equivalent.** Every GSD phase pays gate cost individually. At sprint-of-N tasks scale, dev-flow saves N-1 gate ceremonies. Recorded explicitly per Sprint 042 DEC-2 / Sprint 043 DEC-2 bidirectional pattern to avoid future "match GSD per-phase ceremony" pressure. (Sprint 044 DEC-6.)

**7. DEFER `contexts/` per-mode output-style profiles.** GSD ships 3 mode profiles (`dev.md` low-verbosity action-oriented / `research.md` high-verbosity exploratory / `review.md` review-focused) loaded via `config.json`. dev-flow has single posture (`.claude/CLAUDE.md` § Behavioral Guidelines — Think Before Acting / Simplicity First / Surgical Changes / Goal-Driven Execution) and manages verbosity at skill level (caveman / dev-flow-compress). Per-mode profiles add config + agent-side logic; cost not justified at single-author meta-repo. **Re-eval triggers:** dev-flow gains distinct work-mode patterns (e.g., implementation vs research vs review sprints) where output style genuinely should differ; OR adopter feedback. NOT a `.out-of-scope/` candidate (pattern interesting, may apply later). (Sprint 044 DEC-7.)

**8. NO LIFT on `.plans/` directory pattern.** GSD `.plans/<numeric>-<slug>.md` is functionally equivalent to dev-flow `docs/sprint/SPRINT-NNN-*.md`. dev-flow's convention is more explicit (sprint numbering + status frontmatter + retro discipline). (Sprint 044 DEC-8.)

**9. ZERO additive `CONTEXT.md` lifts from GSD.** GSD `CONTEXT.md` is TypeScript-module domain glossary (Dispatch Policy Module, Command Definition Module, Query Runtime Context Module, etc — ~10 modules). NO OVERLAP with dev-flow workflow-domain `CONTEXT.md`. Sprint 043 DEC-5 (3 mattpocock-derived additive lifts via TASK-117) remains the only outstanding `CONTEXT.md` change queue. **Bidirectional finding:** dev-flow `CONTEXT.md` has 8 workflow sections; GSD `CONTEXT.md` has 1 code-architecture section. Each is richer in its respective domain. (Sprint 044 DEC-9.)

## Net assessment

**GSD validates the general direction** (markdown-driven workflow definitions, agent + skill separation, structured command frontmatter, `.out-of-scope/` for negative-space decisions [adopted Sprint 043]) **but its patterns are not generally portable to dev-flow's scale.** Adopting GSD shape wholesale would 6.8× the surface area without proportional benefit. Three small lifts considered (XML-tagged body for write-a-skill template, per-command tool allowlist for adopter scale, contexts/ for distinct work modes) are all DEFER, none REJECT.

## Alternatives considered

1. **Adopt GSD 9-phase pipeline as dev-flow's mode set.** Rejected — GSD pipeline assumes 164+ assets + persistent per-phase artifacts. Forcing 9 phases on 24-asset meta-repo creates ceremony tax with no benefit. dev-flow mode + gate model is correctly sized.

2. **Adopt GSD XML-tagged command body for ALL dev-flow skills.** Rejected — improves agent parseability but hurts human readability. dev-flow's conversational markdown serves human review better. Selective adoption (write-a-skill template for high-auto-trigger skills) deferred to TASK-118 scope or later.

3. **Adopt GSD `agent:` + `allowed-tools:` frontmatter wholesale.** Rejected — duplicates orchestrator dispatch-table function; per-tool allowlist premature at single-author scale. Re-eval if dev-flow gains multi-developer security model.

4. **Adopt persistent workflow artifacts (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md).** Rejected — each per-phase artifact = file proliferation. dev-flow sprint plan + research notes + DoD checklist cover same concerns in fewer files. GSD's split is appropriate at GSD scale; not at dev-flow scale.

5. **Adopt GSD `contexts/` per-mode output profiles.** Rejected (defer) — meta-repo work is primarily one mode; mode-switching cost not justified. Re-eval if distinct work-mode patterns emerge.

6. **Lift GSD `CONTEXT.md` module-glossary format.** Rejected — different domain (TypeScript code architecture vs workflow concepts). dev-flow `CONTEXT.md` is workflow-domain by design.

7. **Add GSD `.plans/` alongside `docs/sprint/`.** Rejected — duplicate surface. Migrate to either-or (GSD's flat `.plans/` is less explicit than dev-flow's `docs/sprint/SPRINT-NNN-*.md`).

8. **Skip ADR entirely; close Phase 4e silently.** Rejected — GSD lineage needs explicit record; future sprint may revisit if dev-flow scale changes. ADR locks "considered + deferred" surface.

## Consequences

**Positive**:
- GSD lineage explicit + version-pinned (`42ed7cee8d8d`). Re-diff via gh CLI deterministic.
- 9 decisions documented with explicit re-eval triggers (scale crossing, adopter feedback, distinct work modes). No silent kick-the-can.
- Two bidirectional findings (DEC-6 sprint-bulk batched gates, DEC-9 CONTEXT.md domain richness) recorded — avoids future "match GSD" pressure on those axes.
- TASK-116 / TASK-117 / TASK-118 (queued from Sprints 042 / 043) all confirmed unaffected — GSD audit surfaces no new candidates that weren't already queued.

**Negative** (trade-offs accepted):
- 5 deferred decisions (DEC-3 XML body / DEC-4 per-tool allowlist / DEC-7 contexts/ / future scale-crossing re-eval / future adopter-scale re-eval) require active tracking. Mitigation: re-eval triggers explicit in each decision.
- No new `.out-of-scope/` pointers added — GSD decisions are scale-driven (pattern fine, scale wrong) rather than concept-rejecting (pattern broken). `.out-of-scope/` shape is for the latter; ADR-023 § Decision text holds the rationale for the former.

**Neutral**:
- ADR file at `docs/adr/ADR-023-gsd-patterns.md` per locked convention (Sprint 043 DEC-7). `docs/DECISIONS.md` remains frozen at ADR-001..015.
- No skill / agent / hook / code surface change in dev-flow this sprint. Plugin version unchanged; no PATCH bump warranted.
- TASK-116 trigger-phrase candidate list (from Sprint 043 DEC-1) gains nothing new from GSD scan — GSD command-name vocabulary ("spike" / "verify-work" / "validate-phase") would be skill-CREATION candidates, not skill-description-rewording candidates; out of TASK-116 scope.

**EPIC-Audit Phase 4e closed** — Sprint 044 GSD patterns shipped.

## References

- Upstream: https://github.com/gsd-build/get-shit-done (MIT, SHA `42ed7cee8d8d`)
- T1 research: `docs/research/gsd-phase-pipeline-and-commands-2026-05-04.md`
- T2 research: `docs/research/gsd-contexts-plans-and-context-2026-05-04.md`
- Sprint plan: `docs/sprint/SPRINT-044-gsd-patterns.md`
- Probe origin: (none — GSD postdates Sprint 034 probe; first-scan via gh CLI this sprint)
- Sprint 043 ADR-022 lineage precedent: `docs/adr/ADR-022-mattpocock-skill-library-patterns.md`
- ADR-021 DEC-4 eval-evidence rule: `docs/adr/ADR-021-superpowers-patterns.md` (cross-link — TASK-116 unaffected by GSD audit)
