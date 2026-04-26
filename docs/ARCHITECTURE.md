---
owner: Tech Lead
last_updated: 2026-04-26
update_trigger: New mode, agent, skill, or harness script added; workflow phase or gate model changes
status: current
---

# Architecture — dev-flow
# Load this file when: touching workflow phases · gate model · agent dispatch · harness hooks · skill binding
# For pattern reference only → use AI_CONTEXT.md §Patterns instead

## System Context

dev-flow is a gate-driven workflow scaffold — not an application. No server, no database, no build step.
It runs entirely inside a Claude Code session.

```
[Human] ──► [Claude Code session]
                │
                ├── reads TODO.md (task input)
                ├── materializes skill from SKILL.md (orchestrator)
                ├── spawns background agents (design / review / security)
                ├── runs harness scripts via hooks (.claude/settings.json)
                └── writes files inline
```

## Component Map

| Component | Location | Single Responsibility |
|:----------|:---------|:----------------------|
| Orchestrator skill | `.claude/skills/dev-flow/SKILL.md` | Phase sequencing, gate enforcement, context management |
| Task decomposer | `.claude/skills/task-decomposer/SKILL.md` | Freeform intent → structured TASK-NNN entries |
| Design agent | `.claude/agents/design-analyst.md` | Read-only codebase exploration; produces implementation plan |
| Review agent | `.claude/agents/code-reviewer.md` | 7-lens PR review; thin wrapper → pr-reviewer skill |
| Security agent | `.claude/agents/security-analyst.md` | OWASP audit; thin wrapper → security-auditor skill |
| Migration agent | `.claude/agents/migration-analyst.md` | Migration safety check (conditional — schema changes only) |
| Performance agent | `.claude/agents/performance-analyst.md` | Perf gate (conditional — hot-path changes only) |
| Init analyst | `.claude/agents/init-analyst.md` | INIT mode: full codebase discovery → ADR |
| Scope analyst | `.claude/agents/scope-analyst.md` | Blast-radius map for task-decomposer |
| Session bootstrap | `.claude/scripts/session-start.js` | Validates settings, CLAUDE.md size, skill staleness, doc line counts |
| Read guard | `.claude/scripts/read-guard.js` | PreToolUse hook: enforces Thin-Coordinator Rule |
| Change tracker | `.claude/scripts/track-change.js` | PostToolUse hook: file change counter for scope guard |
| CI poller | `.claude/scripts/ci-status.js` | PostToolUse hook: polls CI after git push |
| Scaffold CLI | `bin/dev-flow-init.js` | One-command scaffold bootstrap for adopter repos |
| Skill manifest | `.claude/skills/MANIFEST.json` | Phase → skill binding registry |

## Key Patterns

**Gate-driven pipeline**: 3 human gates (Gate 0 = scope, Gate 1 = design, Gate 2 = review+security)
block all Tier 3 operations. No background agent spawns without a confirmed gate.

**Thin Coordinator Rule**: Orchestrator receives summaries from agents, not raw file content.
Enforced by `read-guard.js` PreToolUse hook.

**Mode-modal dispatch**: `/dev-flow` selects a workflow path (init / full / quick / hotfix / review /
resume) at session start. Each mode activates a different phase subset.

**Hard stops**: 24 non-negotiable pipeline blocks. Defined in
`.claude/skills/dev-flow/references/hard-stops.md`. Violation = session halt.

**Skill-as-spec**: Each SKILL.md is both specification and prompt template. Skills are loaded by
name at the phase they're bound to in MANIFEST.json.

## Integration Points

| Dependency | Type | Purpose |
|:-----------|:-----|:--------|
| Claude Code CLI | Runtime | Session host — skills, agents, hooks all run inside a Claude Code session |
| Node.js ≥ 18 | Runtime | Harness scripts (`session-start.js`, `track-change.js`, etc.) |
| Python 3.10+ | Runtime | Eval harness (`evals/measure.py`) — stdlib only (ADR-001) |
| Git | CLI | `ci-status.js` polls git state; `track-change.js` counts changed files |

## Security Boundaries

- No network access by default — harness scripts are pure Node/Python, no HTTP calls
- `read-guard.js` blocks direct file reads in agent context (Thin Coordinator Rule)
- `isHookCommandSafe()` in `bin/dev-flow-init.js` validates hook command allowlist before
  writing `settings.json` to adopter repos (ADR-002)
- Path traversal guard in scaffold CLI: resolved paths must stay within target directory
- `.claude/settings.local.json` is gitignored — machine-specific allowlist never committed

## Reference Files

- Workflow phases: `.claude/skills/dev-flow/references/phases.md`
- Hard stops: `.claude/skills/dev-flow/references/hard-stops.md`
- Mode specs: `.claude/skills/dev-flow/references/mode-*.md`
- Skill binding: `.claude/skills/MANIFEST.json`
- Canonical spec: `docs/blueprint/01-10` (authoritative source for all phase/gate/agent definitions)
