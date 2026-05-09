---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: closed
plan_commit: 2eb437f
close_commit: 2266b9d
---

# Sprint 051b — Lean Architecture Templates + Primer + Workflow Vision Fold-in

**Theme:** Second half of ISSUE-04. Re-render `templates/CLAUDE.md.template` + `templates/ARCHITECTURE.md.template` against ADR-029 CA+DDD canonical (locked Sprint 051a). Add per-stack rendering via 4 new `applySubstitutions` vars (`[source-root]` · `[test-root]` · `[app-root-line]` · `[cmd-root-line]`). Write `docs/blueprint/11-lean-architecture.md` CA+DDD primer + `docs/blueprint/12-session-workflow.md` 3-step session pattern primer (TASK-127 fold-in). Codify daily workflow vision (`/prime → /lean-doc-generator → /orchestrator`) in README + CLAUDE.md template Session Workflow block.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 051a closed `460175b` (STACK_PRESETS migration + createProjectSkeleton).
**Successor:** Sprint 052 — F4 wire orphan skills + F5 tech-debt rollover (TASK-123).

---

## Why this sprint exists

ADR-029 (Sprint 051a) locked CA+DDD as canonical lean architecture for dev-flow-scaffolded user-projects. Foundation shipped: STACK_PRESETS embed CA+DDD layers + per-stack roots; `createProjectSkeleton` materializes layer dirs at init. **But user-project surfaces (CLAUDE.md template + ARCHITECTURE.md template) still carry `[CUSTOMIZE]` placeholders for File Structure / Dependency Rule / Layers / Anti-Patterns / Commands.** AI agents reading user-project hit empty placeholders → can't reason about layers; can't auto-route refactors; layer-based skill-dispatch breaks. Documentation-only lift Sprint 051a covered scaffolding; Sprint 051b closes the template surface so day-1 user-project has CA+DDD content baked in.

**TASK-127 fold-in:** user session 2026-05-08 finding — "load prime first, call lean doc to align docs, and call orchestrator to continue task. this vision is not visible i think." Plugin's intended session pattern is currently scattered across SKILL.md files. Codify in README "Daily Pattern" + CLAUDE.md template Session Workflow block + new docs/blueprint/12-session-workflow.md primer.

**Symptoms (audit at Sprint 051b promote):**

- `templates/CLAUDE.md.template` — 69 lines; lines 16-22 / 24-25 / 27-28 / 30-31 / 33-37 all `[CUSTOMIZE]` blocks for File Structure / Code Generation Order / Naming Conventions / Anti-Patterns / Commands.
- `templates/ARCHITECTURE.md.template` — 36 lines; Dependency Rule + Directory Structure both `[CUSTOMIZE]`.
- `applySubstitutions` (bin/dev-flow-init.js:84) only handles 4 substitutions: `[Project Name]` · role · `YYYY-MM-DD` · layer-block. STACK_PRESETS sourceRoot/appRoot/cmdRoot/testRoot are NOT piped into templates.
- `docs/blueprint/06c-claude-md-template.md` — embedded fenced block (lines 13-64) is older than current template (missing frontmatter / role tokens / layer-block format). Pre-existing drift.
- `docs/blueprint/` 11- + 12- slots open (max numbered = 10g). Reserved for CA+DDD primer + session workflow primer.
- `README.md` line 152 — single-line "Daily pattern: /prime to load ordered context, then check TODO.md Active Sprint block." Omits lean-doc-generator entirely.

**Locked decisions (this session AskUserQuestion + design-analyst):**
- Render strategy: extend `applySubstitutions` with 4 new vars (`[source-root]` · `[test-root]` scalar; `[app-root-line]` · `[cmd-root-line]` full-line conditional). Single-template approach; conditional-line tokens render to empty string when preset field absent (no artifact blank lines).
- CLAUDE.md template cap held at ≤80 lines via Behavioral Guidelines compression (each subsection → single `### Name — statement` line, no body text).
- 06c sync = full block replacement (already stale; not diff-apply).
- ADR-029 cited; no new ADR (extension is implementation, not new architectural decision).

---

## Open Questions (locked at promote)

