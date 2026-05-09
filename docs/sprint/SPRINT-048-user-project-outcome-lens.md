---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Sprint state change
status: closed
plan_commit: TBD (backfill — single consolidated commit per Sprint 047 close_commit pattern)
close_commit: TBD (backfill)
---

# Sprint 048 — User-Project Outcome Lens (ISSUE-03 reframe + v1 ship prep reorder)

**Theme:** Resolve ISSUE-03 (plugin self-optimizes; doesn't measure user-project outcome). Land outcome-first lens across docs/governance — USER-OUTCOMES.md registry, ADR-026 decision lock, README outcome-first reframe, G1 outcome checklist item, anti-pattern lock. Reorder v1 ship prep: lens FIRST (this sprint), Node-port eval harness next (TASK-116-v2 / TASK-115-v2), v1 ship last. Pure docs/governance — zero skill/agent/hook behavior change.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 047 closed `c463458` (EPIC-Audit Phase 6 close).
**Successor:** Sprint 049 — TASK-116-v2 Node port acceptance harness (reframed as plugin reliability outcome).

---

## Why this sprint exists

**ISSUE-03 (critical, strategic).** User flagged: plugin breakdown work focuses on optimizing plugin internals; actual goal is making user's project optimal when using plugin. Plugin = means; user-project quality = end. Acceptance criteria: each plugin feature has stated user-project outcome; internal optimizations deprioritized below user-project outcomes.

**Symptoms in current state (audit):**

- README.md `## What You Get` table sells **counts** (17 skills · 7 agents · 2 gates) not **user-project benefit**.
- README.md `## Skills` table column = "Trigger / Purpose" — describes what skill *does*, not what user-project *gets*.
- TODO.md `Backlog § P0 v1 ship prep` = TASK-115 (caveman 3-arm eval) + TASK-116 (skill-triggering acceptance harness). Both internal correctness measurement, no stated user-project outcome.
- `.claude/CLAUDE.md` § Definition of Done = G2 verified · 0 blocking · CONTEXT.md updated · ADR for hard-to-reverse · line caps. Zero user-project outcome check.
- `.claude/CONTEXT.md` § Gates G1 = goal stated · size · constraints · skill red flags. No user-project outcome check.
- Plugin live on team; dogfooded on dev-flow itself = confirmation bias risk. Outcome lens never declared so never measured.
- Backlog `> Next: v1 ship prep — TASK-115 + TASK-116` order had eval harness blocking v1; lens work not even queued.

**Scope boundary — what Sprint 048 IS NOT:** not new skill/agent/hook code; not eval harness implementation (deferred to Sprint 049 + 050); not telemetry instrumentation (impossible — plugin can't see user repos). Surgical: docs + governance + backlog re-rank + ADR + outcome registry.

**Per OQ-J: Date stamping = 2026-05-08** (per `currentDate` system memo + Step 0b date-sanity discipline).

---

## Open Questions (locked at promote — pre-resolved via session AskUserQuestion + analysis)

- (A) **Scope of fix.** Options: (1) README + USER-OUTCOMES only / (2) + G1 gate + anti-pattern lock / (3) full re-frame incl. backlog rebalance. **Decision: option 3 — full re-frame incl. backlog rebalance.** Closes ISSUE-03 fully; partial fix risks regression to internal-first framing.
- (B) **Outcome categories** (multi-select). Locked: **8 outcomes** — (1) faster onboarding · (2) less doc rot · (3) clearer architecture · (4) fewer rework cycles · (5) optimal harness flow · (6) workflow correction · (7) template/init audit · (8) plugin reliability. Items 1-4 from question options; items 5-7 user-supplied additions; item 8 surfaced during session ("eval harness as plugin reliability" reframe vs prior `[internal]` tag).
- (C) **Evidence rigor.** Options: claimed only / claimed + counter-evidence / claimed + measurable proxy. **Decision: claimed + counter-evidence (skip-when).** Each component states outcome AND when it would NOT help. Honest scope; lowest BS risk; no telemetry burden plugin can't satisfy.
- (D) **External test before v1.** **Decision: skip — plugin already live on team.** Item already shipped; team usage = real user-project signal. Future v1.x may add structured user feedback channel (out of scope here).
- (E) **Sprint container.** **Decision: Sprint 048 active sprint** (vs standalone TASK-119 or plan-only draft). Matches existing cadence; release-patch hooks expect sprint discipline; close per Sprint Close Protocol.
- (F) **Eval harness reframe (TASK-115/116).** **Decision: keep both as v1 prereq; switch PS1 → Node `scripts/eval-acceptance.js` + `scripts/eval-caveman.js`; reframe outcome = plugin reliability** (per session #1: settings.json was last cycle's blocker, harness flow continues; "no PS1 — use optimal script format"). Node ≥18 matches `audit-baseline.js` + `eval-skills.js` precedent. PS1 stays only for hooks (ADR-016 boundary preserved).
- (G) **ADR-026 needed.** **Decision: WRITE.** Strategic lens shift is hard-to-reverse; CLAUDE.md anti-pattern + CONTEXT.md G1 change derive from this decision. Future contributors read ADR-026 to understand why outcome-first framing.
- (H) **CLAUDE.md cap discipline.** Currently 80/80 (at cap). Adding 1-line anti-pattern needs 1 line freed. **Decision: trim § Naming Conventions header+bullet** (currently 2 lines, only `kebab-case`) — fold into Anti-Patterns header note. Cap held at ≤80.
- (I) **CONTEXT.md cap discipline.** Currently 130/130 (at cap per existing P2 backlog "CONTEXT.md cap pressure"). Adding G1 item + vocab entry + 5th principle = 3 lines. **Decision: move § Behavioral Guidelines Lineage (~14 lines) → `.claude/references/behavioral-guidelines-lineage.md`; leave 1-line pointer.** Frees ~13 lines net. Closes P2 "CONTEXT.md cap pressure" backlog item structurally. ADR-019 verify-step contract preserved (content unchanged, location moved; SHA pin still valid).
- (J) **Date stamp.** System memo `currentDate=2026-05-08`. All artifacts MUST stamp **2026-05-08**. Step 0b TASK-118 date-sanity discipline holds.
- (K) **README order.** **Decision: insert "User-Project Outcomes" section ABOVE "What You Get" component table** (component table preserved as contributor reference; outcomes lead). Per session #3 "ok with recommend".

---

## Plan

### T1 — `docs/USER-OUTCOMES.md` (NEW, ≤200 lines) — outcome registry
**Scope:** medium · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies 8 outcomes covered; every skill + agent + gate + hook + script mapped to ≥1 outcome; counter-evidence non-trivial; no outcome left empty)*
**Acceptance:**
- (a) Frontmatter: `owner`, `last_updated: 2026-05-08`, `update_trigger: outcome registry change / new component added`, `status: current`.
- (b) § How to read this file — 1 paragraph: registry maps every plugin component to user-project outcome(s) + counter-evidence (skip-when). New components MUST add row before merge per ADR-026.
- (c) § Outcomes overview — 8-outcome table: id (O1-O8) · name · 1-line definition · primary lens (e.g., O1 onboarding = days from clone to first PR).
- (d) § Component → outcome mapping — one section per component category (skills · agents · gates · hooks · scripts). Per row: component · outcome(s) supported · how it supports · skip-when (counter-evidence).
- (e) § Anti-outcomes — short section: outcomes plugin does NOT claim (e.g., "automated test coverage", "CI/CD pipeline", "code generation for app logic"). Honest scope.
- (f) Cross-link to ADR-026 + README "User-Project Outcomes" section.
- (g) Sprint file § Files Changed row recorded.
**Source:** README skill table · CONTEXT.md agent roster · gate checklists · hooks/hooks.json · scripts/ directory.
**Depends on:** none.

### T2 — `docs/adr/ADR-026-user-project-outcome-lens.md` (NEW, ≤200 lines) — decision record
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies ADR ID = 026 non-colliding; verifies 5 decisions captured; verifies cross-links to ISSUE-03 origin + USER-OUTCOMES.md)*
**Acceptance:**
- (a) Frontmatter: `owner`, `last_updated: 2026-05-08`, `update_trigger: ADR status change`, `status: decided`, `sprint: 048`.
- (b) Title: `ADR-026: User-Project Outcome Lens — outcome-first framing for plugin development`.
- (c) Context: ISSUE-03 origin (user feedback 2026-05-08 session); audit symptoms (README sells counts, backlog frames eval as internal, no outcome registry); plugin already live on team (dogfood-only confirmation bias risk).
- (d) Decision (5 numbered): (1) outcome-first lens adopted; every component states ≥1 user-project outcome + skip-when. (2) 8 outcome categories canonical (O1-O8 list). (3) USER-OUTCOMES.md is the registry; new component PRs gate-blocked without registry row. (4) G1 checklist gains "user-project outcome named" item. (5) Eval harness work (TASK-115/116) reframed under O8 plugin reliability; Node ports replace PS1 plan; no `[internal]` tag.
- (e) Alternatives considered: (1) leave as-is — rejected, ISSUE-03 unresolved; (2) external telemetry — rejected, plugin can't see user repos; (3) outcome claimed only without skip-when — rejected, BS risk; (4) defer to v1.1 — rejected, framing must precede implementation.
- (f) Consequences: positive (every future PR forces outcome statement; release notes lead with outcomes; v1 marketing matches reality); negative trade-offs (registry maintenance overhead; outcome categories may need revision at scale ≥30 skills); neutral (plugin behavior unchanged this sprint; lens applies retroactively to existing components).
- (g) References: ISSUE-03 (user session 2026-05-08); USER-OUTCOMES.md; CLAUDE.md anti-pattern; CONTEXT.md G1 + vocab.
- (h) Sprint file § Decisions DEC-1 row + § Files Changed row recorded.
**Source:** session OQ block (this file) · ADR-019..025 format reference.
**Depends on:** T1 (ADR cross-links USER-OUTCOMES.md by path).

### T3 — `README.md` reframe — outcome-first
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies new section above What You Get; verifies component table preserved verbatim; verifies skill table gains outcome column OR skill descriptions append outcome; no unrelated edits)*
**Acceptance:**
- (a) NEW section `## What Your Project Gets` inserted between current `## What You Get` table and tagline. Lists 8 outcomes as table: id · outcome · how dev-flow delivers (1 line each) · counter-evidence link to USER-OUTCOMES.md.
- (b) Existing `## What You Get` table renamed to `## Plugin Components` (or kept as-is); preserved verbatim as contributor reference.
- (c) Existing `## Skills` table gains outcome-id column (O1-O8) per skill; or trailing 1-line outcome statement appended per row.
- (d) Existing `## Agents` table gains outcome-id column similarly.
- (e) Cross-link to USER-OUTCOMES.md added in `## Further Reading`.
- (f) Frontmatter `last_updated: 2026-05-08` bumped; `update_trigger` extended to "outcome lens revision".
- (g) Other sections (How to Adopt · First Sprint Walkthrough · Hooks and Scripts · Working on This Repo · License) UNTOUCHED.
- (h) Sprint file § Files Changed row recorded.
**Source:** existing README content (preserve verbatim except per a-f); USER-OUTCOMES.md (T1); ADR-026 (T2).
**Depends on:** T1 + T2 (cross-links resolve).

