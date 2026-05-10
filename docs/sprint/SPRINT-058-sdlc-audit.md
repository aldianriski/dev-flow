---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: planning
plan_commit: pending
close_commit: pending
---

# Sprint 058 — SDLC Coverage Audit (read-only sweep)

**Theme:** Map 6 SDLC phases (Requirements / Design / Implementation / Testing / Deployment / Maintenance) against 16 skills + 7 agents; produce coverage matrix + gap analysis + remediation plan that scopes Sprint 059 (audit-driven cleanup batch · v4.0.0 MAJOR) and Sprint 060 (testing skill · v4.1.0 MINOR). Read-only — no SKILL.md / CONTEXT.md edits, no version bump. Workstream C (item 8) from `refined-task-list.md`.

**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 057 closed (`08c1178`) · Release 3.1.0 Flow Grill shipped (`27a7dd1`).
**Closes:** TASK-140..143 (TODO.md § Backlog P0 SDLC Audit cluster).
**Promote method:** First sprint promoted via Flow Grill v3.1.0 (eats own dogfood; cached plugin still 3.0.0 so loop ran inline from source FLOW_GRILL.md).

## Why this sprint exists

Per refined-task-list.md item 8 + Sprint 057 conversation surfacing R1/R2/R3 redundancy candidates: dev-flow plugin needs an objective inventory of what each skill+agent does relative to SDLC phases BEFORE Sprint 059 makes hard-to-reverse cleanup decisions. Recon-first discipline (validated Sprint 050+051a per memory): read existing impl + tests + deps before planning the cleanup sprint.

The audit answers four questions:
1. **Coverage** — which SDLC phases are well-covered, which are gaps?
2. **Redundancy** — which skills overlap each other; which auto-fire vs only-manual?
3. **Invocation** — which agents are spawned; which are file-only with zero invocations?
4. **Sequencing** — exactly what scope clarifies for refined-list items 3/4/5/7 before Sprint 059/060 plans them?

## Pre-locked decisions (7 — Flow Grill ledger 2026-05-10)

- (D-A) Audit-only scope. No R1/R2/R3 remediation in 058. No items 3/4/5/7 implementation in 058. Remediation lands Sprint 059 (v4.0.0 MAJOR) + Sprint 060 (v4.1.0 MINOR).
- (D-B) Docs-only diff → release-patch SKIP path (Sprint 047 ADR-025 DEC-8 + Sprint 050 docs-only rule). No `plugin.json` / `marketplace.json` modification.
- (D-C) Audit doc location: `docs/audit/SDLC-coverage-2026-05-10.md`. Date stamp matches today; no drift (Step 0b PASS).
- (D-D) HITL gates at T1 (matrix structure approval), T2 (verdicts approval), T3 (remediation plan approval). T4 = AFK pure git ops.
- (D-E) Coverage matrix cell schema: `PRIMARY` / `SECONDARY` / `NONE` (3 states locked; no other values).
- (D-F) Verdict schema for components: `KEEP` / `MERGE` / `REMOVE` / `RESCOPE` (4 states locked; Sprint 059 cleanup must fit this schema).
- (D-G) **User-outcome lens applies sprint-wide.** Every verdict in T2 explicitly tagged with the user-project outcome (O1-O8 per `docs/USER-OUTCOMES.md` / ADR-026) it serves. Locks the user mid-Flow-Grill refinement; ensures audit findings map back to project-resolution value, not just internal hygiene.

## Anti-slip (G1 fields per ADR-031)

- **focus**: audit only — surface findings + remediation plan; do NOT implement R1/R2/R3 verdicts or items 3/4/5/7 in this sprint
- **context-budget**: ~10-15k (T1 ~5k inventory scan · T2 ~3k verdicts · T3 ~3k remediation plan · T4 ~1k audit close + README update + commit)
- **explicit-gaps**: Sprint 059 — R1 arch-grill removal · R2 redundancy cleanup · R3 dispatcher consolidation · items 3/4/5 implementation. Sprint 060 — item 7 testing skill build. No code/SKILL/CONTEXT.md edits this sprint.
- **done-confirmation**: [audit doc with 3 complete sections (Matrix · Gap Analysis · Remediation Plan) lands in repo AND Sprint 059 task seed list emerges with ≥3 seeds + Sprint 060 with ≥2 seeds] WHEN [TASK-143 close commit lands]

## Plan

### T1 — Build SDLC coverage matrix (23 components × 6 phases)

**Acceptance:**
1. `docs/audit/SDLC-coverage-2026-05-10.md` § Coverage Matrix contains a 23-row × 6-column table (16 skills + 7 agents × Requirements/Design/Implementation/Testing/Deployment/Maintenance).
2. Each cell marked `PRIMARY` / `SECONDARY` / `NONE` per D-E schema, with one-line evidence pointer (SKILL.md line OR agent file OR `skill-dispatch.md` row).
3. Auto-fire flag column populated for skills (yes/no, source `hooks.json` + skill-dispatch.md).
4. Invoked-by column populated for agents (skill name(s) OR explicit `zero invocations`).
5. Pure scan output — no opinion or verdict in this section.

**Scope:** IN — coverage matrix + auto-fire/invoked-by columns. OUT — gap ranking, verdicts, remediation (T2/T3).
**Files:** `docs/audit/SDLC-coverage-2026-05-10.md` NEW.
**Tests:** N/A (audit doc).
**Risk:** low — single layer, no API, read-only scan.
**Layers:** `docs`.
**Depends on:** —.
**HITL** stop-point at T1 close (matrix structure approval gates T2).

### T2 — Gap analysis + redundancy verdicts (O-tagged per D-G)

