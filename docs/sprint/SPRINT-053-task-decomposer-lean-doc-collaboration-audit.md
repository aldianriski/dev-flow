---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: in_progress
plan_commit: TBD
close_commit: TBD
---

# Sprint 053 — F6 task-decomposer ↔ lean-doc-generator Collaboration Audit + Template-Loader Integration

**Theme:** TASK-124. F6a — finish Sprint 052 T7 carry-forward (lean-doc Step 6 Generate actually READS `templates/<X>.md.template` at gen time + task-decomposer parallel template-read in procedure.md Step 6). F6b — pattern alignment (template canonical ownership locked via ADR-030; bidirectional Sprint Promote handoff prevents Backlog-empty drift). Closes 2-source-of-truth duplication on TASK row format (task-decomposer/decomposition-spec.md vs templates/TODO.md.template).
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 052 closed `fb8e389` (TASK-123 F4+F5+T7 fold-in).
**Successor:** Sprint 053b — TASK-125 broader feature-usage audit sweep.

---

## Why this sprint exists

Sprint 052 T7 fold-in (user-surfaced) added pointer-only wiring between `templates/` and `lean-doc-generator` Core Files (Canonical template column in `DOCS_Guide.md` § 2). Deeper integration (lean-doc Step 6 Generate actually READING `templates/<X>.md.template` at gen time) was deferred to TASK-124 Sprint 053. Same gap exists for `task-decomposer` — its `decomposition-spec.md` § Output Format Template duplicates the TASK row format that lives in `templates/TODO.md.template`. Two skills · two sources of truth · drift risk · pattern divergence (TASK-124 row origin: user session 2026-05-08 — "this 2 skills not collaborate and have different pattern. this skills also when trigger is not create complete docs properly with the right template").

**Pattern divergences identified at recon:**

1. **TASK row format duplication** — `task-decomposer/references/decomposition-spec.md` lines 29-40 + `templates/TODO.md.template` lines 38-45 define the same row format independently. 2 sources of truth.
2. **Template ownership unclear** — neither skill READS `templates/` at generation time. Sprint 052 T7 added Canonical-template column (pointer only).
3. **Sprint Promote handoff one-directional** — task-decomposer Step 6 (procedure.md) defers sprint formation to lean-doc ✓. lean-doc Sprint Promote Step 1 doesn't redirect to task-decomposer if Backlog empty.
4. **F6a Sprint 052 T7 carry-forward** — lean-doc Step 6 Generate uses inline format, not actual template-load.

**Locked decisions (G2 design-analyst):**
- ADR-030 warranted (4-criteria match: non-trivial choice · team-wide pattern · constrains future · hard-to-reverse). Draft FIRST (T0.5) before implementation tasks.
- T3 changes lean-doc Step 6 to template-first behavior for ALL doc types with Canonical template entry — must verify Sprint 051b CA+DDD CLAUDE.md render still produces correct output (T5 regression check).
- Decimal sub-step numbering for Sprint Promote Step 1.2 (between Step 1 and Step 1.5 TD Scan added Sprint 052) preserves existing references.
- Template wins on divergence; missing template degrades gracefully to inline fallback + flags as friction.

---

## Open Questions (locked at promote)

