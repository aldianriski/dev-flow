---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: source eval scripts change OR Node tokenizer landscape shifts
status: current
---

# Caveman eval-harness port notes (Python → Node)

**Sprint:** 041 T2 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| File | Path | SHA | Lines | Deps |
|:-----|:-----|:----|------:|:-----|
| `llm_run.py` | local cache `84cc3c14fa1e/evals/llm_run.py` | upstream juliusbrussee `ef6050c5e184` | 105 | Python stdlib only; `claude` CLI on PATH |
| `measure.py` | local cache `84cc3c14fa1e/evals/measure.py` | same | 107 | `tiktoken` (PyPI) |
| `prompts/en.txt` | local cache | same | (verified exists) | — |
| `snapshots/results.json` | local cache | same | (verified exists) | — |

## File-by-file walkthrough

### `llm_run.py` — source-of-truth runner (105 lines)

**Purpose:** Calls real Claude CLI; produces `snapshots/results.json`. Run locally when SKILL.md files change.

**Three arms:**
1. `__baseline__` — no system prompt
2. `__terse__` — system prompt = `"Answer concisely."` (control)
3. `<skill_name>` — system prompt = `"Answer concisely.\n\n{SKILL.md content}"` (skill arm)

**Key insight from comment block:** "The honest delta is (3) vs (2): how much does the SKILL itself add on top of a plain 'be terse' instruction?" — comparing skill-arm to terse-control isolates skill signal from generic terseness pressure. Sprint 034 ADR-001 already adopted this in spirit.

**Flow:**
1. Read prompts from `evals/prompts/en.txt` (one per line, blank lines skipped)
2. Discover skills: `sorted(p.name for p in skills_dir.iterdir() if (p/"SKILL.md").exists())`
3. Build snapshot `metadata`: `generated_at`, `claude_cli_version`, `model`, `n_prompts`, `terse_prefix`
4. Loop arms × prompts → `claude -p [--system-prompt X] [--model Y] <prompt>`, capture stdout
5. Write `snapshots/results.json` (UTF-8, ensure_ascii=False, indent=2)

**External-process invocation:** `subprocess.run(["claude", "-p", ...], capture_output=True, text=True, check=True)`. Stdout is the LLM response.

### `measure.py` — token counter + report (107 lines)

**Purpose:** Reads `snapshots/results.json`, counts tokens via tiktoken, reports per-skill compression vs terse-control.

**Tokenizer caveat (from header comment):** tiktoken `o200k_base` is OpenAI's tokenizer — only an approximation of Claude's BPE. Ratios are still meaningful for cross-skill comparison; absolute numbers are "approximate output-length reduction," not "exact Claude tokens."

**Computation:**
- `baseline_tokens = [count(o) for o in arms["__baseline__"]]`
- `terse_tokens = [count(o) for o in arms["__terse__"]]`
- For each skill: `savings_per_prompt = 1 - skill_tokens[i] / terse_tokens[i]`
- Stats per skill: median, mean, min, max, stdev

**Output:** Markdown table to stdout, sorted by median savings descending. Reports the *control-arm-relative* delta — terse-vs-baseline is the warm-up signal; skill-vs-terse is the headline.

## Tiktoken parity for Node port

Tiktoken's `o200k_base` is the encoding to match. Three Node options:

| Library | npm | Approach | Parity claim |
|:--------|:----|:---------|:-------------|
| `gpt-tokenizer` | https://www.npmjs.com/package/gpt-tokenizer | pure JS port, BPE tables embedded | claims byte-identical to Python tiktoken for `cl100k_base`, `o200k_base`, etc. |
| `js-tiktoken` | https://www.npmjs.com/package/js-tiktoken | OpenAI's official lite JS port (sync, no WASM) | direct port from Rust source; identical encoder tables |
| `@dqbd/tiktoken` | https://www.npmjs.com/package/@dqbd/tiktoken | WASM build of Rust tiktoken | byte-identical (same Rust core) |

