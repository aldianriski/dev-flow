---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: ADR status change
status: decided
sprint: 053
---

# ADR-030: Template Canonical Ownership — `templates/` is the single source of truth for doc shape

**Date**: 2026-05-09
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

dev-flow has multiple skills that emit doc-shaped output (TODO.md rows, ARCHITECTURE.md, CLAUDE.md, etc.):
- `task-decomposer` writes TASK-NNN rows to TODO.md Backlog. Format authority: inline in `decomposition-spec.md § Output Format Template`.
- `lean-doc-generator` writes core docs (README, ARCHITECTURE, DECISIONS, SETUP, AI_CONTEXT, TODO, CHANGELOG, CLAUDE.md). Format authority: inline format examples in `DOCS_Guide.md § 2 Core Files`.
- `bin/dev-flow-init.js` (orchestrator init path) writes initial scaffold. Format authority: `templates/<X>.md.template` files via `applySubstitutions`.

Three independent format authorities for the same doc shapes. Predictable consequences:

- **Sprint 051b** rewrote `templates/CLAUDE.md.template` against ADR-029 (CA+DDD canonical) — but `/lean-doc-generator` regenerating CLAUDE.md continued to produce pre-051b style because it generated from inline format examples in `DOCS_Guide.md`, not from the template. User surfaced the drift mid-Sprint-052.
- **task-decomposer + templates/TODO.md.template** define the same TASK row format independently. Adding a new field (e.g., `sprint-created:` in Sprint 052 F5(A)) required updating both paths.
- **No backflow** between task-decomposer and lean-doc Sprint Promote — Backlog-empty case silently proceeds without redirect to /task-decomposer.

Sprint 052 T7 fold-in (user-surfaced) added a `Canonical template` column to `DOCS_Guide.md § 2 Core Files` (pointer-only) + a "template-as-canonical-format rule" paragraph. Pointer-reference closed user-visible drift but the actual generation logic still uses inline formats. ADR-030 locks the canonical-ownership decision so Sprint 053 implementation has a stable contract.

## Decision

**1. lean-doc-generator OWNS `templates/` as canonical format source.** When a Core File has a template entry in `DOCS_Guide.md § 2`, the template IS the authoritative format definition. Inline format examples in skill references are non-authoritative — they MAY illustrate the shape for the agent's mental model but MUST NOT contradict the template. Template wins on divergence.

**2. Consumers READ before write.** `task-decomposer` (Step 6) and `orchestrator init` (`bin/dev-flow-init.js applySubstitutions`) consume `templates/<X>.md.template` at output time. Both invoke a Read before generating. Both honor the format the template specifies.

**3. Behavioral contract for `type: rigid` skills.** "Read template at gen time" means the AI agent performing the skill issues a Read tool call. Verification covers: (a) frontmatter field order, (b) section order, (c) substitution token alignment. Behavioral, not mechanical — type:rigid skills cannot do file I/O directly; agents fulfill the contract.

**4. Missing template → graceful degrade.** WARN the user; fall back to inline format from skill reference; flag as friction at sprint close. Hard-stop would break docs without templates (TEST_SCENARIOS.md, sprint files, module READMEs are intentionally template-less per `DOCS_Guide.md § 2 — column "no template"`).

**5. Bidirectional Sprint Promote handoff.** lean-doc Sprint Promote Step 1.2 (Sprint 053 T2) prompts user to invoke `/task-decomposer` if Backlog is empty. Soft guard with default halt. task-decomposer Step 6 already defers sprint formation to lean-doc Sprint Promote (existing). Coordination loop closed.

## Alternatives considered

1. **Per-skill inline formats — keep status quo.** Rejected. 2-source-of-truth drift surfaced explicitly at Sprint 051b → 052 (CLAUDE.md template diverged from /lean-doc output for ~1 sprint window). Sprint 052 retro pattern candidate: `Self-reported status: current ≠ actually-current`. Same drift class.

2. **Centralized doc-format service (separate skill `format-authority`).** Rejected. Over-engineered for plugin scope. Adds skill count + invocation hop. lean-doc-generator already owns doc format domain — natural fit for canonical authority.

