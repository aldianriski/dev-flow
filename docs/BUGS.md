---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-24
update_trigger: New bug found or bug resolved
status: current
---

# dev-flow — Known Bugs

Active bugs blocking scaffold adoption. Resolved entries move to docs/CHANGELOG.md.

---

## BUG-001: `${CLAUDE_PLUGIN_ROOT}` fails in project-local settings.json hooks

**Status**: open — tracked in TASK-041
**Severity**: P0 — blocks SessionStart hook on first session
**Symptom**:
```
SessionStart:startup hook error
Failed to run: Hook command references ${CLAUDE_PLUGIN_ROOT} but the hook is not
associated with a plugin. This variable is only available in hooks defined in a
plugin's hooks/hooks.json file, not in project-local settings.json.
```
**Root cause**: `settings.json` hooks use `node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/session-start.js`. `${CLAUDE_PLUGIN_ROOT}` only resolves inside a Claude Code plugin context (`hooks/hooks.json`). Project-local hooks must use a path resolvable from the workspace root.
**Fix target**: replace `${CLAUDE_PLUGIN_ROOT}` with correct workspace-relative path syntax — verify against `context/research/CC_SPEC.md` before changing.

---

## BUG-002: Harness node scripts not in `allowedTools` — permission prompt on every hook fire

**Status**: open — tracked in TASK-043
**Severity**: P0 — blocks automated harness flow
**Symptom**: Claude prompts user to approve `node .claude/scripts/session-start.js` (and other hook scripts) on each SessionStart and PostToolUse event.
**Root cause**: `settings.json` has no `allowedTools` entry for `Bash(node .claude/scripts/*)`. Without it, every hook invocation triggers a permission prompt.
**Fix target**: add `allowedTools` entries for all harness node script patterns in `settings.json`.
