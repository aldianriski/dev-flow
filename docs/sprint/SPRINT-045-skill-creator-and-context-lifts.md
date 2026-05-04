---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending
close_commit: pending
---

# Sprint 045 — EPIC-Audit Phase 4f (skill-creator wrapper patterns) + CONTEXT.md lifts + lean-doc date-sanity

**Theme:** Close out EPIC-Audit Phase 4 external-ref deep-dives by auditing `anthropics/skills/tree/main/skills/skill-creator` against dev-flow's `write-a-skill` skill (Phase 4f, ADR-024), then land the queued doc-quality + skill-quality follow-ups: TASK-104 (CONTEXT.md ownership header), TASK-117 (3 additive CONTEXT.md sections per Sprint 043 DEC-5), TASK-118 (date-sanity pre-flight in `dev-flow:lean-doc-generator`). Mixed shape: 1 decision-only task (T1) + 3 mechanical tasks (T2..T4). Anchored to Sprint 042/043/044 "approve all" + pre-resolve OQs at promote pattern.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 044 closed `8931230`.
**Successor:** Sprint 046 (EPIC-Audit Phase 5 — stale doc refresh).

---

## Why this sprint exists

**Phase 4f closes EPIC-Audit Phase 4** (5-sprint external-ref deep-audit run started Sprint 040). `anthropics/skills/tree/main/skills/skill-creator` was added to TODO.md External References mid-Sprint 044 (per Sprint 044 retro pattern of late-arrival refs). It is the first-party Anthropic reference for skill authoring; dev-flow's `write-a-skill` skill is the existing in-house authoring meta-skill. Phase 4f produces a diff + adoption decisions in ADR-024 — last of the 6 external refs probed (karpathy / caveman / superpowers / mattpocock / GSD / skill-creator).

**TASK-104 + TASK-117 land together** because both edit `.claude/CONTEXT.md`. TASK-104 (ownership header) is a prerequisite for TASK-117 (additive sections with proper update_trigger inheritance). Sequential T2 → T3 with `git diff` review between, to keep CONTEXT.md ripple risk auditable per Sprint 043 DEC-5 discipline. Re-prime + agent-context refresh checklist required after T3 (CONTEXT.md ripple risk).

**TASK-118 is a skill code edit** (`skills/lean-doc-generator/SKILL.md` Step 0 pre-flight + reference content addition) addressing the recurring date-stamp friction surfaced in Sprint 042/043/044 retros (3 consecutive sprints). Promoted to P0 per Sprint 044 retro Pattern Candidate #4. Lands as T4 last because it's the only task that changes a skill (eval-evidence rule per ADR-021 DEC-4 considered: TASK-118 is a pre-flight check + warning, NOT a behavior change to the doc generation logic itself; treat as guard-rail addition not behavior delta — ADR-021 DEC-4 confirms acceptable for guard-rail-only changes pending future TASK-116 acceptance harness).

**Five adopt-candidate axes for T1 (skill-creator vs write-a-skill):**