- (A) **Render strategy.** **Decision:** extend `applySubstitutions` (recommended path; selected via session AskUserQuestion). 4 new substitution vars: `[source-root]` (scalar, fallback `[source-root]` sentinel) · `[test-root]` (scalar, fallback sentinel) · `[app-root-line]` (full-line conditional, empty when `appRoot` absent) · `[cmd-root-line]` (full-line conditional, empty when `cmdRoot` absent). Single template covers all stacks via conditional rendering.
- (B) **Token format.** **Decision:** `[bracket-style]` to match existing `[Project Name]` / `[role — ...]` / `YYYY-MM-DD` convention. NOT `{{mustache}}`.
- (C) **CLAUDE.md template cap.** **Decision:** ≤80 lines (per dev-flow CLAUDE.md DoD). Behavioral Guidelines compress to single-line subsections.
- (D) **Session Workflow block placement.** **Decision:** after Project Overview, before Dependency Rule. New contributor sees 3-step pattern before architecture details.
- (E) **06c-claude-md-template.md sync.** **Decision:** full block replacement of fenced template snapshot (lines 13-64). Update `last_updated` + `update_trigger`. Update line 11 cap note from "200 lines" to "80 lines."
- (F) **Blueprint primer numbering.** **Decision:** 11 = lean-architecture (≤250 lines); 12 = session-workflow (≤200 lines). Slots reserved (max numbered was 10g).
- (G) **Multi-context bounded contexts.** **Decision:** documented in 11-primer as manual upgrade path; NOT auto-scaffolded (per ADR-029 DEC-5 alternative-rejection rationale).
- (H) **README Daily Pattern.** **Decision:** replace single-line at README:152 with 5-line numbered pattern + pointer to 12-primer. Surrounding "Working on This Repo" section preserved.
- (I) **ADR.** **Decision:** none. All decisions inherit from ADR-029; substitution extension is reversible implementation. Sprint 051a retro pattern held: ADRs are for hard-to-reverse architectural decisions, not implementation.
- (J) **Date stamp.** All artifacts stamp 2026-05-09.
- (K) **Cap discipline.** CLAUDE.md ≤80 (HARD); ARCHITECTURE.md no strict cap (~45 target); 11-primer ≤250 (target ~200); 12-primer ≤200 (target ~160); sprint file ≤300; bin/dev-flow-init.js no cap (script).

---

## Plan

### T1 — Extend applySubstitutions + pipe through STACK_PRESETS + tests
**Scope:** small · **Layers:** scripts, ci · **Risk:** medium · **HITL** *(reviewer verifies: 4 new vars wired; conditional-line empty-case has no artifact newlines; 6 new tests pass; existing 43 tests still pass)*
**Acceptance:**
- (a) `bin/dev-flow-init.js` `main()` — extend `vars` object: `sourceRoot: preset.sourceRoot || ''` · `appRoot: preset.appRoot || ''` · `cmdRoot: preset.cmdRoot || ''` · `testRoot: preset.testRoot || ''`.
- (b) `applySubstitutions` (line 84) — add after layer-block replacement: scalar `[source-root]` (fallback sentinel) + scalar `[test-root]` (fallback sentinel) + full-line conditional `[app-root-line]` (renders ` /<appRoot>/   # Next.js App Router (interface adapter)` when present, empty when absent) + full-line conditional `[cmd-root-line]` (renders ` /<cmdRoot>/   # Entry root (Go cmd/)` when present, empty when absent). Block comment above documents full-line token convention.
- (c) `bin/__tests__/dev-flow-init.test.js` — 6 new tests: source-root replaced · test-root replaced · source-root fallback when empty · app-root-line full content when present · app-root-line empty when absent (no artifact newline) · cmd-root-line empty when absent.
- (d) `node --test bin/__tests__/dev-flow-init.test.js` → all pass (target ~49 tests; was 43).
- (e) Sprint file § Files Changed row recorded.
**Source:** existing applySubstitutions pattern (Sprint 050) + STACK_PRESETS migration (Sprint 051a).
**Depends on:** none.

### T2 — Re-render templates/CLAUDE.md.template + sync 06c-claude-md-template.md
**Scope:** small-medium · **Layers:** templates, docs · **Risk:** medium · **HITL** *(reviewer verifies: ≤80 line cap held; Session Workflow block present; CA+DDD content uses new substitutions; Behavioral Guidelines single-line subsections; 06c fenced block matches template content)*
**Acceptance:**
- (a) `templates/CLAUDE.md.template` rewritten ≤80 lines:
  - Frontmatter (6) · Header · Project Overview · **Session Workflow [NEW]** (3-step `/prime → /lean-doc-generator → /orchestrator` ≤5 lines) · Dependency Rule (CA arrow `interface → application → domain ← infrastructure`) · File Structure (uses `[source-root]` · layer-block · `[app-root-line]` · `[cmd-root-line]` · `[test-root]`) · Code Generation Order · Naming Conventions · Anti-Patterns · Commands · Definition of Done · Behavioral Guidelines (4 subsections, each → single `### Name — statement` line, NO body text).
