---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: in_progress
plan_commit: TBD
close_commit: TBD
---

# Sprint 054b — Orchestrator Doc-Wire Cleanup (TASK-131)

**Theme:** TASK-131. Doc-coherence improvements carried forward from Sprint 054 (TASK-130 anti-slip prioritized first per user 2026-05-09). Wire ADR-030 + Sprint 053 contracts into orchestrator init Phase + Mode Dispatch Path B + orphan skill explicit invocation language.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 054 closed `932d700` (TASK-130 anti-slip + ADR-031).
**Closes:** TASK-131 (Orchestrator Doc-Wire Cleanup).

## Why this sprint exists

Sprint 053 ADR-030 locked template canonical ownership; Sprint 053 T1+T4 wired task-decomposer template-read; Sprint 053 T3 wired lean-doc Step 6 template-load. BUT orchestrator init Phase (which uses bin/dev-flow-init.js applySubstitutions) doesn't cite ADR-030 explicitly. Mode Dispatch Path B (freeform → /task-decomposer) doesn't cite Sprint 053 procedure.md Step 6 contract. Sprint 052 F4 wired 6 orphans into skill-dispatch.md Always-On as advisory rows but invocation language still implicit (text-only listing). Doc-coherence gaps surfaced as carry-forward at Sprint 054 retro.

## Plan

### T1 — ADR-030 init phase citation
**Acceptance:** orchestrator/SKILL.md init Phase Step 2 + phases.md init Phase contract — cite ADR-030 template canonical ownership + Sprint 053 T3 template-load contract for `bin/dev-flow-init.js applySubstitutions` path.

### T2 — Path B task-decomposer citation
**Acceptance:** orchestrator/SKILL.md Mode Dispatch freeform Path B note — cite ADR-030 + Sprint 053 T4 procedure.md Step 6 template-read contract.

### T3 — Orphan skill explicit invocation language
**Acceptance:** skill-dispatch.md Always-On rows for 6 orphans (prime · zoom-out · diagnose · tdd · refactor-advisor · release-manager) — verify each row has explicit "fires when X" trigger language (not aspirational). Tighten any vague rows. Cross-link Sprint 052 F4 advisory hints in phases.md sprint-bulk Phase.

### T4 — Sprint close
**Acceptance:** standard Sprint Close protocol.

## G1 (anti-slip per ADR-031)
```
goal: Doc-coherence — wire ADR-030 + Sprint 053 contracts into orchestrator init + Mode Dispatch + orphan invocation language.
size: S
constraints: orchestrator SKILL.md ≤97/100 cap (3-line margin); doc-only; no behavioral contract change.
layers: skills, docs
red flags: none
focus: ONLY doc citations + invocation language tightening; NOT new behavioral contracts; NOT new ADR.
context-budget: ~30k tokens
explicit-gaps:
  - ADR-031 G1 anti-slip field automated lint (TASK-116-v2 Sprint 055)
  - TASK-125 broader feature-usage audit (Sprint 053b)
  - release-debt resolution (Sprint 052b)
done-confirmation: orchestrator SKILL.md init Phase cites ADR-030 + Path B cites ADR-030 + procedure.md Step 6 + skill-dispatch.md 6 orphan rows all have explicit "fires when X" trigger language.
status: PASS
```

## Execution Log

*(populated per task)*

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| `skills/orchestrator/SKILL.md` | T1+T2 | T1: init Phase Step 2 cites ADR-030 · T2: Path B note cites ADR-030 + procedure.md Step 6 | low |
| `skills/orchestrator/references/skill-dispatch.md` | T3 | Always-On 6 orphan rows tightened; explicit "fires when X" language verified | low |
| `TODO.md` | T4 | sprint:none; TASK-131 [x]; Roadmap done | low |
| `docs/CHANGELOG.md` | T4 | Sprint 054b row prepended | low |

## Retro

*(populated at close)*
