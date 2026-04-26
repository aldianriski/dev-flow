---
owner: Tech Lead
last_updated: 2026-04-25
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
