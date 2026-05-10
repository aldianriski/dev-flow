---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: ADR status change
status: decided
sprint: 059
---

# ADR-037: Skill + agent cleanup — arch-grill MERGE + dispatcher REMOVE (v4.0.0 MAJOR)

**Date**: 2026-05-10
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 058 SDLC coverage audit (`docs/audit/SDLC-coverage-2026-05-10.md`) surfaced two redundancy candidates with empirically-verified zero-or-near-zero invocation counts:

**R1 — `skills/architecture-grill/`:**
- User-invoked only path; never spawned in standard workflow per Sprint 057 conversation 2026-05-10 + Sprint 058 audit T1 invocation column.
- 5 review lenses (correctness · scalability · coupling · operational · resilience) overlap heavily with `design-analyst` agent's G2 architectural-review responsibilities — currently inconsistent: design-analyst fires automatically at G2, architecture-grill waits for human invocation that rarely happens.
- Result: 5 lenses are an OPTIONAL ad-hoc review, when they should be a STANDING G2 review.

**R3 — `agents/dispatcher.md`:**
- Sprint 057 R3 grep evidence (re-verified Sprint 058 T1): **zero invocations** of `subagent_type:dispatcher` OR `Agent\([^)]*dispatcher\)` across all plugin source code (skills/ + agents/ + scripts/ + .claude/).
- Only 2 prose references to "dispatcher" outside the agent file itself (architecture-grill SKILL.md L88 + orchestrator phases.md L225) — both descriptive, not invocation calls.
- The orchestrator skill IS the dispatcher's logic; the agent file is descriptive doc that misleads readers into thinking dispatcher is invocable.

**Joint rationale for one ADR (DEC-5):** both verdicts share "zero-empirical-use → fold into existing surface" rationale shape; both ship in same v4.0.0 MAJOR per release-debt discipline (ADR-032 DEC-3); separate ADR-037 + ADR-038 would duplicate Context section without adding decision content. Sprint 059 D-B pre-locks joint coverage.

## Decision

**DEC-1: REMOVE `skills/architecture-grill/` directory entirely (R1).** Including SKILL.md + references/. No deprecation period; v4.0.0 MAJOR class permits clean cut. ADR-027 boundary respected (release-patch HARD-rejects MAJOR; manual lockstep bump per D-C / 5th-instance pattern).

**DEC-2: MERGE 5 review lenses into `agents/design-analyst.md` (R1 mitigation).** Lenses (correctness · scalability · coupling · operational · resilience) become STANDING G2 review (auto-applied), not ad-hoc. Body content lives in NEW `agents/references/lenses.md` (≤80 lines; agent SKILL ≤30 cap respected via pointer-line). Establishes `agents/references/` subdirectory pattern for agents needing more body content than 30-line cap permits — mirrors existing `skills/<name>/references/` pattern.

**DEC-3: REMOVE `agents/dispatcher.md` (R3).** Agent file deleted. Roster reduces 7 → 6. The orchestrator skill remains the role's actual executor; no behavior change to dispatch surface (which was always the orchestrator skill anyway per zero-grep evidence).

**DEC-4: FOLD dispatcher role description into `skills/orchestrator/SKILL.md`.** New § "Dispatcher Role" subsection (≤15 lines body; cap-headroom 7 lines respected — orchestrator SKILL.md was 93/100 OK tier; new content fits). Captures responsibilities + dispatch rules previously in agent file. CONTEXT.md § Agent Roster row removed lockstep.

**DEC-5: Joint ADR (single ADR-037 covers BOTH R1 + R3).** Saves separate ADR-038 (per Sprint 059 D-B). Both verdicts share Context (zero-empirical-use), Decision shape (REMOVE + fold into existing surface), and Consequences (component count reduction · MAJOR class · rollback path). Splitting into two ADRs would duplicate ~80% of content without adding decision granularity.

**DEC-6: `--grill` flag preserves strict 1-question-at-a-time mode** (per Sprint 059 D-E). Mitigates R1 MERGE risk of losing the ad-hoc strict-mode surface. Default = batched G2 plan + lenses; `--grill` invocation = strict 1-Q-at-a-time interview before applying lenses. Distinct from Flow Grill batched + follow-up pattern (ADR-036 DEC-3) — that's planning convergence; this is design stress-test. Both grill patterns coexist; `lenses.md § Grill Mode` documents the distinction.

**DEC-7: v4.0.0 MAJOR class** (per Sprint 059 D-A · D-C). Skill removal + agent removal = trigger contract change per CLAUDE.md L132 ("MAJOR = phase/gate/hook contract change"). Single MAJOR per release-debt discipline (ADR-032 DEC-3) — no intermediate v3.2.x. Manual sprint-less bump pattern (5th instance: Sprint 052b T1 + Releases 2.7.0 / 3.0.0 / 3.1.0 / this 4.0.0); release-patch HARD-rejects MAJOR per ADR-027 boundary.

## Alternatives considered

1. **Keep `architecture-grill` as deprecated; soft-remove in v5.x.** Rejected. Sprint 058 audit verdict was clean MERGE (5 lenses fold to standing G2 review); deprecation period preserves an unused user-facing surface for one or more sprints, contradicting the audit's "remove → simplify" direction. Clean cut at MAJOR boundary is the discipline.

2. **Two separate ADRs (ADR-037 R1 + ADR-038 R3).** Rejected per DEC-5. Both verdicts share rationale shape; combined ADR is ~80% smaller than two separate ADRs without losing any decision content. Future maintainability also better — one cross-reference point for "v4.0.0 cleanup" rather than two scattered ADRs.

