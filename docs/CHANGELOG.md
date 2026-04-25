---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-25 (Sprint 12 archived)
update_trigger: Sprint completed; blueprint version bumped
status: current
---

# Changelog

> Entries are prepended (newest first). Each sprint block is moved here from `TODO.md` once its changes are reflected in docs.
>
> **Semver bump rules** (also in `CONTRIBUTING.md` when it exists):
> - `MAJOR` — phase model / gate model / hook contract change
> - `MINOR` — new mode / new agent / new skill / new hard stop
> - `PATCH` — clarification / prompt rewording / fix

---

## Sprint 12 — TDD Framework + Init Script + Worked Example (2026-04-25)

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/measure.py` | Added `compare` sub-command (before/after snapshot delta) | — |
| `docs/blueprint/05-skills.md` | Added Skill Change Protocol (RED-GREEN-REFACTOR) section | — |
| `CONTRIBUTING.md` | Resolved TASK-026 forward-refs; governance rule made concrete | — |
| `.claude/CLAUDE.md` | Removed pending qualifier from eval evidence anti-pattern line | — |
| `evals/README.md` | Documented `compare` usage + bumped last_updated | — |
| `bin/dev-flow-init.js` | New CLI: copies scaffold into target repo with stack prompts | ADR-002 |
| `bin/__tests__/dev-flow-init.test.js` | Unit tests for applySubstitutions + getLayersForPreset | — |
| `package.json` | New: bin field + engines ≥18 | — |
| `docs/DECISIONS.md` | Added ADR-002: no external deps in bin/ | — |
| `examples/node-express/` | Worked example: scaffold + minimal Express server | — |
| `examples/README.md` | Pattern explanation for bootstrap workflow | — |

---

## Sprint 11 — Sprint Mode + Context Compression (2026-04-24)

**Blueprint version:** MINOR bump — `/dev-flow sprint` auto-run mode; `/dev-flow:compress` sub-skill + Python compression script

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/dev-flow/SKILL.md` | TASK-044: Add sprint mode — weight scoring, Sprint Plan template, single/two-phase split, hard stop for scope:full+risk:high | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-036: Add Sub-commands dispatch section for `:compress` | — |
| `.claude/skills/dev-flow-compress/SKILL.md` | TASK-036: New sub-skill — `/dev-flow:compress` spec, pass-through rules, compression rules, Red Flags | — |
| `.claude/scripts/compress.py` | TASK-036: Python 3.10+ compress script — path traversal guard, `.md` guard, backup-before-write, CRLF-safe, 17 tests | — |
| `.claude/scripts/__tests__/compress.test.py` | TASK-036: 17 unittest tests — backup, guards, pass-through, compression, CRLF | — |
| `.claude/skills/MANIFEST.json` | TASK-036: Bind dev-flow-compress skill (user-invocable: false) | — |
| `.claude/CLAUDE.md` | TASK-036: Add Python 3.10+ to stack + commands section; align scripts convention | — |

---

## Sprint 10 — Eval Baseline + CI Gate (2026-04-24)

