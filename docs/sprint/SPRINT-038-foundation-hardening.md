---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: e8a475b
close_commit: tbd
---

# Sprint 038 — Foundation Hardening (hook surgery + cache)

**Theme:** Kill fragile Node hooks (loader:1368 root cause = Windows space-path), lock doc routing scaffold, add lean-doc cache. Foundation for Sprint 039 codemap+modes+skills work.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 037 closed `c75a520`.
**Successor:** Sprint 039 (Codemap + Modes + Skills) — depends on this sprint's hook + cache foundation.

---

## Why this sprint exists

Five compounding pressures hit the foundation layer simultaneously:

1. **Node hook fragility on Windows space-path.** `loader:1368` Node module resolution fails when `${CLAUDE_PLUGIN_ROOT}` / `$CLAUDE_PROJECT_DIR` contain a space (user's home is `C:\Users\HYPE AMD\…`). Five fix attempts across prior sprints failed to land cleanly. Decision: stop patching Node invocations, kill them.
2. **Doc routing has no machine-readable contract.** lean-doc-generator picks placement (HOW vs WHY vs WHERE vs WHO + L0 overflow) by skill prose only. A `_routing.json` schema lets the skill load a deterministic table.
3. **session-start.js + read-guard.js are the only two Node scripts left.** Both invoked from hooks. Both impossible to fix on the affected paths. Removing the invocations is the only stable resolution.
4. **No replacement SessionStart yet.** Killing the Node hook leaves SessionStart bootstrap unfilled. PowerShell variant is the native-on-Windows answer with zero loader risk.
5. **lean-doc-generator re-scans every file every invocation.** No cache. Becomes painful as the doc surface grows. Hash-keyed in-session cache is cheap to add and unblocks Sprint 039 codemap rebuilds that ride the same scan path.

Sprint 039 (codemap base knowledge, sprint-bulk mode, /prime, /release-patch) needs: a working SessionStart hook on Windows, no Node in hooks, the doc routing contract, and the cache. Sprint 038 lands all four.

---

## Open Questions (lock at promote)

*(Acceptance criteria for all 5 tasks pre-set in Backlog by user; decomposition Q&A skipped on user direction. No open questions at promote — surface any during execution to § Open Questions for Review.)*

---

## Plan

### T1 — TASK-091 — Doc routing rules at `docs/_routing.json`
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **HITL**
**Acceptance:** file exists, valid JSON, schema covers HOW/WHY/WHERE/WHO + L0 overflow pointer; lean-doc-generator reads from it before placement decisions.
**Depends on:** none (independent — can run first or parallel with T2).

### T2 — TASK-095 — Remove `scripts/session-start.js` Node invocation from hooks + commands
**Scope:** full · **Layers:** scripts, governance, skills, agents · **Risk:** high · **HITL**
**Acceptance:** no `node scripts/session-start.js` in `hooks/hooks.json`, `.claude/settings.json`, any SKILL.md, any agent, CLAUDE.md commands; `grep -r "session-start"` returns only script file (or zero hits if deleted); ADR-016 captures kill rationale (renumbered from ADR-013 due to existing collision in DECISIONS.md).
**Depends on:** none.
**Note:** root cause = `loader:1368` Node module resolution + Windows space-in-path; unfixable cleanly after 5 attempts.

### T3 — TASK-096 — Remove `scripts/read-guard.js` Node invocation from hooks + commands
**Scope:** full · **Layers:** scripts, governance, skills, agents · **Risk:** high · **HITL**
**Acceptance:** no `node scripts/read-guard.js` invocation anywhere; `grep -r "read-guard"` returns only script (or zero hits); read-guard logic absorbed into hook layer or skill self-policing; same ADR as T2 (TASK-095).
**Depends on:** T2 (TASK-095) — share ADR-016, sequence after to keep one rationale doc.

### T4 — TASK-101 — PowerShell SessionStart hook (replaces killed Node session-start)
**Scope:** quick · **Layers:** governance, scripts · **Risk:** medium · **HITL**
**Acceptance:** `hooks/hooks.json` SessionStart points at PowerShell script (not Node); script at `scripts/session-start.ps1`; verifies `.claude/settings.local.json` (warn), `.claude/CLAUDE.md` (fail if missing), active sprint detectable (warn if `sprint: none`); zero loader errors on Windows space-path; <500ms cold start; no Node anywhere.
**Depends on:** T2 (TASK-095) — Node session-start killed before PS replacement lands.

### T5 — TASK-102 — lean-doc-generator in-session hash-keyed cache
**Scope:** quick · **Layers:** skills, governance · **Risk:** medium · **AFK**
**Acceptance:** `.claude/.lean-doc-cache.json` (gitignored), schema `{ "<path>": "<sha1>", ... }`; skip re-scan on hash hit; SessionStart hook (T4) deletes cache before checks; cache hit logged at debug.
**Depends on:** T4 (TASK-101) — SessionStart hook owns the cache-clear step.

---

## Dependency Chain

```
T1 (TASK-091)  ── independent ──┐
T2 (TASK-095)  ──┬── T3 (TASK-096) [shared ADR-016]
                 └── T4 (TASK-101) ── T5 (TASK-102)
```

Serial spine: T2 → T4 → T5. T1 and T3 can interleave. All hooks work touches Windows space-path; verify on Windows before merge each task.

---

## Cross-task risks

- **Windows space-path verification per task.** Every hook + script change must be tested on `C:\Users\HYPE AMD\…` before merge. No "works on my machine" exits.
- **Hooks regression window.** T2 + T3 remove SessionStart bootstrap; T4 restores it. If T4 slips, sessions start without bootstrap until landed. Mitigation: complete T2 → T4 in a single working session where possible.
- **ADR-016 single-source.** T2 + T3 share one ADR. Avoid double-writing rationale. T3 appends to T2's ADR section, does not duplicate. (Renumbered from ADR-013 to avoid collision with existing DECISIONS.md ADR-013.)
- **Cache invalidation correctness (T5).** Hash-keyed cache must invalidate on every doc edit; sha1 of file contents is the contract. SessionStart-clears the file at session boundary; no cross-session bleed.

---

## Sprint DoD

- [ ] T1 `docs/_routing.json` exists, valid JSON, schema covers HOW/WHY/WHERE/WHO + L0 overflow; lean-doc-generator reads from it.
- [ ] T2 zero `node scripts/session-start.js` invocations anywhere; ADR-016 written.
- [ ] T3 zero `node scripts/read-guard.js` invocations anywhere; logic absorbed; ADR-016 appended.
- [ ] T4 PowerShell SessionStart hook live; zero loader errors on Windows space-path; <500ms cold start.
- [ ] T5 cache file gitignored; SessionStart clears it; cache hit logged at debug.
- [ ] Plan-lock commit landed before any T1..T5 commit.
- [ ] Close commit + CHANGELOG row + TODO update + retro.
- [ ] `last_updated` advanced on touched governance files.

---

## Execution Log

*(empty — append `### YYYY-MM-DD HH:MM | T<N> done` blocks during execution.)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| *(empty — append one row per file touched)* | | | | |

---

## Decisions

*(empty — append `DEC-N` rows for architectural-level decisions during execution.)*

---

## Open Questions for Review

*(empty — append open questions surfaced during execution.)*

---

## Retro

*(empty — fill at close: Worked / Friction / Pattern candidate / Surprise log.)*
