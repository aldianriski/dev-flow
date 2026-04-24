---
owner: Tech Lead
last_updated: 2026-04-24
update_trigger: Architectural decision made or reversed
status: current
---

# dev-flow — Decision Log

Append-only. Never edit past ADRs. Use `/adr-writer` to add entries.

---

## ADR-001: Python + stdlib for eval harness; three-arm methodology

**Date**: 2026-04-24
**Status**: decided
**Context**: TASK-033 requires an offline skill eval harness. The project's existing scripts are CommonJS Node; adding a Python script introduces a new language. Eval harness needs no shared code with Node harness, so isolation cost is low. Python's `json`, `re`, `pathlib` cover all metric computation needs without external deps.
**Decision**: Python 3.10+ with stdlib only (`json`, `sys`, `re`, `pathlib`). Lint gate: `python -m py_compile`. Three-arm methodology (baseline / terse_control / skill) adopted from caveman eval harness pattern — `terse_control` arm isolates skill signal from pure brevity pressure, preventing brevity-only prompts from scoring as high-quality skill improvements.
**Alternatives considered**:
- Node.js (matched existing scripts) — rejected: no eval-specific advantage, Python is more natural for data-comparison scripts
- External deps (pandas, pytest) — rejected: violates zero-external-deps constraint for harness scripts
**Consequences**: Python skills must be verified before use in Windows Git Bash + Linux environments. `measure.py` is isolated under `evals/` — no cross-dependency with `.claude/scripts/`.
