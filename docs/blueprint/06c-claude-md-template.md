---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Blueprint MAJOR version bump; hook contract changes; new script added; CLAUDE.md template change
status: current
source: AI_WORKFLOW_BLUEPRINT.md §6 + §7 (split TASK-004); split from 06-harness.md (TASK-059); ADR-029 lean architecture render (Sprint 051b)
---

## §7 — CLAUDE.md Template

This file is always loaded into every AI session. Keep it under 80 lines (dev-flow cap; live template at `templates/CLAUDE.md.template`).

The template renders per-stack via `applySubstitutions` (bin/dev-flow-init.js) with 8 substitution tokens:

| Token | Source | Behavior |
|:------|:-------|:---------|
| `[Project Name]` | init prompt | scalar — project name |
| `[role — not personal name]` | init prompt | scalar — owner role (e.g. "Tech Lead") |
| `YYYY-MM-DD` | runtime | scalar — today's date |
| layer-block (`> \`[list your stack's layer names…]\``) | STACK_PRESETS.layers | block — replaced atomically with `> \`<layers>\`` |
| `[source-root]` | STACK_PRESETS.sourceRoot | scalar — `src` / `app` / `internal` per stack |
| `[test-root]` | STACK_PRESETS.testRoot | scalar — `tests` (omitted for go-gin) |
| `[app-root-line]` | STACK_PRESETS.appRoot | full-line conditional — Next.js `app/` for react-next; line vanishes otherwise |
| `[cmd-root-line]` | STACK_PRESETS.cmdRoot | full-line conditional — Go `cmd/` for go-gin; line vanishes otherwise |
| `[test-root-line]` | STACK_PRESETS.testRoot | full-line conditional — `tests/` for non-Go stacks; line vanishes for go-gin |

```markdown
---
owner: [role — not personal name]
last_updated: YYYY-MM-DD
update_trigger: [what triggers an update to this file]
status: current
---

# [Project Name] — AI Context

## Project Overview
- **Name**: [Project Name]
- **Type**: [Web app / API / Library / Mobile / Starter Scaffold]
- **Stack**: [Framework + Language + Key libraries]
- **Architecture**: Clean Architecture + Domain-Driven Design (per ADR-029)

## Session Workflow
3-step pattern for any AI-driven session:
1. `/prime` — load ordered context (CLAUDE.md → CONTEXT.md → TODO.md → sprint file)
2. `/lean-doc-generator` — align docs to current code state
3. `/orchestrator` — execute next task (mode: sprint-bulk / mvp / quick / init)

Full guide → `docs/blueprint/12-session-workflow.md`

## Dependency Rule
`interface → application → domain ← infrastructure` (Clean Architecture arrow)
- Domain has zero outward dependencies
- Infrastructure depends inward via interfaces; never the reverse

## File Structure
> **Layer values** [CUSTOMIZE]
> `[list your stack's layer names — see docs/blueprint/09-customization.md for stack-specific examples]`
> Example — Node/Express: `domain, application, infrastructure, interface, shared`
> Example — react-next: `domain, application, infrastructure, shared` (4 layers; interface = `app/`)

```
/[source-root]/      # CA+DDD layers — purposes in docs/blueprint/11-lean-architecture.md
[app-root-line]
[cmd-root-line]
[test-root-line]
```

## Code Generation Order [CUSTOMIZE]
1. Domain → 2. Application → 3. Infrastructure → 4. Interface

## Naming Conventions [CUSTOMIZE]
- Files: [kebab-case / snake_case / PascalCase per stack]

## Anti-Patterns (Avoid)
❌ Anemic domain — business logic outside `domain/`
❌ Kitchen-sink `shared/` — dependency dumping ground
❌ Framework leak into `domain/` — ORM entity in domain layer
❌ Skipping G1 Scope / G2 Design gates (per `.claude/CONTEXT.md`)

## Commands [CUSTOMIZE]
```bash
[install-command]
[run-command]
[test-command]
```

## Definition of Done
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Unit + integration tests pass
- [ ] Review: 0 blocking issues
- [ ] Security: 0 critical findings
- [ ] DECISIONS.md updated if architectural decision made
- [ ] Acceptance criteria verified by human at G2

## Behavioral Guidelines
### Think Before Coding — surface assumptions; ask on ambiguous requirements; never fabricate.
### Simplicity First — minimum that satisfies AC; no speculative features; no single-use abstractions.
### Surgical Changes — touch only what task requires; match adjacent style; don't restructure.
### Goal-Driven Execution — restate task as verifiable goal before implementing; state what "done" looks like.
```
