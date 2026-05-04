---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending
close_commit: pending
---

# Sprint 047 — EPIC-Audit Phase 6 (close EPIC-Audit + batch-archive Sprints 040-046 + final retro)

**Theme:** Close EPIC-Audit (6 phases / 13+ sprints / 6 external refs / 9 bidirectional findings / pattern-stability findings) and structurally clear the 7-sprint stranded-archive friction in one batched move. Phase 6 of EPIC-Audit. Mixed shape — mechanical archive + governance trim + new ADR + cross-sprint retro. Refined Shape A: 4 tasks.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 046 closed `2a99d82` (EPIC-Audit Phase 5 stale-doc refresh complete).
**Successor:** v1 ship prep (open backlog: TASK-115 caveman eval harness port, TASK-116 superpowers acceptance harness). EPIC-Audit becomes a closed lineage anchor referenced by future audits, not an active workstream.

---

## Why this sprint exists

**Phase 6 is the EPIC-Audit close-out.** EPIC-Audit ran Sprints 034 (Phase 0 reconcile + baseline + plan) → 035 (Phase 1 rename) → 036 (Phase 2 wiring) → 037 (Phase 3 trim) → 040-045 (Phase 4a-f external-ref deep-dives) → 046 (Phase 5 stale-doc refresh) → 047 (Phase 6 close). Six phases, 13+ sprints (counting Sprints 038 + 039 foundation hardening + codemap that ran inside the EPIC window without being EPIC-tagged), 6 external refs (karpathy / caveman / superpowers / mattpocock / GSD / skill-creator), 6 ADRs (019-024), 9 bidirectional findings recorded across Phase 4 ADRs, multiple pattern-stability findings (pre-resolve OQs at promote held 5 sprints; "approve all" pattern; row-by-row audit discipline; cross-link bidirectional verification; dir-listing as drift-detection). This is hard-to-reverse decision territory worth an ADR anchor.

**Concrete close-out work surfaced across Phase 4-5 retros + TODO.md state:**

- TODO.md `Backlog § P0 EPIC-Audit` row `Phase 6 — Archive external refs + close EPIC-Audit (Sprint 47)` outstanding `[ ]` — must flip `[x]` with sprint attribution + close evidence.
- TODO.md `> External references` block (lines 11-17) duplicates information now anchored in `docs/audit/external-refs-probe.md` + ADRs 019-024 (each ADR cites upstream SHA + license). External-refs block in TODO.md was the seed during Phase 0; once Phase 4a-f closed, the block became redundant and stale. Removing it = scope-trim per LAW 4 signal-density (DOCS_Guide §1).
- TODO.md `Backlog § P0 EPIC-Audit` carries 3 closed phase rows + 1 pending Phase 6 row spread across multiple lines. Once Phase 6 closes, the entire EPIC-Audit backlog block collapses to a single done line with sprint-range attribution + ADR registry pointer. Removes ~10 lines of stale backlog visual weight.
- 7 sprints (040-046) stranded in TODO.md Changelog awaiting `docs/CHANGELOG.md` archive. release-patch skip-bump-on-docs-only is the cause (flagged across Sprint 045 + 046 retros, no fix sprint scheduled). Sprint 047 = natural batch-archive trigger per Sprint 046 retro friction note. Structural fix at this scope: batch-archive 040-046 in one move + accept that release-patch fix becomes a separate sprint later. Closes 7-sprint friction batch-wise without coupling to release-patch rework.
- Cross-sprint retro deserves its own permanent home. Sprints 034 → 046 ran 13+ sprints under one epic; lessons (pre-resolve-OQ pattern, batched ext-ref audits, scale-driven defer rationale, lineage-credit discipline, bidirectional-finding section, cap-discipline cycles, system-memo date drift, stranded-archive friction) belong in `docs/audit/EPIC-Audit-retro.md` not scattered across 7 sprint retro sections. New retro file = future-readable EPIC anchor for v1 lineage.

**Scope boundary — what Phase 6 IS NOT:** not a re-audit, not new external refs, not new component changes, not skill behavior changes, not v1 ship work. Surgical close: archive batch + governance trim + close ADR + retro file. Sprint 047 sets the EPIC-Audit-closed state; v1 ship prep starts its own sprint after.

**Per OQ-A (locked at promote): Date stamping = 2026-05-04.** Step 0b (TASK-118, Sprint 045) date-sanity protects future sprints. Sprint 045 confirmed 2026-05-04, Sprint 046 confirmed 2026-05-04 — Sprint 047 follows same lineage. System memo `currentDate=2026-05-03` is stale; user override per `currentDate` memo + TODO.md frontmatter (`last_updated: 2026-05-04`) authoritative.

---

## Open Questions (locked at promote — pre-resolved per "approve all" pattern)

