# dev-flow — Universal AI Workflow Starter — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-30 (Sprint 26 closed)
update_trigger: Sprint completed, task added, task status changed, or scaffold milestone reached
status: current
sprint: 27
---

> **External references** (sprint improvement sources — read before working on derived tasks)
> - https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md → behavioral guidelines patterns used in TASK-032
> - https://github.com/juliusbrussee/caveman → eval harness, single-source-of-truth discipline, context compression; used in TASK-033, 034, 036
> - https://github.com/obra/superpowers → Baseline guide for flow plugin development popular, TASK-018

> **How to use this file**
> - **Start of session** — read this file first. Understand the active sprint before touching code.
> - **Run /dev-flow** — orchestrator parses the first incomplete task `[ ]` in Active Sprint.
> - **End of session** — Phase 10 Session Close. Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, append a Changelog row (File | Change | ADR), update relevant docs, then rotate the sprint block to `docs/CHANGELOG.md`.
> - **Docs to keep in sync**: `README.md` (root) · `docs/blueprint/*` · `CHANGELOG.md` · `CONTRIBUTING.md` · `.claude/CLAUDE.md`
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

→ [docs/sprint/SPRINT-027-marketplace-schema-fix.md](docs/sprint/SPRINT-027-marketplace-schema-fix.md)

---

## Backlog

### P1 — EPIC-A continued: Plugin-first distribution

<!-- All TASK-065..069 complete — EPIC-A closed Sprint 20 -->

### P1 — EPIC-B decomposed: Code-enforced gates (deferred to v2 — post v1 ship)

> READINESS.md classifies EPIC-B as v2. Do not start until v1 ships and team usage is proven (TASK-091 + TASK-092 closed).
> Dependency order: TASK-070 → TASK-071/072 (parallel) → TASK-073 → TASK-074.

- [ ] **TASK-070: Define gate-module interface + gate-constants.js**
  - scope: quick · layers: scripts, governance · risk: low
  - api-change: no
  - acceptance: `.claude/scripts/gate-constants.js` created, exports `GATE_RESULT` shape `{ pass: boolean, missing: string[], suggested_fix: string }` and `GATE_IDS` enum (`gate0`, `gate1`, `gate2`). Unit test asserts shape and enum values. No gate logic — constants only.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: none

- [ ] **TASK-071: Implement gate-0.js — scope confirmation enforcer**
  - scope: quick · layers: scripts · risk: medium
  - api-change: yes — `gate0(inputs) → GateResult`; SKILL.md Phase 0 gains invocation line
  - acceptance: Checks: tracker ≠ "none" without justification; scope one of `full|quick|hotfix`; acceptance not empty. CLI exits 1 on fail with `[FAIL]` per violation. Unit tests cover pass + each failure mode.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: TASK-070

- [ ] **TASK-072: Implement gate-1.js and gate-2.js — design plan + final gate enforcers**
  - scope: quick · layers: scripts · risk: medium
  - api-change: yes — two new callable modules; SKILL.md Gate 1/2 blocks gain invocation lines
  - acceptance: `gate-1.js` checks: file list non-empty; micro-tasks present. `gate-2.js` checks: no open CRITICAL findings; ci_status green. Both exit 1 with `[FAIL]` on violations. Unit tests cover pass + each failure mode.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: TASK-070

- [ ] **TASK-073: Consolidate hard-stops.md to 5 enforced + documented warnings**
  - scope: quick · layers: skills, docs · risk: low
  - api-change: no
  - acceptance: `hard-stops.md` rewritten: "Enforced (exit code 1)" section (5 stops mapped to gate scripts); "Warnings (non-blocking, logged)" section. SKILL.md hard-stop count updated. DECISIONS.md gains entry.
  - tracker: STRATEGY_REVIEW.md#R-5 / EPIC-B
  - depends-on: TASK-071, TASK-072

- [ ] **TASK-074: Wire gate modules into validate-scaffold.js + add integration test**
  - scope: full · layers: scripts, ci · risk: high
  - api-change: no
  - acceptance: `validate-scaffold.js` gains checks 9/10/11 calling gate0/1/2 with fixture inputs. Integration test: known-good fixture → exit 0; broken fixture → exit 1 with correct `[FAIL]` line. All existing tests pass.
  - tracker: STRATEGY_REVIEW.md#R-3 / EPIC-B
  - depends-on: TASK-071, TASK-072, TASK-073

### P1 — EPIC-C decomposed: Dogfood on real product

> Dependency order: TASK-075 (done) → TASK-076 → TASK-077. Sprint 20 = TASK-076 + TASK-077.

