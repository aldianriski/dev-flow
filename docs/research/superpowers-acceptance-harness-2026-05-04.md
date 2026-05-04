---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: superpowers acceptance harness shape changes OR dev-flow promotes implementation sprint
status: current
---

# Superpowers skill-triggering acceptance harness — design for dev-flow port

**Sprint:** 042 T3 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| File | Source | SHA pin | Lines | License |
|:-----|:-------|:--------|------:|:--------|
| `tests/skill-triggering/run-test.sh` | gh CLI raw | `e7a2d16476bf` | 88 | MIT |
| `tests/skill-triggering/run-all.sh` | gh CLI raw | `e7a2d16476bf` | 60 | MIT |
| `tests/skill-triggering/prompts/test-driven-development.txt` | gh CLI raw | `e7a2d16476bf` | (sample, ~6 lines) | MIT |

## Acceptance pattern (verbatim from superpowers)

`run-test.sh` invokes `claude -p` with a NAIVE prompt (does NOT mention the skill name) and verifies that Claude triggered the expected skill via the `Skill` tool:

```bash
timeout 300 claude -p "$PROMPT" \
    --plugin-dir "$PLUGIN_DIR" \
    --dangerously-skip-permissions \
    --max-turns "$MAX_TURNS" \
    --output-format stream-json \
    > "$LOG_FILE" 2>&1
```

Pass condition (regex against stream-json):
- `"name":"Skill"` present (skill tool was invoked)
- AND `"skill":"<skill-name>"` OR `"skill":"<namespace>:<skill-name>"` present

Fail condition: either or both absent.

Sample prompt for `test-driven-development`:
```
I need to add a new feature to validate email addresses. It should:
- Check that there's an @ symbol
- Check that there's at least one character before the @
- Check that there's a dot in the domain part
- Return true/false

Can you implement this?
```

The prompt is naturalistic — it describes a coding task. A correctly-tuned skill description should make Claude select `tdd` (or `test-driven-development`) automatically. If the skill is poorly described, Claude implements directly without invoking the skill, and the test fails.

## Test-format spec for dev-flow port

Two files per tested skill:
1. **Prompt file:** `tests/skill-triggering/prompts/<skill-name>.txt` — naturalistic prompt that should trigger `<skill-name>` without naming it.
2. **Test runner:** `tests/skill-triggering/run-test.ps1` (PowerShell port; or shared with WSL) — runs claude, greps stream-json, exits 0/1.

Pass/fail evidence: stream-json transcript stored under `tests/skill-triggering/logs/<timestamp>/<skill>/`.

## 3-skill seed picks (per locked OQ(d))

| Skill | Trigger phrase (current) | Naturalistic prompt (proposed) | Why this skill |
|:------|:-------------------------|:-------------------------------|:---------------|
| `prime` | "Use when starting a new session and want to load project context in a deterministic order…" | "I just reopened this project after a few days off. What's the state of the active sprint?" | Highest-frequency trigger (every session start); most-tested by user already |
| `orchestrator` | "Use when starting, resuming, or completing any development task or sprint…" | "I want to start working on the next sprint task." | Workflow entry point; high-impact if mistriggered |
| `tdd` | "Use when implementing new behavior that requires tests…" | "I need to add a JSON schema validator for our config files. It should reject malformed input." | Behavior-implementation trigger; matches superpowers pattern; reuses superpowers' validated prompt structure |

These three cover three distinct trigger surfaces: session-bootstrap (`prime`), workflow-control (`orchestrator`), and code-implementation (`tdd`). Any one breaking is high-signal.

## Integration target

```
tests/
└── skill-triggering/
    ├── README.md                       # how to run, expected outputs
    ├── run-test.ps1                    # PowerShell port of superpowers run-test.sh
    ├── run-all.ps1                     # iterates prompts/, calls run-test.ps1
    ├── prompts/
    │   ├── prime.txt
    │   ├── orchestrator.txt
    │   └── tdd.txt
    └── logs/                           # gitignored — per-run stream-json artifacts
        └── <timestamp>/<skill>/...
```

## Measurement loop: pass/fail verification

Two flavors considered:

**(A) Manual session run** — operator runs `tests/skill-triggering/run-test.ps1 <skill> prompts/<skill>.txt` interactively, reviews output. Simple; no CI integration; one-off check before skill-description changes ship.

**(B) Automated evidence file** — CI runs all 3 prompts on every PR that modifies `skills/*/SKILL.md`. Pass = exit 0 from `run-test.ps1`. Fail = block PR.

**Recommendation for first implementation sprint: (A) manual.** Reasons:
- `claude -p` calls cost API tokens; CI on every PR adds cost without proportional value at 3-skill scale.
- Skill-description changes are rare; manual gate is sufficient.
- (B) becomes worthwhile when seed grows past ~10 skills.

ADR-016 already mandates "Skill changes that alter agent behavior require eval evidence before merge." Manual run + saved log file in PR description satisfies this contract.

## Gaps & risks for the dedicated implementation sprint

| # | Risk | Severity | Mitigation |
|---|:-----|:--------:|:-----------|
| R1 | `claude -p --output-format stream-json` shape may differ across Claude Code versions | medium | Pin `claude --version` in test runner output; document required version in README. |
| R2 | `--plugin-dir` may not work for in-development plugins (dev-flow itself) | medium | Verify with one-off run before sprint promote. Fallback: run from inside dev-flow repo with plugin already installed. |
| R3 | Stream-json grep is brittle (regex over JSON) | low | Use `jq` if available; fall back to regex. Match superpowers' regex patterns for stability. |
| R4 | Non-deterministic skill trigger across runs | medium | Run each prompt 3×; require ≥2/3 pass. (Superpowers runs once; dev-flow can be more conservative.) |
| R5 | Windows space-in-path for log directory | low | Quote paths; use `$env:TEMP\dev-flow-tests\<timestamp>` (Windows-native). |
| R6 | `--dangerously-skip-permissions` flag — accept risk | low | This is a test harness running known prompts; permission prompts would block automation. |

## Recommendation feeding T4 (ADR-021)

- **DEC-4:** Adopt skill-triggering acceptance harness pattern (research-only this sprint; implementation = future TASK-116).
- **DEC-4 details:** 3-skill seed = `prime`, `orchestrator`, `tdd`. Manual measurement loop (Mode A). Test layout under `tests/skill-triggering/`. PowerShell port of `run-test.sh`.
- **TASK-116 backlog entry** (created at sprint close): "Implement skill-triggering acceptance harness per `docs/research/superpowers-acceptance-harness-2026-05-04.md`. Seed = prime/orchestrator/tdd. Manual mode A. Estimated S–M, layers `scripts, ci, docs`."

Implementation NOT in this sprint — research only. Pattern matches Sprint 041 DEC-4 split.

## Re-audit cadence

Re-fetch via gh CLI when superpowers `tests/skill-triggering/` shape changes. Bump SHA pin in this file + ADR-021. Likely annual cadence.
