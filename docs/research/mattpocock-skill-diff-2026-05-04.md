---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: upstream mattpocock skill changes OR dev-flow skill rewrites
status: current
---

# Mattpocock skill diff — `tdd` / `diagnose` / `zoom-out` / `task-decomposer`

**Sprint:** 043 T1 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | License |
|:--------|:-------|:--------|:--------|
| `mattpocock/skills` | gh CLI raw | `b843cb5ea74b` (upstream main) | MIT |
| `dev-flow` | local `skills/<name>/SKILL.md` (HEAD) | `2813289` (Sprint 043 plan-lock) | — |

mattpocock bucket structure: `engineering/`, `productivity/`, `misc/`, `personal/`, `deprecated/`. The 4 dev-flow skills compared all live (or would live) under `engineering/`.

## Path-verify findings

| dev-flow skill | mattpocock path | Found? |
|:---------------|:----------------|:------:|
| `tdd` | `skills/engineering/tdd/SKILL.md` | ✓ (109 lines) |
| `diagnose` | `skills/engineering/diagnose/SKILL.md` | ✓ (117 lines) |
| `zoom-out` | `skills/engineering/zoom-out/SKILL.md` | ✓ (7 lines) |
| `task-decomposer` | (no exact match) | ✗ — dev-flow original; closest mattpocock = `to-issues` / `to-prd` / `triage` (different domain framing: issue-tracker workflow vs sprint/TODO management) |

## 4-skill comparison matrix

| Axis | `tdd` | `diagnose` | `zoom-out` | `task-decomposer` |
|:-----|:------|:-----------|:-----------|:------------------|
| mattpocock lines | 109 | 117 | 7 | (n/a) |
| dev-flow lines | 81 | 73 | 55 | (existing — not re-counted here) |
| Length winner | mattpocock (richer body) | mattpocock (richer Phase 1) | dev-flow (mattpocock is 1-line instruction; dev-flow has output template + rules + red flags) | dev-flow only |
| mattpocock trigger phrases | "red-green-refactor", "integration tests", "test-first development", "build features", "fix bugs" | "diagnose this", "debug this", "broken", "throwing", "failing", "performance regression" | (mostly disable-model-invocation; only direct invocation) | n/a |
| dev-flow trigger phrases | "implementing new behavior that requires tests" | "debugging a defect, unexpected behavior, or failing test" | "entering unfamiliar area of codebase", "before cross-cutting change" | "freeform feature request, ticket URL, PRD, or epic into structured TASK-NNN" |
| mattpocock references | `tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md` | (none — heavy inline) | (none — minimal body) | n/a |
| dev-flow references | (none — single SKILL.md) | (none — single SKILL.md) | `CONTEXT.md` (vocab source) | (existing) |
| Cross-link to other skills | (none) | (none) | (none) | n/a |
| `disable-model-invocation` field | absent | absent | **present** (manual invocation only) | absent |
| Has dev-flow "Red Flags" section | (no — mattpocock convention) | (no — mattpocock convention) | (no) | (n/a) |
| dev-flow has "Red Flags" | ✓ (4 entries) | ✓ (4 entries) | ✓ (2 entries) | (existing) |

## Trigger-phrase delta call-out

**`tdd` — mattpocock trigger phrases dev-flow lacks:**
- `"red-green-refactor"` (explicit) — strong signal, narrow trigger
- `"integration tests"` — common phrasing
- `"test-first development"` — alternative naming
- `"build features"` (vague — false-positive risk if added)
- `"fix bugs"` (vague — collides with diagnose)

dev-flow original phrases mattpocock lacks:
- `"implementing new behavior that requires tests"` (intentionally specific to avoid debug-vs-build collision)

**`diagnose` — mattpocock trigger phrases dev-flow lacks:**
- `"diagnose this"` / `"debug this"` (explicit invocation phrases)
- `"broken"` / `"throwing"` / `"failing"` (one-word symptom phrases — strong but high false-positive risk)
- `"performance regression"` (specific, narrow — worth adding)

