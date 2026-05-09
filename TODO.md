# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Sprint or task state change
status: current
sprint: none
---

> **External references** — archived per Sprint 047 ADR-025 EPIC-Audit close. Lineage now lives in `docs/adr/ADR-019..024-*.md` (one ADR per ext-ref) + `docs/CHANGELOG.md` § EPIC-Audit milestone (Sprints 040-046).

> **How to use this file**
> - **Start of session** — read this file first. Understand active sprint before touching code.
> - **Run /orchestrator** — dispatcher parses first incomplete task `[ ]` in Active Sprint.
> - **End of session** — Session Close. Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, append Changelog row (File | Change | ADR), update relevant docs, rotate sprint block to `docs/CHANGELOG.md`.
> - **Changelog rule** — holds ONLY current in-progress sprint. Once reflected in docs, MOVE to `docs/CHANGELOG.md` (prepend), then DELETE from here.

> **Sprint sizing rules**
> - Group 2–5 tasks per sprint. Never plan a sprint with only 1 task.
> - Order by dependency first, then importance + urgency.
> - Promote from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately.

> **Backlog hygiene rules**
> - Closed sub-blocks (e.g., closed EPIC, closed TASK-NNN cluster) collapse to ≤1 done-line pointer to `docs/CHANGELOG.md` after 1 sprint of cooldown. Don't accumulate done rows.
> - Closed sub-blocks >2 sprints old → DELETE entirely (history lives in `docs/CHANGELOG.md` + sprint files; backlog is for OPEN work).
> - When promoting a P1 cluster, leave only the 1-line summary; details go in sprint plan.

> **Layer values** (meta-repo, no app code)
> `governance, docs, scripts, skills, agents, templates, examples, ci`

---

## Active Sprint

→ — none —

> Sprint 051a closed `460175b` (TASK-122a Lean Architecture Foundation · ADR-029 CA+DDD canonical · createProjectSkeleton · 43 tests pass). Next: Sprint 051b — TASK-122b template re-render (CLAUDE.md + ARCHITECTURE.md per CA+DDD) + `docs/blueprint/11-lean-architecture.md` primer + blueprint/ git tracking review.

---

## Backlog

### P0 — v1 ship prep (post-EPIC-Audit, post-ISSUE-03 reframe, post-coherence-audit)

- [x] **TASK-119** — User-Project Outcome Lens (closed Sprint 048 `38035d8`).
- [x] **TASK-120** — Plugin Coherence Cleanup + Rename + release-patch Generalize (closed Sprint 049 `7b04875`).
- [ ] **TASK-121** — F3 init scaffold full: `bin/dev-flow-init.js` extended (gitignore template + `createEmptyScaffoldDirs` for docs/codemap/+adr/); orchestrator SKILL init phase aligned to canonical scaffold contract; ADR-028 locks 11-file + 2-dir output. Layers `skills, scripts, docs`. → Sprint 050 (active).
- [x] **TASK-122a** — Lean Architecture Foundation (closed Sprint 051a `460175b`).
- [ ] **TASK-122b** — Lean Architecture Templates + Primer: `templates/CLAUDE.md.template` rewritten per stack (File Structure / Dependency Rule / Layers / Anti-Patterns / Commands); `templates/ARCHITECTURE.md.template` per-layer purpose + stack examples; NEW `docs/blueprint/11-lean-architecture.md` CA+DDD primer (≤250 lines); blueprint/ tracking review (currently untracked in git). Depends on TASK-122a (ADR-029 + skeleton lock). Layers `templates, docs`. → Sprint 051b.
- [ ] **TASK-123** — F4 wire orphan skills (tdd / refactor-advisor / diagnose / zoom-out / prime / release-manager) into orchestrator phase detection + F5 tech-debt rollover loop (`## Tech Debt` section in TODO.md + sprint-close auto-promote Retro Friction). Layers `skills, docs, governance`. → Sprint 052.
- [ ] **TASK-116-v2** — Skill-triggering acceptance harness: Node port (`scripts/eval-acceptance.js`). **Outcome:** O8 plugin reliability. Verifies 8 lift candidates from Sprints 043 + 045 + retroactive eval-evidence for release-patch v2.0.0 (ADR-027 DEC-2 gap). Design input: [`docs/research/superpowers-acceptance-harness-2026-05-04.md`](docs/research/superpowers-acceptance-harness-2026-05-04.md). Satisfies ADR-016 + ADR-021 DEC-4. Estimated S-M, layers `scripts, ci, docs`. → Sprint 053.
- [ ] **TASK-115-v2** — Caveman 3-arm eval harness Node port (`scripts/eval-caveman.js` + `scripts/eval-measure.js`). Tokenizer `gpt-tokenizer`. Snapshot schema 1:1 with caveman. **Outcome:** O8 plugin reliability. Depends on TASK-116-v2. Estimated M, layers `scripts, docs`. → Sprint 054.
- [ ] **v1 ship** — CHANGELOG release notes lead with user-project outcomes per ADR-026; plugin/marketplace lockstep bump (MINOR if new surface introduced; PATCH otherwise); git push per release-patch HARD STOP. → Sprint 055.

