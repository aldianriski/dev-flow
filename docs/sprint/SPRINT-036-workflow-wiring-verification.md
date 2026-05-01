---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change / phase scope change
status: closed
plan_commit: a8d3158
close_commit: pending (close commit)
last_updated: 2026-05-01
---

# Sprint 036 — Workflow Wiring Verification (EPIC-Audit Phase 2)

**Theme:** Prove end-to-end gate → mode → agent → skill → hook consistency. Add session-start governance checks. Lock wiring contract if T1 surfaces one.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 035 (EPIC-Audit Phase 1) closed `414ee8e`.

---

## Why this sprint exists

Sprint 35 atomic naming rename cleared the way for unambiguous wiring inspection (`/orchestrator` skill ↔ `dispatcher` agent — no more name collision masking dispatch direction).

Phase 2 goals from Sprint 34 plan:
1. Map every phase across modes to its bound agent + skill + hook trigger.
2. Detect orphans — agents/skills/hooks not bound to any phase.
3. Verify hook matcher coverage (Sprint 34 obra/superpowers probe finding).
4. Add session-start governance checks: sprint plan doc must exist (Anti-Drift Hard Stop #1 enforcement); `status: current` docs older than most-recent CHANGELOG sprint date warn.
5. Fix Sprint 35 retro carryover: `session-start.js` Active-Sprint regex misses sprint-pointer format.
6. Cover all `session-start.js` changes with tests — currently zero coverage.

---

## Open Question Resolutions (locked at promote)

- **Q1 — wiring map output location**: agreed separate doc `docs/audit/wiring-map.md`. Phase 5 (Sprint 42) ARCHITECTURE.md rewrite can absorb sections it wants. Touching ARCHITECTURE.md now = double-work + premature.
- **Q2 — T3 hook matcher**: agreed verify-only, no patch. `hooks/hooks.json:5` already wires `startup|resume|clear|compact` per obra probe rec. T3 reduces to assertion in wiring-map.
- **Q3 — T4/T5 fold Sprint 35 quirk fix**: agreed bundle. Single-touch on `session-start.js` beats two trips through same file.
- **Q4 — ADR-015 substance**: agreed defer. Conditional at T6 — IF T1 surfaces lockable contract → write ADR-015; ELSE commit-msg-only. Reservation from Sprint 34 DEC-2 may release.
- **Q5 — Test fixture strategy**: agreed. T4 includes new `scripts/__tests__/session-start.test.js` covering Sprint 35 regex fix + sprint-plan-doc check + status-current+stale check. Three+ fixtures minimum.

---

## Plan

### T1 — Trace modes (init/quick/mvp) → wiring-map.md
**Scope:** Read `skills/orchestrator/SKILL.md` + `references/phases.md`. For each mode, enumerate per phase: bound agent (auto/propose), advisory skill, hook trigger (if any). Cross-link `agents/*.md` descriptions to confirm dispatch direction. Output `docs/audit/wiring-map.md`.
**Acceptance:** New file `docs/audit/wiring-map.md` (≤200 lines). Sections: `init phases`, `quick phases`, `mvp phases`, `Hook table`, `Orphans`. 4-column table per mode `phase | agent | skill | hook`. Zero orphans OR orphans listed with disposition (intentional / candidate-for-removal).
**Edge cases:** `init` has no gates — fewer rows. `code-reviewer` is post-implement always — appears in quick + mvp. `security-analyst` "never auto-spawn" — flag user-only invocation, not orphan. `dev-flow:compress` (skill `dev-flow-compress`) — out-of-band invocation; flag.
**Files:** `docs/audit/wiring-map.md` (new). Frontmatter: `owner · last_updated · status: current`.
**Tests:** Manual read-through.
**Risk:** low — read-only.
**Deps:** Blocks T2, T3, T6.
**ADR:** maybe T6.
**Confidence:** 0.85

### T2 — Cross-check `skill-dispatch.md` vs `skills/` dir
**Scope:** Compare `skills/orchestrator/references/skill-dispatch.md` table entries against actual `skills/*/SKILL.md` filenames. Confirm adopter section labeling (line 21) accurately reflects what's bundled.
**Acceptance:** Every skill name in dev-flow Meta-Repo Layers table corresponds to actual `skills/<name>/SKILL.md`. Every entry under "Skills Not Bundled With dev-flow" has zero `skills/<name>/SKILL.md` match. Always-On entries (`code-reviewer`, `lean-doc-generator`, `adr-writer`) match real skills. Findings appended to `wiring-map.md` § Dispatch coverage.
**Edge cases:** `dev-flow-compress` skill — not in dispatch table; out-of-band. `orchestrator` skill itself isn't in dispatch (it IS the consumer). `pipeline-builder` referenced under `ci` — not bundled, confirm placement.
**Files:** `skills/orchestrator/references/skill-dispatch.md` only if mismatch AND fix scope ≤5 lines; otherwise log to wiring-map.
**Tests:** Manual diff.
**Risk:** low.
**Deps:** T1.
**Confidence:** 0.85

### T3 — Verify hook matcher coverage (NO PATCH)
**Scope:** Read `hooks/hooks.json` + `.claude/settings.json`. Assert in wiring-map.md: SessionStart matcher coverage (`startup|resume|clear|compact`); PreToolUse `Bash(git add*)` chain-guard; Sprint 35 `read-guard.js` removal not regressed.
**Acceptance:** wiring-map.md § Hook Coverage table populated. Each row: `event | matcher | command | status (live/dead)`. Q2 lock: no patch.
**Edge cases:** Adopter machine `.claude/settings.local.json` per-machine hooks — out of scope. Plugin namespace `dev-flow:` vs project-local — note distinction.
**Files:** read-only assertions, written to wiring-map.md only.
**Tests:** Visual verification.
**Risk:** low.
**Deps:** T1.
**Confidence:** 0.95

### T4 — `session-start.js`: sprint-plan-doc check + Sprint 35 regex fix + tests
**Scope:** Three changes to `scripts/session-start.js`, bundled per Q3:
1. **Fix Sprint 35 regex quirk** — rewrite `hasActiveTask` detection. Current `/- \[ \] \*\*TASK-/` misses sprint-pointer format. New: detect TASK-NNN bullet OR `→ **Sprint NNN — ...**` pointer line.
2. **New check** — if Active Sprint section names a sprint (`sprint: NNN` frontmatter OR sprint pointer line), assert `docs/sprint/SPRINT-NNN-*.md` exists. Missing → `BLOCK` (Anti-Drift Hard Stop #1 enforced at session start).
3. **Test file** — new `scripts/__tests__/session-start.test.js` with fixtures.

**Acceptance:**
- session-start runs clean against current TODO.md (no Sprint-35-style false-positive).
- TODO.md `sprint: 99` + missing `docs/sprint/SPRINT-099-*.md` → BLOCK error, exit 1.
- Matching plan doc → no error.
- `node --test scripts/__tests__/session-start.test.js` exits 0.
- ≥3 fixtures: (a) sprint-pointer-no-tasks regex fix, (b) sprint-named-no-plan-doc fires BLOCK, (c) sprint-named-plan-doc-exists passes.

**Edge cases:** Sprint 36 itself — when this check runs in this session, plan doc exists at write-time → check passes. Adopter repo with `sprint: 1` but no `docs/sprint/` dir → soft-warn (bootstrapping case), not BLOCK. Two-tier severity. CRLF line endings on Windows — fixture content platform-neutral.
**Files:** `scripts/session-start.js` (modify) · `scripts/__tests__/session-start.test.js` (new).
**Tests:** This task IS the test gate. TDD-shaped.
**Risk:** medium — date/regex/path logic + cross-platform fixtures.
**Deps:** Independent of T1/T2/T3 in scope. Commits after T1 so wiring-map can reference.
**Confidence:** 0.70

### T5 — `session-start.js`: `status: current` + stale `last_updated` vs CHANGELOG anchor
**Scope:** New check in `scripts/session-start.js`. Logic:
1. Parse `docs/CHANGELOG.md` top entries — extract most-recent `## Sprint NNN — title (YYYY-MM-DD)` heading date.
2. For each doc in existing Check 5 list: if frontmatter `status: current` AND `last_updated` predates CHANGELOG anchor → warn `WARN: <path> last_updated is older than most-recent sprint <NNN> (<date>) — verify accuracy`.
3. Suppress duplicates with existing Check 5 calendar-60-day rule (don't fire both on same doc).

**Acceptance:**
- TODO.md `last_updated: 2026-04-01`, CHANGELOG most-recent `2026-05-01` → sprint-anchor warning fires, NOT 60-day warning.
- Doc updated `2026-05-01`, CHANGELOG `2026-05-01` → no warning.
- Doc `status: stale` → no sprint-anchor warning (stale already handled).
- Test fixtures cover all 3 paths.

**Edge cases:** CHANGELOG.md missing or no `## Sprint` heading → skip silently. `last_updated: YYYY-MM-DD (annotation)` format (TODO.md uses) — regex extract date prefix only. First sprint of project — anchor undefined → skip. Sprint heading date format `(YYYY-MM-DD)` confirmed canonical.
**Files:** `scripts/session-start.js` (extend). Test file from T4 extended with 3 more fixtures.
**Tests:** Test gate same as T4.
**Risk:** medium — duplicate-suppression logic + date parsing.
**Deps:** T4 (same file edits + same test file).
**Confidence:** 0.70

### T6 — ADR-015 conditional + Sprint Promote/Close protocol
**Scope:** Two parts:
1. **Conditional ADR-015** — IF T1 wiring-map surfaces a lockable contract (e.g. "every mode MUST declare its agent dispatch order"; "session-start checks form a governance contract") → write ADR-015 in `docs/DECISIONS.md`. ELSE commit-msg-only. Per Q4 lock.
2. **Sprint Promote/Close protocol full pass** — execution log, files changed, decisions, retro, plan-lock SHA in frontmatter, close commit, CHANGELOG row, TODO update.

**Acceptance:**
- IF ADR-015 written: appended to DECISIONS.md per inline section convention; `last_updated` advanced.
- Sprint doc populated through close.
- Close commit `sprint(036): EPIC-Audit Phase 2 — workflow wiring verification` references plan_commit SHA.
- CHANGELOG.md gets Sprint 36 row.
- TODO.md Active Sprint cleared, Phase 2 row removed from Backlog.

**Edge cases:** ADR-015 deferral — DEC-2 (Sprint 34) reserved 015 for Phase 2. If skipped here, carry to Phase 3 (cap amend) or release. Document in retro.
**Files:** `docs/DECISIONS.md` (conditional) · sprint doc · `TODO.md` · `docs/CHANGELOG.md`.
**Tests:** Protocol checklist.
**Risk:** low.
**Deps:** All other tasks complete.
**Confidence:** 0.85

---

## Sprint DoD

- [x] T1 wiring-map.md written; zero unintentional orphans
- [x] T2 dispatch coverage verified; 3 mismatches resolved (pipeline-builder, security-auditor, code-reviewer)
- [x] T3 hook matcher coverage asserted in wiring-map (no patch per Q2)
- [x] T4 session-start regex fix + sprint-plan-doc check land; fixtures pass
- [x] T5 sprint-anchor staleness check lands; dedupe logic verified; fixtures pass
- [x] `node --test scripts/__tests__/session-start.test.js` exits 0 (8 fixtures total across T4 + T5)
- [x] T6 ADR-015 written (workflow wiring contract — one-way dispatch + dispatch-table membership)
- [x] Plan-lock commit landed before any T1..T5 commit (`a8d3158`)
- [x] Close commit + CHANGELOG row + TODO update + retro
- [x] `last_updated` advanced on touched governance files (DECISIONS.md, this sprint doc, TODO.md)

---

## Execution Log

- 2026-05-01: Plan locked at `a8d3158` — sprint doc + TODO.md pre-lock writes only.
- 2026-05-01: T1 done — `docs/audit/wiring-map.md` written (read-only trace). Modes × phases × agent × skill × hook tabled. 7 agents all bound; 14 skills all have invocation paths (4 auto-bound, 10 on-demand including 2 agent-preloaded). Zero unintentional orphans. 3 dispatch-table mismatches surfaced for T2.
- 2026-05-01: T2 done — 3 fixes applied to `skills/orchestrator/references/skill-dispatch.md`: `pipeline-builder` removed from `ci` row (not bundled); `security-auditor` moved out of adopter section into Always-On (bundled, preloaded by `security-analyst`); `code-reviewer` row clarified as agent that preloads `pr-reviewer` skill.
- 2026-05-01: T3 done — verify-only (no patch per Q2). Hook coverage table populated in wiring-map.md § Hook Coverage. SessionStart matcher `startup|resume|clear|compact` confirmed; PreToolUse `Bash(git add*)` chain-guard confirmed in plugin + project-local; Sprint 35 `read-guard.js` deletion not regressed.
- 2026-05-01: T4 done — `scripts/__tests__/session-start.test.js` written first (TDD red phase: 5 pass / 3 fail). Then `scripts/session-start.js` modified: Check 7 regex extended to recognize `→ **Sprint NNN — ...` pointer format (Sprint 35 retro fix); new Check 9 enforces sprint-plan-doc presence (BLOCK when sprint named + plan doc missing + docs/sprint/ exists; soft-warn for adopter bootstrap when docs/sprint/ absent per DEC-6). Tests went green (8/8 pass).
- 2026-05-01: T5 done — new Check 10 added in same file: parses most-recent `## Sprint NNN — title (YYYY-MM-DD)` heading from `docs/CHANGELOG.md`; warns on `status: current` docs whose `last_updated` predates the anchor; suppresses when Check 5 60-day rule would already fire (priority: 60-day calendar wins). Tests still 8/8 pass. Live run on this repo surfaced sprint-anchor warnings on `docs/SETUP.md` and `docs/TEST_SCENARIOS.md` (both `last_updated: 2026-04-26` < anchor `2026-05-01`) — useful signal, not a regression.
- 2026-05-01: T6 done — ADR-015 written in `docs/DECISIONS.md` covering Rule 1 (one-way dispatch) + Rule 2 (dispatch-table membership for advisory surfacing) + Rule 3 (bundled vs adopter section). Sprint 34 DEC-2 ADR-015 reservation consumed. Protocol Promote/Close run cleanly.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/audit/wiring-map.md` | T1 | NEW — end-to-end wiring trace; modes × phases × agents × skills × hooks; orphan analysis | low | n/a |
| `skills/orchestrator/references/skill-dispatch.md` | T2 | 3 fixes: `pipeline-builder` row removed (not bundled); `security-auditor` moved out of adopter section into Always-On; `code-reviewer` row clarified as agent + preloaded skill | low | T1 cross-check |
| `scripts/session-start.js` | T4 + T5 | Check 7 regex extended (sprint-pointer format); new Check 9 (sprint-plan-doc must exist; BLOCK or soft-warn per DEC-6); new Check 10 (sprint-anchor staleness vs CHANGELOG, deduped against Check 5 60-day) | medium | yes (8 fixtures) |
| `scripts/__tests__/session-start.test.js` | T4 + T5 | NEW — 8 fixtures covering regex fix, sprint-plan-doc check (4 paths), sprint-anchor staleness check (3 paths), smoke test against self | low | self |
| `docs/DECISIONS.md` | T6 | ADR-015 appended (workflow wiring contract); `last_updated` advanced | low | n/a |
| `docs/sprint/SPRINT-036-workflow-wiring-verification.md` | T1 / T6 | NEW at promote (`status: planning` → `active`); populated through close | low | n/a |
| `TODO.md` | promote / close | sprint pointer at promote; cleared at close | low | n/a |
| `docs/CHANGELOG.md` | close | Sprint 36 row appended | low | n/a |

---

## Decisions

- **DEC-1**: Q1 locked — wiring map = separate doc `docs/audit/wiring-map.md`. Phase 5 ARCHITECTURE.md rewrite can absorb later. Avoid premature touching of stale doc.
- **DEC-2**: Q2 locked — T3 verify-only, no patch. Hook matcher already correct post-Sprint 35 drift fix.
- **DEC-3**: Q3 locked — fold Sprint 35 retro session-start regex quirk fix into T4 alongside new sprint-plan-doc check. Single-touch.
- **DEC-4**: Q4 locked — ADR-015 conditional at T6 based on T1 substance. Sprint 34 DEC-2 reservation may release.
- **DEC-5**: Q5 locked — `scripts/__tests__/session-start.test.js` is required deliverable in T4 + extended in T5. Zero existing coverage on session-start.js — new checks blind without tests.
- **DEC-6**: T4 sprint-plan-doc check uses two-tier severity — BLOCK when sprint named but plan doc missing (Anti-Drift enforcement); soft-warn when no `docs/sprint/` dir at all (adopter bootstrapping case).

---

## Open Questions

*(none at promote — all 5 resolved above)*

---

## Retro

**Worked:**
- T1 read-only trace before any patch decision was the right call. The wiring-map made T2's 3 mismatches mechanically visible and gave T6 substance candidates without speculation.
- TDD-shaped T4/T5 (write tests → red phase → implement → green phase) prevented blind regex changes. 5 of 8 fixtures passed in red phase because they tested current correct behavior; only 3 measured the new behavior. Single test file covered Sprint 35 retro carryover + 2 new checks.
- ADR-015 substance gate at T6 (per Q4 deferral) produced a tighter ADR than guessing at promote. Three rules, all descriptive of current behavior, prescriptive for future additions.
- DEC-6 two-tier severity (BLOCK in-flight sprint vs soft-warn adopter bootstrap) was correct call. Live test fixture (T4(d)) confirmed adopter-bootstrap path doesn't BLOCK.

**Friction:**
- Test fixtures need explicit `\n` in `[].join('\n')` to dodge Windows CRLF issues. Caught at first run; would have lost time if not pre-flagged.
- Check 5 60-day vs Check 10 sprint-anchor dedupe required ordering thought (which warning wins). Locked: 60-day wins (more general signal). Implementation uses early `continue` rather than Set tracking.
- Sprint-anchor regex on CHANGELOG.md depends on heading format `## Sprint NNN — title (YYYY-MM-DD)`. If a future sprint uses a different format the check silently skips. Acceptable for now; could be brittleness later.
- Live run surfaced 2 new warnings on `docs/SETUP.md` + `docs/TEST_SCENARIOS.md` (last_updated 2026-04-26). These docs aren't stale per content audit — they just predate Sprint 35. Phase 5 / Sprint 42 doc refresh will close. Until then warnings persist. Acceptable signal.

**Pattern candidate (surface to user, ask before locking into VALIDATED_PATTERNS.md):**
- Pattern: "Read-only trace doc (wiring-map.md) before patch decisions" — Sprint 36 T1 made T2 mechanical and T6 grounded. Worth lifting to a general "produce truth-doc first, then patch decisions against it" pattern for future audit-style sprints.
- Pattern: "TDD-shaped session-start checks" — write fixtures first, watch red phase prove the gap, implement to green. Test file becomes the contract for future check additions. Worth standardizing.
- Pattern: "Two-tier severity (BLOCK + soft-warn)" — in-flight project enforcement vs adopter bootstrap leniency. Useful pattern for any session-start governance check.

**Surprise log:**
- All 7 agents and all 14 skills had clear invocation paths. T1 expected to find at least 1 unintentional orphan; found zero. The audit found order, not chaos. Healthy.
- Plugin `hooks/hooks.json` and project-local `.claude/settings.json` both have the `Bash(git add*)` chain-guard — redundant but intentional (project-local works without plugin loaded; covers dev-on-this-repo case). Documented in wiring-map § Hook Coverage.
- Sprint 35 retro flagged session-start regex quirk; Sprint 36 fixed it as part of the same file's expansion. Single-touch beat splitting.
- ADR-014 (Sprint 35) used `superseded-in-part` markers as a precedent; ADR-015 didn't need any (it adds rules, doesn't supersede prior decisions).
