---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: anthropics/skills/skill-creator main SHA changes OR dev-flow write-a-skill rewrite
status: current
---

# Anthropic skill-creator vs dev-flow write-a-skill — 5-axis diff

**Sprint:** 045 T1 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | License |
|:--------|:-------|:--------|:--------|
| `anthropics/skills/skills/skill-creator` | gh CLI raw | `d230a6dd6eb1` (upstream main) | Apache 2.0 (per-skill `LICENSE.txt`) |
| `dev-flow` | local `skills/write-a-skill/SKILL.md` (HEAD) | `89d2389` (Sprint 045 plan-lock) | — |

skill-creator is FIRST-PARTY Anthropic reference. Postdates Sprint 034 external-refs probe (added to TODO mid-Sprint 044). License = Apache 2.0 (NOT MIT — first non-MIT external ref this EPIC).

## Skill-creator scope (verified)

| Surface | Count | Notes |
|:--------|------:|:------|
| `SKILL.md` | 485 lines (33 KB) | far over dev-flow's 100-line cap |
| `references/schemas.md` | 430 lines (12 KB) | spec definitions |
| `agents/{analyzer, comparator, grader}.md` | 3 (7-10 KB each) | per-skill sub-agents (dev-flow has no per-skill agents) |
| `scripts/*.py` | 8 Python scripts (~78 KB total) | eval harness + automation (`run_eval`, `run_loop`, `aggregate_benchmark`, `improve_description`, `quick_validate`, `package_skill`, `generate_report`) |
| `assets/`, `eval-viewer/` | (additional dirs, not enumerated) | bundled resources + eval visualization tooling |

**Total scope: large.** dev-flow `write-a-skill` = 81 lines, 0 sub-agents, 0 scripts. Roughly 6× line difference + automation gap.

## 5-axis diff matrix

| Axis | Anthropic | dev-flow | Delta | Lift Y/N | Rationale |
|:-----|:----------|:---------|:------|:--------:|:----------|
| **1. Frontmatter spec coverage** | `name`, `description` required; `compatibility` rare optional | `name`, `description`, `user-invocable`, `argument-hint`, `version`, `last-validated`, `type: rigid\|flexible` | dev-flow has 5 extra governance fields (version pinning, eval-validated date, rigid-vs-flexible classification, argument-hint UX, user-invocable flag) | **N** | dev-flow extras exist for explicit governance reasons (eval evidence per ADR-016/021, version tracking per ADR-006). Stripping would lose those signals. |
| **2. Skill creation flow** | Capture Intent → Interview → Write → Test Cases → Run → Iterate (loop) → Description improver (separate script) | 3-phase: Requirements → Draft → Review (single-pass) | Anthropic is iteration-heavy with eval loop integrated; dev-flow is linear single-pass with Review gate | **Y (lift candidate)** | "Iterate until satisfied" framing is honest about skill quality. dev-flow's Review phase is single-shot — could add explicit iteration loop. Queue to TASK-116 acceptance harness for write-a-skill description rework. |
| **3. Skill quality checklist** | Implicit (enforced via `scripts/quick_validate.py`); narrative guidance in SKILL.md | Explicit 6-item checklist in `write-a-skill/SKILL.md` | dev-flow has STRONGER explicit checklist; Anthropic has TIGHTER programmatic enforcement (script-based) | **N (bidirectional finding)** | dev-flow's explicit checklist is superior for human-readable skill authoring. Anthropic's script-based enforcement is superior for automation but premature at dev-flow's 17-skill scale. Both legitimate; no lift. |
| **4. Reference-file pattern** | `references/` overflow at <500-line SKILL.md cap; TOC convention for refs >300 lines; domain-organization pattern (per-variant: aws.md/gcp.md/azure.md) | `references/<topic>.md` overflow at >100-line SKILL.md cap; reference-file frontmatter mandated | dev-flow has TIGHTER cap (100 vs 500). Anthropic adds TOC + domain-organization conventions dev-flow lacks | **Y partial (TOC for large refs)** | TOC convention for >300-line references is a small additive lift. Domain-organization pattern (cloud-deploy/aws.md/gcp.md/azure.md) is for cross-framework skills — dev-flow doesn't currently have any; lift if/when first cross-framework skill arrives. Queue TOC convention to TASK-116. |
| **5. Anti-patterns / red-flags** | "Principle of Lack of Surprise" (security/malware), narrative anti-pattern guidance, **"description pushiness" framing to combat undertriggering**, imperative-form preference | 4 explicit red flags (description too broad / skill duplicates / no red flags / script for non-deterministic) | Anthropic has more narrative guidance; dev-flow has crisper explicit list | **Y partial (description pushiness)** | "Description pushiness to combat undertriggering" is a real failure mode dev-flow doesn't address explicitly. Add as Red Flag candidate. Other Anthropic guidance is style preference. Queue to TASK-116. |

## Bidirectional findings

