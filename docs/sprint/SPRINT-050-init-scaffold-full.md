---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Sprint state change
status: closed
plan_commit: TBD (backfill — single consolidated commit per Sprint 048/049 pattern)
close_commit: TBD (backfill)
---

# Sprint 050 — F3 Init Scaffold Full (gitignore + docs/codemap/ + docs/adr/ + skill init alignment)

**Theme:** Close the init scaffold gap surfaced post-Sprint-048. `/orchestrator init` and `node bin/dev-flow-init.js` should both produce a complete user-project harness day-1: `.claude/CLAUDE.md` + `.claude/CONTEXT.md` + `.claude/settings.json` + `.claude/settings.local.json` + `TODO.md` + `docs/{ARCHITECTURE,CHANGELOG,DECISIONS,AI_CONTEXT,SETUP}.md` + `docs/codemap/` + `docs/adr/` + `README.md` + **`.gitignore`** (NEW) + **empty `docs/codemap/` + `docs/adr/` dirs** (NEW). Highest user-project win remaining in coherence audit.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 049 closed `7b04875` (Plugin Coherence Cleanup + release-patch generalize).
**Successor:** Sprint 051 — F6 task-decomposer ↔ lean-doc-generator template lineage unify.

---

## Why this sprint exists

Sprint 048 retro Friction surfaced: "missing init outputs — `.claude/settings.json` (with hook registration!) + `.gitignore` + `docs/` skeleton + codemap dir. Without settings.json hooks dead day-1." Sprint 049 OQ-C locked: full scaffold incl. docs/ skeleton + codemap/adr dirs.

**Recon (Sprint 050 promote-time):**

- `bin/dev-flow-init.js` is mature — already copies `.claude/` (incl. `settings.json` + `settings.local.example.json`) and renders 8 templates (CLAUDE.md, TODO.md, CHANGELOG.md, ARCHITECTURE.md, DECISIONS.md, AI_CONTEXT.md, SETUP.md, README.md). 4 stack presets + `custom`. Sibling tests exist (`bin/__tests__/dev-flow-init.test.js`).
- **Real gaps (3):**
  1. `.gitignore` not generated — user-project starts with no ignore rules, so cache files (`.claude/.lean-doc-cache.json`, `.claude/.session-changes.txt`, `.claude/STATE.yaml`) + per-machine settings (`settings.local.json`) leak into git.
  2. `docs/codemap/` not created — codemap-refresh hook fires on first commit but has nowhere to write `CODEMAP.md` + `handoff.json` until dir exists.
  3. `docs/adr/` not created — `/adr-writer` skill needs the dir; manual mkdir is friction.
- **Skill flow gap:** `/orchestrator init` (skills/orchestrator/SKILL.md § init) is 3 lines — "Scaffold CLAUDE.md + CONTEXT.md + TODO.md from templates." Reality (via bin/dev-flow-init.js) generates 9 files + 2 dirs + .claude/. Skill description is incomplete vs script behavior; users following skill flow get incomplete scaffold.

