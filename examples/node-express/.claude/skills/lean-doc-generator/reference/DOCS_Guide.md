---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-21
update_trigger: Lean doc standard changes; new doc type added; line limit adjusted; HOW filter rule refined
status: current
---

# Lean Documentation Standard — Reference Guide

## Core Principle

Every line of documentation must answer exactly one of these questions:
- **WHY** was this decision made? → `docs/DECISIONS.md`
- **WHERE** does this live / what is this project? → `docs/ARCHITECTURE.md` or `README.md`

All other content belongs in code comments, not documentation files.

---

## HOW Filter

Before writing any line, apply this test:

> "Does this line explain HOW the code works?"

| Answers | Action |
|:--------|:-------|
| HOW something works | Delete it. Put it in a code comment adjacent to the code. |
| WHY a decision was made | → `docs/DECISIONS.md` (ADR entry via `/adr-writer`) |
| WHERE things live / what something is | → `docs/ARCHITECTURE.md` or `README.md` |

### Examples

| Keep in docs | Move to code comment |
|:-------------|:---------------------|
| "We use Redis for sessions because the auth service must be stateless (ADR-007)." | `// Redis session store — ADR-007` |
| "Payments module is isolated because it has separate compliance requirements (ADR-012)." | `// Stripe client — single instance, see ADR-012` |
| "Clean Architecture enforces domain independence from framework." | `// Domain service — no framework imports allowed here` |

---

## Doc File Reference

### `README.md` — 50 line limit
- Project name + one-line description
- What it is / what it is not (no HOW)
- How to adopt: commands only, no explanations
- Links to `docs/ARCHITECTURE.md` for structure, `docs/SETUP.md` for running
- License line

### `docs/ARCHITECTURE.md` — 150 line limit
- Layer diagram (ASCII or Mermaid) — dependency rule visible at top
- Directory structure: one-line purpose per directory
- Dependency rule: which layer may import which (explicit and unambiguous)
- Key integration points: external services, event buses, caches (names and roles, not HOW)
- No implementation details

### `docs/DECISIONS.md` — unlimited
- ADR entries only — authored via `/adr-writer`
- Append-only: never edit past ADRs, only mark `deprecated` or `superseded-by ADR-NNN`
- Status: `proposed | decided | deprecated | superseded-by ADR-NNN`

### `docs/SETUP.md` — 100 line limit
- Prerequisites with minimum + tested versions
- Install command (one line)
- Run command (one line per environment)
- Test command
- Environment variable names (never values)
- No prose explanations — commands and prerequisites only

### `docs/AI_CONTEXT.md` — 100 line limit
- Stack: framework + runtime + versions
- Architecture classification (Clean Architecture, Hexagonal, etc.)
- Dependency rule (for Claude to enforce during implementation)
- Patterns in use (for Claude to reuse — names and brief purpose)
- Anti-patterns to avoid (for Claude to catch — names and brief reason)
- Performance baselines (optional — see blueprint §20)

### `docs/CHANGELOG.md` — unlimited
- Sprint history, newest first
- Format per row: `File | Change | ADR`
- Append-only — never edit past sprint blocks

---

## Ownership Header

Every doc file requires this header (before the title):

```yaml
---
owner: [role — e.g. Tech Lead, Backend Team, not a personal name]
last_updated: YYYY-MM-DD
update_trigger: [specific event that requires updating this file]
status: current | stale | deprecated
---
```

**`update_trigger` specificity rule**: must be specific enough to act as a checklist.

| Anti-pattern | Pattern |
|:-------------|:--------|
| `"When things change"` | `"New endpoint added; auth strategy changes"` |
| `"As needed"` | `"Sprint completed; new mode or agent added"` |

Update `last_updated` every time you touch a file, even for minor changes.

---

## Line Count Enforcement

When a file is at or near its limit and new content is needed:

1. Apply HOW filter — remove HOW content first (often frees 20-40%)
2. Compress existing prose into tight bullet points
3. Move non-WHY/WHERE content to code comments
4. If still over limit → extract heavy reference content to a linked sub-document

Never raise the line limit. The constraint enforces discipline and prevents doc rot.

---

## Lean Doc Checklist (run before committing any doc)

- [ ] Every line passes the HOW filter
- [ ] File is within its line limit
- [ ] Ownership header is present and `last_updated` is today
- [ ] `update_trigger` is specific (not "as needed")
- [ ] `docs/DECISIONS.md` is append-only (no past ADR was edited)
- [ ] All commands in `docs/SETUP.md` are runnable as-is
