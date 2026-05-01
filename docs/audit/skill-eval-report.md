---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
purpose: Phase 0 minimal eval harness — structural skill validation
status: current
generator: scripts/eval-skills.js
---

# Skill Eval Report — 2026-05-01T13:34:05.103Z

- Skills evaluated: **14**
- Pass: **13**
- Fail: **1**
- Total violations: 1

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
| adr-writer | 74 | ✓ pass | — |
| dev-flow-compress | 62 | ✓ pass | — |
| diagnose | 73 | ✓ pass | — |
| lean-doc-generator | 89 | ✓ pass | — |
| orchestrator | 84 | ✓ pass | — |
| pr-reviewer | 90 | ✓ pass | — |
| refactor-advisor | 62 | ✓ pass | — |
| release-manager | 70 | ✓ pass | — |
| security-auditor | 77 | ✓ pass | — |
| system-design-reviewer | 92 | ✗ fail (1) | R4 |
| task-decomposer | 72 | ✓ pass | — |
| tdd | 81 | ✓ pass | — |
| write-a-skill | 81 | ✓ pass | — |
| zoom-out | 55 | ✓ pass | — |

## Violation details

### system-design-reviewer

- **R4** — description starts with "Use when"

