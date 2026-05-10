---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Eval harness contract change
status: current
---

# evals/ — Caveman 3-Arm Token-Compression Eval

Node port of caveman upstream. Measures how much a SKILL.md adds on top of plain "Answer concisely." (honest delta per Sprint 034 ADR-001).

## Setup (one-time)
`npm install` — installs `gpt-tokenizer` per ADR-035 npm-dep carve-out from ADR-002.

## Run
```
node scripts/eval-caveman.js                  # 3 arms × 10 prompts; live claude -p calls
node scripts/eval-caveman.js --dry-run        # skeleton snapshot; no API cost
node scripts/eval-measure.js --snapshot evals/snapshots/results-<ts>.json
```

## Tokenizer parity check
```
node -e "const{encode}=require('gpt-tokenizer/encoding/o200k_base'); console.log(encode('Hello, world!').length)"
```
Should print `4` (matches Python `tiktoken` o200k_base). See `docs/audit/eval-caveman-2026-05-10.md` § Tokenizer Parity.

## Files
- `prompts/en.txt` — 10 prompts ported from caveman upstream (MIT)
- `snapshots/` — gitignored per-run live-LLM artifacts; `.gitkeep` only is tracked