- (b) `docs/blueprint/06c-claude-md-template.md`:
  - Frontmatter `last_updated` → `2026-05-09` · `update_trigger` adds "CLAUDE.md template change."
  - Line 11 cap note: `Keep it under 200 lines` → `Keep it under 80 lines (dev-flow cap)`.
  - Fenced block (lines 13-64) replaced with new CLAUDE.md template content (full replacement, not diff).
- (c) Render mentally for each stack preset — confirm File Structure renders correctly per stack (node-express src/+5 layers+tests; react-next src/+4 layers+app/+tests; python-fastapi app/+5 layers+tests; go-gin internal/+5 layers+cmd/, no tests).
- (d) Sprint file § Files Changed row recorded.
**Source:** ADR-029 + existing template + design-analyst plan section 3.
**Depends on:** T1.

### T3 — Re-render templates/ARCHITECTURE.md.template
**Scope:** small · **Layers:** templates · **Risk:** low · **HITL** *(reviewer verifies: per-layer purpose section present; per-stack File Structure uses new substitution tokens; ADR-029 + 11-primer cross-links present)*
**Acceptance:**
- (a) `templates/ARCHITECTURE.md.template` rewritten:
  - Frontmatter preserved.
  - Dependency Rule: CA arrow with annotations (`interface → application → domain ← infrastructure`; domain has zero outward deps; infrastructure depends on domain via interfaces never reverse).
  - Directory Structure: uses `[source-root]` · layer-block · `[app-root-line]` · `[cmd-root-line]` · `[test-root]` tokens with inline per-layer purpose comments (domain · application · infrastructure · interface · shared).
  - Key Integration Points table preserved.
  - Pointer added → `docs/blueprint/11-lean-architecture.md`.
  - ADR pointer preserved.
- (b) Sprint file § Files Changed row recorded.
**Source:** ADR-029 + existing ARCHITECTURE.md template + 11-primer outline.
**Depends on:** T1.

### T4 — NEW docs/blueprint/11-lean-architecture.md CA+DDD primer
**Scope:** small-medium · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: ≤250 lines; 5-layer table; CA arrow; per-stack roots; react-next variant; multi-context upgrade path; 3 anti-patterns; per-stack examples; ADR-029 cross-link)*
**Acceptance:**
- (a) NEW `docs/blueprint/11-lean-architecture.md` (≤250 lines target ~200):
  - Frontmatter
  - Why CA+DDD? (problem + ADR-029 pointer)
  - The 5-Layer Canonical Set (table: layer / purpose / what-lives / what-does-NOT)
  - Dependency Rule (CA arrow + diagram)
  - Per-Stack Source Root Convention (table: stack / sourceRoot / auxRoot / testRoot)
  - react-next 4-Layer Variant (Next.js app/ IS interface adapter)
  - Single Bounded Context (default) + Multi-Context Upgrade Path (manual; not auto-scaffolded)
  - Anti-Patterns (Anemic Domain · Kitchen-Sink shared · Framework Leak into Domain)
  - Per-Stack File Structure Examples (4 stacks shown as indented tree)
  - Quick Reference + pointer to 12-session-workflow.md.
- (b) Sprint file § Files Changed row recorded.
**Source:** ADR-029 + design-analyst plan section 6.
**Depends on:** T2 + T3 (consistency with template content).

### T5 — NEW docs/blueprint/12-session-workflow.md + README Daily Pattern expansion
**Scope:** small-medium · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: ≤200 lines; 3-step pattern; per-step detail; full-session example; README expansion 5-line block + pointer)*
**Acceptance:**
- (a) NEW `docs/blueprint/12-session-workflow.md` (≤200 lines target ~160):
  - Frontmatter
  - The Problem (context resets · stale docs · execute-without-plan)
  - The 3-Step Pattern (`/prime → /lean-doc-generator → /orchestrator`)
  - When Each Step Is Optional
  - Step 1 / 2 / 3 Detail blocks
  - Full Session Example (narrative)
  - Quick Reference + pointer to 11-lean-architecture.md.