3. **Keep `dispatcher.md` as descriptive doc; just clarify "not invocable".** Rejected. The file claims `tools: ... Agent` (i.e., the Agent dispatch tool), implying it IS invocable. Adding a "NOT invocable" disclaimer would be the third place to maintain dispatcher description (after orchestrator SKILL.md + this disclaimer). Removal + single canonical home (orchestrator SKILL.md) is cleaner.

4. **Defer to v4.1.0 MINOR alongside testing skill (Sprint 060).** Rejected. Sprint 060 v4.1.0 MINOR is for new-skill addition; bundling skill removal there would mix MAJOR-class change (removal = breaking) with MINOR-class change (addition). Semver discipline (CLAUDE.md L132) requires removal in MAJOR bump. Sprint 059 = correct cut.

5. **Replace `architecture-grill` with renamed `design-grill` skill.** Rejected. Audit verdict was MERGE, not RENAME. Renaming preserves the duplicate surface (now design-analyst auto-G2 + design-grill manual); doesn't address the "5 lenses should be standing, not ad-hoc" finding.

## Consequences

**Positive:**
- 5 review lenses (correctness · scalability · coupling · operational · resilience) become STANDING G2 review (auto-applied), not waiting for ad-hoc invocation that rarely happens. Strengthens O3 architecture coverage from "hope user grills" to "always applies at G2".
- Plugin component count reduces: skills 16 → 15, agents 7 → 6. Simpler mental model for adopters; one less skill + one less agent to learn.
- `agents/references/` subdirectory pattern established — generalizes the existing `skills/<name>/references/` convention, providing growth path for agents with body content exceeding 30-line cap.
- ADR-037 single canonical reference for v4.0.0 cleanup (not two scattered ADRs); easier cross-linking from CHANGELOG / sprint files / future audit work.
- `--grill` flag preserves strict 1-Q-at-a-time mode for explicit invocation; ad-hoc-strict use case still available, just behind a flag instead of a separate skill.

**Negative (trade-offs accepted):**
- v4.0.0 MAJOR bump is a breaking change for adopters who scripted `/architecture-grill` invocation (low-likelihood per zero-empirical-use evidence; documented in CHANGELOG migration note).
- `agents/dispatcher.md` removal may briefly confuse adopters who saw the file in v3.x and believed dispatcher was invocable; CHANGELOG v4.0.0 entry explicitly clarifies "dispatcher role lives in orchestrator skill".
- New `agents/references/` subdirectory adds a directory to scan for plugin auto-discovery; verified non-conflicting with existing skill auto-discovery (different parent dir).
- Component-count change requires lockstep updates to: USER-OUTCOMES.md (skills 16→15, agents 7→6) · CONTEXT.md § Agent Roster (7 rows → 6) · README.md banner (v3.1.0 → v4.0.0) + components table. Sprint 059 T6 handles all in single propagation pass.

**Neutral:**
- Rollback path: `git revert <T1+T2+T6 commits>` restores `skills/architecture-grill/` + `agents/dispatcher.md` + bumps version back to 3.1.0. design-analyst.md reverts to pre-merge state (no 5 lenses inline; references/lenses.md deleted in revert). Worst-case rollback ~30 min execution.
- ADR-037 file at `docs/adr/ADR-037-skill-and-agent-cleanup-v4.md` per locked convention (Sprint 043 DEC-7). ID verified non-colliding (max ADR was 036 post-Sprint-057).
- design-analyst.md cap-headroom: 27/30 (3-line headroom OK tier post-merge); was 30/30 (zero-headroom WARN-equivalent) pre-merge. NET IMPROVEMENT.
- orchestrator SKILL.md cap-headroom: estimated 95/100 post-Dispatcher-Role-subsection-add (was 93/100); 5-line headroom WARN tier preserved per cap-headroom discipline.
- No release-patch invocation per ADR-027 boundary; manual MAJOR bump 5th-instance pattern.

## References

- ISSUE origin: Sprint 058 SDLC coverage audit T2 verdicts (R1 + R3) · `docs/audit/SDLC-coverage-2026-05-10.md` § Gap Analysis.
- ADR-006 — plugin lockstep version bump (3.1.0 → 4.0.0 lockstep applies).
- ADR-015 — one-way dispatch contract (dispatcher → specialists; preserved post-removal as orchestrator skill enforces same contract).
- ADR-026 — User-Project Outcome lens (R1+R3 verdicts O-tagged O3+O5; standing principle per Sprint 058 D-G carried forward as Sprint 059 D-G).
- ADR-027 — release-patch boundary (HARD-rejects MAJOR; manual bump path).
- ADR-031 — anti-slip discipline (4 fields populated in Sprint 059 plan).
- ADR-032 — release-debt resolution + manual sprint-less bump pattern.
- ADR-034 — History Hygiene (CHANGELOG v4.0.0 row cap respected per DEC-2).
- ADR-036 — Flow Grill (distinct grill use case; this ADR's `--grill` flag is design-grill, FLOW_GRILL is sprint-grill).
- TASK-144 (Sprint 059 T1) — this codification + arch-grill REMOVE + 5-lens fold + ADR write.
- TASK-145 (Sprint 059 T2) — dispatcher REMOVE + orchestrator subsection (depends on this ADR).
- TASK-149 (Sprint 059 T6) — propagation + lockstep MAJOR bump 3.1.0 → 4.0.0.
- Memory: `feedback_plugin_principle_pattern.md` — pattern source.
- Re-evaluation cadence: post-v4.0.0 ship, watch for adopter friction reports re: arch-grill invocation expectations OR dispatcher invocation attempts. If ≥3 friction reports surface, surface as Sprint 062+ candidate for `/design-analyst --grill` UX polish or migration shim.
