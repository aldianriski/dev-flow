---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04 (Sprint 046 T2 — EPIC-Audit Phase 5 refresh)
update_trigger: Patterns, conventions, or current focus change; new skill or mode added
status: current
---

# AI Context — dev-flow

MAX 100 LINES. Every line must be unique signal. For workflow vocabulary + gates + modes + agent roster, defer to `.claude/CONTEXT.md` (do not duplicate here).

## Context Abstract

system: Gate-driven workflow scaffold loaded as Claude Code plugin
phase: EPIC-Audit Phase 5 active (Sprint 046 — stale doc refresh); Phase 6 next (Sprint 047 archive + close)
stack: Markdown · SKILL.md format · Node.js ≥18 · PowerShell ≥5.1 · Claude Code CLI · gh CLI
load_next: ARCHITECTURE.md if touching workflow phases, agent dispatch, or harness hooks; .claude/CONTEXT.md for workflow vocab/principles/gates/modes

## Context Load Order

```
L0 → README.md          (≤50 lines)  — what this is, plugin install
L1 → AI_CONTEXT.md      (this file)  — patterns, conventions, current focus
L1 → .claude/CONTEXT.md (≤130 lines) — workflow vocab + principles + gates + modes + agent roster + skill standards + behavioral lineage
L2 → ARCHITECTURE.md    (≤150 lines) — load if: agents, phases, gates, hooks, security
L2 → docs/codemap/CODEMAP.md (3-tier) — load if: navigating module map / hub list / dep graph
L2 → docs/DECISIONS.md (frozen at ADR-001..015) + docs/adr/ADR-NNN-*.md — load if: need WHY behind a decision
L2 → TODO.md            (unlimited)  — load if: active sprint context or backlog
```

## Navigation Guide

| Question type | Start here | Then if needed |
|:--------------|:-----------|:---------------|
| What does dev-flow do? | README.md | AI_CONTEXT.md §Identity |
| Plugin install / adoption | README.md | (gh / claude plugin install URL) |
| Workflow vocab (gate/mode/skill/agent definitions) | `.claude/CONTEXT.md` § Vocabulary | — |
| Which mode runs this? | `.claude/CONTEXT.md` § Modes | ARCHITECTURE.md § Key Patterns |
| Agent dispatch + spawning rules | `.claude/CONTEXT.md` § Agent Roster + § Relationships | ADR-015 |
| Why was this design decision made? | `docs/adr/ADR-NNN-*.md` (≥016) or `docs/DECISIONS.md` (≤015) | — |
| What's in the current sprint? | TODO.md § Active Sprint | docs/sprint/SPRINT-NNN-*.md |
| What must I NOT do in this codebase? | AI_CONTEXT.md § Do Not | docs/adr/ |
| Why was this rejected? | `.out-of-scope/<slug>.md` | sourcing ADR cross-link |
| Module map / hub list / dep graph | docs/codemap/CODEMAP.md | docs/codemap/handoff.json (L2 envelope) |

## Identity

system: Claude Code plugin + workflow scaffold
type: meta-repo (skill library — no app code, no runtime server)
language: Markdown (specs/skills/agents), Node.js ≥18 (Node-safe harness scripts), PowerShell ≥5.1 (Windows-only hooks per ADR-016)

## Structure

```
skills/             17 user-invocable skills (full list → docs/codemap/CODEMAP.md § L0-overflow)
agents/             7 (1 dispatcher + 6 specialists: design / code-reviewer / scope / security / performance / migration)
hooks/hooks.json    SessionStart PS + PreToolUse Bash(git add*) Node chain-guard + PostToolUse Bash(git commit*) codemap-refresh PS
scripts/            audit-baseline.js + eval-skills.js (Node) + session-start.ps1 + codemap-refresh.ps1 + __tests__/
.claude-plugin/     plugin.json + marketplace.json (lockstep per ADR-006)
.claude/            CLAUDE.md + CONTEXT.md + settings{,.local{,.example}}.json
docs/               adr/ ≥016 + DECISIONS.md frozen ≤015 + codemap/ + research/ + sprint/ + ARCHITECTURE.md + AI_CONTEXT.md + CHANGELOG.md
.out-of-scope/      Negative-space pointer files per Sprint 043 ADR-022
bin/dev-flow-init.js + templates/  Adopter scaffold (8 doc templates; built-ins only per ADR-002)
```

