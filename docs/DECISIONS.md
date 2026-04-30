---
owner: Tech Lead
last_updated: 2026-04-29
update_trigger: Architectural decision made or reversed
status: current
---

# dev-flow — Decision Log

Append-only. Never edit past ADRs. Use `/adr-writer` to add entries.

---

## ADR-001: Python + stdlib for eval harness; three-arm methodology

**Date**: 2026-04-24
**Status**: decided
**Context**: TASK-033 requires an offline skill eval harness. The project's existing scripts are CommonJS Node; adding a Python script introduces a new language. Eval harness needs no shared code with Node harness, so isolation cost is low. Python's `json`, `re`, `pathlib` cover all metric computation needs without external deps.
**Decision**: Python 3.10+ with stdlib only (`json`, `sys`, `re`, `pathlib`). Lint gate: `python -m py_compile`. Three-arm methodology (baseline / terse_control / skill) adopted from caveman eval harness pattern — `terse_control` arm isolates skill signal from pure brevity pressure, preventing brevity-only prompts from scoring as high-quality skill improvements.
**Alternatives considered**:
- Node.js (matched existing scripts) — rejected: no eval-specific advantage, Python is more natural for data-comparison scripts
- External deps (pandas, pytest) — rejected: violates zero-external-deps constraint for harness scripts
**Consequences**: Python skills must be verified before use in Windows Git Bash + Linux environments. `measure.py` is isolated under `evals/` — no cross-dependency with `.claude/scripts/`.

---

## ADR-002: No external npm deps in `bin/`; built-ins only

**Date**: 2026-04-25
**Status**: decided
**Context**: TASK-030 adds `bin/dev-flow-init.js` — a scaffold bootstrap CLI. Options were: (a) add an npm dependency for interactive prompts (Inquirer, Prompts), or (b) use Node built-ins only (`readline`, `fs`, `path`). The repo is a starter scaffold; adopters clone it into any project. External deps would add an `npm install` step and a `node_modules/` footprint to a repo that otherwise has none.
**Decision**: Built-ins only. `readline` covers interactive prompts. `fs.cpSync` (Node ≥16.7, required ≥18) handles recursive directory copy with filter. `path.resolve` handles cross-platform path normalisation. Backslash normalisation (`replace(/\\/g, '/')`) in the `cpSync` filter guards Windows path separator differences.
**Alternatives considered**:
- Inquirer.js — rejected: adds `node_modules/` to a scaffold-only repo; readline suffices
- Shell scripts (`cp -r`) — rejected: violates "no bash-only constructs" and breaks on Windows
**Consequences**: `bin/dev-flow-init.js` has no `npm install` prerequisite. Windows Git Bash and Linux both work. Future prompts requiring autocomplete or multi-select will require either a dependency or a custom readline wrapper.

---

## ADR-003: Orchestrator-managed phase state via `set-phase.js`

**Date**: 2026-04-25
**Status**: decided
**Context**: TASK-050 (AUDIT.md AUD-001) — `read-guard.js` short-circuits with `if (!existsSync(PHASE_FILE)) process.exit(0)`. The phase file is never created in real sessions, so the §1 Thin-Coordinator Rule is silently bypassed in 100 % of sessions. A writer is needed; two enforcement models were considered.
**Decision**: Orchestrator-managed via `node .claude/scripts/set-phase.js <phase>`. The orchestrator (Claude reading `dev-flow/SKILL.md`) runs the script as the first step of each compact-vulnerable phase (Implement, Test, Review, Security, Docs), and runs `set-phase.js clear` after Phase 9 commit. Phase state lives in `.claude/.phase` (gitignored). Allowlist of valid phase names enforced by the script.
**Alternatives considered**:
- Harness-managed PostToolUse hook detecting phase boundaries from output strings — rejected: orchestrator-internal markers would have to leak into output for the harness to parse, coupling the harness to the SKILL.md prompt format. Brittle across mode variations (sprint, hotfix, resume). Failure mode is silent (hook misses a marker → no phase set → fail-open).
- State machine in a separate harness script invoked by every Bash tool call — rejected: high overhead, every Bash call pays the cost.
**Consequences**: SKILL.md grows by ~12 lines (Phase Markers intro + 6 phase-entry markers). Orchestrator forgetting to call `set-phase.js` reverts to today's broken state — mitigated by making the call the first sub-bullet of each gated phase. Future tightening: a `validate-scaffold.js` check that flags missing phase calls in SKILL.md, or a session-start.js warning when `.claude/.phase` exists at session start (resume into stuck phase).

