---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: ADR status change
status: decided
sprint: 043
---

# ADR-022: Mattpocock skill-library patterns adoption — skill-diff lineage + bucket defer + CONTEXT.md additive recommendations + .out-of-scope/ adoption + docs/adr/ convention lock

**Date**: 2026-05-04
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 043 (EPIC-Audit Phase 4d) closes the lineage gap on patterns evaluated from `mattpocock/skills` (MIT, upstream commit `b843cb5ea74b`). Sprint 034 external-refs probe (`docs/audit/external-refs-probe.md` §113–147) flagged five candidates; this sprint resolved each:

1. **Same-named skill diff** (`tdd`, `diagnose`, `zoom-out`, `task-decomposer`) — trigger-phrase + reference-graph deltas.
2. **Skill-bucket convention** (`engineering/`, `productivity/`, `misc/`, `personal/`, `deprecated/`) — adopt at 17-skill scale or defer to 20+?
3. **`CONTEXT.md` reconciliation** end-to-end — what to lift?
4. **`docs/adr/` co-located convention** — already in practice (ADR-019/020/021); lock as documented standard.
5. **`.out-of-scope/` directory** — discoverable surface for negative-space decisions.

Three research notes feed this ADR (`docs/research/mattpocock-skill-diff-2026-05-04.md`, `docs/research/mattpocock-bucket-and-context-2026-05-04.md`) plus a single landed artifact (`.out-of-scope/` directory + 3 pointer files). `mattpocock/skills` is NOT in user's local plugin cache — gh CLI is the sole source.

## Decision

**1. NO skill edits this sprint; 5 trigger-phrase lift candidates queued to TASK-116 acceptance harness.** mattpocock body content (especially `tdd` 109 lines, `diagnose` 117 lines) exceeds dev-flow's 100-line cap by design; intentional brevity preserves AI-internalization. Trigger phrases are the lift surface, not body content. 5 candidates queued: `tdd ← red-green-refactor / integration tests / test-first development`; `diagnose ← performance regression / diagnose this|debug this aliases`. Reject list explicit: `tdd ← build features|fix bugs` (vague, cross-skill collision); `diagnose ← broken|throwing|failing` (one-word, high false-positive). Per ADR-021 DEC-4 — eval evidence required before ship. (Sprint 043 DEC-1.)

**2. Bidirectional finding: `zoom-out` is dev-flow > mattpocock; NO LIFT.** mattpocock variant is 7 lines (one-shot instruction with `disable-model-invocation: true`); dev-flow has 55-line auto-trigger skill with output template + 4 rules + 2 red flags. Recording bidirectionally per Sprint 042 DEC-2 pattern to avoid future "match mattpocock" pressure. (Sprint 043 DEC-2.)

**3. `task-decomposer` is dev-flow original; no mattpocock upstream.** mattpocock has issue-tracker-workflow skills (`to-issues`, `to-prd`, `triage`) which are different domain framing (hosted issue tracker workflow vs sprint/TODO management). Lineage = dev-flow original. (Sprint 043 DEC-3.)

**4. DEFER bucket adoption per 20-skill threshold lock.** dev-flow at 17 skills + 7 agents = 24 surface; 17 < 20. Migration cost matrix (T2-A) shows S–M coordination risk on plugin auto-discovery + `bin/dev-flow-init.js` scaffold path drift; not justified at current scale. Re-eval triggers explicit: skill count = 20 OR first skill marked deprecated OR EPIC-Audit completion (Sprint 047) — explicit checkpoint to avoid silently kicking the can. Proposed bucket layout if/when adopted: `governance/` (6) + `engineering/` (6) + `productivity/` (4) + `misc/` (1, task-decomposer alone). `agents/` stays separate (different dispatch mechanics). (Sprint 043 DEC-4.)

**5. ADOPT 3 ADDITIVE `CONTEXT.md` lifts as RECOMMENDATIONS (not executed this sprint).** Per OQ-e additive-only discipline + Sprint 042 DEC research-vs-implementation split. Lifts queue to a future TASK with re-prime + agent-context refresh checklist (CONTEXT.md is read by every agent — ripple risk):
- (i) `_Avoid_:` annotation pattern → add to existing `.claude/CONTEXT.md` § Vocabulary entries
- (ii) NEW § Relationships section → between Modes and Agent Roster (capture gate ↔ mode, agent ↔ skill, dispatcher ↔ specialist)
- (iii) NEW § Flagged ambiguities section → end of CONTEXT.md (seed Sprint 035 ADR-014 rename + Sprint 039 codemap-refresh skill-vs-script + at-most-2 other historical ambiguities)

NO existing dev-flow `CONTEXT.md` section is replaced. (Sprint 043 DEC-5.)

**6. ADOPT `.out-of-scope/` directory at repo root + 3 pointer files.** Discoverable index for negative-space decisions; pointer-to-ADR pattern preserves source-of-truth in ADRs while surfacing rejected paths at repo root. Convention adapted from mattpocock (NOT verbatim content copy). 3 seeded pointers source from prior EPIC-Audit ADR DEC rows (ADR-021 DEC-3 shim, ADR-021 DEC-6 tests-dir, ADR-020 DEC-6 statusline-badge). Each pointer ≤20 lines with frontmatter (`date`, `sourcing_adr`, `re_eval_trigger`). (Sprint 043 DEC-6.)