- (A) **ADR-030 scope.** **Decision:** "lean-doc-generator owns templates as canonical format source; task-decomposer + orchestrator init consume; inline format examples in skill references are non-authoritative." Cross-links: ADR-029 (CA+DDD canonical), Sprint 051b template re-render, Sprint 052 T7 fold-in.
- (B) **Step 6 contract semantics.** **Decision:** for `type: rigid` skill, "READ templates/<X>.md.template at gen time" means agent issues Read tool call before writing. Behavioral, not mechanical. Verify: frontmatter field order · section order · substitution token alignment. Template wins on divergence (note correction inline).
- (C) **Missing-template fallback.** **Decision:** WARN + degrade to inline format + flag as friction at sprint close. Hard-stop would break docs without templates (TEST_SCENARIOS.md, sprint files, module READMEs — uncapped). Graceful degradation preserves operability.
- (D) **Step 1.2 prompt softness.** **Decision:** y/n prompt with default "halt (n)". Soft guard (not hard-stop) preserves edge cases (P3-only items, manually inserted tasks). Default lean toward halt to clarify behavior in AFK contexts.
- (E) **decomposition-spec.md framing preservation.** **Decision:** keep ALL surrounding decomposition-specific framing (Source · Scope-analyst impact · Assumptions confirmed · dependency graph · approve/revise/split/merge · sprint-formation note). ONLY replace TASK row inline format (lines 29-40) with template-pointer comment + stub. Decomposition framing IS skill-specific.
- (F) **task-decomposer Step 6 read invocation point.** **Decision:** procedure.md Step 6 — read template BEFORE presenting decomposition for human approval (not after `approve`). Format must align with template before user sees it.
- (G) **Cap discipline.** lean-doc SKILL.md 94→96/100 post-T3 (4-line margin); task-decomposer SKILL.md 71/100 (no edit needed; procedure.md gets the change); decomposition-spec.md 139→133 (shrinks); SPRINT_PROTOCOLS.md 227→235 (no cap); DOCS_Guide.md 119→121 (no cap).
- (H) **T5 regression scope.** **Decision:** dry-run /task-decomposer (TASK row alignment) + /lean-doc-generator ARCHITECTURE.md regen + Sprint 051b CA+DDD CLAUDE.md regression check + pre-check templates/DECISIONS.md.template + templates/SETUP.md.template + templates/CHANGELOG.md.template alignment with DOCS_Guide.md format spec.
- (I) **release-debt continues.** Sprint 049 MINOR + 050/051a/051b/052 PATCH + 053 PATCH (6-sprint chain). Sprint 052b release-debt resolution still owed; do NOT invoke `/release-patch` this sprint.
- (J) **Date stamp.** All artifacts 2026-05-09.

---

## Plan

### T0.5 — ADR-030 Template Canonical Ownership (FIRST, per G2 recommendation)
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: 4 ADR criteria match documented; cross-links to ADR-029 + Sprint 051b + Sprint 052 T7; alternatives considered + rejected; consequences positive + negative)*
**Acceptance:**
- (a) NEW `docs/adr/ADR-030-template-canonical-ownership.md` (≤120 lines target ~80).
- (b) Decision: lean-doc-generator owns templates/ as canonical format source; task-decomposer + orchestrator init CONSUME; inline format examples in skill references are non-authoritative.
- (c) Alternatives: per-skill inline formats (status quo for 52+ sprints — rejected: 2-source drift); centralized doc-format service (rejected — over-engineered for plugin scope); templates as advisory not authoritative (rejected — defeats purpose).
- (d) Consequences: positive — cross-skill consistency · single source of truth for doc shape · template changes propagate automatically. Negative — cross-file navigation cost (decomposition-spec.md no longer self-contained) · all consumer skills break if templates/ removed.
- (e) Cross-links: ADR-029 (CA+DDD canonical), Sprint 051b template re-render, Sprint 052 T7 Canonical-template column.
**Source:** TASK-124 row spec + design-analyst plan §8 + Sprint 052 T7 fold-in.
**Depends on:** none (T0.5 is the first task, prevents revert if ADR discussion surfaces scope change).

### T1 — task-decomposer template alignment (decomposition-spec.md)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: lines 29-40 replaced with template-pointer + stub; surrounding framing preserved; cross-file ref verified)*
**Acceptance:**
- (a) `skills/task-decomposer/references/decomposition-spec.md` lines 29-40 replaced. New form: HTML comment block citing `templates/TODO.md.template` lines 38-45 as canonical TASK row format + summary of 8 required fields + stub `- [ ] **TASK-[NNN]: [Title]** — [why it matters, one line]` + `*(see templates/TODO.md.template for field schema)*` annotation.
- (b) ALL surrounding framing preserved (Source · Scope-analyst impact · Assumptions confirmed · Decomposition count header · dependency graph · out-of-scope list · approve/revise/split/merge · sprint-formation note).
- (c) File line count: 139→~133 (shrinks ~6).
- (d) Sprint file § Files Changed row recorded.
**Source:** ADR-030 lock (T0.5) + decomposition-spec.md current state.
**Depends on:** T0.5.

