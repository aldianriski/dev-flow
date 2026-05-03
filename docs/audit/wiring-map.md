---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03
update_trigger: New mode, agent, skill, or hook added; phase model changes; dispatch table edited
status: current
---

# Wiring Map — Gate × Mode × Agent × Skill × Hook

End-to-end wiring trace for the dev-flow workflow. Single source of truth for what binds to what. Generated as part of EPIC-Audit Phase 2 (Sprint 36).

Source files audited:
- `skills/orchestrator/SKILL.md` — mode + phase + agent dispatch tables
- `skills/orchestrator/references/phases.md` — gate output formats
- `skills/orchestrator/references/skill-dispatch.md` — layer → advisory skill table
- `agents/*.md` — 7 agent definitions
- `skills/*/SKILL.md` — 14 skill definitions
- `hooks/hooks.json` — plugin hooks
- `.claude/settings.json` — project-local hooks

---

## Modes — phase × agent × skill

### `init` (no gates)

| Phase | Agent | Skill | Hook |
|:------|:------|:------|:-----|
| 1. Check `.claude/` doesn't exist | — | — | — |
| 2. Scaffold from templates (`CLAUDE.md`, `CONTEXT.md`, `TODO.md`) | — | — | — |
| 3. Confirm with human → done | — | — | — |

Notes: no agents auto-spawn. Pure scaffold work. Optional follow-up: `/task-decomposer --from-architecture` if user has an architecture doc.

### `quick` (G1)

| Phase | Agent | Skill | Hook |
|:------|:------|:------|:-----|
| 1. Parse — restate as verifiable goal | — | — | — |
| 2. G1 Scope — checklist | `scope-analyst` (auto, if size unclear) | advisory via `skill-dispatch.md` (layers → skills) | — |
| 3. Implement | — | layer-bound skills (advisory only) | PreToolUse `Bash(git add*)` chain-guard fires on stage |
| 4. Review | `code-reviewer` (auto) — preloads `pr-reviewer` skill | `pr-reviewer` (preloaded by agent) | — |
| 5. Commit | — | `lean-doc-generator` (always-on after commit) | `Bash(git commit*)` lint hook (per-stack, in `settings.local.json`) |

### `mvp` (G1 + G2)

| Phase | Agent | Skill | Hook |
|:------|:------|:------|:-----|
| 1. Parse | — | — | — |
| 2. G1 Scope | `scope-analyst` (auto, if size unclear) | advisory via `skill-dispatch.md` | — |
| 3. Grill (when requirements unclear) | — | — | — |
| 4. G2 Design | `design-analyst` (auto) | `adr-writer` if hard-to-reverse decision | — |
| 5. Implement | — | layer-bound skills (advisory) | PreToolUse `Bash(git add*)` chain-guard |
| 6. Review | `code-reviewer` (auto) — preloads `pr-reviewer` | `pr-reviewer` | — |
| 7. Commit | `performance-analyst` (propose if api/db/hot-path + high risk); `migration-analyst` (propose if DB schema change) | `lean-doc-generator` (always-on); `release-manager` if version bump | `Bash(git commit*)` lint; `Bash(git push*)` typecheck |

Notes: `security-analyst` never auto-spawns. User invocation via `/security-review` in a separate session per Red Flag #5 (context contamination prevention). Same shape across `quick` and `mvp`.

---

## Hook Coverage

| Event | Matcher | Command | Source | Status |
|:------|:--------|:--------|:-------|:-------|
| `SessionStart` | — | (removed Sprint 038 ADR-016; PS replacement TASK-101) | `hooks/hooks.json` | removed |
| `PreToolUse` | `Bash(git add*)` | inline node — block `git add && git commit/push` chain | `hooks/hooks.json` | live |
| `PreToolUse` | `Bash(git add*)` | inline node — same chain-guard | `.claude/settings.json` | live (development redundancy — works without plugin loaded) |
| `PreToolUse` | `Bash(git commit*)` | `[your-lint-command]` | `.claude/settings.local.example.json` (per-machine) | template |
| `PreToolUse` | `Bash(git -C * commit*)` | `[your-lint-command]` | `.claude/settings.local.example.json` | template |
| `PreToolUse` | `Bash(git push*)` | `[your-typecheck-command]` | `.claude/settings.local.example.json` | template |
| `PreToolUse` | `Bash(git -C * push*)` | `[your-typecheck-command]` | `.claude/settings.local.example.json` | template |

