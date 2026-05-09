---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: ADR status change
status: decided
sprint: 050
---

# ADR-028: Init scaffold contract — `/orchestrator init` output set + bin/dev-flow-init.js convergence

**Date**: 2026-05-08
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 048 (ADR-026) established the user-project outcome lens. Sprint 048 retro Friction surfaced: missing init outputs — `.claude/settings.json` (with hook registration!) + `.gitignore` + `docs/` skeleton + codemap dir. Without settings.json, hooks dead day-1. Sprint 049 OQ-C locked the fix scope: full scaffold incl. docs/ skeleton + codemap/adr dirs.

**Recon (Sprint 050 promote):**

- `bin/dev-flow-init.js` is mature — already renders 8 templates + copies `.claude/` (incl. settings.json + settings.local.example.json) + copies `docs/blueprint/`. 4 stack presets + custom. Sibling tests exist at `bin/__tests__/dev-flow-init.test.js`.
- `/orchestrator init` skill phase was 3 lines: "Scaffold CLAUDE.md + CONTEXT.md + TODO.md from templates." Description grossly understated actual bin/dev-flow-init.js behavior (which produces 11 files + 2 dirs after this ADR lands). Skill drift from canonical implementation.
- **Real gaps (3):** (1) `.gitignore` not generated → user-project starts with cache files leaking into git; (2) `docs/codemap/` not pre-created → first PostToolUse codemap-refresh hook fires into a missing dir; (3) `docs/adr/` not pre-created → `/adr-writer` skill needs the dir.
- Plugin install vs scaffold-copy paths produce different scaffolds — plugin install relies on `hooks/hooks.json` auto-discovery; scaffold-copy users get hooks via `.claude/settings.json`. Both should converge on identical user-project outputs.

This ADR locks the canonical scaffold contract and the convergence rule.

## Decision

**1. Full init scaffold = 11 files + 2 empty dirs.**

| Path | Source | Why required day-1 |
|:-----|:-------|:-------------------|
| `.claude/CLAUDE.md` | template (rendered) | AI context bootstrap |
| `.claude/CONTEXT.md` | copied from dev-flow | Vocab + gates + modes + agent roster |
| `.claude/settings.json` | copied from dev-flow | Hook registration (scaffold-copy path) |
| `.claude/settings.local.json` | rendered from example | Per-machine + stack lint/typecheck |
| `TODO.md` | template (rendered) | Sprint tracker |
| `docs/{ARCHITECTURE,CHANGELOG,DECISIONS,AI_CONTEXT,SETUP}.md` | templates (rendered) | Doc skeleton |
| `docs/codemap/.gitkeep` | empty | codemap-refresh hook target |
| `docs/adr/.gitkeep` | empty | adr-writer skill target |
| `README.md` | template (rendered) | Project README |
| `.gitignore` | template (NEW Sprint 050) | Cache file + per-machine settings exclusion |

Future scaffold additions or removals re-evaluate against this list via new ADR; never silent edit.

**2. `.gitignore` content = minimal (dev-flow harness mandatory) + node common.** Mandatory entries: `.claude/settings.local.json` · `.claude/.session-changes.txt` · `.claude/.phase` · `.claude/STATE.yaml` · `.claude/STATE.yml` · `.claude/.lean-doc-cache.json` · `*.original.md` · `.DS_Store` · `Thumbs.db`. Node common (covers ~70% of typical user-projects without bloating): `node_modules/` · `dist/` · `build/` · `coverage/`. Users customize for python/cargo/go/etc post-init. Rejected alternative: full multi-stack template — too opinionated; project diversity defeats one-size-fits-all.

