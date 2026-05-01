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

| When | Skill / Agent |
|---|---|
| post-implement | `code-reviewer` agent → preloads `pr-reviewer` skill |
| after commit | `lean-doc-generator` |
| hard-to-reverse decision | `adr-writer` |
| separate `/security-review` session | `security-analyst` agent → preloads `security-auditor` skill (bundled) |

Adopters: add project-specific rows in `skill-dispatch-local.md` (takes precedence).
