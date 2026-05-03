---
name: release-patch
description: Use when closing a sprint or releasing a patch — bumps PATCH version on plugin.json + marketplace.json in lockstep, prepends CHANGELOG entry, refreshes MEMORY sprint state, warns on CONTEXT drift, auto-bumps stale-doc last_updated, then HARD STOPS before push. Skips bump entirely if only docs/ changed. Never invokes `git push`; emits ready-to-push message and exits.
argument-hint: ""
allowed-tools: Read, Write, Edit, Bash(git diff *), Bash(git log *), Bash(git tag *), Grep
user-invocable: true
context: fork
type: rigid
version: "1.0.0"
last-validated: "2026-05-03"
---

# release-patch

Patch-release orchestrator. 7 ordered steps. Last step is a hard human gate before push.

## When to invoke

- Sprint just closed and you want a clean PATCH bump for plugin reload.
- Single bug-fix landed and reload needed before next session.
- After a hotfix on master.

Do **not** invoke for MINOR (new mode/agent/skill) or MAJOR (gate/contract change) bumps — separate skill or manual procedure.

## Steps

1. **Diff scan**: `git diff --name-only HEAD~1 HEAD` (or `HEAD` if uncommitted). If every changed path matches `^docs/`, abort with `[skip] docs-only diff — no version bump`. Exit 0.
2. **PATCH bump (lockstep)**: read `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json`. Verify both `version` fields equal. Increment patch (e.g. `2.3.0 → 2.3.1`). Write both back. Abort if versions diverge — manual reconcile required.
3. **CHANGELOG entry**: parse `TODO.md` frontmatter `sprint:` and Changelog section. Prepend new block to `docs/CHANGELOG.md` with new version, date, sprint number, closed task list. Format matches existing entries.
4. **MEMORY refresh**: if `TODO.md` Active Sprint is `— none —` (sprint just closed), update MEMORY.md `dev-flow sprint state` entry: bump as-of date, list closed tasks + commit shas, queue-up next sprint preview. Skip if sprint still active.
5. **CONTEXT drift check**: diff `CONTEXT.md` Gates/Modes/Agent Roster tables against last tagged version (`git diff $(git describe --tags --abbrev=0)..HEAD .claude/CONTEXT.md`). If those tables changed but CONTEXT.md not in this diff at all, emit `[WARN] CONTEXT.md may be stale — gates/modes/agents changed since last release`. Continue.
6. **Stale-doc auto-clear**: for every doc with `last_updated:` frontmatter touched in `git diff --name-only HEAD~1 HEAD`, update its `last_updated` field to today's date (`yyyy-MM-dd`). Skip docs not touched.
7. **HARD STOP — push gate**: emit exact message:

```
=== READY TO PUSH ===
Version: <new>
Sprint: <number-or-none>
Run manually: git push origin master
=====================
```

Exit 0. **The skill never invokes `git push`.** Reviewer must `grep -r "git push" skills/release-patch/` and find zero hits in command position (only the acceptance prose mentions it).

## Output format

```
=== RELEASE-PATCH ===
[diff]    <N> files changed
[bump]    plugin.json + marketplace.json: 2.3.0 → 2.3.1
[changelog] entry prepended for v2.3.1 (Sprint 039, 4 tasks)
[memory]  sprint state refreshed (Sprint 039 closed)
[context] no drift detected
[stale]   3 docs touched; last_updated bumped
[push]    HARD STOP — manual `git push origin master` required
======================
```

## Constraints

- `plugin.json` + `marketplace.json` versions MUST stay equal. Lockstep is the contract — never bump one without the other.
- Skip-bump path is exit 0 (not an error). Pure-docs commits are normal mid-sprint.
- CHANGELOG format follows existing entries verbatim — pull schema from latest entry, do not invent.
- MEMORY.md path is harness-defined; resolve via `$env:USERPROFILE\.claude\projects\...` pattern. Skip with warn if unreadable.
- Push gate is a hard text-emit — exit immediately after; no follow-up steps.

## Red flags

❌ **Calling `git push` directly** — push is the human gate; skill must emit text only.
❌ **Bumping plugin.json without marketplace.json (or vice versa)** — versions diverge → plugin install regression (Sprint 30 incident, see DECISIONS.md).
❌ **Skipping the diff check** — committing a PATCH bump for a docs-only change creates noisy version churn.
❌ **Auto-creating ADRs for the release** — release-patch is a packaging skill, not a decision-recorder. Use `/adr-writer` separately if a release captures a hard-to-reverse decision.
❌ **MINOR/MAJOR bumps** — out of scope; semver decisions are governance-level, not packaging-level.

## Reference

- `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` — version sync targets
- `docs/CHANGELOG.md` — append target; format reference from latest entry
- MEMORY.md (`dev-flow sprint state`) — refresh target on sprint close
- Sprint 30 ADR / DECISIONS.md — plugin-install regression history (motivates lockstep contract)
- Sprint 039 PRD T4 acceptance — full criteria for TASK-103
