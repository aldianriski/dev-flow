---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: ADR status change
status: decided
sprint: 055-2
---

# ADR-035: Eval/Measurement Scripts — NPM Dep Scope Carve-Out from ADR-002

**Date**: 2026-05-10
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 055-2 TASK-115-v2 ports caveman upstream `evals/measure.py` to Node. Upstream uses Python `tiktoken` for o200k_base BPE token counts; Node port requires `gpt-tokenizer` (npm) for parity. Research note `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` §tiktoken-parity recommends `gpt-tokenizer` (pure JS, no WASM, embeds o200k_base BPE tables).

CLAUDE.md governance Quick Rules § SCAFFOLD WORK states: "Scripts: Node.js ≥18. No bash-only constructs. Tested on Windows Git Bash + Linux." ADR-002 historically interpreted as "built-ins only" — read at face value, this would forbid `gpt-tokenizer`.

User-locked at Sprint 055-2 promote 2026-05-10 (OQ(I) + OQ(N) combined): npm dep approved for eval/measurement scripts; ADR-035 written to codify scope rather than amend ADR-002 (precedent: ADR-027 generalization-clarification ADR for prior boundary).

**Symptoms / forcing function:**

- `eval-measure.js` cannot meaningfully approximate Claude BPE token counts without a tokenizer library; word-count or char-count proxies lose 3-arm eval rigor (research §gaps R1).
- Pre-existing `package.json` already had `gpt-tokenizer ^3.4.0` in `devDependencies` (likely from earlier exploratory work) — current state already deviates from "stdlib only" interpretation; needs codification or removal.
- Other scripts in `scripts/` (`audit-baseline.js` · `eval-skills.js` · `eval-acceptance.js` · `propagate-output-discipline.js` · `scan-legacy-docs.js`) are stdlib-only by design; this carve-out should NOT relax that constraint for them.

## Decision

**5 decisions:**

**DEC-1: Two-tier script policy.** Codify two tiers under `scripts/`:
- **Tier A — Scaffold/Runtime** (`audit-*.js`, `propagate-*.js`, `scan-*.js`, `codemap-refresh.ps1`, `session-start.ps1`, `dev-flow-init.js`): Node.js stdlib only OR PowerShell built-ins only. NO npm runtime deps. Reason: these run during scaffold init, hooks, or audit cycles; must work offline + zero-install.
- **Tier B — Eval/Measurement** (`eval-*.js`): MAY use vetted npm devDependencies. Operator-install model (`npm install` precondition). Reason: measurement cost is paid once per eval run by an operator; runtime correctness > install simplicity.

**DEC-2: Operator-install model.** No runtime auto-install. `package.json` declares deps via `devDependencies` (production-equivalent for this plugin since dev-flow is a meta-tool). `evals/README.md` documents `npm install` as setup precondition. No runtime npm fetch from any script.

**DEC-3: Initial vetted dep = `gpt-tokenizer`.** Pure JS (no WASM), embeds o200k_base BPE tables, MIT licensed, single-purpose (no transitive deps that pull in heavy ecosystems). Future Tier B deps require ADR-035 amendment OR explicit user approval at sprint promote.

**DEC-4: ADR-002 unchanged.** Existing ADR-016 + Quick Rules § SCAFFOLD WORK interpretation preserved for Tier A. ADR-035 carves out Tier B; does NOT amend Tier A. ADR-002 governance for Tier A scripts remains "stdlib only."

**DEC-5: Re-litigation lock per ADR-031.** Tier A vs Tier B boundary and the specific Tier B eligibility list (`eval-*.js` only) is locked. Adding new Tier B scripts (e.g. `bench-*.js`, `profile-*.js`) requires ADR-035 amendment with a 2-decision-cycle wait period. Discussion in PR comments alone does not suffice.

## Consequences

**Positive:**

- Caveman 3-arm eval ships with real token counts (research §tiktoken-parity satisfied).
- Tier A boundary preserved — scaffold init + hooks remain zero-install + offline-capable.
- Future eval tooling (e.g., performance profiling, regression benchmarks) has a codified path; no per-script ADR thrash.

**Negative:**

- First runtime npm dep in dev-flow scripts (precedent set; future contributors may interpret broadly).
- `npm install` step adds friction for first-time eval-script users; mitigated by `evals/README.md` setup section.
- ADR-035 amendment cost when adding 2nd vetted dep (acceptable — keeps the door narrow).

**Neutral:**

- `gpt-tokenizer` is `devDependency`-classified; works for the meta-tool nature of dev-flow (not a deployed runtime).
- Cross-tool snapshot validation (caveman ↔ dev-flow) preserved per OQ(C) since both use o200k_base BPE.

## Alternatives Considered

1. **Vendored tokenizer (zero deps).** Inline a minimal BPE tokenizer (~100 lines) or use char-count proxy. Rejected — fidelity loss vs gpt-tokenizer; maintenance burden duplicates upstream tiktoken updates.
2. **Amend ADR-002 to allow npm everywhere.** Rejected — opens floodgates for Tier A scaffold; compromises offline + zero-install promise.
3. **Word-count or character-count approximation.** Rejected — loses 3-arm eval rigor; ratios become noise (research §gaps R1).
4. **`js-tiktoken` instead of `gpt-tokenizer`.** Both are valid; `gpt-tokenizer` chosen per research §tiktoken-parity recommendation (smaller, single-purpose). `js-tiktoken` retained as documented fallback if parity issues surface.

## References

- ADR-002 — original "built-ins only" governance (CLAUDE.md Quick Rules § SCAFFOLD WORK)
- ADR-016 — Node hook scripts kill (PowerShell-only for hooks; orthogonal to eval scope)
- ADR-027 — Plugin Coherence Cleanup (precedent: scope-clarification ADR pattern)
- ADR-031 — Anti-slip discipline at G1 (re-litigation lock pattern reused in DEC-5)
- `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` — port shape + tokenizer parity research
- Sprint 055-2 plan `docs/sprint/SPRINT-055-2-caveman-3arm-eval.md` OQ(I) + OQ(N) — user-locked decision context
