---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR/MINOR version bump; new agent added; subagent dispatch contract changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §4 (split TASK-004); TASK-005 fixes applied
---

# Blueprint §4 — Agent Configuration

## Agent Tiers

```
┌─────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (main Claude Code session)                             │
│  - Reads TODO.md, manages gates, coordinates agents                  │
│  - Stays thin: receives summaries, not raw files                     │
│  - Runs inline execution for implementation                          │
│  - Tracks context cost tier before each operation                    │
│  - Clears context at each gate; states what was dropped              │
└──────────────┬──────────────────────────────────────────────────────┘
               │ spawns (always after gate confirmation)
    ┌──────────┼──────────────────────────────────────────┐
    │          │                                          │
    ▼          ▼ (INIT mode only)                        ▼ (conditional)
┌──────────┐ ┌──────────────┐  ┌──────────────────────┐  ┌────────────────────┐
│ DESIGN   │ │ INIT ANALYST │  │ MIGRATION ANALYST    │  │ PERFORMANCE ANALYST│
│ AGENT    │ │ Background   │  │ Background           │  │ Background         │
│ [Tier 3] │ │ [Tier 3]     │  │ [Tier 3]             │  │ [Tier 3]           │
│ Explores │ │ Discovery +  │  │ Runs when migration  │  │ Runs when risk:high│
│ codebase │ │ Architecture │  │ file detected before │  │ + api layer present│
│ Proposes │ │ Gate A+B     │  │ Gate 2               │  │ before Gate 2      │
│ plan     │ │ Returns ADR  │  │ Returns safety report│  │ Returns perf report│
└──────────┘ └──────────────┘  └──────────────────────┘  └────────────────────┘

    ▼ (parallel — after TEST phase)
┌──────────────────────────┐   ┌──────────────────────────┐
│ REVIEW AGENT             │   │ SECURITY AGENT           │
│ Background [Tier 3]      │   │ Background [Tier 3]      │
│ Stage 1: Spec compliance │   │ OWASP Top 10 audit       │
│ Stage 2: Code quality    │   │ Stack-specific risks     │
│ Tiered severity output   │   │ Tiered severity output   │
└────────────┬─────────────┘   └──────────────┬───────────┘
             │                                 │
             └─────────────┬───────────────────┘
                           ▼
                    GATE 2 (aggregated)

    ▼ (Phase 9b — after git push)
┌──────────────────────────┐
│ CI VERIFIER              │
│ Script (ci-status.js)    │
│ Polls GitHub/GitLab CI   │
│ Blocks Session Close     │
│ if pipeline non-green    │
└──────────────────────────┘
```

**Agent file map** (all in `.claude/agents/`):

| File | Mode | Preloads Skill | Role |
|:-----|:-----|:--------------|:-----|
| `design-analyst.md` | full / quick | — | Codebase explorer, implementation planner |
| `init-analyst.md` | init only | `system-design-reviewer` | Discovery + architecture for greenfield |
| `code-reviewer.md` | full / quick / review | `pr-reviewer` | Spec compliance + code quality |
| `security-analyst.md` | full / quick / review | `security-auditor` | Security scan |
| `migration-analyst.md` | full / quick (conditional) | — | Migration safety: up/down parity, concurrency |
| `performance-analyst.md` | full (conditional: risk: high + api) | — | Load, query plan, response time baselines |
| `scope-analyst.md` | invoked by task-decomposer | — | Read-only codebase impact reader |

## Background Agent Prompt Template

When spawning a background agent, always include:

```
You are a [Design/Review/Security] specialist.
Task context: [task title and acceptance criteria]
Changed files: [list]
Your job: [specific analysis task]

IMPORTANT: Use tiered output format below. Do NOT return raw file contents.
```

## Background Agent Output Contract

All background agents must use this tiered severity format. Word limits apply **per tier**, not globally:

```
## [Agent Type] — [TASK-NNN]: [Title]

status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

### CRITICAL (no truncation — show all)
- [issue]: [exact file:line] — [detail and required fix]

### BLOCKING (max 5 items)
- [issue]: [exact file:line] — [detail and required fix]

### NON-BLOCKING (summarized, bullet list)
- [brief note]

### APPROVED PATTERNS (optional)
- [good pattern worth noting]

### RECOMMENDATION
[One clear, actionable next step — max 2 sentences]
```

> **`status` field** (added TASK-005):
> - `DONE` — all findings addressed or none found; Gate 2 may proceed
> - `DONE_WITH_CONCERNS` — non-blocking issues present; human should acknowledge
> - `NEEDS_CONTEXT` — agent could not reach a conclusion without more information
> - `BLOCKED` — CRITICAL or BLOCKING findings present; Gate 2 must not proceed
>
> If a background agent returns raw code or unstructured prose instead of this format,
> the orchestrator must discard the response and re-prompt once. If the second response
> also violates the contract, escalate to the user.

