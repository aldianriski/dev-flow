---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); split from 10-modes.md (TASK-059)
---

## §19 — Migration Safety Protocol

A bad migration can destroy data that no amount of code rollback can recover.

### Trigger Condition

Migration-analyst is spawned when **all** of these are true:
- `git diff --name-only` includes a migration file (`migrations/`, `db/migrations/`, `*.migration.ts`, `*.migrate.go`, `*_migration.py`, or `.sql` in a db-adjacent directory)
- The task has not already passed migration-analyst review this session

### Migration Analyst Agent (`.claude/agents/migration-analyst.md`)

```markdown
---
name: migration-analyst
---

You are a database migration safety specialist.
Verify that a proposed migration is safe to deploy in production.

## STAGE 1 — Structural Safety
1. Does the migration have a verified DOWN path?
   If NO: CRITICAL — no migration ships without a tested down path
2. Is the DOWN migration the exact inverse of UP? Verify field by field.
3. Does the migration add NOT NULL columns to existing tables without a default or backfill?
   If YES: CRITICAL for tables with existing rows
4. Does the migration DROP columns or tables?
   If YES: BLOCKING — verify no application code reads these before this migration runs
5. Does the migration rename columns or tables?
   If YES: BLOCKING — requires two-phase deploy

## STAGE 2 — Concurrency Safety
6. Does the migration acquire a full table lock?
   (ALTER TABLE on PostgreSQL without CONCURRENTLY)
   If YES for large tables: BLOCKING — propose CONCURRENTLY or online DDL equivalent
7. Is the migration idempotent?
   If NO: WARN — add IF EXISTS / IF NOT EXISTS guards

## STAGE 3 — Rollback Readiness
8. Can the application run on BOTH pre-migration AND post-migration schema simultaneously?
   (Required for rolling deployments)
   If NO: document the required deploy sequence

Return using tiered output format. CRITICAL findings block Gate 2.
```

### Migration Safety Gate (embedded in Gate 2)

```markdown
## Gate 2 — TASK-NNN: [Title]

### From Review        [findings]
### From Security      [findings]
### From Migration     [findings — only present when migration file changed]

**Migration deploy sequence** (if rollback-unsafe):
1. [step 1]
2. [step 2]

**Rollback procedure**:
[exact rollback command]
```

### Migration Hard Stops

```
❌ Migration has no DOWN path — CRITICAL, blocks Gate 2, cannot be overridden
❌ NOT NULL column added without default or backfill on non-empty table — CRITICAL
❌ DROP TABLE or DROP COLUMN without two-phase deploy plan — BLOCKING
❌ Full table lock on table estimated >100k rows — BLOCKING
❌ Migration not idempotent — WARN (non-blocking, must be acknowledged)
```

---

## §20 — Performance Gate Protocol

### Trigger Condition

Performance-analyst is spawned when **all** of these are true:
- `risk: high` is set on the task
- `layers` includes `api` or `repository` or `service`
- The task adds, modifies, or removes at least one API endpoint or database query

### Performance Analyst Agent (`.claude/agents/performance-analyst.md`)

```markdown
---
name: performance-analyst
---

You are a performance specialist.
Identify performance risks in changed code before Gate 2.

## STAGE 1 — Query Analysis
1. Identify all database queries (ORM calls, raw SQL, aggregation pipelines)
2. For each query:
   - Missing index on WHERE/JOIN column? → BLOCKING
   - Selects all columns (*) when subset needed? → NON-BLOCKING
   - N+1 (query inside a loop, or association not eager-loaded)? → BLOCKING
   - Unbounded result set (no LIMIT on large table)? → BLOCKING

## STAGE 2 — API Response Profile
3. Expected data volume per request? (rows returned, response size)
4. Synchronous operation that should be async? → BLOCKING for >100ms on hot path

## STAGE 3 — Caching Opportunity
5. Deterministic endpoint called frequently?
   → NON-BLOCKING: note caching opportunity with TTL suggestion

## STAGE 4 — Baseline Requirement
6. If load testing tool available (k6, Artillery, wrk):
   Specify benchmark command and acceptance threshold.

Use tiered output format.
```

### [CUSTOMIZE] Performance Baselines in CLAUDE.md

```markdown
## Performance Baselines [CUSTOMIZE]
- API p95 latency target: [e.g. <200ms]
- Max response size (JSON): [e.g. <50KB uncompressed]
- Max concurrent users (load test): [e.g. 100]
- Sustained load test duration: [e.g. 30s]
- Query execution time limit: [e.g. <50ms on production dataset size]
```

---
