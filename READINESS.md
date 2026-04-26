---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-26
update_trigger: TASK closure flips a row; new readiness gate added; v1/v2 scope changes
status: current
scope: internal team rollout (v1) → public marketplace (v2)
companion: AUDIT.md (tactical findings), STRATEGY_REVIEW.md (direction), TODO.md (source of truth for tasks)
---

# dev-flow — Readiness Dashboard

> View, not source. Each row maps to a `TASK-NNN` (or epic) in `TODO.md`. Flip `[ ]` → `[x]` only when the linked task closes AND a human re-verifies the gate still holds.
> Rows here do NOT redefine task acceptance — they aggregate cross-cutting readiness gates so the team can see "are we ready to share" at a glance.

---

## v1 — Internal team rollout

> Bar = P0/P1 audit findings closed · EPIC-A done · EPIC-C done · 3+ teammates E2E · maintainable for daily team use.

### Distribution
- [ ] Plugin spec verified · TASK-065
- [ ] `.claude-plugin/plugin.json` manifest valid · TASK-066
- [ ] Path refs migrated to plugin-relative · TASK-067
- [ ] README + bin/ docs updated for plugin install · TASK-068
- [ ] E2E plugin install smoke test · TASK-069

### Proof of usage
- [ ] 1 feature E2E through 10 phases (solo dogfood) · TASK-076
- [ ] Friction log compiled from solo dogfood · TASK-077
- [ ] 3+ team members E2E on real tasks · TASK-091
- [ ] Onboarding ≤30 min on fresh teammate · TASK-092

### Maintainability
- [x] All P0/P1 audit findings closed · Sprints 14–17 (re-verified by TASK-096)
- [ ] `quick` mode is default; full opt-in · TASK-093
- [ ] `mvp` mode added — 3-phase lean delivery for prototype work · TASK-097
- [ ] Version-pin + breaking-change policy ADR · TASK-094
- [ ] Support channel + friction-report template · TASK-095
- [ ] Audit Pass 2 + Pass 1 re-verification · TASK-096

---

## v2 — Public marketplace (deferred, blockers documented)

> Bar = adopters outside the internal team can pick this up without lead-engineer hand-holding. Do NOT pursue until v1 fully `[x]` and at least one full sprint of post-v1 production use has accumulated.

- [ ] Code-enforced gates (read-guard fires in real sessions, not just tests) · EPIC-B / TASK-070..074
- [ ] State as YAML + opt-in telemetry JSONL · EPIC-D / TASK-078..085
- [ ] Harness wrap-or-replace decision applied consistently · EPIC-E / TASK-086..090
- [ ] Eval golden dataset + CI regression gate (beyond baseline snapshots) · new epic — defer
- [ ] Adversarial / red-team pass on bundled scripts and skills · new epic — defer
- [ ] Multi-stack proof (Python-FastAPI + Go-Gin beyond Node) · STRATEGY_REVIEW#R-4 — defer

---

## Out of scope (recorded for clarity)

- Runtime AI service readiness — golden dataset of real user requests, p95 cost per task, on-call rotation, distributed traces, model fallback. Not applicable to a dev-time scaffold. `BASELINE_ASPECT.md` checklist applies to projects **built with dev-flow**, not to dev-flow itself. Promote that file to a skill template (`runtime-readiness-auditor`) only when a real runtime AI project is bootstrapped via dev-flow.

---

## How to use

1. Read top-down at the start of any sprint that asks "are we ready to share". Stops the urge to ship on vibes.
2. Flip a row only when its linked TASK-NNN is `[x]` in TODO.md AND the gate has been re-verified by a human (not just CI).
3. When every v1 row is `[x]` → tag plugin `v1.0.0`, share with internal team.
4. When every v2 row is `[x]` → publish to marketplace, then update `STRATEGY_REVIEW.md` "Bottom line" outcome.
5. If a new readiness gate emerges from team feedback, add the row here + a paired TASK-NNN in TODO.md. Never add a row without a backing task.
