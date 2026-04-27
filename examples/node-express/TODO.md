---
owner: Tech Lead
last_updated: 2026-04-27
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# node-express-example — Development Tracker

> **How to use this file**
> - **Start of session** — read this file first. Understand active sprint before touching code.
> - **Run /dev-flow** — orchestrator parses the first incomplete task `[ ]` in Active Sprint.
> - **End of session** — run Session Close (Phase 10). Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, add Changelog row (File | Change | ADR), update relevant docs.
> - **Every code change** — if it introduces a new pattern or reverses a decision, update the relevant doc.
> - **Docs to keep in sync**: `README.md` · `docs/ARCHITECTURE.md` · `docs/DECISIONS.md` · `docs/AI_CONTEXT.md`
> - **Changelog rule** — holds ONLY the current in-progress sprint. Once changes are reflected in docs,
>   MOVE the sprint block to `docs/CHANGELOG.md` (prepend — newest first), then DELETE from here.

> **Sprint sizing rules**
> - Group 2–5 tasks per sprint. Never plan a sprint with only 1 task.
> - Order by dependency first, then importance + urgency.
> - Promote tasks from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately when added to Active Sprint.

> **Layer values for this project**
> `api, service, repository, middleware, model`

---

## Active Sprint

### Sprint 1 — Error handling + users CRUD foundation (2026-04-27)
> **Theme:** Wire global error handler and first resource endpoint to validate the full dev-flow workflow.

- [x] **TASK-001: Add global error-handler middleware** — unhandled errors in any route currently crash with default Express HTML; JSON API clients need structured error responses.
  - `scope`: quick
  - `layers`: middleware
  - `api-change`: no
  - `acceptance`: `src/middleware/error-handler.js` exists and is wired in `src/index.js` after all routes. Any `next(err)` or thrown error returns `{ "error": "<message>", "status": <code> }` JSON with the correct HTTP status code. Existing GET /health and GET / routes unaffected. Unit test in `src/__tests__/error-handler.test.js` covers: operational error (status 400), unexpected error defaults to 500, stack not leaked in response.
  - `tracker`: none — dogfood bootstrap task for EPIC-C (dev-flow TASK-075)
  - `risk`: low

- [ ] **TASK-002: Add /users in-memory CRUD endpoint** — dogfood needs a real resource endpoint to exercise Gate 1 design review and the full 10-phase flow.
  - `scope`: full
  - `layers`: api, service, repository
  - `api-change`: yes
  - `acceptance`: GET /users returns `[]` or array of users; POST /users creates user (requires `{ name: string }`), returns 201 + created user with generated `id`; GET /users/:id returns user or 404 JSON. All responses JSON. Integration tests in `src/__tests__/users.test.js` cover: list empty, create valid, create missing-name → 400, get by id, get missing id → 404.
  - `tracker`: none — dogfood bootstrap task for EPIC-C (dev-flow TASK-075)
  - `risk`: medium
  - `depends-on`: TASK-001

---

## Backlog

### P0 — Critical / Blocking
<!-- Add tasks that block the project from moving forward -->

### P1 — Auth + validation
<!-- JWT login, request body validation middleware -->

### P2 — Quality / Polish
<!-- eslint config, structured logging, OpenAPI spec -->

### P3 — Post-dogfood / Long-term
<!-- PostgreSQL migration, Docker setup, CI pipeline -->

---

## Changelog

> Current sprint only. Once changes reflected in docs, MOVE to `docs/CHANGELOG.md` then DELETE from here.

### Sprint 1 — Error handling + users CRUD foundation (2026-04-27)

| File | Change | ADR |
|:-----|:-------|:----|
| `src/middleware/error-handler.js` | TASK-001 — error handler middleware (Gate 2 approved 2026-04-27) | — |
| `src/index.js` | TASK-001 — wire error handler after routes | — |
| `src/__tests__/error-handler.test.js` | TASK-001 — 3 unit tests (pass: status 400, default 500, no stack leak) | — |

---

## Quick Rules
> Key conventions for this project — no need to open full docs for these.

```
- Route handlers: never query data directly — always go through service layer
- Errors: use next(err) to propagate; never write res.json({ error }) inline in routes
- Files: kebab-case for all filenames
- Tests: integration tests use Node.js built-in test runner; no Jest/Mocha dependency
- Auth: no auth middleware yet — all routes open (Sprint 1 dogfood scope)
- In-memory store: by design for Sprint 1; migration to DB is P3 scope
```
