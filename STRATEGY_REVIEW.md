---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-25
update_trigger: Major direction question raised; assumption challenged; new strategic alternative proposed
status: current
scope: strategic — pros/cons of the project concept and radical alternative directions
companion: AUDIT.md (tactical findings)
---

# dev-flow — Strategy Review

> Strategic-level critique of the project idea itself: "universal AI workflow starter, drop-in for any repo".
> Counterpart to `AUDIT.md` (tactical, line-level findings). This file is opinion + alternatives.
> Captured 2026-04-25 from Session 2 conversation. Revisit when the project enters a new sprint or considers a major pivot.

---

## Concept under review

A starter repository, copied into any project, providing:
- 3 gates (Gate 0 / 1 / 2)
- 6 modes (`init / full / quick / hotfix / review / resume`) + Sprint mode
- 24 hard stops (README claims 27 — drift)
- 7 subagents
- 10 project-local skills
- Eval harness (3-arm methodology)
- Harness scripts (session bootstrap, read-guard, change tracker, CI poller)

Adoption today: `git clone` + `cp -r` (manual), or `node bin/dev-flow-init.js` (Sprint 12 — invisible from README).

---

## Pros (real, not flattery)

| Strength | Why it matters |
|:---------|:---------------|
| **Gate-driven flow** | AI defaults to "yes, here's code". Gates force scope/design pause before write. Real discipline gain. |
| **Three-arm eval methodology** | `baseline / terse_control / skill` separates skill signal from "be brief" bias. Genuinely novel — rare in skill-system designs. |
| **HOW-filter for docs** | Most teams generate prose explaining what code already says. Filter forces WHY-only. Strong principle. |
| **TDD contract baked into Phase 5** | RED-GREEN-REFACTOR enforced at workflow level, not coaching. Uncommon in AI workflows. |
| **Self-aware governance** | Lean-doc rule, line caps, ownership headers, anti-patterns documented in own CLAUDE.md. Project audits itself. |
| **Tier 1/2/3 context budget** | Most skill libs ignore context cost. dev-flow names it explicitly per phase. |

---

## Cons (real, candid — open to all possibility)

### 1. "Universal" claim does not match reality
Coupled to Claude Code totally. Codex / Cursor / Cline → full rewrite. README admits `.codex/` `.cursor-plugin/` is "v2 planned". Universal is aspirational marketing, not current state.

### 2. Adoption cost dwarfs value for small teams
Solo dev fixing typo runs `quick` mode → still 5 phases. Time-to-first-commit measured in hours, not minutes. Cognitive surface: 10 skills × 7 agents × 24 hard stops × 10 phases × 7 modes × 3 gates. Casual adopter bounces.

### 3. Self-referential trap
14 sprints of work on the workflow itself. Near-zero actual product code built using the workflow. Risk: tooling for tooling's sake. No external adopter validation today.

### 4. Rules-on-paper, enforcement-on-vibes
AUDIT pass 1 (AUD-001) found `read-guard.js` is dead code — `.claude/.phase` is never written outside test fixtures. Headline v1.7.0 correctness control never fires. Pattern: workflow trusts AI to follow markdown rules, but AI is a probability model — does not follow rules consistently. Hard stops without code enforcement = polite suggestions.

### 5. TODO.md as state machine = brittle
Sprint state, task state, phase state stored in markdown text. Parsing regex-heavy. One bad edit → orchestrator confused. State belongs in YAML/JSON; markdown can be the view, not the model.

### 6. Competes with the harness it runs on
Claude Code already ships `TaskCreate`, `/init`, `/review`, plan mode. dev-flow re-implements all four with markdown templates. TODO.md vs TaskCreate, `/dev-flow init` vs `/init`, Phase 6 vs `/review`. Today dev-flow does both partially — worst path.

### 7. Eval metric noisy
Sprint 10 baseline: `dev-flow` skill `brevity_delta +2.7%`, `terse_isolation_delta +379%`. README justified: "structured output expected". If every "good" skill produces this pattern, the metric does not measure quality — it measures structure-vs-prose. Eval framework needs ground-truth calibration before being trusted as a merge gate.

### 8. Numerical drift between marketing and source-of-truth
README "27 hard stops" — actual 24. README "9+ skills" — actual 10. Small but signals self-aggrandizement creep. Common pattern in workflow systems: rule count = perceived rigor.

### 9. Bus factor = 1
One Tech Lead designed every gate, every skill, every script. No second voice. "Universal starter for any project" by one person = ambitious. Diverse stack validation absent.

### 10. Compression-as-feature questionable
caveman compression saves input tokens but trades grep / diff / code-review readability. Markdown output is small to begin with — token savings vs friction unclear. Tradeoff under-examined; eval evidence absent for the dev-flow-compress sub-skill (AUD-004 corollary).

---

## Radical improvements (10 directions — open to all)

> Ranked roughly by strategic leverage, not implementation cost. Pick 1–3, not all 10.

### R-1. Invert distribution: be a Claude Code plugin, not a scaffold
Today: clone repo + cp -r + manual edits. With plugin: install once → every project gets gates, skills, agents auto-loaded based on project type signal (`package.json` / `pyproject.toml` / `go.mod`). Eliminates `examples/node-express/` mirror entirely. Eliminates 90 % of adoption friction. Distribution becomes one-line install.

