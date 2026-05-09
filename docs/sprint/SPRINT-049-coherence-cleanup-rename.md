---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Sprint state change
status: closed
plan_commit: 7b04875
close_commit: 7b04875
---

# Sprint 049 — Plugin Coherence Cleanup + Rename (F1 + F2 + architecture-grill rename)

**Theme:** First slice of post-ISSUE-03 plugin coherence audit (Sprint 048 retro § Open Questions surfaced 6 fixes; user locked 7-sprint clean split). Sprint 049 delivers smallest-scope/highest-clarity wins: drop redundant skill, tag plugin-internal skill honestly, rename confused skill. Zero new features. Surface area shrinks. Outcome lens (ADR-026) drives every decision.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 048 closed `38035d8` (User-Project Outcome Lens; ISSUE-03 reframe).
**Successor:** Sprint 050 — F3 init scaffold enrichment (settings.json + .gitignore + docs/ skeleton + codemap/adr dirs).

---

## Why this sprint exists

Sprint 048 closed ISSUE-03 by establishing the user-project outcome lens. Re-applying the lens to existing plugin surface immediately surfaced 5 plugin-coherence findings (user session 2026-05-08 post-Sprint-048):

1. **`dev-flow-compress` is redundant.** `caveman:compress` (caveman plugin, already imported) provides identical functionality (in-place caveman-style compression of CLAUDE.md / memory files with `<stem>.original.md` backup). Two skills covering one concern = harness flow regression (O5 fail). Drop.
2. **`release-patch` is plugin-internal only.** Bumps `.claude-plugin/plugin.json` + `marketplace.json` in lockstep — fields that exist only on Claude Code plugins. ~95% of user-projects (consumers, not plugin authors) get nothing. Counter-evidence currently weak ("skip when docs-only diff"); needs sharpening to "skip when project is not a Claude Code plugin." General `release-version` skill (covers `package.json` / `pyproject.toml` / `Cargo.toml` semver) queued v1.x.
3. **`system-design-reviewer` vs `design-analyst` confusion.** Two architecture-review surfaces. Skill is ad-hoc grill mode; agent is auto-G2 design plan. Same bucket, different role. Users guess wrong. Rename skill → `architecture-grill` (clarifies role; behavior unchanged).
4. (Findings 4+5 — orchestrator wiring + tech-debt loop — deferred to Sprints 052+ per locked split.)
5. (Finding 6 — task-decomposer ↔ lean-doc unify — deferred to Sprint 051 per locked split.)

Sprint 049 = surgical cleanup of findings 1, 2, 3 only. No new features. No init scaffold work (Sprint 050). No wiring (Sprint 052).

**Per OQ-J: Date stamping = 2026-05-08** (Step 0b TASK-118 date-sanity discipline).

---

## Open Questions (locked at promote — pre-resolved via session AskUserQuestion + analysis)

