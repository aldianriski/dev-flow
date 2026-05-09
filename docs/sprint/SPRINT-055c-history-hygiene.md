---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: active
plan_commit: TBD
close_commit: TBD
---

# Sprint 055c — History Hygiene Plugin Principle + Legacy-Doc Scan (TASK-134a + TASK-134b)

**Theme:** Pre-v1 doc-rot prevention. Two-task paired sprint codifying plugin-wide history hygiene contract (CONTEXT.md + ADR-034) and applying legacy-doc cleanup scan + verdicts. Closes Sprint 055b mid-sprint Friction Protocol DEFER scope.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 055b closed `be46f3f` (TASK-128 token audit + TASK-NEW DEC-3 codify + TASK-133 Output Discipline plugin principle).
**Closes:** TASK-134a (History Hygiene principle) · TASK-134b (Legacy-doc scan + cleanup).

## Why this sprint exists

Two pre-v1 doc-rot quality gates converge:

1. **TASK-134a (History Hygiene principle)** — Sprint 055b T3 close surfaced compounding bloat: TODO.md Active Sprint ribbon at 8 closed-sprint pointer narratives + verbose closed-task rows (TASK-133 row alone ~50 lines); existing hygiene rules (TODO.md L26-29) under-enforced. Risk = doc-bloat compounds linearly per sprint; new-session render cost grows; v1 ship inherits bloat baseline. Plugin-wide principle in CONTEXT.md + ADR + multi-surface application.
2. **TASK-134b (Legacy-doc scan)** — Same session surfaced repo-root deprecated docs (AUDIT.md, AUDIT_PASS2.md, BASELINE_ASPECT.md, READINESS.md, STRATEGY_REVIEW.md, AI_WORKFLOW_BLUEPRINT.md candidates) lingering with no incoming references. Need systematic scan + classify + apply verdicts before v1 ship surfaces them as canonical artifacts.

**Pairing rationale:** Principle (134a) defines rules; scan (134b) applies + tests them on real legacy artifacts. Same sprint maximizes feedback loop — scan results feed back into principle hygiene rules if gaps surface mid-sprint.

**Pre-locked decisions** (user 2026-05-10): Pick A confirmed; Sprint 055c paired sprint (T1+T2 = 134a phases · T3+T4 = 134b phases); ADR required; scope WIDE (TODO.md + sprint files + CHANGELOG + ADRs/Roadmap + repo-root legacy candidates).

## Plan

### T1 — TASK-134a Phase 1: CONTEXT.md § History Hygiene + ADR-034

**Acceptance:**
1. `.claude/CONTEXT.md` gains § History Hygiene (≤25 lines) with rules per surface:
   - **TODO.md Active Sprint ribbon:** ≤3 most-recent closed-sprint pointers; older → archive narrative to CHANGELOG row.
   - **TODO.md closed task rows (P0/P1):** verbose acceptance summaries collapse to 1-line pointer (`closed Sprint NNN <sha> — <one-line summary>`) after 1-sprint cooldown.
   - **Sprint files retro:** Worked/Friction/Pattern sub-sections cap each at ≤6 bullets; old surprise-log entries archive after close.
   - **CHANGELOG.md:** per-sprint row caps (~12 lines headline + 6 bullets max); deeper detail lives in sprint file.
   - **Roadmap (TODO.md):** done-cluster blocks (≥5 consecutive done sprints in same EPIC/theme) collapse to 1-line summary pointing to CHANGELOG range.
   - **Apply-when:** at Sprint Close (lean-doc) AND at Sprint Promote (lean-doc Step 1.5c new) — sweep eligibility before plan write.
   - **Rationale:** Doc-bloat compounds linearly per sprint; principle codified plugin-wide to prevent per-skill drift; mirrors Output Discipline (ADR-033) plugin-principle pattern.
2. `docs/adr/ADR-034-history-hygiene.md` written (5 decisions: principle home + per-surface rules + apply-when triggers + collapse-vs-delete policy + re-litigation lock).