**7. Lock `docs/adr/` co-located convention as documented standard.** Already in practice since Sprint 039 ADR-016; Sprint 040 ADR-019, Sprint 041 ADR-020, Sprint 042 ADR-021 all followed. This ADR formalizes: ADRs after ADR-015 live at `docs/adr/ADR-NNN-<slug>.md` (one file per ADR). `docs/DECISIONS.md` remains frozen at ADR-001..015 as historical record. Sequential numbering enforced via grep both surfaces before allocation (Sprint 039 retro pattern).

## Alternatives considered

1. **Lift mattpocock body content into dev-flow `tdd` / `diagnose`.** Rejected — exceeds 100-line cap (probe synthesis line 139); dev-flow brevity is intentional per CLAUDE.md DOC WORK rule. Trigger-phrase lifts are the value surface; body content is not.

2. **Adopt buckets now at 17 skills.** Rejected — 17 < 20 threshold; migration cost matrix shows ~6 substantive items + high coordination risk on plugin auto-discovery. YAGNI.

3. **Replace dev-flow CONTEXT.md sections with mattpocock format.** Rejected — different domains (workflow meta-repo vs issue-tracker-domain). NO overlap on Vocabulary; dev-flow's Principles/Gates/Modes/Agent Roster/Skill Standards/Behavioral Lineage sections are dev-flow-specific and superior in this context.

4. **Execute the 3 CONTEXT.md lifts inline in Sprint 043.** Rejected — CONTEXT.md edits ripple to every agent (read by all). Re-prime + agent-context refresh required. Per Sprint 041 DEC-4 + Sprint 042 DEC research-vs-implementation split — recommendations land here; future TASK executes.

5. **Skip `.out-of-scope/` adoption.** Rejected — ADR rejection rationale is currently the ONLY surface for negative-space decisions, and ADRs are not browsed casually. `.out-of-scope/` provides discoverable index at repo root with low maintenance cost (3 pointers × ≤20 lines).

6. **Verbatim copy mattpocock `.out-of-scope/` content.** Rejected — mattpocock pointers are issue-tracker-domain; dev-flow pointers source dev-flow ADR DEC rows. Convention adoption (file structure + frontmatter shape), not content adoption.

7. **Defer `docs/adr/` convention lock.** Rejected — convention has been in practice 4 sprints (ADR-016/019/020/021); silence makes it emergent rather than documented. Lock now while pattern is fresh.

## Consequences

**Positive**:
- mattpocock lineage explicit + version-pinned (`b843cb5ea74b`). Re-diff via gh CLI deterministic.
- 5 trigger-phrase lift candidates documented with reject list; TASK-116 has clear input.
- Bidirectional finding on `zoom-out` recorded — avoids future "match upstream" pressure.
- Bucket-migration cost matrix preserved for future implementation sprint; no re-research needed when threshold hit.
- `CONTEXT.md` lift recommendations queued with re-prime checklist mandate; no silent ripple.
- `.out-of-scope/` directory + 3 pointers landed — first dev-flow non-ADR negative-space surface; pattern documented for future additions.
- `docs/adr/` convention locked — sequential allocation discipline + 1-file-per-ADR shape now part of documented standard, not just emergent practice.

**Negative** (trade-offs accepted):
- 4 deferred decisions (TASK-116 trigger-phrase verification, future bucket-migration sprint, future CONTEXT.md lift TASK, statusline re-eval per ADR-020) require active tracking. Mitigation: re-eval triggers explicit in each .out-of-scope/ pointer or backlog row.
- `.out-of-scope/` adds a fourth root-level governance surface (after `.claude/`, `.claude-plugin/`, `.github/`). Mitigation: cap = pointer files only; full content stays in ADRs.

**Neutral**:
- ADR file at `docs/adr/ADR-022-mattpocock-skill-library-patterns.md` per locked convention. `docs/DECISIONS.md` remains frozen at ADR-001..015.
- No skill / agent / hook / code surface change in dev-flow this sprint. Plugin version unchanged; no PATCH bump warranted.
- TASK-116 (queued from Sprint 042) gains additional input from this sprint's trigger-phrase candidates.

**EPIC-Audit Phase 4d closed** — Sprint 043 mattpocock skill-library patterns shipped.

## References

- Upstream: https://github.com/mattpocock/skills (MIT, SHA `b843cb5ea74b`)
- T1 research: `docs/research/mattpocock-skill-diff-2026-05-04.md`
- T2 research: `docs/research/mattpocock-bucket-and-context-2026-05-04.md`
- T3 artifacts: `.out-of-scope/{README,run-hook-shim,tests-dir-empty-scaffold,statusline-savings-badge}.md`
- Sprint plan: `docs/sprint/SPRINT-043-mattpocock-skill-library.md`
- Probe origin: `docs/audit/external-refs-probe.md` §113–147
- Sprint 042 ADR-021 lineage precedent: `docs/adr/ADR-021-superpowers-patterns.md`
- ADR-021 DEC-4 eval-evidence rule: `docs/adr/ADR-021-superpowers-patterns.md` (cross-link for TASK-116 trigger-phrase verification)
