---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Component added or outcome revised
status: current
---

# USER-OUTCOMES.md — User-Project Outcome Registry

dev-flow is a plugin. The plugin is a means; **the user's project is the end**. This file maps every plugin component to the user-project outcome(s) it supports, plus the **counter-evidence** (when to skip it). New components MUST add a row here before merge — see [ADR-026](adr/ADR-026-user-project-outcome-lens.md).

> **How to read this file** — Each row claims a non-trivial outcome AND names a concrete scenario where the component is *not* the right fit. Tautological skip-whens (e.g., "skip when not needed") are rejected at review.

---

## Outcomes (canonical)

| ID | Alias (used in README) | Outcome | One-line definition | Lens / proxy signal |
|:--:|:----------------------:|:--------|:--------------------|:--------------------|
| **O1** | `onboard` | Faster onboarding | New contributor productive day-1 in unfamiliar repo | Time from clone → first informed PR |
| **O2** | `doc-rot` | Less doc rot | Docs reflect current code; stale frontmatter caught | `last_updated` drift vs file mtime; codemap freshness |
| **O3** | `architecture` | Clearer architecture | Shared mental model of modules + boundaries + decisions | ADR coverage of hard-to-reverse calls; codemap recency |
| **O4** | `rework` | Fewer rework cycles | Scope/design issues caught BEFORE implementation | Rework PRs / total PRs ratio; G1+G2 catch rate |
| **O5** | `flow` | Optimal harness flow | Workflow runs end-to-end without friction (gates · modes · dispatch · hooks) | Sprints completed without mid-flight protocol breaks |
| **O6** | `correction` | Workflow correction | Mid-flight redirect when work goes off-track (BLOCKED findings · red flags · grill mode) | BLOCKED → fix-then-resume vs silent drift |
| **O7** | `template` | Template / init audit | Every new project starts from same scaffold baseline; reusable skill/sprint templates | `/orchestrator init` deterministic output; lean-doc templates reused |
| **O8** | `reliability` | Plugin reliability | Plugin updates don't regress user-project workflows; eval-evidence rule enforces this | Acceptance harness pass rate per release; skill-trigger regression count |

---

## Skills (15) → outcomes

- **`orchestrator`** → O5 · O6 · O4 — gate-driven dispatch; G1 catches scope drift; G2 forces design before commit. **Skip when:** trivial in-file edit (no scope/design questions); use direct edit.
- **`task-decomposer`** → O4 · O7 — vertical slice decomposition; assumption registry prevents premature implementation. **Skip when:** task already in Active Sprint — use `/orchestrator`.
- **`prime`** → O1 · O5 — deterministic context load (CLAUDE.md → CONTEXT.md → MEMORY → sprint → codemap L0). **Skip when:** resuming mid-session with context still warm.
- **`pr-reviewer`** → O4 · O8 — 7-lens structured review; catches regressions before merge. **Skip when:** docs-only PR with no behavior change.
- **`security-auditor`** (`/security-review`) → O8 · O4 — OWASP audit in separate session (ADR-015 one-way dispatch). **Skip when:** governance/docs change with no surface to audit.
- **`refactor-advisor`** → O3 · O4 — code-smell sweep; deep-module candidates. **Skip when:** green-field code with no callers yet.
- **`zoom-out`** → O1 · O3 — read-only module map before cross-cutting change. **Skip when:** implementation plan already exists; use `/orchestrator`.
- **`diagnose`** → O4 · O6 — 6-phase systematic debugging. **Skip when:** architectural concern (use architecture-grill) or test-first work (use `/tdd`).
- **`tdd`** → O4 · O8 — tracer-bullet → red-green-refactor; reliability via test-first. **Skip when:** throwaway prototype where tests outlast use.
- **`lean-doc-generator`** → O2 · O7 · O3 — frontmatter discipline · sprint lifecycle templates · WHY/WHERE-only enforcement. **Skip when:** target file is prose-only (no frontmatter contract) — falls back to plain edit.
- **`adr-writer`** → O3 · O2 — captures hard-to-reverse decisions; prevents architectural amnesia. **Skip when:** reversible low-impact decision; over-ADR-ing dilutes registry signal.
- **`release-manager`** → O8 · O5 — semver discipline; changelog generation from git. **Skip when:** pre-v1 unstable phase; bump-then-rebump churn.
- **`release-patch`** → O8 · O5 — PATCH bump with auto-detected manifest cascade (plugin lockstep / npm `package.json` / python `pyproject.toml` / cargo `Cargo.toml` / go tag / flat `VERSION`); CHANGELOG prepend; plugin-mode-only steps (MEMORY refresh + CONTEXT drift check); HARD STOP at push. **Skip when:** no version manifest detected (release is tag-only with no version field anywhere) — skill prompts and exits clean. Auto-skips when diff is docs-only.
- **`write-a-skill`** → O7 · O8 — skill authoring with size caps + trigger-quality gates. **Skip when:** one-off prompt that won't be reused.
- **`codemap-refresh`** → O1 · O2 — regenerates `docs/codemap/CODEMAP.md` + `handoff.json` (3-tier). **Skip when:** PostToolUse hook will fire on next commit anyway; manual run is for first-time setup or stale-hook recovery.

