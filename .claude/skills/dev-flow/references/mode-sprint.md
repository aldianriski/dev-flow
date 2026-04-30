# dev-flow — Sprint Mode

Entry: `/dev-flow sprint`

Runs all `[ ]` tasks in Active Sprint sequentially with a single Gate 2 per phase.

---

## Step 1 — Score all `[ ]` tasks in Active Sprint

| Field | Score |
|:------|:------|
| `scope:quick` | 1 |
| `scope:full` | 3 |
| `risk:low` | 0 |
| `risk:medium` | 1 |
| `risk:high` | 2 |

Task weight = scope score + risk score. Total = sum across all open tasks.

---

## Step 2 — Classify + output Sprint Plan

```
## Sprint N Plan — [Sprint Name]
**Tasks scored**:
| Task | Title | Scope | Risk | Weight | Skills |
|:-----|:------|:------|:-----|:-------|:-------|
| TASK-NNN | [title] | [scope] | [risk] | [N] | [from skill-dispatch.md] |
**Total weight**: N → [single-phase | two-phase | blocked]

**Phase 1**: [task list]
**Phase 2** (if two-phase): [task list]
**Blocked — run standalone**: [tasks where scope:full + risk:high, or "none"]

Type 'run' to execute Phase 1, or provide corrections.
```

Classification rules:
- Total ≤ 6, no blocked tasks → **single-phase** (all tasks sequentially, one Gate 2)
- Total 7–12 → **two-phase** (present split, lighter tasks in Phase 1; await `run` before each phase)
- Any task with `scope:full` + `risk:high` → **HARD STOP** for that task — list as blocked, remove from phase plan

---

## Step 3 — Execute

**Context gate**: Before entering each phase, estimate turn count. If ≥28 turns (≈70% of 40-turn budget), prune prior phase to 3-bullet summary before proceeding.

Per task in the phase: Gate 0 → Implement → Validate → Test. Mark `[x]` in TODO.md after each task passes.
**Before Gate 0 per task** (advisory): look up task `layers` in `skill-dispatch.md` — surface required skills in Gate 0 "Required skills" field.
Single Gate 2 at end of phase aggregates full diff across all tasks in that phase.
After Gate 2 on a non-final phase: output Phase 2 plan and await `run`.
After Gate 2 on the final phase: emit the Sprint Phase Complete prompt before any commit:

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

- `next-blocked TASK-NNN` → full-mode Gate 0 → Phase 9 for that task → return to this prompt
- `commit-each` → run Phase 9 once per completed task in order; separate commit message per task
- `commit-sprint` → run Phase 9 once; commit message covers all completed sprint tasks
- `done` → Phase 10 Session Close immediately (work remains uncommitted)
