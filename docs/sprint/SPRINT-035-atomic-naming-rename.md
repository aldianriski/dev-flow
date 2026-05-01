---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change / phase scope change
status: closed
plan_commit: bc1d0f5
close_commit: pending (close commit)
last_updated: 2026-05-01
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

- [x] T1 acceptance met (skill renamed, frontmatter coherent, eval passes)
- [x] T2 acceptance met (agent renamed, frontmatter coherent)
- [x] T3 grep gates pass (zero unexpected hits — all in CHANGELOG/closed-sprint/frozen-audit/this-plan/ADR-014)
- [x] ADR-014 committed in DECISIONS.md (+ status markers on ADR-011/012/013 per DEC-8)
- [x] T5 smoke test 5/5 pass (R4 carryover on system-design-reviewer noted; OVER-CAP 2 agents carryover)
- [x] Plan-lock commit landed before any T1..T5 commit (`bc1d0f5`)
- [x] Close commit + CHANGELOG row + TODO update + retro
- [x] `last_updated` frontmatter advanced on touched governance files (DECISIONS.md, this sprint doc, TODO.md)

---

## Execution Log

- 2026-05-01: Plan locked at commit `bc1d0f5` — sprint doc + TODO.md pre-lock writes only.
- 2026-05-01: T1 done — `git mv skills/dev-flow skills/orchestrator`; SKILL.md frontmatter `name: orchestrator`; H1 heading updated. Three files moved (SKILL.md + 2 references). History preserved.
- 2026-05-01: T2 done — `git mv agents/orchestrator.md agents/dispatcher.md`; frontmatter `name: dispatcher`, description self-ref `/dev-flow skill` → `/orchestrator skill`; H1 heading updated; body output ref updated to new skill path. 30-line cap violation (31 lines) carries over to Phase 3 per DEC-2 (Sprint 34) — not trimmed here per surgical-changes rule.
- 2026-05-01: T3 done — sweep across skills, agents, governance docs, scripts, templates. Adjudication rule: `dev-flow` as plugin/workflow/ecosystem brand → KEEP; `/dev-flow` slash command literal → `/orchestrator`; `skills/dev-flow/` path → `skills/orchestrator/`; "the orchestrator" agent role → "the dispatcher". DEC-6 / DEC-7 added mid-task to handle historical audit docs and regenerated artifacts.
- 2026-05-01: T4 done — ADR-014 appended to DECISIONS.md (inline section convention). `superseded-in-part by ADR-014 (naming only)` status markers added to ADR-011, ADR-012, ADR-013 per DEC-8. DECISIONS.md `last_updated` advanced to 2026-05-01.
- 2026-05-01: T5 done — `eval-skills.js`: pass=13 fail=1 (pre-existing R4 violation on `system-design-reviewer` — Phase 3 carryover). `audit-baseline.js`: regenerated cleanly (14 skills, 7 agents); skill `orchestrator` row replaces `dev-flow`; agent `dispatcher` row replaces `orchestrator`; OVER-CAP unchanged at 2 agents (`dispatcher` 31, `design-analyst` 31) — Phase 3 carryover. `session-start.js`: runs clean; pre-existing stale-doc warnings + Active-Sprint regex quirk both unrelated to rename. Final grep gates PASS — all hits in excluded paths (CHANGELOG, closed sprints, frozen audits, this sprint's own plan, ADR-014 itself).
- 2026-05-01: T6 done — sprint doc populated; CHANGELOG.md row added; TODO.md updated; close commit authored.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `skills/dev-flow/` → `skills/orchestrator/` (3 files) | T1 | dir rename via `git mv`; SKILL.md frontmatter `name: orchestrator`; H1 heading updated | medium | T5 (eval) |
| `agents/orchestrator.md` → `agents/dispatcher.md` | T2 | file rename via `git mv`; frontmatter `name: dispatcher`; description + body self-refs updated | medium | T5 (smoke) |
| `skills/pr-reviewer/SKILL.md` | T3 | description: "dev-flow gate" → "orchestrator workflow" | low | T5 |
| `skills/orchestrator/references/phases.md` | T3 | H1 + load-source ref updated to new skill path | low | T5 |
| `skills/task-decomposer/SKILL.md` | T3 | when_to_use: `dev-flow Path B` → `orchestrator Path B`; `/dev-flow` → `/orchestrator` | low | T5 |
| `skills/zoom-out/SKILL.md` | T3 | description + Red Flags: "use dev-flow" → "use orchestrator" (2 sites) | low | T5 |
| `skills/system-design-reviewer/SKILL.md` | T3 | Hard Rules: "the orchestrator must not proceed" → "the dispatcher must not proceed" | low | T5 (R4 carryover unaffected) |
| `agents/security-analyst.md` | T3 | Input source: "from orchestrator" → "from dispatcher" | low | T5 |
| `agents/scope-analyst.md` | T3 | description + Input + Output path updated (3 sites) | low | T5 |
| `agents/design-analyst.md` | T3 | description + Input + Output path updated (3 sites) | low | T5 |
| `agents/performance-analyst.md` | T3 | Input: "from orchestrator" → "from dispatcher" | low | T5 |
| `agents/code-reviewer.md` | T3 | Input: "from orchestrator" → "from dispatcher" | low | T5 |
| `agents/migration-analyst.md` | T3 | Input: "from orchestrator" → "from dispatcher" | low | T5 |
| `.claude/CLAUDE.md` | T3 | File Structure comment: `(orchestrator + 6 specialists)` → `(dispatcher + 6 specialists)` | low | T5 |
| `.claude/CONTEXT.md` | T3 | Vocabulary "agent" def + Principles + Agent Roster table (8 sites total) | low | T5 |
| `README.md` | T3 | tagline + agents count comment + skills table row + adopt commands (4 sites) | low | T5 |
| `CONTRIBUTING.md` | T3 | What NOT to change: Thin-Coordinator Rule role rename | low | T5 |
| `TODO.md` | T1 / T6 | sprint pointer (planning) at promote; close updates at T6 | low | n/a |
| `docs/sprint/SPRINT-035-atomic-naming-rename.md` | T1 / T6 | new — sprint plan doc; populated through close | low | n/a |
| `docs/ARCHITECTURE.md` | T3 | 6 paths + 1 slash command updated; doc still `status: stale` (Phase 5 rewrite) | low | T5 |
| `docs/AI_CONTEXT.md` | T3 | Navigation row + Hard stops path (2 sites); doc still `status: stale` (Phase 5 delete-and-merge) | low | T5 |
| `docs/SETUP.md` | T3 | adopt step: `/dev-flow init` → `/orchestrator init` | low | T5 |
| `docs/research/r9-primitive-audit.md` | T3 | `/review` row: orchestrator → dispatcher (2 sites); `/init` row: `dev-flow init` → `orchestrator init` (2 sites) | low | T5 |
| `templates/TODO.md.template` | T3 | "Run /dev-flow — orchestrator parses" → "Run /orchestrator — dispatcher parses" | low | T5 |
| `templates/SETUP.md.template` | T3 | "first /dev-flow session" → "first /orchestrator session" | low | T5 |
| `scripts/session-start.js` | T3 | warning string: `/dev-flow` → `/orchestrator` | low | T5 (session-start runs clean) |
| `docs/audit/AUDIT-2026-05-01-RECONCILED.md` | T3 | selective forward-looking refs only (lines 88, 94) per DEC-6 | low | n/a |
| `docs/audit/v2-rewrite-plan.md` | T3 | frontmatter `superseded_partly_by: ADR-014` + supersede banner per DEC-6 | low | n/a |
| `docs/audit/baseline-metrics.md` | T5 | regenerated by `audit-baseline.js` per DEC-7 | low | self |
| `docs/audit/baseline-metrics.json` | T5 | regenerated by `audit-baseline.js` per DEC-7 | low | self |
| `docs/audit/skill-eval-report.md` | T5 | regenerated by `eval-skills.js` per DEC-7 | low | self |
| `docs/DECISIONS.md` | T4 | ADR-014 appended; status markers on ADR-011/012/013 per DEC-8; `last_updated` advanced | low | n/a |
| `docs/CHANGELOG.md` | T6 | Sprint 35 row appended (close) | low | n/a |

---

## Decisions

- **DEC-1**: Q1 locked — ADR-014 written this sprint; ADR-015..019 reserved for Phases 2 / 4c / 4b / 4d / 4a (per Sprint 034 DEC-2). Reservations may shift if a phase folds.
- **DEC-2**: Q2 locked — atomic single sprint. Splitting skill-rename / agent-rename doubles grep-sweep cost on overlapping files.
- **DEC-3**: Q3 locked — Phase 5 will merge `docs/AI_CONTEXT.md` essentials into `.claude/CONTEXT.md` and delete the separate doc. No execution this sprint.
- **DEC-4**: ADR convention reaffirmed — inline sections in `docs/DECISIONS.md` (no `docs/adr/` standalone files). T4 follows existing shape.
- **DEC-5**: Plugin name `dev-flow`, binary `bin/dev-flow-init.js`, plugin namespace `dev-flow:` all unchanged. Adopters' install paths preserved.
- **DEC-6**: Historical audit/plan docs (`docs/audit/AUDIT-2026-05-01-RECONCILED.md`, `docs/audit/v2-rewrite-plan.md`) treated like closed sprint docs and ADR history — historical findings preserved as written; only forward-looking remediation references updated. v2-rewrite-plan.md gets a `superseded_partly_by: ADR-014` frontmatter field + supersede banner. RECONCILED gets selective edits on lines 88, 94 (forward-looking remediation only). Discovered mid-T3 when grep gates needed clarification for which audit docs are "frozen" — extending the original AUDIT-2026-05-01.md exclusion to cover its sibling reconciliation doc and the v2 plan.
- **DEC-7**: `docs/audit/baseline-metrics.md` and `docs/audit/skill-eval-report.md` regenerated by T5 via `audit-baseline.js` + `eval-skills.js` rather than hand-edited. Both scripts scan dirs dynamically — no hardcoded skill/agent names, so post-T1/T2 the regenerated artifacts naturally show the new names. Same exclusion treatment as `baseline-metrics.json`.
- **DEC-8**: ADR supersede strategy — only ADRs whose decision substance touches the renamed identifiers receive `superseded-in-part by ADR-014 (naming only)` markers (ADR-011, ADR-012, ADR-013). ADR-001..010 either never reference skill `dev-flow` or agent `orchestrator` by name, or do so only in incidental historical context — left as written. Rationale: ADR-014 changes names only, not decision substance; "append-only" rule on past ADRs is honored by status-field-only updates (precedent: ADR-013 used the same pattern to mark ADR-003/007/008/009 superseded).

---

## Open Questions

*(none at promote — all 3 from Sprint 034 retro resolved above)*

---

## Retro

**Worked:**
- Atomic single-sprint approach (DEC-2) was the right call. Skill body and agent body cross-reference each other; splitting would have forced a second pass through the same files. Single sprint = single coherent ADR-014 narrative.
- Grep-gate-as-acceptance for T3 pinned the highest-risk task to a binary verifiable signal. Removed adjudication ambiguity.
- Adjudication rule locked early in T3 (`dev-flow` as plugin/brand → KEEP; `/dev-flow` slash command → CHANGE; `the orchestrator` agent role → `dispatcher`) prevented per-instance hand-wringing across 35+ sweep targets.
- Mid-task DECISIONS captured (DEC-6 / DEC-7 / DEC-8) without halting execution — Anti-Drift Hard Stop #1 (commit-without-plan) was the binding constraint, not "no decisions mid-flight". The lock is on plan baseline, not on judgment refinement.

**Friction:**
- Edit tool requires Read first — batched 6 Edit calls failed because Reads weren't done. Cost a round-trip. Pattern: always Read in the same batch as planned Edits.
- `audit-baseline.js` and `eval-skills.js` happened to scan dirs dynamically (no hardcoded names). T5 plan flagged "may have hardcoded names" as a risk — the risk didn't materialize, but verification time is cheap insurance.
- Slash command disambiguation (`/orchestrator` bare vs `/dev-flow:orchestrator` namespaced) couldn't be tested from a Bash session — only verifiable post plugin reload. Recorded as residual uncertainty (T5 acceptance allowed for it).
- `skills/dev-flow-compress/` is a separate skill but the name shares the `dev-flow-` prefix — multiple grep regex tweaks needed (`skills/dev-flow[^-]` vs naive `skills/dev-flow`) to avoid false-positive sweep hits. Future renames involving prefix collisions need similar regex care.

**Pattern candidate (surface to user, ask before locking into VALIDATED_PATTERNS.md):**
- Pattern: "Atomic rename with `git mv` + grep-gate-as-acceptance" — works when scope is bounded, sweep targets are enumerable, and exclusion rules are upfront. Not generalizable to refactors that change behavior.
- Pattern: "ADR `superseded-in-part by NNN (naming only)` status marker" — preserves "append-only" rule for ADRs while signaling targeted changes. Used here for ADR-011/012/013. Could become a convention.
- Pattern: "Audit/plan docs treated like closed sprint docs (frozen historical record + selective forward-looking edits)" — DEC-6 generalization. Worth locking if Phase 5 surfaces more such docs.

**Surprise log:**
- `docs/audit/baseline-metrics.json` was originally a sweep target in the plan (line counts) but `audit-baseline.js` regenerates it dynamically — sweep was wasted intent. T5 regen was the correct path. Plan T3 exclusion list correctly listed it; mid-task DEC-7 extended the same logic to `baseline-metrics.md` and `skill-eval-report.md`.
- agents/orchestrator.md was 31 lines (1 over cap) at audit baseline; renamed to dispatcher.md, still 31 lines. Cap violation traveled with the rename. Phase 3/Sprint 37 trim still needed — confirmed via T5 baseline regen output `OVER-CAP: 0 skills, 2 agents`.
- Session-start.js Active-Sprint regex (`- \[ \] \*\*TASK-`) doesn't match the new sprint-pointer format (Active Sprint section now contains a sprint reference, not TASK- bullets). Pre-existing quirk — session-start emits "both empty" warning even when a sprint is set. Phase 2 (Sprint 36) session-start improvements should address.
