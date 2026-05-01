---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
purpose: Phase 0 baseline — frozen snapshot for Phase 3 token-reduction comparison
status: current
generator: scripts/audit-baseline.js
---

# Baseline Metrics — 2026-05-01T14:43:55.569Z

## Aggregate

- Skills: **14** · total lines: 1062 · approx tokens: 10338
- Agents: **7** · total lines: 171 · approx tokens: 1688
- Scripts: **3**
- Skills over 100-line cap: none 
- Agents over 30-line cap: none 
- Skills missing Red Flags section: none
- Skills with description not starting "Use when": none
- Skills with description >500 chars: none

## Skills

| Skill | Lines | Cap | Chars | Tokens~ | Desc chars | Use-when | Red Flags | Refs |
|:------|------:|----:|------:|--------:|-----------:|:--------:|:---------:|-----:|
| adr-writer | 74 | 100 | 2718 | 680 | 294 | ✓ | ✓ | 1 |
| dev-flow-compress | 62 | 100 | 2308 | 577 | 243 | ✓ | ✓ | 1 |
| diagnose | 73 | 100 | 2451 | 613 | 259 | ✓ | ✓ | 0 |
| lean-doc-generator | 89 | 100 | 3459 | 865 | 308 | ✓ | ✓ | 3 |
| orchestrator | 84 | 100 | 3248 | 812 | 300 | ✓ | ✓ | 2 |
| pr-reviewer | 90 | 100 | 3252 | 813 | 310 | ✓ | ✓ | 1 |
| refactor-advisor | 62 | 100 | 2964 | 741 | 217 | ✓ | ✓ | 0 |
| release-manager | 70 | 100 | 2452 | 613 | 274 | ✓ | ✓ | 1 |
| security-auditor | 77 | 100 | 3516 | 879 | 279 | ✓ | ✓ | 0 |
| system-design-reviewer | 92 | 100 | 3688 | 922 | 317 | ✓ | ✓ | 1 |
| task-decomposer | 72 | 100 | 4007 | 1002 | 311 | ✓ | ✓ | 2 |
| tdd | 81 | 100 | 3058 | 765 | 206 | ✓ | ✓ | 0 |
| write-a-skill | 81 | 100 | 2759 | 690 | 190 | ✓ | ✓ | 0 |
| zoom-out | 55 | 100 | 1463 | 366 | 265 | ✓ | ✓ | 0 |

## Agents

| Agent | Lines | Cap | Chars | Tokens~ | Desc chars |
|:------|------:|----:|------:|--------:|-----------:|
| code-reviewer | 18 | 30 | 715 | 179 | 141 |
| design-analyst | 29 | 30 | 1109 | 278 | 155 |
| dispatcher | 30 | 30 | 1470 | 368 | 163 |
| migration-analyst | 24 | 30 | 865 | 217 | 138 |
| performance-analyst | 23 | 30 | 960 | 240 | 162 |
| scope-analyst | 29 | 30 | 875 | 219 | 125 |
| security-analyst | 18 | 30 | 747 | 187 | 157 |

## Scripts

| Script | Lines |
|:-------|------:|
| audit-baseline.js | 218 |
| eval-skills.js | 120 |
| session-start.js | 241 |

## Governance Docs

| File | Lines | Status | last_updated | Tokens~ |
|:-----|------:|:-------|:-------------|--------:|
| .claude/CLAUDE.md | 76 | current | 2026-05-01 | 647 |
| .claude/CONTEXT.md | 80 | unknown | unknown | 759 |
| docs/ARCHITECTURE.md | 89 | stale | 2026-04-26 | 1197 |
| docs/AI_CONTEXT.md | 88 | stale | 2026-04-29 | 1332 |
| docs/DECISIONS.md | 382 | current | 2026-05-01 (ADR-015 added — Sprint 36) | 7995 |
| docs/CHANGELOG.md | 717 | current | 2026-05-01 (Sprint 36 archived) | 14364 |
| README.md | 66 | current | 2026-05-01 | 574 |
| TODO.md | 123 | unknown | unknown | 1433 |

---

## Sprint 37 Delta (Phase 3 token-reduction outcome)

**Baseline anchor (Sprint 34 freeze, 2026-05-01 T13:11):**
- Skills: 14 · total lines 1062 · approx tokens 10440
- Agents: 7 · total lines 174 · approx tokens 1729
- **2 agents over 30-line cap** (`orchestrator`/`dispatcher` 31, `design-analyst` 31)
- **1 skill description failing R4** (`system-design-reviewer`: "Use before...")

**Post-Sprint-37 (this snapshot):**
- Skills: 14 · total lines 1062 · approx tokens 10338 (−102, −0.97%)
- Agents: 7 · total lines 171 · approx tokens 1688 (−3 lines / −41 tokens, −1.7% / −2.4%)
- **0 agents over cap** (P0-5 closed; cap held at 30 — no ADR-016 amend needed)
- **0 skills failing eval-skills.js** (R4 closed via T2; 14/14 pass)
- **0 skills missing "Do not use" clause** (P1-9 closed via T3 on `orchestrator` + `task-decomposer`)
- **7/7 agent descriptions start with "Use when"** (P2-7 closed via T4 on `dispatcher`)

**Quality gate (Q7):** zero OVER-CAP + 14/14 eval-skills pass — **PASS**.

**Overlap review (T5):** 3 pairs read side-by-side.
- `pr-reviewer` × `code-reviewer` agent — preload pattern (intentional per ADR-015 Rule 3); different artifact types.
- `system-design-reviewer` × `pr-reviewer` — different review lenses (system-level vs PR-diff). ~10–15% concept overlap on architecture lens; intentional.
- `tdd` × `diagnose` — share feedback-loop pattern + RED/GREEN/REGRESS vocabulary. ~15–20% surface overlap; conceptually distinct (new-behavior TDD vs existing-bug debugging). Already cross-linked from `tdd` description ("use diagnose instead" for existing failures). No additional cross-link needed.

**References audit (T6):** 12 `skills/*/references/*.md` files inspected; **all 12 referenced** from parent SKILL.md or sibling references file. Zero unbound. Zero deletes. Surface is lean.

**CI status:** `eval-skills.js` exits 0 — `continue-on-error: true` removed from `.github/workflows/validate.yml` (added in Sprint 36 housekeeping commit `631be1f`; redundant after T2).

---

Re-run: `node scripts/audit-baseline.js`. JSON snapshot at `docs/audit/baseline-metrics.json`.
