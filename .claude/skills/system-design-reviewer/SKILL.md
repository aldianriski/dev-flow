---
name: system-design-reviewer
description: Use before building a new system, service, or major feature — or when reviewing an existing architecture for scalability, coupling, or correctness issues — at Gate 1 design approval or on demand.
user-invocable: true
context: fork
version: "1.0.0"
last-validated: "2026-04-21"
type: flexible
---

# System Design Reviewer

Review a proposed or existing system design for scalability, coupling, correctness, and architecture quality. Supports both greenfield design and brownfield audits.

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
## System Design Review — [system or feature name]

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

- CRITICAL findings block Gate 1 — the orchestrator must not proceed to Implement without addressing them.
- Do NOT propose implementation details — design review only.
- Do NOT return raw file contents.
- If no architecture document exists for a brownfield review → return `NEEDS_CONTEXT`.
