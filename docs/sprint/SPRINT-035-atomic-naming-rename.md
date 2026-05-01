---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending (plan-lock commit)
close_commit: —
---

# Sprint 035 — Atomic Naming Rename (EPIC-Audit Phase 1)

**Theme:** Eliminate name collisions blocking workflow clarity. Skill `dev-flow` → `orchestrator`. Agent `orchestrator` → `dispatcher`. Plugin name `dev-flow` unchanged.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 034 (EPIC-Audit Phase 0) closed `ead2cd2`.

---

## Why this sprint exists

Phase 0 baseline (`docs/audit/baseline-metrics.md`) confirmed two name collisions:
1. Skill `dev-flow` collides with plugin name `dev-flow` — slash command `/dev-flow` is ambiguous on intent (skill vs plugin scope).
2. Agent `orchestrator` collides with the planned skill rename target `orchestrator` — semantic overlap blocks Phase 2 wiring verification.

User-driven naming-clarity ask (audit ticket #3, 2026-05-01). Highest-risk single sprint per Phase 0 retro — kept atomic per Open Question Q2 resolution.

---

## Open Question Resolutions (locked at promote)

- **Q1 — ADR allocation 014..019**: agreed. ADR-014 written this sprint; 015–019 reserved for Phases 2 / 4c / 4b / 4d / 4a respectively. Reservations may shift if a phase folds.
- **Q2 — atomic vs split**: agreed atomic. Skill rename + agent rename touch overlapping files (`skills/orchestrator/SKILL.md`, agent cross-refs). Splitting doubles grep-sweep cost. Single sprint = single locked plan = single ADR-014 narrative.
- **Q3 — Phase 5 AI_CONTEXT.md fate**: agreed merge-and-delete. Essentials merge into `.claude/CONTEXT.md`; `docs/AI_CONTEXT.md` deleted. Captured here for Phase 5 plan; no execution this sprint.

---

## Plan

### T1 — Rename skill `dev-flow` → `orchestrator`
**Scope:** `git mv skills/dev-flow skills/orchestrator`. Update `SKILL.md` frontmatter `name:` and any self-references in body.
**Acceptance:** Dir renamed via `git mv` (history preserved). Frontmatter `name: orchestrator`. Skill description unchanged otherwise (still passes R4 "Use when..."). Body has zero literal "skill `dev-flow`" self-references.
**Edge cases:** `skills/dev-flow-compress/` is a separate skill — DO NOT touch. `argument-hint` field absent in current SKILL.md — no change. Slash command shortcut becomes `/orchestrator` (bare) and `/dev-flow:orchestrator` (namespaced).
**Files:** `skills/dev-flow/` (dir, ~6 files inside) → `skills/orchestrator/`.
**Tests:** `node scripts/eval-skills.js` post-rename — orchestrator skill still passes structural eval.
**Risk:** medium — `git mv` preserves history; T3 sweep is the actual risk surface.
**Deps:** Blocks T3, T5, T6.
**ADR:** T4 / ADR-014.
**Confidence:** 0.85

### T2 — Rename agent `orchestrator` → `dispatcher`
**Scope:** `git mv agents/orchestrator.md agents/dispatcher.md`. Update internal `name:` + `description:` frontmatter. Update body self-refs.
**Acceptance:** File renamed via `git mv`. Frontmatter `name: dispatcher`. Description preamble unchanged otherwise. Body has zero "orchestrator agent" self-refs.
**Edge cases:** Subagent invocation namespace `dev-flow:orchestrator` → `dev-flow:dispatcher` cascades to T3 sweep. Body references skill `dev-flow` — both renames touch this file. Apply T1 + T2 in same edit. 30-line cap currently violated (orchestrator=31). Phase 3/Sprint 37 addresses trim — DO NOT trim here (surgical-changes rule).
**Files:** `agents/orchestrator.md` → `agents/dispatcher.md`.
**Tests:** Manual subagent resolution test — `Agent(subagent_type: "dev-flow:dispatcher")` smoke (covered in T5).
**Risk:** medium — subagent-type strings hardcoded across skill bodies.
**Deps:** Blocks T3, T5, T6.
**ADR:** T4 / ADR-014.
**Confidence:** 0.85

### T3 — Reference sweep across repo
**Scope:** Update every reference to old skill name `dev-flow` (skill-context only) and old agent name `orchestrator` (agent-context only) per exclusion rules below.
**Acceptance:** Grep gates pass — see Tests.
**Exclusion rules — KEEP literal:**
- Plugin name `dev-flow` in `.claude-plugin/plugin.json` (`name` field), `.claude-plugin/marketplace.json` (plugin entry), `package.json` (name), `bin/dev-flow-init.js` (path/binary name), repo URL refs, hook plugin namespace strings.
- `skills/dev-flow-compress/` — different skill.
- Historical refs in `docs/CHANGELOG.md`, `docs/audit/AUDIT-2026-05-01.md` (frozen audit), `docs/sprint/SPRINT-024..034-*.md` (closed/frozen sprint docs), `docs/DECISIONS.md` ADR-001..013 (history immutable per ADR convention).
- `docs/audit/baseline-metrics.json` regenerated via T5 (not hand-edited).
**Sweep targets (write):**
- `.claude-plugin/plugin.json` (skills array entry), `.claude-plugin/marketplace.json` (skills list)
- `hooks/hooks.json`
- All 14 `skills/*/SKILL.md` + `references/` subtrees (esp. `skills/orchestrator/references/skill-dispatch.md` + `phases.md`)
- All 7 `agents/*.md` (frontmatter cross-refs + body)
- `.claude/CLAUDE.md`, `.claude/CONTEXT.md`, `.claude/settings.local.example.json`
- `README.md`, `TODO.md`, `SECURITY.md`, `CONTRIBUTING.md`
- `docs/ARCHITECTURE.md`, `docs/AI_CONTEXT.md`, `docs/SETUP.md`, `docs/TEST_SCENARIOS.md`, `docs/SUPPORT.md`, `docs/templates/friction-report.md`, `docs/research/r9-primitive-audit.md`, `docs/audit/AUDIT-2026-05-01-RECONCILED.md`, `docs/audit/external-refs-probe.md`, `docs/audit/v2-rewrite-plan.md`, `docs/audit/baseline-metrics.md`, `docs/audit/skill-eval-report.md`
- `bin/dev-flow-init.js` (skill path refs only — NOT plugin name / binary name), `bin/__tests__/dev-flow-init.test.js`
- `scripts/session-start.js`, `scripts/audit-baseline.js`, `scripts/eval-skills.js`
- `templates/SETUP.md.template`, `templates/TODO.md.template`
**Edge cases:** Skill subagent invocations (`dev-flow:orchestrator` → `dev-flow:dispatcher`) are distinct from plain agent file refs — sweep both forms. SPRINT-034 doc (`status: closed`) — DO NOT amend.
**Files:** ~35 write-targets after exclusions.
**Tests (grep gates):**
- `grep -rn "skills/dev-flow[^-]" .` → zero hits outside excluded paths
- `grep -rn "dev-flow:orchestrator" .` → zero hits outside DECISIONS.md ADR-014 + CHANGELOG.md historic
- `grep -rn "agents/orchestrator" .` → zero hits outside DECISIONS.md ADR-014 + CHANGELOG.md historic + closed sprint docs
**Risk:** HIGH — easiest place to miss a reference. Mitigation: grep gate IS the acceptance.
**Deps:** T1 + T2 done first. Blocks T5, T6.
**ADR:** T4.
**Confidence:** 0.65

### T4 — ADR-014: naming decision
**Scope:** Append `## ADR-014: Skill `dev-flow` → `orchestrator`; agent `orchestrator` → `dispatcher`` section to `docs/DECISIONS.md` (inline ADR convention per existing ADR-001..013 shape).
**Acceptance:** ADR has Date · Status · Context · Decision · Alternatives · Consequences. Status `decided`. Date ISO-8601. Supersede pointers added to any v1 ADR (ADR-001..013) referencing skill `dev-flow` or agent `orchestrator` by name — strategy: mark inline as "Superseded-in-part by ADR-014" rather than defer.
**Edge cases:** `docs/DECISIONS.md` `last_updated` frontmatter advances to sprint-active date. Index/TOC if any — DECISIONS.md uses inline sections (no separate index file).
**Files:** `docs/DECISIONS.md` (append + update frontmatter + inline supersede markers on prior ADRs).
**Tests:** Manual read-through; line cap of CLAUDE.md/SKILL.md does not apply to DECISIONS.md.
**Risk:** low.
**Deps:** Independent. Commit lands with T1+T2+T3 in close commit.
**Confidence:** 0.90

### T5 — Smoke test post-rename
**Scope:** Run all verification commands. Capture output. Document deviations.
**Acceptance (all must pass):**
- `node scripts/eval-skills.js` exits 0 OR exits with only the pre-existing R4 violation on `system-design-reviewer` (carryover to Phase 3 / Sprint 37).
- `node scripts/audit-baseline.js` regenerates `docs/audit/baseline-metrics.json` without error. Diff vs old: skill `dev-flow` row replaced by `orchestrator` row · agent `orchestrator` row replaced by `dispatcher` row · totals match (line counts ±0).
- Slash command `/orchestrator` resolves OR `/dev-flow:orchestrator` namespaced form resolves. Record observed disambiguation behavior.
- Subagent `dev-flow:dispatcher` resolves via Agent tool.
- `node scripts/session-start.js` runs clean (no new warnings introduced by rename).
**Edge cases:** `audit-baseline.js` may have hardcoded skill/agent names — patched in T3 sweep. R4 violation on `system-design-reviewer` is pre-existing and expected.
**Files:** Regenerated `docs/audit/baseline-metrics.json` + `.md` (delta committed).
**Tests:** This task IS the test gate.
**Risk:** medium — failures here surface T3 misses.
**Deps:** T1 + T2 + T3.
**Confidence:** 0.85

### T6 — Sprint Promote/Close protocol full pass
**Scope:** Execute `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` Promote (steps 1–9) + Close (full) without drift. Anti-Drift Hard Stops in effect.
**Acceptance:**
- Plan-lock commit `sprint(035): plan locked — atomic naming rename` lands BEFORE any code commit.
- Execution Log appended per task as work happens.
- Files Changed table populated.
- Decisions section captures Q1/Q2/Q3 lock + any in-flight decisions.
- Retro written at close.
- Close commit `sprint(035): EPIC-Audit Phase 1 — atomic naming rename` references `plan_commit` SHA in frontmatter.
- `docs/CHANGELOG.md` gets Sprint 35 row.
- `TODO.md` Active Sprint cleared at close, Phase 1 row removed from Backlog.
**Edge cases:** Anti-Drift Hard Stop #1 blocks commit-without-plan — if drift detected mid-execution, STOP and re-anchor.
**Files:** This sprint doc (frontmatter mutations) · `TODO.md` · `docs/CHANGELOG.md`.
**Tests:** Protocol checklist self-verification.
**Risk:** low (process); high if drift recurs.
**Deps:** All other tasks complete.
**Confidence:** 0.95

---

## Sprint DoD

- [ ] T1 acceptance met (skill renamed, frontmatter coherent, eval passes)
- [ ] T2 acceptance met (agent renamed, frontmatter coherent)
- [ ] T3 grep gates pass (zero unexpected hits)
- [ ] ADR-014 committed in DECISIONS.md
- [ ] T5 smoke test 5/5 pass (R4 carryover noted)
- [ ] Plan-lock commit landed before any T1..T5 commit
- [ ] Close commit + CHANGELOG row + TODO update + retro
- [ ] `last_updated` frontmatter advanced on touched governance files

---

## Execution Log

*(empty — populated as tasks complete)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|

*(empty — populated as work happens)*

---

## Decisions

- **DEC-1**: Q1 locked — ADR-014 written this sprint; ADR-015..019 reserved for Phases 2 / 4c / 4b / 4d / 4a (per Sprint 034 DEC-2). Reservations may shift if a phase folds.
- **DEC-2**: Q2 locked — atomic single sprint. Splitting skill-rename / agent-rename doubles grep-sweep cost on overlapping files.
- **DEC-3**: Q3 locked — Phase 5 will merge `docs/AI_CONTEXT.md` essentials into `.claude/CONTEXT.md` and delete the separate doc. No execution this sprint.
- **DEC-4**: ADR convention reaffirmed — inline sections in `docs/DECISIONS.md` (no `docs/adr/` standalone files). T4 follows existing shape.
- **DEC-5**: Plugin name `dev-flow`, binary `bin/dev-flow-init.js`, plugin namespace `dev-flow:` all unchanged. Adopters' install paths preserved.

---

## Open Questions

*(none at promote — all 3 from Sprint 034 retro resolved above)*

---

## Retro

*(empty — written at close)*
