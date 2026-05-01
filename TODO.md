# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01 (Sprint 33 closed)
update_trigger: Sprint completed, task added, task status changed
status: current
sprint: 34
---

> **External references**
> - https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md → behavioral guidelines patterns
> - https://github.com/juliusbrussee/caveman → eval harness, single-source-of-truth discipline, context compression
> - https://github.com/obra/superpowers → plugin development baseline
> - https://github.com/mattpocock/skills → skill library, evaluation harness, plugin infrastructure, and other patterns for building AI agents

> **How to use this file**
> - **Start of session** — read this file first. Understand active sprint before touching code.
> - **Run /dev-flow** — orchestrator parses first incomplete task `[ ]` in Active Sprint.
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

→ Sprint 34 — (not yet planned — run /task-decomposer or /dev-flow)

---

## Backlog

### P1 — EPIC-E: Wrap-or-replace Claude Code primitives

> Dependency order: TASK-086 → TASK-087/088/089 (parallel) → TASK-090.

- [x] **TASK-086** — audit + ADR-012 (Sprint 28)
- [x] **TASK-087** — review + security steps updated (Sprint 28)
- [x] **TASK-088** — task tracking updated (Sprint 28)
- [x] **TASK-089** — init mode updated (Sprint 28)

- [x] **TASK-090** — sweep clean, ADR-012 closed, EPIC-E done (Sprint 29)

---

## Changelog

> Current in-progress sprint only. Completed sprints archived in `docs/CHANGELOG.md`.
> Sprints 0–27 archived → `docs/CHANGELOG.md`.

### Sprint 33 — Archived to docs/CHANGELOG.md (2026-05-01)

*Sprint 34 in progress — no entries yet.*

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
Sprint 29    →  EPIC-E close — consistency sweep        (TASK-090)
v2 next      →  EPIC-E sweep (Sprint 29) → backlog empty
```
