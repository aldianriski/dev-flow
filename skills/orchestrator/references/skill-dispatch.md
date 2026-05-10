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

Lifecycle-ordered. Earlier rows fire earlier in the session/task lifecycle. Each row states explicit trigger condition + invocation pattern (auto-fires / proposed→human y/n / user-invoked / agent-output-triggered).

| When (fires when X) | Skill / Agent | Invocation |
|---|---|---|
| Session start — before any orchestrator dispatch | `prime` | user-invoked (`/prime`) OR session-start hook; never orchestrator-triggered |
| Pre-G1 — task touches unfamiliar module OR cross-cutting change (≥3 layers) | `zoom-out` | proposed → human `y/n` |
| G1 task-type = `bug-fix` / failing test (mutually exclusive w/ tdd) | `diagnose` | proposed → human `y/n` |
| G1 task-type = `feature` / new-behavior · pre-tdd planning step | `test-planner` | proposed → human `y/n` (skip if tdd already covers planning informally) |
| G1 task-type = `feature` / new behavior requiring tests | `tdd` | proposed → human `y/n` |
| Post-implement (every task) | `code-reviewer` agent → preloads `pr-reviewer` skill | proposed → human `y/n` (skip on doc-only / delete-only / trivial diffs) |
| Post-Review — code-reviewer Stage 2 flags complexity smells (long methods · SOLID · CA drift) | `refactor-advisor` | proposed → human `y/n` |
| Post-commit (every task) AND sprint-promote / sprint-close (lifecycle protocols) | `lean-doc-generator` | auto-fires post-commit; user-invoked for sprint-promote / sprint-close |
| G2 `design-analyst` flags `adr needed: yes` OR human surfaces hard-to-reverse architectural decision mid-task | `adr-writer` | auto-fires on `design-analyst` flag; user-invoked otherwise |
| Sprint-bulk close — MINOR or MAJOR version bump (else release-patch PATCH path auto-detects) | `release-manager` | proposed → human `y/n` |
| Separate `/security-review` session — never same-context (ADR-015) | `security-analyst` agent → preloads `security-auditor` skill (bundled) | user-invoked separate session |

**Notes:**
- `diagnose` vs `tdd` are mutually exclusive at G1 task-type detection — not stacked. Bug-fix → `diagnose`; feature/new-behavior → `tdd`. Refactor task-type → propose `refactor-advisor` directly (skips both).
- `test-planner` vs `tdd` — test-planner PLANS (which tests · which group: unit/integration/e2e/regression); tdd WRITES them (red-green-refactor). Pair: test-planner first → tdd consumes the plan. Skip test-planner if tdd's tracer-bullet step already covers planning informally for the task scale.
- `release-manager` vs `release-patch` trigger split: release-manager fires for explicit MINOR/MAJOR bump; `release-patch` is the auto-detect PATCH path (also sprint-close).
- Invocation column distinguishes 4 patterns: auto-fires (no human gate) · proposed→human y/n (human approves dispatch) · user-invoked (human triggers slash command) · agent-output-triggered (other agent's output triggers).

Adopters: add project-specific rows in `skill-dispatch-local.md` (takes precedence).
