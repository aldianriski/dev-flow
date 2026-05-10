---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: active
plan_commit: b1ae530
close_commit: pending
---

# Sprint 059 — Audit-driven cleanup batch (v4.0.0 MAJOR)

**Theme:** Execute Sprint 058 SDLC audit verdicts in single MAJOR consolidation per release-debt discipline. R1 MERGE arch-grill into design-analyst (5 lenses fold to G2 auto-fire) · R3 REMOVE dispatcher.md (zero-invocation evidence) · items 3/4/5 scope-clarification edits + README user-workflow section. v4.0.0 MAJOR lockstep per ADR-006. Workstream B + C remediation from `refined-task-list.md`.

**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 058 closed (`837b552`) · SDLC-coverage audit shipped.
**Closes:** TASK-144..150 (TODO.md § Backlog P0 cluster).
**Promote method:** Flow Grill v3.1.0 (2nd dogfood; loop ran inline from source FLOW_GRILL.md since cached plugin still 3.0.0).

## Why this sprint exists

Sprint 058 audit produced 6 verdicts requiring hard-to-reverse cleanup actions. Per release-debt discipline (ADR-032 DEC-3) + audit-first sequencing (Sprint 058 D-A pre-lock), all cleanup batches into ONE MAJOR bump rather than fragmenting across multiple small MAJOR cuts. ADR-037 captures joint R1+R3 rationale (saves a separate ADR-038 per A2).

**Verdicts being executed:**
1. R1 — MERGE `architecture-grill` into `design-analyst` (preserve `--grill` flag for strict mode)
2. R3 — REMOVE `agents/dispatcher.md` (fold role into orchestrator SKILL.md)
3. Item 3 — Codemap user-scope fix (default scans adopter repo, `--internal` for plugin self-audit)
4. Item 4 — History-rule scope clarify (dev-flow internal · adopter optional)
5. Item 5 — TODO.md collapse → CHANGELOG link integrity audit + preamble note
6. **NEW user-feedback addition:** README "How You Use It" helicopter view section (T7)

## Pre-locked decisions (8 — Flow Grill ledger 2026-05-10)

- (D-A) **Single MAJOR consolidation.** No intermediate v3.2.x; all hard-to-reverse cleanup in one bump per release-debt discipline (ADR-032 DEC-3).
- (D-B) **ADR-037 covers BOTH R1 + R3 jointly.** Saves separate ADR-038; both are skill/agent removals with shared "zero-empirical-use" rationale shape. Single ADR cites both verdicts + grep evidence + rollback path.
- (D-C) **Manual MAJOR bump.** release-patch HARD-rejects MAJOR per ADR-027 boundary; manual sprint-less bump pattern (5th instance: Sprint 052b T1 + Releases 2.7.0 / 3.0.0 / 3.1.0 / this 4.0.0).
- (D-D) **HITL gates at T1 + T6.** T1 = hard-to-reverse skill removal gates downstream; T6 = version bump + CHANGELOG per ADR-027 hard-rejects automated MAJOR.
- (D-E) **`design-analyst --grill` flag preserved.** Strict 1-Q-at-a-time mode available on explicit invocation; default = batched G2 plan. Mitigates R1 MERGE risk of losing the strict-mode surface.
- (D-F) **Push gate emit-only** per release-patch HARD STOP language (operator runs `git push origin master`). Carries forward Sprint 057+058 D-F.
- (D-G) **User-outcome lens carries forward** (Sprint 058 D-G as standing principle). Every sprint hereafter defaults to outcome-tagging without re-asking.
- (D-H) **May split 059a/059b on friction.** Sprint 058 audit T3 flagged L size (3M+3S=3 days). Attempt single-sprint first; split if execution exceeds context budget or T1 ADR write blows up.

## Anti-slip (G1 fields per ADR-031)

- **focus**: cleanup batch only — execute Sprint 058 audit verdicts; no new redundancies; no scope creep into Sprint 057 Flow Grill behavior; defer item 7 testing skill to Sprint 060
- **context-budget**: ~30-40k (T1 ~10k ADR+5-lens fold · T2 ~5k dispatcher REMOVE · T3 ~10k codemap rewrite · T4 ~3k scope edit · T5 ~3k TODO audit · T6 ~5k bump · T7 ~3k README section)
- **explicit-gaps**: Sprint 060 = item 7 test-planner skill · No push gate (operator manual) · No new feature work · No Sprint 057 Flow Grill behavior changes · No eval-acceptance Mode A live runs (operator-pending Sprint 055 OQ-C)
- **done-confirmation**: [v4.0.0 lockstep bumped AND `skills/architecture-grill/` deleted AND `agents/dispatcher.md` deleted AND `codemap-refresh.ps1` scans `$PROJECT_DIR` by default AND ADR-037 exists AND README has "How You Use It" section] WHEN [TASK-149 close commit lands]