1. **Frontmatter spec coverage** — Anthropic's reference spec for SKILL.md frontmatter fields (`name`, `description`, `allowed-tools`, etc). dev-flow's `write-a-skill` Phase 2 lists frontmatter fields; verify completeness against upstream + identify any fields write-a-skill omits or names differently (e.g., dev-flow's `type: rigid|flexible`, `user-invocable`, `last-validated` — confirm these are dev-flow extras vs Anthropic spec).
2. **Skill creation flow** — Anthropic's authoring process (Requirements → Draft → Review or different decomposition?) vs dev-flow's 3-Phase write-a-skill (Requirements → Draft → Review). Diff phase shape + per-phase questions; lift wording or decomposition if delta is high.
3. **Skill quality checklist** — Anthropic's pre-delivery checklist vs dev-flow's `write-a-skill` § Skill Quality Checklist (6 items). Identify any quality gates dev-flow omits (e.g., trigger-phrase exclusivity, description-length sanity, red-flag observability).
4. **Reference-file pattern** — Anthropic's convention for `references/` overflow (when to split, naming, load-on-demand contract). dev-flow has codified ≤100-line SKILL.md cap with `references/<topic>.md` overflow; verify alignment + lift any conventions dev-flow misses (e.g., reference-file frontmatter, cross-reference syntax).
5. **Anti-patterns / red-flags coverage** — Anthropic's documented anti-patterns vs dev-flow's `write-a-skill` § Red Flags (4 items). Lift candidate red-flag patterns dev-flow misses; default: additive only (no red-flag removal).

This sprint is **decision-only for T1** (research note + ADR-024) and **mechanical for T2..T4** (CONTEXT.md edits + skill edit). Standard re-prime + agent-context refresh checklist post-T3. ADR-024 sequential per Sprint 043 DEC-7 convention lock; max ADR = 023 confirmed at promote.

---

## Open Questions (locked at promote — pre-resolved per "approve all" pattern)

- (a) **External fetch tool for T1** — proposal: gh CLI primary (no local cache for `anthropics/skills`). Source = `gh api repos/anthropics/skills/contents/skills/skill-creator/...` exclusively. SHA pin mandatory at T1 commit. WebFetch fallback on gh failure; no cached probe (skill-creator postdates external-refs-probe.md, per same pattern as Sprint 044 GSD). Per Sprint 040 codified policy + Sprint 041/042/043/044 confirmed precedent.
- (b) **Scope ceiling for T1** — proposal: read at most **8 files** from `anthropics/skills/skills/skill-creator/` (likely candidates: SKILL.md, references/*.md, scripts/*, examples/*). Cap is hard ceiling per Sprint 044 OQ-b structural defense pattern. If T1 hits ceiling without resolving diff, **STOP and surface** — do NOT silently expand. Default execution: dir-listing + 4-5 targeted file reads should suffice based on skill-creator's expected scope (single skill, smaller surface than GSD's 164 assets).
- (c) **Lift candidates surfacing rule** — proposal: T1 surfaces trigger-phrase + structural lift candidates as RECOMMENDATIONS in ADR-024 only; ZERO `skills/write-a-skill/*` edits this sprint. All behavior changes queue to TASK-116 acceptance harness per ADR-021 DEC-4. Mirrors Sprint 042/043/044 pattern (decision-vs-implementation split codified across 5 ext-ref deep sprints).
- (d) **`.out-of-scope/` follow-on adoption** — proposal: if T1 surfaces 1-2 high-signal "considered + rejected" candidates from skill-creator (e.g., Anthropic-specific tooling that doesn't fit dev-flow's plugin-first scope), seed `.out-of-scope/` pointers per Sprint 043 DEC-6 pattern. Cap at 2 new pointers this sprint. Default: 0 new pointers (skill-creator is a sibling skill not a workflow system; concept-reject scenarios less likely than scale-driven defers — same posture as Sprint 044 outcome).
- (e) **CONTEXT.md edit ordering for T2 + T3** — proposal: T2 (TASK-104, ownership header only) lands FIRST as separate commit. T3 (TASK-117, 3 additive sections per Sprint 043 DEC-5) lands SECOND as separate commit on top of T2. Reviewer sees header diff isolated from content diff. Re-prime + agent-context refresh runs after T3 only (single ripple event covers both edits). NEVER combine T2 + T3 into one commit; the audit value is the diff isolation.
- (f) **TASK-117 scope clarification — three lifts:** (i) `_Avoid_` annotations on existing § Vocabulary entries — additive italic line per existing term where helpful (pull from Sprint 043 mattpocock research note Part B); (ii) NEW § Relationships section between § Modes and § Agent Roster — captures gate-mode-agent triadic relationships; (iii) NEW § Flagged ambiguities section at end of file — seed with Sprint 035 ADR-014 rename + Sprint 039 codemap-refresh skill-vs-script + at most 2 other entries discovered during T3 read pass. **Cap:** 3 sections + ≤5 `_Avoid_` annotations + ≤4 ambiguity entries. Hard ceiling to prevent CONTEXT.md bloat (currently 98 lines; cap at 130).
- (g) **TASK-118 scope clarification — pre-flight check:** add Step 0b (after Step 0a cache-check, before Step 0 staleness scan) to `skills/lean-doc-generator/SKILL.md`: compare today's date (from environment) against any `last_updated:` frontmatter being written + research file dates being created. WARN if mismatch >0 days; AUTO-CORRECT if user explicitly answers "y" to a one-line prompt. Reference content goes in `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` § Date-Sanity (NEW section). NO change to existing date-handling for already-written files. Eval-evidence rule (ADR-021 DEC-4): TASK-118 is a guard-rail addition, not a behavior change to the doc generation logic itself; treat as acceptable per ADR-016 + ADR-021 spirit. If reviewer disputes at G2, surface and defer to next sprint.
- (h) **ADR-024 sequential numbering check** — proposal: pre-T1-commit, re-grep `docs/adr/` to confirm ADR-024 still free (Sprint 040/041/042/043/044 retro pattern; landed as standard discipline in Sprint 043 DEC-7). Max-ADR confirmed at promote = 023. If a parallel commit lands ADR-024 before T1, bump to ADR-025 + record in retro.

---

## Plan

### T1 — skill-creator (Anthropic) vs write-a-skill (dev-flow) deep diff + ADR-024
**Scope:** quick · **Layers:** docs, governance · **Risk:** medium · **HITL** *(reviewer must verify scope ceiling held — 8-file read cap per OQ-b; verify ADR-024 sequential per OQ-h)*
**Acceptance:**
- (a) `docs/research/skill-creator-skill-diff-2026-05-04.md` exists with: gh CLI raw fetch + SHA pin (anthropics/skills HEAD at promote), MIT/Apache license confirmation via `gh api repos/anthropics/skills/license`, file-listing of `skills/skill-creator/`, per-file purpose summary for ≤8 files read.
- (b) **5-axis diff matrix** (rows: frontmatter spec / skill creation flow / quality checklist / reference-file pattern / anti-patterns; columns: anthropics-version / dev-flow-version / delta / lift-Y/N / rationale).
- (c) **Bidirectional finding section** — explicitly record where dev-flow's `write-a-skill` is superior to Anthropic's `skill-creator` (Sprint 042 DEC-2 + 043 DEC-2 + 044 DEC-6/9 pattern).
- (d) **Per-axis recommendation** — lift Y/N for each of 5 axes with rationale + ADR-021 DEC-4 deferral confirmation (no `skills/write-a-skill/*` edits this sprint).
- (e) `docs/adr/ADR-024-skill-creator-patterns.md` exists, status Accepted, format follows ADR-019..023 precedent. Captures: 5-axis decisions + lineage credit (anthropics/skills first-party reference) + bidirectional findings + per-axis re-eval triggers.
- (f) § Decisions rows in sprint file: per-axis decision + bidirectional finding count + ADR-024 link.

**Source:** `gh api repos/anthropics/skills/contents/skills/skill-creator` (dir listing) + per-file raw fetch via `gh api repos/anthropics/skills/contents/skills/skill-creator/<name>` for ≤8 files. License via `gh api repos/anthropics/skills/license` BEFORE T1 commit.
**Depends on:** none.
**Note:** READ-ONLY audit. NO `skills/write-a-skill/*` edits, NO new commands, NO agent edits this sprint. **Hard scope ceiling: 8 files. If T1 hits ceiling without resolving diff, surface to user — do NOT silently expand.** ADR-024 sequential check pre-commit per OQ-h.

### T2 — TASK-104: ownership header on `.claude/CONTEXT.md`
**Scope:** trivial · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer verifies header fields match DOCS_Guide §3 spec exactly)*
**Acceptance:**
- (a) `.claude/CONTEXT.md` line 1 = `---` (frontmatter open).
- (b) Frontmatter contains: `owner: Tech Lead (Aldian Rizki)`, `last_updated: 2026-05-04`, `update_trigger: vocabulary added/changed; gate or mode count changes; agent roster changes; behavioral guidelines lineage updates`, `status: current`. Matches DOCS_Guide.md §3 mandatory header schema exactly.
- (c) Frontmatter close `---` then existing line 1 (`# CONTEXT.md — dev-flow Shared Domain Language`) preserved verbatim — no other content changes.
- (d) git diff shows: 6 lines added at top, zero lines removed.
- (e) Sprint file § Files Changed row: `.claude/CONTEXT.md | T2 | NEW frontmatter (TASK-104) | low | —`.
- (f) DOC WORK rule violation surfaced in Sprint 040 Q1 closed.
**Depends on:** none (independent of T1).
**Note:** Surgical change — header only. If reviewer wants header field changes (e.g., different `update_trigger` wording), surface as OQ; do NOT silently change. **Pre-T3 dependency:** T2 must land BEFORE T3 (T3 appends content; T2 establishes the header schema T3's edits must respect).

### T3 — TASK-117: 3 additive `.claude/CONTEXT.md` lifts per Sprint 043 DEC-5
**Scope:** small · **Layers:** governance, docs · **Risk:** medium · **HITL** *(reviewer must verify additive-only — no existing line modified or removed; verify CONTEXT.md ripple via re-prime + agent-context refresh checklist post-T3)*
**Acceptance:**
- (a) `.claude/CONTEXT.md` § Vocabulary table — add `_Avoid_` italic annotations to ≤5 existing entries (pull from `docs/research/mattpocock-bucket-and-context-2026-05-04.md` Part B recommendations). Annotation format: italic line below the table entry (e.g., `_Avoid: confusing with [other-term]; see [Flagged ambiguities](#flagged-ambiguities)._`). Annotations only; do NOT modify existing definitions.
- (b) NEW § Relationships section inserted between § Modes (line ~57) and § Agent Roster (line ~60). Captures gate-mode-agent triadic relationships in ≤15 lines (table or short prose). Sources: existing Modes table + Agent Roster table; cross-reference G1 + G2 gates explicitly.
- (c) NEW § Flagged ambiguities section appended at end of file (after § Behavioral Guidelines Lineage). ≤4 entries. Seed with: (1) Sprint 035 ADR-014 rename ambiguity (whatever was renamed), (2) Sprint 039 codemap-refresh skill-vs-script ambiguity, (3-4) at most 2 other ambiguities discovered during T3 read pass. Each entry: ≤3 lines (term + ambiguity + resolution-pointer).
- (d) Total file length stays ≤130 lines (currently 98; cap at 130 to prevent bloat).
- (e) `last_updated:` frontmatter (added in T2) bumped to 2026-05-04 (today).
- (f) Sprint file § Files Changed row: `.claude/CONTEXT.md | T3 | 3 additive sections (TASK-117) | medium | —`.
- (g) **Post-T3 step:** re-prime + agent-context refresh checklist invoked (CONTEXT.md ripple — every agent reads CONTEXT.md). Surface to user with diff summary + checklist completion.
**Depends on:** T2 (T2 establishes frontmatter; T3 bumps `last_updated:` field T2 created).
**Note:** ADDITIVE ONLY. Zero existing lines modified except frontmatter `last_updated:` field. If T3 read pass reveals existing CONTEXT.md content needs correction (orthogonal to additive lifts), surface as OQ; do NOT silently fix. ADR for TASK-117 NOT required (Sprint 043 DEC-5 is the ADR; T3 implements DEC-5).

### T4 — TASK-118: date-sanity pre-flight in `dev-flow:lean-doc-generator`
**Scope:** small · **Layers:** skills, docs · **Risk:** medium · **HITL** *(reviewer verifies guard-rail-only — no change to doc generation logic; verify pre-flight wording matches DOCS_Guide.md §3 last_updated semantics)*
**Acceptance:**
- (a) `skills/lean-doc-generator/SKILL.md` § Execution Flow — NEW Step 0b inserted between Step 0a (cache check) and Step 0 (staleness scan). Content: ≤6 lines describing date-sanity pre-flight check (compare today's date from environment against `last_updated:` frontmatter being written + research file dates; WARN if mismatch >0 days; AUTO-CORRECT only on explicit user confirm).
- (b) Reference content for Step 0b lives in `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` § Date-Sanity (NEW section, appended at end). ≤25 lines: trigger conditions, comparison logic outline (PROSE not code), warning-format template, auto-correct prompt template, recurring-friction citation (Sprint 042/043/044 retro).
- (c) `last_updated:` field in `skills/lean-doc-generator/SKILL.md` frontmatter bumped to 2026-05-04.
- (d) `last_updated:` field in `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` frontmatter bumped to 2026-05-04.
- (e) `version:` field in `skills/lean-doc-generator/SKILL.md` bumped from `2.0.0` → `2.1.0` (MINOR per CLAUDE.md semver: new behavior add — pre-flight gate addition; behavior of doc generation itself unchanged).
- (f) SKILL.md ≤100 lines preserved (currently 93; Step 0b adds ~6 lines → 99 max).
- (g) Sprint file § Files Changed rows: 2 rows for `SKILL.md` + `references/SPRINT_PROTOCOLS.md`.
- (h) Sprint 042/043/044 recurring friction closed — Sprint 044 retro Pattern Candidate #4 marked done.
**Depends on:** none (independent of T1, T2, T3).
**Note:** GUARD-RAIL ONLY. No change to actual doc generation step logic (Steps 1-7 unchanged). The pre-flight is a check + warning + opt-in correction; failure mode is a prompt to user, not silent fix. Eval-evidence rule (ADR-021 DEC-4) considered: this is a guard-rail addition, not a behavior delta to the doc-generation logic itself. ADR not required (TASK-118 implements an existing recurring-friction Pattern Candidate; not a new architectural decision).

---

## Dependency Chain

```
T1 (independent)
T2 ─→ T3 (CONTEXT.md edit ordering)
T4 (independent)
```

T1, T2, T4 are mutually independent. T3 depends on T2 (CONTEXT.md frontmatter must exist before content edits). Recommended execution order: T1 → T2 → T3 → T4 (T1 first to anchor sprint with ADR-024 before TASK work; T2+T3 sequential for CONTEXT.md ripple isolation; T4 last because it changes a skill — most reviewer-attention-required). No parallelization opportunity required (sequential is safer for review).

---

## Cross-task risks

- **gh CLI primary policy** (Sprint 040 codified, Sprint 041/042/043/044 confirmed). Drop leading slash on Git Bash. Fallback: WebFetch → no cached probe (skill-creator postdates `external-refs-probe.md`).
- **skill-creator scope ceiling.** anthropics/skills repo is large but skill-creator is one skill within it (smaller surface than GSD's 164 assets). T1's 8-file read ceiling (OQ-b) is the structural defense. If T1 hits ceiling without resolving diff, **STOP and surface** — do NOT silently expand.
- **No external-refs-probe coverage for skill-creator.** Sprint 034 probe predates skill-creator addition. T1 is the FIRST scan; recommendations have less prior-art-validation than karpathy/caveman/superpowers/mattpocock did. ADR-024 must explicitly note "first-scan; recommendations are initial findings, not validated against multi-pass probe."
- **CONTEXT.md ripple risk (T3).** Every agent + every skill reads CONTEXT.md. T3 lands 3 additive sections; agent context cache MUST refresh post-T3. Re-prime + agent-context refresh checklist invocation is mandatory acceptance criterion (T3 §(g)).
- **CONTEXT.md edit ordering (T2 → T3).** Combining T2 + T3 into one commit destroys diff isolation. OQ-e locks: T2 lands FIRST as separate commit, T3 SECOND. NEVER combine.
- **TASK-117 cap discipline.** ≤5 `_Avoid_` annotations + ≤4 ambiguity entries + ≤130 total file lines. Without cap, additive sections sweep into bloat.
- **TASK-118 eval-evidence rule (ADR-021 DEC-4).** TASK-118 is guard-rail addition (pre-flight check + warning), NOT doc-generation logic change. Treated as acceptable per ADR-021 spirit. If reviewer disputes at G2 — surface and defer to next sprint (do NOT proceed without G2 sign-off on T4 specifically).
- **ADR-024 sequential numbering.** Max ADR = 023 (Sprint 044 just landed). ADR-024 confirmed safe via `ls docs/adr/` (verify pre-T1-commit per OQ-h).
- **Date verification at promote.** Per Sprint 042/043/044 retro: lean-doc-generator stamped wrong date in 3 consecutive sprints. Today is **2026-05-04** (per current MEMORY currentDate). All artifacts MUST stamp `2026-05-04`. T4 itself is the FIX for this recurring friction; manually verify stamps in T1/T2/T3 artifacts. After T4 lands, future sprints get pre-flight protection.
- **Mixed sprint shape (decision-only T1 + 3 mechanical tasks T2/T3/T4).** First non-pure-research sprint since Sprint 039. Higher coordination cost but breaks the 5-sprint research-only run. Document explicitly in retro as a sprint shape variant.
- **release-patch on close.** T2/T3/T4 touch non-docs files (`.claude/CONTEXT.md` is governance, `skills/lean-doc-generator/*` is skills). release-patch should NOT skip-bump (mixed shape = bump applies). Verify skip-bump-on-docs-only behavior is OFF for this sprint. Patch bump (skill version bump T4 §(e) is internal; PATCH bump for plugin per CLAUDE.md semver: "PATCH = clarification / prompt rewording / fix" — TASK-118 is fix; TASK-104 + 117 are clarification).

---

## Sprint DoD

- [ ] T1 `docs/research/skill-creator-skill-diff-2026-05-04.md` exists with 5-axis matrix + bidirectional finding + per-axis recommendation. ADR-024 link in § Decisions row.
- [ ] T1 `docs/adr/ADR-024-skill-creator-patterns.md` exists, status Accepted, follows ADR-019..023 format. Sequential check confirmed pre-commit (OQ-h).
- [ ] T2 `.claude/CONTEXT.md` ownership header present (TASK-104 closed). 6 lines added, 0 removed.
- [ ] T3 `.claude/CONTEXT.md` 3 additive sections present (TASK-117 closed). ≤130 total lines. `last_updated:` bumped.
- [ ] T3 re-prime + agent-context refresh checklist invoked + completed (acceptance criterion).
- [ ] T4 `skills/lean-doc-generator/SKILL.md` Step 0b added + version bumped 2.0.0 → 2.1.0 (TASK-118 closed). ≤100 lines preserved.
- [ ] T4 `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` § Date-Sanity section appended.
- [ ] Plan-lock commit landed before any T1..T4 commit.
- [ ] Close commit + CHANGELOG row + TODO update + retro.
- [ ] Open questions (a–h above) resolved on promote, recorded as locked decisions.
- [ ] Date verification: all artifacts stamped `2026-05-04` (manual pre-T4; auto post-T4).
- [ ] T1 8-file read ceiling held (verify with read-count in retro).
- [ ] Zero unrelated edits (T2 frontmatter only, T3 additive only, T4 guard-rail only). Sprint shape verified via `git diff` line counts.

---

## Execution Log

*(Empty — append `### YYYY-MM-DD HH:MM | T<N> done` blocks as work lands.)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|

*(Empty — one row per file as work lands.)*

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|

*(Empty — append rows as decisions land. Format: `DEC-N (T<X>) | Decision | Reason | ADR`)*

---

## Open Questions for Review

*(Empty — append OQs as they surface during execution. All promote-time OQs (a–h) above resolved at promote per "approve all" pattern from Sprint 042/043/044.)*

---

## Retro

*(Empty — fill at close.)*

### Worked

### Friction

### Pattern candidates (pending user confirm)

### Surprise log (cross-ref to Execution Log)
