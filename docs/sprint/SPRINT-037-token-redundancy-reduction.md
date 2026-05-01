---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending (plan-lock commit)
close_commit: —
---

# Sprint 037 — Token/Redundancy Reduction (EPIC-Audit Phase 3)

**Theme:** Cut bloat using Sprint 34 baseline. Resolve P0-5 (cap violations), P1-9 (Do not use when), P2-7 (agent description normalize), Sprint 36 R4 carryover. Quality-gated, not quantity-gated.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 036 (EPIC-Audit Phase 2) closed `9cd403e`.

---

## Why this sprint exists

Sprint 34 audit reconciled 4 carryovers spanning P0/P1/P2:
1. **P0-5 cap violations** — `dispatcher` 31 lines, `design-analyst` 31 lines (cap 30). Surfaced post-Sprint-31 trim regression. Sprint 34 baseline froze the violation count; Sprint 35 + 36 didn't fix (surgical-changes rule). Phase 3 closes.
2. **P1-9 Do-not-use clauses** — skills `orchestrator` (was `dev-flow`) + `task-decomposer` description fields lack "Do not use when" clauses. 13/14 skills compliant.
3. **P2-7 agent description drift** — Sprint 33 P2-7 partial close normalized 2 of 7 agents (`code-reviewer`, `security-analyst`). Sprint 35 sweep updated 4 more incidentally. Only `dispatcher` (was `orchestrator`) remains non-compliant.
4. **Sprint 36 R4 carryover** — `system-design-reviewer` description starts "Use before..." not "Use when..." → `eval-skills.js` R4 violation. CI runs eval as `continue-on-error` until this closes.

Plus opportunistic cleanup: skill-pair overlap review + unused references/ audit.

---

## Open Question Resolutions (locked at promote)

- **Q1 — ADR-016 cap amend trigger**: agreed try-trim-first strategy. Path A (trim succeeds): no ADR. Path B (load-bearing content removal forced): ADR-016 amends cap to 35; Sprint 34 DEC-2's ADR-016 reservation for Phase 4c shifts to ADR-017.
- **Q2 — T2 SDR description fix scope**: agreed surgical preamble swap. "Use before building..." → "Use when reviewing design before building..." Preserves substance, satisfies R4. ≤2-line edit.
- **Q3 — T3 "Do not use when" clauses**: agreed. orchestrator description gets "Do not use for non-task work — use /zoom-out, /diagnose, /refactor-advisor"; task-decomposer description gets the "task already exists in Active Sprint — use /orchestrator instead" clause already present in `when_to_use:` field.
- **Q4 — T5 overlap detection method**: agreed manual review of 3 candidate pairs; no auto-detect. Bound work, ≤3 pair reviews. >40% overlap → cross-link, not merge.
- **Q5 — T6 unused references audit method**: agreed mechanical grep for filename references with template-string awareness (`${CLAUDE_SKILL_DIR}/references/`).
- **Q6 — Sprint split**: agreed atomic. Hard stop: T4 not done by mid-sprint → defer T5–T7 to Sprint 37b.
- **Q7 — DoD line-reduction target**: agreed drop quantitative gate. Replace with quality gate: zero OVER-CAP + 14/14 eval-skills pass.

---

## Plan

### T1 — Trim agents to ≤30 lines (or ADR-016 cap amend)
**Scope:** `agents/dispatcher.md` (31 lines) + `agents/design-analyst.md` (31 lines). Try minimal trim first; ADR-016 cap amend if trim removes load-bearing content.
**Acceptance:**
- Path A (trim): both files ≤30 lines, frontmatter + body coherent, dispatch logic + output ref preserved.
- Path B (cap amend): ADR-016 written; cap raised to 35 in `.claude/CLAUDE.md` Definition of Done line; CLAUDE.md `update_trigger` advanced.
**Edge cases:** "Lines" includes frontmatter (per baseline-metrics.md). dispatcher: 6 line frontmatter + 25 body = 31. design-analyst: same shape. Don't trim Red Flags or Hard Rules. Path B → Sprint 34 DEC-2 ADR-016 reservation (Phase 4c) shifts to ADR-017.
**Files:** `agents/dispatcher.md` · `agents/design-analyst.md` · (Path B) `docs/DECISIONS.md` + `.claude/CLAUDE.md`.
**Tests:** `node scripts/audit-baseline.js` post-trim — agents OVER-CAP must be 0 (Path A) or cap field updated (Path B).
**Risk:** medium.
**Deps:** Independent. Blocks T7.
**ADR:** maybe T1 / ADR-016 (Path B).
**Confidence:** 0.65