## Plan

### T1 — Fold arch-grill 5 lenses into design-analyst + REMOVE arch-grill skill + ADR-037 (HITL gate)

**Acceptance:**
1. `agents/design-analyst.md` extended with 5 review lenses (correctness · scalability · coupling · operational · resilience) from arch-grill SKILL.md; cap-headroom respected (≤30 line agent cap may need body in `references/` if exceeded).
2. `skills/architecture-grill/` directory deleted in entirety (SKILL.md + references/).
3. New ADR `docs/adr/ADR-037-skill-and-agent-cleanup-v4.md` with Context / Decision / Alternatives / Consequences sections; covers BOTH R1 (arch-grill MERGE) + R3 (dispatcher REMOVE) per D-B; cites Sprint 058 audit findings + grep evidence + rollback path; explicitly addresses MAJOR-class risk.
4. `skills/diagnose/SKILL.md` description updated (cross-ref `architecture-grill` → `design-analyst --grill`).
5. `docs/USER-OUTCOMES.md` § Skills count 16 → 15; arch-grill row deleted; design-analyst row updated to mention 5 lenses.
6. `--grill` flag mode documented in design-analyst.md per D-E (preserves strict 1-Q-at-a-time mode for explicit invocation).

**Scope:** IN — arch-grill removal · 5-lens fold · ADR-037 · cross-ref cleanup. OUT — dispatcher removal (T2) · README updates (T7) · version bump (T6).
**Files:** `agents/design-analyst.md` EDIT · `skills/architecture-grill/` DELETE · `docs/adr/ADR-037-*.md` NEW · `skills/diagnose/SKILL.md` EDIT · `docs/USER-OUTCOMES.md` EDIT.
**Tests:** N/A (skill removal + agent prompt edit; behavioral validation deferred to Sprint 060 eval if eval-acceptance has lift candidate slot).
**Risk:** high — hard-to-reverse skill removal + cross-skill cross-refs.
**Layers:** `agents, skills, docs`.
**Depends on:** —.
**ADR:** YES (ADR-037 covers R1 + R3 jointly).
**HITL** stop-point at T1 close.

### T2 — REMOVE agents/dispatcher.md + fold role into orchestrator SKILL.md

**Acceptance:**
1. `agents/dispatcher.md` deleted.
2. `skills/orchestrator/SKILL.md` gains § "Dispatcher Role" subsection (≤15 lines body; cap-headroom respected — current 93/100 = 7-line headroom OK tier) describing responsibilities + dispatch rules previously in agent file.
3. `.claude/CONTEXT.md` § Agent Roster reduces 7 rows → 6 rows (dispatcher row removed); references in CONTEXT.md text body updated lockstep.
4. ADR-037 § Consequences references R3 grep evidence (zero invocations across plugin per Sprint 058 audit T2).

**Scope:** IN — dispatcher.md removal · orchestrator subsection add · CONTEXT.md roster edit. OUT — codemap (T3) · history scope (T4).
**Files:** `agents/dispatcher.md` DELETE · `skills/orchestrator/SKILL.md` EDIT · `.claude/CONTEXT.md` EDIT.
**Tests:** N/A.
**Risk:** medium — agent roster reduction may break adopter mental models; mitigated by ADR-037 explicit rationale.
**Layers:** `agents, skills, docs`.
**Depends on:** TASK-144 (ADR-037 written there).

### T3 — Rewrite codemap-refresh.ps1 to scan adopter repo + --internal flag

**Acceptance:**
1. `scripts/codemap-refresh.ps1` default behavior scans `$PROJECT_DIR` (excluding `$PLUGIN_ROOT/docs/`); writes adopter's codemap to `$PROJECT_DIR/docs/codemap/CODEMAP.md`.
2. `--internal` flag preserves current dev-flow self-scan behavior (writes to `$PLUGIN_ROOT/docs/codemap/`).
3. `skills/codemap-refresh/SKILL.md` description updated to lead with adopter-scope use-case; `--internal` documented as plugin-self-audit fallback.
4. Sibling test `__tests__/codemap-refresh.test.ps1` (or `.test.js`) covers both modes (default adopter-scan + `--internal` plugin-scan).
5. PostToolUse hook in `hooks/hooks.json` unchanged (still fires on commit; default behavior change is safe — adopter repo is the right target).
6. ADR-034 § Scope adds note "codemap-refresh user-scope per ADR-037" cross-link.

