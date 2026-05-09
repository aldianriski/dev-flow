---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: planned
plan_commit: e175dca
close_commit: TBD
---

# Sprint 052b — Release-Debt Resolution (10-sprint chain reconcile)

**Theme:** Manual MINOR reconcile 2.5.0 → 2.6.0 across 1 MINOR-class (Sprint 049 — release-patch generalize ADR-027 + dev-flow-compress drop + architecture-grill rename) + 9 PATCH (050/051a/051b/052/053/053b/053c/054/054b) chain. Fold-in 7 release-manager↔release-patch audit findings deferred from Sprint 053b T2 DOC-ONLY. Lock 5-decision ADR-032.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 053c closed `cbdafbe` (TASK-132 init-primer cleanup).
**Closes:** Backlog P0 release-debt row.

## Why this sprint exists

**Origin (recon-first):** Sprint 049 introduced 3 MINOR-class behavioral changes but bumped via release-patch (PATCH-only by design) — labelled PATCH semantically MINOR. Sprints 050+051a+051b+052+053+053b+053c+054+054b each bumped PATCH (or skipped via docs-only path); chain never reconciled against canonical MINOR contract. Today's 2.5.0 = accumulated PATCH; semantically work since 2.4.x = MINOR (ADR-026 outcome lens · ADR-027 generalize · ADR-028 init contract · ADR-029 lean-arch · ADR-030 template canonical · ADR-031 anti-slip).

**P0 promotion 2026-05-08** per `feedback_release_debt_tracking.md`: chain depth = 10 sprints (1 MINOR + 9 PATCH); threshold breached 7 sprints ago at Sprint 052; deferral risk = release-manager surfacing wrong baseline at v1 ship (Sprint 056) blocking ADR-026 outcome-led release notes.

**053b T2 7 findings (carry-forward fold-in):** (1) cross-citation gap · (2) release-manager `last-validated: 2026-04-21` stale (pre-ADR-027) · (3) invocation asymmetry · (4) `--from-sprint` flag overlap risk · (5) ADR-031 Open Q E coordination-loop violation · (6) 05-skills.md release-manager row Sprint 052b cross-link placeholder · (7) 05-skills.md release-patch row Sprint 052b cross-link placeholder.

## Open Questions (locked at promote)

- **(A) T1 reconcile path** **— lock 1:** manual reconcile only. `--minor` flag for release-patch deferred to TASK-NEW post-v1 (DEC-1). Rationale: release-patch generalization mature; MINOR-mode dispatch risks compound-changing 5 mode handlers + lockstep contract pre-v1.
- **(B) Version bump** **— lock 2:** 2.5.0 → 2.6.0 lockstep `plugin.json` + `marketplace.json`. Single CHANGELOG MINOR block consolidating 049-054b by class (Features · Behavioral · Fixes · Docs).
- **(C) T4 053b file edits** **— lock 3:** factual close-out edits permitted (Sprint 047 T1 precedent): § Files Changed resolved-via-052b row + § Retro carry-forward note. NO Execution Log rewrites; NO G1 amendments.
- **(D) ADR-032 scope** **— lock 4:** 5 decisions canonical: DEC-1 `--minor` flag scope · DEC-2 release-manager role MINOR/MAJOR vs release-patch PATCH · DEC-3 prevention mechanism (Sprint Promote Step 1.5 + auto-escalate at 3+ depth) · DEC-4 mode boundary (cross-cite; never overlap; release-patch never handles MINOR even with auto-detect) · DEC-5 re-litigation lock (`--minor` debate this sprint = HARD STOP per ADR-031).
- **(E) Cap discipline** **— lock 5 + ADR-022:** sprint file ≤120 lines · in-place ≤1-line per Sprint 054b validated default for T2 · release-manager SKILL.md current 70/80 (headroom) · release-patch SKILL.md 100/100 (in-place only).
- **(F) Coordination loop** per ADR-031 Open Q E: both SKILL.md cite each other at boundary — closes findings #1 + #5.
- **(G) Date stamp:** all artifacts 2026-05-09.

