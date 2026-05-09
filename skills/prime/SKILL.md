---
name: prime
description: Use when starting a new session and want to load project context in a deterministic order — CLAUDE.md, CONTEXT.md, MEMORY.md, active sprint plan, CODEMAP.md L0. Emits a health check showing which files were found versus missing. Required reads (CLAUDE.md + CONTEXT.md) cause the skill to fail if absent; optional reads (MEMORY.md, CODEMAP.md) degrade gracefully. Do not use for general orientation in the middle of a session — that is /zoom-out.
argument-hint: ""
allowed-tools: Read, Bash, Grep
user-invocable: true
context: fork
type: rigid
version: "1.1.0"
last-validated: "2026-05-08"
---

# prime

Ordered context loader + health check. One-shot session priming.

## When to invoke

- First action of a fresh Claude Code session before any code-touching work.
- After `/clear` to reload context without restarting the session.
- When the session feels stale and you want to confirm what state the assistant is operating against.

Not a substitute for `/zoom-out` (mid-session orientation) or `/orchestrator` (task execution).

## Read order

| # | Path | Required? | Purpose |
|---|---|---|---|
| 1 | `.claude/CLAUDE.md` | YES | Project instructions, anti-patterns, line caps, commands |
| 2 | `.claude/CONTEXT.md` | YES | Shared vocabulary, gates, modes, agent roster |
| 3 | MEMORY.md (resolved per harness) | NO | User-level memory index — sprint state, feedback, references |
| 4 | Active sprint plan (`docs/sprint/SPRINT-NNN-*.md`) | NO | Frontmatter + § Active Sprint section ONLY (~50 lines via Read `limit: 50` OR Grep section) — NOT the full file |
| 5 | `docs/codemap/CODEMAP.md` `## L0-overflow` block | NO | Module one-liner overview (TASK-098 output) |

**Resolution rules**:
- Active sprint number from `TODO.md` frontmatter `sprint:` field. Resolve glob `docs/sprint/SPRINT-0<N>-*.md` (allow leading zeros). If `sprint: none` or unresolved, skip Read 4 and warn.
- MEMORY.md path is harness-defined — not under repo root. If unreadable in current sandbox, skip and warn.

## Steps

1. Read each path in order. Track `[OK]` / `[MISSING]` per item. For sprint plan use partial read (frontmatter + § Active Sprint only). For unchanged-since-last-session files, emit `[cache hit]` instead of re-reading (SHA1 lookup per Sprint 045 lean-doc Step 0a).
2. If either CLAUDE.md or CONTEXT.md is `[MISSING]`, abort with FAIL — these are required.
3. Parse `TODO.md` frontmatter → resolve active sprint number; count `Backlog` open tasks too.
4. Count incomplete tasks (`- [ ]` lines under `## Active Sprint` heading).
5. Emit health report.
6. Emit `Next:` line based on detection: active sprint + open tasks → `/orchestrator`; active sprint + zero open → `/lean-doc-generator` Sprint Close; no sprint + backlog has tasks → `/lean-doc-generator` Sprint Promote; no sprint + empty backlog → `/task-decomposer` or `/zoom-out`.

## Output format

```
=== PRIME HEALTH ===
[OK]         .claude/CLAUDE.md
[cache hit]  .claude/CONTEXT.md
[OK]         MEMORY.md
[OK]         docs/sprint/SPRINT-039-codemap-modes-skills.md (partial)
[OK]         docs/codemap/CODEMAP.md (L0-overflow)
Sprint:      039 (Codemap + Modes + Skills)
Tasks:       3 open / 4 total
Status:      ready
Next:        run /orchestrator to continue Sprint 039 (3 open tasks)
====================
```

`[cache hit]` marker = file SHA1 unchanged since last session, skipped re-read. `(partial)` marker on sprint plan = frontmatter + § Active Sprint only. If any optional file is missing, replace `[OK]` with `[MISSING]` and continue. If a required file is missing, replace `Status: ready` with `Status: FAIL — <file> missing` and exit non-zero (skill abort). Pick ONE `Next:` line per detection branch (Step 6).

## Constraints

- Read-only. The skill never writes files.
- Reading CODEMAP.md `## L0-overflow` is sufficient — do not read the full file.
- TODO.md task count is sprint-scoped (Active Sprint section only), not Backlog.
- Sprint plan path resolved via glob; pad sprint number to 3 digits when matching (e.g. `sprint: 39` → `SPRINT-039-*.md`).

## Red flags

❌ **Reading files outside the 5 declared paths** — adds noise; not the skill's job (use `/zoom-out` for broader orientation).
❌ **Failing on MEMORY.md or CODEMAP.md absence** — both are optional; `[MISSING]` is the correct response.
❌ **Writing context summaries back to disk** — this skill is read-only by contract.
❌ **Running mid-task** — the skill is for session priming, not active task work; mid-task invocation suggests context drift.
❌ **Summarizing file contents inline** — emit health check ONLY; files load into conversation context for downstream skills/agents to consume. Inline narrative duplicates content + wastes tokens.
❌ **Re-reading unchanged files within same session** — use SHA1 cache lookup (`.claude/.lean-doc-cache.json` per Sprint 045 lean-doc Step 0a pattern); emit `[cache hit]` marker for unchanged files.
❌ **Reading full sprint plan** — sprint files run 200-300 lines; only frontmatter + § Active Sprint section (~50 lines) needed for priming. Use Read `limit: 50` OR Grep for the section.

## Reference

- Output of TASK-098 (CODEMAP.md `## L0-overflow`) is the canonical L0 module view; TASK-098 PostToolUse hook keeps it fresh.
- Sprint 039 PRD: `docs/sprint/SPRINT-039-codemap-modes-skills.md` T3 acceptance.

> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).
