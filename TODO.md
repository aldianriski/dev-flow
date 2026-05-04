# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04 (Sprint 047 closed — EPIC-Audit complete; v1 ship prep unblocked)
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

> **Layer values** (meta-repo, no app code)
> `governance, docs, scripts, skills, agents, templates, examples, ci`

---

## Active Sprint

→ docs/sprint/SPRINT-047-epic-audit-close.md

> Next: v1 ship prep — TASK-115 (caveman 3-arm eval harness port) + TASK-116 (superpowers acceptance harness) per ADR-020 DEC-3 + ADR-021 DEC-4.

---

## Backlog

### P0 — EPIC-Audit (closed Sprint 047)

- [x] **EPIC-Audit complete** — Phase 0 (Sprint 034 baseline) → Phase 1-3 (Sprints 035-037 rename/wiring/trim) → Phase 4 (Sprints 040-045 ext-ref deep-dives 4a-4f) → Phase 5 (Sprint 046 stale doc refresh) → Phase 6 (Sprint 047 archive + close). 13 sprints · 6 ext-refs · 6 ADRs (019-024) + ADR-025 closeout · 9 research notes · 9 bidirectional findings. Full retro: `docs/audit/EPIC-Audit-retro.md`.

### P1 — Doc-quality follow-ups

- [x] **TASK-104** — closed Sprint 045 T2 (CONTEXT.md ownership header added).
- [x] **TASK-117** — closed Sprint 045 T3 (3 additive CONTEXT.md sections: `_Avoid_` annotations + § Relationships + § Flagged Ambiguities; 129/130 lines).
- [x] **TASK-118** — closed Sprint 045 T4 (Step 0b date-sanity pre-flight added to lean-doc-generator; v2.0.0→2.1.0; closes 4-sprint recurring friction).

### P1 — Implementation follow-ups (deferred from research sprints)

- [ ] **TASK-115** — Port caveman 3-arm eval harness to JS (`scripts/eval-run.js` + `scripts/eval-measure.js`). Design input: [`docs/research/caveman-eval-harness-port-notes-2026-05-04.md`](docs/research/caveman-eval-harness-port-notes-2026-05-04.md). Tokenizer = `gpt-tokenizer`. Snapshot schema 1:1 with caveman. Sibling tests required. Estimated M, layers `scripts, docs`.
- [ ] **TASK-116** — Implement skill-triggering acceptance harness at `tests/skill-triggering/` (PowerShell port of superpowers `run-test.sh` + 3-skill seed prime/orchestrator/tdd). Design input: [`docs/research/superpowers-acceptance-harness-2026-05-04.md`](docs/research/superpowers-acceptance-harness-2026-05-04.md). Mode A (manual run before skill-description changes ship). Satisfies ADR-016 eval-evidence rule. Estimated S–M, layers `scripts, ci, docs`.

### P1 — EPIC-E: Wrap-or-replace Claude Code primitives (closed)

- [x] **TASK-086** — audit + ADR-012 (Sprint 28)
- [x] **TASK-087** — review + security steps updated (Sprint 28)
- [x] **TASK-088** — task tracking updated (Sprint 28)
- [x] **TASK-089** — init mode updated (Sprint 28)
- [x] **TASK-090** — sweep clean, ADR-012 closed, EPIC-E done (Sprint 29)

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
Sprint 45    →  EPIC-Audit Phase 4f (skill-creator vs write-a-skill diff + ADR-024) + TASK-104 (CONTEXT.md ownership header) + TASK-117 (3 additive CONTEXT.md sections) + TASK-118 (lean-doc date-sanity pre-flight)
Sprint 46    →  EPIC-Audit Phase 5 (stale doc refresh — ARCHITECTURE.md + AI_CONTEXT.md)
Sprint 47    →  EPIC-Audit Phase 6 (archive external refs + close EPIC-Audit)
```