- (A) **Sprint split shape.** Options: 7-sprint clean / 6-sprint compact / 5-sprint aggressive. **Decision: 7-sprint clean split.** One theme per sprint. Easier review; lower risk per sprint; G1 size discipline preserved (each sprint S-M only).
- (B) **Start which sprint NOW.** Options: 049 only / lock-only / 049+050. **Decision: 049 only this session.** Validate split approach + ship cleanup/rename end-to-end; future sprints in fresh sessions.
- (C) **Init scaffold scope.** Options: settings.json + .gitignore / settings.json only / full scaffold incl. docs/. **Decision: full scaffold incl. docs/ skeleton + codemap/adr dirs.** Matches dev-flow itself; user-projects need full harness on day-1 not piecemeal. Deferred to Sprint 050 execution; locked here.
- (D) **system-design-reviewer fix.** Options: rename to architecture-grill / fold into design-analyst / keep both with better docs. **Decision: rename to architecture-grill.** Different scope deserves different name; design-analyst stays auto-G2 agent; no skill behavior change.
- (E) **dev-flow-compress drop strategy.** **Decision: silent remove + CHANGELOG note + USER-OUTCOMES row deletion.** No deprecation stub. `caveman:compress` is documented user-facing alternative (already in available skills). Plugin version → MINOR bump on next release-patch run (skill count 17 → 16).
- (F) **release-patch strategy.** Initial promote: tag plugin-internal + queue v1.x `release-version`. **Decision (revised mid-execution after user pushback for general utility):** GENERALIZE release-patch — auto-detect manifest cascade (plugin / npm / python / cargo / go / flat); plugin lockstep + MEMORY refresh + CONTEXT drift gated to `mode = plugin`; per-mode logic in `references/version-detection.md`. Drop v1.x release-version queued task (release-patch covers the scope). Skill version 1.0.0 → 2.0.0. Eval-evidence gap accepted (acceptance harness Sprint 053).
- (G) **Cap discipline.** CLAUDE.md currently 79/80 (Sprint 048 trim held). File Structure block change `17 SKILL.md` → `16 SKILL.md` is in-line edit (no line count change). CONTEXT.md 121/130; no edit expected (rename doesn't change agent roster). **Decision: monitor at execution; if either cap breached, STOP and re-trim.**
- (H) **Historical file scope.** Sprint files (SPRINT-*.md), ADRs, CHANGELOG, audit/, blueprint/, research/ all reference `dev-flow-compress` and `system-design-reviewer` historically. **Decision: LEAVE historical files unchanged** per Sprint Close Protocol (sprint files immutable post-close) + Surgical Changes principle. Live cross-refs only: skills/diagnose/SKILL.md, README, USER-OUTCOMES, SETUP.md, CLAUDE.md File Structure count.
- (I) **release-version general skill scope (v1.x backlog).** **Decision: queue ONLY as backlog row in this sprint; design + implementation deferred to v1.x.** Avoid scope creep; Sprint 049 must remain surgical.
- (J) **Date stamp.** All artifacts stamp 2026-05-08.
- (K) **release-patch invocation.** Sprint 049 = mixed diff (removes skill + renames skill = NOT docs-only). MINOR bump applies (`new agent / new skill / new mode` rule extends to skill removal/rename per semver discipline). **Decision: invoke release-patch at close; expect MINOR bump (e.g., v2.5.0 → v2.6.0); manual reconcile if release-patch detects MINOR-not-PATCH and aborts.**

---

## Plan

### T1 — Drop `dev-flow-compress` skill (replace with `caveman:compress`)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: skill dir fully removed; no live cross-refs remain; SETUP.md reference replaced; USER-OUTCOMES row dropped; README skills table count + row dropped)*
**Acceptance:**
- (a) DELETE `skills/dev-flow-compress/SKILL.md` + `skills/dev-flow-compress/references/procedure.md` + `skills/dev-flow-compress/` directory.
- (b) `docs/SETUP.md` line ~79: replace `Run /dev-flow-compress to condense` → `Run /caveman:compress to condense`.
- (c) `docs/USER-OUTCOMES.md` § Skills (17): remove `dev-flow-compress` row; section header updates `Skills (17)` → `Skills (16)`.
- (d) `README.md` § Skills table: remove `dev-flow-compress` row; § What You Get table count `Skills | 17` → `Skills | 16`.
- (e) `.claude/CLAUDE.md` File Structure block: `skills/  # 17 SKILL.md files` → `skills/  # 16 SKILL.md files`.
- (f) Historical files (SPRINT-*.md / ADR-*.md / CHANGELOG / audit/ / research/ / blueprint/ / .out-of-scope/) UNTOUCHED per OQ-H.
- (g) Sprint file § Files Changed row recorded.
**Source:** existing dev-flow-compress + caveman:compress skill definitions (functional equivalence verified Sprint 049 plan § Why).
**Depends on:** none.

### T2 — Rename `system-design-reviewer` → `architecture-grill`
**Scope:** small · **Layers:** skills, docs · **Risk:** medium · **HITL** *(reviewer verifies: dir + SKILL.md name field renamed; live cross-refs updated; orchestrator/dispatcher wiring unchanged; trigger phrase still unique; description preserves "Use when…" lead per CONTEXT.md skill authoring standards)*
**Acceptance:**
- (a) RENAME `skills/system-design-reviewer/` → `skills/architecture-grill/`. Files inside (SKILL.md + references/procedure.md) keep their names; only dir + SKILL.md `name:` field rename.
- (b) `skills/architecture-grill/SKILL.md` frontmatter `name: system-design-reviewer` → `name: architecture-grill`. Title H1 `# system-design-reviewer` → `# architecture-grill`. Description text adjusted: keep "Use when…" lead; "Use when reviewing a proposed or existing system design" → "Use when stress-testing a proposed or existing architecture via grill mode (one-question-at-a-time)". Trigger remains `/architecture-grill`.
- (c) `skills/diagnose/SKILL.md` description: `use system-design-reviewer instead` → `use architecture-grill instead`.
- (d) `docs/USER-OUTCOMES.md` § Skills row: `system-design-reviewer` → `architecture-grill`; trigger column updates `/system-design-reviewer` → `/architecture-grill`.
- (e) `README.md` § Skills table: rename row + trigger; § What You Get table descriptor `(7 specialists ... system-design-reviewer)` updates if mentioned (verify; likely not).
- (f) Historical files UNTOUCHED per OQ-H. Codemap handoff.json regenerates on commit (PostToolUse hook).
- (g) Sprint file § Files Changed row recorded.
**Source:** existing skill SKILL.md + dependent files (verified live cross-refs only).
**Depends on:** T1 (independent file-wise; ordered T1 first to settle skill count before rename diff).

### T3 — Generalize `release-patch` (auto-detect manifest cascade; 6 modes)
**Scope:** medium · **Layers:** skills, docs · **Risk:** medium · **HITL** *(reviewer verifies: SKILL.md ≤100 lines; references/version-detection.md owns per-mode logic; plugin-mode behavior unchanged from v1.0.0; general modes skip plugin-only steps; counter-evidence updated; eval-evidence gap noted)*
**Acceptance:**
- (a) `skills/release-patch/SKILL.md` rewritten for general scope. Frontmatter version 1.0.0 → 2.0.0. Description rewritten for cascade. Mode detection table added. Step 2 = mode detect; Step 3 per-mode bump (delegates to references). Steps 5 + 6 (MEMORY refresh · CONTEXT drift) gated `*(plugin mode only)*`. Step 4 CHANGELOG path detection (plugin → docs/CHANGELOG.md; general → root CHANGELOG.md / CHANGES.md / HISTORY.md detect). HARD STOP message includes `Mode:` line. Cap held ≤100.
- (b) NEW `skills/release-patch/references/version-detection.md` (≤200 lines) owns: detection cascade implementation; per-mode bump procedure (plugin lockstep / npm / python with PEP 621 + Poetry variants / cargo with workspace inheritance / go tag-based / flat VERSION); CHANGELOG file detection + Keep-a-Changelog default; edge cases (pre-release suffixes, dynamic versions, multi-manifest, version=`0.0.0`).
- (c) `docs/USER-OUTCOMES.md` § Skills `release-patch` row: counter-evidence updated to `Skip when: no version manifest detected at all (release is tag-only with no version field anywhere) — skill prompts and exits clean. Auto-skips when diff is docs-only.` Outcome `O8 · O5` unchanged (now applies to ~95% of user-projects, not 5%).
- (d) `README.md` § Skills table `release-patch` Purpose column updated: removes `(plugin-internal)` marker; describes cascade. Outcome column unchanged.
- (e) v1.x `release-version` queued task DROPPED from any planned addition. release-patch covers the same scope.
- (f) Sprint file § Files Changed rows recorded for SKILL.md + new references file.
**Source:** existing SKILL.md (preserve plugin-mode logic verbatim under conditional gates); USER-OUTCOMES.md; README skills table.
**Depends on:** none.
**Note:** Plugin-mode behavior is UNCHANGED from v1.0.0. Sprint 030 lockstep contract preserved. Existing plugin self-release flow continues to work. General-mode paths are net-new (no prior behavior to regress). Eval-evidence gap (ADR-016 + ADR-021 DEC-4): general modes ship before acceptance harness Sprint 053 — accepted per ADR-027 § Consequences. Plugin mode covered by existing dogfood pattern (every dev-flow sprint close runs release-patch).

### T4 — ADR-027 record (3 micro-decisions) + Sprint 049 retro
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: ADR-027 ID non-colliding; 3 decisions captured; cross-links resolve)*
**Acceptance:**
- (a) NEW `docs/adr/ADR-027-plugin-coherence-cleanup.md` (≤120 lines). 3 decisions: (1) drop dev-flow-compress (caveman:compress canonical); (2) tag release-patch plugin-internal + queue release-version v1.x; (3) rename system-design-reviewer → architecture-grill. Context cites Sprint 048 retro Friction surface + ISSUE-03 lens. Alternatives + Consequences per ADR-019..026 template.
- (b) ADR ID verified non-colliding (Glob `docs/adr/ADR-02*.md` → max was 026 post-Sprint-048).
- (c) Cross-links: USER-OUTCOMES.md + Sprint 049 plan + Sprint 048 retro § Open Questions (where 6 findings surfaced).
- (d) Sprint file § Files Changed + § Decisions DEC-1/2/3 rows recorded.
**Source:** Sprint 049 OQ block (this file) + ADR-019..026 template.
**Depends on:** T1 + T2 + T3 (ADR cross-references all 3 changes).

