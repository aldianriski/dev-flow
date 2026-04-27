---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); split from 10-modes.md (TASK-059)
---

## §22 — Task Decomposer — Intent to Structured Task Pipeline

> **Purpose**: Translate any form of human intent into fully-formed TASK-NNN entries.
> Eliminates the gap between "I have an idea" and "the pipeline has a valid task."
> Task-decomposer output serves as Gate 0 — no separate Gate 0 runs after it.

### Input Formats Accepted

| Input Type | Example | Detection Rule |
|:-----------|:--------|:--------------|
| **Freeform description** | `"add Google OAuth login"` | No URL, no `--` flag |
| **Ticket URL / ID** | `JIRA-123` | Matches URL or `[A-Z]+-[0-9]+` |
| **PRD document** | `--prd docs/feature.md` | `--prd` flag + file path |
| **Epic decomposition** | `--epic "Payment"` | `--epic` flag + epic name |
| **Architecture input** | `--from-architecture` | INIT mode only |

**Ticket URL credentials** (from environment):
```bash
LINEAR_API_KEY=...
JIRA_BASE_URL=...   # + JIRA_USER + JIRA_API_TOKEN
GITHUB_TOKEN=...
```
If credentials missing: skill asks human to paste ticket content directly.

### Scope Analyst Agent (`.claude/agents/scope-analyst.md`)

```markdown
---
name: scope-analyst
---

You are a codebase impact analyst. READ-ONLY — do not suggest implementations.

Given a feature description and the current codebase:

## IMPACT ASSESSMENT

### Files likely affected
Up to 10 existing files most likely to be modified. For each:
- `path/to/file` — [why it will change]

### Layers touched
List the architectural layers (from CLAUDE.md) this change crosses.

### New files likely needed
- `path/to/new-file` — [what it will contain and why]

### Existing patterns to reuse
- [pattern name]: found in `path/to/example` — [how it applies]

### Complexity signals
- Estimated file count: [N files created/modified]
- Cross-layer: [yes | no]
- API surface change: [yes | no]
- Database change: [yes | no]
- Auth/permission change: [yes | no]

### Risk indicators
- [HIGH]: [reason]
- [MEDIUM]: [reason]

Do NOT return raw file contents. Do NOT suggest implementation approaches.
```

### Skill Execution Flow

**Step 1: Intent Extraction**
```markdown
Input type detected: [freeform | ticket | prd | epic | from-architecture]
[If ticket]: Fetching ticket [ID]...
Spawning scope-analyst to assess codebase impact...
```

**Step 2: Socratic Clarification** (freeform and ticket only)
```
1. Ask ONE question at a time. Never stack.
2. Each question must resolve an ambiguity affecting task scope, risk, or acceptance criteria.
3. Stop when: goal is unambiguous, edge cases are named, scope boundary is clear.
4. Maximum 4 questions. After 4 → present best-guess decomposition with explicit assumptions.
5. PRD and --from-architecture inputs skip clarification entirely.
```

**Step 3: Assumption Registry**
```markdown
## Assumptions I am making (correct any that are wrong):

1. [Assumption 1] — based on: [reason]
2. [Assumption 2] — based on: [existing pattern in codebase]

If any assumption is wrong, tell me now. If all acceptable, type 'decompose'.
```

**Step 4: Risk Scoring Algorithm**
```
BASE: low

UPGRADE TO medium if ANY of:
  - 2+ layers touched
  - API change required
  - External service integrated
  - New database table/collection created

UPGRADE TO high if ANY of:
  - 3+ layers touched
  - Auth/permission logic modified
  - Existing database schema altered
  - Core shared middleware modified (used by >3 other features)
  - Data migration required
```

**Step 5: Scope Mode Assignment**
```
full:    risk:high OR layers > 2 OR api-change:yes with cross-layer impact
quick:   risk:low OR risk:medium AND layers ≤ 2 AND single concern
hotfix:  never assigned by task-decomposer (hotfix is declared by human only)
```

**Step 6: Task Granularity Rules**
```
Target task size: 2-6 hours of focused implementation work
Maximum task size: 1 day (if larger → must split)
Minimum task size: 30 minutes (if smaller → merge with adjacent task)

Splitting triggers:
- Task touches more than 3 distinct files in different layers → split by layer
- Task has more than one independently verifiable acceptance criterion → split
- Task has a "depends on X" dependency → that dependency must be a separate task

Grouping rules:
- Group 2-5 tasks per sprint (never 1 alone, never more than 5)
- Order by: dependency first, then importance, then risk (high first)
```

### Output Format

