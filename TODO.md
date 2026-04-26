# dev-flow — Universal AI Workflow Starter — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-26 (Sprint 18 active; EPIC-A..E all decomposed)
update_trigger: Sprint completed, task added, task status changed, or scaffold milestone reached
status: current
sprint: 18
---

> **External references** (sprint improvement sources — read before working on derived tasks)
> - https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md → behavioral guidelines patterns used in TASK-032
> - https://github.com/juliusbrussee/caveman → eval harness, single-source-of-truth discipline, context compression; used in TASK-033, 034, 036
> - https://github.com/obra/superpowers → Baseline guide for flow plugin development popular, TASK-018

> **How to use this file**
> - **Start of session** — read this file first. Understand the active sprint before touching code.
> - **Run /dev-flow** — once the orchestrator skill is materialized (Sprint 3), it will parse the first incomplete task `[ ]` in Active Sprint.
> - **Until Sprint 3 ships** — manual mode: pick the next `[ ]` task, run it through the workflow described in `AI_WORKFLOW_BLUEPRINT.md` Section 3 by hand.
> - **End of session** — Phase 10 Session Close. Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, append a Changelog row (File | Change | ADR), update relevant docs, then rotate the sprint block to `docs/CHANGELOG.md`.
> - **Docs to keep in sync**: `README.md` (root) · `docs/blueprint/*` · `CHANGELOG.md` · `CONTRIBUTING.md` · `.claude/CLAUDE.md` (when it exists)
> - **Changelog rule** — holds ONLY the current in-progress sprint. Once changes are reflected in docs, MOVE the sprint block to `docs/CHANGELOG.md` (prepend — newest first), then DELETE from here.

> **Sprint sizing rules** (per blueprint §8)
> - Group 2–5 tasks per sprint. Never plan a sprint with only 1 task.
> - Order by dependency first, then importance + urgency.
> - Promote tasks from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately when added to Active Sprint.

> **Layer values for this repo** (used in `layers:` field — meta-repo, no app code)
> `governance, docs, harness, scripts, skills, agents, templates, examples, ci`

---

## Active Sprint

### Sprint 18 — Plugin-first distribution (pending)
> **Theme:** Lay groundwork for Claude Code plugin distribution. Verify spec, create manifest, update docs. TASK-067 (path rewrite) runs standalone after sprint.
> **Source:** Backlog P1 EPIC-A decomposed (TASK-065..069).

> ⚠️ Promote tasks from Backlog P1 before running `/dev-flow sprint`. Suggested Sprint 18: TASK-065 + TASK-066 + TASK-068 (weight 3, single-phase). TASK-067 blocked standalone. TASK-069 after TASK-067.

---

## Backlog

### P1 — Audit Pass 1 follow-on (correctness + adoption)

<!-- AUD-001, AUD-002 promoted to Sprint 14 (TASK-050, TASK-051) -->
<!-- TASK-054, TASK-055, TASK-056 promoted to Sprint 15 -->
<!-- TASK-057, TASK-058 promoted to Sprint 16 -->
<!-- TASK-059, TASK-060 promoted to Sprint 17 -->

### P1 — Workflow self-audit (raised in Sprint 14 session)

<!-- TASK-064 promoted to Sprint 15 -->

### P2 — Audit Pass 1 polish

<!-- TASK-061, TASK-062 promoted to Sprint 16 -->
<!-- TASK-063 promoted to Sprint 17 -->

### P1 — EPIC-A decomposed: Plugin-first distribution

> Dependency order: TASK-065 → TASK-066 → TASK-067 → TASK-068 → TASK-069. TASK-067 is scope:full + risk:high — runs standalone, not in sprint phase.