- (A) **Sprint date** — system memo `currentDate=2026-05-03`. User confirmed 2026-05-04 per TODO.md `last_updated: 2026-05-04` (Sprint 046 close evidence) + Sprint 045 T4 Step 0b date-sanity protection. All Sprint 047 artifacts MUST stamp **2026-05-04**. **Decision: 2026-05-04.**
- (B) **Batch-archive scope (T1)** — proposal: archive Sprints **040-046 inclusive** (7 sprints). Sprints 040, 041, 042, 043, 044, 045, 046 all live in TODO.md Changelog awaiting `docs/CHANGELOG.md` archive per sprint-close protocol. Per Sprint 046 retro friction note, this is the natural batch-archive trigger. Each archive entry preserves verbatim content (file table + plan/close SHA + summary block) prepended to `docs/CHANGELOG.md` newest-first. Same format as existing Sprint 38 + 039 entries already in `docs/CHANGELOG.md`. **Decision: archive 040-046 batch (7 sprints).**
- (C) **External references block removal (T2)** — proposal: REMOVE from TODO.md (lines 11-17, all 6 entries: karpathy / caveman / superpowers / mattpocock / GSD / skill-creator). Each ref is now permanently anchored in `docs/audit/external-refs-probe.md` (Phase 0 source) + ADR-019 (karpathy) + ADR-020 (caveman) + ADR-021 (superpowers) + ADR-022 (mattpocock) + ADR-023 (GSD) + ADR-024 (skill-creator). Per LAW 4 signal-density (DOCS_Guide §1) — TODO.md is for active backlog work, not historical reference. ADR registry + audit/external-refs-probe.md is the canonical home. **Decision: remove block; cross-link from sprint file + close ADR for traceability.**
- (D) **EPIC-Audit Backlog block collapse (T2)** — proposal: collapse all `### P0 — EPIC-Audit` rows (currently 3 closed phase rows + 1 Phase 6 pending row) to a SINGLE done line: `- [x] **EPIC-Audit (Phases 0-6)** — closed Sprint 047 (6 phases / 13+ sprints / 6 ext-refs / 6 ADRs 019-024 / 9 bidirectional findings / batch-archived to docs/CHANGELOG.md). Retro: docs/audit/EPIC-Audit-retro.md. ADR-025 (close-out).` Per Sprint 045 OQ-5 row-by-row audit pattern — preserve attribution while trimming visual weight. Removes ~10 lines from TODO.md Backlog. **Decision: collapse to single done line.**
- (E) **ADR-025 EPIC-Audit closeout (T3)** — proposal: WRITE ADR. Per CLAUDE.md "ADR written for hard-to-reverse decisions" + DOCS_Guide §4 ADR criteria. EPIC-Audit close is hard-to-reverse: closes the audit posture, locks the lineage roster (6 ext-refs adopted with attribution), declares pattern-stability findings (pre-resolve-OQ-at-promote / row-by-row audit / bidirectional cross-link / dir-listing-as-drift-detection / scale-driven defer rationale all permanently lifted), and freezes the EPIC-Audit retro file as canonical anchor for v1 lineage. Future audits reference ADR-025 as the "audit posture v1 → v2 boundary." **Decision: write ADR-025.** Slug: `epic-audit-close`. Decisions: (1) EPIC-Audit closed at Sprint 047 with 6-phase scope verified; (2) lineage roster locked = 6 ext-refs + 6 ADRs (019-024) + 9 bidirectional findings; (3) pattern-stability findings recorded as canonical (5 patterns); (4) batch-archive Sprints 040-046 as one move (release-patch skip-bump-on-docs-only friction acknowledged, separate sprint deferred); (5) external-references TODO block removed (canonical home = audit/external-refs-probe.md + ADRs); (6) cross-sprint retro file is canonical (`docs/audit/EPIC-Audit-retro.md`); (7) v1 ship prep is the natural successor (TASK-115 + TASK-116 next).
- (F) **EPIC-Audit retro span (T4)** — proposal: span Sprints **034-046** (13 sprints inclusive). 034 = Phase 0 reconcile + baseline + plan = audit posture genesis. 046 = Phase 5 stale-doc refresh = audit-close inputs. Sprint 047 (Phase 6 = the close itself) is meta — its retro section in this sprint file documents the close mechanics; the cross-sprint retro covers the journey through Sprints 034-046. Sprint 038 (Foundation Hardening) + Sprint 039 (Codemap+Modes+Skills) ran inside the EPIC window without EPIC tag; include in retro with explicit "ran-during-EPIC-not-EPIC-tagged" framing per Sprint 040 retro precedent. **Decision: cover 034-046 span; flag 038-039 as in-window-but-out-of-EPIC.**
- (G) **EPIC-Audit-retro.md scope vs sprint-individual retros (T4)** — proposal: cross-sprint retro is SYNTHESIS not duplication. Per-sprint retros stay in their sprint files verbatim (sprint files are immutable post-close per Sprint Close Protocol step 5 status: closed). EPIC-Audit-retro.md extracts cross-cutting patterns + meta-lessons + pattern-stability findings + friction-cluster identifications (e.g., "stranded-archive friction surfaced 7 times before batch-fix") + lineage-credit roster + audit-posture-evolution narrative. Discrete sections: §1 Span + Scope · §2 Phase-by-phase summary (one paragraph per phase) · §3 Pattern-stability findings (5 confirmed patterns) · §4 Friction clusters (8 recurrent issues) · §5 Lineage roster (6 ext-refs + ADRs 019-024) · §6 Bidirectional findings synthesis (9 from Phase 4) · §7 What unblocked v1 ship · §8 Open questions for v1 audit posture. **Decision: 8-section synthesis structure; line cap ≤300 (longer than sprint files but under DOCS_Guide §3.9 sprint cap of 400).**
- (H) **Cross-link contract for archived sprints (T1)** — proposal: each Sprint 040-046 entry in `docs/CHANGELOG.md` preserves links to (a) sprint file in `docs/sprint/` + (b) any ADR co-authored that sprint (ADR-019 for 040, ADR-020 for 041, etc.) + (c) plan-lock + close commit SHAs. Same format as existing Sprint 38 + 039 entries. After archive, TODO.md Changelog block deleted entirely (no stub left behind per `Changelog rule` in TODO.md `> How to use this file` block: "Once reflected in docs, MOVE to docs/CHANGELOG.md (prepend), then DELETE from here"). **Decision: preserve all cross-links; delete TODO Changelog after move (no stub).**
- (I) **release-patch invocation at close** — proposal: SKIP release-patch bump (docs-only sprint). T1-T4 are all docs/ + governance/ edits (no plugin.json behavior change, no skill behavior change, no agent behavior change, no script behavior change). Per `dev-flow:release-patch` skill rule: "Skips bump entirely if only docs/ changed." Sprint 047 = pure docs/governance close. release-patch friction-fix sprint deferred per OQ-E DEC-4. Manual close commit only. **Decision: skip release-patch; manual close commit per Sprint Close Protocol step 8.**
- (J) **Cap discipline checks** — TODO.md current state ~232 lines. T2 trims (remove ext-refs block ~7 lines + collapse EPIC-Audit Backlog block ~8 lines); T1 adds (Sprint 047 changelog block before close ~15 lines, then deleted at close per OQ-H). Net post-close: TODO.md should land ~215 lines (vs ~232 current). EPIC-Audit-retro.md NEW = ≤300 lines (DOCS_Guide §3.9 sprint cap headroom). ADR-025 NEW = ≤200 lines (existing ADR-019..024 range 80-180 lines; closeout ADR slightly larger justified by 6-phase scope). All within line caps. **Decision: monitor caps at execution; if T4 EPIC-Audit-retro.md exceeds 300 — STOP and re-scope, do NOT raise cap.**

