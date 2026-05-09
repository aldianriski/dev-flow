---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: ADR status change
status: decided
sprint: 051a
---

# ADR-029: Clean Architecture + DDD as canonical lean architecture for dev-flow-scaffolded user-projects

**Date**: 2026-05-08
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 048 (ADR-026) established the user-project outcome lens. Sprint 049 (ADR-027) cleaned up plugin coherence. Sprint 050 (ADR-028) closed the F3 init scaffold contract — but only for *governance/coordination* files. Post-Sprint-050 user feedback flagged ISSUE-04: "all the suggestion file of this plugin is only supporting file, we miss the user pov to project specifict needed file, and we not have a stadarize structure for foldering, for project usage file with suggestion lean architecture." User explicit ask: **Clean Architecture + Domain-Driven Design**.

**Symptoms (audit at Sprint 051a promote):**

- `STACK_PRESETS` (bin/dev-flow-init.js) defined `layers` field per stack as layered MVC (`api/service/repository/middleware/model`). Layers flowed into TODO.md frontmatter `layer values` block and CLAUDE.md template `[CUSTOMIZE]` placeholders — but never materialized as filesystem dirs.
- `createEmptyScaffoldDirs` (Sprint 050) created only `docs/codemap/` + `docs/adr/` — meta-coordination dirs. NOT user-project source dirs.
- `templates/CLAUDE.md.template` File Structure / Dependency Rule / Layers / Anti-Patterns / Commands sections all `[CUSTOMIZE]`. New user-projects start with empty placeholders → AI agents (orchestrator, scope-analyst, task-decomposer) hit `[CUSTOMIZE]` markers and can't reason about layers / can't auto-route refactors / can't pre-fill new file paths.
- ISSUE-03 lesson rerun: governance-only optimization without user-project shape.

This ADR locks Clean Architecture + DDD as the canonical lean architecture for user-projects scaffolded via dev-flow. Sprint 051a implements the foundation (STACK_PRESETS migration + skeleton creation function + tests). Sprint 051b will re-render `templates/CLAUDE.md.template` + `templates/ARCHITECTURE.md.template` and write the `docs/blueprint/11-lean-architecture.md` primer.

## Decision

**1. Clean Architecture + Domain-Driven Design adopted as canonical lean architecture.** dev-flow-scaffolded user-projects produce Clean Architecture + DDD layer dirs by default. Architecture choice is opinionated, matching dev-flow's existing opinion-coupling on stack preset commands (lint + typecheck wired to PreToolUse hooks). Users opt out via `custom` preset (skeleton creation skipped — user owns project shape).

**2. 5-layer canonical set.**

| Layer | Purpose |
|:------|:--------|
| `domain/` | Entities, value objects, aggregates, domain events, repository **interfaces** (interfaces only — implementations live in infrastructure). Pure business logic; no framework or I/O dependencies. |
| `application/` | Use cases (commands + queries), application services, DTOs, ports (interfaces for infrastructure adapters). Orchestrates domain. Depends inward on domain only. |
| `infrastructure/` | Repository **implementations**, framework adapters (db, http client, message bus), external API clients, mappers. Depends on domain (via interfaces) + application (via ports). Frameworks live here. |
| `interface/` | HTTP / CLI / UI entry points — controllers, http routes, cli commands, presenters. Depends on application + domain. Drives use case execution. |
| `shared/` | Cross-cutting: errors, common types, value objects shared across bounded contexts. Anti-pattern: kitchen-sink — keep shared minimal. |

**Dependency rule (CA arrow):** `interface → application → domain ← infrastructure`. Infrastructure depends inward on domain (via interfaces); never the reverse. Domain has zero outward dependencies.

**3. Per-stack source-root convention.** Match each stack's ecosystem convention while preserving the 5-layer naming.

| Stack | Source root | Aux roots | Test root |
|:------|:------------|:----------|:----------|
| `node-express` | `src/` | — | `tests/{unit,integration,e2e}/` |
| `react-next` | `src/` | `app/` (Next.js App Router; absorbs interface layer) | `tests/{unit,integration,e2e}/` |
| `python-fastapi` | `app/` | — | `tests/{unit,integration,e2e}/` |
| `go-gin` | `internal/` | `cmd/` (Go entry root) | tests live alongside source per Go convention |
| `custom` | user-owned | — | — |

**4. react-next 4-layer variant.** react-next omits `interface/` from src/ — the Next.js `app/` directory IS the interface adapter. Forcing nested `src/interface/app/` breaks Next.js auto-routing assumptions. react-next layers = `domain · application · infrastructure · shared` (4) plus `app/` at repo root.

**5. Skeleton auto-created at init (default ON); custom preset skips.** `createProjectSkeleton(target, preset)` runs in `bin/dev-flow-init.js` `main()` after `createEmptyScaffoldDirs(target)`. Idempotent — preserves user content; `.gitkeep` only written if missing. Custom preset (no `sourceRoot`) → skeleton creation skipped silently. Console output names the skeleton scope per stack.

## Alternatives considered

