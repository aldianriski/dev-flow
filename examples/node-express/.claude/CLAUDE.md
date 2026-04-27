---
owner: Tech Lead
last_updated: 2026-04-27
update_trigger: Stack changes, new architectural decision, or new anti-pattern discovered
status: current
---

# node-express-example — AI Context

## Project Overview
- **Name**: node-express-example
- **Type**: REST API (dogfood project — validates dev-flow workflow)
- **Stack**: Node.js ≥18 · Express 4.x · stdlib only (no ORM; in-memory store intentional)
- **Architecture**: Layered — route → middleware → service → repository

## Dependency Rule
Route handler → Service → Repository → In-memory store (or future DB)

## File Structure
```
/src
  /routes/       # Express router files; one per resource
  /middleware/   # Cross-cutting concerns (error handler, validation)
  /services/     # Business logic; no direct I/O
  /repositories/ # Data access; hides store implementation
  index.js       # Entry point; wires routes + middleware
```

## Code Generation Order
1. Repository → 2. Service → 3. Route handler → 4. Integration test

## Naming Conventions
- Files: kebab-case (`user-service.js`, `error-handler.js`)
- Routes: plural nouns (`/users`, `/items`)

## Anti-Patterns (Avoid)
❌ Direct data access in route handlers — always go through service layer
❌ Business logic in middleware — middleware validates/rejects, services decide
❌ `require()` inside request handlers — require at module top level

## Commands
```bash
npm install
npm start          # node src/index.js  (PORT=3000)
npm test           # node --test src/__tests__
```

## Definition of Done
Every task must satisfy all of these before commit:
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Unit + integration tests pass
- [ ] Review: 0 blocking issues
- [ ] Security: 0 critical findings
- [ ] DECISIONS.md updated if an architectural decision was made
- [ ] Acceptance criteria verified by human at Gate 2

## Behavioral Guidelines

### Think Before Coding
Before writing any file, surface assumptions and name confusion points.
Do not generate plausible output to cover uncertainty. Ask before guessing.

### Simplicity First
Write minimum code that satisfies the acceptance criteria.
No speculative features. No single-use abstractions. In-memory store is intentional.

### Surgical Changes
Touch only what the task requires. Match the style of adjacent code.
Do not refactor surrounding code unless your change made it inconsistent.

### Goal-Driven Execution
Before implementing, restate the task as a verifiable goal with numbered steps.
State what "done" looks like before starting.
