---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004)
---

# Blueprint §10 — Workflow Modes

Covers: INIT (§16), Harness CI (§17), Session Resume (§18), Migration Safety (§19),
Performance Gate (§20), Hardened Hotfix (§21), Task Decomposer (§22).

---

## §16 — INIT Mode — Project Bootstrap Workflow

> **When to use**: Starting a project from scratch — no repo, no architecture, no task list.
> After INIT completes, the project is indistinguishable from an existing one. Use `/dev-flow full` from Sprint 1 onwards.

### Invocation

```bash
/dev-flow init [project-name]
```

### INIT Phases

```
DISCOVERY → [GATE A] → ARCHITECTURE → [GATE B] → INFRA SETUP → [GATE C] → SPRINT 0 → [GATE 1] → [GATE 2] → SESSION CLOSE
```

**Hard rule**: No code is written before Gate B. Any code written before Gate B → hard stop, revert.

---

### Phase I-1: Discovery

**Agent**: `init-analyst` (background, Tier 3)

**Orchestrator prompt to user before spawning**:
```
Starting INIT mode for [project-name].
Before I spawn the Discovery analyst, I need a brief:

1. What problem does this project solve? (one paragraph)
2. Who are the primary users?
3. What is the MVP — the smallest version that delivers value?
4. What is explicitly out of scope for MVP?
5. Approximate team size and operational runway (months)?

Answer these and I will run the Discovery analysis.
```

**Discovery analyst job** (init-analyst.md body):
```markdown
You are a Discovery analyst for a greenfield software project.

Given the project brief, produce a structured discovery document:

## Domain Model
- Core entities and their relationships (5-10 max for MVP)
- Bounded contexts if domain is large enough to warrant separation

## User Stories (MVP only)
- Format: "As a [user type], I want [goal] so that [value]"
- Maximum 10 stories. Prioritized P0-P2.

## Technical Constraints
- Performance expectations (users, requests/sec, data volume)
- Security classification (public, internal, regulated)
- Integration dependencies (third-party APIs, existing systems)
- Platform targets (web, mobile, desktop, API-only)

## Risk Radar
- 3-5 highest technical risks with mitigation ideas

## Stack Candidates
- Propose 2 stack options with tradeoffs for this specific domain
- Rank by fit given constraints, not by personal preference

Use the tiered output format. No raw code. No architecture decisions yet.
```

---

### Gate A — Discovery Approval

```markdown
## Gate A — Discovery: [project-name]

**Domain summary**: [1 sentence]

**MVP boundary**:
- In scope: [bullet list]
- Out of scope: [bullet list]

**Top 3 risks**: [list]

**Stack candidates**:
1. [Option A] — [tradeoff summary]
2. [Option B] — [tradeoff summary]

**Recommended stack**: [option + reason]

Type 'architecture' to proceed, or provide corrections.
```

> Gate A cost: Tier 3 (init-analyst spawn).
> Context carried forward: domain model, MVP boundary, constraints, chosen stack candidate.
> Context dropped: full discovery prose, rejected stack option details.

---

### Phase I-2: Architecture

**Agent**: `init-analyst` (second invocation — architecture role)

```markdown
You are an Architecture specialist.
Project: [name] | Stack: [chosen from Gate A] | Domain: [summary]
MVP constraints: [from Gate A]

Design:
1. System architecture — components, boundaries, data flow
2. Dependency rule — which layer may import which (MUST be unambiguous)
3. File/directory structure — top-level layout with purpose of each directory
4. Database design — entity schema for MVP (not full ERD — focus on core tables/collections)
5. API surface — list of endpoints or event topics needed for MVP user stories
6. Authentication pattern — chosen mechanism and why
7. Decisions made — list each as a proto-ADR (topic + decision + rationale + alternatives considered)

Return structured summary. No code yet. No file creation.
Use tiered output format with proto-ADRs listed under APPROVED PATTERNS.
```

