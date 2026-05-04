---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending
close_commit: pending
---

# Sprint 043 — EPIC-Audit Phase 4d (Mattpocock skill library)

**Theme:** Deep-audit `mattpocock/skills` against dev-flow — diff dev-flow's `tdd`/`diagnose`/`zoom-out`/`task-decomposer` skills vs mattpocock's same-named skills (trigger-phrase + reference-graph deltas), evaluate skill-bucketing migration cost/benefit at 17-skill scale, reconcile `CONTEXT.md` end-to-end, audit `.out-of-scope/` directory pattern as ADR-pointer surface, lock decisions in ADR-022. Adopt-or-reject each candidate with rationale; no skill behavior change without eval evidence (defers to TASK-116 acceptance harness per ADR-021 DEC-4).
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 042 closed `74e1e50`.
**Successor:** Sprint 044 (EPIC-Audit Phase 4e — Get-shit-done patterns).

---

## Why this sprint exists

Sprint 034 external-refs probe (`docs/audit/external-refs-probe.md` §113–147) classified `mattpocock/skills` as the third deep-audit target (placed after caveman + superpowers per probe line 169 — "biggest scope, smallest immediate-value-per-hour"). Five concrete adopt candidates surfaced in the probe; none decided. Sprint 043 lands them as research notes + ADR-022.

Five probe-flagged candidates:

1. **Skill-bucket convention** — `engineering/`, `productivity/`, `misc/`, plus excluded `personal/` and `deprecated/`. dev-flow has 17 flat skills; bucketing improves discoverability and signals lifecycle (deprecated bucket = graceful retirement instead of deletion). Probe synthesis line 163 set the threshold: "Adopt only when skill count exceeds ~20." dev-flow at 17 skills + 7 agents — borderline. Decision needs explicit threshold + cost matrix.
2. **Bucket-level `README.md` indexing** — each bucket folder has its own README listing skills with one-line descriptions, linking to `SKILL.md`. Mechanical to generate; aids new-contributor onboarding. Coupled to (1) — only meaningful if buckets adopted.
3. **`.out-of-scope/` directory** — explicit "we considered this and said no" surface. Pairs naturally with dev-flow's ADR practice for negative-space decisions. dev-flow's "DEFER" decisions (ADR-021 DEC-3 shim, ADR-021 DEC-6 tests-dir, ADR-020 DEC-6 statusline-badge) currently live ONLY in ADR rejection-rationale paragraphs — no top-level surface.
4. **`docs/adr/` co-located convention** — dev-flow already adopted this in practice (ADR-019/020/021 all live at `docs/adr/`). Verify mattpocock's convention matches; lock as documented standard, not just emergent practice.
5. **TDD skill structure cross-check** — mattpocock's `tdd` skill is ~1100 words with explicit trigger phrases (`"red-green-refactor"`, `"test-first development"`, `"integration tests"`) and cross-references to `tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`. dev-flow's `tdd` skill is 80 lines (well under 100-line cap) with different trigger surface. Diff trigger-phrase coverage + reference-graph; don't lift verbatim (probe reject-1: "1100 words exceeds dev-flow's 100-line cap"). Same axis applies to `diagnose`, `zoom-out`, `task-decomposer` — diff in T1.

This sprint is **decision-only** for items 1, 2, 3 (research notes + ADR), **scope-confirm** for item 4 (already adopted; just lock), and **diff-only** for item 5 (research note; no skill edits — those would require TASK-116 acceptance evidence per ADR-021 DEC-4). No skill behavior changes; no new skills written; no bucket migration this sprint. Bucket migration if approved = its own sprint with skill-import path-rewrite checklist.

---

## Open Questions (locked at promote — user "approve all" pattern, 2026-05-04)

