---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: ADR status change
status: decided
sprint: 048
---

# ADR-026: User-Project Outcome Lens — outcome-first framing for plugin development

**Date**: 2026-05-08
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

dev-flow ran 47 sprints (governance + EPIC-Audit + foundation hardening + ext-ref deep-dives + close). Every sprint optimized plugin internals — line caps, ADR registry hygiene, skill-trigger discipline, gate semantics, eval-evidence rule, lineage credit, batch-archive friction, etc. Plugin shipped to team and is in active use.

In session 2026-05-08 the user surfaced **ISSUE-03 (critical, strategic)**:

> The breakdown work focuses on optimizing the plugin internals. The actual goal is to make the user's project optimal when using this plugin. The plugin is a means; user project quality is the end. After I use I think this plugin not solve the main project usage, but POV is only to maintain only this plugin.

Audit confirmed the symptom across multiple surfaces:

- `README.md` § What You Get sells **counts** (17 skills · 7 agents · 2 gates · 3 hooks · 4 scripts) — describes *what plugin is*, not *what user-project gets*.
- `README.md` § Skills table column = "Trigger / Purpose" — describes what skill *does*, not user-project *benefit*.
- `TODO.md` Backlog § P0 v1 ship prep = TASK-115 (caveman 3-arm eval) + TASK-116 (skill-triggering acceptance harness). Both are internal correctness measurement; outcome for user-project never stated.
- `.claude/CLAUDE.md` § Definition of Done = G2 verified · 0 blocking · CONTEXT updated · ADR for hard-to-reverse · line caps held. Zero user-project outcome check.
- `.claude/CONTEXT.md` § Gates G1 = goal stated · size · constraints · skill red flags. No user-project outcome check.
- Plugin live on team; dogfood-on-self only — confirmation bias risk. No outcome ever declared, so no outcome ever measured.

The plugin became self-referential. Sprints optimized the optimizer. Without a stated user-project outcome attached to each component, contributors (human + AI) had no anchor against which to judge whether a proposed change was worth the cost. Cap discipline + ADR lineage discipline filled the void — but those are *plugin-internal* hygiene, not user-project value.

This ADR closes that gap structurally. It does not add new behavior; it adds a **lens** through which all current and future plugin work is justified.

## Decision

**1. Outcome-first lens adopted as canonical framing.** Every plugin component (skill · agent · gate · hook · script) MUST state ≥1 user-project outcome it supports, plus non-tautological **counter-evidence** (skip-when scenario where another component or no component is better fit). The lens applies retroactively to existing components (handled in Sprint 048 T1) and prospectively to all new components.

**2. Eight outcome categories canonical (O1–O8).**

| ID | Outcome | One-line definition |
|:--:|:--------|:--------------------|
| O1 | Faster onboarding | New contributor productive day-1 in unfamiliar repo |
| O2 | Less doc rot | Docs reflect current code; stale frontmatter caught |
| O3 | Clearer architecture | Shared mental model of modules + boundaries + decisions |
| O4 | Fewer rework cycles | Scope/design issues caught BEFORE implementation |
| O5 | Optimal harness flow | Workflow runs end-to-end without friction |
| O6 | Workflow correction | Mid-flight redirect when work goes off-track |
| O7 | Template / init audit | Every new project starts from same scaffold baseline |
| O8 | Plugin reliability | Plugin updates don't regress user-project workflows |

O1–O4 are the core user-named set (session AskUserQuestion); O5–O7 are user-supplied additions; O8 is the reframe of prior `[internal]`-tagged work (eval harness, acceptance tests). Categories may be revised — revision goes through new ADR not silent edit (per `docs/adr/` convention lock, ADR-022 + ADR-025 DEC-6).

**3. `docs/USER-OUTCOMES.md` is the canonical registry.** New components are PR-blocked at review without a registry row. The registry is the single source of truth for outcome→component mapping. Cross-referenced from README, CLAUDE.md anti-patterns, CONTEXT.md principles, and per-component docs as components add them.

**4. G1 Scope checklist gains "user-project outcome named" item.** CONTEXT.md § Gates G1 picks up: `[ ] User-project outcome named (≥1 of O1-O8 per docs/USER-OUTCOMES.md)`. Forces every task to declare which user-project benefit it claims, before execution begins. Applies to `quick`, `mvp`, and `sprint-bulk` modes (G1-firing modes).

