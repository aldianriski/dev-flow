---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 047
---

# ADR-025: EPIC-Audit close — 6-phase external-ref alignment + 5 pattern-stability findings

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

EPIC-Audit ran across 13 sprints (Sprint 034 baseline + Sprints 035-037 rename/wiring/trim + Sprints 038-039 foundation hardening + tooling, in-window but not part of original Phase 0 plan + Sprints 040-046 deep-dives + Sprint 047 close). Goal: align dev-flow with external references, lock decisions, surface bidirectional findings, prepare for v1 ship.

This ADR closes the EPIC and locks 7 decisions covering scope, lineage roster, pattern-stability findings, deferred work, and v1 readiness. Sprint 047 T4 produces the cross-sprint retro at `docs/audit/EPIC-Audit-retro.md`.

## Decision

**1. EPIC-Audit DONE.** All 6 phases shipped. No further EPIC-Audit sprints. Future ext-ref work re-evaluates via re-diff cadence per individual ADRs (019-024); not a new EPIC. (Sprint 047 DEC-1.)

**2. Lineage roster — 6 external references audited.** All credited in `docs/CHANGELOG.md` § EPIC-Audit milestone + per-ADR References sections. Re-diff cadence = annual unless upstream substantively changes (per individual ADR § Re-audit cadence sections). (Sprint 047 DEC-2.)

| # | Reference | License | Upstream SHA pin | ADR | Sprint |
|:-:|:----------|:--------|:-----------------|:----|:-------|
| 1 | `forrestchang/andrej-karpathy-skills` | MIT | `2c606141936f` | ADR-019 | 040 |
| 2 | `juliusbrussee/caveman` | MIT | `ef6050c5e184` | ADR-020 | 041 |
| 3 | `mattpocock/skills` (caveman variant) | MIT | `b843cb5ea74b` | ADR-020 + 022 | 041 + 043 |
| 4 | `obra/superpowers` | MIT | `e7a2d16476bf` | ADR-021 | 042 |
| 5 | `gsd-build/get-shit-done` | MIT | `42ed7cee8d8d` | ADR-023 | 044 |
| 6 | `anthropics/skills/skill-creator` | Apache 2.0 | `d230a6dd6eb1` | ADR-024 | 045 |

**3. 5 pattern-stability findings codified.** Patterns held across multiple sprints — load-bearing for future ext-ref work + sprint discipline. (Sprint 047 DEC-3.)

- **(P1) Decision-only sprint shape** — Sprints 040-044 + 046 all shipped 0-2 mechanical lifts + 1-3 research notes + 1 ADR. Sprint 045 mixed shape (1 decision + 3 mechanical) also valid. Sprint 044 = ZERO landed lifts (pure research + ADR), confirming valid sprint variant. Codify in `dev-flow:lean-doc-generator` ext-ref-audit template.
- **(P2) Pre-resolve OQs at promote** — Sprints 042/043/044/045/046/047 all locked OQs at promote via "approve all" pattern. Zero mid-sprint re-litigation across 6 sprints. Pattern fully load-bearing.
- **(P3) Bidirectional findings as required Decisions table category** — 9 explicit "dev-flow > upstream" findings recorded across Sprints 042-045. Prevents future "match upstream" pressure on those axes. Codify as required category in ext-ref-audit template.
- **(P4) Decision-vs-implementation split** — research note + ADR + queued backlog task is the canonical pattern (Sprint 041 DEC-4 origin). 3 implementation TASKs queued (TASK-115 caveman eval port, TASK-116 superpowers acceptance harness, TASK-117 CONTEXT.md additive lifts — TASK-117 closed Sprint 045 T3). Pattern preserves sprint focus + creates explicit eval-evidence path.
- **(P5) gh CLI + SHA pin discipline** — Sprint 040 codified gh CLI primary; Sprint 040 retro added Git Bash leading-slash fix; Sprint 041 added SHA pin mandatory; held across 6 sprints. Two memory entries (`feedback_github_cli_default.md` + `feedback_gh_cli_no_leading_slash.md`) preserve discipline.

**4. Deferred work registry — TASK-115 + TASK-116.** Both queued for v1 ship prep sprint(s); not blocking EPIC-Audit close. Design inputs already in `docs/research/` (Sprint 041 + Sprint 042). 5+3 = 8 trigger-phrase / lift candidates queued to TASK-116 from Sprints 043/045. TASK-115 = caveman 3-arm eval harness Node port (gpt-tokenizer + snapshot schema 1:1 with caveman). TASK-116 = skill-triggering acceptance harness (PowerShell port of superpowers `run-test.sh` + 3-skill seed prime/orchestrator/tdd; verifies 8 lift candidates per ADR-016/021 DEC-4 eval-evidence rule). (Sprint 047 DEC-4.)

**5. `.out-of-scope/` discipline confirmed.** 3 negative-space pointers landed Sprint 043 (run-hook-shim / tests-dir-empty-scaffold / statusline-savings-badge). Discipline: pointer files only for CONCEPT-rejecting decisions; SCALE-driven defers stay in ADR § Decision text. Sprint 044 (GSD) + Sprint 045 (skill-creator) both confirmed discipline by NOT adding new pointers for scale-driven defers. (Sprint 047 DEC-5.)

**6. `docs/adr/` convention LOCKED + extended.** Per Sprint 043 DEC-7, ADRs ≥016 live at `docs/adr/ADR-NNN-<slug>.md` (one file per ADR); `docs/DECISIONS.md` frozen at ADR-001..015. Extended this ADR to confirm: convention held across ADR-016 (Sprint 038) → ADR-019..024 (Sprints 040-045) → ADR-025 (this sprint). Sequential allocation discipline (grep both surfaces before allocate per Sprint 039 retro) held across 7 ADR allocations without collision. (Sprint 047 DEC-6.)

