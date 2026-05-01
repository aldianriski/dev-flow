# dev-flow Phase Reference

Loaded on demand from `dev-flow/SKILL.md`.

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
