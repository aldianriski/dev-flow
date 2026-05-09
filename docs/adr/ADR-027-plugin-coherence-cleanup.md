---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: ADR status change
status: decided
sprint: 049
---

# ADR-027: Plugin coherence cleanup — drop redundant skill, tag plugin-internal skill, rename confused skill

**Date**: 2026-05-08
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 048 (ADR-026) shifted dev-flow to a user-project outcome lens. Re-applying that lens to existing plugin surface in the post-Sprint-048 user session immediately surfaced 6 plugin-coherence findings. User locked a 7-sprint clean split (Sprint 049 → 055) covering all 6 fixes; Sprint 049 = first slice (3 small wins).

**Findings closed by this ADR (the 3 in Sprint 049 scope):**

1. **`dev-flow-compress` is redundant.** The caveman plugin (`caveman:compress`) provides identical functionality — in-place caveman-style compression of CLAUDE.md / memory files with `<stem>.original.md` backup. Two skills covering one concern is a harness-flow regression (O5 fail per ADR-026 outcome lens). Verified equivalence: both skills overwrite-with-backup; pass-through rules for paths/URLs/code/version-strings are equivalent in scope.

2. **`release-patch` is plugin-internal only.** The skill bumps `.claude-plugin/plugin.json` + `marketplace.json` in lockstep — fields that exist only on Claude Code plugins. For ~95% of user-projects (consumers, not plugin authors) the skill produces nothing useful. Counter-evidence in USER-OUTCOMES.md was previously weak ("skip when docs-only diff") and did not name the plugin-only contract.

3. **`system-design-reviewer` vs `design-analyst` confusion.** Two architecture-review surfaces with overlapping descriptions: skill is ad-hoc grill mode (one-question-at-a-time interview); agent is auto-G2 design plan. Same bucket, different role. Users guessed wrong at G1 selection. Rename clarifies role; skill behavior unchanged.

**Findings deferred to Sprints 050-052 per locked split** (NOT decided here):

- F3 init scaffold enrichment (settings.json + .gitignore + docs/ skeleton + codemap/adr dirs) — Sprint 050.
- F6 task-decomposer ↔ lean-doc-generator template lineage unification — Sprint 051.
- F4 wire orphan skills (tdd / refactor-advisor / diagnose / zoom-out / prime / release-manager) into orchestrator phase detection — Sprint 052.
- F5 tech-debt rollover loop (TODO.md `## Tech Debt` section + sprint-close auto-promote Retro Friction) — Sprint 052.

## Decision

**1. Drop `dev-flow-compress`; `caveman:compress` becomes the canonical compression skill.** Skill directory deleted; SKILL.md + references/procedure.md removed. SETUP.md cross-ref replaced (`/dev-flow-compress` → `/caveman:compress`). USER-OUTCOMES.md row removed; skill count 17 → 16. README skills table row removed. CLAUDE.md File Structure block updated (`17 SKILL.md files` → `16`). Historical files (sprint plans / ADRs / CHANGELOG / audits / blueprints / research notes) UNTOUCHED per Sprint Close Protocol immutability + Surgical Changes principle. Plugin version bump = MINOR on next release (skill removed counts as MINOR per CLAUDE.md Quick Rules semver).

**2. Generalize `release-patch` — auto-detect manifest cascade across plugin / npm / python / cargo / go / flat modes.** Skill version 1.0.0 → 2.0.0 (breaking behavior shift, justified by lens). Detection cascade at Step 2 (priority: plugin > npm > python > cargo > go > flat). Per-mode bump logic in `skills/release-patch/references/version-detection.md` (keeps SKILL.md ≤100 lines per cap). Plugin-only steps (lockstep verify · MEMORY refresh · CONTEXT drift check) gated on `mode = plugin`; general modes skip them. CHANGELOG path detection (plugin → `docs/CHANGELOG.md`; general → `CHANGELOG.md` / `CHANGES.md` / `HISTORY.md` at repo root, default Keep-a-Changelog if none). HARD STOP push gate emits mode-aware message. USER-OUTCOMES.md counter-evidence updated to `Skip when: no version manifest detected at all` (skill prompts + exits clean). README marker `(plugin-internal)` REMOVED. v1.x `release-version` queued task DROPPED — release-patch covers the same scope. ADR-016 + ADR-021 eval-evidence rule applies: behavior change must be verified by acceptance harness landing Sprint 053 (TASK-116-v2). Sprint 049 ships the change; eval-evidence catches up retroactively.

**3. Rename `system-design-reviewer` → `architecture-grill`.** Directory renamed (`git mv`); SKILL.md `name:` field + H1 + description updated. Description leads with `Use when stress-testing a proposed or existing architecture via grill mode (one-question-at-a-time interview)…` and explicitly distinguishes from `design-analyst` (auto-G2 plan agent). Skill version bumped 1.0.0 → 2.0.0 (rename = breaking trigger change for downstream callers; semver MAJOR on the skill itself, MINOR on plugin per skill-rename convention). Cross-refs updated in skills/diagnose/SKILL.md (description), README.md (skills table), USER-OUTCOMES.md (skills row). Output format heading `System Design Review` → `Architecture Grill`. Internal review-lens content unchanged. Historical files UNTOUCHED.

## Alternatives considered

