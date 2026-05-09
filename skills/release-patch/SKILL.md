---
name: release-patch
description: Use when releasing a patch on any project — auto-detects manifest (plugin / npm / python / cargo / go / flat), bumps PATCH version, prepends CHANGELOG entry, runs plugin-only metadata refresh if applicable, then HARD STOPS before push. Skips bump entirely if only docs/ changed. Never invokes `git push`; emits ready-to-push message and exits.
argument-hint: ""
allowed-tools: Read, Write, Edit, Bash(git diff *), Bash(git log *), Bash(git tag *), Glob, Grep
user-invocable: true
context: fork
type: rigid
version: "2.0.0"
last-validated: "2026-05-08"
---

# release-patch

Patch-release orchestrator. Auto-detects project type via manifest cascade. 8 ordered steps. Last step is hard human gate before push.

## When to invoke

- Sprint just closed; PATCH bump needed.
- Single bug-fix landed; reload needed before next session.
- Hotfix on master.

Do **not** invoke for MINOR (new mode/agent/skill) or MAJOR (gate/contract change) bumps — paired counterpart `release-manager` (`/release-manager minor|major|--from-sprint`) handles those per ADR-027 boundary; release-patch never handles MINOR even with auto-detect cascade.

## Mode detection cascade

| Detected file | Mode | Bump target |
|---|---|---|
| `.claude-plugin/plugin.json` | plugin | lockstep with `marketplace.json` |
| `package.json` | npm | `version` field |
| `pyproject.toml` | python | `[project]` or `[tool.poetry]` `version` |
| `Cargo.toml` | cargo | `[package] version` |
| `go.mod` | go | tag-based — prompts user for tag string |
| `VERSION` (flat file) | flat | overwrite with new semver |
| none of above | n/a | emit `[skip] no version manifest detected`, exit 0 |

Multiple manifests detected → priority: plugin > npm > python > cargo > go > flat. Detection + per-mode bump procedure: `${CLAUDE_SKILL_DIR}/references/version-detection.md`.

## Steps

1. **Diff scan**: `git diff --name-only HEAD~1 HEAD` (or `HEAD` if uncommitted). If every changed path matches `^docs/`, abort with `[skip] docs-only diff — no version bump`. Exit 0.
2. **Mode detect**: run cascade. Save mode + manifest path(s). If none → `[skip] no version manifest detected`. Exit 0.
3. **PATCH bump**: per mode. Plugin: lockstep verify + bump both files. Single-manifest modes (npm/python/cargo/flat): read-bump-write. Go: prompt for tag string. Procedure: see `references/version-detection.md`.
4. **CHANGELOG entry**:
   - Plugin → `docs/CHANGELOG.md` (existing schema).
   - General → detect `CHANGELOG.md` / `CHANGES.md` / `HISTORY.md` at repo root; default `CHANGELOG.md` if none. Prepend new block matching detected file's entry shape; if file empty / missing, use Keep-a-Changelog format default.
5. **MEMORY refresh** *(plugin mode only)*: if `TODO.md` Active Sprint is `— none —`, update MEMORY.md `dev-flow sprint state` entry. General modes skip.
6. **CONTEXT drift check** *(plugin mode only)*: diff `.claude/CONTEXT.md` Gates/Modes/Agent Roster against last tag. WARN if drift. General modes skip.
7. **Stale-doc auto-clear**: any doc with `last_updated:` frontmatter touched in diff → bump to today (`yyyy-MM-dd`).
8. **HARD STOP — push gate**: emit exact message:

```
=== READY TO PUSH ===
Mode: <plugin|npm|python|cargo|go|flat>
Version: <new>
Sprint: <number-or-none>
Run manually: git push origin master
=====================
```

Exit 0. **Skill never invokes `git push`.** Reviewer: `grep -r "git push" skills/release-patch/` returns zero hits in command position.

## Output format

```
=== RELEASE-PATCH ===
[mode]    <plugin | npm | python | cargo | go | flat>
[diff]    <N> files changed
[bump]    <manifest>: 2.3.0 → 2.3.1 (lockstep paths if plugin)
[changelog] entry prepended for v2.3.1
[memory]  <skipped non-plugin | refreshed Sprint 039>
[context] <skipped non-plugin | no drift | DRIFT WARN>
[stale]   <N> docs touched; last_updated bumped
[push]    HARD STOP — manual `git push origin master` required
======================
```

## Constraints

- Plugin lockstep: `plugin.json` + `marketplace.json` versions MUST stay equal — never bump one without the other.
- Skip-bump path is exit 0 (not an error); pure-docs commits are normal mid-sprint.
- CHANGELOG format follows detected file's existing entries verbatim per mode; never invent.
- Push gate is hard text-emit; exit immediately after.
- Mode detection runs every invocation; never hardcode mode.

## Red flags

❌ **Calling `git push` directly** — push is the human gate; skill must emit text only.
❌ **Bumping plugin.json without marketplace.json (or vice versa)** — Sprint 30 lockstep contract.
❌ **Skipping the diff check** — noisy version churn for docs-only commits.
❌ **MINOR/MAJOR bumps** — out of scope; governance-level decisions.
❌ **Auto-creating ADRs for the release** — packaging skill, not decision-recorder.
❌ **Mode-detection bypass** — never hardcode; always run cascade.

## Reference

- `references/version-detection.md` — manifest cascade + per-mode bump procedure
- `.claude-plugin/plugin.json` + `marketplace.json` — plugin mode lockstep targets
- Sprint 30 ADR / DECISIONS.md — plugin-install regression motivating lockstep contract
- ADR-027 (Sprint 049) — release-patch generalization decision
