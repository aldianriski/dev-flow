---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-22
update_trigger: New skill, agent, or script added; stack or architecture decisions change
status: current
---

# dev-flow — AI Context

## Project Overview
- **Name**: dev-flow
- **Type**: Starter Scaffold / Skill Library
- **Stack**: Markdown · Claude Code skills system · Node.js ≥18 · Python 3.10+ (scripts)
- **Architecture**: No layered app; organized by concern under `.claude/`

## File Structure
```
.claude/
  skills/      # SKILL.md files and sibling reference docs
  agents/      # agent definitions (code-reviewer, security-analyst, etc.)
  scripts/     # harness utilities (session bootstrap, read-guard, change tracker)
docs/
  blueprint/   # authoritative system documentation (01–10)
templates/     # CLAUDE.md.template, TODO.md.template (TASK-020)
```

## Code Generation Order
1. `SKILL.md` — spec, hard rules, Red Flags
2. `skills/<name>/references/` — heavy reference content (>100 lines)
3. Agent binding in `MANIFEST.json`
4. `scripts/<name>.js` (Node) or `scripts/<name>.py` (Python) + sibling test file

## Naming Conventions
- Files: kebab-case

## Anti-Patterns (Avoid)
❌ HOW content in any doc file — move to code comments
❌ Skill changes without eval evidence (RED-GREEN-REFACTOR per TASK-026)
❌ Hard stop count or gate model changes without a blueprint version bump
❌ Editing auto-synced copies — always edit the canonical source file

## Commands
```bash
node scripts/<name>.js              # run a Node harness script
node scripts/__tests__/<name>.test.js  # run Node script unit tests
python scripts/<name>.py            # run a Python harness script
python -m py_compile scripts/<name>.py  # validate Python syntax
```

## Definition of Done
Every task must satisfy all of these before commit:
- [ ] Lint passes
- [ ] Skill or doc change: lean-doc line limits respected (CLAUDE.md ≤200 lines)
- [ ] Review: 0 blocking issues
- [ ] Security: 0 critical findings
- [ ] DECISIONS.md updated if an architectural decision was made
- [ ] Acceptance criteria verified by human at Gate 2

## Behavioral Guidelines

### Think Before Coding
Before writing any file, surface your assumptions and name any points of confusion explicitly.
Do not generate plausible-sounding output to cover uncertainty.
Ask before guessing on ambiguous requirements.

### Simplicity First
Write the minimum content that satisfies the acceptance criteria.
No speculative sections. No single-use abstractions.
If a skill or section serves only one task, question whether it belongs at all.

### Surgical Changes
Touch only what the task requires. Match the style of surrounding files.
Do not restructure adjacent skills or docs unless your change made them inconsistent.

### Goal-Driven Execution
Before implementing, restate the task as a verifiable goal with brief numbered steps.
State what "done" looks like before starting. Do not begin until the goal is clear.