---

## Agents (7) → outcomes

- **`dispatcher`** → O5 · O6 — only user-facing agent; spawns specialists per ADR-015 one-way contract. **Skip when:** task is read-only exploration — use `/zoom-out` or direct file reads.
- **`design-analyst`** → O3 · O4 — read-only architectural plan at G2 + **5 review lenses** (correctness · scalability · coupling · operational · resilience) auto-applied; supports `--grill` flag for strict 1-Q-at-a-time mode (architecture-grill merged in v4.0.0 per ADR-037). Never modifies files. **Skip when:** mode is `quick` (no G2) or `init` (no work yet).
- **`code-reviewer`** → O4 · O8 — post-implementation review; loads `pr-reviewer` skill. **Skip when:** docs/governance-only diff; reviewer can fast-path.
- **`scope-analyst`** → O4 — blast-radius assessment at G1 when size unclear. **Skip when:** size already estimated S/M/L with named files.
- **`security-analyst`** → O8 — separate `/security-review` session (never same-context per ADR-015). **Skip when:** no externally-exposed surface in diff.
- **`performance-analyst`** → O8 · O4 — hot-path / DB / API touch + high-risk gate. **Skip when:** no hot-path code in diff; cold-path optimization is premature.
- **`migration-analyst`** → O8 — DB schema change safety + rollback feasibility. **Skip when:** no migration files in diff.

---

## Gates (2) → outcomes

- **G1 Scope** *(quick + mvp + sprint-bulk)* → O4 · O5 — verifiable goal · S/M/L size · constraints · skill red flags · **user-project outcome named (per ADR-026)**. **Skip when:** mode = `init` (no task work).
- **G2 Design** *(mvp + sprint-bulk)* → O3 · O4 — design-analyst plan · `DONE`/`DONE_WITH_CONCERNS` · ADR for hard-to-reverse · no `BLOCKED`. **Skip when:** mode = `quick` (S size, low risk).

---

## Hooks (3) → outcomes

- **SessionStart** (PowerShell) → O1 · O8 — verifies CLAUDE.md presence, settings, active sprint state at session open. **Skip when:** non-interactive batch run where session-start banner is noise.
- **PreToolUse chain-guard** → O8 — blocks `git add && git commit` chains so lint hook fires reliably. **Skip when:** N/A — silent guardrail; no opt-out.
- **PostToolUse codemap-refresh** → O2 · O1 — regenerates codemap on every commit; prevents stale module map. **Skip when:** N/A — auto-fires; manual `/codemap-refresh` only for hook-failure recovery.

---

## Scripts (4) → outcomes

- **`scripts/audit-baseline.js`** (Node) → O8 — repo-metrics snapshot for audits. **Skip when:** no audit cycle in progress.
- **`scripts/eval-skills.js`** (Node) → O8 — skill structural eval (behavioral 3-arm port queued as TASK-115-v2). **Skip when:** docs-only PR with no skill behavior change.
- **`scripts/session-start.ps1`** (PowerShell) → O1 · O8 — SessionStart hook target. **Skip when:** N/A — hook-fired only.
- **`scripts/codemap-refresh.ps1`** (PowerShell) → O2 — PostToolUse hook target. **Skip when:** N/A — hook-fired only.

---

## Anti-outcomes (what dev-flow does NOT claim)

Honest scope. dev-flow does **not** deliver:

- **App-code generation** — no scaffolding of business logic, UI components, or API routes. dev-flow shapes *how* a project is built, not *what* it builds.
- **CI/CD pipeline** — offers patterns (PreToolUse chain-guard, PostToolUse codemap-refresh) but does not replace GitHub Actions / Jenkins / etc. User-project owns CI.
- **Automated test coverage** — `tdd` skill teaches discipline; plugin does not measure or enforce coverage thresholds.
- **Project-management replacement** — TODO.md is local sprint discipline, not Jira / Linear / GitHub Projects substitute.
- **Telemetry of user-project metrics** — plugin runs in user's terminal; cannot observe their repo state, PR cycle time, or onboarding velocity. Outcomes are *claimed* + *counter-evidenced*, not *measured*.

---

## Adding a new component

Before opening a PR for a new skill / agent / gate / hook / script:

1. Identify ≥1 outcome (O1-O8) it supports.
2. Write a non-tautological skip-when describing when another component (or no component) is the better fit.
3. Add the row to the relevant section above.
4. Cross-link from the component's own doc (SKILL.md / agent .md / etc).

PRs without a USER-OUTCOMES row are blocked at review per [ADR-026 DEC-3](adr/ADR-026-user-project-outcome-lens.md).

---

## References

- [ADR-026](adr/ADR-026-user-project-outcome-lens.md) — outcome-lens decision record
- [README.md § What Your Project Gets](../README.md) — outcome-first framing for users
- [CLAUDE.md § Anti-Patterns](../.claude/CLAUDE.md) — `❌ Plugin-internal optimization without stated user-project outcome`
- [CONTEXT.md § Agentic Engineering Principles](../.claude/CONTEXT.md) — User-Project Lens (5th principle)
- [Sprint 048 plan](sprint/SPRINT-048-user-project-outcome-lens.md) — origin sprint
