---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: ADR status change
status: decided
sprint: 054
---

# ADR-031: Anti-Slip Discipline at G1 — 4 new G1 Scope Checklist fields canonical

**Date**: 2026-05-09
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

User finding 2026-05-09 (post-Sprint-053 close): "consider slip of error AI decision, is to optimal sprint we need to consider gap limit goals, focus or context we must state, because i still see when assign a task have a possibility to miss and slip the task." User pain: tasks get missed or scope-slip during execution. Existing G1 Scope Checklist captures `goal · size · constraints · layers · red flags · status` but does NOT explicitly state:

- **Focus** — single-concern statement (what NOT to drift to)
- **Context-budget** — token estimate or `no-limit` declaration before halt
- **Explicit-gaps** — deferred items + explicit out-of-scope list
- **Done-confirmation** — measurable observable test that proves done

Existing `acceptance:` field is closest but inconsistently formatted as measurable outcome. Sprint 052 F5(C) Mid-Sprint Friction Protocol handles slip MID-execution via fix/defer/block — but anti-slip at G1 prevents slip from happening in the first place. Existing G1 mechanism is post-fact handling; anti-slip is preventive.

**Symptoms (audit at Sprint 054 promote):**

- Sprint 050 retro Friction surfaced scope creep mid-sprint (caught by recon-first; not caught by G1).
- Sprint 051a + 051b retro Friction logged drift findings as carry-forward to TASK-125 (Sprint 053b broader audit) — drift traced to under-specified pre-task scope.
- Sprint 053 retro Pattern candidate #6: "Drift surfaces at template-consumer integration time" — pattern surfaces because pre-task explicit-gaps not stated.
- User explicit ask: 4 fields for slip-prevention (gap-limit · goals · focus · context).

This ADR locks anti-slip discipline at G1 as canonical for all `quick`/`mvp`/`sprint-bulk` modes (G1 fires in all three). Sprint 054 implements the 4 new fields + sprint-bulk Phase 0 Active Sprint guard + Mid-Sprint Friction Protocol explicit triggers.

## Decision

**1. G1 Scope Checklist gains 4 new fields canonical.** Fields required at G1 PASS (partial fill = BLOCK):

| Field | Format | Purpose |
|:------|:-------|:--------|
| `focus:` | one sentence; what NOT to drift to | Pre-task scope discipline; mental anchor against tangents |
| `context-budget:` | token estimate (e.g. `~5k`) OR `no-limit` | Halt threshold; integrates w/ Friction Protocol context-budget trigger |
| `explicit-gaps:` | bullet list of deferred + out-of-scope items OR `none` | Pre-task de-scope; closes "I'll just also fix..." mid-task drift |
| `done-confirmation:` | measurable observable test; `[X happens] WHEN [Y trigger]` | Post-task verification target; distinct from `acceptance:` (completion criteria vs observable test) |

**2. `acceptance:` and `done-confirmation:` are SEPARATE fields, NOT merged.** Different concerns:
- `acceptance:` — task completion criteria (what conditions = done at planning time)
- `done-confirmation:` — observable test that proves done (what to verify post-task)
Merging causes drift (acceptance gets vague when forced to be observable; done-confirmation gets aspirational when forced to be planning-level).

**3. Behavioral enforcement via `type: rigid` skill contract.** orchestrator skill (type:rigid) reads phases.md G1 Scope Checklist template; agent fills 4 new fields per execution; partial fill = BLOCK at G1 PASS. Automated lint deferred to TASK-116-v2 acceptance harness (Sprint 055 — was 054, pushed by TASK-130 priority).

**4. Field insertion order.** After existing `red flags:` line; before `status:` line. Maintains G1 template flow: verifiable goal → constraints → red flags → anti-slip discipline → final status.

**5. Backwards compat.** Existing Active Sprint tasks promoted pre-Sprint-054 don't have anti-slip fields. Sprint 054 changes apply to NEXT G1 invocations. Sprint 054 own G1 (this sprint's promote) retroactively applies — sprint plan § Sprint 054 OWN G1 fills 4 fields.

## Alternatives considered

1. **Keep status quo — handle slip mid-sprint via Friction Protocol only.** Rejected. Slip prevention is cheaper than slip recovery. Sprint 052 F5(C) Mid-Sprint Friction Protocol catches slip after it happens; ADR-031 catches it before it starts. Both layers needed.

