---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending
close_commit: pending
---

# Sprint 046 — EPIC-Audit Phase 5 (stale doc refresh — `ARCHITECTURE.md` + `AI_CONTEXT.md`)

**Theme:** Refresh the two `status: stale` Tier-2 reference docs surfaced by Sprint 045's staleness scan — `docs/ARCHITECTURE.md` and `docs/AI_CONTEXT.md`. Both carry `last_updated: 2026-05-03` against state from Sprint 23-24 era; intermediate sprints (30, 35, 38, 39, 40-45) have invalidated component map rows, current-focus block, and pattern roster. Phase 5 of EPIC-Audit. Decision-only-light + mechanical: 3 surgical refresh tasks, no new behaviour, no skill edits.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 045 closed `80920ef` (EPIC-Audit Phase 4 series complete).
**Successor:** Sprint 047 — EPIC-Audit Phase 6 (archive external refs + close EPIC-Audit). **Held per roadmap; do not pull forward into Sprint 046.**

---

## Why this sprint exists

**Phase 5 is the staleness-debt payoff for the 6-sprint Phase 4 deep-dive run** (Sprints 040-045). Phase 4 produced ADR-019..024 + 9 research notes + new patterns (`.out-of-scope/` convention, lineage credit, bidirectional-finding section, skill version semantics). None of that ripple has landed in `ARCHITECTURE.md` or `AI_CONTEXT.md`. Both files explicitly mark themselves `status: stale` and were deferred until Phase 4 closed — that gate is now passed.

**Concrete drift surfaced in Sprint 045 staleness scan:**

- `ARCHITECTURE.md` Component Map references `.claude/skills/<name>/SKILL.md` and `.claude/agents/<name>.md` paths — Sprint 035 ADR-014 renamed the layout to root-level `skills/` and `agents/` per Claude Code plugin spec.
- `ARCHITECTURE.md` § Reference Files cites `.claude/skills/MANIFEST.json` — file no longer exists post Sprint 038/039 restructure.
- `AI_CONTEXT.md` § Current Focus still reads "Sprint 23 done · Sprint 24 active · Sprint 25 next" — 22 sprints out of date.
- `AI_CONTEXT.md` § Patterns omits codemap (Sprint 039), sprint-bulk mode (Sprint 039 TASK-099), and behavioural-guidelines lineage (Sprint 040 ADR-019).
- Both files predate the `docs/adr/` convention lock (Sprint 043 DEC-7) — pointers should reference `docs/adr/ADR-NNN-<slug>.md` not `DECISIONS.md` for new ADRs.
- Neither file references `docs/codemap/CODEMAP.md` (Sprint 039 TASK-098 L0-overflow target).

**Scope boundary — what Phase 5 IS NOT:** not a rewrite, not a re-architecture, not new behaviour. Surgical refresh: correct stale rows, add missing pattern entries, update Current Focus, bump `last_updated` + flip `status: current`. Line-cap discipline preserved (`ARCHITECTURE.md` ≤150, `AI_CONTEXT.md` ≤100). No new core file. No HOW content. Sprint 047 closes EPIC-Audit; Sprint 046 sets the inputs.

**Per OQ-3 (locked at promote): Sprint 047 (Phase 6) HELD per roadmap.** Do not pull EPIC-Audit close into this sprint window. Phase 5 + Phase 6 stay separate sprints — Phase 5 readies the inputs (refreshed docs); Phase 6 archives external refs + writes the EPIC-Audit close ADR. Mixing them destroys the close-ADR's diff signal.

---

## Open Questions (locked at promote — pre-resolved per "approve all" pattern)

