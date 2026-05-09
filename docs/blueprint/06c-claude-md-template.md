---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR version bump; hook contract changes; new script added
status: current
source: AI_WORKFLOW_BLUEPRINT.md §6 + §7 (split TASK-004); split from 06-harness.md (TASK-059)
---

## §7 — CLAUDE.md Template

This file is always loaded into every AI session. Keep it under 200 lines.

```markdown
# [Project Name] — AI Context

## Project Overview
- **Name**: [Project name]
- **Type**: [Web app / API / Library / Mobile]
- **Stack**: [Framework + Language + Key libraries]
- **Architecture**: [Clean Architecture / MVC / Hexagonal / Layered]

## Dependency Rule [CUSTOMIZE]
[Outer Layer] → [Middle Layer] → [Inner Layer] → [External]
- [Specific rule 1]
- [Specific rule 2]

## File Structure [CUSTOMIZE]
/[source-root]
  /[layer-1]/    # [what goes here]
  /[layer-2]/    # [what goes here]

## Code Generation Order [CUSTOMIZE]
1. [First thing to create] → 2. [Second] → 3. [Third] → ...

## Naming Conventions [CUSTOMIZE]
- Files: [kebab-case / snake_case / PascalCase]
- [Component/Class/Function]: [naming rule]
- [Test]: [naming rule]

## Anti-Patterns (Avoid) [CUSTOMIZE]
❌ [Anti-pattern 1]
❌ [Anti-pattern 2]

## Commands [CUSTOMIZE]
[install-command]
[run-command]
[test-command]
[lint-command]
[build-command]

## Definition of Done
Every task must satisfy all of these before commit:
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Unit + integration tests pass
- [ ] Review: 0 blocking issues
- [ ] Security: 0 critical findings
- [ ] DECISIONS.md updated if an architectural decision was made
- [ ] Acceptance criteria verified by human at Gate 2

## Context Memory Instructions
1. [Rule 1 for AI to follow]
2. [Rule 2 for AI to follow]
```
