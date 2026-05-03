---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03
update_trigger: sprint open / close / status change / phase scope change
status: closed
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

### 2026-05-03 | T1 (TASK-091) done — `a03c970`
Routing scaffold landed at `docs/_routing.json`. Schema covers HOW/WHY/WHERE/WHO + L0 overflow pointer. lean-doc-generator SKILL.md updated to read it before placement. Acceptance verified.

### 2026-05-03 | T2 (TASK-095) done — `b8ef0c2`
`node scripts/session-start.js` removed from `hooks/hooks.json`, `.claude/settings.json`, all SKILL.md, agents, CLAUDE.md commands. `scripts/session-start.js` deleted (240 lines gone). ADR-016 written capturing kill rationale (loader:1368 + Windows space-path, 5 prior fix attempts failed). Sibling test file deleted (270 lines).

### 2026-05-03 | T3 (TASK-096) done — `6fc6abd`
Residual `read-guard.js` references scrubbed across docs (ARCHITECTURE.md, AI_CONTEXT.md, SETUP.md, CLAUDE.md, README.md, audit/wiring-map.md, TEST_SCENARIOS.md). ADR-016 appended with read-guard absorption note. Acceptance verified — zero invocations remain.

### 2026-05-03 | Surprise — orchestrator code-reviewer dispatch (mid-sprint, `f43f094`)
Discovered: orchestrator was auto-dispatching to code-reviewer agent on doc/delete tasks, wasting effort. Resolution: changed dispatch model to propose → human approves. One-line edit in `skills/orchestrator/SKILL.md` + dispatch-table clarification. Logged as decision DEC-1 below. Not in original plan; surfaced because TASK-095/096 (delete-only changes) tripped pointless review dispatches.

### 2026-05-03 | T4 (TASK-101) done — `09ad2ab`
PowerShell SessionStart hook live at `scripts/session-start.ps1` (64 lines). `hooks/hooks.json` SessionStart points at PowerShell (not Node). Verifies CLAUDE.md (fail-if-missing), settings.local.json (warn), active sprint (warn). Cold-start <500ms on Windows space-path. Zero loader errors observed across multiple sessions.

### 2026-05-03 | Surprise — PS 5.1 ANSI parsing (during T4)
Discovered: PowerShell 5.1 parses `.ps1` files as ANSI when written UTF-8 without BOM. Em-dashes (`—`) in comments became mojibake and broke the parser. Resolution: rewrote script with ASCII-only comments. Logged for VALIDATED_PATTERNS candidate.