- [ ] **TASK-065: Verify CC plugin spec; document layout contract**
  - scope: quick · layers: docs, governance · risk: low
  - api-change: no
  - acceptance: Read `context/research/CC_SPEC.md` (or latest Claude Code plugin docs). Produce `docs/research/cc-plugin-spec.md` confirming: plugin.json schema, where skills/agents/hooks live, how plugin-relative path vars work. Assumptions 1 and 4 from EPIC-A decomposition confirmed or corrected. No code changes.
  - tracker: STRATEGY_REVIEW.md#R-1 / EPIC-A

- [ ] **TASK-066: Create `.claude-plugin/plugin.json` manifest**
  - scope: quick · layers: governance, templates · risk: low
  - api-change: no
  - acceptance: `.claude-plugin/plugin.json` created per verified spec (TASK-065 prerequisite). Declares name, version, skills[], agents[], hooks reference. `validate-scaffold.js` or new `validate-plugin.js` checks it exists and has required fields. Unit test added.
  - tracker: STRATEGY_REVIEW.md#R-1 / EPIC-A

- [ ] **TASK-067: Rewrite path refs `.claude/` → plugin-relative var in skills + agents**
  - scope: full · layers: skills, agents, scripts · risk: high
  - api-change: yes — skill/agent file paths change; adopters using scaffold-copy unaffected; plugin installs get new paths
  - acceptance: All `${CLAUDE_SKILL_DIR}/references/` paths in SKILL.md files use plugin-relative var. `read-guard.js`, `session-start.js` allowlists updated for new root. Existing scaffold-copy path (`bin/dev-flow-init.js`) still works unchanged. All 151+ tests pass.
  - tracker: STRATEGY_REVIEW.md#R-1 / EPIC-A

- [ ] **TASK-068: Update README + bin/ docs for plugin-first install path**
  - scope: quick · layers: docs, templates · risk: low
  - api-change: no
  - acceptance: README primary install path is plugin install command. `bin/dev-flow-init.js` documented as fallback/scaffold-copy. "What gets created" table updated to reflect plugin layout. CONTRIBUTING.md updated if it references old paths.
  - tracker: STRATEGY_REVIEW.md#R-1 / EPIC-A

- [ ] **TASK-069: E2E smoke test — install plugin in clean project, run /dev-flow**
  - scope: quick · layers: examples, ci · risk: medium
  - api-change: no
  - acceptance: `examples/node-express/` repurposed as integration test fixture. Script or manual steps documented in `examples/README.md`: install plugin → run `/dev-flow full TASK-001` → verify Phase 0 parses correctly. CI step added to validate plugin manifest on PRs.
  - tracker: STRATEGY_REVIEW.md#R-1 / EPIC-A

### P1 — EPIC-B decomposed: Code-enforced gates

> Dependency order: TASK-070 → TASK-071/072 (parallel) → TASK-073 → TASK-074. Proposed: Sprint 19: TASK-070..072. Sprint 20: TASK-073..074.

- [ ] **TASK-070: Define gate-module interface + gate-constants.js**
  - scope: quick · layers: scripts, governance · risk: low
  - api-change: no
  - acceptance: `.claude/scripts/gate-constants.js` created, exports `GATE_RESULT` shape `{ pass: boolean, missing: string[], suggested_fix: string }` and `GATE_IDS` enum (`gate0`, `gate1`, `gate2`). JSDoc documents contract. Unit test in `__tests__/gate-constants.test.js` asserts shape and enum values. No gate logic present — constants and shape only.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: none

- [ ] **TASK-071: Implement gate-0.js — scope confirmation enforcer**
  - scope: quick · layers: scripts · risk: medium
  - api-change: yes — `gate0(inputs) → GateResult` new callable module; dev-flow SKILL.md Phase 0 checklist gains `node .claude/scripts/gate-0.js` invocation line
  - acceptance: `.claude/scripts/gate-0.js` exports `gate0(inputs)` returning `GateResult`. Checks: (1) `tracker` not `"none"` without justification string; (2) `scope` is one of `full|quick|hotfix`; (3) `acceptance` not empty or `"works correctly"`. CLI exits 1 on fail with `[FAIL]` line per violation. Unit test covers pass case + tracker-none-no-justification fail + empty-acceptance fail.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: TASK-070