- (b) `README.md` line 152 replaced with 5-line numbered pattern + pointer to 12-primer. Surrounding "Working on This Repo" section structure preserved.
- (c) Sprint file § Files Changed row recorded.
**Source:** TASK-127 backlog row + design-analyst plan section 7.
**Depends on:** none (parallelizable with T2-T4 content-wise; sequential default).

### T6 — Sprint close: TODO.md frontmatter + Active Sprint clear + Changelog rotate + Roadmap row + sprint file close
**Scope:** small · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer verifies: frontmatter `sprint: none` at close; Active Sprint cleared; TASK-122b + TASK-127 marked `[x]` in Backlog P0; Roadmap Sprint 051b row updated to closed; sprint file close stamp)*
**Acceptance:**
- (a) `TODO.md` frontmatter `sprint: 051b` (set at promote) → `sprint: none` (at close).
- (b) `TODO.md` Active Sprint block cleared; `> Next:` updates to Sprint 052 (F4 + F5 + TASK-123).
- (c) `TODO.md` Backlog P0 — TASK-122b + TASK-127 marked `[x]` with close commit reference.
- (d) `TODO.md` Roadmap row Sprint 51b updated from `queued` to `done` with close commit SHA.
- (e) Sprint file `status: in_progress` → `closed` + `close_commit: <SHA>` + Execution Log entries per task + Retro section.
- (f) `docs/CHANGELOG.md` prepend Sprint 051b row (files changed: bin/dev-flow-init.js · bin/__tests__/dev-flow-init.test.js · templates/CLAUDE.md.template · templates/ARCHITECTURE.md.template · docs/blueprint/06c-claude-md-template.md · docs/blueprint/11-lean-architecture.md · docs/blueprint/12-session-workflow.md · README.md).
**Source:** Sprint 051a close pattern + design-analyst plan T6 micro-tasks.
**Depends on:** T1+T2+T3+T4+T5.

---

## Dependency chain

```
T1 (applySubstitutions extension)   independent
T2 (CLAUDE.md template + 06c sync)  depends T1
T3 (ARCHITECTURE.md template)       depends T1
T4 (blueprint/11 primer)            depends T2 + T3 (content consistency)
T5 (blueprint/12 + README)          independent (parallelizable; sequential default)
T6 (sprint close)                   depends T1+T2+T3+T4+T5
```

Recommended execution: **T1 → T2 → T3 → T4 → T5 → T6** (sequential per overlap-gate default).

Pairwise file overlap matrix: ALL empty. Parallel-eligible after T1, but sequential default per orchestrator policy.

---

## Cross-task risks

- **CLAUDE.md template cap (≤80 lines).** Math: 75-78 with disciplined Behavioral Guidelines compression (single-line subsections, no body text). Implementer must NOT use dev-flow's own `.claude/CLAUDE.md` (which carries body text under each guideline) as compression reference. T2 micro-task spec is explicit. Cap pressure is the highest-risk surface this sprint.
- **06c stale snapshot.** `docs/blueprint/06c-claude-md-template.md` fenced block is older than live template (pre-frontmatter, pre-layer-block format). T2 sync = full content replacement, not diff. Diff-based approach carries forward stale content.
- **Conditional-line tokens new pattern.** `[app-root-line]` / `[cmd-root-line]` are full-line tokens that replace entire line including comment text. Tests must cover empty-string case to avoid artifact blank lines in rendered output for stacks lacking those roots. T1 acceptance (e) covers explicitly.
- **Per-stack render correctness.** react-next has 4 layers (no `interface`) but layer-block substitution handles this (preset.layers excludes `interface`). Template's File Structure block uses layer-block + per-layer purposes static — for react-next, 4 layers render in layer-block with 5 purposes statically described. Mitigation: list layer purposes inline in layer-block substitution OR cap purpose section to common 4-layer set + footnote interface in 5-layer stacks. Design-analyst flagged Risk 4; resolved during T2 implementation.
- **Plugin runtime catch-up.** Sprint 049 release-debt (skill drop + rename) + Sprint 050 PATCH + Sprint 051a PATCH + Sprint 051b PATCH (this sprint) accumulating. Manual reconcile pending Sprint 052b release-debt resolution sprint (PROMOTED P2→P0 per session 2026-05-08 audit).
- **Backwards compat.** `applySubstitutions` extension is additive (new vars; existing tokens unchanged). Old user-projects scaffolded pre-Sprint-051b unaffected — their CLAUDE.md was already rendered + checked-in; substitution function only runs at init. No regression risk.

---

## Sprint DoD

