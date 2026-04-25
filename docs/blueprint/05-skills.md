---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-25
update_trigger: Blueprint MINOR version bump; new skill added; skill frontmatter convention changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §5 + §13 (split TASK-004); TASK-005 fixes applied
---

# Blueprint §5 — Skills Map & Invocation Reference

## Skill Location Standard

Each skill is a **directory** inside `.claude/skills/` with `SKILL.md` as the entrypoint.
Supporting files (reference docs, templates, scripts) live inside the skill directory.

```
.claude/skills/
  skill-name/
    SKILL.md               ← required: instructions + frontmatter
    references/            ← optional: heavy reference docs (>100 lines go here, not in SKILL.md)
    examples/              ← optional: example outputs
    scripts/               ← optional: helper scripts
```

**Why directories, not single files**: Skills can bundle supporting files that SKILL.md
references via `${CLAUDE_SKILL_DIR}/reference/...`. This keeps SKILL.md focused (<100 lines
body — lean-doc rule) while giving Claude access to detailed reference material on demand.

## Skill Change Protocol (RED-GREEN-REFACTOR)

Skill changes that alter agent behavior require eval evidence before merge.

- **RED**: Commit baseline snapshot to `evals/snapshots/<skill>/before.json` *before* the change. Run `python evals/measure.py <before.json>` — record metrics.
- **GREEN**: After change, commit new snapshot to `evals/snapshots/<skill>/after.json`. Run `python evals/measure.py compare <before.json> <after.json>` — `how_content_flag` must not increase.
- **REFACTOR**: Clean up skill content. Re-run compare. Confirm metrics stable before PR.

No snapshot pair → PR is blocked. See `evals/README.md` for snapshot schema and full harness docs.

## Skill Frontmatter Standard

### Spec-required fields (Claude Code / agentskills.io)

```yaml
---
name: skill-name         # required — matches directory name
description: |           # required — third-person, starts "Use when…", ≤500 chars, NEVER summarizes process
  Use when [trigger condition]. [What it produces in one sentence].
---
```

### Project-convention fields (dev-flow extensions — not Claude Code spec)

| Field | Required? | Values | Purpose |
|:------|:----------|:-------|:--------|
| `version` | recommended | semver `1.0.0` | Tracks skill revision history |
| `stack-version` | recommended | `">=XX.0"` | Minimum framework/runtime this skill is valid for |
| `last-validated` | required | `"YYYY-MM-DD"` | Drives staleness check in `session-start.js` |
| `context` | required | `inline \| fork` | Execution context (inline = orchestrator, fork = isolated) |
| `agent` | required if `context: fork` | agent name | Which agent type to fork into |
| `type` | recommended | `rigid \| flexible` | Rigid = follow verbatim; Flexible = apply judgment |
| `when_to_use` | recommended | multi-line text | Detailed trigger guidance (keeps `description` concise) |
| `skills` | optional | skill name | Preload another skill's content into this skill's context |
| `spawns` | optional | agent name | Documents which subagent this skill may spawn |

**`context: fork` usage**: isolation-critical skills (e.g. `lean-doc-generator`, `security-auditor`)
should use `context: fork` to prevent context bleed from the caller session.

**`type: rigid` vs `type: flexible`**: Rigid skills (e.g. TDD contract, migration-safety) must be
followed step-by-step with no deviation. Flexible skills (e.g. refactor-advisor) apply judgment
based on context. If in doubt, start with `rigid` and loosen later with evidence.

**Staleness rule**: If `last-validated` is older than 6 months, the orchestrator warns before
running the skill. The human must acknowledge before the skill runs.

Run a quarterly audit manually or schedule via `/loop`:
```bash
node .claude/scripts/audit-skill-staleness.js
# Via /loop (quarterly): /loop 90d node .claude/scripts/audit-skill-staleness.js
```

### Full frontmatter example

```yaml
---
name: pr-reviewer
version: 1.2.0
stack-version: ">=any"
last-validated: "2026-04-20"
context: fork
agent: general-purpose
type: rigid
when_to_use: |
  Use when reviewing a pull request or file diff for architecture violations,
  SOLID compliance, test coverage gaps, and code quality. Invoked automatically
  at Phase 7 (Review) via code-reviewer agent, or directly by user.
description: >
  Use when reviewing a code diff for spec compliance, architecture violations,
  and quality issues. Returns tiered findings (CRITICAL/BLOCKING/NON-BLOCKING).
---
```

## Universal Skills (copy to any project, no customization needed)

| Skill | Directory | Trigger |
|:------|:----------|:--------|
| ADR Writer | `adr-writer/` | Significant technical decision made |
| Refactor Advisor | `refactor-advisor/` | Code quality review needed |
| Lean Doc Generator | `lean-doc-generator/` | Documentation needs creating/updating |
| Release Manager | `release-manager/` | Preparing a release |
| System Design Reviewer | `system-design-reviewer/` | Architecture review |

