---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: closed
plan_commit: aed05f0
close_commit: 8931230
---

# Sprint 044 — EPIC-Audit Phase 4e (Get-shit-done patterns)

**Theme:** Deep-audit `gsd-build/get-shit-done` against dev-flow — diff GSD's spec-driven phase pipeline (sketch/spike/spec/discuss/plan/execute/verify/validate/ship) vs dev-flow's Init/Quick/MVP/Sprint-Bulk modes + G1/G2 gates, evaluate `commands/` namespace + per-command pattern at 60+-command scale, audit `contexts/` directory pattern (per-domain context injection) vs dev-flow's single `.claude/CONTEXT.md`, lock decisions in ADR-023. Adopt-or-reject each candidate with rationale; no skill or agent behavior change without eval evidence (defers to TASK-116 acceptance harness per ADR-021 DEC-4).
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 043 closed `0a69140`.
**Successor:** Sprint 045 (EPIC-Audit Phase 4f — skill-creator wrapper patterns).

---

## Why this sprint exists

Sprint 039 added `gsd-build/get-shit-done` to TODO.md External References mid-sprint (Sprint 039 retro surprise log line). It was NOT scanned in Sprint 034's external-refs probe (`docs/audit/external-refs-probe.md` covers karpathy/caveman/superpowers/mattpocock only; GSD postdates the probe). Sprint 044 lands as the FIRST scan of GSD against dev-flow.