**Acceptance:**
1. § Gap Analysis with phase-coverage gaps ranked (NONE-column row count per phase + named gap, e.g. "Testing: 0 PRIMARY → highest-rank gap").
2. R1 verdict on `architecture-grill` — KEEP / MERGE-into-design-analyst / REMOVE / RESCOPE — with ≥3-line rationale.
3. R2 verdicts per overlap pair — `prime`↔`init` · `release-manager`↔`release-patch` · `pr-reviewer`↔`code-reviewer` · `security-auditor`↔`security-analyst` — same KEEP/MERGE/REMOVE/RESCOPE schema.
4. R3 verdict on `agents/dispatcher.md` with grep evidence (`subagent_type: dispatcher` count across all SKILL.md / scripts).
5. Items 3/4/5/7 each surfaced with one-line scope-clarification entry pointing at Sprint 059 (3/4/5) or Sprint 060 (7).
6. **Every verdict tagged with user-project outcome served (O1-O8 per `docs/USER-OUTCOMES.md` / ADR-026 lens) per D-G.** Format: `verdict: KEEP/MERGE/REMOVE/RESCOPE → outcome: O5 flow + O8 reliability` (multi-tag allowed).

**Scope:** IN — verdicts on all R1/R2/R3 + items 3/4/5/7 + gap ranking. OUT — Sprint 059/060 task seeds (T3).
**Files:** `docs/audit/SDLC-coverage-2026-05-10.md` § Gap Analysis (extends T1 doc).
**Tests:** N/A.
**Risk:** low — synthesis of T1, no shared middleware.
**Layers:** `docs`.
**Depends on:** TASK-140 (matrix as input).
**HITL** stop-point at T2 close (verdicts drive Sprint 059 perimeter).

### T3 — Remediation plan (Sprint 059 + Sprint 060 task seeds)

**Acceptance:**
1. § Remediation Plan with Sprint 059 task seed list (≥3 seeds · v4.0.0 MAJOR · single-MAJOR consolidation per release-debt discipline).
2. Each Sprint 059 seed = 1-line title + estimated size (S/M/L) + risk + dependency on T141 verdict + outcome tag.
3. Sprint 060 task seed list (≥2 seeds · v4.1.0 MINOR · testing skill per refined-list item 7) — each seed = 1-line title + grouping convention reference (unit / integration / e2e / regression) + outcome tag.
4. Explicit Sprint 058 → 059 → 060 sequencing diagram (text or ASCII).
5. Deferred / out-of-scope list for any verdict that won't land in Sprint 059 or 060 within this multi-sprint plan.

**Scope:** IN — Sprint 059/060 seed lists + sequencing + deferred list. OUT — actually decomposing seeds into TASK-NNN entries (Sprint 059 promote does that).
**Files:** `docs/audit/SDLC-coverage-2026-05-10.md` § Remediation Plan (extends T1+T2 doc).
**Tests:** N/A.
**Risk:** low — write-scope is single doc.
**Layers:** `docs`.
**Depends on:** TASK-141 (verdicts as seed source).
**HITL** stop-point at T3 close (locks Sprint 059+060 scope perimeter).

### T4 — Audit doc close + README update + Sprint 058 close commit

**Acceptance:**
1. Audit doc committed with all 3 sections complete (Matrix · Gap Analysis · Remediation Plan).
2. **`README.md` updated** to reflect: audit doc location pointer (under "Daily Pattern" or new "Recent Sprints" subsection if natural fit) · multi-sprint plan visibility (Sprint 058 done · 059 cleanup planned · 060 testing planned) · current Sprint state (between 058 close and 059 promote).
3. Sprint file `SPRINT-058-sdlc-audit.md` retro section populated (Worked / Friction / Pattern, ≤6 bullets each per History Hygiene ADR-034).
4. CHANGELOG row prepended (`File | Change | ADR` for audit doc + README; no version bump row since docs-only).
5. TODO.md Active Sprint cleared to `→ — none —`; frontmatter `sprint: 058 → 059`; Roadmap Sprint 058 row `(planned) → (done — <SHA>)`.
6. Close commit message: `sprint(058): close — SDLC audit (docs-only, no version bump)`.
7. Release-patch SKIP confirmed (docs-only diff per existing rule); no `plugin.json` or `marketplace.json` modification.

**Scope:** IN — audit doc commit + README update + sprint file retro + CHANGELOG + TODO + close commit. OUT — Sprint 059 promotion (next session).
**Files:** `docs/audit/SDLC-coverage-2026-05-10.md` final write · `README.md` EDIT · `docs/sprint/SPRINT-058-sdlc-audit.md` EDIT (retro) · `docs/CHANGELOG.md` EDIT (row prepend) · `TODO.md` EDIT (Active Sprint clear + Roadmap update).
**Tests:** N/A.
**Risk:** low — pure docs + git ops; no behavior change.
**Layers:** `docs, ci`.
**Depends on:** TASK-142.
**AFK** — pure git ops post-T142 lock.

## Open Questions for Review

*(empty at lock — all questions resolved during Flow Grill iteration; ledger fully populated; 0 follow-up triggers fired)*

## Execution Log

*(empty — appended during sprint execution)*

## Files Changed

*(empty — populated during execution; one row per file: `File | Task | Change (one-line WHY) | Risk | Test added`)*

## Decisions

*(empty — populated during execution for architectural-level decisions; D-A..D-G already captured in Pre-locked decisions section above)*

## Retro

*(empty — populated at close: Worked / Friction / Pattern candidates / TD prompts; ≤6 bullets each per ADR-034 History Hygiene)*
