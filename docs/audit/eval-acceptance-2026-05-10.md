---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Re-run acceptance harness OR new prompt added
status: current
task: TASK-116-v2
sprint: 055
---

# Skill-Triggering Acceptance Eval — 2026-05-10

> Source: `scripts/eval-acceptance.js` · per `docs/research/superpowers-acceptance-harness-2026-05-04.md`
> Pass rule: stream-json contains `"name":"Skill"` AND `"skill":"<name>"` (or `<namespace>:<name>`); ≥2/3 runs (Mode A quorum per OQ(D)).
> Eval-evidence policy: `CLAUDE.md` Quick Rules L42 + ADR-021 DEC-4 (acceptance harness pattern). Plan T2 AC-4 cited "ADR-016 § Consequences" — corrected at T2 friction-fix to ADR-021 § Consequences (ADR-016 = "Kill Node hook scripts", unrelated; cross-ref in ADR-021 line 66 is itself stale).

## Status (2026-05-10)

**Live runs: OPERATOR-PENDING.** Harness validated dry-run only (T1 + T2 builds). Live `claude -p` invocations require:
- Operator local env w/ `claude` CLI installed AND dev-flow plugin loaded (`/plugin install dev-flow` OR `--plugin-dir <path>` per research §gaps R2)
- API token spend (8 prompts × 3 runs = ~24 invocations w/ `--max-turns 5` each)
- Pin `claude --version` in this report at first live run (research §gaps R1)

This report frozen at T2 close as **harness contract + prompt catalog**. First live run will overwrite per-run sections; lift-coverage table below preserves design contract.

## Lift Candidate Coverage (TASK-116-v2)

8 lift candidates from Sprints 043 + 045 + 049 + 051a + 052 + 053 + 054 + 055b + 055c. Each gets PASS/FAIL/DEFERRED-with-rationale per ADR-031 anti-slip explicit-skip.

| # | Lift Candidate | Sprint | Coverage | Status |
|---|:---------------|:------:|:---------|:-------|
| 1 | release-patch v2.0.0 generalize (ADR-027 DEC-2 gap) | 049 | `prompts/release-patch.txt` | OPERATOR-PENDING |
| 2 | skeleton-create (`bin/dev-flow-init.js` + STACK_PRESETS) | 051a | DEFERRED — bin script, not skill-triggerable via `Skill` tool (per OQ(E) + research §gaps R2 explicit-skip pattern) | DEFERRED |
| 3 | skill-dispatch wiring (6 orphans) | 052 | `prompts/refactor-advisor.txt` + `prompts/zoom-out.txt` (proxy for 2 of 6 orphans now wired) | OPERATOR-PENDING |
| 4 | lean-doc-generator template canonical (ADR-030 DEC-5) | 053 | `prompts/lean-doc-generator.txt` | OPERATOR-PENDING |
| 5 | task-decomposer template-pointer (ADR-030 backflow) | 053 | `prompts/task-decomposer.txt` | OPERATOR-PENDING |
| 6 | anti-slip 4 G1 fields (ADR-031) | 054 | DEFERRED — orchestrator behavior (G1 field-fill verification), not Skill-tool-trigger; orchestrator skill-trigger already covered by `prompts/orchestrator.txt` (T1 seed) | DEFERRED |
| 7 | output-discipline pointer fan-out (ADR-033) | 055b | DEFERRED — CONTEXT.md cross-cutting principle; manifests as protocol-output style WITHIN other skills, not as standalone trigger; needs different harness shape (output-style lint, not skill-trigger detection) | DEFERRED |
| 8 | history-hygiene principle (ADR-034) | 055c | DEFERRED — same shape as #7; behavior at Sprint Close + Promote within `lean-doc-generator`; lean-doc trigger covered by `prompts/lean-doc-generator.txt` | DEFERRED |

**Net coverage:** 5 OPERATOR-PENDING (testable via Skill-tool harness) · 3 DEFERRED-with-rationale (non-trigger-shaped principles or non-skill bin scripts).

**v1 ship gate (Sprint 056):** ≥4/5 testable PASS at first live run (≥80% threshold; allows 1 false-fail per non-determinism R4). 3 DEFERRED entries do NOT count against gate (explicit-skip per ADR-031). <4/5 → remediation candidates surface to Sprint 055-2 (skill-description tuning).

## Per-Skill Prompt Catalog

8 prompt files staged under `tests/skill-triggering/prompts/`:

| Prompt File | Target Skill | Source | Naturalistic? |
|:------------|:-------------|:-------|:--------------|
| `prime.txt` | `prime` | T1 (research §3-skill-seed-picks) | Yes |
| `orchestrator.txt` | `orchestrator` | T1 (research §3-skill-seed-picks) | Yes |
| `tdd.txt` | `tdd` | T1 (research §3-skill-seed-picks; superpowers' validated structure) | Yes |
| `release-patch.txt` | `release-patch` | T2 (lift #1) | Yes — describes "bump version + prep release, don't push" |
| `lean-doc-generator.txt` | `lean-doc-generator` | T2 (lift #4 / lift #8 proxy) | Yes — describes "write architectural overview, why-not-how" |
| `task-decomposer.txt` | `task-decomposer` | T2 (lift #5) | Yes — describes "break down feature idea into structured backlog" |
| `refactor-advisor.txt` | `refactor-advisor` | T2 (lift #3 proxy 1 of 2) | Yes — describes "module hard to work with, where new logic should go" |
| `zoom-out.txt` | `zoom-out` | T2 (lift #3 proxy 2 of 2) | Yes — describes "high-level map before changes, no implementation suggestions" |

**Prompt design rule** (research §acceptance-pattern): naturalistic — DOES NOT name target skill in body. Failure to trigger = skill description weakness OR naming collision OR model variance.

## Per-Run Detail

_(populated at first live run; dry-run rows omitted from frozen contract version.)_

## Cap Headroom (TD-002 lint fold-in)

_(populated at T3 commit; runs `--cap-headroom-warn` flag.)_

## Operator Notes

- First live run command: `node scripts/eval-acceptance.js --cap-headroom-warn`
- Single-skill: `node scripts/eval-acceptance.js --skill release-patch`
- Logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored).
- Mode A (manual) per ADR-021 DEC-4. Mode B (CI on every PR) deferred until ≥10 skills triggering OR cost gate flips per research §recommendation.
- Pin `claude --version` at first live run.
