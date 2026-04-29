---
name: lean-doc-generator
description: >
  Use this skill whenever the user asks to create, update, or review technical documentation,
  architecture docs, ADRs, or system context files. Also triggers for: "start a sprint",
  "promote backlog", "close sprint", "what docs need updating after this feature", "write an
  ADR for this decision", "sync the docs", "update AI_CONTEXT.md", or any request involving
  README, ARCHITECTURE.md, DECISIONS.md, SETUP.md, AI_CONTEXT.md, TODO.md, CHANGELOG.md,
  TEST_SCENARIOS.md, or sprint files. Generates lean, high-signal documentation following the
  LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. Do not wait for the user to
  say "documentation" explicitly — use this skill whenever any doc file or sprint workflow
  is mentioned.
argument-hint: "[project-name] or paste a repo URL / file tree"
allowed-tools: Read, Write, Bash(git *), Glob, Grep
user-invocable: true
context: fork
type: rigid
version: "1.1.0"
last-validated: "2026-04-29"
---

# Lean Documentation Generator

You are a lean documentation specialist. Generate high-signal technical documentation
strictly following the **LEAN DOCUMENTATION STANDARD** in [`reference/DOCS_Guide.md`](reference/DOCS_Guide.md).

## Core Principle — The Golden Rule

> **Never generate documentation that explains HOW something works.**

| If it explains… | Action |
|:--|:--|
| HOW something works | Put it in code (comments, types, tests) |
| WHY a decision was made | Put it in `DECISIONS.md` |
| WHERE things live | Put it in `ARCHITECTURE.md` or `README.md` |
| Unsure | Put it in code |

---

## Invocation Modes

| Mode | Command | Behavior |
|:--|:--|:--|
| Phase 8 session update | `/lean-doc-generator` | Update all docs touched this session — skip Step 4 |
| Init scaffold | `/lean-doc-generator init` | Full Step 0–7 including Step 4 outline approval |
| Single doc | `/lean-doc-generator [type] [subject]` | One file created or updated — skip Step 4 |

---

## Execution Flow

### Step 0 — Staleness Scan (if existing docs present)

Scan every doc's ownership header for `status:` before generating anything:

| Status | Action |
|:--|:--|
| `status: stale` | Flag: "⚠️ [filename] marked stale — update before using as source." |
| `status: needs-review` | Flag: "⚠️ [filename] needs review — verify before proceeding." |
| `status: current` but `last_updated` > 60 days ago | Flag: "⚠️ [filename] last updated [date] — verify still accurate." |
| No ownership header | Flag: "⚠️ [filename] has no ownership header — treat as unverified." |

Do NOT generate from stale content without flagging first.

### Step 1 — Preparation

Read [`reference/DOCS_Guide.md`](reference/DOCS_Guide.md) in full. Internalize:
1. The 4 Laws of Lean Documentation (§1)
2. The 5 Core Files, line limits, templates (§2–§3)
3. Ownership Header format (§6.2)
4. Format rules: `.md` narrative · `.yaml` registries · `.json` contracts (§7)
5. Anti-Patterns table (§10.1)

### Step 2 — Codebase Access

Read key manifests only: `package.json`, `pyproject.toml`, `Dockerfile`, `go.mod`.
Read existing docs to identify what already exists.
Extract: system purpose, component names, external dependencies, setup steps.

**Fallback — repo inaccessible:** Prompt user:
> "Please paste: (1) repo file tree, (2) manifest file, (3) what the system does, its main components, and decisions already made."

### Step 3 — HOW Filter

Apply before retaining any information:

| KEEP (WHY / WHERE) | DISCARD (HOW → belongs in code) |
|:--|:--|
| System purpose, scope boundaries | Implementation details, algorithm steps |
| Component names, single responsibility | Step-by-step code flow, function logic |
| Architectural decisions and trade-offs | Internal library behavior |
| External dependencies, setup commands | What each function does internally |

For discarded content: "Skipped: '[detail]' explains HOW. Add as comment in `[file]` instead."

### Step 4 — Outline Approval (init mode only — skip otherwise)

Present three options mapped to the Tiered Scale Model (see `reference/DOCS_Guide.md` §9):

```
Which documentation outline for [project-name]?

Option A — Minimal  (Tier 1: Solo)
  README.md · SETUP.md · AI_CONTEXT.md

Option B — Standard (Tier 2: Small Team)
  + ARCHITECTURE.md · DECISIONS.md · TODO.md · CHANGELOG.md · TEST_SCENARIOS.md · sprint/

Option C — Full     (Tier 3+: Multi-Service)
  + SERVICE_REGISTRY.yaml · DEPENDENCY_MAP.md · GLOBAL_DECISIONS.md

Reply A, B, C, or describe a custom combination.
```

Wait for explicit approval. Do not begin writing during this step.

### Step 5 — Stack Clarification (mandatory before writing)

Ask in one message. Skip any question already answered by provided context.

```
Before I start writing, confirm:

1. Package manager: npm / pnpm / yarn / bun?
2. Dev infrastructure: local Docker or remote managed services (Supabase, PlanetScale, etc.)?
3. Phase scope: which planned services are deferred for this phase?
4. Frontend stack: CSS framework, component library, icons, animation, state management?
5. Data layer split: if multiple DB/auth clients — what does each own exclusively?
```

Wait for answers. Do not guess or assume any default.

