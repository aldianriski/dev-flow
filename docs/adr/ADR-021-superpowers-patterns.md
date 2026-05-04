---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 042
---

# ADR-021: Superpowers patterns adoption — hooks lineage + acceptance harness + PR template lift

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 042 (EPIC-Audit Phase 4c) closes the lineage gap on patterns evaluated from `obra/superpowers` (MIT, upstream commit `e7a2d16476bf`). Sprint 034 external-refs probe (`docs/audit/external-refs-probe.md` §80–112) flagged five candidates; this sprint resolved each:

1. **`hooks/hooks.json` SessionStart matcher** (`startup|clear|compact`) vs dev-flow's `startup|resume|clear|compact`. Reconciliation strategy needed.
2. **`hooks/run-hook.cmd` polyglot dispatcher shim** (cmd+bash, 47 lines). Adopt as `scripts/run-hook.ps1`?
3. **Skill-triggering acceptance harness** (`tests/skill-triggering/run-test.sh` — naive prompt → grep stream-json for skill invocation). dev-flow has zero auto-trigger acceptance tests; ADR-016 requires "eval evidence for skill behavior changes" but provides no mechanism.
4. **`.github/PULL_REQUEST_TEMPLATE.md`** — superpowers ships a strict 126-line template. dev-flow has none.
5. **`tests/` directory at plugin root** — superpowers has it; dev-flow does not.

This ADR locks all five decisions. Three research notes feed it (`docs/research/superpowers-{hooks-diff,run-hook-shim,acceptance-harness}-2026-05-04.md`).

`obra/superpowers` is NOT in user's local plugin cache — gh CLI is the sole source for upstream artifacts. SHA pin recorded in research notes and below.

## Decision

**1. Keep dev-flow `hooks.json` matcher = `startup|resume|clear|compact` (superset of superpowers).** No change to dev-flow `hooks.json`. Rationale: extra `resume` is harmless; covers session-resume scenarios that align-down would lose; no upstream PR to superpowers in this sprint (out of scope). (Sprint 042 DEC-1.)

**2. Document hook-surface divergence: dev-flow has RICHER hook surface than superpowers.** dev-flow has 3 hooks (SessionStart + PreToolUse `Bash(git add*)` chain-guard + PostToolUse `Bash(git commit*)` codemap-refresh); superpowers has 1 (SessionStart only). The audit framing assumed dev-flow learns FROM superpowers; reality is bidirectional. Re-diff cadence captures this. (Sprint 042 DEC-2.)

**3. DEFER `run-hook.ps1` shim adoption.** No backlog task. Rationale: superpowers shim solves cross-platform polyglot (cmd+bash). dev-flow is Windows-only per ADR-016. Direct-call pattern (`powershell -File <script.ps1>`) is simpler, fewer indirection layers, more debuggable at current 3-hook scale. Re-evaluation triggers documented in research note: dev-flow hook count >5 OR cross-platform reconsidered. (Sprint 042 DEC-3.)

