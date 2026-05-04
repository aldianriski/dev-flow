---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: EPIC-Audit re-evaluation OR new ext-ref pattern emerges that changes synthesis
status: current
---

# EPIC-Audit Retro — Sprints 034-046 cross-sprint synthesis

**Sprint:** 047 T4 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

Cross-sprint retro spanning the full EPIC-Audit run. Companion to ADR-025 (closeout decisions). Synthesis-not-duplication: per-sprint retros live in their respective sprint files; this file captures cross-cutting lessons.

## Scope

| Phase | Sprints | Theme |
|:-----:|:--------|:------|
| 0 | 034 | Audit reconcile + baseline + plan |
| 1 | 035 | Atomic naming rename (skill `dev-flow` → `orchestrator`; agent `orchestrator` → `dispatcher`) |
| 2 | 036 | Workflow wiring trace |
| 3 | 037 | Skill trim |
| (in-window) | 038, 039 | Foundation hardening + tooling (codemap + sprint-bulk + /prime + /release-patch) — not part of original Phase 0 plan; landed mid-EPIC |
| 4 | 040, 041, 042, 043, 044, 045 (T1) | External-ref deep-dives 4a-4f (karpathy / caveman / superpowers / mattpocock / GSD / skill-creator) |
| 5 | 046 | Stale doc refresh (ARCHITECTURE.md + AI_CONTEXT.md) |
| 6 | 047 | EPIC-Audit close (this sprint: batch-archive + TODO trim + ADR-025 + this retro) |

**Total: 13 EPIC sprints + 2 in-window foundation sprints = 15 sprints.**

## Worked

### Pattern stability across sprints