- [ ] **TASK-072: Implement gate-1.js and gate-2.js — design plan + final gate enforcers**
  - scope: quick · layers: scripts · risk: medium
  - api-change: yes — two new callable modules; dev-flow SKILL.md Gate 1 and Gate 2 blocks gain `node .claude/scripts/gate-1.js` / `gate-2.js` invocation lines
  - acceptance: `gate-1.js` exports `gate1(inputs)` checking: (1) at least one file listed in design plan; (2) micro-tasks present (non-empty array). `gate-2.js` exports `gate2(inputs)` checking: (1) no open CRITICAL review findings; (2) `ci_status` field is green. Both exit 1 with `[FAIL]` lines on violations. Unit tests cover pass case + each failure mode for both modules.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: TASK-070

- [ ] **TASK-073: Consolidate hard-stops.md to 5 enforced + documented warnings**
  - scope: quick · layers: skills, docs · risk: low
  - api-change: no
  - acceptance: `hard-stops.md` rewritten with two sections: "Enforced (exit code 1)" listing exactly the R-5 five stops mapped to gate-0/1/2 or validate-scaffold; "Warnings (non-blocking, logged)" listing remaining stops with warning message format. `dev-flow/SKILL.md` hard-stop count references updated. DECISIONS.md gains entry recording reduction rationale. Line limit respected.
  - tracker: STRATEGY_REVIEW.md#R-5 / EPIC-B
  - depends-on: TASK-071, TASK-072

- [ ] **TASK-074: Wire gate modules into validate-scaffold.js + add integration test**
  - scope: full · layers: scripts, ci · risk: high
  - api-change: no
  - acceptance: `validate-scaffold.js` gains checks 9/10/11 importing and calling `gate0`, `gate1`, `gate2` with fixture inputs from `.claude/.gate-fixtures.json` (gitignored; `.gate-fixtures.json.example` committed as template). Integration test in `__tests__/gate-integration.test.js` runs all three gates against known-good fixture (asserts exit 0) and broken fixture (asserts exit 1 with correct `[FAIL]` line). All 151+ existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: TASK-071, TASK-072, TASK-073

### P1 — EPIC-C decomposed: Dogfood on real product

> Dependency order: TASK-075 → TASK-076 → TASK-077 (linear). Proposed: Sprint 19 (runs alongside or after EPIC-B Sprint 19 tasks).

- [ ] **TASK-075: Bootstrap dogfood project in `examples/node-express/` using dev-flow scaffold**
  - scope: quick · layers: examples, governance · risk: low
  - api-change: no
  - acceptance: `examples/node-express/` has complete `.claude/` tree (CLAUDE.md, skills/, agents/, scripts/) generated by `node bin/dev-flow-init.js` with stack=node-express. `examples/node-express/TODO.md` has Sprint 1 defined with at least one real TASK-001 (not `[CUSTOMIZE]` placeholder). `examples/README.md` updated to reflect populated `.claude/` tree. Human can open Claude Code in `examples/node-express/` and run `/dev-flow` without hitting a missing-file error.
  - tracker: STRATEGY_REVIEW.md#R-10 / EPIC-C
  - depends-on: none

- [ ] **TASK-076: Run one full feature (TASK-001) through all 10 dev-flow phases; record friction inline**
  - scope: full · layers: examples, docs · risk: medium
  - api-change: no
  - acceptance: TASK-001 in `examples/node-express/TODO.md` marked `[x]` (Gate 2 approved). `docs/research/dogfood-session-notes.md` exists in dev-flow repo with: (1) row per phase (0–10) with "what happened" and "friction observed" columns; (2) at least one concrete friction item per gate (Gate 0, 1, 2); (3) any hard stop that fired or explicit note that none fired. Session notes committed to dev-flow repo, not the example project.
  - tracker: STRATEGY_REVIEW.md#R-10 / EPIC-C
  - depends-on: TASK-075