Sprint 34 obra/superpowers probe: `startup|clear|compact` matcher recommendation — confirmed wired (with `resume` added). Sprint 35 drift fix: dead `Read|Grep|Glob` → `read-guard.js` hook removed from `.claude/settings.json` (file deleted by ADR-013); not regressed.

T3 verdict: **no patch needed** per Sprint 36 Q2 lock. Hook surface is minimal and correct.

---

## Skill bundle coverage (T2 cross-check)

`skills/orchestrator/references/skill-dispatch.md` advertises three sets:

### dev-flow Meta-Repo Layers — bundled?

| Layer | Skill | Bundled? |
|:------|:------|:---------|
| `docs` | `lean-doc-generator` | ✓ `skills/lean-doc-generator/SKILL.md` |
| `governance` | `lean-doc-generator` · `adr-writer` | ✓ both |
| `skills` | `lean-doc-generator` | ✓ |
| `agents` | `lean-doc-generator` | ✓ |
| `templates` | `lean-doc-generator` | ✓ |
| `harness` · `scripts` | none | n/a |
| `ci` | `pipeline-builder` | **✗ NOT BUNDLED** — likely table mis-categorization (should be in adopter section, or removed) |

### Skills Not Bundled With dev-flow (adopter section)

| Layer | Skill | Bundled? (must be ✗) |
|:------|:------|:--------------------|
| `api` | `api-contract-designer` | ✗ correct |
| `fe` · `components` · `ui` | `fe-component-builder` · `fe-design-engineer` | ✗ correct |
| `fe` (a11y) | `fe-accessibility-auditor` | ✗ correct |
| `fe` (motion) | `fe-motion-designer` | ✗ correct |
| `be` · `service` · `repository` | `be-service-scaffolder` | ✗ correct |
| `database` · `data` | `data-model-designer` · `query-optimizer` | ✗ correct |
| `security` | `security-auditor` | **✓ BUNDLED** — `skills/security-auditor/SKILL.md` exists. Mis-placed in adopter section. |
| `observability` · `logging` | `observability-setup` | ✗ correct |
| `etl` · `pipeline` | `etl-pipeline-builder` | ✗ correct |
| `analytics` | `analytics-schema-designer` | ✗ correct |

### Always-On — bundled?

| When | Skill | Bundled? |
|:-----|:------|:---------|
| post-implement | `code-reviewer` | ✓ — but `code-reviewer` is an **agent** in `agents/`, not a skill in `skills/`. Mis-categorized (agent listed in skill-dispatch table). |
| after commit | `lean-doc-generator` | ✓ |
| hard-to-reverse decision | `adr-writer` | ✓ |

### Findings (3 mismatches)