---

## ADR-004: Delete `examples/` mirror; project-specific files only (TASK-057)

**Date**: 2026-04-26
**Status**: decided
**Context**: `examples/node-express/` contained a full byte-for-byte mirror of `.claude/` (50+ files: skills, agents, scripts, settings, MANIFEST) and `docs/blueprint/` (10 files). No automation enforced parity. Any `.claude/skills/dev-flow/SKILL.md` change required a paired write to `examples/node-express/.claude/skills/dev-flow/SKILL.md` — easy to forget. Every committed `.claude/` change doubled in git history. Three paths considered: (a) delete mirror, (b) auto-sync via pre-commit hook, (c) generate during CI.
**Decision**: Option (a) — delete the mirror. `examples/node-express/` now contains only project-specific files: `src/`, `docs/` rendered templates, `TODO.md`, `package.json`, `.gitignore`. The `.claude/` tree and `docs/blueprint/` are generated by `node bin/dev-flow-init.js` at bootstrap time. CI drift check added to `validate.yml`: fails if any `examples/*/.claude` directory is detected.
**Alternatives considered**:
- Option (b) pre-commit hook: rejected — still commits the mirror into git history, adds hook maintenance burden, and violates SSOT principle the project preaches.
- Option (c) CI generation: better fit for a published npm package, but adds CI complexity and is premature before EPIC-A (plugin-first distribution). Defer to post-EPIC-A.
**Consequences**: `examples/README.md` updated to explain trimmed structure and point readers to `dev-flow-init.js`. Drift protection: `validate.yml` exits 1 if `examples/*/.claude` re-appears. Adopters wanting a full worked example must run `dev-flow-init.js` themselves (consistent with TASK-056 primary adoption path).

---

## ADR-005 — Blueprint version coupling: package.json vs docs/blueprint/VERSION

**Date**: 2026-04-26
**Status**: decided

**Decision**: Blueprint version (docs/blueprint/VERSION) and package.json version are independent. package.json tracks the scaffold/tooling release; blueprint VERSION tracks the workflow spec revision. They are not kept in sync.

**Why**: Blueprint version bumps are editorial (new mode, new hard stop, prompt reword). Scaffold version bumps are code releases (new script, new bin/ tool). Coupling them forces unnecessary releases on both tracks.

**Consequences**: Contributors must bump docs/blueprint/VERSION independently when making MINOR/MAJOR blueprint changes per CONTRIBUTING.md. CI warns (non-blocking) if blueprint docs changed without a VERSION file change in the same PR.

---

## ADR-006 — plugin.json version as canonical adopter pin; semver-to-blueprint mapping

**Date**: 2026-04-27
**Status**: decided

**Context**: With plugin-first distribution (TASK-065/066), adopters install dev-flow via `claude plugin install`. The `plugin.json` `version` field is the only version signal visible at install time. A clear semver contract is needed so adopters can pin stable behavior.

**Decision**: `plugin.json` `version` is the canonical pin point for adopters. Blueprint changes map to semver as follows:

| Bump | Trigger | Adopter impact |
|:-----|:--------|:---------------|
| **MAJOR** | Phase model / gate model / hook contract change | Workflow behavior changes — migration path required |
| **MINOR** | New mode / new agent / new skill / new hard stop | New capabilities added; existing behavior preserved |
| **PATCH** | Clarification, prompt rewording, fix, doc improvement | No behavior change |

