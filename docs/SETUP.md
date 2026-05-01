---
owner: Tech Lead
last_updated: 2026-04-26
update_trigger: Prerequisites change; harness script added or renamed; adopt workflow changes
status: current
---

# Setup — dev-flow

## Prerequisites

| Tool | Minimum Version | Check |
|:-----|:----------------|:------|
| Node.js | 18 | `node --version` |
| Python | 3.10 | `python --version` |
| Git | any | `git --version` |
| Claude Code CLI | latest | `claude --version` |

## Adopt dev-flow into Your Project

```bash
git clone https://github.com/aldian/dev-flow
node dev-flow/bin/dev-flow-init.js
```

Prompts: target directory · project name · owner role · stack. Copies `.claude/`, `docs/blueprint/`,
and template files into the target.

Stacks: `node-express` · `react-next` · `python-fastapi` · `go-gin` · `custom`

After init: fill `[CUSTOMIZE]` blocks in `.claude/CLAUDE.md`, then run `/orchestrator init`.

Fallback (no Node): `cp -r dev-flow/.claude your-project/` — see `docs/blueprint/09-customization.md §12`.

## Develop on This Repo

No install step — zero external npm deps.

```bash
git clone <this-repo>
cd dev-flow
cp .claude/settings.local.example.json .claude/settings.local.json
# Edit settings.local.json: add allowed tool paths for your machine
```

## Verification

```bash
node .claude/scripts/session-start.js       # bootstrap: settings + CLAUDE.md + skill staleness
node .claude/scripts/validate-scaffold.js   # scaffold file structure integrity
node bin/__tests__/dev-flow-init.test.js    # CLI unit tests (Node built-in runner)
python -m py_compile evals/measure.py       # eval harness syntax check
```

Expected: zero errors from session-start and validate-scaffold; all tests pass.

## Useful Commands

```bash
# Harness validation
node .claude/scripts/session-start.js           # full session bootstrap report
node .claude/scripts/validate-scaffold.js       # scaffold integrity check
node .claude/scripts/validate-blueprint.js      # blueprint doc structure check
node .claude/scripts/audit-skill-staleness.js   # flag stale skills
node .claude/scripts/regenerate-manifest.js     # rebuild MANIFEST.json from skills/

# Scaffold CLI
node bin/dev-flow-init.js                       # interactive adopt-into-project wizard
node bin/__tests__/dev-flow-init.test.js        # unit tests

# Eval harness
python evals/measure.py                         # run skill eval (three-arm methodology)
python -m py_compile evals/measure.py           # syntax-only check
```

## Common Issues

**`settings.local.json not found`** — copy from `.claude/settings.local.example.json`; this file
is gitignored per machine.

**`CLAUDE.md over budget`** — CLAUDE.md must stay ≤200 lines. Run `/dev-flow-compress` to condense.

**Test runner exits with no output** — Node built-in test runner requires Node ≥18.
Confirm with `node --version`.

**Python not found on Windows** — use `python` not `python3` in Git Bash on Windows.

**Hook fires but script path wrong** — check `settings.json` hook commands contain absolute or
repo-relative paths that resolve on your machine.