**Scope:** IN — write CONTEXT.md section + ADR; lock principle. OUT — apply rules to existing files (T2 scope), automated lint (TASK-116-v2), per-skill SKILL.md pointer fan-out (deferred — different cost/value than Output Discipline; revisit post-T2 verdict).
**Files:** `.claude/CONTEXT.md` · `docs/adr/ADR-034-history-hygiene.md` NEW.
**Risk:** low — additive principle; no behavior contract change to skills.
**DoD:** CONTEXT.md edited; ADR-034 written; TODO.md TASK-134a phase 1 verified inline.
**Confidence:** 82% — uncertainty: collapse-vs-delete cooldown threshold (1 vs 2 sprints) — pick 1-sprint per existing TODO.md L27 hygiene rule precedent.

### T2 — TASK-134a Phase 2-4: Apply rules to TODO.md + sprint files + CHANGELOG + Roadmap

**Phases:**
- **T2.1 (Phase 2 — TODO.md ribbon + closed rows):** Active Sprint ribbon (lines ~40-77) trim to last 3 closed sprints (055b · 054b · 054); older narratives archive to CHANGELOG (already partly there). Collapse closed P0 rows: TASK-119, 120, 121, 122a, 122b, 123, 124, 125, 126, 127, 128, 130, 131, 129, 133 → 1-line pointer each (`closed Sprint NNN <sha> — <≤80-char summary>`). Preserve TASK link to sprint file.
- **T2.2 (Phase 3 — sprint files):** Apply retro caps to Sprint 055b (most recent; pattern check). If Worked/Friction/Pattern >6 bullets each → trim oldest. Archive surprise-log entries inline (already done in 055b; verify pattern). Pattern audit on prior 3 sprints (054, 054b, 053b); apply if breach.
- **T2.3 (Phase 4 — CHANGELOG.md):** Audit Sprint 055b row (lines 21-33) — 12 lines OK; check prior 5 entries; trim if breach. Audit Roadmap (TODO.md lines 196-235) — collapse done-cluster blocks: Sprint 0-13 already 1-line; Sprint 14-17 already 1-line; Sprint 18-20 already 1-line; Sprint 21-24 already 1-line; Sprint 28-29 ≥2 lines candidate; Sprint 35-37 ≥3 lines candidate. Apply per principle.

**Acceptance:**
1. TODO.md Active Sprint ribbon trimmed to ≤3 closed-sprint pointers (was 8).
2. ≥10 verbose closed-task rows collapsed to 1-line pointer (15 candidates listed in T2.1).
3. Sprint 055b retro sub-sections audited; trim only if >6 bullets.
4. CHANGELOG.md last 5 entries cap-audited; trim only if breach.
5. Roadmap done-cluster blocks (≥5 consecutive done sprints same EPIC) collapsed to 1-line.
6. No broken cross-references after collapse (verified via grep for TASK-NNN + Sprint-NNN-* refs).

**Scope:** IN — apply T1 rules to existing files; verify cross-references intact. OUT — sprint file template formalization (deferred to TASK-116-v2); automated lint (TASK-116-v2).
**Files:** `TODO.md` · `docs/CHANGELOG.md` · `docs/sprint/SPRINT-055b-token-output-discipline.md` (if breach) · `docs/sprint/SPRINT-054*.md` (if breach) · `docs/sprint/SPRINT-053b*.md` (if breach).
**Risk:** medium — bulk text removal; cross-reference verification critical to avoid broken `TASK-NNN` / `Sprint-NNN` links elsewhere.
**DoD:** all 6 acceptance items met; grep verification clean; sprint file Files Changed row per file; commit before T3.
**Confidence:** 70% — uncertainty: collapse pattern for Active Sprint ribbon (preserve last close-commit context vs strict 3-pointer cap); cross-ref verification scope (full repo grep vs targeted).

### T3 — TASK-134b Phase 1: Write `scripts/scan-legacy-docs.js`