Adopters pin a specific version at install: `claude plugin install https://github.com/aldian/dev-flow@<version>`. Every MAJOR or MINOR blueprint change requires a `plugin.json` version bump in the same PR. PATCH changes may omit the bump if `plugin.json` behavior is unchanged.

**Alternatives considered**:
- `docs/blueprint/VERSION` as pin point — rejected: adopters interact with `plugin.json`, not the blueprint VERSION file; ADR-005 already decoupled these two tracks.
- No pinning support — rejected: teams on compliance timelines need stable, reproducible behavior.

**Consequences**: `CONTRIBUTING.md` gains a "Breaking change policy" section cross-referencing this ADR. Every MAJOR/MINOR PR must include a `plugin.json` version bump and a `docs/CHANGELOG.md` entry. MAJOR PRs additionally require an ADR documenting the migration path.

---

## ADR-007 — Add `mvp` mode: 3-phase lean delivery for prototype/spike work

**Date**: 2026-04-27
**Status**: decided

**Context**: TASK-097. Prototype and spike tasks need a lighter path than `quick` — which still requires design (Gate 0), review, and a TDD contract. The alternative of making `quick` leaner was considered but rejected: `quick` already has a 5-phase contract that teams depend on for real feature work. Eroding that contract would create confusion about when reviews happen.

**Decision**: Add `mvp` mode with 3 phases: Parse → Implement → Close. Gate 0 and Gate 1 are skipped. Gate 2 is minimal: lint passes + existing tests still green + commit. Escape-hatch: >5 files changed triggers a HARD STOP prompting upgrade to `quick`.

Fence-line (explicit, must not blur):
- `quick` = 5 phases + Gate 0 scope confirmation + existing tests pass (new encouraged)
- `mvp` = 3 phases + no gates + existing tests must stay green (new optional) + ≤5 file cap

**Alternatives considered**:
- Making `quick` leaner — rejected: erodes quick's contract for real feature tasks; teams use quick daily and expect Gate 0.
- Free-form one-shot mode (no phases at all) — rejected: no gate = no lint enforcement, sessions drift without closure.

**Consequences**: MINOR version bump (1.7.0 → 1.8.0). Mode Dispatch table grows from 7 to 8 rows. README "7 Modes". mode-dispatch.test.js extended with 3 assertions. `mode-mvp.md` reference added to SKILL.md.

---

## ADR-008 — Dogfood outcome: dev-flow validated on real implementation task (EPIC-C)

**Date**: 2026-04-27
**Status**: decided

**Context**: TASK-077 / EPIC-C. First end-to-end dogfood run of dev-flow on a non-trivial implementation task (TASK-001: global error-handler middleware) in `examples/node-express/`. Mode: full. 10 phases executed.

**Decision**: dev-flow validated. All gates fired correctly. No false positives from code-reviewer or security-analyst. No hard stops were triggered. The workflow accelerated the task compared to unstructured implementation — Gate 1 design plan provided unambiguous micro-task breakdown, and TDD contract (Phase 5) caught the middleware signature requirement before review.

Four medium/low friction items found:
1. Phase 4 lint is a no-op without a lint config in the example project (medium — add ESLint).
2. Phase 3 set-phase.js path resolution requires explicit CLAUDE_PLUGIN_ROOT awareness in subdirectory projects (medium — document in phases.md).
3. Gate 0/2 prompt wording ('design'/'commit') creates muscle-memory friction (low — add reminder notes).
4. Phase 8 has no fast-exit path for zero-doc-change tasks (low — add quick-exit rule).

**Consequences**: EPIC-C closed. Four follow-up tasks logged in `docs/research/dogfood-friction-log.md`. STRATEGY_REVIEW.md R-10 updated with outcome. No blocking issues that prevent v1 ship — all friction is low/medium and non-blocking.

---

## ADR-009 — Phase 1 batch-clarify + iteration loop: workflow contract change