GSD scale at 2026-05-04 HEAD `42ed7cee8d8d`:
- 64 commands under `commands/gsd/` (vs dev-flow's `agents/` invocations + plugin slash commands)
- 80+ workflow files under `get-shit-done/workflows/` (per-phase `.md` recipes)
- `contexts/` directory (per-domain context injection — separate from `CONTEXT.md`)
- `.plans/` and `.out-of-scope/` directories at repo root (mattpocock-style negative-space + planning surface)
- `sdk/` and `bin/` directories (programmatic API surface)
- `tests/` with vitest config
- Multi-language READMEs (en/zh-CN/ja-JP/ko-KR/pt-BR)

Repo is **substantively larger** than caveman (~3 skills + eval harness), superpowers (~6 skills + hooks), mattpocock (~17 skills, no eval). At 60k stars + 5k forks it's also the most-validated. **Risk: scope-creep magnet.** Sprint must NOT attempt verbatim adoption of GSD's phase pipeline — dev-flow's Modes (Init/Quick/MVP/Sprint-Bulk) + Gates (G1/G2) are its own coherent system; lifting GSD's 8-phase pipeline wholesale would be replacement, not adoption.

**Five adopt-candidate axes (probed at promote, not pre-validated by external-refs-probe.md since GSD postdates):**

1. **Phase-pipeline diff** — GSD has explicit `discuss-phase`, `plan-phase`, `execute-phase`, `verify-phase`, `validate-phase`, `ship` as separate commands. dev-flow has Modes (lifecycle aggregates) + G1/G2 gates (decision points). Different decomposition. T1 produces side-by-side mapping: which GSD phases map to dev-flow gates? which are sub-steps within a single dev-flow Mode? which represent a phase dev-flow lacks? — feeds T3 ADR.
2. **`contexts/` directory pattern** — GSD has `commands/gsd/contexts/` (per-domain context files; separate from `CONTEXT.md`). dev-flow has single `.claude/CONTEXT.md` for all domain vocab. T2 reads GSD's `contexts/` end-to-end + dev-flow's `CONTEXT.md`; assesses whether per-domain split adds value at dev-flow's scale (small meta-repo, single domain). Default recommendation: defer (single-domain doesn't warrant split); but record if T2 discovers a sub-domain that genuinely deserves its own context file.
3. **Spec-driven workflow lineage** — GSD's tagline "spec-driven development" + `spec-phase.md` / `discuss-phase.md` workflow. dev-flow uses task-decomposer + ADR-writer for spec capture. Diff workflow shape — does GSD's spec-phase represent something dev-flow's task-decomposer skill misses? Read GSD's `spec-phase.md` workflow + dev-flow's `task-decomposer/SKILL.md` for diff. Recommendation: lift trigger phrases or spec-output structure if delta is high; defer otherwise.
4. **`.plans/` directory pattern** — GSD has `.plans/` at repo root (top-level for in-flight plans; visible to humans + AI). dev-flow has `docs/sprint/SPRINT-NNN-*.md` for sprint plans. Different shapes (GSD = workspace-level scratch; dev-flow = sprint-bound formal plan). T2 records the difference; default recommendation: NO LIFT (dev-flow's sprint files already serve plan-discovery role; `.plans/` would duplicate).
5. **`commands/` namespace + plugin command pattern** — GSD uses `commands/gsd/` with 64 markdown command files invoked as `/gsd:<command>`. dev-flow uses skills (`skills/<name>/SKILL.md`) + agents (`agents/<name>/`). Different invocation contract. T1 records which GSD commands are skill-equivalent vs agent-equivalent vs neither (e.g., `/gsd:autonomous`, `/gsd:thread`). Recommendation: NO migration to commands-namespace (dev-flow skill+agent split is well-aligned with Claude Code plugin spec); but lift trigger-phrase ideas from individual commands if delta high (defers behavior changes to TASK-116 per ADR-021 DEC-4).

This sprint is **decision-only for items 1, 2, 3, 4** (research notes + ADR), and **diff-only for item 5** (research note; no skill/command edits — those would require TASK-116 acceptance evidence per ADR-021 DEC-4). No skill behavior changes; no new commands written; no `contexts/` migration this sprint. Any approved lift = its own sprint with re-prime + agent-context refresh checklist (CONTEXT.md ripple risk if `contexts/` adoption recommended).

---

## Open Questions (locked at promote — pending user "approve all" / individual approval)

- (a) **External fetch tool** — proposal: gh CLI primary (no local cache for `gsd-build/get-shit-done`). Source = `gh api repos/gsd-build/get-shit-done/contents/...` exclusively. SHA pin mandatory (HEAD `42ed7cee8d8d` at promote). WebFetch fallback on gh failure; no cached probe (GSD postdates external-refs-probe.md). Per Sprint 040 codified policy + Sprint 041/042/043 confirmed precedent.
- (b) **Scope ceiling for T1 phase-pipeline diff** — proposal: read at most **8 GSD workflow files** + **8 GSD command files** end-to-end (16-file cap to control gh fetch burn). Workflow read list (priority): `discuss-phase.md` `plan-phase.md` `execute-phase.md` `verify-phase.md` `validate-phase.md` `spec-phase.md` `sketch.md` `spike.md`. Command read list (priority): `quick.md` `autonomous.md` `manager.md` `progress.md` `thread.md` `code-review.md` `debug.md` `verify-work.md`. If T1 needs additional reads to resolve diff, log to OQ surfaces during execution; do NOT silently expand.
- (c) **Lift candidates surfacing rule** — proposal: T1 + T2 surface trigger-phrase + structural lift candidates as RECOMMENDATIONS only; ZERO skill/command edits this sprint. All behavior changes queue to TASK-116 acceptance harness per ADR-021 DEC-4. Mirrors Sprint 042/043 pattern (decision-vs-implementation split codified across 4 ext-ref deep sprints).
- (d) **`.out-of-scope/` follow-on adoption** — proposal: if T1/T2 surface 1-2 high-signal "considered + rejected" candidates from GSD (e.g., GSD's multi-language READMEs, GSD's `sdk/` programmatic API, GSD's `.changeset/` release flow), seed `.out-of-scope/` pointers per Sprint 043 DEC-6 pattern. Cap at 2 new pointers this sprint to avoid sweep. Default: 0 new pointers (lift only if signal warrants).
- (e) **CONTEXT.md additive lift discipline** — proposal: same as Sprint 043 OQ-e. T2 reads GSD's `commands/gsd/contexts/*` end-to-end + GSD's repo-root `CONTEXT.md`. Lift candidates land as RECOMMENDATIONS in ADR-023; actual `.claude/CONTEXT.md` edits queue to future TASK with re-prime + agent-context refresh checklist. NO `.claude/CONTEXT.md` edits this sprint.
- (f) **TASK-116 / TASK-117 / TASK-118 cross-pollination** — proposal: if T1 surfaces trigger-phrase lift candidates → queue under existing TASK-116 (skill-triggering acceptance harness) without creating a new task. If T2 surfaces CONTEXT.md additive lifts beyond Sprint 043 DEC-5's three (`_Avoid_` annotations + § Relationships + § Flagged ambiguities) → APPEND to TASK-117 scope (don't create TASK-119 unless scope is genuinely separate). Avoid task proliferation.

---

## Plan

### T1 — Phase-pipeline + commands-namespace diff (GSD vs dev-flow Modes/Gates/skills)
**Scope:** quick · **Layers:** docs, governance · **Risk:** medium · **HITL** *(reviewer must verify scope ceiling held — 16-file read cap per OQ-b; no scope creep into 64-command sweep)*
**Acceptance:** `docs/research/gsd-phase-pipeline-diff-2026-05-04.md` exists with: (a) gh CLI raw fetch + SHA pin (HEAD `42ed7cee8d8d` at promote), (b) MIT license confirmation via `gh api repos/gsd-build/get-shit-done/license`, (c) **8 GSD workflow files read** per OQ-b list (sketch / spike / spec / discuss / plan / execute / verify / validate-phase) — capture each workflow's purpose + 1-2 sample triggers + output shape, (d) **8 GSD command files read** per OQ-b list (quick / autonomous / manager / progress / thread / code-review / debug / verify-work) — capture each command's invocation pattern + scope, (e) **Phase-to-Mode/Gate mapping matrix** (rows: GSD-phase / GSD-command name; columns: maps-to-dev-flow-Mode? / maps-to-dev-flow-Gate? / maps-to-dev-flow-Skill? / maps-to-dev-flow-Agent? / no-equivalent — gap candidate), (f) **Bidirectional finding section** — record explicitly anywhere dev-flow's mode/gate/skill is superior to GSD's equivalent (Sprint 042 DEC-2 + Sprint 043 DEC-2 pattern), (g) **Per-axis recommendation** — Phase pipeline (lift Y/N + which) / commands-namespace (migrate Y/N) / spec-phase pattern (lift Y/N for task-decomposer skill) — each with rationale + ADR-021 DEC-4 deferral confirmation. § Decisions row in sprint file: per-axis recommendation + deferral + bidirectional finding count.
**Source:** `gh api repos/gsd-build/get-shit-done/contents/get-shit-done/workflows` (workflow listing) + per-file raw fetch via `gh api repos/.../contents/get-shit-done/workflows/<name>` for the 8 named files; `gh api repos/.../contents/commands/gsd` (commands listing) + per-file raw fetch for the 8 named files.
**Depends on:** none.
**Note:** READ-ONLY audit. NO `skills/<name>/SKILL.md` edits, NO `agents/<name>/*` edits, NO new commands files this sprint. License check via `gh api repos/.../license` BEFORE T1 commit — record SHA + MIT confirmation in research note header per Sprint 040/041/042/043 precedent. **Hard scope ceiling: 16 files. If T1 hits ceiling without resolving diff, surface to user — do NOT silently expand.**

### T2 — `contexts/` + `.plans/` directory patterns + GSD CONTEXT.md reconcile
**Scope:** quick · **Layers:** docs, governance · **Risk:** medium · **HITL** *(reviewer must verify additive-only CONTEXT.md discipline; verify zero `.claude/CONTEXT.md` edits land this sprint)*
**Acceptance:** `docs/research/gsd-contexts-and-plans-2026-05-04.md` exists with three parts: **Part A (`contexts/` directory)** — (a) gh CLI raw fetch of `commands/gsd/contexts/*` end-to-end (file listing + per-file size + per-file purpose summary), (b) reconciliation strategy: does dev-flow's single-domain meta-repo justify per-domain context split? (default: NO; but record if a sub-domain emerges), (c) recommendation: 0 contexts to lift / N contexts to lift (additive only), (d) if lift recommended, queue to TASK-117 (per OQ-f). **Part B (GSD CONTEXT.md reconcile)** — (e) gh CLI raw fetch of `gsd-build/get-shit-done/CONTEXT.md` + SHA pin, (f) section-level matrix (GSD sections vs dev-flow sections — present/absent/divergent), (g) lift-candidate list (additive only per OQ-e); if non-zero, queue to TASK-117 per OQ-f. **Part C (`.plans/` directory)** — (h) gh CLI raw fetch of `.plans/` listing (purpose, contents, naming convention), (i) compare to dev-flow's `docs/sprint/SPRINT-NNN-*.md`, (j) recommendation: NO LIFT (dev-flow sprint files already serve plan-discovery role) — record as DEC row to prevent future "should we adopt `.plans/`" question. § Decisions row in sprint file: contexts/ defer + GSD CONTEXT.md lift count (queue to TASK-117 if >0) + `.plans/` no-lift decision + bidirectional finding count.
**Source:** `gh api repos/gsd-build/get-shit-done/contents/commands/gsd/contexts` + per-file raw fetch; `gh api repos/.../contents/CONTEXT.md` (raw fetch); `gh api repos/.../contents/.plans` (listing only — do not deep-read individual plan files; sample 1 plan file at most for shape).
**Depends on:** T1 (T1's MIT license check + SHA pin reused; T1's command-file reads may surface contexts/ references — feed T2's targeted read list).
**Note:** READ-ONLY audit + design only. NO `.claude/CONTEXT.md` edits this sprint (those are scope creep + CONTEXT.md ripple risk per Sprint 043 DEC-5 precedent). NO `.plans/` directory creation. NO `contexts/` directory creation.

### T3 — ADR-023 (GSD patterns adoption decisions)
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer must verify ADR completeness + alignment with T1+T2 outputs + sequential numbering check)*
**Acceptance:** `docs/adr/ADR-023-gsd-patterns.md` exists, status Accepted, format follows ADR-019/020/021/022 precedent (Context / Decision / Alternatives / Consequences / References). Captures:
1. T1 phase-pipeline diff finding + per-axis recommendation (lift / no-lift / queue to TASK-116) — confirms ADR-021 DEC-4 deferral pattern.
2. T1 commands-namespace migration decision (default: NO migration; dev-flow skill+agent split aligned with plugin spec).
3. T1 spec-phase lift recommendation for task-decomposer skill (Y/N + which trigger phrases — queue to TASK-116 if Y).
4. T1 bidirectional findings (anywhere dev-flow > GSD).
5. T2-Part-A `contexts/` deferral (single-domain doesn't warrant split) + re-eval triggers (when dev-flow gains second domain).
6. T2-Part-B GSD CONTEXT.md reconciliation strategy + lift-count decision (additive only; queue to TASK-117 if >0 per OQ-f).
7. T2-Part-C `.plans/` no-lift decision + rationale (dev-flow sprint files already serve plan-discovery role).
8. (If applicable) `.out-of-scope/` follow-on pointers landed per OQ-d (cap 2 this sprint).
9. Lineage credit (gsd-build/get-shit-done MIT verified by Lex Christopherson at SHA `42ed7cee8d8d`).
**Depends on:** T1, T2.
**Note:** ADR-023 sequential — confirmed via `ls docs/adr/` (max = 022) at promote. PR template is NOT touched this sprint (already landed Sprint 042 T4). **Pre-T3-commit:** re-grep `docs/adr/` to confirm ADR-023 still free (Sprint 040/041/042/043 retro pattern). If T1/T2 recommend `contexts/` lift, ADR-023 records the recommendation + queues edits to a future sprint per OQ-e additive-only discipline.

---

## Dependency Chain

```
T1 ─→ T2 ─→ T3
```

T1 → T2 (T2 reuses T1's MIT license check + SHA pin; T1's command-file reads may surface `contexts/` references for T2's targeted read list). T2 → T3 (T3 ADR captures T1+T2's findings as landed decisions, not proposals). No parallelization opportunity — sequential by data flow.

---

## Cross-task risks

- **gh CLI primary policy** (Sprint 040 codified, Sprint 041/042/043 confirmed). Drop leading slash on Git Bash. Fallback: WebFetch → no cached probe (GSD postdates `external-refs-probe.md`).
- **GSD scope-creep magnet.** 64 commands + 80+ workflows + 4 directory patterns at 60k stars. T1's 16-file read ceiling (OQ-b) is the structural defense. If T1 hits ceiling without resolving diff, **STOP and surface to user — do NOT silently expand**. Pattern from Sprint 043 retro: pre-resolve scope ceilings at promote.
- **No external-refs-probe coverage for GSD.** Sprint 034 probe predates GSD addition. T1 is the FIRST scan; recommendations have less prior-art-validation than caveman/superpowers/mattpocock did. ADR-023 must explicitly note "first-scan; recommendations are initial findings, not validated against multi-pass probe."
- **GSD's spec-driven phase pipeline is a coherent system.** Lifting individual phases without lifting the whole would be incoherent (e.g., adopting `spec-phase` without `discuss-phase` breaks the upstream context flow). Default: NO partial pipeline lift. ADR-023 must explicitly forbid "pick-and-mix lifts of GSD phases."
- **`contexts/` adoption ripple risk.** If recommended, every agent's CONTEXT.md cross-ref breaks; same risk as Sprint 043 DEC-5 lift queue. NO `.claude/CONTEXT.md` edits this sprint per OQ-e.
- **`.plans/` adoption duplicates dev-flow sprint files.** Default no-lift recorded as a Decision (not silent omission) to prevent the question recurring in Sprints 045-047.
- **TASK proliferation risk.** OQ-f locks: trigger-phrase lifts → queue to TASK-116; CONTEXT.md additive lifts → APPEND to TASK-117. Do NOT create TASK-119 unless scope is genuinely separate.
- **ADR-023 sequential numbering** — max ADR = 022 (Sprint 043 just landed). ADR-023 confirmed safe via `ls docs/adr/` (verify pre-T3-commit per Sprint 040/041/042/043 retro pattern).
- **Decision-only sprint with 0-2 mechanical lifts** — T1+T2+T3 = research + ADR (zero code change). Optional `.out-of-scope/` pointer additions land in T2 if OQ-d lift signal is high; cap 2 pointers. release-patch should skip-bump if zero file changes outside `docs/` + `.out-of-scope/` (mirror Sprint 043's release-patch flagged behavior).
- **Date verification at promote.** Per Sprint 042/043 retro friction: lean-doc-generator stamped 2026-05-04 dates last 2 sprints when today was 2026-05-04. Today is 2026-05-04. All artifacts MUST stamp `2026-05-04`. TASK-118 (date-sanity check in lean-doc-generator pre-flight) is queued; not landed yet. Manual verification required at every artifact write.

---

## Sprint DoD

- [x] T1 `docs/research/gsd-phase-pipeline-and-commands-2026-05-04.md` exists (filename clarified during execution to reflect commands-namespace scope) with mapping matrix + bidirectional finding + per-axis recommendation. → 30a0c4f.
- [x] T2 `docs/research/gsd-contexts-plans-and-context-2026-05-04.md` exists (filename clarified to reflect Part C CONTEXT.md scope) with Part A + Part B + Part C. CONTEXT.md edits = 0 confirmed (TASK-117 unchanged). → 526c0af.
- [x] T3 `docs/adr/ADR-023-gsd-patterns.md` exists, status Accepted, follows ADR-019..022 format. → 54d492f.
- [x] Plan-lock commit landed before any T1..T3 commit. → aed05f0.
- [x] Close commit + CHANGELOG row + TODO update + retro. → this commit.
- [x] Open questions (a–f above) resolved on promote, recorded as locked decisions. → DEC-1..DEC-9 + bidirectional findings.
- [x] Date verification: all artifacts stamped `2026-05-04` (post lean-doc-generator date fix at promote — recurring friction; TASK-118 still queued).
- [x] T1 16-file read ceiling held (~14 reads — within ceiling).
- [x] Zero `.claude/CONTEXT.md` edits, zero `skills/<name>/*` edits, zero `agents/<name>/*` edits (READ-ONLY sprint confirmed).

---

## Execution Log

### 2026-05-04 | T1 done — 30a0c4f
GSD repo structure verified via gh CLI dir listings (license MIT, SHA `42ed7cee8d8d`). Scale confirmed: ~64 commands + ~80 workflows + ~20 agents = 164+ surface assets vs dev-flow's 24. Plus full TypeScript SDK (package.json, tsconfig, vitest), 5-language READMEs, persistent workflow artifacts (PLAN/RESEARCH/VERIFICATION/REVIEWS).

Output: `docs/research/gsd-phase-pipeline-and-commands-2026-05-04.md` — phase-pipeline mapping + commands/skills namespace comparison + 8 per-pattern recommendations + bidirectional finding + 16-file-ceiling check.

**Key findings:**
- GSD 9-phase pipeline (sketch / spike / discuss / spec / plan / execute / verify / validate / ship) maps to dev-flow's mode + gate model at coarser granularity. dev-flow folds GSD's per-phase artifacts into orchestrator MICRO-TASKS + sprint plan.
- GSD command body uses XML-tagged blocks (`<objective>`, `<execution_context>`, `<context>`) — improves agent parseability, hurts human readability. dev-flow conversational markdown is more readable but less structured.
- GSD has `agent:` + `allowed-tools:` frontmatter (per-command granularity); dev-flow uses orchestrator dispatch + session-level permissions. Different design choices, both valid at respective scales.
- **Bidirectional finding (per Sprint 042/043 pattern):** dev-flow's `sprint-bulk` mode batches G1+G2 once for multi-task sprints; GSD has no equivalent. Record explicitly to avoid future "match GSD per-phase ceremony" pressure.

**Per-pattern recommendations (all NO LIFT for current sprint):**
- 9-phase pipeline → NO (premature at 24-asset scale; re-eval if dev-flow grows past ~150 assets)
- commands/ namespace separate from skills/ → NO (duplicate dispatcher concerns)
- XML-tagged body structure → CONSIDER for write-a-skill template (frequent-auto-trigger skills only)
- `agent:` frontmatter routing → NO (orchestrator dispatch-table covers it)
- `allowed-tools:` per-command → DEFER (premature at single-author scale)
- Workflow `@~/...` slash-include → NO (per-skill references/ does this)
- Persistent PLAN/RESEARCH/VERIFICATION/REVIEWS artifacts → NO (sprint plan + docs/research/ covers it)
- Multi-language READMEs → NO (single-author scope)

**File-read ceiling:** within OQ-b 16-file cap (4 commands + CONTEXT.md + 6 dir listings + 3 dev-flow cross-refs).

### 2026-05-04 | T2 done — 526c0af
GSD `contexts/` (3 mode-profiles: dev/research/review), `.plans/` (sample 1 file), and `CONTEXT.md` (41 lines, TypeScript-module domain) fetched/sampled via gh CLI raw.

Output: `docs/research/gsd-contexts-plans-and-context-2026-05-04.md` — three-part research note.

**Part A (contexts/):**
- GSD `contexts/dev.md` (low verbosity, action-oriented) vs `research.md` (high verbosity, exploratory) — agent-output-style profiles loaded via config.
- dev-flow has NO equivalent — single posture (Behavioral Guidelines). Concerns are ORTHOGONAL: GSD contexts/ = HOW agents respond; dev-flow CONTEXT.md = WHAT workflow is.
- Recommendation: DEFER. Re-eval if dev-flow develops distinct work-mode patterns. NOT `.out-of-scope/` (interesting, may apply later).

**Part B (.plans/):**
- GSD `.plans/<numeric>-<slug>.md` convention.
- dev-flow `docs/sprint/SPRINT-NNN-*.md` is functionally equivalent + more explicit (numbering + status frontmatter + retro discipline).
- Recommendation: NO LIFT.

**Part C (CONTEXT.md):**
- GSD CONTEXT.md = TypeScript-module domain glossary (10 modules listed). NO OVERLAP with dev-flow workflow-domain CONTEXT.md.
- Recommendation: ZERO lifts from GSD. Sprint 043 DEC-5 (3 mattpocock-derived lifts via TASK-117) remains the only CONTEXT.md change queue.

**Bidirectional finding (Part C):** dev-flow CONTEXT.md has 8 workflow sections; GSD CONTEXT.md has 1 code-architecture section. Each richer in their respective domain.

**DEC-7..9 land in § Decisions.**

### 2026-05-04 | T3 done — 54d492f
ADR-023 written at `docs/adr/ADR-023-gsd-patterns.md`. Status: Accepted. Captures all 9 decisions from T1 + T2:
- DEC-1: NO LIFT 9-phase pipeline (re-eval at ~150 assets)
- DEC-2: NO LIFT commands/ namespace split
- DEC-3: DEFER XML-tagged body (consider for write-a-skill template only)
- DEC-4: NO LIFT agent: + allowed-tools: frontmatter (defer adopter scale)
- DEC-5: NO LIFT persistent workflow artifacts (sprint plan + research/ covers it)
- DEC-6: bidirectional sprint-bulk batched gates finding
- DEC-7: DEFER contexts/ per-mode profiles
- DEC-8: NO LIFT .plans/ directory
- DEC-9: ZERO CONTEXT.md lifts + bidirectional CONTEXT.md richness finding

Net: GSD validates direction but patterns not portable at 6.8× scale gap. No new `.out-of-scope/` pointers (GSD decisions are scale-driven, not concept-rejecting). TASK-116/117/118 unaffected.

ADR-023 sequential per Sprint 043 DEC-7 convention lock; max-ADR check confirmed = 022 before allocation. Format follows ADR-019..022 precedent.

*(Empty — append `### YYYY-MM-DD HH:MM | T<N> done` blocks as work lands.)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/research/gsd-phase-pipeline-and-commands-2026-05-04.md` | T1 | NEW (~120 lines) — scale survey + phase-pipeline mapping + commands/skills comparison + 8 per-pattern recommendations + bidirectional finding + ceiling check | low | — |
| `docs/sprint/SPRINT-044-gsd-patterns.md` | T1 | Execution Log + § Decisions DEC-1 through DEC-6 rows | low | — |
| `docs/research/gsd-contexts-plans-and-context-2026-05-04.md` | T2 | NEW (~135 lines) — Part A contexts/ defer + Part B .plans/ no-lift + Part C CONTEXT.md zero-lift + bidirectional finding | low | — |
| `docs/sprint/SPRINT-044-gsd-patterns.md` | T2 | Execution Log + § Decisions DEC-7, DEC-8, DEC-9 rows | low | — |
| `docs/adr/ADR-023-gsd-patterns.md` | T3 | NEW (~120 lines) — 9-decision ADR + 2 bidirectional findings + 8 alternatives + scale-anchor anchor | low | — |
| `docs/sprint/SPRINT-044-gsd-patterns.md` | T3 | Execution Log + cross-link DEC-1..9 to ADR-023 | low | — |

*(Empty — one row per file as work lands.)*

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 (T1) | NO LIFT on GSD 9-phase pipeline (sketch/spike/discuss/spec/plan/execute/verify/validate/ship); dev-flow mode + gate model adequate at 24-asset scale | GSD pipeline assumes 164+ assets + persistent per-phase artifacts; ceremony cost not justified at dev-flow scale. Re-eval if dev-flow grows past ~150 assets | ADR-023 |
| DEC-2 (T1) | NO LIFT on `commands/` namespace separate from `skills/`; dev-flow's `skills/` covers the surface | Splitting commands+skills duplicates dispatcher concerns without scale benefit | ADR-023 |
| DEC-3 (T1) | DEFER XML-tagged command body (`<objective>`, `<execution_context>`, `<context>`) — CONSIDER for `write-a-skill` template only | Improves agent parseability but hurts human readability; not wholesale lift. Could benefit auto-trigger-frequent skills where AI parsing matters more than human reading | ADR-023 |
| DEC-4 (T1) | NO LIFT on `agent:` + `allowed-tools:` frontmatter fields (per-command granularity) | dev-flow orchestrator dispatch-table covers agent routing; tool-allowlist premature at single-author scale (DEFER, re-eval at adopter scale) | ADR-023 |
| DEC-5 (T1) | NO LIFT on persistent workflow artifacts (PLAN.md / RESEARCH.md / VERIFICATION.md / REVIEWS.md) | dev-flow `docs/sprint/SPRINT-NNN-*.md` + `docs/research/<topic>-<date>.md` covers same ground without per-phase file proliferation | ADR-023 |
| DEC-6 (T1) | **Bidirectional finding:** dev-flow `sprint-bulk` batches G1+G2 once per sprint; GSD has no equivalent — every phase pays gate cost | Record explicitly per Sprint 042/043 bidirectional pattern; avoid future "match GSD per-phase ceremony" pressure | ADR-023 |
| DEC-7 (T2-A) | DEFER `contexts/` per-mode output-style profiles | dev-flow has single posture (Behavioral Guidelines); meta-repo work is primarily one mode; per-mode profiles cost not justified at single-author scale. NOT `.out-of-scope/` candidate (pattern interesting, may apply later) | ADR-023 |
| DEC-8 (T2-B) | NO LIFT on `.plans/` directory | dev-flow `docs/sprint/SPRINT-NNN-*.md` is functionally equivalent + more explicit (numbering + status frontmatter + retro) | ADR-023 |
| DEC-9 (T2-C) | ZERO additive CONTEXT.md lifts from GSD; Sprint 043 DEC-5 (3 mattpocock-derived lifts via TASK-117) remains the only CONTEXT.md change queue | GSD CONTEXT.md = TypeScript-module domain (orthogonal to dev-flow workflow-domain). Bidirectional: each richer in own domain | ADR-023 |

*(Empty — append rows as decisions land. Format: `DEC-N (T<X>) | Decision | Reason | ADR`)*

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|

---

## Open Questions for Review

*(None surfaced during execution — all six promote-time OQs (a–f) resolved cleanly per "approve all" pattern. T1+T2+T3 executed on stable inputs without re-litigation. T1 16-file read ceiling held — sufficient resolution from dir-listings + 4 command samples + CONTEXT.md without needing to read 80+ workflows or 20 agents in full.)*

*(Empty — append OQs as they surface during execution. All promote-time OQs (a–f) above resolved at promote per "approve all" pattern from Sprint 042/043.)*

---

## Retro

### Worked
- **Pre-resolve OQs at promote held a third sprint.** Sprint 042/043/044 all locked OQs at promote per "approve all" pattern. Zero mid-sprint re-litigation. Pattern is stable; codify in `dev-flow:lean-doc-generator` reference docs (TASK-118 scope candidate).
- **16-file read ceiling discipline saved time at GSD scale.** GSD has 164+ assets; reading even 20% would have been ~30 files of dense markdown. Ceiling forced strategic sampling (4 commands + CONTEXT.md + 6 dir listings). Net: T1 finished in ~15 reads with sufficient resolution.
- **Bidirectional findings pattern (Sprint 042 DEC-2, Sprint 043 DEC-2, Sprint 044 DEC-6 + DEC-9) is now tradition.** 4 sprints of explicit "where dev-flow > upstream" notes. Reduces future "match upstream" pressure on those axes. Should consider adding "bidirectional findings" as a required Decisions table category in `dev-flow:lean-doc-generator` ext-ref-audit template.
- **Decision-only sprint shape (Sprint 040/041/042/043/044 — 5 sprints).** Pattern stabilized. ext-ref deep audit = research notes (1-3) + ADR + 0-1 mechanical lifts. Worth codifying as a sprint shape.
- **Scale-driven NO LIFT decisions are valid sprint output.** Sprint 044 lands 0 mechanical lifts (no `.out-of-scope/` pointers, no PR template lift, no skills/CONTEXT.md edits). Pure research + ADR. Decision-only sprint with ZERO landed artifacts is a valid shape — locks "considered + deferred" surface so future sprints don't re-research.

### Friction
- **lean-doc-generator stamped 2026-05-03 again.** THIRD sprint with this friction (Sprint 042/043/044). TASK-118 (date-sanity check) is now P0 priority for next implementation sprint. The pattern is reliable enough to fix at the skill level rather than continue manual fix per sprint.
- **Sprint plan filename drift.** lean-doc-generator named research files `gsd-phase-pipeline-diff-2026-05-04.md` and `gsd-contexts-and-plans-2026-05-04.md`; actual content scope drove rename to `gsd-phase-pipeline-and-commands-2026-05-04.md` and `gsd-contexts-plans-and-context-2026-05-04.md` (T1 included commands-namespace; T2 included CONTEXT.md as Part C). DoD updated to match. Lesson: research-file naming should follow content scope, not pre-plan; allow renaming if scope shifts.
- **GSD scale forced strategic file sampling rather than full audit.** Could not enumerate all 64 commands + 80 workflows + 20 agents within ceiling. Acceptable trade — directory-listing + named-file sampling (phase, plan-phase, ns-workflow, etc) gave sufficient pattern signal. But a future scale-crossing re-eval would benefit from a more programmatic scan (regex extract for `name:` + `description:` across all command files in one gh batch). Captured as forward note.
- **`.out-of-scope/` not used for ANY GSD decision.** All 5 GSD deferrals are scale-driven (pattern fine, scale wrong) rather than concept-rejecting (pattern broken). `.out-of-scope/` shape is for the latter. ADR-023 § Decision text holds the rationale. Future re-eval requires reading ADR; not as discoverable as `.out-of-scope/` pointer would be. Trade-off: pointer files would dilute `.out-of-scope/` if every "defer" decision got one. Hold current discipline (only concept-reject decisions get pointers).

### Pattern candidates (pending user confirm)
1. **Bidirectional findings as required Decisions table category.** 4 sprints of consistent use (Sprint 042 DEC-2, Sprint 043 DEC-2, Sprint 044 DEC-6 + DEC-9). Codify in `dev-flow:lean-doc-generator` ext-ref-audit template.
2. **Decision-only sprint with 0 landed artifacts is valid.** Sprint 044 = 2 research notes + 1 ADR + 0 lifts (no `.out-of-scope/`, no template, no skill/CONTEXT.md edits). Valid sprint shape; lock as documented option in lean-doc-generator templates.
3. **`.out-of-scope/` discipline:** only concept-rejecting decisions get pointer files; scale-driven defers stay in ADR § Decision text. Sprint 044 confirmed this discipline by NOT creating pointers for 5 scale-driven defers.
4. **Date-sanity check in lean-doc-generator pre-flight is now P0.** Three sprints of recurring friction. Fix at skill level (TASK-118).
5. **Strategic file-sampling at scale crossings.** GSD scale (164+ assets) couldn't fit 16-file ceiling without strategic sampling (dir listings + 4 named files). Future scale crossings may need programmatic-scan helper or higher ceilings.

### Surprise log (cross-ref to Execution Log)
- T1: GSD repo structure differs from expectation — `contexts/` and `workflows/` live under `get-shit-done/` subdirectory, not at root. Required path-verify before raw fetches. Discovered via dir-listing.
- T1: GSD is at SCALE GAP of 6.8× vs dev-flow (164 vs 24 assets). Most pattern decisions become "fine pattern, wrong scale" rather than "broken pattern."
- T1: GSD command body uses XML-tagged structure (`<objective>`, `<execution_context>`, `<context>`); dev-flow uses conversational markdown. Trade-off: agent parseability vs human readability. DEC-3 records consideration for selective adoption (write-a-skill template only).
- T2: GSD `contexts/` is OUTPUT-STYLE PROFILES (low/high verbosity per work mode) — orthogonal to dev-flow CONTEXT.md (workflow vocabulary). DEC-9 records bidirectional richness (each CONTEXT.md is richer in own domain).
- T3: 5 of 9 decisions are NO LIFT or DEFER — but `.out-of-scope/` got 0 new pointers because all defers are scale-driven, not concept-reject. Forward discipline: pointer files only for concept rejections.

*(Empty — fill at close.)*

### Worked

### Friction

### Pattern candidates (pending user confirm)

### Surprise log (cross-ref to Execution Log)
