---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Harness shape change OR new prompt added
status: current
task: TASK-116-v2 (Sprint 055)
---

# tests/skill-triggering — Skill-Triggering Acceptance Harness

Operator-run harness verifying Claude triggers expected skill via naturalistic prompts. Per `docs/research/superpowers-acceptance-harness-2026-05-04.md` + ADR-016 + ADR-021 DEC-4.

## Run

```
node scripts/eval-acceptance.js --dry-run                # skeleton report; no claude invocation
node scripts/eval-acceptance.js                          # all prompts (Mode A — costs API tokens)
node scripts/eval-acceptance.js --skill prime            # single prompt
node scripts/eval-acceptance.js --cap-headroom-warn      # + TD-002 lint fold-in
```

## Prerequisites

- `claude` CLI in PATH; pin version in audit report (research §gaps R1).
- dev-flow plugin installed in current Claude Code env. In-dev: `--plugin-dir <path>` OR `DEVFLOW_PLUGIN_DIR` env (R2 fallback).
- Node ≥18, no npm deps.

## Output

- Audit report: `docs/audit/eval-acceptance-<date>.md` (per-skill table + cap-headroom section).
- Per-run logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored).

## Pass condition

Stream-json contains `"name":"Skill"` AND `"skill":"<name>"` (or `<namespace>:<name>`). Per-prompt verdict: ≥2/3 runs pass (Mode A quorum per OQ(D)).

## Notes

- Mode A (manual) per ADR-021 DEC-4; Mode B (CI per PR) deferred until ≥10 skills triggering.
- Windows: paths with spaces (e.g. `C:\Users\HYPE AMD\`) must be quoted.
