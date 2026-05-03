---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: New skill, agent, or script added; stack or architecture decisions change
status: current
---

# dev-flow — AI Context

## Project Overview
- **Name**: dev-flow
- **Type**: Starter Scaffold / Skill Library
- **Stack**: Markdown · Claude Code skills system · Node.js ≥18
- **Architecture**: Plugin-first layout — components at repo root per Claude Code plugin spec

## File Structure
```
skills/          # SKILL.md files + references/ subdirs (plugin auto-discovers)
agents/          # agent definitions (dispatcher + 6 specialists)
scripts/         # audit-baseline.js, eval-skills.js (Node hook scripts retired ADR-016)
hooks/
  hooks.json     # plugin hook config
.claude-plugin/
  plugin.json    # plugin manifest
  marketplace.json
.claude/
  CLAUDE.md      # this file — project context
  CONTEXT.md     # shared domain vocab, gates, modes, agent roster
  settings.json  # local dev hooks
docs/
  blueprint/     # v1 reference (read-only archive)
bin/             # dev-flow-init.js scaffold bootstrap
```

## Code Generation Order
1. `SKILL.md` — purpose, steps, red flags
2. `skills/<name>/references/` — reference content >100 lines
3. Agent binding if new agent needed
4. `scripts/<name>.js` — only for deterministic repeated ops

## Naming Conventions
- Files: kebab-case

## Anti-Patterns
❌ HOW content in doc files — move to code/skill
❌ Skill changes without verifying against acceptance criteria
❌ Gate or mode count changes without updating CONTEXT.md
❌ Editing agents directly — always check CONTEXT.md Agent Roster first

## Commands
```bash
node scripts/audit-baseline.js                                # baseline metrics
node scripts/eval-skills.js                                   # skill eval
powershell -File scripts/codemap-refresh.ps1                  # rebuild codemap (auto on commit)
```

## Definition of Done
- [ ] Acceptance criteria verified by human at G2
- [ ] Review: 0 blocking issues
- [ ] CONTEXT.md updated if vocabulary or agent roster changed
- [ ] ADR written for hard-to-reverse decisions
- [ ] Line limits respected: CLAUDE.md ≤80 · SKILL.md ≤100 · agents ≤30

## Behavioral Guidelines

### Think Before Acting
Surface assumptions before writing. Ask on ambiguous requirements. Do not generate plausible-sounding output to cover uncertainty.

### Simplicity First
Minimum content satisfying acceptance criteria. No speculative sections. No single-use abstractions.

### Surgical Changes
Touch only what the task requires. Do not restructure adjacent files unless your change made them inconsistent.

### Goal-Driven Execution
Restate the task as a verifiable goal before implementing. State what "done" looks like. Do not begin until goal is clear.

## Codemap (L0)
> Overflow: see [docs/codemap/CODEMAP.md §L0-overflow](../docs/codemap/CODEMAP.md) (TASK-098)
