---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-24
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

## What it is not

A Claude Code plugin or marketplace entry. Adoption is via `git clone` + manual copy (v1).
Multi-platform distribution (`.codex/`, `.cursor-plugin/`, `AGENTS.md`) is planned for v2.

## How to adopt

```bash
git clone https://github.com/aldian/dev-flow
cp -r dev-flow/.claude your-project/
cp dev-flow/templates/CLAUDE.md.template your-project/.claude/CLAUDE.md
cp dev-flow/templates/TODO.md.template your-project/TODO.md
cp your-project/.claude/settings.local.example.json your-project/.claude/settings.local.json
# Edit .claude/CLAUDE.md for your stack, then run /dev-flow init [project-name]
```

Full setup checklist: [`docs/blueprint/09-customization.md`](docs/blueprint/09-customization.md) §12.

## Blueprint structure

[`docs/blueprint/`](docs/blueprint/) — 10 files covering philosophy, phases, subagents, skills, harness, and modes.

## License

MIT — see [LICENSE](LICENSE).
