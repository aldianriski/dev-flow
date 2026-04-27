---
owner: Tech Lead
last_updated: 2026-04-27
update_trigger: Layer added, dependency rule changed, or major refactor
status: current
---

# node-express-example — Architecture [CUSTOMIZE]

## Dependency Rule [CUSTOMIZE]
<!-- Outer layers depend on inner layers — never the reverse. -->
[Outer Layer] → [Middle Layer] → [Inner Layer]

<!-- Example (filled in): -->
Controller → Service → Repository → External

## Directory Structure [CUSTOMIZE]

```
/[source-root]/
  /[api]/           # [HTTP handlers, request validation]
  /[service]/       # [business logic — no I/O here]
  /[repository]/    # [data access, DB queries]
  /[model]/         # [domain entities, types]
```

## Key Integration Points [CUSTOMIZE]
<!-- External systems, APIs, or services this project integrates with. -->

| System | Purpose | Location in code |
|:-------|:--------|:-----------------|
| [System name] | [what it does] | `[path/to/integration]` |
| [System name] | [what it does] | `[path/to/integration]` |

## Architecture Decision Records
See [DECISIONS.md](docs/DECISIONS.md) for all ADRs.