- [ ] **TASK-077: Compile friction log → `docs/research/dogfood-friction-log.md`; update STRATEGY_REVIEW.md; close EPIC-C**
  - scope: quick · layers: docs, governance · risk: low
  - api-change: no
  - acceptance: `docs/research/dogfood-friction-log.md` created with sections: "Friction items" (phase, description, severity low/medium/high, suggested fix), "What worked well", "Recommended follow-up tasks". `STRATEGY_REVIEW.md` R-10 section updated with one-paragraph outcome summary referencing the log. EPIC-C in `TODO.md` marked `[x]` with date and pointer to friction log. `DECISIONS.md` gains one entry: "Dogfood outcome — validation confirmed/rejected". Line caps respected on all edited files.
  - tracker: STRATEGY_REVIEW.md#R-10 / EPIC-C
  - depends-on: TASK-076

### P1 — EPIC-D decomposed: State as YAML, telemetry as JSONL

> Dependency order: TASK-078 → TASK-079 → TASK-080 + TASK-081. TASK-082 → TASK-083 → TASK-084. Both sub-tracks converge at TASK-085. Proposed: Sprint 19: TASK-078..080. Sprint 20: TASK-081..083. Sprint 21: TASK-084..085.

- [ ] **TASK-078: Define `.claude/state.yaml` schema + JSON Schema for validation**
  - scope: quick · layers: governance, docs · risk: low
  - api-change: no
  - acceptance: `docs/research/state-yaml-schema.md` documents schema with required top-level keys: `sprint` (int), `sprint_theme` (string), `tasks` (array with fields `id`, `title`, `status` (`open|in_progress|done|skipped`), `scope`, `layers`, `risk`, `api_change`, `acceptance`, `tracker`, `depends_on`) and optional keys `gate_status` (map of gate id to `passed|failed|pending`) and `active_phase` (string). `docs/research/state.schema.json` committed and validated via `node -e "require('./docs/research/state.schema.json')"` with no error. `docs/research/state.yaml.example` committed with one sprint, two tasks, gate_status and active_phase populated. No `.claude/state.yaml` created — schema only.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: none

- [ ] **TASK-079: Implement `state-io.js` — state.yaml reader/writer module**
  - scope: quick · layers: scripts · risk: medium
  - api-change: yes — new callable module; exports `readState(root?)`, `writeState(state, root?)`, `updateTaskStatus(id, status, root?)`
  - acceptance: `.claude/scripts/state-io.js` created, CommonJS, Node ≥18, no npm dependencies. `readState` returns parsed object or throws `StateReadError`; `writeState` writes atomically (tmp file then rename), throws `StateWriteError` on failure; `updateTaskStatus` reads-mutates-writes, throws `StateNotFoundError` if id absent. Unit tests in `__tests__/state-io.test.js` cover: valid file passes; missing file throws `StateReadError`; round-trip (write then read equals input); `updateTaskStatus` changes status leaving other fields unchanged; unknown id throws `StateNotFoundError`. All existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: TASK-078

- [ ] **TASK-080: Add state.yaml presence check to `validate-scaffold.js` + `session-start.js`**
  - scope: quick · layers: scripts, harness · risk: low
  - api-change: no
  - acceptance: `validate-scaffold.js` gains Check 12: if `.claude/state.yaml` exists, parse with `state-io.js` — invalid YAML → `[FAIL]`; if absent → `[WARN]` (opt-in during migration). `session-start.js` gains non-blocking check: present + invalid → print `WARN: .claude/state.yaml parse error — <message>`. Unit tests add fixture cases: valid state.yaml → passes; malformed YAML → `[FAIL]`; missing → `[WARN]` not `[FAIL]`. All existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: TASK-079

