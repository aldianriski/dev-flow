---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: Versioning bump rules · skill-change protocol · breaking-change policy · contribution surfaces change
status: current
---

# Contributing to dev-flow

dev-flow is a Claude Code plugin (skill library + agent roster + gate-driven workflow). No app code, no runtime server. All contributions are Markdown, agents, hooks, or harness scripts.

Read [`.claude/CONTEXT.md`](.claude/CONTEXT.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before proposing changes.

## Versioning

The plugin uses semver in [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) (lockstep per ADR-006), and [`docs/CHANGELOG.md`](docs/CHANGELOG.md):

| Bump  | Triggers                                                                                  | Examples                                                              |
|:------|:------------------------------------------------------------------------------------------|:----------------------------------------------------------------------|
| MAJOR | Phase model change, gate model change, hook contract change, agent roster MAJOR breaking  | Removing a gate, renumbering modes, rewriting hook input contract     |
| MINOR | New mode, new agent, new skill, new hard-coded behavior surface                           | Adding a 5th mode, adding an 8th agent, adding a new skill            |
| PATCH | Clarification, prompt rewording, bugfix, doc improvement                                  | Fixing a typo, rewording a gate prompt, fixing a stale doc reference  |

Every version bump requires a [`docs/CHANGELOG.md`](docs/CHANGELOG.md) entry with rationale.

## Change process

1. Read [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md) § Current Focus to confirm your change is not blocked by an active sprint.
2. For MAJOR bumps: write an ADR documenting what changes and the migration path for adopters (`docs/adr/ADR-NNN-<slug>.md`).
3. Implement the change against the live surface — `skills/`, `agents/`, `hooks/`, `scripts/`, or `docs/`. There is no monolith blueprint file.
4. Bump `plugin.json` + `marketplace.json` in lockstep (ADR-006). Use `/release-patch` for PATCH bumps; manual edit for MINOR/MAJOR.
5. Prepend `docs/CHANGELOG.md` with the bump rationale before merge.
6. Submit PR via `/pr-reviewer` (skill) or the `code-reviewer` agent.

## Breaking-change policy

A **breaking change** is any MAJOR bump: phase model, gate model, hook contract, or agent dispatch contract change.

- **MAJOR** — requires ADR + migration path; `plugin.json` + `marketplace.json` bump in same PR.
- **MINOR** — `plugin.json` + `marketplace.json` lockstep bump + `docs/CHANGELOG.md` entry in same PR.
- **PATCH** — `docs/CHANGELOG.md` entry sufficient; lockstep bump optional if behavior unchanged (docs-only PATCH may skip per pending P2 fix in TODO.md).

Adopter pin surface: `plugin.json` `version` field — see [ADR-006](docs/DECISIONS.md). Non-negotiable contracts requiring MAJOR + ADR are listed in "What NOT to change" below.

## Skill changes

- Skill changes that alter agent behavior require eval evidence before merge (ADR-016 / ADR-021).
- Eval harness: `scripts/eval-skills.js` (structural-only today; behavioral 3-arm port queued as TASK-115 → Sprint 049, depends on TASK-116 acceptance harness → Sprint 048).
- Audit `description` field against the rules in [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Skill Authoring Standards: third-person, starts `Use when…`, ≤500 chars, never summarizes process.
- Line caps: `SKILL.md` ≤100 lines (overflow → `skills/<name>/references/`); `agents/*.md` ≤30 lines; `.claude/CLAUDE.md` ≤80 lines.

## Eval gate (queued)

Skill-behavior PRs require eval-evidence per ADR-021 DEC-4. Acceptance harness is **not yet wired** (TASK-116, Sprint 048). Until then, skill-behavior changes must include manual before/after demonstration in the PR body.

When TASK-116 lands, the harness lives at `tests/skill-triggering/`. Manual demonstration replaced by harness output reference. CI gate not yet enforced.

## What NOT to change

The following are **non-negotiable** and cannot be relaxed without a MAJOR bump and an ADR:

- The 2-gate model (G1 Scope · G2 Design) — see [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Gates
- The 4 workflow modes (`init` / `quick` / `mvp` / `sprint-bulk`) — see [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Modes
- The one-way agent dispatch rule (only `dispatcher` spawns specialists; depth ≤2) — ADR-015
- The `release-patch` HARD STOP at `git push` — see `skills/release-patch/SKILL.md`
- The PreToolUse `git add && git commit` chain-guard — see `hooks/hooks.json`
- The PowerShell-only hook policy on Windows — ADR-016

Rationale: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § Key Patterns + § Security Boundaries.

## Feedback channel

Friction reports are the primary feedback surface during v1 rollout. File via [`docs/SUPPORT.md`](docs/SUPPORT.md) template before opening a GitHub issue.

GitHub issues are reserved for confirmed bugs (reproduction steps verified). Feature requests go to TODO.md Backlog as new TASK-NNN entries via `/task-decomposer`.

## Quarterly maintenance

- Re-diff behavioral lineage against `forrestchang/andrej-karpathy-skills` `CLAUDE.md` upstream when it ships a minor or major update; bump verified-at SHA + date in [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Behavioral Guidelines Lineage.
- Run `/refactor-advisor skills/` and `/refactor-advisor agents/` quarterly.
- Check `last_updated` dates on doc files — anything >6 months gets a staleness pass via `/lean-doc-generator`.
