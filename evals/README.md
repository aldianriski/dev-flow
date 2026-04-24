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