- [ ] **TASK-081: Implement `render-todo.js` — state.yaml → TODO.md view renderer**
  - scope: full · layers: scripts, harness · risk: high
  - api-change: yes — new script `render-todo.js`; `docs/blueprint/07-todo-format.md` gains "Rendered view" note
  - acceptance: `.claude/scripts/render-todo.js` reads `.claude/state.yaml` via `state-io.js`, writes `TODO.md` matching existing template format (ownership header, Active Sprint, Backlog, Changelog, Quick Rules). Rendered TODO.md passes all existing `validate-scaffold.js` checks. If state.yaml absent, exits 1 with `render-todo: .claude/state.yaml not found`. Round-trip test: example state from TASK-078 → rendered TODO.md → zero validate-scaffold failures. Unit tests cover: valid state → ownership header with correct sprint; `status: done` → `[x]`; `status: open` → `[ ]`; missing file → exits 1. `docs/blueprint/07-todo-format.md` gains one paragraph noting TODO.md is a rendered view when state.yaml present. All existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: TASK-079

- [ ] **TASK-082: Define `.metrics.jsonl` schema + opt-in guard (gitignore + enable flag)**
  - scope: quick · layers: governance, docs · risk: low
  - api-change: no
  - acceptance: `docs/research/metrics-schema.md` documents JSONL record shape: `ts` (ISO-8601), `event` (one of `gate_pass`, `gate_fail`, `hard_stop`, `phase_start`, `phase_end`), `context` (object with event-specific fields). `.gitignore` gains `**/.claude/.metrics.jsonl`. Opt-in flag documented: telemetry active only when `.claude/settings.local.json` contains `"metrics": true`. `docs/research/metrics-schema.md` includes example JSONL block with three records. No writer script in this task.
  - tracker: STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: none

- [ ] **TASK-083: Implement `metrics-writer.js` — opt-in JSONL telemetry appender**
  - scope: quick · layers: scripts · risk: low
  - api-change: yes — new callable module; exports `logEvent(event, context, root?)`
  - acceptance: `.claude/scripts/metrics-writer.js` created, CommonJS, Node ≥18, no npm deps. `logEvent` reads `settings.local.json`; if `metrics !== true` returns immediately with no I/O; otherwise appends JSONL record to `.claude/.metrics.jsonl` via `appendFileSync`. `logEvent` never throws — all I/O errors caught + silently ignored. Unit tests cover: `metrics: false` → no file created; `metrics: true` → file created with valid JSON on line 1; second call → two-line file; I/O error → function returns without throwing. All existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: TASK-082

- [ ] **TASK-084: Wire `metrics-writer.js` into gate-0/1/2 and `session-start.js`**
  - scope: full · layers: scripts, harness · risk: high
  - api-change: yes — gate-0/1/2 each gain `logEvent` call; `session-start.js` gains `phase_start` logging; all changes opt-in-only
  - acceptance: `gate-0.js`, `gate-1.js`, `gate-2.js` import `metrics-writer.js` and call `logEvent('gate_pass'/'gate_fail', { gate_id, task_id })` after computing result. `session-start.js` calls `logEvent('phase_start', { phase: 'parse', task_id: 'unknown' })` at startup. Integration test in `__tests__/metrics-integration.test.js`: (a) `metrics: true` + passing gate-0 → `.metrics.jsonl` line 1 parses as JSON with `event: 'gate_pass'`; (b) `metrics: false` → no `.metrics.jsonl` created. All gate unit tests from EPIC-B still pass. All existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: TASK-083, TASK-071, TASK-072

