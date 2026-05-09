---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: ADR-029 amendment; new stack preset; new layer added; CA+DDD pattern revision
status: current
source: ADR-029 (Sprint 051a CA+DDD canonical lock); Sprint 051b T4 (this primer)
---

## §11 — Lean Architecture Primer (Clean Architecture + DDD)

This primer documents the canonical lean architecture for any user-project scaffolded via dev-flow. Decision lock: **ADR-029** (Sprint 051a). Companion: [`12-session-workflow.md`](12-session-workflow.md).

---

## Why CA+DDD?

Generic layered MVC (api / service / repository / middleware / model) suffers two problems:

1. **Flat dependency confusion** — "service" depends on "repository" but also "model" and "middleware"; no clear inversion direction. AI agents cannot reliably infer layer boundaries from naming.
2. **Anemic domain model** — business logic drifts into service layer; domain becomes data-bag entities only. Hard to reason about behavior; hard to test in isolation.

Clean Architecture + Domain-Driven Design fixes both:

- **Explicit dependency direction** — outer layers depend on inner; never the reverse. Domain has zero outward deps.
- **Rich domain model** — business logic lives WITH the entities it operates on. DDD building blocks (aggregates, value objects, domain events, repository pattern) make modeling discipline explicit.

dev-flow makes this canonical so every scaffolded user-project shares the same vocabulary. AI agents (orchestrator · scope-analyst · task-decomposer) reason about layers consistently regardless of the user-project's language. See ADR-029 § Decision for the full rationale.

---

## The 5-Layer Canonical Set

| Layer | Purpose | What lives here | What does NOT |
|:------|:--------|:----------------|:--------------|
| `domain/` | Entities, value objects, aggregates, domain events, repository **interfaces**. Pure business logic. | Business rules, invariants, domain events, repository contracts (interfaces only). | Framework code, ORM annotations, I/O, DB drivers, HTTP clients. |
| `application/` | Use cases (commands + queries), application services, DTOs, **ports** (interfaces for infrastructure adapters). Orchestrates domain. | Use case orchestration, transaction boundaries, port interfaces, DTOs for layer crossings. | Business rules (those live in domain), framework adapters, direct DB calls. |
| `infrastructure/` | Repository **implementations**, framework adapters, db, message bus, external API clients, mappers. | Concrete repo impls (implements domain interfaces), DB driver wrappers, HTTP clients, message queue adapters, ORM mappings. | Business rules, use case orchestration. Frameworks live here, never in domain. |
| `interface/` | HTTP / CLI / UI entry points — controllers, routes, presenters. | Request validation, response shaping, controller logic that calls application use cases. | Business rules, persistence, framework-internal adapters. |
| `shared/` | Cross-cutting: errors, common types, value objects shared across bounded contexts. | Domain-level errors, primitive type wrappers, cross-context value objects. | Per-context business logic (belongs in domain), framework-specific helpers (belongs in infrastructure). |

**Anti-pattern lock:** keep `shared/` minimal. The temptation to dump anything-used-twice here turns it into a kitchen-sink dependency dumping ground. Default to duplicating cross-context value objects until the third use forces extraction.

---

## Dependency Rule (CA Arrow)

`interface → application → domain ← infrastructure`

- Domain has **zero outward dependencies**. Never imports framework, ORM, or I/O code.
- Infrastructure depends inward on domain (via interfaces) — **never the reverse**.
- Application depends inward on domain only.
- Interface depends on application + domain.
- Shared can be imported by any layer; never imports framework or infrastructure.

If a dependency violates these arrows, the design is wrong — fix the layout, not the lint rule.

---

## Per-Stack Source Root Convention

Each stack matches its ecosystem convention while preserving CA+DDD layer naming:

| Stack | Source root | Aux roots | Test root | Notes |
|:------|:------------|:----------|:----------|:------|
| `node-express` | `src/` | — | `tests/{unit,integration,e2e}/` | Conventional Node layout. |
| `react-next` | `src/` | `app/` (Next.js App Router) | `tests/{unit,integration,e2e}/` | 4 layers: interface/ collapses into Next.js `app/`. |
| `python-fastapi` | `app/` | — | `tests/{unit,integration,e2e}/` | Pythonic `app/` package root. |
| `go-gin` | `internal/` | `cmd/<binary>/` | tests alongside source | Go convention: tests live next to code; no top-level `tests/`. |
| `custom` | user-owned | — | — | Skeleton creation skipped — user picks shape. |

`bin/dev-flow-init.js` materializes these dirs at init via `createProjectSkeleton` (Sprint 051a). Templates render per-stack via `applySubstitutions` (Sprint 051b T1).

---

## react-next 4-Layer Variant

