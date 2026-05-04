---
date: 2026-05-04
sourcing_adr: ADR-021
re_eval_trigger: TASK-116 lands first test files at tests/skill-triggering/
---

# `tests/` directory — empty scaffold deferred

dev-flow does NOT create an empty `tests/` directory at repo root. Empty directories don't survive `git`; first test files land WITH content per TASK-116 (skill-triggering acceptance harness implementation per ADR-016 eval-evidence rule). Premature scaffold has zero value.

**Re-eval when:** TASK-116 promotes to a sprint and lands `tests/skill-triggering/` with PowerShell port of superpowers run-test.sh + 3-skill seed (prime/orchestrator/tdd). Source: `docs/adr/ADR-021-superpowers-patterns.md` § Decision-6 + `docs/research/superpowers-acceptance-harness-2026-05-04.md`.