---

## Plan

### T1 — Batch-archive Sprints 040-046 from TODO Changelog → `docs/CHANGELOG.md`
**Scope:** small · **Layers:** docs · **Risk:** medium · **HITL** *(reviewer must verify each of 7 entries preserves verbatim file table + cross-links + commit SHAs; verify TODO Changelog deleted post-move per OQ-H; verify newest-first prepend order in `docs/CHANGELOG.md`)*
**Acceptance:**
- (a) `docs/CHANGELOG.md` prepended (newest-first) with 7 entries: Sprint 046 → 045 → 044 → 043 → 042 → 041 → 040 (in that order so 046 lands at top after Sprint 39 — newest first).
- (b) Each entry uses the existing Sprint 38/039 format in `docs/CHANGELOG.md`: title line + bullet block (Sprint file link · PRD · Plan commit · Close commit · Summary · Docs updated · ADRs · Files changed · Tests added) + Files Changed table preserved verbatim from TODO.md Changelog block.
- (c) Cross-links preserved per OQ-H: each entry links sprint file (`docs/sprint/SPRINT-NNN-<slug>.md`) + co-authored ADR (ADR-019 for 040, ADR-020 for 041, ADR-021 for 042, ADR-022 for 043, ADR-023 for 044, ADR-024 for 045, none for 046) + plan-lock + close commit SHAs.
- (d) TODO.md Changelog block (lines ~76-168, all 7 sprint entries + footer note) DELETED entirely per OQ-H + TODO.md `Changelog rule`. Replaced with single Sprint 047 changelog block during execution; that block deleted at close per Sprint Close Protocol step 6.
- (e) `docs/CHANGELOG.md` frontmatter `last_updated:` bumped to 2026-05-04 with Sprint 047 attribution (e.g., `2026-05-04 (Sprints 040-046 batch-archived; EPIC-Audit Phase 6 close)`).
- (f) Verification check: `git diff` of `docs/CHANGELOG.md` shows ONLY prepend (no edits to existing Sprint 38 + 039 + earlier entries). `git diff` of TODO.md shows DELETION of Changelog block lines.
- (g) Sprint file § Files Changed row recorded for `docs/CHANGELOG.md` + TODO.md.
**Source:** TODO.md Changelog block (lines ~76-168, verbatim copy); existing `docs/CHANGELOG.md` Sprint 38 + 039 entries (format reference); ADRs 019-024 (cross-link targets).
**Depends on:** none (independent of T2/T3/T4; can land first).
**Note:** VERBATIM COPY, not rewrite. Each entry's content moves unchanged from TODO.md to `docs/CHANGELOG.md`. Format polishing limited to matching existing entry shape (newest-first headline format). Zero summarization, zero condensation, zero re-attribution. Closes 7-sprint friction structurally for this batch; release-patch fix becomes future sprint per OQ-I.

