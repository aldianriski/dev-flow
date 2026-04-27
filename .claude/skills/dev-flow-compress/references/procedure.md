# dev-flow:compress — Execution Procedure

1. Validate `<target-file>` exists. If not — stop with error, no backup created.
2. Run `python ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/compress.py --target <target-file>`.
3. Confirm backup at `<stem>.original.md` exists.
4. Report: original line count → compressed line count, pass-through line count.