**Gate B — Architecture Approval**:
```markdown
## Gate B — Architecture: [project-name]

**Architecture pattern**: [Clean Architecture | Hexagonal | MVC | etc.]

**Dependency rule**:
[Layer diagram — e.g. Pages → Services → Repository → External]

**File structure** (top level):
| Directory | Purpose |
|:----------|:--------|
| `src/[layer]/` | [what goes here] |

**Database**: [schema summary — key tables/collections]

**API surface**: [N endpoints — list]

**Auth pattern**: [e.g. JWT, session, OAuth]

**Proto-ADRs** (will be formalized in Sprint 0):
- ADR-001: [topic] — [decision]

**Context dropped after this gate**: discovery prose, rejected architecture options.
**Context carried forward**: approved architecture, dependency rule, proto-ADRs.

Type 'infra' to proceed, or provide corrections.
```

---

### Phase I-3: Infrastructure Setup

**Orchestrator runs inline** (no background agent — Tier 2 ops only):

```markdown
Infrastructure setup checklist for [project-name] on [stack]:

1. Repository initialization
   - [ ] `git init` + initial commit
   - [ ] `.gitignore` for [stack]
   - [ ] Branch strategy confirmed

2. Package manager + runtime
   - [ ] `[package-manager] init` / `go mod init` / `pyproject.toml`
   - [ ] Core framework installed: [framework + version]
   - [ ] Linter + formatter installed
   - [ ] Type checker installed (if typed stack)

3. Claude Code harness
   - [ ] `.claude/` directory created
   - [ ] `CLAUDE.md` written (architecture, dependency rule, conventions, DoD)
   - [ ] `settings.json` written (hooks)
   - [ ] `settings.local.json` created (gitignored)
   - [ ] All scripts created in `.claude/scripts/`
   - [ ] All agent `.md` files created in `.claude/agents/`
   - [ ] All skill `SKILL.md` files created in `.claude/skills/`
   - [ ] `MANIFEST.json` generated

4. Documentation scaffold
   - [ ] `docs/` created — run `/lean-doc-generator init`
   - [ ] `TODO.md` created with Sprint 0 tasks (see below)

5. CI/CD (if applicable)
   - [ ] CI config file created
   - [ ] CI_PROVIDER set in team env
```

**Gate C — Infrastructure Approval**:
```markdown
## Gate C — Infrastructure: [project-name]

**Repository**: [URL or local path]
**Stack confirmed**: [framework + runtime + version]
**Harness**: [✓ CLAUDE.md | ✓ settings.json | ✓ scripts | ✓ agents | ✓ skills]
**Docs scaffold**: [✓ all 6 docs/ files generated with ownership headers]
**CI**: [✓ configured | ⚠ skip (set CI_PROVIDER=skip)]

Type 'sprint0' to proceed to Sprint 0, or correct any item.
```

---

### Phase I-4: Sprint 0

Sprint 0 tasks are generated by `/task-decomposer --from-architecture` using the Gate B Architecture document — not written manually.

```markdown
Run /task-decomposer --from-architecture for Sprint 0.

Input context:
- Architecture approved at Gate B: [architecture summary]
- Stack: [chosen stack]
- Dependency rule: [layer diagram]
- API surface (MVP): [list from Gate B]
- Auth pattern: [from Gate B]
- Proto-ADRs: [list]

Sprint 0 goal: produce the runnable skeleton that all future sprints build on.
Decompose into 3-5 foundation tasks. Every task must be independently deployable.
```

The human's approval of the task list IS Gate 0 for Sprint 0.

> After Sprint 0 Gate 2 passes and Session Close runs, INIT mode is complete.
> From Sprint 1 onwards, use `/dev-flow full`.

---

## §17 — Harness Continuous Improvement Protocol

### Channel 1: Session Close Promotions

Every Session Close includes a "Corrections worth promoting" block. When confirmed, the orchestrator:
1. Identifies which skill, agent, or CLAUDE.md section the correction applies to
2. Opens the relevant file
3. Appends the correction to a `## Validated Session Patterns` section
4. Updates `last-validated` date in frontmatter
5. Writes an entry to `.claude/IMPROVEMENT_LOG.md`