### T5 — TODO.md sprint pointer + Roadmap update
**Scope:** small · **Layers:** governance · **Risk:** low · **HITL** *(reviewer verifies: sprint frontmatter flipped; Active Sprint cleared at close; Roadmap row added for Sprint 49-55)*
**Acceptance:**
- (a) Frontmatter `sprint: none` → `sprint: 049` at promote → `none` at close.
- (b) Active Sprint block: arrow points to TASK-120 (Sprint 049 work) with sub-tasks T1-T4.
- (c) `> Next:` updates to point at Sprint 050 (F3 init scaffold enrichment).
- (d) Roadmap block: REPLACE Sprints 49-51 rows. New shape:
  ```
  Sprint 49 → Plugin Coherence Cleanup + Rename (F1 dev-flow-compress drop · F2 release-patch plugin-internal · architecture-grill rename · ADR-027) (in_progress)
  Sprint 50 → F3 init scaffold full (settings.json + .gitignore + docs/ skeleton + codemap/adr dirs)
  Sprint 51 → F6 task-decomposer ↔ lean-doc-generator template unify
  Sprint 52 → F4 + F5 wire orphan skills + tech-debt rollover loop
  Sprint 53 → v1 prereq #1 — TASK-116-v2 Node port acceptance harness
  Sprint 54 → v1 prereq #2 — TASK-115-v2 Node port caveman 3-arm
  Sprint 55 → v1 SHIP
  ```
