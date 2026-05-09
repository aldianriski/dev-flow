---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: closed
plan_commit: ffcc3e4
close_commit: TBD
---

# Sprint 052 — F4 Wire Orphan Skills + F5 Tech-Debt Rollover Loop

**Theme:** TASK-123. F4 — wire 6 orphan skills (`prime` · `zoom-out` · `tdd` · `diagnose` · `refactor-advisor` · `release-manager`) into orchestrator phase detection via `skill-dispatch.md` Always-On table + `phases.md` advisory hints. F5 — tech-debt rollover loop with 4 mechanics + anti-pattern locks: (A) `## Tech Debt` section in TODO.md w/ TD-NNN namespace; (B) Sprint Close Friction→TD prompt; (C) Sprint Execute mid-sprint fix/defer/block prompt; (D) Sprint Promote TD scan + auto-escalate; (E) 5 anti-pattern locks.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 051b closed `2266b9d` (ADR-029 user-project surfaces).
**Successor:** Sprint 052b — release-debt resolution (Sprint 049 MINOR + 050/051a/051b/052 PATCH chain).

---

## Why this sprint exists

**F4 origin (TASK-123 backlog row pre-Sprint-052):** 6 user-invokable skills exist (`prime` · `zoom-out` · `tdd` · `diagnose` · `refactor-advisor` · `release-manager`) but none are wired into orchestrator phase detection. Users discover them only by reading individual SKILL.md files. orchestrator skill-dispatch.md Always-On table currently lists only 4 entries (code-reviewer · lean-doc-generator · adr-writer · security-analyst). Outcome gap: O5 flow (orphan skills not surfaced at right phase).

**F5 origin (session 2026-05-08 expansion of TASK-123):** No tech-debt mechanic exists. Friction items in sprint retros either get promoted to Backlog manually (often forgotten) or lost. Mid-sprint friction either halts the sprint (block) or gets silently absorbed (no record). User explicitly requested 4-mechanic loop with anti-pattern locks.

**Locked decisions (G2 design-analyst):**
- TD rows live in TODO.md `## Tech Debt` section (not separate file) — single canonical state file.
- Bullet-list format (not table) — optional fields tolerated; grep-friendly by `TD-NNN`.
- F5(C) protocol overflows to `phases.md § Mid-Sprint Friction Protocol` (orchestrator SKILL.md at 95/100 cap).
- Anti-pattern locks colocated with mechanics in `SPRINT_PROTOCOLS.md` (not DOCS_Guide.md) — mirrors Anti-Drift Hard Stops precedent.
- Behavioral enforcement only this sprint; automated lint deferred to TASK-116-v2 acceptance harness (Sprint 054).

**Per OQ-J (Sprint 051a precedent): Date stamping = 2026-05-09.**

---

## Open Questions (locked at promote)

