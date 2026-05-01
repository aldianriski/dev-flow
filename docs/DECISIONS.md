---
owner: Tech Lead
last_updated: 2026-05-01
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
**Status**: superseded-by ADR-013
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
**Status**: superseded-by ADR-013

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
**Status**: superseded-by ADR-013

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
**Status**: superseded-by ADR-013
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
**Status**: Accepted (superseded-in-part by ADR-014 — naming only; substance preserved; `skill-dispatch.md` now at `skills/orchestrator/references/`)
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

---

## ADR-012: Wrap-or-replace Claude Code primitives — Replace

**Date**: 2026-05-01
**Status**: Accepted (superseded-in-part by ADR-014 — naming only; "dev-flow init" mode now invoked as `/orchestrator init`)
**Deciders**: Tech Lead (Aldian Rizki)

### Context

v2 skills and agents overlap with three Claude Code built-in primitives: `/review` slash command, `TaskCreate/TaskList/TaskUpdate` tools, and `/init` slash command. No explicit decision existed on whether to wrap (use CC primitive + add behavior on top) or replace (custom implementation, CC primitive ignored). Without a decision, contributors risk mixing both approaches and creating inconsistent behavior. Audit: `docs/research/r9-primitive-audit.md`.

### Decision

**Replace** over Wrap across all three overlaps.

- `/review` → `code-reviewer` agent (auto-dispatched) + `pr-reviewer` skill is canonical. CC `/review` is not used.
- `TaskCreate / TaskList / TaskUpdate` → `TODO.md` is canonical for task tracking. CC task tools are not used.
- `/init` → `dev-flow init` mode is canonical for project scaffolding. CC `/init` is not used.

### Alternatives considered

1. **Wrap `/review`**: Use CC `/review` and post-process output into tiered format. Rejected — CC `/review` has no task-context awareness; tiered format (CRITICAL/BLOCKING/NON-BLOCKING) depends on task acceptance criteria which CC `/review` does not receive.
2. **Use TaskCreate/TaskList for tracking**: Provides native task state. Rejected — CC task tools are session-scoped and ephemeral; TODO.md is project-scoped and git-tracked; sprint structure is lost on session reset.
3. **Use CC `/init` + supplement**: Run CC `/init` then append CONTEXT.md + TODO.md. Rejected — two-step init adds fragility; CONTEXT.md and TODO.md are required from step one for gates to function; simpler to own the full scaffold.

### Consequences

- All three CC primitives are explicitly excluded from v2 workflow. Skills and agent descriptions updated to say so (TASK-087, TASK-088, TASK-089).
- Contributors must not wire CC task tools or `/review` into future skill additions — document in Quick Rules.
- If CC primitives gain task-context or session-persistence features, this ADR should be revisited.

**EPIC-E closed** — consistency sweep (TASK-090) confirmed zero conflicting CC primitive references across `skills/` and `agents/`. Sprint 29 complete 2026-05-01.

---

## ADR-013: v2 rewrite supersedes v1 phase/mode/phase-tracking model; read-guard retired

**Date**: 2026-05-01
**Status**: decided (superseded-in-part by ADR-014 — naming only; v2 skill is now `orchestrator`, agent is now `dispatcher`)
**Deciders**: Tech Lead (Aldian Rizki)

### Context

The v2 rewrite (Sprints 18–29) replaced the v1 phase model (10 sequential phases tracked via `.claude/.phase` file), the v1 mode set (init/full/quick/hotfix/review/resume), and the phase-tracking machinery (`set-phase.js`, `ci-status.js`, `track-change.js`). ADR-003 decided orchestrator-managed phase state via `set-phase.js`; ADR-007 added `mvp` mode as a 3-phase path; ADR-008 validated the v1 dogfood run; ADR-009 changed Phase 1 clarification behavior. None of these were marked superseded after the v2 rewrite landed. Separately, `read-guard.js` — the PreToolUse hook enforcing the Thin-Coordinator Rule — became a silent no-op: `COMPACT_VULNERABLE = new Set()` (empty), phase file never written, guard always pass-through. The hook still fired on every Read/Grep/Glob call, paying Node startup cost with zero enforcement.

### Decision

1. ADR-003, ADR-007, ADR-008, and ADR-009 are superseded by this ADR. The v1 phase model, mode set, and phase-tracking contract they describe are retired.
2. `scripts/read-guard.js` is deleted. The PreToolUse `Read|Grep|Glob` hook entry is removed from `hooks/hooks.json`. Dead enforcement code is worse than no enforcement code.
3. The Thin-Coordinator Rule remains a stated principle in CONTEXT.md but has no runtime enforcement in v2. A v2-compatible enforcement mechanism (if any) is a future decision.

### Alternatives considered

| Option | Reason rejected |
|:-------|:----------------|
| Keep read-guard.js stub "for forward compatibility" | Zero protection + Node startup cost on every file read; misleading comment implies enforcement that does not exist |
| Restore phase-tracking (set-phase.js + .phase) | Substantial redesign outside P0 audit scope; v2 SKILL.md has no phase-entry markers; deferred to future sprint |

### Consequences

**Positive**:
- PreToolUse hook no longer fires on every Read/Grep/Glob — no Node startup overhead per file read
- Stale governance docs (ARCHITECTURE.md, AI_CONTEXT.md) marked `status: stale` — honest signal to readers
- ADR status log accurate — superseded ADRs correctly marked