react-next omits `interface/` from `src/` because **the Next.js `app/` directory IS the interface adapter**. Forcing nested `src/interface/app/` breaks Next.js auto-routing assumptions (file-based routing, layouts, server components).

```
react-next/
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── shared/
├── app/                    ← Next.js App Router == interface layer
│   ├── (routes)/
│   └── api/
└── tests/{unit,integration,e2e}/
```

Page components in `app/` call use cases in `src/application/`. Server actions live in `app/` (interface adapter); business logic stays in `src/domain/`. Treat `app/` as you would a `controllers/` directory in any other stack.

---

## Single Bounded Context (Default)

Default scaffold = one bounded context. CA layers live at `<source-root>/{domain,application,infrastructure,interface,shared}/`. Single bounded context covers ~80% of user-projects at init time.

**Stay single-context until:**

- You have ≥2 sustained, independent subdomains (e.g. billing + inventory) with separate ubiquitous languages.
- Coordination overhead between subdomains is hurting velocity (PRs touch both subdomains constantly; review confusion).
- You're considering separate deployment lifecycles per subdomain.

Splitting prematurely is the more common failure mode than splitting too late. A single context with well-named modules covers most projects.

---

## Multi-Context Upgrade Path

When the single-context model breaks down, upgrade to:

```
src/
└── contexts/
    ├── billing/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── interface/
    ├── inventory/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── interface/
    └── shared/         ← cross-context (anti-corruption layers, shared VOs)
```

**This is a manual upgrade — `dev-flow-init.js` does NOT auto-scaffold multi-context.** Reasons:

- Most user-projects never need it (default = single context).
- Auto-scaffolding empty contexts creates clutter that drifts.
- The decision to split is high-stakes and benefits from explicit human design (often paired with an ADR).

When you upgrade: write an ADR documenting the split, the contexts, their ubiquitous languages, and the integration patterns (anti-corruption layers, published events, shared kernel). dev-flow's `/adr-writer` skill can drive this.

---

## Anti-Patterns

### 1. Anemic Domain Model

❌ Domain entities are just data; `OrderService.applyDiscount(order, ...)` mutates totals from outside. Business logic lives in service layer.

✅ Behavior lives WITH the entity: `order.applyDiscount(discount)` enforces invariants where they belong.

Anemic domain pushes invariants into service code. Hard to find; easy to bypass; brittle to refactor. Default to behavior-on-entity until proven otherwise.

### 2. Kitchen-Sink `shared/`

❌ `shared/{utils.ts, helpers.ts, common/}` becomes a catch-all — anything used twice ends up here. `shared/` grows monotonically; nothing ever moves out.

✅ `shared/` is for **cross-context** primitives only — errors, value objects (Money, Email, UserId), framework-agnostic utilities used in 3+ contexts. When in doubt, leave duplicated until the third use forces extraction.

### 3. Framework Leak into `domain/`

❌ ORM annotations (e.g. TypeORM `@Entity` `@Column`) on domain classes couple business logic to the persistence framework. Migrate frameworks → rewrite domain.

✅ Pure domain classes; ORM mapping lives in `infrastructure/<X>OrmMapper` translating domain objects ↔ persistence rows. Domain stays framework-agnostic.

---

## Per-Stack File Structure Examples

### node-express

```
src/
├── domain/
├── application/
├── infrastructure/
├── interface/
└── shared/
tests/
├── unit/
├── integration/
└── e2e/
```

### react-next (4-layer variant)

```
src/
├── domain/
├── application/
├── infrastructure/
└── shared/
app/                     ← interface layer (Next.js App Router)
├── (routes)/
└── api/
tests/{unit,integration,e2e}/
```

### python-fastapi

```
app/
├── domain/
├── application/
├── infrastructure/
├── interface/
└── shared/
tests/{unit,integration,e2e}/
```

### go-gin

```
internal/
├── domain/
├── application/
├── infrastructure/
├── interface/
└── shared/
cmd/
└── server/
    └── main.go
# tests live alongside source: internal/domain/order_test.go
```

---

## Quick Reference

- Dependency arrow: `interface → application → domain ← infrastructure`
- Domain has zero outward deps. Infrastructure implements domain interfaces.
- 5 layers (4 for react-next: interface = app/).
- Single bounded context default; multi-context is a manual upgrade with ADR.
- Anti-patterns: anemic domain · kitchen-sink shared · framework leak.

**See also:**
- [`docs/adr/ADR-029-lean-architecture-canonical.md`](../adr/ADR-029-lean-architecture-canonical.md) — canonical lock
- [`12-session-workflow.md`](12-session-workflow.md) — 3-step session pattern
- `templates/ARCHITECTURE.md.template` — per-project ARCHITECTURE.md skeleton
- `templates/CLAUDE.md.template` — per-project CLAUDE.md skeleton