- (e) v1.x backlog row for `release-version` (per T3.d) lands here.
- (f) Sprint file § Files Changed row recorded.
**Source:** existing TODO.md + Sprint 048 close pattern.
**Depends on:** T1 + T2 + T3 + T4 (all cross-refs stable before TODO update).

---

## Dependency chain

```
T1 (drop dev-flow-compress)         independent
T2 (rename system-design-reviewer)  independent
T3 (release-patch tag)              independent
T4 (ADR-027)                        depends T1+T2+T3
T5 (TODO.md update)                 depends T1+T2+T3+T4
```

Recommended execution: **T1 → T2 → T3 → T4 → T5**. Then sprint close + invoke release-patch.

---

## Cross-task risks

- **Skill removal vs deprecation friction (T1).** Silent remove may surprise users of `/dev-flow-compress`. Mitigation: ADR-027 documents migration; CHANGELOG entry on next release-patch run notes deprecation; `caveman:compress` description already covers same use case (verified equivalence).
- **Rename trigger collision (T2).** New trigger `/architecture-grill` must NOT collide with existing skill triggers. Pre-check: Glob `skills/*/SKILL.md` for `name: architecture-grill` — confirm zero collision before rename.
- **Historical file drift (OQ-H).** ~25 files mention `system-design-reviewer` and ~30 mention `dev-flow-compress`; most are sprint files / ADRs / CHANGELOG / audits / blueprint — IMMUTABLE per Sprint Close Protocol. Reviewer rejects any edit to historical files; only live cross-refs (skills/diagnose, README, USER-OUTCOMES, SETUP) get updated.
- **Cap discipline (OQ-G).** CLAUDE.md File Structure block edit `17 → 16 SKILL.md` is in-line; no line count change. Verify post-edit.
- **release-patch behavior unchanged (T3).** Tagging is documentation only (counter-evidence + README marker). NO logic edits to skills/release-patch/SKILL.md beyond description prepending `(plugin-internal)`. Reviewer must verify zero behavior diff.
- **release-patch invocation at close (OQ-K).** Sprint 049 removes 1 skill + renames 1 skill = MINOR bump per semver rule. release-patch SKILL is for PATCH only (line 23: `Do not invoke for MINOR (new mode/agent/skill) or MAJOR (gate/contract change) bumps`). Manual MINOR bump required. Sequence: close commit → manual edit `.claude-plugin/plugin.json` + `marketplace.json` MINOR bump → CHANGELOG entry → push.
- **No skill behavior change to surviving skills.** `architecture-grill` content unchanged from `system-design-reviewer` (only name field + description copy adjusted). `release-patch` logic unchanged. ADR-016 + ADR-021 eval-evidence rule = N/A this sprint (rename + drop, no behavior change).

