# dev-flow — Universal AI Workflow Starter — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-22 (Sprint 5 closed; Sprint 6 promoted)
update_trigger: Sprint completed, task added, task status changed, or scaffold milestone reached
status: current
sprint: 6
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

### Sprint 6 — Doc Templates + Eval Harness (active)
> **Theme:** Complete the template set with six doc templates, smoke-test the full scaffold end-to-end, and implement the three-arm eval harness needed for skill TDD evidence.

- [x] **TASK-021: Author `docs/*.md.template` set** — README, ARCHITECTURE, DECISIONS, SETUP, AI_CONTEXT, CHANGELOG; each includes lean-doc ownership header and `[CUSTOMIZE]` markers
  - `scope`: quick
  - `layers`: templates, docs
  - `api-change`: no
  - `acceptance`: six template files exist under `templates/`; each has ownership header, at least one `[CUSTOMIZE]` marker, and one filled-in example section
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low
- [x] **TASK-024: Smoke-test the full scaffold against a scratch directory** — proves the starter actually starts; run `/dev-flow init` against a fresh dir; capture any issues as P0 backlog items
  - `scope`: quick
  - `layers`: scripts, docs
  - `api-change`: no
  - `acceptance`: `/dev-flow init` completes against a scratch directory without hard errors; any P0 issues captured in Backlog before Gate 2
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: medium
- [x] **TASK-033: Implement three-arm skill eval harness** — `baseline / terse-control / skill` methodology; Python 3.10+; offline `measure.py` + committed snapshots in `evals/snapshots/`; prerequisite for TASK-026. **Ref:** https://github.com/juliusbrussee/caveman (evals/ directory and three-arm harness methodology)
  - `scope`: full
  - `layers`: scripts, ci
  - `api-change`: no
  - `acceptance`: `measure.py` reads committed snapshots without API calls; `evals/snapshots/` has at least one baseline result; methodology documented in `evals/README.md`
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: medium

---

## Backlog

### P0 — Scaffold init blockers (found in TASK-024 smoke test, 2026-04-24)

- [ ] **TASK-037: Fix `validate-scaffold.js` README line limit stale value** — limit is 80, canonical is 50 (DOCS_Guide.md §README); CI gate will silently pass oversized READMEs
  - `scope`: quick
  - `layers`: scripts
  - `api-change`: no
  - `acceptance`: `validate-scaffold.js` fails when README.md exceeds 50 lines; passes at 50
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-038: Fix session-start.js false ownership warning on fresh template** — `YYYY-MM-DD` placeholder in TODO.md.template fails date regex; new users see spurious "no ownership header" warning on first session
  - `scope`: quick
  - `layers`: scripts
  - `api-change`: no
  - `acceptance`: running session-start.js in a scratch dir with TODO.md.template-instantiated file produces no ownership warning
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-039: Add settings.local.json setup step to README + SETUP template** — session-start.js hard-blocks on first session; no README or template tells users to create settings.local.json from settings.local.example.json
  - `scope`: quick
  - `layers`: docs, templates
  - `api-change`: no
  - `acceptance`: README "How to adopt" section includes settings.local.json copy step; SETUP.md.template has a "First session" prerequisite section
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-040: Update README "How to adopt" commands** — stale: references `07-todo-format.md` instead of `templates/TODO.md.template`; copies meta-repo CLAUDE.md instead of `templates/CLAUDE.md.template`; no settings.local.json step
  - `scope`: quick
  - `layers`: docs
  - `api-change`: no
  - `acceptance`: README "How to adopt" bash block uses `templates/CLAUDE.md.template` and `templates/TODO.md.template`; includes settings.local.json step; README stays within 50-line limit
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-041: Fix `${CLAUDE_PLUGIN_ROOT}` in settings.json hooks** — variable only valid in plugin `hooks/hooks.json` context; project-local settings.json must use a path that resolves from workspace root; currently SessionStart hook fails with "hook command references ${CLAUDE_PLUGIN_ROOT} but hook is not associated with a plugin"
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: SessionStart hook runs `session-start.js` without the `${CLAUDE_PLUGIN_ROOT}` error; verify against CC_SPEC.md for correct project-hook path syntax
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: medium

- [ ] **TASK-043: Add harness node scripts to `allowedTools` in settings.json** — hooks invoke `node .claude/scripts/*.js` as shell commands; without an `allowedTools` entry (`Bash(node .claude/scripts/*)`) Claude prompts for approval on every hook fire; blocks automated harness flow
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: SessionStart and PostToolUse hooks fire without a permission prompt; verify by running a fresh session against a scaffold dir
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-042: Add harness tracking for `Bash(cp*)` and `Bash(mkdir*)` in settings.json** — init flow (Phase I-3) and scaffold adoption use `cp` and `mkdir`; these bypass `track-change.js` and may trigger permission prompts without an explicit allowlist entry
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: `settings.json` PostToolUse hook covers `Bash(cp*)` and `Bash(mkdir*)`; or explicit `allowedTools` entry prevents permission prompts during init scaffold setup
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

### P2 — Sprint 7+ candidates

<!-- TASK-021, TASK-024, TASK-033 promoted to Sprint 6 -->