2. **Single combined field "scope-discipline" covering focus + gaps + done.** Rejected. Different concerns blend → no concern is precise. Bullet list gets vague. Better: 4 explicit fields, each precise.

3. **Make 4 fields optional (best-effort).** Rejected. Defeats purpose. Behavioral enforcement requires hard requirement; partial fill = BLOCK. Aspirational fields silently skipped under time pressure.

4. **Implement only `focus:` and `done-confirmation:` (drop context-budget + explicit-gaps).** Rejected. context-budget integrates w/ Friction Protocol context-budget trigger (TASK-130 T2 condition #5); explicit-gaps closes mid-task drift root cause (recon-first memory pattern: "what's deferred / out-of-scope explicit list").

5. **Defer to acceptance harness (TASK-116-v2 Sprint 055).** Rejected. Acceptance harness LINTS the discipline; doesn't CREATE it. Behavioral discipline must exist first; lint enforces what exists.

## Consequences

**Positive:**
- Pre-task slip prevention — closes user pain explicitly stated 2026-05-09.
- Clearer scope boundaries — focus + explicit-gaps make pre-task scope discipline visible at G1.
- Done-verifiable — done-confirmation field forces measurable observable test before task starts.
- Integrates w/ Sprint 052 F5(C) — context-budget field works w/ Friction Protocol context-budget AI trigger.
- Outcomes mapped: O5 flow (cleaner G1) · O6 correction (mid-task drift prevention) · O8 reliability (slip-prevention).

**Negative (trade-offs accepted):**
- G1 checklist longer — 4 more fields to fill per task. Mitigation: each field is single-line; checklist still fits on one screen.
- Behavioral enforcement only — no automated verification until TASK-116-v2 Sprint 055 acceptance harness ships. Mitigation: type:rigid skill contract is established enforcement vehicle; documented in retro carry-forward.
- Existing in-flight work doesn't have anti-slip fields — Sprint 054 changes apply to NEXT G1 invocations only. No retroactive enforcement. Mitigation: documented backwards-compat note + Sprint 054 own G1 retroactively applies.
- Risk: humans skip fields under time pressure. Mitigation: partial-fill = BLOCK rule (behavioral hard-stop).

**Neutral:**
- ADR-031 file at `docs/adr/ADR-031-anti-slip-discipline-at-g1.md` per locked convention (Sprint 043 DEC-7 + Sprint 047 DEC-6). ID verified non-colliding (max ADR was 030 post-Sprint-053).
- Sprint 054 T1-T3 implement decision. T4 validates. ADR-031 locks decision atomically with implementation per Sprint 053 T0.5 ADR-first sequencing pattern.

## References

- ISSUE origin: user session 2026-05-09 (post-Sprint-053 close) — "consider slip of error AI decision, is to optimal sprint we need to consider gap limit goals, focus or context we must state".
- ADR-030 — Template Canonical Ownership (Sprint 053; predecessor; same ADR-first sequencing pattern).
- Sprint 052 F5(C) — Mid-Sprint Friction Protocol (mid-execution slip handling; ADR-031 is the pre-execution counterpart).
- Sprint 053 retro Pattern candidate #1 — Decision-first sequencing for ADR+implementation sprints (codified Sprint 053 T0.5; reused Sprint 054 T0.5).
- ADR-029 — CA+DDD Lean Architecture Canonical (architecture canonical; ADR-031 is workflow-discipline canonical analogue).
- Sprint 050 + 051a + 051b retro Frictions — drift findings traced to under-specified pre-task scope (root cause that ADR-031 addresses).
- Outcomes: O5 flow · O6 correction · O8 reliability (USER-OUTCOMES.md).
- TASK-116-v2 (Sprint 055): automated divergence lint — incl. anti-slip field-fill verification.
- TASK-125 (Sprint 053b): broader feature-usage audit — runs AFTER Sprint 054 anti-slip closes user pain.
- Re-evaluation cadence: re-eval if anti-slip discipline produces meaningful G1 friction (e.g., agents BLOCK on legitimate quick fixes due to unfilled context-budget) — would surface as TD row at sprint close.
