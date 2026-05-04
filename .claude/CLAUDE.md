---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: New skill, agent, script, or hook added; stack or architecture decisions change
status: current
---

# dev-flow — AI Context

## Project Overview
- **Name**: dev-flow
- **Type**: Claude Code plugin · Skill Library · Workflow Scaffold
- **Stack**: Markdown · Claude Code skills system · Node.js ≥18 · PowerShell ≥5.1 (Windows hooks)
- **Architecture**: Plugin-first layout — components at repo root per Claude Code plugin spec

## File Structure
```
skills/          # 17 SKILL.md files + references/ subdirs (plugin auto-discovers)
agents/          # 7 agents (dispatcher + 6 specialists)
scripts/         # audit-baseline.js, eval-skills.js (Node) + session-start.ps1, codemap-refresh.ps1 (PowerShell hooks per ADR-016)
hooks/
  hooks.json     # 3 hooks: SessionStart PS · PreToolUse chain-guard · PostToolUse codemap-refresh
.claude-plugin/
  plugin.json    # plugin manifest (lockstep with marketplace.json per ADR-006)
  marketplace.json
.claude/
  CLAUDE.md      # this file — project context
  CONTEXT.md     # shared domain vocab, gates, modes, agent roster
  settings.json  # local dev hooks
docs/            # ARCHITECTURE/AI_CONTEXT/CHANGELOG/SUPPORT + DECISIONS (≤015 frozen) + sprint/ research/ audit/
  adr/           # ADR-016+ one file per ADR (Sprint 043 DEC-7) · codemap/ 3-tier (CODEMAP.md + handoff.json)
.out-of-scope/   # negative-space pointer files (Sprint 043 ADR-022)
bin/             # dev-flow-init.js scaffold bootstrap (built-ins only per ADR-002)
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
