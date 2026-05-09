---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: ADR-028 contract change · scaffold output change · stack preset added/removed
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); rewritten Sprint 053c (TASK-132) post-ADR-028 / Sprint 050 init canonical lock; supersedes pre-Sprint-050 init-analyst agent workflow
---

## §16 — INIT Mode — Project Bootstrap (post-ADR-028)

> **When to use**: Greenfield bootstrap — `.claude/` does not exist in target repo.
> After INIT completes, the project is indistinguishable from an existing one. Use `/orchestrator` from Sprint 1 onwards.

### Canonical contract (ADR-028)

```bash
node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js
```

`bin/dev-flow-init.js` is the **single source of truth** for INIT scaffold output. Both invocation paths converge on the same artifacts:

- **Plugin-install path**: `/orchestrator init` skill → executes the script.
- **Scaffold-copy path**: user runs the script directly.

Skill SKILL.md describes scaffold output ≤7 lines; full procedure detail lives in `skills/orchestrator/references/phases.md § init Phase`. This primer covers the **what + why**; canonical implementation = the script.

### Scaffold output (11 files + 2 empty dirs)

| Path | Source | Purpose |
|:-----|:-------|:--------|
| `.claude/CLAUDE.md` | `templates/CLAUDE.md.template` (rendered) | Project AI context |
| `.claude/CONTEXT.md` | dev-flow `.claude/CONTEXT.md` (copied) | Vocab · gates · modes · agent roster |
| `.claude/settings.json` | dev-flow `.claude/settings.json` (copied) | Harness config + hook registration |
| `.claude/settings.local.json` | `settings.local.example.json` (rendered) | Per-machine settings + lint/typecheck per stack preset |
| `TODO.md` | `templates/TODO.md.template` (rendered) | Sprint tracker |
| `docs/ARCHITECTURE.md` | `templates/ARCHITECTURE.md.template` | Component map · key patterns |
| `docs/CHANGELOG.md` | `templates/CHANGELOG.md.template` | Release history (Keep-a-Changelog) |
| `docs/DECISIONS.md` | `templates/DECISIONS.md.template` | ADR registry index |
| `docs/AI_CONTEXT.md` | `templates/AI_CONTEXT.md.template` | Patterns · conventions · current focus |
| `docs/SETUP.md` | `templates/SETUP.md.template` | Local dev setup |
| `docs/codemap/.gitkeep` | empty | codemap-refresh hook target dir |
| `docs/adr/.gitkeep` | empty | adr-writer skill target dir |
| `README.md` | `templates/README.md.template` (rendered) | Project README |
| `.gitignore` | `templates/gitignore.template` | dev-flow harness + node common entries |

### Stack presets

Script prompts at runtime:

| Preset | Layers | lint | typecheck | pkg manager |
|:-------|:-------|:-----|:----------|:------------|
| `node-express` | api, service, repository, middleware, model | `npm run lint` | `npx tsc --noEmit` | npm |
| `react-next` | api, hook, component, page, store, infrastructure | `npm run lint` | `npx tsc --noEmit` | npm |
| `python-fastapi` | api, service, repository, middleware, model | `ruff check .` | `mypy .` | pip |
| `go-gin` | api, service, repository, middleware, model | `go vet ./...` | `go build ./...` | go |
| `custom` | user-supplied | user-supplied | user-supplied | user-supplied |

`lint` + `typecheck` wired into `.claude/settings.local.json` PreToolUse hooks for `Bash(git commit*)` — fire before any commit lands.

### Convergence rule

Plugin install path delivers hooks via `hooks/hooks.json` auto-discovery (no `settings.json` required). Scaffold-copy path delivers identical hooks via `.claude/settings.json` (user has no plugin install). Script copies dev-flow's `.claude/settings.json` verbatim — identical hook registration content for both paths.

### Idempotency

- `createEmptyScaffoldDirs` — preserves existing `.gitkeep` files; safe to re-run.
- `renderSettingsLocal` — writes `.new` suffix if existing `settings.local.json` present (per-machine config never overwritten).
- Other templates DO overwrite — INIT is intended for first-time scaffold; re-running on a populated repo requires user to confirm overwrite at first prompt.

### Post-init handoff

After scaffold lands, next session run `/prime` to verify load + emit health check (see `skills/prime/SKILL.md`). Sprint 1 onwards uses `/orchestrator` Path A (Active Sprint) or Path B (freeform → task-decomposer).

---

### Cross-references

- **Canonical contract**: ADR-028 (`docs/adr/ADR-028-init-canonical-script.md`)
- **Procedure**: `skills/orchestrator/references/phases.md § init Phase`
- **Skill entrypoint**: `skills/orchestrator/SKILL.md § Phases § init`
- **Script source**: `bin/dev-flow-init.js`
- **Templates owner**: lean-doc-generator (per ADR-030 template canonical ownership)
