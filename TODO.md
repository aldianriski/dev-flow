# dev-flow — Universal AI Workflow Starter — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-26 (Sprint 15 archived; Sprint 16 — Skills decomp + P2 cleanup)
update_trigger: Sprint completed, task added, task status changed, or scaffold milestone reached
status: current
sprint: 16
---

> **External references** (sprint improvement sources — read before working on derived tasks)
> - https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md → behavioral guidelines patterns used in TASK-032
> - https://github.com/juliusbrussee/caveman → eval harness, single-source-of-truth discipline, context compression; used in TASK-033, 034, 036
> - https://github.com/obra/superpowers → Baseline guide for flow plugin development popular, TASK-018

> **How to use this file**
> - **Start of session** — read this file first. Understand the active sprint before touching code.
> - **Run /dev-flow** — once the orchestrator skill is materialized (Sprint 3), it will parse the first incomplete task `[ ]` in Active Sprint.
> - **Until Sprint 3 ships** — manual mode: pick the next `[ ]` task, run it through the workflow described in `AI_WORKFLOW_BLUEPRINT.md` Section 3 by hand.
> - **End of session** — Phase 10 Session Close. Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, append a Changelog row (File | Change | ADR), update relevant docs, then rotate the sprint block to `docs/CHANGELOG.md`.
> - **Docs to keep in sync**: `README.md` (root) · `docs/blueprint/*` · `CHANGELOG.md` · `CONTRIBUTING.md` · `.claude/CLAUDE.md` (when it exists)
> - **Changelog rule** — holds ONLY the current in-progress sprint. Once changes are reflected in docs, MOVE the sprint block to `docs/CHANGELOG.md` (prepend — newest first), then DELETE from here.

> **Sprint sizing rules** (per blueprint §8)
> - Group 2–5 tasks per sprint. Never plan a sprint with only 1 task.
> - Order by dependency first, then importance + urgency.
> - Promote tasks from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately when added to Active Sprint.

> **Layer values for this repo** (used in `layers:` field — meta-repo, no app code)
> `governance, docs, harness, scripts, skills, agents, templates, examples, ci`

---

## Active Sprint

### Sprint 16 — Skills decomp + P2 cleanup (active)
> **Theme:** Split the oversized dev-flow SKILL.md into reference files, apply the examples/ mirror policy (ADR), and close P2 quickwins (subagent trim + GraphViz flowcharts).
> **Source:** Backlog P1 (TASK-057, 058 from AUDIT.md); P2 (TASK-061, 062 from AUDIT.md).

- [x] **TASK-057: Decide examples/ mirror policy and apply**
  - scope: full · layers: examples, scripts, ci · risk: medium
  - api-change: no
  - acceptance: ADR written in `docs/DECISIONS.md` choosing one of three paths from AUDIT.md AUD-006: (a) delete mirror + minimal post-bootstrap files only, (b) auto-sync via pre-commit, (c) regenerate during CI. Implementation matches the ADR. CI fails if mirror drifts (paths a/c) or hook is missing (path b).
  - tracker: AUDIT.md#AUD-006

