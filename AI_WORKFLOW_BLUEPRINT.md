---
type: redirect
version: 1.7.0
origin: M.Aldian Rizki Project
last_updated: 2026-04-20
status: current
---

# AI Agent Workflow & Skills Integration Blueprint

> **This file is a redirect.** The blueprint was split into 10 modular files in Sprint 1 (TASK-004).
> All content lives under `docs/blueprint/`. Read from there.

## Blueprint Sections

| File | Contents |
|:-----|:---------|
| [`docs/blueprint/01-philosophy.md`](docs/blueprint/01-philosophy.md) | §1 — Why, six principles, thin-coordinator rule |
| [`docs/blueprint/02-repo-structure.md`](docs/blueprint/02-repo-structure.md) | §2 — File tree: `.claude/`, `docs/`, `context/` |
| [`docs/blueprint/03-workflow-phases.md`](docs/blueprint/03-workflow-phases.md) | §3 — Phase 0–10, gates, context tiers, modes |
| [`docs/blueprint/04-subagents.md`](docs/blueprint/04-subagents.md) | §4 — Agent tiers, dispatch spec, output contract |
| [`docs/blueprint/05-skills.md`](docs/blueprint/05-skills.md) | §5 + §13 — Skills map, frontmatter standard, invocation reference |
| [`docs/blueprint/06-harness.md`](docs/blueprint/06-harness.md) | §6 + §7 — settings.json, scripts, CLAUDE.md template |
| [`docs/blueprint/07-todo-format.md`](docs/blueprint/07-todo-format.md) | §8 — TODO.md format, lean-doc standard |
| [`docs/blueprint/08-orchestrator-prompts.md`](docs/blueprint/08-orchestrator-prompts.md) | §9 — Gate prompts, TDD contract, hard stops |
| [`docs/blueprint/09-customization.md`](docs/blueprint/09-customization.md) | §10–§12 + §14–§15 — Stack customization, setup checklist, alignment guide |
| [`docs/blueprint/10-modes.md`](docs/blueprint/10-modes.md) | §16–§22 — INIT, Resume, Migration, Performance, Hotfix, Task Decomposer |

## Key fixes applied in this split (TASK-005)

- Phase numbering unified to 0–10 throughout (old §1 I/O table used 1–9 — now corrected)
- `scope.phase` enum in §4 subagent payload: added `parse | clarify | validate | close`
- `lean-doc-generator-version` field removed (was undefined; not a CC spec field)
- `read-guard.js` corrected to use stdin JSON (old env-var approach was broken — see `context/research/CC_SPEC.md`)
- `status:` enum added to agent output contract: `DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED`
- `type:`, `when_to_use:`, `context: fork` documented as project-convention fields in §5 (required vs optional)
- `${CLAUDE_PLUGIN_ROOT}` used in all hook command lines for portable paths

## Version history

See `docs/CHANGELOG.md` for full changelog. Current version: **1.7.0** (last blueprint content release).
Blueprint infrastructure split and governance added in Sprint 1 (2026-04-20) — no behavior change.