**Scope boundary — what Sprint 050 IS NOT:**
- NOT adding non-interactive CLI mode to bin/dev-flow-init.js (deferred — currently script is interactive via readline; for skill invocation under Claude Code, script already works via Claude's Bash tool with stdin piping; if friction surfaces, Sprint 052+ tooling).
- NOT changing the 8 existing templates' content (Sprint 051 = template lineage unify).
- NOT wiring orphan skills (Sprint 052).
- NOT generating `docs/USER-OUTCOMES.md` for user-projects (lens registry is dev-flow-specific; user-projects don't inherit dev-flow's outcome categories). Skip.

**Per OQ-G: Date stamping = 2026-05-08.**

---

## Open Questions (locked at promote)

- (A) **`.gitignore` template content.** Options: minimal (dev-flow harness entries only) / minimal + node common (node_modules + dist) / full multi-stack (cover npm/python/cargo/go/etc). **Decision: minimal + node common.** dev-flow harness entries (`.claude/.lean-doc-cache.json` · `.claude/.session-changes.txt` · `.claude/.phase` · `.claude/STATE.yaml` · `.claude/settings.local.json` · `*.original.md`) + universal noise (`.DS_Store` · `Thumbs.db`) + node common (`node_modules/` · `dist/` · `build/` · `coverage/`). User customizes for python/cargo/go after init. Rationale: minimal = harness-mandatory only (not opinionated); minimal+node = covers ~70% of dev-flow user-projects without bloat.
- (B) **`docs/codemap/` + `docs/adr/` placeholder.** Options: `.gitkeep` / README.md placeholder / dir-only (untracked until first content). **Decision: `.gitkeep`.** Standard convention; git tracks the dir; first commit can refresh codemap into it. README.md placeholder is heavier; dir-only fails to track.
- (C) **Skill init phase scope.** Options: (1) describe full output explicitly in SKILL.md; (2) delegate fully to `node bin/dev-flow-init.js`; (3) describe + reference. **Decision: option 3 — describe scaffold output list in SKILL.md (slim), full procedure in references/phases.md, canonical implementation = `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js`.** Skill SKILL.md cap 100; init phase stays ≤10 lines. Procedure detail in phases.md.
- (D) **bin/dev-flow-init.js change shape.** **Decision:** add `templates/gitignore.template` + new function `createEmptyScaffoldDirs(target)` for docs/codemap/+adr/ with `.gitkeep`. Call in main flow after `copyScaffold(target)` + `renderTemplates(target, vars)`. Console output updated to mention new dirs + gitignore. TEMPLATE_MAP gains entry for gitignore. Add 3 sibling tests.
- (E) **Test coverage for new behavior.** **Decision:** 3 new tests in `bin/__tests__/dev-flow-init.test.js`: (1) gitignore renders to target/.gitignore with expected entries; (2) `createEmptyScaffoldDirs` creates docs/codemap/.gitkeep + docs/adr/.gitkeep; (3) idempotency — running twice doesn't error. No CLI mode tests (deferred per scope boundary).
- (F) **ADR-028 vs extending ADR-027.** **Decision: WRITE ADR-028.** Init scaffold contract is a separate decision from coherence cleanup; future re-evaluation of scaffold scope (e.g., adding `.husky/` git hooks template, adding `Dockerfile`) will re-eval against ADR-028.
- (G) **Date stamp.** All artifacts stamp 2026-05-08.
- (H) **Cap discipline.** orchestrator/SKILL.md currently 94/100 — room for ~6 lines. Init phase update target 6-8 lines (replaces existing 4-line block, net +2-4 lines). references/phases.md 171 lines (no cap). bin/dev-flow-init.js no cap (script). Test file no cap. ADR-028 ≤120 lines.
- (I) **release-patch invocation at close.** Sprint 050 = mixed diff (template add + script change + skill update + ADR + sprint file). Per release-patch rules: NOT docs-only (script change is logic). PATCH bump applies to plugin (no new mode/agent/skill — gitignore template is content addition, not skill addition). **Decision: invoke release-patch at close; expect PATCH bump (e.g., v2.5.0 → v2.5.1 — pending Sprint 049 MINOR backlog reconcile).** Sprint 049 MINOR bump still pending manual reconcile; do NOT amend; chain new PATCH after manual MINOR.
- (J) **MINOR pending reconciliation from Sprint 049.** Sprint 049 left a manual MINOR bump pending (skill removal + rename + behavior change). Sprint 050 should NOT release-patch until Sprint 049 MINOR is reconciled OR explicitly defer reconcile to a later sprint. **Decision: DEFER MINOR reconcile to dedicated tooling sprint (post-Sprint 052).** Sprint 050 closes with manual close commit only; no release-patch invocation; MINOR + Sprint 050 PATCH chain captured in TODO.md backlog as `release-debt`.

---

## Plan

### T1 — Create `templates/gitignore.template`
**Scope:** small · **Layers:** templates · **Risk:** low · **HITL** *(reviewer verifies: entries cover dev-flow harness mandatorily; node common entries reasonable; no over-inclusion)*
**Acceptance:**
- (a) NEW `templates/gitignore.template` with exactly these sections: `# Claude Code harness (dev-flow)`, `# Caveman compress backups`, `# OS noise`, `# Node common`. Total ~20 lines.
- (b) Content matches OQ-A decision (minimal + node common).
- (c) Sprint file § Files Changed row recorded.
**Source:** dev-flow's own `.gitignore` + lean-doc-generator skill cache convention + Sprint 048 lessons.
**Depends on:** none.

### T2 — Update `bin/dev-flow-init.js` + sibling tests
**Scope:** small-medium · **Layers:** scripts, ci · **Risk:** medium · **HITL** *(reviewer verifies: TEMPLATE_MAP entry; createEmptyScaffoldDirs function; main flow ordering; console output; 3 new tests pass; idempotent)*
**Acceptance:**
- (a) `bin/dev-flow-init.js` TEMPLATE_MAP gains `{ src: 'templates/gitignore.template', dest: '.gitignore' }` (no substitution variables — gitignore is static).
- (b) New function `createEmptyScaffoldDirs(target)` creates `docs/codemap/` + `docs/adr/` with `.gitkeep` files. Idempotent (uses `fs.mkdirSync(..., { recursive: true })`; writes .gitkeep only if missing).
- (c) `main()` calls `createEmptyScaffoldDirs(target)` after `renderTemplates(target, vars)`.
- (d) Module exports `createEmptyScaffoldDirs` for testing.
- (e) Console output line `Scaffold written to: <target>` followed by new line: `Empty dirs created: docs/codemap/ + docs/adr/ (.gitkeep tracked)`.
- (f) `bin/__tests__/dev-flow-init.test.js` gains 3 tests: (i) `applySubstitutions` skipped (gitignore is no-substitution); just verify TEMPLATE_MAP includes gitignore entry — `assert.ok(TEMPLATE_MAP.find(e => e.dest === '.gitignore'))`; (ii) `createEmptyScaffoldDirs` writes both `.gitkeep` files; (iii) `createEmptyScaffoldDirs` is idempotent on re-run.
- (g) Tests pass: `node --test bin/__tests__/dev-flow-init.test.js`.
- (h) Sprint file § Files Changed rows recorded.
**Source:** existing bin/dev-flow-init.js + test file + T1 gitignore template.
**Depends on:** T1.
**Note:** Test #i requires exporting TEMPLATE_MAP from dev-flow-init.js — currently TEMPLATE_MAP is module-internal const. Add to module.exports or use a thin wrapper function.

### T3 — Update `skills/orchestrator/SKILL.md` init phase + `references/phases.md`
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: SKILL.md cap held ≤100; init phase lists full scaffold output; references/phases.md gains init detail block)*
**Acceptance:**
- (a) `skills/orchestrator/SKILL.md` § Phases § init block expanded from 3 lines to ~7 lines: enumerates 11+ scaffold outputs (`.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `.claude/settings.json` · `.claude/settings.local.json` · `TODO.md` · `docs/ARCHITECTURE.md` · `docs/CHANGELOG.md` · `docs/DECISIONS.md` · `docs/AI_CONTEXT.md` · `docs/SETUP.md` · `docs/codemap/` (empty + .gitkeep) · `docs/adr/` (empty + .gitkeep) · `README.md` · `.gitignore`); references `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js` as canonical implementation; references `references/phases.md § init` for detail.
- (b) Cap held ≤100 (target 96-98 lines).
- (c) `skills/orchestrator/references/phases.md` gains new `## init Phase` section after `## Commit Format` and before `## Session Close`. Section content: full scaffold contract (file list + per-file purpose); plugin-install vs scaffold-copy convergence (both paths converge on bin/dev-flow-init.js outputs); idempotency notes.
- (d) Sprint file § Files Changed rows recorded.
**Source:** existing orchestrator SKILL.md + bin/dev-flow-init.js TEMPLATE_MAP + new createEmptyScaffoldDirs.
**Depends on:** T1 + T2 (init phase content references the scaffold-output truth that T1+T2 establish).

### T4 — ADR-028 init scaffold contract
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: ADR ID non-colliding; 4 decisions captured; cross-links resolve; ≤120 lines)*
**Acceptance:**
- (a) NEW `docs/adr/ADR-028-init-scaffold-contract.md` (≤120 lines).
- (b) 4 decisions: (1) full scaffold = 11 files + 2 empty dirs; (2) `.gitignore` minimal + node common (per OQ-A); (3) `.gitkeep` for empty dirs (per OQ-B); (4) skill init phase delegates to `node bin/dev-flow-init.js` (per OQ-C).
- (c) Context cites ISSUE-03 lens + Sprint 048 retro Friction + Sprint 049 OQ-C lock.
- (d) Alternatives + Consequences per ADR-019..027 template.
- (e) Cross-links: USER-OUTCOMES.md (init outcome = O1 onboarding · O7 template), Sprint 050 plan, Sprint 048 retro.
- (f) Sprint file § Files Changed + § Decisions rows recorded.
**Source:** Sprint 050 OQ block + ADR-027 template.
**Depends on:** T1 + T2 + T3.