### P2 — Tooling friction backlog (optional, not blocking v1)

- [ ] **release-patch skip-bump-on-docs-only fix** — extend `skills/release-patch/SKILL.md` to detect "EPIC close" / "sprint close" events and trigger archive flush even on docs-only diff. Closes stranded-archive friction structurally (per Sprint 047 ADR-025 DEC-8). Estimated S, layers `skills, scripts`.
- [ ] **release-debt** — Sprint 049 MINOR (skill drop + rename + behavior change in release-patch) + Sprint 050 PATCH (bin/dev-flow-init.js logic add + new template) require manual reconcile + chained release. release-patch SKILL handles PATCH only by design; MINOR + queued PATCH need manual sequence. Deferred to post-Sprint-052 tooling sprint per ADR-028 OQ-J. Estimated S, layers `governance, scripts`.
- [x] **CONTEXT.md cap pressure** — closed Sprint 048 T5 (Behavioral Guidelines Lineage relocated to `.claude/references/behavioral-guidelines-lineage.md`; CONTEXT.md now 121/130).

### P3 — Closed sub-blocks (CHANGELOG references only)

> All historical TASK-NNN clusters and closed EPICs are archived in `docs/CHANGELOG.md`. Per Backlog hygiene rules: closed sub-blocks >1 sprint old are collapsed; >2 sprints old are deleted from Backlog (history lives in CHANGELOG + sprint files).
>
> - **EPIC-Audit (closed Sprint 047)** — `docs/CHANGELOG.md` § Sprint 047 + ADR-025 + `docs/audit/EPIC-Audit-retro.md`.
> - **TASK-104 / 117 / 118 (closed Sprint 045)** — `docs/CHANGELOG.md` § Sprint 045.
> - **EPIC-E TASK-086..090 (closed Sprint 028-029)** — `docs/CHANGELOG.md` (pre-Sprint-040 entries).

---

## Changelog

> Current in-progress sprint only. Completed sprints archived in `docs/CHANGELOG.md`.
> Sprints 0–27 archived → `docs/CHANGELOG.md`.

*All closed sprints archived → `docs/CHANGELOG.md` (Sprint 047 T1 batch-archive of 040-046; previously archived 0-039).*

---

## Quick Rules
> Key conventions for any contributor (human or AI) working on dev-flow itself.

```
SCAFFOLD WORK
- Never write a script that touches Claude Code hooks without verifying the input
  contract against context/research/CC_SPEC.md.
- Skill frontmatter: `name` and `description` are spec-required. Document extras
  (version, last-validated, type, agent, spawns) in CONTEXT.md, mark required vs optional.
- Skill `description`: third-person, starts "Use when…", ≤500 chars,
  NEVER summarizes internal process.
- Every SKILL.md that depends on AI not rationalizing gets a "Red Flags" section.
- Heavy reference content (>100 lines) goes in skills/<name>/references/, NOT inline in SKILL.md.
- Scripts: Node.js ≥18. No bash-only constructs. Tested on Windows Git Bash + Linux.
- Every script under scripts/ gets a sibling __tests__/<name>.test.js.

DOC WORK
- Line caps: CLAUDE.md ≤80 · SKILL.md ≤100 · agents ≤30. Trim before commit — do not raise caps.
- Every doc file gets ownership header (owner, last_updated, update_trigger, status).
- HOW → code comment. WHY → DECISIONS.md. WHERE → ARCHITECTURE.md or README.md.

GOVERNANCE
- Version bumps follow semver:
  MAJOR = phase/gate/hook contract change
  MINOR = new mode / new agent / new skill
  PATCH = clarification / prompt rewording / fix
- Skill changes that alter agent behavior require eval evidence before merge.
```

---

## Roadmap (informational)

