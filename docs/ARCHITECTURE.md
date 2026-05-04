---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04 (Sprint 046 T1 — EPIC-Audit Phase 5 refresh)
update_trigger: New mode, agent, skill, or harness script added; workflow phase or gate model changes
status: current
---

# Architecture — dev-flow

Load this file when: touching workflow phases · gate model · agent dispatch · harness hooks · skill binding.

dev-flow is a gate-driven workflow scaffold loaded as a Claude Code plugin — not an application. No server, no database, no build step. It runs entirely inside a Claude Code session. Plugin install is the primary distribution channel (ADR-010); skills/agents/hooks live at repo root for plugin auto-discovery.

## Component Map

| Component | Location | Single Responsibility |
|:----------|:---------|:----------------------|
| Orchestrator skill | `skills/orchestrator/SKILL.md` | Mode dispatch (init/quick/mvp/sprint-bulk), gate sequencing, agent dispatch |
| Task decomposer | `skills/task-decomposer/SKILL.md` | Freeform intent → structured TASK-NNN entries in TODO.md |
| Lean doc generator | `skills/lean-doc-generator/SKILL.md` | Sprint promote/execute/close + doc refresh (Step 0b date-sanity per ADR-016 spirit) |
| Codemap refresh | `skills/codemap-refresh/SKILL.md` + `scripts/codemap-refresh.ps1` | 3-tier codemap regen on git commit (Sprint 039) |
| Prime | `skills/prime/SKILL.md` | Ordered context loader (CLAUDE.md → CONTEXT.md → MEMORY.md → active sprint → CODEMAP.md L0) |
| Release patch | `skills/release-patch/SKILL.md` | PATCH bump lockstep `plugin.json` + `marketplace.json`; HARD STOP at git push |
| ADR / PR / security / TDD / diagnose / refactor / etc. | `skills/<name>/SKILL.md` | 17 user-invocable skills total (full list in `docs/codemap/CODEMAP.md` § L0-overflow) |
| Dispatcher agent | `agents/dispatcher.md` | Lead agent — only agent that spawns specialists (one-way dispatch per ADR-015) |
| Specialist agents | `agents/{design,code-reviewer,scope,security,performance,migration}-analyst.md` | 6 specialists; spawned by dispatcher; return summaries to dispatcher |
| Scaffold CLI | `bin/dev-flow-init.js` | One-command scaffold bootstrap for adopter repos (built-ins only per ADR-002) |
| SessionStart hook | `scripts/session-start.ps1` + `hooks/hooks.json` | Bootstrap verify (CLAUDE.md fail / settings.local + active sprint warn) — PowerShell-only per ADR-016 |
| Codemap PostToolUse hook | `scripts/codemap-refresh.ps1` + `hooks/hooks.json` | Auto-rebuild `docs/codemap/CODEMAP.md` + `handoff.json` on `Bash(git commit*)` (Sprint 039 TASK-098) |
| Chain-guard PreToolUse hook | inline Node in `hooks/hooks.json` | Block `git add && git commit` chains so lint hook fires |
| Eval harness | `scripts/eval-skills.js` + `__tests__/` | Structural-only; behavioral 3-arm port deferred to TASK-115 (Sprint 041 ADR-020) |
| Audit baseline | `scripts/audit-baseline.js` + `__tests__/` | Repo metrics snapshot for EPIC-Audit baselines |

## Key Patterns

**Gate-driven dispatch** — 2 human gates (G1 Scope · G2 Design) block all design-analyst / code-reviewer dispatch. Mode declares which gates fire (`init` none / `quick` G1 / `mvp` G1+G2 / `sprint-bulk` G1+G2 batched once per sprint). Full gate checklists in `.claude/CONTEXT.md` § Gates.

**One-way dispatch** (ADR-015) — only `dispatcher` agent spawns specialists. Specialists return to dispatcher; depth ≤ 2. Skills do NOT spawn agents directly.

**Replace-not-wrap CC primitives** (ADR-012) — `/review` → `code-reviewer` agent + `pr-reviewer` skill; `TaskCreate/List` → `TODO.md`; `/init` → orchestrator `init` mode. CC primitives ignored.

**Skill auto-discovery** — Claude Code plugin loader scans `skills/` + `agents/` + `hooks/` at repo root. No `MANIFEST.json` (removed); convention-over-configuration per ADR-010.

**Behavioral guidelines lineage** (Sprint 040 ADR-019) — 4 principles in `.claude/CLAUDE.md` § Behavioral Guidelines derive from `forrestchang/andrej-karpathy-skills` (MIT, SHA `2c606141936f`). Adaptation table + re-diff cadence in `.claude/CONTEXT.md` § Behavioral Guidelines Lineage.

**Negative-space surface** (Sprint 043 ADR-022) — `.out-of-scope/` directory at repo root holds pointer files for "considered + rejected" decisions; pointers cross-link back to the rejecting ADR.

## Integration Points

| Dependency | Type | Purpose |
|:-----------|:-----|:--------|
| Claude Code CLI | Runtime | Session host — skills, agents, hooks all run inside a Claude Code session via plugin install |
| Node.js ≥ 18 | Runtime | Harness scripts (`audit-baseline.js`, `eval-skills.js`, `bin/`); inline Node in PreToolUse chain-guard hook |
| PowerShell ≥ 5.1 | Runtime | SessionStart + PostToolUse hooks (Windows-only per ADR-016; replaces Node hooks killed Sprint 038) |
| Git | CLI | All hooks consume `git` events; `release-patch` skill verifies `git diff` before bump |
| `gh` CLI | CLI | External-ref fetches per Sprint 040 codified policy; primary tool for any GitHub fetch |

## Security Boundaries

- **No network access by default** — harness scripts are pure Node/PowerShell; no HTTP calls
- **Hook command allowlist** — `isHookCommandSafe()` in `bin/dev-flow-init.js` validates allowlist before writing `settings.json` to adopter repos (ADR-002)
- **Path traversal guard** — scaffold CLI resolved paths must stay within target directory
- **`.claude/settings.local.json` gitignored** — machine-specific allowlist never committed
- **HARD STOP at git push** — `release-patch` skill emits `git push` command for human; never invokes (reviewer can grep skill files for zero `git push` command-position invocations per Sprint 039 T4)
- **Read-guard removed** — Thin Coordinator Rule retained as principle in `.claude/CONTEXT.md`; no runtime enforcement (ADR-013 / ADR-016)

## Reference Files

- Workflow phases per mode → `skills/orchestrator/references/phases.md`
- Skill dispatch table (layers → skills) → `skills/orchestrator/references/skill-dispatch.md`
- Sprint protocols (promote / execute / close) → `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md`
- Lean documentation standard → `skills/lean-doc-generator/references/DOCS_Guide.md`
- Codemap (3-tier: CLAUDE.md L0 + `docs/codemap/CODEMAP.md` mid-tier + `docs/codemap/handoff.json` envelope) → `docs/codemap/CODEMAP.md`
- ADR registry → `docs/adr/ADR-NNN-*.md` (one file per ADR after ADR-016 per Sprint 043 DEC-7); historical ADR-001..015 in `docs/DECISIONS.md` (frozen)
- Negative-space pointers → `.out-of-scope/<slug>.md` per Sprint 043 ADR-022