Note: `lean-doc-generator/` includes `references/DOCS_Guide.md` and `references/VALIDATED_PATTERNS.md`
as supporting files referenced via `${CLAUDE_SKILL_DIR}/references/`.

## Stack-Specific Skills (customize per project)

### Frontend (React / Vue / Svelte / Angular)

| Skill | Directory | Customize For |
|:------|:----------|:-------------|
| Component Builder | `component-builder/` | Framework (React hooks vs Vue composables vs Svelte stores) |
| Design Engineer | `fe-design-engineer/` | CSS framework (Tailwind vs CSS Modules vs styled-components) |
| Accessibility Auditor | `fe-accessibility-auditor/` | Component library (Headless UI vs Radix vs custom) |
| Test Case Generator | `test-case-generator/` | Test framework (Jest/RTL vs Vitest/vue-test-utils) |
| E2E Scenario Writer | `e2e-scenario-writer/` | E2E tool (Playwright vs Cypress) |
| Security Auditor | `security-auditor/` | Framework-specific risks (XSS vectors, SSR data leakage) |
| PR Reviewer | `pr-reviewer/` | Architecture rules (Clean Architecture rules for this stack) |

### Backend (Node.js / Python / Go / Java)

| Skill | Directory | Purpose | Customize For |
|:------|:----------|:--------|:-------------|
| API Contract Designer | `api-contract-designer/` | OpenAPI spec design | Domain schemas, auth patterns |
| Service Builder | `service-builder/` | Service/module scaffolding | Framework (Express, FastAPI, Gin, Spring) |
| Test Case Generator | `test-case-generator/` | Unit + integration tests | Framework (Jest, pytest, Go test, JUnit) |
| DB Schema Reviewer | `db-schema-reviewer/` | Database design review | DB engine (PostgreSQL, MySQL, MongoDB) |
| Security Auditor | `security-auditor/` | Security scan | Backend-specific risks (SQLi, SSRF, path traversal) |
| PR Reviewer | `pr-reviewer/` | PR review | Architecture rules (DDD, hexagonal, MVC) |

## Phase-to-Skill Binding Matrix

**Execution modes**: `inline` (runs in orchestrator context), `fork` (isolated forked skill, returns summary), `subagent` (spawned via Agent tool, see §4).

| Phase | Default skill | Execution mode | Alternatives (conditional) | Context tier |
|:---|:---|:---|:---|:---|
| 0 Parse (Path A) | `dev-flow` | inline | — | 1 |
| 0 Parse (Path B — freeform) | `task-decomposer` | fork (spawns `scope-analyst` subagent) | — | 2 |
| 1 Clarify | (orchestrator inline — no skill) | inline | — | 1 |
| 2 Design | `system-design-reviewer` | subagent | `refactor-advisor` (for brownfield refactor tasks) | 3 |
| 2 Design (FE-heavy) | `fe-design-engineer` | subagent | `fe-accessibility-auditor`, `fe-motion-designer` | 3 |
| 2 Design (BE contract) | `api-contract-designer` | subagent | `data-model-designer` | 3 |
| 2 Design (data/pipeline) | `analytics-schema-designer` | subagent | `etl-pipeline-builder`, `pipeline-builder` | 3 |
| 3 Implement (FE) | `fe-component-builder` | inline | `fe-motion-designer` (for motion work) | 2 |
| 3 Implement (BE) | `be-service-scaffolder` | inline | `api-contract-designer` (contract-first) | 2 |
| 3 Implement (DB) | `data-model-designer` | inline | `query-optimizer` (for perf-critical) | 2 |
| 4 Validate | (engine — lint/typecheck/test runners) | programmatic | — | 1 |
| 5 Test (unit/integration) | `test-case-generator` | subagent | — | 2 |
| 5 Test (E2E) | `e2e-scenario-writer` | subagent | — | 2 |
| 6 Review | `pr-reviewer` (via `code-reviewer` agent) | subagent (parallel) | `refactor-advisor`, `system-design-reviewer` | 3 |
| 7 Security | `security-auditor` (via `security-analyst` agent) | subagent (parallel) | — | 3 |
| 7 Migration (conditional) | — | subagent (`migration-analyst`) | — | 3 |
| 7 Performance (conditional) | `query-optimizer` | subagent (`performance-analyst`) | `observability-setup` | 3 |
| 8 Docs | `lean-doc-generator` | inline or fork | `adr-writer` (if ADR needed) | 2 |
| 9 Close | `release-manager` (if releasing) | inline | `incident-postmortem` (hotfix only) | 1 |

**Selection rules**:

1. **Default column first**: orchestrator selects the default skill unless task metadata demands otherwise.
2. **Alternatives require justification**: selecting an alternative requires a one-line reason in `STATE`.
3. **Conditional phases fire only on trigger**: Migration (§19), Performance (§20) — listed for completeness.
4. **Composition is allowed**: multiple skills in one phase run sequentially inline, never in parallel.

