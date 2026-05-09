---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new stack added; setup checklist changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §10 + §11 + §12 + §14 + §15 (split TASK-004)
---

# Blueprint §9 — Customization, Setup & Architecture Alignment

## §10 — Security Auditor Stack Customization

### Universal Checks (all stacks)

- Hardcoded credentials / API keys in source
- Console/logging of sensitive data (tokens, PII)
- User input used without validation
- URL parameters used without format check
- Open redirect (redirect to user-controlled URL)

### [CUSTOMIZE] FE-Specific Checks

| Framework | Key Risks |
|:----------|:---------|
| Vue 3 | `v-html` XSS, SSR data leakage, non-httpOnly token storage |
| React | `dangerouslySetInnerHTML` XSS, client-side auth only, localStorage tokens |
| Angular | `bypassSecurityTrust*` XSS, template injection |
| Next.js | getServerSideProps data exposure, public env vars with secrets |

### [CUSTOMIZE] BE-Specific Checks

| Framework | Key Risks |
|:----------|:---------|
| Node/Express | SQL injection (raw queries), path traversal, prototype pollution |
| NestJS | Missing guards on controllers, DTO validation not enabled globally |
| FastAPI | Missing `Depends` auth on routes, response model leaking internal fields |
| Go/Gin | Missing auth middleware, SQL injection with fmt.Sprintf in queries |
| Spring | Missing `@PreAuthorize`, mass assignment via `@RequestBody` to entity |

---

## §11 — PR Reviewer Architecture Rule Customization

The `pr-reviewer` skill checks architecture rules. Customize the blocking conditions:

### [CUSTOMIZE] Clean Architecture (Pages → Services → Repository)

```markdown
BLOCKING:
- Controller/Route handler contains business logic
- Repository is called directly from controller (skips service)
- Service imports ORM entity directly (instead of repository abstraction)
- DTO used as domain model throughout all layers
```

### [CUSTOMIZE] Hexagonal Architecture (Ports & Adapters)

```markdown
BLOCKING:
- Domain logic imports infrastructure (ORM, HTTP client)
- Use case imports concrete adapter (not port interface)
- Adapter implements multiple ports in one class
```

### [CUSTOMIZE] MVC (Model-View-Controller)

```markdown
BLOCKING:
- View renders data from DB query (no model layer)
- Controller contains SQL queries
- Model has HTTP response logic
```

### [CUSTOMIZE] Frontend Clean Architecture

```markdown
BLOCKING:
- Component calls API directly (not via hook/composable/service)
- Business logic in route handler (page component)
- State management contains API call logic
```

---

## §12 — Setup Checklist for a New Repository

```
Phase 1 — Structure (30 min)
- [ ] Create .claude/ directory with scripts/ subdirectory
- [ ] Write CLAUDE.md with project overview, dependency rule, conventions, DoD, and Issue Tracker sections
- [ ] Verify CLAUDE.md is under 200 lines
- [ ] Create settings.json with SessionStart hook + lint + typecheck hooks for your stack
- [ ] Create .claude/scripts/session-start.js (from §6 template)
- [ ] Add settings.local.json to .gitignore
- [ ] Create docs/ directory — generate initial docs with /lean-doc-generator (select Option B or C)
      Generates: README.md, ARCHITECTURE.md, DECISIONS.md, SETUP.md, AI_CONTEXT.md, CHANGELOG.md
- [ ] Create TODO.md using the unified format from §7 (first sprint + backlog)
- [ ] Verify first task has a real tracker URL or explicit justification — required for Gate 0

Phase 2 — Universal Skills (20 min)
- [ ] Create .claude/skills/ directory
- [ ] Copy these skill directories (each contains SKILL.md):
      adr-writer/, refactor-advisor/, lean-doc-generator/,
      release-manager/, system-design-reviewer/
- [ ] Ensure lean-doc-generator/references/ directory is copied with DOCS_Guide.md and VALIDATED_PATTERNS.md
- [ ] Verify lean-doc-generator/SKILL.md has version, stack-version, last-validated frontmatter
- [ ] Update release-manager/SKILL.md VCS section (Bitbucket/GitHub/GitLab)
- [ ] Add `context: fork` + `agent: general-purpose` to: refactor-advisor, system-design-reviewer
- [ ] Add type:, when_to_use:, stack-version and last-validated fields to all skill frontmatter

Phase 3 — Subagents (45 min)
- [ ] Create .claude/agents/ directory
- [ ] Create .claude/agents/design-analyst.md — customize dependency rule for your architecture
- [ ] Create .claude/agents/init-analyst.md — preloads system-design-reviewer;
      body adds: discovery checklist, architecture gate format (Gate A + Gate B), ADR-001 prompt
- [ ] Create .claude/agents/code-reviewer.md — thin wrapper with `skills: pr-reviewer`;
      body adds only: role + Gate 2 tiered format + project dependency rule
- [ ] Create .claude/agents/security-analyst.md — thin wrapper with `skills: security-auditor`;
      body adds only: role + tiered severity format + stack-specific scope notes
- [ ] Create .claude/agents/migration-analyst.md — migration safety specialist;
      body: up/down parity check, backward-compat rules, concurrent-write risk, rollback verification
- [ ] Create .claude/agents/performance-analyst.md — conditional (risk: high + api layer);
      body: query plan analysis, response time baseline, N+1 detection, load profile assessment
- [ ] Verify all agents use the tiered output contract + status field (§4)

Phase 4 — Stack-Specific Skills (60 min)
- [ ] Create .claude/skills/dev-flow/SKILL.md (orchestrator) customized for your stack
      Must include: all 6 modes (init/full/quick/hotfix/review/resume), Gate 0/1/2, Phase 9b CI check
- [ ] Create .claude/skills/[component/service]-builder/SKILL.md for your framework
- [ ] Create .claude/skills/test-case-generator/SKILL.md — cover unit, integration, and E2E tiers
- [ ] Create .claude/skills/security-auditor/SKILL.md with stack-specific risks (context: fork)
- [ ] Create .claude/skills/pr-reviewer/SKILL.md with your architecture blocking rules (context: fork)
- [ ] Create .claude/skills/api-contract-designer/SKILL.md if API-first (FE or BE)
- [ ] Create .claude/skills/e2e-scenario-writer/SKILL.md if E2E tests exist
- [ ] Create .claude/skills/task-decomposer/SKILL.md — universal, works for all stacks
      Customize: valid layer names (must match CLAUDE.md), tracker URL pattern, risk thresholds
- [ ] Create .claude/agents/scope-analyst.md — read-only codebase impact reader
- [ ] Create .claude/scripts/track-change.js — PostToolUse file tracker
- [ ] Create .claude/scripts/ci-status.js — PostToolUse CI poller; set CI_PROVIDER env var
- [ ] Add .claude/.session-changes.txt to .gitignore
- [ ] Generate MANIFEST.json with scripts/regenerate-manifest.js (see §5)

Phase 5 — Validation (45 min)
- [ ] Verify settings.local.json exists on your machine (gitignored — workflow fails without it)
- [ ] Run session-start.js manually — verify all 9 checks pass
- [ ] Run /dev-flow init [test-project] in a scratch repo — verify 4-phase init runs
- [ ] Run /dev-flow on a small existing task — verify full pipeline end-to-end
- [ ] Verify Gate 0 fires and waits before Design agent spawns
- [ ] Verify lint hook fires on git commit attempt
- [ ] Verify typecheck hook fires on git push attempt
- [ ] Verify ci-status.js runs after git push and surfaces CI result
- [ ] Verify track-change.js appends files to .session-changes.txt on Write/Edit
- [ ] Ask a team member to clone and run /dev-flow — verify skills load
- [ ] Verify Review + Security agents run in parallel and Gate 2 aggregates both outputs
- [ ] Verify migration-analyst fires when a migration file is in changed files
- [ ] Verify performance-analyst fires when risk: high + api layer

Phase 6 — Team Onboarding (15 min per person)
- [ ] Share this document
- [ ] Explain the 3-gate model (Gate 0 = scope, Gate 1 = design, Gate 2 = review + security)
- [ ] Explain context cost tiers and why Tier 3 requires gate confirmation
- [ ] Explain task format in TODO.md, including tracker URL requirement and risk field
- [ ] Explain /dev-flow [mode] syntax and quick mode scope guard
- [ ] Confirm settings.local.json created on each machine (gitignored)
```