### T5 — TODO.md sprint pointer + Roadmap update + release-debt backlog
**Scope:** small · **Layers:** governance · **Risk:** low · **HITL** *(reviewer verifies: sprint pointer flipped; Active Sprint cleared at close; Roadmap rows correct; release-debt backlog row added)*
**Acceptance:**
- (a) Frontmatter `sprint: none` → `sprint: 050` at promote → `none` at close.
- (b) Active Sprint block: TASK-121 with sub-tasks T1-T5.
- (c) `> Next:` updates to point at Sprint 051 (F6 template unify).
- (d) Backlog § P0: TASK-121 status `[x]` at close.
- (e) Backlog § P2: NEW row `**release-debt** — Sprint 049 MINOR (skill drop + rename + behavior change) + Sprint 050 PATCH (script + template add) require manual reconcile + chained release. Deferred to post-Sprint-052 tooling sprint per ADR-028 OQ-J. Estimated S, layers governance, scripts.`
- (f) Roadmap row for Sprint 50 marked `(in_progress)` at promote → `(done — <SHA>)` at close. Sprints 51-55 unchanged.
- (g) Sprint file § Files Changed row recorded.
**Source:** existing TODO.md + Sprint 049 close pattern.
**Depends on:** T1 + T2 + T3 + T4.

