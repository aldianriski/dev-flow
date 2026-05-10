---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: User-workflow change · new entry-point added · lifecycle reshape
status: current
---

# How You Use dev-flow — User Workflow

Helicopter view from the **adopter's** perspective. What you actually type and what happens behind the scenes.

A Claude Code plugin that turns ad-hoc AI coding into a **gated workflow**. You give it intent ("add OAuth"), it converts to tasks, executes them with checkpoints, and ships. Humans approve gates; the plugin orchestrates the rest.

## Mental model — three layers

```
LAYER 3 — Daily experience (what you type)
  /orchestrator   /task-decomposer   /prime   /diagnose   ...
              ↓ calls
LAYER 2 — Gates + modes (the structure)
  G1 Scope    G2 Design
  init  /  quick  /  mvp  /  sprint-bulk
              ↓ uses
LAYER 1 — Specialists + hooks (background)
  orchestrator → design-analyst / scope-analyst / code-reviewer / ...
  SessionStart hook · PostToolUse codemap-refresh hook
```

## Top-level entry points (what you actually type)

| Slash command | When to use | Frequency |
|:--------------|:------------|:----------|
| `/orchestrator init` | First-time scaffold in a new project | once per project |
| `/prime` | Start of every session | daily |
| `/task-decomposer "<intent>"` | New feature/bug/idea, no task yet | per feature |
| `/orchestrator sprint-bulk` | Sprint is planned, time to execute | per sprint |
| `/lean-doc-generator` | Sprint promote / close · doc updates | 2× per sprint |
| `/diagnose` | Debug a defect or failing test | as needed |
| `/refactor-advisor` | Code feels harder to change | occasional |
| `/release-patch` | PATCH bump (auto-detects manifest) | per ship |
| `/security-review` | Separate session for OWASP audit | per release |

Other skills (`/zoom-out`, `/tdd`, `/pr-reviewer`, `/codemap-refresh`, `/release-manager`, `/adr-writer`, `/write-a-skill`) fire **automatically** at the right moment — you mostly don't type them.

## End-to-end lifecycle (one feature, start to ship)

```
DAY 0 — adopt the plugin (one-time)
  $ claude plugin marketplace add https://github.com/aldianriski/dev-flow
  $ /orchestrator init           # scaffolds CLAUDE.md · CONTEXT.md · TODO.md · docs/

DAY 1 — start a feature
  > /prime                       # loads CLAUDE.md → CONTEXT.md → TODO.md → codemap
  > /task-decomposer "add Google OAuth login"
    [batched ≤5 Qs · scope · risk · acceptance · handoff]
  > approve                      # writes TASK-NNN to TODO.md Backlog + emits Flow Grill Seed

DAY 1 — promote to sprint
  > /lean-doc-generator sprint promote
    [Flow Grill loop hydrates seed · iterates Q&A until ledger converges · review summary]
  > lock                         # writes docs/sprint/SPRINT-NNN-*.md
  $ git commit                   # plan-locked commit

DAY 1-N — execute the sprint
  > /orchestrator sprint-bulk
    [reads locked ledger · per-task: implement → propose code-reviewer y/n → commit → next]

DAY N — close the sprint
  > /lean-doc-generator sprint close
  > /release-patch               # auto-detects PATCH bump · OR manual /release-manager for MINOR/MAJOR
```

## What "good behavior" looks like

- **You only type ~5 commands per feature.** Everything else is AI-driven inside those commands.
- **Gates pause for you to read, not type long answers.** Most prompts accept short keywords (`approve` / `lock` / `y` / `n` / `friction` / `block`).
- **Mistakes are reversible.** Sprint plans are commit-frozen; mid-sprint pivots go to "Surprise Log", not to plan edits.
- **The plugin doesn't write app code on its own** — every code change runs through implement → review → commit with human checkpoints.

## Where each component fits in your day

| Moment | Component fires | Your action |
|:-------|:----------------|:------------|
| Open editor | SessionStart hook | none — auto |
| `/prime` | prime skill | reads → AI summarizes state |
| Pick a feature | task-decomposer | answer ≤5 batched Qs |
| Promote sprint | lean-doc Sprint Promote (Flow Grill) | answer ≤5 batched Qs · type `lock` |
| Each task in sprint | orchestrator sprint-bulk + dispatcher role | type `y`/`n` for code-reviewer |
| Hit friction | Mid-Sprint Friction Protocol | type `friction` / `defer <reason>` / `block` |
| Bug found | diagnose | answer reproduce/hypothesize Qs |
| Architecture worry | `design-analyst --grill` | answer grill Qs |
| Each git commit | codemap-refresh hook | none — auto |
| Sprint done | release-patch (auto) OR release-manager (manual) | confirm version bump |

## See also

- [`README.md`](../README.md) — install + components count + roadmap
- [`docs/USER-OUTCOMES.md`](USER-OUTCOMES.md) — outcome registry (every component → user-project outcome)
- [`.claude/CONTEXT.md`](../.claude/CONTEXT.md) — vocabulary · gates · modes · agent roster
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — component map · key patterns
