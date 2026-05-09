# Skill-Dispatch Table

Maps task `layers` → advisory skills. Surfaced at G1. All entries overridable by human.

---

## dev-flow Meta-Repo Layers

| Layer | Advisory Skills |
|---|---|
| `docs` | `lean-doc-generator` |
| `governance` | `lean-doc-generator` · `adr-writer` (if decision made) |
| `skills` | `lean-doc-generator` |
| `agents` | `lean-doc-generator` |
| `templates` | `lean-doc-generator` |
| `harness` · `scripts` | none |
| `ci` | none (adopter-supplied; `pipeline-builder` not bundled) |

---

## Common Product Layers (Adopter Repos) — Skills Not Bundled With dev-flow

| Layer | Advisory Skills |
|---|---|
| `api` | `api-contract-designer` |
| `fe` · `components` · `ui` | `fe-component-builder` · `fe-design-engineer` |
| `fe` (user-facing) | + `fe-accessibility-auditor` |
| `fe` (animations) | + `fe-motion-designer` |
| `be` · `service` · `repository` | `be-service-scaffolder` |
| `database` · `data` | `data-model-designer` · `query-optimizer` |
| `observability` · `logging` | `observability-setup` |
| `etl` · `pipeline` | `etl-pipeline-builder` |
| `analytics` | `analytics-schema-designer` |

---

## Always-On (every task)

Lifecycle-ordered. Earlier rows fire earlier in the session/task lifecycle.

| When | Skill / Agent |
|---|---|
| session start — before any orchestrator dispatch | `prime` |
| before G1 — task touches unfamiliar area OR cross-cutting change | `zoom-out` |
| G1 task-type = bug fix / failing test (mutually exclusive w/ tdd) | `diagnose` |
| Implement phase — task involves new behavior + tests | `tdd` |
| post-implement (proposed; human `y/n`) | `code-reviewer` agent → preloads `pr-reviewer` skill |
| post-Review — code-reviewer flags complexity smells | `refactor-advisor` |
| after commit | `lean-doc-generator` |
| hard-to-reverse decision | `adr-writer` |
| sprint-bulk close — MINOR or MAJOR version bump needed | `release-manager` (NOT release-patch path) |
| separate `/security-review` session | `security-analyst` agent → preloads `security-auditor` skill (bundled) |

**Notes:**
- `diagnose` vs `tdd` are mutually exclusive at G1 task-type detection — not stacked. Bug-fix → `diagnose`; feature/new-behavior → `tdd`.
- `release-manager` vs `release-patch` trigger split: release-manager fires for explicit MINOR/MAJOR bump; `release-patch` is the auto-detect PATCH path (also sprint-close).

Adopters: add project-specific rows in `skill-dispatch-local.md` (takes precedence).