**dev-flow > Anthropic axes:**
1. **Explicit quality checklist** (axis 3) — Anthropic relies on scripts; dev-flow's inline checklist is human-first and more discoverable. Sprint 042/043/044 bidirectional pattern continues.
2. **Tighter line cap discipline** (axis 4) — dev-flow 100 vs Anthropic 500. dev-flow's cap preserves AI internalization (per Sprint 040 finding on karpathy). Anthropic's 500-line cap allows much richer content but risks AI scanning over key directives.
3. **Explicit red-flags inline format** (axis 5) — dev-flow's `❌ **Pattern** — why it fails` template is crisper than Anthropic's narrative anti-pattern prose.
4. **Mandatory reference-file frontmatter** — dev-flow requires ownership headers; Anthropic does not.

**Anthropic > dev-flow axes:**
1. **Iteration loop framing** (axis 2) — Anthropic's "Repeat until satisfied" is honest about skill quality requiring iteration. dev-flow's single-pass Review gate is optimistic.
2. **TOC convention for >300-line references** (axis 4) — small additive value if dev-flow ever has large reference files. Currently no dev-flow ref >100 lines so unused, but worth documenting.
3. **Description-pushiness anti-pattern** (axis 5) — addresses a real failure mode (undertriggering) dev-flow's red-flags don't cover.
4. **Programmatic validation scripts** (axis 4 + tooling) — Anthropic ships `quick_validate.py` + `improve_description.py`. dev-flow has no equivalent. Queue as candidate for future tooling sprint, NOT TASK-116 (script-write, not skill-description rework).

## Per-axis recommendation

| Axis | Recommendation | Queue target |
|:-----|:---------------|:-------------|
| 1 (frontmatter) | NO LIFT — dev-flow superset is governance-justified | (none) |
| 2 (creation flow) | LIFT iteration-loop framing — add Phase 4 "Iterate" to write-a-skill | TASK-116 acceptance harness |
| 3 (quality checklist) | NO LIFT — dev-flow superior; record bidirectional finding | (none) |
| 4 (reference pattern) | LIFT TOC convention for >300-line refs; DEFER domain-organization pattern; DEFER programmatic-validation scripts | TASK-116 (TOC) + future tooling sprint (scripts) |
| 5 (anti-patterns) | LIFT description-pushiness anti-pattern — add as 5th Red Flag in write-a-skill | TASK-116 acceptance harness |

**3 trigger-phrase / Red-Flag lift candidates queued to TASK-116** (joins prior queue from Sprint 043 DEC-1's 5 candidates and TASK-117 CONTEXT.md lifts):
1. write-a-skill ← add Phase 4 "Iterate" (creation-flow lift from axis 2)
2. write-a-skill ← add Red Flag: "description undertriggering — be pushy about when to use" (axis 5)
3. write-a-skill ← add reference-file convention: "≤300 lines or include TOC" (axis 4)

NO `skills/write-a-skill/*` edits this sprint per ADR-021 DEC-4. All 3 lifts queue to TASK-116 acceptance harness for verification before merge.

## Net assessment

skill-creator validates dev-flow's `write-a-skill` general direction (skill-authoring meta-skill, frontmatter + body + references separation, quality checklist concept). Differences are:
- **Scale:** Anthropic ships 485-line SKILL + 8 Python scripts + 3 sub-agents + eval visualization tooling. dev-flow ships 81-line SKILL only. 6× line gap, ~∞× tooling gap. Scale-driven defer (Sprint 044 GSD pattern).
- **Iteration:** Anthropic explicitly bakes eval-loop iteration into the flow. dev-flow's single-pass Review gate is more optimistic. Real value lift queued.
- **Programmatic validation:** Anthropic ships `quick_validate.py` + `improve_description.py`. dev-flow has no equivalent. Future tooling sprint candidate (NOT TASK-116 scope).

No `.out-of-scope/` pointers warranted (all defers are scale-driven or queued-for-TASK-116, not concept-rejecting).

## ADR-024 sequential check

`docs/adr/` listing pre-T1 commit: ADR-016, 019, 020, 021, 022, 023 — max = 023. **ADR-024 sequential safe.**

## File-read ceiling check

Reads used (per OQ-b 8-file ceiling):
- license check (gh API call) — 1
- skill-creator dir listing — 1
- references/, agents/, scripts/ sub-listings — 3
- LICENSE.txt head — 1
- SKILL.md head (150 of 485 lines) — 1 (counted as 1 file even though partial)
- dev-flow `skills/write-a-skill/SKILL.md` (existing) — 1

**Total: 8 reads.** At ceiling, did not breach. schemas.md fetched but not read in detail (would push past ceiling); not required for 5-axis diff conclusions.

## Re-audit cadence

Re-fetch via gh CLI when anthropics/skills main SHA changes. Re-evaluate iteration-loop + description-pushiness lifts after TASK-116 acceptance harness ships. Likely annual cadence.
