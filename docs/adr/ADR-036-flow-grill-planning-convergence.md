---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: ADR status change
status: decided
sprint: 057
---

# ADR-036: Flow Grill — terminal-first planning convergence collapses 3-skill handoff

**Date**: 2026-05-10
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Post-v1-ship feedback (`refined-task-list.md` Workstream A · items 1+2+6) surfaced three coupled defects in the planning front-end:

**Symptoms (recon-first 2026-05-10):**

- **Item 1 — Open Questions written into doc before user sees them.** `lean-doc-generator/references/SPRINT_PROTOCOLS.md:127` writes `§ Open Questions for Review` into the sprint file at Sprint Promote, then "surface to user at next pause." Doc-first → user retroactively patches assumptions baked into a written artifact.
- **Item 2 — Two-step bypass between task and sprint creation.** `task-decomposer` writes Backlog only (`SKILL.md:58`); user must separately invoke `lean-doc-generator Sprint Promote` to form a sprint. Two user invocations, two `context: fork` reloads of overlapping material.
- **Item 6 — Three-stage handoff = 3× context loads per planning cycle.** `task-decomposer` (fork) → `lean-doc-generator` Sprint Promote (fork) → `orchestrator` sprint-bulk G1+G2 batch. Each stage reloads CONTEXT.md + TODO.md + its own protocol doc. Sprint 055b T1 token audit measured ~3× redundant load per planning cycle.

User mid-promote refinement 2026-05-10: 1-Q-at-a-time grill (architecture-grill pattern) too slow for routine planning where most questions are independent; batched + follow-up is the better default. User mid-promote refinement 2: explicit review-before-lock step required (one step that does NOT change anything, only reviews the converged flow).

Workstream A scope locked at promote (`9c214d1`): items 1+2+6 only; items 3/4/5 → Sprint 059; items 7/8 (incl. R1 arch-grill removal + R3 dispatcher agent redundancy) → Sprint 058 audit.

## Decision

**DEC-1: Flow Grill = single canonical convergence loop in `lean-doc-generator/references/FLOW_GRILL.md`.** Replaces lean-doc Sprint Promote Steps 3-7 + orchestrator sprint-bulk G1+G2 batch with one terminal-first iterative Q&A loop holding a session-scoped Open Questions ledger. Sprint file (`docs/sprint/SPRINT-NNN-*.md`) written ONLY after `lock` keyword consumed from ledger. Mirrors plugin-principle pattern established by ADR-033 (Output Discipline) + ADR-034 (History Hygiene): single canonical reference file + pointer-line fan-out across affected skills/agents (3 skills + 1 agent + CONTEXT.md).

**DEC-2: Open Questions ledger is session-scoped (in-conversation), NOT written to disk until lock.** Mirrors existing sprint-PRD session-scoped pattern (`phases.md:239`). User's answers and the iteration trace live in the conversation only; on `lock`, the converged ledger is consumed by Sprint Promote Step 5 to produce the sprint file. Pre-lock ledger state is intentionally not persisted — encourages convergence pressure (no "I'll come back to it later").

**DEC-3: Q&A discipline = batched independent Qs (≤5/turn) + follow-up turn on ambiguous answer. Never batch dependent or open-ended Qs.** Locks the user mid-promote refinement. Independent questions (deadline, framework, reviewer, scope guardrails) batch fine; dependent Qs (Q2 framing depends on Q1 answer) go in next turn after Q1 lands; open-ended Qs ("what should X be?") get summary-style glosses if batched, so always solo. Follow-up trigger: any answer matching `<X chars OR /maybe|sort of|kinda|whatever/i` fires a clarification turn before next batch. Distinct from `architecture-grill` strict 1-per-turn pattern — that skill keeps its discipline for high-stakes design where question dependence is the norm; Flow Grill's batched form is for routine planning convergence.

**DEC-4: Review-before-lock step is explicit and non-skippable.** Between iteration loop and `lock`: Flow Grill emits a converged ledger summary (questions + answers + assumptions + risk + tasks + 6 anti-slip fields) and prompts `confirm` / `revise <field>` / `lock`. `confirm` acknowledges without writing (no-op review pass); `revise` re-enters the loop at the named field; `lock` is the irreversible write trigger consumed by Sprint Promote Step 5. Mirrors `task-decomposer approve` keyword semantics (`SKILL.md:52`).

**DEC-5: Anti-slip 4 fields persist as ledger rows, not duplicated G1 fields.** `focus` / `context-budget` / `explicit-gaps` / `done-confirmation` (per ADR-031) are gathered iteratively in the ledger rather than batch-asked at G1 PASS time. Single mechanism, not parallel collection. Orchestrator sprint-bulk Phase 1 G1 batch reads these from the locked ledger instead of re-asking.

**DEC-6: Context-budget target = 1× CONTEXT.md + 1× TODO.md + 1× protocol-doc per planning cycle.** Today: 3× each (decompose fork + Promote fork + orchestrator dispatch). Flow Grill consolidates: Promote consumes `task-decomposer` seed (DEC-7) without re-asking; orchestrator consumes locked ledger without re-loading scope-analyst output (already in ledger). Ledger seed handoff is the load-once mechanism.

**DEC-7: `task-decomposer` emits `## Flow Grill Seed` JSON block on `approve`.** Format: `{ tasks: [...], assumptions: [...], risk: ..., layers: [...] }`. Sprint Promote Flow Grill loop hydrates from seed if present (skips already-confirmed Qs); cold-starts otherwise. Seed is additive output — does not change task-decomposer Backlog write contract; preserves all existing decompose validation rules.

