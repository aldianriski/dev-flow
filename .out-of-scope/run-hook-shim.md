---
date: 2026-05-04
sourcing_adr: ADR-021
re_eval_trigger: dev-flow hook count crosses 5 OR cross-platform support reconsidered
---

# `run-hook.ps1` shim adoption deferred

dev-flow does NOT adopt the superpowers `run-hook.cmd` polyglot dispatcher pattern. Direct-call `powershell -File <script.ps1>` from `hooks.json` is simpler, fewer indirection layers, more debuggable at current 3-hook scale. superpowers shim solves cross-platform polyglot (cmd+bash); dev-flow is Windows-only per ADR-016.

**Re-eval when:** hook count crosses 5 (current: 3) OR dev-flow reconsiders cross-platform support (currently no roadmap commitment). Source: `docs/adr/ADR-021-superpowers-patterns.md` § Decision-3 + `docs/research/superpowers-run-hook-shim-2026-05-04.md`.
