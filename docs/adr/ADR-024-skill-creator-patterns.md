---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 045
---

# ADR-024: anthropics/skills/skill-creator patterns adoption — 3 lift candidates queued + 4 bidirectional findings + scale-driven defers

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 045 T1 (EPIC-Audit Phase 4f close-out) audits `anthropics/skills/tree/main/skills/skill-creator` (Apache 2.0, upstream commit `d230a6dd6eb1`) against dev-flow's `write-a-skill` skill. skill-creator is the first-party Anthropic reference for skill authoring; dev-flow `write-a-skill` is the existing in-house meta-skill. Both are skill-authoring skills.

Phase 4f closes EPIC-Audit Phase 4 (5-sprint external-ref deep-audit run started Sprint 040: karpathy → caveman → superpowers → mattpocock → GSD → skill-creator). skill-creator is the LAST external ref in Phase 4. Phase 5 (Sprint 046) handles stale doc refresh; Phase 6 (Sprint 047) closes EPIC-Audit.

Source: `docs/research/skill-creator-skill-diff-2026-05-04.md` (T1 research note, ~110 lines).

**Notable:** skill-creator is the FIRST non-MIT external ref in EPIC-Audit Phase 4 (Apache 2.0 instead of MIT). Compatible with MIT for downstream use; record as lineage detail.

## Decision

**1. Frontmatter spec — NO LIFT.** Anthropic's frontmatter is minimal (`name`, `description` required; `compatibility` rare optional). dev-flow's `write-a-skill` requires 7 fields (`name`, `description`, `user-invocable`, `argument-hint`, `version`, `last-validated`, `type: rigid|flexible`). dev-flow extras exist for explicit governance (version tracking per ADR-006, eval-validated date per ADR-016/021, rigid-vs-flexible classification, user-invocable + argument-hint for invocation UX). Stripping to minimal would lose governance signals. (Sprint 045 DEC-1.)

**2. Iteration loop framing — LIFT (queued to TASK-116).** Anthropic's skill-creation flow is iteration-heavy: Capture Intent → Interview → Write → Test Cases → Run → **Iterate (loop) until satisfied** → Description improver. dev-flow `write-a-skill` is linear single-pass: Requirements → Draft → Review. Anthropic's "iterate until satisfied" framing is more honest about skill quality requiring iteration. **Lift candidate:** add Phase 4 "Iterate" to `write-a-skill`. Queue to TASK-116 acceptance harness for behavior-change verification before merge per ADR-021 DEC-4. (Sprint 045 DEC-2.)

**3. Skill quality checklist — NO LIFT (bidirectional finding).** Anthropic enforces quality via scripts (`quick_validate.py`); dev-flow `write-a-skill` has explicit 6-item inline checklist. dev-flow's checklist is human-first and discoverable; Anthropic's script enforcement is automation-first but premature at dev-flow's 17-skill scale. Both legitimate at respective scales. (Sprint 045 DEC-3.)

**4. Reference-file conventions — LIFT TOC for >300-line refs (queued to TASK-116); DEFER domain-organization pattern; DEFER programmatic-validation scripts.** Anthropic has 3 reference-file conventions dev-flow lacks: (a) TOC for refs >300 lines, (b) domain-organization pattern (cloud-deploy/aws.md/gcp.md/azure.md per-variant), (c) programmatic validation via `quick_validate.py` + `improve_description.py`. **(a) LIFT TOC convention** — small additive cost, applies even at dev-flow scale; queue to TASK-116 as `write-a-skill` reference-file rule addition. **(b) DEFER domain-organization** — applies to cross-framework skills; dev-flow has none currently. Re-eval if first cross-framework skill arrives. **(c) DEFER programmatic-validation scripts** — separate tooling sprint, NOT TASK-116 scope (script-write, not skill-description rework). (Sprint 045 DEC-4.)

**5. Anti-patterns / Red Flags — LIFT description-pushiness anti-pattern (queued to TASK-116).** Anthropic explicitly addresses skill UNDERTRIGGERING via "description pushiness" guidance ("Make sure to use this skill whenever the user mentions X, Y, or Z, even if they don't explicitly ask for it"). dev-flow `write-a-skill` Red Flags don't cover undertriggering — only OVERTRIGGERING ("description too broad — narrows to nothing"). **Lift candidate:** add 5th Red Flag to `write-a-skill`: "Description undertriggering — be explicit about when to use; combat false-negative trigger by listing user phrases that should activate." Queue to TASK-116. Other Anthropic anti-pattern guidance (Principle of Lack of Surprise, imperative form preference) is style; not lifted. (Sprint 045 DEC-5.)

**6. Bidirectional findings — record 4 explicit dev-flow > Anthropic axes.** Per Sprint 042 DEC-2 / 043 DEC-2 / 044 DEC-6+9 pattern. (Sprint 045 DEC-6.)
- (i) Explicit quality checklist (axis 3) — dev-flow inline; Anthropic script-based.
- (ii) Tighter line cap (axis 4) — dev-flow 100; Anthropic 500.
- (iii) Explicit red-flags template (axis 5) — dev-flow `❌ **Pattern** — why` crisper than Anthropic narrative.
- (iv) Mandatory reference-file frontmatter — dev-flow requires; Anthropic does not.

