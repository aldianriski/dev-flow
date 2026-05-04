---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 041
---

# ADR-020: Caveman patterns adoption — lineage credit + 3-arm eval port + caveman-shrink rejection

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 041 (EPIC-Audit Phase 4b) closes the lineage gap on patterns evaluated from two caveman implementations:

1. **`juliusbrussee/caveman`** (full plugin: hooks, MCP middleware, statusline badge, eval harness, intensity levels, wenyan support). Already installed in user's local plugin cache at `C:/Users/HYPE AMD/.claude/plugins/cache/caveman/caveman/84cc3c14fa1e/`. License: MIT. Upstream commit `ef6050c5e184` (verified 2026-05-04).

2. **`mattpocock/skills/skills/productivity/caveman/SKILL.md`** (pure skill, no plugin layer). License: MIT. Upstream commit `b843cb5ea74b` (verified 2026-05-04).

Sprint 040 ADR-019 set the precedent for ext-ref lineage records; Sprint 041 follows the same shape for caveman. Three open questions are resolved here; one is explicitly deferred:

- **OQ1 (statusline-badge contract)** — explicitly deferred per Sprint 034 external-refs probe (line 165: "wait until dev-flow-compress hardened"). Recorded in sprint § Open Questions for Review; not decided in this ADR.
- **OQ2 (backup-on-write divergence between dev-flow-compress and caveman-compress)** — surfaced for P2 backlog if found; not in scope here.

## Decision

**1. No caveman fork in dev-flow.** Both juliusbrussee and mattpocock variants are MIT-licensed and freely installable. juliusbrussee is already in the user's local plugin cache. Cloning either variant into dev-flow would create maintenance burden without value. Document caveman as an external reference, not a sourced/forked component. (Sprint 041 DEC-1.)

**2. Lineage credit to BOTH variants.** SHA pins recorded in sprint § Decisions and in the T1 research note (`docs/research/caveman-skill-diff-2026-05-04.md`):
- juliusbrussee/caveman → `ef6050c5e184` (full plugin reference)
- mattpocock/skills .../caveman → `b843cb5ea74b` (minimal-skill reference)

Re-diff cadence: re-fetch via gh CLI when either upstream main SHA changes; bump pins in the research note + this ADR. (Sprint 041 DEC-2.)

**3. Adopt 3-arm eval methodology — port shape locked.** Sprint 034 ADR-001 already adopted the 3-arm pattern in spirit (`baseline / terse-control / skill-arm`). Sprint 041 T2 audit (`docs/research/caveman-eval-harness-port-notes-2026-05-04.md`) confirms portability and locks the Node port shape:
- Two scripts (matches caveman split): `scripts/eval-run.js` (port of `llm_run.py`) + `scripts/eval-measure.js` (port of `measure.py`).
- Tokenizer: `gpt-tokenizer` primary, `js-tiktoken` fallback, `@dqbd/tiktoken` (WASM) last resort.
- Snapshot schema 1:1 with caveman so `caveman/measure.py` can read dev-flow snapshots and vice versa.
- Pre-verification step: byte-parity check between Node tokenizer and Python tiktoken before TASK-115 lands code.

Implementation NOT in this sprint — deferred to TASK-115's own sprint with the T2 research note as design input. (Sprint 041 DEC-3 + DEC-4.)

**4. Reject caveman-shrink MCP middleware.** Probe rationale (`docs/audit/external-refs-probe.md` line 71) strengthened by T1 finding: caveman-shrink injects compression at message-send time via MCP transport. This conflates skill-level discipline (the AI chooses how to phrase) with transport-level rewrite (the middleware mutates outgoing bytes). Two failure modes follow:
- **Unreviewable diffs**: a commit message authored under caveman-shrink looks different from what the AI generated, with no record of what was rewritten. Code review loses signal.
- **Skill discipline erosion**: if the middleware can rewrite, the skill itself can be sloppy. Caveman skill works because the AI internalizes terseness; outsourcing to a middleware breaks that loop.

Reject for dev-flow. Document the rejection here so future contributors don't re-litigate.

**5. Statusline-badge decision deferred.** Per probe direction (line 165), wait until `dev-flow-compress` is hardened before deciding whether to adopt caveman's `CAVEMAN_STATUSLINE_SAVINGS` badge contract for dev-flow. Recorded as sprint OQ1; revisit in Sprint 042+.

## Alternatives considered

1. **Fork mattpocock variant as a minimal in-repo caveman skill.** Rejected — adds a SKILL.md to maintain in lockstep with upstream; dev-flow already has `dev-flow-compress` for compression-of-prose use cases. No net benefit.

2. **Fork juliusbrussee plugin into dev-flow.** Rejected — duplicates the entire plugin layer (hooks, MCP, statusline) that the user already has installed; massive surface to maintain; contradicts the meta-repo principle.

3. **Adopt caveman-shrink MCP for "free" compression.** Rejected — middleware-level rewrite violates the reviewability and skill-internalization principles above. Cost (loss of signal) > benefit (mechanical token reduction).

4. **Decide statusline-badge in this sprint.** Rejected — probe explicitly defers; coupling the badge to `dev-flow-compress` requires that skill to be hardened first. Premature decision.

5. **Implement TASK-115 inline in Sprint 041.** Rejected — port = real code (two scripts + tests + tokenizer parity verification); decision-only sprint shape (Sprint 040 retro candidate #4) keeps planning surface clean. TASK-115 deserves its own sprint with explicit gates.

## Consequences

**Positive**:
- Caveman lineage explicit + version-pinned across two variants. Re-diffs deterministic via `gh api` + recorded SHAs.
- TASK-115 has a complete design input — port shape, tokenizer choice, snapshot schema, risk matrix all locked. Implementation sprint can run with zero re-research.
- caveman-shrink rejection rationale documented; future contributors (or future-me) won't re-evaluate it.
- ADR registry honest about which external patterns dev-flow examined and which it intentionally declined.

**Negative** (trade-offs accepted):
- Two SHA pins to maintain in re-diff cycles (juliusbrussee + mattpocock). Mitigation: re-diff scheduled with EPIC-Audit retro pass (Sprint 047) — one batch update.
- Statusline-badge decision still open (OQ1). Mitigation: probe direction is explicit; decision unblocks once `dev-flow-compress` hardens.

**Neutral**:
- No skill / agent / hook / code surface change in dev-flow. Plugin version unchanged; no PATCH bump warranted.
- ADR file lives at `docs/adr/ADR-020-caveman-patterns.md` per Sprint 039 ADR-016 + Sprint 040 ADR-019 sequential precedent. `docs/DECISIONS.md` remains frozen at ADR-001..015.
- TASK-115 backlog annotation links to T2 research note (sprint close handles that update).

**EPIC-Audit Phase 4b closed** — Sprint 041 caveman compare shipped.

## References

- Upstream juliusbrussee: https://github.com/juliusbrussee/caveman (MIT, SHA `ef6050c5e184`)
- Upstream mattpocock: https://github.com/mattpocock/skills (MIT, SHA `b843cb5ea74b`)
- T1 research note: `docs/research/caveman-skill-diff-2026-05-04.md`
- T2 research note: `docs/research/caveman-eval-harness-port-notes-2026-05-04.md`
- Sprint plan: `docs/sprint/SPRINT-041-caveman-compare.md`
- Probe origin: `docs/audit/external-refs-probe.md`
- Sprint 034 3-arm-in-spirit: `docs/DECISIONS.md` § ADR-001
- Sprint 040 ADR-019 lineage precedent: `docs/adr/ADR-019-karpathy-patterns.md`