### R-2. State as YAML, not Markdown
Replace `TODO.md` as state with `.claude/state.yaml` — sprint, tasks, phase, gate-status as typed fields. Render `TODO.md` as a human-readable view. Removes regex parsing. AI writes structured updates, never breaks format. Validate-scaffold becomes a JSON-schema check.

### R-3. Gates as code, not prose
Today: gates are templates the orchestrator emits. Nothing checks they ran. Future: Gate 0/1/2 are Node/Python functions — `gate_0(scope_inputs) → { pass: bool, missing: [...], suggested_fix: str }`. AI fills inputs, code decides go/no-go. Hard stops become exit codes, not bullet lists. Closes AUD-001 by construction.

### R-4. Drop "universal", pick 3 stacks, dominate
Node-Express + Python-FastAPI + Go-Gin done excellently > "universal" done averagely. Each stack ships with real lint / typecheck / CI presets baked in. Solves AUD-002 + AUD-010 by construction. "Universal" is a marketing trap that doubles surface area for half-quality.

### R-5. Cut hard stops to 5
24 is unenforceable cognitive load. Ruthless merge:
1. Scope unconfirmed (Gate 0 not approved)
2. Lint / typecheck / tests fail
3. CRITICAL review or security finding
4. Migration without down-migration
5. CI non-green after push

Rest → warnings (non-blocking but logged). Less fatigue → more compliance.

### R-6. Telemetry (opt-in JSONL)
`.claude/.metrics.jsonl` — log gate hits, gate skips, hard stop fires, phase durations. Without data, workflow is calibrated by one person's intuition. 100 lines of telemetry will reveal which 5 gates fire 90 % of the time and which 19 never fire. Then prune. Without data, the workflow is faith-based.

### R-7. Adaptive workflow, not fixed
Meta-skill that GENERATES the workflow per project. Solo prototype → 0 gates, no review agent, hotfix-default. Mid-team API → 2 gates. Regulated finance → 5 gates + audit log. Same primitives, different rigidity. Sells far better than "27 hard stops for everyone".

### R-8. Skill RAG over skill library
32 skills loaded by name today (10 project + 22 user). Replace with semantic search on a single skill registry. AI queries: "I need X" → matched skill loaded. Stops loading 10 skills' worth of frontmatter every session when only 1 will be used.

### R-9. Build on harness primitives, do not duplicate
TaskCreate / TaskList exist in CC. `/init` exists. `/review` exists. Plan mode exists. Either:
- **(a) Wrap them** — `/dev-flow` invokes TaskCreate; TODO.md auto-generated from task list; Phase 6 uses `/review` underneath.
- **(b) Replace them** — explain in DECISIONS.md why dev-flow's version is better.

Today: (c) does both, partially. Worst path. Pick (a) or (b) and commit.

### R-10. Dogfood loudly or kill
14 sprints on the workflow, no real product built with it. Pick a real side project, build it end-to-end with dev-flow, document friction in PR notes. If dev-flow accelerates → ship plugin to marketplace, watch external adopters file issues. If dev-flow slows you down → fix or kill the offending part. Right now dev-flow is Schrödinger's product — visible and unvalidated.

**Outcome (2026-04-27):** TASK-001 (global error-handler middleware) completed end-to-end through all 10 dev-flow phases in `examples/node-express/`. Mode: full. No hard stops fired. Session notes: `docs/research/dogfood-session-notes.md`. Friction log: `docs/research/dogfood-friction-log.md`. **Result: validated** — dev-flow accelerated the task; all gates fired correctly; no false positives from review or security agents. Medium-priority friction found in Phase 4 (no lint config in example), Phase 3 (set-phase.js path resolution in subdirectory project), and Phase 8 (no fast-exit for no-doc-change tasks). Four follow-up tasks logged in friction log. EPIC-C closed.

---

## Bottom line

Concept good. Execution thoughtful. Trapped between "research project" and "shippable starter" — leaning research.

Three highest-leverage moves that change trajectory:

| # | Move | Closes |
|:--|:-----|:-------|
| **R-1** | Plugin-first distribution | Adoption friction (cons §2) |
| **R-3** | Code-enforced gates | Rules-on-paper (cons §4) + AUD-001 |
| **R-10** | Dogfood on real product | Self-referential trap (cons §3) + bus-factor signal (cons §9) |

Without one of those, dev-flow caps at "personal workflow one Tech Lead loves". With all three, real chance at marketplace adoption.

**Hardest pill**: the workflow is a product, not a feature. Either ship it like a product (plugin, telemetry, external users) or use it like a feature (one stack, on real code, measure friction). Today it is neither — it is a research artifact polished by its own gates.

---

## How to use this file

1. Re-read at the start of any sprint that questions direction (e.g. "should I keep adding skills, or pivot?").
2. Treat each radical improvement as a candidate epic — promote to TASK-NNN via `/task-decomposer` once chosen.
3. When a radical move is taken, record the decision in `docs/DECISIONS.md` and link back here.
4. Revise this file when the project answers a "Bottom line" question — flip from neither to product, or to feature.
5. Pair with `AUDIT.md` for tactical follow-up. AUDIT = "what is broken in current direction"; STRATEGY_REVIEW = "is the direction itself right".
