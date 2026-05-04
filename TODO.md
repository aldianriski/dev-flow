# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04 (Sprint 040 closed — EPIC-Audit Phase 4a Karpathy patterns)
update_trigger: Sprint completed, task added, task status changed
status: current
sprint: none
---

> **External references**
> - https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md → behavioral guidelines patterns
> - https://github.com/juliusbrussee/caveman → eval harness, single-source-of-truth discipline, context compression
> - https://github.com/obra/superpowers → plugin development baseline
> - https://github.com/mattpocock/skills → skill library, evaluation harness, plugin infrastructure, and other patterns for building AI agents
> - https://github.com/gsd-build/get-shit-done → A light-weight and powerful meta-prompting, context engineering and spec-driven development system
> - https://github.com/anthropics/skills/tree/main/skills/skill-creator → Creating custom skills for Claude

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

→ — none —

> Next: Sprint 041 — EPIC-Audit Phase 4b (Caveman compare).

---

## Backlog

### P0 — EPIC-Audit: Full project audit + external-ref alignment

> Dependency: Sprint 34 (Phase 0) gates the rest. Each phase = own sprint. Phases slid +2 to make room for Sprint 038 (Foundation Hardening) + Sprint 039 (Codemap+Modes+Skills).

- [ ] **Phase 4b — Caveman compare (plugin vs mattpocock skill)** (Sprint 41)
- [ ] **Phase 4c — Superpowers patterns** (Sprint 42)
- [ ] **Phase 4d — Mattpocock skill library** (Sprint 43)
- [ ] **Phase 4e — Get shit done patterns** (Sprint 44)
- [ ] **Phase 4f — Skill wrapper patterns with skill-creator** (Sprint 45)
- [ ] **Phase 5 — Stale doc refresh** (Sprint 46) — `ARCHITECTURE.md` + `AI_CONTEXT.md`
- [ ] **Phase 6 — Archive external refs + close EPIC-Audit** (Sprint 47)

### P1 — Doc-quality follow-ups

- [ ] **TASK-104** — Add ownership-header frontmatter to `.claude/CONTEXT.md` (owner / last_updated / update_trigger / status). DOC WORK rule violation surfaced in Sprint 040 Q1. Estimated S, layers `governance, docs`.

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

### Sprint 040 — EPIC-Audit Phase 4a (Karpathy patterns) — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/CONTEXT.md` | NEW § Behavioral Guidelines Lineage block — 4-principle adaptation table + MIT attribution + upstream SHA `2c606141936f` lock | ADR-019 |
| `docs/adr/ADR-019-karpathy-patterns.md` | NEW — karpathy adoption + lineage credit; 3-part decision (lineage lock + verify-step retro credit + EXAMPLES.md reject) | ADR-019 |
| `docs/sprint/SPRINT-040-karpathy-patterns.md` | NEW — sprint plan + execution log + 4 decisions + retro | — |

Plan-lock `7e06c72` · T1 `1b7741b` · T2 `54c88b1` · T3 `8261847` · T4 `eed5126` · close (this commit).

*Sprints 38 + 039 archived → `docs/CHANGELOG.md`. Sprint 040 awaits archive on next `/release-patch` invocation.*

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
Sprint 41-45 →  EPIC-Audit Phases 4b-6 (3 ext-ref deep / stale doc refresh / archive)
```
