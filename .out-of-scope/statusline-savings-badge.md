---
date: 2026-05-04
sourcing_adr: ADR-020
re_eval_trigger: dev-flow-compress skill has eval coverage AND stable invocation contract
---

# Statusline savings badge contract — adoption deferred

dev-flow does NOT adopt caveman's `CAVEMAN_STATUSLINE_SAVINGS` badge contract (or an equivalent) at this time. Coupling a statusline badge to `dev-flow-compress` requires that skill to be hardened first — it currently lacks eval coverage and a stable invocation contract.

**Re-eval when:** `dev-flow-compress` skill has TASK-115 caveman-style 3-arm eval evidence AND a documented stable invocation surface (e.g., consistent `/dev-flow:compress <file>` shape verified across versions). Source: `docs/adr/ADR-020-caveman-patterns.md` § Decision-6 + Sprint 041 § Open Questions OQ1.