- [x] T1 applySubstitutions extended with 5 new tokens (3 scalar passthrough + 3 full-line conditional — `[test-root-line]` added during T2 verification). Main() vars piped from STACK_PRESETS. 8 new tests pass; 51/51 total via `node --test` (was 43).
- [x] T2 templates/CLAUDE.md.template 74/80 cap held; Session Workflow block placed after Project Overview; CA+DDD content uses new substitutions; Behavioral Guidelines compressed to single-line subsections. 06c snapshot fully synced; frontmatter + cap note updated; 8-token substitution table added.
- [x] T3 templates/ARCHITECTURE.md.template uses CA arrow + per-layer purpose + new substitution tokens; pointer to 11-primer added; ADR pointer preserved.
- [x] T4 docs/blueprint/11-lean-architecture.md 236/250 cap held; 5-layer table + dependency rule + per-stack roots + react-next variant + multi-context upgrade + 3 anti-patterns + per-stack examples + Quick Reference; ADR-029 cross-link.
- [x] T4.5 (in-sprint expansion) — lean-doc-generator skill wired to 11-primer (DOCS_Guide.md § Core Files + SPRINT_PROTOCOLS.md Sprint Close architecture check); orphan-primer risk closed.
- [x] T5 docs/blueprint/12-session-workflow.md 163/200 cap held; 3-step pattern + per-step detail + full-session example + Quick Reference; pointer to 11-primer. README.md line 152 replaced with 5-line numbered block + pointer.
- [x] T5.5 (in-sprint expansion) — docs/blueprint/03-workflow-phases.md (87→103) + 08-orchestrator-prompts.md (397→210) refreshed to current 4-mode/2-gate model; stale-blueprint coherence gap closed.
- [x] T6 TODO.md `sprint: none` at close; Active Sprint cleared; TASK-122b + TASK-127 marked `[x]`; Roadmap row Sprint 51b done; sprint file closed; CHANGELOG row prepended.
- [x] All artifacts stamp 2026-05-09.
- [x] Cap discipline held: CLAUDE.md 74/80 · 11-primer 236/250 · 12-primer 163/200 · sprint file <300 (this file).
- [x] release-patch NOT invoked (release-debt continues per Sprint 052b owed).
- [x] Zero unrelated edits — only sprint-intent files staged.
- [x] Open questions A-K resolved at promote; mid-execution scope expansions (T4.5 + T5.5) explicitly user-approved via AskUserQuestion (not silent scope drift).

---

## Execution Log

### 2026-05-09 | T1 done — `2eb437f`
applySubstitutions extended at `bin/dev-flow-init.js:84` with 4 new vars piped from STACK_PRESETS. Two token classes: scalar (`[source-root]` + `[test-root]` w/ sentinel passthrough) + full-line conditional (`[app-root-line]` + `[cmd-root-line]` — entire line vanishes when var absent, no artifact newlines). 6 new tests cover both presence + absence cases. 49/49 pass via `node --test bin/__tests__/dev-flow-init.test.js` (was 43).

### 2026-05-09 | T2 done — `f40900e`
templates/CLAUDE.md.template re-rendered against ADR-029 — 74/80 cap held via Behavioral Guidelines compression (each subsection → single `### Name — statement` line, no body text). New Session Workflow block (TASK-127 fold-in) placed after Project Overview. CA arrow Dependency Rule. File Structure block uses [source-root] + layer-block + [app-root-line] + [cmd-root-line] + [test-root-line] for clean per-stack render.

**T2 surfaced T1 extension:** go-gin omits `testRoot` per Go convention; `[test-root]` scalar with sentinel passthrough would have rendered broken `/[test-root]/` literal in go-gin output. Added `[test-root-line]` full-line conditional — mirrors app-root-line/cmd-root-line pattern. +2 tests (51/51 total). Dry-render verified clean for all 4 stacks: node-express src/+tests/ · react-next src/+app/+tests/ (4 layers) · python-fastapi app/+tests/ · go-gin internal/+cmd/ (no tests/ — line vanishes).

`docs/blueprint/06c-claude-md-template.md` synced (full block replacement; was pre-frontmatter older snapshot — confirmed pre-existing drift). Frontmatter `last_updated` + `update_trigger` updated. Added 8-token substitution table.

### 2026-05-09 | T3 done — `0cf9cad`
templates/ARCHITECTURE.md.template rewritten — 52 lines. CA arrow Dependency Rule + 5-layer per-line purpose section. Directory Structure uses new substitution tokens. Variant notes co-located (react-next 4-layer; go-gin tests-alongside-source). Pointer to 11-primer + ADR pointer extended w/ ADR-NNN convention reference.