1. **Keep `dev-flow-compress` with sharper counter-evidence.** Rejected. Two skills covering one concern is the structural problem; sharpening counter-evidence ("skip when caveman:compress suffices") leaves the redundancy and adds reviewer burden. Drop is cleaner.

2. **Keep `dev-flow-compress` as a deprecation stub pointing to `caveman:compress`.** Rejected. Stub adds maintenance surface for ~zero benefit (project is internal; no external consumers). CHANGELOG entry on next release-patch run is sufficient migration signal.

3. **Tag `release-patch` plugin-internal only; queue separate `release-version` general skill v1.x.** Initial Sprint 049 plan. Reversed mid-execution after user pushback ("can we make release patch is skills more general? so we can use for user also for optimal improvement flow this plugin?"). Rejected because: (a) two skills covering one concern (semver bump) duplicates ADR-027 DEC-1 dev-flow-compress lesson; (b) shipping tag-only delays user-project utility by N sprints with no functional gain; (c) generalization is moderate scope (~100 SKILL.md lines + ~150 reference lines), fits Sprint 049 expanded budget. Generalize NOW preferred over queue-and-defer.

4. **Delete `release-patch` entirely.** Rejected. Plugin uses release-patch for plugin-self releases. Generalizing preserves plugin behavior (mode = plugin maintains v1.0.0 semantics) while extending coverage.

5. **Fold `system-design-reviewer` into `design-analyst` (single skill with grill flag).** Rejected. design-analyst is an AGENT; system-design-reviewer was a SKILL. Different invocation surfaces (auto-dispatch vs user-invoked). Folding them collapses the agent/skill distinction (per CONTEXT.md vocabulary). Rename preserves the distinction while fixing naming confusion.

6. **Keep `system-design-reviewer` name; just clarify in docs.** Rejected. Name itself is the friction — "system design reviewer" reads as "review a system's design," same role as design-analyst. Better cross-refs cannot fix a wrong name. Rename surfaces grill semantics in the trigger phrase itself (`/architecture-grill`).

## Consequences

**Positive:**
- Skill surface area shrinks (17 → 16) without functionality loss; one less skill to discover, document, audit.
- `release-patch` now covers user-project semver bumps across 6 manifest types (plugin / npm / python / cargo / go / flat) — outcome row applies to ~95% of typical user-projects, not 5%. v1.x `release-version` queued task dropped; one skill covers all.
- `architecture-grill` trigger surfaces the actual semantic (grill = stress-test interview) rather than the generic `system-design-reviewer`. Distinction from `design-analyst` agent now legible in the trigger itself.
- 3 small Sprint 048 retro Friction items closed structurally, not papered over.

**Negative (trade-offs accepted):**
- Skill rename is a breaking trigger change for any external user typing `/system-design-reviewer`. Project is internal; no external consumers identified; CHANGELOG entry on next release-patch run flags the rename.
- Plugin gets MINOR bump (skill removal + skill rename + skill behavior change in release-patch) per Quick Rules semver. Bump must be MANUAL — release-patch SKILL handles PATCH only (excludes MINOR/MAJOR by design).
- release-patch v2.0.0 behavior change ships before acceptance harness lands (Sprint 053 TASK-116-v2). ADR-016 + ADR-021 eval-evidence rule violated in spirit (behavior change merged without harness pass). Mitigation: plugin-mode path is unchanged from v1.0.0 (Sprint 030 lockstep contract preserved; existing plugin self-release flow not affected); general-mode paths are net-new with no prior behavior to regress against. Acceptance harness retroactively verifies all 6 modes when it lands.
- Per-mode bump logic adds 6 detection paths to skill scope. TOML / JSON parsing edge cases (pre-release suffixes, dynamic versions, workspace inheritance) handled in `references/version-detection.md` § Edge cases. Coverage of all edge cases not exhaustive at v2.0.0; iterate as user-project use surfaces issues.

**Neutral:**
- Historical files (~25 mention `system-design-reviewer`, ~30 mention `dev-flow-compress`) UNTOUCHED per Sprint Close Protocol. Future grep-by-name searches will surface historical hits — acceptable; sprint plans + ADRs + CHANGELOG are timeline records, not active surfaces.
- Codemap `handoff.json` regenerates automatically via PostToolUse hook on commit; manual codemap-refresh not required.
- ADR-019 + ADR-026 verify-step contracts unchanged (no lineage relocation this sprint).
- ADR-027 file at `docs/adr/ADR-027-plugin-coherence-cleanup.md` per locked convention (ADR-022 + ADR-025 DEC-6).

## References

- Sprint 048 retro § Open Questions for Review — origin of 6 findings (3 closed here, 3 deferred to Sprints 050-052).
- ADR-026 — User-Project Outcome Lens (the lens that surfaced these findings).
- USER-OUTCOMES.md § Skills — registry rows updated for all 3 changes.
- README.md § Skills table + § What You Get — count + entries updated.
- Sprint 049 plan: `docs/sprint/SPRINT-049-coherence-cleanup-rename.md`.
- Successor sprints: 050 (F3 init scaffold) · 051 (F6 template unify) · 052 (F4+F5 wiring + improvement loop).
- v1.x backlog: `release-version` general skill (post-v1-ship).
- Predecessor: ADR-026 DEC-3 reframed `release-patch` outcome to O8 plugin reliability — Sprint 049 sharpens the counter-evidence to make the plugin-only scope explicit.
