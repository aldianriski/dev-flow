---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Re-run acceptance harness
status: current
task: TASK-116-v2
sprint: 055
---

# Skill-Triggering Acceptance Eval — 2026-05-10

> Source: `scripts/eval-acceptance.js` · per `docs/research/superpowers-acceptance-harness-2026-05-04.md`
> Pass rule: stream-json contains `"name":"Skill"` AND target skill name; ≥2/3 runs (Mode A quorum per OQ(D)).
> Run timestamp: `2026-05-10T15-46-41-244Z` · claude version: `2.1.138 (Claude Code)` (pin per research §gaps R1)

## Summary

- Skills evaluated: **8**
- Pass: **0**
- Fail: **8**

## Per-Skill Results

| Skill | Runs | Passes | Verdict | Log dir |
|:------|-----:|-------:|:--------|:--------|
| `lean-doc-generator` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/lean-doc-generator/` |
| `orchestrator` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/orchestrator/` |
| `prime` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/prime/` |
| `refactor-advisor` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/refactor-advisor/` |
| `release-patch` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/release-patch/` |
| `task-decomposer` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/task-decomposer/` |
| `tdd` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/tdd/` |
| `zoom-out` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-10T15-46-41-244Z/zoom-out/` |

## Per-Run Detail

### `lean-doc-generator`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\lean-doc-generator\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\lean-doc-generator\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\lean-doc-generator\run-3.json`)

### `orchestrator`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\orchestrator\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\orchestrator\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\orchestrator\run-3.json`)

### `prime`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\prime\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\prime\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\prime\run-3.json`)

### `refactor-advisor`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\refactor-advisor\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\refactor-advisor\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\refactor-advisor\run-3.json`)

### `release-patch`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\release-patch\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\release-patch\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\release-patch\run-3.json`)

### `task-decomposer`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\task-decomposer\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\task-decomposer\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\task-decomposer\run-3.json`)

### `tdd`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\tdd\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\tdd\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\tdd\run-3.json`)

### `zoom-out`

- run 1: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\zoom-out\run-1.json`)
- run 2: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\zoom-out\run-2.json`)
- run 3: **FAIL** — claude exit 1 (`tests\skill-triggering\logs\2026-05-10T15-46-41-244Z\zoom-out\run-3.json`)

## Cap Headroom (TD-002 lint fold-in)

> Rule: `headroom = 100 - line_count`. OK ≥5 · WARN <5 · EXEMPT = 0 (grandfathered, e.g. release-patch per ADR-032).

| Skill | Lines | Headroom | Verdict |
|:------|------:|---------:|:--------|
| `adr-writer` | 76 | 24 | **OK** |
| `architecture-grill` | 94 | 6 | **OK** |
| `codemap-refresh` | 63 | 37 | **OK** |
| `diagnose` | 75 | 25 | **OK** |
| `lean-doc-generator` | 96 | 4 | **WARN** |
| `orchestrator` | 94 | 6 | **OK** |
| `pr-reviewer` | 92 | 8 | **OK** |
| `prime` | 89 | 11 | **OK** |
| `refactor-advisor` | 64 | 36 | **OK** |
| `release-manager` | 74 | 26 | **OK** |
| `release-patch` | 95 | 5 | **OK** |
| `security-auditor` | 79 | 21 | **OK** |
| `task-decomposer` | 74 | 26 | **OK** |
| `tdd` | 83 | 17 | **OK** |
| `write-a-skill` | 83 | 17 | **OK** |
| `zoom-out` | 57 | 43 | **OK** |

Summary: 16 skills · 1 WARN · 0 EXEMPT.

## Operator Notes

- Re-run: `node scripts/eval-acceptance.js [--skill <name>] [--runs N] [--cap-headroom-warn]`
- Logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored).
- Mode A (manual) per ADR-021 DEC-4. Mode B (CI on every PR) deferred until ≥10 skills triggering OR cost gate flips per research §recommendation.
- Pass-rate baseline: ≥6/8 lift candidates pass for v1-ship gate (Sprint 056). <6/8 → remediation candidates surface to Sprint 055-2.