dev-flow original phrases mattpocock lacks:
- `"unexpected behavior"` (covers gap before "broken")
- `"failing test"` (intersects mattpocock's "failing" but more specific)

**`zoom-out` — mattpocock trigger phrases dev-flow lacks:**
- (mattpocock has `disable-model-invocation: true` — opposite philosophy; user must invoke explicitly)

dev-flow original (auto-trigger) phrases:
- `"entering unfamiliar area of codebase"`, `"before cross-cutting change"`

**`task-decomposer`:** no mattpocock equivalent. dev-flow original.

## Reference-graph delta

**mattpocock `tdd` references** (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`):
- These are sibling content files in the same skill directory, not cross-skill refs.
- Each is presumably 100+ lines of deep content. Out of scope to lift per probe synthesis line 139 ("1100 words exceeds dev-flow's 100-line cap").
- dev-flow's lean SKILL.md + per-skill references/ subdir convention (CLAUDE.md SCAFFOLD WORK rule) covers the same ground if needed; dev-flow tdd has none currently — could add `references/refactoring.md` if value justified, but NOT in this sprint.

**mattpocock `diagnose`** has zero cross-refs but very rich inline body (Phase 1 has 10-method enumeration of feedback-loop construction; "Iterate on the loop itself" subsection; "Non-deterministic bugs" subsection; "When you genuinely cannot build a loop" escape hatch). dev-flow's 73 lines vs mattpocock's 117 lines = 38% shorter; lost content is mostly the Phase 1 depth.

**mattpocock `zoom-out`:** 7 lines. No references. dev-flow richer.

## Per-skill recommendation

| Skill | Lift trigger phrases? | Lift body content? | Lift references? | Net |
|:------|:---------------------:|:------------------:|:----------------:|:----|
| `tdd` | **Y** — `"red-green-refactor"`, `"integration tests"`, `"test-first development"` (3 narrow phrases); REJECT `"build features"`, `"fix bugs"` (collide with other skills) | N — 109-line body exceeds 100-line cap; dev-flow's intentional brevity preserves AI-internalization | N — sibling files would breach line cap | Defer trigger-phrase lifts to TASK-116 acceptance harness (per ADR-021 DEC-4) for behavior-change verification before merge |
| `diagnose` | **Y** — `"performance regression"` (narrow); CONSIDER `"diagnose this"`, `"debug this"` as invocation aliases; REJECT one-word `"broken"` / `"throwing"` / `"failing"` (high false-positive) | N — same line-cap reason | N (none to lift) | Defer trigger-phrase lifts to TASK-116 |
| `zoom-out` | **N** — dev-flow richer; mattpocock would REGRESS dev-flow if lifted | N — same | N | NO CHANGE. Inverse finding (dev-flow > mattpocock); record lineage as "dev-flow original; mattpocock variant exists but is minimal" |
| `task-decomposer` | n/a (no upstream) | n/a | n/a | NO CHANGE. dev-flow original; record "no upstream" in lineage |

## Net finding for ADR-022

**Lift recommendations queue to TASK-116 acceptance harness** per ADR-021 DEC-4 ("Skill changes that alter agent behavior require eval evidence before merge"). NO skill edits this sprint — Sprint 043 surfaces the candidates; TASK-116 sprint runs the acceptance harness on each proposed phrase to verify auto-trigger behavior; only validated phrases ship.

5 candidate phrases for TASK-116 verification:
1. `tdd` ← `"red-green-refactor"`
2. `tdd` ← `"integration tests"`
3. `tdd` ← `"test-first development"`
4. `diagnose` ← `"performance regression"`
5. `diagnose` ← `"diagnose this"` / `"debug this"` (alias pair)

Trigger-phrase reject list (do NOT add even after eval):
- `tdd` ← `"build features"`, `"fix bugs"` (vague, cross-skill collision)
- `diagnose` ← `"broken"`, `"throwing"`, `"failing"` (one-word, high false-positive)

## Bidirectional finding

**`zoom-out` is dev-flow > mattpocock.** mattpocock variant is a 7-line one-shot instruction; dev-flow has output template + 4 rules + 2 red flags + ≤10-modules cap. Per Sprint 042 DEC-2 pattern (record bidirectional findings), this needs explicit mention in ADR-022 to avoid future "match mattpocock" pressure on `zoom-out`.

## Re-diff cadence

Re-fetch via gh CLI when mattpocock main SHA changes. Re-evaluate trigger-phrase candidates if mattpocock adds new ones. Likely annual cadence.
