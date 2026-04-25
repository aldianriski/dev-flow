---
name: release-manager
description: Use when managing semantic versioning, generating changelogs from git history or PR lists, or producing formatted release notes at the end of a sprint or before a deployment.
user-invocable: true
context: fork
version: "1.0.0"
last-validated: "2026-04-21"
type: rigid
---

# Release Manager

Produce semantic-versioned releases with CHANGELOG entries and formatted release notes.

## Versioning Rules (SemVer)

| Change type | Bump | Example trigger |
|:------------|:-----|:----------------|
| Breaking API change | MAJOR | Removed endpoint, incompatible schema change |
| New feature (backward-compatible) | MINOR | New endpoint, new optional field |
| Bug fix / patch | PATCH | Fix incorrect behavior, update dependency |

Pre-release suffixes: `-alpha.N`, `-beta.N`, `-rc.N`

## Invocation

```bash
/release-manager [version]       # Explicit version (e.g. 1.2.0)
/release-manager patch           # Auto-bump PATCH
/release-manager minor           # Auto-bump MINOR
/release-manager major           # Auto-bump MAJOR
/release-manager --from-sprint   # Detect bump from Active Sprint task types
```

## Steps

1. **Read current version** from `package.json`, `pyproject.toml`, `go.mod`, or `VERSION` file.
   If no version file found → ask user to specify before proceeding.
2. **Classify changes** from `git log` since last tag — label each commit MAJOR / MINOR / PATCH.
3. **Confirm bump** with user before writing anything.
4. **Generate CHANGELOG entry** (format below).
5. **Update version file** (e.g., `"version"` in `package.json`).
6. **Propose tag command** — do not run it: `git tag -a v[version] -m "Release v[version]"`

## CHANGELOG Entry Format

```markdown
## [version] — YYYY-MM-DD

### Breaking Changes
- [change] ([short SHA])

### Features
- [feature] ([short SHA])

### Fixes
- [fix] ([short SHA])

### Dependencies
- Updated [dep] from [old] to [new]
```

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "It's a small breaking change — a MINOR bump is fine" | Any breaking change is MAJOR. No exceptions. |
| "I'll update the CHANGELOG after the tag" | CHANGELOG must be written and confirmed before any tag command is proposed |
| "There's no version file yet — I'll infer a version" | Hard stop: ask the user to specify the version before writing anything |
| "The commit messages are vague — I'll summarize loosely" | Write only what the commits confirm; flag ambiguous commits explicitly rather than guessing intent |

## Hard Rules

- Never skip a MAJOR bump when a breaking change is present.
- Never write the CHANGELOG until the version is confirmed with the user.
- Do NOT run `git tag` — propose the command for the user to execute.
- Empty sections (e.g., no breaking changes) are omitted from the CHANGELOG entry.