**`.claude/IMPROVEMENT_LOG.md` format** (append-only):
```markdown
## [YYYY-MM-DD] — [Skill or Agent name]

**Correction source**: Session Close — TASK-NNN
**Pattern added**: [what was added and why]
**Applied to**: [file path + section]
**Promoted by**: [human | auto]
```

### Channel 2: Skill Staleness Auto-Update

When `session-start.js` flags a skill as stale (last-validated > 6 months):
1. Ask: *"Skill [name] is stale. Shall I run a quick validation pass?"*
2. If yes: forked skill context re-reads skill + current stack version, returns diff
3. Human approves changes
4. Update `last-validated` and write IMPROVEMENT_LOG entry

**Staleness re-validation prompt**:
```markdown
You are reviewing skill [name] for staleness.
Skill last-validated: [date]
Current stack: [framework + version]

Check:
1. Are any tool names, API names, or CLI flags no longer valid for this stack version?
2. Are any blocking rules outdated given framework changes since [date]?
3. Are any referenced patterns deprecated or superseded?

Return: KEEP / UPDATE / REMOVE for each section.
```

### Channel 3: Gate Feedback Capture

Every time a human rejects a gate output and provides a correction:
```markdown
Gate [N] was rejected. Correction received: "[human correction verbatim]"

Categorize:
- Is this a scope clarification? → Update Clarify phase rules
- Is this a design quality issue? → Update design-analyst prompt
- Is this a review false positive? → Update pr-reviewer blocking rules
- Is this a security false positive? → Update security-auditor scope
- Is this an orchestrator communication issue? → Update gate output format

Propose one specific change to the relevant file. Human confirms before writing.
```

### Weekly Calibration Protocol

```bash
/refactor-advisor .claude/skills/    # Review skill quality as a whole
/refactor-advisor .claude/agents/    # Review agent prompt quality
```

Review `.claude/IMPROVEMENT_LOG.md` for patterns worth generalizing.

**Calibration questions**:
1. Which gates are being rejected most often? → That phase needs a prompt upgrade.
2. Which hard stops are triggering false positives? → Threshold needs adjustment.
3. Which skills have `last-validated` approaching 6 months? → Schedule validation pass.
4. Are context budget warnings appearing frequently? → Phases may need to be split.
5. Is CI blocking Session Close regularly? → CI pipeline may need optimization.

---

## §18 — Session Resume Protocol

### Invocation

```bash
/dev-flow resume TASK-NNN
```

### Resume Algorithm

**Step 1 — State Detection** (Tier 1):
```markdown
Read TODO.md. Find TASK-NNN.
Read the approved design plan for TASK-NNN from the last Gate 1 output.

If design plan NOT found in context:
  → HARD STOP: "Design plan for TASK-NNN not found. Options:
     (a) Provide the Gate 1 plan manually (paste it here)
     (b) Re-run Gate 1 from the last known design-analyst output
     (c) Start from Gate 0 if the scope has changed"

If design plan found:
  → Find the first incomplete micro-task [ ] in the plan
  → Report: "Resuming at micro-task [N]: [description]"
  → Ask: "Does this match where you left off, or has something changed?"
```

**Step 2 — Context Reconstruction** (Tier 1-2):
```markdown
- Load only files relevant to the current micro-task (not the whole task)
- Do NOT re-read previously completed micro-tasks' files
- Run validation check: typecheck + lint on already-written files
  If validation fails → report failures before resuming implementation
```

**Step 3 — Continue from micro-task N**:
```markdown
Proceed with micro-task [N] as if Gate 1 just approved.
No re-design. No re-clarification.
If a decision needs to be re-made, ask ONE targeted question — do not re-run the full Clarify phase.
```

### Resume Output Format