```markdown
## Task Decomposition — [Feature/Epic Title]

**Source**: [freeform | ticket JIRA-123 | prd docs/feature.md | epic "Name"]
**Scope-analyst impact**: [N] files, [layers], API change: [yes|no], Risk: [low|medium|high]

**Assumptions confirmed**:
1. [Assumption 1]

**Decomposition** ([N] tasks across [N] sprint(s)):

---

### Sprint [N] — [Theme] (proposed)

- [ ] **TASK-[NNN]: [Title]** — [why it matters, one line]
  - `scope`: full | quick
  - `layers`: [comma-separated, validated against CLAUDE.md]
  - `api-change`: yes | no
  - `acceptance`: [measurable — "[action] returns/produces [result]"]
  - `tracker`: [URL if available | "none — [justification]"]
  - `risk`: low | medium | high
  - `depends-on`: TASK-[NNN] | none
  - `assumptions`: [task-specific assumptions, or "none"]

---

**Dependency graph**:
TASK-001 → TASK-002 → TASK-004
TASK-003 (independent)

**What I did NOT include** (out of scope based on your input):
- [item explicitly excluded]

---
Type 'approve' to write these tasks to TODO.md Active Sprint.
Type 'revise [task number] [correction]' to adjust a specific task.
Type 'split TASK-NNN' to further decompose a task.
Type 'merge TASK-NNN TASK-MMM' to combine two tasks.
```

### Auto-Insert into TODO.md

After human types `approve`, the skill:
1. Reads existing TODO.md to find the next available TASK number
2. Numbers new tasks sequentially from that point
3. Inserts tasks into `## Active Sprint` (or creates new sprint)
4. If tasks exceed sprint sizing rules (>5 tasks) → overflow goes to `## Backlog`
5. Clears `.claude/.session-changes.txt`

### Validation Rules (enforced before output is written)

```
❌ TASK has no measurable acceptance criteria — "works correctly" is not accepted
❌ TASK layers not in the valid layer list from CLAUDE.md — reject and correct
❌ TASK scope is "hotfix" — task-decomposer never assigns hotfix scope
❌ Assumption made about auth/security without explicit human confirmation — flag as CRITICAL
❌ TASK estimated >1 day without being split — must split before output
❌ Sprint has only 1 task — must add adjacent task or move to Backlog
❌ tracker is "none" without written justification — prompt for URL or explicit reason
❌ Two tasks have identical acceptance criteria — merge them or differentiate
```

---

## §23 — Sprint Mode

Entry: `/dev-flow sprint`

Runs all `[ ]` tasks in Active Sprint sequentially with a single Gate 2 per phase. Designed for batching low-risk work without losing gate discipline.

### Weight Scoring

| Field | Score |
|:------|:------|
| `scope:quick` | 1 |
| `scope:full` | 3 |
| `risk:low` | 0 |
| `risk:medium` | 1 |
| `risk:high` | 2 |

Task weight = scope score + risk score. Total = sum across all open tasks.

### Phase Classification

| Total weight | Behavior |
|:-------------|:---------|
| ≤ 6, no blocked tasks | Single-phase — all tasks sequentially, one Gate 2 |
| 7–12 | Two-phase — lighter tasks in Phase 1; await `run` before Phase 2 |
| Any `scope:full` + `risk:high` task | Blocked — listed separately, removed from phase plan |

### Sprint Plan output (Step 2)

```
## Sprint N Plan — [Sprint Name]
**Tasks scored**:
| Task | Title | Scope | Risk | Weight |
**Total weight**: N → [single-phase | two-phase | blocked]
**Phase 1**: [task list]
**Phase 2** (if two-phase): [task list]
**Blocked — run standalone**: [tasks or "none"]
Type 'run' to execute Phase 1, or provide corrections.
```

### Execution (Step 3)

**Context gate (hard stop)**: Before entering each phase, estimate turn count. If ≥28 turns (≈70% of 40-turn budget), prune prior phase to 3-bullet summary before proceeding.

Per task: Gate 0 → Implement → Validate → Test → mark `[x]` in TODO.md.
Single Gate 2 at end of phase covers all tasks in that phase.

### Sprint Phase Complete prompt (after final-phase Gate 2, before commit)

```
## Sprint Phase [N] Complete — [Sprint Name]
**Blocked tasks** (not yet run — scope:full + risk:high):
  - TASK-NNN: [Title] (scope: full | risk: high)
  — "none" if no blocked tasks remain
**Context estimate**: ~[N] turns used · ~[N] turns remaining
**Commit style**:
  `commit-each`   — one commit per completed task (sequential Phase 9 per task)
  `commit-sprint` — single commit covering all sprint work

Type `next-blocked TASK-NNN` to run a blocked task in full mode now,
     `commit-each` or `commit-sprint` to proceed to Phase 9, or
     `done` to run Phase 10 Session Close without committing.
```

**`next-blocked TASK-NNN`**: full-mode Gate 0 → implement → Phase 9 for that task → return to this prompt.
**`commit-each`**: Phase 9 runs once per completed task; separate commit message per task.
**`commit-sprint`**: Phase 9 runs once; commit message covers all completed sprint tasks.
**`done`**: Phase 10 Session Close immediately (work remains uncommitted).

---

### Special Mode: `--from-architecture` (INIT Sprint 0)

Used exclusively during INIT mode Phase I-4. Skips clarification. Uses Gate B architecture document as the full spec.

```markdown
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
