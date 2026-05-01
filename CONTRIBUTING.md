---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: Blueprint version bump protocol changes; new contribution category added; breaking-change policy added
status: current
---

# Contributing to dev-flow

## Blueprint versioning

The blueprint uses semver encoded in `docs/CHANGELOG.md` and `AI_WORKFLOW_BLUEPRINT.md`:

| Bump | What triggers it | Examples |
|:-----|:----------------|:---------|
| **MAJOR** | Phase model change, gate model change, hook contract change | Removing a gate, changing phase numbering, rewriting the hook input contract |
| **MINOR** | New mode, new agent, new skill, new hard stop | Adding a 7th mode, adding an 8th subagent, adding hard stop #28 |
| **PATCH** | Clarification, prompt rewording, fix, doc improvement | Fixing a typo, rewording a gate prompt, adding a stack to a customization table |

Every version bump requires a `docs/CHANGELOG.md` entry with the bump rationale.

## Blueprint change process

1. Open an issue describing the proposed change and its rationale.
2. For MAJOR bumps: document the migration path (what adopters must update).
3. Implement the change in `docs/blueprint/` — never edit the monolith (`AI_WORKFLOW_BLUEPRINT.md` is now a redirect).
4. Run `scripts/validate-blueprint.js` (Sprint 4) — every skill referenced in the phase binding matrix must exist in `.claude/skills/`, every agent in `.claude/agents/`.
5. Submit a PR. Changes that alter agent behavior require eval evidence (RED-GREEN-REFACTOR — see `docs/blueprint/05-skills.md §Skill Change Protocol`).
6. Update `docs/CHANGELOG.md` with the bump before merge.

## Breaking change policy

A **breaking change** is any MAJOR version bump: phase model, gate model, or hook contract change.

- **MAJOR**: requires an ADR documenting what changed and the migration path for adopters. `plugin.json` version must bump in the same PR.
- **MINOR**: `plugin.json` version bump + `docs/CHANGELOG.md` entry required in the same PR.
- **PATCH**: `docs/CHANGELOG.md` entry sufficient; `plugin.json` bump optional if behavior is unchanged.

Canonical adopter pin: `plugin.json` `version` field — see [ADR-006](docs/DECISIONS.md#adr-006). Non-negotiable contracts that cannot change without MAJOR + ADR are listed in "What NOT to change" below.

## Skill changes

- Skill changes that alter agent behavior require eval evidence before merge.
- Use the RED-GREEN-REFACTOR protocol: commit before/after snapshots, run `python evals/measure.py compare <before.json> <after.json>`, attach output to PR. See `docs/blueprint/05-skills.md §Skill Change Protocol`.
- Audit `description` field against agentskills.io rules: third-person, starts "Use when…", ≤500 chars, never summarizes process.

## Eval gate (CI-enforced)

PRs that touch any `.claude/skills/<name>/SKILL.md` file **must** include all three of the following in the same PR diff, or CI fails:

1. **Before snapshot** — `evals/snapshots/<skill>/<task-id>-before.json` (committed before the skill change)
2. **After snapshot** — `evals/snapshots/<skill>/<task-id>-after.json` (committed after the skill change)
3. **Run record** — `evals/runs/<task-id>.md` containing `python evals/measure.py compare <before.json> <after.json>` output

For **new skills** (no before state): omit the before snapshot and document the absence in the run record. The after snapshot and run record are still required.

Gate script: `.claude/scripts/check-eval-gate.js` — runs automatically in CI on `pull_request` events.

## What NOT to change

The following are **non-negotiable** and cannot be relaxed without a MAJOR version bump and an ADR:
- The 3-gate model (Gate 0, Gate 1, Gate 2)
- The 6 workflow modes
- The 27 hard stop catalog
- The Thin-Coordinator Rule (§1 — dispatcher never Reads source files in compact-vulnerable phases)

Rationale: [`context/workflow/DESIGN_PHILOSOPHY.md`](context/workflow/DESIGN_PHILOSOPHY.md).

## Feedback (until v2)

Friction reports are the primary feedback channel while dev-flow is in internal v1 rollout. File a friction report before opening a GitHub issue. See [`docs/SUPPORT.md`](docs/SUPPORT.md) for the template and filing rules.

GitHub issues are for confirmed bugs only (reproduction steps verified). Feature requests go in `STRATEGY_REVIEW.md` as new R-N entries.

## Quarterly maintenance

- Re-audit `context/research/ADAPTATION_NOTES.md` when superpowers ships a minor or major update.
- Run `/refactor-advisor .claude/skills/` and `/refactor-advisor .claude/agents/` quarterly.
- Check `last-validated` dates on all skills — anything >6 months gets a staleness pass.