- (1) **`ARCHITECTURE.md` ASCII diagram on lines 17-25** — proposal: **collapse per LAW 4 signal-dense rule** (DOCS_Guide.md §1). The diagram restates Component Map content and adds zero unique signal beyond what the table immediately below conveys. Replace with a 2-line prose summary (≤2 lines) referencing § Component Map. Frees ~9 lines of headroom for refreshed rows. Per DOCS_Guide.md §7 "Mega Doc" anti-pattern — never raise line cap to fit content; remove redundancy first. **Decision: collapse.**
- (2) **Keep `AI_CONTEXT.md` separate from `.claude/CONTEXT.md`** — proposal: do NOT merge or alias. `docs/_routing.json` enumerates `AI_CONTEXT` as a root-level core doc accepted at `docs/`; `CONTEXT.md` lives at `.claude/CONTEXT.md` with different ownership header + different reader (CLAUDE.md-loaded shared vocab vs. AI assistant patterns/conventions). Two files = two readers = two update triggers. Cross-reference both ways but keep distinct. Per `docs/_routing.json` contract — root-level core docs locked. **Decision: keep separate.**
- (3) **Phase 6 (EPIC-Audit close) — pull into Sprint 046 or hold for Sprint 047?** — proposal: **HOLD for Sprint 047** per TODO.md Roadmap (Sprints 46+47 split deliberately). Phase 6 archives `docs/external-refs-probe.md` + writes EPIC-Audit close ADR + flips EPIC-Audit row in TODO.md to closed. Mixing Phase 5 (refresh) + Phase 6 (archive+close) hides the EPIC-close ADR's diff signal under refresh churn. Plus Phase 6 has no Phase-5 dependency that requires same-sprint atomicity. **Decision: hold Phase 6 for Sprint 047.**
- (4) **Sprint date verification** — system memo `currentDate = 2026-05-03`. User manually confirmed today is **2026-05-04** (per system memo override; manual confirmation captured at promote per DOCS_Guide §3 last_updated semantics). Step 0b (TASK-118, Sprint 045) would WARN this mismatch on next run; manual override accepted at promote per OQ-d resolution. All artifacts MUST stamp **2026-05-04**. Future sprints get pre-flight Step 0b protection automatically. **Decision: 2026-05-04.**
- (5) **Component Map row-by-row audit vs. wholesale rewrite** — proposal: **row-by-row audit**. Read each existing row, verify path against current repo state, fix path or delete row. Add missing rows (codemap-refresh skill, prime skill, release-patch skill, sprint-bulk dispatcher mode entry). Preserves diff isolation; reviewer sees per-row delta not full-file replacement. Same discipline as Sprint 045 OQ-e (CONTEXT.md edit ordering). **Decision: row-by-row audit, never wholesale rewrite.**
- (6) **`AI_CONTEXT.md` § Current Focus replacement copy** — proposal: replace stale Sprint-23/24/25 block with current state — `done: Sprint 045 — EPIC-Audit Phase 4 series complete (ADR-019..024)` / `active: Sprint 046 — EPIC-Audit Phase 5 (stale doc refresh)` / `next: Sprint 047 — EPIC-Audit Phase 6 (archive ext-refs + close EPIC-Audit)`. Three lines, mirror existing format. Future § Current Focus updates land at sprint promote (covered by `update_trigger`). **Decision: 3-line replacement, no format change.**
- (7) **Cross-link contract between refreshed docs** — proposal: each refreshed doc adds one explicit pointer to the other in its existing pointer block (`AI_CONTEXT.md` § Doc Scope Map already references ARCHITECTURE.md; `ARCHITECTURE.md` § Reference Files should add an AI_CONTEXT.md reference for pattern-vs-component-map navigation). Bidirectional pointers prevent reader getting stuck in the wrong doc. **Decision: add bidirectional pointers; one line each.**
- (8) **ADR-025 needed for any Phase 5 decision?** — proposal: **NO ADR**. Phase 5 is a refresh of stale content against decisions already captured in ADR-013 / ADR-014 / ADR-016 / ADR-019..024. No new architectural decision is being made. Per DOCS_Guide.md §4 ADR criteria — refresh of existing decisions ≠ new decision. If T1/T2 read-pass surfaces a NEW architectural choice (e.g., a missing component-map row reveals an undocumented pattern), surface as OQ; do NOT silently coin a new ADR. **Decision: no ADR-025; max ADR stays at 024.**

---

## Plan

