---
name: zoom-out
description: Use when entering an unfamiliar area of the codebase or before a cross-cutting change. Produces a bird's-eye module map using CONTEXT.md vocabulary. Read-only. No implementation suggestions. Do not use when you need an implementation plan; use orchestrator instead.
user-invocable: true
argument-hint: "[area | feature | module name]"
version: "1.0.0"
last-validated: "2026-05-01"
type: flexible
---

# Zoom Out

Bird's-eye architectural view before diving into unfamiliar code. Read CONTEXT.md vocabulary before mapping.

---

## Output

```
## Zoom Out — [area / feature]

MODULES:
- [module name] — [single responsibility] — [key files]
- ...

CONNECTIONS:
- [A] → [B]: [what flows between them]
- ...

ENTRY POINTS:
- [file:line] — [what triggers this flow]

SEAMS (safe change boundaries):
- [boundary] — [why it's safe to change in isolation]

LOAD THIS NEXT:
- [file] — [why it's the most informative starting point]
```

---

## Rules

- Use exact vocabulary from `CONTEXT.md` — no invented terms
- No implementation suggestions — orientation only
- If module map is unclear → name the ambiguity explicitly; do not guess
- ≤10 modules per map; if more exist → ask user to narrow the area first

---

## Red Flags

❌ **Inventing domain terms** — always defer to CONTEXT.md vocabulary; inconsistent naming causes agent drift
❌ **Suggesting implementation** — zoom-out is orientation only; use orchestrator for implementation
