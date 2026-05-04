---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 040
---

# ADR-019: Karpathy patterns adoption — lineage credit + adaptation lock

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 040 (EPIC-Audit Phase 4a) closes the lineage gap on patterns adopted from `forrestchang/andrej-karpathy-skills` (MIT License). Two karpathy artifacts have been informally referenced in dev-flow without explicit credit or version pinning:

1. **Behavioral Guidelines** (`.claude/CLAUDE.md` lines 64-77 — Think Before Acting / Simplicity First / Surgical Changes / Goal-Driven Execution). Originally adopted from karpathy `CLAUDE.md` four-principle block, with intentional rewording for meta-repo context. Adoption commit predates Sprint 034; no lineage record existed in `.claude/CONTEXT.md` or `docs/DECISIONS.md`.

2. **Verify-step micro-protocol** (`step → verify check` per execution step). Karpathy `CLAUDE.md` § 4 and `EXAMPLES.md` § 4 codify the pattern. dev-flow `skills/orchestrator/references/phases.md:107` Design Analyst Output template carries `- [ ] <exact action> in <exact/path>  verify: <runnable command>` per micro-task — landed in Sprint 035 (commit `414ee8e`, 2026-05-01) without explicit karpathy lineage record.

A third karpathy artifact was assessed and rejected:

3. **Root-level `EXAMPLES.md`** convention (one file with Wrong-vs-Right code diffs per principle). Karpathy ships `EXAMPLES.md` with 4 sections × 2-3 Python diffs each. Investigated in Sprint 040 T1.

Without an ADR, future contributors cannot trace which patterns are karpathy-derived, what was adapted versus copied verbatim, or when to re-diff against upstream. Drift risk grows silently.

## Decision

**1. Adopt karpathy Behavioral Guidelines lineage.** Lock the four principles via `.claude/CONTEXT.md` § Behavioral Guidelines Lineage (added Sprint 040 T2). Lineage block records: per-principle adaptation table (karpathy headline → dev-flow headline + adaptation note), MIT attribution, upstream commit SHA `2c606141936f`, verified-at date `2026-05-04`. Forward maintenance contract: when upstream substantively changes, re-diff and bump the SHA + date here.

**2. Confirm karpathy verify-step micro-protocol at G2 design-analyst MICRO-TASKS.** Pattern is already shipped (Sprint 035, `414ee8e`) — this ADR records the lineage retroactively. Placement is correct at the per-execution-step granularity. Rejected placement at `task-decomposer` Acceptance: that field is task-level (one TASK = 1-N micro-task fanout), distinct from per-step verify. Two granularities, correct separation.

**3. Reject root-level `EXAMPLES.md` convention.** dev-flow is a meta-repo (markdown skills/agents/governance) with no app-code domain to demonstrate. Karpathy examples are Python code diffs; dev-flow has no equivalent code surface. `.claude/CLAUDE.md` § Anti-Patterns + per-skill `Red Flags` blocks already cover the principle-violation surface at the meta-repo abstraction level. Adopting would force inventing meta-domain examples (skill rewrites? agent diffs?) — large content investment for marginal AI-behavior gain.

## Alternatives considered

1. **Defer lineage until v1 ship.** Rejected — every sprint that lands without lineage accretes more uncredited karpathy-derived edits. Cost grows linearly; benefit of deferral is zero. Sprint 034 EPIC-Audit already booked Phase 4a (this sprint) as the lineage-lock checkpoint.

2. **Copy karpathy CLAUDE.md verbatim into `.claude/CONTEXT.md`.** Rejected — meta-repo context differs from karpathy's app-code context ("Coding" → "Acting"; bullets distilled to prose; orphan-removal subsection dropped). Verbatim copy would force re-rewording on every read and lose the adaptation rationale.

3. **Add verify-step at `task-decomposer` Acceptance instead of G2 MICRO-TASKS.** Rejected — Acceptance is task-level; verify-step is micro-task level. Two distinct granularities. Existing G2 MICRO-TASKS placement (Sprint 035) is correct.

4. **Adopt root-level `EXAMPLES.md` for skill-authoring scenarios.** Rejected — example domain (skill rewrites, agent diffs, sprint-flow scenarios) would be 3-5× the content size of karpathy's Python examples while serving a narrower audience (skill authors, not all dev-flow consumers). CLAUDE.md anti-patterns + skill Red Flags already cover the surface at the right abstraction.

5. **Per-skill `EXAMPLES.md` (one file per skill).** Rejected — not a karpathy pattern (karpathy uses single root file). Out of T1 scope. May revisit independently in a future sprint if skill authors request it; not blocking on this ADR.

## Consequences

**Positive**:
- karpathy lineage explicit + version-pinned. Re-diffs against upstream become deterministic via `gh api` + recorded SHA.
- Verify-step micro-protocol formally credited; Sprint 035 retroactive lineage closed.
- ADR registry honest about which external patterns shaped dev-flow.
- Future contributors can trace `Think Before Acting` etc. to source without git archaeology.

**Negative** (trade-offs accepted):
- `.claude/CONTEXT.md` grows by one section (~20 lines). CLAUDE.md cap (≤80) unaffected; CONTEXT.md has no formal cap.
- Forward maintenance burden: upstream re-diff required when karpathy `CLAUDE.md` substantively changes. Mitigation: re-diff scheduled at next EPIC-Audit pass (post-v1).

**Neutral**:
- ADR numbering: Sprint 034 DEC-2 reserved ADR-019 for Phase 4a. Honored despite Sprint 038 taking ADR-016 (next-free), leaving gap at 017-018. Future ADRs should allocate sequentially via Sprint 039 retro pattern (grep `docs/adr/` + `docs/DECISIONS.md` for max ADR-NNN); reservations from Sprint 034 DEC-2 superseded by sequential-allocation discipline going forward.
- ADR file convention: `docs/adr/ADR-NNN-*.md` per Sprint 039 ADR-016 precedent. `docs/DECISIONS.md` frozen at ADR-001..015.
- Plugin version not bumped — adoption is a documentation/lineage change with no behavior change. Future PATCH bump may include this ADR in CHANGELOG; not required for ADR landing.

**EPIC-Audit Phase 4a closed** — Sprint 040 lineage lock shipped.

## References

- Upstream: https://github.com/forrestchang/andrej-karpathy-skills (MIT)
- Upstream commit pinned: `2c606141936f`
- Lineage block: `.claude/CONTEXT.md` § Behavioral Guidelines Lineage
- Verify-step pattern: `skills/orchestrator/references/phases.md` § Design Analyst Output (line 107)
- Sprint plan: `docs/sprint/SPRINT-040-karpathy-patterns.md`
- Probe origin: `docs/audit/external-refs-probe.md`