- [ ] **TASK-085: Update docs + close EPIC-D**
  - scope: quick · layers: docs, governance · risk: low
  - api-change: no
  - acceptance: `docs/blueprint/07-todo-format.md` heading updated to "TODO.md — rendered view of state.yaml"; template block retained with note "auto-generated by render-todo.js when state.yaml present". `docs/DECISIONS.md` gains ADR: "EPIC-D: state.yaml as state machine source of truth — rationale, alternatives considered (JSON rejected, TODO.md as source rejected)". `STRATEGY_REVIEW.md` R-2 and R-6 sections each gain one-sentence outcome note referencing TASK-078..085. EPIC-D in `TODO.md` marked `[x]` with date and pointer to DECISIONS.md. `docs/blueprint/06b-scripts.md` gains table rows for `state-io.js`, `render-todo.js`, `metrics-writer.js`. Line caps respected.
  - tracker: STRATEGY_REVIEW.md#R-2 / STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: TASK-081, TASK-084

### P1 — EPIC-E decomposed: Harness wrap-or-replace decision

> Dependency order: TASK-086 → TASK-087/088/089 (parallel) → TASK-090. Proposed: Sprint N: TASK-086..089 (decision + apply in one sprint). Sprint N+1: TASK-090 + backlog filler.

- [ ] **TASK-086: Audit current CC primitive overlap; draft wrap-vs-replace decision (ADR-005)**
  - scope: quick · layers: docs, governance · risk: low
  - api-change: no
  - acceptance: `docs/research/r9-primitive-audit.md` created with three columns: (1) CC primitive name (`TaskCreate`, `TaskList`, `/review`, `/init`, plan-mode); (2) how dev-flow currently handles it (wrap/replace/ignore); (3) delta — what dev-flow adds or loses vs using the CC primitive directly. ADR-005 appended to `docs/DECISIONS.md` recording chosen path (wrap or replace) with one-paragraph rationale and "alternatives considered" section. Decision is recorded before any implementation begins.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: none

- [ ] **TASK-087: Apply wrap-or-replace decision to Phase 6 (Review) and Phase 7 (Security)**
  - scope: quick · layers: skills, agents · risk: medium
  - api-change: yes — `phases.md` Phase 6/7 steps updated; `code-reviewer.md` / `security-analyst.md` updated if wrap path chosen
  - acceptance: `phases.md` Phase 6 and Phase 7 internally consistent with ADR-005 — no mixed "spawn" + "invoke CC" language for the same phase. If wrap: Phase 6 gains `invoke /review` step replacing `spawn code-reviewer`; `code-reviewer.md` becomes thin pass-through. If replace: Phase 6 gains explicit note citing ADR-005 rationale. `docs/research/r9-primitive-audit.md` row for `/review` marked "resolved". Line limits respected.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-086

- [ ] **TASK-088: Apply wrap-or-replace decision to task tracking (TaskCreate / TaskList)**
  - scope: quick · layers: skills, docs · risk: medium
  - api-change: yes — `dev-flow/SKILL.md` Phase 0 and Phase 9 updated per ADR-005 path
  - acceptance: Exactly one task-tracking model in use throughout SKILL.md and phases.md — no file references both TODO.md manual writes and TaskCreate invocations without reconciliation. If wrap: Phase 0 gains `TaskCreate TASK-NNN` step; Phase 9 gains `TaskUpdate → completed`. If replace: Phase 0 gains prose justifying manual TODO.md over TaskCreate citing ADR-005. `docs/research/r9-primitive-audit.md` rows for `TaskCreate` and `TaskList` marked "resolved". Line limits respected.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-086

- [ ] **TASK-089: Apply wrap-or-replace decision to `/init` and docs generation (`/lean-doc-generator`)**
  - scope: quick · layers: skills, docs · risk: low
  - api-change: yes — `dev-flow/SKILL.md` `init` mode block and Phase 8 Docs step updated per ADR-005
  - acceptance: `dev-flow/SKILL.md` `init` mode block and Phase 8 Docs step consistent with ADR-005 — no ambiguous "also call CC init if available" language. If wrap: Phase 8 gains explicit `invoke /lean-doc-generator`; `init` mode notes CC `/init` called first. If replace: `init` mode block gains note "dev-flow `/init` supersedes CC `/init` — do not invoke both." `docs/research/r9-primitive-audit.md` rows for `/init` and plan-mode marked "resolved". All five audit rows "resolved". Line limits respected.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-086

