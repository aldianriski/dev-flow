---
owner: Tech Lead
last_updated: 2026-04-24
update_trigger: New snapshot added; metric definitions change; methodology revised
status: current
---

# dev-flow Eval Harness

Offline three-arm methodology for measuring skill quality. No API calls — all snapshots are committed JSON fixtures.

## Three Arms

| Arm | What it captures |
|:----|:----------------|
| `baseline` | Raw model output with no skill loaded |
| `terse_control` | Output with "be concise" instruction only — isolates brevity effect |
| `skill` | Output with full skill prompt loaded |

`terse_isolation_delta` = skill vs terse_control. Separates skill signal from pure brevity pressure.

## Snapshot Schema

```json
{
  "schema_version": "1.0",
  "skill": "<skill-name>",
  "skill_version": "<semver>",
  "date": "YYYY-MM-DD",
  "prompt": "<evaluation prompt>",
  "arms": {
    "baseline":      { "output": "<text>", "token_count": 0 },
    "terse_control": { "output": "<text>", "token_count": 0 },
    "skill":         { "output": "<text>", "token_count": 0 }
  }
}
```

Snapshots live under `evals/snapshots/<skill-name>/`. Filename: `<label>-<NNN>.json`.

## Usage

```bash
python evals/measure.py evals/snapshots/lean-doc-generator/baseline-001.json
python evals/measure.py evals/snapshots/
```

**Python version:** 3.8+. `Path.is_relative_to()` (3.9+) is guarded with a `Path.parents` fallback for older runtimes.

## Metrics

| Metric | Description |
|:-------|:-----------|
| `word_count` | Word count of arm output |
| `line_count` | Non-blank line count |
| `how_content_flag` | Count of lines matching HOW-content opener patterns |
| `brevity_delta` | Word count change: skill vs baseline (%) |
| `terse_isolation_delta` | Word count change: skill vs terse_control (%) — skill signal net of brevity |

`how_content_flag` is directional only — regex-based, not authoritative. Use as a signal, not a gate.

## Lint

```bash
python -m py_compile evals/measure.py
```

## Baseline Anomalies (Sprint 10 — 2026-04-24)

Full 9-skill run after TASK-048. Findings registered as canonical baseline behavior.

| Skill | brevity_delta | terse_isolation_delta | Notes |
|:------|:-------------|:----------------------|:------|
| lean-doc-generator | −68.5% | +56.1% | Only skill with both brevity reduction and low isolation delta — HOW-filter genuinely compresses |
| dev-flow | +2.7% | +379.2% | Skill output wordier than baseline — structured Gate 0 template is inherently detailed; expected |
| system-design-reviewer | +8.9% | +546.9% | Lens table + severity ratings add words vs raw advice; expected for review-type skills |
| task-decomposer | +7.5% | +376.2% | TASK-NNN structured output is more verbose than narrative; expected |
| All others | negative | 200–480% | Brevity reduction achieved; high isolation delta = skill adds structure beyond bare conciseness |

**Pattern**: Skills where value is structured output (reviewer, decomposer, orchestrator) will have `brevity_delta >= 0`. This is not a defect — the metric measures brevity, not quality. Use `how_content_flag` and manual review to assess quality.

**how_content_flag** = 0 on all 9 skill arms — no HOW-content detected in any skill output.