### T2 — Fix `system-design-reviewer` description (R4 close)
**Scope:** Replace preamble in `skills/system-design-reviewer/SKILL.md` line 3. "Use before building..." → "Use when reviewing design before building...". Preserve rest of description.
**Acceptance:** `node scripts/eval-skills.js` exits 0 (R4 violation cleared). 14/14 skills pass. Description char count <500.
**Edge cases:** Char count check post-edit.
**Files:** `skills/system-design-reviewer/SKILL.md`.
**Tests:** `node scripts/eval-skills.js` — exit 0.
**Risk:** low.
**Deps:** Blocks T7.
**Confidence:** 0.95

### T3 — Add "Do not use when" clauses (P1-9 close)
**Scope:** Append to descriptions:
- `skills/orchestrator/SKILL.md`: "Do not use for non-task work — use /zoom-out for orientation, /diagnose for debugging, /refactor-advisor for code-smell sweeps."
- `skills/task-decomposer/SKILL.md`: "Do not use when a task already exists in Active Sprint — use /orchestrator instead." (lift from `when_to_use:` to description).

**Acceptance:** Both descriptions contain "Do not use" or "Do NOT use" string. eval-skills 14/14. <500 chars per description.
**Edge cases:** Verify whether eval-skills checks description vs when_to_use field. orchestrator desc currently 175 chars; +120 stays under 500. task-decomposer same.
**Files:** `skills/orchestrator/SKILL.md` · `skills/task-decomposer/SKILL.md`.
**Tests:** `node scripts/eval-skills.js` — pass.
**Risk:** low.
**Deps:** Blocks T7.
**Confidence:** 0.85

### T4 — Normalize agent descriptions to "Use when…" form (P2-7 close)
**Scope:** Pre-flight verification + 1 file edit. Sprint 35 sweep already normalized 6 of 7 agents. Only `agents/dispatcher.md` non-compliant — starts "Use as lead agent...". Reframe: "Use when running an agentic engineering workflow — selects mode, runs gates, dispatches specialist agents."
**Acceptance:** `grep "^description: Use when" agents/*.md` returns 7/7. P2-7 closed.
**Edge cases:** Re-verify Sprint 35's 4 incidental updates not regressed. `code-reviewer` + `security-analyst` from Sprint 33 also confirm.
**Files:** `agents/dispatcher.md` (only).
**Tests:** Manual grep gate.
**Risk:** low.
**Deps:** Coordinates with T1 (same file).
**Confidence:** 0.85

### T5 — Manual skill overlap review (3 pairs)
**Scope:** Read 3 pairs side-by-side, document overlap %, disposition.
- Pair A: `pr-reviewer` vs `code-reviewer` agent — preload pattern (intentional per ADR-015 Rule 3).
- Pair B: `system-design-reviewer` vs `pr-reviewer` — different lens (intentional).
- Pair C: `tdd` vs `diagnose` — potential overlap on test-failure path. Real review.

**Acceptance:** Findings appended to `docs/audit/baseline-metrics.md` § Overlap Review. Each pair: overlap %, disposition (intentional / cross-link / merge). Zero merges this sprint. Cross-links if Pair C >40%.
**Edge cases:** Overlap % manual approximation by shared headings + concept count. Not rigorous similarity score.
**Files:** `docs/audit/baseline-metrics.md` (append) · maybe one cross-link edit.
**Tests:** None (read-only review).
**Risk:** low.
**Deps:** Independent.
**Confidence:** 0.95