---

## Sprint DoD

- [x] T1 `dev-flow-compress` dir + SKILL deleted via `git rm`; SETUP.md / USER-OUTCOMES / README / CLAUDE.md File Structure cross-refs updated; skill count 17 → 16.
- [x] T2 `system-design-reviewer` renamed → `architecture-grill` via `git mv`; SKILL.md `name` + H1 + description + version (1.0.0 → 2.0.0); diagnose SKILL.md cross-ref + README skills row + USER-OUTCOMES row updated; output format heading also adjusted.
- [x] T3 (revised mid-sprint per user feedback) — `release-patch` GENERALIZED to 6-mode cascade (plugin / npm / python / cargo / go / flat); SKILL.md v1.0.0 → 2.0.0 (cap held 100/100); NEW `references/version-detection.md` (183 lines) owns per-mode bump logic; plugin-only steps (lockstep verify · MEMORY refresh · CONTEXT drift) gated `*(plugin mode only)*`; CHANGELOG path detection (plugin → docs/CHANGELOG.md; general → root detect with Keep-a-Changelog default); USER-OUTCOMES counter-evidence updated (`Skip when: no version manifest detected`); README marker `(plugin-internal)` removed; v1.x `release-version` queued task DROPPED.
- [x] T4 ADR-027 written (85 lines · cap 120) — 3 decisions: drop dev-flow-compress · GENERALIZE release-patch · rename architecture-grill. Alternative #3 records initial-then-revised tag-only approach.
- [x] T5 TODO.md frontmatter `sprint: 049`; Active Sprint → TASK-120 with sub-tasks T1-T5; P0 backlog rebalanced (TASK-120 added; TASK-121-123 + TASK-115/116-v2 + v1 ship rows updated for new 7-sprint roadmap; TASK-119 marked `[x]`); Roadmap rows replaced for Sprints 49-55.
- [x] Plan + close consolidated into single commit per Sprint 048 pattern; SHA backfill follow-up.
- [x] Open questions A-K resolved at promote (with OQ-F revised mid-execution per user generalization feedback; zero other re-litigation).
- [x] Date verification: all artifacts stamp 2026-05-08.
- [x] ADR-027 ID verified non-colliding (max ADR was 026 post-Sprint-048).
- [x] Cap discipline held: CLAUDE.md 79/80 · CONTEXT.md 121/130 · ADR-027 85/120 · release-patch SKILL.md 100/100 (at cap exact) · architecture-grill SKILL.md 91/100 · sprint file 213/300.
- [x] Historical files UNTOUCHED per OQ-H — ~25 files referencing system-design-reviewer + ~30 referencing dev-flow-compress in sprint plans / ADRs / CHANGELOG / audits / blueprints / research notes left as timeline records.
- [x] **Eval-evidence gap noted (NOT closed):** release-patch v2.0.0 ships before acceptance harness (Sprint 053). Plugin-mode path unchanged → existing dogfood validation holds. General-mode paths net-new → eval retroactive at Sprint 053. Per ADR-027 § Consequences.
- [x] release-patch MINOR bump deferred to manual reconcile post-commit — skill removal + skill rename + skill behavior change in release-patch all = MINOR per Quick Rules; release-patch SKILL handles PATCH only by design.
- [x] Zero unrelated edits — only sprint-intent files staged; pre-existing untracked files (AUDIT.md / BLUEPRINT etc) NOT touched.

