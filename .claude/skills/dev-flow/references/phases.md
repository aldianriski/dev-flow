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

```
## Session Close — [task] — [date]
docs touched: <file> | <change>
TODO.md: task marked [x] | changelog row added
next: <next open task or "sprint complete — run /dev-flow rotate">
```

Sprint complete path: all tasks `[x]` → tell user to run `/dev-flow rotate` next session.
