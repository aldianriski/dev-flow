# AI Agent Workflow & Skills Integration Blueprint

---
type: portable-guideline
version: 1.7.0
lean-doc-generator-version: ">=1.1.0"
origin: M.Aldian Rizki Project
compatible-with: Any FE or BE repository — greenfield or brownfield
last_updated: 2026-04-20
  1.7.0: |
    Operational-pain fix release. Target: eliminate auto-compact firing at test/security/docs.
    Section 1 — NEW Thin-Coordinator Rule subsection. Per-phase I/O budget table making
    Principle #2 concrete and hook-enforceable. Orchestrator forbidden from Reading source
    files in Phases 4 (Implement), 6 (Test), 7 (Review+Security), 8 (Docs).
    Section 4 — NEW Subagent Dispatch Specification. Input payload YAML schema, internal-vs-return
    budget split (internal generous, return tight with per-archetype token caps), timeout policy
    (600s default), one-shot expansion hatch to prevent rubber-stamping thin summaries.
    Section 5 — NEW Phase-to-Skill Binding Matrix. Single table resolving which skill fires at
    which phase with which mode. Ends the three-table cross-reference.
    Section 5 — NEW Skill Manifest spec (.claude/skills/MANIFEST.json). Declarative registry;
    single source of truth for phase→skill resolution. Consumed by session-start.js and dev-flow.
    Section 6 — Enhanced session-start.js: Check 9 (compaction audit from .claude/.phase +
    MANIFEST.json sanity). NEW .claude/scripts/read-guard.js — PreToolUse hook mechanically
    enforcing the Thin-Coordinator Rule. Settings.json updated with Read|Grep|Glob matcher.
    NO folder restructure. NO phase additions. NO changes to tiered severity contract,
    TDD cycle, three-gate model, or the 22 existing skill directories.
  1.6.0: |
    Added task-decomposer skill (Section 22) — translates freeform input/tickets/PRDs/epics
    into fully-formed TASK-NNN entries with all 6 fields, assumption registry, and risk scoring.
    Added scope-analyst agent — read-only codebase impact reader spawned by task-decomposer.
    Added Path B to dev-flow Parse phase — freeform input auto-invokes task-decomposer.
    task-decomposer absorbs Gate 0 when invoked inline with dev-flow.
    INIT Phase I-4 Sprint 0 now uses task-decomposer --from-architecture (not hardcoded tasks).
    Added 4 new slash commands: /task-decomposer, --prd, --epic, --from-architecture flags.
    Added 7 task-decomposer validation rules (no vague acceptance, no hotfix scope, etc).
    Added ticket URL integration: Linear, Jira, GitHub Issues via API or paste fallback.
skills-standard: Agent Skills (agentskills.io)
changelog:
  1.5.0: |
    Added INIT mode (Section 16) — full greenfield bootstrap with 4 phases and 3 new gates (A/B/C).
    Added Harness Continuous Improvement Protocol (Section 17) — 3 feedback channels + weekly calibration.
    Added Session Resume Protocol (Section 18) — interrupted session recovery with state reconstruction.
    Added Migration Safety Protocol (Section 19) — migration-analyst agent + migration hard stops.
    Added Performance Gate Protocol (Section 20) — performance-analyst agent + baselines.
    Hardened Hotfix Mode (Section 21) — rollback check, post-deploy verify, mandatory incident ADR.
    Added 6 new workflow modes: init, resume, updated hotfix and review entry points.
    Added 2 new supporting scripts: track-change.js, ci-status.js.
    Upgraded session-start.js to v2.0 with 8 checks (was 4).
    Added PostToolUse harness hooks: CI trigger, file change tracker.
    Added 3 new agents: init-analyst, migration-analyst, performance-analyst.
    Added 14 new hard stop conditions (was 13, now 27).
    Added context threshold warning (40 turns) with mandatory prune protocol.
    Added doc line count enforcement (README:50, ARCHITECTURE:150, SETUP:100, AI_CONTEXT:100).
---

> **How to use this file**
> This is a copy-paste-and-adapt blueprint. Every section marked `[CUSTOMIZE]`
> requires project-specific decisions. Everything else is universal.
> Estimated setup time: 2–4 hours for a new repository.

---

## 1. Philosophy

### Why This System Exists

AI-assisted development creates a failure mode that linters can't catch:
**correct syntax, wrong architecture**. Code compiles, tests pass, but the structure
slowly degrades because no one reviewed the design before implementation.

This workflow solves that with three human gates:
- **Gate 0**: Confirm scope before spending context budget on Design
- **Gate 1**: Approve the design before writing code
- **Gate 2**: Approve the combined review + security findings before committing

Everything between the gates is automated.

### Six Core Principles

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

### Three Execution Primitives

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

### The Orchestrator Thin-Coordinator Rule

Principle #2 ("Orchestrator stays thin") is made concrete here. Every `Read`/`Grep`/`Glob` call from the main orchestrator context is **permanent in conversation history**. Cumulative source-file reads during Implement and Docs are the documented cause of auto-compact firing before Session Close.

**Binding rule**: the orchestrator never Reads source files. Source-file I/O belongs inside subagents, where the context dies on return.

**Per-phase I/O budget**:

| Phase | Orchestrator may Read | Source I/O happens in |
|:---|:---|:---|
| 1 Parse | `TODO.md` only | — |
| 2 Clarify | (nothing) | — |
| 3 Design | (nothing) | `design-analyst` subagent |
| 4 Implement | (nothing — even for "just one file") | implementer subagent per micro-task |
| 5 Validate | exit codes + ≤40-line tail of command output | — |
| 6 Test | (nothing) | test-writer subagent |
| 7 Review + Security | (nothing) | `code-reviewer` + `security-analyst` (parallel) |
| 8 Docs | (nothing — even for ADRs) | `lean-doc-generator` or `docs-writer` subagent |
| 9 Close | `git diff --shortstat` only | — |

**Violation protocol**: if the orchestrator is tempted to `Read` "just to check one thing" during Phases 4, 6, 7, or 8 — STOP. Dispatch the phase's subagent instead, even for a one-file question. Each stray `Read` in these phases is a direct cause of the compact failure mode.

**Mechanical enforcement** (optional, see Section 6): a PreToolUse hook may block `Read` tool calls in the orchestrator context when `STATE.phase ∈ {Implement, Test, Review, Security, Docs}`. Self-policed stops have historically not fired; prefer a hook.

**Why this rule didn't exist in v1.6.0 and earlier**: it was implied by Principle #2 but never written as a per-phase table. The implicit form self-polices; the explicit form is checkable and hook-enforceable.

---

## 2. Repository File Structure to Create

```
[repo-root]/
├── .claude/
│   ├── CLAUDE.md                    ← always-loaded AI context (project conventions)
│   ├── settings.json                ← harness hooks (session-start, lint on commit, typecheck on push)
│   ├── settings.local.json          ← tool allow-list (gitignored — per machine)
│   ├── scripts/
│   │   └── session-start.js         ← bootstrap validation (settings.local, CLAUDE.md size, skill staleness)
│   ├── agents/                      ← subagent definitions (specialist workers)
│   │   ├── design-analyst.md        ← Step 2: read-only codebase explorer (standalone)
│   │   ├── code-reviewer.md         ← Step 6: thin wrapper — preloads pr-reviewer skill
│   │   └── security-analyst.md      ← Step 7: thin wrapper — preloads security-auditor skill
│   └── skills/                      ← ALL skills live here (git-tracked, team-shared)
│       ├── dev-flow/
│       │   └── SKILL.md             ← orchestrator slash command
│       ├── adr-writer/
│       │   └── SKILL.md             ← universal
│       ├── refactor-advisor/
│       │   └── SKILL.md             ← universal (context: fork)
│       ├── security-auditor/
│       │   └── SKILL.md             ← customize per stack (context: fork)
│       ├── pr-reviewer/
│       │   └── SKILL.md             ← customize per project architecture (context: fork)
│       ├── system-design-reviewer/
│       │   └── SKILL.md             ← customize per architecture principles (context: fork)
│       ├── lean-doc-generator/
│       │   ├── SKILL.md             ← universal
│       │   └── reference/
│       │       ├── DOCS_Guide.md    ← lean documentation standard (supporting file)
│       │       └── VALIDATED_PATTERNS.md ← doc pattern templates (supporting file)
│       ├── release-manager/
│       │   └── SKILL.md             ← customize per VCS (Bitbucket/GitHub/GitLab)
│       ├── fe-motion-designer/
│       │   └── SKILL.md             ← animations/transitions (stack-specific)
│       └── [stack-specific skills]/
│           └── SKILL.md             ← see Section 5
│
│   NOTE: `/simplify` is a Claude Code bundled skill — no SKILL.md needed.
├── TODO.md                          ← unified tracker: dev-flow tasks + session protocol + sprint log
│                                       (parsed by dev-flow orchestrator AND lean-doc-generator)
├── docs/
│   ├── README.md                    ← navigation hub (50 lines max — lean doc standard)
│   ├── ARCHITECTURE.md              ← WHY the system is structured this way (150 lines max)
│   ├── DECISIONS.md                 ← ADR records (unlimited — one entry per decision)
│   ├── SETUP.md                     ← getting started (100 lines max)
│   ├── AI_CONTEXT.md                ← machine-readable AI assistant context (100 lines max)
│   ├── CHANGELOG.md                 ← permanent sprint history archive (append-only, newest first)
│   └── TEST_SCENARIOS.md            ← test coverage map + gap analysis (Tier 2+)
└── context/
    └── workflow/
        └── AGENTS.md               ← WHY/WHERE for the workflow itself

NOTE: All docs/ files follow the LEAN DOCUMENTATION STANDARD (WHY and WHERE only, never HOW).
      Generated and maintained by `/lean-doc-generator`. See Section 8 for the unified TODO.md format.
```

---

## 3. Workflow Phases

```
Path A (structured input — TASK-NNN exists):
  PARSE → CLARIFY → [GATE 0] → DESIGN → [GATE 1] → IMPLEMENT → VALIDATE → TEST
    → [REVIEW ‖ SECURITY] → [GATE 2] → DOCS → COMMIT+PR → CI VERIFY → SESSION CLOSE

Path B (freeform input — description/instruction/assumption):
  INTENT → [TASK-DECOMPOSER + GATE 0 combined] → PARSE → DESIGN → [GATE 1] → IMPLEMENT
    → VALIDATE → TEST → [REVIEW ‖ SECURITY] → [GATE 2] → DOCS → COMMIT+PR → CI VERIFY → SESSION CLOSE

Path B skips the separate Clarify phase — task-decomposer performs its own Socratic
clarification during decomposition. Gate 0 is absorbed into the task-decomposer approval step.
```

### Phase Breakdown

| Phase | Who Runs It | What Happens | Output | Context Cost |
|:------|:-----------|:-------------|:-------|:------------|
| **0 Parse** | Orchestrator (main) | Read todo.md, extract next task fields | Task context loaded | Tier 1 — cheap |
| **1 Clarify** | Orchestrator | Socratic single-question brainstorming until spec is fully chunked; offer 2-3 approaches with tradeoffs | Confirmed scope + constraints | Tier 1 — cheap |
| **GATE 0** | Human | Confirm scope, approach chosen, constraints, edge cases before Design agent runs | Locked scope + chosen approach | — |
| **2 Design** | Background agent | Explore codebase, propose implementation plan | Structured summary to orchestrator | Tier 3 — expensive |
| **GATE 1** | Human | Review design, approve or redirect | Approved plan | — |
| **3 Implement** | Inline (main) | Write code using skills | Code files created/modified | Tier 2 — medium |
| **4 Validate** | Inline (main) | Run typecheck + lint | Pass or hard stop | Tier 1 — cheap |
| **5 Test** | Inline (main) | TDD cycle: RED → verify failure → GREEN → verify pass → REFACTOR | Pass or hard stop | Tier 2 — medium |
| **6 Review** | Background agent (parallel) | 7-lens PR review | Tiered findings summary | Tier 3 — expensive |
| **7 Security** | Background agent (parallel) | Security audit | Tiered findings summary | Tier 3 — expensive |
| **GATE 2** | Human | Review combined findings (Review + Security), approve or iterate | Approved for commit | — |
| **8 Docs** | Inline skill (`/lean-doc-generator`) | WHY/WHERE docs only — DECISIONS.md ADR, ownership headers on every touched doc | Docs updated | Tier 2 — medium |
| **9 Commit+PR** | Inline (main) | Git commit + PR description | Commit created | Tier 1 — cheap |
| **10 Session Close** | Inline (main) | Extract session summary: docs delivered, ownership headers to verify, recommended next-session updates, corrections to promote | Session close report | Tier 1 — cheap |

> **Note on phases 6 + 7**: Review and Security run in parallel as two background agents spawned simultaneously. Gate 2 waits for both to complete before presenting aggregated findings to the human.
>
> **Note on phase 8**: Docs is driven by `/lean-doc-generator`. The skill enforces the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. If content explains HOW something works, it belongs in code comments, not docs.
>
> **Note on phase 10**: Session Close is mandatory and never skipped — even for `hotfix` mode. It takes less than 2 minutes and prevents doc drift across sessions.

### Context Cost Tiers

| Tier | Cost | Operations |
|:-----|:-----|:-----------|
| **Tier 1 — Cheap** | Low token impact | Text reads, short clarifications, lint/typecheck runs, git commands |
| **Tier 2 — Medium** | Moderate token impact | Inline skill execution, targeted file reads, test runs |
| **Tier 3 — Expensive** | High token impact | Background agent spawning, large codebase exploration, parallel agents |

**Rule**: Tier 3 operations must always be preceded by a human gate. Never spawn a background agent without a confirmed gate approval.

### Workflow Modes

| Mode | Gates | Safety Net | Use When |
|:-----|:------|:-----------|:---------|
| `init` | Gate A + Gate B + Gate C + Gate 1 + Gate 2 | Scope guard: no code before Gate B | Greenfield project — no repo, no architecture yet |
| `full` | Gate 0 + Gate 1 + Gate 2 | — | New features, cross-layer changes |
| `quick` | Gate 0 + Gate 2 | Scope guard (>3 files → force `full`) | Small bugs, single-file changes |
| `hotfix` | No gates | Rollback check + lint warn + incident ADR prompt | Production emergency only |
| `review` | Gate 2 only | Accepts PR number or file list — no TODO.md parse | Review-only pass on existing code or open PR |
| `resume` | Resumes at last incomplete micro-task | Gate re-runs if design plan not found | Interrupted session recovery |

> **`init` mode flow**: `DISCOVERY → ARCHITECTURE → INFRA → SPRINT 0` then hands off to `full` permanently.
> See **Section 16** for full INIT mode specification.
>
> **`quick` mode scope guard**: After Implement, if `git diff --name-only` shows more than 3 files
> changed, the orchestrator must stop and require explicit confirmation or upgrade to `full` mode.
>
> **`hotfix` safety net**: Orchestrator runs rollback readiness check + fast lint on changed files.
> Lint failures are warnings, not hard stops — but MUST be shown before commit. Auto-prompts for
> incident ADR after commit. See **Section 21** for full hardened hotfix specification.
>
> **`review` mode entry**: Invoked as `/dev-flow review [PR-number | file1 file2 ...]`.
> Skips Parse phase entirely. Loads changed files directly into Review + Security agents.
> Gate 2 aggregates findings. Docs phase runs if ADR is needed.
>
> **`resume` mode entry**: Invoked as `/dev-flow resume [TASK-NNN]`.
> Reads last approved design plan, finds first incomplete micro-task `[ ]`, resumes from there.
> If design plan is missing or corrupted → hard stop, re-run Gate 1 before proceeding.