1. **`pipeline-builder`** referenced under meta-repo `ci` layer — not bundled. Should move to adopter section or remove (ci layer arguably has no advisory skill in dev-flow's bundle).
2. **`security-auditor`** placed in adopter section but actually bundled at `skills/security-auditor/SKILL.md`. Should move to a meta-repo or always-on row (preloaded by `security-analyst` agent in `/security-review` session).
3. **`code-reviewer`** listed as a skill in Always-On but is an agent. The actual skill is `pr-reviewer` (preloaded by the agent). Either rename row or note dual nature.

T2 verdict: 3 fixes warranted. Scope ≤5 lines per fix → **patch in T2 directly** rather than carry to T6.

---

## Skills not bound to any auto-dispatch phase

| Skill | Binding | Disposition |
|:------|:--------|:------------|
| `orchestrator` | the workflow itself (consumer of all bindings) | intentional |
| `task-decomposer` | invoked at orchestrator Path B (freeform → no active task) + manual `/task-decomposer` | intentional |
| `system-design-reviewer` | on-demand at Gate 1 design or via `/system-design-reviewer` | intentional |
| `pr-reviewer` | preloaded by `code-reviewer` agent during Review phase | intentional (preload pattern) |
| `security-auditor` | preloaded by `security-analyst` agent in `/security-review` session | intentional (preload pattern) |
| `refactor-advisor` | on-demand `/refactor-advisor` | intentional |
| `release-manager` | on-demand `/release-manager` (semver + changelog) | intentional |
| `adr-writer` | mvp Phase 4 G2 (auto-suggest if hard-to-reverse decision) + on-demand | intentional |
| `lean-doc-generator` | always-on after commit + sprint promote/close | intentional |
| `dev-flow-compress` | on-demand `/dev-flow:compress <file>` (out-of-band, sub-command form) | intentional (out-of-band) |
| `diagnose` | on-demand `/diagnose` | intentional |
| `tdd` | on-demand `/tdd` (Implement phase aid) | intentional |
| `zoom-out` | on-demand `/zoom-out` (orientation, pre-G1) | intentional |
| `write-a-skill` | on-demand `/write-a-skill` (meta) | intentional |

**Zero unintentional orphans.** All 14 skills have an invocation path.

---

## Agents not bound to any auto-dispatch phase

| Agent | Binding | Disposition |
|:------|:--------|:------------|
| `dispatcher` | lead — runs the workflow itself | intentional |
| `design-analyst` | mvp Phase 4 G2 (auto) | intentional |
| `code-reviewer` | quick Phase 4 + mvp Phase 6 (auto) | intentional |
| `scope-analyst` | G1 (auto, if size unclear) | intentional |
| `performance-analyst` | mvp Phase 7 commit (propose) | intentional |
| `migration-analyst` | mvp Phase 7 commit (propose) | intentional |
| `security-analyst` | user-invoked via `/security-review` (separate session) | intentional |

**Zero unintentional orphans.** All 7 agents are bound.

---

## Contract candidates (T6 input)

Patterns observed during trace that could be lockable as ADR-015 substance:

1. **Auto-dispatch direction is one-way: dispatcher → specialist agents.** No agent dispatches another. Every specialist returns output to the dispatcher; the dispatcher decides next step. Worth locking? — would prevent future skill from chaining `design-analyst → code-reviewer` in one call.

2. **Preload pattern for cross-session skills.** Two agents (`code-reviewer`, `security-analyst`) are thin wrappers that preload a fork-context skill (`pr-reviewer`, `security-auditor`). The skill carries the heavy logic; the agent is the dispatch shim. Worth locking? — would standardize how future heavy skills get agent-callable.

3. **`security-analyst` MUST run in a separate session.** Red Flag #5 prevents context contamination. This is a hard contract — already ADR-implicit (Sprint 32 ADR work). Worth promoting to explicit ADR if not already.

4. **Skills not in skill-dispatch table = on-demand only.** 10 of 14 skills don't appear in any auto-dispatch row. Implicit rule: only dispatch-table-listed skills get advisory surfacing at G1. Worth locking? — would clarify when a skill author needs to add their skill to the dispatch table.

T6 ADR-015 decision: substantive contract candidate exists (#1 or #2 most natural). **Lean toward writing ADR-015 covering items #1 + #4.** Final call at T6.

---

## Summary

- **Modes**: 3 (init/quick/mvp) — all phases mapped to their bound agent + skill + hook.
- **Agents**: 7 — all bound (6 auto/propose, 1 user-only `security-analyst`).
- **Skills**: 14 — all have invocation paths (4 auto-bound to phases or always-on, 10 on-demand including 2 preloaded by agents).
- **Hooks**: 2 live in plugin (`hooks/hooks.json`) + 1 redundant in `.claude/settings.json` + 4 templates in `settings.local.example.json` for adopter customization.
- **Mismatches**: 3 in `skill-dispatch.md` (T2 patch). Zero unintentional orphans.

End-to-end wiring is consistent. Phase 2 verification: **PASS** with 3 dispatch-table fixes.