---

## Dependency chain

```
T1 (gitignore template)               independent
T2 (bin/dev-flow-init.js + tests)     depends T1
T3 (orchestrator SKILL + phases.md)   depends T1 + T2
T4 (ADR-028)                          depends T1 + T2 + T3
T5 (TODO.md)                          depends T1+T2+T3+T4
```

Recommended execution: **T1 → T2 → T3 → T4 → T5**.

---

## Cross-task risks

- **bin/dev-flow-init.js test pass (T2).** Tests must pass before commit. Run `node --test bin/__tests__/dev-flow-init.test.js` post-T2.
- **TEMPLATE_MAP export ergonomics (T2).** TEMPLATE_MAP is currently module-internal. Adding to module.exports is non-breaking; existing tests continue to import `{applySubstitutions, getStackPreset, ...}` cleanly.
- **`.gitignore.template` filename (T1).** Some tools (npm publish, fs.cpSync filter) treat leading-dot files specially. Decision: file is named `templates/gitignore.template` (NO leading dot in src) — TEMPLATE_MAP entry maps to dest `.gitignore` (renames at copy). Avoids any leading-dot edge cases.
- **Cap discipline (T3).** orchestrator SKILL.md currently 94/100; init phase update +4-6 lines. Verify ≤100 post-edit.
- **Idempotency (T2).** `createEmptyScaffoldDirs` runs second time should NOT error or duplicate. Verified by test #iii.
- **No skill behavior change.** Templates + script + skill description = pure scaffold expansion. Existing skill triggers unchanged. Existing scaffold workflow extended, not replaced.
- **release-debt accumulation.** Sprint 049 MINOR + Sprint 050 PATCH chain. OQ-J defers reconcile to dedicated sprint post-052. Reviewer must verify TODO.md backlog row added.
- **Plugin install vs scaffold-copy convergence.** Plugin install path: hooks load from hooks/hooks.json automatically; user runs `/orchestrator init` for scaffolding. Scaffold copy path: user runs `node bin/dev-flow-init.js`. Both paths converge on bin/dev-flow-init.js for content output. ADR-028 records this convergence explicitly.

