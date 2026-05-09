---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR version bump; change to Thin-Coordinator Rule or phase model
status: current
source: AI_WORKFLOW_BLUEPRINT.md §1 (split TASK-004)
---

# Blueprint §1 — Philosophy

## Why This System Exists

AI-assisted development creates a failure mode that linters can't catch:
**correct syntax, wrong architecture**. Code compiles, tests pass, but the structure
slowly degrades because no one reviewed the design before implementation.

This workflow solves that with three human gates:
- **Gate 0**: Confirm scope before spending context budget on Design
- **Gate 1**: Approve the design before writing code
- **Gate 2**: Approve the combined review + security findings before committing

Everything between the gates is automated.

## Six Core Principles

1. **Skills are git-tracked** — all skills live in `.claude/skills/` inside the repo.
   Every team member gets them on `git pull`. No per-machine installation.

2. **Orchestrator stays thin** — the main agent (orchestrator) delegates heavy work
   to subagents that return summaries, not raw file contents.
   This keeps the main context window from filling up.

3. **Hard stops are non-negotiable** — typecheck fail, lint fail, unit test fail,
   and CRITICAL security findings all block the pipeline. No human can override them
   without explicitly bypassing the command.

4. **Context is a finite budget** — every token consumed has a cost. Operations are
   tiered by context cost; expensive operations (background agent spawning, large
   codebase reads) must be justified by a gate confirmation before they run.
   The goal is maximum signal per token, not maximum thoroughness.

5. **Evidence over claims** — the orchestrator never declares success without verified
   proof. Run fresh commands, read full output, check exit codes. "It should work" is
   not evidence. "The command returned exit 0 and output matches expected" is evidence.
   If a fix fails three times, stop and question the architecture — do not keep patching.

6. **Systematic over ad-hoc** — process beats intuition. If there is any chance a skill
   applies, it must be invoked — skills exist precisely to prevent shortcuts. User
   instructions override skills; skills override default AI behavior.

## Three Execution Primitives

| Primitive | Location | When to Use |
|:---------|:---------|:------------|
| **Inline Skill** | `.claude/skills/<name>/SKILL.md` | Write phases — user sees real-time progress |
| **Forked Skill** (`context: fork`) | `.claude/skills/<name>/SKILL.md` | Analysis — user invokes directly, isolated context |
| **Subagent** | `.claude/agents/<name>.md` | Heavy read phases — orchestrator delegates, own context window |

**Inline skills** run in the orchestrator's context window. Best for: `dev-flow`, `fe-component-builder`, `lean-doc-generator`.

**Forked skills** (`context: fork` + `agent:` in frontmatter) run isolated. Summary returns to main. Best for: `pr-reviewer`, `security-auditor`, `refactor-advisor` when user invokes them directly.

**Subagents** have a persistent system prompt (the markdown body of the `.md` file) and tool restrictions. Spawned via the Agent tool. Best for: Design, Review, Security phases where the orchestrator needs a specialist with no context bleed. Subagents cannot spawn other subagents.

**Skill preloading in subagents (`skills:` frontmatter field):**
Subagents that share knowledge with a user-facing skill (e.g. `code-reviewer` + `pr-reviewer`)
should use `skills: <name>` to preload the skill's full content into the subagent's context.
The skill becomes the single source of truth — the subagent body adds only the orchestrator-specific
role, output format, and workflow context. This eliminates content drift between the two paths.

## The Orchestrator Thin-Coordinator Rule

Principle #2 ("Orchestrator stays thin") is made concrete here. Every `Read`/`Grep`/`Glob` call from the main orchestrator context is **permanent in conversation history**. Cumulative source-file reads during Implement and Docs are the documented cause of auto-compact firing before Session Close.

**Binding rule**: the orchestrator never Reads source files. Source-file I/O belongs inside subagents, where the context dies on return.

**Per-phase I/O budget** (phase numbers match §3 canonical 0–10 contract):

| Phase | Orchestrator may Read | Source I/O happens in |
|:---|:---|:---|
| **0 Parse** | `TODO.md` only | — |
| **1 Clarify** | (nothing) | — |
| **2 Design** | (nothing) | `design-analyst` subagent |
| **3 Implement** | (nothing — even for "just one file") | implementer subagent per micro-task |
| **4 Validate** | exit codes + ≤40-line tail of command output | — |
| **5 Test** | (nothing) | test-writer subagent |
| **6/7 Review + Security** | (nothing) | `code-reviewer` + `security-analyst` (parallel) |
| **8 Docs** | (nothing — even for ADRs) | `lean-doc-generator` or `docs-writer` subagent |
| **10 Session Close** | `git diff --shortstat` only | — |

**Violation protocol**: if the orchestrator is tempted to `Read` "just to check one thing" during Phases 3, 5, 6, 7, or 8 — STOP. Dispatch the phase's subagent instead, even for a one-file question. Each stray `Read` in these phases is a direct cause of the compact failure mode.

**Mechanical enforcement** (optional, see §6): a PreToolUse hook may block `Read` tool calls in the orchestrator context when `STATE.phase ∈ {implement, test, review, security, docs}`. Self-policed stops have historically not fired; prefer a hook.
