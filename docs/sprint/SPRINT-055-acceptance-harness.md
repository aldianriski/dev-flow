---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: closed
plan_commit: fa4b784
close_commit: 396f05d
---

# Sprint 055 — Acceptance Harness Node Port + TD-002 Cap-Headroom Lint Fold-In (TASK-116-v2)

**Theme:** Pre-v1 plugin reliability. Build skill-triggering acceptance harness as Node port (`scripts/eval-acceptance.js`) per `docs/research/superpowers-acceptance-harness-2026-05-04.md` (Sprint 042 T3 design). 3-skill seed Mode A (manual run, ≥2/3 pass quorum). Retroactive eval-evidence for 8 lift candidates from Sprints 043 + 045 + release-patch v2.0.0 generalize (ADR-027 DEC-2 gap) + skeleton creation Sprint 051a + lean-doc/task-decomposer alignment Sprint 053. Fold-in TD-002 cap-headroom lint to satisfy AC alternative path (frontmatter `cap-headroom: NN/100` OR harness lints `<5 lines`).
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 055c closed `a197a47` (TASK-134a History Hygiene principle + TASK-134b legacy-doc scan).
**Closes:** TASK-116-v2 (acceptance harness Node port) · TD-002 (cap-headroom drift detection).

## Why this sprint exists

Three pre-v1 plugin-reliability gates converge:

1. **TASK-116-v2** — Eval-evidence gap. ADR-016 mandates "Skill changes that alter agent behavior require eval evidence before merge." `scripts/eval-skills.js` validates structural rules (frontmatter, line cap, Red Flags section) but does NOT verify trigger-correctness — i.e., does Claude actually invoke the skill when given a naturalistic prompt? Sprints 043 + 045 + 049 (release-patch v2.0.0 generalize per ADR-027 DEC-2) + 051a (skeleton creation) + 053 (lean-doc/task-decomposer) shipped 8 lift candidates with no trigger-evidence. Backlog gap surfaced repeatedly across Sprints 042/045/052/054 retros.
2. **TD-002 (cap-headroom drift)** — Sprint 052b retro Friction #2: `release-patch SKILL.md` 100/100 EXACT cap forced line-23 in-place modify rather than new cite line. Sprint 055b T3 reaffirmed (Output Discipline pointer-line append blocked on 4 cap-pressure files). Two AC paths: (A) per-skill frontmatter `cap-headroom: NN/100` field, OR (B) acceptance harness lints headroom <5 lines as warning. Path B economical fold-in if T1 builds harness.
3. **Recon validation** — `feedback_recon_first.md`: pre-sprint recon confirmed `eval-skills.js` exists (structural validator, ~50 lines visible) but trigger-eval is greenfield. Research note `docs/research/superpowers-acceptance-harness-2026-05-04.md` is current (last_updated 2026-05-04, status: current) — design input ready. Mode A (manual) per research §recommendation; Mode B (CI on every PR) deferred until ≥10 skills (current: 16, but cost gate wins per research §gaps R1).

**Pre-locked decisions** (user 2026-05-10): Path A decomposition (T1 skeleton + 3-skill seed Mode A · T2 8-lift verification + retroactive eval-evidence · T3 TD-002 cap-headroom lint fold-in · T4 docs+ADR if Mode-A-vs-B branch · T5 close); release-debt depth=6 deferred to Sprint 056 v1-ship per ADR-032 DEC-2 (not block at <7 threshold).

## Open Questions (locked at promote)