- (a) **External fetch tool** — resolved: gh CLI primary (no local cache for `mattpocock/skills`). Source = `gh api repos/mattpocock/skills/contents/...` exclusively. SHA pin mandatory in each research note. WebFetch fallback on gh failure; cached probe (`docs/audit/external-refs-probe.md` §113–147) on both fail. Per Sprint 040 codified policy + Sprint 041/042 confirmed precedent.
- (b) **Same-named skill diff scope (T1)** — resolved: diff **all four** dev-flow skills (`tdd`, `diagnose`, `zoom-out`, `task-decomposer`) against mattpocock's same-named skills if they exist; if mattpocock-side is missing for a given skill, record as "no upstream — dev-flow original" in research note (still useful: anchors lineage). Output = single research note with 4-skill comparison matrix, NOT 4 separate notes.
- (c) **Bucket-migration threshold (T2)** — resolved at promote: **lock 20-skill threshold from probe synthesis line 163** as default; T2 to surface alternative thresholds (e.g., when domain-grouping would aid discoverability earlier — agents at 7, agent-bucket?) but recommendation defaults to "defer until 20 skills." Migration cost matrix (path-rewrite, plugin auto-discovery impact, skill cross-link breakage) IS in scope for T2.
- (d) **`.out-of-scope/` adoption shape (T3)** — resolved at promote: **adopt as `.out-of-scope/` directory** at repo root (mirror mattpocock layout exactly), seed with **3 negative-space pointers** in this sprint (the three DEFER decisions cited above: ADR-021 DEC-3 shim, ADR-021 DEC-6 tests-dir, ADR-020 DEC-6 statusline-badge). Each pointer = single markdown file `<slug>.md` with frontmatter (date / sourcing-ADR / re-eval-trigger). NOT a verbatim mattpocock copy of their `.out-of-scope/` content.
- (e) **`CONTEXT.md` reconciliation depth (T2)** — resolved at promote: **read mattpocock `CONTEXT.md` end-to-end** (gh CLI raw fetch + SHA pin), produce side-by-side section matrix in T2 research note (not a separate note — keeps T2 self-contained). Reconciliation strategy = additive only (lift mattpocock sections that fill dev-flow gaps; do NOT replace existing sections). If mattpocock has overlapping vocabulary that conflicts with dev-flow's domain language, default to dev-flow's existing definition + record divergence in research note for future re-eval.

---

## Plan

