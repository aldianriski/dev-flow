---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
purpose: Phase 0 baseline — frozen snapshot for Phase 3 token-reduction comparison
status: current
generator: scripts/audit-baseline.js
---

# Baseline Metrics — 2026-05-01T13:11:01.340Z

## Aggregate

- Skills: **14** · total lines: 1062 · approx tokens: 10276
- Agents: **7** · total lines: 174 · approx tokens: 1686
- Scripts: **3**
- Skills over 100-line cap: none 
- Agents over 30-line cap: 2 (design-analyst, dispatcher)
- Skills missing Red Flags section: none
- Skills with description not starting "Use when": 1 (system-design-reviewer)
- Skills with description >500 chars: none

## Skills

| Skill | Lines | Cap | Chars | Tokens~ | Desc chars | Use-when | Red Flags | Refs |
|:------|------:|----:|------:|--------:|-----------:|:--------:|:---------:|-----:|
| adr-writer | 74 | 100 | 2718 | 680 | 294 | ✓ | ✓ | 1 |
| dev-flow-compress | 62 | 100 | 2308 | 577 | 243 | ✓ | ✓ | 1 |
| diagnose | 73 | 100 | 2451 | 613 | 259 | ✓ | ✓ | 0 |
| lean-doc-generator | 89 | 100 | 3459 | 865 | 308 | ✓ | ✓ | 3 |
| orchestrator | 84 | 100 | 3120 | 780 | 172 | ✓ | ✓ | 2 |
| pr-reviewer | 90 | 100 | 3252 | 813 | 310 | ✓ | ✓ | 1 |
| refactor-advisor | 62 | 100 | 2964 | 741 | 217 | ✓ | ✓ | 0 |
| release-manager | 70 | 100 | 2452 | 613 | 274 | ✓ | ✓ | 1 |
| security-auditor | 77 | 100 | 3516 | 879 | 279 | ✓ | ✓ | 0 |
| system-design-reviewer | 92 | 100 | 3650 | 913 | 279 | ✗ | ✓ | 1 |
| task-decomposer | 72 | 100 | 3923 | 981 | 227 | ✓ | ✓ | 2 |
| tdd | 81 | 100 | 3058 | 765 | 206 | ✓ | ✓ | 0 |
| write-a-skill | 81 | 100 | 2759 | 690 | 190 | ✓ | ✓ | 0 |
| zoom-out | 55 | 100 | 1463 | 366 | 265 | ✓ | ✓ | 0 |

## Agents

| Agent | Lines | Cap | Chars | Tokens~ | Desc chars |
|:------|------:|----:|------:|--------:|-----------:|
| code-reviewer | 18 | 30 | 715 | 179 | 141 |
| design-analyst | 31 ❌ | 30 | 1110 | 278 | 155 |
| dispatcher | 31 ❌ | 30 | 1464 | 366 | 157 |
| migration-analyst | 24 | 30 | 865 | 217 | 138 |
| performance-analyst | 23 | 30 | 960 | 240 | 162 |
| scope-analyst | 29 | 30 | 875 | 219 | 125 |
| security-analyst | 18 | 30 | 747 | 187 | 157 |

## Scripts

| Script | Lines |
|:-------|------:|
| audit-baseline.js | 218 |
| eval-skills.js | 120 |
| session-start.js | 175 |

## Governance Docs

| File | Lines | Status | last_updated | Tokens~ |
|:-----|------:|:-------|:-------------|--------:|
| .claude/CLAUDE.md | 76 | current | 2026-05-01 | 647 |
| .claude/CONTEXT.md | 80 | unknown | unknown | 759 |
| docs/ARCHITECTURE.md | 89 | stale | 2026-04-26 | 1197 |
| docs/AI_CONTEXT.md | 88 | stale | 2026-04-29 | 1332 |
| docs/DECISIONS.md | 329 | current | 2026-05-01 | 6750 |
| docs/CHANGELOG.md | 676 | current | 2026-05-01 (Sprint 34 archived) | 13317 |
| README.md | 66 | current | 2026-05-01 | 574 |
| TODO.md | 125 | unknown | unknown | 1476 |

---

Re-run: `node scripts/audit-baseline.js`. JSON snapshot at `docs/audit/baseline-metrics.json`.
