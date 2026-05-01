---
name: tdd
description: Use when implementing new behavior that requires tests. Runs behavior-driven TDD — tracer bullet first, then incremental red-green-refactor. Do not use for debugging existing failures; use diagnose instead.
user-invocable: true
argument-hint: "[feature | behavior | interface to implement]"
version: "1.0.0"
last-validated: "2026-05-01"
type: flexible
---

# TDD

Behavior-driven test-driven development. Feedback rate is your speed limit. Vertical slices, not horizontal layers.

---

## Phase 1 — Plan

Before writing any code or tests:
1. Confirm public interface (inputs, outputs, error paths)
2. List behaviors to implement — one per test, ordered by priority
3. Identify the tracer bullet: the thinnest end-to-end slice that proves the system works

Output: numbered behavior list + identified tracer bullet. Await human confirmation.

## Phase 2 — Tracer Bullet

Write ONE test end-to-end that exercises the full path:
- RED: write test → run → must fail; if it passes immediately → test is wrong
- GREEN: write minimum code to pass → run → must pass
- Verify the test covers a real behavior, not an implementation detail

Do not proceed to Phase 3 until tracer bullet is green.

## Phase 3 — Incremental Loop

For each remaining behavior (in priority order):
```
RED    → write test for next behavior → run → must fail
GREEN  → write minimum code to pass → run → must pass
REGRESS → run full suite → all prior tests must still pass
```
One behavior at a time. Never add two tests before the first is green.

## Phase 4 — Refactor

Only after ALL tests are green:
- Clean up duplication, naming, structure
- No behavior changes — structure only
- Run full suite after each refactor step
- If a test breaks during refactor → the refactor changed behavior; revert and reconsider

---

## Test Quality Rules

- Tests use **public interfaces only** — never test internal methods or private state
- Tests must **survive refactoring** — if a refactor breaks a test without changing behavior, the test was testing implementation
- One assertion per behavior — multiple assertions obscure which behavior failed
- Test names describe behavior, not implementation: `"returns 404 when user not found"` not `"test_getUser_null_case"`

---

## Anti-Patterns

| Pattern | Why it fails |
|---|---|
| Horizontal slicing (write all tests, then all code) | Long feedback gap; all tests red until the very end |
| Testing private/internal methods | Tests break on refactor; couples test to implementation |
| Refactoring with red tests | Can't tell if refactor broke something new |
| Skipping tracer bullet | First real integration failure appears late, in a complex state |

---

## Red Flags

❌ **Test passes immediately on first run** — test is not exercising the behavior; strengthen it
❌ **Full suite not run after each GREEN** — regressions hidden until too late
❌ **Refactoring before all tests green** — mixing concerns; stop, go green first
❌ **Testing implementation details** — fragile suite; rewrite test against public interface