- (A) **F4 placement.** **Decision:** skill-dispatch.md Always-On table (10 rows post-edit; was 4) + phases.md advisory hints block in sprint-bulk Phase + `task-type:` line in G1 Scope Checklist template. orchestrator SKILL.md unchanged (cap 95/100; pointer to references/ already established).
- (B) **TD ID namespace.** **Decision:** `TD-NNN` separate from `TASK-NNN`. Collision-prevention; clear semantic distinction.
- (C) **TD row format.** **Decision:** bullet list (variable optional fields). Schema: severity (trivial/minor/medium/high lowercase) · source (Sprint-NNN retro OR session ISO-date) · status (open/escalated/resolved) · sprint-created (NNN) · optional AC.
- (D) **Severity tier values.** **Decision:** `trivial · minor · medium · high` (ascending). Lowercase. Matches existing `risk:` vocabulary in scope-analyst output.
- (E) **Status values + deletion-forbidden.** **Decision:** `open · escalated · resolved`. ALL three permanent. Resolved rows stay in section with `status: resolved → TASK-NNN` (audit trail).
- (F) **F5(C) cap-pressure resolution.** **Decision:** new `## Mid-Sprint Friction Protocol` section in `phases.md` (no cap); 1-line pointer added to `orchestrator/SKILL.md` Skill Dispatch section (96/100 post-edit).
- (G) **Auto-escalate threshold.** **Decision:** `severity: high` auto-escalates to Backlog P1 (no human review). `trivial · minor · medium` require human gate at Sprint Promote Step 1.5. Aging >6 sprints triggers re-review prompt (escalate / downgrade / mark resolved).
- (H) **Aging calculation.** **Decision:** `current sprint number - sprint-created`. New required field on TD rows. Missing field → treat as requires-re-review immediately (defensive default).
- (I) **Resolved row location.** **Decision:** stays in `## Tech Debt` section with `status: resolved → TASK-NNN`. Not moved to CHANGELOG. Future hygiene rule (archive resolved >3 sprints old) deferred — not Sprint 052 scope.
- (J) **Anti-pattern locks placement.** **Decision:** new `## Tech Debt Anti-Pattern Locks` section appended to SPRINT_PROTOCOLS.md (after Date-Sanity). Mirrors Anti-Drift Hard Stops style.
- (K) **Automated enforcement.** **Decision:** behavioral-only this sprint. Automated lint deferred to TASK-116-v2 Sprint 054. Documented as known limitation in sprint retro + Sprint 054 carry-forward.
- (L) **Cap discipline.** orchestrator SKILL.md ≤97/100 post-T4 (was 95). SPRINT_PROTOCOLS.md ~250 post-T3+T5 (no strict cap; reasonable). skill-dispatch.md ~55 post-T1 (was 46; no strict cap). phases.md ~240 post-T1+T4 (was 212; no strict cap). Sprint file ≤300.
- (M) **ADR.** **Decision:** none. F4 is implementation; F5 mechanics inherit from TASK-123 backlog row spec (already user-locked at session 2026-05-08 expansion). Anti-pattern locks are protocol rules, not architectural decisions.

---

## Plan

### T1 — F4 wire 6 orphan skills (skill-dispatch.md + phases.md)
**Scope:** small · **Layers:** skills · **Risk:** low · **HITL** *(reviewer verifies: 6 orphans wired in skill-dispatch.md Always-On at correct lifecycle positions; phases.md advisory hints block + G1 task-type advisory line; no orchestrator SKILL.md edits)*
**Acceptance:**
- (a) `skills/orchestrator/references/skill-dispatch.md` — Always-On table grows 4→10 rows. Inserted in lifecycle order: `prime` (session-start) · `zoom-out` (pre-G1, unfamiliar/cross-cutting) · `diagnose` (G1 task-type=bug-fix) · `tdd` (Implement, new behavior) · existing 4 rows · `refactor-advisor` (post-Review on smell finding) · `release-manager` (sprint-bulk close, MINOR/MAJOR; release-patch is PATCH path).
- (b) 2-line note below table: `diagnose` vs `tdd` mutually exclusive at G1 task-type detection; `release-manager` vs `release-patch` trigger split (release-manager = explicit MINOR/MAJOR; release-patch = auto-detect PATCH).
- (c) `skills/orchestrator/references/phases.md` — advisory hints block (7 bullets) inserted at start of `## sprint-bulk Phase` (before Step 1) + `task-type:` advisory line in G1 Scope Checklist template (after `layers:` line; advisory not required).
- (d) Sprint file § Files Changed row recorded.
**Source:** existing skill-dispatch.md Always-On table + phases.md sprint-bulk Phase + 6 orphan SKILL.md files.
**Depends on:** none.

### T2 — F5(A) TD section schema (TODO.md + templates/TODO.md.template)
**Scope:** small · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer verifies: section placement after Backlog before Changelog; docstring covers never-delete + ID namespace + severity tiers; example row in template covers all fields)*
**Acceptance:**
- (a) `TODO.md` — `## Tech Debt` section inserted after `## Backlog` (before `## Changelog`). Header docstring 5 lines: never-delete rule · TD-NNN ID namespace · severity tiers (trivial · minor · medium · high lowercase) · status values (open · escalated · resolved) · sort order. Section starts empty (zero data rows).
- (b) `templates/TODO.md.template` — same `## Tech Debt` section after `## Backlog` (line 63 area). Same docstring + one `[CUSTOMIZE]` example row showing all fields:
  - `**TD-001** severity: medium | source: Sprint-001 retro Friction #1 | status: open | sprint-created: 001`
  - Summary + AC + Sprint-placed sub-fields shown.
- (c) Sprint file § Files Changed row recorded.
**Source:** F5(A) spec from TASK-123 row + design-analyst plan §4.
**Depends on:** none.

