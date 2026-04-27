---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27 (Sprint 20 archived)
update_trigger: Sprint completed; blueprint version bumped
status: current
---

# Changelog

> Entries are prepended (newest first). Each sprint block is moved here from `TODO.md` once its changes are reflected in docs.
>
> **Semver bump rules** (also in `CONTRIBUTING.md` when it exists):
> - `MAJOR` — phase model / gate model / hook contract change
> - `MINOR` — new mode / new agent / new skill / new hard stop
> - `PATCH` — clarification / prompt rewording / fix

---

## Sprint 22 — Pass 2 fixes: HOW violations + blueprint correctness (2026-04-27)

**Blueprint version:** PATCH — HOW content moved to references, script fix, §23 extraction; no phase/gate/mode changes.
**Note:** TASK-091 (team validation) remains open — human-blocked. Carried to Sprint 23.

| File | Change | ADR |
|:-----|:-------|:----|
| `6× skills/*/SKILL.md` | TASK-098: procedural HOW sections removed; pointer to `references/procedure.md` added | AUD-P2-001 |
| `6× skills/*/references/procedure.md` | TASK-098: new — step logic moved from SKILL.md (not deleted) | AUD-P2-001 |
| `.claude/scripts/validate-blueprint.js` | TASK-099: INDEX_FILE_RE → explicit `Set(['10-modes.md', '06-harness.md'])`; `05-skills.md` now emits cap warning | AUD-P2-003 |
| `docs/blueprint/10f-task-decomposer.md` | TASK-099: 9th validation rule added; §23 Sprint Mode extracted; 294 → 206 lines | AUD-P2-002, AUD-P2-004 |
| `docs/blueprint/10g-sprint-mode.md` | TASK-099: new — §23 Sprint Mode content | AUD-P2-004 |
| `docs/blueprint/10-modes.md` | TASK-099: added `10g-sprint-mode.md` index row | AUD-P2-004 |
| `TODO.md` | Sprint 22 closed; Sprint 23 started (TASK-091 carried + TASK-100 promoted) | — |

---

## Sprint 21 — Audit Pass 2 + Pass 1 re-verification (2026-04-27)

**Blueprint version:** PATCH — docs only; no phase/gate/mode changes.
**Note:** TASK-091 (team validation) remains open — human-blocked. Carried to Sprint 22.

| File | Change | ADR |
|:-----|:-------|:----|
| `AUDIT_PASS2.md` | TASK-096: new — Pass 2 findings (AUD-P2-001..004: 2×P1, 2×P2); cross-check results; coverage table | — |
| `docs/CHANGELOG.md` | TASK-096: AUD-001..017 re-verification table appended to Sprint 17 block (all 17 CLOSED) | — |
| `READINESS.md` | TASK-096: TASK-096 row → [x]; last_updated → 2026-04-27 | — |
| `AUDIT.md` | TASK-096: audit_pass → 2 (complete); "not covered" section closed; last_updated → 2026-04-27 | — |
| `TODO.md` | TASK-096: TASK-098 + TASK-099 added to P2 backlog; sprint rotated 21→22 | — |

---

## Sprint 20 — E2E smoke + dogfood E2E + friction log + MVP mode (2026-04-27)

**Blueprint version: 1.7.0 → 1.8.0 (MINOR — new mode `mvp`)**

| File | Change | ADR |
|:-----|:-------|:----|
| `.github/workflows/validate.yml` | TASK-069: drift check replaced with plugin manifest validation | — |
| `examples/README.md` | TASK-069: E2E smoke test steps documented | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-097: `mvp` row in Mode Dispatch; flowchart + freeform rules updated; description updated | ADR-007 |
| `.claude/skills/dev-flow/references/mode-mvp.md` | TASK-097: new — phases, gates, escalation threshold, fence-line vs quick | — |
| `.claude/scripts/__tests__/mode-dispatch.test.js` | TASK-097: 3 mvp assertions added (table row, flowchart edges) | — |
| `docs/DECISIONS.md` | TASK-097: ADR-007 — mvp mode rationale, fence-line, alternatives | ADR-007 |
| `docs/blueprint/VERSION` | TASK-097: 1.7.0 → 1.8.0 | ADR-007 |
| `.claude-plugin/plugin.json` | TASK-097: version 1.7.0 → 1.8.0 | ADR-007 |
| `README.md` | TASK-097: 6 Modes → 7 Modes; mvp added to mode list | — |
| `examples/node-express/src/middleware/error-handler.js` | TASK-076: dogfood — error handler middleware | — |
| `examples/node-express/src/index.js` | TASK-076: dogfood — wire error handler after routes | — |
| `examples/node-express/src/__tests__/error-handler.test.js` | TASK-076: dogfood — 3 unit tests | — |
| `examples/node-express/TODO.md` | TASK-076: TASK-001 marked [x] | — |
| `docs/research/dogfood-session-notes.md` | TASK-076: all 14 phase rows filled; friction observed | — |
| `docs/research/dogfood-friction-log.md` | TASK-077: friction items, what worked, follow-up tasks | — |
| `STRATEGY_REVIEW.md` | TASK-077: R-10 outcome paragraph added | — |
| `TODO.md` | TASK-077: EPIC-C marked [x]; Sprint 20 changelog entries | — |
| `docs/DECISIONS.md` | TASK-077: ADR-008 — dogfood outcome | ADR-008 |

---

## Sprint 19 — Path rewrite + default-mode flip + ADR-006 + dogfood bootstrap (2026-04-27)