---

## Execution Log

### 2026-05-08 | T1 done — single consolidated commit (SHA backfill)
`git rm -r skills/dev-flow-compress/` removed SKILL.md + references/procedure.md + dir. SETUP.md `/dev-flow-compress` → `/caveman:compress`. USER-OUTCOMES.md row dropped + Skills count `(17)` → `(16)`. README skills table row dropped + What You Get count `Skills | 17` → `Skills | 16`. CLAUDE.md File Structure `17 SKILL.md files` → `16 SKILL.md files`. Historical files UNTOUCHED.

### 2026-05-08 | T2 done — same commit
`git mv skills/system-design-reviewer skills/architecture-grill`. SKILL.md frontmatter `name` updated; H1 updated; description rewritten to lead with grill mode + explicit distinction from `design-analyst` agent; version 1.0.0 → 2.0.0; last-validated bumped. Output format heading `System Design Review` → `Architecture Grill`. diagnose SKILL.md cross-ref + README + USER-OUTCOMES updated.

### 2026-05-08 | T3 done — same commit (REVISED scope mid-sprint)
Initial T3 plan: tag release-patch plugin-internal + queue v1.x release-version. User pushed back: "can we make release patch is skills more general? so we can use for user also for optimal improvement flow this plugin?" Reversed to GENERALIZE.

Generalize landed: SKILL.md rewritten with 6-mode cascade detection (plugin / npm / python / cargo / go / flat). Steps 5 + 6 (MEMORY refresh · CONTEXT drift) gated `*(plugin mode only)*`. CHANGELOG path detection added. HARD STOP message includes `Mode:` line. Cap held 100/100 (at cap exact). NEW `references/version-detection.md` (183 lines) owns per-mode bump procedure with edge cases (pre-release suffixes · dynamic versions · multi-manifest priority · workspace inheritance). USER-OUTCOMES counter-evidence updated. README marker dropped. v1.x release-version queued task NOT added (release-patch covers).

### 2026-05-08 | T4 done — same commit
ADR-027 written (85 lines / cap 120). 3 decisions captured. Alternative #3 records the tag-only initial approach + reason for reversal mid-sprint. Eval-evidence gap noted in § Consequences (release-patch v2.0.0 ships before Sprint 053 acceptance harness; plugin-mode unchanged so existing dogfood holds; general-mode paths net-new).

### 2026-05-08 | T5 done — same commit
TODO.md frontmatter `sprint: 049`; Active Sprint → TASK-120 + sub-tasks; P0 backlog rebalanced for new 7-sprint roadmap (Sprint 50 = init scaffold / 51 = template unify / 52 = wiring + tech-debt / 53-54 = eval harness / 55 = v1 SHIP); Roadmap rows replaced for Sprints 49-55.