**Date**: 2026-04-27
**Status**: decided
**Context**: TASK-100 user friction report (2026-04-27) — AI was asking one clarification question per turn in Phase 1, forcing users into multi-turn back-and-forth before scope was confirmed. This burned context budget and delayed Gate 0 by 3–6 turns on average. A second friction point: after answering, no confirmation that all questions were resolved before proceeding.
**Decision**: Replace the "one question at a time" rule in Phase 1 with batch clarification — all open questions surfaced in one message, user answers in one reply. Add an iteration loop: after reply, AI summarises understanding, checks for remaining ambiguity, asks again if needed, then proceeds to Gate 0 only when fully resolved.
**Alternatives considered**:
- Keep one-question-at-a-time — rejected: compounds context waste with no quality benefit; users with clear requirements still pay the cost
- Silent assumption (skip clarification) — rejected: causes scope drift caught late at Gate 2 or post-commit
**Consequences**: MINOR semver bump (1.8.0 → 1.9.0) — user-visible Phase 1 behavior changes. `phases.md` Phase 1 updated; SKILL.md Phase Checklist row updated. Users who relied on one-at-a-time pacing now receive all questions upfront — iteration loop recovers cases where batch is overwhelming.

---

## ADR-010 — Plugin-first distribution: Claude Code plugin as primary adoption channel

**Date**: 2026-04-29
**Status**: decided
**Context**: TASK-102. Original distribution model required `git clone` + `node bin/dev-flow-init.js` — too many manual steps for adoption. Claude Code's plugin system (`claude plugin install <url>`) supports git-sourced plugins with auto-loaded skills, agents, and hooks. Plugin-first distribution aligns with the Claude Code ecosystem and removes the init script barrier. Decision driven by user adoption friction observed across dogfood runs (EPIC-C) and team rollout planning.
**Decision**: Adopt Claude Code plugin system as primary distribution channel. `skills/`, `agents/`, `hooks/` mirrored at repo root for plugin loader discovery. `.claude-plugin/marketplace.json` added for registry listing. `plugin.json` version bumped to `1.9.0`. README adoption section updated to plugin-first install steps.
**Alternatives considered**:
- Keep git clone + init script — rejected: too many steps; init script adds fragility and maintenance overhead; breaks on Windows path conventions
- npm package — rejected: wrong ecosystem; Claude Code skills are not npm-compatible modules
- Dual-track (both) — rejected: README cannot clearly serve two install flows; plugin-first covers 95% of adoption cases
**Consequences**: MINOR semantically (new distribution path, no phase/gate changes). `validate-scaffold.js` gains check for root-level mirrors. Examples project stays in-repo but not mirrored at root — separate concern. Users who cloned before this change can continue using `.claude/skills/` directly — no breaking change to skill resolution.

---

## ADR-011: Skill-dispatch governance — layers-to-skills binding

**Date**: 2026-04-30
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

### Context

10+ scaffolding skills exist in the skill library (fe-component-builder, be-service-scaffolder, api-contract-designer, etc.) but no binding between a task's `layers` field and which skills must be invoked. Each dev-AI pair picks freely, producing inconsistent code patterns across team. Identified in IMPROVEMENT.md loophole audit L3.

### Decision

Add `skill-dispatch.md` reference doc mapping `layers` field values → required skills. Surface the required skills as an **advisory** field in Gate 0 scope confirmation (`**Required skills**: [list]`). Not a hard stop — preserves human judgment for edge cases.

### Alternatives considered

1. **Hard stop at Phase 3** — block implementation if required skill not invoked. Rejected: too rigid for simple doc tasks where scaffolder adds no value.
2. **Sprint-warn only** — surface in sprint plan but not in Gate 0. Rejected: too weak, doesn't surface early enough to change behavior before design.

### Consequences

- Gate 0 format gains one advisory field. All adopters see skill recommendations at scope confirmation.
- Adopters can extend via `skill-dispatch-local.md` for project-specific layers.
- No enforcement overhead; advisory can be overridden without ceremony.
- Dispatch table must be maintained when new skills are added to the library.
