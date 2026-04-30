---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-30
update_trigger: New skill added; layer values changed; dispatch mapping validated or revised
status: current
---

# Skill-Dispatch Table

Maps task `layers` field values → required skills to invoke before/during Phase 3.
All entries are **advisory** — surfaced at Gate 0, overridable by human judgment.

---

## How to use

At Phase 0 Parse, after extracting `layers` from the task:
1. Look up each layer value in the table below.
2. Collect the union of required skills across all layers.
3. Record in Gate 0 output as: `**Required skills**: [list]` (advisory).
4. In sprint mode, show the "Skills" column in the Sprint Plan table.

If `layers` contains only `docs` / `governance` / `templates` with no code changes expected → `lean-doc-generator` only.

---

## Dispatch Table — Dev-Flow Meta-Repo Layers

Layer values defined in `TODO.md` Quick Rules for this repo.

| Layer | Required Skills | Notes |
|:------|:----------------|:------|
| `docs` | `lean-doc-generator` | Any doc-only change |
| `governance` | `lean-doc-generator` · `adr-writer` (if decision made) | Blueprint + DECISIONS.md changes |
| `skills` | `lean-doc-generator` | SKILL.md updates, new skills |
| `agents` | `lean-doc-generator` | Agent definition changes |
| `templates` | `lean-doc-generator` | Template file changes |
| `harness` | none | Script work — no scaffolder available |
| `scripts` | none | Script work — no scaffolder available |
| `examples` | none | Example files — no scaffolder available |
| `ci` | `pipeline-builder` | CI config or workflow changes |

---

## Dispatch Table — Common Product Layers (Adopter Repos)

For teams adopting dev-flow on their own product repos. Add custom layers in a project-local `skill-dispatch-local.md`.

| Layer | Required Skills | Notes |
|:------|:----------------|:------|
| `api` | `api-contract-designer` | Any REST/RPC contract change |
| `fe` · `components` · `ui` | `fe-component-builder` · `fe-design-engineer` | New/changed UI components |
| `fe` (user-facing flow) | + `fe-accessibility-auditor` | Add when building user-facing pages |
| `fe` (animations) | + `fe-motion-designer` | Add when adding transitions/motion |
| `be` · `service` · `repository` | `be-service-scaffolder` | New service/module/feature |
| `database` · `data` | `data-model-designer` · `query-optimizer` | Schema or query changes |
| `security` | `security-auditor` | Security-sensitive layer changes |
| `observability` · `logging` | `observability-setup` | Logging/metrics/tracing changes |
| `etl` · `pipeline` | `etl-pipeline-builder` | Data pipeline changes |
| `analytics` | `analytics-schema-designer` | Dimensional model changes |
| `mobile` | none | No mobile skill available — flag for manual review |

---

## Always-available skills (any layer)

These are invoked by the orchestrator at specific phases regardless of layer:

| Phase | Skill | Trigger |
|:------|:------|:--------|
| Phase 6 | `pr-reviewer` / `code-reviewer` | Every task |
| Phase 7 | `security-auditor` | Every task |
| Phase 8 | `lean-doc-generator` | Every task |
| Phase 8 | `adr-writer` | If architectural decision made |

---

## Extending the dispatch table

Adopters: create `.claude/skills/dev-flow/references/skill-dispatch-local.md` with additional rows for project-specific layers. Local table takes precedence over this table for matching layer values.