---

## Sprint DoD

- [x] T1 `templates/gitignore.template` created (18 lines, dev-flow harness mandatory + node common).
- [x] T2 `bin/dev-flow-init.js` updated (TEMPLATE_MAP + new `createEmptyScaffoldDirs` function + `EMPTY_SCAFFOLD_DIRS` constant + main() integration + module exports extended); 3 new tests pass (34/34 total via `node --test`).
- [x] T3 `skills/orchestrator/SKILL.md` § init Phase expanded 4 → 5 lines (cap held 95/100); `references/phases.md` gains § init Phase block (212 lines, no cap).
- [x] T4 ADR-028 written (98 lines / cap 120) — 4 decisions: full scaffold = 11 files + 2 empty dirs · gitignore minimal+node common · `.gitkeep` for empty dirs · skill delegates to bin script.
- [x] T5 TODO.md `sprint: 050`; Active Sprint → TASK-121 + sub-tasks; TASK-120 marked `[x]`; release-debt row added in P2; Roadmap rows updated for Sprints 49 (done) + 50 (in_progress).
- [x] Plan + close consolidated commit per Sprint 048/049 pattern; SHA backfill follow-up.
- [x] Open questions A-J resolved at promote; zero re-litigation during execution.
- [x] Date verification: all artifacts stamp 2026-05-08.
- [x] ADR-028 ID verified non-colliding (max ADR was 027 post-Sprint-049).
- [x] Cap discipline held: orchestrator SKILL.md 95/100 · ADR-028 98/120 · sprint file 203 lines (under 300).
- [x] release-patch NOT invoked at close — release-debt (Sprint 049 MINOR + Sprint 050 PATCH chain) deferred per OQ-J; manual close commit only.
- [x] Zero unrelated edits — only sprint-intent files staged; pre-existing untracked files (AUDIT.md / BLUEPRINT etc) left alone.
- [x] Sibling tests pass: 34/34 (`node --test bin/__tests__/dev-flow-init.test.js`); 3 new tests added (TEMPLATE_MAP entry · createEmptyScaffoldDirs writes .gitkeep · idempotent on re-run).

---

## Execution Log

### 2026-05-08 | T1 done — single consolidated commit (SHA backfill)
`templates/gitignore.template` (18 lines) created with 4 sections: Claude Code harness · Caveman backups · OS noise · Node common. dev-flow harness mandatory entries cover lean-doc-cache, session-changes, phase, STATE.yaml, settings.local.json. Node common = node_modules/, dist/, build/, coverage/. python/cargo/go users customize after init.

### 2026-05-08 | T2 done — same commit
`bin/dev-flow-init.js`: TEMPLATE_MAP gains `{ src: 'templates/gitignore.template', dest: '.gitignore' }`. New `EMPTY_SCAFFOLD_DIRS = ['docs/codemap', 'docs/adr']` constant. New `createEmptyScaffoldDirs(target)` function — idempotent (preserves existing .gitkeep; uses `recursive: true` mkdir; only writes .gitkeep if missing). Called in `main()` after `renderTemplates(target, vars)`. Console output adds `Empty dirs created: docs/codemap/ + docs/adr/ (.gitkeep tracked)`. Module exports extended: `createEmptyScaffoldDirs`, `TEMPLATE_MAP`, `EMPTY_SCAFFOLD_DIRS`, `renderTemplates`.