- [ ] ~~TASK-076~~ promoted to Sprint 20
- [ ] ~~TASK-077~~ promoted to Sprint 20

### P1 — EPIC-D decomposed: State as YAML, telemetry as JSONL (deferred to v2 — post v1 ship)

> READINESS.md classifies EPIC-D as v2. Do not start until v1 ships.
> Dependency order: TASK-078 → TASK-079 → TASK-080 + TASK-081. TASK-082 → TASK-083 → TASK-084. Converge at TASK-085.

- [ ] **TASK-078: Define `.claude/state.yaml` schema + JSON Schema for validation**
  - scope: quick · layers: governance, docs · risk: low
  - api-change: no
  - acceptance: `docs/research/state-yaml-schema.md` documents schema; `docs/research/state.schema.json` committed + validated; `docs/research/state.yaml.example` committed. No `.claude/state.yaml` created — schema only.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: none

- [ ] **TASK-079: Implement `state-io.js` — state.yaml reader/writer module**
  - scope: quick · layers: scripts · risk: medium
  - api-change: yes — exports `readState`, `writeState`, `updateTaskStatus`
  - acceptance: CommonJS, Node ≥18, no npm deps. Atomic writes (tmp + rename). Unit tests: valid file passes; missing throws `StateReadError`; round-trip; `updateTaskStatus` mutates only status; unknown id throws `StateNotFoundError`.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: TASK-078

- [ ] **TASK-080: Add state.yaml presence check to `validate-scaffold.js` + `session-start.js`**
  - scope: quick · layers: scripts, harness · risk: low
  - api-change: no
  - acceptance: validate-scaffold Check 12: invalid YAML → `[FAIL]`; absent → `[WARN]`. session-start: invalid → non-blocking `WARN` print. Unit tests cover all fixture cases.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: TASK-079

- [ ] **TASK-081: Implement `render-todo.js` — state.yaml → TODO.md view renderer**
  - scope: full · layers: scripts, harness · risk: high
  - api-change: yes — new script; blueprint 07-todo-format.md gains "Rendered view" note
  - acceptance: Reads state.yaml, writes TODO.md matching template format. Rendered file passes all validate-scaffold checks. Unit tests: valid state → correct headers; done → `[x]`; open → `[ ]`; missing file → exits 1.
  - tracker: STRATEGY_REVIEW.md#R-2 / EPIC-D
  - depends-on: TASK-079

- [ ] **TASK-082: Define `.metrics.jsonl` schema + opt-in guard**
  - scope: quick · layers: governance, docs · risk: low
  - api-change: no
  - acceptance: `docs/research/metrics-schema.md` documents JSONL shape; `.gitignore` gains `**/.claude/.metrics.jsonl`; opt-in flag (`"metrics": true` in settings.local.json) documented.
  - tracker: STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: none

- [ ] **TASK-083: Implement `metrics-writer.js` — opt-in JSONL telemetry appender**
  - scope: quick · layers: scripts · risk: low
  - api-change: yes — exports `logEvent(event, context, root?)`
  - acceptance: No-op when `metrics !== true`. Appends JSONL via `appendFileSync`. Never throws. Unit tests: disabled → no file; enabled → valid JSON line 1; second call → two lines; I/O error → returns silently.
  - tracker: STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: TASK-082

- [ ] **TASK-084: Wire `metrics-writer.js` into gate-0/1/2 and `session-start.js`**
  - scope: full · layers: scripts, harness · risk: high
  - api-change: yes — all changes opt-in-only
  - acceptance: gate-0/1/2 call `logEvent(gate_pass/gate_fail, { gate_id, task_id })`. session-start calls `logEvent(phase_start, { phase: 'parse' })`. Integration test: metrics:true + passing gate → jsonl line with event:gate_pass; metrics:false → no file.
  - tracker: STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: TASK-083, TASK-071, TASK-072

- [ ] **TASK-085: Update docs + close EPIC-D**
  - scope: quick · layers: docs, governance · risk: low
  - api-change: no
  - acceptance: blueprint 07-todo-format.md updated; DECISIONS.md gains EPIC-D ADR; STRATEGY_REVIEW.md R-2/R-6 updated; blueprint 06b-scripts.md gains rows for new scripts. Line caps respected.
  - tracker: STRATEGY_REVIEW.md#R-2 / STRATEGY_REVIEW.md#R-6 / EPIC-D
  - depends-on: TASK-081, TASK-084

### P1 — EPIC-E decomposed: Harness wrap-or-replace decision (deferred to v2 — post v1 ship)

