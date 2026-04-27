---
owner: Tech Lead
last_updated: 2026-04-27
update_trigger: New example added; bootstrap instructions change
status: current
---

# dev-flow Examples

Worked examples of projects bootstrapped with dev-flow.

## `node-express/`

Minimal Express service bootstrapped via `node bin/dev-flow-init.js` (stack=node-express). Used as the dev-flow dogfood project for EPIC-C validation.

The `.claude/` tree is checked in so Claude Code works immediately — no init step required.

**Contents**:
- `.claude/` — full scaffold: CLAUDE.md, skills/, agents/, scripts/, settings.json
- `docs/` — rendered doc templates + `docs/blueprint/` (governance reference)
- `TODO.md` — Sprint 1 with two real tasks (TASK-001 error handler, TASK-002 users CRUD)
- `src/index.js` — minimal Express server (health check + root route)
- `package.json` — project manifest

**To use immediately:**
```bash
cd examples/node-express
claude   # opens Claude Code in this directory
# then: /dev-flow TASK-001
```

**To bootstrap a new project using the same pattern:**
```bash
node bin/dev-flow-init.js
# prompts: target dir · project name · owner role · stack (node-express)
```

Then customize every `[CUSTOMIZE]` section in `.claude/CLAUDE.md` and `TODO.md`.

## E2E Smoke Test (TASK-069 fixture)

Manual steps to verify plugin install + Phase 0 parse:

1. `claude plugin install <repo-url>` (or `cd examples/node-express` after cloning)
2. Open Claude Code: `claude`
3. Run: `/dev-flow full TASK-001`
4. Verify Phase 0 output contains: task ID `TASK-001`, `scope: quick`, `layers: middleware`, non-empty `acceptance`
5. Type `design` at Gate 0 prompt — confirm Phase 2 dispatches design-analyst

CI validates plugin manifest on every PR: `node .claude/scripts/validate-plugin.js`

## How to replicate this pattern

1. Clone dev-flow or install it as a plugin.
2. Run `node bin/dev-flow-init.js` — answer prompts.
3. Add application code alongside the scaffolded governance files.
4. Open `.claude/CLAUDE.md` and customize every `[CUSTOMIZE]` section.
5. Run `/dev-flow` in Claude Code to start the workflow.
