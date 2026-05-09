---
name: architecture-grill
description: Use when stress-testing a proposed or existing architecture via grill mode (one-question-at-a-time interview) — at Gate 1 design approval, before building a new service or major feature, or auditing for scalability/coupling/correctness issues. Distinct from design-analyst (auto-G2 plan) — this is ad-hoc human-driven grill. Do not use for code-level review or debugging; use pr-reviewer or diagnose instead.
user-invocable: true
context: fork
version: "2.0.0"
last-validated: "2026-05-08"
type: flexible
---

# architecture-grill

Stress-test architecture via grill mode + 5 review lenses. Greenfield or brownfield. Distinct from `design-analyst` (auto-G2 design plan agent) — this skill is the ad-hoc human-driven interview surface.

## Review Lenses

### 1. Architecture Correctness
- Dependency rule enforced? (no outer layer importing inner layer)
- Bounded contexts clearly separated?
- Anti-corruption layer where domains touch?

### 2. Scalability
- Horizontal scaling possible? (stateless services, externalized sessions)
- Database bottlenecks? (single write primary, missing read replicas)
- Synchronous where async would unblock throughput?

### 3. Coupling
- High fan-out modules? (depended on by >5 others → abstraction candidate)
- Circular dependencies?
- Framework types leaking into domain layer?

### 4. Operational Correctness
- Auth pattern appropriate for the threat model?
- Data retention and deletion paths defined?
- Observability hooks present (logs, metrics, traces)?

### 5. Resilience
- Single points of failure?
- Circuit breakers or retry budgets on external calls?
- Graceful degradation path defined?

## Output Format

```
## Architecture Grill — [system or feature name]

status: APPROVED | APPROVED_WITH_CONCERNS | NEEDS_REVISION | BLOCKED

### CRITICAL (blocks Gate 1 — must fix before implementation)
- [issue]: [component/file] — [required change]

### BLOCKING (should fix before Gate 1)
- [issue]: [component] — [fix]

### RECOMMENDATIONS (non-blocking)
- [suggestion]

### APPROVED PATTERNS
- [good design choice worth noting]

### NEXT STEPS
[What should happen before implementation begins — max 3 bullets]
```

## Grill Mode (when design is unclear)

When the proposed design is ambiguous or requirements underspecified — run this before reviewing:
- Ask **one question at a time**; offer a recommended answer based on codebase evidence
- Challenge terminology that conflicts with `CONTEXT.md` vocabulary
- As terms crystallize → note: "Add to CONTEXT.md: `[term]` = [definition]"
- Stop when design is unambiguous enough to apply all 5 Review Lenses

## Greenfield vs. Brownfield Mode

Procedure: `${CLAUDE_SKILL_DIR}/references/procedure.md`

## Red Flags

| Rationalization | Reality |
|:----------------|:--------|
| "The team will sort out the details during implementation" | Unresolved design questions at Gate 1 become blocking PRs and rework cycles in implementation |
| "We can add observability / auth / resilience after launch" | Operational correctness is a Gate 1 requirement — retrofitting these into a running system is expensive |
| "This is brownfield, I'll skip the architecture doc check" | Brownfield without an architecture doc → return `NEEDS_CONTEXT`. Do not review against an imagined design. |
| "There are no CRITICAL issues so I'll approve with minor concerns" | `APPROVED_WITH_CONCERNS` is the correct status for non-trivial concerns — do not use `APPROVED` to close a review faster |

## Hard Rules

- CRITICAL findings block Gate 1 — the dispatcher must not proceed to Implement without addressing them.
- Do NOT propose implementation details — design review only.
- Do NOT return raw file contents.
- If no architecture document exists for a brownfield review → return `NEEDS_CONTEXT`.
