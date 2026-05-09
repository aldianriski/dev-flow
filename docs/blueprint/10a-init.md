---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); split from 10-modes.md (TASK-059)
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