### 2026-05-03 | T5 (TASK-102) done — `fda4f4b`
`.claude/.lean-doc-cache.json` schema `{ "<path>": "<sha1>", ... }` added to `.gitignore`. lean-doc-generator skips re-scan on hash hit. SessionStart hook (T4) clears the cache file at session boundary. Cache hit logged at debug. Acceptance verified.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/_routing.json` | T1 | NEW — placement schema (HOW/WHY/WHERE/WHO + L0 overflow) | low | n/a (data file) |
| `skills/lean-doc-generator/SKILL.md` | T1, T5 | Reads `_routing.json` before placement; SHA1 cache wired | low | n/a (skill) |
| `hooks/hooks.json` | T2, T4 | Node session-start removed; PS replacement registered | high | manual (Windows session smoke) |
| `.claude/settings.json` | T2 | Local hook node invocation removed | med | manual |
| `.claude/CLAUDE.md` | T2, T3 | Commands block — Node session-start + read-guard refs removed | low | n/a (doc) |
| `scripts/session-start.js` | T2 | DELETED (240 lines) — Node hook killed | high | n/a (deleted with file) |
| `scripts/__tests__/session-start.test.js` | T2 | DELETED (270 lines) — sibling tests gone with script | low | n/a (deleted) |
| `docs/adr/ADR-016-kill-node-hook-scripts.md` | T2, T3 | NEW — kill rationale + read-guard absorption note | low | n/a (ADR) |
| `docs/DECISIONS.md` | T2 | ADR-016 link appended; `last_updated` advanced | low | n/a (doc) |
| `docs/ARCHITECTURE.md` | T3 | read-guard refs scrubbed | low | n/a (doc) |
| `docs/AI_CONTEXT.md` | T3 | read-guard refs scrubbed | low | n/a (doc) |
| `docs/SETUP.md` | T3 | read-guard refs scrubbed | low | n/a (doc) |
| `docs/TEST_SCENARIOS.md` | T3 | session-start/read-guard test rows removed | low | n/a (doc) |
| `docs/audit/wiring-map.md` | T3 | hook-wiring map refreshed (no Node) | low | n/a (doc) |
| `README.md` | T3 | Commands block — read-guard ref removed | low | n/a (doc) |
| `scripts/session-start.ps1` | T4 | NEW (64 lines) — PowerShell SessionStart hook | med | manual (Windows session smoke) |
| `.gitignore` | T5 | `.claude/.lean-doc-cache.json` excluded | low | n/a |
| `skills/orchestrator/SKILL.md` | bonus | code-reviewer dispatch propose → human approves | low | n/a (skill) |
| `skills/orchestrator/references/skill-dispatch.md` | bonus | dispatch-table clarification (code-reviewer manual) | low | n/a (doc) |
| `docs/codemap/CODEMAP.md` | T1, T2 | Routing + hooks lines refreshed | low | n/a (doc) |
| `TODO.md` | T1..T5 | Task `[x]` ticks per close | low | n/a (tracker) |
| `docs/sprint/SPRINT-038-foundation-hardening.md` | close | Status flip + execution log + retro | low | n/a (sprint) |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | Kill Node hook scripts entirely (no patch path) | 5 prior fix attempts failed on Windows space-path; loader:1368 root cause is structural, not in our code | ADR-016 |
| DEC-2 | Replace SessionStart with PowerShell, not bash | Native on Windows; zero loader risk; works on the affected `C:\Users\HYPE AMD\…` path | ADR-016 |
| DEC-3 | code-reviewer dispatch is propose-only, human approves | Mid-sprint observation: auto-dispatch wasted effort on doc/delete tasks; opt-in is cheaper than opt-out | — |
| DEC-4 | lean-doc-generator cache is in-session only (cleared by SessionStart) | Avoids cross-session bleed without an invalidation protocol; sha1 is the contract within session | — |

---

## Open Questions for Review

*(none — all questions surfaced during execution were resolved in flight; logged as DEC-1..4 above.)*

---

## Retro

**Worked:**
- Killing Node-in-hooks rather than patching it landed cleanly on the first attempt after 5 prior failed fixes. Sometimes the right move is removal.
- T2 → T3 → T4 sequencing kept the SessionStart bootstrap dark for the shortest possible window (single working session).
- ADR-016 single-source for both T2 and T3 avoided rationale duplication.
- In-session cache (T5) gated by SessionStart-clear (T4) was a clean dependency — T5 inherited correctness from T4's hook contract.
- Mid-sprint orchestrator fix (`f43f094`) was scoped tightly and bounced through sprint-execute § Surprise instead of breaking plan freeze.

**Friction:**
- PowerShell 5.1 ANSI parsing on UTF-8 no-BOM files was a nasty surprise. Em-dashes in `.ps1` comments broke the parser silently — debugged via parse error line number, not symptom. Cost ~20 min.
- `loader:1368` was misdiagnosed as a Node version issue twice before the space-path root cause was confirmed. The error message was unhelpful.
- Auto code-reviewer dispatch on delete-only tasks (T2/T3) was loud noise that obscured real signal. Caught and fixed mid-sprint.

**Pattern candidates:**
- **PowerShell scripts must be ASCII-only or BOM-tagged on Windows 5.1.** Worth a VALIDATED_PATTERNS entry — this trap will hit again. (User confirm before adding.)
- **Code-reviewer dispatch is propose-only by default; auto-dispatch is the wrong default.** Already landed in `f43f094`; worth surfacing as a permanent rule. (User confirm.)
- **Sprint Close should NOT auto-push.** Push gating belongs to a dedicated `release-patch` skill (TASK-103 in Sprint 039). Sprint Close stops at close-commit + CHANGELOG; release-patch owns the version bump + push-gate dialogue. Confirmed for Sprint 039 scope.

**Surprise log:**
- Orchestrator dispatch fix (mid-sprint, `f43f094`) — see Execution Log above.
- PowerShell ANSI/UTF-8 BOM trap (during T4) — see Execution Log above.