- [ ] **TASK-044: Sprint-completion mode — auto-run active sprint tasks in one flow** — no explicit mode keyword; dev-flow reads active sprint task list, scores total weight (scope + file count estimate + risk), and decides: if sprint fits in one phase run all tasks sequentially (Gate 0 → implement → validate per task, single Gate 2); if sprint is too large auto-split into Phase 1 / Phase 2 and present the split plan for human approval before starting
  - `scope`: full
  - `layers`: skills
  - `api-change`: no
  - `acceptance`: `/dev-flow sprint` reads all `[ ]` tasks in active sprint; weight score determines single-phase vs two-phase split; each task gets individual Gate 0 + validate; single Gate 2 per phase aggregates full diff; hard stop if any task scores full-scope or risk:high (must be run standalone); split plan shown to human before execution begins
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: medium

### P3 — Long-term maintenance + stretch

- [ ] **TASK-025: GitHub Actions workflow for blueprint + scaffold validation on PR** — runs `validate-scaffold.js` and `validate-blueprint.js`, blocks merge on failure
- [ ] **TASK-026: Skill TDD pressure-test framework** — adopt superpowers' RED-GREEN-REFACTOR for skill content; subagent pressure scenarios with before/after eval evidence required for skill changes
- [ ] **TASK-027: Multi-platform plugin manifests (`.codex/`, `.cursor-plugin/`, `.opencode/`, `GEMINI.md`, `AGENTS.md`)** — defer to v2; structure now so adoption is non-breaking later
- [ ] **TASK-028: Worked example under `examples/node-express/`** — minimal Express service that has been bootstrapped via `/dev-flow init` end-to-end, committed as proof
- [ ] **TASK-029: Plugin marketplace submission (Anthropic official + standalone)** — long-term distribution path; depends on v2 multi-platform layout
- [ ] **TASK-030: `bin/dev-flow-init` bootstrap script (Node)** — copies scaffold into a target repo with stack prompts; replaces "git clone + manual cp" workflow over time
- [ ] **TASK-031: Quarterly skill-staleness audit cron via the `loop` skill** — automation for the Section 17 calibration protocol
- [ ] **TASK-034: Add single-source-of-truth governance rule to blueprint §5** — explicit rule: "edit canonical skill/rule files only, never edit auto-synced copies"; deferred until TASK-027 (multi-platform sync) provides the auto-sync infrastructure this rule guards against. **Ref:** https://github.com/juliusbrussee/caveman (CLAUDE.md "Single source of truth files" table)
- [ ] **TASK-036: Context compression sub-skill (`/dev-flow:compress`)** — compress `CLAUDE.md` and memory files to caveman-style prose for input token savings; write compressed version in-place, keep `.original.md` human-readable backup; validate that headings, code blocks, URLs, file paths, commands, and version numbers pass through untouched; Python 3.10+; requires TASK-020 (`CLAUDE.md.template`) to ship first so the template is the compression target, not a stub. **Ref:** https://github.com/juliusbrussee/caveman (see `caveman-compress/SKILL.md` and `caveman-compress/scripts/`)

---

## Changelog

> Sprints are moved here from Active Sprint once complete, then archived to `docs/CHANGELOG.md`. This section holds only the current in-progress sprint's running log.

> Sprint 0–5 blocks archived → `docs/CHANGELOG.md`.

### Sprint 6 — In Progress

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/README.md.template` | New — README template, 50-line limit, License section | — |
| `templates/ARCHITECTURE.md.template` | New — Architecture template, 150-line limit | — |
| `templates/DECISIONS.md.template` | New — Decision log template, ADR-001 example | — |
| `templates/SETUP.md.template` | New — Setup template, env vars table | — |
| `templates/AI_CONTEXT.md.template` | New — AI context template, Domain Glossary | — |
| `templates/CHANGELOG.md.template` | New — Changelog template, filled sprint example | — |
| `TODO.md` | Patch README line cap: 80 → 50 (matches DOCS_Guide.md) | — |
| `TODO.md` | TASK-024 complete: 4 P0 issues → TASK-037–040; 2 harness bugs → TASK-041–043; TASK-044 sprint mode added | — |
| `docs/BUGS.md` | Structured bug log: BUG-001 (PLUGIN_ROOT), BUG-002 (allowedTools) | — |
| `evals/measure.py` | New — offline three-arm skill eval harness, stdlib only | ADR-001 |
| `evals/README.md` | New — eval methodology doc, snapshot schema, usage | — |
| `evals/snapshots/lean-doc-generator/baseline-001.json` | New — first committed baseline snapshot | — |
| `docs/DECISIONS.md` | New — decision log, ADR-001: Python + three-arm methodology | ADR-001 |
| `docs/blueprint/06-harness.md` | Added eval harness Channel 4 section | ADR-001 |

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
- Scripts are pure Node (>=18). No bash-only constructs. Tested on Windows Git Bash + Linux.
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
Sprint 7+ →  Long-term maintenance + stretch      (P3 backlog — TASK-025..031, 034, 036)
```

> Sprint cadence is not fixed. Each sprint completes when its acceptance criteria are met
> and Gate 2 is approved. Stretch items in Sprint 5+ are explicit v2 territory — do not
> pull them forward without finishing earlier sprints.
