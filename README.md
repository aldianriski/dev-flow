---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-26
update_trigger: New mode, agent, or skill added; adoption workflow changes
status: current
---

# dev-flow — Universal AI Workflow Starter

A gate-driven, mode-modal AI workflow system for any software project.
Built on Claude Code. Designed to be more rigorous than [superpowers](https://github.com/obra/superpowers) while adopting its best craft patterns.

## What it is

A starter repository that you copy into any project to get:
- **3 Gates** — scope, design, and review+security checkpoints before any commit
- **6 Modes** — `init / full / quick / hotfix / review / resume`
- **24 Hard Stops** — non-negotiable pipeline blocks for dangerous conditions
- **7 Subagents** — specialist workers (design, review, security, migration, performance, etc.)
- **Skill library** — 10 project-local, git-tracked skills
- **Harness scripts** — session bootstrap, read-guard, change tracker, CI poller

## How to adopt

```bash
git clone https://github.com/aldian/dev-flow
node dev-flow/bin/dev-flow-init.js
```

Prompts: target dir · project name · owner role · stack (`node-express` · `react-next` · `python-fastapi` · `go-gin` · `custom`). Also copies `.claude/` + `docs/blueprint/` into your project.

| File | Description |
|:-----|:------------|
| `.claude/CLAUDE.md` | AI context — fill `[CUSTOMIZE]` blocks |
| `TODO.md` | Dev tracker — sprint, backlog, changelog |
| `docs/CHANGELOG.md` | Sprint archive |
| `docs/ARCHITECTURE.md` | Architecture map |
| `docs/DECISIONS.md` | Decision log |
| `docs/AI_CONTEXT.md` | Extended AI context |
| `docs/SETUP.md` | Setup guide |
| `README.md` | Project README template |
Fallback (`cp -r`): [`docs/blueprint/09-customization.md`](docs/blueprint/09-customization.md) §12.

## Working on This Project

**Start here every session →** [TODO.md](TODO.md)

## License

MIT — see [LICENSE](LICENSE).