---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; TODO.md format or lean-doc standard changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §8 (split TASK-004)
---

# Blueprint §7 — Unified TODO.md Format

`TODO.md` at the project root serves two consumers simultaneously:
- **dev-flow orchestrator** — reads task fields (scope, layers, acceptance, tracker, risk) to run the pipeline
- **lean-doc-generator** — reads session protocol, sprint structure, changelog, and quick rules

Both consumers work from the same file. Do not create a separate `todo.md` or `docs/TODO.md`.

## Lean Documentation Philosophy (applies to all docs/ files)

Before writing any documentation, apply the **HOW filter**:

| If it explains… | Action |
|:----------------|:-------|
| HOW something works | Put it in code (comments, types, tests) — not in docs |
| WHY a decision was made | Put it in `docs/DECISIONS.md` |
| WHERE things live | Put it in `docs/ARCHITECTURE.md` or `docs/README.md` |
| Unsure | Put it in code |

**The 4 Laws of Lean Documentation** (enforced by `/lean-doc-generator`):

| Law | Rule |
|:----|:-----|
| **Minimal by Default** | No doc is created unless its absence causes repeated mistakes |
| **Owned, Not Shared** | Every doc has one owner *role* (not person name) — roles persist when people leave |
| **Lifecycle-Bound** | Every doc has a defined `update_trigger` — without it, docs go stale silently |
| **Signal-Dense** | Every line carries unique info not already in code — if the code says it, delete the doc line |

## Unified TODO.md Template

```markdown
# [Project Name] — Development Tracker

---
owner: [role — e.g. "Tech Lead", "Dev Lead"]
last_updated: YYYY-MM-DD
update_trigger: Sprint completed, task added, or task status changed
status: current
---

> **How to use this file**
> - **Start of session** — read this file first. Understand active sprint before touching code.
> - **Run /dev-flow** — the orchestrator parses the first incomplete task [ ] in Active Sprint.
> - **End of session** — run Session Close (Phase 10). Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, add Changelog row (File | Change | ADR), update relevant docs.
> - **Every code change** — if it introduces a new pattern or reverses a decision, update the relevant doc.
> - **Docs to keep in sync**: `docs/README.md` · `docs/ARCHITECTURE.md` · `docs/DECISIONS.md` · `docs/AI_CONTEXT.md`
> - **Changelog rule** — holds ONLY the current in-progress sprint. Once changes are reflected in docs,
>   MOVE the sprint block to `docs/CHANGELOG.md` (prepend — newest first), then DELETE from here.

> **Sprint sizing rules**
> - Group 2–5 tasks per sprint. Never plan a sprint with only 1 task.
> - Order by dependency first, then importance + urgency.
> - Promote tasks from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately when added to Active Sprint.

---

## Active Sprint

### Sprint N — [Sprint Theme] ([Date])
> **Theme:** [one-line sprint theme]

- [ ] **TASK-NNN: [Title]** — [why it matters]
  - `scope`: full | quick | hotfix
  - `layers`: [comma-separated list — must match allowed values in CLAUDE.md]
  - `api-change`: yes | no
  - `acceptance`: [what "done" looks like — one line, measurable]
  - `tracker`: [URL — required before Gate 0; "none — justification" if no ticket]
  - `risk`: low | medium | high

---

## Backlog

### P0 — Critical / Blocking
- [ ] **[Task]** — [why it matters]

### P1 — [Phase] Required
- [ ] **[Task]** — [why it matters]

### P2 — Quality / Polish
- [ ] **[Task]** — [why it matters]

### P3 — Post-[Phase]
- [ ] **[Task]** — [why it matters]

---

## Changelog

> Current sprint only. Once changes are reflected in docs, MOVE to `docs/CHANGELOG.md` then DELETE from here.

### Sprint N — [Name] ([Date])

| File | Change | ADR |
|:-----|:-------|:----|
| `path/to/file` | [what changed and why] | ADR-NNN or — |

---

## Quick Rules
> Key patterns and conventions for AI and devs — no need to open ARCHITECTURE.md for these.

\`\`\`
[auth patterns, naming rules, data access patterns, cache rules, etc.]
\`\`\`
```

> **Gate 0 pre-condition**: `tracker` must be a real URL (not `"none"`) before Gate 0 passes.
> If `"none"`, the orchestrator asks for the URL or explicit justification before proceeding.
>
> **Risk override**: If `risk: high`, the orchestrator upgrades to `scope: full` automatically.
>
> **lean-doc-generator behaviour with existing TODO.md**: When Phase 8 runs `/lean-doc-generator`,
> the skill detects the existing `TODO.md` and **extends** it (adds new sprint, updates Quick Rules,
> rotates Changelog) rather than regenerating it from scratch. The task fields are not touched.

## Sprint Creation Checklist

Before closing Gate 0, verify every task in the new sprint has all required fields:

| Field | Values | Gate 0 rule |
|:------|:-------|:------------|
| `scope` | `full` / `quick` / `hotfix` | `risk: high` forces `scope: full` |
| `layers` | comma-separated | Must match CLAUDE.md layer values |
| `api-change` | `yes` / `no` | — |
| `acceptance` | one sentence, measurable | Human verifies at Gate 2 |
| `tracker` | URL or `"none — [reason]"` | `"none"` requires explicit justification |
| `risk` | `low` / `medium` / `high` | `high` → orchestrator auto-upgrades scope |

Sprint structure checklist:
- [ ] Theme defined (one-line)
- [ ] 2–5 tasks (never 1 task alone)
- [ ] Tasks ordered: dependencies first, then importance + urgency
- [ ] Every task has all six required fields
- [ ] Previous sprint's Changelog block moved to `docs/CHANGELOG.md`
- [ ] Promoted tasks removed from Backlog immediately

## [CUSTOMIZE] Issue Tracker

Set your team's issue tracker in `CLAUDE.md`:

```markdown
## Issue Tracker
- Tool: [Jira / Linear / GitHub Issues / ClickUp / Notion / other]
- Project URL: [base URL for issues]
```

## [CUSTOMIZE] Layer Values

The `layers` field values depend on your stack:

| Stack | Layer Values |
|:------|:------------|
| Nuxt 3 / Vue | `api, validation, composable, component, page, store, infrastructure` |
| React / Next.js | `api, validation, hook, component, page, store, infrastructure` |
| NestJS | `controller, service, repository, module, dto, guard, infrastructure` |
| FastAPI | `router, service, repository, schema, model, middleware, infrastructure` |
| Go (Gin) | `handler, service, repository, model, middleware, infrastructure` |
| dev-flow (meta-repo) | `governance, docs, harness, scripts, skills, agents, templates, examples, ci` |
