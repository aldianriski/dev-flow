---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Mode added/removed; gate added/removed; phase contract changes; orchestrator SKILL.md mode-table changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §3 (split TASK-004); refreshed Sprint 051b T5.5 to align with current 4-mode/2-gate model (was 6-mode/3-gate; CONTEXT.md + orchestrator SKILL.md authoritative)
---

# Blueprint §3 — Workflow Phases

dev-flow uses a 4-mode workflow with 2 gates. The mode is selected by `/orchestrator` either explicitly (`/orchestrator mvp`) or via dispatch rules (freeform input → `task-decomposer` → `quick`; active task in TODO → `quick` default). Authoritative mode + gate definitions live in [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md) § Modes / § Gates; this file describes phase mechanics per mode.

---

## Modes

| Mode | Gates | Use when | Auto-loop |
|:-----|:------|:---------|:----------|
| `init` | none | First-time scaffold — no `.claude/` exists | no |
| `quick` | G1 | Single task, S size (≤2h), low risk | no |
| `mvp` | G1 + G2 | Feature work, M+ size (≤1d), multi-task | no |
| `sprint-bulk` | G1 + G2 (batched once per sprint) | Multi-task sprint; auto-loops Active Sprint tasks | yes |

---

## Gates

| Gate | Required in | Owner | Purpose |
|:-----|:-----------|:------|:--------|
| **G1 Scope** | `quick` + `mvp` + `sprint-bulk` | Human | Confirm goal, size, constraints, red flags before implementation |
| **G2 Design** | `mvp` + `sprint-bulk` | Human | Approve `design-analyst` plan before implementation; BLOCKED finding halts |

Full G1 + G2 checklists → [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md) § Gates.

---

## Phases per Mode

### init
1. Check `.claude/` doesn't exist — if it does, stop and ask.
2. Run `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js` (canonical scaffold per ADR-028). Stack preset prompt wires lint + typecheck commands.
3. Confirm with human → done.

### quick
1. **Parse** — restate task as verifiable goal; confirm with human in one line.
2. **G1 Scope** — checklist; BLOCK on any fail.
3. **Implement** — execute task; flag scope creep immediately.
4. **Review** — propose `code-reviewer`; human approves dispatch (skip for doc-only / delete-only / trivial diffs).
5. **Commit** — structured message.

### mvp
1. **Parse** — restate task as verifiable goal.
2. **G1 Scope** — checklist; size M required; L → split first; BLOCK on fail.
3. **Grill** *(if requirements unclear)* — one question at a time; offer recommended answer; explore codebase before asking; stop when goal is unambiguous.
4. **G2 Design** — auto-dispatch `design-analyst`; BLOCK on BLOCKED finding; hard-to-reverse decision → dispatch `adr-writer`.
5. **Implement** — execute design-analyst's micro-task list in order; mark each `[x]` when verification passes.
6. **Review** — propose `code-reviewer`; human approves.
7. **Commit** — structured message; propose `performance-analyst` / `migration-analyst` if applicable.

### sprint-bulk
1. **Sprint Scope Batch (G1 once)** — combined goal, sprint-wide red flags; BLOCK on fail.
2. **Sprint Design Batch (G2 once)** — scope-analyst + design-analyst on full task list; emit session-scoped sprint-PRD.
3. **Overlap gate** — pairwise FILES_AFFECTED intersection; all pairs empty → parallel-eligible; else sequential (default).
4. **Auto-loop** — iterate `[ ]` tasks; per-task Implement + propose code-reviewer + Commit + mark `[x]`.
5. **First-blocker halt** — stop on BLOCKED/CRITICAL or human `block`; report and wait.
6. **Sprint close** — all `[x]` → run `/lean-doc-generator` Sprint Close + prompt `/release-patch`.

---

## Agent Dispatch

| Agent | Trigger | Type |
|:------|:--------|:-----|
| `design-analyst` | G2 in `mvp` + sprint-bulk | auto |
| `code-reviewer` | Post-implement | propose → human approves |
| `scope-analyst` | G1 if size unclear | auto |
| `performance-analyst` | api/db/hot-path + high risk | propose → human approves |
| `migration-analyst` | DB schema change detected | propose → human approves |
| `security-analyst` | Never same context — separate `/security-review` session | user-invoked only |

Full agent roster → [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md) § Agent Roster.

---

## Hard Stops

The orchestrator MUST halt and report (never silently continue) on:

- ❌ **G1 skipped** — unconfirmed scope causes regressions; no exceptions
- ❌ **Size L not split in mvp** — un-reviewable
- ❌ **CRITICAL finding not resolved** — requires explicit human override
- ❌ **Grill skipped on ambiguous requirements** — builds wrong thing
- ❌ **Security run in same session** — context contamination
- ❌ **CLAUDE.md / SKILL.md / agent line caps exceeded** — trim before proceeding (per CLAUDE.md DoD)

---

## Cross-References

- Outer session pattern (where modes fit) → [`12-session-workflow.md`](12-session-workflow.md)
- Per-phase prompt templates → [`08-orchestrator-prompts.md`](08-orchestrator-prompts.md)
- Authoritative mode + gate definitions → [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md)
- Full orchestrator skill → [`skills/orchestrator/SKILL.md`](../../skills/orchestrator/SKILL.md) + [`skills/orchestrator/references/phases.md`](../../skills/orchestrator/references/phases.md)
