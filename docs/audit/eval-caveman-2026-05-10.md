---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Re-run caveman 3-arm eval
status: current
task: TASK-115-v2
sprint: 055-2
---

# Caveman 3-Arm Token-Compression Eval — 2026-05-10

> Source: `scripts/eval-caveman.js` (runner) + `scripts/eval-measure.js` (token counter).
> Research note: `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` (Sprint 041 T2).
> Honest delta per Sprint 034 ADR-001: `(skill_arm) vs (terse_arm)` — measures what SKILL adds on top of "Answer concisely."

## Harness Contract (frozen per Sprint 055 PC-1 pattern)

| Component | Value |
|---|---|
| Runner | `scripts/eval-caveman.js` (Node ≥18; stdlib only) |
| Measurer | `scripts/eval-measure.js` (Node ≥18; gpt-tokenizer dep per ADR-035) |
| Tokenizer | `gpt-tokenizer` o200k_base (approximation of Claude's BPE; absolute numbers ≠ exact Claude tokens) |
| Snapshot schema | 1:1 with caveman upstream per OQ(C) — `metadata{generated_at, claude_cli_version, model, n_prompts, terse_prefix}` + `prompts[]` + `arms.{__baseline__, __terse__, <skill>}[]` |
| Arms | 3 — (1) `__baseline__` no system prompt, (2) `__terse__` system="Answer concisely.", (3) `<skill>` system="Answer concisely.\n\n{SKILL.md}" |
| Default skill | `caveman` (resolves via plugin-cache `~/.claude/plugins/cache/caveman/caveman/<hash>/skills/caveman/SKILL.md`) |
| Skill source | Plugin-cache hard-fail per OQ(M) — no silent inline fallback |
| Default prompts | `evals/prompts/en.txt` — 10 prompts ported verbatim from caveman upstream (MIT) |
| Mode | A — operator-pending (live runs cost-gated; per Sprint 055 PC-3 reuse) |
| Snapshot output | `evals/snapshots/results-<ISO8601>.json` (gitignored except `.gitkeep`) |
| Cap-headroom impact | None (no SKILL.md edits this sprint) |

## Tokenizer Parity

> One-line verification: `node -e "const{encode}=require('gpt-tokenizer/encoding/o200k_base'); console.log(encode('Hello, world!').length)"`

| Input | gpt-tokenizer (Node) | tiktoken (Python; expected) | Match |
|---|---:|---:|:---:|
| `"Hello, world!"` | 4 | 4 | OK |
| `"The quick brown fox jumps over the lazy dog."` | 10 | 10 | OK |

Conclusion: gpt-tokenizer o200k_base matches Python tiktoken o200k_base for short strings. Cross-tool snapshot validation (caveman's `measure.py` reading dev-flow snapshots, dev-flow's `eval-measure.js` reading caveman snapshots) is sound.

## Sample Run (dry-run; no live LLM)

```
$ node scripts/eval-caveman.js --dry-run
eval-caveman: skill=caveman plugin=caveman model=default · DRY RUN
[skill] C:\Users\HYPE AMD\.claude\plugins\cache\caveman\caveman\84cc3c14fa1e\skills\caveman\SKILL.md (3585 chars)
[prompts] 10 loaded from evals/prompts/en.txt
[arm] __baseline__ (no system prompt)
[arm] __terse__ (system: Answer concisely....)
[arm] caveman (system: Answer concisely.  --- name: caveman d...)
[summary] 10 prompts × 3 arms = 30 responses
```

Dry-run validates: harness shape · plugin-cache resolution · schema 1:1 with caveman · 30-response matrix.

## Live Run Procedure (operator-pending)

1. Ensure `claude` CLI authenticated.
2. `npm install` (gpt-tokenizer per ADR-035).
3. `node scripts/eval-caveman.js` — produces `evals/snapshots/results-<ts>.json`.
4. `node scripts/eval-measure.js --snapshot evals/snapshots/results-<ts>.json` — emits markdown table.
5. Cost: 3 arms × 10 prompts = 30 `claude -p` calls per run (real API tokens). Re-run for new measurement (snapshots are point-in-time; `claude -p` non-deterministic).

## Operator Notes

- Re-run runner: `node scripts/eval-caveman.js [--skill <name>] [--prompts <path>] [--out <path>] [--model <id>]`
- Re-run measurer: `node scripts/eval-measure.js --snapshot <path> [--encoding o200k_base] [--format md|json]`
- Override skill source: `CAVEMAN_SKILL_PATH=/abs/path/SKILL.md node scripts/eval-caveman.js`
- Mode B (CI per release) deferred until parity confirmed across multiple skill candidates + cost gate flips per research §recommendation.