> READINESS.md classifies EPIC-E as v2. Do not start until v1 ships.
> Dependency order: TASK-086 → TASK-087/088/089 (parallel) → TASK-090.

- [ ] **TASK-086: Audit current CC primitive overlap; draft wrap-vs-replace decision (ADR-005)**
  - scope: quick · layers: docs, governance · risk: low
  - api-change: no
  - acceptance: `docs/research/r9-primitive-audit.md` created (3 columns: CC primitive, current handling, delta). ADR-005 appended to DECISIONS.md with rationale + alternatives.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: none

- [ ] **TASK-087: Apply wrap-or-replace decision to Phase 6 (Review) and Phase 7 (Security)**
  - scope: quick · layers: skills, agents · risk: medium
  - api-change: yes — phases.md Phase 6/7 updated; agent files updated if wrap chosen
  - acceptance: phases.md Phase 6 and 7 internally consistent with ADR-005. r9-primitive-audit.md row for `/review` marked "resolved".
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-086

- [ ] **TASK-088: Apply wrap-or-replace decision to task tracking (TaskCreate / TaskList)**
  - scope: quick · layers: skills, docs · risk: medium
  - api-change: yes — SKILL.md Phase 0/9 updated per ADR-005
  - acceptance: Exactly one task-tracking model throughout SKILL.md + phases.md. Audit rows for TaskCreate/TaskList marked "resolved".
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-086

- [ ] **TASK-089: Apply wrap-or-replace decision to `/init` and docs generation**
  - scope: quick · layers: skills, docs · risk: low
  - api-change: yes — SKILL.md init mode + Phase 8 updated per ADR-005
  - acceptance: SKILL.md init mode and Phase 8 consistent with ADR-005. All five audit rows "resolved".
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-086

- [ ] **TASK-090: Consistency sweep + close EPIC-E**
  - scope: quick · layers: skills, agents, docs, governance · risk: low
  - api-change: no
  - acceptance: Zero remaining mixed signals (grep across skills/ + agents/). All five audit rows "resolved". STRATEGY_REVIEW.md R-9 gains outcome note.
  - tracker: STRATEGY_REVIEW.md#R-9 / EPIC-E
  - depends-on: TASK-087, TASK-088, TASK-089

<!-- TASK-109 done Sprint 26 → docs/CHANGELOG.md -->
<!-- TASK-110 done Sprint 25 → docs/CHANGELOG.md -->

<!-- TASK-111 promoted to Sprint 27 -->



### P1 — Design thinking quality (user friction → workflow improvement)

<!-- TASK-100 promoted to Sprint 23 -->
<!-- TASK-101 promoted to Sprint 23 -->

<!-- TASK-102 promoted to Sprint 24 -->

<!-- TASK-091/092 moved to GitHub issues — validation via separate project repo, not this tracker -->

### P3 — Strategic epics (decompose via /task-decomposer before promoting)

- [x] **EPIC-A** — decomposed → TASK-065..069. TASK-065..068 closed; TASK-069 Sprint 20.
- [x] **EPIC-B** — decomposed → TASK-070..074. v2 deferred (see P1 above).
- [x] **EPIC-C** — decomposed → TASK-075..077. All done 2026-04-27 → `docs/research/dogfood-friction-log.md`.
- [x] **EPIC-D** — decomposed → TASK-078..085. v2 deferred (see P1 above).
- [x] **EPIC-E** — decomposed → TASK-086..090. v2 deferred (see P1 above).

<!-- TASK-001..049 closed Sprints 0–13 → docs/CHANGELOG.md -->
<!-- TASK-029, TASK-035 reserved/skipped — do not reuse -->

---

## Changelog

> Current in-progress sprint only. Completed sprints archived in `docs/CHANGELOG.md`.
> Sprints 0–7, 14–24 archived → `docs/CHANGELOG.md`.

### Sprint 25 — Archived to docs/CHANGELOG.md (2026-04-30)

### Sprint 26 — Archived to docs/CHANGELOG.md (2026-04-30)

### Sprint 27 — In progress

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude-plugin/marketplace.json` | TASK-111: schema fixed — name, owner, source simplified to `"."` | — |
| `README.md` | TASK-111: install steps updated to two-step `claude plugin marketplace add` flow | — |
| `context/research/CC_SPEC.md` | TASK-111: marketplace.json schema section added | — |

---

## Quick Rules
> Key conventions for any contributor (human or AI) working on the dev-flow starter itself.

```
SCAFFOLD WORK
- Never write a script that touches Claude Code hooks without first verifying the input
  contract against context/research/CC_SPEC.md. v1.7.0's read-guard.js is the cautionary tale.