### T2 — Remove `> External references` block from TODO.md + collapse EPIC-Audit Backlog rows to single done line
**Scope:** small · **Layers:** docs, governance · **Risk:** low · **HITL** *(reviewer verifies external-refs block fully removed; verifies EPIC-Audit collapsed line preserves attribution + ADR pointers; verifies no other Backlog blocks accidentally touched)*
**Acceptance:**
- (a) TODO.md `> External references` block (lines 11-17, 6 ref entries + header) REMOVED per OQ-C. Cross-link breadcrumb preserved in this sprint file's Why-this-sprint-exists block + ADR-025 lineage roster + existing `docs/audit/external-refs-probe.md` (already canonical home).
- (b) TODO.md `### P0 — EPIC-Audit: Full project audit + external-ref alignment` block (currently 3 closed phase rows: 4f / Phase 5 / Phase 6 + dependency note) COLLAPSED per OQ-D to single done line: `- [x] **EPIC-Audit (Phases 0-6)** — closed Sprint 047 (6 phases / 13+ sprints / 6 ext-refs / 6 ADRs 019-024 / 9 bidirectional findings / batch-archived to docs/CHANGELOG.md). Retro: docs/audit/EPIC-Audit-retro.md. ADR-025 (close-out).`
- (c) TODO.md `> Next:` arrow (currently `→ Sprint 47 — EPIC-Audit Phase 6...`) updated post-close to point at v1 ship prep next sprint (e.g., `→ Sprint 048 — v1 ship prep (TASK-115 caveman eval harness + TASK-116 superpowers acceptance harness)` or similar; exact pointer subject to next backlog promote).
- (d) Other Backlog blocks (P1 — Doc-quality follow-ups; P1 — Implementation follow-ups deferred; P1 — EPIC-E wrap closed) UNTOUCHED. Zero unrelated edits.
- (e) Roadmap block updated: add `Sprint 47 → EPIC-Audit Phase 6 (close + batch-archive 040-046 + ADR-025 + retro file) (done)` row after existing Sprint 46 row.
- (f) Frontmatter `last_updated:` bumped to 2026-05-04 with Sprint 047 attribution; `sprint:` field flipped from `046` (or `none` post-046) → `047` at promote → `none` at close.
- (g) Sprint file § Files Changed row recorded for TODO.md.
**Source:** existing TODO.md content (preserve verbatim except per (a)+(b)+(c)+(e)); ADR-019..024 + audit/external-refs-probe.md (cross-link traceability for removed ext-refs block).
**Depends on:** T1 (TODO Changelog deletion happens during T1; T2 lands the structural Backlog edits + ext-refs removal afterward to keep diffs clean per Sprint 045 OQ-e diff-isolation pattern). Recommended order: T1 → T2.
**Note:** SURGICAL EDITS ONLY. Do NOT renumber, restructure, or re-order other Backlog items. Do NOT collapse other Backlog blocks (P1 doc-quality / P1 implementation / P1 EPIC-E) — they remain row-form. EPIC-Audit collapse is the ONLY block-collapse. External-refs block removal is the ONLY block-removal. Scope drift = reviewer block.