---

## §14 — Architecture Alignment Verification

Before shipping the workflow for a new project, verify alignment with chosen principles:

### Clean Architecture

| Workflow Phase | CA Alignment |
|:--------------|:------------|
| Design agent explores layer boundaries | Enforces dependency rule during planning |
| pr-reviewer checks layer violations | Blocking: outer depending on inner reversed |
| security-auditor checks infrastructure leakage | Catches domain importing infrastructure |
| CLAUDE.md defines dependency rule | Always-loaded context enforces it in every session |

### Spec-Driven Architecture (if applicable)

| Workflow Phase | Spec-Driven Alignment |
|:--------------|:---------------------|
| api-contract-designer runs before implementation | Contract first, code second |
| Design agent checks if api-change: yes | Forces spec update before implementation |
| pr-reviewer checks DTO vs domain model separation | Generated types never used as domain models |

### SOLID

| Principle | Enforced By |
|:----------|:-----------|
| Single Responsibility | pr-reviewer flags composables/services >200 LOC |
| Open/Closed | system-design-reviewer checks for extension without modification |
| Interface Segregation | pr-reviewer flags prop/param bags (too many fields) |
| Dependency Inversion | pr-reviewer flags concrete dependency imports in domain layer |

### Domain-Driven Design (if applicable)

| DDD Concept | Enforced By |
|:-----------|:-----------|
| Bounded context | CLAUDE.md defines feature directory ownership |
| Domain model isolation | pr-reviewer blocks DTO-as-domain-model |
| Ubiquitous language | adr-writer captures vocabulary decisions |

---

## §15 — Adapting This Blueprint — Decision Guide

Answer these questions for each new repository:

| Question | If YES | If NO |
|:---------|:-------|:------|
| Is it a frontend project? | Add component-builder, fe-accessibility-auditor, e2e-scenario-writer | Skip these |
| Does it have an API contract with another team? | Add api-contract-designer | Skip |
| Does it have a strict architecture (CA, DDD, Hexagonal)? | Customize pr-reviewer blocking rules | Use generic pr-reviewer |
| Does it use TypeScript? | Add typecheck hook to settings.json | Use compile/build equivalent |
| Does it have E2E tests? | Add e2e-scenario-writer | Skip |
| Is it deployed via CI/CD? | Add ci-status.js + set CI_PROVIDER | Set CI_PROVIDER=skip |
| Does it handle user PII or payments? | Add security-auditor as a blocking gate | Keep as advisory |
| Is the team >3 people? | Use full mode (Gate 1 + Gate 2) as default | quick mode is fine |
| Is it a greenfield project? | Start with `/dev-flow init` | Start with `/dev-flow` |
| Does it have database migrations? | Add migration-analyst agent, add migration hard stop | Skip migration checks |
| Does any task touch high-risk API paths? | Add performance-analyst agent | Skip performance gate |
| Are sessions frequently interrupted? | Ensure `/dev-flow resume` is set up and design plans are persisted | Standard session close is enough |