**3. Empty dirs use `.gitkeep` placeholder.** Standard convention; git tracks the dir; first commit can populate. Rejected alternatives: README.md placeholder (heavier; semantically wrong — these dirs aren't documentation surfaces themselves); dir-only (untracked until first content; codemap-refresh hook would fail on bare repo first commit).

**4. `/orchestrator init` skill phase delegates to `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js`.** Skill SKILL.md describes scaffold output (≤7 lines, fits 100-line cap); references/phases.md owns full procedure detail; canonical implementation = Node script. Single source of truth for content output. Future scaffold changes update one place (script + template + tests); skill description regenerates from script behavior.

## Alternatives considered

1. **Skill replicates script logic inline (no shell-out).** Rejected. Two sources of truth → drift risk; skill bloats past 100-line cap to cover 11-file generation; tests duplicate (skill flow vs script flow); no clear test boundary for skill-generated output. Script is canonical; skill delegates.

2. **Add `.husky/` git hooks template + `Dockerfile` template.** Rejected for Sprint 050. Both opinionated additions; user-project may not use husky or docker. Stays out of scope. ADR-028 § Decision-1 = the lock; future sprint can propose extension via new ADR.

3. **Generate `docs/USER-OUTCOMES.md` for user-project.** Rejected. dev-flow's outcome registry (8 categories) is meta-repo specific. User-projects may have entirely different outcome surfaces (e.g., a SaaS app cares about latency, churn, MRR — not "doc rot"). Forcing dev-flow's lens onto user-projects is the inverse of ISSUE-03 lesson.

4. **Add CLI flags to bin/dev-flow-init.js for non-interactive skill invocation.** Deferred (not rejected). Currently script uses readline interactive prompts. Skill invocation under Claude Code may or may not handle stdin piping cleanly. If friction surfaces in plugin-install path testing, add `--target=DIR --project=NAME --owner=ROLE --stack=PRESET` flags (Sprint 052+ tooling). Not Sprint 050 scope.

5. **Multi-stack `.gitignore` covering python/cargo/go/etc.** Rejected per OQ-A. Bloats template; user-projects pick one language stack; opinionated entries that don't apply add noise. Minimal + node common is honest default; user customizes.

## Consequences

**Positive:**
- Day-1 user-project harness complete: hooks register · codemap-refresh has dir · adr-writer has dir · cache files ignored by git from first commit.
- Skill flow + script flow converge on identical outputs (single source of truth = bin/dev-flow-init.js).
- Future scaffold changes have explicit ADR-amend path; no silent drift.
- `createEmptyScaffoldDirs` idempotent — re-running init on populated repo doesn't clobber user content.
- 3 sibling tests cover new behavior (TEMPLATE_MAP entry · createEmptyScaffoldDirs writes .gitkeep · idempotency).

**Negative (trade-offs accepted):**
- `.gitignore` template is node-leaning; python/cargo/go users get extra entries not relevant to their stack (low cost — extra entries don't break anything; user removes if pedantic).
- bin/dev-flow-init.js prompts interactively via readline — skill invocation under Claude Code Bash tool may need stdin piping or future CLI flag mode. Deferred.
- Skill init phase grew from 3 → 7 lines; orchestrator/SKILL.md cap usage 94 → 95 lines (under cap; tight).
- Rerun init on populated repo overwrites templates (CLAUDE.md, TODO.md, etc) — first prompt asks for overwrite confirm; user must say `y`. Acceptable; init is first-time-scaffold semantic.

**Neutral:**
- ADR-028 file at `docs/adr/ADR-028-init-scaffold-contract.md` per locked convention.
- ADR-019 lineage SHA pin unchanged.
- Plugin behavior unchanged for existing dev-flow-self use (we don't run init on ourselves; bin/dev-flow-init.js explicitly refuses target = REPO_ROOT).
- No new test framework; existing `node:test` + `node --test` invocation pattern preserved.

## References

- Sprint 050 plan: `docs/sprint/SPRINT-050-init-scaffold-full.md`
- Sprint 048 retro § Friction (init scaffold gap origin)
- Sprint 049 OQ-C (full scaffold lock)
- ADR-026 — User-Project Outcome Lens (which surfaced the gap)
- ADR-027 — Plugin coherence cleanup (predecessor; release-patch generalize)
- `bin/dev-flow-init.js` — canonical implementation
- `bin/__tests__/dev-flow-init.test.js` — sibling tests covering scaffold contract
- `skills/orchestrator/SKILL.md` § init Phase — skill description
- `skills/orchestrator/references/phases.md § init Phase` — full procedure detail
- `templates/gitignore.template` — Sprint 050 NEW
- Outcomes: O1 onboarding (day-1 harness ready) · O7 template/init (scaffold convergence)