```markdown
## Session Resume — TASK-NNN: [Title]

**Interrupted at**: [phase name + micro-task number]
**Context reconstructed**: [Y files loaded]
**Validation on existing work**: [pass | N failures — listed below]

**Resuming at micro-task [N]**: [description]
**Verification command**: [command from Gate 1 plan]

[if validation failures]:
**Must fix before resuming**:
- [file:line] — [issue]

Type 'continue' to resume implementation, or provide corrections.
```

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

## §21 — Hardened Hotfix Mode

> No gates, but mandatory safety checks that cannot be skipped.

### Invocation

```bash
/dev-flow hotfix
```

### Hotfix Workflow

```
TRIAGE → ROLLBACK CHECK → IMPLEMENT → FAST VALIDATE → COMMIT → POST-DEPLOY VERIFY → INCIDENT ADR → SESSION CLOSE
```

### Phase H-1: Triage

```markdown
HOTFIX MODE ACTIVE — no gates, production emergency protocol.

Answer:
1. What is broken? (one sentence — observable symptom, not assumed cause)
2. What is the blast radius? (users affected, revenue impact, data at risk?)
3. When did it start? (time + what changed before it started)
4. Is there a known rollback available? (revert commit, feature flag, config change)
5. Fastest fix hypothesis: [likely cause, stated as hypothesis not fact]
```

### Phase H-2: Rollback Readiness Check

```markdown
Rollback option A — Revert commit:
  git log --oneline -10
  Revert command: git revert [SHA] --no-edit

Rollback option B — Feature flag:
  [flag name] = false → disables the broken feature

Rollback option C — Config change:
  [config key] → [rollback value]

If NO rollback is available:
  ⚠️ WARN: No rollback path identified. Human must acknowledge before implementation starts.
```

### Phase H-3: Implement

```
- Fix the minimal change that addresses the root cause — not a refactor
- If the fix requires touching >3 files: pause and confirm with human
- State the hypothesis being tested before writing code
- After writing: state what the code changes and why it fixes the symptom
```

### Phase H-4: Fast Validate (non-blocking warnings)

```bash
[lint-command] --only-changed
[typecheck-command]
[unit-test-command] --only-changed
```

Output:
```
⚠️ HOTFIX VALIDATION (non-blocking):
   Lint:      [pass | N warnings]
   Typecheck: [pass | N errors]
   Tests:     [pass | N failures]
   
   [If any failures]: Must be resolved in a follow-up task immediately after hotfix.
   Proceeding — human confirms to commit.
```

### Phase H-5: Commit + Deploy

```
hotfix([scope]): [what was fixed — one line]

Root cause: [one sentence]
Symptom: [what was observed]
Fix: [what code change resolves it]
Rollback: git revert [this-commit-SHA]

Refs: [incident ticket URL if available]
```

After commit → git push → ci-status.js runs automatically.

### Phase H-6: Post-Deploy Smoke Test

```markdown
Deploy complete. Run these smoke tests to verify the fix:

- [ ] [Specific endpoint or action that was broken] → expected: [result]
- [ ] [Adjacent feature most likely to regress] → expected: [result]
- [ ] [Monitoring check] → expected: error rate < [threshold]%

Report results. If any fail: run rollback procedure (documented in Phase H-2).
```

### Phase H-7: Incident ADR (mandatory)

```markdown
Run /adr-writer for incident ADR.

Context:
- Incident: [title from triage]
- Root cause: [identified cause]
- Fix applied: [commit SHA + description]
- Rollback plan: [from Phase H-2]
- Time to resolve: [triage start → deploy confirmation]
- Follow-up tasks needed: [lint/typecheck failures, regression prevention, monitoring]

ADR format for incidents:
## ADR-NNN: [Incident Title] — Post-Mortem Decision

**Status**: decided
**Date**: [today]
**Context**: [what happened and why]
**Decision**: [what fix was applied and why this approach]
**Consequences**:
- Positive: [incident resolved]
- Negative: [technical debt created, if any]
- Follow-up: [tasks to prevent recurrence]
```

### Phase H-8: Session Close

