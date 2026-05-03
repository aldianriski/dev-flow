---
name: codemap-refresh
description: Use when refreshing the codemap base knowledge — module map, hub list, dep graph, and L2 handoff envelope. Regenerates docs/codemap/CODEMAP.md and docs/codemap/handoff.json by scanning all markdown files in the repo. Pure regex file walk, no LLM cost. Auto-fires via PostToolUse hook on every git commit; manual trigger is for first-time setup or when the auto-hook is suspected stale.
argument-hint: ""
allowed-tools: Bash, Read
user-invocable: true
context: fork
type: rigid
version: "1.0.0"
last-validated: "2026-05-03"
---

# codemap-refresh

Manual trigger to regenerate `docs/codemap/CODEMAP.md` + `docs/codemap/handoff.json` (TASK-098 / Sprint 039).

The PostToolUse hook on `Bash(git commit*)` fires `scripts/codemap-refresh.ps1` automatically — this skill is the manual escape hatch.

## When to invoke manually

- First-time setup after cloning a fresh dev-flow repo (no `.claude/.lean-doc-cache.json` warm-up).
- Suspect the post-commit hook silently failed (e.g. `last_built` timestamp in `handoff.json` is older than the latest commit).
- Adding a new top-level module dir — script auto-detects but you may want to refresh before committing the new dir.
- Want to read the codemap before any commit lands.

## Steps

1. Run `powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/codemap-refresh.ps1"` from repo root.
2. Read `docs/codemap/CODEMAP.md` to verify Hubs/Deps/Modules sections regenerated.
3. Read `docs/codemap/handoff.json` `last_built` timestamp — must be within last few seconds.
4. Report summary: nodes, edges, modules, elapsed ms.

## What it produces

| Artifact | Content |
|---|---|
| `docs/codemap/CODEMAP.md` | Auto-generated L1 view: Hubs (top-N markdown-link targets), Deps (most-referenced paths), Modules (top-level dirs + one-liners), L0-overflow (canonical module one-liner list) |
| `docs/codemap/handoff.json` | L2 envelope `{nodes, edges, metadata, last_built}` for downstream consumers (TASK-100 `/prime` skill reads this) |

## Constraints

- PowerShell-only (no Node — Windows space-path lesson, ADR-016).
- ASCII-only output (em-dashes break PS 5.1 parser when file is UTF-8 no BOM).
- `<5s` cold-run on a clean repo. If a commit-time refresh exceeds this, dial back the scan scope (currently every `*.md` file).
- "AST scan" is loose — V1 only captures explicit `[text](path)` markdown links. No real parser, no tree-sitter, no ast-grep.
- No LLM call anywhere in the pipeline. Pure regex + file walk.

## Red flags

❌ **Hand-editing `docs/codemap/CODEMAP.md`** — every commit overwrites it. Write content elsewhere (CLAUDE.md, ARCHITECTURE.md, ADR) and link to the file from there.
❌ **Adding new top-level module without updating `$moduleOneLiners` in `scripts/codemap-refresh.ps1`** — module appears in CODEMAP.md as `(no description)` until the script learns about it.
❌ **Skipping the manual run after editing `codemap-refresh.ps1`** — verify the script still completes <5s before committing; PostToolUse hook failure is silent (warn-only, exit 0).
❌ **Calling Node from the PS hook** — ADR-016 forbids this; Windows space-path causes `loader:1368`.

## Reference

- `scripts/codemap-refresh.ps1` — implementation (regex pipeline + JSON writer + Markdown writer)
- `hooks/hooks.json` `PostToolUse` matcher `Bash(git commit*)` — auto-trigger config
- `docs/_routing.json` `L0_overflow` — CLAUDE.md spill rule consumed by this skill's output
- `docs/sprint/SPRINT-039-codemap-modes-skills.md` T1 acceptance — full criteria for TASK-098