### T3 — F5(B) Sprint Close Friction→TD prompt
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: sub-step inserted within Step 4 Friction flow without renumbering; Y/N/already-resolved branches all spelled out; Pattern candidate bullet preserved)*
**Acceptance:**
- (a) `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` Sprint Close Protocol Step 4 — sub-step inserted after Friction bullet, before Pattern candidate. Prompt: `"TD row for: [friction one-liner]? (Y / N / already-resolved)"`. Branches:
  - Y → write TD-NNN row in TODO.md § Tech Debt (severity + source: Sprint-NNN retro Friction #N + status: open + sprint-created: NNN)
  - N → one-off observation; no action
  - already-resolved → no row; note in retro text
  - Anti-rule: do NOT auto-promote ALL friction.
- (b) Sprint file § Files Changed row recorded.
**Source:** F5(B) spec from TASK-123 row + design-analyst plan §5.
**Depends on:** T2 (TD schema must exist before protocol references it).

### T5 — F5(D) Sprint Promote TD scan + F5(E) anti-pattern locks
**Scope:** small-medium · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: Step 1.5 inserted between Steps 1 and 2 without renumbering; auto-escalate logic for severity: high; aging >6 sprints re-review prompt; missing-sprint-created defensive default; 5 anti-pattern locks appended at file end mirror Anti-Drift Hard Stops style)*
**Acceptance:**
- (a) `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` Sprint Promote Protocol — new Step 1.5 (`TD Scan`) between existing Steps 1 and 2. For each open TD row:
  - severity: high → auto-escalate to Backlog P1 (no human review). Write `TASK-NNN` in Backlog from TD-NNN AC. Mark TD row `status: escalated`.
  - aging >6 sprints → prompt user `"TD-NNN is [N] sprints old (severity: X). Escalate / Downgrade / Mark resolved?"`.
  - severity: trivial|minor|medium + not aging → surface summary count to user; human review required to promote.
  - missing `sprint-created:` field → treat as requires-re-review immediately (defensive default).
- (b) Same file — append `## Tech Debt Anti-Pattern Locks` section at end (after Date-Sanity section). Mirror Anti-Drift Hard Stops format. 5 locks:
  1. Never delete TD rows on resolution. Resolved → status: resolved → TASK-NNN. History = audit trail.
  2. Never auto-promote low-severity to Backlog. trivial · minor · medium = human gate at Sprint Promote Step 1.5. Only `high` auto-escalates.
  3. Never let TD row age past 6 sprints without re-review. Sprint Promote Step 1.5 fires re-review. Missing sprint-created → immediate re-review.
  4. Never write TD row without severity + source. Invalid row → fix before continuing.
  5. Never merge `status: escalated` row without corresponding Backlog `TASK-NNN`. Escalation incomplete until Backlog row exists.
- (c) Sprint file § Files Changed row recorded.
**Source:** F5(D)+(E) spec from TASK-123 row + design-analyst plan §7+§8.
**Depends on:** T2 + T3.

### T4 — F5(C) Mid-Sprint Friction Protocol (phases.md + SKILL.md pointer)
**Scope:** small-medium · **Layers:** skills · **Risk:** medium · **HITL** *(reviewer verifies: protocol section appended to phases.md w/ trigger + prompt block + per-choice action; orchestrator SKILL.md adds 1-line pointer; SKILL.md cap ≤97/100)*
**Acceptance:**
- (a) `skills/orchestrator/references/phases.md` — append `## Mid-Sprint Friction Protocol` section at end of file. Content:
  - Trigger: AI surfaces issue mid-task OR human types `friction` at any task boundary.
  - Prompt block: `[friction] <one-liner> · Fix now / defer / block?`
  - On `fix`: suspend current task step; complete fix; run feedback loop; resume.
  - On `defer <one-line-reason>`: write TD-NNN row in TODO.md § Tech Debt immediately (severity human-supplied OR AI-assessed; source: session ISO-date mid-sprint T<N>; status: open; sprint-created: NNN). Continue task.
  - On `block`: invoke First-Blocker Halt (sprint-bulk Phase Step 5).