## Plan

### T1 — Manual MINOR reconcile (2.5.0 → 2.6.0 lockstep + consolidated CHANGELOG)
**Acceptance:** Edit `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` lockstep `2.5.0 → 2.6.0`. Prepend `docs/CHANGELOG.md` MINOR entry consolidating Sprint 049-054b grouped by class with short-SHA per sprint. NO release-patch invocation; NO `--minor` flag work (DEC-1). Manual edit-write-commit.
**Files:** `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `docs/CHANGELOG.md`. **Risk:** medium (manifest lockstep + CHANGELOG correctness). **ADR:** No (lockstep is ADR-006). **DoD:** both `2.6.0`; CHANGELOG MINOR block consolidating 1 MINOR (049) + 9 PATCH (050/051a/051b/052/053/053b/053c/054/054b) by class.

### T2 — release-manager + release-patch SKILL.md wire-fixes (053b findings #1-#5)
**Acceptance:** 5 in-place ≤1-line edits per Sprint 054b pattern: (a) release-manager SKILL.md cites release-patch (#1+#5); (b) release-manager frontmatter `last-validated: 2026-04-21 → 2026-05-09` (#2); (c) release-patch SKILL.md cites release-manager (#1+#5); (d) release-patch invocation parity OR explicit "auto-detect cascade — no flag" note (#3); (e) boundary clarification: release-manager `--from-sprint` MINOR/MAJOR-only; release-patch never handles MINOR (#4 + DEC-4).
**Files:** `skills/release-manager/SKILL.md` · `skills/release-patch/SKILL.md`. **Risk:** low. **ADR:** No (DEC-2/DEC-4 in ADR-032). **DoD:** 5 edits; bidirectional citations; release-manager last-validated bumped; both caps held.

### T3 — `docs/blueprint/05-skills.md` primer release-row drift propagation
**Acceptance:** Replace 053b T2 cross-link placeholders in Universal Skills table — release-manager + release-patch rows point to canonical SKILL.md paths (cross-link Sprint 052b close commit). Cap-conscious in-place collapse per Sprint 054b default (lock 5). Stamp `last_updated: 2026-05-09`.
**Files:** `docs/blueprint/05-skills.md`. **Risk:** low. **ADR:** No. **DoD:** 2 row updates; stamp bumped; zero "TODO Sprint 052b" markers.

### T4 — Sprint 053b factual close-out note (per lock 3)
**Acceptance:** 2 factual edits to `docs/sprint/SPRINT-053b-feature-usage-audit-sweep.md`: (a) § Files Changed append "T2 7 findings resolved-via-Sprint-052b `<close-SHA>`"; (b) § Retro § Carry-forward annotate "7-finding fold-in done in Sprint 052b". NO Execution Log rewrites; NO G1 amendments. Frontmatter stamp bumped 2026-05-09.
**Files:** `docs/sprint/SPRINT-053b-feature-usage-audit-sweep.md`. **Risk:** low. **ADR:** No. **DoD:** 2 edits; stamp bumped; no scope amendments.

### T5 — ADR-032 + § Decisions/Retro + sprint close
**Acceptance:** Write `docs/adr/ADR-032-release-debt-resolution-and-mode-boundary.md` codifying DEC-1..DEC-5 per lock 4. Standard Sprint Close: § Decisions populated · § Retro filled · TODO.md updated (release-debt [x] · Active Sprint cleared · Roadmap row appended).
**Files:** `docs/adr/ADR-032-release-debt-resolution-and-mode-boundary.md` (NEW) · `TODO.md` · this sprint file. **Risk:** low. **ADR:** YES — ADR-032 (5 decisions). **DoD:** ADR created; sprint `status: closed`; close-SHA filled; TODO updated.

## G1 (anti-slip per ADR-031)

```
goal: Reconcile 8-sprint release-debt chain via single manual MINOR bump 2.5.0→2.6.0 + fold-in 7 release-manager↔release-patch audit findings from Sprint 053b T2 + lock 5-decision ADR-032.
size: M
constraints: sprint file ≤120 lines (ADR-022) · manual reconcile only (DEC-1 — no --minor flag work) · in-place ≤1-line per Sprint 054b · release-manager SKILL.md ≤80 cap · release-patch SKILL.md ≤100 cap · NO release-patch invocation (this IS the manual MINOR — release-patch handles PATCH only per DEC-4).
layers: governance, skills, docs
red flags: --minor scope-creep (DEC-5 lock) · release-manager role expansion (DEC-2 lock) · 053b Execution Log rewrite (lock 3 forbids) · primer narrative rewrite beyond row-drift (T3 ≤1-line).
focus: ONLY 8-sprint manual reconcile + 7 audit-finding fold-in + ADR-032 5 decisions; NOT --minor tooling; NOT new release-patch mode; NOT release-manager rewrite; NOT 053b scope amendments.
context-budget: ~75k tokens (recon-first done at promote: manifest read · SKILL.md pair read · 053b retro read · 05-skills.md read · CHANGELOG tail read; execution = 2 manifest edits + 1 CHANGELOG prepend + 5 SKILL.md in-place edits + 1 primer row update + 2 053b factual notes + 1 ADR write + close).
explicit-gaps:
  - release-patch --minor flag — TASK-NEW post-v1 (DEC-1).
  - release-manager rewrite OR new modes — out of scope (DEC-2).
  - 053b Execution Log/G1 amendments — forbidden by lock 3.
  - Automated release-debt depth lint — TASK-116-v2 Sprint 055.
  - Token usage audit — TASK-128 Sprint 055b.
  - v1 ship outcome-led release notes — Sprint 056 (ADR-026).