Standard Phase 10 plus:

```markdown
**Hotfix post-mortem checklist**:
- [ ] Incident ADR written and committed
- [ ] Follow-up tasks added to TODO.md Backlog (P0)
- [ ] Monitoring/alerting verified (error rate returned to baseline)
- [ ] Team notified (if applicable)
- [ ] Rollback procedure documented in incident ADR
```

---

## §22 — Task Decomposer — Intent to Structured Task Pipeline

> **Purpose**: Translate any form of human intent into fully-formed TASK-NNN entries.
> Eliminates the gap between "I have an idea" and "the pipeline has a valid task."
> Task-decomposer output serves as Gate 0 — no separate Gate 0 runs after it.

### Input Formats Accepted

| Input Type | Example | Detection Rule |
|:-----------|:--------|:--------------|
| **Freeform description** | `"add Google OAuth login"` | No URL, no `--` flag |
| **Ticket URL / ID** | `JIRA-123` | Matches URL or `[A-Z]+-[0-9]+` |
| **PRD document** | `--prd docs/feature.md` | `--prd` flag + file path |
| **Epic decomposition** | `--epic "Payment"` | `--epic` flag + epic name |
| **Architecture input** | `--from-architecture` | INIT mode only |

**Ticket URL credentials** (from environment):
```bash
LINEAR_API_KEY=...
JIRA_BASE_URL=...   # + JIRA_USER + JIRA_API_TOKEN
GITHUB_TOKEN=...
```
If credentials missing: skill asks human to paste ticket content directly.

### Scope Analyst Agent (`.claude/agents/scope-analyst.md`)

```markdown
---
name: scope-analyst
---

You are a codebase impact analyst. READ-ONLY — do not suggest implementations.

Given a feature description and the current codebase:

## IMPACT ASSESSMENT

### Files likely affected
Up to 10 existing files most likely to be modified. For each:
- `path/to/file` — [why it will change]

### Layers touched
List the architectural layers (from CLAUDE.md) this change crosses.

### New files likely needed
- `path/to/new-file` — [what it will contain and why]

### Existing patterns to reuse
- [pattern name]: found in `path/to/example` — [how it applies]

### Complexity signals
- Estimated file count: [N files created/modified]
- Cross-layer: [yes | no]
- API surface change: [yes | no]
- Database change: [yes | no]
- Auth/permission change: [yes | no]

### Risk indicators
- [HIGH]: [reason]
- [MEDIUM]: [reason]

Do NOT return raw file contents. Do NOT suggest implementation approaches.
```

### Skill Execution Flow

**Step 1: Intent Extraction**
```markdown
Input type detected: [freeform | ticket | prd | epic | from-architecture]
[If ticket]: Fetching ticket [ID]...
Spawning scope-analyst to assess codebase impact...
```

**Step 2: Socratic Clarification** (freeform and ticket only)
```
1. Ask ONE question at a time. Never stack.
2. Each question must resolve an ambiguity affecting task scope, risk, or acceptance criteria.
3. Stop when: goal is unambiguous, edge cases are named, scope boundary is clear.
4. Maximum 4 questions. After 4 → present best-guess decomposition with explicit assumptions.
5. PRD and --from-architecture inputs skip clarification entirely.
```

**Step 3: Assumption Registry**
```markdown
## Assumptions I am making (correct any that are wrong):

1. [Assumption 1] — based on: [reason]
2. [Assumption 2] — based on: [existing pattern in codebase]

If any assumption is wrong, tell me now. If all acceptable, type 'decompose'.
```

**Step 4: Risk Scoring Algorithm**
```
BASE: low

UPGRADE TO medium if ANY of:
  - 2+ layers touched
  - API change required
  - External service integrated
  - New database table/collection created

UPGRADE TO high if ANY of:
  - 3+ layers touched
  - Auth/permission logic modified
  - Existing database schema altered
  - Core shared middleware modified (used by >3 other features)
  - Data migration required
```