**Blueprint version:** MINOR bump — first full eval coverage across all 9 skills; GitHub Actions CI gate enforcing scaffold + blueprint integrity on every PR

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/snapshots/*/baseline-001.json` | TASK-048: Three-arm baseline snapshots for all 9 skills (8 new); measure.py runs clean across all | — |
| `evals/README.md` | TASK-048: Baseline Anomalies section — brevity_delta pattern documented for structured-output skills | — |
| `.github/workflows/validate.yml` | TASK-025: GitHub Actions CI gate — validate-scaffold.js + validate-blueprint.js on every PR to master | — |

---

## Sprint 9 — Workflow Continuity + Compat (2026-04-24)

**Blueprint version:** PATCH bump — Phase 9c continue/done prompt; Phase 10 sprint-complete detection + rotation checklist; `measure.py` Python 3.8+ fallback

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/measure.py` | TASK-047: Guard `Path.is_relative_to()` with `Path.parents` fallback for Python < 3.9 | — |
| `evals/README.md` | TASK-047: Document Python 3.8+ compatibility note | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-049: Add Phase 9c continue/done prompt — 'next' chains to next task, 'done' runs Phase 10, no tasks → sprint-complete Phase 10 | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-046: Add sprint-complete detection to Phase 10 — rotation checklist + proposed Sprint N+1 output; human approves before TODO.md written | — |

---

## Sprint 8 — Scripts + Harness Polish (2026-04-24)

**Blueprint version:** PATCH bump — stale line-limit fix, session-start false-warning fix, cp/mkdir harness tracking

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/scripts/validate-scaffold.js` | Fix README.md + docs/README.md line limit 80 → 50; all 11 tests pass | — |
| `.claude/scripts/session-start.js` | Fix false ownership warning: use `hasLastUpdated` field-presence check instead of date regex for "no header" guard | — |
| `.claude/scripts/__tests__/session-start.test.js` | Add regression test: YYYY-MM-DD placeholder must not trigger ownership warning | — |
| `.claude/settings.json` | Add `Bash(cp*)` and `Bash(mkdir*)` to permissions.allow — prevent init-flow permission prompts | — |
| `.claude/settings.local.example.json` | Add `Bash(cp*)` and `Bash(mkdir*)` to permissions.allow | — |

---

## Sprint 7 — Harness Init Fixes (2026-04-24)

**Blueprint version:** PATCH bump — hook path fix, allowedTools additions, git -C matcher coverage, chain-guard, README adoption corrections

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/settings.json` | TASK-041: Replace `${CLAUDE_PLUGIN_ROOT}` → `$CLAUDE_PROJECT_DIR` in all 5 hook commands | — |
| `.claude/settings.json` | TASK-043: Add `permissions.allow: ["Bash(node .claude/scripts/*)"]` — suppress hook permission prompts | — |
| `.claude/settings.json` | TASK-045: Add `Bash(git -C * commit*)` + `Bash(git -C * push*)` PreToolUse matchers; inline chain-guard on `Bash(git add*)` blocks `&& git commit` chains | — |
| `.claude/settings.local.example.json` | TASK-045: Add `Bash(git -C *)` to permissions.allow | — |
| `README.md` | TASK-039: Add settings.local.json copy step to "How to adopt" | — |
| `README.md` | TASK-040: Fix stale paths → templates/; collapse blueprint listing; trim to 47 lines | — |
| `templates/SETUP.md.template` | TASK-039: Add "First session (Claude Code harness)" section | — |

---

## Sprint 6 — Doc Templates + Eval Harness (2026-04-24)

**Blueprint version:** MINOR bump — new eval harness (§17 Channel 4); new `docs/DECISIONS.md`; six doc templates shipped

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/README.md.template` | New — README template, 50-line limit, License section | — |
| `templates/ARCHITECTURE.md.template` | New — Architecture template, 150-line limit | — |
| `templates/DECISIONS.md.template` | New — Decision log template, ADR-001 example | — |
| `templates/SETUP.md.template` | New — Setup template, env vars table | — |
| `templates/AI_CONTEXT.md.template` | New — AI context template, Domain Glossary | — |
| `templates/CHANGELOG.md.template` | New — Changelog template, filled sprint example | — |
| `evals/measure.py` | New — offline three-arm skill eval harness, stdlib only, path-traversal guard | ADR-001 |
| `evals/README.md` | New — eval methodology doc, snapshot schema, usage | — |
| `evals/snapshots/lean-doc-generator/baseline-001.json` | New — first committed baseline snapshot | — |
| `docs/DECISIONS.md` | New — decision log; ADR-001: Python + three-arm methodology | ADR-001 |
| `docs/BUGS.md` | New — structured bug log: BUG-001 (PLUGIN_ROOT), BUG-002 (allowedTools) | — |
| `docs/blueprint/06-harness.md` | Added eval harness Channel 4 section | ADR-001 |
| `TODO.md` | TASK-024 smoke test: 4 P0 doc issues + 3 harness bugs captured (TASK-037–045) | — |

---

## Sprint 5 — Templates + Validation (2026-04-22)

**Blueprint version:** PATCH bump — new harness scripts and templates; no new skills, modes, or gates

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/TODO.md.template` | TASK-020 — Created — worked example sprint with all 6 required task fields and `[CUSTOMIZE]` markers throughout | — |
| `.claude/scripts/scaffold-checks.js` | TASK-022 — Created shared validation util: `countLines`, `globSkills`, `checkManifest`, `checkOwnershipHeader`, `checkDocLineLimits`, `checkRequiredFiles` | — |
| `.claude/scripts/validate-scaffold.js` | TASK-022 — CI hard-gate: 7 checks (required files, CLAUDE.md lines, MANIFEST schema, TODO.md ownership+sprint, skill count+frontmatter, doc limits); exits 1 on any failure; 11 tests | — |
| `.claude/scripts/validate-blueprint.js` | TASK-023 — Blueprint integrity: MANIFEST skill paths × filesystem; §4 agents × `.claude/agents/`; exits 1 on any failure; 6 tests | — |
| `.claude/scripts/session-start.js` | TASK-022 — Refactored: imports `countLines`, `globSkills`, `checkManifest`, `checkDocLineLimits` from scaffold-checks util; no duplicate logic | — |
| `docs/blueprint/07-todo-format.md` | Added Sprint Creation Checklist and Required Task Fields table | — |
| `TODO.md` | TASK-034 deferred to P3 (blocked on TASK-027 multi-platform sync); task fields added to all Sprint 5 tasks | — |

---

## Sprint 4 — Skills Craft + Description Audit + Behavioral Template (2026-04-22)

**Blueprint version:** PATCH bump — no new skills or gates; description rewrites, Red Flags additions, HOW-filter flowchart, behavioral guidelines template

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/task-decomposer/SKILL.md` | TASK-015 — Replaced stub with full §22 implementation — input type table, dot flowchart, 6-step execution protocol, risk scoring, scope assignment, 5 Red Flags, 5 hard rules | — |
| `.claude/skills/task-decomposer/references/decomposition-spec.md` | TASK-015 — Created — output format template, assumption registry format, granularity rules, 9 validation hard stops, `--from-architecture` spec, credential degradation spec | — |
| `.claude/skills/adr-writer/SKILL.md` | TASK-018 — Added Red Flags table (4 rows) — "obvious decisions", late recording, code-as-docs, one-liner rationalization | — |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-018/019 — Fixed description (removed process summary); added Red Flags table (4 rows); added Finding Severity Examples (CRITICAL vs NON-BLOCKING contrast) | — |
| `.claude/skills/lean-doc-generator/SKILL.md` | TASK-018/019 — Fixed description (removed HOW summary); added HOW-filter dot flowchart (3-branch decision tree); added Red Flags table (4 rows) | — |
| `.claude/skills/release-manager/SKILL.md` | TASK-018 — Added Red Flags table (4 rows) — breaking change bump, post-tag changelog, missing version file, vague commit intent | — |
| `.claude/skills/refactor-advisor/SKILL.md` | TASK-019 — Fixed description (removed process/output summary) | — |
| `.claude/skills/security-auditor/SKILL.md` | TASK-018/019 — Fixed description (removed scope summary); added Red Flags table (4 rows) — silent skips, stale approval, partial disclosure, internal-service blind spot | — |
| `.claude/skills/system-design-reviewer/SKILL.md` | TASK-018/019 — Fixed description (removed mode-summary); added Red Flags table (4 rows) — deferred details, operational correctness, brownfield doc check, status downgrade | — |
| `.claude/CLAUDE.md` | TASK-032 — Replaced placeholder template with populated dev-flow project context; added Behavioral Guidelines section (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) | — |
| `templates/CLAUDE.md.template` | TASK-032 — Created — adopter-facing template with [CUSTOMIZE] markers, ownership header, behavioral guidelines section | — |

---

## Sprint 3 — Agents + Skills (2026-04-21)

**Blueprint version:** MINOR bump — 7 full agent system prompts; 7 project-local skills; `regenerate-manifest.js`; `dev-flow` orchestrator skill live

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/agents/design-analyst.md` | TASK-016 — full Phase 2 system prompt: codebase exploration, micro-task plan, ≤300 token return | — |
| `.claude/agents/init-analyst.md` | TASK-016 — full INIT system prompt: Role A (Discovery) + Role B (Architecture); preloads system-design-reviewer | — |
| `.claude/agents/code-reviewer.md` | TASK-016 — full Phase 6 system prompt: two-stage [S1]/[S2] review; preloads pr-reviewer | — |
| `.claude/agents/security-analyst.md` | TASK-016 — full Phase 7 system prompt: OWASP audit; preloads security-auditor; CRITICAL never truncated | — |
| `.claude/agents/migration-analyst.md` | TASK-016 — full §19 system prompt: structural safety + concurrency + rollback stages | — |
| `.claude/agents/performance-analyst.md` | TASK-016 — full §20 system prompt: query analysis + API profile + caching + baseline | — |
| `.claude/agents/scope-analyst.md` | TASK-016 — full §22 system prompt: read-only impact assessment; risk scoring table | — |
| `.claude/skills/adr-writer/SKILL.md` | TASK-013 — full skill: ADR format, 5-step procedure, hard rules; context: inline | — |
| `.claude/skills/refactor-advisor/SKILL.md` | TASK-013 — full skill: 4 lenses, before/after format, risk tiers, Red Flags table | — |
| `.claude/skills/lean-doc-generator/SKILL.md` | TASK-013 — full skill: HOW filter, ownership header, Phase 8 procedure, line limits | — |
| `.claude/skills/lean-doc-generator/reference/DOCS_Guide.md` | TASK-013 — full lean doc standard: HOW filter examples, file reference, line-limit enforcement, checklist | — |
| `.claude/skills/lean-doc-generator/reference/VALIDATED_PATTERNS.md` | TASK-013 — 7 validated patterns + 2 anti-patterns from session-close promotions | — |
| `.claude/skills/release-manager/SKILL.md` | TASK-013 — full skill: SemVer rules, CHANGELOG format, hard rules; context: fork | — |
| `.claude/skills/system-design-reviewer/SKILL.md` | TASK-013 — full skill: 5 review lenses, greenfield/brownfield modes, output format | — |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-013 — full skill: 7-lens review, [S1]/[S2] labeling, hard rules; agent: code-reviewer | — |
| `.claude/skills/security-auditor/SKILL.md` | TASK-013 — full skill: OWASP Top 10 table, additional checks, CRITICAL never truncated | — |
| `.claude/scripts/regenerate-manifest.js` | TASK-017 — new: walks `skills/*/SKILL.md`, emits `MANIFEST.json`; testable via skillsDir param | — |
| `.claude/scripts/__tests__/regenerate-manifest.test.js` | TASK-017 — 7 passing tests: discovery, null last-validated, idempotency, JSON validity | — |
| `.claude/skills/MANIFEST.json` | TASK-017 — regenerated: 9 skills, all within staleness window | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-014 — full orchestrator: 6-mode dispatch, dot flowchart, Gate 0/1/2 prompts, Phase 0–10 checklist, 18 hard stops, hotfix/resume protocols, Red Flags table | — |

---

## Sprint 2 — Scaffold + Scripts (2026-04-21)

**Blueprint version:** MINOR bump — scaffold materialized; 4 harness scripts shipped; hook contract corrected

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/CLAUDE.md` | TASK-007 — stub template per blueprint §7; ownership header; ≤200-line budget | — |
| `.claude/settings.json` | TASK-012 — valid JSON; corrected hook commands with `${CLAUDE_PLUGIN_ROOT}`; SessionStart `startup\|resume\|clear\|compact` matcher added | — |
| `.claude/settings.local.example.json` | TASK-012 — example with `[package-manager]` placeholder and inline instructions | — |
| `.claude/agents/*.md` | TASK-007 — 7 agent stubs: design-analyst, init-analyst, code-reviewer, security-analyst, migration-analyst, performance-analyst, scope-analyst | — |
| `.claude/skills/MANIFEST.json` | TASK-007 — empty stub registry; Sprint 3 TASK-017 populates it | — |
| `.claude/skills/*/SKILL.md` | TASK-007 — 9 skill stubs with valid CC_SPEC frontmatter and Sprint 3 stub markers | — |
| `.claude/scripts/session-start.js` | TASK-008 — pure Node CommonJS; all 9 checks; no shell-outs; `globSkills()` uses `readdirSync`; exit 1 on blocking errors | — |
| `.claude/scripts/read-guard.js` | TASK-009 — rewrite from scratch; stdin JSON via fd 0 (cross-platform); exit 2 block; structured `{"decision":"block","reason":"..."}` output; fail-open on empty/unknown path | — |
| `.claude/scripts/track-change.js` | TASK-010 — stdin JSON; normalized backslash→forward-slash; ignores `.claude/`, `node_modules/`, lock files | — |
| `.claude/scripts/ci-status.js` | TASK-010 — `CI_PROVIDER=skip` default; GitHub Actions + GitLab CI poll paths; error-resilient | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-011 — 12 tests covering all 9 checks; temp-dir isolation; `node --test` passes | — |
| `.claude/scripts/__tests__/read-guard.test.js` | TASK-011 — 14 tests: block/allow/allowlist/missing-phase/fail-open/JSON-output scenarios | — |
| `.claude/scripts/__tests__/track-change.test.js` | TASK-011 — 9 tests: append, accumulate, ignore rules, empty stdin, backslash normalization | — |
| `.claude/scripts/__tests__/ci-status.test.js` | TASK-011 — 3 tests: default-skip, explicit-skip, timeout guard | — |

