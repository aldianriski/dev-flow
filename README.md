---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: New mode, agent, or skill added; adoption workflow changes
status: current
---

# dev-flow — Agentic Engineering Workflow Starter

Skills-first, context-minimal AI workflow for any software project.
Built on Claude Code. Dispatcher delegates to agents. Humans gate.

## What it is

Copy into any project to get:
- **2 Gates** — G1 Scope + G2 Design checkpoints before any commit
- **3 Modes** — `init / quick / mvp`
- **14 Skills** — project-local, git-tracked, ≤100 lines each
- **7 Agents** — dispatcher + 6 specialists (design, review, security, migration, performance, scope)
- **CONTEXT.md** — shared domain vocabulary for all agents
- **2 Scripts** — `audit-baseline.js` + `eval-skills.js` (Node hook scripts retired ADR-016)

## Skills

| Skill | Purpose |
|---|---|
| `orchestrator` | Core workflow — gates, modes, agent dispatch |
| `task-decomposer` | Freeform intent → TASK entries + vertical slices |
| `system-design-reviewer` | Architecture review + grill mode for unclear designs |
| `pr-reviewer` | Structured code review |
| `security-auditor` | OWASP audit (separate session) |
| `refactor-advisor` | Code smells + deep-module opportunities |
| `release-manager` | Semver + changelog |
| `adr-writer` | Architectural decision records |
| `lean-doc-generator` | WHY/WHERE docs only — never HOW |
| `dev-flow-compress` | Compress CLAUDE.md / memory files |
| `diagnose` | 6-phase systematic debugging |
| `tdd` | Tracer bullet → red-green-refactor |
| `zoom-out` | Bird's-eye module map before diving in |
| `write-a-skill` | Author new skills with quality constraints |

## How to adopt

**Plugin install (recommended):**
```bash
claude plugin marketplace add https://github.com/aldianriski/dev-flow
# In your project directory — Claude Code auto-loads the plugin:
/orchestrator init
```

`/orchestrator init` scaffolds `CLAUDE.md`, `CONTEXT.md`, and `TODO.md` into your project.

| Provided by plugin | Created by init script |
|:---|:---|
| `skills/`, `agents/`, `hooks/` — auto-loaded by Claude Code | `CLAUDE.md`, `CONTEXT.md`, `TODO.md` |

**Scaffold copy (fallback):** `git clone` + `node bin/dev-flow-init.js`.

## Working on This Project

**Start here every session →** [TODO.md](TODO.md)

## License

MIT — see [LICENSE](LICENSE).
