---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: GSD upstream phase-pipeline shape changes OR dev-flow scale crosses GSD threshold
status: current
---

# GSD phase-pipeline + commands-namespace diff vs dev-flow

**Sprint:** 044 T1 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | License |
|:--------|:-------|:--------|:--------|
| `gsd-build/get-shit-done` | gh CLI raw + dir listings | `42ed7cee8d8d` (upstream main) | MIT |
| `dev-flow` | local `skills/`, `agents/`, orchestrator skill (HEAD) | `aed05f0` (Sprint 044 plan-lock) | — |

GSD postdates Sprint 034 external-refs probe — no prior cached probe summary. gh CLI is sole source.

## GSD scale (verified)

| Surface | Count | Notes |
|:--------|------:|:------|
| `commands/gsd/*.md` | ~64 (sampled 60+ files) | one slash command per file |
| `get-shit-done/workflows/*.md` | ~80+ | very large (execute-phase 77KB, docs-update 48KB, autonomous 30KB) |
| `agents/*.md` | ~20+ | very large (gsd-debugger 47KB, gsd-doc-writer 38KB, gsd-code-fixer 32KB) |
| `get-shit-done/contexts/*.md` | 3 (dev / research / review) | per-domain context injection |
| `get-shit-done/{templates,references,bin}/` | (each present) | additional structured surfaces |
| TypeScript SDK | YES (`/sdk/`, `package.json`, `tsconfig.json`, `vitest.config.ts`) | full app, not markdown-only |
| `.out-of-scope/` | YES (2 pointers: agent-template-rendering, temporal-context) | mattpocock-derived |
| `.plans/` | YES | their planning convention |
| Multi-language READMEs | 5 (en / ja / ko / pt-BR / zh-CN) | localization |

**Total surface: ~164+ assets** (commands + workflows + agents). vs dev-flow's 24 (17 skills + 7 agents).

## Phase-pipeline mapping

GSD pipeline (sampled from `commands/gsd/`):
```
sketch → spike → discuss-phase → spec-phase → plan-phase → execute-phase → verify-work → validate-phase → ship
                                                          ↘ ui-phase / secure-phase / audit-phase / ai-integration-phase (parallel)
```

Plus orchestration commands: `phase` (CRUD), `progress` (advance), `autonomous` (multi-phase loop), `quick`, `fast`, `manager`, `workspace`, `workstreams`.

dev-flow equivalents:
```
init mode (scaffold) → mvp mode (G1 Scope → G2 Design → Implement → Review → Commit)
                    → quick mode (G1 → Implement → Review → Commit)
                    → sprint-bulk mode (G1+G2 batched once → loop tasks)
```

**Mapping matrix:**