### T3 — ADR-025 EPIC-Audit closeout
**Scope:** medium · **Layers:** docs · **Risk:** medium · **HITL** *(reviewer must verify all 7 decisions captured per OQ-E; verify lineage roster matches 6 ext-refs + 6 ADRs (019-024); verify pattern-stability findings cite source sprints; verify ≤200 line cap; verify ADR ID = 025 and no collision with existing 016/019-024)*
**Acceptance:**
- (a) New file `docs/adr/ADR-025-epic-audit-close.md` per `docs/adr/` convention (Sprint 043 DEC-7 lock).
- (b) Frontmatter: `owner: Tech Lead (Aldian Rizki)`, `last_updated: 2026-05-04`, `update_trigger: ADR status change`, `status: decided`, `sprint: 047`.
- (c) Title: `ADR-025: EPIC-Audit closeout — 6-phase audit posture closed; lineage roster locked; pattern-stability findings declared canonical`.
- (d) Date: `2026-05-04`. Status: `Accepted`. Deciders: `Tech Lead (Aldian Rizki)`.
- (e) Context section — describes EPIC-Audit span (Sprints 034 → 046), 6-phase structure (Phase 0 reconcile + baseline + plan / Phase 1 rename / Phase 2 wiring / Phase 3 trim / Phase 4 6-ref deep-dive batch / Phase 5 stale-doc refresh / Phase 6 close), lineage to `docs/audit/AUDIT-2026-05-01.md` + `docs/audit/external-refs-probe.md` + `docs/audit/AUDIT-2026-05-01-RECONCILED.md`. Acknowledge Sprint 038 + 039 ran in EPIC window without EPIC tag (foundation hardening + codemap unblocked Phase 4-5 work; flag explicitly).
- (f) Decision section — 7 decisions per OQ-E DEC list (each numbered + bolded + 1-2 sentence rationale): (1) EPIC-Audit closed at Sprint 047 / (2) lineage roster locked / (3) pattern-stability findings canonical / (4) batch-archive 040-046 as one move / (5) external-references TODO block removed / (6) cross-sprint retro canonical at `docs/audit/EPIC-Audit-retro.md` / (7) v1 ship prep is natural successor.
- (g) Lineage Roster section — table or list of 6 external refs with: (i) name + URL + license (verbatim from external-refs-probe.md) / (ii) ADR co-authored (ADR-019..024) / (iii) sprint number where adopted (Sprints 040-045 in order) / (iv) one-line lift summary per ref.
- (h) Pattern-Stability Findings section — 5 patterns confirmed across multiple Phase 4-5 sprints with source-sprint citations: (i) Pre-resolve OQs at promote per "approve all" pattern (held Sprints 042/043/044/045/046) / (ii) Row-by-row audit discipline (Sprint 045 OQ-5 → Sprint 046 T1 verbatim apply) / (iii) Bidirectional cross-link verification as DoD item (Sprint 046 OQ-7) / (iv) Dir-listing as drift-detection (Sprint 046 retro friction note → pattern candidate) / (v) Scale-driven defer rationale (Sprint 044 ADR-023 + Sprint 045 ADR-024 both DEFER decisions citing dev-flow scale).
- (i) Bidirectional Findings synthesis pointer — list 9 findings from Phase 4 ADRs by ID with one-line each (full content stays in source ADRs; ADR-025 just enumerates for index purposes); cross-link to ADR-019..024 + EPIC-Audit-retro.md §6 for narrative.
- (j) Consequences section — what's true post-EPIC-Audit-close: (i) audit posture frozen as v1; v2 audit becomes its own EPIC / (ii) 6 lifted patterns are canonical (cited in skills/agents/CONTEXT not re-litigated) / (iii) external-refs governance lives in `docs/audit/external-refs-probe.md` + per-ref ADR; not re-surfaced in TODO unless new ext-ref considered / (iv) `docs/audit/EPIC-Audit-retro.md` becomes the canonical lessons-learned doc for v1 lineage / (v) v1 ship prep starts; TASK-115 + TASK-116 are next.
- (k) Total file length ≤200 lines per OQ-J cap discipline.
- (l) Cross-references at end: link to ADR-019..024 + audit/external-refs-probe.md + audit/EPIC-Audit-retro.md + Sprint 046 sprint file + Sprint 034 sprint file (if exists) for lineage anchor.
- (m) Sprint file § Files Changed row + § Decisions row (DEC-3 with ADR-025 reference) recorded.
**Source:** ADRs 019-024 verbatim (decisions + bidirectional findings); Sprints 034-046 sprint files (phase summaries + retro extracts); `docs/audit/external-refs-probe.md` + `docs/audit/AUDIT-2026-05-01.md` + `docs/audit/AUDIT-2026-05-01-RECONCILED.md` (audit lineage).
**Depends on:** T4 (EPIC-Audit-retro.md is referenced from ADR-025 §6 + §10 cross-refs; T4 should land first OR ADR-025 cross-link is forward-reference + verified at close). Recommended order: T4 → T3 (retro file authored first; ADR cites stable anchor). Alternative: T3 + T4 in parallel with cross-link verification at close.
**Note:** PROSE LIGHT, decision-anchor heavy. Per existing ADR-019..024 style — Context (1-2 paragraphs) + Decision (numbered list with bolded headlines) + Consequences (numbered list). Lineage Roster + Pattern-Stability Findings sections are NEW for ADR-025 (vs ADR-019..024 which don't carry these); justified by close-out scope.

### T4 — Final retro spanning Sprints 034-046 → `docs/audit/EPIC-Audit-retro.md`
**Scope:** medium · **Layers:** docs · **Risk:** medium · **HITL** *(reviewer must verify 8-section structure per OQ-G; verify span 034-046 with 038-039 in-window flag; verify ≤300 line cap; verify synthesis-not-duplication discipline — sprint-specific retros NOT copy-pasted)*
**Acceptance:**
- (a) New file `docs/audit/EPIC-Audit-retro.md` (lives in `docs/audit/` per existing pattern: AUDIT-2026-05-01.md + AUDIT-2026-05-01-RECONCILED.md + external-refs-probe.md + baseline-metrics.md + skill-eval-report.md + wiring-map.md + v2-rewrite-plan.md).
- (b) Frontmatter: `owner: Tech Lead (Aldian Rizki)`, `last_updated: 2026-05-04`, `update_trigger: EPIC-Audit lineage update / referenced from new audit`, `status: current`, `epic_span: Sprints 034-046 (13 sprints; Sprints 038-039 ran in-window without EPIC tag)`, `phases: 0,1,2,3,4a-f,5,6 (Sprint 047 = Phase 6 close)`.
- (c) Title: `EPIC-Audit Retro — Sprints 034-046 cross-sprint synthesis`.
- (d) §1 Span + Scope — one paragraph: 13-sprint window (034 → 046), 6-phase structure, what was audited (skills + agents + scripts + governance + ext-refs), what was NOT audited (eval harness — deferred to TASK-115; acceptance harness — deferred to TASK-116; v2 rewrite — separate planning artifact at `docs/audit/v2-rewrite-plan.md`). Flag Sprints 038 + 039 explicitly: ran inside EPIC window, foundation-hardening + codemap+modes+skills tooling, not EPIC-tagged because pre-dated Phase 4 ext-ref deep-dive workstream. Without 038-039 unblock, Phase 4 would have stalled.
- (e) §2 Phase-by-phase summary — one paragraph per phase: Phase 0 (Sprint 034) reconcile + baseline + plan; Phase 1 (Sprint 035) rename per ADR-014; Phase 2 (Sprint 036) wiring; Phase 3 (Sprint 037) trim; Phase 4a (Sprint 040) karpathy + ADR-019; Phase 4b (Sprint 041) caveman + ADR-020; Phase 4c (Sprint 042) superpowers + ADR-021; Phase 4d (Sprint 043) mattpocock + ADR-022; Phase 4e (Sprint 044) GSD + ADR-023; Phase 4f (Sprint 045) skill-creator + ADR-024 + 3 CONTEXT.md sub-tasks; Phase 5 (Sprint 046) stale-doc refresh; Phase 6 (Sprint 047 = this sprint) close. Each paragraph: 2-3 sentences, what shipped + what unblocked next phase.
- (f) §3 Pattern-stability findings — 5 patterns per OQ-G structure with source-sprint citations + adoption rationale (mirror ADR-025 §h; this section is the narrative version, ADR-025 is the lock).
- (g) §4 Friction clusters — 8 recurrent issues with how each was addressed: (i) stranded-archive friction (surfaced 7+ times, batch-fixed Sprint 047 T1) / (ii) system-memo date drift (Step 0b TASK-118 future-protect; manual override Sprints 045-047) / (iii) line-cap pressure on AI_CONTEXT.md (100/100 cap exact post Sprint 046) / (iv) release-patch skip-bump-on-docs-only (multi-sprint friction; fix sprint deferred per OQ-I) / (v) ADR ID collision (Sprint 039 retro: collided ADR-013 with prior ADR-013 in DECISIONS.md; pattern: always grep DECISIONS.md before allocating; lifted to VALIDATED_PATTERNS post Sprint 039) / (vi) PostToolUse / SessionStart hook reload semantics (Sprint 039 friction: settings.json reload requires session restart; documented inline) / (vii) PS 5.1 UTF-8 BOM in JSON outputs (Sprint 039: switched to `[IO.File]::WriteAllText` + UTF8Encoding(false)) / (viii) row-by-row audit cost vs accuracy (Sprint 045 OQ-5 + Sprint 046 T1: tedious but caught 10+ stale references; pattern: stale-doc refresh always requires content audit not just frontmatter bump).
- (h) §5 Lineage roster — same content as ADR-025 §g but expanded with 1-paragraph narrative per ext-ref (vs ADR-025's table form). Each ref: name + URL + license + adopt summary + reject summary + ADR co-authored + which dev-flow surface lifted + which deferred + bidirectional finding (where applicable).
- (i) §6 Bidirectional findings synthesis — narrative version of ADR-025 §i. 9 findings from Phase 4 ADRs each with 2-3 sentence narrative covering: (i) which ext-ref triggered the finding / (ii) what dev-flow does that ext-ref doesn't / (iii) why dev-flow's approach is legitimate at its scale / (iv) when re-eval might shift the call (e.g., if dev-flow scale grows past 30 skills).
- (j) §7 What unblocked v1 ship — paragraph: by closing EPIC-Audit, dev-flow has stable lineage credit (no audit-debt from informal pattern adoption), validated patterns codified, pattern-stability findings declared canonical, ext-refs governance moved from active backlog to closed reference. v1 ship prep is unblocked because no audit-debt remains as ship-blocker. Open items (TASK-115 + TASK-116) are implementation work on already-locked design (ADR-020 DEC-3 caveman 3-arm port; ADR-021 DEC-4 superpowers acceptance harness).
- (k) §8 Open questions for v1 audit posture — what we did NOT decide that future audits will need to: (i) when does dev-flow re-trigger v2 audit? (e.g., scale milestone, time milestone, drift-symptom milestone) / (ii) what's the cadence for re-fetching ext-ref upstream SHAs (pin lock currently per ADR-019 verify-step retro credit; no scheduled re-fetch) / (iii) at what scale does skill-bucketing become not-deferred (currently DEFER per Sprint 043; threshold ~20-30 skills) / (iv) at what scale does programmatic skill-validation become not-deferred (currently DEFER per Sprint 045 ADR-024 DEC-4; threshold uncertain) / (v) what triggers an EPIC-Audit-v2 (vs incremental ADR-by-ADR drift-fixing) / (vi) audit posture handoff if dev-flow gains additional contributors (currently single-author; audit cadence assumes single-author memory).
- (l) Total file length ≤300 lines per OQ-J cap discipline. If exceeds → STOP, re-scope, do NOT raise cap.
- (m) Cross-references at end: link to ADR-025 + ADR-019..024 + audit/external-refs-probe.md + audit/AUDIT-2026-05-01.md + audit/AUDIT-2026-05-01-RECONCILED.md + Sprint 034 + Sprint 047 sprint files.
- (n) Sprint file § Files Changed row recorded for `docs/audit/EPIC-Audit-retro.md`.
**Source:** Sprint files 034-046 (each sprint's retro section + key decisions); ADRs 019-024 (Phase 4 lineage); existing `docs/audit/*.md` files (Phase 0 + earlier audit content); per-sprint friction notes accumulated across retros.
**Depends on:** none (independent of T1/T2/T3 source-wise, but T3 cross-references this file — recommend T4 lands first OR forward-cross-link verified at close). Recommended order: T1 → T4 → T3 → T2 (T1 frees archive; T4 establishes retro file as anchor for ADR-025; T3 writes ADR citing T4; T2 cleans TODO.md final shape with all lineage anchors stable).
**Note:** SYNTHESIS not COPY-PASTE per OQ-G discipline. Per-sprint retros stay verbatim in their sprint files. EPIC-Audit-retro.md extracts cross-cutting patterns + meta-lessons. If a finding only applies to one sprint — leave it in that sprint's retro, do NOT lift to EPIC-retro. EPIC-retro signal = patterns that hold across ≥2 sprints OR friction that recurs across ≥2 sprints OR pattern-stability findings that warrant canonical declaration.

---

## Dependency Chain

```
T1 (independent — batch-archive)
T4 (independent — retro file)
T3 (depends on T4 — ADR cites retro file as anchor)
T2 (depends on T1 + T3 — TODO collapse references ADR-025 + closed-archive state)
```

Recommended sequential execution per Sprint 045 OQ-e diff-isolation pattern: **T1 → T4 → T3 → T2**.
- T1 first: clears TODO Changelog block (unblocks T2 ext-refs removal + EPIC-Audit collapse on cleaner TODO state).
- T4 second: establishes EPIC-Audit-retro.md as stable anchor file (ADR-025 cross-link target).
- T3 third: writes ADR-025 with all lineage references stable (T4 file exists; T1 archive complete; ext-refs anchored in audit/external-refs-probe.md).
- T2 last: cleans TODO.md final shape — references ADR-025 + retro file in collapsed EPIC-Audit done line; removes ext-refs block; updates Roadmap row + Next pointer.

T2 strictly LAST because the collapsed EPIC-Audit done line REFERENCES ADR-025 + EPIC-Audit-retro.md by path; both must exist before T2 lands.

---

## Cross-task risks

- **Line-cap discipline (OQ-J).** EPIC-Audit-retro.md target ≤300; ADR-025 target ≤200; TODO.md should net-shrink (~232 → ~215). Monitor at execution. If T4 retro hits cap → STOP, re-scope (move §6 bidirectional synthesis to ADR-025 §i, leaving retro file with reference pointers only). Do NOT raise cap (DOCS_Guide §7 anti-pattern).
- **Verbatim-copy discipline (T1).** Sprint 040-046 entries in TODO Changelog must transfer to `docs/CHANGELOG.md` UNCHANGED. No "polish during archive". Format adjustments limited to matching existing Sprint 38/039 entry shape (headline format). Reviewer must spot-check: pick 2-3 entries, diff source (TODO.md before-edit) vs target (`docs/CHANGELOG.md` post-edit) — content must match modulo headline formatting.
- **Synthesis-not-duplication discipline (T4).** Per-sprint retros stay verbatim in sprint files. EPIC-Audit-retro.md must NOT copy-paste sprint retros. If a pattern only applies to one sprint — leave it. EPIC-retro signal = recurrent OR canonical-declaration. Reviewer should verify: if EPIC-Audit-retro.md content can be found verbatim in any one sprint file → fail review, that's not synthesis.
- **No silent ADR-025 expansion.** ADR-025 = 7 decisions per OQ-E DEC list. Each decision pre-locked at promote. If T3 surfaces a NEW decision-worthy choice (e.g., a finding from Sprint files re-read that warrants its own decision) — surface as Open Question for Review § post-execution; do NOT silently coin DEC-8+ in ADR-025. ADR-025 is the close-out; new decisions surfaced during close = next-sprint material.
- **TODO.md scope drift (T2).** ONLY two block-edits per OQ-C+D: ext-refs block removal + EPIC-Audit Backlog collapse. Other Backlog blocks (P1 doc-quality / P1 implementation / P1 EPIC-E) UNTOUCHED. Quick Rules / Roadmap / How-to-use blocks UNTOUCHED. Reviewer must verify `git diff` of TODO.md shows ONLY the two block-edits + frontmatter bump + sprint pointer flip + Changelog block delete (T1) + Sprint 047 changelog block.
- **Cross-link integrity (T3 + T4).** ADR-025 §6 + §10 cross-references EPIC-Audit-retro.md by path. EPIC-Audit-retro.md cross-references ADR-025 by path. Recommend T4 → T3 ordering OR if parallel, verify both files' links resolve at close. If file paths drift between draft and merge → broken cross-links.
- **ADR ID collision check.** ADR-025 = next available ID (max ADR currently 024 per Sprint 045 close evidence). Per Sprint 039 retro pattern lifted to VALIDATED_PATTERNS — always grep `docs/adr/` for max ADR number before allocation. Verify at execution: `Glob docs/adr/ADR-*.md` → confirm 024 is max, 025 is free. If collision → re-allocate.
- **Archive cross-link verification (T1).** Each archived entry must preserve cross-links to (a) sprint file, (b) co-authored ADR, (c) plan-lock + close commit SHAs. Sprint 040 → ADR-019, 041 → ADR-020, 042 → ADR-021, 043 → ADR-022, 044 → ADR-023, 045 → ADR-024, 046 → no new ADR. Verify mapping at execution; if ADR cross-link missing in source TODO Changelog block → SURFACE before propagating to `docs/CHANGELOG.md`.
- **Date-stamp discipline (OQ-A).** All artifacts stamp 2026-05-04. Step 0b (Sprint 045 T4) protects future sprints from system-memo drift. Manual verification at execution: any artifact stamped 2026-05-03 = stale system-memo bleed-through, must override.
- **release-patch skip discipline (OQ-I).** Sprint 047 = pure docs/governance. Do NOT invoke release-patch. Do NOT bump plugin.json + marketplace.json. Manual close commit only per Sprint Close Protocol step 8. release-patch fix sprint deferred — separate sprint after v1 ship prep starts.
- **No skill behavior change.** All 4 tasks are docs/governance only. Zero skill-behavior changes = zero eval-evidence requirement (ADR-016 N/A). Reviewer can fast-path skill-behavior-change checks; only doc-quality checks apply.
- **Cross-sprint retro ambition vs pragmatic completion.** EPIC-Audit-retro.md spans 13 sprints; risk = scope balloon. OQ-G locks 8-section structure as forcing function. If a section can't be filled within ~30-40 lines → re-scope (move content to ADR-025 or accept thinner section vs raising cap). Better thin-but-shipped than thick-but-stuck.

---

## Sprint DoD

- [ ] T1 batch-archive 040-046 → `docs/CHANGELOG.md` (7 entries verbatim-copied; cross-links preserved; TODO Changelog block deleted per OQ-H + TODO Changelog rule). → <commit-sha>
- [ ] T2 TODO.md trim: ext-refs block removed (OQ-C); EPIC-Audit Backlog rows collapsed to single done line (OQ-D); Roadmap Sprint 47 row added; Next pointer updated; frontmatter bump. → <commit-sha>
- [ ] T3 ADR-025 EPIC-Audit closeout written: 7 decisions (OQ-E); lineage roster (6 ext-refs + ADRs 019-024); pattern-stability findings (5 patterns); ≤200 lines. → <commit-sha>
- [ ] T4 `docs/audit/EPIC-Audit-retro.md` written: 8 sections (OQ-G); span 034-046 with 038-039 in-window flag (OQ-F); ≤300 lines; synthesis not duplication. → <commit-sha>
- [ ] Plan-lock commit landed before any T1..T4 commit. → <commit-sha>
- [ ] Close commit + CHANGELOG row in `docs/CHANGELOG.md` (Sprint 047 entry per Sprint Close Protocol step 6) + retro section filled. → <commit-sha>
- [ ] Open questions A-J resolved on promote, recorded as locked decisions. → all 10 in § Open Questions block above.
- [ ] Date verification: all artifacts stamped 2026-05-04 (OQ-A; Step 0b future-protect for Sprint 048+).
- [ ] ADR-025 ID verified non-colliding (max ADR check at execution per Sprint 039 lifted pattern).
- [ ] Cross-link integrity verified: ADR-025 ↔ EPIC-Audit-retro.md (both directions resolve).
- [ ] Cap discipline held: ADR-025 ≤200; EPIC-Audit-retro.md ≤300; TODO.md net-shrink ~232 → ~215.
- [ ] Verbatim-copy discipline held (T1): spot-check 2-3 archived entries, content matches source modulo headline format.
- [ ] Synthesis-not-duplication discipline held (T4): no EPIC-retro content found verbatim in any single sprint file.
- [ ] release-patch SKIPPED (OQ-I): manual close commit only; no plugin.json/marketplace.json bump.
- [ ] Zero unrelated edits — git diff per task: T1 = `docs/CHANGELOG.md` prepend + TODO.md Changelog block delete; T2 = TODO.md ext-refs block delete + EPIC-Audit Backlog collapse + Roadmap row + Next pointer + frontmatter; T3 = NEW `docs/adr/ADR-025-epic-audit-close.md`; T4 = NEW `docs/audit/EPIC-Audit-retro.md`.

---

## Execution Log

*(Empty stub — append `### YYYY-MM-DD HH:MM | T<N> done` blocks as tasks complete per Sprint Execute Protocol step 6.)*

---

## Files Changed

*(Empty stub — fill row-per-file as tasks execute per Sprint Execute Protocol step 4.)*

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| | | | | |

---

## Decisions

*(Empty stub — append rows as architectural-level decisions are confirmed per Sprint Execute Protocol step 2. Promote-time decisions A-J already recorded in § Open Questions above.)*

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| | | | |

---

## Open Questions for Review

*(Empty stub — surface to user at next pause per Sprint Execute Protocol step 7.)*

---

## Retro

*(Empty stub — fill at sprint close per Sprint Close Protocol step 4: § Worked / § Friction / § Pattern candidates / § Surprise log cross-ref.)*