**Scope:** IN — script rewrite + flag + test + SKILL.md + ADR-034 cross-ref. OUT — agent/skill removals (T1+T2) · history scope (T4).
**Files:** `scripts/codemap-refresh.ps1` EDIT · `scripts/__tests__/codemap-refresh.test.*` NEW or EDIT · `skills/codemap-refresh/SKILL.md` EDIT · `docs/adr/ADR-034-history-hygiene.md` EDIT (small cross-ref).
**Tests:** YES — sibling test required per CLAUDE.md scaffold rules (every script under scripts/ gets `__tests__/<name>.test.*`).
**Risk:** medium — behavior change for hook-fired script; mitigated by `--internal` flag preserving prior behavior.
**Layers:** `scripts, skills, docs`.
**Depends on:** —. (Independent of T1/T2; runs in parallel if executor capacity allows.)

### T4 — Add Scope section to ADR-034 + CONTEXT.md History Hygiene (user-vs-internal)

**Acceptance:**
1. `docs/adr/ADR-034-history-hygiene.md` § Scope subsection added stating: "Rules in this ADR apply to dev-flow internal sprint artifacts (TODO.md · sprint files · CHANGELOG · ADRs · Roadmap). Adopter projects MAY adopt the principle by copying ADR-034 framework to their own repo, but the dev-flow plugin does NOT enforce these rules on adopter docs."
2. `.claude/CONTEXT.md` § History Hygiene block gains pointer-line note: `**Scope:** dev-flow internal artifacts only (adopter projects optional adopt; see ADR-034 § Scope).`
3. No behavior change to existing rules (per AC scope: clarification only).

**Scope:** IN — ADR-034 + CONTEXT.md scope clarification. OUT — actually enforcing on adopter (out of plugin remit).
**Files:** `docs/adr/ADR-034-history-hygiene.md` EDIT · `.claude/CONTEXT.md` EDIT.
**Tests:** N/A.
**Risk:** low — pure documentation clarification.
**Layers:** `docs`.
**Depends on:** —. (Independent.)

### T5 — Audit TODO.md collapse → CHANGELOG link integrity + preamble note

**Acceptance:**
1. Scan all `[x]` rows currently in TODO.md (Backlog § P0/P1/P2 + Tech Debt resolved rows); confirm each has `closed Sprint NNN <sha>` pointer to CHANGELOG OR cross-ref to sprint file.
2. Fix any orphan rows missing sprint+sha pointer (manual edit; ≤5 expected based on visual scan).
3. TODO.md preamble adds 1-line history note BEFORE "How to use this file" block: `> **History note:** closed task rows collapse to 1-line pointers after 1-sprint cooldown; full history in [docs/CHANGELOG.md](docs/CHANGELOG.md) + docs/sprint/ + git log.`
4. NO row deletions in this task (deletions follow ADR-034 cooldown rules at Sprint Promote / Close, not here).

**Scope:** IN — link audit + preamble. OUT — collapse/delete operations (those follow ADR-034 cooldown).
**Files:** `TODO.md` EDIT.
**Tests:** N/A.
**Risk:** low — read-mostly audit + 1 preamble line + ≤5 orphan fixes.
**Layers:** `docs`.
**Depends on:** —. (Independent.)

### T6 — Plugin propagation + lockstep MAJOR bump 3.1.0 → 4.0.0 (HITL gate)