### 2026-05-09 | T4 + T4.5 done — `d5aa753`
NEW `docs/blueprint/11-lean-architecture.md` (236/250 cap held). Initial draft 299 lines; trimmed ~63 lines via ASCII-arrow → text + anti-pattern code-blocks → prose. 9 sections: Why CA+DDD · 5-Layer Canonical Set · Dependency Rule · Per-Stack Source Root · react-next 4-Layer Variant · Single Bounded Context Default · Multi-Context Upgrade Path · Anti-Patterns (anemic domain · kitchen-sink shared · framework leak) · Per-Stack File Structure Examples · Quick Reference.

**T4.5 in-sprint fold-in (user finding 2026-05-09):** orphan-primer risk — 11-primer disconnected from `/lean-doc-generator` skill. Wired minimal cross-references: DOCS_Guide.md § Core Files row for ARCHITECTURE.md cites 11-primer + ADR-029; SPRINT_PROTOCOLS.md § Sprint Close architecture check cites ADR-029 + 11-primer for layer changes. Defers deeper skill audit to TASK-125 Sprint 053b. Closes orphan-primer risk for the 2-sprint gap.

### 2026-05-09 | T5 done — `879e013`
NEW `docs/blueprint/12-session-workflow.md` (163/200 cap held). 7 sections: The Problem · The 3-Step Pattern · When Each Step Is Optional · Step 1 /prime · Step 2 /lean-doc-generator · Step 3 /orchestrator · Full Session Example · Quick Reference. README.md line 152 expansion: 1-line "Daily pattern" → 5-line numbered block + pointer to 12-primer. Closes TASK-127 (vision-not-visible finding).

### 2026-05-09 | T5.5 done — `0c970ff` (in-sprint expansion)
**Mid-sprint user finding:** `docs/blueprint/03-workflow-phases.md` + `docs/blueprint/08-orchestrator-prompts.md` carrying stale 6-mode/3-gate mental model while CONTEXT.md + orchestrator SKILL.md (authoritative) describe 4-mode/2-gate. Frontmatter self-reported `status: current` so lean-doc staleness scan never caught it.

Refresh: 03-workflow-phases.md 87→103 lines (mode table · gate table · phases per mode · agent dispatch · hard stops · cross-links). 08-orchestrator-prompts.md 397→210 lines (deprecated Gate 0/1/2 prompts + full/hotfix/review/resume mode prompts trimmed; Parse Path A/B + G1 + Grill + G2 + Sprint-Bulk Batched + Implement + Review + Commit + Sprint Close + Hard Stops kept). Cross-link mesh: 03 ↔ 08 ↔ 12 ↔ CONTEXT.md ↔ orchestrator/SKILL.md.