## Patterns

Gate model — 2 human gates (G1 Scope · G2 Design); each mode declares which fire. Detail: `.claude/CONTEXT.md` § Gates.
Mode dispatch — 4 modes (init / quick / mvp / sprint-bulk) per ADR-012. Detail: `.claude/CONTEXT.md` § Modes.
One-way dispatch — only `dispatcher` agent spawns specialists; depth ≤2 per ADR-015. Detail: `.claude/CONTEXT.md` § Relationships.
Skill auto-discovery — Claude Code plugin loader scans `skills/` + `agents/` + `hooks/` at repo root; no MANIFEST.json (ADR-010).
Behavioral lineage — 4 principles in `.claude/CLAUDE.md` derive from karpathy-skills MIT (ADR-019); adaptation table in `.claude/CONTEXT.md` § Behavioral Guidelines Lineage.
Sprint shape — decision-only sprints valid (Sprints 040-044 pure-research; Sprint 045 mixed); decision-vs-implementation split per Sprint 041 DEC-4.

## Conventions

naming — kebab-case files; SCREAMING_CASE doc files (CLAUDE.md / CONTEXT.md / ARCHITECTURE.md / etc)
external-ref fetches — gh CLI primary (drop leading slash on Git Bash per Sprint 040 retro); SHA pin mandatory; WebFetch fallback only
Windows hook scripts — PowerShell only per ADR-016; quote `${CLAUDE_PLUGIN_ROOT}` (home-with-space breaks unquoted)
ADR allocation — sequential, grep both surfaces before allocate; ≥016 → `docs/adr/ADR-NNN-<slug>.md`; ≤015 frozen in `docs/DECISIONS.md`
sprint file — `docs/sprint/SPRINT-NNN-<slug>.md`; status planning → active → closed; plan_commit + close_commit fields
research file — `docs/research/<topic>-<YYYY-MM-DD>.md`; date-sanity gated by lean-doc-generator Step 0b WARN+CONFIRM (Sprint 045 T4); never silent rewrite

## Do Not

- Do not add npm deps to bin/ — built-ins only (ADR-002)
- Do not write Node hook scripts — PowerShell only on Windows per ADR-016 (loader:1368 path-with-space failure)
- Do not explain HOW in docs/ files — belongs in code comments (LEAN DOCUMENTATION STANDARD per `skills/lean-doc-generator/references/DOCS_Guide.md`)
- Do not change gate count, mode count, or agent roster without updating `.claude/CONTEXT.md` AND ADR
- Do not invoke `git push` from skill files — `release-patch` HARD STOP at push (reviewer can grep skill files for zero command-position invocations)
- Do not chain `git add && git commit` — PreToolUse chain-guard hook blocks; split into separate Bash calls so lint/typecheck hooks fire
- Do not edit closed sprint docs — historical record; surface drift via new sprint
- Do not append to `docs/DECISIONS.md` — frozen at ADR-015; new ADRs go to `docs/adr/ADR-NNN-*.md` (Sprint 043 DEC-7)
- Do not silently skill-edit — skill behavior changes require eval evidence per ADR-021 DEC-4 (TASK-116 acceptance harness queue)

## Current Focus

done: Sprint 045 — Phase 4f (skill-creator ADR-024) + TASK-104/117/118 closed; EPIC-Audit Phase 4 deep-dive (4a-4f) COMPLETE
active: Sprint 046 — Phase 5 stale doc refresh (this file + ARCHITECTURE.md)
next: Sprint 047 — Phase 6 archive ext-refs + close EPIC-Audit → v1 ship prep
