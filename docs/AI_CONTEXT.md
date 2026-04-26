---
owner: Tech Lead
last_updated: 2026-04-26
update_trigger: Patterns, conventions, or current focus change; new skill or mode added
status: current
---

# AI Context — dev-flow
# MAX 100 LINES. Every line must be unique signal.

## Context Abstract
system: Gate-driven AI workflow scaffold — drop-in for any repo using Claude Code
phase: pre-release (v0.1.0, Sprint 18 active — EPIC-A plugin distribution)
stack: Markdown · SKILL.md format · Node.js ≥18 · Python 3.10+ · Claude Code CLI
load_next: ARCHITECTURE.md if touching workflow phases, agent dispatch, or harness hooks

## Context Load Order
# L0 → README.md          (≤50 lines)  — what this is, how to adopt
# L1 → AI_CONTEXT.md     (this file)  — patterns, conventions, current focus, routing
# L2 → ARCHITECTURE.md   (≤150 lines) — load if: agents, phases, gates, hooks, security
# L2 → DECISIONS.md      (unlimited)  — load if: need WHY behind a pattern or tool choice
# L2 → SETUP.md          (≤100 lines) — load if: environment setup or harness commands
# L2 → TODO.md           (unlimited)  — load if: active sprint context or backlog
# L3 → docs/blueprint/*              — load only if modifying the canonical spec itself

## Navigation Guide
| Question type                               | Start here             | Then if needed       |
|:--------------------------------------------|:-----------------------|:---------------------|
| What does dev-flow do?                      | README.md              | AI_CONTEXT.md §Identity |
| How do I adopt it into my project?          | README.md              | SETUP.md             |
| Which phase/mode runs this?                 | AI_CONTEXT.md §Patterns | ARCHITECTURE.md     |
| Why was this design decision made?          | DECISIONS.md           | —                    |
| How do agents connect to the orchestrator?  | ARCHITECTURE.md        | docs/blueprint/04    |
| What's in the current sprint?               | TODO.md                | —                    |
| What must I NOT do in this codebase?        | AI_CONTEXT.md §Do Not  | DECISIONS.md         |
| How do I run the harness scripts?           | SETUP.md               | —                    |

## Doc Scope Map
README.md:          adoption guide, what it is, quick-start commands — nothing else
AI_CONTEXT.md:      patterns, conventions, do-nots, current focus — not HOW
ARCHITECTURE.md:    component map, agent tiers, key patterns, security boundaries
DECISIONS.md:       ADR entries — context + decision + rationale + consequences
SETUP.md:           prerequisites, harness commands, common issues
TODO.md:            active sprint tasks, backlog, sprint changelog — session-scoped
docs/CHANGELOG.md:      permanent sprint history — append-only, load only for audits
docs/TEST_SCENARIOS.md: test coverage map, gap analysis, completion roadmap — load for test planning
docs/blueprint/*:       canonical spec — authoritative for all skill/phase/gate definitions

## Identity
system: Claude Code skill library + workflow scaffold
type: library (scaffold — no runtime server)
language: Markdown (spec), Node.js ≥18 (harness scripts), Python 3.10+ (eval harness)

## Structure
.claude/skills/    10 SKILL.md files — orchestrator + specialist + universal skills
.claude/agents/    7 agent definitions — design, review, security, migration, perf, init, scope
.claude/scripts/   Harness scripts — session bootstrap, read-guard, change tracker, CI poller
docs/blueprint/    Canonical system spec (01–10) — authoritative, version-controlled
bin/               Scaffold CLI (dev-flow-init.js) — adopter entry point
bin/__tests__/     CLI unit tests — Node built-in test runner, no external framework
evals/             Skill eval harness — Python, three-arm methodology (ADR-001)
templates/         CLAUDE.md.template + TODO.md.template + 6 other doc templates

## Patterns
Gate model:        3 human gates block all Tier 3 ops — see ARCHITECTURE.md §Key Patterns
Thin Coordinator:  Orchestrator gets summaries only; read-guard.js enforces at PreToolUse
Skill-as-spec:     SKILL.md = spec + prompt; bound to phases via MANIFEST.json
Hard stops:        24 non-negotiable blocks — .claude/skills/dev-flow/references/hard-stops.md
Mode dispatch:     init / full / quick / hotfix / review / resume — each is a phase subset

## Conventions
naming:        kebab-case for all files; SCREAMING_CASE for doc files (SKILL.md, CLAUDE.md)
scripts:       Node scripts use CommonJS ('use strict'), no external deps, Windows-safe paths
skill change:  RED-GREEN-REFACTOR eval required before merging (blueprint/05 §Skill Change Protocol)
canonical:     Always edit canonical source — never edit auto-synced copies (blueprint/05 §Governance)

## Do Not
- Do not add npm deps to bin/ — built-ins only (ADR-002)
- Do not add external deps to .claude/scripts/ — stdlib only
- Do not explain HOW in any docs/ file — belongs in code comments (LEAN DOCUMENTATION STANDARD)
- Do not change gate count or hard-stop count without a blueprint MAJOR version bump
- Do not edit evals/ without updating ADR-001 rationale

## Current Focus
done: Sprint 17 — blueprint decomp, archive cleanup, BUG-003/BUG-004 fixed
active: Sprint 18 — EPIC-A plugin-first distribution (TASK-065, 066, 068 pending)
next: EPIC-B..E after EPIC-A ships
