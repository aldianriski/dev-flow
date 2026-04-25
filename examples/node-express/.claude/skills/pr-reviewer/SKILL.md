---
name: pr-reviewer
description: Use when a pull request or changed file set is ready for structured review — or when Phase 6 of the dev-flow gate is reached. Invoked automatically by the code-reviewer agent at Phase 6.
user-invocable: true
context: fork
agent: code-reviewer
version: "1.0.0"
last-validated: "2026-04-21"
type: rigid
---

# PR Reviewer

Perform a structured 7-lens code review on a diff or set of changed files. Loaded by the code-reviewer agent at Phase 6, or invoked directly by the user.

## 7-Lens Review Checklist

### Lens 1 — Spec Compliance [S1]
- All acceptance criteria from the task met?
- All Gate 1 micro-tasks implemented?
- Unexpected files changed that were not in scope?

### Lens 2 — Architecture [S2]
- Dependency rule from CLAUDE.md respected? (no outer layer in inner layer imports)
- New module placed in the correct architectural layer?
- No framework types leaking into domain layer?

### Lens 3 — SOLID [S2]
- SRP: each class/function has one reason to change?
- OCP: extended via abstraction, not modified?
- LSP: subtypes are substitutable for base types?
- ISP: interfaces are focused, not fat?
- DIP: depends on abstractions, not concretions?

### Lens 4 — DDD [S2]
- Domain logic in domain layer (not controllers, not repositories)?
- Aggregates protect their invariants?
- Domain events named in past tense?

### Lens 5 — Security [S2]
- No hardcoded secrets or credentials?
- User input validated before use?
- Authorization checks present on all mutating operations?

### Lens 6 — Tests [S2]
- Happy path covered?
- Key edge cases and error paths tested?
- No test-only scaffolding in production files?

### Lens 7 — Documentation [S2]
- ADR needed for any architectural decision? (flag for /adr-writer if yes)
- Non-obvious logic has a brief inline comment explaining WHY?
- Ownership headers updated on any docs touched?

## Output Format

```
## PR Review — [TASK-NNN | PR#]: [Title]

status: DONE | DONE_WITH_CONCERNS | BLOCKED

### CRITICAL [S1|S2] (no truncation — show all)
- [Lens N]: [file:line] — [fix required]

### BLOCKING [S1|S2] (max 5)
- [Lens N]: [file:line] — [fix]

### NON-BLOCKING [S2]
- [Lens N]: [brief note]

### APPROVED PATTERNS
- [good choice worth noting]

### RECOMMENDATION
[One clear next step — max 2 sentences]
```

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "It's a tiny change — full 7-lens is overkill" | Small changes introduce security vulnerabilities and break APIs — there is no small PR |
| "I'll downgrade this to NON-BLOCKING to keep the review moving" | Downgrading a CRITICAL finding is a gate bypass — every CRITICAL must block merge |
| "I already reviewed this informally" | Systematic lens-by-lens review is non-negotiable — ad-hoc review misses cross-cutting issues |
| "Lens 1 only has minor gaps — I'll flag and continue" | Any Lens 1 (spec compliance) failure → `BLOCKED`. Do not proceed to S2 lenses. |

## Finding Severity Examples

**Correct — CRITICAL (exact location, exact fix required):**
> [Lens 5]: auth/jwt.js:31 — `alg: none` accepted by verifier; any unsigned token passes auth. Fix: add explicit algorithm allowlist to verifier options.

**Incorrect — downgraded to avoid friction:**
> [Lens 5]: auth/jwt.js:31 — JWT algorithm handling could be tightened (NON-BLOCKING)

**Correct — NON-BLOCKING (observation, no merge block):**
> [Lens 7]: README.md — Ownership header `last_updated` not updated after today's changes.

## Hard Rules

- Stage 1 (Lens 1) failure → status `BLOCKED`. Do not proceed to S2 lenses.
- Do NOT return raw file contents — line references and brief excerpts only.
- CRITICAL findings are never truncated — spill into follow-up response if needed.
- Return token budget: ≤250 tokens.
- If ADR is recommended → list it as NON-BLOCKING with: "Flag for /adr-writer: [topic]"
