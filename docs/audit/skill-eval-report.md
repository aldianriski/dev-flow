---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
purpose: Phase 0 minimal eval harness — structural skill validation
status: current
generator: scripts/eval-skills.js
---

# Skill Eval Report — 2026-05-10T17:24:53.059Z

- Skills evaluated: **16**
- Pass: **13**
- Fail: **3**
- Total violations: 3

## Rules

- **R1**: frontmatter present
- **R2**: name field present
- **R3**: description field present
- **R4**: description starts with "Use when"
- **R5**: description ≤500 chars
- **R6**: SKILL.md ≤100 lines
- **R7**: has "## Red Flags" section

## Per-skill results

| Skill | Lines | Status | Violations |
|:------|------:|:-------|:-----------|
| adr-writer | 76 | ✓ pass | — |
| codemap-refresh | 64 | ✗ fail (1) | R7 |
| diagnose | 75 | ✓ pass | — |
| lean-doc-generator | 96 | ✓ pass | — |
| orchestrator | 98 | ✓ pass | — |
| pr-reviewer | 92 | ✓ pass | — |
| prime | 89 | ✗ fail (1) | R7 |
| refactor-advisor | 64 | ✓ pass | — |
| release-manager | 74 | ✓ pass | — |
| release-patch | 95 | ✗ fail (1) | R7 |
| security-auditor | 79 | ✓ pass | — |
| task-decomposer | 74 | ✓ pass | — |
| tdd | 83 | ✓ pass | — |
| test-planner | 89 | ✓ pass | — |
| write-a-skill | 83 | ✓ pass | — |
| zoom-out | 57 | ✓ pass | — |

## Violation details

### codemap-refresh

- **R7** — has "## Red Flags" section

### prime

- **R7** — has "## Red Flags" section

### release-patch

- **R7** — has "## Red Flags" section