**Recommendation:** `gpt-tokenizer` for TASK-115 — pure JS (no WASM), simpler API, ~1.2M weekly downloads, supports `o200k_base` directly. Backup: `js-tiktoken` (closer to OpenAI source).

**Parity-verification step for TASK-115:** before snapshotting, run `node -e 'console.log(require("gpt-tokenizer/encoding/o200k_base").encode("hello world").length)'` and compare to `python -c 'import tiktoken; print(len(tiktoken.get_encoding("o200k_base").encode("hello world")))'`. Must match exactly. If not, fall back to `js-tiktoken`.

## Snapshot schema for dev-flow port (1:1 with caveman)

```json
{
  "metadata": {
    "generated_at": "<ISO8601 UTC>",
    "claude_cli_version": "<from `claude --version`>",
    "model": "<env CAVEMAN_EVAL_MODEL or 'default'>",
    "n_prompts": <int>,
    "terse_prefix": "Answer concisely."
  },
  "prompts": ["...", "..."],
  "arms": {
    "__baseline__": ["...", "..."],
    "__terse__": ["...", "..."],
    "<skill_name>": ["...", "..."]
  }
}
```

Match this schema exactly so caveman's `measure.py` can read dev-flow's snapshots (and vice versa) for cross-tool validation.

## Recommended port shape

Two scripts (matches caveman's split):

- `scripts/eval-run.js` — port of `llm_run.py`. Spawn `claude` via `child_process.spawn`; collect stdout; write `evals/snapshots/results.json`. Node ≥18 (`fs.promises`, `child_process` natively).
- `scripts/eval-measure.js` — port of `measure.py`. Read snapshot; count tokens via `gpt-tokenizer`; emit markdown table to stdout. Node ≥18.

Sibling tests per CLAUDE.md SCAFFOLD WORK rule: `scripts/__tests__/eval-run.test.js`, `scripts/__tests__/eval-measure.test.js`. Mock `claude` CLI in tests via `child_process` stub.

## Gaps & risks for TASK-115

| # | Risk | Severity | Mitigation |
|---|:-----|:--------:|:-----------|
| R1 | Token-count parity (Node ↔ Python tiktoken) | **medium** | Pre-verification step (above); if `gpt-tokenizer` fails parity, fall back to `js-tiktoken` or `@dqbd/tiktoken` (WASM). |
| R2 | `claude -p` non-determinism — same prompt+system → different outputs across runs | medium | Snapshot fixes a single run for reproducibility (same as caveman). Document "snapshots are point-in-time" in `eval-run.js` header. |
| R3 | Test coverage for spawn'd `claude` CLI | low | Mock `child_process.spawn` in tests; integration smoke as `npm run eval:smoke`. |
| R4 | Windows space-in-PATH for `claude` CLI invocation | low | Use array-form spawn (`spawn("claude", [...])`) — no shell parsing; quotes handled by Node. |
| R5 | Snapshot file size growth | low | One snapshot per release; gitignore old snapshots if needed. |

## Decision feeding T3 (ADR-020)

**Adopt 3-arm pattern:** YES (already in spirit per Sprint 034 ADR-001; this research locks the port shape).

**Port plan ready:** YES. TASK-115 can now be promoted to a sprint with this research note as the design input.

**Implementation NOT in Sprint 041** — research only. TASK-115 lands in its own sprint.

## TASK-115 backlog annotation

Add link to this file when TASK-115 promoted:
> Implement `scripts/eval-run.js` + `scripts/eval-measure.js` per `docs/research/caveman-eval-harness-port-notes-2026-05-04.md`. Tokenizer = `gpt-tokenizer`. Snapshot schema matches caveman 1:1. Sibling tests required.

## Re-audit cadence

Re-fetch via gh CLI when juliusbrussee/caveman main SHA changes. Update SHA + adjust port plan if upstream eval-harness shape changes.