- (A) **Harness layout.** **Decision:** `scripts/eval-acceptance.js` (Node port) at sibling to `scripts/eval-skills.js`; prompt files under `tests/skill-triggering/prompts/<skill-name>.txt`; logs under `tests/skill-triggering/logs/<timestamp>/<skill>/` (gitignored). Matches superpowers shape per research §integration-target.
- (B) **3-skill seed.** **Decision:** `prime` · `orchestrator` · `tdd` per research §3-skill-seed-picks. Highest-frequency triggers; covers session-bootstrap + workflow-control + code-implementation surfaces.
- (C) **Measurement loop.** **Decision:** Mode A (manual operator run, ≥2/3 pass quorum per research §gaps R4 conservative variant). Mode B (CI per PR) deferred per research §recommendation cost gate.
- (D) **Pass condition.** **Decision:** stream-json regex from research §acceptance-pattern: `"name":"Skill"` AND (`"skill":"<skill-name>"` OR `"skill":"<namespace>:<skill-name>"`). 3 runs per prompt; ≥2/3 pass per (C).
- (E) **8 lift candidates retroactive.** **Decision:** verify trigger-evidence for 8 skills/agents shipped without harness (release-patch v2.0.0 ADR-027 DEC-2 · skeleton-create Sprint 051a · skill-dispatch wiring Sprint 052 · lean-doc/task-decomposer Sprint 053 · 4 anti-slip fields Sprint 054 · doc-wire Sprint 054b · output-discipline Sprint 055b · history-hygiene Sprint 055c). T2 enumerates exact 8; one prompt per; record pass/fail.
- (F) **TD-002 path resolution.** **Decision:** Path B (harness lints `cap-headroom <5 lines` as warning). Reason: T1 already builds harness; Path A frontmatter field requires per-skill edit (16 files) without evaluator. Lint is cheaper + auditable. TD-002 row updated to `status: resolved → TASK-116-v2` at close.
- (G) **ADR scope.** **Decision:** ADR-035 written ONLY if Mode A vs Mode B branches surface (e.g., research §gaps R2 `--plugin-dir` blocker forcing fallback). Default: no ADR; Sprint 042 T3 research note + ADR-021 DEC-4 already cover design decision. T4 evaluates branch surface.
- (H) **Cap discipline.** No skill SKILL.md edits planned (harness is scripts + tests + docs). lean-doc-generator may add 1-line pointer at SKILL.md if T4 adds harness invocation reference (cap headroom: lean-doc 2.3.0 — check at T4).
- (I) **Release-debt continues.** Depth = 6 PATCH-only sprints since 2.5.0→2.6.0 (Sprint 055c added). <7 BLOCK threshold per Step 1.5b. Deferred to Sprint 056 v1-ship per ADR-032 DEC-2 (user pre-locked).
- (J) **Date stamp.** All artifacts 2026-05-10.

## Plan