---

## Sprint 1 — Documentation Refactor + Governance (2026-04-20)

**Blueprint version:** 1.7.0 → infrastructure split (no behavior change; PATCH bump)

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/01–10-*.md` | TASK-004 — blueprint split into 10 modular files; ownership headers on each | — |
| `AI_WORKFLOW_BLUEPRINT.md` | TASK-004 — reduced to ≤20-line redirect to `docs/blueprint/` | — |
| `docs/blueprint/01-philosophy.md` | TASK-005 — phase I/O table renumbered 0–10; violation protocol phases corrected | — |
| `docs/blueprint/04-subagents.md` | TASK-005 — `scope.phase` enum: added parse/clarify/validate/close; `status:` enum added to output contract | — |
| `docs/blueprint/05-skills.md` | TASK-005 — `type:`, `when_to_use:`, `context: fork` documented as project-convention fields (required vs optional) | — |
| `docs/blueprint/06-harness.md` | TASK-005 — read-guard.js corrected to use stdin JSON (env-var approach was broken); `${CLAUDE_PLUGIN_ROOT}` in all hook paths | — |
| `README.md` | TASK-006 — root README, ≤80 lines, public-GitHub-ready, HOW-filter clean | — |
| `CONTRIBUTING.md` | TASK-006 — blueprint change process, semver bump criteria (MAJOR/MINOR/PATCH) | — |
| `LICENSE` | TASK-006 — MIT 2026, Aldian Rizki | — |
| `.gitignore` | TASK-006 — covers settings.local.json, .phase, .session-changes.txt, node_modules | — |
| `docs/CHANGELOG.md` | Created in Sprint 0 handoff; Sprint 1 block added here | — |

---

## Sprint 0 — Research & Foundation (2026-04-20)

**Blueprint version:** pre-v1.8.0 (no scaffold changes this sprint — research only)

| File | Change | ADR |
|:-----|:-------|:----|
| `TODO.md` | Initial creation — Sprint 0 active, Sprints 1–5 in backlog, scaffold roadmap captured | — |
| `context/research/CC_SPEC.md` | TASK-001 — binding CC spec reference: hook stdin JSON contract, exit-code 2 semantics, subagent `preload-skills` field, skill frontmatter per agentskills.io, 7 concrete implications for scaffold plan | — |
| `context/research/ADAPTATION_NOTES.md` | TASK-002 — superpowers pattern import plan: 20 patterns adopted (flowcharts, Red Flags, Good/Bad pairs, rigid/flexible, model tiers, status enum, RED-GREEN-REFACTOR, etc.) with target dev-flow home; 10 architecture elements we keep; 7 patterns rejected/deferred; acceptance-criterion deltas for TASK-005, 013–019, 026–027 | — |
| `context/workflow/DESIGN_PHILOSOPHY.md` | TASK-003 — three non-negotiables (gate-driven, mode-modal, 27-stop catalog) with rationale + consequence per contributor; 8 superpowers patterns explicitly rejected with one-line why; reviewer guardrails; change-criteria for the philosophy itself | — |
