---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-29
update_trigger: sprint open / close / status change
status: complete
plan_commit: —
close_commit: —
---

# Sprint 024 — plugin-lean-doc

**Theme:** Plugin-first distribution release + lean-doc v2 adoption in dev-flow project docs.
**PRD:** Internal — ADR-010 (plugin distribution decision) + TODO.md history (TASK-102 acceptance).

---

## Plan

### T1 — TASK-102: Plugin release — marketplace.json + root-level paths

**Why:** Primary adoption friction is manual git clone + init script. Plugin distribution enables single-command install. Decision logged in ADR-010.

**Acceptance:**
1. `.claude-plugin/marketplace.json` created — schema v1.0, plugins array: name, description, version, source.type=git, source.url, source.path
2. `skills/` at repo root — mirrors all skill dirs from `.claude/skills/`. Canonical source stays `.claude/skills/`
3. `agents/` at repo root — mirrors all agent `.md` files from `.claude/agents/`
4. `hooks/` at repo root — contains `hooks.json` from `.claude/hooks/` or settings hooks block
5. `plugin.json` version bumped to `1.9.0`
6. `validate-scaffold.js` gains check: `skills/` + `agents/` + `hooks/` present at repo root
7. README adoption section updated: replace broken plugin install with working two-step (`/plugin marketplace add aldian/dev-flow` → `/plugin install dev-flow@aldian/dev-flow`)
8. Local smoke test: `claude --plugin-dir .` loads skills without error

**Files (likely):** `.claude-plugin/marketplace.json` · `skills/` (root mirror) · `agents/` (root mirror) · `hooks/hooks.json` · `plugin.json` · `.claude/scripts/validate-scaffold.js` · `README.md`

**Tests:** validate-scaffold check added; smoke test passes

**Risk:** medium — plugin loader path convention needs verification against `context/research/CC_SPEC.md` before writing paths

**Depends on:** none (ADR-010 done)

**ADR needed:** ADR-010 (done — plugin-first distribution)

**DoD:**
- [x] marketplace.json committed and schema-valid
- [x] Root `skills/` + `agents/` + `hooks/` present and match `.claude/` contents
- [x] `plugin.json` version = `1.9.0`
- [x] `validate-scaffold.js` check passes on clean scaffold
- [ ] README install steps verified manually *(Gate 2 — human)*
- [ ] Smoke test passes *(Gate 2 — human: `claude --plugin-dir .`)*

**Confidence:** 70% — plugin loader path convention uncertain; verify CC_SPEC.md first

---

### T2 — TASK-104: Apply lean-doc v2 to dev-flow project docs (progressive)

**Why:** dev-flow's own docs should demonstrate the standard it promotes. `docs/AI_CONTEXT.md` missing required v2 sections (Context Abstract, Context Load Order, Navigation Guide, Doc Scope Map). Sprint file format established with this sprint.

**Acceptance:**
1. `docs/AI_CONTEXT.md` updated: add `## Context Abstract` (4-line block) + `## Context Load Order` + `## Navigation Guide` (query routing table) + `## Doc Scope Map` sections per lean-doc v2 Step 6 requirements
2. `docs/ARCHITECTURE.md` verified: first section has load trigger declaration ("Load this file when:")
3. Ownership headers in all core docs verified: `update_trigger` is specific and actionable (not "when things change")
4. `docs/sprint/` directory established with this sprint file as first entry
5. Full TODO.md migration to pointer-only Active Sprint format — **deferred to Sprint 025** (too much blast radius to combine with T1)

**Files (likely):** `docs/AI_CONTEXT.md` · `docs/ARCHITECTURE.md` · `docs/sprint/SPRINT-024-plugin-lean-doc.md`

**Tests:** none (doc-only change)

**Risk:** low — additive changes only; no existing content removed

**Depends on:** TASK-103 (lean-doc consolidation, done)

**ADR needed:** no

**DoD:**
- [x] AI_CONTEXT.md has all 4 required v2 sections
- [x] ARCHITECTURE.md has load trigger declaration in first section
- [x] All core doc ownership headers have specific `update_trigger` values
- [x] Sprint file format established (this file = first entry)

**Confidence:** 90%

---

## Execution Log

- TASK-102 done 2026-04-29: skills/, agents/, hooks/ mirrored to root via cp -r; hooks/hooks.json uses ${CLAUDE_PLUGIN_ROOT} paths; marketplace.json schema v1.0 created; plugin.json bumped 1.8.0→1.9.0; validate-scaffold Check 9 added; 18/18 tests green; README two-step install updated.
- TASK-104 done 2026-04-29: AI_CONTEXT.md already had all 4 v2 sections (added Sprint 23); updated stale ## Current Focus (Sprint 18→Sprint 24); all core doc update_trigger fields verified specific; sprint dir established with this file as first entry.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `hooks/hooks.json` | TASK-102 | new — plugin-distribution hooks with ${CLAUDE_PLUGIN_ROOT} paths | low | no |
| `skills/` (root) | TASK-102 | new — mirror of .claude/skills/ for plugin distribution | low | no |
| `agents/` (root) | TASK-102 | new — mirror of .claude/agents/ for plugin distribution | low | no |
| `.claude-plugin/marketplace.json` | TASK-102 | new — schema v1.0 marketplace entry | low | no |
| `.claude-plugin/plugin.json` | TASK-102 | version 1.8.0 → 1.9.0 | low | no |
| `.claude/scripts/validate-scaffold.js` | TASK-102 | Check 9 added — plugin root dirs presence | low | yes |
| `.claude/scripts/__tests__/validate-scaffold.test.js` | TASK-102 | 2 new tests for Check 9 (pass + fail); scaffold() updated | low | yes |
| `README.md` | TASK-102 | adoption section: two-step plugin install | low | no |
| `docs/AI_CONTEXT.md` | TASK-104 | ## Current Focus updated (Sprint 18→Sprint 24); last_updated bumped | low | no |

---

## Decisions

*(append during sprint — architectural or significant tactical decisions)*

---

## Open Questions for Review

*(append during sprint — surface to Tech Lead at next pause)*

---

## Retro

*(fill at sprint close — Worked / Friction / Pattern candidate)*