### T1 — Diff dev-flow's `tdd`/`diagnose`/`zoom-out`/`task-decomposer` vs mattpocock same-named skills
**Scope:** quick · **Layers:** docs, governance · **Risk:** low · **AFK**
**Acceptance:** `docs/research/mattpocock-skill-diff-2026-05-04.md` exists with: (a) gh CLI raw fetch + SHA pin for each mattpocock skill found (verify path via `gh api repos/mattpocock/skills/contents/skills` first — productivity vs engineering vs misc bucket location), (b) 4-skill comparison matrix (rows: tdd / diagnose / zoom-out / task-decomposer; columns: mattpocock-line-count / mattpocock-trigger-phrases / mattpocock-references / dev-flow-line-count / dev-flow-trigger-phrases / dev-flow-references / delta-summary), (c) trigger-phrase delta call-out per skill (which mattpocock phrases dev-flow lacks; which dev-flow phrases are dev-flow-original), (d) reference-graph delta (which mattpocock cross-refs would be lift candidates if their content adapted to dev-flow's WHY/WHERE-only standard), (e) per-skill recommendation: lift-trigger-phrase (Y/N + which) / lift-reference-pointer (Y/N + which) / no-change (with rationale). Net: 0 skill edits this sprint; recommendations queue to TASK-116 acceptance harness for behavior-change verification per ADR-021 DEC-4. § Decisions row in sprint file: trigger-phrase lift recommendations + ADR-021-DEC-4 deferral confirmation.
**Source:** `gh api repos/mattpocock/skills/contents/skills/productivity` (verify path first); fetch each found skill via `gh api repos/mattpocock/skills/contents/skills/<bucket>/<skill>/SKILL.md`.
**Depends on:** none.
**Note:** READ-ONLY audit. NO `skills/<name>/SKILL.md` edits this sprint. Bucket-location finding from path-verify step feeds T2 (which buckets exist, what's their distribution). License check via `gh api repos/mattpocock/skills/license` before T1 commit — record SHA + MIT confirmation in research note header per Sprint 040/041/042 precedent.

### T2 — Audit skill-bucket migration cost/benefit + reconcile `CONTEXT.md` end-to-end
**Scope:** quick · **Layers:** docs, governance · **Risk:** medium · **HITL** *(reviewer must verify migration-cost matrix completeness + CONTEXT.md additive-only discipline)*
**Acceptance:** `docs/research/mattpocock-bucket-and-context-2026-05-04.md` exists with two parts: **Part A (bucketing)** — (a) mattpocock bucket structure with skill counts per bucket (data from T1's `gh api .../contents/skills` listing), (b) dev-flow's 17 skills + 7 agents proposed bucket placement (engineering / productivity / misc / governance? new bucket?), (c) migration cost matrix (rows: path rewrite in plugin auto-discovery / cross-link breakage in SKILL.md cross-refs / hooks.json path drift / `bin/dev-flow-init.js` scaffold path drift / agents/ moves Y/N / docs cross-refs from CLAUDE.md+CONTEXT.md / external-doc cross-refs from README.md; columns: cost-estimate / risk / mitigation), (d) recommendation: defer until 20-skill threshold (default per OQ-c) OR alternative threshold + rationale, (e) if defer recommended, surface trigger conditions for re-eval (e.g., "when skill count = 20" or "when first skill marked deprecated"). **Part B (CONTEXT.md reconciliation)** — (f) gh CLI raw fetch of `mattpocock/skills/CONTEXT.md` + SHA pin, (g) section-level matrix (mattpocock sections vs dev-flow sections — present/absent/divergent), (h) lift-candidate list (sections mattpocock has that dev-flow lacks AND would add WHY/WHERE value), (i) divergence list (overlapping vocab where definitions differ — default to dev-flow's per OQ-e), (j) recommendation: 0 sections to lift / N sections to lift (additive only) — surface to T4 ADR. § Decisions row in sprint file: bucket defer Y/N + 20-skill threshold lock + CONTEXT.md lift count + reconciliation strategy.
**Source:** `gh api repos/mattpocock/skills/contents/skills` (bucket listing) + `gh api repos/mattpocock/skills/contents/CONTEXT.md` (raw fetch).
**Depends on:** T1 (T1's path-verify step produces the bucket listing T2 reuses; avoids redundant gh fetch).
**Note:** READ-ONLY audit + design only. NO skill folder moves, NO CONTEXT.md edits this sprint (those are scope creep; CONTEXT.md edits if approved = own sprint with re-prime + agent-context refresh checklist).

### T3 — Adopt `.out-of-scope/` directory + seed with 3 negative-space pointers
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **AFK**
**Acceptance:**
1. `.out-of-scope/` directory exists at repo root.
2. `.out-of-scope/README.md` exists (≤30 lines per agents/ convention) explaining: purpose ("we considered this and said no" surface), pointer-file format (frontmatter: `date`, `sourcing_adr`, `re_eval_trigger`), relationship to `docs/adr/` (ADR rejects = decision; `.out-of-scope/` pointer = discoverable surface), how to add a new pointer.
3. Three pointer files seeded:
   - `.out-of-scope/run-hook-shim.md` — sources ADR-021 DEC-3; re-eval trigger = "hook count >5 OR cross-platform reconsidered" per Sprint 042 retro.
   - `.out-of-scope/tests-dir-empty-scaffold.md` — sources ADR-021 DEC-6; re-eval trigger = "TASK-116 lands first test files."
   - `.out-of-scope/statusline-savings-badge.md` — sources ADR-020 DEC-6; re-eval trigger = "`dev-flow-compress` skill has eval coverage AND stable invocation contract" per Sprint 041 OQ1.
4. Each pointer file ≤20 lines (frontmatter + 1 paragraph context + 1 paragraph re-eval criteria).
**Depends on:** T2 (T2's CONTEXT.md reconciliation may surface additional negative-space items worth seeding — but only the 3 OQ-d-locked items land this sprint; new candidates from T2 queue as backlog).
**Note:** Mechanical lift — `.out-of-scope/` directory is the FIRST non-research/non-ADR file structure created this sprint. Pointers are CONTENT-LIGHT (frontmatter + ≤2 paragraphs); they POINT to ADRs, do not duplicate ADR rationale. Lineage credit: mattpocock MIT verified in T1; T3 commit msg references SHA + MIT confirmation.

### T4 — ADR-022 (Mattpocock skill-library patterns adoption decisions)
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer must verify ADR completeness + alignment with T1+T2+T3 outputs)*
**Acceptance:** `docs/adr/ADR-022-mattpocock-skill-library-patterns.md` exists, status Accepted, format follows ADR-019/020/021 precedent (Context / Decision / Alternatives / Consequences / References). Captures:
1. T1 trigger-phrase + reference-graph delta findings; per-skill recommendation (defer behavior change to TASK-116 — confirms ADR-021 DEC-4).
2. T2-PartA bucket-migration deferral + 20-skill threshold lock + re-eval triggers.
3. T2-PartB `CONTEXT.md` reconciliation strategy (additive-only) + lift-count decision.
4. T3 `.out-of-scope/` directory adoption + 3-pointer seed + frontmatter spec.
5. `docs/adr/` co-located convention (already in practice since ADR-019; this ADR locks it as documented standard, not emergent practice — closes probe item 4).
6. Lineage credit (mattpocock MIT verified).
**Depends on:** T1, T2, T3.
**Note:** ADR-022 sequential — confirmed via `ls docs/adr/` (max = 021). PR template is NOT touched this sprint (already landed Sprint 042 T4). If T2 recommends `CONTEXT.md` lifts, ADR-022 records the recommendation + queues edits to a future sprint (not landed in this sprint per OQ-e additive-only discipline + Sprint 042 DEC pattern of decision-vs-implementation split).

---

## Dependency Chain

```
T1 ─→ T2 ─→ T3 ─→ T4
```

T1 → T2 (T2 reuses T1's bucket-listing gh fetch result). T2 → T3 (T3 confirms 3 pointer slugs are sourced from existing ADR DEC rows; T2 may surface adjacent candidates that T3 deliberately excludes). T3 → T4 (T4 ADR captures T3's directory creation as a landed decision, not a proposal). No parallelization opportunity — sequential by data flow.

---

## Cross-task risks

- **gh CLI primary policy** (Sprint 040 codified, Sprint 041/042 confirmed). Drop leading slash on Git Bash. Fallback: WebFetch → cached probe summary (`docs/audit/external-refs-probe.md` §113–147).
- **No local plugin cache** for `mattpocock/skills` — gh CLI is the ONLY source. Bundle gh calls per task to avoid rate-limit. SHA pin mandatory per Sprint 041 dual-source pattern (gh-only this sprint; SHA stands alone).
- **Path-verify before raw fetch** — probe references `mattpocock/skills/skills/productivity/caveman/SKILL.md` (verified Sprint 041) but mattpocock-side `tdd` / `diagnose` / `zoom-out` / `task-decomposer` paths NOT verified. T1 MUST run `gh api .../contents/skills` first; if path missing, fall back to repo-tree search via `gh api .../git/trees/HEAD?recursive=1`.
- **Bucket-migration recommendation drift risk** — OQ-c locks 20-skill default. T2 must NOT recommend bucketing now (17 skills < threshold) UNLESS migration-cost matrix shows zero cost — extremely unlikely given path-rewrite scope. If T2 does recommend, surface with explicit threshold-override rationale.
- **`.out-of-scope/` slippery slope** — T3 must lock ONLY the 3 OQ-d-named pointers. Any additional candidates surfaced during T1/T2 queue as backlog tasks, not landed in this sprint. Otherwise T3 becomes a "negative-space sweep" with unbounded scope.
- **`CONTEXT.md` lift discipline** — T2 OQ-e is additive-only. NO existing dev-flow `CONTEXT.md` section is replaced this sprint. If T2 recommends a section lift, it lands as a recommendation in ADR-022 — actual `.claude/CONTEXT.md` edits queue to a future sprint with re-prime + agent-context refresh checklist (CONTEXT.md is read by every agent; edits have ripple risk).
- **17→20 skill counter-pressure** — phases 4e (Sprint 044 GSD) and 4f (Sprint 045 skill-creator wrapper patterns) may add new skills. If either lands a new skill before bucket re-eval, threshold could be hit mid-EPIC. T4 ADR-022 must explicitly acknowledge that EPIC-Audit completion (Sprint 047) triggers a bucket-threshold re-check; do NOT silently kick the can.
- **ADR-022 sequential numbering** — max ADR = 021 (Sprint 042 just landed). ADR-022 confirmed safe via `ls docs/adr/` (verify pre-T4-commit per Sprint 040/041/042 retro pattern).
- **Decision-only sprint mostly** — T1+T2+T4 = research + ADR (zero code). T3 is the ONLY landed-file task (`.out-of-scope/` directory + 3 pointer files + bucket README). release-patch should NOT skip-bump (`.out-of-scope/` is contributor-visible governance surface; PATCH justified, not docs-only).

---

## Sprint DoD

- [ ] T1 `docs/research/mattpocock-skill-diff-2026-05-04.md` exists with 4-skill comparison matrix + trigger-phrase delta + reference-graph delta + per-skill recommendation. § Decisions row landed.
- [ ] T2 `docs/research/mattpocock-bucket-and-context-2026-05-04.md` exists with Part A (bucket migration cost matrix + defer rationale + threshold lock) + Part B (CONTEXT.md reconciliation matrix + lift recommendations). § Decisions row landed.
- [ ] T3 `.out-of-scope/` directory exists with `README.md` + 3 pointer files (`run-hook-shim.md`, `tests-dir-empty-scaffold.md`, `statusline-savings-badge.md`). Each pointer ≤20 lines with required frontmatter.
- [ ] T4 `docs/adr/ADR-022-mattpocock-skill-library-patterns.md` exists, status Accepted, captures T1+T2-PartA+T2-PartB+T3 + `docs/adr/` convention lock + lineage credit. § Decisions row landed.
- [ ] Plan-lock commit landed before any T1..T4 commit.
- [ ] Close commit + CHANGELOG row + TODO update + retro.
- [ ] Open questions (a–e above) resolved on promote, recorded as locked decisions.
- [ ] Date verification: all artifacts stamped `2026-05-04` (per Sprint 042 retro pattern candidate #4 — pre-flight date check).

---

## Execution Log

### 2026-05-04 | T1 done — pending commit
mattpocock skill paths verified via `gh api repos/mattpocock/skills/contents/skills/engineering` (license MIT confirmed via `gh api repos/.../license`; SHA pinned `b843cb5ea74b`). 3 same-named skills found in `engineering/` bucket (tdd 109 lines, diagnose 117 lines, zoom-out 7 lines). `task-decomposer` has no upstream (dev-flow original; mattpocock has issue-tracker-workflow skills `to-issues`/`to-prd`/`triage` instead — different domain framing).

Output: `docs/research/mattpocock-skill-diff-2026-05-04.md` — 4-skill comparison matrix + trigger-phrase deltas + reference-graph deltas + per-skill lift recommendations.

**Key findings:**
- `tdd` mattpocock 109 vs dev-flow 81 lines. Mattpocock body richer (Anti-Pattern Horizontal Slices section, deep references to tests.md/mocking.md/etc); dev-flow body is intentionally lean per 100-line cap.
- `diagnose` mattpocock 117 vs dev-flow 73 lines. Mattpocock Phase 1 ("Build a feedback loop" with 10-method enumeration + iterate-on-loop + non-deterministic-bugs subsections) is much richer.
- `zoom-out` mattpocock 7 lines vs dev-flow 55 lines. **Inverse finding** — dev-flow superior here. mattpocock has `disable-model-invocation: true` (manual only); dev-flow auto-triggers via richer trigger-phrase surface.
- `task-decomposer` — no upstream. dev-flow original.

5 trigger-phrase lift candidates queued to TASK-116 acceptance harness for verification:
1. `tdd` ← `red-green-refactor` (narrow, strong)
2. `tdd` ← `integration tests` (common phrasing)
3. `tdd` ← `test-first development` (alternative name)
4. `diagnose` ← `performance regression` (narrow, specific)
5. `diagnose` ← `diagnose this` / `debug this` (invocation aliases)

Reject list (do NOT add even after eval): `tdd ← build features|fix bugs` (vague, collide), `diagnose ← broken|throwing|failing` (one-word, high false-positive).

Per ADR-021 DEC-4: NO skill edits this sprint. T1 surfaces candidates; TASK-116 verifies; only validated phrases ship.

---

## Files Changed

*(Empty — one row per file as work lands.)*

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/research/mattpocock-skill-diff-2026-05-04.md` | T1 | NEW (~110 lines) — 4-skill matrix + trigger-phrase deltas + reference-graph deltas + per-skill recommendations + bidirectional finding | low | — |
| `docs/sprint/SPRINT-043-mattpocock-skill-library.md` | T1 | Execution Log + § Decisions DEC-1, DEC-2, DEC-3 rows | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 (T1) | 5 trigger-phrase lift candidates from mattpocock queued to TASK-116 acceptance harness; NO skill edits this sprint | Per ADR-021 DEC-4 skill behavior changes require eval evidence; surface candidates here, verify in TASK-116 sprint, ship only validated phrases | ADR-022 (pending T4) |
| DEC-2 (T1) | **Bidirectional finding:** `zoom-out` is dev-flow > mattpocock (55 vs 7 lines, auto-trigger vs disable-model-invocation). NO LIFT for zoom-out | Avoid future "match mattpocock" pressure; record explicitly per Sprint 042 DEC-2 pattern | ADR-022 (pending T4) |
| DEC-3 (T1) | `task-decomposer` has no mattpocock upstream; dev-flow original. mattpocock issue-tracker-workflow skills (`to-issues`/`to-prd`/`triage`) are different domain framing | Lineage record; not a fork | ADR-022 (pending T4) |

---

## Open Questions for Review

*(Empty — surface any execution-time discoveries here. All promote-time OQs already locked above.)*

---

## Retro

*(Empty — fill at close per Sprint Close Protocol step 4.)*

### Worked

### Friction

### Pattern candidates (pending user confirm)

### Surprise log (cross-ref to Execution Log)
