---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
update_trigger: sprint open / close / status change / phase scope change
status: closed
plan_commit: 4594638
close_commit: c75a520
last_updated: 2026-05-01
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

- [x] T1 OVER-CAP count = 0 — Path A (trim) succeeded, no ADR-016 cap amend
- [x] T2 eval-skills 14/14 pass (R4 closed via SDR description fix)
- [x] T3 both target descriptions contain "Do not use" clause (P1-9 closed)
- [x] T4 all 7 agents start description with "Use when" (P2-7 closed)
- [x] T5 overlap review for 3 pairs documented; zero merges, zero new cross-links (all dispositions intentional)
- [x] T6 unused references audited — zero unbound files, zero deletes
- [x] T7 baseline regenerated with delta section; CI continue-on-error dropped (eval 14/14)
- [x] Plan-lock commit landed before any T1..T7 commit (`4594638`)
- [x] Close commit + CHANGELOG row + TODO update + retro
- [x] `last_updated` advanced on touched governance files

---

## Execution Log

- 2026-05-01: Plan locked at `4594638` — sprint doc + TODO.md pre-lock writes only.
- 2026-05-01: T1 done — Path A (trim) succeeded, no ADR-016 needed. Both agents had a separable "tagline" + "Read CONTEXT.md" two-paragraph block in the body; merged into one paragraph. dispatcher 31 → 30 lines (post-baseline regen); design-analyst 31 → 29 lines. Sprint 34 DEC-2 ADR-016 reservation preserved for Phase 4c (Sprint 38).
- 2026-05-01: T2 done — `system-design-reviewer/SKILL.md` description preamble: "Use before building..." → "Use when reviewing a proposed or existing system design — before building...". Char count <500. eval-skills 14/14 pass (R4 closed).
- 2026-05-01: T3 done — `orchestrator/SKILL.md` description appended: "Do not use for non-task work — use /zoom-out for orientation, /diagnose for debugging, /refactor-advisor for code-smell sweeps." `task-decomposer/SKILL.md` description appended: "Do not use when a task already exists in Active Sprint — use /orchestrator instead." Both <500 chars. P1-9 closed.
- 2026-05-01: T4 done — pre-flight grep showed 6/7 agents already compliant with "Use when" (Sprint 33 P2-7 partial close + Sprint 35 sweep both contributed). Only `dispatcher` non-compliant. Reframed: "Use as lead agent..." → "Use when running an agentic engineering workflow as lead — reads task, selects mode, runs gates, dispatches specialist agents." 7/7 verified via `grep -c "^description: Use when" agents/*.md`. P2-7 closed.
- 2026-05-01: T5 done — 3 pair manual review. All disposition = intentional. Pair A (`pr-reviewer` × `code-reviewer` agent) preload pattern per ADR-015 Rule 3. Pair B (`system-design-reviewer` × `pr-reviewer`) different review lenses (~10-15% architecture-lens overlap, intentional). Pair C (`tdd` × `diagnose`) shares feedback-loop pattern + RED/GREEN/REGRESS vocabulary (~15-20% overlap), conceptually distinct, already cross-linked from `tdd` description. No merges, no new cross-links. Findings appended to `baseline-metrics.md` § Overlap review.
- 2026-05-01: T6 done — 12 `skills/*/references/*.md` files inspected via mechanical grep on filename patterns + `${CLAUDE_SKILL_DIR}/references/` template. **All 12 referenced** from parent SKILL.md or sibling references file. Zero unbound. Zero deletes. Findings appended to `baseline-metrics.md` § References audit.
- 2026-05-01: T7 done — `audit-baseline.js` regenerated (skills 1062 lines unchanged, agents 174 → 171, OVER-CAP 2 → 0); `eval-skills.js` 14/14 pass (was 13/14); delta section appended to `baseline-metrics.md`; `.github/workflows/validate.yml` eval-skills step `continue-on-error: true` removed (no longer needed).
- 2026-05-01: T8 — sprint doc populated; CHANGELOG.md row added; TODO.md updated; close commit authored.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `agents/dispatcher.md` | T1 + T4 | merged tagline + Read-CONTEXT into one paragraph (31 → 30 lines, OVER-CAP closed); description preamble normalized to "Use when..." | medium | T7 baseline regen |
| `agents/design-analyst.md` | T1 | merged tagline + Read-CONTEXT (31 → 29 lines, OVER-CAP closed) | medium | T7 |
| `skills/system-design-reviewer/SKILL.md` | T2 | description preamble "Use before..." → "Use when reviewing..." (R4 violation cleared) | low | T7 eval-skills |
| `skills/orchestrator/SKILL.md` | T3 | description appended "Do not use" clause pointing to /zoom-out, /diagnose, /refactor-advisor | low | T7 |
| `skills/task-decomposer/SKILL.md` | T3 | description appended "Do not use when a task already exists in Active Sprint — use /orchestrator instead" | low | T7 |
| `docs/audit/baseline-metrics.md` | T5, T6, T7 | regenerated by `audit-baseline.js`; delta section appended (+ Overlap review + References audit findings) | low | self |
| `docs/audit/baseline-metrics.json` | T7 | regenerated by `audit-baseline.js` | low | self |
| `docs/audit/skill-eval-report.md` | T7 | regenerated by `eval-skills.js` (14/14 pass; was 13/14) | low | self |
| `.github/workflows/validate.yml` | T7 | `continue-on-error: true` removed from eval-skills step (no longer needed) | low | n/a |
| `docs/sprint/SPRINT-037-token-redundancy-reduction.md` | T1 / T8 | NEW at promote (`status: planning` → `active`); populated through close | low | n/a |
| `TODO.md` | promote / close | sprint pointer at promote; cleared at close | low | n/a |
| `docs/CHANGELOG.md` | close | Sprint 37 row appended | low | n/a |

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