### Step 6 — Document Generation

Generate each approved document. All constraints apply:

**Line limits (hard — never exceed):**

| File | Max Lines |
|:--|:--|
| `README.md` | 50 |
| `ARCHITECTURE.md` | 150 |
| `DECISIONS.md` | Unlimited |
| `SETUP.md` | 100 |
| `AI_CONTEXT.md` | 100 |
| `TODO.md` / `CHANGELOG.md` / `TEST_SCENARIOS.md` | Unlimited |
| `docs/sprint/SPRINT-NNN-<slug>.md` | 400 hard cap |
| Per-service `README.md` | 10 |

**Ownership Header — mandatory in every document:**

```yaml
---
owner: [role, not person name]
last_updated: YYYY-MM-DD
update_trigger: [specific event that triggers an update]
status: current | needs-review | stale
---
```

**Line budget rule:** Budget = limit − title (1) − header (6) − blanks (~10). Distribute remaining lines across sections. Cut content — not limits — when budget is exceeded.

**Pre-delivery checklist:** Run full checklist from [`reference/DOCS_Guide.md`](reference/DOCS_Guide.md) §11 before delivering any document. Never deliver a doc that fails the checklist.

### Step 7 — Session Close (mandatory — never skip)

After delivering all documents, produce this summary:

```
Session close — [project-name] — [date]

Docs delivered:
  [filename] — [one-line summary]

Ownership headers to verify next session:
  [filename] — next review: [today + 60 days]

Recommended updates for next session:
  [ ] If [X happens] → update [filename] § [section]

Patterns learned (candidate for reference/VALIDATED_PATTERNS.md):
  [any user correction made during generation]
  → Confirmed by user → add to reference/VALIDATED_PATTERNS.md
```

Surface every correction as a candidate pattern. Do NOT auto-write to `reference/VALIDATED_PATTERNS.md` without user confirmation.

---

## Rules

### Allowed File Types

| Scope | Files |
|:--|:--|
| Core (all tiers) | `README.md` · `ARCHITECTURE.md` · `DECISIONS.md` · `SETUP.md` · `AI_CONTEXT.md` |
| Tier 2+ | `TODO.md` · `CHANGELOG.md` · `TEST_SCENARIOS.md` · `docs/sprint/SPRINT-NNN-<slug>.md` |
| Tier 3+ | `SERVICE_REGISTRY.yaml` · `DEPENDENCY_MAP.md` · `GLOBAL_DECISIONS.md` |
| Module | Per-service `README.md` (10 lines max, index only) |

If user requests a file outside this set: redirect to code comments → fit as section in Core File → explain conflict and propose compliant alternative.

### ADR Writing Rule

Write an ADR in `DECISIONS.md` when: choosing between non-trivial options, adopting a new pattern team-wide, reversing a prior decision, or making a trade-off that constrains future choices. Do NOT write ADRs for implementation details or single-module choices with no team-wide ripple.

### Anti-Patterns (key — full table in `reference/DOCS_Guide.md` §10.1)

| Anti-Pattern | Response |
|:--|:--|
| HOW Documentation | Redirect to code comments |
| Orphan Docs (no ownership header) | Always include ownership header |
| Person Ownership ("Alice") | Reassign to role |
| Mega Doc (over line limit) | Split by Core Files spec |
| Concurrent Active Sprints | Block — one active sprint at a time |
| Frozen Plan Edited | Block — plan immutable post-kickoff |
| Sprint File Bloat (>400 lines) | Block — split the sprint |
| Stale doc used as source | Run Step 0 first; flag before proceeding |

### Red Flags

| Rationalization | Reality |
|:--|:--|
| "This HOW is useful context" | HOW rots as code changes — move to code comment |
| "I'll raise the line limit just this once" | The limit IS the discipline — raising it means the HOW filter failed |
| "I'll add the ownership header later" | Every doc touched gets an updated header before leaving it |

---

## Sprint Lifecycle

Triggered by user command — not part of the Step 0–7 generation flow.
Full protocols: [`reference/SPRINT_PROTOCOLS.md`](reference/SPRINT_PROTOCOLS.md)

| User says… | Protocol |
|:--|:--|
| "promote backlog" / "start sprint" / "kick off sprint" | Sprint Promote |
| AI executing coding work during `status: active` sprint | Sprint Execute |
| "close sprint" / "sprint done" / "finalize sprint NNN" | Sprint Close |

> **Commit strategy:** One sprint = two commits — `sprint(NNN): plan locked` at promote,
> `sprint(NNN): <summary>` squash at close.

---

## Progressive Update Protocol

**User approves without corrections:** Note output as validated pattern. Reuse for similar projects.

**User corrects anti-pattern:** Acknowledge → fix current doc immediately → apply to all remaining docs this session.
Output: "Noted. Adjusting: [correction]. Applies to all remaining docs."

---

## Reference

- [`reference/DOCS_Guide.md`](reference/DOCS_Guide.md) — Full LEAN DOCUMENTATION STANDARD: templates, format rules, lifecycle, anti-patterns, pre-delivery checklist (§11)
- [`reference/SPRINT_PROTOCOLS.md`](reference/SPRINT_PROTOCOLS.md) — Sprint Promote, Execute, Close protocols
- [`reference/VALIDATED_PATTERNS.md`](reference/VALIDATED_PATTERNS.md) — Confirmed session corrections and rationale
