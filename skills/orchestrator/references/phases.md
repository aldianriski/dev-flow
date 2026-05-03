# Orchestrator Phase Reference

Loaded on demand from `orchestrator/SKILL.md`.

---

## G1 — Scope Checklist

```
## G1 Scope — [task title]
goal: <verifiable outcome, 1 sentence>
size: S | M | L  (S=≤2h, M=≤1d, L=>1d → BLOCK: split first)
constraints: <list>
layers: <list> → advisory skills: <from skill-dispatch.md>
red flags: none | <list>
status: PASS | BLOCK — <reason>
```

## G2 — Design Checklist *(mvp only)*

```
## G2 Design — [task title]
approach: <≤10 bullets>
design-analyst: DONE | DONE_WITH_CONCERNS | BLOCKED
adr needed: yes | no
status: PASS | BLOCK — <reason>
Type 'proceed' to implement, or provide feedback.
```

---

## Review Gate

```
## Review — [task title]
code-reviewer: DONE | DONE_WITH_CONCERNS | CRITICAL
CRITICAL: <finding> — <file:line>  (no cap)
BLOCKING: <finding> — <file:line>  (max 5)
NON-BLOCKING: <note>
status: PASS | BLOCK
Type 'commit' to proceed, or fix and re-run code-reviewer.
```

---

## Commit Format

```
[type]([scope]): [what changed — one line]

Acceptance: [task acceptance criteria]
Refs: [tracker URL or "none — reason"]
```

---

## Session Close *(after commit)*

Task state written to `TODO.md` only — CC TaskCreate/TaskList not used (ADR-012).

```
## Session Close — [task] — [date]
docs touched: <file> | <change>
TODO.md: task marked [x] | changelog row added
next: <next open task or "sprint complete — run /lean-doc-generator Sprint Close">
```

Sprint complete path: all tasks `[x]` → run `/lean-doc-generator` Sprint Close, then `/lean-doc-generator` Sprint Promote next session.

---

## Orchestrator Output

```
[MODE: quick|mvp]

G1 SCOPE
goal: <verifiable outcome>
size: S|M|L
constraints: <list>
red flags: none | <list>
status: PASS | BLOCK — <reason>

G2 DESIGN (mvp only)
approach: <≤10 bullets>
design-analyst: DONE | DONE_WITH_CONCERNS | BLOCKED
adr needed: yes | no
status: PASS | BLOCK — <reason>

NEXT: <single actionable instruction to human>
```

---

## Design Analyst Output

```
status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

CRITICAL: <issue> — <file:line> — <required fix>  (no cap, show all)
BLOCKING: <issue> — <file:line>  (max 5)
NON-BLOCKING: <brief note>

FILES: <action> | <path> | <why>

MICRO-TASKS:
- [ ] <exact action> in <exact/path>  verify: <runnable command>

DECISIONS: <point> — <options> → <recommendation>

RECOMMENDATION: <one actionable next step, ≤2 sentences>
```

---

## Scope Analyst Output

```
status: DONE | NEEDS_CONTEXT

FILES AFFECTED: <path> — <why>  (max 10)
LAYERS TOUCHED: <list>
NEW FILES: <path> — <what it contains>
PATTERNS TO REUSE: <name> in <path>

size: S | M | L
cross-layer: yes | no
api-change: yes | no
db-change: yes | no
auth-change: yes | no

risk: low | medium | high — <one-sentence rationale>

RECOMMENDATION: <one task or split? — ≤2 sentences>
```

---

## sprint-bulk Phase (mvp-class, batched)

Use when running a multi-task sprint end-to-end. Replaces per-task G1+G2 with a single batched gate pass + auto-loop.

**1. Sprint Scope Batch (G1 once)**
- Read all `[ ]` tasks under `## Active Sprint` in TODO.md.
- Run G1 checklist for the sprint as a whole: combined goal, total size (must be ≤ M when summed; L → split sprint), shared constraints, sprint-wide red flags.
- BLOCK if any sprint-level red flag fails.

**2. Sprint Design Batch (G2 once)**
- Auto-dispatch `scope-analyst` ONCE with the full task list. Expect FILES AFFECTED list per task.
- Auto-dispatch `design-analyst` ONCE with combined task list — produces a session-scoped sprint-PRD block (not written to disk; persistent artifact = separate task).
- BLOCK on any `BLOCKED` finding. Hard-to-reverse decision → dispatch `adr-writer`.

**3. Overlap derivation (parallelism gate)**
- For each task pair `(Ti, Tj)`, compute `FILES_AFFECTED(Ti) ∩ FILES_AFFECTED(Tj)`.
- If ANY pair has non-empty intersection → run sequentially (default).
- If ALL pairs have empty intersection → fan out tasks to parallel subagents.
- Pure set intersection on path strings; no schema change to scope-analyst needed.

**4. Sequential auto-loop (default path)**
- Iterate Active Sprint tasks `[ ]` in declared order.
- Per-task: run Implement → propose `code-reviewer` y/n (per dispatcher dispatch rules; never auto-fire) → Commit → mark `[x]`.
- After each task close, advance to next `[ ]`.

**5. First-blocker halt**
- Halt loop on first of: scope-analyst returns `BLOCKED`, design-analyst returns `BLOCKED`, human types `block` at any task boundary, code-reviewer returns `CRITICAL`.
- Do NOT auto-skip blocked task. Report which task halted, why, and the remaining task list. Wait for human direction.

**6. Sprint close**
- When all tasks are `[x]`: run `/lean-doc-generator` Sprint Close, then prompt for `/release-patch` if version bump applicable.

**Note**: sprint-PRD is session-scoped — emitted as a formatted block in the conversation, never written to disk. Persistent artifact creation is out of scope; separate task if needed.
