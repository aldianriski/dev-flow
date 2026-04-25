---
owner: Tech Lead
last_updated: 2026-04-25
update_trigger: New architectural decision made
status: current
---

# node-express-example — Decision Log

<!-- Append new ADRs below. Never edit past entries. Status field may be updated only. -->

---

## ADR-001: [Decision Title] [CUSTOMIZE]

- **Date**: 2026-04-25
- **Status**: Accepted
- **Context**: [What situation forced this decision? What constraints existed?]
- **Decision**: [What was decided? One clear statement.]
- **Consequences**: [What changes as a result? What becomes easier or harder?]

---

<!-- Example (filled in) — replace with your first real ADR: -->

## ADR-001: Use PostgreSQL over MongoDB

- **Date**: 2026-01-15
- **Status**: Accepted
- **Context**: Data model has clear relational structure with strong consistency requirements. Team has existing PostgreSQL expertise. Document-store flexibility is not needed.
- **Decision**: Use PostgreSQL as the primary database for all persistent storage.
- **Consequences**: ACID guarantees and rich query support. Schema migrations required for all structural changes. No schemaless flexibility.