**Acceptance:**
1. `scripts/scan-legacy-docs.js` exists + runnable (Node ≥18, no external deps preferred — fall back to `glob` + native `child_process` for `git`).
2. Scan logic: walk `*.md` files in repo (exclude `node_modules`, `.git`, `.claude/plugins/`); for each file compute:
   - Incoming references: count `git grep -l <basename>` matches (excluding self).
   - Age: `git log -1 --format=%ar <file>` (relative age) + last-commit date.
   - Frontmatter status: parse YAML frontmatter; flag `status: deprecated` or missing.
3. Flag candidates: incoming-refs == 0 AND (age > N-sprints-equivalent OR status deprecated). N defaults to 90 days (~6 sprints).
4. Output: `docs/audit/legacy-doc-scan-<date>.md` with per-file table (path | refs | age | status | verdict-suggestion).

**Scope:** IN — scan script + report generation. OUT — apply verdicts (T4), automated git-blame attribution, content-similarity dedup detection.
**Files:** `scripts/scan-legacy-docs.js` NEW · `docs/audit/legacy-doc-scan-2026-05-10.md` NEW (output target).
**Risk:** low — read-only scan; `git grep` shell-out cross-platform (Windows + POSIX).
**DoD:** script committed; runs clean; output file generated; TODO.md TASK-134b phase 1 verified inline.
**Confidence:** 75% — uncertainty: cross-platform `git grep` invocation (Windows Git Bash vs PowerShell); YAML frontmatter parser (regex vs `js-yaml` dep — prefer regex no-dep).

### T4 — TASK-134b Phase 2-3: Run scan + classify + apply verdicts

**Phases:**
- **T4.1 (Phase 2 — run + classify):** Execute `node scripts/scan-legacy-docs.js`; review per-file table; classify each finding (archive to `docs/archive/` · delete · keep-with-reason). Surface verdicts to user for batch confirm OR per-file decision.
- **T4.2 (Phase 3 — apply verdicts):** Apply user-confirmed verdicts:
  - **archive:** `git mv` to `docs/archive/<basename>` (NEW dir if needed); add 1-line frontmatter pointer-back annotation.
  - **delete:** `git rm`; preserve in git history.
  - **keep-with-reason:** add `status: legacy-keep` + 1-line rationale to frontmatter; document in audit report.
- Update `docs/codemap/CODEMAP.md` if module count changes (Codemap auto-refresh on commit handles this; verify post-commit).
- Verify no broken cross-refs after move/delete via `git grep <basename>` for each archived/deleted file.

**Acceptance:**
1. `docs/audit/legacy-doc-scan-2026-05-10.md` updated with verdicts per file.
2. All decided files moved/deleted/annotated per verdict.
3. No broken cross-references (verified via grep).
4. `docs/archive/` dir exists if any file archived; gitignored or tracked per user decision (default: tracked, archive is permanent reference).

**Scope:** IN — apply user-confirmed verdicts; cross-ref verification. OUT — content rewrite of kept files (separate task); CODEMAP.md L0 narrative update if module count drops (deferred to next codemap-refresh hook fire).
**Files:** `docs/audit/legacy-doc-scan-2026-05-10.md` UPDATE · candidate legacy docs (likely: `AUDIT.md`, `AUDIT_PASS2.md`, `BASELINE_ASPECT.md`, `READINESS.md`, `STRATEGY_REVIEW.md`, `AI_WORKFLOW_BLUEPRINT.md` — verdicts pending T4.1 scan output) · `docs/archive/` NEW dir (if any archive verdict).
**Risk:** medium — file moves/deletes are reversible via git but cross-ref breakage hard to catch automatically; user confirm gate required before bulk apply.
**DoD:** all 4 acceptance items met; HITL confirm gate at T4.1 → T4.2 transition; sprint file Files Changed row per file moved/deleted.
**Confidence:** 65% — uncertainty: user verdict per-file vs batch (HITL pause point); discovery of additional candidates beyond pre-flagged 6.

### T5 — Sprint close
**Acceptance:** standard Sprint Close protocol per `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md`.