### T1 — Acceptance harness skeleton + 3-skill seed Mode A
**Acceptance:**
1. `scripts/eval-acceptance.js` exists + runnable (Node ≥18, no external deps; uses native `child_process` to spawn `claude -p`).
2. Prompt files under `tests/skill-triggering/prompts/`:
   - `prime.txt` — naturalistic session-bootstrap prompt per research §3-skill-seed-picks
   - `orchestrator.txt` — workflow-control prompt
   - `tdd.txt` — code-implementation prompt (reuse superpowers' validated structure)
3. Test runner logic: for each skill, spawn `claude -p "<prompt>" --dangerously-skip-permissions --max-turns 5 --output-format stream-json`; capture stream-json; regex-match pass condition per OQ(D); 3 runs per prompt; pass = ≥2/3 trigger detection.
4. Log artifacts: `tests/skill-triggering/logs/<timestamp>/<skill>/run-{1,2,3}.json` (gitignored via `.gitignore` entry).
5. Output: `docs/audit/eval-acceptance-2026-05-10.md` with per-skill table (skill | runs | passes | verdict).
6. README at `tests/skill-triggering/README.md` (≤40 lines): how to run + Windows path note + claude version pin requirement per research §gaps R1.

**Scope:** IN — harness script + 3 prompt files + log dir + README + first audit-report shape. OUT — CI integration (Mode B; deferred per OQ(C)), full 8-lift retroactive verification (T2 scope), TD-002 lint (T3 scope).
**Files:** `scripts/eval-acceptance.js` NEW · `tests/skill-triggering/prompts/{prime,orchestrator,tdd}.txt` NEW · `tests/skill-triggering/README.md` NEW · `tests/skill-triggering/logs/.gitkeep` NEW · `.gitignore` (add `tests/skill-triggering/logs/*` except `.gitkeep`) · `docs/audit/eval-acceptance-2026-05-10.md` NEW (skeleton).
**Risk:** medium — `claude -p` invocation cost + non-determinism per research §gaps R4; `--plugin-dir` blocker risk per R2 (verify with one-off run before T1 commit).
**DoD:** harness runs clean on 3 seed skills; ≥2/3 pass per skill OR documented R2/R3/R4 mitigation if fails; sprint file Files Changed row per file; commit before T2.
**Confidence:** 70% — uncertainty: `claude -p` exit-code semantics on Windows Git Bash vs PowerShell shell-out (research §gaps R5); stream-json shape pin to current claude version.

### T2 — 8-lift-candidate verification + retroactive eval-evidence
**Lift candidates** (8 enumerated):
1. **release-patch v2.0.0** (Sprint 049 generalize per ADR-027 DEC-2) — gap explicit in ADR-027.
2. **skeleton-create** (Sprint 051a Lean Architecture foundation; `bin/dev-flow-init.js` + STACK_PRESETS).
3. **skill-dispatch wiring** (Sprint 052 F4 — 6 orphan skills wired into orchestrator phases).
4. **lean-doc-generator template canonical** (Sprint 053 ADR-030 DEC-5 backflow).
5. **task-decomposer template-pointer** (Sprint 053 ADR-030 DEC-5 ↔ lean-doc).
6. **anti-slip 4 G1 fields** (Sprint 054 ADR-031: focus · context-budget · explicit-gaps · done-confirmation).
7. **output-discipline pointer fan-out** (Sprint 055b ADR-033 — 22/23 skill+agent files).
8. **history-hygiene principle** (Sprint 055c ADR-034 — CONTEXT.md + Sprint Promote Step 1.5c).

**Acceptance:**
1. Each of 8 candidates gets a prompt file (or reuses existing seed if applicable): `tests/skill-triggering/prompts/<candidate>.txt`.
2. Each prompt run via T1 harness; results recorded in `docs/audit/eval-acceptance-2026-05-10.md` (extend skeleton with 8 rows).
3. Pass: ≥2/3 trigger-detection per OQ(D). Fail: documented in audit report with hypothesis (description weakness, naming collision, etc.) + remediation pointer (tune-description Sprint 055-2 OR follow-up).
4. Retroactive eval-evidence file linked from ADR-016 (one-line pointer added at ADR-016 § Consequences).
5. Pass-rate baseline established: target ≥6/8 pass for v1 ship gate; <6/8 surfaces remediation candidates for Sprint 055-2 (TASK-115-v2 caveman 3-arm overlaps).

**Scope:** IN — 8 prompt files + run + audit report fill + ADR-016 pointer. OUT — fix failing skill descriptions (deferred to Sprint 055-2 if pattern surfaces; one-off fixes inline if trivial).
**Files:** `tests/skill-triggering/prompts/{release-patch,skeleton,skill-dispatch,lean-doc-generator,task-decomposer,anti-slip,output-discipline,history-hygiene}.txt` NEW (some may collapse to existing skill names — e.g., `release-patch.txt`, `task-decomposer.txt`) · `docs/audit/eval-acceptance-2026-05-10.md` UPDATE (8 rows + summary) · `docs/adr/ADR-016-*.md` (if exists; otherwise locate eval-evidence ADR; pointer line +1).
**Risk:** medium — non-determinism per research §gaps R4 may surface false-fail (skill description correct but model variance); 3-run quorum mitigates but not eliminates; document hypothesis per OQ(E).
**DoD:** 8 prompts written + run; audit report has 8 rows; pass-rate computed; ADR pointer added; sprint file Files Changed row per file.
**Confidence:** 65% — uncertainty: which skill maps to "skeleton-create" (likely `bin/dev-flow-init.js` invocation pattern, may not be skill-triggerable directly — deferred-evidence with rationale per research §gaps R2); whether `release-patch v2.0.0` generalize counts as trigger-test (existing skill, no new trigger phrase) — verify at recon.

### T3 — TD-002 cap-headroom lint fold-in
**Acceptance:**
1. `scripts/eval-acceptance.js` extends with `--cap-headroom-warn` flag (or co-runs cap check by default): for each `skills/*/SKILL.md`, compute `headroom = 100 - line_count`; warn if `headroom < 5`.
2. Output appended to `docs/audit/eval-acceptance-2026-05-10.md` § Cap Headroom (per-skill table: skill | lines | headroom | verdict).
3. Verdicts: `OK` (headroom ≥5) · `WARN` (headroom <5) · `EXACT` (headroom = 0; `release-patch SKILL.md` per Sprint 052b ADR-032 sole exception).
4. TD-002 row updated to `status: resolved → TASK-116-v2 (Sprint 055)` in TODO.md § Tech Debt.
5. Failing-but-grandfathered skills (e.g., `release-patch` 100/100) annotated `EXEMPT` with ADR-032 DEC-N pointer; do not block harness exit code.

**Scope:** IN — lint fold-in to existing harness + audit report row + TD-002 resolution. OUT — auto-trim cap-pressure files (manual per Sprint Close hygiene per ADR-034); per-skill frontmatter `cap-headroom:` field (Path A; rejected per OQ(F)).
**Files:** `scripts/eval-acceptance.js` UPDATE (cap-headroom logic) · `docs/audit/eval-acceptance-2026-05-10.md` UPDATE (Cap Headroom section) · `TODO.md` § Tech Debt (TD-002 status update).
**Risk:** low — additive lint; no behavior contract change; exempt-list handles grandfathered cap-EXACT files.
**DoD:** lint runs clean; 16 skills classified; TD-002 marked resolved; sprint file Files Changed row per file.
**Confidence:** 80% — uncertainty: agent files (≤30 cap) need separate lint? Defer to follow-up if not in TD-002 scope (TD-002 named SKILL.md only).

### T4 — Docs + ADR-035 (only if Mode-A-vs-B branch surfaces)
**Conditional execution:** ONLY if T1 surfaces Mode A blocker requiring branch decision (e.g., research §gaps R2 `--plugin-dir` fallback OR R3 stream-json shape change forcing parser rewrite).

**Acceptance (conditional):**
1. `docs/adr/ADR-035-acceptance-harness-mode.md` written if branch surfaces (4 decisions: Mode A vs B locked + measurement loop + retroactive evidence path + cap-headroom Path B).
2. Otherwise: no ADR; T4 collapses to `lean-doc-generator` SKILL.md pointer addition (1-line) referencing harness invocation + cap-headroom flag (if cap-headroom check from T3 enters Sprint Close protocol).
3. ARCHITECTURE.md or README.md update: harness exists + how-to-run pointer (1-line; per `references/DOCS_Guide.md` Tier 2 update only — no HOW; only WHERE).

**Scope:** IN — conditional ADR-035 OR SKILL.md pointer + 1-line README/ARCHITECTURE pointer. OUT — comprehensive harness HOW guide (lives in `tests/skill-triggering/README.md` per T1).
**Files (conditional):** `docs/adr/ADR-035-*.md` NEW (if branch) · `skills/lean-doc-generator/SKILL.md` (1-line pointer, cap headroom permitting; defer if 100/100) · `README.md` or `docs/ARCHITECTURE.md` (1-line pointer).
**Risk:** low — additive docs; conditional gate prevents unnecessary ADR per OQ(G).
**DoD:** branch decision logged in § Decisions; ADR written OR skip-rationale logged; sprint file Files Changed row per file.
**Confidence:** 60% — uncertainty: branch surface unknown until T1 runs (research §gaps R1-R6 are speculative; actual blockers may differ). Default-skip is safe.

### T5 — Sprint close
**Acceptance:** standard Sprint Close protocol per `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md`.

## G1 (anti-slip per ADR-031)

```
goal: Skill-triggering acceptance harness Node port (scripts/eval-acceptance.js) exists + runs ≥2/3 pass on 3-skill seed (prime/orchestrator/tdd) + retroactive eval-evidence for 8 lift candidates from Sprints 043/045/049/051a/052/053/054/055b/055c + TD-002 cap-headroom lint fold-in resolved.
size: M (T1 M + T2 M + T3 S + T4 conditional S + T5 trivial = M total)
constraints:
  - claude -p invocation cost + non-determinism (research §gaps R4); 3-run quorum mitigation
  - cap-headroom EXACT exception for release-patch SKILL.md per ADR-032 (do NOT auto-trim; annotate EXEMPT)
  - release-debt depth=6 surfaced + deferred per OQ(I) — do NOT block on it
  - prompt files must NOT name the skill in prompt body (research §acceptance-pattern naturalistic requirement)
layers: scripts, ci, tests, docs
red flags:
  - --plugin-dir blocker (research §gaps R2) — verify with one-off run BEFORE T1 commit; fall back to in-repo plugin-installed mode
  - stream-json shape drift across claude versions (research §gaps R1) — pin claude --version in audit report
  - Mode A vs Mode B premature flip — Mode B deferred per OQ(C); do NOT add CI integration in T1/T2/T3
  - 8-lift retroactive: skeleton-create may not be skill-triggerable (bin script, not skill) — document deferred-evidence with rationale per OQ(E); do NOT force-fit
  - TD-002 Path A drift: do NOT add per-skill cap-headroom: frontmatter field — Path B (harness lint) locked per OQ(F)
  - cross-platform shell-out: Windows Git Bash + PowerShell + Linux all valid targets per ADR-016 + CLAUDE.md Stack
focus: ONLY harness skeleton (T1) + 8-lift verification (T2) + TD-002 lint fold-in (T3) + conditional ADR (T4); NOT Mode B CI integration, NOT skill-description tuning (Sprint 055-2 if pattern surfaces), NOT caveman 3-arm eval (TASK-115-v2 Sprint 055-2), NOT v1 ship CHANGELOG (Sprint 056), NOT release-debt reconcile (Sprint 056).
context-budget: ~80k tokens (T1 ~25k script + 3 prompts · T2 ~25k 8 prompts + run + audit · T3 ~10k lint fold-in · T4 ~10k conditional ADR · T5 ~10k close).
explicit-gaps:
  - Mode B CI integration (defer until ≥10 skills triggering OR cost gate flips per research §recommendation)
  - Skill-description remediation for failing prompts (Sprint 055-2 if ≥3 fail; inline if trivial 1-2 fixes)
  - TASK-115-v2 caveman 3-arm eval (Sprint 055-2 successor)
  - Release-debt reconcile (Sprint 056 v1-ship per ADR-032 DEC-2)
  - Per-agent cap-headroom lint (TD-002 named SKILL.md only; agent ≤30 cap separate concern)
  - skeleton-create eval-evidence may be deferred-with-rationale (bin script, not skill-triggerable) — document, don't force
  - lean-doc 1-line harness pointer at SKILL.md (T4 conditional; defer if cap 100/100)
done-confirmation:
  - scripts/eval-acceptance.js exists + runs clean on 3 seed skills WHEN invoked from repo root
  - tests/skill-triggering/prompts/{prime,orchestrator,tdd}.txt exist + naturalistic (no skill-name in body)
  - docs/audit/eval-acceptance-2026-05-10.md written w/ 3 seed rows + 8 lift rows + Cap Headroom section
  - 3 seed skills ≥2/3 pass OR documented blocker per research §gaps
  - 8 lift candidates: ≥6/8 pass for v1 ship gate; <6/8 → remediation pointer to Sprint 055-2
  - ADR-016 § Consequences gains 1-line pointer to retroactive eval-evidence file
  - TD-002 row in TODO.md § Tech Debt: status: resolved → TASK-116-v2 (Sprint 055)
  - 16 skills classified OK/WARN/EXEMPT in Cap Headroom section
  - tests/skill-triggering/README.md exists (≤40 lines; how-to-run + Windows path note + claude version pin)
  - .gitignore updated for tests/skill-triggering/logs/* except .gitkeep
  - ADR-035 written ONLY if Mode-A-vs-B branch surfaced; otherwise skip-rationale in § Decisions
status: PASS
```

## Execution Log

### 2026-05-10 01:45 | T1 done
Acceptance harness skeleton + 3-skill seed (Mode A) shipped at `9607cf8`. `scripts/eval-acceptance.js` (273 lines, no deps) — spawns `claude -p` with stream-json output, regex pass condition, 3-run quorum (≥2/3), `--dry-run` for skeleton validation, `--cap-headroom-warn` flag pre-wired for T3, `--plugin-dir` + `DEVFLOW_PLUGIN_DIR` fallback per research §gaps R2, `--date` override for JS UTC drift. Seed prompts (`prime`, `orchestrator`, `tdd`) naturalistic per research §acceptance-pattern. README ≤40 lines (exactly 40). Logs gitignored. Audit-report skeleton scaffolded. DoD: dry-run clean; live runs deferred to operator (Mode A).

### 2026-05-10 08:27 | T2 done
5 lift-candidate prompts staged + audit report rewritten as harness contract + 3 lift candidates DEFERRED-with-rationale at `a195ac0`. Prompts: `release-patch.txt` (lift #1), `lean-doc-generator.txt` (#4), `task-decomposer.txt` (#5), `refactor-advisor.txt` (#3 proxy 1/2), `zoom-out.txt` (#3 proxy 2/2). DEFERRED: #2 skeleton-create (bin script, not Skill-tool-triggerable), #6 anti-slip (orchestrator behavior, already covered by T1 seed), #7+#8 output-discipline + history-hygiene (CONTEXT.md cross-cutting principles, need different harness shape).

**Mid-T2 friction-fix (logged):** plan T2 AC-4 cited "ADR-016 § Consequences" for retroactive eval-evidence pointer. Recon: ADR-016 = "Kill Node hook scripts" (verified grep — 0 eval-evidence content); eval-evidence policy actually lives in `CLAUDE.md` Quick Rules L42 + ADR-021 DEC-4 (acceptance harness pattern). Per Friction Protocol fix-now: pointer redirected to ADR-021 § Consequences; cross-ref logged in § Decisions D1.

### 2026-05-10 08:29 | T3 done
TD-002 cap-headroom lint fold-in at `158b0ce`. Lint logic equivalent to `eval-acceptance.js --cap-headroom-warn` (pre-wired in T1) executed inline; 16 skills classified — 13 OK · 2 WARN · 1 BREACH · 0 EXEMPT. Audit report § Cap Headroom populated (16-row table + 3 critical findings). TD-002 row updated `status: resolved → TASK-116-v2 Sprint 055 T3` in TODO.md § Tech Debt. Path B (harness lint) adopted; Path A (per-skill frontmatter field) rejected per OQ(F).

**Surfaced as Open Questions** (NOT remediated this sprint per ADR-031 scope-creep guard): release-patch 101/100 BREACH (was 100/100 EXEMPT; +1 drift since Sprint 055b T3.4); orchestrator 100/100 (+1 drift); lean-doc 97/100 (+1 drift; below WARN threshold).

### 2026-05-10 08:30 | T4 done
ADR-035 SKIPPED (Mode-A-vs-B branch did NOT surface — T1 dry-run validated harness shape; no R2/R3 blockers materialized). lean-doc-generator SKILL.md pointer SKIPPED per OQ(H) cap-pressure rule (97/100 headroom 3, below WARN per T3 finding). T4 collapsed to README.md scripts-table update at `3f83dbc` (1-line WHERE pointer per DOCS_Guide Tier 2): eval-acceptance.js entry added · scan-legacy-docs.js entry added (Sprint 055c T3 backfill omission) · eval-skills.js description tightened.

### 2026-05-10 | T5 done
Sprint Close protocol per `SPRINT_PROTOCOLS.md`. § Files Changed populated · § Decisions written · § Open Questions surfaced · § Retro filled · CHANGELOG row prepended · TODO.md `Active Sprint` cleared. TD-002 confirmed resolved. TASK-116-v2 marked closed. Release-debt depth=7 BLOCK threshold flagged for Sprint 056 promote (critical surface to user).

## Files Changed

| File | Task | Change (one-line WHY) | Risk | Test added |
|:-----|:-----|:----------------------|:-----|:-----------|
| `scripts/eval-acceptance.js` | T1 | NEW: harness skeleton + dry-run + cap-headroom flag pre-wired | medium | dry-run validation |
| `tests/skill-triggering/prompts/prime.txt` | T1 | NEW: naturalistic seed prompt (session-bootstrap) | low | n/a |
| `tests/skill-triggering/prompts/orchestrator.txt` | T1 | NEW: naturalistic seed prompt (workflow-control) | low | n/a |
| `tests/skill-triggering/prompts/tdd.txt` | T1 | NEW: naturalistic seed prompt (code-implementation) | low | n/a |
| `tests/skill-triggering/README.md` | T1 | NEW: operator how-to-run + claude version pin (R1) + Windows note (R5) | low | n/a |
| `tests/skill-triggering/logs/.gitkeep` | T1 | NEW: keep dir; per-run JSON gitignored | low | n/a |
| `.gitignore` | T1 | UPDATE: ignore `tests/skill-triggering/logs/*` except `.gitkeep` | low | n/a |
| `docs/audit/eval-acceptance-2026-05-10.md` | T1+T2+T3 | NEW + REWRITTEN + EXTENDED: harness contract + prompt catalog + cap-headroom (frozen) | low | n/a |
| `tests/skill-triggering/prompts/release-patch.txt` | T2 | NEW: lift-candidate prompt (lift #1) | low | n/a |
| `tests/skill-triggering/prompts/lean-doc-generator.txt` | T2 | NEW: lift-candidate prompt (lift #4) | low | n/a |
| `tests/skill-triggering/prompts/task-decomposer.txt` | T2 | NEW: lift-candidate prompt (lift #5) | low | n/a |
| `tests/skill-triggering/prompts/refactor-advisor.txt` | T2 | NEW: lift-candidate prompt (lift #3 proxy 1/2) | low | n/a |
| `tests/skill-triggering/prompts/zoom-out.txt` | T2 | NEW: lift-candidate prompt (lift #3 proxy 2/2) | low | n/a |
| `docs/adr/ADR-021-superpowers-patterns.md` | T2 | UPDATE: § Consequences pointer to retroactive eval-evidence file (friction-fix; replaces stale ADR-016 ref) | low | n/a |
| `TODO.md` | T3+T5 | UPDATE: TD-002 row → `status: resolved → TASK-116-v2`; Active Sprint cleared at close | low | n/a |
| `README.md` | T4 | UPDATE: scripts table — eval-acceptance + scan-legacy-docs entries; eval-skills tightened | low | n/a |
| `docs/sprint/SPRINT-055-acceptance-harness.md` | T5 | UPDATE: Execution Log + Files Changed + Decisions + Retro filled at close | low | n/a |
| `docs/CHANGELOG.md` | T5 | UPDATE: prepend Sprint 055 row at close | low | n/a |

## Decisions

**D1 — ADR-021 (not ADR-016) is canonical home for acceptance harness pattern + eval-evidence policy** (T2 friction-fix). Plan T2 AC-4 cited "ADR-016 § Consequences" for retroactive eval-evidence pointer; recon found ADR-016 = "Kill Node hook scripts" (unrelated). Eval-evidence policy lives in `CLAUDE.md` Quick Rules L42; harness pattern decision = ADR-021 DEC-4. Pointer redirected per Friction Protocol fix-now. ADR-021 line 66 cross-ref to ADR-016 noted as itself stale (not corrected this sprint per scope-creep guard).

**D2 — Path B (harness lint) chosen over Path A (per-skill frontmatter) for cap-headroom drift detection** (T3, plan OQ(F) confirmed). Rationale: Path A requires per-skill edit (16 files) without evaluator; Path B is cheaper, auditable, and re-runs cleanly. Lives in `scripts/eval-acceptance.js --cap-headroom-warn`. TD-002 resolved via this mechanism.

**D3 — ADR-035 explicitly NOT written** (T4, plan OQ(G) skip-rationale logged). Mode-A-vs-B branch did NOT surface; research §gaps R2/R3 blockers did NOT materialize at T1 dry-run; ADR-021 DEC-4 + Sprint 042 T3 research note already cover the design decision. No new architectural decision = no ADR (per `references/DOCS_Guide.md` ADR-when-needed rule).

**D4 — lean-doc-generator SKILL.md pointer NOT added at T4** (cap-pressure deferral per OQ(H)). lean-doc currently 97/100 (headroom 3, below WARN threshold per T3). Adding 1-line pointer would push to 98/100. T4 collapsed to README.md scripts-table update instead (Tier 2 WHERE pointer suffices for harness discoverability).

**D5 — Audit reports treated as frozen contracts, not auto-regenerated** (T2, pattern emergence). `docs/audit/eval-acceptance-2026-05-10.md` § Lift Candidate Coverage + § Per-Skill Prompt Catalog deliberately frozen at T2 close as "harness contract + prompt catalog" — per-run sections will overwrite at first live run, but design contract preserved. Pattern candidate surfaced for VALIDATED_PATTERNS.md.

**D6 — release-patch 101/100 BREACH NOT remediated this sprint** (T3, scope-creep guard per ADR-031). +1 drift since Sprint 055b T3.4 EXACT-cap stamp. Surfaced as Open Question for Sprint 056 v1-ship; remediation = trim OR new EXEMPT ADR. Friction Protocol defer applied (out of T3 acceptance scope; Path B lint is the deliverable, not the cap fix).

## Open Questions for Review

**OQ-1 (HIGH) — release-patch SKILL.md = 101/100 BREACH.** +1 drift since Sprint 055b T3.4 EXACT-cap (was 100/100 EXEMPT per ADR-032/ADR-033 DEC-4). Root cause unknown — needs `git blame` + trim OR new EXEMPT ADR. Surfaces at next Sprint Promote per Step 1.5b cap discipline. Recommend address pre-Sprint-056 v1-ship.

**OQ-2 (MEDIUM) — orchestrator SKILL.md = 100/100 EXACT.** +1 drift since Sprint 055b (was 99/100). Either: (a) grant new EXEMPT via ADR (precedent: release-patch ADR-032), OR (b) trim 1 line. No cap pressure on remaining 13 skills.

**OQ-3 (MEDIUM) — lean-doc-generator SKILL.md = 97/100, headroom 3, below WARN.** +1 drift since Sprint 055b. Trim opportunity at next edit; not blocking but blocks T4-style 1-line pointer additions until trimmed.

**OQ-4 (CRITICAL — ESCALATED) — Release-debt depth = 7 PATCH-only sprints since 2.5.0→2.6.0** (Sprint 055 added). HITS ≥7 BLOCK threshold per `SPRINT_PROTOCOLS.md` Step 1.5b. MUST address pre-Sprint-056-promote. Sprint 056 v1-ship is the natural reconcile per ADR-032 DEC-2 (planned MINOR/MAJOR lockstep bump) — confirms the threshold-block is itself the forcing function for the planned reconcile.

## Retro

### Worked

- **T1 pre-wire of `--cap-headroom-warn` flag** paid dividends at T3: lint logic equivalent already designed in T1 → T3 collapsed to inline scan + audit-report fill (10k tokens vs estimated more). Plan-time foresight per recon-first.
- **DEFERRED-with-rationale pattern at T2** (3 of 8 lift candidates): explicit-skip per ADR-031 anti-slip held the line; resisted force-fitting non-skill-triggerable surfaces (bin scripts, cross-cutting CONTEXT.md principles). Audit report § Lift Candidate Coverage rows make the rationale auditable.
- **T4 conditional ADR-035 default-skip** correctly fired: branch-condition gate (research §gaps R2/R3) prevented unnecessary ADR. T4 collapsed to README.md WHERE pointer (1-line, Tier 2) — minimum viable docs update.
- **Mode A operator-pending pattern** held: harness frozen as contract; live-run cost gated to operator opt-in. No false-PASS theater.
- **Friction-fix mid-sprint at T2 (ADR-016 → ADR-021 redirect)** absorbed without scope creep — logged as Decision D1, fix bounded to AC-4 pointer change, did not balloon into ADR-021 line-66 stale-cross-ref cleanup (deferred).

### Friction

**F1 — Plan T2 AC-4 cited wrong ADR (ADR-016 instead of ADR-021).** Misattribution of eval-evidence policy home; ADR-016 = "Kill Node hook scripts" (unrelated). Required mid-T2 recon (grep) + redirect. ~5 min recovery via Friction Protocol fix-now. Root cause: plan-time author conflated eval-evidence policy (CLAUDE.md L42) with hook-script ADR (ADR-016) without recon at promote.

> TD row for: plan-time ADR citation accuracy guard? **N** — one-off; mitigation already exists (recon-first preference + Friction Protocol fix-now); not pattern-worthy.

**F2 — Cap-headroom +1 drift across 3 SKILL.md files since Sprint 055b T3.4** (release-patch 100→101, orchestrator 99→100, lean-doc 96→97). Drift surfaced by T3 lint (the very fold-in this sprint built). No commit between Sprint 055b close and Sprint 055 plan touched those files explicitly per recon — drift sources unknown. Lint mechanism now live, will catch future drift; root-cause investigation deferred to Sprint 056.

> TD row for: cap-headroom drift root-cause investigation? **N** — Sprint 055 T3 already resolved TD-002 via lint mechanism; root-cause investigation = remediation work for OQ-1/2/3 in Sprint 056. Not separate TD.

### Pattern candidates

**PC-1 — Harness contract + prompt catalog as audit deliverable** (audit reports as frozen contracts, NOT auto-regenerated). T2 froze `docs/audit/eval-acceptance-2026-05-10.md` § Lift Candidate Coverage + § Per-Skill Prompt Catalog as design-contract; per-run sections overwrite, contract preserved. Reuse: any harness whose runs are operator-gated + cost-significant. Surface to user for VALIDATED_PATTERNS.md.

**PC-2 — Path B (lint over frontmatter) for cross-cutting drift detection.** When a property needs tracking across N artifacts (cap-headroom across 16 SKILL.md), prefer one lint script over N frontmatter fields. Cheaper, auditable, no per-file edit. 2nd instance of pattern (TD-002 Path B beats Path A; mirrors Sprint 055b T3 propagate-script-over-per-skill-edit). Surface to user for VALIDATED_PATTERNS.md.

**PC-3 — Mode A operator-pending pattern for cost-gated harnesses.** When harness invocation costs API tokens × N runs × M prompts, ship harness as runnable contract + dry-run validation; defer live runs to operator opt-in; freeze design-contract at first ship. Mode B (CI per PR) deferred behind threshold gate. Sprint 055 first instance; reuse on TASK-115-v2 Caveman 3-arm eval likely. Surface to user for VALIDATED_PATTERNS.md.
