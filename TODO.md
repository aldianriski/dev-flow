# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04 (Sprint 046 promoted — EPIC-Audit Phase 5 stale doc refresh: ARCHITECTURE.md + AI_CONTEXT.md)
update_trigger: Sprint completed, task added, task status changed
status: current
sprint: 046
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

→ docs/sprint/SPRINT-046-stale-doc-refresh.md

> Next: Sprint 047 — EPIC-Audit Phase 6 (archive external refs + close EPIC-Audit). Held per roadmap; do not pull forward into Sprint 046.

---

## Backlog

### P0 — EPIC-Audit: Full project audit + external-ref alignment

> Dependency: Sprint 34 (Phase 0) gates the rest. Each phase = own sprint. Phases slid +2 to make room for Sprint 038 (Foundation Hardening) + Sprint 039 (Codemap+Modes+Skills).

- [x] **Phase 4f — Skill wrapper patterns with skill-creator** — closed Sprint 045 T1 (ADR-024). EPIC-Audit Phase 4 deep-dive series (4a-4f) COMPLETE.
- [ ] **Phase 5 — Stale doc refresh** (Sprint 46) — `ARCHITECTURE.md` + `AI_CONTEXT.md`
- [ ] **Phase 6 — Archive external refs + close EPIC-Audit** (Sprint 47)

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