- (b) `skills/orchestrator/SKILL.md` Skill Dispatch section — 1-line pointer added: `Mid-sprint friction handling → \`references/phases.md § Mid-Sprint Friction Protocol\``.
- (c) Verify SKILL.md cap ≤97/100 post-edit (was 95).
- (d) Sprint file § Files Changed row recorded.
**Source:** F5(C) spec from TASK-123 row + design-analyst plan §6.
**Depends on:** T1 (phases.md edit; serialize after T1 completes).

### T6 — Sprint close
**Scope:** small · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer verifies: frontmatter sprint:none at close; Active Sprint cleared; TASK-123 marked [x]; Roadmap row Sprint 52 done; sprint file closed; CHANGELOG row prepended)*
**Acceptance:** standard Sprint Close per SPRINT_PROTOCOLS.md.
**Depends on:** T1+T2+T3+T4+T5.

---

## Dependency chain

```
T1 (F4 wiring)              independent
T2 (TD section schema)      independent (parallel-eligible w/ T1)
T3 (Sprint Close prompt)    depends T2
T5 (Sprint Promote scan + locks)  depends T2 + T3 (SPRINT_PROTOCOLS.md serialized)
T4 (Mid-Sprint Friction)    depends T1 (phases.md serialized)
T6 (sprint close)           depends T1+T2+T3+T4+T5
```

Recommended execution: **T1 → T2 → T3 → T5 → T4 → T6** (per design-analyst overlap-gate analysis: T3+T5 share SPRINT_PROTOCOLS.md so serialize T3 before T5; T1+T4 share phases.md so serialize T1 before T4).

Pairwise file overlap matrix (non-empty pairs):
- (T1, T4) — phases.md → serialize
- (T3, T5) — SPRINT_PROTOCOLS.md → serialize
- (T1, T6), (T2, T6) — TODO.md → T6 final
- (T3, T6), (T5, T6) — SPRINT_PROTOCOLS.md → T6 close-stamp only

All pairs require sequential execution. Default sequential per orchestrator policy.

---

## Cross-task risks