3. **Templates advisory only (not authoritative).** Rejected. Defeats the purpose. If templates can be ignored, the format-authority gap remains. Authoritative status is what gives templates value as drift prevention.

4. **Templates only at init; skill regenerations use skill-internal format.** Rejected. Init scaffold + ongoing skill output diverging is THE drift problem we're solving. Same template MUST drive both paths.

5. **Migrate inline formats to templates/ + delete skill-reference inline format examples entirely.** Rejected for now (Sprint 053 scope). decomposition-spec.md keeps surrounding framing (Source · Scope-analyst impact · Assumptions confirmed · dependency graph · approve flow) — those ARE skill-specific output structure, not doc format. Only the TASK row format duplicates templates/TODO.md.template; that specific duplication is replaced with a pointer in Sprint 053 T1.

## Consequences

**Positive:**
- Cross-skill consistency — single template change propagates to all consumers automatically (no longer 3 paths to update).
- ADR-029 (CA+DDD canonical) propagates correctly — Sprint 051b template edits now flow through /lean-doc-generator regenerations as well as init.
- Drift prevention — agents reading template at gen time mechanically prevents inline-format/template divergence.
- Outcomes mapped: O5 flow (skills collaborate cleanly) · O7 template/init (single canonical source) · O8 reliability (template-as-truth not 2-source).

**Negative (trade-offs accepted):**
- Cross-file navigation cost — decomposition-spec.md no longer self-contained for TASK row format; reader must follow pointer to templates/TODO.md.template. Mitigation: comment block in decomposition-spec.md lists field names inline (summary, not full format).
- All consumer skills break simultaneously if `templates/` removed or restructured. Mitigation: graceful-degrade fallback (DEC-3) + missing-template friction logging at sprint close.
- Behavioral enforcement only (Sprint 053). Automated lint that detects "skill output diverges from template" is deferred to TASK-116-v2 (Sprint 054 acceptance harness) per Sprint 052 carry-forward.
- Templates `templates/DECISIONS.md.template` + `templates/SETUP.md.template` + `templates/CHANGELOG.md.template` not validated against DOCS_Guide.md format spec since Sprint 051b. Sprint 053 T5 pre-checks; surfaced drift flagged for TASK-125 Sprint 053b broader audit.

**Neutral:**
- ADR-030 file at `docs/adr/ADR-030-template-canonical-ownership.md` per locked convention (Sprint 043 DEC-7 + Sprint 047 DEC-6). ID verified non-colliding (max ADR was 029 post-Sprint-051a).
- Sprint 053 T1-T4 implement the decision. T5 validates. ADR-030 locks decision atomically with implementation.

## References

- ISSUE origin: user session 2026-05-08 finding "this 2 skills not collaborate and have different pattern" + user finding 2026-05-09 mid-Sprint-052 "templates not wired to lean-doc" → Sprint 052 T7 fold-in pointer-only → Sprint 053 deeper integration.
- ADR-029 — CA+DDD canonical lean architecture (Sprint 051a; templates/CLAUDE.md.template + ARCHITECTURE.md.template re-rendered Sprint 051b).
- ADR-027 — Plugin coherence cleanup (Sprint 049; release-patch generalize).
- ADR-028 — Init scaffold contract (Sprint 050; templates copy-on-init via copyScaffold).
- Sprint 051b plan: `docs/sprint/SPRINT-051b-lean-architecture-templates-primer.md` — template re-render against ADR-029.
- Sprint 052 T7 fold-in: `DOCS_Guide.md § 2 Core Files` Canonical-template column added (pointer-only).
- Sprint 053 plan (this sprint): T1-T5 implement deeper template-load contract.
- Outcomes: O5 flow · O7 template/init · O8 reliability (USER-OUTCOMES.md).
- TASK-116-v2 (Sprint 054): automated lint deferred — detects skill-output ↔ template divergence.
- TASK-125 (Sprint 053b): broader feature-usage audit picks up DECISIONS/SETUP/CHANGELOG drift if surfaced at T5.
- Re-evaluation cadence: re-eval if user-project at scale ≥30 contributors surface template-rigidity friction OR if templates/ becomes dependency-locked (e.g., versioned external schema).