### T4 — `.claude/CLAUDE.md` — anti-pattern + cap fit
**Scope:** small · **Layers:** governance · **Risk:** medium · **HITL** *(reviewer verifies cap held at ≤80; verifies anti-pattern bullet text; verifies Naming Conventions trim doesn't lose kebab-case info — fold to anti-pattern note or keep elsewhere)*
**Acceptance:**
- (a) Add 1-line anti-pattern in `## Anti-Patterns`: `❌ Plugin-internal optimization without stated user-project outcome (see USER-OUTCOMES.md + ADR-026)`.
- (b) Trim § Naming Conventions header+bullet (2 lines); fold `kebab-case` reminder into Anti-Patterns block as `❌ Non-kebab-case file names` (preserves info, saves 1 line net).
- (c) Optional: add 1-line pointer to User-Project Lens in Behavioral Guidelines section header note (e.g., "5th principle (User-Project Lens) lives in CONTEXT.md § Agentic Engineering Principles to avoid duplication").
- (d) Frontmatter `last_updated: 2026-05-08` bumped.
- (e) Verify final line count ≤80. If exceeds → STOP, re-trim, do NOT raise cap.
- (f) Sprint file § Files Changed row recorded.
**Source:** current CLAUDE.md (preserve verbatim except per a-c).
**Depends on:** T1 + T2 (anti-pattern references USER-OUTCOMES.md + ADR-026 by name).

### T5 — `.claude/CONTEXT.md` — User-Project Lens principle + G1 item + vocab; relocate Lineage section
**Scope:** medium · **Layers:** governance · **Risk:** medium · **HITL** *(reviewer verifies cap held at ≤130; verifies relocated Lineage content unchanged at new path; verifies G1 + vocab + principle additions; verifies ADR-019 verify-step contract preserved)*
**Acceptance:**
- (a) Move § Behavioral Guidelines Lineage (~14 lines) verbatim to NEW file `.claude/references/behavioral-guidelines-lineage.md`. Frontmatter copied + adapted (status: current; update_trigger: upstream karpathy CLAUDE.md substantive change).
- (b) Replace removed section in CONTEXT.md with 2-line pointer: `## Behavioral Guidelines Lineage` header + `Lineage + adaptation notes moved to [.claude/references/behavioral-guidelines-lineage.md](references/behavioral-guidelines-lineage.md). Re-diff cadence + SHA pin contract unchanged (ADR-019).`
- (c) Add 5th principle to § Agentic Engineering Principles: `- **User-Project Lens** — every component states a user-project outcome (faster onboarding · less doc rot · clearer architecture · fewer rework · optimal harness flow · workflow correction · template audit · plugin reliability). Registry: docs/USER-OUTCOMES.md. Anchor: ADR-026.`
- (d) Add G1 checklist item: `- [ ] User-project outcome named (≥1 of O1-O8 per docs/USER-OUTCOMES.md)`.
- (e) Add vocab entry: `| **user-project outcome** | Measurable benefit dev-flow delivers to a project that adopts it (8 canonical: O1 onboarding · O2 doc rot · O3 architecture · O4 rework · O5 harness flow · O6 workflow correction · O7 template/init · O8 plugin reliability). |`
- (f) Frontmatter `last_updated: 2026-05-08` bumped; `update_trigger` extended.
- (g) Verify final line count ≤130. If exceeds → STOP, trim further, do NOT raise cap.
- (h) Sprint file § Files Changed row recorded.
**Source:** current CONTEXT.md (preserve verbatim except per a-e); USER-OUTCOMES.md outcome list (T1); ADR-026 (T2).
**Depends on:** T1 + T2.

### T6 — `TODO.md` — backlog rebalance + sprint pointer
**Scope:** medium · **Layers:** governance · **Risk:** medium · **HITL** *(reviewer verifies sprint frontmatter flipped to 048; verifies TASK-119 promoted to P0; verifies TASK-115/116 reframed under O8 with Node port note; verifies roadmap row added; verifies P2 CONTEXT.md cap pressure item closed; no unrelated edits)*
**Acceptance:**
- (a) Frontmatter `sprint: none` → `sprint: 048`; `last_updated: 2026-05-08`.
- (b) Active Sprint block: arrow points to TASK-119 (this sprint's primary deliverable bundle) with sub-task list T1-T6.
- (c) Backlog § P0 — TASK-119 added (this sprint's outcome-lens work; status [x] at close). TASK-116 + TASK-115 reframed: row text gains "Outcome: O8 plugin reliability (plugin updates don't regress user-project workflows). Node port (`scripts/eval-acceptance.js` + `scripts/eval-caveman.js`); PS1 plan retired per ADR-026 + Sprint 048 OQ-F."
- (d) Backlog § P2 — CONTEXT.md cap pressure item marked [x] closed Sprint 048 (Behavioral Guidelines Lineage moved to references/ per T5). 1-line attribution.
- (e) Roadmap block updated: add `Sprint 48 → User-Project Outcome Lens (ISSUE-03 reframe + ADR-026 + USER-OUTCOMES.md + G1 outcome item; v1 ship prep reorder) (in_progress)` row after Sprint 47.
- (f) Update successor sprint pointers: Sprint 49 = TASK-116-v2 Node port acceptance harness; Sprint 50 = TASK-115-v2 Node port caveman 3-arm eval; Sprint 51 = v1 SHIP.
- (g) Sprint file § Files Changed row recorded.
**Source:** current TODO.md (preserve verbatim except per a-f); ADR-026 + USER-OUTCOMES.md cross-links.
**Depends on:** T1 + T2 + T5 (cross-links resolve).

---

## Dependency chain

```
T1 (USER-OUTCOMES.md, independent)
T2 (ADR-026, depends on T1 — cross-links)
T3 (README, depends on T1 + T2)
T4 (CLAUDE.md, depends on T1 + T2)
T5 (CONTEXT.md + lineage relocate, depends on T1 + T2)
T6 (TODO.md, depends on T1 + T2 + T5)
```

Recommended sequential execution: **T1 → T2 → T3 → T4 → T5 → T6**. T1 establishes outcome registry (anchor); T2 locks decision; T3-T6 surface lens across docs.

---

## Cross-task risks

- **Line-cap discipline (OQ-H + OQ-I).** CLAUDE.md ≤80 (currently at cap; trim Naming Conventions to fit anti-pattern). CONTEXT.md ≤130 (currently at cap; relocate Lineage section to free ~13 lines). If either cap exceeded → STOP, re-trim, do NOT raise cap (CLAUDE.md anti-pattern: `❌ Cap raise without TASK-NNN audit`).
- **ADR-019 verify-step contract preservation (T5).** Behavioral Guidelines Lineage relocate moves CONTENT not changes it. SHA pin (`2c606141936f`) + verified-at date (2026-05-04) preserved verbatim at new path. Frontmatter status + update_trigger preserved. Reviewer must verify diff = pure move, zero content change.
- **Outcome registry coverage (T1).** Every skill (17), agent (7), gate (2), hook (3), script (4) MUST get ≥1 outcome row. Reviewer spot-checks 3 random components — if any missing, T1 fails.
- **Counter-evidence non-trivial (T1).** "Skip when" rows must NOT be tautologies (e.g., "skip when not needed"). Each must name concrete scenario (other skill better fit, scope mismatch, scale below threshold). Reviewer rejects tautological skip-whens.
- **Backlog rebalance scope drift (T6).** ONLY edits per OQ-A scope: TASK-119 add · TASK-115/116 reframe · P2 CONTEXT cap item close · sprint frontmatter · Roadmap row. Other Backlog blocks UNTOUCHED. P3 closed sub-blocks UNTOUCHED. `git diff` review.
- **No skill behavior change.** All 6 tasks are docs/governance only. Zero skill-behavior changes = zero eval-evidence requirement (ADR-016 N/A; ADR-021 DEC-4 N/A). Fast-path skill-eval checks; only doc-quality checks apply.
- **release-patch skip discipline.** Sprint 048 = pure docs/governance. Do NOT invoke release-patch. Manual close commit per Sprint Close Protocol step 8. Same skip-bump pattern as Sprint 047.
- **ADR ID collision check (T2).** ADR-026 = next available (max ADR currently 025). Verify before allocation: `Glob docs/adr/ADR-*.md` → confirm 025 max, 026 free.

---

## Sprint DoD

- [x] T1 USER-OUTCOMES.md written — 8 outcomes (with `onboard`/`doc-rot`/etc word aliases) · all 17 skills + 7 agents + 2 gates + 3 hooks + 4 scripts mapped · counter-evidence non-trivial · 120 lines (cap 200).
- [x] T2 ADR-026 written — 5 decisions · ISSUE-03 origin captured · 103 lines (cap 200).
- [x] T3 README.md reframed — § What Your Project Gets inserted above § What You Get (component table preserved); skill+agent tables gain `Outcomes` word column; § Further Reading links USER-OUTCOMES.md.
- [x] T4 CLAUDE.md anti-pattern added (`❌ Plugin-internal optimization without stated user-project outcome`); Naming Conventions condensed to inline header (`## Naming Conventions — files: kebab-case`); Codemap (L0) header inlined to 1 line; cap held 79/80.
- [x] T5 CONTEXT.md gains 5th principle (User-Project Lens) + G1 item (`User-project outcome named`) + vocab row (`user-project outcome`); Behavioral Guidelines Lineage relocated to `.claude/references/behavioral-guidelines-lineage.md` with provenance note; cap held 121/130.
- [x] T6 TODO.md frontmatter `sprint: 048` + `last_updated: 2026-05-08` (lean trigger `Sprint or task state change`); Active Sprint → TASK-119 with T1-T6 sub-tasks; P0 backlog reframed (TASK-119 added · TASK-115/116 → -v2 Node ports under O8 · v1 ship pushed Sprint 050 → 051); P2 CONTEXT cap item closed `[x]`; Roadmap rows updated for Sprints 48-51.
- [x] Plan + close consolidated into single commit per session decision (solo-dev shape; SHA backfill pattern matches Sprint 047 ce967d2).
- [x] Open questions A-K resolved at promote (all locked via session AskUserQuestion + analysis; zero re-litigation during execution).
- [x] Date verification: all artifacts stamped 2026-05-08 (Step 0b TASK-118 date-sanity held; system memo `currentDate=2026-05-08`).
- [x] ADR-026 ID verified non-colliding (Glob `docs/adr/ADR-02*.md` → max was 025).
- [x] Cross-link integrity verified: ADR-026 ↔ USER-OUTCOMES.md ↔ README § What Your Project Gets ↔ CLAUDE.md anti-pattern ↔ CONTEXT.md User-Project Lens principle.
- [x] Cap discipline held: CLAUDE.md 79/80 · CONTEXT.md 121/130 · ADR-026 103/200 · USER-OUTCOMES.md 120/200 · this sprint file 260+/300.
- [x] release-patch skipped (docs-only diff; same skip pattern as Sprint 047).
- [x] Zero unrelated edits — only sprint-intent files staged; pre-existing untracked files (AUDIT.md, BLUEPRINT etc) NOT touched.

---

## Execution Log

### 2026-05-08 | T1 done — single consolidated commit (SHA backfill)
USER-OUTCOMES.md created (120 lines). 8-outcome registry with word aliases (onboard / doc-rot / architecture / rework / flow / correction / template / reliability) for README readability — IDs O1-O8 preserved as canonical for ADR cross-ref. Every skill (17), agent (7), gate (2), hook (3), script (4) mapped with non-tautological skip-when. Anti-outcomes section declares honest scope (no app-code generation, no CI/CD, no telemetry).

### 2026-05-08 | T2 done — same commit
ADR-026 written (103 lines). 5 decisions: lens adoption · 8-outcome canonical set · USER-OUTCOMES.md as registry · G1 outcome item · TASK-115/116 reframed under O8 with Node port. Alternatives section rejects: leave-as-is, external telemetry (privacy + tech infeasibility), claim-only-without-counter-evidence, defer-to-v1.1. ADR-019 verify-step contract preserved (lineage relocate is pure file move).

### 2026-05-08 | T3 done — same commit
README.md reframed. New § What Your Project Gets section (8-outcome table with words + definitions + how-delivered) inserted between tagline and § What You Get. Skill table gains Outcomes column with words (`onboard · flow · rework`); agent table same. § Further Reading links USER-OUTCOMES.md. Mid-session iteration: initial draft used O1-O8 IDs in tables — flipped to short words after user feedback for readability without lookup; aliases canonicalized in USER-OUTCOMES.md for cross-ref.

### 2026-05-08 | T4 done — same commit
CLAUDE.md anti-pattern added. Cap discipline path: dropped Naming Conventions section (4 lines) → fit `❌ Non-kebab-case file names` in anti-patterns → user flagged section regression → restored as inline `## Naming Conventions — files: kebab-case` (1 line) + trimmed Codemap (L0) section header inline (saved 1 line). Final 79/80 cap held; both surfaces preserved.

### 2026-05-08 | T5 done — same commit
CONTEXT.md gains 5th principle (User-Project Lens) + G1 outcome item + `user-project outcome` vocab row. Behavioral Guidelines Lineage relocated verbatim to `.claude/references/behavioral-guidelines-lineage.md` (new dir; 25 lines + provenance note). CONTEXT.md cap 121/130; closes existing P2 backlog "CONTEXT.md cap pressure" structurally. ADR-019 SHA pin (`2c606141936f` verified 2026-05-04) unchanged.

### 2026-05-08 | T6 done — same commit
TODO.md sprint pointer flipped (none → 048); Active Sprint rewrites to TASK-119 with T1-T6 sub-tasks; P0 backlog re-ranked (TASK-119 added; TASK-115/116 reframed as `-v2` Node ports under O8 plugin reliability; v1 ship pushed Sprint 050 → 051); P2 CONTEXT.md cap pressure item flipped `[x]`; Roadmap rows updated for Sprints 48-51.

### 2026-05-08 | sprint close
This commit. ISSUE-03 closed structurally. v1 ship prep reordered: lens-first (Sprint 048 done) → Node-port acceptance harness (Sprint 049) → Node-port caveman 3-arm (Sprint 050) → v1 SHIP (Sprint 051). All future PRs gate-blocked at G1 without user-project outcome statement per ADR-026 DEC-4.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/USER-OUTCOMES.md` | T1 | NEW — 8-outcome registry · component → outcome map · counter-evidence | low | — |
| `docs/adr/ADR-026-user-project-outcome-lens.md` | T2 | NEW — 5-decision lens-shift ADR | low | — |
| `README.md` | T3 | + § What Your Project Gets · skill+agent tables gain outcome column | low | — |
| `.claude/CLAUDE.md` | T4 | + 1 anti-pattern · Naming Conventions trimmed | low | — |
| `.claude/CONTEXT.md` | T5 | + 5th principle · G1 item · vocab · § Lineage relocated to references/ | low | — |
| `.claude/references/behavioral-guidelines-lineage.md` | T5 | NEW — relocated lineage content (verbatim move) | low | — |
| `TODO.md` | T6 | sprint pointer flipped · TASK-119 P0 · TASK-115/116 reframed · P2 cap item closed · Roadmap row | low | — |
| `docs/sprint/SPRINT-048-user-project-outcome-lens.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | User-Project Outcome Lens adopted as canonical framing across plugin | ISSUE-03 critical: plugin self-optimization without stated user-project benefit; outcome-first framing forces every change to justify user-project value | ADR-026 |
| DEC-2 | 8 outcome categories canonical (O1-O8) | Covers user-named (faster onboarding, doc rot, architecture, rework) + extended (harness flow, workflow correction, template/init) + reframed-internal (plugin reliability) | ADR-026 |
| DEC-3 | Eval harness (TASK-115/116) reframed as O8 plugin reliability, Node ports replace PS1 plan | Last cycle's PS1 errors root-caused to settings.json misconfig (session #1); Node matches existing scripts/audit-baseline.js + eval-skills.js precedent; PS1 retained only for hooks per ADR-016 boundary | ADR-026 |
| DEC-4 | Behavioral Guidelines Lineage relocated to .claude/references/ | CONTEXT.md at 130/130 cap; Sprint 045 retro flagged this; new content (5th principle + G1 item + vocab) needed space; ADR-019 contract preserved (content unchanged, location moved) | (no ADR — Sprint 045 retro pattern lift) |

---

## Open Questions for Review

*(none surfaced during execution — all 11 promote-time OQs (A-K) resolved cleanly; one mid-session iteration on outcome column format (O1-O8 IDs vs words) decided in favor of words after user readability concern, with IDs preserved as canonical in USER-OUTCOMES.md for ADR cross-ref. Zero re-litigation; zero scope drift. Cross-doc verification at close found zero contradictions.)*

---

## Retro

### Worked
- **ISSUE-03 closed structurally, not patched.** Outcome registry + ADR + G1 gate item + anti-pattern + 5th principle + README reframe land together as a coherent lens, not a single fix. Future contributors hit the lens at every surface (G1 / CLAUDE.md / CONTEXT.md / README / per-component skip-when).
- **Word aliases for outcomes (mid-session pivot).** Initial draft used O1-O8 IDs throughout README. User flagged opacity ("what number in purpose? is it help for best helping user result workflow?"). Pivoted to words (`onboard·flow·rework`) in user-facing surface; kept O1-O8 in registry layer (USER-OUTCOMES.md + ADR-026) for canonical cross-ref. Best-of-both: skimmable for cold read, precise for ADR.
- **CONTEXT.md cap pressure closed structurally.** P2 backlog item (Sprint 045 retro friction) hung as `[ ]` for 3 sprints. Sprint 048 T5 relocate of Behavioral Guidelines Lineage to `.claude/references/` closed it as a side effect of needing 13-line headroom. Pattern: cap pressure backlog items often close opportunistically inside other sprints when content needs space.
- **Single consolidated commit pattern (solo-dev).** Plan + T1-T6 + close in one commit per user decision, matching Sprint 047 backfill pattern (ce967d2). DoD relaxes "plan-lock before T1-Tn" for solo author; cleaner history; backfill SHA via second small commit per Sprint 047 protocol.
- **Counter-evidence (skip-when) discipline held.** Every skill / agent / gate / hook / script row in USER-OUTCOMES.md ships with a concrete skip-when scenario. Reviewer-rejection threshold ("skip when not needed" = tautology, fail) preserved. Honest scope.
- **Pre-resolve OQs at promote held a SEVENTH sprint** (Sprints 042-048 inclusive). Pattern fully load-bearing across both EPIC-Audit deep-dives AND post-EPIC strategic work. Carrying forward as canonical practice.

### Friction
- **CLAUDE.md cap path required two iterations.** First trim removed Naming Conventions section to fit anti-pattern. User flagged section loss. Restored via inline header style + Codemap trim. Cost: 1 user-clarify round, 2 file edits. Pattern: cap-pressure surgery on user-facing files needs explicit "what's the trim trade-off?" surfaced at promote, not during execution. Add to Sprint 049+ plan-template.
- **Outcome alias surfacing (initial-draft-then-pivot).** README first-draft used O1-O8 IDs everywhere — internally consistent but opaque cold-read. User caught at table-2-of-3 stage. Pivot was mechanical (3 tables + USER-OUTCOMES.md row sync) but consumed 1 round-trip. Pattern: when introducing a NEW vocabulary (O1-O8) on user-facing surface, run a "would a first-time reader understand this?" check at promote, not at execution.
- **No external user-project test.** Plugin already live on team; OQ-D answered "skip — already shipped." Risk: outcome claims (8 categories) reflect dev-flow's mental model, not necessarily what arbitrary user-projects need. Mitigation deferred to v1.x via structured user feedback channel (out of scope here; flagged for future TASK).
- **TASK-115/116 reframe is naming-only.** Switched outcome framing (internal → O8) and runtime (PS1 → Node) but actual harness implementation still queued for Sprints 049-050. Reframe clarifies WHY but doesn't ship the harness. Risk: lens declared without proof until Sprint 050 ships eval-evidence for first skill change post-v1.

### Pattern candidates (carried forward)
1. **Strategic-issue-as-sprint shape.** ISSUE-03 was a single user-flagged strategic issue → 1 sprint, 6 tasks, 4 doc surfaces touched, 0 skill behavior change. Codify as variant of "decision-only sprint shape" (ADR-025 P1). Single critical issue → full-cross-doc reframe sprint = valid sprint shape.
2. **Word-alias for ID-based registries.** When introducing IDs (O1-O8), ship word aliases for user-facing surfaces while keeping IDs canonical in registry/ADR. Apply to any future ID-based vocabulary introduction.
3. **Cap-relief opportunism.** Cap-pressure backlog items often close as side-effects inside other sprints when content needs the headroom. Pattern: when planning a sprint that adds content to a near-cap file, check P2 cap-pressure backlog first — closure may come free.
4. **Counter-evidence discipline at PR review.** Reject tautological skip-whens at PR review. Codify in `pr-reviewer` skill 7-lens checklist as new lens or sub-check (queued as Sprint 049+ candidate; not P0).
5. **Mid-session pivot tolerance.** Outcome alias pivot (IDs → words) was caught mid-T3 by user. Recovery clean because USER-OUTCOMES.md was already canonical layer — only README + downstream surfaces needed re-do. Pattern: build canonical layer FIRST, then user-facing surfaces SECOND, so pivots don't cascade.

### Surprise log
- T1: writing 8-outcome × 33-component matrix forced explicit thinking about each component's role. 3 skills (`refactor-advisor`, `dev-flow-compress`, `release-manager`) had ambiguous outcome fit until counter-evidence forced sharper definition. Net: registry exercise improved component-level clarity, not just lens framing.
- T4: CLAUDE.md cap surgery was harder than predicted. Originally planned 1 trim (Naming Conventions). Ended with 2 trims (Naming Conventions inline + Codemap inline) after user pushback on section loss. Cap held 79/80 but path was iterative, not single-shot.
- T5: `.claude/references/` directory NEW (no prior precedent). Decision: mirror skill convention (skills/<name>/references/) at the .claude/ root. Future CONTEXT.md or CLAUDE.md overflow uses same dir. Convention-establishing side effect.
- close: full re-frame landed in one session despite 11 OQs and 1 mid-session pivot. Pre-resolve-OQs-at-promote pattern continues to compound — by the time T1 starts, locked decisions remove ~80% of execution-time friction.
