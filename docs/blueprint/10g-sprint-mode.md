---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: Sprint mode protocol changes
status: current
source: Extracted from 10f-task-decomposer.md §23 (TASK-099)
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
