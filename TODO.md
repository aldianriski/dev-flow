# dev-flow — Universal AI Workflow Starter — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-24 (Sprint 6 closed; Sprint 7 promoted)
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

### Sprint 7 — Harness Init Fixes (active)
> **Theme:** Resolve all P0 blockers found in Sprint 6 smoke test — fix hook path, allowedTools gaps, and stale README adoption commands so new users can start without errors.

- [x] **TASK-041: Fix `${CLAUDE_PLUGIN_ROOT}` in settings.json hooks** — variable only valid in plugin `hooks/hooks.json` context; project-local settings.json must use a path that resolves from workspace root; currently SessionStart hook fails with "hook command references ${CLAUDE_PLUGIN_ROOT} but hook is not associated with a plugin"
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: SessionStart hook runs `session-start.js` without the `${CLAUDE_PLUGIN_ROOT}` error; verify against CC_SPEC.md for correct project-hook path syntax
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: medium
- [x] **TASK-043: Add harness node scripts to `allowedTools` in settings.json** — hooks invoke `node .claude/scripts/*.js` as shell commands; without an `allowedTools` entry (`Bash(node .claude/scripts/*)`) Claude prompts for approval on every hook fire; blocks automated harness flow
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: SessionStart and PostToolUse hooks fire without a permission prompt; verify by running a fresh session against a scaffold dir
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low
- [x] **TASK-045: Add `Bash(git -C *)` pattern to harness hook matchers and allowedTools** — PreToolUse hooks match `Bash(git commit*)` and `Bash(git push*)` but not `git -C <path> commit` or `git -C <path> push`; `-C` flag precedes the subcommand so existing patterns never fire; lint + typecheck hooks silently skip on all `git -C` invocations
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: PreToolUse lint hook fires when `git -C <path> commit` is run; `allowedTools` in `settings.local.example.json` includes `Bash(git -C *)` pattern
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low
- [x] **TASK-039: Add settings.local.json setup step to README + SETUP template** — session-start.js hard-blocks on first session; no README or template tells users to create settings.local.json from settings.local.example.json
  - `scope`: quick
  - `layers`: docs, templates
  - `api-change`: no
  - `acceptance`: README "How to adopt" section includes settings.local.json copy step; SETUP.md.template has a "First session" prerequisite section
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low
- [x] **TASK-040: Update README "How to adopt" commands** — stale: references `07-todo-format.md` instead of `templates/TODO.md.template`; copies meta-repo CLAUDE.md instead of `templates/CLAUDE.md.template`; no settings.local.json step
  - `scope`: quick
  - `layers`: docs
  - `api-change`: no
  - `acceptance`: README "How to adopt" bash block uses `templates/CLAUDE.md.template` and `templates/TODO.md.template`; includes settings.local.json step; README stays within 50-line limit
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

---

## Backlog

### P0 — Scaffold init blockers (remaining after Sprint 7)

<!-- TASK-039, 040, 041, 043, 045 promoted to Sprint 7 -->

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

- [ ] **TASK-042: Add harness tracking for `Bash(cp*)` and `Bash(mkdir*)` in settings.json** — init flow (Phase I-3) and scaffold adoption use `cp` and `mkdir`; these bypass `track-change.js` and may trigger permission prompts without an explicit allowlist entry
  - `scope`: quick
  - `layers`: harness
  - `api-change`: no
  - `acceptance`: `settings.json` PostToolUse hook covers `Bash(cp*)` and `Bash(mkdir*)`; or explicit `allowedTools` entry prevents permission prompts during init scaffold setup
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

### P2 — Sprint 7+ candidates

<!-- TASK-021, TASK-024, TASK-033 promoted to Sprint 6 -->

- [ ] **TASK-046: Auto-create next sprint when active sprint is fully closed** — Session Close (Phase 10) detects all `[ ]` tasks in Active Sprint are done; prompts to rotate sprint block to `docs/CHANGELOG.md` and promote next P0→P1 backlog tasks into a new Active Sprint; prevents dead-end sessions where sprint completes but next work isn't queued
  - `scope`: quick
  - `layers`: skills
  - `api-change`: no
  - `acceptance`: Phase 10 Session Close checks for zero open `[ ]` tasks in Active Sprint; if none remain, outputs sprint rotation checklist and proposed next sprint from top Backlog items; human approves before TODO.md is written
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-047: Verify `evals/measure.py` compatibility on Python 3.10–3.12** — current dev machine runs 3.14 (confirmed by `.pyc` filename `cpython-314`); `Path.is_relative_to()` is 3.9+ so logic is safe, but untested on 3.10/3.11/3.12; validate or add `sys.version_info` guard with fallback for `is_relative_to`
  - `scope`: quick
  - `layers`: scripts
  - `api-change`: no
  - `acceptance`: `measure.py` runs without error on Python 3.10, 3.11, 3.12 (CI matrix or manual test); fallback documented in `evals/README.md` if `is_relative_to` unavailable
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

- [ ] **TASK-048: Apply three-arm eval to all shipped skills post-TASK-033** — TASK-033 ships harness + one baseline snapshot; follow-up: run eval against each of the 9 skills in MANIFEST.json; commit a baseline snapshot per skill; register results as the canonical baseline for future skill change reviews (prerequisite for TASK-026 RED-GREEN-REFACTOR enforcement)
  - `scope`: full
  - `layers`: scripts, skills
  - `api-change`: no
  - `acceptance`: `evals/snapshots/<skill>/baseline-001.json` exists for all 9 skills; `python evals/measure.py evals/snapshots/` runs clean across all; results reviewed and anomalies noted in `evals/README.md`
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low
  - `depends-on`: TASK-033

- [ ] **TASK-049: Add continue/done prompt to Phase 9 commit flow** — after commit succeeds, orchestrator asks "continue to next task or end session?"; if continue → skip Session Close, go directly to Phase 0 of next `[ ]` task in Active Sprint; if done → run full Phase 10 Session Close; enables uninterrupted improvement loops without manual `/dev-flow` re-invocation
  - `scope`: quick
  - `layers`: skills
  - `api-change`: no
  - `acceptance`: after commit in Phase 9, orchestrator outputs "Next: [TASK-NNN title] — type 'next' to continue or 'done' to close session"; 'next' jumps to Phase 0 of next task; 'done' runs Phase 10; if no remaining `[ ]` tasks → skip prompt, go directly to Phase 10 with sprint-complete flag
  - `tracker`: none — dev-flow meta-repo tracks tasks in TODO.md
  - `risk`: low

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

> Sprint 0–6 blocks archived → `docs/CHANGELOG.md`.

### Sprint 7 — In Progress

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/settings.json` | Replace `${CLAUDE_PLUGIN_ROOT}` → `$CLAUDE_PROJECT_DIR` in all 5 hook commands | — |
| `.claude/settings.json` | Add `permissions.allow: ["Bash(node .claude/scripts/*)"]` — suppress hook permission prompts | — |
| `.claude/settings.json` | Add `Bash(git -C * commit*)` + `Bash(git -C * push*)` PreToolUse matchers; inline chain-guard for `Bash(git add*)` blocks `&& git commit` chains | — |
| `.claude/settings.local.example.json` | Add `Bash(git -C *)` to permissions.allow | — |
| `README.md` | Add settings.local.json copy step to "How to adopt" bash block | — |
| `templates/SETUP.md.template` | Add "First session (Claude Code harness)" section with settings.local.json copy step | — |
| `README.md` | Fix stale paths → templates/; collapse blueprint listing to 1 line; trim to 47 lines | — |

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