```
Sprint 0–13  →  Foundation through governance         (done)
Sprint 14–17 →  Audit passes + blueprint decomp        (done)
Sprint 18–20 →  Plugin foundation + dogfood            (done)
Sprint 21–24 →  Audit Pass 2 + plugin release          (done)
Sprint 25–26 →  Workflow gaps + read-guard guardrail    (done)
Sprint 27    →  Marketplace schema fix                  (done — TASK-111, TASK-112)
Sprint 28    →  Wrap-or-replace CC primitives           (done — TASK-086..089, ADR-012)
Sprint 29    →  EPIC-E close — consistency sweep        (done — TASK-090)
Sprint 30    →  P0 safety + truth-in-docs               (done — read-guard removed, hooks dedup, ADR sweep)
Sprint 31    →  P0 workflow contract                    (done — agent trim, phase naming, rotate, SECURITY.md)
Sprint 32    →  P1 consistency sweep                    (done — vocab + dispatch + skill-desc fixes)
Sprint 33    →  P2 polish sweep                         (done — copywriting + naming alignment)
Sprint 34    →  EPIC-Audit Phase 0 (audit reconcile + baseline + plan)  (planning)
Sprint 35-37 →  EPIC-Audit Phases 1-3 (rename / wiring / trim)         (done)
Sprint 38    →  Foundation Hardening (kill Node hooks + PS replacement + lean-doc cache)  (done)
Sprint 39    →  Codemap + Modes + Skills (codemap base / sprint-bulk mode / /prime / /release-patch)  (done)
Sprint 40    →  EPIC-Audit Phase 4a — Karpathy patterns (lineage lock + ADR-019 + verify-step retro credit)  (done)
Sprint 41    →  EPIC-Audit Phase 4b — Caveman compare (dual-lineage + 3-arm port plan + ADR-020 + caveman-shrink reject)  (done)
Sprint 42    →  EPIC-Audit Phase 4c — Superpowers patterns (hooks lineage + acceptance harness + PR template lift + ADR-021)  (done)
Sprint 43    →  EPIC-Audit Phase 4d — Mattpocock skill library (4-skill diff + bucket defer + CONTEXT.md lifts + .out-of-scope/ + ADR-022 + docs/adr/ convention lock)  (done)
Sprint 44    →  EPIC-Audit Phase 4e — GSD patterns (9 decisions: 5 NO LIFT + 2 DEFER + 2 bidirectional findings; ADR-023 scale-driven defer)  (done)
Sprint 45    →  Phase 4f skill-creator + TASK-104/117/118 (ADR-024 + CONTEXT.md frontmatter+lifts + lean-doc Step 0b date-sanity v2.1.0)  (done)
Sprint 46    →  EPIC-Audit Phase 5 — stale doc refresh (ARCHITECTURE.md + AI_CONTEXT.md restored to current)  (done)
Sprint 47    →  EPIC-Audit Phase 6 close (batch-archive 040-046 + TODO trim + ADR-025 + EPIC-Audit-retro.md)  (done — EPIC-Audit COMPLETE)
Sprint 48    →  User-Project Outcome Lens (ISSUE-03 reframe + USER-OUTCOMES.md + ADR-026 + G1 outcome item) (done — `38035d8`)
Sprint 49    →  Plugin Coherence Cleanup + Rename + release-patch Generalize (F1 drop dev-flow-compress · F2 generalize release-patch 6-mode · architecture-grill rename · ADR-027)  (done — `7b04875`)
Sprint 50    →  F3 init scaffold full (.gitignore + docs/codemap/+adr/ dirs + skill init phase aligned to canonical bin/dev-flow-init.js + ADR-028)  (done — `8940f01`)
Sprint 51a   →  Lean Architecture Foundation (STACK_PRESETS CA+DDD migration + createProjectSkeleton + ADR-029)  (done — `460175b`)
Sprint 51b   →  Lean Architecture Templates + Primer (CLAUDE.md + ARCHITECTURE.md per-stack rewrites + blueprint/11-lean-architecture.md CA+DDD primer)
Sprint 52    →  F4 wire orphan skills into orchestrator + F5 tech-debt rollover loop + F6 fold-in (template lineage from Sprint 051 work)
Sprint 53    →  v1 prereq #1 — TASK-116-v2 Node port acceptance harness (also retroactive eval-evidence for release-patch v2.0.0)
Sprint 54    →  v1 prereq #2 — TASK-115-v2 Node port caveman 3-arm eval
Sprint 55    →  v1 SHIP — CHANGELOG outcome-led release notes + lockstep bump + git push
```
