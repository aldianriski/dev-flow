---
name: dev-flow-compress
description: Use when compressing a CLAUDE.md or memory file to caveman-style prose for input token savings. Invoked as a dev-flow sub-command — /dev-flow:compress <target-file>.
user-invocable: false
argument-hint: "<target-file>"
version: "1.0.0"
last-validated: "2026-04-24"
context: inline
type: rigid
---

# dev-flow:compress

Compress a Markdown file in-place to caveman-style prose. Creates `<stem>.original.md` backup before overwriting.

## Invocation

```
/dev-flow:compress <target-file>
```

`<target-file>` — path to `.md` file to compress (e.g. `.claude/CLAUDE.md`, `memory/user_role.md`).

Execution procedure: `${CLAUDE_SKILL_DIR}/references/procedure.md`

## Pass-Through Rules

Lines matching any rule below are copied verbatim — never compressed.

| Rule | Pattern |
|:-----|:--------|
| Heading | Line starts with `#` |
| Fenced code block | Line is ` ``` ` delimiter, or is inside an open fence |
| URL | Line contains `http://` or `https://` |
| File path | Line contains `/` or `\` |
| Inline command | Line contains backtick span |
| Version string | Line contains `\d+\.\d+` |
| Frontmatter | Lines inside leading `---` YAML block |
| Blank line | Empty or whitespace-only |

## Compression Rules (prose lines only)

- Strip articles: `a`, `an`, `the` (word-boundary, trailing-space match)
- Strip filler adverbs: `just`, `really`, `basically`, `actually`, `simply`, `very`, `quite`, `rather`, `fairly`
- Collapse resulting double spaces to single
- No sentence restructuring — word removal only

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "This prose line is safe to compress" | If it contains path, version, or command — it must pass through |
| "Backup already exists — skip it" | Always overwrite backup before compressing; stale backup = corrupt reference |
| "Stripping this word changes nothing" | If unsure, widen pass-through rules — never compress ambiguous lines |

## Hard Rules

- Never compress a file that does not exist. Error and exit — no backup created.
- Always create backup BEFORE writing compressed content.
- Pass-through rules override compression — any match → verbatim copy.
- Never modify the backup after creation.