**Step 5: Scope Mode Assignment**
```
full:    risk:high OR layers > 2 OR api-change:yes with cross-layer impact
quick:   risk:low OR risk:medium AND layers ≤ 2 AND single concern
hotfix:  never assigned by task-decomposer (hotfix is declared by human only)
```

**Step 6: Task Granularity Rules**
```
Target task size: 2-6 hours of focused implementation work
Maximum task size: 1 day (if larger → must split)
Minimum task size: 30 minutes (if smaller → merge with adjacent task)

Splitting triggers:
- Task touches more than 3 distinct files in different layers → split by layer
- Task has more than one independently verifiable acceptance criterion → split
- Task has a "depends on X" dependency → that dependency must be a separate task

Grouping rules:
- Group 2-5 tasks per sprint (never 1 alone, never more than 5)
- Order by: dependency first, then importance, then risk (high first)
```

### Output Format

```markdown
## Task Decomposition — [Feature/Epic Title]

**Source**: [freeform | ticket JIRA-123 | prd docs/feature.md | epic "Name"]
**Scope-analyst impact**: [N] files, [layers], API change: [yes|no], Risk: [low|medium|high]

**Assumptions confirmed**:
1. [Assumption 1]

**Decomposition** ([N] tasks across [N] sprint(s)):

---

### Sprint [N] — [Theme] (proposed)

- [ ] **TASK-[NNN]: [Title]** — [why it matters, one line]
  - `scope`: full | quick
  - `layers`: [comma-separated, validated against CLAUDE.md]
  - `api-change`: yes | no
  - `acceptance`: [measurable — "[action] returns/produces [result]"]
  - `tracker`: [URL if available | "none — [justification]"]
  - `risk`: low | medium | high
  - `depends-on`: TASK-[NNN] | none
  - `assumptions`: [task-specific assumptions, or "none"]

---

**Dependency graph**:
TASK-001 → TASK-002 → TASK-004
TASK-003 (independent)

**What I did NOT include** (out of scope based on your input):
- [item explicitly excluded]

---
Type 'approve' to write these tasks to TODO.md Active Sprint.
Type 'revise [task number] [correction]' to adjust a specific task.
Type 'split TASK-NNN' to further decompose a task.
Type 'merge TASK-NNN TASK-MMM' to combine two tasks.
```

### Auto-Insert into TODO.md

After human types `approve`, the skill:
1. Reads existing TODO.md to find the next available TASK number
2. Numbers new tasks sequentially from that point
3. Inserts tasks into `## Active Sprint` (or creates new sprint)
4. If tasks exceed sprint sizing rules (>5 tasks) → overflow goes to `## Backlog`
5. Clears `.claude/.session-changes.txt`

### Validation Rules (enforced before output is written)

```
❌ TASK has no measurable acceptance criteria — "works correctly" is not accepted
❌ TASK layers not in the valid layer list from CLAUDE.md — reject and correct
❌ TASK scope is "hotfix" — task-decomposer never assigns hotfix scope
❌ Assumption made about auth/security without explicit human confirmation — flag as CRITICAL
❌ TASK estimated >1 day without being split — must split before output
❌ Sprint has only 1 task — must add adjacent task or move to Backlog
❌ tracker is "none" without written justification — prompt for URL or explicit reason
❌ Two tasks have identical acceptance criteria — merge them or differentiate
```

### Special Mode: `--from-architecture` (INIT Sprint 0)

Used exclusively during INIT mode Phase I-4. Skips clarification. Uses Gate B architecture document as the full spec.

```markdown
Generate Sprint 0 tasks covering:
1. Project entry point + health endpoint
2. Router + dependency injection setup
3. Authentication foundation (chosen auth pattern from Gate B)
4. Database connection + core entity schema (from Gate B domain model)
5. CI pipeline green (lint + typecheck + tests pass)

Apply risk scoring. Auth and DB tasks are always risk: high.
Group as Sprint 0. All tasks must be independently verifiable.
Present for human approval before writing to TODO.md.
```