### T6 — Audit unused `references/` files
**Scope:** For each `skills/*/references/*.md`, grep repo for filename references (literal + `${CLAUDE_SKILL_DIR}/references/` template). Zero hits = unused = candidate for delete. Spot-check before delete.
**Acceptance:** Findings written to `docs/audit/baseline-metrics.md` § References Audit. Each unused file: spot-check (was it abandoned mid-sprint? template-only?). Delete confirmed-abandoned via `git rm`. Keep template-shaped or empty-but-bound files.
**Edge cases:** `skill-dispatch.md` and `phases.md` referenced by SKILL.md body + agents/*.md output refs — both bound. Template string `${CLAUDE_SKILL_DIR}/references/<file>` — regex must catch.
**Files:** List discovered at runtime; deletes via `git rm`.
**Tests:** Re-run `node --test scripts/__tests__/*.test.js` post-delete — must still pass.
**Risk:** medium — wrong delete = broken skill. Mitigation: spot-check + test post-delete.
**Deps:** Blocks T7.
**Confidence:** 0.90

### T7 — Re-baseline + delta + drop CI continue-on-error
**Scope:** Run `node scripts/audit-baseline.js` post-T1..T6. Append delta section to `baseline-metrics.md` (pre/post line counts, over-cap delta, R4 status). If eval-skills now passes → drop `continue-on-error: true` from `.github/workflows/validate.yml`.
**Acceptance:**
- `audit-baseline.js` regenerates clean.
- `eval-skills.js` exits 0 (R4 closed via T2).
- Over-cap count = 0 (Path A) OR cap raised + agents within new cap (Path B).
- Delta section in `baseline-metrics.md` documents skills/agents before/after + line reduction count.
- `validate.yml` eval-skills step `continue-on-error` flag dropped.
**Edge cases:** If eval-skills still has any R-violation post-T2/T3 → keep flag, document in retro.
**Files:** `docs/audit/baseline-metrics.md` + `.json` (regen) · `docs/audit/skill-eval-report.md` (regen) · `.github/workflows/validate.yml`.
**Tests:** All scripts exit 0.
**Risk:** low.
**Deps:** All other tasks complete.
**Confidence:** 0.95

### T8 (implicit) — Sprint Promote/Close protocol full pass
Same shape as Sprint 35/36 close. Plan-lock + close + SHA backfill three-commit ladder. CHANGELOG row. TODO update. Retro.

---

## Sprint DoD

- [ ] T1 OVER-CAP count = 0 (Path A) OR cap amended via ADR-016 (Path B)
- [ ] T2 eval-skills 14/14 pass (R4 closed)
- [ ] T3 both target descriptions contain "Do not use" clause
- [ ] T4 all 7 agents start description with "Use when"
- [ ] T5 overlap review for 3 pairs documented; zero merges, cross-links if >40%
- [ ] T6 unused references audited; safe deletions made; tests still pass
- [ ] T7 baseline regenerated with delta section; CI continue-on-error dropped if eval-skills 14/14
- [ ] Plan-lock commit landed before any T1..T7 commit
- [ ] Close commit + CHANGELOG row + TODO update + retro
- [ ] `last_updated` advanced on touched governance files

---

## Execution Log

*(empty — populated as tasks complete)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|

*(empty — populated as work happens)*

---

## Decisions

- **DEC-1**: Q1 locked — try-trim-first; ADR-016 cap amend only if forced. Sprint 34 DEC-2 ADR-016 reservation may consume here, shifting Phase 4c to ADR-017.
- **DEC-2**: Q2 locked — surgical preamble swap on `system-design-reviewer` description. ≤2-line edit.
- **DEC-3**: Q3 locked — additive "Do not use when" clauses on `orchestrator` + `task-decomposer` descriptions.
- **DEC-4**: Q4 locked — manual overlap review of 3 candidate pairs, no auto-detect.
- **DEC-5**: Q5 locked — mechanical grep + spot-check for unused references audit.
- **DEC-6**: Q6 locked — atomic 7-task sprint with mid-sprint hard-stop split fallback (T4 done = continue; T4 stuck = defer T5–T7 to 37b).
- **DEC-7**: Q7 locked — quality-gated DoD: zero OVER-CAP + 14/14 eval-skills pass. No quantitative line-reduction target.

---

## Open Questions

*(none at promote — all 7 resolved above)*

---

## Retro

*(empty — written at close)*
