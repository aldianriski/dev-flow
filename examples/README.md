---
owner: Tech Lead
last_updated: 2026-04-25
update_trigger: New example added; bootstrap instructions change
status: current
---

# dev-flow Examples

Worked examples of projects bootstrapped with dev-flow.

## `node-express/`

Minimal Express service created via `node bin/dev-flow-init.js`. Shows what a bootstrapped project looks like.

**Contents after bootstrap**:
- `.claude/` — skills, agents, scripts, settings template
- `docs/blueprint/` — workflow reference docs
- `docs/` — rendered doc templates (ARCHITECTURE, DECISIONS, CHANGELOG, etc.)
- `TODO.md` — sprint tracker, pre-filled for node-express stack
- `.claude/CLAUDE.md` — AI context, pre-filled with project name and layers
- `src/index.js` — minimal Express server added after bootstrap
- `package.json` — project manifest

## How to replicate this pattern

1. Clone dev-flow or add it as a local path.
2. Run: `node bin/dev-flow-init.js`
3. Answer prompts: target directory, project name, stack (`node-express`), owner role.
4. Add your application code alongside the scaffolded governance files.
5. Open `.claude/CLAUDE.md` and customize every `[CUSTOMIZE]` section for your project.
6. Run `/dev-flow` in Claude Code to start the workflow.
