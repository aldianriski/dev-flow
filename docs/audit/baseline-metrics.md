---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
purpose: Phase 0 baseline — frozen snapshot for Phase 3 token-reduction comparison
status: current
generator: scripts/audit-baseline.js
---

# Baseline Metrics — 2026-05-01T11:16:36.371Z

## Aggregate

- Skills: **14** · total lines: 1062 · approx tokens: 10268
- Agents: **7** · total lines: 174 · approx tokens: 1688
- Scripts: **3**
- Skills over 100-line cap: none 
- Agents over 30-line cap: 2 (design-analyst, orchestrator)
- Skills missing Red Flags section: none
- Skills with description not starting "Use when": 1 (system-design-reviewer)
- Skills with description >500 chars: none

## Skills

| Skill | Lines | Cap | Chars | Tokens~ | Desc chars | Use-when | Red Flags | Refs |
|:------|------:|----:|------:|--------:|-----------:|:--------:|:---------:|-----:|
| adr-writer | 74 | 100 | 2718 | 680 | 294 | ✓ | ✓ | 1 |
| dev-flow | 84 | 100 | 3112 | 778 | 172 | ✓ | ✓ | 2 |
| dev-flow-compress | 62 | 100 | 2308 | 577 | 243 | ✓ | ✓ | 1 |
| diagnose | 73 | 100 | 2451 | 613 | 259 | ✓ | ✓ | 0 |
| lean-doc-generator | 89 | 100 | 3459 | 865 | 308 | ✓ | ✓ | 3 |
| pr-reviewer | 90 | 100 | 3244 | 811 | 302 | ✓ | ✓ | 1 |
| refactor-advisor | 62 | 100 | 2964 | 741 | 217 | ✓ | ✓ | 0 |
| release-manager | 70 | 100 | 2452 | 613 | 274 | ✓ | ✓ | 1 |
| security-auditor | 77 | 100 | 3516 | 879 | 279 | ✓ | ✓ | 0 |
| system-design-reviewer | 92 | 100 | 3652 | 913 | 279 | ✗ | ✓ | 1 |
| task-decomposer | 72 | 100 | 3915 | 979 | 227 | ✓ | ✓ | 2 |
| tdd | 81 | 100 | 3058 | 765 | 206 | ✓ | ✓ | 0 |
| write-a-skill | 81 | 100 | 2759 | 690 | 190 | ✓ | ✓ | 0 |
| zoom-out | 55 | 100 | 1455 | 364 | 261 | ✓ | ✓ | 0 |

## Agents

| Agent | Lines | Cap | Chars | Tokens~ | Desc chars |
|:------|------:|----:|------:|--------:|-----------:|
| code-reviewer | 18 | 30 | 717 | 180 | 141 |
| design-analyst | 31 ❌ | 30 | 1110 | 278 | 157 |
| migration-analyst | 24 | 30 | 867 | 217 | 138 |
| orchestrator | 31 ❌ | 30 | 1460 | 365 | 153 |
| performance-analyst | 23 | 30 | 962 | 241 | 162 |
| scope-analyst | 29 | 30 | 875 | 219 | 127 |
| security-analyst | 18 | 30 | 749 | 188 | 157 |

## Scripts

| Script | Lines |
|:-------|------:|
| audit-baseline.js | 218 |
| eval-skills.js | 120 |
| session-start.js | 175 |

## Governance Docs

| File | Lines | Status | last_updated | Tokens~ |
|:-----|------:|:-------|:-------------|--------:|
| .claude/CLAUDE.md | 76 | current | 2026-05-01 | 648 |
| .claude/CONTEXT.md | 80 | unknown | unknown | 752 |
| docs/ARCHITECTURE.md | 89 | stale | 2026-04-26 | 1191 |
| docs/AI_CONTEXT.md | 88 | stale | 2026-04-29 | 1331 |
| docs/DECISIONS.md | 269 | current | 2026-04-29 | 5323 |
| docs/CHANGELOG.md | 645 | current | 2026-05-01 (Sprint 33 archived) | 12800 |
| README.md | 66 | current | 2026-05-01 | 573 |
| TODO.md | 146 | unknown | unknown | 1847 |

---

Re-run: `node scripts/audit-baseline.js`. JSON snapshot at `docs/audit/baseline-metrics.json`.