**7. Scale-driven defer note.** skill-creator ships 485-line SKILL + 8 Python scripts + 3 sub-agents + eval visualization tooling. dev-flow `write-a-skill` is 81 lines + 0 scripts + 0 sub-agents. ~6× line gap; ~∞× tooling gap. Most lift candidates that aren't TASK-116-queued are scale-driven defers, not concept-rejections. **No `.out-of-scope/` pointers warranted** — defers are scale-driven (pattern fine, scale wrong) per Sprint 044 ADR-023 discipline. (Sprint 045 DEC-7.)

## Alternatives considered

1. **Lift Anthropic's full creation flow + Python scripts.** Rejected — 8-script automation gap is appropriate for Anthropic's scale (1st-party reference shipped to many users) but premature at dev-flow's 17-skill scale. Programmatic validation deferred to future tooling sprint if needed.

2. **Adopt Anthropic's 500-line SKILL.md cap.** Rejected — dev-flow's 100-line cap preserves AI internalization (per Sprint 040 karpathy finding). Going to 500 would dilute skills with content AI scans rather than internalizes. Bidirectional finding records dev-flow's preference.

3. **Strip dev-flow's 5 extra frontmatter fields to match Anthropic minimum.** Rejected — extras exist for explicit governance reasons (version tracking per ADR-006, eval-validated date per ADR-016/021). Stripping would lose audit trail.

4. **Implement iteration loop + description-pushiness + TOC convention inline in Sprint 045.** Rejected — per ADR-021 DEC-4 ("skill behavior changes require eval evidence"). All 3 lifts queue to TASK-116 acceptance harness; ship only validated phrases.

5. **Skip ADR; close Phase 4f silently.** Rejected — first-party Anthropic reference deserves explicit lineage record (Apache 2.0 vs prior MIT refs); future contributors should see explicit "considered + queued" surface.

6. **Bundle TOC convention + iteration loop + description-pushiness lifts into a single ADR (separate from this).** Rejected — ADR-024 = "considered" decisions; TASK-116 acceptance harness sprint = "implement validated lifts" with its own ADR if needed. Decision-vs-implementation split per Sprint 041 DEC-4.

## Consequences

**Positive**:
- skill-creator lineage explicit + version-pinned (`d230a6dd6eb1`). Re-diff via gh CLI deterministic.
- 3 lift candidates queued to TASK-116 (joining prior queues from Sprint 042/043/044). TASK-116 sprint will verify ALL queued candidates in single acceptance harness run.
- 4 bidirectional findings recorded (Sprint 042-045 = 9 total bidirectional findings across 4 sprints; pattern is now load-bearing for ext-ref audits).
- First non-MIT external ref handled cleanly (Apache 2.0 vs prior MIT). Lineage record notes license divergence.
- Phase 4f closes EPIC-Audit Phase 4 deep-dives; sprint roadmap clear for Phase 5 (Sprint 046 stale-doc-refresh) + Phase 6 (Sprint 047 archive + EPIC close).

**Negative** (trade-offs accepted):
- 3 deferred lifts (iteration loop, description-pushiness, TOC convention) require active tracking via TASK-116 sprint. Mitigation: TASK-116 backlog row updated (this sprint close updates).
- Programmatic-validation scripts (Anthropic's `quick_validate.py` etc) NOT queued — future tooling sprint candidate, no current owner. Acceptable: 17-skill scale doesn't warrant automation pressure yet; re-eval when scale crosses 25.

**Neutral**:
- ADR file at `docs/adr/ADR-024-skill-creator-patterns.md` per locked convention (Sprint 043 DEC-7). `docs/DECISIONS.md` remains frozen at ADR-001..015.
- Plugin version unchanged this sprint by T1 alone; T4 (TASK-118) bumps `lean-doc-generator` skill version 2.0.0 → 2.1.0 separately. Plugin-level PATCH bump may apply at sprint close (mixed sprint shape).
- skill-creator is FIRST first-party Anthropic ref in EPIC-Audit; future first-party refs (e.g., new Anthropic skills) should follow same audit shape.

**EPIC-Audit Phase 4f closed** — Sprint 045 T1 skill-creator audit shipped. Phase 4 (4a-4f) deep-dive series complete.

## References

- Upstream: https://github.com/anthropics/skills/tree/main/skills/skill-creator (Apache 2.0, SHA `d230a6dd6eb1`)
- T1 research: `docs/research/skill-creator-skill-diff-2026-05-04.md`
- Sprint plan: `docs/sprint/SPRINT-045-skill-creator-and-context-lifts.md`
- Sprint 044 ADR-023 lineage precedent: `docs/adr/ADR-023-gsd-patterns.md`
- ADR-021 DEC-4 eval-evidence rule: `docs/adr/ADR-021-superpowers-patterns.md` (cross-link — TASK-116 receives 3 new lift candidates from this ADR)
- Sprint 043 DEC-1 prior TASK-116 queue (5 trigger-phrase candidates): `docs/sprint/SPRINT-043-mattpocock-skill-library.md`
