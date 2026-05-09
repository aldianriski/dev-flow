---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: ADR status change
status: decided
sprint: 052b
---

# ADR-032: Release-Debt Resolution and Mode Boundary — `release-patch` (PATCH) ↔ `release-manager` (MINOR/MAJOR) canonical split + prevention mechanism

**Date**: 2026-05-09
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 049 (ADR-027 generalize + dev-flow-compress drop + architecture-grill rename) introduced 3 MINOR-class behavioral changes but bumped via `release-patch` (PATCH-only by design — release-patch HARD-rejects MINOR per SKILL.md L23 + L91). 9 subsequent sprints (050/051a/051b/052/053/053b/053c/054/054b) accumulated as PATCH; chain never reconciled against canonical MINOR contract. By 2026-05-09 chain depth = 10 sprints unreconciled; P0 promotion threshold breached at Sprint 052 + grew 5 more sprints. Sprint 053b T2 audit surfaced 7 DOC-ONLY findings deferred to this sprint: cross-citation gap · `release-manager` last-validated stale 2026-04-21 (pre-ADR-027) · invocation asymmetry · `--from-sprint` flag overlap risk · ADR-031 Open Q E coordination-loop violation · 05-skills.md primer drift × 2.

**Symptoms (recon-first 2026-05-09):**

- `plugin.json` + `marketplace.json` both at `2.5.0` (lockstep verified per ADR-006 contract).
- `release-patch` v2.0.0 capability = 6-mode auto-detect cascade + lockstep verify + hard-stop push gate; explicitly NO `--minor`/`--major` flag.
- `release-manager` v1.0.0 unused since 2.4.0→2.5.0 bump (Sprint 040 era); pre-ADR-027 last-validated stamp left it semantically orphaned.
- v1 ship (Sprint 056) requires clean MINOR baseline for outcome-led release notes per ADR-026.
- `feedback_release_debt_tracking.md` 2026-05-08 promoted release-debt P2→P0; depth=10 at sprint promote.

User explicit lock at Sprint 052b promote 2026-05-09 (4 questions): (1) manual reconcile this sprint + defer `--minor` flag; (2) bump 2.5.0→2.6.0 MINOR; (3) factual close-out edits to Sprint 053b file permitted (Sprint 047 T1 precedent); (4) ADR-032 scope = 5 decisions canonical.

## Decision

**DEC-1: `--minor` flag scope DEFERRED to TASK-NEW post-v1.** `release-patch` stays PATCH-only at v2.0.0. Extending with `--minor`/`--major` flag = behavioral contract change requiring acceptance harness validation (TASK-116-v2 Sprint 055 dependency); pre-v1 stability not warranted. Manual MINOR reconcile (this sprint T1 = `b03f366`) suffices for current release-debt resolution.

**DEC-2: `release-manager` canonical role = MINOR/MAJOR ONLY.** `release-manager` v1.0.0 owns MINOR + MAJOR semantically meaningful bumps; `release-patch` v2.0.0 owns PATCH auto-detect cascade. NOT deprecated. Bidirectional cross-citation in both SKILL.md files (T2 = `0018ea0`) enforces role discoverability. Last-validated stamp bumped 2026-05-09.

**DEC-3: Prevention mechanism = Sprint Promote release-debt scan.** Codify into `lean-doc-generator` Sprint Promote Step 1.5 (alongside existing Tech-Debt scan): scan CHANGELOG since last MINOR/MAJOR bump; depth ≥3 sprints → flag P1 candidate · ≥5 → auto-escalate P0 · ≥7 → BLOCK Sprint Promote until release-debt resolution sprint promoted. Codification = TASK-NEW (post-052b close); behavioral until then via memory `feedback_release_debt_tracking.md`.

**DEC-4: Mode boundary canonical = bidirectional + non-overlapping.** `release-patch` NEVER handles MINOR even with auto-detect cascade (HARD STOP — already enforced via SKILL.md L23 + L91 rejection). `release-manager` `--from-sprint` flag detects bump-class from Active Sprint task-types for MINOR/MAJOR ONLY; never overlaps PATCH cascade. Both SKILL.md cite paired counterpart per ADR-031 Open Q E coordination-loop rule.

**DEC-5: Re-litigation lock per ADR-031 anti-slip.** `--minor` flag debate within Sprint 052b execution window = HARD STOP per ADR-031 lock 5 (focus discipline). DEC-1 deferral is binding for this sprint; reopening = scope creep + violates `feedback_canonical_first_pivot.md` (canonical-first edit contract). Future re-evaluation requires new sprint promote + new ADR.

## Alternatives considered

1. **Extend `release-patch` with `--minor`/`--major` flag THIS sprint.** Rejected. Behavioral contract change requires acceptance harness validation (TASK-116-v2 Sprint 055 not yet shipped); compound-changes 5 mode handlers + lockstep contract pre-v1 (Sprint 056 ship in 4 sprints); violates ADR-031 anti-slip focus discipline. Re-evaluable post-v1 as TASK-NEW.