## Subagent Dispatch Specification

### Input payload (YAML passed to the subagent)

```yaml
task:
  id: TASK-NNN
  title: <imperative, ≤60 chars>
  acceptance: [<single sentence each>]
  risk: low | medium | high
scope:
  # phase values (canonical 0–10 from §3):
  phase: parse | clarify | design | implement | validate | test | review | security | docs | close
  micro_task: <id if Implement phase>
context:
  files: [<paths the subagent may/should read>]     # may be empty — subagent is free to discover
  pointers: [<CLAUDE.md#anchor>, <ADR-NNN>]         # anchors, NOT embedded content
  decisions_excerpt: <≤20 lines of prior phase summary if relevant>
budget:
  internal_reads: unlimited                          # subagent's own workspace — costs die on return
  internal_iterations: <N per role, see table>
  return_tokens: <N per role, see table>
  timeout_s: 600                                     # 10 min wall-clock default
expand: null | "<specific question>"                # present only on one-shot re-dispatch (see below)
```

The orchestrator **never** embeds source-file contents in `context`. Pointers only. Files are read by the subagent inside its own context.

### Budget table per subagent archetype

Split into *internal* (subagent's own work — generous, dies on return) and *return* (lands in main context — tight).

| Subagent | Internal Reads | Internal Iterations | Return Tokens | Return Shape |
|:---|:---|:---|:---|:---|
| `design-analyst` | unlimited | 2 | ≤300 | Tiered severity + approach + micro-tasks |
| `implementer` | unlimited (scoped) | 3 | ≤150 | `status` + `files_touched` |
| `test-writer` | unlimited | 2 | ≤120 | `test_file` + assertion + expected red reason |
| `code-reviewer` | unlimited | 1 | ≤250 | Tiered severity (CRITICAL / BLOCKING / NON-BLOCKING) |
| `security-analyst` | unlimited | 1 | ≤250 | Tiered severity + OWASP dimension tags |
| `docs-writer` / `lean-doc-generator` | unlimited | 1 | ≤200 | List of doc updates (kind + summary) |

**Return-token caps are enforced by the subagent**, not by the orchestrator. A subagent that can't fit must truncate (`...`) its lowest tier rather than exceed the cap. CRITICAL findings have no cap — if CRITICAL exceeds budget, spill into a follow-up return.

### Timeout policy

- Default wall-clock timeout: **600 seconds** (10 min).
- On timeout: subagent returns `{ status: "timeout", partial: <what it has> }`. Orchestrator logs + escalates to human; never auto-retry a timed-out subagent without human ack.
- Override in payload `budget.timeout_s` is allowed for known-heavy phases (e.g., `init-analyst` discovery may set 1800).

### One-shot expansion hatch

If the orchestrator judges a subagent return too thin to decide (e.g., `code-reviewer` returned only NON-BLOCKING items for a 400-line diff), it may re-dispatch the **same** subagent **once** with `expand: "<specific question>"`:

```yaml
expand: "Did you verify rate-limit logic at apply.ts:42–58 against CLAUDE.md#rate-limit rule?"
```

**Hard limit**: one expansion per subagent per task. The orchestrator cannot re-dispatch infinitely to pull more context into main — that defeats the thin-coordinator rule. If one expansion is insufficient, escalate to human.

### Non-spawn rule

Subagents cannot spawn other subagents. If a subagent's work reveals the need for another specialist (e.g., `design-analyst` discovers a migration), it must return a recommendation; the orchestrator decides whether to spawn.

## Context Engineering Rules

1. **Summarize, never dump** — background agents return structured summaries, not file contents
2. **Load-on-demand** — only read files relevant to the current phase
3. **Phase isolation** — design context is cleared before review context is loaded; declare this explicitly at each gate
4. **Tiered severity contract** — CRITICAL findings have no word limit; lower tiers are compressed
5. **Hot path only** — CLAUDE.md is always loaded; everything else is phase-specific
6. **Reject noise** — if an agent violates the output contract, discard and re-prompt once
7. **Gate resets context** — after each human gate, stale context from the previous phase is dropped; orchestrator states this aloud
8. **Cost-gate rule** — Tier 3 operations (agent spawn, large codebase read) require a preceding gate confirmation; never run them speculatively
9. **Parallel budget** — Review + Security may run in parallel (two Tier 3 ops) only because Gate 2 waits for both; this is the maximum allowed parallelism for Tier 3
10. **Prune before escalating** — if orchestrator context feels heavy before a new phase, summarize the previous phase output into 3 bullet points before continuing
