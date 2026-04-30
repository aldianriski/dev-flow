---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: New mode, agent, or skill added; adoption workflow changes
status: current
---

# dev-flow — Universal AI Workflow Starter

A gate-driven, mode-modal AI workflow system for any software project.
Built on Claude Code. Designed to be more rigorous than [superpowers](https://github.com/obra/superpowers) while adopting its best craft patterns.

## What it is

A starter repository that you copy into any project to get:
- **3 Gates** — scope, design, and review+security checkpoints before any commit
- **7 Modes** — `init / full / quick / mvp / hotfix / review / resume`
- **24 Hard Stops** — non-negotiable pipeline blocks for dangerous conditions
- **7 Subagents** — specialist workers (design, review, security, migration, performance, etc.)
- **Skill library** — 10 project-local, git-tracked skills
- **Harness scripts** — session bootstrap, read-guard, change tracker, CI poller

## How to adopt

**Plugin install (recommended):**
```bash
claude plugin marketplace add https://github.com/aldianriski/dev-flow
node dev-flow/bin/dev-flow-init.js
```

`dev-flow-init.js` prompts: target dir · project name · owner role · stack (`node-express` · `react-next` · `python-fastapi` · `go-gin` · `custom`).

| Provided by plugin | Created by init script |
|:---|:---|
| `skills/`, `agents/`, `hooks/` — auto-loaded by Claude Code | `.claude/CLAUDE.md`, `TODO.md`, `docs/` template tree |

**Scaffold copy (fallback):** `git clone` + `node bin/dev-flow-init.js`. See [`docs/blueprint/09-customization.md`](docs/blueprint/09-customization.md) §12.

## Working on This Project

**Start here every session →** [TODO.md](TODO.md) · **Support / friction reports →** [docs/SUPPORT.md](docs/SUPPORT.md)

## License

MIT — see [LICENSE](LICENSE).