2. **Deprecate `release-manager`; fold all bumps into `release-patch` with `--bump <level>`.** Rejected. Skill removal = MAJOR bump (3.0.0); destabilizes pre-v1 contract; release-manager invocation table well-formed + last-validated bump fixes staleness without code change; conflates auto-detect with explicit-bump UX (semantic drift).

3. **Single canonical flag `release-patch --bump <level>` shared with release-manager.** Rejected. Overlaps with `release-manager --from-sprint` semantic; conflates two different I/O contracts (release-patch = manifest-cascade auto-detect; release-manager = git-history + sprint task-types); violates DEC-4 non-overlap rule.

4. **Defer prevention mechanism (DEC-3) to post-v1.** Rejected. 10-sprint chain reached P0 threshold once + grew 5 sprints further while deferred — preventive mechanism is primary value of this ADR; without it recurrence is near-certain (Sprint 052b retro Pattern candidate likely flags this).

5. **No ADR; record 5 decisions in Sprint 052b retro only.** Rejected. Mode boundary (DEC-2 + DEC-4) is hard-to-reverse contract per ADR-031 hard-to-reverse rule; retro decisions don't survive sprint archive cleanup; ADR is durable record. Sprint 053 T0.5 ADR-first sequencing pattern reused.

## Consequences

**Positive:**
- 10-sprint release-debt RESOLVED at Sprint 052b T1 (`b03f366`). Chain depth 10 → 0.
- Mode boundary discoverable via bidirectional cite — closes Sprint 053b T2 audit findings #1-#7.
- Prevention mechanism (DEC-3) prevents recurrence — Sprint Promote release-debt scan integrates with existing Tech-Debt scan.
- v1 ship baseline clean — Sprint 056 outcome-led release notes (ADR-026) start from 2.6.0 MINOR baseline.
- Outcomes mapped: O5 flow (cleaner Sprint Promote w/ release-debt scan) · O8 reliability (release-debt prevention).

**Negative (trade-offs accepted):**
- `--minor` flag deferred — manual MINOR reconcile remains required for next MINOR-class accumulation. Mitigation: DEC-3 prevention scan flags accumulation early; manual reconcile bounded ~2-hour task.
- DEC-3 codification deferred to TASK-NEW (post-052b close) — Sprint Promote Step 1.5 not yet hard-codified. Mitigation: behavioral via memory `feedback_release_debt_tracking.md` until codified; TASK-NEW row created at sprint close.
- ADR-032 cap pressure ≤120 lines tight for 5 decisions + 5 alternatives + cross-links. Mitigation: each decision ≤4 lines; alternatives ≤2 lines each.

**Neutral:**
- ADR-032 file at `docs/adr/ADR-032-release-debt-resolution-and-mode-boundary.md` per locked convention (Sprint 043 DEC-7 + Sprint 047 DEC-6). ID verified non-colliding (max ADR was 031 post-Sprint-054).
- Sprint 052b T1-T4 implement decisions T1+T2+T3+T4. T5 locks ADR atomically per Sprint 053 T0.5 + Sprint 054 ADR-first sequencing pattern.

## References

- ISSUE origin: 10-sprint release-debt chain breached P0 threshold (recon 2026-05-09); user lock at Sprint 052b promote (4 questions answered).
- ADR-006 — plugin lockstep contract (`plugin.json` + `marketplace.json`).
- ADR-026 — outcome-led CHANGELOG release notes (v1 ship lens).
- ADR-027 — release-patch generalization (PATCH-only boundary; predecessor that left MINOR gap).
- ADR-031 — anti-slip discipline at G1 (DEC-5 re-litigation lock derives from lock 5 focus discipline).
- Sprint 053b T2 — 7-finding audit (closed by Sprint 052b T2+T3 wire-fixes; disposition flips T4 = `1ef1a67`).
- Sprint 052b T1 — manual MINOR 2.5.0→2.6.0 reconcile (`b03f366`).
- Sprint 047 T1 — factual close-out precedent (lock 3 invocation for T4 053b sprint file edits).
- TASK-116-v2 (Sprint 055) — acceptance harness; pre-req for DEC-1 re-evaluation post-v1.
- TASK-128 (Sprint 055b) — token usage audit; DEC-3 lint candidate scope.
- TASK-NEW (post-052b close) — DEC-3 codification: Sprint Promote Step 1.5 release-debt scan + auto-escalate.
- Memory: `feedback_release_debt_tracking.md` (P0 promotion source) · `feedback_canonical_first_pivot.md` (DEC-5 canonical-first edit contract).
- Re-evaluation cadence: post-v1 ship (Sprint 056) — DEC-1 (`--minor` flag) eligible for re-evaluation; DEC-2/DEC-4 mode boundary re-eval if `release-manager` v1.0.0 reuse rate stays zero across 5 post-v1 MINOR cycles.