### 2026-05-08 | sprint close
This commit. 3 plugin-coherence findings closed structurally. release-patch is now general-purpose (6 modes); user-projects can use it. Plugin-mode lockstep contract preserved unchanged. Eval-evidence retroactive via Sprint 053. Sprint 050 next: F3 init scaffold full.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `skills/dev-flow-compress/SKILL.md` | T1 | DELETE | low | — |
| `skills/dev-flow-compress/references/procedure.md` | T1 | DELETE | low | — |
| `skills/dev-flow-compress/` | T1 | DELETE dir | low | — |
| `docs/SETUP.md` | T1 | Replace `/dev-flow-compress` → `/caveman:compress` | low | — |
| `docs/USER-OUTCOMES.md` | T1 + T2 + T3 | Drop dev-flow-compress row · rename system-design-reviewer → architecture-grill · sharpen release-patch skip-when · update Skills count 17→16 | low | — |
| `README.md` | T1 + T2 + T3 | Drop dev-flow-compress row · rename system-design-reviewer → architecture-grill · `(plugin-internal)` marker on release-patch · count 17→16 | low | — |
| `.claude/CLAUDE.md` | T1 | File Structure `17 SKILL.md` → `16 SKILL.md` | low | — |
| `skills/system-design-reviewer/` → `skills/architecture-grill/` | T2 | RENAME dir | low | — |
| `skills/architecture-grill/SKILL.md` | T2 | Frontmatter name + H1 + description adjusted | low | — |
| `skills/diagnose/SKILL.md` | T2 | Cross-ref `system-design-reviewer` → `architecture-grill` | low | — |
| `skills/release-patch/SKILL.md` | T3 | Generalized for 6-mode cascade; v1.0.0 → 2.0.0; plugin-only steps gated; cap held 100/100 | medium | acceptance harness Sprint 053 |
| `skills/release-patch/references/version-detection.md` | T3 | NEW (183 lines) — manifest cascade + per-mode bump procedure | medium | acceptance harness Sprint 053 |
| `docs/adr/ADR-027-plugin-coherence-cleanup.md` | T4 | NEW (≤120 lines) — 3 decisions | low | — |
| `TODO.md` | T5 | sprint pointer 049 · Active Sprint + Next · Roadmap rows · release-version v1.x backlog row | low | — |
| `docs/sprint/SPRINT-049-coherence-cleanup-rename.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | Drop `dev-flow-compress`; `caveman:compress` is canonical compression skill | Two skills covering one concern = O5 flow regression; caveman:compress (already imported) provides identical behavior | ADR-027 |
| DEC-2 | Generalize `release-patch` — auto-detect manifest cascade across 6 modes (plugin / npm / python / cargo / go / flat); drop v1.x `release-version` queued task | One skill covers all user-projects; lens (O8 + O5) now applies to ~95% not 5%; plugin lockstep behavior preserved as mode = plugin | ADR-027 |
| DEC-3 | Rename `system-design-reviewer` → `architecture-grill` | Two-tier confusion vs `design-analyst` agent; rename clarifies role (ad-hoc grill vs auto-G2 plan) | ADR-027 |

---

## Open Questions for Review

*(one mid-sprint reversal: T3 initial scope (tag-only + queue v1.x release-version) reversed to GENERALIZE after user feedback "can we make release patch is skills more general? so we can use for user also for optimal improvement flow this plugin?" — locked in OQ-F revised. ADR-027 alternative #3 records the reversal for traceability. Zero other OQs surfaced during execution; A-K all held except F.)*

---

## Retro

### Worked
- **Mid-sprint pivot recovery clean.** T3 reversal from tag-only → generalize required ~30 min re-edit cycle: 4 file edits to undo tag-only (USER-OUTCOMES + README + SKILL.md description + ADR-027 DEC-2). Pattern from Sprint 048 (canonical layer first, user-facing surfaces second) applied: USER-OUTCOMES.md + ADR-027 are canonical layer; rewrites cascaded cleanly to README + SKILL.md without contradictions.
- **References/ pattern paid off.** `skills/release-patch/references/version-detection.md` (183 lines) enabled SKILL.md cap discipline (100/100) while documenting 6-mode cascade + edge cases. Without references/, SKILL.md would've ballooned to ~250 lines or content would've been cut to fit cap. Pattern: when a skill grows past cap, content moves to references/, NOT cap raise.
- **Plugin-mode preservation discipline.** release-patch v2.0.0 introduces 5 net-new paths but plugin-mode behavior is unchanged from v1.0.0 verbatim (lockstep + MEMORY + CONTEXT drift). Existing dogfood (every dev-flow sprint close runs release-patch) continues to validate plugin-mode without regression risk. Reduces eval-evidence anxiety: only general-mode paths need acceptance harness coverage.
- **Sprint shape: cleanup + 1 substantive enhance.** T1+T2 (skill drop + rename) are surgical doc/governance. T3 (generalize) is substantive skill behavior change. Mixing surgical with substantive in one sprint kept within G1 size (M, ~5h) because substantive task had clear scope + reference offload.
- **Deferred-but-not-forgotten queueing.** v1.x `release-version` queued task was DROPPED entirely after T3 generalize landed (release-patch covers). Saves future cognitive load: backlog stays cleaner; one skill not two.

### Friction
- **Tag-only initial plan (DEC-2 v1) was wrong call.** Initial Sprint 049 plan tagged release-patch plugin-internal + queued v1.x release-version. User pushback surfaced: tag-only delays user-project utility for ~5+ sprints with no functional gain; queueing duplicates a skill we already have. Lens (ADR-026) should have caught this at promote — outcome rows for `release-patch` (O8 + O5) clearly applied to general projects, but tagging treated them as exclusively plugin-internal. Pattern: when a skill already covers ~95% of the desired user-project scope, generalize rather than tag-and-queue. Add to lens-application checklist.
- **Eval-evidence gap shipped.** release-patch v2.0.0 general-mode paths land Sprint 049 but acceptance harness lands Sprint 053 (4 sprints later). ADR-016 + ADR-021 DEC-4 say skill-behavior changes require eval evidence. Mitigation in ADR-027 § Consequences: plugin-mode unchanged (dogfood validation holds); general-mode net-new (no prior behavior to regress). Acceptable trade for shipping value sooner BUT reviewer should verify Sprint 053 retroactive eval covers release-patch v2.0.0 in addition to TASK-116 + TASK-115 lift candidates.
- **MINOR bump deferred to manual.** Sprint 049 changes total to MINOR (skill removal + rename + behavior change). release-patch SKILL handles PATCH only by design. So MINOR bump = manual edit `.claude-plugin/plugin.json` + `marketplace.json` + CHANGELOG block. Annoying but consistent with skill scope. Future tooling sprint may add a `release-minor` companion or extend release-patch with `--minor` flag.

### Pattern candidates (carried forward)
1. **Generalize over tag-and-queue.** When a plugin-internal-only skill clearly maps to user-project scope (per ADR-026 lens), GENERALIZE rather than honest-scope-tag + v1.x defer. Preserves user-project velocity; avoids duplicate-skill backlog.
2. **References/ as cap-relief mechanism.** SKILL.md ≤100 cap discipline holds even for substantive logic by moving implementation detail (per-mode bump procedure, edge-case handling, format detection) to `references/<topic>.md`. SKILL.md = high-level flow + delegation pointer; references/ = implementation depth.
3. **Mid-sprint pivot via canonical-first edit.** When user feedback reverses a planned decision mid-sprint, edit canonical layer (USER-OUTCOMES + ADR) first; user-facing surfaces (README + SKILL.md) cascade from canonical without contradictions. Recovery cost ~30 min for ~3-decision pivot.
4. **Plugin-mode preservation as zero-risk wrapper.** When generalizing a plugin-internal skill, gate plugin-only steps with `*(mode = plugin)*` conditionals. Existing plugin-self use continues unchanged; only net-new general paths add behavior risk. Eval-evidence burden falls only on net-new paths.
5. **Skill semver vs plugin semver coupling.** Skill internal version (e.g., release-patch 1.0.0 → 2.0.0) is independent of plugin version (e.g., v2.5.0 → v2.6.0 MINOR for skill removal/rename/behavior change). Track both; do not conflate. Pattern carried from architecture-grill rename also bumping skill internal 1.0.0 → 2.0.0.

### Surprise log
- T1 → T2 → T3 ordering caught a near-miss: T2 rename pushed `system-design-reviewer` → `architecture-grill` via `git mv`. Then `git rm` for dev-flow-compress (T1 actually executed first per timeline). Sequencing was T1 then T2 — both worked clean. If T2 had run first, `git mv` of system-design-reviewer might have churned with later T1 git rm in commit ordering. Sprint 048 pattern (T1 first to settle skill count before subsequent edits) held.
- T3 initial-plan-then-pivot revealed that lens (ADR-026) is a CHECK at promote, not just a writeup target. Tag-only fit lens framing on paper (counter-evidence "skip when not plugin" = honest scope) but failed lens application — outcome rows O8+O5 already claimed broader scope. Lens application = "does skill ALREADY cover X scope, just framed wrong?" precedes "can we narrow framing?"
- references/version-detection.md grew to 183 lines covering 6 modes + edge cases. Initial estimate was ~100 lines. Edge cases (pre-release suffixes, PEP 621 vs Poetry, Cargo workspace inheritance, Go tag-based, multi-manifest priority) consumed ~50% of the file. Pattern: per-language version-bump logic has a long edge-case tail; documenting them upfront is cheaper than fixing them post-deploy when user-projects hit them.
- close: zero CLAUDE.md or CONTEXT.md cap pressure this sprint despite T3 substantive scope. Cap discipline holding because content is moving to references/ when needed (per pattern candidate #2). Sustainable.