### T2 — F6b Sprint Promote bidirectional handoff (SPRINT_PROTOCOLS.md Step 1.2)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: Step 1.2 inserted between Step 1 and Step 1.5 without renumbering; soft guard y/n prompt; default halt; halt redirects to /task-decomposer)*
**Acceptance:**
- (a) `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` Sprint Promote Protocol — new Step 1.2 inserted between existing Step 1 (active sprint check) and Step 1.5 (TD Scan). Decimal numbering preserves Step 1.5 reference in Anti-Pattern Locks line.
- (b) Step 1.2 logic: scan TODO.md § Backlog for open `[ ]` rows across P0/P1/P2. If zero open → prompt: `"Backlog has no open tasks (P0/P1/P2 all empty). Run /task-decomposer first to surface tasks, then return to Sprint Promote. Continue anyway? Default: halt (n). (y/n)"`. `n` (default) → halt + redirect to /task-decomposer. `y` → proceed (P3-only or manual edge case).
- (c) File line count: 227→~235 (no cap).
- (d) Sprint file § Files Changed row recorded.
**Source:** ADR-030 + design-analyst plan §3.
**Depends on:** T0.5 (parallel-safe with T1).

### T3 — F6a lean-doc Step 6 template-load contract (SKILL.md + DOCS_Guide.md)
**Scope:** small-medium · **Layers:** skills, docs · **Risk:** medium · **HITL** *(reviewer verifies: SKILL.md cap held ≤96; reference-delegation pattern; DOCS_Guide.md §2 rule extended w/ load-order + missing-template fallback + divergence resolution)*
**Acceptance:**
- (a) `skills/lean-doc-generator/SKILL.md` Step 6 (line 60) — replace single sentence with reference-delegation form: `**Step 6 — Generate**: for each doc with a Canonical template entry in references/DOCS_Guide.md §2, read templates/<X>.md.template first (template-load protocol: DOCS_Guide.md §2 Template-as-canonical-format rule). Then write, enforcing line limits + ownership header on every file.`
- (b) `skills/lean-doc-generator/references/DOCS_Guide.md` §2 Template-as-canonical-format rule paragraph — extend with load-order clause:
  - Step 1: read template before writing.
  - Step 2: missing template → WARN + fallback to inline format + log as friction at sprint close.
  - Step 3: template present + agent output diverges → template wins; note correction inline.
- (c) lean-doc SKILL.md cap: 94→96/100 (≤97 budget held; 4-line margin remaining).
- (d) DOCS_Guide.md: 119→~121 (no cap).
- (e) Sprint file § Files Changed row recorded.
**Source:** ADR-030 + design-analyst plan §4 + Sprint 052 T7 carry-forward.
**Depends on:** T0.5 (ADR-030 must lock decision first; design-analyst recommendation).

### T4 — task-decomposer parallel template-read (procedure.md Step 6)
**Scope:** small · **Layers:** skills, docs · **Risk:** low · **HITL** *(reviewer verifies: procedure.md Step 6 extended with template-read sentence; mirrors T3 contract; SKILL.md unchanged; cap held)*
**Acceptance:**
- (a) `skills/task-decomposer/references/procedure.md` Step 6 (lines 19-21) — append sentence: `Before generating output: read templates/TODO.md.template to confirm TASK row field alignment (canonical source per DOCS_Guide.md §2). If missing → fallback to decomposition-spec.md inline spec; log as friction.`
- (b) Read invocation BEFORE presenting decomposition for human approval (not after `approve`).
- (c) procedure.md: 21→~23 (no cap). task-decomposer SKILL.md unchanged (delegates to procedure.md per existing pattern).
- (d) Sprint file § Files Changed row recorded.
**Source:** ADR-030 + design-analyst plan §5. Mirrors T3 contract.
**Depends on:** T3 (T4 mirrors contract established in T3).

### T5 — Validation pass (dry-run + regression check)
**Scope:** small · **Layers:** ci, docs · **Risk:** medium · **HITL** *(reviewer verifies: 4 verifications complete + 3 template pre-checks + Sprint 051b CA+DDD regression confirmed; results logged to sprint file)*
**Acceptance:**
- (a) **Dry-run /task-decomposer** on simple input. Confirm output TASK row contains all 8 fields (scope · layers · api-change · acceptance · tracker · risk · depends-on · assumptions) in same order as templates/TODO.md.template lines 38-45.
- (b) **Dry-run /lean-doc-generator** for ARCHITECTURE.md regen. Confirm agent reads templates/ARCHITECTURE.md.template before writing. Confirm output section order matches template (Dependency Rule → Directory Structure → Key Integration Points → Architecture Decision Records).
- (c) **Sprint 051b regression check** — confirm CLAUDE.md template render produces: (i) `## Dependency Rule` with `interface → application → domain ← infrastructure`, (ii) File Structure block with `/[source-root]/` + correct layer lines, (iii) `## Session Workflow` 3-step block, (iv) line count ≤80, (v) no `[CUSTOMIZE]` stubs surviving in non-customizable sections.
- (d) **Template pre-check** for templates not validated since Sprint 051b — `templates/DECISIONS.md.template` + `templates/SETUP.md.template` + `templates/CHANGELOG.md.template` alignment with DOCS_Guide.md format spec. Identify drift; flag as friction items.
- (e) Sprint file § Execution Log T5 entry covers a-d outcomes.
**Source:** design-analyst plan §10 T5 + concern #2.
**Depends on:** T1+T2+T3+T4 all complete.