**Blueprint version:** MINOR — default invocation `/dev-flow TASK-N` now dispatches quick mode (5 phases) instead of full (10 phases); full mode requires explicit `/dev-flow full TASK-N`. Default behavior change is user-visible.

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/scripts/read-guard.js` | TASK-067: plugin-root allowlist entries (`skills/`, `scripts/`) added alongside `.claude/` | — |
| `.claude/scripts/session-start.js` | TASK-067: CLAUDE_PLUGIN_ROOT support — SKILLS_DIR + MANIFEST_PATH vars | — |
| `.claude/skills/dev-flow/references/phases.md` | TASK-067: `node .claude/scripts/` → `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/` (12 occurrences) | — |
| `.claude/skills/dev-flow-compress/SKILL.md` | TASK-067: compress.py invocation uses plugin-relative var | — |
| `.claude/scripts/__tests__/read-guard.test.js` | TASK-067: 2 plugin-layout allowlist tests added | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-067: fix pre-existing stderr vs stdout assertion bug | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-093: `quick` marked default; `full` requires explicit keyword; dot + freeform rules updated | — |
| `.claude/scripts/__tests__/mode-dispatch.test.js` | TASK-093: new — 5 content-validation tests for mode dispatch defaults | — |
| `docs/DECISIONS.md` | TASK-094: ADR-006 — plugin.json as canonical adopter pin; semver-to-blueprint mapping | ADR-006 |
| `CONTRIBUTING.md` | TASK-094: "Breaking change policy" section added, links ADR-006 | ADR-006 |
| `examples/node-express/.claude/` | TASK-075: full scaffold generated (skills, agents, scripts, CLAUDE.md, settings) | — |
| `examples/node-express/TODO.md` | TASK-075: Sprint 1 with 2 real tasks (TASK-001 error handler, TASK-002 users CRUD) | — |
| `examples/node-express/.gitignore` | TASK-075: exclude dev-flow runtime files | — |
| `examples/README.md` | TASK-075: updated to reflect checked-in .claude/ tree; immediate-use instructions | — |

---

## Sprint 18 — Plugin foundation + support docs (2026-04-27)

**Blueprint version:** PATCH — plugin manifest scaffolded; plugin layout contract documented; support channel + friction-report template added; README plugin-first install path. No phase/gate/mode changes.

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/cc-plugin-spec.md` | TASK-065: new — plugin layout contract; Assumptions 1+4 CONFIRMED | — |
| `.claude-plugin/plugin.json` | TASK-066: new — plugin manifest (name, description, version, skills[], agents[], hooks) | — |
| `.claude/scripts/validate-plugin.js` | TASK-066: new — manifest validator (4 checks; exit 0/1) | — |
| `.claude/scripts/__tests__/validate-plugin.test.js` | TASK-066: new — 11 unit tests, all pass | — |
| `README.md` | TASK-068: plugin-first install path primary; scaffold-copy fallback; plugin/init table | — |
| `CONTRIBUTING.md` | TASK-068 + TASK-095: no old paths found; Feedback section added | — |
| `docs/SUPPORT.md` | TASK-095: new — #dev-flow Slack channel, 2-day SLA, friction-report filing rules | — |
| `docs/templates/friction-report.md` | TASK-095: new — friction report template (phase/expected/observed/fix/severity) | — |

---

## Sprint 17 — Blueprint decomp + SSOT version (2026-04-26)

