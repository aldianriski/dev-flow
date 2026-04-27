---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR version bump; hook contract changes; new script added
status: current
source: AI_WORKFLOW_BLUEPRINT.md §6 + §7 (split TASK-004); TASK-005 fix: read-guard.js
  corrected to use stdin JSON (env-var version was broken — see context/research/CC_SPEC.md);
  split from 06-harness.md (TASK-059)
---

## `.claude/settings.json` (git-tracked — applies to all team members)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/session-start.js",
            "description": "Bootstrap: verify settings.local, CLAUDE.md size, skill staleness, doc line counts, pending migrations, active sprint"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/ci-status.js",
            "description": "Poll CI status after push — block Session Close if pipeline is non-green"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/track-change.js",
            "description": "Append written file path to .claude/.session-changes.txt for scope guard and context tracking"
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/track-change.js",
            "description": "Append edited file path to .claude/.session-changes.txt for scope guard and context tracking"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read|Grep|Glob",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/read-guard.js",
            "description": "Block orchestrator source-file Reads during compact-vulnerable phases (§1 Thin-Coordinator Rule)"
          }
        ]
      },
      {
        "matcher": "Bash(git commit*)",
        "hooks": [
          {
            "type": "command",
            "command": "[your-lint-command]",
            "description": "Lint check before commit"
          }
        ]
      },
      {
        "matcher": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "[your-typecheck-command]",
            "description": "Type check before push"
          }
        ]
      }
    ]
  }
}
```

> **`${CLAUDE_PLUGIN_ROOT}`**: resolves to the plugin root at runtime. Use this in all hook commands
> for portable paths. See `context/research/CC_SPEC.md` for the verified variable list.

## `.claude/settings.local.json` (gitignored — per machine)

```json
{
  "permissions": {
    "allow": [
      "Bash([package-manager] *)",
      "Bash(git add *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git stash *)"
    ]
  }
}
```

**[CUSTOMIZE]** Replace `[package-manager]` with `pnpm`, `npm`, `yarn`, `pip`, `go`, etc.

Add `.claude/settings.local.json` to `.gitignore`.