**Negative** (trade-offs accepted):
- Thin-Coordinator Rule has no runtime enforcement in v2 — relies on prompt discipline only
- If a future sprint restores enforcement, it must design from scratch; the v1 scaffold is gone

**Neutral**:
- `hooks/hooks.json` retains the `Bash(git add*)` chain-guard and `SessionStart` bootstrap hook — unaffected

---

## ADR-014: Atomic naming rename — skill `dev-flow` → `orchestrator`; agent `orchestrator` → `dispatcher`

**Date**: 2026-05-01
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

### Context

Two name collisions surfaced in Sprint 34 baseline (`docs/audit/baseline-metrics.md`) and the user-driven naming-clarity audit ask (audit ticket #3, 2026-05-01):

1. **Skill `dev-flow` ↔ plugin `dev-flow`** — the skill name and plugin name are identical. The slash command `/dev-flow` is ambiguous in both code and prose: does it refer to plugin scope (the whole dev-flow workflow) or the specific orchestration skill? Adopters reading skill cross-references can't tell whether "`dev-flow`" means the plugin brand or the skill identifier without surrounding context.

2. **Agent `orchestrator` ↔ planned skill `orchestrator`** — the orchestration skill is the natural target for the rename (the skill *is* the orchestrator workflow), but that name was already taken by the lead agent. Renaming the skill to `orchestrator` requires renaming the agent first.

The plugin name `dev-flow` is the public-facing brand on GitHub, the marketplace, the binary `bin/dev-flow-init.js`, and the namespace prefix `dev-flow:`. Renaming the plugin would break every adopter's install URL, every issue link, every published reference. Renaming the skill and agent — both internal identifiers — has zero adopter impact (no one pins skill names).

### Decision

**Skill `dev-flow` → `orchestrator`.** Plugin name `dev-flow` is preserved.

**Agent `orchestrator` → `dispatcher`.** All internal references to the lead-agent role (e.g. "input from orchestrator", "spawned by orchestrator") update to `dispatcher`. The `Orchestration over coding` principle name in CONTEXT.md is preserved as a workflow concept — it now refers to the role the `dispatcher` agent owns.

**Sweep scope** — every skill, agent, and governance doc updated; plugin manifest, binary name, repo URL, and `dev-flow-compress` skill kept literal (different artifact). Closed sprint docs, frozen audits, and prior ADRs (ADR-001..013) preserve their original wording as historical record. ADR-011, ADR-012, ADR-013 receive `superseded-in-part by ADR-014` status markers (naming only — substance preserved).

Both renames executed in a single atomic sprint (Sprint 35) — splitting would double the grep-sweep cost across overlapping files (`skills/orchestrator/SKILL.md`, all 7 agents that reference the lead role).

### Alternatives considered

1. **Rename the plugin instead of the skill.** Rejected — breaks every adopter install URL, every namespace reference (`dev-flow:adr-writer` etc.), every GitHub issue link. The plugin is the public brand; the skill is an internal identifier.

2. **Rename only the skill (`dev-flow` → `orchestrator`); keep the agent named `orchestrator`.** Rejected — produces a worse collision: skill `orchestrator` and agent `orchestrator` would share the same name with no disambiguation possible from `/orchestrator` invocation context. Resolves nothing.

3. **Rename only the agent (`orchestrator` → `dispatcher`); keep the skill named `dev-flow`.** Rejected — the agent rename alone doesn't solve the plugin/skill name collision that motivated the audit ask. Half-measure.

4. **Split into two sprints (skill rename in Sprint 35a, agent rename in Sprint 35b).** Rejected — overlapping files (skill body references the lead-agent role; agent body references the orchestrating skill) would force two passes through the same edits, doubling sweep cost. Atomic sprint = single locked plan = single ADR narrative.

5. **Defer naming to post-v1 ship.** Rejected — every sprint that lands on the old names accretes more references that have to be cleaned later. The cost grows linearly with deferred time; the benefit is zero.

### Consequences

**Positive**:
- `/orchestrator` slash command unambiguously names the workflow skill; plugin scope is the namespace prefix `dev-flow:` (e.g. `dev-flow:adr-writer`).
- Agent `dispatcher` semantically describes its single responsibility (dispatch specialist agents) without colliding with the workflow concept.
- Phase 2 (Sprint 36) workflow wiring verification can map `gates ↔ modes ↔ agents ↔ skills ↔ hooks` without name aliasing.
- Closed sprint docs and frozen audits preserve original-name references as historical record — no rewriting of the past.

**Negative** (trade-offs accepted):
- Adopters who memorized `/dev-flow init` must learn `/orchestrator init`. Mitigated: the change is a one-time cost; CHANGELOG.md captures it; bare-form disambiguation depends on Claude Code resolution rules (recorded in Sprint 35 retro).
- Three closed ADRs (011, 012, 013) gain `superseded-in-part` markers — minor history annotation, not content rewrite.
- Subagent invocations using `dev-flow:orchestrator` must update to `dev-flow:dispatcher`. No external adopters depend on this; internal refs swept in T3.

**Neutral**:
- Plugin name `dev-flow`, binary `bin/dev-flow-init.js`, plugin namespace `dev-flow:`, repo URL — all unchanged.
- Skill `dev-flow-compress` kept literal — different skill, different concern.
- `plugin.json` `version` not bumped by this rename — adopter contract is the namespace and plugin name, both preserved. Future Phase 5 doc refresh may bump.

**EPIC-Audit Phase 1 closed** — Sprint 35 atomic naming rename shipped.