- [x] **TASK-058: Split dev-flow/SKILL.md to skills/dev-flow/references/**
  - scope: full · layers: skills, evals · risk: medium
  - api-change: no
  - acceptance: `.claude/skills/dev-flow/SKILL.md` ≤ 120 lines (frontmatter, Mode Dispatch, decision flow, Sub-commands, top-level Phase Checklist, Red Flags only); detail moved to `references/phases.md`, `references/hard-stops.md`, `references/mode-hotfix.md`, `references/mode-resume.md`, `references/mode-sprint.md`. `evals/measure.py compare` shows `terse_isolation_delta` does not regress past +379%.
  - tracker: AUDIT.md#AUD-007

- [x] **TASK-061: Trim subagent files to thin wrappers**
  - scope: quick · layers: agents, evals · risk: low
  - api-change: no
  - acceptance: `code-reviewer.md`, `security-analyst.md`, `migration-analyst.md`, `performance-analyst.md` each ≤ 25 lines (frontmatter, mandate, input contract, "follow `[skill-name]`", output token budget). Re-run baseline eval; expect noticeable `brevity_delta` improvement.
  - tracker: AUDIT.md#AUD-012

- [x] **TASK-062: Add GraphViz flowcharts to skills with non-obvious decision logic; document exemptions**
  - scope: quick · layers: skills, docs · risk: low
  - api-change: no
  - acceptance: `pr-reviewer/SKILL.md` and `lean-doc-generator/SKILL.md` get `dot` flowcharts (Stage 1→2 gating; HOW-filter branches). `refactor-advisor`, `system-design-reviewer`, `release-manager` reviewed and either get flowchart or are noted exempt in `docs/blueprint/05-skills.md` with reason. `security-auditor`, `adr-writer` documented as flowchart-exempt (pure checklist / append-only).
  - tracker: AUDIT.md#AUD-011

---

## Backlog

### P1 — Audit Pass 1 follow-on (correctness + adoption)

<!-- AUD-001, AUD-002 promoted to Sprint 14 (TASK-050, TASK-051) -->
<!-- TASK-054, TASK-055, TASK-056 promoted to Sprint 15 -->
<!-- TASK-057, TASK-058 promoted to Sprint 16 -->

- [ ] **TASK-059: Split blueprint mega-files (10-modes, 06-harness, 08-orchestrator)**
  - scope: full · layers: docs, scripts · risk: medium
  - acceptance: `docs/blueprint/10-modes.md` (871) split into `10a-init.md … 10f-task-decomposer.md` with 10-modes.md as ≤30-line index; `06-harness.md` (565) split into `06a-settings.md / 06b-scripts.md / 06c-claude-md-template.md`; `08-orchestrator-prompts.md` (397) split per phase if cohesive boundary exists. New blueprint-doc line cap (suggest 250) added to `validate-blueprint.js`. All cross-references updated.
  - tracker: AUDIT.md#AUD-008

- [ ] **TASK-060: Single SSOT for blueprint version; sync redirect + CI guard**
  - scope: full · layers: governance, ci, docs · risk: low
  - acceptance: `docs/blueprint/VERSION` (or equivalent single file) holds the canonical blueprint version; `AI_WORKFLOW_BLUEPRINT.md` redirect either reads VERSION at runtime or drops the version line; CI check fails any PR that triggers a MINOR/MAJOR rule (per CONTRIBUTING.md) without a VERSION bump. Document `package.json` version vs blueprint version coupling in DECISIONS.md.
  - tracker: AUDIT.md#AUD-009, AUDIT.md#AUD-017

### P1 — Workflow self-audit (raised in Sprint 14 session)

<!-- TASK-064 promoted to Sprint 15 -->

### P2 — Audit Pass 1 polish

<!-- TASK-061, TASK-062 promoted to Sprint 16 -->

- [ ] **TASK-063: Archive IMPROVEMENT_LOG.md; escalate empty-sprint signal**
  - scope: quick · layers: docs, governance, scripts · risk: low
  - acceptance: `IMPROVEMENT_LOG.md` either deleted or moved to `docs/archive/2026-04-20-session-1-critique.md` with `status: archived` ownership header; root no longer surfaces it. `session-start.js` escalates to WARN (not info) when Active Sprint AND Backlog are both empty, with suggestion to run `/task-decomposer` or `/dev-flow <freeform>`.
  - tracker: AUDIT.md#AUD-015, AUDIT.md#AUD-016

### P3 — Strategic epics (decompose via /task-decomposer before promoting)

> Direction-level moves from `STRATEGY_REVIEW.md`. Each is an epic, not a single task — run `/task-decomposer --epic "<name>"` against the strategy file before pulling into a sprint. Order is by leverage, not dependency.

- [ ] **EPIC-A: Plugin-first distribution (R-1)** — replace `cp -r` adoption with a Claude Code plugin install. Eliminates `examples/` mirror and ~90 % of adoption friction. Pre-req: confirm CC plugin spec covers hooks + skills + agents bundles. Source: STRATEGY_REVIEW.md#R-1.

- [ ] **EPIC-B: Code-enforced gates (R-3)** — Gate 0/1/2 become Node/Python functions returning `{pass, missing, suggested_fix}`. Hard stops become exit codes. Subsumes TASK-050 (phase-file) and reframes 24 hard stops as 5 enforced + N warnings (R-5). Source: STRATEGY_REVIEW.md#R-3, STRATEGY_REVIEW.md#R-5.

- [ ] **EPIC-C: Dogfood on real product (R-10)** — pick a real side project, build it end-to-end with dev-flow, document friction in PR notes. Without this validation, dev-flow remains a research artifact. Source: STRATEGY_REVIEW.md#R-10.

- [ ] **EPIC-D: State as YAML, telemetry as JSONL (R-2 + R-6)** — replace TODO.md as state-machine with `.claude/state.yaml`; add opt-in `.claude/.metrics.jsonl` for gate hits / hard-stop fires / phase durations. TODO.md becomes a render of state.yaml. Source: STRATEGY_REVIEW.md#R-2, STRATEGY_REVIEW.md#R-6.

- [ ] **EPIC-E: Harness wrap-or-replace decision (R-9)** — choose: wrap CC primitives (`/dev-flow` invokes TaskCreate, Phase 6 invokes `/review`) or replace them with documented rationale in DECISIONS.md. Today does both partially. Source: STRATEGY_REVIEW.md#R-9.

<!-- Closed-sprint trail (kept for reference) -->
<!-- TASK-001..049 closed across Sprints 0–13. See docs/CHANGELOG.md. -->
<!-- TASK-029, TASK-035 reserved/skipped — gap in numbering, do not reuse. -->

---

## Changelog

> Sprints are moved here from Active Sprint once complete, then archived to `docs/CHANGELOG.md`. This section holds only the current in-progress sprint's running log.

> Sprint 0–7 blocks archived → `docs/CHANGELOG.md`.
> Sprint 14–15 archived → `docs/CHANGELOG.md` (2026-04-26).

### Sprint 16 — In Progress

| File | Change | ADR |
|:-----|:-------|:----|
| `examples/node-express/.claude/` | Deleted mirror tree (50+ files) per ADR-004 SSOT policy | ADR-004 |
| `examples/node-express/docs/blueprint/` | Deleted mirror docs (10 files) per ADR-004 | ADR-004 |
| `examples/README.md` | Updated: project-specific files only; `.claude/` generated by dev-flow-init.js | ADR-004 |
| `.github/workflows/validate.yml` | Added examples mirror drift check step | ADR-004 |
| `docs/DECISIONS.md` | ADR-004 appended: examples/ mirror deletion decision | ADR-004 |
| `.claude/skills/dev-flow/SKILL.md` | Trimmed 372→116 lines; detail split to references/ | none |
| `.claude/skills/dev-flow/references/phases.md` | NEW: full Phase 0-10 checklists + Gate templates (185 lines) | none |
| `.claude/skills/dev-flow/references/hard-stops.md` | NEW: full 19-item hard stop list + context threshold template (34 lines) | none |
| `.claude/skills/dev-flow/references/mode-hotfix.md` | NEW: hotfix banner + workflow sequence (13 lines) | none |
| `.claude/skills/dev-flow/references/mode-resume.md` | NEW: resume prompt template (15 lines) | none |
| `.claude/skills/dev-flow/references/mode-sprint.md` | NEW: full Sprint Mode scoring/classification/execute (74 lines) | none |
| `evals/snapshots/dev-flow/TASK-058-{before,after}.json` | Eval snapshots for TASK-058 split | none |
| `evals/runs/TASK-058.md` | Eval run narrative: RED→GREEN→REFACTOR | none |

---

## Quick Rules
> Key conventions for any contributor (human or AI) working on the dev-flow starter itself.
> No need to open the full blueprint for these.

```
SCAFFOLD WORK
- Never write a script that touches Claude Code hooks without first verifying the input
  contract against context/research/CC_SPEC.md. v1.7.0's read-guard.js is the cautionary tale.
- Skill frontmatter: `name` and `description` are the only spec-required fields. Our extras
  (version, stack-version, last-validated, type, context, agent, skills, spawns) are project
  conventions — document each in docs/blueprint/05-skills.md, mark required vs optional.
- Skill `description` field discipline (per agentskills.io): third-person, starts with
  "Use when…", ≤500 chars, NEVER summarizes the skill's internal process.
- Every SKILL.md with non-obvious decision logic gets a GraphViz `dot` flowchart.
- Every SKILL.md that depends on AI not rationalizing gets a "Red Flags" table.
- Heavy reference content (>100 lines, e.g. patterns catalog, anti-pattern lists) goes in
  a sibling file under skills/<name>/references/, NOT inline in SKILL.md.
- Scripts are Node.js ≥18 or Python 3.10+. No bash-only constructs. Tested on Windows Git Bash + Linux.
- Every script under .claude/scripts/ gets a sibling __tests__/<name>.test.js.

DOC WORK
- The blueprint must obey its own lean-doc rules. If a doc file you're editing exceeds
  the line cap (README:50, ARCHITECTURE:150, DECISIONS:unlimited, SETUP:100, AI_CONTEXT:100),
  trim before commit — do not raise the cap.
- Every doc file gets the ownership header (owner, last_updated, update_trigger, status).
- HOW filter (mandatory before any doc line): if it explains HOW something works, move it
  to a code comment. If WHY → DECISIONS.md. If WHERE → ARCHITECTURE.md or README.md.

GOVERNANCE
- Blueprint version bumps follow semver, encoded in CONTRIBUTING.md:
  MAJOR = phase model / gate model / hook contract change
  MINOR = new mode / new agent / new skill / new hard stop
  PATCH = clarification / prompt rewording / fix
- Every blueprint change requires a CHANGELOG.md entry with the bump rationale.
- Skill changes that alter agent behavior require eval evidence (RED-GREEN-REFACTOR for
  skills, per superpowers pattern) before merge — see TASK-026 once implemented.

WORKFLOW (until Sprint 3 ships /dev-flow as a real skill)
- Run tasks manually through the blueprint §3 phases by hand: Parse → Clarify → Gate 0
  → Design → Gate 1 → Implement → Validate → Test → Review → Security → Gate 2 → Docs
  → Commit → Session Close. Yes, all of them. The discipline matters more than the tooling.
- Mark a task `[x]` in Active Sprint only when its acceptance criterion is verified.
- After each task: append the Changelog row, update docs touched, then move on.
```

---

## Roadmap (informational — not a workflow contract)

```
Sprint 0  →  Research & Foundation               (done — TASK-001..003)
Sprint 1  →  Doc refactor + governance            (done — TASK-004..006)
Sprint 2  →  Scaffold + scripts                   (done — TASK-007..012)
Sprint 3  →  Agents + Skills (project-local)       (done — TASK-013..017)
Sprint 4  →  Skills craft + description audit + behavioral template  (done — TASK-015, 018, 019, 032)
Sprint 5  →  Templates + validation               (done — TASK-020, 022, 023)
Sprint 6  →  Doc templates + eval harness         (active — TASK-021, 024, 033)
Sprint 7  →  Harness init fixes                   (done — TASK-039, 040, 041, 043, 045)
Sprint 8  →  Scripts + harness polish              (done — TASK-037, 038, 042)
Sprint 9  →  Workflow continuity + compat          (done — TASK-047, 049, 046)
Sprint 10  → Eval baselines + CI gate               (done — TASK-048, 025)
Sprint 11  → Sprint mode + context compression      (done — TASK-044, 036)
Sprint 12  → TDD framework + init script + worked example      (done — TASK-026, 028, 030)
Sprint 13  → Governance + automation                           (done — TASK-031, 034)
Sprint 14  → Audit Pass 1: P0 fixes + drift cleanup             (done — TASK-050..053)
Sprint 15  → Adoption + CI hardening                           (done — TASK-054..056, 064)
Sprint 16+ → Skills decomp + P2 cleanup                        (active)
```

> Sprint cadence is not fixed. Each sprint completes when its acceptance criteria are met
> and Gate 2 is approved. Stretch items in Sprint 5+ are explicit v2 territory — do not
> pull them forward without finishing earlier sprints.
