---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: GSD upstream contexts/ pattern changes OR dev-flow grows distinct work-mode output profiles
status: current
---

# GSD `contexts/` + `.plans/` + `CONTEXT.md` reconcile vs dev-flow

**Sprint:** 044 T2 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | License |
|:--------|:-------|:--------|:--------|
| `gsd-build/get-shit-done` | gh CLI raw + dir listings | `42ed7cee8d8d` | MIT |
| `dev-flow` | local `.claude/CONTEXT.md`, `docs/sprint/`, `docs/research/` (HEAD) | `30a0c4f` (Sprint 044 T1) | — |

---

# Part A — `contexts/` directory pattern

## What GSD ships

`get-shit-done/contexts/` (3 files):

| File | Size | Mode trigger | Style |
|:-----|----:|:-------------|:------|
| `dev.md` | 759 B | `context: dev` in `config.json` | Low verbosity, action-oriented, lead with code change, skip preamble |
| `research.md` | 859 B | `context: research` in `config.json` | High verbosity, multi-option enumeration, prior-art citations, structured headings |
| `review.md` | 922 B | `context: review` in `config.json` | (sample inferred but didn't fetch — review-focused style profile) |

Verbatim `dev.md` excerpt:
```
# Dev Context Profile
Agent output guidance for dev mode. Loaded when `context: dev` is set in config.json.

## Output Style
- Concise, action-oriented responses
- Lead with the code change or command, follow with brief rationale
- Skip preamble — assume the developer has full context
- Use inline code references (`file:line`) over prose descriptions

## Verbosity
Low. One-liner explanations unless the change is non-obvious...
```

Verbatim `research.md` excerpt (contrast):
```
# Research Context Profile
Agent output guidance for research mode...

## Verbosity
High. Explain reasoning, show evidence, and document assumptions...
```

## What dev-flow has

`.claude/CONTEXT.md` (~85 lines after Sprint 040 add):
- Vocabulary (8 meta-repo terms)
- Agentic Engineering Principles (6)
- Gates (G1, G2)
- Modes (init / quick / mvp / sprint-bulk)
- Agent Roster (7 agents)
- Skill Authoring Standards (5)
- Behavioral Guidelines Lineage (Sprint 040 add)

**No mode-specific output-style profiles.** Verbosity managed at skill level (e.g., `caveman` plugin compresses on-demand; `dev-flow-compress` for memory files).

`.claude/CLAUDE.md` § Behavioral Guidelines (4 principles: Think Before Acting / Simplicity First / Surgical Changes / Goal-Driven Execution) is the closest equivalent — but single posture, not mode-switchable.

## Reconciliation

| Concern | GSD `contexts/` | dev-flow `.claude/CONTEXT.md` |
|:--------|:----------------|:------------------------------|
| WHAT IS THE WORKFLOW (gates / modes / agents / skills) | ✗ | ✓ |
| HOW SHOULD AGENTS RESPOND (verbosity / style profile) | ✓ (3 profiles) | ✗ (single posture via Behavioral Guidelines) |
| Mode-switchable | ✓ (via `config.json`) | ✗ (single posture) |
| Project-vocabulary | ✗ (style only) | ✓ (8 terms) |

**Different concerns.** GSD `contexts/` are HOW agents respond; dev-flow `.claude/CONTEXT.md` is WHAT the workflow is. NOT competing artifacts; orthogonal.

## Recommendation (Part A)

**DEFER `contexts/` pattern adoption.** Reasons:
1. Meta-repo work is primarily one mode (markdown editing + skill authoring + sprint management). Research happens in `docs/research/` which is its own artifact convention; no agent-style switch needed.
2. Single posture (Behavioral Guidelines) covers current dev-flow needs.
3. Per-mode style profiles add config + agent-side logic; cost not justified at single-author scale.

**Re-eval triggers:**
- dev-flow gains distinct work-mode patterns (e.g., regular implementation sprints vs research sprints vs review sprints) where output style genuinely should differ.
- Adopter feedback that single posture is too verbose/terse for some workflows.

NOT a `.out-of-scope/` candidate — pattern is interesting and may apply later; not actively rejected.

---

# Part B — `.plans/` directory pattern

## What GSD ships

`.plans/` at repo root, contains sprint/work-plan files. Sample:
- `1755-install-audit-fix.md` (2249 bytes)

Naming convention: `<numeric-prefix>-<slug>.md`. Numeric prefix likely sprint/phase number; slug describes work unit.

## What dev-flow has

`docs/sprint/SPRINT-NNN-*.md` convention (since Sprint 022+). Explicit sprint numbering + frontmatter (owner, last_updated, status: planning|active|closed, plan_commit, close_commit) + structured sections (Plan / Execution Log / Files Changed / Decisions / Open Questions / Retro).

## Recommendation (Part B)

**NO LIFT** per OQ-c default. dev-flow's `docs/sprint/SPRINT-NNN-*.md` is functionally equivalent and more explicit (sprint numbering, status frontmatter, retro discipline). Adopting `.plans/` would either duplicate the surface or force migration.

Recorded as DEC-7 in sprint plan to prevent question recurring.

---

# Part C — `CONTEXT.md` reconciliation (GSD vs dev-flow)

## What GSD ships

`CONTEXT.md` at repo root (41 lines). Pure TypeScript-module domain glossary. Sample entries:

```
### Dispatch Policy Module
Module owning dispatch error mapping, fallback policy, timeout classification, and CLI exit mapping contract.

### Command Definition Module
Canonical command metadata Interface powering alias, catalog, and semantics generation.

### Query Runtime Context Module
Module owning query-time context resolution for `projectDir` and `ws`...
```

Format: `### <Module Name>` + 1-3-line description per module. ~10 modules listed. Domain = GSD's TypeScript application code architecture.

## Section-level matrix

| Section | GSD CONTEXT.md | dev-flow CONTEXT.md | Reconciliation |
|:--------|:--------------:|:-------------------:|:---------------|
| Project description | (implicit in module list) | ✓ ("Single source of truth for vocabulary, principles, gates, modes") | NO LIFT — different scopes |
| **Domain glossary** | ✓ (~10 TypeScript modules) | ✓ (8 meta-repo workflow terms) | NO OVERLAP — different domains. GSD = app code architecture; dev-flow = workflow concepts |
| Principles | ✗ | ✓ (6) | NO LIFT (dev-flow superior in this dimension) |
| Gates | ✗ | ✓ (G1, G2) | NO LIFT |
| Modes | ✗ | ✓ (4) | NO LIFT |
| Agent Roster | ✗ | ✓ (7) | NO LIFT |
| Skill Authoring Standards | ✗ | ✓ (5) | NO LIFT |
| Behavioral Guidelines Lineage | ✗ | ✓ (Sprint 040 add) | NO LIFT |
| Relationships section | ✗ | ✗ (Sprint 043 DEC-5 recommends adding) | (TASK-117 — already queued) |
| Flagged ambiguities | ✗ | ✗ (Sprint 043 DEC-5 recommends adding) | (TASK-117 — already queued) |

## Recommendation (Part C)

**ZERO additive lifts from GSD CONTEXT.md.** GSD's CONTEXT.md is project-domain (TypeScript modules) and has nothing to add to dev-flow's workflow-domain CONTEXT.md. Sprint 043 DEC-5 already queued the 3 mattpocock-derived additive lifts via TASK-117; GSD adds no further candidates.

**Bidirectional finding:** dev-flow CONTEXT.md has 8 sections (Vocabulary / Principles / Gates / Modes / Agent Roster / Skill Authoring Standards / Behavioral Guidelines Lineage [+ planned Relationships + Flagged Ambiguities via TASK-117]); GSD CONTEXT.md has 1 section (Domain glossary). dev-flow CONTEXT.md is RICHER for workflow purposes; GSD CONTEXT.md is RICHER for code architecture (which dev-flow doesn't have).

---

# Combined recommendation feeding T3 (ADR-023)

- **DEC-7 (T2-A):** DEFER `contexts/` per-mode output-style profiles. Re-eval triggers: dev-flow gains distinct work modes warranting style profiles OR adopter feedback. NOT `.out-of-scope/` candidate (pattern interesting, may apply later).
- **DEC-8 (T2-B):** NO LIFT on `.plans/` directory. dev-flow `docs/sprint/SPRINT-NNN-*.md` superior (explicit numbering + status frontmatter + retro discipline).
- **DEC-9 (T2-C):** ZERO CONTEXT.md lifts from GSD. GSD CONTEXT.md is TypeScript-module domain; orthogonal to dev-flow workflow-domain. Sprint 043 DEC-5 (3 mattpocock-derived lifts) remains the only outstanding CONTEXT.md change queue (TASK-117).

## Re-audit cadence

Re-evaluate `contexts/` adoption when dev-flow develops distinct work-mode patterns. Re-fetch GSD CONTEXT.md when upstream main SHA changes (annual cadence likely sufficient).