**Blueprint version:** PATCH — mega-files split; VERSION SSOT established; BUG-003/004 fixed.

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/VERSION` | TASK-060: Created — canonical blueprint version SSOT (1.7.0) | ADR-005 |
| `AI_WORKFLOW_BLUEPRINT.md` | TASK-060: Body version line replaced with redirect to VERSION file | — |
| `.claude/scripts/validate-blueprint.js` | TASK-060: Check 5 — warns when blueprint docs change without VERSION update | — |
| `.claude/scripts/__tests__/validate-blueprint.test.js` | TASK-060: 2 tests for Check 5 | — |
| `docs/DECISIONS.md` | TASK-060: ADR-005 — package.json vs blueprint VERSION independence | ADR-005 |
| `docs/blueprint/10-modes.md` | TASK-059: 943→19 line index; 6 sub-files extracted | — |
| `docs/blueprint/10a-init.md` | TASK-059: NEW — §16 INIT Mode (237 lines) | — |
| `docs/blueprint/10b-harness-improvement.md` | TASK-059: NEW — §17 Harness CI Protocol (84 lines) | — |
| `docs/blueprint/10c-resume.md` | TASK-059: NEW — §18 Session Resume (70 lines) | — |
| `docs/blueprint/10d-migration-performance.md` | TASK-059: NEW — §19 Migration + §20 Performance (137 lines) | — |
| `docs/blueprint/10e-hotfix.md` | TASK-059: NEW — §21 Hardened Hotfix (149 lines) | — |
| `docs/blueprint/10f-task-decomposer.md` | TASK-059: NEW — §22 Task Decomposer + §23 Sprint Mode (294 lines) | — |
| `docs/blueprint/06-harness.md` | TASK-059: 565→16 line index; 3 sub-files extracted | — |
| `docs/blueprint/06a-settings.md` | TASK-059: NEW — settings.json + settings.local.json (118 lines) | — |
| `docs/blueprint/06b-scripts.md` | TASK-059: NEW — all 5 scripts + evals/measure.py (415 lines) | — |
| `docs/blueprint/06c-claude-md-template.md` | TASK-059: NEW — §7 CLAUDE.md Template (64 lines) | — |
| `.claude/scripts/validate-blueprint.js` | TASK-059: Check 4 — 250-line cap WARN for blueprint sub-files | — |
| `.claude/scripts/__tests__/validate-blueprint.test.js` | TASK-059: 3 tests for 250-line cap | — |
| `IMPROVEMENT_LOG.md` | TASK-063: Deleted — archived to docs/archive/ | — |
| `docs/archive/2026-04-20-session-1-critique.md` | TASK-063: NEW — archived Session 1 critique (status:archived) | — |
| `.claude/scripts/session-start.js` | TASK-063: Check 7 WARN when both Sprint + Backlog empty | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-063: 2 tests for WARN path | — |
| `docs/BUGS.md` | BUG-003 + BUG-004 resolved — "No open bugs" | — |
| `.claude/scripts/scaffold-checks.js` | BUG-003: skill.path traversal guard in checkManifest | — |
| `.claude/scripts/__tests__/validate-scaffold.test.js` | BUG-003: traversal-attempt test | — |
| `.claude/scripts/read-guard.js` | BUG-004: `.claude/scripts/` prefix added to ORCHESTRATOR_ALLOWLIST | — |
| `.claude/scripts/__tests__/read-guard.test.js` | BUG-004: allowlist coverage test | — |

**Resolved bugs**: BUG-003 (skill.path traversal) · BUG-004 (read-guard over-blocking)

**AUD-001..017 Pass 1 re-verification (TASK-096, 2026-04-27)**

| ID | Title (abbreviated) | Pass 1 sprint | Re-verified state |
|:---|:--------------------|:--------------|:------------------|
| AUD-001 | Phase-file write side never implemented | Sprint 14 | ✓ CLOSED — `set-phase.js` (79 lines) writes `.claude/.phase`; invocations in `phases.md` |
| AUD-002 | Placeholder hooks in settings.json | Sprint 14 | ✓ CLOSED — no `[your-lint-command]` strings in `settings.json` |
| AUD-003 | CI runs only 2 validators | Sprint 15 | ✓ CLOSED — `validate.yml` runs `node --test` suite + Node 18/20/22 matrix |
| AUD-004 | Skill change protocol not enforced | Sprint 15 | ✓ CLOSED — `check-eval-gate.js` CI gate + backfill snapshots committed |
| AUD-005 | README teaches manual `cp -r` | Sprint 15 | ✓ CLOSED — `node bin/dev-flow-init.js` is primary path in README |
| AUD-006 | `examples/node-express/` full mirror | Sprint 16 | ✓ CLOSED (monitor) — mirror deleted (ADR-004 Sprint 16); re-generated intentionally by TASK-075 (Sprint 19) for dogfood; drift check CI step active |
| AUD-007 | `dev-flow/SKILL.md` at 335 lines | Sprint 16 | ✓ CLOSED — trimmed to 122 lines; detail in `references/` sub-files |
| AUD-008 | Blueprint mega-files >500 lines | Sprint 17 | ✓ CLOSED — `10-modes.md` and `06-harness.md` split to sub-files |
| AUD-009 | Blueprint version SSOT split 3 ways | Sprint 17 | ✓ CLOSED — `docs/blueprint/VERSION` = 1.8.0; ADR-005 documents independence |
| AUD-010 | `dev-flow-init.js` does not render settings | Sprint 15 | ✓ CLOSED — `STACK_PRESETS` with `lintCommand`/`typecheckCommand` renders `settings.json` |
| AUD-011 | SKILL.md files lack GraphViz flowcharts | Sprint 16 | ✓ CLOSED — `pr-reviewer` flowchart added; exemption policy in `05-skills.md` |
| AUD-012 | Subagent files duplicate 70% of skill content | Sprint 16 | ✓ CLOSED — `code-reviewer.md` 89→17 lines; `security-analyst.md` 77→17 lines |
| AUD-013 | `BUGS.md` references closed tasks | Sprint 17 | ✓ CLOSED — BUGS.md = "No open bugs." |
| AUD-014 | README numbers drift from SSOT | Sprint 15 | ✓ CLOSED — README = "24 Hard Stops", "10 project-local skills" (matches actual) |
| AUD-015 | `IMPROVEMENT_LOG.md` unmanaged at root | Sprint 17 | ✓ CLOSED — archived at `docs/archive/2026-04-20-session-1-critique.md` |
| AUD-016 | Session-start: no actionable next step | Sprint 17 | ✓ CLOSED — `session-start.js` emits WARN when Sprint + Backlog both empty |
| AUD-017 | `package.json` version untracked | Sprint 17 | ✓ CLOSED — ADR-005: package.json and blueprint VERSION are intentionally independent |

---

## Sprint 16 — Skills decomp + P2 cleanup (2026-04-26)

**Blueprint version:** PATCH — dev-flow SKILL.md decomposed to reference files; examples/ mirror removed per ADR-004; agent thin-wrappers applied; GraphViz flowchart policy documented.

| File | Change | ADR |
|:-----|:-------|:----|
| `examples/node-express/.claude/` | TASK-057: Deleted mirror tree (60 files) — SSOT policy, generated by dev-flow-init.js | ADR-004 |
| `examples/node-express/docs/blueprint/` | TASK-057: Deleted mirror docs (10 files) | ADR-004 |
| `examples/README.md` | TASK-057: Updated — project-specific files only; `.claude/` generated by dev-flow-init.js | ADR-004 |
| `.github/workflows/validate.yml` | TASK-057: Add examples mirror drift check step | ADR-004 |
| `docs/DECISIONS.md` | TASK-057: ADR-004 appended — examples/ mirror deletion decision | ADR-004 |
| `.claude/skills/dev-flow/SKILL.md` | TASK-058: Trimmed 372→116 lines; detail split to references/ | none |
| `.claude/skills/dev-flow/references/phases.md` | TASK-058: NEW — full Phase 0-10 checklists + Gate templates (185 lines) | none |
| `.claude/skills/dev-flow/references/hard-stops.md` | TASK-058: NEW — full 19-item hard stop list + context threshold template | none |
| `.claude/skills/dev-flow/references/mode-hotfix.md` | TASK-058: NEW — hotfix banner + workflow sequence | none |
| `.claude/skills/dev-flow/references/mode-resume.md` | TASK-058: NEW — resume prompt template | none |
| `.claude/skills/dev-flow/references/mode-sprint.md` | TASK-058: NEW — full Sprint Mode scoring/classification/execute | none |
| `evals/snapshots/dev-flow/TASK-058-{before,after}.json` | TASK-058: Eval snapshots; terse_isolation_delta +0.0% | none |
| `evals/runs/TASK-058.md` | TASK-058: Eval run narrative RED→GREEN→REFACTOR | none |
| `.claude/agents/code-reviewer.md` | TASK-061: Trimmed 89→17 lines — thin wrapper referencing pr-reviewer skill | none |
| `.claude/agents/security-analyst.md` | TASK-061: Trimmed 77→17 lines — thin wrapper referencing security-auditor skill | none |
| `.claude/agents/migration-analyst.md` | TASK-061: Trimmed 90→23 lines — condensed inline checklist | none |
| `.claude/agents/performance-analyst.md` | TASK-061: Trimmed 79→22 lines — condensed inline checklist | none |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-062: Add Stage 1→2 gating GraphViz flowchart | none |
| `docs/blueprint/05-skills.md` | TASK-062: Add GraphViz Flowchart Policy section; document exemptions | none |
| `evals/snapshots/pr-reviewer/TASK-062-{before,after}.json` | TASK-062: Eval snapshots | none |
| `evals/runs/TASK-062.md` | TASK-062: Eval run narrative | none |

---

## Sprint 15 — Adoption + CI hardening (2026-04-26)

**Blueprint version:** MINOR bump — Sprint Mode Phase 9c completion prompt added (Phase 9c continue/close flow, context-budget gate ≥28 turns); `next-blocked`/`commit-each`/`commit-sprint` dispatch; §23 added to `10-modes.md`.

| File | Change | ADR |
|:-----|:-------|:----|
| `.github/workflows/validate.yml` | TASK-054: Add Node 18/20/22 matrix, `node --test` suite, `py_compile` syntax check, direct Python test execution; `permissions: read-all`; SHA-pinned actions; `fail-fast: false` | none |
| `.github/workflows/scheduled.yml` | TASK-054: New — weekly cron (Mon 08:00 UTC) for `audit-skill-staleness.js`; `workflow_dispatch` trigger; SHA-pinned actions | none |
| `.claude/scripts/check-eval-gate.js` | TASK-055: New — CI gate script; per-skill task-id matching for after-snapshot + run file; CHANGED_FILES env override for tests | none |
| `.claude/scripts/__tests__/check-eval-gate.test.js` | TASK-055: New — 9 unit tests including regression case for shared-runsPattern bug | none |
| `.github/workflows/validate.yml` | TASK-055: Add PR-only eval gate step + fetch-depth: 0 on checkout | none |
| `evals/snapshots/dev-flow/TASK-044-after.json` | TASK-055: Sprint 11 backfill — post-Sprint-11 state; backfill:true flag | none |
| `evals/snapshots/dev-flow-compress/TASK-036-after.json` | TASK-055: Sprint 11 backfill — new skill, no before; backfill:true flag | none |
| `evals/runs/TASK-044.md` | TASK-055: Sprint 11 run record (narrative backfill) | none |
| `evals/runs/TASK-036.md` | TASK-055: Sprint 11 run record for new skill (narrative backfill) | none |
| `CONTRIBUTING.md` | TASK-055: Add Eval gate section — 3 required files, new-skill exception, gate script path | none |
| `README.md` | TASK-056: Replace "How to adopt" — `node bin/dev-flow-init.js` primary; add 8-file "What gets created" table; `cp -r` demoted to fallback; "What it is not" + "Blueprint structure" sections removed (outdated/absorbed) | none |
| `.claude/skills/dev-flow/SKILL.md` | TASK-064: Sprint Mode — Phase 9c-style completion prompt; context gate ≥28 turns → prune; `next-blocked`/`commit-each`/`commit-sprint` dispatch; hard stop added | none |
| `docs/blueprint/10-modes.md` | TASK-064: Add §23 Sprint Mode — weight scoring, phase classification, execution flow, Phase Complete prompt | none |
| `evals/runs/TASK-064.md` | TASK-064: Eval run record (RED-GREEN-REFACTOR) | none |
| `evals/snapshots/dev-flow/TASK-064-before.json` | TASK-064: Eval baseline snapshot | none |
| `evals/snapshots/dev-flow/TASK-064-after.json` | TASK-064: Eval after snapshot | none |

---

## Sprint 14 — Audit Pass 1: P0 fixes + drift cleanup (2026-04-25)

**Blueprint version:** PATCH bump — Phase Markers added to dev-flow/SKILL.md (Phase 0/3/5/6/7/8/9); ADR-003 records orchestrator-managed phase state. Counts as PATCH (mechanism is harness-only; phase model unchanged).

| File | Change | ADR |
|:-----|:-------|:----|
| `AUDIT.md` | New: 17-finding tactical audit (pass 1, quick scan) — 2 P0, 8 P1, 7 P2; suggested sprint plan | none |
| `STRATEGY_REVIEW.md` | New: strategic critique (pros, cons, 10 radical alternatives R-1..R-10) — companion to AUDIT.md | none |
| `TODO.md` | Sprint 14 populated (TASK-050..053 P0+P2 cleanup); Backlog populated with TASK-054..063 (P1+P2), TASK-064 (workflow self-audit), and EPIC-A..E (P3 strategic) | none |
| `.claude/settings.json` | TASK-051: Remove 4 `[your-X]` placeholder PreToolUse hooks (`Bash(git commit*)`, `Bash(git -C * commit*)`, `Bash(git push*)`, `Bash(git -C * push*)`); committed file is now runnable as-is | none |
| `.claude/settings.local.example.json` | TASK-051: Promote to canonical template — embed full PreToolUse hook block with `[your-X]` tokens; rendered per-stack by `dev-flow-init.js` | none |
| `bin/dev-flow-init.js` | TASK-051: Replace `LAYER_PRESETS` with `STACK_PRESETS` (layers + lintCommand + typecheckCommand + packageManager); add `renderSettingsLocal()`; add `isHookCommandSafe()` shell-metachar guard for custom prompts | none |
| `bin/__tests__/dev-flow-init.test.js` | TASK-051: Replace `getLayersForPreset` tests with `getStackPreset` + `renderSettingsLocal` + `isHookCommandSafe` tests (24 cases) | none |
| `.claude/scripts/validate-scaffold.js` | TASK-051: Add Check 8 — fail on `[your-` substring in any settings.json hook command; explicit fail when settings.json absent | none |
| `.claude/scripts/__tests__/validate-scaffold.test.js` | TASK-051: Add 4 cases (placeholder fail, clean pass, invalid JSON, missing file) | none |
| `.claude/settings.local.json` | TASK-051: Regenerate this repo's local — replace `[package-manager]` with `npm`, render 4 hooks with `node -e "process.exit(0)"` no-op (meta-repo has no app code to lint/typecheck) | none |
| `docs/BUGS.md` | TASK-052: Trim to rule line; TASK-051 audit: open BUG-003 (validate-blueprint.js MANIFEST `skill.path` traversal) | none |
| `docs/CHANGELOG.md` | TASK-052: Add Sprint 7 "Resolved bugs" sub-table with BUG-001 + BUG-002 fix verification; TASK-051: fix stale `getLayersForPreset` reference in Sprint 12 row | none |
| `README.md` | TASK-053: "27 Hard Stops" → "24 Hard Stops"; "9+ project-local … skills" → "10 project-local … skills" | none |
| `.claude/scripts/validate-blueprint.js` | TASK-053: Add Check 4 — count ❌ in 08-orchestrator-prompts.md and skills in MANIFEST; fail when README claims drift or are missing | none |
| `.claude/scripts/__tests__/validate-blueprint.test.js` | TASK-053: Add 7 cases (match, drift, N+ phrasing, missing claims) | none |
| `.claude/scripts/phase-constants.js` | TASK-050: New — single source of truth for `VALID_PHASES` (11) + `COMPACT_VULNERABLE` (5) + `PHASE_FILE`. Imported by set-phase.js, read-guard.js, session-start.js | ADR-003 |
| `.claude/scripts/set-phase.js` | TASK-050: New — orchestrator-managed writer for `.claude/.phase` (set/clear modes); rejects symlinks via `lstatSync` guard; allowlist-validated phase names | ADR-003 |
| `.claude/scripts/__tests__/set-phase.test.js` | TASK-050: New — 11 unit tests (write, normalize, trim, mkdir, reject, usage, clear, idempotent, all 11 phases, exports, single-source invariant) | none |
| `.claude/scripts/__tests__/phase-cycle.integration.test.js` | TASK-050: New — 6 integration tests (full cycle, allowlist pass, parse non-block, all compact-vulnerable phases via shared Set, idempotent clear, symlink refusal) | none |
| `.claude/scripts/read-guard.js` | TASK-050: Import `PHASE_FILE` + `COMPACT_VULNERABLE` from phase-constants instead of hardcoded literals | none |
| `.claude/scripts/session-start.js` | TASK-050: Check 9 — import `COMPACT_VULNERABLE` from phase-constants; escalate stale-phase warn message to suggest `set-phase.js clear` | none |
| `.claude/skills/dev-flow/SKILL.md` | TASK-050: Add §Phase Markers intro; mark Phase 0 (clear pre-flight), 3, 5, 6, 7, 8 with `set-phase.js` calls; add `set-phase.js clear` after Phase 9 commit | ADR-003 |
| `docs/DECISIONS.md` | TASK-050: Append ADR-003 — orchestrator-managed phase state via `set-phase.js`; rejected harness-managed PostToolUse alternative documented | ADR-003 |

---

## Sprint 13 — Governance + Automation (2026-04-25)

**Blueprint version:** PATCH bump — canonical files governance rule; skill-staleness audit script

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/05-skills.md` | Added §Canonical Files Governance (SSOT rule + table + loop usage example) | none |
| `.claude/CLAUDE.md` | Updated anti-pattern with §5 cross-reference | none |
| `.claude/scripts/audit-skill-staleness.js` | New script: audits last-validated dates on all skills, exits 1 on stale/missing | none |
| `.claude/scripts/__tests__/audit-skill-staleness.test.js` | 13 unit tests (TDD RED→GREEN) | none |

---

## Sprint 12 — TDD Framework + Init Script + Worked Example (2026-04-25)

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/measure.py` | Added `compare` sub-command (before/after snapshot delta) | — |
| `docs/blueprint/05-skills.md` | Added Skill Change Protocol (RED-GREEN-REFACTOR) section | — |
| `CONTRIBUTING.md` | Resolved TASK-026 forward-refs; governance rule made concrete | — |
| `.claude/CLAUDE.md` | Removed pending qualifier from eval evidence anti-pattern line | — |
| `evals/README.md` | Documented `compare` usage + bumped last_updated | — |
| `bin/dev-flow-init.js` | New CLI: copies scaffold into target repo with stack prompts | ADR-002 |
| `bin/__tests__/dev-flow-init.test.js` | Unit tests for applySubstitutions + getStackPreset (renamed from getLayersForPreset in Sprint 14 TASK-051) | — |
| `package.json` | New: bin field + engines ≥18 | — |
| `docs/DECISIONS.md` | Added ADR-002: no external deps in bin/ | — |
| `examples/node-express/` | Worked example: scaffold + minimal Express server | — |
| `examples/README.md` | Pattern explanation for bootstrap workflow | — |

---

## Sprint 11 — Sprint Mode + Context Compression (2026-04-24)

**Blueprint version:** MINOR bump — `/dev-flow sprint` auto-run mode; `/dev-flow:compress` sub-skill + Python compression script

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/dev-flow/SKILL.md` | TASK-044: Add sprint mode — weight scoring, Sprint Plan template, single/two-phase split, hard stop for scope:full+risk:high | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-036: Add Sub-commands dispatch section for `:compress` | — |
| `.claude/skills/dev-flow-compress/SKILL.md` | TASK-036: New sub-skill — `/dev-flow:compress` spec, pass-through rules, compression rules, Red Flags | — |
| `.claude/scripts/compress.py` | TASK-036: Python 3.10+ compress script — path traversal guard, `.md` guard, backup-before-write, CRLF-safe, 17 tests | — |
| `.claude/scripts/__tests__/compress.test.py` | TASK-036: 17 unittest tests — backup, guards, pass-through, compression, CRLF | — |
| `.claude/skills/MANIFEST.json` | TASK-036: Bind dev-flow-compress skill (user-invocable: false) | — |
| `.claude/CLAUDE.md` | TASK-036: Add Python 3.10+ to stack + commands section; align scripts convention | — |

---

## Sprint 10 — Eval Baseline + CI Gate (2026-04-24)

**Blueprint version:** MINOR bump — first full eval coverage across all 9 skills; GitHub Actions CI gate enforcing scaffold + blueprint integrity on every PR

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/snapshots/*/baseline-001.json` | TASK-048: Three-arm baseline snapshots for all 9 skills (8 new); measure.py runs clean across all | — |
| `evals/README.md` | TASK-048: Baseline Anomalies section — brevity_delta pattern documented for structured-output skills | — |
| `.github/workflows/validate.yml` | TASK-025: GitHub Actions CI gate — validate-scaffold.js + validate-blueprint.js on every PR to master | — |

---

## Sprint 9 — Workflow Continuity + Compat (2026-04-24)

**Blueprint version:** PATCH bump — Phase 9c continue/done prompt; Phase 10 sprint-complete detection + rotation checklist; `measure.py` Python 3.8+ fallback

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/measure.py` | TASK-047: Guard `Path.is_relative_to()` with `Path.parents` fallback for Python < 3.9 | — |
| `evals/README.md` | TASK-047: Document Python 3.8+ compatibility note | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-049: Add Phase 9c continue/done prompt — 'next' chains to next task, 'done' runs Phase 10, no tasks → sprint-complete Phase 10 | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-046: Add sprint-complete detection to Phase 10 — rotation checklist + proposed Sprint N+1 output; human approves before TODO.md written | — |

---

## Sprint 8 — Scripts + Harness Polish (2026-04-24)

**Blueprint version:** PATCH bump — stale line-limit fix, session-start false-warning fix, cp/mkdir harness tracking

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/scripts/validate-scaffold.js` | Fix README.md + docs/README.md line limit 80 → 50; all 11 tests pass | — |
| `.claude/scripts/session-start.js` | Fix false ownership warning: use `hasLastUpdated` field-presence check instead of date regex for "no header" guard | — |
| `.claude/scripts/__tests__/session-start.test.js` | Add regression test: YYYY-MM-DD placeholder must not trigger ownership warning | — |
| `.claude/settings.json` | Add `Bash(cp*)` and `Bash(mkdir*)` to permissions.allow — prevent init-flow permission prompts | — |
| `.claude/settings.local.example.json` | Add `Bash(cp*)` and `Bash(mkdir*)` to permissions.allow | — |

---

## Sprint 7 — Harness Init Fixes (2026-04-24)

**Blueprint version:** PATCH bump — hook path fix, allowedTools additions, git -C matcher coverage, chain-guard, README adoption corrections

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/settings.json` | TASK-041: Replace `${CLAUDE_PLUGIN_ROOT}` → `$CLAUDE_PROJECT_DIR` in all 5 hook commands | — |
| `.claude/settings.json` | TASK-043: Add `permissions.allow: ["Bash(node .claude/scripts/*)"]` — suppress hook permission prompts | — |
| `.claude/settings.json` | TASK-045: Add `Bash(git -C * commit*)` + `Bash(git -C * push*)` PreToolUse matchers; inline chain-guard on `Bash(git add*)` blocks `&& git commit` chains | — |
| `.claude/settings.local.example.json` | TASK-045: Add `Bash(git -C *)` to permissions.allow | — |
| `README.md` | TASK-039: Add settings.local.json copy step to "How to adopt" | — |
| `README.md` | TASK-040: Fix stale paths → templates/; collapse blueprint listing; trim to 47 lines | — |
| `templates/SETUP.md.template` | TASK-039: Add "First session (Claude Code harness)" section | — |

**Resolved bugs:**

| Bug | Fixed by | Verified | Notes |
|:----|:---------|:---------|:------|
| BUG-001: `${CLAUDE_PLUGIN_ROOT}` fails in project-local settings.json hooks | TASK-041 (Sprint 7) | TASK-052 (2026-04-25) — confirmed token absent from `.claude/settings.json`; all 5 hooks use `$CLAUDE_PROJECT_DIR` | rotated from `docs/BUGS.md` |
| BUG-002: Harness node scripts not in `allowedTools` — permission prompt on every hook fire | TASK-043 (Sprint 7) | TASK-052 (2026-04-25) — confirmed `Bash(node .claude/scripts/*)` present in `permissions.allow` | rotated from `docs/BUGS.md` |

---

## Sprint 6 — Doc Templates + Eval Harness (2026-04-24)

**Blueprint version:** MINOR bump — new eval harness (§17 Channel 4); new `docs/DECISIONS.md`; six doc templates shipped

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/README.md.template` | New — README template, 50-line limit, License section | — |
| `templates/ARCHITECTURE.md.template` | New — Architecture template, 150-line limit | — |
| `templates/DECISIONS.md.template` | New — Decision log template, ADR-001 example | — |
| `templates/SETUP.md.template` | New — Setup template, env vars table | — |
| `templates/AI_CONTEXT.md.template` | New — AI context template, Domain Glossary | — |
| `templates/CHANGELOG.md.template` | New — Changelog template, filled sprint example | — |
| `evals/measure.py` | New — offline three-arm skill eval harness, stdlib only, path-traversal guard | ADR-001 |
| `evals/README.md` | New — eval methodology doc, snapshot schema, usage | — |
| `evals/snapshots/lean-doc-generator/baseline-001.json` | New — first committed baseline snapshot | — |
| `docs/DECISIONS.md` | New — decision log; ADR-001: Python + three-arm methodology | ADR-001 |
| `docs/BUGS.md` | New — structured bug log: BUG-001 (PLUGIN_ROOT), BUG-002 (allowedTools) | — |
| `docs/blueprint/06-harness.md` | Added eval harness Channel 4 section | ADR-001 |
| `TODO.md` | TASK-024 smoke test: 4 P0 doc issues + 3 harness bugs captured (TASK-037–045) | — |

---

## Sprint 5 — Templates + Validation (2026-04-22)

**Blueprint version:** PATCH bump — new harness scripts and templates; no new skills, modes, or gates

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/TODO.md.template` | TASK-020 — Created — worked example sprint with all 6 required task fields and `[CUSTOMIZE]` markers throughout | — |
| `.claude/scripts/scaffold-checks.js` | TASK-022 — Created shared validation util: `countLines`, `globSkills`, `checkManifest`, `checkOwnershipHeader`, `checkDocLineLimits`, `checkRequiredFiles` | — |
| `.claude/scripts/validate-scaffold.js` | TASK-022 — CI hard-gate: 7 checks (required files, CLAUDE.md lines, MANIFEST schema, TODO.md ownership+sprint, skill count+frontmatter, doc limits); exits 1 on any failure; 11 tests | — |
| `.claude/scripts/validate-blueprint.js` | TASK-023 — Blueprint integrity: MANIFEST skill paths × filesystem; §4 agents × `.claude/agents/`; exits 1 on any failure; 6 tests | — |
| `.claude/scripts/session-start.js` | TASK-022 — Refactored: imports `countLines`, `globSkills`, `checkManifest`, `checkDocLineLimits` from scaffold-checks util; no duplicate logic | — |
| `docs/blueprint/07-todo-format.md` | Added Sprint Creation Checklist and Required Task Fields table | — |
| `TODO.md` | TASK-034 deferred to P3 (blocked on TASK-027 multi-platform sync); task fields added to all Sprint 5 tasks | — |

---

## Sprint 4 — Skills Craft + Description Audit + Behavioral Template (2026-04-22)

**Blueprint version:** PATCH bump — no new skills or gates; description rewrites, Red Flags additions, HOW-filter flowchart, behavioral guidelines template

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/task-decomposer/SKILL.md` | TASK-015 — Replaced stub with full §22 implementation — input type table, dot flowchart, 6-step execution protocol, risk scoring, scope assignment, 5 Red Flags, 5 hard rules | — |
| `.claude/skills/task-decomposer/references/decomposition-spec.md` | TASK-015 — Created — output format template, assumption registry format, granularity rules, 9 validation hard stops, `--from-architecture` spec, credential degradation spec | — |
| `.claude/skills/adr-writer/SKILL.md` | TASK-018 — Added Red Flags table (4 rows) — "obvious decisions", late recording, code-as-docs, one-liner rationalization | — |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-018/019 — Fixed description (removed process summary); added Red Flags table (4 rows); added Finding Severity Examples (CRITICAL vs NON-BLOCKING contrast) | — |
| `.claude/skills/lean-doc-generator/SKILL.md` | TASK-018/019 — Fixed description (removed HOW summary); added HOW-filter dot flowchart (3-branch decision tree); added Red Flags table (4 rows) | — |
| `.claude/skills/release-manager/SKILL.md` | TASK-018 — Added Red Flags table (4 rows) — breaking change bump, post-tag changelog, missing version file, vague commit intent | — |
| `.claude/skills/refactor-advisor/SKILL.md` | TASK-019 — Fixed description (removed process/output summary) | — |
| `.claude/skills/security-auditor/SKILL.md` | TASK-018/019 — Fixed description (removed scope summary); added Red Flags table (4 rows) — silent skips, stale approval, partial disclosure, internal-service blind spot | — |
| `.claude/skills/system-design-reviewer/SKILL.md` | TASK-018/019 — Fixed description (removed mode-summary); added Red Flags table (4 rows) — deferred details, operational correctness, brownfield doc check, status downgrade | — |
| `.claude/CLAUDE.md` | TASK-032 — Replaced placeholder template with populated dev-flow project context; added Behavioral Guidelines section (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) | — |
| `templates/CLAUDE.md.template` | TASK-032 — Created — adopter-facing template with [CUSTOMIZE] markers, ownership header, behavioral guidelines section | — |

---

## Sprint 3 — Agents + Skills (2026-04-21)

**Blueprint version:** MINOR bump — 7 full agent system prompts; 7 project-local skills; `regenerate-manifest.js`; `dev-flow` orchestrator skill live

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/agents/design-analyst.md` | TASK-016 — full Phase 2 system prompt: codebase exploration, micro-task plan, ≤300 token return | — |
| `.claude/agents/init-analyst.md` | TASK-016 — full INIT system prompt: Role A (Discovery) + Role B (Architecture); preloads system-design-reviewer | — |
| `.claude/agents/code-reviewer.md` | TASK-016 — full Phase 6 system prompt: two-stage [S1]/[S2] review; preloads pr-reviewer | — |
| `.claude/agents/security-analyst.md` | TASK-016 — full Phase 7 system prompt: OWASP audit; preloads security-auditor; CRITICAL never truncated | — |
| `.claude/agents/migration-analyst.md` | TASK-016 — full §19 system prompt: structural safety + concurrency + rollback stages | — |
| `.claude/agents/performance-analyst.md` | TASK-016 — full §20 system prompt: query analysis + API profile + caching + baseline | — |
| `.claude/agents/scope-analyst.md` | TASK-016 — full §22 system prompt: read-only impact assessment; risk scoring table | — |
| `.claude/skills/adr-writer/SKILL.md` | TASK-013 — full skill: ADR format, 5-step procedure, hard rules; context: inline | — |
| `.claude/skills/refactor-advisor/SKILL.md` | TASK-013 — full skill: 4 lenses, before/after format, risk tiers, Red Flags table | — |
| `.claude/skills/lean-doc-generator/SKILL.md` | TASK-013 — full skill: HOW filter, ownership header, Phase 8 procedure, line limits | — |
| `.claude/skills/lean-doc-generator/reference/DOCS_Guide.md` | TASK-013 — full lean doc standard: HOW filter examples, file reference, line-limit enforcement, checklist | — |
| `.claude/skills/lean-doc-generator/reference/VALIDATED_PATTERNS.md` | TASK-013 — 7 validated patterns + 2 anti-patterns from session-close promotions | — |
| `.claude/skills/release-manager/SKILL.md` | TASK-013 — full skill: SemVer rules, CHANGELOG format, hard rules; context: fork | — |
| `.claude/skills/system-design-reviewer/SKILL.md` | TASK-013 — full skill: 5 review lenses, greenfield/brownfield modes, output format | — |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-013 — full skill: 7-lens review, [S1]/[S2] labeling, hard rules; agent: code-reviewer | — |
| `.claude/skills/security-auditor/SKILL.md` | TASK-013 — full skill: OWASP Top 10 table, additional checks, CRITICAL never truncated | — |
| `.claude/scripts/regenerate-manifest.js` | TASK-017 — new: walks `skills/*/SKILL.md`, emits `MANIFEST.json`; testable via skillsDir param | — |
| `.claude/scripts/__tests__/regenerate-manifest.test.js` | TASK-017 — 7 passing tests: discovery, null last-validated, idempotency, JSON validity | — |
| `.claude/skills/MANIFEST.json` | TASK-017 — regenerated: 9 skills, all within staleness window | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-014 — full orchestrator: 6-mode dispatch, dot flowchart, Gate 0/1/2 prompts, Phase 0–10 checklist, 18 hard stops, hotfix/resume protocols, Red Flags table | — |

---

## Sprint 2 — Scaffold + Scripts (2026-04-21)

**Blueprint version:** MINOR bump — scaffold materialized; 4 harness scripts shipped; hook contract corrected

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/CLAUDE.md` | TASK-007 — stub template per blueprint §7; ownership header; ≤200-line budget | — |
| `.claude/settings.json` | TASK-012 — valid JSON; corrected hook commands with `${CLAUDE_PLUGIN_ROOT}`; SessionStart `startup\|resume\|clear\|compact` matcher added | — |
| `.claude/settings.local.example.json` | TASK-012 — example with `[package-manager]` placeholder and inline instructions | — |
| `.claude/agents/*.md` | TASK-007 — 7 agent stubs: design-analyst, init-analyst, code-reviewer, security-analyst, migration-analyst, performance-analyst, scope-analyst | — |
| `.claude/skills/MANIFEST.json` | TASK-007 — empty stub registry; Sprint 3 TASK-017 populates it | — |
| `.claude/skills/*/SKILL.md` | TASK-007 — 9 skill stubs with valid CC_SPEC frontmatter and Sprint 3 stub markers | — |
| `.claude/scripts/session-start.js` | TASK-008 — pure Node CommonJS; all 9 checks; no shell-outs; `globSkills()` uses `readdirSync`; exit 1 on blocking errors | — |
| `.claude/scripts/read-guard.js` | TASK-009 — rewrite from scratch; stdin JSON via fd 0 (cross-platform); exit 2 block; structured `{"decision":"block","reason":"..."}` output; fail-open on empty/unknown path | — |
| `.claude/scripts/track-change.js` | TASK-010 — stdin JSON; normalized backslash→forward-slash; ignores `.claude/`, `node_modules/`, lock files | — |
| `.claude/scripts/ci-status.js` | TASK-010 — `CI_PROVIDER=skip` default; GitHub Actions + GitLab CI poll paths; error-resilient | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-011 — 12 tests covering all 9 checks; temp-dir isolation; `node --test` passes | — |
| `.claude/scripts/__tests__/read-guard.test.js` | TASK-011 — 14 tests: block/allow/allowlist/missing-phase/fail-open/JSON-output scenarios | — |
| `.claude/scripts/__tests__/track-change.test.js` | TASK-011 — 9 tests: append, accumulate, ignore rules, empty stdin, backslash normalization | — |
| `.claude/scripts/__tests__/ci-status.test.js` | TASK-011 — 3 tests: default-skip, explicit-skip, timeout guard | — |

---

## Sprint 1 — Documentation Refactor + Governance (2026-04-20)

**Blueprint version:** 1.7.0 → infrastructure split (no behavior change; PATCH bump)

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/01–10-*.md` | TASK-004 — blueprint split into 10 modular files; ownership headers on each | — |
| `AI_WORKFLOW_BLUEPRINT.md` | TASK-004 — reduced to ≤20-line redirect to `docs/blueprint/` | — |
| `docs/blueprint/01-philosophy.md` | TASK-005 — phase I/O table renumbered 0–10; violation protocol phases corrected | — |
| `docs/blueprint/04-subagents.md` | TASK-005 — `scope.phase` enum: added parse/clarify/validate/close; `status:` enum added to output contract | — |
| `docs/blueprint/05-skills.md` | TASK-005 — `type:`, `when_to_use:`, `context: fork` documented as project-convention fields (required vs optional) | — |
| `docs/blueprint/06-harness.md` | TASK-005 — read-guard.js corrected to use stdin JSON (env-var approach was broken); `${CLAUDE_PLUGIN_ROOT}` in all hook paths | — |
| `README.md` | TASK-006 — root README, ≤80 lines, public-GitHub-ready, HOW-filter clean | — |
| `CONTRIBUTING.md` | TASK-006 — blueprint change process, semver bump criteria (MAJOR/MINOR/PATCH) | — |
| `LICENSE` | TASK-006 — MIT 2026, Aldian Rizki | — |
| `.gitignore` | TASK-006 — covers settings.local.json, .phase, .session-changes.txt, node_modules | — |
| `docs/CHANGELOG.md` | Created in Sprint 0 handoff; Sprint 1 block added here | — |

---

## Sprint 0 — Research & Foundation (2026-04-20)

**Blueprint version:** pre-v1.8.0 (no scaffold changes this sprint — research only)

| File | Change | ADR |
|:-----|:-------|:----|
| `TODO.md` | Initial creation — Sprint 0 active, Sprints 1–5 in backlog, scaffold roadmap captured | — |
| `context/research/CC_SPEC.md` | TASK-001 — binding CC spec reference: hook stdin JSON contract, exit-code 2 semantics, subagent `preload-skills` field, skill frontmatter per agentskills.io, 7 concrete implications for scaffold plan | — |
| `context/research/ADAPTATION_NOTES.md` | TASK-002 — superpowers pattern import plan: 20 patterns adopted (flowcharts, Red Flags, Good/Bad pairs, rigid/flexible, model tiers, status enum, RED-GREEN-REFACTOR, etc.) with target dev-flow home; 10 architecture elements we keep; 7 patterns rejected/deferred; acceptance-criterion deltas for TASK-005, 013–019, 026–027 | — |
| `context/workflow/DESIGN_PHILOSOPHY.md` | TASK-003 — three non-negotiables (gate-driven, mode-modal, 27-stop catalog) with rationale + consequence per contributor; 8 superpowers patterns explicitly rejected with one-line why; reviewer guardrails; change-criteria for the philosophy itself | — |