### 2026-05-09 | sprint close — `2266b9d`
This commit. ADR-029 user-project surfaces fully landed: CLAUDE.md template + ARCHITECTURE.md template + blueprint/11-lean-architecture.md primer + lean-doc-generator wire + applySubstitutions per-stack render. TASK-127 vision codified: blueprint/12-session-workflow.md primer + README Daily Pattern + CLAUDE.md Session Workflow block. T5.5 closed unrelated stale-blueprint coherence gap. release-patch NOT invoked (Sprint 052b release-debt resolution still owed).

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `bin/dev-flow-init.js` | T1 | applySubstitutions extension (4 new vars); main() vars piped from STACK_PRESETS | medium | T1-C |
| `bin/__tests__/dev-flow-init.test.js` | T1 | 6 new tests covering new vars + conditional-line empty case | low | self |
| `templates/CLAUDE.md.template` | T2 | CA+DDD per-stack render via new substitutions; Session Workflow block; Behavioral Guidelines compressed | medium | — |
| `docs/blueprint/06c-claude-md-template.md` | T2 | Frontmatter + cap note + fenced block full replacement (sync to live template) | low | — |
| `templates/ARCHITECTURE.md.template` | T3 | CA arrow + per-layer purpose + new substitution tokens + 11-primer pointer | low | — |
| `docs/blueprint/11-lean-architecture.md` | T4 | NEW (≤250) — CA+DDD primer | low | — |
| `docs/blueprint/12-session-workflow.md` | T5 | NEW (≤200) — 3-step session pattern primer | low | — |
| `README.md` | T5 | Line 152 → 5-line Daily workflow pattern + pointer to 12-primer | low | — |
| `TODO.md` | T6 | sprint: 051b at promote → none at close; Active Sprint clear; TASK-122b + TASK-127 [x]; Roadmap row done | low | — |
| `docs/CHANGELOG.md` | T6 | Sprint 051b row prepended | low | — |
| `docs/sprint/SPRINT-051b-lean-architecture-templates-primer.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | Extend `applySubstitutions` with 4 new vars (`[source-root]` · `[test-root]` scalar; `[app-root-line]` · `[cmd-root-line]` full-line conditional) | Single-template approach matches existing pattern; conditional-line tokens cleanly handle stack-specific extras (appRoot for react-next; cmdRoot for go-gin) without multi-template proliferation | inherits ADR-029 |
| DEC-2 | CLAUDE.md template cap held at ≤80 lines via Behavioral Guidelines compression (single-line subsections, no body text) | Cap discipline (per dev-flow CLAUDE.md DoD); Session Workflow block + CA+DDD content fits within 80 with disciplined trim | — |
| DEC-3 | 06c-claude-md-template.md sync = full block replacement, not diff | Pre-existing drift (06c older than live template); diff-apply carries forward stale content | — |
| DEC-4 | docs/blueprint/11 = lean-architecture; docs/blueprint/12 = session-workflow | Reserved sequential slots (max numbered was 10g); 11 primes 12 conceptually (architecture before workflow) | — |
| DEC-5 | README Daily Pattern expansion = 5-line numbered block at line 152 + pointer to 12-primer | TASK-127 fold-in surface; 1-line current omits lean-doc-generator; 5-line block makes 3-step pattern explicit | — |

---

## Open Questions for Review

*(none surfaced post-execution — all 11 promote-time OQs (A-K) resolved cleanly. Two mid-execution scope expansions (T4.5 lean-doc wire + T5.5 03/08 refresh) handled via explicit AskUserQuestion + user-approved before commit. Pattern from Sprint 050/051a held: recon-first + pre-resolve OQs.)*

---

## Retro

### Worked

- **Recon-first compounded across 3 sprints** (Sprint 050 + 051a + 051b). Read `applySubstitutions` + `STACK_PRESETS` + existing templates + 06c snapshot + README + plugin.json BEFORE writing the plan. Surfaced critical design question at G1 (per-stack render strategy → AskUserQuestion → user picks Extend applySubstitutions). Plan landed without speculative scope.
- **Conditional-line token pattern paid off.** `[app-root-line]` / `[cmd-root-line]` / `[test-root-line]` cleanly handle stack-specific extras (Next.js app/, Go cmd/, non-Go tests/) without multi-template proliferation. Single template covers all 4 stacks. Pattern reusable for future stack-specific render needs.
- **T2 surfaced T1 gap (test-root sentinel passthrough broken for go-gin) BEFORE commit.** Dry-render verification across all 4 stacks via Node REPL caught the bug. Added `[test-root-line]` conditional in T1 extension before T2 closed. Pattern: verify dry-render across all variants, not just one stack.
- **Cap discipline held under pressure.** CLAUDE.md ≤80 cap was tightest budget (74/80 actual). Behavioral Guidelines compression to single-line subsections (no body text) was the load-bearing decision. Followed design-analyst's explicit guidance to NOT use dev-flow's own .claude/CLAUDE.md as compression reference (it carries body text).
- **User-driven scope expansion via explicit AskUserQuestion gates.** T4.5 (orphan-primer risk) + T5.5 (stale 03/08 blueprints) both surfaced mid-execution by user finding. Each expansion offered as 3-4 options via AskUserQuestion; user explicitly chose. Avoided silent scope drift; explicit user-approval recorded in execution log.
- **Doc-rot finding compounding.** T5.5 caught `docs/blueprint/03 + 08` carrying 6-mode/3-gate mental model (frontmatter `status: current`). Lean-doc's staleness scan misses self-reported-current docs. Pattern carried forward: TASK-125 (broader feature-usage audit) should add "audit blueprint files for mode/gate alignment with CONTEXT.md."

### Friction

- **Self-reported `status: current` defeats staleness scan.** Lean-doc-generator skill checks `last_updated >60 days` + explicit `stale`/`needs-review` markers. Files updated within 60 days but carrying outdated mental model still pass. T5.5 surfaced this gap — added to TASK-125 scope deferred. Mitigation pending: lean-doc cross-validate file content claims against authoritative source (CONTEXT.md for modes/gates).
- **Release-debt depth +1.** Sprint 049 MINOR + Sprint 050 PATCH + Sprint 051a PATCH + Sprint 051b PATCH (4 sprints accumulating). Sprint 052b release-debt resolution sprint becomes more urgent. Currently P0 per session 2026-05-08 audit promotion.
- **Pre-existing 06c drift uncovered, not introduced.** `06c-claude-md-template.md` was older snapshot than live template even before Sprint 051b — pre-frontmatter, pre-layer-block format. Suggests blueprint/06* family may have additional drift; T5.5 only audited 03 + 08. Likely candidates for next audit: 04-subagents.md · 05-skills.md · 06a-settings.md · 06b-scripts.md · 09-customization.md · 10*-modes.md.
- **Sprint scope grew 6 → 8 tasks (T4.5 + T5.5 fold-ins).** Both user-surfaced findings; both explicitly approved. Sprint Mode default of pre-locked task list prevented silent drift but allowed approved expansion. Pattern works; cost was ~2 extra commits + ~30min execution time. Not a regression — coherence-gap closure paid for itself.
- **Plugin runtime catch-up still blocking.** Sprint 049-051b release-debt + tooling sprint deferral means current Claude Code session doesn't reflect plugin changes (skill manifest cached). Reload-plugins partially helps (5 hooks · 12 agents · 0 skills loaded — plugin reload showing 0 skills suggests skill manifest staleness still). Tooling sprint Sprint 052b will reconcile.

### Pattern candidates (carried forward)

1. **Conditional-line tokens for stack-specific rendering.** Full-line tokens that vanish when var absent. Cleaner than multi-template per-stack proliferation. Reusable for any future stack-conditional content (e.g., language-specific lint command line, framework-specific test runner line).
2. **Dry-render verification across all variants.** Before committing template changes, render via Node REPL for all stack presets and inspect output. Catches sentinel-passthrough vs missing-conditional bugs that single-stack manual review misses.
3. **Mid-execution scope expansion via explicit AskUserQuestion.** When AI surfaces a finding mid-sprint that wasn't in original task list, present 3-4 options + recommendation via AskUserQuestion. User-chosen expansion ≠ silent scope drift. Pattern holds when expansion closes coherence gaps surfaced by recent recon.
4. **Self-reported-current ≠ actually-current.** Frontmatter `status: current` is necessary but not sufficient. Lean-doc-generator's staleness scan should cross-validate doc content against authoritative source files (CONTEXT.md, ADRs, SKILL.md mode/gate tables). Surface to TASK-125.
5. **Cross-link mesh as drift-prevention.** When refreshing blueprint files (T5.5), each updated file points at every other authoritative source. Forward navigation works regardless of entry point. Reduces probability of future drift compounding silently.

### Surprise log

- T1: 4 substitution vars planned at G2; +1 (`[test-root-line]`) added during T2 verification when go-gin render exposed sentinel passthrough bug. Pattern: substitution extensions surface during template render, not during substitution-function design. Dry-render is the gate.
- T2: 06c snapshot was 5+ commits stale before this sprint touched it. design-analyst flagged at G2 review; would have been a silent latent failure if untouched. Confirms: snapshot files (06c-style "embedded-template-of-template") are highest-risk drift surfaces.
- T4: 11-primer initial draft 299 lines vs cap 250. Trim ~50 lines via two patterns: ASCII arrow diagram → text line; anti-pattern code blocks → prose+example-name. Pattern: visual diagrams cost lines but rarely add information density.
- T4.5: orphan-primer risk surfaced via user question "is this blueprint connect with skills we already have lean doc generator?" — not from automated check. Confirms: human pattern-noticing remains higher-bandwidth than skill-trigger detection for cross-skill coherence.
- T5.5: stale 03 + 08 surfaced via user question "is this different with orchestrator prompt and workflow phase?" — same pattern. Both T4.5 and T5.5 traced back to user pattern-noticing during a "is this connected" check at primer-write time. Pattern: when adding a new primer, ask "what existing surfaces does this primer's content overlap with, and are those surfaces current?"
- close: 51 tests pass; all caps held; 7 commits across 6 tasks (T4 was 1 commit covering T4 + T4.5; T5 was 1 commit). Two user-surfaced scope expansions both explicitly approved. Combination compounding: recon-first + dry-render + AskUserQuestion-gated expansion + cross-link mesh = high-confidence sprint shape.