**Acceptance:**
1. `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` 3.1.0 → 4.0.0 lockstep per ADR-006.
2. `docs/CHANGELOG.md` v4.0.0 prepended (outcome-led per ADR-026 · O3 architecture + O5 flow + O8 reliability lead; components support); cap ~12 lines headline + 6 bullets max per ADR-034.
3. `docs/USER-OUTCOMES.md` skills count 16 → 15 (arch-grill row removed in T1) + agents count 7 → 6 (dispatcher row removed in T2).
4. `.claude/CONTEXT.md` § Vocabulary `grill` row simplified — architecture-grill removed; only `flow grill` (Sprint 057 entry) + `grill mode in design-analyst --grill flag` (Sprint 059 entry per D-E) remain.
5. `README.md` banner v3.1.0 → v4.0.0; "What You Get" components table Skills 16→15 + Agents 7→6; Roadmap section Sprint 059 row `(planned) → (done — <SHA>)`.
6. Eval gates verify no NEW BREACH: `node scripts/eval-acceptance.js --cap-headroom-warn` (existing baseline carry — release-patch BREACH unchanged) + `node scripts/eval-skills.js` (3 PRE-EXISTING R7 violations carry; arch-grill removal eliminates 1 from skill count but doesn't add violation).
7. release-patch NOT invoked per ADR-027 boundary (manual MAJOR · 5th instance pattern: Sprint 052b T1 + Release 2.7.0 + Release 3.0.0 + Release 3.1.0 + this Release 4.0.0).

**Scope:** IN — manifests + CHANGELOG + USER-OUTCOMES + CONTEXT.md vocab + README banner+table + eval verification. OUT — README "How You Use It" section (T7).
**Files:** `.claude-plugin/plugin.json` EDIT · `.claude-plugin/marketplace.json` EDIT · `docs/CHANGELOG.md` EDIT · `docs/USER-OUTCOMES.md` EDIT · `.claude/CONTEXT.md` EDIT · `README.md` EDIT.
**Tests:** YES (eval gates verification).
**Risk:** medium — MAJOR bump · multi-file lockstep · cap-headroom verification.
**Layers:** `docs, ci`.
**Depends on:** TASK-144..148.
**HITL** stop-point at T6 close (version bump + CHANGELOG per ADR-027).

### T7 — Add "How You Use It" user-workflow section to README.md (helicopter view)

**Acceptance:**
1. `README.md` gains new `## How You Use It` section between "How to Adopt" and "First Sprint Walkthrough" containing:
   (a) 30-second pitch one-liner ("turns ad-hoc AI coding into a gated workflow")
   (b) 3-layer mental model ASCII (entry points → gates+modes → agents+hooks)
   (c) top-level entry points table (~9 rows: orchestrator init / prime / task-decomposer / orchestrator sprint-bulk / lean-doc-generator / diagnose / refactor-advisor / release-patch / security-review)
   (d) end-to-end lifecycle ASCII flowchart (DAY 0 adopt → DAY 1 feature → DAY 1 promote → DAY 1-N execute → DAY N close)
   (e) "what good behavior looks like" 4-bullet rules (≤5 commands per feature · short-keyword prompts · reversible mistakes · plugin doesn't write app code alone)
2. ≤80 lines added (distilled from session-emitted helicopter view ~150 lines; tighter for README scope).
3. Existing README sections preserved unchanged (no banner/Roadmap/components-table edits — those are T6).
4. Section reflects POST-Sprint-059 state (15 skills · 6 agents · `design-analyst --grill` available).

**Scope:** IN — new README section ≤80 lines. OUT — banner v4.0.0 update (T6) · components count update (T6) · Roadmap row update (T6).
**Files:** `README.md` EDIT.
**Tests:** N/A.
**Risk:** low — additive section.
**Layers:** `docs`.
**Depends on:** TASK-144 (post-arch-grill removal so section reflects 15 skills correctly · also reflects `design-analyst --grill` available per D-E).
**Outcome:** O1 onboard + O5 flow.

## Open Questions for Review

*(empty at lock — all questions resolved during Flow Grill iteration; ledger fully populated; 0 follow-up triggers fired)*

## Execution Log

- **T1 close 2026-05-10** — arch-grill MERGE + ADR-037 (joint R1+R3) + diagnose cross-ref + USER-OUTCOMES update. `skills/architecture-grill/` deleted in entirety (SKILL.md + references/). `agents/design-analyst.md` rewritten with 5-lens summary + `--grill` flag (27/30 lines · 3-line headroom OK · was 30/30 zero-headroom; NET IMPROVEMENT). New `agents/references/lenses.md` (~80 lines) holds 5 review lenses + grill mode + greenfield/brownfield + hard rules + red flags; establishes `agents/references/` subdirectory pattern (mirrors `skills/<name>/references/` convention). ADR-037 covers BOTH R1 (arch-grill MERGE) + R3 (dispatcher REMOVE) per D-B; 7 DECs; 5 alternatives rejected; Consequences section names rollback path + cap-headroom verification. `skills/diagnose/SKILL.md` description cross-ref updated (architecture-grill → design-analyst --grill). `docs/USER-OUTCOMES.md` skills count 16 → 15 + arch-grill row removed + design-analyst row updated to mention 5 lenses + --grill flag. HITL gate fired post-commit per D-D.
- **T2 close 2026-05-10** — dispatcher REMOVE + orchestrator subsection + CONTEXT.md roster reduction. `agents/dispatcher.md` deleted (zero-invocation evidence locked at Sprint 058 audit T2 + re-verified at Sprint 059 T1 ADR-037 DEC-3). Roster reduces 7 → 6 (code-reviewer · design-analyst · migration-analyst · performance-analyst · scope-analyst · security-analyst remain). `skills/orchestrator/SKILL.md` gains 3-line `## Dispatcher Role` subsection citing ADR-037 R3; cap-headroom 93/100 → 97/100 (7→3 OK→WARN tier; acceptable per cap discipline). Agent Dispatch table row for `design-analyst` updated lockstep to mention `--grill` flag from T1. `.claude/CONTEXT.md` § Agent Roster preamble note added pointing to orchestrator SKILL.md as dispatcher-role canonical home; "Spawned by" column rewritten dispatcher → orchestrator (5 row updates). § Relationships `dispatcher → specialist` line updated lockstep. ADR-037 DEC-3 + DEC-4 reference R3 evidence + this fold operation.
- **T3 close 2026-05-10** — codemap-refresh user-scope rewrite + sibling test + SKILL.md description update. `scripts/codemap-refresh.ps1` rewritten with `param([switch]$Internal)`: default mode scans adopter's project (CLAUDE_PROJECT_DIR priority); `-Internal` flag preserves dev-flow self-audit (CLAUDE_PLUGIN_ROOT priority + curated module list + curated one-liners). Default-mode dynamic top-level dir enumeration filters .git/node_modules/.next/.svelte-kit/dist/build/target/.idea/.vscode. Adopter-supplied one-liners loaded from `.claude/codemap-modules.json` if present; fallback hint `(no description - add via .claude/codemap-modules.json)` for unmapped modules. CODEMAP.md frontmatter gains `mode:` field reflecting current scan mode. Sibling test `scripts/__tests__/codemap-refresh.test.ps1` (Pester syntax · 7 test cases across 2 contexts: default user-mode + --Internal mode); covers temp-dir adopter scan, mode-string output assertion, dynamic enumeration, hint emission, dev-flow self-audit preservation. SKILL.md description rewritten to lead with adopter-scope use-case; argument-hint `[--Internal]`; version 1.0.0 → 2.0.0 MAJOR (breaking: default behavior change); last-validated 2026-05-10. Steps section updated with adopter-mode example + .claude/codemap-modules.json adopter pattern. ADR-034 § Scope cross-ref **deferred to T4** (T4 creates the full Scope section; T3 cross-ref folds in there).
- **T4 close 2026-05-10** — history-rule scope clarify (item 4 from refined-task-list.md). `docs/adr/ADR-034-history-hygiene.md` § Scope subsection added between Context and Decision; ~20 lines stating rules apply to dev-flow plugin internal artifacts ONLY (TODO.md · sprint files · CHANGELOG · ADRs); adopter projects MAY copy framework but plugin does NOT enforce. Subsection includes cross-reference to T3 codemap-refresh user-scope (both ADR-034 + ADR-037 ship lockstep clarifying user-vs-internal applicability). `.claude/CONTEXT.md` § History Hygiene gains 1-line scope pointer linking to ADR-034 § Scope. No behavior change to existing pruning rules per AC. Bundles T3 cross-ref deferral.
- **T5 close 2026-05-10** — TODO history audit + preamble note (item 5 from refined-task-list.md). Scanned all `[x]` rows in TODO.md; surfaced 6 orphan rows missing close-SHAs (TASK-129 direct-commit · TASK-116-v2 Sprint 055 · TASK-115-v2 Sprint 055-2 · TASK-134a/b Sprint 055c · v1 ship Sprint 056). Backfilled all 6 via `git log --grep` evidence: TASK-129 → `ae37af8` · TASK-116-v2 → `396f05d` · TASK-115-v2 → `d3cbe8c` · TASK-134a/b → `a197a47` · v1 ship → `2a3b575`. TODO.md preamble gains 1-line history note BEFORE "How to use this file" block: closed rows collapse to Sprint+SHA pointers per ADR-034; full history in CHANGELOG + sprint/ + git log; TODO is for OPEN work. NO row deletions per AC (collapse/delete follows ADR-034 cooldown rules at Sprint Promote/Close, not here).

## Files Changed

- `agents/design-analyst.md` | T1 | EDIT (30 → 27 lines) — added 5-lens summary + --grill flag mention + references/lenses.md pointer; cap-headroom 0 → 3 (NET IMPROVEMENT) | risk: medium (agent prompt change) | test: N/A
- `agents/references/lenses.md` | T1 | NEW (~80 lines) — full 5 review lenses + grill mode protocol + greenfield/brownfield + hard rules + red flags; establishes agents/references/ subdirectory pattern | risk: low (new reference file) | test: N/A
- `skills/architecture-grill/` | T1 | DELETE entire directory (SKILL.md + references/) — R1 verdict from Sprint 058 audit; 5 lenses folded into design-analyst | risk: high (skill removal · MAJOR class) | test: N/A
- `docs/adr/ADR-037-skill-and-agent-cleanup-v4.md` | T1 | NEW (~110 lines) — joint R1+R3 ADR per D-B; 7 DECs; 5 alternatives; Consequences w/ rollback path; cites ADR-006/015/026/027/031/032/034/036 + Sprint 058 audit | risk: low (additive doc) | test: N/A
- `skills/diagnose/SKILL.md` | T1 | EDIT — description cross-ref `architecture-grill` → `design-analyst --grill instead (architecture-grill merged into design-analyst per ADR-037)` | risk: low | test: N/A
- `docs/USER-OUTCOMES.md` | T1 | EDIT — skills heading 16 → 15; arch-grill row removed; design-analyst row updated to mention 5 lenses + --grill flag merge per ADR-037 | risk: low | test: N/A
- `agents/dispatcher.md` | T2 | DELETE — R3 verdict from Sprint 058 audit; zero-invocation evidence; role folded into orchestrator SKILL.md | risk: medium (agent removal · MAJOR class) | test: N/A
- `skills/orchestrator/SKILL.md` | T2 | EDIT (93 → 97 lines) — § Dispatcher Role subsection added (3-line description citing ADR-037 R3); Agent Dispatch table design-analyst row updated for --grill flag; cap-headroom 7→3 (OK→WARN tier · acceptable) | risk: low | test: N/A
- `.claude/CONTEXT.md` | T2 | EDIT — § Agent Roster reduce 7 → 6 rows + preamble note pointing to orchestrator SKILL.md; Spawned-by column rewritten dispatcher → orchestrator (5 row updates) + design-analyst row notes --grill flag; § Relationships dispatcher→specialist line updated lockstep | risk: low | test: N/A
- `scripts/codemap-refresh.ps1` | T3 | EDIT (167 → ~165 lines) — added param([switch]$Internal); default mode = adopter scan w/ dynamic top-dir enumeration + .claude/codemap-modules.json one-liners; --Internal preserves dev-flow self-audit + curated module list; CODEMAP.md frontmatter gains mode: field | risk: medium (default behavior change) | test: scripts/__tests__/codemap-refresh.test.ps1 NEW
- `scripts/__tests__/codemap-refresh.test.ps1` | T3 | NEW (~85 lines) — Pester test 2 contexts × 7 test cases: default user-mode (temp-dir adopter scan + mode-string + dynamic enum + hint emission) + --Internal mode (CLAUDE_PLUGIN_ROOT priority + curated list preservation) | risk: low (new test) | test: SELF
- `skills/codemap-refresh/SKILL.md` | T3 | EDIT — description rewritten to lead with adopter-scope use-case; argument-hint [--Internal]; version 1.0.0 → 2.0.0 MAJOR (breaking default-behavior change); last-validated 2026-05-10; Steps section updated with adopter-mode example + .claude/codemap-modules.json adopter pattern | risk: low | test: N/A
- `docs/adr/ADR-034-history-hygiene.md` | T4 | EDIT — § Scope subsection added between Context and Decision (~20 lines); states rules apply to dev-flow internal artifacts ONLY; adopter MAY copy framework not enforced; cross-references T3 codemap user-scope | risk: low | test: N/A
- `.claude/CONTEXT.md` | T4 | EDIT — § History Hygiene gains 1-line scope pointer linking to ADR-034 § Scope | risk: low | test: N/A
- `TODO.md` | T5 | EDIT — 6 orphan `[x]` rows backfilled with close-SHA via git log evidence; preamble gains 1-line history note before "How to use this file" block (no row deletions per AC) | risk: low | test: N/A

## Decisions

*(empty — populated during execution for architectural-level decisions; D-A..D-H already captured in Pre-locked decisions section above)*

## Retro

*(empty — populated at close: Worked / Friction / Pattern candidates / TD prompts; ≤6 bullets each per ADR-034 History Hygiene)*
