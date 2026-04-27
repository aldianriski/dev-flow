---
owner: Tech Lead
last_updated: 2026-04-27
update_trigger: Escalation threshold changed; phase list changed; fence-line with quick revised
status: current
---

# dev-flow — MVP Mode Reference

3-phase lean delivery for prototype/spike work. Load this file when mode = `mvp`.

---

## Phases

| Step | Phase | Key action |
|:-----|:------|:-----------|
| 1 | 0 — Parse | Read TODO.md, extract task fields (same as full/quick) |
| 2 | 3 — Implement | Write minimum code; no design plan required |
| 3 | Gate 2 (minimal) | Lint pass + existing tests still green + commit |
| 4 | 9 — Commit | `git commit` + `set-phase.js clear` |
| 5 | 10 — Session Close | Mandatory — never skip |

Phases skipped: Clarify (1), Design (2), Validate (4), Test (5), Review (6), Security (7), Docs (8).

---

## Gates

| Gate | Enforcement |
|:-----|:------------|
| Gate 0 | **Skip** — no scope confirmation required |
| Gate 1 | **Skip** — no design plan required |
| Gate 2 | Minimal: lint passes + existing tests still green + commit proceeds |

---

## Escalation Threshold

> **HARD STOP: >5 files changed → prompt to upgrade to `quick`**

When the implementation touches more than 5 files, mvp scope has grown beyond
prototype territory. Stop, present the file count, and ask:

```
⚠️ MVP scope exceeded: N files changed (threshold: 5).
Type 'escalate' to restart as /dev-flow quick TASK-NNN,
or 'continue' to proceed in mvp despite the larger scope.
```

---

## What MVP Does NOT Do

- No design-analyst spawn — no architecture review
- No security-analyst spawn — no OWASP scan
- No TDD contract — RED-GREEN-REFACTOR not required
- No new test files mandated — existing tests must stay green, new ones optional
- No lean-doc-generator call — no doc phase
- No Gate 0 scope confirmation — no 'design' prompt

---

## Fence-line vs `quick`

| Dimension | `quick` | `mvp` |
|:----------|:--------|:------|
| Phases | 5 (Parse, Clarify, Gate 0, Implement, Gate 2, Close) | 3 (Parse, Implement, Close) |
| Design | Gate 0 required — scope must be confirmed | None |
| Tests | Existing must pass; new encouraged | Existing must pass; new optional |
| Review / Security | Skipped (quick default) | Skipped |
| File cap | ≤3 files (soft) | ≤5 files (hard stop) |
| Use when | Known scope, ≤3 files, no architecture risk | Proof-of-concept, spike, throwaway prototype |

---

## Skills Loaded

`dev-flow` only. design-analyst, security-analyst, code-reviewer not spawned.