**4. Adopt skill-triggering acceptance harness pattern; defer implementation to TASK-116.** 3-skill seed locked: `prime` (session-bootstrap, highest-frequency), `orchestrator` (workflow entry), `tdd` (code-implementation, reuses superpowers' validated naive prompt). Mode A (manual run before skill-description changes ship); upgrade to Mode B (CI on every PR) if seed grows past ~10 skills. Pattern satisfies ADR-016's "eval evidence required" rule. Implementation = its own sprint per Sprint 041 DEC-4 research-vs-implementation split. 6 implementation risks documented in research note. (Sprint 042 DEC-4.)

**5. Lift `.github/PULL_REQUEST_TEMPLATE.md` from superpowers, adapted to dev-flow.** Lift structure (problem → change → alternatives → rigor → review); drop maintainer-frustration tone (superpowers' "94% rejection rate" framing irrelevant to a single-author repo); drop superpowers-specific sections (core-library appropriateness, new-harness bootstrap acceptance test); add dev-flow specifics (sprint reference, DoD checklist from CLAUDE.md, ADR-016 skill-change eval requirement, layer values, Windows path-with-spaces / gh CLI leading-slash reminders). PR template is the ONLY non-doc/non-research file written this sprint. (Sprint 042 DEC-5.)

**6. `tests/` directory adoption — DEFERRED to TASK-116 implementation sprint.** First test files land WITH the skill-triggering acceptance harness (decision 4); creating an empty `tests/` directory now has no value. TASK-116 sprint will create `tests/skill-triggering/` with the 3-skill seed. (Sprint 042 DEC-6.)

## Alternatives considered

1. **Align-down `hooks.json` matcher (drop `resume`).** Rejected — loses session-resume signal coverage. dev-flow's superset is harmless and adds value.

2. **Adopt `run-hook.ps1` shim now for future-proofing.** Rejected — adds indirection layer with no current benefit. Direct-call is adequate at 3-hook scale; YAGNI.

3. **Implement skill-triggering acceptance harness inline in Sprint 042.** Rejected — implementation = real PowerShell script + `claude -p` integration + stream-json parsing + Windows path handling. Per Sprint 041 DEC-4 research-vs-implementation split, deserves its own sprint with explicit gates. TASK-116 captures it.

4. **Verbatim copy superpowers PR template.** Rejected — superpowers' framing assumes a public OSS project with frequent contributor PRs (94% rejection mentioned in probe). dev-flow is single-author; that tone is hostile and inappropriate. Lift structure, drop tone.

5. **Skip PR template lift entirely.** Rejected — even single-author repos benefit from a DoD checklist + sprint-reference reminder. Superpowers structure is genuinely good; reuse it.

6. **Create empty `tests/` directory now.** Rejected — empty directories don't survive `git`. First file lands with TASK-116. Premature scaffold.

7. **Defer ALL decisions to TASK-116 sprint.** Rejected — research notes + ADR-021 are the design input for TASK-116. Locking decisions here unblocks TASK-116 promotion without re-research.

## Consequences

**Positive**:
- Superpowers lineage explicit + version-pinned (`e7a2d16476bf`). Re-diff via gh CLI deterministic.
- TASK-116 has complete design input — pattern, seed picks, mode choice, integration target, risk matrix all locked. Implementation sprint runs with zero re-research.
- PR template lands a real artifact (the only one this sprint) — adopted with adaptation to dev-flow context, attribution preserved.
- 3 transferable patterns documented even where adoption deferred (extensionless filenames, silent graceful degrade, polyglot trick).
- ADR-016's "eval evidence required" rule now has a concrete mechanism (acceptance harness pattern).

**Negative** (trade-offs accepted):
- Hook-surface divergence creates re-diff overhead — superpowers may extend its hooks; dev-flow already has features superpowers lacks. Mitigation: annual re-diff cadence; bidirectional lessons captured in DEC-2.
- TASK-116 still pending implementation — eval-evidence rule has no enforcement until then. Mitigation: TASK-116 added to Backlog P1 with research note as design input.
- PR template adds checklist friction for trivial PRs. Mitigation: single-author repo; can self-tune over time. Adversarial-testing checkbox is N/A for non-skill changes.

**Neutral**:
- ADR file lives at `docs/adr/ADR-021-superpowers-patterns.md` per Sprint 039 ADR-016 + Sprint 040 ADR-019 + Sprint 041 ADR-020 sequential precedent. `docs/DECISIONS.md` remains frozen at ADR-001..015.
- PR template is contributor-visible but does NOT change plugin behavior. Plugin version unchanged; no PATCH bump warranted (release-patch will skip).
- TASK-116 backlog annotation links to T3 research note as design input.

**EPIC-Audit Phase 4c closed** — Sprint 042 superpowers patterns shipped.

## References

- Upstream: https://github.com/obra/superpowers (MIT, SHA `e7a2d16476bf`)
- T1 research: `docs/research/superpowers-hooks-diff-2026-05-04.md`
- T2 research: `docs/research/superpowers-run-hook-shim-2026-05-04.md`
- T3 research: `docs/research/superpowers-acceptance-harness-2026-05-04.md`
- T4 artifact: `.github/PULL_REQUEST_TEMPLATE.md`
- Sprint plan: `docs/sprint/SPRINT-042-superpowers-patterns.md`
- Probe origin: `docs/audit/external-refs-probe.md` §80–112
- Sprint 041 ADR-020 lineage precedent: `docs/adr/ADR-020-caveman-patterns.md`
- ADR-016 eval-evidence rule: `docs/adr/ADR-016-kill-node-hook-scripts.md`