done-confirmation:
  - plugin.json + marketplace.json both `2.6.0` lockstep.
  - docs/CHANGELOG.md MINOR block prepended consolidating 049-054b by class.
  - release-manager SKILL.md cites release-patch + last-validated 2026-05-09.
  - release-patch SKILL.md cites release-manager + invocation parity note.
  - 05-skills.md zero "TODO Sprint 052b" markers; last_updated 2026-05-09.
  - SPRINT-053b § Files Changed + § Retro factual close-out notes appended.
  - ADR-032 created w/ DEC-1..DEC-5 canonical.
  - TODO.md release-debt row [x]; Active Sprint cleared; Roadmap appended.
  - Sprint file ≤120 lines.
status: PASS
```

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| `docs/sprint/SPRINT-052b-release-debt-resolution.md` | sprint | NEW — this file | low |
| `.claude-plugin/plugin.json` | T1 | 2.5.0 → 2.6.0 (MINOR — consolidates 1 MINOR-class Sprint 049 + 9 PATCH chain) | medium |
| `.claude-plugin/marketplace.json` | T1 | 2.5.0 → 2.6.0 lockstep (ADR-006) | medium |
| `docs/CHANGELOG.md` | T1 | Prepend Sprint 052b consolidated MINOR block w/ class-grouped reconcile + 049-054b cross-link | low |
| `skills/release-manager/SKILL.md` | T2 | last-validated 2026-04-21 → 2026-05-09 + 1-line Paired counterpart cite (closes 053b T2 #1+#2+#4+#5; cap 71/80 headroom) | low |
| `skills/release-patch/SKILL.md` | T2 | line 23 in-place modify — paired counterpart cite + ADR-027 boundary + auto-detect cascade note (closes 053b T2 #1+#3+#5; cap 100/100 held) | low |

## Decisions

*(T5 — DEC-1..DEC-5 per ADR-032)*

## Retro

### Worked

### Friction

### Pattern candidates

### Surprise log

## Execution Log
