# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03 (Sprint 038 closed — Foundation Hardening; pending promote of Sprint 039)
update_trigger: Sprint completed, task added, task status changed
status: current
sprint: none
---

> **External references**
> - https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md → behavioral guidelines patterns
> - https://github.com/juliusbrussee/caveman → eval harness, single-source-of-truth discipline, context compression
> - https://github.com/obra/superpowers → plugin development baseline
> - https://github.com/mattpocock/skills → skill library, evaluation harness, plugin infrastructure, and other patterns for building AI agents

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

> Sprint 038 closed 2026-05-03 — archived to `docs/CHANGELOG.md`. Next: Sprint 039 Codemap+Modes+Skills (4 tasks: TASK-098, TASK-099, TASK-100, TASK-103) — pending promote.

---

## Backlog

### P0 — Sprint 039: Codemap + Modes + Skills — build new tooling (4 tasks)

> Theme: codemap base knowledge, sprint-bulk dispatcher mode, /prime skill, /release-patch skill. Builds on Sprint 038 hook+cache foundation.

- [ ] **TASK-098** — Codemap base knowledge system (3-tier + post-commit AST hook)
  - `scope`: full · `layers`: governance, docs, skills, scripts · `risk`: high · `HITL`
  - `acceptance`: `docs/codemap/CODEMAP.md` exists (auto-generated, hubs+deps+modules); `docs/codemap/handoff.json` valid JSON schema `{nodes[], edges[], metadata{}, last_built}`; CLAUDE.md `## Codemap (L0)` block with one-liner per module + overflow pointer to CODEMAP.md if 80-line cap exceeded; new skill `skills/codemap-refresh/SKILL.md` ≤100 lines regenerates all 3; PowerShell PostToolUse hook on `Bash(git commit*)` rebuilds AST tree (no LLM, no Node) <5s on clean repo; tested on Windows space-path
  - `depends-on`: none
  - `note`: steals patterns from OpenViking (3-tier), codemap (handoff envelope), graphify (post-commit AST rebuild)

- [ ] **TASK-099** — Add `sprint-bulk` mode to dispatcher (Hybrid C)
  - `scope`: full · `layers`: agents, skills, governance, docs · `risk`: high · `HITL`
  - `acceptance`: dispatcher lists 4 modes (init/quick/mvp/sprint-bulk); `sprint-bulk` batches G1+G2 once per sprint into single sprint-PRD; sequential default; auto-loops Active Sprint tasks; parallelism only when scope-analyst returns file-overlap matrix == ∅ for every pair; `.claude/CONTEXT.md` Modes table shows 4 rows; orchestrator skill lists `sprint-bulk` in mode-selection; `plugin.json` MINOR bump (new mode)
  - `depends-on`: none
  - `note`: do not run mid-sprint with another open task — version bump triggers plugin reload

- [ ] **TASK-100** — `/prime` skill — ordered context loader + health check
  - `scope`: quick · `layers`: skills, docs · `risk`: low · `AFK`
  - `acceptance`: `skills/prime/SKILL.md` ≤100 lines, frontmatter `name: prime` + `description` "Use when…"; reads in order CLAUDE.md → CONTEXT.md → MEMORY.md → active sprint plan → CODEMAP.md L0; emits health report `[OK|MISSING]` per file + sprint number + task count; non-error if optional artifacts (CODEMAP.md, MEMORY.md) absent
  - `depends-on`: TASK-098 (CODEMAP.md L0 must exist; gracefully degrades if absent)

- [ ] **TASK-103** — `/release-patch` skill — version sync + CHANGELOG + sprint-state refresh + human-gated push
  - `scope`: full · `layers`: skills, governance, docs · `risk`: high · `HITL`
  - `acceptance`: `skills/release-patch/SKILL.md` ≤100 lines; bumps PATCH in `.claude-plugin/plugin.json` AND `.claude-plugin/marketplace.json` lockstep; skip-bump if `git diff --name-only HEAD` shows only `^docs/` paths; CHANGELOG.md gains entry (sprint number + closed tasks from TODO.md Changelog); MEMORY.md `dev-flow sprint state` refreshed if sprint just closed; CONTEXT.md drift warning if gates/modes/agents changed but CONTEXT.md not in diff; stale-doc `last_updated` auto-clear; push = HARD STOP (emits `ready to push, run \`git push origin master\`` and exits); reviewer can grep — no `git push` in skill files
  - `depends-on`: none

### P0 — EPIC-Audit: Full project audit + external-ref alignment

> Dependency: Sprint 34 (Phase 0) gates the rest. Each phase = own sprint. Phases slid +2 to make room for Sprint 038 (Foundation Hardening) + Sprint 039 (Codemap+Modes+Skills).

- [ ] **Phase 4a — Karpathy patterns** (Sprint 40)
- [ ] **Phase 4b — Caveman compare (plugin vs mattpocock skill)** (Sprint 41)
- [ ] **Phase 4c — Superpowers patterns** (Sprint 42)
- [ ] **Phase 4d — Mattpocock skill library** (Sprint 43)
- [ ] **Phase 5 — Stale doc refresh** (Sprint 44) — `ARCHITECTURE.md` + `AI_CONTEXT.md`
- [ ] **Phase 6 — Archive external refs + close EPIC-Audit** (Sprint 45)

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

*Sprint 38 archived → `docs/CHANGELOG.md`. No active sprint.*

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
Sprint 39    →  Codemap + Modes + Skills (codemap base / sprint-bulk mode / /prime / /release-patch)
Sprint 40-45 →  EPIC-Audit Phases 4-6 (4 ext-ref deep / stale doc refresh / archive)
```
