---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: dev-flow skill count crosses 20 OR mattpocock CONTEXT.md changes shape
status: current
---

# Mattpocock — bucket migration cost + CONTEXT.md reconcile

**Sprint:** 043 T2 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | License |
|:--------|:-------|:--------|:--------|
| `mattpocock/skills` | gh CLI raw + dir listings | `b843cb5ea74b` (upstream main) | MIT |
| `dev-flow` | local `skills/`, `agents/`, `.claude/CONTEXT.md` (HEAD) | `db88a40` (Sprint 043 T1) | — |

---

# Part A — Bucket migration cost / benefit

## mattpocock bucket structure (verified)

| Bucket | Skill count | Skills |
|:-------|:-----------:|:-------|
| `engineering/` | 10 | diagnose, grill-with-docs, improve-codebase-architecture, setup-matt-pocock-skills, tdd, to-issues, to-prd, triage, zoom-out, (+ README) |
| `productivity/` | 3 | caveman, grill-me, write-a-skill (+ README) |
| `misc/` | 4 | git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit (+ README) |
| `personal/` | (excluded from index — author's private skills) | — |
| `deprecated/` | 4 | design-an-interface, qa, request-refactor-plan, ubiquitous-language (+ README) |

Per-bucket README explains scope + lists skills + links to each `SKILL.md`. Mechanical to generate; aids new-contributor onboarding. Coupled to bucket adoption — only meaningful if buckets adopted.

## dev-flow current scale

```
skills/  : 17 skills (adr-writer, codemap-refresh, dev-flow-compress, diagnose,
           lean-doc-generator, orchestrator, prime, pr-reviewer, refactor-advisor,
           release-manager, release-patch, security-auditor, system-design-reviewer,
           task-decomposer, tdd, write-a-skill, zoom-out)
agents/  : 7 agents (code-reviewer, design-analyst, dispatcher, migration-analyst,
           performance-analyst, scope-analyst, security-analyst)
Total surface: 24 (17 skills + 7 agents)
```

**Threshold lock from OQ-c: 20 skills.** Current 17 < 20 — defer adoption. Phases 4e (Sprint 044 GSD) and 4f (Sprint 045 skill-creator wrapper) may add new skills; if either lands a new skill, threshold could be hit mid-EPIC. ADR-022 must explicitly acknowledge EPIC-Audit completion (Sprint 047) triggers a re-check.

## Proposed bucket placement (FOR REFERENCE — not landed this sprint)

If/when bucketing approved, proposed dev-flow layout:

| Bucket | Skill count | Skills |
|:-------|:-----------:|:-------|
| `governance/` | 6 | adr-writer, lean-doc-generator, orchestrator, release-manager, release-patch, write-a-skill |
| `engineering/` | 6 | diagnose, tdd, refactor-advisor, system-design-reviewer, pr-reviewer, security-auditor |
| `productivity/` | 4 | prime, dev-flow-compress, codemap-refresh, zoom-out |
| `misc/` | 1 | task-decomposer (unique-domain framing — no clean bucket) |

**Note:** `agents/` directory remains separate (different dispatch mechanics per CONTEXT.md Agent Roster — agents are spawned by dispatcher, not user-invokable like skills). Bucketing `agents/` is a separate question; defer.

## Migration cost matrix

| Migration step | Cost | Risk | Mitigation |
|:---------------|:----:|:----:|:-----------|
| Move 17 `skills/<name>/` → `skills/<bucket>/<name>/` | low (mechanical `git mv`) | medium (history-preserving move requires care) | Use `git mv`; verify history preservation per Sprint 035 atomic-rename precedent |
| Update plugin auto-discovery pattern in `.claude-plugin/plugin.json` | medium | high | plugin loader scans `skills/` — verify whether sub-bucket discovery works OR requires manifest update |
| Cross-link breakage in SKILL.md content (skill-to-skill refs) | medium | medium | grep all `skills/` references; auto-update via sed or manual sweep |
| `hooks/hooks.json` path drift (codemap-refresh, run-hook scripts) | low | low | hooks point to `scripts/`, not `skills/`; no drift |
| `bin/dev-flow-init.js` scaffold path drift | medium | medium | scaffold copies `skills/<name>/` — must update glob pattern |
| `agents/` moves — Y/N? | n/a (defer) | n/a | Out of scope for this evaluation |
| docs cross-refs from CLAUDE.md + CONTEXT.md | low | low | `CLAUDE.md § File Structure` references `skills/`; update list |
| External-doc cross-refs from README.md | low | low | README example commands reference `skills/`; sweep |
| `skill-dispatch.md` (orchestrator references) | medium | medium | maps layer → skills; bucket addition orthogonal but worth aligning |
| `docs/codemap/CODEMAP.md` regen | low | low | `scripts/codemap-refresh.ps1` regenerates on commit (Sprint 039); will pick up new paths automatically |

**Net cost estimate:** S–M sprint with checklist (~6 substantive items); high coordination risk on plugin auto-discovery. Sprint should land all moves atomically (single commit with all `git mv` + manifest updates) per Sprint 035 atomic-rename precedent.

## Recommendation (Part A)

**Defer bucket adoption until 20-skill threshold per OQ-c lock.**

Re-eval triggers documented for ADR-022:
- dev-flow skill count = 20 (currently 17)
- OR first skill marked deprecated (forces deprecated/ adoption regardless of count)
- OR EPIC-Audit completion (Sprint 047) — explicit re-check checkpoint to avoid silently kicking the can

If bucketing adopted in a future sprint:
- Use Sprint 035 atomic-rename precedent (single sprint, atomic commit)
- Land bucket README files mechanically via script (one per bucket, lists skills with one-line descriptions)
- Keep `agents/` separate (different dispatch mechanics; out of bucket scope)

---

# Part B — `CONTEXT.md` reconciliation

## mattpocock CONTEXT.md (verbatim, 26 lines)

```markdown
# Matt Pocock Skills

A collection of agent skills (slash commands and behaviors) loaded by Claude
Code. Skills are organized into buckets and consumed by per-repo configuration
emitted by `/setup-matt-pocock-skills`.

## Language

**Issue tracker**:
The tool that hosts a repo's issues — GitHub Issues, Linear, a local `.scratch/`
markdown convention, or similar. Skills like `to-issues`, `to-prd`, `triage`,
and `qa` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker** — a bug, task, PRD,
or slice produced by `to-issues`.
_Avoid_: ticket (use only when quoting external systems that call them tickets)

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (e.g.
`needs-triage`, `ready-for-afk`). Each role maps to a real label string in the
**Issue tracker** via `docs/agents/triage-labels.md`.

## Relationships

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time

## Flagged ambiguities

- "backlog" was previously used to mean both the *tool* hosting issues and the
  *body of work* inside it — resolved: the tool is the **Issue tracker**;
  "backlog" is no longer used as a domain term.
- "backlog backend" / "backlog manager" — resolved: collapsed into **Issue
  tracker**.
```

## Section-level matrix

| Section | mattpocock | dev-flow | Reconciliation |
|:--------|:----------:|:--------:|:---------------|
| Lead intro / repo description | ✓ (3 lines) | ✓ ("Single source of truth for vocabulary, principles, gates, modes") | NO LIFT — different domains |
| **§ Language / Vocabulary** | ✓ (3 issue-tracker terms) | ✓ (8 meta-repo terms: gate, mode, skill, agent, red-flag, vertical-slice, deep-module, grill) | NO OVERLAP. mattpocock terms are project-domain (issue tracker); dev-flow terms are workflow-domain (gates/modes). Different problem space — no merge needed |
| `_Avoid_` annotation pattern | ✓ ("_Avoid_: backlog manager, ...") | ✗ | **LIFT CANDIDATE 1** — explicit "what NOT to call this" guidance. Useful for naming-collision avoidance |
| **§ Relationships** | ✓ (2 directional relationships) | ✗ (relationships scattered across Modes table + Agent Roster + Gates) | **LIFT CANDIDATE 2** — explicit relationship section captures gate ↔ mode, agent ↔ skill, dispatcher ↔ specialist |
| **§ Flagged ambiguities** | ✓ (2 resolved-name-history entries) | ✗ (ambiguity history lives in ADRs only) | **LIFT CANDIDATE 3** — capture resolved-name-history surface (Sprint 035 ADR-014 rename, Sprint 039 codemap-refresh skill-vs-script). Aids new-contributor onboarding |
| § Principles | ✗ | ✓ (6 Agentic Engineering Principles) | NO LIFT (dev-flow superior) |
| § Gates | ✗ | ✓ (G1, G2 with checklists) | NO LIFT |
| § Modes | ✗ | ✓ (4 modes table) | NO LIFT |
| § Agent Roster | ✗ | ✓ (7 agents table) | NO LIFT |
| § Skill Authoring Standards | ✗ | ✓ (5 standards) | NO LIFT |
| § Behavioral Guidelines Lineage (Sprint 040 add) | ✗ | ✓ (4-principle adaptation table + MIT attribution) | NO LIFT |

## Lift recommendations

| # | Lift | Source | Target dev-flow location | Cost | Value |
|:-:|:-----|:-------|:-------------------------|:----:|:-----:|
| 1 | `_Avoid_:` annotation pattern in Vocabulary | mattpocock § Language | `.claude/CONTEXT.md` § Vocabulary entries | S (~8 entries × 1 line each) | medium — avoids naming-collision drift over time |
| 2 | § Relationships section | mattpocock § Relationships | new section in `.claude/CONTEXT.md` between § Modes and § Agent Roster | S (~5–7 directional bullets) | medium — explicit relationship graph aids agent reasoning |
| 3 | § Flagged ambiguities | mattpocock § Flagged ambiguities | new section at end of `.claude/CONTEXT.md` | S (~3–5 entries — Sprint 035 rename + Sprint 039 codemap-refresh + others) | high — pointer to resolved name history; new-contributor onboarding |

**Discipline lock (per OQ-e):** ALL THREE recommendations are ADDITIVE ONLY — no existing dev-flow CONTEXT.md section is replaced. Edits NOT landed this sprint; ADR-022 captures recommendations; future sprint executes with re-prime + agent-context refresh checklist (CONTEXT.md is read by every agent — ripple risk).

## Recommendation (Part B)

**Adopt 3 ADDITIVE lifts (recorded as recommendations in ADR-022; NOT executed this sprint).**

Future implementation sprint (proposed name: TASK-117 or similar) lands:
1. `_Avoid_` annotations on existing § Vocabulary entries
2. NEW § Relationships section (between Modes and Agent Roster)
3. NEW § Flagged ambiguities section (end of file) seeded with Sprint 035 rename + Sprint 039 codemap-refresh + at-most-2 other historical resolved ambiguities

OQ-e additive-only discipline preserved: existing 8 sections of CONTEXT.md untouched; new content appends.

---

# Combined recommendation feeding T4 (ADR-022)

- **DEC-4 (T2-PartA):** DEFER bucket adoption per OQ-c 20-skill threshold. Re-eval triggers: skill count = 20, first skill marked deprecated, OR EPIC-Audit completion (Sprint 047). Migration cost matrix documented for future implementation sprint.
- **DEC-5 (T2-PartB):** ADOPT 3 ADDITIVE CONTEXT.md lifts as RECOMMENDATIONS (not executed this sprint): `_Avoid_` annotations, § Relationships, § Flagged ambiguities. Future TASK lands edits with re-prime checklist.

## Re-audit cadence

Re-evaluate bucket adoption when skill count = 20 OR first skill marked deprecated. Re-fetch mattpocock CONTEXT.md when upstream main SHA changes; bump SHA pin in this file + ADR-022.