### T1 — `docs/ARCHITECTURE.md` refresh (component map + reference files + ASCII collapse)
**Scope:** small · **Layers:** docs · **Risk:** medium · **HITL** *(reviewer must verify row-by-row diff per OQ-5; verify ≤150 line cap held; verify ASCII collapse per OQ-1)*
**Acceptance:**
- (a) ASCII diagram (current lines ~17-25) **collapsed to ≤2-line prose summary** per OQ-1. Net: ~7 lines removed.
- (b) § Component Map row-by-row audit: each row verified against current repo state. Stale paths corrected (`.claude/skills/...` → `skills/...`, `.claude/agents/...` → `agents/...`). Stale rows removed (e.g., `MANIFEST.json` if file no longer exists — verify at execution). Missing rows added: codemap-refresh skill (Sprint 039), prime skill, release-patch skill, sprint-bulk dispatcher mode reference.
- (c) § Reference Files updated: `.claude/skills/MANIFEST.json` row removed if file gone; `docs/codemap/CODEMAP.md` added; `docs/_routing.json` added; `.claude/CONTEXT.md` referenced for shared vocab; bidirectional pointer to `AI_CONTEXT.md` added per OQ-7.
- (d) § Key Patterns reviewed — add `Codemap` pattern entry (one line referencing `docs/codemap/CODEMAP.md`); add `Sprint-bulk dispatcher` mode entry to `Mode-modal dispatch` (Sprint 039 TASK-099).
- (e) § Integration Points reviewed — Python row trimmed if eval harness ADR-001 status changed (verify before edit; do NOT silently change unless verified).
- (f) Frontmatter: `last_updated: 2026-05-04`, `status: stale → current`. Update_trigger preserved verbatim.
- (g) **Total file length ≤150 lines** (currently 87; ASCII collapse −7 + estimated ~25-line refresh additions = ~105 expected, well within cap).
- (h) Sprint file § Files Changed row recorded.
**Source:** repo state at promote (verify each path with `ls`/`Glob` before editing); `docs/_routing.json` for cross-link targets; ADR-014/016/019-024 for state-of-architecture references.
**Depends on:** none.
**Note:** ROW-BY-ROW AUDIT, not wholesale rewrite (OQ-5). Zero unrelated edits. If a row's correct value is uncertain — surface as OQ; do NOT guess. ASCII collapse is the only structural change; everything else is row-level edits + frontmatter bump.

### T2 — `docs/AI_CONTEXT.md` refresh (current focus + patterns + cross-links)
**Scope:** small · **Layers:** docs · **Risk:** medium · **HITL** *(reviewer must verify ≤100 line cap held; verify Current Focus copy matches OQ-6 spec; verify cross-link added per OQ-7)*
**Acceptance:**
- (a) § Current Focus replaced per OQ-6: `done: Sprint 045 — EPIC-Audit Phase 4 series complete (ADR-019..024)` / `active: Sprint 046 — EPIC-Audit Phase 5 (stale doc refresh)` / `next: Sprint 047 — EPIC-Audit Phase 6 (archive ext-refs + close EPIC-Audit)`. Three lines exactly.
- (b) § Patterns refreshed: ADD `Codemap` (Sprint 039), ADD `Sprint-bulk dispatcher` (Sprint 039 TASK-099), ADD `Behavioural Guidelines Lineage` (Sprint 040 ADR-019). Existing 5 entries preserved verbatim if accurate.
- (c) § Conventions reviewed — add `External-ref lineage` convention entry (Sprint 040-045 pattern: cite upstream SHA + license + bidirectional findings) referencing ADR-019..024.
- (d) § Do Not reviewed — add `Do not edit DECISIONS.md for new ADRs — use docs/adr/ADR-NNN-<slug>.md` (Sprint 043 DEC-7 convention lock).
- (e) § Doc Scope Map updated: add `docs/adr/`: per-decision ADRs (Sprint 043 convention) entry; add `docs/codemap/CODEMAP.md` entry; add `docs/research/` entry.
- (f) § Context Load Order updated: add L2 step for `.claude/CONTEXT.md` if touching shared vocabulary; add L2 step for `docs/codemap/CODEMAP.md` if needing module map.
- (g) § Identity + § Structure rows reviewed for path/count accuracy (skill count, agent count, scripts inventory). Update counts if drifted; surface for confirm if unsure.
- (h) Bidirectional pointer to `ARCHITECTURE.md` reinforced per OQ-7 (already partially present via § Navigation Guide; verify and tighten).
- (i) Frontmatter: `last_updated: 2026-05-04`, `status: stale → current`. Update_trigger preserved verbatim.
- (j) **Total file length ≤100 lines** (currently 87; expected adds ~10-12 lines, room for trim of stale content too — net should land ≤95).
- (k) Sprint file § Files Changed row recorded.
**Source:** TODO.md Active Sprint + Backlog (for Current Focus); ADR-019..024 (for new patterns); `.claude/CONTEXT.md` (for vocabulary cross-ref); current repo `skills/`+`agents/` listings (for Identity/Structure counts).
**Depends on:** none (independent of T1, can land in parallel — but recommend T1 → T2 sequential for diff-isolation per Sprint 045 OQ-e pattern).
**Note:** SURGICAL REFRESH ONLY. Do NOT restructure sections. Do NOT add new sections. Do NOT change ordering. If existing content is wrong — fix in place; if a new pattern needs a new section — surface as OQ. Trim before adding to maintain ≤100-line cap.

