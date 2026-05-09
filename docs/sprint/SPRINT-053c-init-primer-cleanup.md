---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: active
plan_commit: a2c54b9
close_commit: tbd
---

# Sprint 053c — Init-Mode Primer Cleanup (TASK-132)

**Theme:** TASK-132. Carry-forward from Sprint 053b T7 — `docs/blueprint/10a-init.md` primer entirely describes deprecated `init-analyst` agent workflow (4 refs at L32 / L48 / L102 / L110); per Sprint 050 ADR-028, init = `bin/dev-flow-init.js` script. Multi-line rewrite (whole-section), so deferred from Sprint 053b ≤1-line propagation pattern. Also `docs/blueprint/04-subagents.md` ASCII diagram L22-34 still draws `INIT ANALYST` Tier-3 background-agent node — multi-line collapse.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 053b closed `071f598` (TASK-125 broader feature-usage audit sweep).
**Closes:** TASK-132 (Init-Mode Primer Cleanup).

## Why this sprint exists

Sprint 050 ADR-028 locked canonical init contract: `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js` is the single source of truth. Skill flow + script flow converge on identical 11-file + 2-dir scaffold output. Skill SKILL.md describes scaffold output ≤7 lines; references/phases.md owns full procedure detail; canonical implementation = Node script.

BUT `docs/blueprint/10a-init.md` primer was authored pre-ADR-028 and still describes the deprecated `init-analyst` background-agent path (Discovery → Gate A → Architecture → Gate B → Infra Setup → Gate C → Sprint 0). Sprint 053b T7 audit caught the drift but ≤1-line propagation pattern couldn't address whole-section rewrite — explicitly carried forward.

`docs/blueprint/04-subagents.md` ASCII Agent Tier diagram (L22-34) draws `INIT ANALYST` as a Tier-3 background-agent node alongside Design/Migration/Performance. This is also stale: per ADR-028 `init-analyst` agent does not exist; init delegates to `bin/dev-flow-init.js` (a Node script, not a Tier-3 agent). Diagram collapse to 3 columns (Design + Migration + Performance) closes the visual primer drift.

## Plan

### T1 — 10a-init.md primer rewrite (replace init-analyst workflow with bin/dev-flow-init.js per ADR-028)

**Acceptance:** `docs/blueprint/10a-init.md` whole-section rewrite. Replace 4 refs (L32 / L48 / L102 / L110) and surrounding workflow prose with canonical ADR-028 path: init = `node ${CLAUDE_PLUGIN_ROOT}/bin/dev-flow-init.js`; output = 11 files + 2 empty dirs scaffold contract. Discovery + Architecture + Infrastructure phases still belong in primer narrative (project-bootstrap workflow IS still discovery → architecture → infra → sprint-0 conceptually) but are now described as orchestrator-inline phases (NOT Tier-3 init-analyst spawn). Remove init-analyst.md body block (L48-76 prompt). Update Gate A/B/C phase descriptions to cite canonical script + ADR-028. Frontmatter `last_updated` bumped to 2026-05-09. Cite ADR-028 explicitly.

**Files (likely):** `docs/blueprint/10a-init.md`

**Tests:** N/A (doc-only).

**Risk:** low — primer is reference doc; behavioral contract owned by `bin/dev-flow-init.js` + `skills/orchestrator/references/phases.md` (already correct per Sprint 050).

**ADR needed:** No — ADR-028 already locks canonical contract; this sprint propagates citation.

**Definition of done:** zero `init-analyst` refs in 10a-init.md; ADR-028 cited at top of primer; phase narrative aligned with canonical script behavior; frontmatter stamp updated.

### T2 — 04-subagents.md ASCII agent-tier diagram collapse (remove INIT ANALYST Tier-3 node, lines 22-34)

**Acceptance:** `docs/blueprint/04-subagents.md` ASCII diagram L22-34 collapse from 4 columns (Design + INIT ANALYST + Migration + Performance) to 3 columns (Design + Migration + Performance). INIT ANALYST node removed entirely. Spawn-arrow comment "▼ (INIT mode only)" removed. Replace with one-line note above diagram: "INIT mode delegates to `bin/dev-flow-init.js` script per ADR-028 — no Tier-3 agent spawn." Diagram visual integrity preserved (border alignment + arrow tree). Frontmatter `last_updated` bumped to 2026-05-09. Agent file map L61-68 unchanged (already excludes init-analyst).