---

## 4. Agent Configuration

### Agent Tiers

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

### Background Agent Prompt Template

When spawning a background agent, always include:

```
You are a [Design/Review/Security] specialist.
Task context: [task title and acceptance criteria]
Changed files: [list]
Your job: [specific analysis task]

IMPORTANT: Use tiered output format below. Do NOT return raw file contents.
```

### Background Agent Output Contract

All background agents must use this tiered severity format. Word limits apply **per tier**, not globally:

```
## [Agent Type] — [TASK-NNN]: [Title]

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

> If a background agent returns raw code or unstructured prose instead of this format,
> the orchestrator must discard the response and re-prompt once. If the second response
> also violates the contract, escalate to the user.

### Subagent Dispatch Specification

v1.6.0 and earlier described the *output* contract but left the *input* contract, *budgets*, and *timeout* unspecified. This section closes that gap.

#### Input payload (YAML passed to the subagent)

```yaml
task:
  id: TASK-NNN
  title: <imperative, ≤60 chars>
  acceptance: [<single sentence each>]
  risk: low | medium | high
scope:
  phase: design | implement | test | review | security | docs
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

#### Budget table per subagent archetype

Split into *internal* (subagent's own work — generous, dies on return) and *return* (lands in main context — tight).

| Subagent | Internal Reads | Internal Iterations | Internal Context7 | Return Tokens | Return Shape |
|:---|:---|:---|:---|:---|:---|
| `design-analyst` | unlimited | 2 | 3 | ≤300 | Tiered severity + approach + micro-tasks |
| `implementer` | unlimited (scoped) | 3 | 2 | ≤150 | `done \| failed` + `files_touched` |
| `test-writer` | unlimited | 2 | 0 | ≤120 | `test_file` + assertion + expected red reason |
| `code-reviewer` | unlimited | 1 | 1 | ≤250 | Tiered severity (CRITICAL / BLOCKING / NON-BLOCKING) |
| `security-analyst` | unlimited | 1 | 2 | ≤250 | Tiered severity + OWASP dimension tags |
| `docs-writer` / `lean-doc-generator` | unlimited | 1 | 0 | ≤200 | List of doc updates (kind + summary) |

**Return-token caps are enforced by the subagent**, not by the orchestrator. A subagent that can't fit must truncate (`...`) its lowest tier rather than exceed the cap. CRITICAL findings have no cap per Principle #4 — if CRITICAL exceeds budget, spill into a follow-up return.

#### Timeout policy

- Default wall-clock timeout: **600 seconds** (10 min).
- On timeout: subagent returns `{ status: "timeout", partial: <what it has> }`. Orchestrator logs + escalates to human; never auto-retry a timed-out subagent without human ack.
- Override in payload `budget.timeout_s` is allowed for known-heavy phases (e.g., `init-analyst` discovery may set 1800).

#### One-shot expansion hatch

If the orchestrator judges a subagent return too thin to decide (e.g., `code-reviewer` returned only NON-BLOCKING items for a 400-line diff), it may re-dispatch the **same** subagent **once** with `expand: "<specific question>"`:

```yaml
expand: "Did you verify rate-limit logic at apply.ts:42–58 against CLAUDE.md#rate-limit rule?"
```

**Hard limit**: one expansion per subagent per task. The orchestrator cannot re-dispatch infinitely to pull more context into main — that defeats the thin-coordinator rule. If one expansion is insufficient, escalate to human.

This hatch prevents rubber-stamping ≤150-token summaries while keeping the compact budget bounded.

#### Non-spawn rule (restated)

Subagents cannot spawn other subagents. If a subagent's work reveals the need for another specialist (e.g., `design-analyst` discovers a migration), it must return a recommendation; the orchestrator decides whether to spawn.

### Context Engineering Rules

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

---

## 5. Skills Map

### Skill Location Standard

Each skill is a **directory** inside `.claude/skills/` with `SKILL.md` as the entrypoint.
Supporting files (reference docs, templates, scripts) live inside the skill directory.

```
.claude/skills/
  skill-name/
    SKILL.md               ← required: instructions + frontmatter
    reference.md           ← optional: detailed reference docs
    examples/              ← optional: example outputs
    scripts/               ← optional: helper scripts
```

**Why directories, not single files**: Skills can bundle supporting files that SKILL.md
references via `${CLAUDE_SKILL_DIR}/reference/...`. This keeps SKILL.md focused (<500 lines)
while giving Claude access to detailed reference material on demand.

### Skill Frontmatter Standard

Every `SKILL.md` must include these frontmatter fields:

```yaml
---
name: skill-name
version: 1.0.0
stack-version: ">=XX.0"       # minimum framework/runtime version this skill is valid for
last-validated: "YYYY-MM-DD"  # date skill was last tested against the stack
context: inline | fork        # execution context
agent: general-purpose        # only if context: fork
---
```

**Staleness rule**: If `last-validated` is older than 6 months, the orchestrator should warn
before running the skill: *"Skill `[name]` was last validated on [date]. Verify it still applies
to your stack version before proceeding."* The human must acknowledge before the skill runs.

### Universal Skills (copy to any project, no customization needed)

| Skill | Directory | Trigger |
|:------|:----------|:--------|
| ADR Writer | `adr-writer/` | Significant technical decision made |
| Refactor Advisor | `refactor-advisor/` | Code quality review needed |
| Lean Doc Generator | `lean-doc-generator/` | Documentation needs creating/updating |
| Release Manager | `release-manager/` | Preparing a release |
| System Design Reviewer | `system-design-reviewer/` | Architecture review |

Note: `lean-doc-generator/` includes `reference/DOCS_Guide.md` and `reference/VALIDATED_PATTERNS.md`
as supporting files referenced via `${CLAUDE_SKILL_DIR}/reference/`.

### Stack-Specific Skills (customize per project)

#### Frontend (React / Vue / Svelte / Angular)

| Skill | Directory | Customize For |
|:------|:----------|:-------------|
| Component Builder | `component-builder/` | Framework (React hooks vs Vue composables vs Svelte stores) |
| Design Engineer | `fe-design-engineer/` | CSS framework (Tailwind vs CSS Modules vs styled-components) |
| Accessibility Auditor | `fe-accessibility-auditor/` | Component library (Headless UI vs Radix vs custom) |
| Test Case Generator | `test-case-generator/` | Test framework (Jest/RTL vs Vitest/vue-test-utils) |
| E2E Scenario Writer | `e2e-scenario-writer/` | E2E tool (Playwright vs Cypress) |
| Security Auditor | `security-auditor/` | Framework-specific risks (XSS vectors, SSR data leakage) |
| PR Reviewer | `pr-reviewer/` | Architecture rules (Clean Architecture rules for this stack) |

#### Backend (Node.js / Python / Go / Java)

| Skill | Directory | Purpose | Customize For |
|:------|:----------|:--------|:-------------|
| API Contract Designer | `api-contract-designer/` | OpenAPI spec design | Domain schemas, auth patterns |
| Service Builder | `service-builder/` | Service/module scaffolding | Framework (Express, FastAPI, Gin, Spring) |
| Test Case Generator | `test-case-generator/` | Unit + integration tests | Framework (Jest, pytest, Go test, JUnit) |
| DB Schema Reviewer | `db-schema-reviewer/` | Database design review | DB engine (PostgreSQL, MySQL, MongoDB) |
| Security Auditor | `security-auditor/` | Security scan | Backend-specific risks (SQLi, SSRF, path traversal) |
| PR Reviewer | `pr-reviewer/` | PR review | Architecture rules (DDD, hexagonal, MVC) |

#### Universal Backend Skills to Add

```markdown
# service-builder/SKILL.md (template)
Scaffold a new service/module following [architecture pattern].
Covers: interface definition, implementation, unit test, DI registration.

# db-schema-reviewer/SKILL.md (template)
Review database schema changes for: normalization, index strategy,
migration safety, N+1 risks, soft-delete patterns.
```

### Phase-to-Skill Binding Matrix

v1.6.0 and earlier required cross-referencing three tables (workflow phases, skills map, skill invocation reference) to answer "which skill runs at which phase?". This matrix binds them declaratively.

**Execution modes**: `inline` (runs in orchestrator context), `fork` (isolated forked skill, returns summary), `subagent` (spawned via Agent tool, see Section 4).

| Phase | Default skill | Execution mode | Alternatives (conditional) | Context tier |
|:---|:---|:---|:---|:---|
| 1 Parse (Path A) | `dev-flow` | inline | — | 1 |
| 1 Parse (Path B — freeform) | `task-decomposer` | inline (spawns `scope-analyst` subagent) | — | 2 |
| 2 Clarify | (orchestrator inline — no skill) | inline | — | 1 |
| 3 Design | `system-design-reviewer` | subagent | `refactor-advisor` (for brownfield refactor tasks) | 3 |
| 3 Design (FE-heavy) | `fe-design-engineer` | subagent | `fe-accessibility-auditor`, `fe-motion-designer` | 3 |
| 3 Design (BE contract) | `api-contract-designer` | subagent | `data-model-designer` | 3 |
| 3 Design (data/pipeline) | `analytics-schema-designer` | subagent | `etl-pipeline-builder`, `pipeline-builder` | 3 |
| 4 Implement (FE) | `fe-component-builder` | inline | `fe-motion-designer` (for motion work) | 2 |
| 4 Implement (BE) | `be-service-scaffolder` | inline | `api-contract-designer` (contract-first) | 2 |
| 4 Implement (DB) | `data-model-designer` | inline | `query-optimizer` (for perf-critical) | 2 |
| 5 Validate | (engine — lint/typecheck/test runners) | programmatic | — | 1 |
| 6 Test (unit/integration) | `test-case-generator` | subagent | — | 2 |
| 6 Test (E2E) | `e2e-scenario-writer` | subagent | — | 2 |
| 7 Review | `pr-reviewer` (via `code-reviewer` agent) | subagent (parallel) | `refactor-advisor`, `system-design-reviewer` | 3 |
| 7 Security | `security-auditor` (via `security-analyst` agent) | subagent (parallel) | — | 3 |
| 7 Migration (conditional) | — | subagent (`migration-analyst`) | — | 3 |
| 7 Performance (conditional) | `query-optimizer` | subagent (`performance-analyst`) | `observability-setup` | 3 |
| 8 Docs | `lean-doc-generator` | inline or fork | `adr-writer` (if ADR needed) | 2 |
| 9 Close | `release-manager` (if releasing) | inline | `incident-postmortem` (hotfix only) | 1 |

**Selection rules**:

1. **Default column first**: orchestrator selects the default skill unless task metadata demands otherwise.
2. **Alternatives require justification**: selecting an alternative requires a one-line reason in `STATE` (e.g., `"design: refactor-advisor chosen because task is pure refactor, no new domain logic"`).
3. **Conditional phases fire only on trigger**: Migration (Section 19), Performance (Section 20) — listed for completeness.
4. **Composition is allowed**: multiple skills in one phase (e.g., `fe-component-builder` + `fe-accessibility-auditor` in Phase 4) run sequentially inline, never in parallel (avoids compact spike).

See `.claude/skills/MANIFEST.json` (new in v1.7.0) for the same binding in machine-readable form — used by session-start and by any future engine.

### Skill Manifest (`.claude/skills/MANIFEST.json`)

**Purpose**: declarative, machine-readable registry of all skills and their phase bindings. Removes the need to infer "which skill at which phase" from the workflow table, skills table, and invocation reference separately.

**Consumed by**:

- `session-start.js` — on boot, loads manifest; warns if a skill referenced by phase is missing, stale, or path-unresolvable.
- `dev-flow` orchestrator — at phase transition, queries manifest for `{phase, stack, layer}` → selects skill deterministically.
- Any future engine or hook needing phase→skill resolution.

**Shape** (simplified):

```json
{
  "version": "1.0",
  "blueprint_version": "1.7.0",
  "skills": [
    {
      "name": "pr-reviewer",
      "phase": 7,
      "phase_name": "Review",
      "mode": "subagent",
      "tier": 3,
      "layer": "review",
      "trigger": "Phase 6 complete; parallel with security",
      "preloaded_by_agent": "code-reviewer"
    }
  ],
  "subagent_wrappers": [
    { "agent": "code-reviewer", "preloaded_skill": "pr-reviewer", "role": "Phase 7 Review" }
  ]
}
```

**Path resolution**: `.claude/skills/<name>/` project-local first; fallback to `~/.claude/skills/<name>/` user-level. Manifest entries never embed SKILL.md content — only metadata. Progressive disclosure (per Claude Skills anatomy) stays intact.

**Single source of truth rule**: if the binding matrix above and MANIFEST.json disagree, MANIFEST.json wins. The binding matrix is a human-readable render of the manifest.

---

## 6. Harness Configuration

### `.claude/settings.json` (git-tracked — applies to all team members)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/scripts/session-start.js",
            "description": "Bootstrap: verify settings.local, CLAUDE.md size, skill staleness, doc line counts, pending migrations, active sprint"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/scripts/ci-status.js",
            "description": "Poll CI status after push — block Session Close if pipeline is non-green"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/scripts/track-change.js \"$CLAUDE_TOOL_INPUT_FILE_PATH\"",
            "description": "Append written file path to .claude/.session-changes.txt for scope guard and context tracking"
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/scripts/track-change.js \"$CLAUDE_TOOL_INPUT_FILE_PATH\"",
            "description": "Append edited file path to .claude/.session-changes.txt for scope guard and context tracking"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read|Grep|Glob",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/scripts/read-guard.js",
            "description": "v1.7.0: Block orchestrator source-file Reads during compact-vulnerable phases (Section 1 Thin-Coordinator Rule)"
          }
        ]
      },
      {
        "matcher": "Bash(git commit*)",
        "hooks": [
          {
            "type": "command",
            "command": "[your-lint-command]",
            "description": "Lint check before commit"
          }
        ]
      },
      {
        "matcher": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "[your-typecheck-command]",
            "description": "Type check before push"
          }
        ]
      }
    ]
  }
}
```

### `.claude/scripts/session-start.js` (git-tracked)

Create this script to run bootstrap checks on every session start. All checks are non-blocking warnings
except where noted. The script writes a structured report to stdout which the harness injects into
the AI context at session start.

```js
// .claude/scripts/session-start.js
// v2.0 — enhanced bootstrap: settings, CLAUDE.md, skills, docs line counts,
//         pending migrations, active sprint validation, context budget signal
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const warnings = [];
const errors   = [];   // blocking — session cannot proceed cleanly
const info     = [];

// ─── Utility ────────────────────────────────────────────────────────────────

function countLines(filePath) {
  return readFileSync(filePath, 'utf8').split('\n').length;
}