- [ ] **TASK-090: Consistency sweep + close EPIC-E**
  - scope: quick · layers: skills, agents, docs, governance · risk: low
  - api-change: no
  - acceptance: Grep across `.claude/skills/` and `.claude/agents/` finds zero remaining mixed signals: no "spawn" + "invoke CC" co-present for same operation; no `TaskCreate`/`TaskList`/`/review`/`/init` references without ADR-005 framing. CLAUDE.md ≤200 lines. `docs/research/r9-primitive-audit.md` all five rows "resolved". EPIC-E in `TODO.md` marked `[x]` with date and pointer to ADR-005. `STRATEGY_REVIEW.md` R-9 section gains one-sentence outcome note.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-087, TASK-088, TASK-089

### P3 — Strategic epics (decompose via /task-decomposer before promoting)

> Direction-level moves from `STRATEGY_REVIEW.md`. Each is an epic, not a single task — run `/task-decomposer --epic "<name>"` against the strategy file before pulling into a sprint. Order is by leverage, not dependency.

- [x] **EPIC-A: Plugin-first distribution (R-1)** — decomposed 2026-04-26 → TASK-065..069 (see P1 above). Source: STRATEGY_REVIEW.md#R-1.

- [x] **EPIC-B: Code-enforced gates (R-3)** — decomposed 2026-04-26 → TASK-070..074 (see P1 above). Source: STRATEGY_REVIEW.md#R-3, STRATEGY_REVIEW.md#R-5.

- [x] **EPIC-C: Dogfood on real product (R-10)** — decomposed 2026-04-26 → TASK-075..077 (see P1 above). Source: STRATEGY_REVIEW.md#R-10.

- [x] **EPIC-D: State as YAML, telemetry as JSONL (R-2 + R-6)** — decomposed 2026-04-26 → TASK-078..085 (see P1 above). Source: STRATEGY_REVIEW.md#R-2, STRATEGY_REVIEW.md#R-6.

- [x] **EPIC-E: Harness wrap-or-replace decision (R-9)** — decomposed 2026-04-26 → TASK-086..090 (see P1 above). Source: STRATEGY_REVIEW.md#R-9.

<!-- Closed-sprint trail (kept for reference) -->
<!-- TASK-001..049 closed across Sprints 0–13. See docs/CHANGELOG.md. -->
<!-- TASK-029, TASK-035 reserved/skipped — gap in numbering, do not reuse. -->

---

## Changelog

> Sprints are moved here from Active Sprint once complete, then archived to `docs/CHANGELOG.md`. This section holds only the current in-progress sprint's running log.

> Sprint 0–7 blocks archived → `docs/CHANGELOG.md`.
> Sprint 14–17 archived → `docs/CHANGELOG.md` (2026-04-26).

### Sprint 18 — In Progress

| File | Change | ADR |
|:-----|:-------|:----|

---

## Quick Rules
> Key conventions for any contributor (human or AI) working on the dev-flow starter itself.
> No need to open the full blueprint for these.

