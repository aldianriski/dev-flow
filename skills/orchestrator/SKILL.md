---
name: orchestrator
description: Use when starting, resuming, or completing any development task or sprint. Orchestrates gate-driven agentic workflow — init, quick, mvp, and sprint-bulk modes — with G1 Scope and G2 Design gates. Do not use for non-task work — use /zoom-out for orientation, /diagnose for debugging, /refactor-advisor for code-smell sweeps.
user-invocable: true
argument-hint: "[mode] [task-or-description]"
version: "2.0.0"
last-validated: "2026-05-03"
type: rigid
---

# orchestrator

Gate-driven agentic workflow. Read `CONTEXT.md` before acting.

---

## Mode Dispatch

| Mode | Gates | Use when |
|---|---|---|
| `init` | none | first-time scaffold — no `.claude/` exists |
| `quick` | G1 | single task, S size, low risk |
| `mvp` | G1 + G2 | feature work, M+ size, multi-task |
| `sprint-bulk` | G1 + G2 (batched once per sprint) | multi-task sprint, auto-loop Active Sprint tasks |

> Replaces CC primitives: `init` → CC `/init` · review step → CC `/review` · task tracking → CC TaskCreate/TaskList. See ADR-012.

Freeform input (no mode keyword):
- No active tasks in TODO.md → run `task-decomposer` first
- Active task found → `quick` (default)

---

## Phases

### init
1. Check `.claude/` doesn't exist — if it does, stop and ask
2. Scaffold `CLAUDE.md` + `CONTEXT.md` + `TODO.md` from templates
3. Confirm with human → done

### quick
1. **Parse** — restate task as verifiable goal; confirm with human in one line
2. **G1 Scope** — run checklist (see `references/phases.md`); BLOCK if any fail
3. **Implement** — execute task; flag scope creep immediately
4. **Review** — propose `code-reviewer`; human types `y` to dispatch, `n` to skip (use `n` for doc-only / delete-only / trivial diffs)
5. **Commit** — structured message (see `references/phases.md`)

### mvp
1. **Parse** — restate task as verifiable goal
2. **G1 Scope** — run checklist; size M required; L → split first; BLOCK if fail
3. **Grill** *(when requirements unclear)* — one question at a time; offer recommended answer; explore codebase before asking; stop when goal is unambiguous
4. **G2 Design** — auto-dispatch `design-analyst`; BLOCK on `BLOCKED` finding; hard-to-reverse decision → dispatch `adr-writer`
5. **Implement** — execute micro-tasks from design-analyst plan in order; mark each `[x]` when verification passes
6. **Review** — propose `code-reviewer`; human types `y` to dispatch, `n` to skip (use `n` for doc-only / delete-only / trivial diffs)
7. **Commit** — structured message; propose `performance-analyst` / `migration-analyst` if applicable

### sprint-bulk
1. **Sprint Scope Batch (G1 once)** — combined goal, sprint-wide red flags; BLOCK on fail
2. **Sprint Design Batch (G2 once)** — scope-analyst + design-analyst on full task list; emit session-scoped sprint-PRD block
3. **Overlap gate** — pairwise FILES_AFFECTED intersection; ALL pairs empty → parallel; else sequential (default)
4. **Auto-loop** — iterate `[ ]` tasks; per-task Implement + propose code-reviewer + Commit + mark `[x]`
5. **First-blocker halt** — stop on BLOCKED/CRITICAL or human `block`; report and wait
6. **Sprint close** — all `[x]` → run `/lean-doc-generator` Sprint Close + prompt `/release-patch`

See `references/phases.md` § sprint-bulk Phase for full detail.

---

## Agent Dispatch

| Agent | Trigger | Type |
|---|---|---|
| `design-analyst` | G2 in `mvp` | auto |
| `code-reviewer` | post-implement | propose → human approves |
| `scope-analyst` | G1 if size unclear | auto |
| `performance-analyst` | api/db/hot-path + high risk | propose → human approves |
| `migration-analyst` | DB schema change detected | propose → human approves |
| `security-analyst` | never — separate session | tell user: run `/security-review` |

---

## Skill Dispatch

At G1, look up task `layers` in `references/skill-dispatch.md` → list advisory skills.

---

## Red Flags

❌ **G1 skipped** — unconfirmed scope causes regressions; no exceptions
❌ **Size L not split** — mvp with L-size task is un-reviewable; split first
❌ **CRITICAL finding not resolved** — ships defect; requires explicit human override
❌ **Grill skipped on ambiguous requirements** — builds wrong thing; always grill before G2
❌ **Security run in same session** — context contamination; always separate session
