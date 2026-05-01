---
name: lean-doc-generator
description: Use when creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI context files. Also use for sprint lifecycle (start/promote/close). Follows LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW.
argument-hint: "[init | type subject | sprint-command]"
allowed-tools: Read, Write, Bash(git *), Glob, Grep
user-invocable: true
context: fork
type: rigid
version: "2.0.0"
last-validated: "2026-05-01"
---

# Lean Documentation Generator

Generate high-signal technical documentation. Read `reference/DOCS_Guide.md` before writing anything.

## Golden Rule

> Never generate documentation that explains HOW something works.

| Explains… | Goes in… |
|---|---|
| HOW it works | code (comments, types, tests) |
| WHY decided | `DECISIONS.md` |
| WHERE things live | `ARCHITECTURE.md` or `README.md` |
| Unsure | code |

---

## Invocation Modes

| Mode | Command | Behavior |
|---|---|---|
| Session update | `/lean-doc-generator` | Update all docs touched this session |
| Init scaffold | `/lean-doc-generator init` | Full flow incl. outline approval |
| Single doc | `/lean-doc-generator [type] [subject]` | One file created or updated |

---

## Execution Flow

**Step 0 — Staleness scan**: check ownership headers; flag `stale` / `needs-review` / no-header before proceeding.

**Step 1 — Load standard**: read `reference/DOCS_Guide.md` — 4 Laws, Core Files, line limits, anti-patterns, checklist.

**Step 2 — Codebase access**: read manifests only (`package.json`, `pyproject.toml`, `Dockerfile`, `go.mod`) + existing docs. If inaccessible → ask user to paste file tree + manifest + system description.

**Step 3 — HOW filter**: discard anything that explains implementation; keep WHY/WHERE only.

**Step 4 — Outline approval** *(init only)*: present Tier 1/2/3 options from `reference/DOCS_Guide.md §9`; wait for human choice before writing.

**Step 5 — Stack clarification** *(init only)*: ask in one message — package manager, dev infra, deferred services, frontend stack, data layer split.

**Step 6 — Generate**: write approved docs; enforce all line limits from `reference/DOCS_Guide.md`; include ownership header on every file.

**Step 7 — Session close**: list docs delivered + ownership headers to verify + recommended updates.

---

## Sprint Lifecycle

Full protocols in `reference/SPRINT_PROTOCOLS.md`.

| User says… | Protocol |
|---|---|
| "start sprint" / "promote backlog" | Sprint Promote |
| AI executing work during active sprint | Sprint Execute |
| "close sprint" / "sprint done" | Sprint Close |

Commit strategy: `sprint(NNN): plan locked` at promote · `sprint(NNN): <summary>` squash at close.

---

## Red Flags

❌ **HOW in a doc** — redirect to code comment; never raise line limit to fit HOW
❌ **No ownership header** — every doc touched gets updated header before leaving it
❌ **Person as owner** ("Alice") — reassign to role
❌ **Stale doc as source** — run Step 0 first; flag before using as source
❌ **New file outside core set** — redirect to code comments or fit in existing Core File

---

## Reference

- `reference/DOCS_Guide.md` — full standard: Core Files, line limits, templates, anti-patterns, pre-delivery checklist
- `reference/SPRINT_PROTOCOLS.md` — sprint promote/execute/close protocols
- `reference/VALIDATED_PATTERNS.md` — confirmed session corrections
