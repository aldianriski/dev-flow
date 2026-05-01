---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: CC primitive overlap resolved or new overlap identified
status: current
---

# CC Primitive Overlap Audit (v2)

**Decision**: ADR-012 — Replace over Wrap (see `docs/DECISIONS.md`)

---

| CC Primitive | v2 Current Handling | Delta | Status |
|---|---|---|---|
| `/review` slash command | Replaced by `code-reviewer` agent → `pr-reviewer` skill. Auto-dispatched by orchestrator after implementation. | v2 adds: task-context-aware review (knows acceptance criteria), tiered output format (CRITICAL / BLOCKING / NON-BLOCKING / APPROVED), orchestrator-gated flow. CC `/review` provides none of these. | resolved — TASK-087 |
| `TaskCreate / TaskList / TaskUpdate` tools | Replaced by `TODO.md` manual tracking. Sprint-structured, git-tracked. | CC task tools are session-scoped and ephemeral — do not survive context reset or session restart. `TODO.md` is project-scoped, human-readable, sprint-structured. No equivalent session persistence in CC primitives. | resolved — TASK-088 |
| `/init` slash command | Replaced by `dev-flow init` mode. Scaffolds `CLAUDE.md` + `CONTEXT.md` + `TODO.md` from dev-flow templates. | CC `/init` produces a generic `CLAUDE.md` only. `dev-flow init` adds `CONTEXT.md` (shared domain vocabulary) and `TODO.md` (sprint tracker) — both required for gates and agent dispatch to function. | resolved — TASK-089 |