See `.claude/skills/MANIFEST.json` for the same binding in machine-readable form.

## Skill Manifest (`.claude/skills/MANIFEST.json`)

**Purpose**: declarative, machine-readable registry of all skills and their phase bindings.

**Consumed by**:
- `session-start.js` — on boot, warns if a skill referenced by phase is missing, stale, or unresolvable
- `dev-flow` orchestrator — at phase transition, queries manifest for `{phase, stack, layer}`
- Any future engine or hook needing phase→skill resolution

**Shape** (simplified):

```json
{
  "version": "1.0",
  "blueprint_version": "1.7.0",
  "skills": [
    {
      "name": "pr-reviewer",
      "phase": 6,
      "phase_name": "Review",
      "mode": "subagent",
      "tier": 3,
      "layer": "review",
      "trigger": "Phase 5 complete; parallel with security",
      "preloaded_by_agent": "code-reviewer"
    }
  ],
  "subagent_wrappers": [
    { "agent": "code-reviewer", "preloaded_skill": "pr-reviewer", "role": "Phase 6 Review" }
  ]
}
```

## Canonical Files Governance

**Rule**: Edit canonical source files only. Never edit auto-synced copies directly.

| Canonical file | Auto-synced copy (never edit) | Re-sync command |
|:---------------|:------------------------------|:----------------|
| `.claude/skills/<name>/SKILL.md` | Any summary or rendered reference | — |
| `.claude/skills/MANIFEST.json` | Phase binding matrix table in this doc | `node scripts/regenerate-manifest.js` |
| `.claude/CLAUDE.md` | Any compressed copy | `python scripts/compress.py` |

When canonical and copy disagree, canonical wins. If unsure which file is canonical, check its ownership header (`source:` field).

## Skill Invocation Reference

All skills are invoked as slash commands in Claude Code:

```bash
# ── Orchestrator (dev-flow) ──────────────────────────────────────────────────
/dev-flow init [project-name]        # Greenfield bootstrap: Discovery → Architecture → Infra → Sprint 0
/dev-flow                            # Full mode — next task in Active Sprint (Path A)
/dev-flow "add Google OAuth login"   # Full mode — freeform input, auto-invokes task-decomposer (Path B)
/dev-flow quick TASK-042             # Quick mode — specific task, Gate 0 + Gate 2 only
/dev-flow hotfix                     # No gates — production emergency (hardened — see §21)
/dev-flow review [PR# | file1 file2] # Review-only — skips Parse, accepts PR or file list directly
/dev-flow resume TASK-042            # Resume interrupted session at last incomplete micro-task

# ── Task Decomposer (standalone or invoked by dev-flow Path B) ────────────────
/task-decomposer "add checkout flow" # From freeform description
/task-decomposer JIRA-123            # From ticket URL — fetches and parses ticket content
/task-decomposer --epic "Payment"    # From epic name — decomposes into full sprint backlog
/task-decomposer --prd [file.md]     # From PRD document — full decomposition

# ── Universal skills ─────────────────────────────────────────────────────────
/adr-writer [decision topic]         # Write ADR entry in docs/DECISIONS.md
/refactor-advisor [file/feature]     # Analyze refactoring opportunities (context: fork)
/security-auditor [scope]            # Standalone security scan (context: fork)
/pr-reviewer [files/feature]         # Standalone code review (context: fork)
/system-design-reviewer [proposal]   # Architecture review (context: fork)
/lean-doc-generator [type] [subject] # Create/update lean docs with ownership headers
/release-manager [version]           # Prepare release notes + CHANGELOG entry

# ── Conditional — invoked by orchestrator, not by user directly ───────────────
/migration-advisor [migration-file]  # Safety check: up/down parity, rollback, concurrency
/performance-advisor [endpoint/fn]   # Load + query plan + response time baseline
```

**Command — mode decision guide**:

| Situation | Command |
|:----------|:--------|
| Starting a brand new project | `/dev-flow init [name]` |
| I have a description/idea, no task written yet | `/dev-flow "your description"` |
| I have a Jira/Linear/GitHub ticket | `/task-decomposer TICKET-123` |
| I have a PRD or feature doc | `/task-decomposer --prd [file.md]` |
| I have an epic to break into sprints | `/task-decomposer --epic "Epic Name"` |
| Next feature/bug from TODO.md (task already written) | `/dev-flow` |
| Small bug, 1-3 files max (task already written) | `/dev-flow quick TASK-NNN` |
| Production down, fix NOW | `/dev-flow hotfix` |
| Reviewing open PR before merge | `/dev-flow review [PR#]` |
| Session dropped mid-task | `/dev-flow resume TASK-NNN` |
| Architecture decision needed | `/adr-writer` |
| Code smells without a PR | `/refactor-advisor` |
| Security scan on demand | `/security-auditor` |