### Sprint 045 — Phase 4f + CONTEXT.md lifts + lean-doc date-sanity — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/skill-creator-skill-diff-2026-05-04.md` | NEW — anthropics/skills/skill-creator (Apache 2.0, SHA d230a6dd6eb1) 5-axis diff vs dev-flow write-a-skill + 4 bidirectional findings + 3 TASK-116 lift candidates | ADR-024 |
| `docs/adr/ADR-024-skill-creator-patterns.md` | NEW — 7-decision ADR + lineage credit + scale-driven defer rationale; FIRST non-MIT external ref this EPIC | ADR-024 |
| `.claude/CONTEXT.md` | T2: NEW frontmatter ownership header (TASK-104 closed). T3: 3 additive sections — `_Avoid_` annotations + § Relationships + § Flagged Ambiguities (TASK-117 closed); 129/130 lines | (TASK-104 implements DOCS_Guide §3; TASK-117 implements Sprint 043 DEC-5) |
| `skills/lean-doc-generator/SKILL.md` | T4: Step 0b date-sanity pre-flight (6 lines); v2.0.0→2.1.0 MINOR; last-validated→2026-05-04. 93→94 lines (TASK-118 closed) | (closes Sprint 044 retro Pattern Candidate #4) |
| `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | T4: NEW § Date-Sanity reference content (29 lines: trigger/logic/template/rules/citation) | (cross-link from SKILL.md Step 0b) |
| `docs/sprint/SPRINT-045-skill-creator-and-context-lifts.md` | NEW — sprint plan + execution log + 10 decisions + retro | — |

Plan-lock `89d2389` · T1 `6b094bf` · T2 `736c6bc` · T3 `fe30013` · T4 `2d1fbb6` · close (this commit).

**EPIC-Audit Phase 4 deep-dive series (4a-4f) COMPLETE.** 6 sprints (040-045) · 6 ext-refs · 6 ADRs (019-024) · 9 research notes · 9 bidirectional findings.

### Sprint 044 — EPIC-Audit Phase 4e (GSD patterns) — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/gsd-phase-pipeline-and-commands-2026-05-04.md` | NEW — GSD scale survey (164+ assets vs dev-flow 24) + 9-phase pipeline mapping + commands/skills namespace comparison + 8 per-pattern recommendations + bidirectional sprint-bulk finding | ADR-023 |
| `docs/research/gsd-contexts-plans-and-context-2026-05-04.md` | NEW — Part A contexts/ defer (output-style profiles) + Part B .plans/ no-lift + Part C CONTEXT.md zero-lift + bidirectional CONTEXT.md richness finding | ADR-023 |
| `docs/adr/ADR-023-gsd-patterns.md` | NEW — 9-decision ADR (5 NO LIFT + 2 DEFER + 2 bidirectional findings); scale-driven defer with explicit re-eval triggers | ADR-023 |
| `docs/sprint/SPRINT-044-gsd-patterns.md` | NEW — sprint plan + execution log + 9 decisions + retro | — |

Plan-lock `aed05f0` · T1 `30a0c4f` · T2 `526c0af` · T3 `54d492f` · close (this commit).

### Sprint 043 — EPIC-Audit Phase 4d (Mattpocock skill library) — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/mattpocock-skill-diff-2026-05-04.md` | NEW — 4-skill matrix (tdd/diagnose/zoom-out/task-decomposer) + trigger-phrase deltas + per-skill recommendations + bidirectional zoom-out finding | ADR-022 |
| `docs/research/mattpocock-bucket-and-context-2026-05-04.md` | NEW — Part A bucket migration cost matrix + defer rationale; Part B CONTEXT.md section matrix + 3 lift recommendations | ADR-022 |
| `.out-of-scope/README.md` | NEW — convention + frontmatter spec + ADR relationship + lineage credit to mattpocock | ADR-022 |
| `.out-of-scope/run-hook-shim.md` | NEW — sources ADR-021 DEC-3 | ADR-022 |
| `.out-of-scope/tests-dir-empty-scaffold.md` | NEW — sources ADR-021 DEC-6 | ADR-022 |
| `.out-of-scope/statusline-savings-badge.md` | NEW — sources ADR-020 DEC-6 | ADR-022 |
| `docs/adr/ADR-022-mattpocock-skill-library-patterns.md` | NEW — 7-decision ADR + locks `docs/adr/` convention as documented standard | ADR-022 |
| `docs/sprint/SPRINT-043-mattpocock-skill-library.md` | NEW — sprint plan + execution log + 7 decisions + retro | — |

Plan-lock `2813289` · T1 `db88a40` · T2 `39a56f4` · T3 `5d2c2e7` · T4 `cacc199` · close (this commit).

### Sprint 042 — EPIC-Audit Phase 4c (Superpowers patterns) — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/superpowers-hooks-diff-2026-05-04.md` | NEW — verbatim superpowers hooks.json + matcher comparison + coverage matrix; recommendation = keep-superset | ADR-021 |
| `docs/research/superpowers-run-hook-shim-2026-05-04.md` | NEW — verbatim shim source + dispatch walkthrough + proposed dev-flow shape (UNIMPLEMENTED) + adopt/defer matrix | ADR-021 |
| `docs/research/superpowers-acceptance-harness-2026-05-04.md` | NEW — pattern walkthrough + 3-skill seed (prime/orchestrator/tdd) + integration target + 6-risk matrix for TASK-116 | ADR-021 |
| `.github/PULL_REQUEST_TEMPLATE.md` | NEW — adapted from superpowers (lift structure, drop frustration tone, add dev-flow DoD + ADR-016 skill rule + layer values) | ADR-021 |
| `docs/adr/ADR-021-superpowers-patterns.md` | NEW — 6-decision ADR (matcher / divergence / shim defer / acceptance harness / PR template lift / tests dir defer) | ADR-021 |
| `docs/sprint/SPRINT-042-superpowers-patterns.md` | NEW — sprint plan + execution log + 6 decisions + retro | — |

Plan-lock `828b200` · T1 `c66e4b7` · T2 `cf3cbc8` · T3 `2caa3bd` · T4 `c11eb34` · close (this commit).

### Sprint 041 — EPIC-Audit Phase 4b (Caveman compare) — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/caveman-skill-diff-2026-05-04.md` | NEW — section-level diff matrix + winner-per-axis + net assessment (juliusbrussee `ef6050c5e184` vs mattpocock `b843cb5ea74b`) | ADR-020 |
| `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` | NEW — file walkthrough + tokenizer parity matrix (`gpt-tokenizer` primary) + snapshot schema 1:1 + 5-risk matrix for TASK-115 | ADR-020 |
| `docs/adr/ADR-020-caveman-patterns.md` | NEW — 5-decision ADR (no fork / dual-lineage credit / 3-arm port / caveman-shrink reject / statusline defer) | ADR-020 |
| `docs/sprint/SPRINT-041-caveman-compare.md` | NEW — sprint plan + execution log + 6 decisions + 2 OQs + retro | — |

Plan-lock `87bb523` · T1 `0ee6f8d` · T2 `b79815f` · T3 `7ab9ff6` · close (this commit).

### Sprint 040 — EPIC-Audit Phase 4a (Karpathy patterns) — closed 2026-05-04

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/CONTEXT.md` | NEW § Behavioral Guidelines Lineage block — 4-principle adaptation table + MIT attribution + upstream SHA `2c606141936f` lock | ADR-019 |
| `docs/adr/ADR-019-karpathy-patterns.md` | NEW — karpathy adoption + lineage credit; 3-part decision (lineage lock + verify-step retro credit + EXAMPLES.md reject) | ADR-019 |
| `docs/sprint/SPRINT-040-karpathy-patterns.md` | NEW — sprint plan + execution log + 4 decisions + retro | — |

Plan-lock `7e06c72` · T1 `1b7741b` · T2 `54c88b1` · T3 `8261847` · T4 `eed5126` · close `3fec973`.

*Sprints 38 + 039 archived → `docs/CHANGELOG.md`. Sprints 040 + 041 + 042 + 043 + 044 + 045 await archive on next `/release-patch` invocation that triggers a bump (or manual archive — release-patch skip-bump on docs-only is the cause; flagged for fix).*

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