**5. Eval harness reframed under O8 plugin reliability; Node ports replace PowerShell plan.** TASK-115 + TASK-116 stay v1 ship prerequisites (eval-evidence rule per ADR-016 + ADR-021 DEC-4 unchanged) but framing shifts from `[internal]` to user-project outcome O8 (plugin updates don't regress user-project workflows). Implementation switches from PowerShell port (TASK-116 original plan) to Node ≥18 (`scripts/eval-acceptance.js` + `scripts/eval-caveman.js`) — matches existing `scripts/audit-baseline.js` + `scripts/eval-skills.js` precedent; cross-platform; PowerShell retained ONLY for hooks per ADR-016 boundary.

## Alternatives considered

1. **Leave framing as-is; trust dogfood signal.** Rejected. ISSUE-03 explicitly: "this plugin not solve the main project usage, but POV is only to maintain only this plugin." Dogfood-on-self is confirmation bias. Without explicit outcome statements, every future contribution drifts toward plugin-internal optimization — same root cause that produced ISSUE-03.

2. **External telemetry of user-project metrics.** Rejected. Plugin runs in user's terminal — cannot observe user repo state, PR cycle time, or onboarding velocity. Privacy + technical infeasibility. Outcomes are *claimed* + *counter-evidenced*, not *measured*. (Honest scope recorded in USER-OUTCOMES.md § Anti-outcomes.)

3. **Outcome claimed only, no counter-evidence (skip-when).** Rejected. Without a stated "skip when…" each outcome claim is unfalsifiable marketing. Counter-evidence forces honest scope: declaring when another component or no component is better fit. BS risk minimized; reviewer rejects tautological skip-whens (e.g., "skip when not needed").

4. **Defer outcome lens to v1.1; ship v1 on internal eval first.** Rejected. Framing must precede implementation. Shipping v1 without outcome lens means v1 release notes lead with internal counts, repeating ISSUE-03 root cause at marketing surface. Lens-first reorder pushes v1 ship by 1 sprint (was Sprint 050 → now Sprint 051) — acceptable trade for clean v1 framing.

5. **Per-skill outcome sections inline in each SKILL.md.** Rejected. Cross-skill consistency requires single registry; 17 separate sections drift over time. USER-OUTCOMES.md is the canonical registry; per-skill docs cross-link rather than duplicate.

## Consequences

**Positive:**
- Every future PR forces a user-project outcome statement at G1 — contributors (human + AI) cannot ship plugin-internal optimization without justifying user-project value.
- Release notes can lead with outcomes (not internals) — v1 marketing matches reality (plugin-as-means, user-project-as-end).
- Eval harness work (TASK-115 + TASK-116) keeps v1 prerequisite status but under honest framing (O8 plugin reliability) instead of `[internal]`.
- Counter-evidence discipline (skip-when) prevents cargo-cult adoption — users learn when *not* to use a component, which deepens informed use of the rest.
- USER-OUTCOMES.md becomes the cross-component coherence anchor: future ADRs / sprints can reference O1-O8 by ID without re-defining.

**Negative (trade-offs accepted):**
- Registry maintenance overhead — each new component PR adds a row + must justify counter-evidence. Mitigated by review-time gate (light cost; structural prevention of drift).
- Outcome categories may need revision at scale (e.g., ≥30 skills may surface new outcome dimensions). Revision path = new ADR (per convention lock); not a silent edit.
- v1 ship date pushed by 1 sprint (Sprint 050 → 051). Lens-first reorder accepted as right call; v1 marketing coherence > 1-sprint timeline.
- Outcomes are claimed not measured — reviewer trust + dogfood-on-team are the validation surface. Plugin layer cannot instrument user repos.

**Neutral:**
- Plugin behavior (skills · agents · hooks · scripts) UNCHANGED this sprint. Lens applies retroactively via documentation; no executable change.
- ADR-026 file at `docs/adr/ADR-026-user-project-outcome-lens.md` per convention lock. Sequential allocation discipline held (max ADR was 025; 026 free).
- ADR-019 verify-step contract preserved — Behavioral Guidelines Lineage relocated to `.claude/references/` (Sprint 048 T5) is a pure file move; SHA pin + verified-at date unchanged.
- Plugin version unchanged this sprint (docs/governance only). Future v1 release CHANGELOG entry will cite this ADR as the lens origin.

## References

- ISSUE-03 origin: user session 2026-05-08 (transcript captured in Sprint 048 plan § Why this sprint exists).
- Outcome registry: [docs/USER-OUTCOMES.md](../USER-OUTCOMES.md).
- README outcome-first reframe: [README.md § What Your Project Gets](../../README.md).
- CLAUDE.md anti-pattern: [.claude/CLAUDE.md § Anti-Patterns](../../.claude/CLAUDE.md) — `❌ Plugin-internal optimization without stated user-project outcome`.
- CONTEXT.md principle + G1 item: [.claude/CONTEXT.md](../../.claude/CONTEXT.md) § Agentic Engineering Principles · § Gates G1.
- Sprint 048 plan: [docs/sprint/SPRINT-048-user-project-outcome-lens.md](../sprint/SPRINT-048-user-project-outcome-lens.md).
- Predecessor framing decisions: ADR-016 (eval-evidence rule) · ADR-021 DEC-4 (acceptance harness) · ADR-022 (`docs/adr/` convention lock) · ADR-025 DEC-7 (v1 ship prep unblocked).
- Re-eval cadence: revisit at scale milestone (≥30 skills) OR if a new component cannot fit any of O1-O8 → trigger outcome-category revision ADR.
