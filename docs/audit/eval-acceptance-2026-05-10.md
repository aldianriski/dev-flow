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
> Run timestamp: `2026-05-09T18-44-09-147Z` · claude version: `_(dry-run)_` (pin per research §gaps R1)

## Summary

- Skills evaluated: **3**
- Pass: **0**
- Fail: **3**

## Per-Skill Results

| Skill | Runs | Passes | Verdict | Log dir |
|:------|-----:|-------:|:--------|:--------|
| `orchestrator` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-09T18-44-09-147Z/orchestrator/` |
| `prime` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-09T18-44-09-147Z/prime/` |
| `tdd` | 3 | 0 | **FAIL** | `tests/skill-triggering/logs/2026-05-09T18-44-09-147Z/tdd/` |

## Per-Run Detail

### `orchestrator`

- run 1: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\orchestrator\run-1.json`)
- run 2: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\orchestrator\run-2.json`)
- run 3: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\orchestrator\run-3.json`)

### `prime`

- run 1: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\prime\run-1.json`)
- run 2: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\prime\run-2.json`)
- run 3: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\prime\run-3.json`)

### `tdd`

- run 1: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\tdd\run-1.json`)
- run 2: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\tdd\run-2.json`)
- run 3: **FAIL** — dry-run (no claude invocation) (`tests\skill-triggering\logs\2026-05-09T18-44-09-147Z\tdd\run-3.json`)


## Operator Notes

- Re-run: `node scripts/eval-acceptance.js [--skill <name>] [--runs N] [--cap-headroom-warn]`
- Logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored).
- Mode A (manual) per ADR-021 DEC-4. Mode B (CI on every PR) deferred until ≥10 skills triggering OR cost gate flips per research §recommendation.
- Pass-rate baseline: ≥6/8 lift candidates pass for v1-ship gate (Sprint 056). <6/8 → remediation candidates surface to Sprint 055-2.