| GSD phase | dev-flow equivalent | Delta |
|:----------|:--------------------|:------|
| `sketch` | (none — informal in user prompt) | dev-flow folds sketching into G1 Parse step; GSD makes it explicit |
| `spike` | (none — informal) | dev-flow has no spike command; would belong to mvp Implement step ad hoc |
| `discuss-phase` | G1 Scope (orchestrator quick/mvp) + Grill step (mvp) | dev-flow Grill ≈ GSD discuss-phase but lighter (one question at a time vs structured assumption-gathering) |
| `spec-phase` | G2 Design (mvp) | dev-flow design-analyst output ≈ GSD spec-phase but at micro-task granularity |
| `plan-phase` | G2 Design MICRO-TASKS list (orchestrator) | dev-flow plan IS the design-analyst MICRO-TASKS; GSD treats plan as separate artifact (PLAN.md) |
| `execute-phase` | mvp Implement step | dev-flow Implement runs MICRO-TASKS sequentially; GSD execute-phase is much more elaborate (77KB workflow) |
| `verify-work` | Implement micro-task `verify:` lines + DoD checks | dev-flow verify is per-micro-task inline; GSD verify-work is dedicated command |
| `validate-phase` | Sprint Close DoD verification | dev-flow Sprint Close runs DoD checklist; GSD validate-phase is separate artifact |
| `ship` | `/release-patch` (Sprint 039) + manual `git push` | dev-flow ship has HARD STOP at push; GSD ship may auto-deploy (didn't verify) |

**Net:** GSD's 9-phase pipeline is FINER GRAINED than dev-flow's mode + gate model. Both express the same underlying concept (sketch → execute → verify), but GSD splits each step into its own command + artifact (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md), while dev-flow folds them into orchestrator phases.

## commands/ vs skills/ namespace comparison

| Aspect | GSD `commands/gsd/<name>.md` | dev-flow `skills/<name>/SKILL.md` |
|:-------|:------------------------------|:------------------------------------|
| File-per-asset | ✓ (one .md per command) | ✓ (one dir per skill, one SKILL.md) |
| Slash invocation | `/gsd-<name>` (namespaced) | `/<name>` or `/dev-flow:<name>` (namespaced) |
| Frontmatter `name` | `gsd:<name>` (colon-separated) | `<name>` (bare) |
| Frontmatter `description` | one-line | one-line "Use when..." |
| Frontmatter `agent` | YES (commands route to specific agents via field) | NO (orchestrator dispatches via separate dispatch-table) |
| Frontmatter `allowed-tools` | YES (per-command granular allowlist) | NO (skills inherit session permissions) |
| Frontmatter `argument-hint` | YES (very detailed flag spec) | YES on many skills (sub-set of GSD detail) |
| Body structure | XML-tagged blocks: `<objective>`, `<routing>`, `<execution_context>`, `<context>`, `<runtime_note>` | conversational markdown (Phase 1, Phase 2, ..., Red Flags) |
| External-context loading | `@~/.claude/get-shit-done/workflows/<name>.md` (slash-include) | `references/` subdir per-skill (read-on-demand) |
| Body verbosity | very high (commands often 1-3 KB; workflows 5-77 KB) | low (SKILL.md cap = 100 lines) |

## Per-aspect winner

| Aspect | Winner | Why |
|:-------|:-------|:----|
| Brevity | dev-flow | 100-line cap preserves AI internalization |
| Granularity | GSD | per-tool allowlist + per-command agent routing aids security + observability |
| Phase explicitness | GSD | 9 named phases beat dev-flow's "Implement step does many things" |
| Mode flexibility | dev-flow | sprint-bulk batches G1+G2 once for multi-task sprints (GSD has no equivalent — every phase pays gate cost) |
| Cross-platform | (tied) | both Markdown-driven; GSD adds TypeScript SDK |
| Onboarding overhead | dev-flow | 24 surface assets vs GSD's 164 — much shorter learning curve |

## Net assessment

GSD is FUNDAMENTALLY DIFFERENT SCALE + COMPLEXITY:
- 164+ asset surface vs dev-flow's 24
- Full TypeScript SDK with tests + lint + scripts
- 5-language localization
- Phase pipeline assumes structured sequential workflow with persistent artifacts (PLAN.md, RESEARCH.md, VERIFICATION.md, REVIEWS.md, ROADMAP.md)
- Multi-team OSS project; dev-flow is single-author meta-repo

GSD VALIDATES the general direction (markdown-driven workflow definitions, agent + skill separation, structured commands) but the patterns are not generally portable to dev-flow's scale. Adopting GSD shape wholesale would 6x the surface area without proportional benefit.

## Per-pattern recommendation

| Pattern | Adopt for dev-flow? | Reason |
|:--------|:--------------------|:-------|
| 9-phase pipeline (sketch / spike / discuss / spec / plan / execute / verify / validate / ship) | **NO** | dev-flow's mode + gate model is appropriate at 24-asset scale. 9 named phases would force ceremony (per-phase artifacts) without commensurate value. Re-eval if dev-flow scale → GSD scale (~150+ assets). |
| `commands/` namespace separate from `skills/` | **NO** | dev-flow's `skills/` namespace covers the same surface. Splitting into commands/+skills/ duplicates dispatcher concerns. |
| XML-tagged command body (`<objective>`, `<routing>`, `<execution_context>`) | **CONSIDER for write-a-skill template** | XML tags improve agent parseability but hurt human readability. Could be adopted for skills that auto-trigger frequently (where AI parsing matters more than human reading). NOT a wholesale change. |
| `agent:` frontmatter field (per-command agent routing) | **NO** | dev-flow uses orchestrator dispatch-table; equivalent function. Avoids skill-author needing to know agent roster at write time. |
| `allowed-tools:` per-command tool allowlist | **DEFER** — re-eval at adopter scale | Useful at multi-developer scale; premature at single-author meta-repo. |
| `@~/.claude/...workflows/<name>.md` slash-include external context | **NO** | dev-flow's per-skill `references/` subdir does this with less syntactic overhead. |
| Persistent workflow artifacts (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md) | **NO** | dev-flow's `docs/sprint/SPRINT-NNN-*.md` + `docs/research/<topic>-<date>.md` covers the same ground without per-phase file proliferation. |
| Multi-language READMEs | **NO** | Out of scope for single-author repo |

## Bidirectional finding

**dev-flow's `sprint-bulk` mode batches G1+G2 once per sprint** for multi-task sprints. GSD has no equivalent — every phase pays gate cost. At sprint-of-N tasks scale, dev-flow saves N-1 gate ceremonies. **Record explicitly per Sprint 042 DEC-2 / Sprint 043 DEC-2 bidirectional pattern** to avoid future "match GSD per-phase ceremony" pressure.

## TASK-116 trigger-phrase candidates from GSD scan

GSD command names have rich naming surface. Sample lift candidates if dev-flow ever adds equivalent skills:
- "spike" — research/exploration trigger (no current dev-flow skill)
- "verify-work" — dev-flow has implicit verification in micro-task lines; could surface as explicit step
- "validate-phase" — sprint close DoD = same intent

NONE of these are in scope this sprint. Recording for future skill-creation work, NOT for TASK-116 (which only handles existing skill description rewords).

## Re-audit cadence

Re-fetch via gh CLI when GSD main SHA changes OR when dev-flow scale crosses 50+ assets (mid-point to GSD scale, would warrant pattern reconsideration). Bump SHA pin in this file + ADR-023.

## File-read ceiling check

Files actually read this T1 (per OQ-b 16-file ceiling):
- 4 GSD command files (ns-workflow, plan-phase, phase, sample plan-phase head)
- GSD CONTEXT.md (T2 will reread; counted once here)
- 5 dir listings (root, commands/gsd, get-shit-done/, get-shit-done/workflows, get-shit-done/contexts, .out-of-scope, agents)
- 3 dev-flow source confirmations (skill list, agent list, orchestrator skill structure cross-ref)

Within ceiling. T1 ends with sufficient resolution; no scope-stop needed.