function globSkills() {
  // Cross-platform: prefer glob package if available, fall back to PowerShell/find
  try {
    return execSync(
      'powershell -NoProfile -Command "Get-ChildItem -Recurse -Filter SKILL.md .claude/skills | Select-Object -ExpandProperty FullName"',
      { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] }
    ).trim().split('\n').filter(Boolean);
  } catch {
    try {
      return execSync('find .claude/skills -name "SKILL.md"', { encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }
}

// ─── Check 1: settings.local.json ───────────────────────────────────────────

if (!existsSync('.claude/settings.local.json')) {
  errors.push(
    'BLOCK: .claude/settings.local.json not found. ' +
    'Tool permissions are missing. Copy from .claude/settings.local.example.json and customize. ' +
    'Workflow cannot run without an allow-list.'
  );
} else {
  info.push('✓ settings.local.json present');
}

// ─── Check 2: CLAUDE.md line count (always-loaded context budget) ────────────

if (existsSync('.claude/CLAUDE.md')) {
  const lines = countLines('.claude/CLAUDE.md');
  if (lines > 200) {
    warnings.push(
      `WARN: CLAUDE.md is ${lines} lines (hard limit: 200). ` +
      'Trim it — every line above 200 consumes always-loaded context budget in every session.'
    );
  } else {
    info.push(`✓ CLAUDE.md within budget (${lines}/200 lines)`);
  }
}

// ─── Check 3: Skill staleness (last-validated > 6 months) ───────────────────

const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const staleSkills = [];

for (const skillPath of globSkills()) {
  const content = readFileSync(skillPath, 'utf8');
  const match = content.match(/last-validated:\s*"?(\d{4}-\d{2}-\d{2})"?/);
  if (match) {
    const lastValidated = new Date(match[1]);
    if (lastValidated < sixMonthsAgo) {
      staleSkills.push(`  • ${skillPath} — last validated ${match[1]}`);
    }
  } else {
    warnings.push(`WARN: ${skillPath} has no last-validated field — cannot assess staleness.`);
  }
}

if (staleSkills.length > 0) {
  warnings.push(
    `WARN: ${staleSkills.length} skill(s) last validated >6 months ago — review before running:\n` +
    staleSkills.join('\n')
  );
} else {
  info.push('✓ All skills within staleness window');
}

// ─── Check 4: Docs line count limits ────────────────────────────────────────

const DOC_LIMITS = {
  'docs/README.md':       50,
  'docs/ARCHITECTURE.md': 150,
  'docs/SETUP.md':        100,
  'docs/AI_CONTEXT.md':   100,
};

for (const [docPath, limit] of Object.entries(DOC_LIMITS)) {
  if (!existsSync(docPath)) continue;
  const lines = countLines(docPath);
  if (lines > limit) {
    warnings.push(
      `WARN: ${docPath} is ${lines} lines (limit: ${limit}). ` +
      'Exceeds lean-doc limit. Trim before next commit.'
    );
  }
}

// ─── Check 5: Docs ownership header freshness ────────────────────────────────

const sixtyDaysAgo = new Date();
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

const docFiles = [
  'docs/README.md', 'docs/ARCHITECTURE.md', 'docs/DECISIONS.md',
  'docs/SETUP.md', 'docs/AI_CONTEXT.md', 'docs/CHANGELOG.md',
  'docs/TEST_SCENARIOS.md', 'TODO.md',
];

for (const docPath of docFiles) {
  if (!existsSync(docPath)) continue;
  const content = readFileSync(docPath, 'utf8');

  const statusMatch  = content.match(/status:\s*(stale|needs-review|current)/);
  const updatedMatch = content.match(/last_updated:\s*(\d{4}-\d{2}-\d{2})/);

  if (statusMatch?.[1] === 'stale') {
    warnings.push(`WARN: ${docPath} is marked status: stale — do not use as source of truth this session.`);
  } else if (statusMatch?.[1] === 'needs-review') {
    warnings.push(`WARN: ${docPath} is marked status: needs-review — verify before relying on it.`);
  }

  if (updatedMatch) {
    const lastUpdated = new Date(updatedMatch[1]);
    if (lastUpdated < sixtyDaysAgo && statusMatch?.[1] !== 'stale') {
      warnings.push(`WARN: ${docPath} last updated ${updatedMatch[1]} (>60 days) — verify it is still accurate.`);
    }
  } else {
    warnings.push(`WARN: ${docPath} has no ownership header — treat as unverified.`);
  }
}

// ─── Check 6: Pending database migrations ────────────────────────────────────

const migrationDirs = ['migrations', 'src/migrations', 'db/migrations', 'database/migrations'];
for (const dir of migrationDirs) {
  if (!existsSync(dir)) continue;
  try {
    // Check for migrations without a corresponding down file (stack-agnostic heuristic)
    const files = execSync(`ls ${dir}`, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    const upFiles   = files.filter(f => f.includes('up') || (!f.includes('down') && f.endsWith('.sql')));
    const downFiles = files.filter(f => f.includes('down'));
    if (upFiles.length > downFiles.length) {
      warnings.push(
        `WARN: ${dir}/ has ${upFiles.length} up-migration(s) but ${downFiles.length} down-migration(s). ` +
        'Ensure every migration has a verified down path before Gate 2.'
      );
    } else {
      info.push(`✓ Migration parity OK in ${dir}/`);
    }
  } catch { /* directory unreadable — skip */ }
}

// ─── Check 7: Active sprint validation ───────────────────────────────────────

if (existsSync('TODO.md')) {
  const todo = readFileSync('TODO.md', 'utf8');
  const hasActiveTask = /- \[ \] \*\*TASK-/.test(todo);
  const hasActiveSprint = /## Active Sprint/.test(todo);

  if (!hasActiveSprint) {
    warnings.push('WARN: TODO.md has no Active Sprint section — run /lean-doc-generator to initialise.');
  } else if (!hasActiveTask) {
    info.push('ℹ Active Sprint exists but has no open tasks — promote from Backlog or start new sprint.');
  } else {
    // Extract next task for context priming
    const nextTask = todo.match(/- \[ \] \*\*(.+?)\*\*/)?.[1];
    if (nextTask) info.push(`ℹ Next task: ${nextTask}`);
  }
}

// ─── Check 8: Context budget signal (session-changes tracker) ────────────────

const changesFile = '.claude/.session-changes.txt';
if (existsSync(changesFile)) {
  const changes = readFileSync(changesFile, 'utf8').trim().split('\n').filter(Boolean);
  const unique  = [...new Set(changes)];
  if (unique.length > 10) {
    warnings.push(
      `WARN: ${unique.length} files changed this session — context budget is high. ` +
      'Consider pruning previous phase summary before starting next phase.'
    );
  }
  info.push(`ℹ Session changes tracker: ${unique.length} unique file(s) modified`);
}

// ─── Check 9 (new v1.7.0): Compaction audit — vulnerable-phase resume detection ─

// If the last session ended in a phase that's compact-vulnerable (4/6/7/8) and
// the current session inherits that phase, warn hard. Resume into those phases
// should dispatch a subagent, not continue inline with stale main-context Reads.
const phaseFile = '.claude/.phase';
const COMPACT_VULNERABLE_PHASES = ['implement', 'test', 'review', 'security', 'docs'];

if (existsSync(phaseFile)) {
  const phase = readFileSync(phaseFile, 'utf8').trim().toLowerCase();
  if (COMPACT_VULNERABLE_PHASES.includes(phase)) {
    warnings.push(
      `WARN: Resuming into phase '${phase}' which is compact-vulnerable. ` +
      'Per Section 1 Thin-Coordinator Rule, do NOT Read source files in orchestrator. ' +
      'Dispatch the phase subagent instead, even for "just one file".'
    );
  }
  info.push(`ℹ Current workflow phase: ${phase}`);
} else {
  info.push('ℹ No .claude/.phase file — orchestrator is idle or not tracking phase.');
}

// Skill manifest sanity: warn if MANIFEST.json is missing or stale vs blueprint.
const manifestPath = '.claude/skills/MANIFEST.json';
if (existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (manifest.blueprint_version && manifest.blueprint_version !== '1.7.0') {
      warnings.push(
        `WARN: skills/MANIFEST.json references blueprint ${manifest.blueprint_version}, ` +
        'current blueprint is 1.7.0. Regenerate the manifest.'
      );
    } else {
      info.push(`✓ Skill manifest present (${(manifest.skills || []).length} skills registered)`);
    }
  } catch (e) {
    warnings.push(`WARN: ${manifestPath} is not valid JSON — regenerate.`);
  }
} else {
  warnings.push('WARN: .claude/skills/MANIFEST.json missing — phase→skill resolution will fall back to blueprint tables.');
}

// ─── Output ──────────────────────────────────────────────────────────────────

console.log('\n=== SESSION START REPORT ===');

if (info.length > 0) {
  console.log('\n[INFO]');
  info.forEach(i => console.log(i));
}

if (warnings.length > 0) {
  console.log('\n[WARNINGS — non-blocking]');
  warnings.forEach(w => console.log(w));
}

if (errors.length > 0) {
  console.log('\n[ERRORS — resolve before proceeding]');
  errors.forEach(e => console.log(e));
}

console.log('\n============================\n');

// Exit non-zero on blocking errors so the harness can surface them prominently
if (errors.length > 0) process.exit(1);
```

> **New in v2.0**: checks 6 (pending migrations), 7 (active sprint), and 8 (context budget signal)
> are new. The script exits with code 1 on blocking errors (settings.local.json missing) so the
> harness surfaces them as a hard failure at session start, not a soft warning the AI can overlook.
>
> **New in v2.1 (blueprint 1.7.0)**: check 9 (compaction audit) reads `.claude/.phase` to detect
> resume-into-vulnerable-phase conditions and warn hard. Also sanity-checks `.claude/skills/MANIFEST.json`.
>
> **Windows compatibility**: Check 6 uses `ls` which may not be available. Replace with
> `dir /b migrations` via `execSync` or install `glob` package for a cross-platform solution.

### `.claude/scripts/read-guard.js` (git-tracked, new in v1.7.0)

PreToolUse hook that mechanically enforces the Thin-Coordinator Rule (Section 1). Blocks `Read`/`Grep`/`Glob` calls from the orchestrator context when the current phase is compact-vulnerable. Self-policed stops have historically not fired; this moves enforcement to the harness.

```js
// .claude/scripts/read-guard.js
// Blocks orchestrator source-file Reads during compact-vulnerable phases.
// Triggered as PreToolUse on Read/Grep/Glob.
import { existsSync, readFileSync } from 'fs';

const phaseFile = '.claude/.phase';
const COMPACT_VULNERABLE = new Set(['implement', 'test', 'review', 'security', 'docs']);

// Allowlist paths that are always safe for the orchestrator to read
const ORCHESTRATOR_ALLOWLIST = [
  /^TODO\.md$/,
  /^\.claude\/\.phase$/,
  /^\.claude\/\.session-changes\.txt$/,
  /^\.claude\/skills\/MANIFEST\.json$/,
  /^\.claude\/STATE\.ya?ml$/,
  /^CLAUDE\.md$/,
  /^\.claude\/CLAUDE\.md$/,
];

// The hook receives the tool input via env / stdin depending on harness version.
// Assume CLAUDE_TOOL_INPUT_FILE_PATH is set for Read/Grep/Glob targeting a path.
const targetPath = process.env.CLAUDE_TOOL_INPUT_FILE_PATH || '';
const normalized = targetPath.replace(/\\/g, '/');

if (!existsSync(phaseFile)) process.exit(0);   // no phase tracked → allow
const phase = readFileSync(phaseFile, 'utf8').trim().toLowerCase();
if (!COMPACT_VULNERABLE.has(phase)) process.exit(0);

// Allowlist short-circuit
if (ORCHESTRATOR_ALLOWLIST.some(rx => rx.test(normalized))) process.exit(0);

// Block with message surfaced to the orchestrator as hook failure
console.error(
  `BLOCKED: orchestrator attempted to Read '${normalized}' during phase '${phase}'. ` +
  `Per Section 1 Thin-Coordinator Rule, source-file I/O in this phase must happen inside a subagent. ` +
  `Dispatch the phase's subagent (e.g. implementer / test-writer / code-reviewer / security-analyst / docs-writer) ` +
  `with a scoped payload instead. If this read is truly orchestrator-scoped state, add its path to ORCHESTRATOR_ALLOWLIST.`
);
process.exit(1);
```

**Wire-up** (add to `.claude/settings.json` `hooks.PreToolUse`):

```json
{
  "matcher": "Read|Grep|Glob",
  "hooks": [
    {
      "type": "command",
      "command": "node .claude/scripts/read-guard.js",
      "description": "Block orchestrator source-file Reads during compact-vulnerable phases (Section 1)"
    }
  ]
}
```

**Phase tracking contract**: the orchestrator writes the current phase name (lowercase) to `.claude/.phase` on every transition. At Session Close, the file is either deleted or written as `idle`. The `dev-flow` skill is the owner of this file.

### `.claude/scripts/track-change.js` (git-tracked)

Called by PostToolUse Write/Edit hooks. Appends the changed file path to a session tracker used
by the scope guard and context budget signal in `session-start.js`.

```js
// .claude/scripts/track-change.js
// Usage: node track-change.js <file-path>
import { appendFileSync, mkdirSync } from 'fs';

const filePath = process.argv[2];
if (!filePath) process.exit(0);

// Only track source files — ignore .claude/ internals and lock files
const ignored = ['.claude/', 'node_modules/', 'package-lock.json', 'pnpm-lock.yaml', '.git/'];
if (ignored.some(p => filePath.includes(p))) process.exit(0);

try {
  mkdirSync('.claude', { recursive: true });
  appendFileSync('.claude/.session-changes.txt', filePath + '\n', 'utf8');
} catch { /* non-fatal */ }
```

> Add `.claude/.session-changes.txt` to `.gitignore`. It is cleared at the start of each new
> task in the dev-flow Parse phase: `node -e "require('fs').writeFileSync('.claude/.session-changes.txt', '')"`.

### `.claude/scripts/ci-status.js` (git-tracked)

Called by the PostToolUse `Bash(git push*)` hook. Polls CI pipeline status and surfaces the
result to block Session Close if the build is red. Customize `CI_PROVIDER` for your pipeline.

```js
// .claude/scripts/ci-status.js
// Polls CI status after push. Supports GitHub Actions and GitLab CI.
// Requires: gh CLI (GitHub) or glab CLI (GitLab), installed and authenticated.
import { execSync } from 'child_process';

const CI_PROVIDER = process.env.CI_PROVIDER || 'github'; // 'github' | 'gitlab' | 'skip'

if (CI_PROVIDER === 'skip') {
  console.log('CI_PROVIDER=skip — CI status check disabled.');
  process.exit(0);
}

const MAX_POLLS  = 20;  // ~10 min at 30s interval
const POLL_DELAY = 30;  // seconds

function sleep(s) { return new Promise(r => setTimeout(r, s * 1000)); }

async function pollGitHub() {
  for (let i = 0; i < MAX_POLLS; i++) {
    const raw = execSync('gh run list --limit 1 --json status,conclusion,name,url', { encoding: 'utf8' });
    const [run] = JSON.parse(raw);
    if (!run) {
      await sleep(POLL_DELAY); continue;
    }
    if (run.status === 'completed') {
      if (run.conclusion === 'success') {
        console.log(`\n✓ CI PASSED: ${run.name}\n  ${run.url}`);
        return 0;
      }
      console.log(`\n❌ CI FAILED (${run.conclusion}): ${run.name}\n  ${run.url}`);
      console.log('BLOCK: Session Close blocked. Fix CI before proceeding.');
      return 1;
    }
    process.stdout.write(`  CI ${run.status}... (poll ${i + 1}/${MAX_POLLS})\r`);
    await sleep(POLL_DELAY);
  }
  console.log('\nWARN: CI poll timed out. Verify manually before Session Close.');
  return 0;
}

async function pollGitLab() {
  for (let i = 0; i < MAX_POLLS; i++) {
    const raw = execSync('glab ci status --output json', { encoding: 'utf8' });
    const pipeline = JSON.parse(raw);
    if (pipeline.status === 'success') {
      console.log(`\n✓ CI PASSED: ${pipeline.web_url}`); return 0;
    }
    if (['failed', 'canceled'].includes(pipeline.status)) {
      console.log(`\n❌ CI FAILED (${pipeline.status}): ${pipeline.web_url}`);
      console.log('BLOCK: Session Close blocked. Fix CI before proceeding.');
      return 1;
    }
    await sleep(POLL_DELAY);
  }
  console.log('\nWARN: CI poll timed out. Verify manually before Session Close.');
  return 0;
}

(CI_PROVIDER === 'gitlab' ? pollGitLab() : pollGitHub())
  .then(code => process.exit(code))
  .catch(() => {
    console.log('WARN: CI status check failed to run. Verify CI manually before Session Close.');
    process.exit(0); // non-fatal — human must verify
  });
```

**[CUSTOMIZE]** Set `CI_PROVIDER` in your machine environment or shell profile:

| CI System | Value |
|:----------|:------|
| GitHub Actions | `export CI_PROVIDER=github` |
| GitLab CI | `export CI_PROVIDER=gitlab` |
| No CI / local only | `export CI_PROVIDER=skip` |
| Jenkins (custom) | Extend `ci-status.js` with Jenkins REST API call |

**[CUSTOMIZE]** Replace `[your-lint-command]` and `[your-typecheck-command]`:

| Stack | Lint Command | Typecheck Command |
|:------|:------------|:-----------------|
| Nuxt 3 / Vue | `pnpm lint` | `pnpm typecheck` |
| Next.js / React | `npm run lint` | `npm run type-check` |
| NestJS | `npm run lint` | `npm run build --noEmit` |
| Python (FastAPI) | `ruff check .` | `mypy .` |
| Go | `golangci-lint run` | `go build ./...` |
| Java (Spring) | `./mvnw checkstyle:check` | `./mvnw compile` |

### `.claude/settings.local.json` (gitignored — per machine)

```json
{
  "permissions": {
    "allow": [
      "Bash([package-manager] *)",
      "Bash(git add *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git stash *)"
    ]
  }
}
```

**[CUSTOMIZE]** Replace `[package-manager]` with `pnpm`, `npm`, `yarn`, `pip`, `go`, `./mvnw`, etc.

Add `.claude/settings.local.json` to `.gitignore`.

---

## 7. CLAUDE.md Template

This file is always loaded into every AI session. Keep it under 200 lines.

```markdown
# [Project Name] — AI Context

## Project Overview
- **Name**: [Project name]
- **Type**: [Web app / API / Library / Mobile]
- **Stack**: [Framework + Language + Key libraries]
- **Architecture**: [Clean Architecture / MVC / Hexagonal / Layered]

## Dependency Rule [CUSTOMIZE]
```
[Outer Layer] → [Middle Layer] → [Inner Layer] → [External]
```
- [Specific rule 1]
- [Specific rule 2]

## File Structure [CUSTOMIZE]
```
/[source-root]
  /[layer-1]/    # [what goes here]
  /[layer-2]/    # [what goes here]
```

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
```bash
[install-command]
[run-command]
[test-command]
[lint-command]
[build-command]
```

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

---

## 8. Unified TODO.md Format

`TODO.md` at the project root serves two consumers simultaneously:
- **dev-flow orchestrator** — reads task fields (scope, layers, acceptance, tracker, risk) to run the pipeline
- **lean-doc-generator** — reads session protocol, sprint structure, changelog, and quick rules

Both consumers work from the same file. Do not create a separate `todo.md` or `docs/TODO.md`.

### Lean Documentation Philosophy (applies to all docs/ files)

Before writing any documentation, apply the **HOW filter**:

| If it explains… | Action |
|:----------------|:-------|
| HOW something works | Put it in code (comments, types, tests) — not in docs |
| WHY a decision was made | Put it in `docs/DECISIONS.md` |
| WHERE things live | Put it in `docs/ARCHITECTURE.md` or `docs/README.md` |
| Unsure | Put it in code |

**The 4 Laws of Lean Documentation** (enforced by `/lean-doc-generator`):

| Law | Rule |
|:----|:-----|
| **Minimal by Default** | No doc is created unless its absence causes repeated mistakes |
| **Owned, Not Shared** | Every doc has one owner *role* (not person name) — roles persist when people leave |
| **Lifecycle-Bound** | Every doc has a defined `update_trigger` — without it, docs go stale silently |
| **Signal-Dense** | Every line carries unique info not already in code — if the code says it, delete the doc line |

### Unified TODO.md Template

```markdown
# [Project Name] — Development Tracker

---
owner: [role — e.g. "Tech Lead", "Dev Lead"]
last_updated: YYYY-MM-DD
update_trigger: Sprint completed, task added, or task status changed
status: current
---

> **How to use this file**
> - **Start of session** — read this file first. Understand active sprint before touching code.
> - **Run /dev-flow** — the orchestrator parses the first incomplete task [ ] in Active Sprint.
> - **End of session** — run Session Close (Phase 10). Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, add Changelog row (File | Change | ADR), update relevant docs.
> - **Every code change** — if it introduces a new pattern or reverses a decision, update the relevant doc.
> - **Docs to keep in sync**: `docs/README.md` · `docs/ARCHITECTURE.md` · `docs/DECISIONS.md` · `docs/AI_CONTEXT.md`
> - **Changelog rule** — holds ONLY the current in-progress sprint. Once changes are reflected in docs,
>   MOVE the sprint block to `docs/CHANGELOG.md` (prepend — newest first), then DELETE from here.

> **Sprint sizing rules**
> - Group 2–3 tasks minimum per sprint. Never plan a sprint with only 1 task.
> - Order by importance + urgency. Group by theme when possible.
> - Promote tasks from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately when added to Active Sprint.

---

## Active Sprint

### Sprint N — [Sprint Theme] ([Date])
> **Theme:** [one-line sprint theme]

- [ ] **TASK-NNN: [Title]** — [why it matters]
  - `scope`: full | quick | hotfix
  - `layers`: [comma-separated list — must match allowed values in CLAUDE.md]
  - `api-change`: yes | no
  - `acceptance`: [what "done" looks like — one line, measurable]
  - `tracker`: [URL — required before Gate 0; "none — justification" if no ticket]
  - `risk`: low | medium | high

---

## Backlog

### P0 — Critical / Blocking
- [ ] **[Task]** — [why it matters]

### P1 — [Phase] Required
- [ ] **[Task]** — [why it matters]

### P2 — Quality / Polish
- [ ] **[Task]** — [why it matters]

### P3 — Post-[Phase]
- [ ] **[Task]** — [why it matters]

---

## Changelog

> Current sprint only. Once changes are reflected in docs, MOVE to `docs/CHANGELOG.md` then DELETE from here.

### Sprint N — [Name] ([Date])

| File | Change | ADR |
|:-----|:-------|:----|
| `path/to/file` | [what changed and why] | ADR-NNN or — |

---

## Quick Rules
> Key patterns and conventions for AI and devs — no need to open ARCHITECTURE.md for these.

\`\`\`
[auth patterns, naming rules, data access patterns, cache rules, etc.]
\`\`\`
```

> **Gate 0 pre-condition**: `tracker` must be a real URL (not `"none"`) before Gate 0 passes.
> If `"none"`, the orchestrator asks for the URL or explicit justification before proceeding.
>
> **Risk override**: If `risk: high`, the orchestrator upgrades to `scope: full` automatically.
>
> **lean-doc-generator behaviour with existing TODO.md**: When Phase 8 runs `/lean-doc-generator`,
> the skill detects the existing `TODO.md` and **extends** it (adds new sprint, updates Quick Rules,
> rotates Changelog) rather than regenerating it from scratch. The task fields are not touched.

**[CUSTOMIZE]** Set your team's issue tracker in `CLAUDE.md`:

```markdown
## Issue Tracker
- Tool: [Jira / Linear / GitHub Issues / ClickUp / Notion / other]
- Project URL: [base URL for issues]
```

**[CUSTOMIZE]** The `layers` field values depend on your stack:

| Stack | Layer Values |
|:------|:------------|
| Nuxt 3 / Vue | `api, validation, composable, component, page, store, infrastructure` |
| React / Next.js | `api, validation, hook, component, page, store, infrastructure` |
| NestJS | `controller, service, repository, module, dto, guard, infrastructure` |
| FastAPI | `router, service, repository, schema, model, middleware, infrastructure` |
| Go (Gin) | `handler, service, repository, model, middleware, infrastructure` |

---

## 9. dev-flow Orchestrator — Key Prompts

### Parse Phase (Step 0)

The Parse phase has two entry paths depending on what the user provides:

**Path A — Structured input** (TASK-NNN exists in TODO.md):
```markdown
Read TODO.md. Find the first incomplete task [ ] in the Active Sprint.
Extract:
- Task ID and title
- scope (full | quick | hotfix)
- layers affected
- api-change (yes | no)
- acceptance criteria
- tracker URL (or explicit "none" justification)

If no active task → list backlog top 3 and ask user which to start.
If backlog is also empty → switch to Path B (freeform input).
```

**Path B — Freeform input** (description, instruction, or assumption provided):
```markdown
Freeform input detected. Invoking /task-decomposer before Parse.

The user provided: "[verbatim input]"

Rules:
- Do NOT attempt to extract task fields from freeform text directly.
- Do NOT write any code or make design decisions.
- Invoke task-decomposer (see Section 22) to translate intent → structured TASK-NNN entries.
- task-decomposer output serves as Gate 0 — no separate Gate 0 runs after it.
- Once task-decomposer completes and user approves the task list:
  - Write approved tasks to TODO.md Active Sprint
  - Clear .claude/.session-changes.txt
  - Continue to Design phase (Gate 1) with the first approved task
```

**Freeform detection rules** (orchestrator checks in order):
1. `/dev-flow [text that is not a TASK-NNN ref and not a mode keyword]` → Path B
2. `/dev-flow` with no active tasks in TODO.md → Path B
3. `/dev-flow` with active tasks → Path A
4. `/dev-flow full TASK-NNN` → Path A (explicit task reference, skip decomposer)

### Clarify Phase — Socratic Brainstorming Rules

The orchestrator must follow these rules during Clarify (Phase 1):

```
1. Ask ONE question at a time — never stack multiple questions in one message.
2. Each question must resolve a specific ambiguity that would block design.
3. After enough is known, present 2-3 implementation approaches with tradeoffs.
4. Offer a visual mock or flow diagram once if the task has a UI or data flow component.
5. Stop asking when: goal is clear, edge cases are named, approach is chosen.
6. HARD RULE: Do not write any code or propose any file changes during Clarify.
   Code starts at Implement. Gate 0 is the hard boundary.
```

Example question cadence:
```
Q1: "Is this a new feature or modifying existing behavior?" → wait
Q2: "Should the API response change, or only the frontend display?" → wait
Q3: "Of these two approaches [A vs B], which fits better given [constraint]?" → wait
→ Enough known → present Gate 0 confirmation
```

### Gate 0 Output Format (after Clarify)

```markdown
## Scope Confirmation — [TASK-NNN]: [Title]

**Understood goal**: [1 sentence — what this task achieves]

**Chosen approach**: [which of the presented approaches the user selected, and why]

**Scope boundary** (what is included):
- [item]

**Out of scope** (explicitly excluded):
- [item]

**Edge cases to handle**:
- [edge case 1]
- [edge case 2]

**Constraints**:
- Layers affected: [list]
- API change: yes | no
- Risk level: low | medium | high

**Context cost estimate**: [Tier 2 — single layer / Tier 3 — cross-layer exploration]

Type 'design' to proceed to the Design phase, or provide corrections.
```

> Gate 0 is cheap — it runs in the orchestrator's existing context, costs Tier 1.
> Its purpose is to lock scope and approach *before* the expensive Design agent is spawned.
> No code is written before this gate passes.

### Design Agent Prompt (Step 2)

```markdown
You are a design specialist for [project name].
Task: [TASK-NNN] — [title]
Confirmed scope: [scope from Gate 0]
Confirmed constraints: [from Gate 0]
Layers: [layers]
API change needed: [yes/no]

Explore the codebase to understand:
1. What existing code is affected?
2. What new files need to be created and in which layer?
3. What architectural decisions need to be made?
4. Are there any risks or dependencies?

Use the tiered output format. Do NOT return raw file contents.
```

### Gate 1 Output Format

The design plan must decompose implementation into **micro-tasks of 2–5 minutes each**.
Each micro-task must be self-contained and independently verifiable.

```markdown
## Design Plan — [TASK-NNN]: [Title]

**Implementation approach**:
[2-3 sentence summary of the chosen approach from Gate 0]

**Files to create/modify**:
| Action | File | Layer | Why |
|:-------|:-----|:------|:----|

**Implementation micro-tasks**:

- [ ] Task 1: [exact action] in `[exact/file/path.ts]`
  - Verification: `[exact command to run that proves this task is done]`
- [ ] Task 2: [exact action] in `[exact/file/path.ts]`
  - Verification: `[exact command]`
- [ ] Task N: ...

**Micro-task rules** (enforced during Implement):
- No task may contain "TBD", "placeholder", or "to be implemented"
- Each task must name exact file paths — no "somewhere in the service layer"
- Each verification command must be runnable as-is (no fill-in-the-blanks)
- If a task takes more than 5 minutes, it must be split before proceeding

**Decisions needed**:
- [Decision point 1]
- [Decision point 2]

**Risks**:
- [Risk 1]

**Context dropped after this gate**: design exploration context, codebase read summaries.
**Context carried forward**: approved micro-task list, file map, decisions, risk notes.

Type 'yes' to proceed, or provide feedback to revise the plan.
```

### TDD Contract (Phase 5 — enforced during Test)

The orchestrator must follow this exact cycle for every unit and integration test. Skipping any step is a hard violation.

```
STEP 1 — RED
  Write the test first. Run it.
  The test MUST fail. If it passes immediately, the test is wrong — rewrite it.
  Show the failure output to confirm: "[test name] FAILED — [reason]"

STEP 2 — VERIFY FAILURE IS MEANINGFUL
  The failure must be for the right reason (missing implementation, not a syntax error).
  If it fails due to a syntax error or import issue, fix that first, then re-run STEP 1.

STEP 3 — GREEN
  Write the minimum code to make the test pass. No extras.
  Run the test. It MUST pass.
  Show the pass output: "[test name] PASSED"

STEP 4 — VERIFY NO REGRESSION
  Run the full test suite (not just the new test).
  All previously passing tests must still pass.

STEP 5 — REFACTOR
  Clean up the implementation if needed. Re-run the full suite after refactor.
  If the suite still passes, the cycle is complete for this test.

REPEAT for each micro-task that requires a test.
```

**Hard rules:**
- If pre-written code already exists for a task, delete it and rewrite via TDD — no exceptions
- Never write the implementation and test at the same time
- "The test should pass" is not evidence — run it and show the output
- If a fix fails 3 times in a row, stop. Report to the user and question whether the architecture is wrong before continuing

### Review Agent Prompt (Step 6)

The review runs in **two sequential stages**. Stage 1 must pass before Stage 2 runs.
If Stage 1 finds CRITICAL or BLOCKING issues, return Stage 1 findings immediately — do not proceed to Stage 2.

```markdown
You are a code reviewer for [project name].
Task just implemented: [TASK-NNN] — [title]
Approved micro-task list: [from Gate 1]
Changed files: [list]

## STAGE 1 — Spec Compliance (run this first)
Verify the implementation matches what was approved at Gate 1:
1. Are all micro-tasks from the plan implemented? (no missing items)
2. Are the correct files modified? (no unexpected files changed)
3. Does the behavior match the acceptance criteria?
4. Are all verification commands from the plan passing?

If any Stage 1 check fails → return findings immediately. Do NOT continue to Stage 2.

## STAGE 2 — Code Quality (only if Stage 1 passes)
1. Architecture violations (dependency rule: [rule])
2. SOLID violations (SRP, OCP, ISP, DIP)
3. Test coverage (are key paths tested? are edge cases covered?)
4. Documentation (any ADR needed? any missing inline comments on non-obvious logic?)
5. Performance (N+1 queries, unnecessary re-renders, blocking operations)

Use the tiered output format. Label each finding with its stage: [S1] or [S2].
Do NOT return raw file contents.
```

### Security Agent Prompt (Step 7 — runs in parallel with Step 6)

```markdown
You are a security analyst for [project name].
Task just implemented: [TASK-NNN] — [title]
Changed files: [list]
Stack: [framework + language]

Audit for:
1. OWASP Top 10 risks relevant to this stack
2. Hardcoded credentials or secrets
3. User input used without validation
4. Authentication / authorization gaps
5. Stack-specific risks: [from security-auditor SKILL.md]

Use the tiered output format. Do NOT return raw file contents.
CRITICAL findings must never be truncated.
```

### Gate 2 Output Format (aggregated Review + Security)

```markdown
## Gate 2 — [TASK-NNN]: [Title]

### From Review

**CRITICAL** (hard stop — must fix):
- [issue]: [file:line] — [fix]

**BLOCKING** (fix before commit):
- [issue]: [file:line] — [fix]

**NON-BLOCKING**:
- [note]

### From Security

**CRITICAL** (hard stop — must fix):
- [finding]: [file:line] — [fix]

**BLOCKING**:
- [finding]: [file:line] — [fix]

**NON-BLOCKING**:
- [note]

### Approved
- [good pattern from either agent]

---
**Context dropped after this gate**: review context, security context, implementation details.
**Context carried forward**: approved commit message, DECISIONS.md items, PR description.

Type 'commit' to proceed, or fix issues and re-run the affected agent.
```

### Phase 8 — Docs Prompt (delegates to `/lean-doc-generator`)

```markdown
Run /lean-doc-generator for task [TASK-NNN].

Context:
- Task implemented: [title]
- Architectural decisions made: [list any, or "none"]
- New patterns introduced: [list any, or "none"]
- Files changed: [list]

Docs to update this session:
1. If an architectural decision was made → write ADR entry in docs/DECISIONS.md
2. If a new pattern was introduced → update docs/AI_CONTEXT.md § Patterns
3. If setup steps changed → update docs/SETUP.md
4. Always → update TODO.md: mark task complete, add Changelog row, rotate sprint if done

HOW filter (mandatory before writing any line):
- Does this line explain HOW something works? → Remove it. Put it in a code comment instead.
- Does it explain WHY a decision was made? → docs/DECISIONS.md
- Does it explain WHERE things live? → docs/ARCHITECTURE.md or docs/README.md

Ownership header required on every doc touched:
  owner: [role]
  last_updated: [today's date]
  update_trigger: [what event requires updating this file]
  status: current

Do NOT regenerate existing docs from scratch. Extend or append only.
Do NOT create any file outside the approved set (README, ARCHITECTURE, DECISIONS, SETUP, AI_CONTEXT, CHANGELOG, TEST_SCENARIOS, TODO).
```

### Phase 10 — Session Close Format (mandatory after every COMMIT+PR)

```markdown
## Session Close — [TASK-NNN]: [Title] — [Date]

**Docs touched this session**:
| File | Change made | Ownership verified |
|:-----|:------------|:-------------------|
| `docs/DECISIONS.md` | ADR-NNN added: [topic] | yes |
| `TODO.md` | Task marked done, Changelog row added | yes |

**Ownership headers to verify next session**:
- `[filename]` — last_updated set to [today] — next review due: [today + 60 days]

**TODO.md maintenance completed**:
- [ ] Task moved from Active Sprint to Changelog
- [ ] Changelog row added (File | Change | ADR)
- [ ] Relevant doc updated (ARCHITECTURE / DECISIONS / AI_CONTEXT)
- [ ] Sprint block rotated to docs/CHANGELOG.md if sprint is complete

**Recommended updates for next session**:
- [ ] If [X happens in code] → update [filename] § [section]

**Corrections this session worth promoting to permanent rules**:
- [any correction the user made during docs generation]
  → Confirm to add to lean-doc-generator SKILL.md § Validated Session Patterns
```

> Session Close is **mandatory and never skipped** — including `hotfix` mode.
> It costs Tier 1 (cheap) and prevents doc drift compounding across sessions.

### Hard Stop Conditions

The orchestrator MUST stop and report to the user (never silently continue) if:

```
❌ Gate 0 skipped — `tracker` is "none" without justification, or scope is unconfirmed
❌ Typecheck fails — show error, wait for fix
❌ Lint fails — show error, wait for fix
❌ Unit or integration tests fail — show error, wait for fix
❌ CRITICAL security finding — show full finding (no truncation), require explicit override
❌ Architecture violation in review (BLOCKING tier) — require explicit acknowledgment
❌ Generated/auto-built files were edited — warn and request revert
❌ quick mode: >3 files changed — require acknowledgment or upgrade to full mode
❌ Skill last-validated > 6 months — warn before running, require acknowledgment
❌ Background agent returned unstructured output twice — escalate to user, do not guess
❌ Same fix attempted 3 times without passing — stop, report, question the architecture before continuing
❌ Session Close skipped — orchestrator must always run Phase 10 before ending, no exceptions
❌ Doc generated with HOW content — redirect to code comment, never commit HOW documentation
❌ Doc touched without ownership header — add header before committing the doc

— New hard stops (v1.5.0) —

❌ Database migration added without verified down migration — run migration-analyst before Gate 2
❌ Migration present and `layers` includes `infrastructure` but migration-analyst not invoked — block commit
❌ CI pipeline status non-green after git push (Phase 9b) — do not run Session Close until green
❌ `risk: high` task with `api` in layers, performance-analyst not invoked — block Gate 2
❌ `resume` mode invoked but approved design plan not found in context — re-run Gate 1 before proceeding
❌ `init` mode: any code written before Gate B (Architecture) approval — hard stop, revert writes
❌ Rollback commit absent in hotfix mode — warn before commit, require acknowledgment
❌ CLAUDE.md exceeds 200 lines — trim before proceeding; always-loaded budget exceeded
❌ Any docs/ file line count exceeds its limit (README: 50, ARCHITECTURE: 150, SETUP: 100, AI_CONTEXT: 100) — trim before commit
❌ Context turn count exceeds 40 before a new phase — prune to 3-bullet summary, state this aloud
```

**Hotfix mode warning** (non-blocking but mandatory):
```
⚠️ HOTFIX MODE ACTIVE
   Rollback readiness: [VERIFIED | MISSING — acknowledge to proceed]
   Lint on changed files: [results]
   Proceeding without gates. Confirm to commit.
   Post-commit: incident ADR will be prompted automatically.
```

**Context threshold warning** (non-blocking but mandatory before new phase):
```
⚠️ CONTEXT THRESHOLD: [N] turns accumulated. Pruning previous phase.
   Previous phase summary (3 bullets):
   - [bullet 1]
   - [bullet 2]
   - [bullet 3]
   Carrying forward: [what context is preserved]
   Dropped: [what context is cleared]
```

---

## 10. Security Auditor — Stack Customization

### Universal Checks (all stacks)

- Hardcoded credentials / API keys in source
- Console/logging of sensitive data (tokens, PII)
- User input used without validation
- URL parameters used without format check
- Open redirect (redirect to user-controlled URL)

### [CUSTOMIZE] FE-Specific Checks

| Framework | Key Risks |
|:----------|:---------|
| Vue 3 | `v-html` XSS, SSR data leakage, non-httpOnly token storage |
| React | `dangerouslySetInnerHTML` XSS, client-side auth only, localStorage tokens |
| Angular | `bypassSecurityTrust*` XSS, template injection |
| Next.js | getServerSideProps data exposure, public env vars with secrets |

### [CUSTOMIZE] BE-Specific Checks

| Framework | Key Risks |
|:----------|:---------|
| Node/Express | SQL injection (if raw queries), path traversal, prototype pollution |
| NestJS | Missing guards on controllers, DTO validation not enabled globally |
| FastAPI | Missing `Depends` auth on routes, response model leaking internal fields |
| Go/Gin | Missing auth middleware, SQL injection with fmt.Sprintf in queries |
| Spring | Missing `@PreAuthorize`, mass assignment via `@RequestBody` to entity |

---

## 11. PR Reviewer — Architecture Rule Customization

The `pr-reviewer` skill checks architecture rules. Customize the blocking conditions:

### [CUSTOMIZE] Clean Architecture (Pages → Services → Repository)

```markdown
BLOCKING:
- Controller/Route handler contains business logic
- Repository is called directly from controller (skips service)
- Service imports ORM entity directly (instead of repository abstraction)
- DTO used as domain model throughout all layers
```

### [CUSTOMIZE] Hexagonal Architecture (Ports & Adapters)

```markdown
BLOCKING:
- Domain logic imports infrastructure (ORM, HTTP client)
- Use case imports concrete adapter (not port interface)
- Adapter implements multiple ports in one class
```

### [CUSTOMIZE] MVC (Model-View-Controller)

```markdown
BLOCKING:
- View renders data from DB query (no model layer)
- Controller contains SQL queries
- Model has HTTP response logic
```

### [CUSTOMIZE] Frontend Clean Architecture

```markdown
BLOCKING:
- Component calls API directly (not via hook/composable/service)
- Business logic in route handler (page component)
- State management contains API call logic
```

---

## 12. Setup Checklist for a New Repository

```
Phase 1 — Structure (30 min)
- [ ] Create .claude/ directory with scripts/ subdirectory
- [ ] Write CLAUDE.md with project overview, dependency rule, conventions, DoD, and Issue Tracker sections
- [ ] Verify CLAUDE.md is under 200 lines (always-loaded budget constraint)
- [ ] Create settings.json with SessionStart hook + lint + typecheck hooks for your stack
- [ ] Create .claude/scripts/session-start.js (from Section 6 template)
- [ ] Add settings.local.json to .gitignore
- [ ] Create docs/ directory — generate initial docs with /lean-doc-generator (select Option B or C)
      Generates: README.md, ARCHITECTURE.md, DECISIONS.md, SETUP.md, AI_CONTEXT.md, CHANGELOG.md
- [ ] Create TODO.md using the unified format from Section 8 (first sprint + backlog)
- [ ] Verify first task has a real tracker URL or explicit justification — required for Gate 0

Phase 2 — Universal Skills (20 min)
- [ ] Create .claude/skills/ directory
- [ ] Copy these skill directories (each contains SKILL.md):
      adr-writer/, refactor-advisor/, lean-doc-generator/,
      release-manager/, system-design-reviewer/
- [ ] Ensure lean-doc-generator/reference/ directory is copied with DOCS_Guide.md and VALIDATED_PATTERNS.md
- [ ] Verify lean-doc-generator/SKILL.md has version, stack-version, last-validated frontmatter
- [ ] Update release-manager/SKILL.md VCS section (Bitbucket/GitHub/GitLab)
- [ ] Add `context: fork` + `agent: general-purpose` to: refactor-advisor, system-design-reviewer
- [ ] Add stack-version and last-validated fields to all skill frontmatter

Phase 3 — Subagents (45 min)
- [ ] Create .claude/agents/ directory
- [ ] Create .claude/agents/design-analyst.md — customize dependency rule for your architecture
- [ ] Create .claude/agents/init-analyst.md — preloads system-design-reviewer;
      body adds: discovery checklist, architecture gate format (Gate A + Gate B), ADR-001 prompt
- [ ] Create .claude/agents/code-reviewer.md — thin wrapper with `skills: pr-reviewer`;
      body adds only: role + Gate 2 tiered format + project dependency rule
- [ ] Create .claude/agents/security-analyst.md — thin wrapper with `skills: security-auditor`;
      body adds only: role + tiered severity format + stack-specific scope notes
- [ ] Create .claude/agents/migration-analyst.md — migration safety specialist;
      body: up/down parity check, backward-compat rules, concurrent-write risk, rollback verification
- [ ] Create .claude/agents/performance-analyst.md — conditional (risk: high + api layer);
      body: query plan analysis, response time baseline, N+1 detection, load profile assessment
- [ ] Verify all agents use the tiered output contract (CRITICAL / BLOCKING / NON-BLOCKING / APPROVED)

Phase 4 — Stack-Specific Skills (60 min)
- [ ] Create .claude/skills/dev-flow/SKILL.md (orchestrator) customized for your stack
      Must include: all 6 modes (init/full/quick/hotfix/review/resume), Gate 0/1/2, Phase 9b CI check
- [ ] Create .claude/skills/[component/service]-builder/SKILL.md for your framework
- [ ] Create .claude/skills/test-case-generator/SKILL.md — cover unit, integration, and E2E tiers
- [ ] Create .claude/skills/security-auditor/SKILL.md with stack-specific risks (context: fork)
- [ ] Create .claude/skills/pr-reviewer/SKILL.md with your architecture blocking rules (context: fork)
- [ ] Create .claude/skills/api-contract-designer/SKILL.md if API-first (FE or BE)
- [ ] Create .claude/skills/e2e-scenario-writer/SKILL.md if E2E tests exist
- [ ] Create .claude/skills/task-decomposer/SKILL.md — universal, works for all stacks
      Customize: valid layer names (must match CLAUDE.md), tracker URL pattern, risk thresholds
- [ ] Create .claude/agents/scope-analyst.md — read-only codebase impact reader
      Body adds only: role + layer impact report format + file count heuristics
- [ ] Create .claude/scripts/track-change.js — PostToolUse file tracker
- [ ] Create .claude/scripts/ci-status.js — PostToolUse CI poller; set CI_PROVIDER env var
- [ ] Add .claude/.session-changes.txt to .gitignore

Phase 5 — Validation (45 min)
- [ ] Verify settings.local.json exists on your machine (gitignored — workflow fails without it)
- [ ] Run session-start.js manually — verify all 8 checks pass
      (settings.local, CLAUDE.md size, skill staleness, doc line counts, doc ownership, pending migrations, active sprint, context budget)
- [ ] Run /dev-flow init [test-project] in a scratch repo — verify 4-phase init runs and produces TODO.md + CLAUDE.md + ADR-001
- [ ] Run /dev-flow on a small existing task — verify full pipeline end-to-end
- [ ] Verify Gate 0 fires and waits before Design agent spawns
- [ ] Verify lint hook fires on git commit attempt
- [ ] Verify typecheck hook fires on git push attempt
- [ ] Verify ci-status.js runs after git push and surfaces CI result
- [ ] Verify track-change.js appends files to .session-changes.txt on Write/Edit
- [ ] Ask a team member to clone and run /dev-flow — verify skills load
- [ ] Verify Review + Security agents run in parallel and Gate 2 aggregates both outputs
- [ ] Verify migration-analyst fires when a migration file is in changed files
- [ ] Verify performance-analyst fires when risk: high + api layer
- [ ] Verify design-analyst subagent returns tiered structured output (not raw file contents)
- [ ] Verify Phase 8 delegates to /lean-doc-generator and produces docs with ownership headers
- [ ] Verify Phase 10 Session Close runs after commit and outputs the session close format
- [ ] Test task-decomposer with freeform description → verify produces valid TASK-NNN with all 6 fields
- [ ] Test `/dev-flow "freeform description"` → verify Path B activates and Gate 0 is absorbed
- [ ] Test task-decomposer with a ticket URL → verify ticket content is fetched and parsed
- [ ] Verify scope-analyst returns layer impact summary (not raw file contents)
- [ ] Create ADR-001 for the architecture decision using /adr-writer

Phase 6 — Team Onboarding (15 min per person)
- [ ] Share this document
- [ ] Explain the 3-gate model (Gate 0 = scope, Gate 1 = design, Gate 2 = review + security)
- [ ] Explain context cost tiers and why Tier 3 requires gate confirmation
- [ ] Explain task format in todo.md, including tracker URL requirement and risk field
- [ ] Explain /dev-flow [mode] syntax and quick mode scope guard
- [ ] Confirm settings.local.json created on each machine (gitignored)
```

---

## 13. Skill Invocation Reference

All skills are invoked as slash commands in Claude Code:

```bash
# ── Orchestrator (dev-flow) ──────────────────────────────────────────────────
/dev-flow init [project-name]        # Greenfield bootstrap: Discovery → Architecture → Infra → Sprint 0
/dev-flow                            # Full mode — next task in Active Sprint (Path A)
/dev-flow "add Google OAuth login"   # Full mode — freeform input, auto-invokes task-decomposer (Path B)
/dev-flow quick TASK-042             # Quick mode — specific task, Gate 0 + Gate 2 only
/dev-flow hotfix                     # No gates — production emergency (hardened — see Section 21)
/dev-flow review [PR# | file1 file2] # Review-only — skips Parse, accepts PR or file list directly
/dev-flow resume TASK-042            # Resume interrupted session at last incomplete micro-task

# ── Task Decomposer (standalone or invoked by dev-flow Path B) ────────────────
/task-decomposer "add checkout flow" # From freeform description
/task-decomposer JIRA-123            # From ticket URL — fetches and parses ticket content
/task-decomposer --epic "Payment"    # From epic name — decomposes into full sprint backlog
/task-decomposer --prd [file.md]     # From PRD document — full decomposition

# ── Universal skills ─────────────────────────────────────────────────────────
/adr-writer [decision topic]         # Write ADR entry in docs/DECISIONS.md
/refactor-advisor [file/feature]     # Analyze refactoring opportunities (context: fork)
/security-auditor [scope]            # Standalone security scan (context: fork)
/pr-reviewer [files/feature]         # Standalone code review (context: fork)
/system-design-reviewer [proposal]   # Architecture review (context: fork)
/lean-doc-generator [type] [subject] # Create/update lean docs with ownership headers
/release-manager [version]           # Prepare release notes + CHANGELOG entry

# ── Conditional — invoked by orchestrator, not by user directly ───────────────
# (These run automatically inside dev-flow when triggered; can also be invoked standalone)
/migration-advisor [migration-file]  # Safety check: up/down parity, rollback, concurrency
/performance-advisor [endpoint/fn]   # Load + query plan + response time baseline

# ── Stack-specific (FE example) ──────────────────────────────────────────────
/fe-component-builder [name] [category] [description]
/test-case-generator [file] [unit|component|e2e]
/e2e-scenario-writer [feature]
/api-contract-designer [feature]
/fe-accessibility-auditor [file]
/fe-design-engineer [design description]
/fe-motion-designer [component]      # Animations/transitions — GPU path, reduced-motion safe
```

**Command — mode decision guide**:

| Situation | Command |
|:----------|:--------|
| Starting a brand new project | `/dev-flow init [name]` |
| I have a description/idea, no task written yet | `/dev-flow "your description"` |
| I have a Jira/Linear/GitHub ticket | `/task-decomposer TICKET-123` |
| I have a PRD or feature doc | `/task-decomposer --prd [file.md]` |
| I have an epic to break into sprints | `/task-decomposer --epic "Epic Name"` |
| Next feature/bug from TODO.md (task already written) | `/dev-flow` |
| Small bug, 1-3 files max (task already written) | `/dev-flow quick TASK-NNN` |
| Production down, fix NOW | `/dev-flow hotfix` |
| Reviewing open PR before merge | `/dev-flow review [PR#]` |
| Session dropped mid-task | `/dev-flow resume TASK-NNN` |
| Architecture decision needed | `/adr-writer` |
| Code smells without a PR | `/refactor-advisor` |
| Security scan on demand | `/security-auditor` |

---

## 14. Architecture Alignment Verification

Before shipping the workflow for a new project, verify alignment with chosen principles:

### Clean Architecture

| Workflow Phase | CA Alignment |
|:--------------|:------------|
| Design agent explores layer boundaries | Enforces dependency rule during planning |
| pr-reviewer checks layer violations | Blocking: outer depending on inner reversed |
| security-auditor checks infrastructure leakage | Catches domain importing infrastructure |
| CLAUDE.md defines dependency rule | Always-loaded context enforces it in every session |

### Spec-Driven Architecture (if applicable)

| Workflow Phase | Spec-Driven Alignment |
|:--------------|:---------------------|
| api-contract-designer runs before implementation | Contract first, code second |
| Design agent checks if api-change: yes | Forces spec update before implementation |
| pr-reviewer checks DTO vs domain model separation | Generated types never used as domain models |

### SOLID

| Principle | Enforced By |
|:----------|:-----------|
| Single Responsibility | pr-reviewer flags composables/services >200 LOC |
| Open/Closed | system-design-reviewer checks for extension without modification |
| Interface Segregation | pr-reviewer flags prop/param bags (too many fields) |
| Dependency Inversion | pr-reviewer flags concrete dependency imports in domain layer |

### Domain-Driven Design (if applicable)

| DDD Concept | Enforced By |
|:-----------|:-----------|
| Bounded context | CLAUDE.md defines feature directory ownership |
| Domain model isolation | pr-reviewer blocks DTO-as-domain-model |
| Ubiquitous language | adr-writer captures vocabulary decisions |

---

## 15. Adapting This Blueprint — Decision Guide

Answer these questions for each new repository:

| Question | If YES | If NO |
|:---------|:-------|:------|
| Is it a frontend project? | Add component-builder, fe-accessibility-auditor, e2e-scenario-writer | Skip these |
| Does it have an API contract with another team? | Add api-contract-designer | Skip |
| Does it have a strict architecture (CA, DDD, Hexagonal)? | Customize pr-reviewer blocking rules | Use generic pr-reviewer |
| Does it use TypeScript? | Add typecheck hook to settings.json | Use compile/build equivalent |
| Does it have E2E tests? | Add e2e-scenario-writer | Skip |
| Is it deployed via CI/CD? | Add ci-status.js + set CI_PROVIDER | Set CI_PROVIDER=skip |
| Does it handle user PII or payments? | Add security-auditor as a blocking gate | Keep as advisory |
| Is the team >3 people? | Use full mode (Gate 1 + Gate 2) as default | quick mode is fine |
| Is it a greenfield project? | Start with `/dev-flow init` | Start with `/dev-flow` |
| Does it have database migrations? | Add migration-analyst agent, add migration hard stop | Skip migration checks |
| Does any task touch high-risk API paths? | Add performance-analyst agent | Skip performance gate |
| Are sessions frequently interrupted? | Ensure `/dev-flow resume` is set up and design plans are persisted | Standard session close is enough |

---

## 16. INIT Mode — Project Bootstrap Workflow

> **When to use**: Starting a project from scratch — no repo, no architecture, no task list.
> INIT produces the foundational artifacts that `dev-flow full` requires as preconditions.
> After INIT completes, the project is indistinguishable from an existing one. Use `/dev-flow full` from Sprint 1 onwards.

### Invocation

```bash
/dev-flow init [project-name]
```

### INIT Phases

```
DISCOVERY → [GATE A] → ARCHITECTURE → [GATE B] → INFRA SETUP → [GATE C] → SPRINT 0 → [GATE 1] → [GATE 2] → SESSION CLOSE
```

**Hard rule**: No code is written before Gate B. No infrastructure provisioned before Gate C.
Any code written before Gate B is a hard stop — revert and return to Gate A.

---

### Phase I-1: Discovery

**Agent**: `init-analyst` (background, Tier 3, spawned after user confirms they are ready)

**Orchestrator prompt to user before spawning**:
```
Starting INIT mode for [project-name].
Before I spawn the Discovery analyst, I need a brief:

1. What problem does this project solve? (one paragraph)
2. Who are the primary users?
3. What is the MVP — the smallest version that delivers value?
4. What is explicitly out of scope for MVP?
5. Approximate team size and operational runway (months)?

Answer these and I will run the Discovery analysis.
```

**Discovery analyst job** (init-analyst.md body):
```markdown
You are a Discovery analyst for a greenfield software project.

Given the project brief, produce a structured discovery document:

## Domain Model
- Core entities and their relationships (5-10 max for MVP)
- Bounded contexts if domain is large enough to warrant separation

## User Stories (MVP only)
- Format: "As a [user type], I want [goal] so that [value]"
- Maximum 10 stories. Prioritized P0-P2.

## Technical Constraints
- Performance expectations (users, requests/sec, data volume)
- Security classification (public, internal, regulated)
- Integration dependencies (third-party APIs, existing systems)
- Platform targets (web, mobile, desktop, API-only)

## Risk Radar
- 3-5 highest technical risks with mitigation ideas

## Stack Candidates
- Propose 2 stack options with tradeoffs for this specific domain
- Rank by fit given constraints, not by personal preference

Use the tiered output format. No raw code. No architecture decisions yet — this is discovery only.
```

---

### Gate A — Discovery Approval

```markdown
## Gate A — Discovery: [project-name]

**Domain summary**: [1 sentence]

**MVP boundary**:
- In scope: [bullet list]
- Out of scope: [bullet list]

**Top 3 risks**: [list]

**Stack candidates**:
1. [Option A] — [tradeoff summary]
2. [Option B] — [tradeoff summary]

**Recommended stack**: [option + reason]

Type 'architecture' to proceed, or provide corrections.
```

> Gate A cost: Tier 3 (init-analyst spawn). Locked after approval.
> Context carried forward: domain model, MVP boundary, constraints, chosen stack candidate.
> Context dropped: full discovery prose, rejected stack option details.

---

### Phase I-2: Architecture

**Agent**: `init-analyst` (second invocation — same agent, architecture role)

**Orchestrator prompt** (after Gate A approval):
```markdown
You are an Architecture specialist.
Project: [name] | Stack: [chosen from Gate A] | Domain: [summary]
MVP constraints: [from Gate A]

Design:
1. System architecture — components, boundaries, data flow
2. Dependency rule — which layer may import which (MUST be unambiguous)
3. File/directory structure — top-level layout with purpose of each directory
4. Database design — entity schema for MVP (not full ERD — focus on core tables/collections)
5. API surface — list of endpoints or event topics needed for MVP user stories
6. Authentication pattern — chosen mechanism and why
7. Decisions made — list each as a proto-ADR (topic + decision + rationale + alternatives considered)

Return structured summary. No code yet. No file creation.
Use tiered output format with proto-ADRs listed under APPROVED PATTERNS.
```

**Gate B — Architecture Approval**:
```markdown
## Gate B — Architecture: [project-name]

**Architecture pattern**: [Clean Architecture | Hexagonal | MVC | etc.]

**Dependency rule**:
[Layer diagram — e.g. Pages → Services → Repository → External]

**File structure** (top level):
| Directory | Purpose |
|:----------|:--------|
| `src/[layer]/` | [what goes here] |

**Database**: [schema summary — key tables/collections]

**API surface**: [N endpoints — list]

**Auth pattern**: [e.g. JWT, session, OAuth]

**Proto-ADRs** (will be formalized in Sprint 0):
- ADR-001: [topic] — [decision]
- ADR-002: [topic] — [decision]

**Context dropped after this gate**: discovery prose, rejected architecture options.
**Context carried forward**: approved architecture, dependency rule, proto-ADRs.

Type 'infra' to proceed, or provide corrections.
```

---

### Phase I-3: Infrastructure Setup

**Orchestrator runs inline** (no background agent — Tier 2 ops only):

```markdown
Infrastructure setup checklist for [project-name] on [stack]:

1. Repository initialization
   - [ ] `git init` + initial commit
   - [ ] `.gitignore` for [stack]
   - [ ] Branch strategy confirmed (main + feature branches | trunk-based | gitflow)

2. Package manager + runtime
   - [ ] `[package-manager] init` / `go mod init` / `pyproject.toml`
   - [ ] Core framework installed: [framework + version]
   - [ ] Linter + formatter installed: [tool]
   - [ ] Type checker installed (if typed stack): [tool]

3. Claude Code harness
   - [ ] `.claude/` directory created
   - [ ] `CLAUDE.md` written (architecture, dependency rule, conventions, DoD)
   - [ ] `settings.json` written (SessionStart + PreToolUse + PostToolUse hooks)
   - [ ] `settings.local.json` created (gitignored, tool allow-list)
   - [ ] `session-start.js`, `track-change.js`, `ci-status.js` created
   - [ ] All agent `.md` files created in `.claude/agents/`
   - [ ] All skill `SKILL.md` files created in `.claude/skills/`

4. Documentation scaffold
   - [ ] `docs/` created — run `/lean-doc-generator init` to generate:
         README.md, ARCHITECTURE.md, DECISIONS.md, SETUP.md, AI_CONTEXT.md, CHANGELOG.md
   - [ ] `TODO.md` created with Sprint 0 tasks (see below)

5. CI/CD (if applicable)
   - [ ] CI config file created ([.github/workflows/ | .gitlab-ci.yml | Jenkinsfile])
   - [ ] CI_PROVIDER set in team env

6. Observability (if applicable — skip for pure MVP)
   - [ ] Structured logging configured
   - [ ] Error tracking service connected

All checklist items are Tier 1-2. None require Gate approval.
Present completed list to user. User confirms or corrects.
```

**Gate C — Infrastructure Approval**:
```markdown
## Gate C — Infrastructure: [project-name]

**Repository**: [URL or local path]
**Stack confirmed**: [framework + runtime + version]
**Harness**: [✓ CLAUDE.md | ✓ settings.json | ✓ scripts | ✓ agents | ✓ skills]
**Docs scaffold**: [✓ all 6 docs/ files generated with ownership headers]
**CI**: [✓ configured | ⚠ skip (set CI_PROVIDER=skip)]

Type 'sprint0' to proceed to Sprint 0, or correct any item.
```

---

### Phase I-4: Sprint 0

Sprint 0 is the first real dev-flow sprint. Its tasks are generated by `/task-decomposer`
using the Gate B Architecture document as input — not written manually and not hardcoded.

**Orchestrator prompt at Sprint 0 entry**:
```markdown
Run /task-decomposer --from-architecture for Sprint 0.

Input context:
- Architecture approved at Gate B: [architecture summary]
- Stack: [chosen stack]
- Dependency rule: [layer diagram]
- API surface (MVP): [list from Gate B]
- Auth pattern: [from Gate B]
- Proto-ADRs: [list]

Sprint 0 goal: produce the runnable skeleton that all future sprints build on.
Decompose into 3-5 foundation tasks. Every task must be independently deployable.
Apply the standard TASK-NNN format with all 6 fields.
Group as Sprint 0 in TODO.md Active Sprint.
```

task-decomposer will generate and present the Sprint 0 tasks for human approval.
The human's approval of the task list IS Gate 0 for Sprint 0 — no separate gate runs.

**Expected Sprint 0 output** (generated, not hardcoded — varies by stack and architecture):

```markdown
## Active Sprint

### Sprint 0 — Foundation ([date])
> **Theme:** Establish the runnable skeleton that all future sprints build on.
```

**Standard Sprint 0 tasks** (example — actual tasks generated by task-decomposer from architecture):

```markdown
## Active Sprint

### Sprint 0 — Foundation ([date])
> **Theme:** Establish the runnable skeleton that all future sprints build on.

- [ ] **TASK-001: Project skeleton** — create entry point, router, DI container, and health endpoint
  - `scope`: full
  - `layers`: [all base layers]
  - `api-change`: yes
  - `acceptance`: `curl localhost:[port]/health` returns 200 with `{"status":"ok"}`
  - `tracker`: [infra task URL]
  - `risk`: medium

- [ ] **TASK-002: Auth foundation** — implement auth middleware + protected route guard
  - `scope`: full
  - `layers`: [auth layer, middleware]
  - `api-change`: yes
  - `acceptance`: protected route returns 401 without valid token, 200 with valid token
  - `tracker`: [auth task URL]
  - `risk`: high

- [ ] **TASK-003: Database connection + base schema** — ORM config + core entity migrations
  - `scope`: full
  - `layers`: [infrastructure, repository]
  - `api-change`: no
  - `acceptance`: migration runs up AND down without error; connection pool established
  - `tracker`: [db task URL]
  - `risk`: medium

- [ ] **TASK-004: CI pipeline green** — lint + typecheck + unit test all pass in CI
  - `scope`: quick
  - `layers`: [infrastructure]
  - `api-change`: no
  - `acceptance`: CI pipeline status = green on push to main
  - `tracker`: [ci task URL]
  - `risk`: low
```

> After Sprint 0 Gate 2 passes and Session Close runs, INIT mode is complete.
> From Sprint 1 onwards, use `/dev-flow full` (or `quick`/`hotfix` as appropriate).
> ADR-001 through ADR-00N are written during Sprint 0 via `/adr-writer`.

---

## 17. Harness Continuous Improvement Protocol

The harness is not static. It self-improves across sessions using structured feedback loops.
This section defines the three feedback channels and the weekly calibration protocol.

### Channel 1: Session Close Promotions

Every Session Close (Phase 10) includes a "Corrections worth promoting" block.
When the user confirms a correction, the orchestrator:

1. Identifies which skill, agent, or CLAUDE.md section the correction applies to
2. Opens the relevant SKILL.md or agent `.md` file
3. Appends the correction to a `## Validated Session Patterns` section at the bottom
4. Updates `last-validated` date in frontmatter
5. Writes an entry to `.claude/IMPROVEMENT_LOG.md`

**`.claude/IMPROVEMENT_LOG.md` format** (append-only):

```markdown
# Harness Improvement Log

---

## [YYYY-MM-DD] — [Skill or Agent name]

**Correction source**: Session Close — TASK-NNN
**Pattern added**: [what was added and why]
**Applied to**: [file path + section]
**Promoted by**: [human | auto]

---
```

> This file is the institutional memory of what the workflow learned from production use.
> Review it in `/refactor-advisor` when skills feel stale or producing low-quality output.

---

### Channel 2: Skill Staleness Auto-Update

When `session-start.js` flags a skill as stale (last-validated > 6 months), the orchestrator:

1. Before running the skill, asks the human: *"Skill [name] is stale. Shall I run a quick validation pass to verify it still applies to [stack version]?"*
2. If yes: spawns a Forked skill context that re-reads the skill and the current stack version, returns a diff of what needs updating
3. Human approves changes
4. Orchestrator updates `last-validated` to today and writes an IMPROVEMENT_LOG entry
5. If no: runs the skill as-is with a warning banner in the output

**Staleness re-validation prompt** (used in step 2):

```markdown
You are reviewing skill [name] for staleness.
Skill last-validated: [date]
Current stack: [framework + version]
Skill content: [SKILL.md content]

Check:
1. Are any tool names, API names, or CLI flags in the skill no longer valid for this stack version?
2. Are any blocking rules outdated given framework changes since [date]?
3. Are any referenced patterns deprecated or superseded?

Return: a diff — what to keep, what to update, what to remove.
Format: KEEP / UPDATE / REMOVE for each section.
```

---

### Channel 3: Gate Feedback Capture

Every time a human rejects a gate output (Gate 0, 1, or 2) and provides a correction,
the orchestrator captures the pattern for promotion:

```markdown
Gate [N] was rejected. Correction received:
"[human correction verbatim]"

Categorize:
- Is this a scope clarification? → Update Clarify phase rules
- Is this a design quality issue? → Update design-analyst prompt
- Is this a review false positive? → Update pr-reviewer blocking rules
- Is this a security false positive? → Update security-auditor scope
- Is this an orchestrator communication issue? → Update gate output format

Propose one specific change to the relevant file. Human confirms before writing.
```

---

### Weekly Calibration Protocol (Team Process)

Once per week (or per sprint), the Tech Lead runs:

```bash
/refactor-advisor .claude/skills/    # Review skill quality as a whole
/refactor-advisor .claude/agents/    # Review agent prompt quality
```

And reviews `.claude/IMPROVEMENT_LOG.md` for patterns worth generalizing.

**Calibration questions**:
1. Which gates are being rejected most often? → That phase needs a prompt upgrade.
2. Which hard stops are triggering false positives? → Threshold needs adjustment.
3. Which skills have `last-validated` approaching 6 months? → Schedule validation pass.
4. Are context budget warnings appearing frequently? → Phases may need to be split.
5. Is CI blocking Session Close regularly? → CI pipeline may need optimization.

---

## 18. Session Resume Protocol

A session can be interrupted at any point (context limit, connection drop, workspace close).
The `resume` mode recovers state with minimum re-work.

### Invocation

```bash
/dev-flow resume TASK-NNN
```

### Resume Algorithm

**Step 1 — State Detection** (orchestrator reads, Tier 1):

```markdown
Read TODO.md. Find TASK-NNN.
Read the approved design plan for TASK-NNN from the last Gate 1 output.

If design plan NOT found in context:
  → HARD STOP: "Design plan for TASK-NNN not found. Options:
     (a) Provide the Gate 1 plan manually (paste it here)
     (b) Re-run Gate 1 from the last known design-analyst output
     (c) Start from Gate 0 if the scope has changed"

If design plan found:
  → Find the first incomplete micro-task [ ] in the plan
  → Report: "Resuming at micro-task [N]: [description]"
  → Ask: "Does this match where you left off, or has something changed?"
```

**Step 2 — Context Reconstruction** (Tier 1-2):

```markdown
Reconstruct minimal context needed for the current micro-task:
- Load only files relevant to the current micro-task (not the whole task)
- Do NOT re-read previously completed micro-tasks' files
- Run validation check: typecheck + lint on already-written files
  If validation fails → report failures before resuming implementation
  This prevents building on a broken base

Context reconstruction summary:
- Phase when interrupted: [Implement | Test | Review | etc.]
- Last completed micro-task: [N-1 description]
- Resuming at: micro-task [N]
- Files already written this task: [list from .session-changes.txt]
- Validation status: [pass | N issues found]
```

**Step 3 — Continue from micro-task N**:

```markdown
Proceed with micro-task [N] as if Gate 1 just approved.
No re-design. No re-clarification. Implement → Validate → Test cycle continues.
If a decision needs to be re-made (context was lost), ask ONE targeted question
before proceeding — do not re-run the full Clarify phase.
```

### Resume Output Format

```markdown
## Session Resume — TASK-NNN: [Title]

**Interrupted at**: [phase name + micro-task number]
**Context reconstructed**: [Y files loaded]
**Validation on existing work**: [pass | N failures — listed below]

**Resuming at micro-task [N]**: [description]
**Verification command**: [command from Gate 1 plan]

[if validation failures]:
**Must fix before resuming**:
- [file:line] — [issue]

Type 'continue' to resume implementation, or provide corrections.
```

---

## 19. Migration Safety Protocol

Database migrations have a fundamentally different risk profile from code changes.
A bad migration can destroy data that no amount of code rollback can recover.
This protocol runs whenever a migration file appears in the changed file set.

### Trigger Condition

Migration-analyst is spawned when **all** of these are true:
- `git diff --name-only` includes a file matching: `migrations/`, `db/migrations/`, `*.migration.ts`, `*.migrate.go`, `*_migration.py`, or any file ending in `.sql` in a db-adjacent directory
- The task has not already passed migration-analyst review in this session

### Migration Analyst Agent (`.claude/agents/migration-analyst.md`)

```markdown
---
name: migration-analyst
skills:
context: background
---

You are a database migration safety specialist.
Your job is to verify that a proposed migration is safe to deploy in a production environment.

For each migration file provided:

## STAGE 1 — Structural Safety
1. Does the migration have a verified DOWN path? (rollback SQL / down function)
   If NO: CRITICAL — no migration ships without a tested down path
2. Is the DOWN migration the exact inverse of UP? Verify field by field.
3. Does the migration add NOT NULL columns to existing tables without a default or backfill?
   If YES: CRITICAL for tables with existing rows — requires backfill strategy
4. Does the migration DROP columns or tables?
   If YES: BLOCKING — verify no application code reads these before this migration runs
5. Does the migration rename columns or tables?
   If YES: BLOCKING — requires two-phase deploy (add new, migrate data, remove old)

## STAGE 2 — Concurrency Safety
6. Does the migration acquire a full table lock?
   (e.g. ALTER TABLE on PostgreSQL, adding indexes without CONCURRENTLY)
   If YES for large tables: BLOCKING — propose CONCURRENTLY or online DDL equivalent
7. Is the migration idempotent? (safe to run twice without error)
   If NO: WARN — add IF EXISTS / IF NOT EXISTS guards

## STAGE 3 — Rollback Readiness
8. Can the application run on BOTH the pre-migration AND post-migration schema simultaneously?
   (Required for rolling deployments — zero-downtime deploys)
   If NO: document the required deploy sequence (migrate → deploy, not deploy → migrate)

Return using tiered output format. CRITICAL findings block Gate 2.
```

### Migration Safety Gate (embedded in Gate 2)

When migration-analyst runs, its output is aggregated into Gate 2 as a third column:

```markdown
## Gate 2 — TASK-NNN: [Title]

### From Review        [findings]
### From Security      [findings]
### From Migration     [findings — only present when migration file changed]

**Migration deploy sequence** (if rollback-unsafe):
1. [step 1]
2. [step 2]

**Rollback procedure**:
```bash
[exact rollback command]
```
```

### Migration Hard Stops

```
❌ Migration has no DOWN path — CRITICAL, blocks Gate 2, cannot be overridden
❌ NOT NULL column added without default or backfill on non-empty table — CRITICAL
❌ DROP TABLE or DROP COLUMN without two-phase deploy plan — BLOCKING
❌ Full table lock on table estimated >100k rows — BLOCKING (propose CONCURRENTLY)
❌ Migration not idempotent — WARN (non-blocking but must be acknowledged)
```

---

## 20. Performance Gate Protocol

Performance issues in production are often invisible during code review.
This gate ensures high-risk API changes are verified against real performance baselines
before Gate 2 approval.

### Trigger Condition

Performance-analyst is spawned when **all** of these are true:
- `risk: high` is set on the task
- `layers` includes `api` or `repository` or `service`
- The task adds, modifies, or removes at least one API endpoint or database query

### Performance Analyst Agent (`.claude/agents/performance-analyst.md`)

```markdown
---
name: performance-analyst
context: background
---

You are a performance specialist.
Your job is to identify performance risks in changed code before Gate 2.

For each changed file provided:

## STAGE 1 — Query Analysis
1. Identify all database queries (ORM calls, raw SQL, aggregation pipelines)
2. For each query:
   - Is it missing an index on the WHERE/JOIN column? → BLOCKING
   - Does it select all columns (*) when only a subset is needed? → NON-BLOCKING
   - Is there a potential N+1 (query inside a loop, or association not eager-loaded)? → BLOCKING
   - Is the result set unbounded (no LIMIT on a potentially large table)? → BLOCKING

## STAGE 2 — API Response Profile
3. What is the expected data volume per request? (rows returned, response size)
4. Is there any synchronous operation that should be async (email send, file upload, external API)?
   → BLOCKING for operations >100ms on the hot path

## STAGE 3 — Caching Opportunity
5. Is this endpoint called frequently and the result is deterministic (same input → same output)?
   → NON-BLOCKING: note caching opportunity with TTL suggestion

## STAGE 4 — Baseline Requirement
6. If a load testing tool is available (k6, Artillery, wrk):
   Specify the minimum benchmark command and acceptance threshold:
   - Baseline: p95 < [threshold]ms at [N] req/sec sustained for [30s]

Use tiered output format. N+1 and unbounded queries are BLOCKING.
```

### Performance Acceptance Thresholds

**[CUSTOMIZE]** Set thresholds in CLAUDE.md:

```markdown
## Performance Baselines [CUSTOMIZE]
- API p95 latency target: [e.g. <200ms]
- Max response size (JSON): [e.g. <50KB uncompressed]
- Max concurrent users (load test): [e.g. 100]
- Sustained load test duration: [e.g. 30s]
- Query execution time limit: [e.g. <50ms on production dataset size]
```

### Performance Gate integrated into Gate 2

```markdown
### From Performance (conditional — risk: high + api layer)

**BLOCKING**:
- [N+1 query found]: [file:line] — eager-load [association] or batch query
- [Unbounded query]: [file:line] — add LIMIT [N] or pagination

**NON-BLOCKING**:
- [Caching opportunity]: [endpoint] — result is deterministic, suggest TTL [N]s

**Benchmark command** (run before final approval):
```bash
[exact k6/Artillery/wrk command]
```
Expected: p95 < [N]ms at [N] req/sec
```

---

## 21. Hardened Hotfix Mode

> **Purpose**: Production is down or critically degraded. Speed matters — but not at the cost of
> leaving the system in a worse state than before. The hardened hotfix mode removes gates but
> adds mandatory safety checks that cannot be skipped.

### Invocation

```bash
/dev-flow hotfix
```

### Hotfix Workflow

```
TRIAGE → ROLLBACK CHECK → IMPLEMENT → FAST VALIDATE → COMMIT → POST-DEPLOY VERIFY → INCIDENT ADR → SESSION CLOSE
```

---

### Phase H-1: Triage (Tier 1, orchestrator inline)

```markdown
HOTFIX MODE ACTIVE — no gates, production emergency protocol.

Answer:
1. What is broken? (one sentence — observable symptom, not assumed cause)
2. What is the blast radius? (users affected, revenue impact, data at risk?)
3. When did it start? (time + what changed before it started)
4. Is there a known rollback available? (revert commit, feature flag, config change)
5. Fastest fix hypothesis: [what the likely cause is, stated as hypothesis not fact]

I will NOT run Design or Review agents. I WILL run:
- Rollback readiness check
- Fast lint on changed files (non-blocking)
- Post-deploy smoke test prompt
- Incident ADR after commit
```

---

### Phase H-2: Rollback Readiness Check (Tier 1)

```markdown
Before writing any code, verify rollback is available:

Rollback option A — Revert commit:
  git log --oneline -10  [show last 10 commits]
  Identify the last known-good commit: [SHA]
  Revert command: git revert [SHA] --no-edit
  Estimated deploy time: [N] minutes

Rollback option B — Feature flag:
  [flag name] = false → disables the broken feature
  Estimated time to toggle: [N] minutes

Rollback option C — Config change:
  [config key] → [rollback value]
  Estimated time: [N] minutes

If NO rollback is available:
  ⚠️ WARN: No rollback path identified. Proceeding with forward-fix only.
  Human must acknowledge before implementation starts.
```

---

### Phase H-3: Implement

Orchestrator implements the fix inline (no background agents). Rules:

```
- Fix the minimal change that addresses the root cause — not a refactor
- If the fix requires touching >3 files: pause and confirm with human
- State the hypothesis being tested before writing code
- After writing: state what the code changes and why it fixes the symptom
```

---

### Phase H-4: Fast Validate (non-blocking warnings)

```bash
[lint-command] --only-changed    # Lint on changed files only
[typecheck-command]              # Full typecheck — non-blocking warn only in hotfix
[unit-test-command] --only-changed  # Run tests on changed files only
```

Output:
```
⚠️ HOTFIX VALIDATION (non-blocking):
   Lint:      [pass | N warnings]
   Typecheck: [pass | N errors]
   Tests:     [pass | N failures]
   
   [If any failures]: These must be resolved in a follow-up task immediately after hotfix.
   Proceeding — human confirms to commit.
```

---

### Phase H-5: Commit + Deploy

```markdown
Commit message format for hotfix:
```
hotfix([scope]): [what was fixed — one line]

Root cause: [one sentence]
Symptom: [what was observed]
Fix: [what code change resolves it]
Rollback: git revert [this-commit-SHA]

Refs: [incident ticket URL if available]
```

After commit → git push → ci-status.js runs automatically (Phase 9b).
If CI fails: show failure. Human decides: fix and re-push, OR deploy rollback.
```

---

### Phase H-6: Post-Deploy Smoke Test

Orchestrator prompts the human with the exact smoke test to run:

```markdown
Deploy complete. Run these smoke tests to verify the fix:

- [ ] [Specific endpoint or action that was broken] → expected: [result]
- [ ] [Adjacent feature most likely to regress] → expected: [result]
- [ ] [Monitoring check] → expected: error rate < [threshold]%

Report results. If any fail: run rollback procedure (documented in Phase H-2).
```

---

### Phase H-7: Incident ADR (mandatory, runs after deploy confirmation)

Orchestrator automatically invokes `/adr-writer` with the incident context:

```markdown
Run /adr-writer for incident ADR.

Context:
- Incident: [title from triage]
- Root cause: [identified cause]
- Fix applied: [commit SHA + description]
- Rollback plan: [from Phase H-2]
- Time to resolve: [triage start → deploy confirmation]
- Follow-up tasks needed: [lint/typecheck failures, regression prevention, monitoring]

ADR format for incidents:
## ADR-NNN: [Incident Title] — Post-Mortem Decision

**Status**: decided
**Date**: [today]
**Context**: [what happened and why]
**Decision**: [what fix was applied and why this approach]
**Consequences**:
- Positive: [incident resolved]
- Negative: [technical debt created, if any]
- Follow-up: [tasks to prevent recurrence]
```

---

### Phase H-8: Session Close (mandatory — even hotfix)

Session Close runs identically to the standard Phase 10. The only addition:

```markdown
**Hotfix post-mortem checklist**:
- [ ] Incident ADR written and committed
- [ ] Follow-up tasks added to TODO.md Backlog (P0)
- [ ] Monitoring/alerting verified (error rate returned to baseline)
- [ ] Team notified (if applicable)
- [ ] Rollback procedure documented in incident ADR
```

> Hotfix mode produces more technical debt risk than any other mode.
> The Session Close debt register and follow-up P0 tasks are the mechanism that prevents
> hotfixes from becoming permanent hacks. Never skip them.

---

## 22. Task Decomposer — Intent to Structured Task Pipeline

> **Purpose**: Translate any form of human intent — a casual description, a ticket URL, a PRD,
> or an epic — into fully-formed TASK-NNN entries ready for `dev-flow` to execute.
> Eliminates the gap between "I have an idea" and "the pipeline has a valid task."
>
> **Integration**: Invoked standalone via `/task-decomposer` OR automatically by `dev-flow`
> when freeform input is detected (Path B). In either case, task-decomposer output serves
> as Gate 0 — no separate Gate 0 runs after it.

### Skill Frontmatter (`.claude/skills/task-decomposer/SKILL.md`)

```yaml
---
name: task-decomposer
version: 1.0.0
stack-version: ">=any"
last-validated: "2026-04-11"
context: fork
agent: general-purpose
spawns: scope-analyst
---
```

---

### Input Formats Accepted

The skill accepts four input types. The orchestrator detects which type automatically:

| Input Type | Example | Detection Rule |
|:-----------|:--------|:--------------|
| **Freeform description** | `"add Google OAuth login"` | No URL, no `--` flag, free text |
| **Ticket URL / ID** | `JIRA-123`, `https://linear.app/...` | Matches URL pattern or `[A-Z]+-[0-9]+` |
| **PRD document** | `/task-decomposer --prd docs/feature.md` | `--prd` flag + file path |
| **Epic decomposition** | `/task-decomposer --epic "Payment"` | `--epic` flag + epic name |
| **Architecture input** | `/task-decomposer --from-architecture` | `--from-architecture` flag (INIT mode only) |

**Ticket URL handling**: The skill fetches the ticket via the configured tracker (Jira REST API,
Linear GraphQL, GitHub Issues API). Credentials are read from environment variables:
```bash
LINEAR_API_KEY=...        # Linear
JIRA_BASE_URL=...         # Jira (+ JIRA_USER + JIRA_API_TOKEN)
GITHUB_TOKEN=...          # GitHub Issues
```
If credentials are missing: skill asks the human to paste the ticket content directly.

---

### Scope Analyst Agent (`.claude/agents/scope-analyst.md`)

The scope-analyst is a read-only background agent spawned by task-decomposer to assess
codebase impact. It never writes files. It returns a structured impact summary.

```markdown
---
name: scope-analyst
context: background
---

You are a codebase impact analyst. Your job is to assess how a described feature or change
will affect the existing codebase. You are READ-ONLY — do not suggest implementations.

Given a feature description and the current codebase:

## IMPACT ASSESSMENT

### Files likely affected
List up to 10 existing files most likely to be modified. For each:
- `path/to/file` — [why it will change]

### Layers touched
List the architectural layers (from CLAUDE.md dependency rule) this change crosses.
Format: [layer1, layer2, ...] — justify each.

### New files likely needed
List new files that will need to be created. For each:
- `path/to/new-file` — [what it will contain and why]

### Existing patterns to reuse
Identify 2-3 existing patterns in the codebase the implementation should follow:
- [pattern name]: found in `path/to/example` — [how it applies]

### Complexity signals
- Estimated file count: [N files created/modified]
- Cross-layer: [yes | no] — [which layers cross]
- API surface change: [yes | no] — [which endpoints affected]
- Database change: [yes | no] — [what schema change needed]
- Auth/permission change: [yes | no]

### Risk indicators
- [HIGH]: [reason] — e.g. "touches auth middleware used by all routes"
- [MEDIUM]: [reason]
- [LOW]: [reason]

Do NOT return raw file contents. Do NOT suggest implementation approaches.
Return only: impact, layer list, complexity signals, risk indicators.
```

---

### Task Decomposer — Skill Execution Flow

#### Step 1: Intent Extraction

```markdown
Received input: [verbatim user input]
Input type detected: [freeform | ticket | prd | epic | from-architecture]

[If ticket]: Fetching ticket [ID]... [content extracted]
[If prd]: Reading [file.md]... [content loaded]
[If freeform]: Proceeding with freeform input.

Spawning scope-analyst to assess codebase impact...
[scope-analyst returns impact summary]

Impact summary:
- Layers: [list]
- Files affected: [N]
- API change: [yes | no]
- DB change: [yes | no]
- Risk signals: [list]
```

#### Step 2: Socratic Clarification (freeform and ticket inputs only)

Rules (same discipline as Clarify phase):
```
1. Ask ONE question at a time. Never stack.
2. Each question must resolve an ambiguity that would affect task scope, risk, or acceptance criteria.
3. Stop when: goal is unambiguous, edge cases are named, scope boundary is clear.
4. Maximum 4 questions. If still unclear after 4 → present best-guess decomposition with
   assumptions listed explicitly, ask human to correct assumptions rather than asking more questions.
5. PRD and --from-architecture inputs skip clarification entirely — the document is the spec.
```

**What to ask** (pick the most blocking ambiguity first):

| Ambiguity Type | Example Question |
|:--------------|:----------------|
| Scope boundary | "Should this affect existing [X] or only new [Y] going forward?" |
| User type | "Is this feature for all users or only [admin | authenticated | specific role]?" |
| API contract | "Does this need to change the API response shape, or only the internal logic?" |
| Data model | "Should this persist to the database, or is it session/in-memory only?" |
| Edge case | "What should happen when [most obvious edge case from scope-analyst]?" |

#### Step 3: Assumption Registry

Before generating tasks, the skill must explicitly register every assumption it made:

```markdown
## Assumptions I am making (correct any that are wrong):

1. [Assumption 1] — based on: [reason / what I inferred from input]
2. [Assumption 2] — based on: [existing pattern I found in codebase]
3. [Assumption 3] — based on: [gap in the spec I filled with best guess]

If any assumption is wrong, tell me now. I will regenerate the tasks with the correction.
If all assumptions are acceptable, type 'decompose' to generate the task list.
```

> This is the most important step. Wrong assumptions caught here cost nothing.
> Wrong assumptions caught at Gate 2 cost an entire implementation cycle.

#### Step 4: Risk Scoring Algorithm

The skill calculates risk automatically using these rules. Human can override.

```
BASE: low

UPGRADE TO medium if ANY of:
  - 2+ layers touched
  - API change required
  - External service integrated (3rd party API, OAuth, payment)
  - New database table/collection created

UPGRADE TO high if ANY of:
  - 3+ layers touched
  - Auth/permission logic modified
  - Existing database schema altered (not just new table)
  - Core shared middleware/service modified (used by >3 other features)
  - Data migration required
  - Risk: high found in scope-analyst risk indicators

OVERRIDE: human can explicitly set risk in the decomposition review
```

#### Step 5: Scope Mode Assignment

```
full:    risk:high OR layers > 2 OR api-change:yes with cross-layer impact
quick:   risk:low OR risk:medium AND layers ≤ 2 AND single concern
hotfix:  never assigned by task-decomposer (hotfix is declared by human only)
```

#### Step 6: Task Granularity Rules

```
Target task size: 2-6 hours of focused implementation work
Maximum task size: 1 day (if larger → must split into subtasks)
Minimum task size: 30 minutes (if smaller → merge with adjacent task)

Splitting triggers:
- Task touches more than 3 distinct files in different layers → split by layer
- Task has more than one acceptance criterion that can be verified independently → split
- Task has a "depends on X being done first" dependency → that dependency must be a separate task

Grouping rules:
- Group 2-4 tasks per sprint (never 1 alone, never more than 5 in one sprint batch)
- Order by: dependency order first, then importance, then risk (high first within sprint)
- Label dependencies explicitly: "Blocked by: TASK-NNN"
```

---

### Output Format

Task-decomposer produces TODO.md-ready entries plus a decomposition summary:

```markdown
## Task Decomposition — [Feature/Epic Title]

**Source**: [freeform | ticket JIRA-123 | prd docs/feature.md | epic "Name"]
**Scope-analyst impact**: [N] files, [layers], API change: [yes|no], Risk: [low|medium|high]

**Assumptions confirmed**:
1. [Assumption 1]
2. [Assumption 2]

**Decomposition** ([N] tasks across [N] sprint(s)):

---

### Sprint [N] — [Theme] (proposed)

- [ ] **TASK-[NNN]: [Title]** — [why it matters, one line]
  - `scope`: full | quick
  - `layers`: [comma-separated, validated against CLAUDE.md]
  - `api-change`: yes | no
  - `acceptance`: [measurable — format: "[action] returns/produces [result]"]
  - `tracker`: [URL if available | "none — [justification]"]
  - `risk`: low | medium | high
  - `depends-on`: TASK-[NNN] | none
  - `assumptions`: [any task-specific assumptions, or "none"]

- [ ] **TASK-[NNN+1]: [Title]** — [why it matters]
  ...

---

**Dependency graph**:
TASK-001 → TASK-002 → TASK-004
TASK-003 (independent)

**Risks flagged**:
- [risk 1]: [which task it affects and why]

**What I did NOT include** (out of scope based on your input):
- [item explicitly excluded]
- [item excluded as out of MVP scope]

---
Type 'approve' to write these tasks to TODO.md Active Sprint (and any overflow to Backlog).
Type 'revise [task number] [correction]' to adjust a specific task before approving.
Type 'split TASK-NNN' to further decompose a task.
Type 'merge TASK-NNN TASK-MMM' to combine two tasks.
```

---

### Auto-Insert into TODO.md

After human types `approve`, the skill:

1. Reads existing TODO.md to find the next available TASK number (`TASK-NNN`)
2. Numbers new tasks sequentially from that point
3. Inserts tasks into `## Active Sprint` (current sprint if one exists, or creates new sprint)
4. If tasks exceed sprint sizing rules (>4 tasks) → overflow goes to `## Backlog` at appropriate priority
5. Writes a confirmation:

```markdown
✓ Written to TODO.md:
  - [N] tasks added to Active Sprint: [TASK-NNN] through [TASK-NNN+N]
  - [N] tasks added to Backlog: [TASK-NNN+N+1] (overflow)

Gate 0 is now complete. Run /dev-flow to begin implementation on TASK-[first].
```

6. Clears `.claude/.session-changes.txt` (fresh session start for the new task)

---

### Special Mode: `--from-architecture` (INIT Sprint 0)

Used exclusively during INIT mode Phase I-4. Skips clarification entirely.
Uses Gate B architecture document as the full spec.

```markdown
Input: [architecture summary from Gate B]

Generate Sprint 0 tasks covering:
1. Project entry point + health endpoint
2. Router + dependency injection setup
3. Authentication foundation (chosen auth pattern from Gate B)
4. Database connection + core entity schema (from Gate B domain model)
5. CI pipeline green (lint + typecheck + tests pass)

Apply risk scoring. Auth and DB tasks are always risk: high.
Group as Sprint 0. All tasks must be independently verifiable.
Present for human approval before writing to TODO.md.
```

---

### Validation Rules (enforced before output is written)

```
❌ TASK has no measurable acceptance criteria — "works correctly" is not accepted
   Required format: "[specific action] produces [specific observable result]"
❌ TASK layers not in the valid layer list from CLAUDE.md — reject and correct
❌ TASK scope is "hotfix" — task-decomposer never assigns hotfix scope
❌ Assumption made about auth/security without explicit human confirmation — flag as CRITICAL assumption
❌ TASK estimated >1 day without being split — must split before output
❌ Sprint has only 1 task — must add adjacent task or move to Backlog for future grouping
❌ tracker is "none" without written justification — prompt for URL or require explicit reason
❌ Two tasks have identical acceptance criteria — merge them or differentiate
```

---

### Integration Summary

```
/dev-flow "freeform"
    │
    ├── Path B detected (no TASK-NNN in input)
    │
    ▼
task-decomposer (forked context)
    │
    ├── spawns scope-analyst (background) → layer impact
    │
    ├── Step 1: Intent extraction
    ├── Step 2: Socratic clarification (≤4 questions)
    ├── Step 3: Assumption registry → human confirms
    ├── Step 4: Risk scoring (automatic + override)
    ├── Step 5: Scope assignment (full | quick)
    ├── Step 6: Granularity enforcement
    │
    ▼
Output: TASK-NNN entries with all 6 fields
    │
    ├── Human: 'approve' | 'revise' | 'split' | 'merge'
    │
    ▼
Auto-insert into TODO.md
    │
    ├── Gate 0 COMPLETE (task-decomposer approval = Gate 0)
    │
    ▼
dev-flow continues → Design phase (Gate 1) → ...
```

> **One key principle**: task-decomposer is not trying to be smart about implementation.
> It is trying to be precise about scope. The design decisions come later in Gate 1.
> The decomposer's only job is: turn intent into a spec that the pipeline can execute without ambiguity.