### T6 — Sprint close
**Scope:** small · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer verifies: TODO.md frontmatter sprint:none; Active Sprint cleared; TASK-124 [x]; Roadmap row done; sprint file closed; CHANGELOG row prepended; lean-doc + task-decomposer SKILL.md last-validated bumped 2026-05-09)*
**Acceptance:** standard Sprint Close per SPRINT_PROTOCOLS.md (Steps 1-11 + new Step 1.2 + Step 1.5 from this sprint apply going forward to NEXT sprint promote, not THIS close).
**Depends on:** T0.5+T1+T2+T3+T4+T5.

---

## Dependency chain

```
T0.5 (ADR-030)              independent — FIRST
T1 (decomposition-spec)     depends T0.5
T2 (Sprint Promote 1.2)     depends T0.5 (parallel-safe with T1)
T3 (lean-doc Step 6)        depends T0.5
T4 (procedure.md Step 6)    depends T3 (mirrors contract)
T5 (validation)             depends T1+T2+T3+T4
T6 (sprint close)           depends T0.5+T1+T2+T3+T4+T5
```

Recommended execution: **T0.5 → T1 → T2 → T3 → T4 → T5 → T6** (per G2 plan; ADR FIRST per design-analyst Concern #3).

Pairwise file overlap matrix (non-empty):
- (T6, T3) — lean-doc SKILL.md last-validated bump (T6 overwrite, no line delta)
- (T6, T4) — task-decomposer SKILL.md last-validated bump (T6 overwrite, no line delta)
- (T6, T1) — TODO.md (T6 marks TASK-124 [x]; T1 doesn't touch TODO.md actually)

Most pairs empty. T0.5 + T1 + T2 + T3 + T4 touch distinct files. Sequential default per orchestrator policy.

---

## Cross-task risks

- **lean-doc SKILL.md cap pressure (R2 from G2).** Currently 94/100. T3 adds ~2 lines → 96/100. T6 sprint-close last-validated bump: line overwrite, 0 delta. Margin: 4 lines. Mitigation: post-T3 `wc -l` verification before any T6 SKILL.md edit.
- **T3 behavioral scope (R1 HIGH from G2).** Step 6 template-load applies to ALL docs with Canonical template entry. Highest-risk regression case: Sprint 051b CA+DDD CLAUDE.md render. Mitigation: T5 explicit regression check (5 sub-criteria).
- **T5 pre-check scope expansion (G2 Concern #2).** templates/DECISIONS.md + SETUP.md + CHANGELOG.md never validated against DOCS_Guide.md format spec since Sprint 051b. Drift likely. Mitigation: friction items flagged for TASK-125 Sprint 053b broader audit (scope-appropriate handoff; do NOT remediate this sprint).
- **Step 1.2 soft-guard ignored in AFK (R3 MEDIUM from G2).** y/n prompt may be auto-approved by AI agent in non-interactive context. Mitigation: explicit "Default: halt (n)" wording in prompt clarifies expected behavior.
- **decomposition-spec.md cross-file navigation (R4 LOW from G2).** Future reader of decomposition-spec.md must follow pointer to templates/TODO.md.template for field list. Mitigation: comment block lists field NAMES inline (not full format) — readability preserved without duplication.
- **Plugin runtime catch-up.** Sprint 049 MINOR + 050/051a/051b/052/053 PATCH (6-sprint chain). Sprint 052b release-debt resolution increasingly urgent.
- **Backwards compat.** Existing user-projects scaffolded via init have old skill versions cached locally (per Claude Code skill resolution). Sprint 053 changes ship via plugin manifest update; do NOT auto-propagate to old scaffolds. Per ADR-028 init is first-time-only — same pattern as Sprint 051a/b template changes.

---

## Sprint DoD

- [ ] T0.5 ADR-030 written (≤120 lines target ~80); decision + alternatives + consequences + cross-links to ADR-029 + Sprint 051b + Sprint 052 T7.
- [ ] T1 decomposition-spec.md lines 29-40 replaced with template-pointer + stub; surrounding framing preserved; file 139→~133.
- [ ] T2 SPRINT_PROTOCOLS.md Sprint Promote Step 1.2 inserted between Step 1 and Step 1.5; decimal numbering preserves anti-pattern lock reference; soft y/n guard with default halt.
- [ ] T3 lean-doc SKILL.md Step 6 reference-delegation form (cap 94→96/100 ≤97 budget); DOCS_Guide.md §2 rule extended w/ load-order + missing-template fallback + divergence resolution.
- [ ] T4 task-decomposer procedure.md Step 6 extended with template-read sentence (cap unchanged; SKILL.md unchanged).
- [ ] T5 validation pass: 4 dry-runs + 3 template pre-checks; results logged to Execution Log; friction items flagged for TASK-125 if applicable.
- [ ] T6 TODO.md sprint:none; Active Sprint cleared; TASK-124 [x]; Roadmap row Sprint 53 done; sprint file closed; CHANGELOG row prepended; lean-doc + task-decomposer SKILL.md last-validated bumped 2026-05-09.
- [ ] All artifacts stamp 2026-05-09.
- [ ] Cap discipline held: lean-doc SKILL.md ≤96/100 · task-decomposer SKILL.md 71/100 unchanged · all references/ no-cap files within reasonable bounds.
- [ ] release-patch NOT invoked (release-debt continues per Sprint 052b owed).
- [ ] Open questions A-J resolved at promote; zero re-litigation during execution (target).
- [ ] Carry-forward: TASK-125 broader audit (DECISIONS/SETUP/CHANGELOG template drift if surfaced at T5).

---

## Execution Log

*(populated per task during sprint-bulk auto-loop)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/adr/ADR-030-template-canonical-ownership.md` | T0.5 | NEW (≤120) — template canonical ownership ADR | low | — |
| `skills/task-decomposer/references/decomposition-spec.md` | T1 | Lines 29-40 replaced with template-pointer + stub; framing preserved | low | T5 |
| `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | T2 | Sprint Promote Step 1.2 (Backlog-empty backflow to /task-decomposer) | low | T5 |
| `skills/lean-doc-generator/SKILL.md` | T3 | Step 6 reference-delegation (cap 94→96/100) | medium | T5 |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T3 | §2 rule extended w/ load-order + fallback + divergence | low | T5 |
| `skills/task-decomposer/references/procedure.md` | T4 | Step 6 template-read sentence | low | T5 |
| `TODO.md` | T6 | TASK-124 [x]; sprint:none; Active Sprint clear; Roadmap done | low | — |
| `docs/CHANGELOG.md` | T6 | Sprint 053 row prepended | low | — |
| `docs/sprint/SPRINT-053-task-decomposer-lean-doc-collaboration-audit.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | lean-doc-generator owns templates/ as canonical format source; task-decomposer + orchestrator init CONSUME; inline format examples non-authoritative | 4-criteria match: non-trivial choice · team-wide pattern · constrains future · hard-to-reverse | ADR-030 |
| DEC-2 | Step 6 template-load is BEHAVIORAL contract for type:rigid skill (agent issues Read tool call before writing); not mechanical | type:rigid skills cannot do file I/O; behavioral instruction matches skill-class semantics | ADR-030 |
| DEC-3 | Missing template → graceful degrade to inline + flag friction (NOT hard-stop) | Hard-stop breaks docs without templates (TEST_SCENARIOS, sprint files); graceful preserves operability | ADR-030 |
| DEC-4 | Sprint Promote Step 1.2 soft guard (y/n with default halt) — NOT hard-stop | Soft preserves edge cases (P3-only, manual tasks); default halt clarifies AFK behavior | — |
| DEC-5 | T0.5 ADR-030 drafted FIRST (before T1-T4 implementation) | Prevents revert if ADR discussion surfaces scope change; design-analyst recommendation | — |

---

## Open Questions for Review

*(populated post-execution)*

---

## Retro

*(populated at sprint close)*