- **Decision-only sprint shape** (5 sprints — 040/041/042/043/044) became the canonical ext-ref audit shape: 1-3 research notes + 1 ADR + 0-2 mechanical lifts. Sprint 044 = 0 lifts (pure research + ADR) confirmed valid sprint variant. Sprint 045 mixed shape (1 decision + 3 mechanical) showed pattern flexibility for backlog-clearing sprints.
- **Pre-resolve OQs at promote** (6 sprints — 042-047): user "approve all" pattern eliminated mid-sprint OQ re-litigation entirely. Saved ~1 round-trip per sprint × 6 sprints. Promote-time OQ count escalated from 4 (Sprint 042) to 10 (Sprint 047) without scope drift.
- **Bidirectional findings as Decisions table category** (4 sprints — 042/043/044/045): 9 explicit "dev-flow > upstream" findings recorded. Prevents future "match upstream" pressure on those axes (e.g., Sprint 040 100-line cap > karpathy's 1100-word skill spec).
- **Decision-vs-implementation split** (5 sprints — Sprint 041 DEC-4 origin, then 042-045): research note + ADR + queued backlog TASK is canonical. 3 implementation TASKs queued (TASK-115/116/117). Pattern preserved sprint focus across heavy-content sprints.
- **gh CLI + SHA pin discipline** (Sprints 040-046): zero rate-limit hits across 6 ext-ref deep-dives. Two memory entries (`feedback_github_cli_default.md` + `feedback_gh_cli_no_leading_slash.md`) preserve discipline beyond this EPIC.

### Single sprint highlights

- **Sprint 035 atomic-rename precedent** (Phase 1) — single sprint atomic commit pattern reused for multi-file renames. Cited Sprint 043 (mattpocock bucket migration cost matrix) + Sprint 047 T1 (batch-archive 7 sprints).
- **Sprint 038/039 in-window foundation** — Node hooks killed (ADR-016) + PowerShell SessionStart + lean-doc cache + codemap base + sprint-bulk mode + `/prime` + `/release-patch` skills. Made Phase 4-6 sprints possible at all (sprint-bulk batched G1+G2; codemap helped agent navigation; release-patch HARD STOP at push). Original Phase 0 plan didn't account for these — flexibility paid off.
- **Sprint 040 karpathy lineage retroactive credit** (Phase 4a) — surfaced 4 principles in `.claude/CLAUDE.md` had been silently adopted; locked lineage with adaptation table + MIT attribution + upstream SHA. Set the lineage-record precedent for Phases 4b-4f.
- **Sprint 041 caveman dual-source pattern** (Phase 4b) — first dual-source ext-ref audit (juliusbrussee + mattpocock variants of same skill). Established research-vs-implementation split (DEC-4); load-bearing across all subsequent ext-ref sprints.
- **Sprint 042 superpowers PR template lift** (Phase 4c) — only mechanical artifact lift in EPIC (`.github/PULL_REQUEST_TEMPLATE.md`). Adapted: lifted structure, dropped maintainer-frustration tone. Pattern: lift-but-adapt for ext-ref artifacts.
- **Sprint 043 mattpocock convention adoption** (Phase 4d) — landed `.out-of-scope/` directory + 3 negative-space pointers + LOCKED `docs/adr/` convention as documented standard (DEC-7). Two structural conventions adopted in single sprint.
- **Sprint 044 GSD scale-driven defer** (Phase 4e) — first ext-ref where SCALE not concept was the reason for NO LIFT (164+ assets vs dev-flow's 24, 6.8× gap). 5 NO LIFT + 2 DEFER decisions; ZERO `.out-of-scope/` pointers (defers are scale-driven, not concept-rejecting — pointer discipline preserved).
- **Sprint 045 first-party Anthropic ref** (Phase 4f) — first non-MIT ext-ref (Apache 2.0). License divergence handled cleanly. Mixed sprint shape (T1 decision + T2/T3/T4 mechanical) closed 3 backlog items (TASK-104/117/118) in single window.
- **Sprint 046 stale doc refresh** (Phase 5) — ARCHITECTURE.md + AI_CONTEXT.md restored from `status: stale` to `status: current`. ASCII collapse per LAW 4. Cross-doc verification zero contradictions.

## Friction (recurring across sprints)

### Date-stamp drift (Sprints 042-045)

lean-doc-generator stamped 2026-05-03 in Sprint 042 + 043 + 044 + 045 promote artifacts (sprint frontmatter + research filenames). Required manual fix at promote each time. Sprint 044 retro promoted to P0; Sprint 045 T4 (TASK-118) landed Step 0b structural fix. Sprint 045 itself was promoted with wrong date (recursive irony — T4 fixes the bug that mis-stamped its own sprint plan). Sprint 046 stamped correctly post-T4 fix on first try; Sprint 047 promote stamped 2026-05-04 correctly. **Closed friction.**

Lesson: structural fixes for recurring friction are P0 even when individually small.

### Stranded sprint archive (Sprints 040-046)

release-patch skip-bump-on-docs-only blocked auto-archive flush from TODO Changelog → docs/CHANGELOG.md. 7 sprints accumulated before Sprint 047 T1 batch-archive. **Worked-around at EPIC close**, not structurally fixed. Future tooling sprint may extend release-patch to detect "EPIC close" events.

Lesson: tooling friction has compounding cost; defer fix only if cost is bounded.

### CONTEXT.md ripple risk (Sprint 045 T3)

3 additive sections to `.claude/CONTEXT.md` required re-prime + agent-context refresh checklist. Acknowledged in execution log; user prompted to re-run `/prime` at next session start. Pattern: any CONTEXT.md edit ripples to every agent + skill that reads it. **Surfaced as recurring concern, not closed.**

Lesson: ripple-risk files (CONTEXT.md, CLAUDE.md) need explicit ripple checklist on every edit.

### Scope ceiling pressure at GSD scale (Sprint 044 T1)

GSD has 164+ assets vs dev-flow's 24. 16-file read ceiling forced strategic sampling (dir listings + 4 named-file reads). Adequate but tight. Could miss subtle patterns in unread sections. **Trade-off accepted; documented for re-eval cadence.**

Lesson: ext-ref audits at >50× scale gap need explicit ceiling discipline.

### Sprint plan filename drift (Sprints 042 + 044)

lean-doc-generator named research files based on initial plan; actual content scope drove rename. T1+T2 in those sprints had filename clarification mid-execution. **Pattern: research-file naming should follow content scope, not pre-plan; allow renaming if scope shifts.**

## Pattern candidates carried forward

These patterns were proven but not yet codified in `dev-flow:lean-doc-generator` references:

1. **Ext-ref audit sprint shape template** — research notes (1-3) + ADR + 0-1 mechanical lifts + bidirectional findings as required Decisions table category. Add to `references/SPRINT_PROTOCOLS.md` as a sprint shape variant.
2. **Pre-resolve OQs at promote when scope well-understood** — 6 sprints of clean execution. Add as recommended Promote step.
3. **Decision-vs-implementation split** — research-only sprint + queued backlog TASK preserves focus. Add to lean-doc references.
4. **gh CLI + SHA pin + leading-slash discipline** — already in memory (`feedback_github_cli_default.md` + `feedback_gh_cli_no_leading_slash.md`). Cross-link from lean-doc references.
5. **`.out-of-scope/` discipline** — pointer files for CONCEPT-rejecting decisions only; SCALE-driven defers stay in ADR § Decision text. Codify as lean-doc reference rule.
6. **Mixed sprint shape (decision + mechanical)** — Sprint 045 closed 3 backlog items + 1 ext-ref in single window. Valid for backlog-clearing sprints. Add as alternate shape.

## Surprise log (cross-sprint)

- **Sprint 040 T3:** verify-step micro-protocol already shipped Sprint 035 (`414ee8e`) without explicit karpathy lineage. T3 reduced to retroactive credit. Lesson: grep before "implement" claims.
- **Sprint 042 T1:** dev-flow hook surface RICHER than superpowers (3 hooks vs 1). Audit framing assumed "we learn from them" — bidirectional in reality. Pattern (P3) crystallized.
- **Sprint 043 T1:** `zoom-out` skill is dev-flow > mattpocock (55 vs 7 lines). Inverse finding. Per-axis winner ≠ overall winner.
- **Sprint 044 T1:** GSD 164+ asset scope forced strategic sampling. 8-file ceiling adequate via dir listings. Most decisions = scale-driven defer (pattern fine, scale wrong) not concept reject.
- **Sprint 045 T3:** CONTEXT.md hit 129/130 cap (1-line headroom). Future additive lifts need cap raise OR restructuring (e.g., move § Behavioral Guidelines Lineage to references/).
- **Sprint 045 T4:** TASK-118 sprint plan itself stamped wrong date — fixed the bug that mis-stamped its own sprint plan. Recursive irony.
- **Sprint 046 T1:** old ARCHITECTURE.md cited `init-analyst` agent (never existed in v2), `MANIFEST.json` (deleted), `docs/blueprint/*` (deleted), `24 hard-stops` (no hard-stops.md). Stale-doc refresh = content audit, not just header bump.

## Quantitative outcomes

- **13 EPIC sprints + 2 in-window** (Sprints 034-047 inclusive)
- **6 external references audited** (4 MIT individual + 1 dual-MIT + 1 Apache 2.0)
- **7 ADRs landed** (ADR-019..024 per ext-ref + ADR-025 closeout)
- **9 research notes** (1 from Sprint 040 + 2 from 041 + 3 from 042 + 2 from 043 + 2 from 044 + 1 from 045)
- **9 bidirectional findings** (Sprint 042 DEC-2 / 043 DEC-2 / 044 DEC-6+9 / 045 DEC-6 — 4 sprints, 9 findings)
- **3 implementation TASKs queued** (TASK-115 caveman eval port + TASK-116 acceptance harness + TASK-117 CONTEXT.md lifts — TASK-117 closed Sprint 045 T3)
- **0 skill behavior changes shipped** during ext-ref Phase 4 (all queued to TASK-116 per ADR-021 DEC-4)
- **3 conventions adopted as documented standards** (`.out-of-scope/` Sprint 043 / `docs/adr/` Sprint 043 DEC-7 + Sprint 047 DEC-6 / behavioral-guidelines lineage Sprint 040)
- **8 trigger-phrase / lift candidates accumulated for TASK-116** (Sprint 043 DEC-1 = 5 + Sprint 045 DEC-2/4/5 = 3)

## v1 ship prep state

EPIC-Audit complete; v1 ship is unblocked. Outstanding:
- TASK-115 (caveman 3-arm eval harness Node port) — design input ready, M-size estimate
- TASK-116 (skill-triggering acceptance harness) — design input ready, S-M estimate, verifies 8 lift candidates per ADR-016/021 DEC-4
- v1 release notes / CHANGELOG entry / version bump per release-patch protocol

Recommended Sprint 048 shape: TASK-116 first (smaller, satisfies ADR-016 eval-evidence rule which TASK-115 will need). Then TASK-115 in Sprint 049. Then v1 ship in Sprint 050 with PATCH bump → MINOR bump (depending on TASK-115/116 surface) → semver-driven release.

## Re-audit cadence

- **Per-ext-ref re-diff:** annual or when upstream SHA substantively changes (per individual ADR § Re-audit cadence sections — ADR-019..024).
- **EPIC re-eval:** if a new ext-ref of comparable scope to skill-creator/GSD/superpowers emerges, evaluate as P0 EPIC candidate with Phase 0 baseline first (Sprint 034 precedent).
- **Pattern stability check:** at Sprint 060 retro (or earlier if recurring friction spikes), re-audit P1-P5 findings against then-current sprint shape.