`bin/__tests__/dev-flow-init.test.js`: 3 new tests appended after existing renderSettingsLocal tests. Test 1 verifies TEMPLATE_MAP includes gitignore entry mapping correctly. Test 2 verifies createEmptyScaffoldDirs creates both dirs + .gitkeep files. Test 3 verifies idempotency by writing user content to docs/codemap/CODEMAP.md, re-running createEmptyScaffoldDirs, asserting user content preserved + .gitkeep still present.

`node --test bin/__tests__/dev-flow-init.test.js` → 34 pass / 0 fail.

### 2026-05-08 | T3 done — same commit
`skills/orchestrator/SKILL.md` § init Phase: 4 → 5 numbered steps. Step 1 unchanged (precondition check). Step 2 = full scaffold list (11 files + 2 dirs) with bin/dev-flow-init.js delegation. Step 3 = stack preset prompt enumerating 5 presets. Step 4 = confirm + reference to phases.md detail. Cap held 95/100.

`skills/orchestrator/references/phases.md`: NEW § init Phase section between Commit Format and Session Close. Contains scaffold output table (14 rows: per-file source + purpose), stack preset table (5 presets × 4 fields), convergence note (plugin-install vs scaffold-copy), idempotency notes. 212 lines total (no cap on references/).

### 2026-05-08 | T4 done — same commit
`docs/adr/ADR-028-init-scaffold-contract.md` (98 lines / cap 120). 4 decisions captured. Alternatives section explicitly considers: skill replicates inline (rejected — 2 sources of truth), .husky+Dockerfile templates (rejected — opinionated), generate USER-OUTCOMES for user-projects (rejected — inverse of ISSUE-03 lesson), CLI flags for non-interactive (deferred not rejected — future Sprint 052+ tooling), multi-stack gitignore (rejected — bloat). Consequences acknowledge node-leaning gitignore default + interactive-only script as accepted trade-offs.

### 2026-05-08 | T5 done — same commit
`TODO.md`: frontmatter `sprint: 050`; Active Sprint → TASK-121 with T1-T5 sub-tasks; TASK-120 marked `[x]` with Sprint 049 SHA reference; TASK-121 row description updated to reflect actual delivered scope; release-debt row added in P2 backlog (Sprint 049 MINOR + Sprint 050 PATCH chain pending tooling sprint reconcile); Roadmap row Sprint 49 marked done with SHA, Sprint 50 marked in_progress.

### 2026-05-08 | sprint close
This commit. F3 init scaffold contract structurally complete. Day-1 user-project harness now: hooks register (.claude/settings.json copied), codemap-refresh has dir (.gitkeep), adr-writer has dir (.gitkeep), git ignores cache files (.gitignore), all 8 templates rendered with stack-specific lint/typecheck wired into PreToolUse hooks. Sprint 051 next: F6 task-decomposer ↔ lean-doc-generator template lineage unify.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `templates/gitignore.template` | T1 | NEW (~20 lines) — dev-flow harness + node common entries | low | — |
| `bin/dev-flow-init.js` | T2 | TEMPLATE_MAP + gitignore entry; new `createEmptyScaffoldDirs` function; main flow integration; module.exports extended | medium | T2.f |
| `bin/__tests__/dev-flow-init.test.js` | T2 | 3 new tests (TEMPLATE_MAP includes gitignore; createEmptyScaffoldDirs writes .gitkeep; idempotent) | low | self |
| `skills/orchestrator/SKILL.md` | T3 | § init phase expanded (~7 lines vs 3); cap held ≤100 | low | — |
| `skills/orchestrator/references/phases.md` | T3 | NEW § init Phase block | low | — |
| `docs/adr/ADR-028-init-scaffold-contract.md` | T4 | NEW (≤120 lines) — 4-decision init scaffold contract ADR | low | — |
| `TODO.md` | T5 | sprint pointer 050; Active Sprint → TASK-121; release-debt P2 backlog row; Roadmap row updated | low | — |
| `docs/sprint/SPRINT-050-init-scaffold-full.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | Full init scaffold = 11 files + 2 empty dirs (`.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `.claude/settings.json` · `.claude/settings.local.json` · `TODO.md` · `docs/{ARCHITECTURE,CHANGELOG,DECISIONS,AI_CONTEXT,SETUP}.md` · `docs/codemap/` · `docs/adr/` · `README.md` · `.gitignore`) | Day-1 user-project harness must be complete; missing settings.json kills hooks; missing dirs kill codemap-refresh + adr-writer | ADR-028 |
| DEC-2 | `.gitignore` template content = minimal (dev-flow harness mandatory) + node common (npm/node_modules/dist) | Covers ~70% of typical user-projects without bloating; users customize for python/cargo/go after init | ADR-028 |
| DEC-3 | Empty dirs use `.gitkeep` placeholder | Standard convention; git tracks dir; first commit can populate | ADR-028 |
| DEC-4 | `/orchestrator init` skill phase delegates to `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js`; SKILL.md describes scaffold output, references/phases.md owns procedure detail | Single source of truth (Node script); skill stays slim under 100-line cap; future scaffold changes update one place | ADR-028 |