- **phases.md sequential edit (T1+T4).** T1 edits sprint-bulk Phase + G1 Scope Checklist; T4 appends new section at end. Different sections; line-number shifts after T1 won't break T4 (T4 appends). Mitigation: implementer re-reads phases.md before T4.
- **SPRINT_PROTOCOLS.md sequential edit (T3+T5).** T3 modifies Sprint Close Step 4; T5 inserts Step 1.5 in Sprint Promote + appends Anti-Pattern Locks. Different protocol sections; no semantic collision. Line-number shifts after T3 — implementer re-reads file before T5.
- **`sprint-created:` field defensive default.** Missing field → immediate re-review prompt. Could cause noise if someone writes TD row manually without protocol. Mitigation: F5(B) and F5(C) write paths both produce sprint-created by construction. Manual TD-row authoring is unsupported (acknowledged risk; documented in Anti-Pattern Lock #4).
- **No automated enforcement (DONE_WITH_CONCERNS).** Anti-pattern locks behavioral-only. Skilled human reviewer at code-reviewer time is the gate until TASK-116-v2 (Sprint 054 acceptance harness). Documented in retro + Sprint 054 carry-forward.
- **Plugin runtime catch-up.** Sprint 049 MINOR + 050 PATCH + 051a PATCH + 051b PATCH + 052 PATCH (5-sprint chain). release-debt resolution Sprint 052b owed. release-patch NOT invoked this sprint.
- **Backwards compat for existing user-projects.** New `## Tech Debt` section in TODO.md.template applies to NEW init only. Existing user-projects manually merge if adopting. Per ADR-028 init is first-time-only.

---

## Sprint DoD

- [x] T1 skill-dispatch.md Always-On table 4→10 rows (6 orphans wired in lifecycle order); phases.md advisory hints block (6 bullets) + G1 task-type advisory line. orchestrator SKILL.md unchanged at T1 (cap 95/100 held).
- [x] T2 TODO.md `## Tech Debt` section (empty + 6-line docstring) inserted between Backlog and P3 closed sub-blocks; templates/TODO.md.template same section + 1 `[CUSTOMIZE]` example row showing all fields.
- [x] T3 SPRINT_PROTOCOLS.md Sprint Close Protocol Step 4 § Retro — Friction→TD prompt sub-step (Y/N/already-resolved branches; anti-rule preserved).
- [x] T5 SPRINT_PROTOCOLS.md Sprint Promote Step 1.5 TD Scan inserted between Steps 1 and 2 + appended `## Tech Debt Anti-Pattern Locks` section (5 locks mirroring Anti-Drift Hard Stops).
- [x] T4 phases.md `## Mid-Sprint Friction Protocol` section (trigger + prompt + per-choice action with TD-write logic on defer); orchestrator SKILL.md 1-line pointer (cap 96/100 ≤97 budget held).
- [x] T6 TODO.md sprint:none at close; Active Sprint cleared; TASK-123 marked [x]; Roadmap row Sprint 52 done; sprint file closed; CHANGELOG row prepended.
- [x] All artifacts stamp 2026-05-09.
- [x] Cap discipline held: orchestrator SKILL.md 96/100 · skill-dispatch.md 58 · phases.md 251 · SPRINT_PROTOCOLS.md 227 · sprint file <300 (this file).
- [x] release-patch NOT invoked (release-debt continues per Sprint 052b owed).
- [x] Zero unrelated edits — only sprint-intent files staged.
- [x] Open questions A-M resolved at promote; zero re-litigation during execution.
- [x] Carry-forward: TD anti-pattern lock automation → TASK-116-v2 Sprint 054 (recorded in retro + CHANGELOG).

---

## Execution Log

### 2026-05-09 | T1 done — `ffcc3e4`
F4 wired. `skills/orchestrator/references/skill-dispatch.md` Always-On table grew 4→10 rows in lifecycle order: prime (session start) · zoom-out (pre-G1, unfamiliar/cross-cutting) · diagnose (G1 task-type=bug-fix) · tdd (Implement, new behavior) · existing 4 rows · refactor-advisor (post-Review, smells) · release-manager (sprint close, MINOR/MAJOR). 2-line note clarifies diagnose↔tdd mutual exclusivity + release-manager↔release-patch trigger split. `phases.md` advisory hints block (6 bullets) inserted at start of sprint-bulk Phase + `task-type:` advisory line in G1 Scope Checklist template (advisory-not-required). orchestrator SKILL.md unchanged (cap 95/100 held).

### 2026-05-09 | T2 done — `2b462c7`
F5(A) shipped. NEW `## Tech Debt` section in dev-flow `TODO.md` (between Backlog and P3 closed sub-blocks). Section starts empty + 6-line docstring covering TD-NNN namespace · severity tiers (trivial/minor/medium/high lowercase ascending) · status values (open/escalated/resolved ALL permanent) · sort order (open high→trivial, escalated, resolved at bottom) · aging calc · pointer to anti-pattern locks. Same section added to `templates/TODO.md.template` w/ 1 `[CUSTOMIZE]` example row showing all schema fields including optional AC + Sprint-placed.

### 2026-05-09 | T3 done — `ba64493`
F5(B) shipped. `SPRINT_PROTOCOLS.md` Sprint Close Protocol Step 4 § Retro now prompts per Friction item: `"TD row for: [friction one-liner]? (Y / N / already-resolved)"`. Y → write TD-NNN row in TODO.md § Tech Debt (severity user-supplied + source: Sprint-NNN retro Friction #N + status: open + sprint-created: NNN). N → no row. already-resolved → retro text only. Anti-rule preserved: do NOT auto-promote ALL friction. Pattern candidate bullet preserved unchanged.

### 2026-05-09 | T5 done — `ccba56f`
F5(D)+F5(E) shipped. `SPRINT_PROTOCOLS.md` Sprint Promote Protocol gained Step 1.5 TD Scan between existing Steps 1 and 2 (kept numbering stable via decimal). Logic: severity:high → auto-escalate Backlog P1 (no human review; TD row stays in section per anti-pattern lock #1) · aging >6 sprints → re-review prompt · missing sprint-created → defensive re-review (anti-pattern lock #3) · trivial/minor/medium not aging → count summary; human gate (anti-pattern lock #2) · status:escalated without Backlog TASK-NNN → HARD STOP (anti-pattern lock #5). Same file appended `## Tech Debt Anti-Pattern Locks` section (5 numbered locks mirroring Anti-Drift Hard Stops style). Enforcement note: behavioral only; automated lint deferred to TASK-116-v2 Sprint 054. SPRINT_PROTOCOLS.md 197→227 lines (no cap).

### 2026-05-09 | T4 done — `c4b2c83`
F5(C) shipped. NEW `## Mid-Sprint Friction Protocol` section appended to `skills/orchestrator/references/phases.md` (221→251 lines). Trigger: AI surfaces issue mid-task OR human types `friction` at task boundary. Prompt: fix / defer <reason> / block. On `defer` → write TD-NNN row immediately (severity + source: session <ISO-date> mid-sprint T<N> + status: open + sprint-created: NNN + Summary: reason verbatim) + continue task. Cross-link to anti-pattern locks. orchestrator SKILL.md gained 1-line pointer in Skill Dispatch section (cap 95→96/100; ≤97 budget held).

### 2026-05-09 | T7 fold-in done — `122c98d` (in-sprint expansion)
**Mid-sprint user finding:** `templates/` folder has 9 doc-type templates but `lean-doc-generator` skill never references them. `grep "templates/" skills/lean-doc-generator/` → 0 matches. Mismatch user observed: Sprint 051b's CA+DDD template rewrites landed in `templates/` but `/lean-doc-generator` regenerated docs from inline format examples in `DOCS_Guide.md` instead, producing pre-051b style.

Same pattern as Sprint 051b T4.5 (orphan-primer) + T5.5 (stale 03/08 blueprints) — coherence-gap surfaced via "is this connected?" question at write-time.

Minimal wire (per AskUserQuestion gated): added "Canonical template" column to `DOCS_Guide.md` § 2 Core Files table mapping each Core File row to its `templates/<X>.md.template` path. Added template-as-canonical-format rule: template wins on divergence; lean-doc MUST consult template before generating. Defers full lean-doc template-loader logic (Step 6 Generate actually READING templates/ at gen time) to TASK-124 Sprint 053 F6a template lineage scope.

Closes drift risk for Sprint 051b template rewrites for the 1-sprint gap.

### 2026-05-09 | sprint close — TBD
This commit. TASK-123 fully delivered: F4 wires 6 orphan skills into orchestrator phase detection; F5 ships 4-mechanic tech-debt rollover loop (TD section schema · Friction→TD prompt · mid-sprint fix/defer/block · Sprint Promote scan + auto-escalate) + 5 anti-pattern locks. **In-sprint T7 fold-in** closed templates/ ↔ lean-doc-generator wiring gap (minimal wire; deeper integration deferred to TASK-124 Sprint 053). Behavioral enforcement only this sprint; automated lint deferred to TASK-116-v2 (Sprint 054). release-patch NOT invoked (release-debt 5-sprint chain → Sprint 052b owed).

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `skills/orchestrator/references/skill-dispatch.md` | T1 | Always-On table 4→10 rows (6 orphans wired) + 2-line note | low | — |
| `skills/orchestrator/references/phases.md` | T1+T4 | T1: advisory hints block + G1 task-type line · T4: append Mid-Sprint Friction Protocol section | medium | — |
| `TODO.md` | T2+T6 | T2: `## Tech Debt` section + docstring · T6: sprint close (frontmatter + Active Sprint clear + TASK-123 [x] + Roadmap) | low | — |
| `templates/TODO.md.template` | T2 | `## Tech Debt` section + docstring + 1 example row | low | — |
| `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | T3+T5 | T3: Sprint Close Step 4 Friction→TD sub-step · T5: Sprint Promote Step 1.5 TD Scan + appended Anti-Pattern Locks section | low | — |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T7 fold-in | NEW Canonical template column on § Core Files table (9 rows mapped to templates/<X>.md.template) + template-as-canonical-format rule | low | — |
| `skills/orchestrator/SKILL.md` | T4 | 1-line pointer to Mid-Sprint Friction Protocol (cap 95→96) | low | — |
| `docs/CHANGELOG.md` | T6 | Sprint 052 row prepended | low | — |
| `docs/sprint/SPRINT-052-orphan-skill-wiring-tech-debt-rollover.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | F4 wiring placement = skill-dispatch.md Always-On + phases.md advisory hints (NOT orchestrator SKILL.md) | SKILL.md at 95/100 cap; pointer to references/ already established pattern | — |
| DEC-2 | TD rows in TODO.md `## Tech Debt` section (NOT separate docs/tech-debt.md) | Single canonical state file; no extra Read at Sprint Promote | — |
| DEC-3 | Bullet list format for TD rows (NOT table) | Optional fields tolerated; grep-friendly by TD-NNN; schema diff from Backlog intentional | — |
| DEC-4 | F5(C) Mid-Sprint Friction Protocol overflows to phases.md (1-line pointer in SKILL.md) | SKILL.md cap pressure; mirrors Skill Dispatch pointer pattern | — |
| DEC-5 | Anti-pattern locks colocated in SPRINT_PROTOCOLS.md (NOT DOCS_Guide.md) | Same file as mechanics; mirrors Anti-Drift Hard Stops precedent | — |
| DEC-6 | Behavioral enforcement only this sprint; automated lint deferred to TASK-116-v2 Sprint 054 | Acceptance harness not yet shipped; behavioral hard-stop pattern is established | — |
| DEC-7 | TD ID namespace `TD-NNN` separate from `TASK-NNN` | Collision-prevention; clear semantic distinction | — |

---

## Open Questions for Review

*(none surfaced post-execution. All 13 promote-time OQs (A-M) resolved cleanly via design-analyst G2 plan + user-locked decisions in TASK-123 backlog row 2026-05-08 expansion. Recon-first pattern from Sprint 050/051a/051b held — read all 6 orphan SKILL.md + skill-dispatch.md + phases.md + SPRINT_PROTOCOLS.md + TODO templates before plan-write. Zero re-litigation during execution.)*

---

## Retro

### Worked

- **Recon-first compounded across 4 sprints** (050/051a/051b/052). Read 6 orphan skills + 2 orchestrator references + lean-doc SPRINT_PROTOCOLS.md + TODO templates BEFORE planning. design-analyst G2 produced micro-task list ready to execute; zero implementation surprises. Plan landed without speculative scope.
- **Cap pressure handled cleanly via references/ overflow.** orchestrator SKILL.md at 95/100 pre-sprint; F5(C) was the highest-risk surface for cap breach. design-analyst recommended 1-line pointer to phases.md instead of inline content; cap stayed at 96/100 (≤97 budget held). Pattern: when SKILL.md is near cap, full-section content goes to references/ + 1-line pointer.
- **Anti-pattern locks colocated with mechanics.** Decision DEC-5 placed locks in SPRINT_PROTOCOLS.md (same file as mechanics) not DOCS_Guide.md. Mirrors Anti-Drift Hard Stops precedent at top of same file. Agents reading the protocol see the locks before acting; no extra navigation hop.
- **TD section in TODO.md (not separate doc).** Decision DEC-2: single canonical state file. No extra Read at Sprint Promote Step 1.5; no doc-rot risk from second source. Bullet-list format (DEC-3) tolerates optional fields cleanly.
- **F4 + F5 in same sprint without scope balloon.** 6 tasks total (5 substantive + 1 close). Each task small-S. Conditional dependencies serialized per overlap-gate matrix (T3+T5 share SPRINT_PROTOCOLS.md → T3 first; T1+T4 share phases.md → T1 first). No blocking conflicts.
- **Severity vocabulary aligned with existing risk: vocabulary.** TD severity tiers (trivial/minor/medium/high) match scope-analyst output's risk: low/medium/high vocabulary in lowercase. Cross-skill consistency without forced unification.

### Friction

- **Behavioral enforcement only — automated lint deferred.** TD anti-pattern locks rely on `lean-doc-generator` skill type:rigid + skilled human reviewer. Until TASK-116-v2 Sprint 054 acceptance harness ships, TD discipline is honor-system. Risk: anti-pattern lock #1 (never delete TD rows) easiest to violate accidentally during sprint cleanup. Mitigation: behavioral hard-stop in SPRINT_PROTOCOLS.md + retro reminder.
- **Aging calculation requires `sprint-created:` field by construction.** Manual TD-row authoring is unsupported (no protocol path that writes without sprint-created). Defensive default: missing field → immediate re-review prompt. Acceptable trade — manual authoring is anti-pattern not feature.
- **TD row vs Backlog row dual-track during escalation window.** When `severity: high` auto-escalates, TD row stays with `status: escalated` AND new Backlog `TASK-NNN` row exists. Two surfaces show same item until resolution. Anti-pattern lock #5 (HARD STOP if escalated row lacks Backlog match) prevents desync. Pattern: dual-track is the audit-trail cost; acceptable.
- **Release-debt depth +1 → 5 sprints.** Sprint 049 MINOR + 050/051a/051b/052 PATCH chain. Sprint 052b release-debt resolution next. Manual reconcile cost grows; tooling sprint deferred per ADR-028 OQ-J.
- **Plugin runtime catch-up still blocking validation.** TD section visible in TODO.md only after Claude Code restart loads plugin manifest. Sprint 052 changes verified via Node test suite + manual file inspection only — not via real `/orchestrator` invocation in current session. Same friction as Sprint 049-051b.

### Pattern candidates (carried forward)

1. **References/ overflow when SKILL.md near cap.** When SKILL.md cap pressure prevents inline content, full content lives in `references/<topic>.md`; SKILL.md gets 1-line pointer. Pattern validated 4 times (Skill Dispatch table → references/skill-dispatch.md; mode/gate/phase detail → references/phases.md; sprint protocols → references/SPRINT_PROTOCOLS.md; mid-sprint friction → references/phases.md § new section). Codify as authoring rule: "SKILL.md ≤100 hard cap; overflow always to references/."
2. **Anti-pattern locks colocated with mechanics.** When introducing a new mechanic with anti-patterns, place locks in same file as mechanic (not separate doc). Mirrors Anti-Drift Hard Stops precedent. Agents read once; no extra navigation hop.
3. **Decimal sub-step numbering for protocol insertions.** Step 1.5 inserted between existing Steps 1 and 2 of Sprint Promote Protocol — preserves existing 1-9 numbering downstream. Avoids cascading renumber when inserting between numbered steps. Reusable for future protocol extensions.
4. **TD-NNN ID namespace separation from TASK-NNN.** Collision-prevention by design. Different schemas (TD has severity/source/status/sprint-created; TASK has scope/layers/api-change/acceptance/risk). Different lifecycles (TD never deleted; TASK collapses to CHANGELOG row). Pattern: when introducing a parallel tracking namespace, use distinct prefix.
5. **Mutual-exclusivity at G1 task-type detection.** `diagnose` vs `tdd` are not stacked — task is either bug-fix or feature, not both. skill-dispatch.md note codifies this. Pattern: when 2 advisory skills serve different task types, mark mutual exclusivity at dispatch table (not after-the-fact in SKILL.md anti-patterns).

### Surprise log

- T1: skill-dispatch.md Always-On table grew from 4 to 10 rows (was hypothetically 4→8 if just orphans appended). Lifecycle-ordered insertion split existing 4 rows across the new 6 — code-reviewer kept its post-implement position; refactor-advisor inserted POST code-reviewer; release-manager inserted post-after-commit. Pattern: when wiring lifecycle skills, sort by phase position not by historical order.
- T2: TODO.md `## Tech Debt` section placement chose between-Backlog-and-P3 vs after-Changelog. Picked between because P3 closed-sub-blocks is "historical reference only" (per existing comment); active TD is current-state, belongs in main backlog flow. Reader following P0→P1→P2→P3→TD→Changelog reads in priority+lifecycle order.
- T3: Sprint Close Step 4 sub-step inserted between Friction bullet and Pattern candidate bullet (not at end of step). Preserves existing flow — reader sees Friction then immediately gets prompted per item, before moving to Pattern candidate review. Inserting at end would have decoupled prompt from Friction list mentally.
- T5: Sprint Promote Step 1.5 numbering chose decimal vs cascading renumber. Decimal preserves all downstream Step 2-9 references in commit messages, retros, ADRs. Cascading renumber would have broken every existing "Sprint Promote Step N" reference in the codebase. Pattern: decimal sub-step for protocol insertions in stable numbered protocols.
- T4: Mid-Sprint Friction Protocol prompt format mirrored the Anti-Drift Hard Stops pattern (prompt block in fenced code; per-choice action below). Visual consistency makes the protocol read as "another hard-stop" not "novel mechanic." Cognitive leverage from precedent.
- close: 6 commits across 6 tasks (1 commit each; no consolidation needed). Each task self-contained. Total sprint duration ~1 session. Zero scope expansion this sprint (vs 051b's 2 expansions). G2 plan landed clean; recon-first paid off again.
