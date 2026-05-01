---
name: dev-flow
description: Use when starting, resuming, or completing any development task. Orchestrates gate-driven agentic workflow — init, quick, and mvp modes — with G1 Scope and G2 Design gates.
user-invocable: true
argument-hint: "[mode] [task-or-description]"
version: "2.0.0"
last-validated: "2026-05-01"
type: rigid
---

# dev-flow

Gate-driven agentic workflow. Read `CONTEXT.md` before acting.

---

## Mode Dispatch

| Mode | Gates | Use when |
|---|---|---|
| `init` | none | first-time scaffold — no `.claude/` exists |
| `quick` | G1 | single task, S size, low risk |
| `mvp` | G1 + G2 | feature work, M+ size, multi-task |

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
4. **Review** — auto-dispatch `code-reviewer`
5. **Commit** — structured message (see `references/phases.md`)

### mvp
1. **Parse** — restate task as verifiable goal
2. **G1 Scope** — run checklist; size M required; L → split first; BLOCK if fail
3. **Grill** *(when requirements unclear)* — one question at a time; offer recommended answer; explore codebase before asking; stop when goal is unambiguous
4. **G2 Design** — auto-dispatch `design-analyst`; BLOCK on `BLOCKED` finding; hard-to-reverse decision → dispatch `adr-writer`
5. **Implement** — execute micro-tasks from design-analyst plan in order; mark each `[x]` when verification passes
6. **Review** — auto-dispatch `code-reviewer`
7. **Commit** — structured message; propose `performance-analyst` / `migration-analyst` if applicable

---

## Agent Dispatch

| Agent | Trigger | Type |
|---|---|---|
| `design-analyst` | G2 in `mvp` | auto |
| `code-reviewer` | post-implement always | auto |
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