---

## Open Questions for Review

*(none surfaced during execution — all 10 promote-time OQs (A-J) resolved cleanly via "approve all" pattern. Recon at promote was thorough enough that execution found zero structural surprises. Cap discipline held first-try without iteration. Test suite passed first run.)*

---

## Retro

### Worked
- **Recon-before-plan paid off (huge).** Sprint 048 retro flagged "missing init outputs" generically. Sprint 049 OQ-C locked "full scaffold incl. docs/ skeleton + codemap/adr dirs" without specifying exact gaps. Sprint 050 promote-time recon (read bin/dev-flow-init.js + hooks/hooks.json + .claude/settings.json + check tests dir + check templates dir) revealed: bin script ALREADY does ~85% of the desired scaffold. Real gaps were narrow (.gitignore + docs/codemap/+adr/ dirs + skill description alignment). Without recon, Sprint 050 might have re-implemented existing capabilities. Pattern: when a sprint touches mature infrastructure, recon-first is non-negotiable.
- **Single source of truth via delegation.** Skill `/orchestrator init` delegates to `node bin/dev-flow-init.js` rather than replicating logic inline. Skill SKILL.md stayed slim (95/100 cap). Future scaffold-content changes update one place (script + template + tests). Pattern carried from Sprint 049 references/version-detection.md (skill stays slim, references owns implementation).
- **Sibling tests caught zero issues but enabled confidence.** 3 new tests passed first run. CLAUDE.md Quick Rule "every script under scripts/ gets a sibling __tests__/<name>.test.js" extends to bin/ scripts (TEMPLATE_MAP and createEmptyScaffoldDirs are testable surfaces). Idempotency test explicitly catches a class of bugs that don't manifest until a user re-runs init on a populated repo.
- **Convergence pattern explicit in ADR.** ADR-028 names the plugin-install vs scaffold-copy convergence rule explicitly: both paths produce identical scaffold output via bin/dev-flow-init.js. Future contributors don't have to re-derive this; the convergence is a locked decision.
- **`.gitkeep` over README placeholders.** Resisted scope creep (filling docs/codemap/ + docs/adr/ with explanatory README placeholders). Empty dirs are the right shape — they're container surfaces, not documentation surfaces. README in docs/codemap/ would be wrong-level.

