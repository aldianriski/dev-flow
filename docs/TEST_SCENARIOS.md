---
owner: Tech Lead
last_updated: 2026-04-26
update_trigger: New test added, coverage gap closed, suite restructured
status: current
---

# Test Scenarios — dev-flow

## Infrastructure

| Tool | Purpose |
|:-----|:--------|
| Node.js built-in `node:test` + `node:assert/strict` | Unit tests for `bin/dev-flow-init.js` |
| Python `python -m py_compile` | Syntax validation for eval harness (`evals/measure.py`) |

## Coverage Map

### Unit Tests — `bin/__tests__/`

| File | Scenarios | Notes |
|:-----|:----------|:------|
| `dev-flow-init.test.js` | 30 cases | See breakdown below |

**`applySubstitutions`** — 8 cases
- Replaces `[Project Name]`
- Replaces CLAUDE.md role token
- Replaces TODO.md role token
- Replaces `YYYY-MM-DD` date token
- Replaces multi-line layer block and strips example lines
- Preserves `[CUSTOMIZE]` tokens untouched
- Passes through unknown placeholders
- Replaces multiple occurrences in one string

**`getStackPreset`** — 11 cases
- `node-express`: layers include `repository`; lint command is `npm run lint`
- `react-next`: layers include `hook`
- `python-fastapi`: lint is `ruff check .`; package manager is `pip`
- `go-gin`: lint is `go vet ./...`; typecheck is `go build ./...`
- All presets have all 4 required fields (`layers`, `lintCommand`, `typecheckCommand`, `packageManager`)
- `custom`: returns provided values; trims whitespace on layers; defaults to NOOP + npm when missing
- `unknown-stack`: returns null

**`renderSettingsLocal`** — 4 cases
- Writes `settings.local.json` with substituted lint + typecheck commands
- Substitutes `[package-manager]` in permissions allowlist
- Strips `_instructions` block from rendered output
- Preserves existing `settings.local.json` — writes `.new` file instead

**`isHookCommandSafe`** — 7 cases
- Accepts plain lint commands (`npm run lint`, `npx tsc --noEmit`, `go vet ./...`)
- Accepts `&&` and `||` chaining
- Rejects semicolon command separator
- Rejects newline injection
- Rejects backtick command substitution
- Rejects `$()` command substitution
- Rejects empty string, null, and undefined

## Gap Analysis

| Area | Gap | Priority |
|:-----|:----|:---------|
| `.claude/scripts/session-start.js` | No unit tests — bootstrap logic runs as side-effectful script | P1 |
| `.claude/scripts/validate-scaffold.js` | No unit tests — file structure checks untested in isolation | P1 |
| `.claude/scripts/read-guard.js` | No unit tests — PreToolUse hook logic untested | P1 |
| `.claude/scripts/track-change.js` | No unit tests | P2 |
| `.claude/scripts/regenerate-manifest.js` | No unit tests — MANIFEST.json generation untested | P2 |
| `evals/measure.py` | No automated test — eval correctness verified only by manual three-arm run | P2 |
| Scaffold CLI integration | No integration test covering full `dev-flow-init.js` interactive flow | P2 |
| `.claude/scripts/scaffold-checks.js` | Indirectly tested via session-start but no direct tests | P3 |

## Completion Roadmap

- [ ] **Refactor `session-start.js`** — extract pure functions for unit testing (settings check, line count, staleness scan)
- [ ] **Test `validate-scaffold.js`** — mock filesystem and assert expected pass/fail cases
- [ ] **Test `read-guard.js`** — verify block/allow logic for each tool category
- [ ] **Test `regenerate-manifest.js`** — assert MANIFEST.json output matches skills directory state
- [ ] **Integration test for scaffold CLI** — spawn `dev-flow-init.js` against a temp directory, assert output files
- [ ] **Eval harness regression tests** — assert `measure.py` metric computation against known fixtures