**Worked:**
- **Try-trim-first strategy (DEC-1) was correct.** Both 31-line agents had a structurally redundant "tagline + blank + Read-CONTEXT.md + blank" pattern that merged cleanly into one paragraph. No content loss, no ADR-016 cap amend needed. Sprint 34 DEC-2 ADR-016 reservation preserved for Phase 4c without re-juggling.
- **Pre-flight grep on T4 saved time.** Sprint 35 sweep had incidentally already normalized 4 of 5 agents to "Use when..." form; T4 reduced to 1 file edit. Sprint 33 P2-7 partial close + Sprint 35 carryover = 6/7 already compliant. Verifying before patching prevented redundant work.
- **Quality-gated DoD (Q7) was the right call.** Drop the 10% line-reduction target → measurable gates (zero OVER-CAP + 14/14 eval). Final delta was modest (3 agent lines, ~140 tokens) but every quality gate passed clean. Quantitative target would have forced cosmetic trims with negative ROI.
- **T6 references audit found nothing — and that's good signal.** 12 files all bound. Lean surface confirmed. Negative-result audits are still worth running; they harden the no-cleanup-debt assertion.
- **CI flag drop (T7) closes a Sprint 36 loop cleanly.** `continue-on-error: true` was added in `631be1f` as a stopgap until Phase 3 closes R4. Removed exactly when stopgap's reason expired. Tight loop.

**Friction:**
- T6 grep regex needed two passes: literal filename refs + `${CLAUDE_SKILL_DIR}/references/` template form. Single-pass missed template references. Documented in the audit findings; future audits should use the same two-pass.
- T2 description char count (<500) was a soft constraint not enforced by `eval-skills.js`. Manual count required. Enhancement candidate: add R8 char-cap rule to eval-skills.
- Baseline `wc -l` line count vs `audit-baseline.js` line count: 29 vs 30 on dispatcher post-trim. Off-by-one (final newline handling). Both under cap, so functionally fine, but the discrepancy is a footgun for future trim work targeting cap edges. Worth a small comment in `audit-baseline.js`.

**Pattern candidate (surface to user, ask before locking into VALIDATED_PATTERNS.md):**
- Pattern: "Try-trim-first / cap-amend-fallback" — pragmatic decision tree for cap violations. Worked here; could become standard for future cap-bound files.
- Pattern: "Quality gate over quantity gate" — Q7's reframe. Better signal-to-noise than percentage targets for cleanup sprints.
- Pattern: "Pre-flight grep before patch" — verify state before assuming fix scope. T4's reduction from 5 patches to 1 came from this. Worth standardizing in agent description audits.

**Surprise log:**
- All 14 skills passed eval-skills 13/14 → 14/14 with a single 1-line description fix (T2). The R-rule check was sharp; surface was already 99% clean. Sprint 33/34/35 incremental trim got us 99%; this sprint's job was the last 1%.
- Total token reduction across skills was -102 (≈1%) despite 4 description changes. Adding "Do not use" clauses (T3) added tokens; trimming agent body removed them. Near net-zero on skills, real reduction on agents only. Not a surprise after the fact, but useful calibration data for future cleanup planning.
- ADR-016 reservation preservation was a quiet win — Phase 4c (Sprint 38) keeps its reserved ADR slot, so Phase 4 sub-phases don't have to re-juggle the 014-019 numbering scheme.