### Friction
- **release-debt accumulating.** Sprint 049 MINOR (skill removal + rename + behavior change) deferred manual reconcile. Sprint 050 PATCH (script logic + template add) chains on top. Now 2-bump backlog item in P2. release-patch SKILL handles PATCH only by design; MINOR+chained-PATCH needs manual sequence. Will hit critical mass if more sprints accumulate. OQ-J defers to post-Sprint-052 tooling sprint, but pattern: release-patch should support `--minor` / `--major` flag OR MINOR-bump skill should land before more behavior-changing sprints.
- **Skill init phase still doesn't actually invoke bin/dev-flow-init.js.** SKILL.md describes the delegation; users following skill flow under Claude Code may need to manually run `node bin/dev-flow-init.js` rather than have the skill auto-invoke via Bash tool. Whether Claude actually calls bin script when skill fires is implementation-defined by Claude Code runtime, not by SKILL.md text. If friction surfaces in real-world plugin install testing, add explicit `Bash(node ...)` invocation in skill flow OR add CLI flag mode to script for cleaner programmatic invocation. Deferred not addressed.
- **Convergence claim untested.** ADR-028 § Decision-1 claims plugin-install + scaffold-copy converge on identical scaffold output. Plugin-install path requires actual plugin install in fresh repo + `/orchestrator init` invocation to verify. Currently convergence is theoretically guaranteed (both paths use same bin script content) but empirically unverified. Acceptance harness Sprint 053 should cover.
- **Interactive-only script vs Claude Code skill flow.** bin/dev-flow-init.js uses readline for prompts. Claude Code Bash tool may pipe stdin but interactive prompts are awkward. CLI flag mode (--target, --project, --owner, --stack) would make skill invocation cleaner. Deferred per OQ + ADR-028 alternative #4.

### Pattern candidates (carried forward)
1. **Recon-first when touching mature infra.** Before planning a sprint that modifies a mature script/skill, read the current implementation + tests + dependencies. Cuts ~50% of speculative scope per sprint when it applies. Codify in lean-doc-generator Sprint Promote checklist.
2. **Empty-dir contracts via .gitkeep.** When a tool/hook expects a directory to exist (codemap-refresh expects docs/codemap/), pre-create with .gitkeep at scaffold time rather than first-use auto-mkdir. Predictability + git tracking from day-1.
3. **Convergence statement in ADR.** When two invocation paths (skill vs script · plugin-install vs scaffold-copy) should produce identical outputs, lock the convergence rule in an ADR. Prevents future drift; future contributors read the ADR rather than re-deriving.
4. **Idempotency test as design discipline.** Writing the idempotency test for `createEmptyScaffoldDirs` forced explicit thinking about re-run semantics (preserve user content; only write .gitkeep if missing; uses recursive mkdir). Pattern: test design forces implementation rigor.
5. **Release-debt as P2 backlog row, not silent.** When release-patch can't handle a bump shape (MINOR while skill does PATCH only; chained PATCH on top of pending MINOR), surface as explicit `release-debt` backlog row with sprint references. Prevents loss-of-context when reconcile sprint lands.

### Surprise log
- T1: gitignore template was 18 lines, not 20 estimated. Tighter than expected because dev-flow's own .gitignore (12 lines) was already minimal; just added node common (4 lines) + caveman backup (1 line) + section headers (4 lines).
- T2: TEMPLATE_MAP order matters slightly — gitignore added at end of array. fs render order = array order. Last template rendered = .gitignore. No semantic dependency between templates so order is cosmetic.
- T2: Initial test draft included `applySubstitutions` test for gitignore content. Realized gitignore is NO-substitution (no [Project Name] / [role] / YYYY-MM-DD tokens). Replaced with TEMPLATE_MAP membership test instead — cleaner.
- T3: SKILL.md cap delta was +1 line (94→95) not +4 estimated. Single-numbered-line replaced 3 numbered lines, plus added 2 new lines, but blank-line normalization saved 2.
- T4: ADR-028 came in at 98 lines vs 120 cap. Pattern from Sprint 049 ADR-027 (85 lines): well-structured 4-decision ADRs land ~80-100 lines without strain. Cap pressure kicks in at 7+ decisions.
- close: zero re-litigation during execution. Recon-first pattern (#1 candidate) compounded with pre-resolve-OQs-at-promote pattern (Sprints 042+) to make execution mechanical. Pattern combination = high-confidence sprint shape.
