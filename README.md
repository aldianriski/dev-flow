---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
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
- **27 Hard Stops** — non-negotiable pipeline blocks for dangerous conditions
- **7 Subagents** — specialist workers (design, review, security, migration, performance, etc.)
- **Skill library** — 9+ project-local, git-tracked skills
- **Harness scripts** — session bootstrap, read-guard, change tracker, CI poller

## What it is not

A Claude Code plugin or marketplace entry. Adoption is via `git clone` + manual copy (v1).
Multi-platform distribution (`.codex/`, `.cursor-plugin/`, `AGENTS.md`) is planned for v2.

## How to adopt

```bash
git clone https://github.com/aldian/dev-flow
cp -r dev-flow/.claude your-project/
cp dev-flow/docs/blueprint/07-todo-format.md your-project/  # TODO.md template
cp your-project/.claude/settings.local.example.json your-project/.claude/settings.local.json
# Customize .claude/CLAUDE.md for your stack
# Run /dev-flow init [project-name] to bootstrap
```

Full setup checklist: [`docs/blueprint/09-customization.md`](docs/blueprint/09-customization.md) §12.

## Blueprint structure

```
docs/blueprint/
  01-philosophy.md          why, six principles, thin-coordinator rule
  02-repo-structure.md      file tree
  03-workflow-phases.md     phases 0–10, gates, modes
  04-subagents.md           agent tiers, dispatch spec, output contract
  05-skills.md              skills map, frontmatter standard, invocation reference
  06-harness.md             settings.json, scripts, CLAUDE.md template
  07-todo-format.md         TODO.md format, lean-doc standard
  08-orchestrator-prompts.md gate prompts, TDD contract, hard stops
  09-customization.md       stack customization, setup checklist
  10-modes.md               INIT, Resume, Migration, Performance, Hotfix, Task Decomposer
```

## License

MIT — see [LICENSE](LICENSE).