## G1 (anti-slip per ADR-031)

```
goal: Plugin-wide History Hygiene principle codified (CONTEXT.md + ADR-034) + applied to TODO.md/sprint-files/CHANGELOG/Roadmap + legacy-doc scan script + verdicts applied to repo-root deprecated artifacts.
size: M (T1 S + T2 M + T3 S + T4 S-M = M total)
constraints: cross-reference integrity (T2 + T4 both edit/move files referenced elsewhere); HITL pause at T4.1 → T4.2 user verdict gate; release-debt depth = 5 (post-052b chain) — surface as Open Question, not block (≥7 threshold not met per Step 1.5b).
layers: governance, docs, scripts
red flags:
  - Cross-ref breakage after T2 collapse OR T4 file moves — grep verify before commit.
  - Mid-sprint scope creep: T2 may surface MORE bloat candidates beyond 15 listed; defer to follow-up sprint per Mid-Sprint Friction Protocol.
  - T4 verdict ambiguity: if user defers per-file decision, halt and prompt; do NOT auto-classify.
  - Plugin-principle pattern reuse: T1 mirrors ADR-033 shape; do NOT introduce new pattern shape mid-sprint.
focus: ONLY principle codification (T1) + apply (T2) + scan tooling (T3) + verdict apply (T4); NOT lint automation (TASK-116-v2 Sprint 055), NOT per-skill SKILL.md pointer fan-out (different cost/value — revisit post-T2).
context-budget: ~70k tokens (T1 ~15k + T2 ~25k bulk-edit + T3 ~10k script + T4 ~20k scan + verdicts).
explicit-gaps:
  - Per-skill SKILL.md History Hygiene pointer-line fan-out (defer post-T2; different from Output Discipline cost/value)
  - History Hygiene lint automation (defer TASK-116-v2 Sprint 055)
  - Sprint file template formalization w/ retro cap enforcement (defer TASK-116-v2)
  - CODEMAP.md L0 narrative update post-T4 if module count drops (auto-handled by codemap-refresh hook on commit)
  - release-debt depth=5 P0 escalation (Step 1.5b ≥5 auto-escalate threshold met) — surface to user post-G1, separate sprint
done-confirmation:
  - .claude/CONTEXT.md gains § History Hygiene (≤25 lines)
  - docs/adr/ADR-034-history-hygiene.md written
  - TODO.md Active Sprint ribbon ≤3 closed-sprint pointers
  - ≥10 verbose closed-task rows collapsed to 1-line pointer
  - Sprint 055b retro caps verified (trim if >6 bullets per sub-section)
  - CHANGELOG last 5 entries cap-audited
  - Roadmap done-cluster blocks collapsed
  - scripts/scan-legacy-docs.js exists + runnable
  - docs/audit/legacy-doc-scan-2026-05-10.md written w/ verdicts
  - all decided legacy files moved/deleted/annotated
  - no broken cross-refs (grep verified)
status: PASS
```

## Execution Log

(empty — populated during T1-T5)

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|

(empty — populated during execution)

## Decisions

(empty — populated when significant decisions surface)

## Open Questions for Review

### 2026-05-10 | Pre-promote — release-debt depth at threshold — RESOLVED defer to Sprint 056
Step 1.5b release-debt scan: last MINOR lockstep manifest bump = Sprint 052b (2.5.0→2.6.0). PATCH-only sprints since: 053b T7 propagation + 053c + 054 + 054b + 055b = **5 PATCH-only sprints** post-052b reconcile. By Step 1.5b rule **≥5 → auto-escalate P0**. Threshold ≥7 BLOCK NOT met (5 < 7); Sprint 055c proceeds.

**Verdict 2026-05-10 (user):** defer reconcile to Sprint 056 v1-ship — natural MINOR/MAJOR lockstep moment per ADR-032 DEC-2. No separate 055d reconcile sprint. Re-confirm at 055c retro / 056 plan promote.

## Retro

(empty — populated at Sprint Close)