### T3 — TODO.md update + roadmap row + Phase 5 changelog row
**Scope:** trivial · **Layers:** docs, governance · **Risk:** low · **HITL** *(reviewer verifies TODO.md Active Sprint pointer + Backlog Phase-5 task tick + Roadmap row addition)*
**Acceptance:**
- (a) TODO.md `Active Sprint` flipped from `→ — none —` to `→ docs/sprint/SPRINT-046-stale-doc-refresh.md` (at plan-lock); flipped back to `→ — none —` at sprint close.
- (b) Backlog § P0 EPIC-Audit row: `Phase 5 — Stale doc refresh` `[ ]` flipped to `[x]` at sprint close with attribution `closed Sprint 046 (ARCHITECTURE.md + AI_CONTEXT.md refresh + bidirectional cross-links)`.
- (c) Roadmap row added at sprint close: `Sprint 46 → EPIC-Audit Phase 5 — Stale doc refresh (ARCHITECTURE.md + AI_CONTEXT.md refresh; ASCII collapse; bidirectional pointers; Current Focus + Patterns + Conventions update) (done)`.
- (d) Changelog block added under § Sprint 046 — entries match Files Changed table, plan-lock + per-task SHAs + close SHA.
- (e) Frontmatter `last_updated:` bumped to 2026-05-04 with Sprint 046 attribution.
- (f) `sprint:` field flipped from `none` → `046` at promote, back to `none` at close.
- (g) Sprint file § Files Changed row recorded for TODO.md.
**Source:** existing TODO.md Active Sprint / Backlog / Roadmap / Changelog blocks (preserve existing format verbatim).
**Depends on:** T1 + T2 (TODO.md Changelog block references their Files Changed entries; Roadmap row summarises both).
**Note:** MECHANICAL UPDATE. No new sections. Mirror Sprint 045 changelog block format exactly. The plan-lock TODO update (flip Active Sprint pointer + sprint field) lands as part of the plan-lock commit, NOT the close commit.

---

## Dependency Chain

```
T1 (independent) ─┐
                  ├─→ T3 (TODO.md changelog + roadmap)
T2 (independent) ─┘
```

T1 and T2 are mutually independent — recommended sequential execution (T1 first, T2 second) for diff-isolation per Sprint 045 OQ-e. T3 depends on both (Changelog block summarises both file changes). Recommended order: T1 → T2 → T3.

---

## Cross-task risks