**Files (likely):** `docs/blueprint/04-subagents.md`

**Tests:** N/A (doc-only).

**Risk:** low — visual primer; no behavioral contract.

**ADR needed:** No.

**Definition of done:** zero INIT ANALYST refs in 04-subagents.md ASCII diagram; one-line ADR-028 delegation note added; diagram column count = 3 (down from 4); frontmatter stamp updated.

### T3 — final sweep for any remaining init-analyst refs in active surfaces

**Acceptance:** repo-wide grep for `init-analyst|INIT ANALYST|init analyst`. Verify ALL remaining hits are in (a) historical archives (CHANGELOG.md / SPRINT-046 / SPRINT-053b / docs/audit/*) — KEEP as-is (audit trail), or (b) deprecation pointers like 09-customization.md L114 ("replaces deprecated init-analyst agent path") — KEEP (correct ADR-028 lineage). Active primer surfaces (10a-init.md + 04-subagents.md) MUST be zero. Output sweep report: file path + line + classification (historical / deprecation-pointer / DRIFT-FIX-NEEDED). If any DRIFT-FIX-NEEDED found in active surfaces, fix in this T3 OR escalate as Surprise log entry.

**Files (likely):** none (verification only); fix any drift found in T1/T2 surfaces or escalate.

**Tests:** N/A (doc audit).

**Risk:** low — read-only verification + escalation hatch.

**ADR needed:** No.

**Definition of done:** sweep report logged in Execution Log; zero active-surface drift; historical refs preserved.

### T4 — Sprint close

**Acceptance:** standard Sprint Close protocol. Verify T1-T3 done; § Files Changed covers diff; docs sync; Retro filled; CHANGELOG.md prepended; TODO.md updated (TASK-132 [x], Active Sprint cleared, Roadmap row appended).

**Files (likely):** `TODO.md`, `docs/CHANGELOG.md`, this sprint file frontmatter `status: closed`.

**Tests:** N/A.

**Risk:** low.

**ADR needed:** No.

**Definition of done:** sprint file `status: closed`; close commit SHA filled in frontmatter + CHANGELOG row; TODO.md Active Sprint = `— none —`.

## G1 (anti-slip per ADR-031)
```
goal: Doc-coherence — eliminate stale init-analyst primer drift in active blueprint surfaces; align with ADR-028 canonical bin/dev-flow-init.js path.
size: S
constraints: doc-only; no behavioral contract change; no new ADR; orchestrator SKILL.md untouched (cap held 97/100 from Sprint 054b); primer line caps (10a-init.md + 04-subagents.md) — measure post-edit, do not raise.
layers: docs
red flags: none
focus: ONLY primer/diagram drift fix in 10a-init.md + 04-subagents.md; NOT new init workflow design; NOT touching bin/dev-flow-init.js; NOT touching skills/orchestrator/* (already correct per Sprint 050).
context-budget: ~25k tokens (3 files read + 2 file edits + 1 sweep + close)
explicit-gaps:
  - TASK-128 token usage optimization audit (Sprint 055b — incl. primer bloat scan)
  - TASK-116-v2 acceptance harness (Sprint 055 — automated divergence lint)
  - release-debt resolution (Sprint 052b — 8-sprint chain)
  - TASK-125 broader feature-usage audit (Sprint 053b — closed; this sprint is its T7 carry-forward)
done-confirmation:
  - 10a-init.md: zero `init-analyst` refs; ADR-028 cited explicitly; canonical path = `bin/dev-flow-init.js` named.
  - 04-subagents.md: ASCII diagram column count = 3 (Design + Migration + Performance); zero INIT ANALYST tokens in diagram block.
  - Sweep report: every remaining repo hit classified historical OR deprecation-pointer (zero DRIFT-FIX-NEEDED).
status: PASS
```

## Execution Log

### 2026-05-09 — T1 10a-init.md primer rewrite
237 → 74 lines. Replaced pre-Sprint-050 init-analyst Discovery+Architecture+Sprint-0 narrative with ADR-028 canonical contract. Sections: bin/dev-flow-init.js invocation · Scaffold output table (11 files + 2 dirs) · Stack presets table · Convergence rule · Idempotency · Post-init handoff (`/prime`) · Cross-references. Cap held — primer reduced ~70%.

### 2026-05-09 — T2 04-subagents.md ASCII diagram collapse
4-column → 3-column layout. Dropped INIT ANALYST Tier-3 background-agent node (column 2). Added 1-line note below diagram: "INIT mode: no agent spawn. INIT scaffold executes via `bin/dev-flow-init.js` (per ADR-028 / Sprint 050). See `docs/blueprint/10a-init.md`."

### 2026-05-09 — T3 final sweep
Repo-wide grep classified 30 remaining `init-analyst` hits:
- **Historical (KEEP)**: TODO.md sprint blocks · `docs/audit/EPIC-Audit-retro.md`/`v2-rewrite-plan.md`/`AUDIT-2026-05-01.md` · `docs/CHANGELOG.md` L84/L871/L902 · `SPRINT-046-stale-doc-refresh.md` · `SPRINT-053b/053c-*.md`
- **Deprecation-pointer (KEEP)**: `10a-init.md` L6 source frontmatter (intentional supersedes-note) · `09-customization.md` L114 (Sprint 053b T7 cross-link)
- **DRIFT-FIX-NEEDED**: 0
Active blueprint surfaces verified clean post-T1+T2.

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| `docs/sprint/SPRINT-053c-init-primer-cleanup.md` | sprint | NEW — this file | low |
| `docs/blueprint/10a-init.md` | T1 | Whole-section rewrite 237→74 lines; 4 init-analyst refs eliminated; ADR-028 canonical bin/dev-flow-init.js contract documented; Stack presets + Scaffold output tables; Post-init `/prime` handoff line; last_updated 2026-04-20→2026-05-09 | low |
| `docs/blueprint/04-subagents.md` | T2 | ASCII Agent Tier diagram L22-34 collapsed 4→3 columns (dropped INIT ANALYST node); 1-line ADR-028 delegation note added; last_updated already 2026-05-09 (Sprint 053b) | low |

## Decisions

*(none — doc-coherence sprint, no hard-to-reverse decisions)*

## Open Questions for Review

*(none — all surfaced + resolved at G1)*

## Retro

### Worked

- **Whole-section rewrite escape hatch (per Sprint 053b retro pattern candidate) validated.** 237 → 74 lines for 10a-init.md; ≤1-line discipline correctly identified as wrong-fit at promote time → escalated to single-task multi-line sprint instead.
- **Sweep classification framework held.** Historical / deprecation-pointer / DRIFT-FIX-NEEDED triage produced clear zero-drift verification.
- **Cross-link discipline.** 10a-init.md cites ADR-028 + phases.md + bin script source + lean-doc template owner; future drift will surface via single-source canonical pattern.

### Friction

- **None mid-sprint.** Plan-locked scope held; no friction protocol invocations.

### Pattern candidates

- **Whole-section primer rewrite trigger.** When ≥30% of primer's body is about a deprecated entity, sprint G1 should auto-flag whole-rewrite scope. Currently relies on follow-up sprint observation. Add to TASK-116-v2 acceptance harness as primer-staleness lint.
- **ASCII diagram drift detection.** Multi-line ASCII art is structurally invisible to single-line grep audits. Pattern candidate: pr-reviewer Lens 7 (Documentation) checklist item — "if diff touches an ASCII-diagram-bearing primer, verify diagram still matches current architecture."

### Surprise log

- **Primer 70% body-reduction** vs original. Pre-ADR-028 primer described 4-phase INIT (Discovery → Architecture → Infra → Sprint 0) with 3 gates (A/B/C); post-ADR-028 primer = 1 invocation + 1 idempotency note. Indicates significant accidental complexity removed across Sprint 049→050 init reorg.