**7. v1 ship prep unblocked.** All EPIC-Audit deliverables complete. Stale governance docs (ARCHITECTURE.md + AI_CONTEXT.md) refreshed Sprint 046. CONTEXT.md additive lifts shipped Sprint 045 T3 (TASK-117). lean-doc-generator hardened with Step 0b date-sanity Sprint 045 T4. Backlog clean: 2 implementation TASKs (TASK-115 + TASK-116) + this ADR closeout. v1 ship can proceed once TASK-115 + TASK-116 land + CHANGELOG entry written. (Sprint 047 DEC-7.)

## Alternatives considered

1. **Skip ADR-025; close EPIC-Audit via CHANGELOG entry only.** Rejected — 13-sprint EPIC with 6 ADR predecessors deserves explicit closeout decision. Future re-eval of EPIC outcomes needs ADR anchor. CHANGELOG entry alone is timeline record, not decision record.

2. **Bundle EPIC-Audit close into Sprint 046 close.** Rejected — Sprint 046 was Phase 5 (stale doc refresh); mixing in Phase 6 = scope creep. Per Sprint 046 OQ-3 lock, Phase 6 held for own sprint. Discipline preserved.

3. **Keep External References block in TODO.md as historical record.** Rejected — lineage is now in `docs/adr/ADR-019..024-*.md` (one ADR per ext-ref) + `docs/CHANGELOG.md` § EPIC-Audit milestone. TODO.md is for active work, not historical surfaces. Sprint 034 Phase 6 plan explicitly called for removal.

4. **Pull TASK-115 + TASK-116 into Sprint 047 to fully close ext-ref work.** Rejected — both are real implementation work (M-size each); mixing closeout with build = scope bloat. Sprint 048+ = dedicated v1 ship prep with eval-harness focus.

5. **Codify P1-P5 pattern findings as new ADRs (one per finding).** Rejected — pattern findings are descriptive of EPIC outcome, not new architectural decisions. Single ADR-025 § Decision-3 captures all 5 with Sprint cross-refs. Future patterns may warrant own ADRs if they go beyond cross-EPIC observation.

## Consequences

**Positive**:
- EPIC-Audit closed cleanly with full lineage record (ADR + CHANGELOG + retro).
- 5 pattern-stability findings codified — future ext-ref work + sprint discipline benefits from documented patterns.
- TODO.md + Backlog are now clean for v1 ship prep — only TASK-115 + TASK-116 remaining as P1 implementation work.
- 7 closed sprints (040-046) batch-archived from TODO Changelog → docs/CHANGELOG.md (closes 7-sprint stranded-archive friction structurally).
- ADR-025 makes EPIC-Audit retro sprintwide visible (cross-sprint synthesis at `docs/audit/EPIC-Audit-retro.md` per Sprint 047 T4).

**Negative** (trade-offs accepted):
- ADR-025 is large (covers 7 decisions) — single ADR rather than 7 small ones. Trade-off: closeout coherence vs ADR atomicity. Coherence wins for EPIC closeouts.
- `release-patch` skip-bump-on-docs-only friction not structurally fixed by Sprint 047 — manual batch-archive in T1 is the workaround. Future tooling sprint may extend release-patch to detect "EPIC close" events; not in scope here.

**Neutral**:
- ADR file at `docs/adr/ADR-025-epic-audit-close.md` per locked convention. `docs/DECISIONS.md` remains frozen at ADR-001..015.
- Plugin version unchanged this sprint (all docs/governance changes; no skill/agent/hook code changes). Future PATCH bump may include this ADR in CHANGELOG release notes; not required for ADR landing.
- TASK-115 + TASK-116 backlog rows preserved verbatim from Sprint 041 + Sprint 042 plus accumulated TASK-116 lift candidates from Sprints 043 + 045.

**EPIC-Audit closed** — 13 sprints / 6 phases / 6 ext-refs / 7 ADRs (019-024 + 025) / 9 research notes / 9 bidirectional findings. v1 ship prep unblocked.

## References

- EPIC-Audit retro: `docs/audit/EPIC-Audit-retro.md` (Sprint 047 T4 — cross-sprint synthesis)
- Predecessor ADRs: ADR-019 (karpathy) · ADR-020 (caveman) · ADR-021 (superpowers) · ADR-022 (mattpocock; LOCKS docs/adr/ convention) · ADR-023 (GSD) · ADR-024 (skill-creator)
- Phase 0 baseline: `docs/sprint/SPRINT-034-audit-and-plan.md` (sprint plan + DEC-1/2/etc)
- Phase 1-3 sprints: SPRINT-035-atomic-rename / SPRINT-036-wiring-trace / SPRINT-037-skill-trim
- Phase 4 sprints: SPRINT-040..045 (deep-dives 4a-4f)
- Phase 5 sprint: `docs/sprint/SPRINT-046-stale-doc-refresh.md`
- Phase 6 sprint: `docs/sprint/SPRINT-047-epic-audit-close.md` (this sprint)
- Probe origin: `docs/audit/external-refs-probe.md`
- v1 ship prep follow-on: TASK-115 (caveman 3-arm eval port — design input `docs/research/caveman-eval-harness-port-notes-2026-05-04.md`) + TASK-116 (skill-triggering acceptance harness — design input `docs/research/superpowers-acceptance-harness-2026-05-04.md` + 8 accumulated lift candidates from Sprints 043 DEC-1 + 045 DEC-2/4/5)