1. **Layered MVC (api/service/repository/middleware/model) — keep current.** Rejected. Flat dependency confusion — "service" depends on "repository" but also on "model" and "middleware"; no clear inversion direction. AI agents can't reliably infer layer boundaries from naming alone. CA's explicit dependency direction is the lift.

2. **Hexagonal / ports-and-adapters only (no DDD building blocks).** Rejected. CA + hexagonal map cleanly (ports = application/, adapters = infrastructure/), but losing DDD vocabulary (aggregates, value objects, domain events, repository pattern, anti-corruption layers) loses the domain-modeling discipline that prevents anemic domain models. CA+DDD synthesis covers both architectural shape AND domain-modeling rigor.

3. **Stack-flavored layer names** (e.g., python = domain/usecases/infra/api/shared; node = domain/application/infrastructure/interface/shared). Rejected. Cross-project AI reasoning suffers when vocabulary differs by language. Uniform naming across backend stacks lets dev-flow agents (scope-analyst, task-decomposer, orchestrator) reason consistently regardless of user-project language.

4. **Opt-in skeleton via init prompt** ("Create lean architecture skeleton? Y/n"). Rejected. Adds friction; defaults already opinionated for stack presets (lint/typecheck commands auto-wired without prompt). Custom preset is the existing escape hatch — users who want to own project shape pick `custom`.

5. **Bounded contexts auto-scaffolded per init** (`src/contexts/<name>/{domain,application,...}/`). Rejected for default. Single bounded context covers ~80% of user-projects at init time; multi-context is for projects at scale. Sprint 051b primer documents the multi-context pattern as a manual upgrade path; not auto-scaffolded.

6. **No skeleton; document architecture in templates only.** Rejected. Sprint 048 retro Friction explicitly: "AI agents reading user-project hit [CUSTOMIZE] placeholders → can't reason about layers." Documentation alone leaves filesystem empty; AI navigation breaks. Skeleton creation gives AI agents a real tree to reason against day-1.

## Consequences

**Positive:**
- Day-1 lean architecture: every user-project scaffolded via dev-flow gets identical CA+DDD layer naming → cross-project AI reasoning works.
- Outcomes mapped: O1 onboarding (clear layer purpose day-1) · O3 architecture (shared CA+DDD mental model) · O4 rework (layer violations caught early via clear structure) · O7 template/init (canonical scaffold).
- Skeleton + STACK_PRESETS layers + templates form a single source of truth → drift prevention baked in.
- Test coverage extended (43 tests; was 34 pre-Sprint 051a) covering all 4 stacks + idempotency + custom skip.

**Negative (trade-offs accepted):**
- Opinion-coupling: dev-flow now ships an architectural opinion in addition to workflow opinion. Some user-projects will fork/customize; counter-evidence preserved via `custom` preset.
- Old user-projects scaffolded with layered MVC layers do NOT auto-migrate. Users migrating to CA+DDD do so manually at their pace. ADR-029 records the migration rationale; no migration tooling shipped.
- react-next 4-layer asymmetry vs other stacks (5-layer) is a minor cognitive cost. Documented; intentional trade for Next.js convention preservation.
- Sprint 049 + 050 + 051a release-debt accumulates (skill drop + rename + 2× behavior changes). Manual MINOR reconcile + chained PATCH still pending tooling sprint per ADR-028 OQ-J.
- Eval-evidence gap: skeleton creation behavior ships before acceptance harness Sprint 053. Plugin-mode default skips skeleton (custom preset path) → existing dev-flow self-flow unchanged. Per-stack skeleton paths net-new — no prior behavior to regress against. Acceptance harness retroactively verifies.

**Neutral:**
- ADR-029 file at `docs/adr/ADR-029-lean-architecture-canonical.md` per locked convention. ID verified non-colliding (max ADR was 028 post-Sprint-050).
- Sprint 051b depends on this ADR. Templates re-rendered against the 5-layer canonical (or 4-layer for react-next); blueprint primer documents CA+DDD building blocks.
- Custom preset path remains the user-owned escape hatch — no breaking change for users who pick `custom`.

## References

- ISSUE-04 origin: user session 2026-05-08 (post-Sprint-050 feedback) — recorded in Sprint 051a plan § Why this sprint exists.
- ADR-026 — User-Project Outcome Lens (which surfaced ISSUE-04 as lens application).
- ADR-027 — Plugin coherence cleanup (predecessor; release-patch generalize).
- ADR-028 — Init scaffold contract (predecessor; only governance files; ISSUE-04 closes the user-project gap).
- Sprint 051a plan: `docs/sprint/SPRINT-051a-lean-architecture-foundation.md`.
- Sprint 051b plan (TBW next session): template re-render + blueprint primer.
- Sprint 050 retro § Friction (init scaffold gap).
- Outcomes: O1 onboarding · O3 architecture · O4 rework · O7 template/init (USER-OUTCOMES.md).
- bin/dev-flow-init.js — STACK_PRESETS + createProjectSkeleton implementation.
- bin/__tests__/dev-flow-init.test.js — 43 tests covering 4 stacks + custom skip + idempotency.
- Re-evaluation cadence: re-eval if user-project at scale ≥30 contributors surface CA+DDD friction OR new architectural pattern emerges as industry consensus.