## Alternatives considered

1. **Add a 4th skill (`flow-grill`) standalone alongside existing 3.** Rejected. More skills = more dispatch overhead; user mid-promote pushback ("we can remove skills was redundant"); contradicts plugin-principle pattern shape. Reshape existing 3 instead.

2. **Inline grill into orchestrator only (skip lean-doc Sprint Promote rewrite).** Rejected. Sprint Promote owns the sprint-file artifact; moving artifact write to orchestrator violates skill ownership boundaries (Sprint 049 ADR-027 boundary discipline). lean-doc-generator stays the sprint-file canonical writer.

3. **Strict 1-Q-at-a-time per architecture-grill pattern.** Rejected mid-promote (user refinement). Independent Qs don't need 1-per-turn cadence; batched + follow-up captures the precision benefit without the speed tax. architecture-grill keeps strict mode for its high-stakes-design surface.

4. **Keep current 3-stage; only add OQ-first in lean-doc Step 3 (item 1 fix only).** Rejected. Doesn't address item 6 token waste — three context-forks remain. Partial fix; same drift surface re-opens within 1-2 sprints.

5. **Defer entirely until Sprint 058 SDLC audit completes.** Rejected. Items 1+2+6 are audit-independent (planning front-end is its own surface); blocking on audit pushes Workstream A by 2-3 sprints with no recon dependency. Audit will surface Workstream B/C scope; A is decoupled.

## Consequences

**Positive:**
- Open Questions surface terminal-first → no retroactive doc patches; baked-in assumptions eliminated.
- 3× → 1× context loads per planning cycle; eats own dogfood vs item 6 token waste claim.
- Single planning surface (Flow Grill) → simpler mental model for users; one place to learn instead of three.
- Plugin-principle pattern reused (CONTEXT.md canonical + pointer-line fan-out) per ADR-033/034 shape; predictable for future principles.
- Anti-slip 4 fields preserved (ADR-031 contract intact); collected iteratively rather than batch-asked.
- Eats own dogfood at next-sprint horizon: Sprint 058 SDLC audit will measure Flow Grill's actual context load vs predicted 1×.

**Negative (trade-offs accepted):**
- Sprint 057 itself dogfoods OLD 3-stage flow one last time (we are mid-execution of it now); new flow applies starting Sprint 058+. Acceptable — same boot-strap pattern as ADR-031 anti-slip first-applied-at-following-sprint.
- Documentation churn: 3 SKILLs (lean-doc + orchestrator + task-decomposer) + 1 agent (dispatcher) + CONTEXT.md + new FLOW_GRILL.md + this ADR. Mitigated by pointer-line discipline (cap-headroom WARN tier respected; body lives in references).
- Pre-lock ledger not persisted = if user abandons mid-grill, context is lost. Accepted: in-session retry is cheap; alternative (disk-persisted partial ledger) introduces stale-state recovery surface.
- Q&A batching introduces "user power-answers all 5 with one-word glosses" failure mode. Mitigated by DEC-3 follow-up trigger on short/vague answers.

**Neutral:**
- ADR-036 file at `docs/adr/ADR-036-flow-grill-planning-convergence.md` per locked convention (Sprint 043 DEC-7). ID verified non-colliding (max ADR was 035 post-Sprint-055-2).
- Plugin lockstep MINOR bump 3.0.0 → 3.1.0 per ADR-006; lean-doc 2.3.1→2.4.0, orchestrator 2.1.1→2.2.0, task-decomposer 1.1.0→1.2.0 (per-skill MINOR). NO release-patch invocation per ADR-027 (HARD-rejects MINOR); manual sprint-less bump pattern per ADR-032.
- arch-grill (R1) + dispatcher agent (R3) deferred to Sprint 058 audit; not in this ADR's scope.
- CONTEXT.md § Vocabulary gains `flow grill` term (T5 propagation); § Modes `sprint-bulk` row updated lockstep (T3 + T5 propagation).

## References

- ISSUE origin: `refined-task-list.md` Workstream A (items 1+2+6) post-v1-ship feedback 2026-05-10.
- ADR-006 — plugin lockstep version bump (3.0.0 → 3.1.0 lockstep applies).
- ADR-026 — User-Project Outcome lens (O5 flow + O8 plugin reliability anchors).
- ADR-027 — release-patch boundary (HARD-rejects MINOR; manual bump path per ADR-032).
- ADR-030 — template canonical ownership (FLOW_GRILL.md is new canonical reference; templates unchanged).
- ADR-031 — anti-slip discipline at G1 (DEC-5 ledger fields preserve contract).
- ADR-032 — release-debt resolution + manual sprint-less bump pattern.
- ADR-033 — Output Discipline (plugin-principle pattern source).
- ADR-034 — History Hygiene (plugin-principle pattern reuse target).
- TASK-135 (Sprint 057) — this codification + FLOW_GRILL.md spec write.
- TASK-136..139 (Sprint 057) — apply rules to lean-doc + orchestrator + task-decomposer + propagation.
- Memory: `feedback_plugin_principle_pattern.md` — pattern source.
- Re-evaluation cadence: Sprint 058 SDLC audit measures actual context-load reduction vs DEC-6 target; DEC-1..DEC-5 locked indefinitely (re-litigation per ADR-031 lock 5).
