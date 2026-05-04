# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04 (post-Sprint-047 backlog grooming — closed sub-blocks collapsed; v1 ship prep roadmap added)
update_trigger: Sprint completed, task added, task status changed
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

> Next: v1 ship prep — TASK-115 (caveman 3-arm eval harness port) + TASK-116 (superpowers acceptance harness) per ADR-020 DEC-3 + ADR-021 DEC-4.

---

## Backlog

### P0 — v1 ship prep (post-EPIC-Audit)

- [ ] **TASK-116** — Skill-triggering acceptance harness at `tests/skill-triggering/`. PowerShell port of superpowers `run-test.sh` + 3-skill seed (prime/orchestrator/tdd). Verifies 8 lift candidates accumulated from Sprints 043 DEC-1 + 045 DEC-2/4/5. Design input: [`docs/research/superpowers-acceptance-harness-2026-05-04.md`](docs/research/superpowers-acceptance-harness-2026-05-04.md). Satisfies ADR-016/021 DEC-4 eval-evidence rule (prerequisite for TASK-115 + any future skill-behavior change). Estimated S-M, layers `scripts, ci, docs`. → Sprint 048.
- [ ] **TASK-115** — Caveman 3-arm eval harness Node port (`scripts/eval-run.js` + `scripts/eval-measure.js`). Tokenizer = `gpt-tokenizer`. Snapshot schema 1:1 with caveman. Sibling tests required. Design input: [`docs/research/caveman-eval-harness-port-notes-2026-05-04.md`](docs/research/caveman-eval-harness-port-notes-2026-05-04.md). Depends on TASK-116 acceptance harness (eval-evidence rule). Estimated M, layers `scripts, docs`. → Sprint 049.
- [ ] **v1 ship** — CHANGELOG release notes + plugin.json/marketplace.json bump (MINOR if TASK-115 introduces new skill or TASK-116 adds new test surface; PATCH otherwise) + git push origin master per release-patch HARD STOP protocol. → Sprint 050.

### P2 — Tooling friction backlog (optional, not blocking v1)

- [ ] **release-patch skip-bump-on-docs-only fix** — extend `skills/release-patch/SKILL.md` to detect "EPIC close" / "sprint close" events and trigger archive flush even on docs-only diff. Closes stranded-archive friction structurally (per Sprint 047 ADR-025 DEC-8). Estimated S, layers `skills, scripts`.
- [ ] **CONTEXT.md cap pressure** — `.claude/CONTEXT.md` at 129/130 lines (Sprint 045 retro). Next additive lift needs cap raise OR restructuring (e.g., move § Behavioral Guidelines Lineage to `references/` per Sprint 045 retro Friction #2). Estimated S, layers `governance, docs`.

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
Sprint 48    →  v1 ship prep #1 — TASK-116 skill-triggering acceptance harness (verifies 8 lift candidates; satisfies ADR-016 eval-evidence rule)
Sprint 49    →  v1 ship prep #2 — TASK-115 caveman 3-arm eval harness Node port (depends on TASK-116)
Sprint 50    →  v1 SHIP — CHANGELOG release notes + plugin/marketplace lockstep bump + git push per release-patch protocol
```