```
SCAFFOLD WORK
- Never write a script that touches Claude Code hooks without first verifying the input
  contract against context/research/CC_SPEC.md. v1.7.0's read-guard.js is the cautionary tale.
- Skill frontmatter: `name` and `description` are the only spec-required fields. Our extras
  (version, stack-version, last-validated, type, context, agent, skills, spawns) are project
  conventions — document each in docs/blueprint/05-skills.md, mark required vs optional.
- Skill `description` field discipline (per agentskills.io): third-person, starts with
  "Use when…", ≤500 chars, NEVER summarizes the skill's internal process.
- Every SKILL.md with non-obvious decision logic gets a GraphViz `dot` flowchart.
- Every SKILL.md that depends on AI not rationalizing gets a "Red Flags" table.
- Heavy reference content (>100 lines, e.g. patterns catalog, anti-pattern lists) goes in
  a sibling file under skills/<name>/references/, NOT inline in SKILL.md.
- Scripts are Node.js ≥18 or Python 3.10+. No bash-only constructs. Tested on Windows Git Bash + Linux.
- Every script under .claude/scripts/ gets a sibling __tests__/<name>.test.js.

DOC WORK
- The blueprint must obey its own lean-doc rules. If a doc file you're editing exceeds
  the line cap (README:50, ARCHITECTURE:150, DECISIONS:unlimited, SETUP:100, AI_CONTEXT:100),
  trim before commit — do not raise the cap.
- Every doc file gets the ownership header (owner, last_updated, update_trigger, status).
- HOW filter (mandatory before any doc line): if it explains HOW something works, move it
  to a code comment. If WHY → DECISIONS.md. If WHERE → ARCHITECTURE.md or README.md.

GOVERNANCE
- Blueprint version bumps follow semver, encoded in CONTRIBUTING.md:
  MAJOR = phase model / gate model / hook contract change
  MINOR = new mode / new agent / new skill / new hard stop
  PATCH = clarification / prompt rewording / fix
- Every blueprint change requires a CHANGELOG.md entry with the bump rationale.
- Skill changes that alter agent behavior require eval evidence (RED-GREEN-REFACTOR for
  skills, per superpowers pattern) before merge — see TASK-026 once implemented.

WORKFLOW (until Sprint 3 ships /dev-flow as a real skill)
- Run tasks manually through the blueprint §3 phases by hand: Parse → Clarify → Gate 0
  → Design → Gate 1 → Implement → Validate → Test → Review → Security → Gate 2 → Docs
  → Commit → Session Close. Yes, all of them. The discipline matters more than the tooling.
- Mark a task `[x]` in Active Sprint only when its acceptance criterion is verified.
- After each task: append the Changelog row, update docs touched, then move on.
```

---

## Roadmap (informational — not a workflow contract)

```
Sprint 0  →  Research & Foundation               (done — TASK-001..003)
Sprint 1  →  Doc refactor + governance            (done — TASK-004..006)
Sprint 2  →  Scaffold + scripts                   (done — TASK-007..012)
Sprint 3  →  Agents + Skills (project-local)       (done — TASK-013..017)
Sprint 4  →  Skills craft + description audit + behavioral template  (done — TASK-015, 018, 019, 032)
Sprint 5  →  Templates + validation               (done — TASK-020, 022, 023)
Sprint 6  →  Doc templates + eval harness         (active — TASK-021, 024, 033)
Sprint 7  →  Harness init fixes                   (done — TASK-039, 040, 041, 043, 045)
Sprint 8  →  Scripts + harness polish              (done — TASK-037, 038, 042)
Sprint 9  →  Workflow continuity + compat          (done — TASK-047, 049, 046)
Sprint 10  → Eval baselines + CI gate               (done — TASK-048, 025)
Sprint 11  → Sprint mode + context compression      (done — TASK-044, 036)
Sprint 12  → TDD framework + init script + worked example      (done — TASK-026, 028, 030)
Sprint 13  → Governance + automation                           (done — TASK-031, 034)
Sprint 14  → Audit Pass 1: P0 fixes + drift cleanup             (done — TASK-050..053)
Sprint 15  → Adoption + CI hardening                           (done — TASK-054..056, 064)
Sprint 16  → Skills decomp + P2 cleanup                        (done — TASK-057, 058, 061, 062)
Sprint 17  → Blueprint decomp + SSOT version                   (done — TASK-059, 060, 063 + BUG-003/004)
Sprint 18+ → Epic decomposition                                 (active — decompose P3 epics first)
```

> Sprint cadence is not fixed. Each sprint completes when its acceptance criteria are met
> and Gate 2 is approved. Stretch items in Sprint 5+ are explicit v2 territory — do not
> pull them forward without finishing earlier sprints.
