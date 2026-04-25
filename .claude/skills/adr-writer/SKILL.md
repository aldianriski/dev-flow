---
name: adr-writer
description: Use when a significant technical decision has been made or is being debated — choosing between frameworks, adopting a new pattern, reversing a previous decision, or making an architectural trade-off that future contributors need to understand.
user-invocable: true
argument-hint: "[decision title or description]"
version: "1.0.0"
last-validated: "2026-04-21"
context: inline
type: rigid
---

# ADR Writer

Write an Architecture Decision Record (ADR) entry and append it to `docs/DECISIONS.md`.

## When to invoke

- A technology, framework, or library choice is made
- A pattern is adopted or rejected
- A previous decision is reversed or superseded
- An architectural trade-off future contributors need to understand

## ADR Format

```markdown
## ADR-NNN: [Title]

**Status**: proposed | decided | deprecated | superseded-by ADR-NNN
**Date**: YYYY-MM-DD
**Deciders**: [role names — not personal names]

### Context
[Why is this decision needed? What problem does it solve? What constraints are in play?]

### Decision
[What was decided? State it clearly and without hedging.]

### Consequences

**Positive**:
- [benefit]

**Negative** (trade-offs accepted):
- [cost or risk accepted]

**Neutral**:
- [side-effect that is neither positive nor negative]

### Alternatives considered
| Option | Reason rejected |
|:-------|:----------------|
| [alternative] | [why not chosen] |
```

## Steps

1. Ask the user: "What decision should I record? Describe the context, what was chosen, and what alternatives were rejected."
2. Determine the next ADR number by reading `docs/DECISIONS.md` (or create the file with ownership header if missing).
3. Write the ADR using the format above.
4. Append to `docs/DECISIONS.md` — do NOT regenerate the file from scratch.
5. Update `docs/DECISIONS.md` ownership header: set `last_updated` to today.

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "This decision is obvious — no ADR needed" | Obvious-to-you decisions are exactly the ones future contributors reverse without context |
| "I'll write the ADR after we've committed to the direction" | Decisions recorded after commitment lose the rejected alternatives — write while the tradeoffs are live |
| "The code documents the decision" | Code shows what was chosen, not why it was chosen or what was rejected |
| "Just add one line — it doesn't need a full ADR" | If it has a context, a decision, and consequences, it needs an ADR — length is irrelevant |

## Hard Rules

- Never invent a decision — only record what the user has explicitly confirmed.
- Status must be exactly one of: `proposed`, `decided`, `deprecated`, `superseded-by ADR-NNN`.
- Context explains WHY — never HOW. Code comments explain HOW.
- Consequences must have at least one Negative entry — no decision is cost-free.
- `docs/DECISIONS.md` is append-only — never edit past ADRs, only mark them deprecated or superseded.
- If `docs/DECISIONS.md` does not exist, create it with the ownership header first, then append the ADR.