- **Line-cap discipline.** ARCHITECTURE.md ≤150 (current 87, target ≤105); AI_CONTEXT.md ≤100 (current 87, target ≤95). Both files have headroom but only because OQ-1 frees 7 lines via ASCII collapse + T2 trims stale content alongside additions. If additions exceed headroom — STOP and surface; do NOT raise cap (DOCS_Guide.md §7 anti-pattern).
- **Component Map verification cost.** T1 requires `ls`/`Glob` verification of every Component Map row's path. Sprint 035 rename + Sprint 038/039 restructure + Sprint 045 skill additions all ripple. Budget for verification time, not just edit time.
- **`AI_CONTEXT.md` Identity counts drift.** Skill count (currently `10`) and agent count (currently `7`) may be wrong post Sprint 039-045. Verify with directory listings before edit; if changed, update + surface count delta in execution log.
- **No-ADR discipline (OQ-8).** Refresh ≠ new decision. If T1/T2 read-pass uncovers an undocumented architectural choice — surface as OQ for separate ADR; do NOT silently coin ADR-025 in this sprint. Sprint 047 (Phase 6) is the natural carrier for any new ADR surfaced during Phase 5 read-pass.
- **Cross-link asymmetry risk.** Bidirectional pointer per OQ-7. If only one direction lands, navigation gets stuck. T1 + T2 must both add their respective pointers; verify cross-link in both files before close.
- **`AI_CONTEXT.md` ↔ `.claude/CONTEXT.md` separation discipline (OQ-2).** Two files, two readers. T2 must NOT collapse `AI_CONTEXT.md` into `CONTEXT.md` or vice versa. Cross-reference, never alias. Per `docs/_routing.json` contract.
- **Phase 6 hold discipline (OQ-3).** Do NOT touch external-refs-probe.md, do NOT write EPIC-Audit close ADR, do NOT flip EPIC-Audit row in TODO.md to "closed" this sprint. Those are Sprint 047 work. If user requests pull-forward at execution — surface and refuse.
- **Date verification.** System memo says 2026-05-03; user manually confirmed 2026-05-04 at promote (OQ-4). Step 0b (TASK-118, Sprint 045) provides future protection. Verify all artifacts stamp 2026-05-04 manually for this sprint.
- **release-patch on close.** T1 + T2 + T3 are pure docs/ + TODO.md edits. release-patch should detect docs-only and SKIP-BUMP per Sprint 045 retro friction note (release-patch skip-bump-on-docs-only is currently ON, flagged for fix but applies cleanly here). Sprint 047 may be similar shape; future bump catches Sprints 040..047 batch.
- **Read-only sprint shape risk.** No skill edits, no code edits, no agent edits. ADR-016 eval-evidence rule N/A (no skill behaviour change). Lower risk than Sprint 045's mixed shape but reviewer should still verify zero scope drift.

---

## Sprint DoD

- [ ] T1 `docs/ARCHITECTURE.md` refresh: ASCII collapse + Component Map row-by-row audit + Reference Files + Key Patterns + frontmatter bump. Status flipped to `current`. ≤150 lines preserved.
- [ ] T2 `docs/AI_CONTEXT.md` refresh: Current Focus + Patterns + Conventions + Do Not + Doc Scope Map + Context Load Order + Identity counts + cross-links + frontmatter bump. Status flipped to `current`. ≤100 lines preserved.
- [ ] T3 TODO.md update: Active Sprint pointer (plan-lock) + Backlog tick (close) + Roadmap row (close) + Changelog block (close) + frontmatter bump.
- [ ] Bidirectional cross-link verified: ARCHITECTURE.md → AI_CONTEXT.md AND AI_CONTEXT.md → ARCHITECTURE.md.
- [ ] Plan-lock commit landed before any T1..T3 commit.
- [ ] Close commit + CHANGELOG row + retro.
- [ ] Open questions (1–8) resolved on promote, recorded as locked decisions.
- [ ] Date verification: all artifacts stamped 2026-05-04 (manual override per OQ-4; Step 0b protects future sprints).
- [ ] No new ADR coined this sprint (OQ-8 discipline). Max ADR stays at 024.
- [ ] Phase 6 NOT touched (OQ-3 discipline). external-refs-probe.md untouched. EPIC-Audit row in TODO.md remains `[ ]` until Sprint 047.
- [ ] Zero unrelated edits (T1 row-by-row only; T2 surgical only; T3 mechanical only). Sprint shape verified via per-task git diff stats.

---

## Execution Log

*(Populated during execution per Sprint Execute Protocol — append-only blocks dated YYYY-MM-DD HH:MM | T<N> done.)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| *(populated during execution)* | | | | |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| *(populated during execution)* | | | |

---

## Open Questions for Review

*(Populated during execution if any surface beyond the 8 promote-time OQs above.)*

---

## Retro

*(Populated at sprint close per Sprint Close Protocol — Worked / Friction / Pattern candidates / Surprise log.)*