- Skill frontmatter: `name` and `description` are spec-required. Extras (version, stack-version,
  last-validated, type, context, agent, skills, spawns) are conventions — document each in
  docs/blueprint/05-skills.md, mark required vs optional.
- Skill `description` (per agentskills.io): third-person, starts "Use when…", ≤500 chars,
  NEVER summarizes the skill's internal process.
- Every SKILL.md with non-obvious decision logic gets a GraphViz `dot` flowchart.
- Every SKILL.md that depends on AI not rationalizing gets a "Red Flags" table.
- Heavy reference content (>100 lines) goes in skills/<name>/references/, NOT inline in SKILL.md.
- Scripts: Node.js ≥18 or Python 3.10+. No bash-only constructs. Tested on Windows Git Bash + Linux.
- Every script under .claude/scripts/ gets a sibling __tests__/<name>.test.js.

DOC WORK
- Blueprint must obey its own lean-doc rules. Line caps: README:50, ARCHITECTURE:150,
  DECISIONS:unlimited, SETUP:100, AI_CONTEXT:100. Trim before commit — do not raise caps.
- Every doc file gets the ownership header (owner, last_updated, update_trigger, status).
- HOW filter: HOW → code comment. WHY → DECISIONS.md. WHERE → ARCHITECTURE.md or README.md.

GOVERNANCE
- Blueprint version bumps follow semver per CONTRIBUTING.md:
  MAJOR = phase/gate/hook contract change
  MINOR = new mode / new agent / new skill / new hard stop
  PATCH = clarification / prompt rewording / fix
- Every blueprint change requires a CHANGELOG.md entry with bump rationale.
- Skill changes that alter agent behavior require eval evidence (RED-GREEN-REFACTOR) before merge.
```

---

## Roadmap (informational — not a workflow contract)

```
Sprint 0  →  Research & Foundation               (done — TASK-001..003)
Sprint 1  →  Doc refactor + governance            (done — TASK-004..006)
Sprint 2  →  Scaffold + scripts                   (done — TASK-007..012)
Sprint 3  →  Agents + Skills (project-local)       (done — TASK-013..017)
Sprint 4  →  Skills craft + description audit      (done — TASK-015, 018, 019, 032)
Sprint 5  →  Templates + validation               (done — TASK-020, 022, 023)
Sprint 6  →  Doc templates + eval harness         (done — TASK-021, 024, 033)
Sprint 7  →  Harness init fixes                   (done — TASK-039, 040, 041, 043, 045)
Sprint 8  →  Scripts + harness polish              (done — TASK-037, 038, 042)
Sprint 9  →  Workflow continuity + compat          (done — TASK-047, 049, 046)
Sprint 10 →  Eval baselines + CI gate               (done — TASK-048, 025)
Sprint 11 →  Sprint mode + context compression      (done — TASK-044, 036)
Sprint 12 →  TDD framework + init script + example  (done — TASK-026, 028, 030)
Sprint 13 →  Governance + automation                (done — TASK-031, 034)
Sprint 14 →  Audit Pass 1: P0 fixes + drift cleanup  (done — TASK-050..053)
Sprint 15 →  Adoption + CI hardening               (done — TASK-054..056, 064)
Sprint 16 →  Skills decomp + P2 cleanup             (done — TASK-057, 058, 061, 062)
Sprint 17 →  Blueprint decomp + SSOT version        (done — TASK-059, 060, 063 + BUG-003/004)
Sprint 18 →  Plugin foundation + support docs        (done — TASK-065, 066, 068, 095)
Sprint 19 →  Path rewrite + default-mode + ADR + dogfood  (done — TASK-067, 093, 094, 075)
Sprint 20 →  E2E smoke + dogfood E2E + friction + MVP mode  (done — TASK-069, 076, 077, 097)
Sprint 21 →  Audit Pass 2 + re-verification           (done — TASK-096; TASK-091 carried)
Sprint 22 →  Team validation (carried) + Pass 2 fixes (done — TASK-098, 099; TASK-091 carried)
Sprint 23 →  Design thinking quality + lean-doc consolidation (done — TASK-100, TASK-101, TASK-103)
Sprint 24 →  Plugin release + lean-doc v2 adoption   (done — TASK-102, TASK-103 remainder, TASK-104)
Sprint 25 →  Workflow gap closure (done — TASK-105..108, TASK-110)
Sprint 26 →  Read-guard behavioral guardrail (done — TASK-109)
Sprint 27 →  TBD — define next
v2 work  →  EPIC-B (gates) + EPIC-D (state/telemetry) + EPIC-E (wrap-or-replace)
```
