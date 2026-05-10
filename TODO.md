# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint or task state change
status: current
sprint: 055-2
---

> **External references** — archived per Sprint 047 ADR-025 EPIC-Audit close. Lineage now lives in `docs/adr/ADR-019..024-*.md` (one ADR per ext-ref) + `docs/CHANGELOG.md` § EPIC-Audit milestone (Sprints 040-046).

> **How to use this file**
> - **Start of session** — read this file first. Understand active sprint before touching code.
> - **Run /orchestrator** — dispatcher parses first incomplete task `[ ]` in Active Sprint.
> - **End of session** — Session Close. Move completed items to Changelog.
> - **Sprint completed** — remove from Active Sprint, append Changelog row (File | Change | ADR), update relevant docs, rotate sprint block to `docs/CHANGELOG.md`.
> - **Changelog rule** — holds ONLY current in-progress sprint. Once reflected in docs, MOVE to `docs/CHANGELOG.md` (prepend), then DELETE from here.

> **Sprint sizing rules**
> - Group 2–5 tasks per sprint. Never plan a sprint with only 1 task.
> - Order by dependency first, then importance + urgency.
> - Promote from Backlog in priority order (P0 → P1 → P2 → P3).
> - Remove promoted tasks from Backlog immediately.

> **Backlog hygiene rules**
> - Closed sub-blocks AND individual closed task rows (e.g., closed EPIC, closed TASK-NNN cluster, single `[x] **TASK-NNN**` row) collapse to ≤1 done-line pointer to `docs/CHANGELOG.md` after 1 sprint of cooldown. Don't accumulate done rows.
> - Closed sub-blocks AND individual rows >2 sprints old → DELETE entirely (history lives in `docs/CHANGELOG.md` + sprint files + `git log`; backlog is for OPEN work).
> - When promoting a P1 cluster, leave only the 1-line summary; details go in sprint plan.

> **Layer values** (meta-repo, no app code)
> `governance, docs, scripts, skills, agents, templates, examples, ci`

---

## Active Sprint

→ **[docs/sprint/SPRINT-055-2-caveman-3arm-eval.md](docs/sprint/SPRINT-055-2-caveman-3arm-eval.md)** (status: active · plan_commit `573c062`)

> Sprint 055-2 promoted 2026-05-10 — TASK-115-v2 Caveman 3-arm eval Node port. Single-task sprint per anti-drift hard-stop #3 (3 sub-tasks: T1 runner + T2 measure + T3 tests/close). Pre-promote release-debt cleared via Release 2.7.0 (`9cc3470`); cap-headroom OQ-1/2/3 cleared via `b40c087`. Step 1.5b BLOCK lifted (depth=0).
>
> Next: Sprint 056 — v1 ship (CHANGELOG outcome-led release notes + planned MINOR/MAJOR lockstep bump per ADR-032 DEC-2).

---

## Backlog

### P0 — v1 ship prep (post-EPIC-Audit, post-ISSUE-03 reframe, post-coherence-audit)

- [x] **TASK-128** — closed Sprint 055b `be46f3f` — token usage audit (37 files · 35,549→36,856 tokens · 8 ranked bloat candidates · 3 verdicts caveman KEEP/sprint-close-commit-ID DEFER/planner-compress DEFER).
- [x] **TASK-130** — closed Sprint 054 `932d700` — orchestrator anti-slip discipline at G1 + ADR-031 + Phase 0 Active Sprint guard + Friction Protocol explicit triggers; orchestrator 2.0.0→2.1.0.
- [x] **TASK-131** — closed Sprint 054b `65e74c5` — orchestrator doc-wire cleanup (ADR-030 init citation + Path B citation + skill-dispatch NEW Invocation column).
- [x] **TASK-129** — closed direct-commit — /prime behavior fix (per-detection-branch Next: + 3 anti-patterns + Step 6 + cache markers); skill 1.0.0→1.1.0.
- [x] **TASK-116-v2** — closed Sprint 055 (close commit pending) — acceptance harness Node port (`scripts/eval-acceptance.js` 273 lines no deps · 3-run quorum Mode A · `--cap-headroom-warn` flag) + 8 prompts (3 seed + 5 lift; 3 DEFERRED-with-rationale per ADR-031) + audit report frozen as harness contract + TD-002 fold-in resolved (Path B lint adopted; 16 skills · 13 OK/2 WARN/1 BREACH). Mode A operator-pending; live runs deferred per OQ(C).
- [x] **TASK-134a** — closed Sprint 055c (close commit pending) — History Hygiene plugin principle codified (CONTEXT.md § +17 lines · ADR-034 5 DECs · TODO/sprint/CHANGELOG/Roadmap rules applied; ribbon 8→3 · 12 row collapses · 10 row deletes; 0 friction).
- [x] **TASK-134b** — closed Sprint 055c (close commit pending) — Legacy-doc scan + cleanup (`scripts/scan-legacy-docs.js` zero-dep 267 lines + 6 repo-root anomalies → 4 ARCHIVE/2 KEEP verdicts applied; cross-refs verified clean).
- [ ] **v1 ship** — CHANGELOG release notes lead with user-project outcomes per ADR-026; plugin/marketplace lockstep bump (MINOR if new surface introduced; PATCH otherwise); git push per release-patch HARD STOP. → Sprint 056.

### P1 — Post-052b prevention codification

- [x] **TASK-NEW (DEC-3 codification)** — closed Sprint 055b `be46f3f` — Step 1.5b release-debt scan codified in SPRINT_PROTOCOLS.md (depth ≥3 P1 · ≥5 escalate P0 · ≥7 BLOCK + counter-stale guard + pre-release MINOR clause); lean-doc 2.2.0→2.3.0 MINOR.
- [x] **TASK-133** — closed Sprint 055b `be46f3f` — Output Discipline plugin principle (CONTEXT.md § + ADR-033 + 22/23-file pointer fan-out via scripts/propagate-output-discipline.js; release-patch SKILL.md sole exception per DEC-4 zero-headroom).

### P2 — Tooling friction backlog (optional, not blocking v1)

- [ ] **release-patch skip-bump-on-docs-only fix** — extend `skills/release-patch/SKILL.md` to detect "EPIC close" / "sprint close" events and trigger archive flush even on docs-only diff. Closes stranded-archive friction structurally (per Sprint 047 ADR-025 DEC-8). Estimated S, layers `skills, scripts`.

---

## Tech Debt

> **Schema** (TASK-123 F5 — Sprint 052):
> - **IDs:** `TD-NNN` namespace (separate from `TASK-NNN`).
> - **Severity tiers:** `trivial · minor · medium · high` (lowercase, ascending risk). `high` auto-escalates to Backlog P1 at Sprint Promote (no human review). `trivial · minor · medium` require human gate.
> - **Status values:** `open · escalated · resolved`. ALL three permanent — rows are NEVER deleted (audit trail). Resolved rows stay with `status: resolved → TASK-NNN`.
> - **Sort order:** open (high → trivial), then escalated, then resolved at bottom.
> - **Aging:** `current sprint - sprint-created`. >6 sprints triggers re-review prompt at Sprint Promote.
>
> **Anti-pattern locks** → `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md § Tech Debt Anti-Pattern Locks`.

- **TD-003** *(severity: medium · status: open · created: 055b)* — Over-broad `git checkout -- skills/` reverted reference files including SPRINT_PROTOCOLS.md mid-sprint. Codify scoped-checkout-glob pattern (`skills/*/SKILL.md agents/` form) to avoid directory-wide reverts when intent is per-file SKILL revert. **AC:** CLAUDE.md Quick Rules § GOVERNANCE OR sprint protocols add scoped-checkout-glob anti-pattern + canonical form. **Sprint placement:** TASK-134a Sprint 055c (governance hygiene candidate). **Source:** Sprint 055b retro Friction #2.
- **TD-002** *(severity: minor · status: resolved → TASK-116-v2 Sprint 055 T3 · created: 052b · resolved: 055)* — release-patch SKILL.md 100/100 EXACT cap forced line-23 in-place modify rather than new cite line. Track per-skill cap-headroom-budget at last_validated stamp to flag drift. **Resolved 2026-05-10:** Path B adopted (harness lint, not frontmatter field) — `scripts/eval-acceptance.js --cap-headroom-warn` lints 16 skills · OK ≥5 / WARN <5 / BREACH >cap. First run surfaced 1 BREACH (release-patch 101/100) + 2 WARN (orchestrator 100/100, lean-doc 97/100); see `docs/audit/eval-acceptance-2026-05-10.md` § Cap Headroom. Remediation deferred (Friction Protocol scope-creep guard). **Source:** Sprint 052b retro Friction #2.
- **TD-004** *(severity: minor · status: open · created: 055b)* — Sprint 055b T3.3 initial pointer-line append pattern `\n\n---\n\n<pointer>\n` (+4 lines) breached caps on 4 cap-pressure files; required revert + script fix to `\n\n<pointer>\n` (+2 lines). Codify minimal-line-count append patterns as canonical for plugin-wide pointer fan-out across cap-pressure surfaces. **AC:** ADR-033 § Consequences OR `scripts/propagate-output-discipline.js` header comment documents `\n\n<pointer>\n` as canonical (+2 lines max for cap-pressure targets). **Sprint placement:** TASK-134a Sprint 055c (pattern codification candidate). **Source:** Sprint 055b retro Friction #1.
- **TD-001** *(severity: medium · status: resolved → TASK-NEW Sprint 055b T2 inline · created: 052b · resolved: 055b)* — P0 release-debt depth count was stale at Sprint 052b promote (memory said 8; recon found 10 post-053c close). Resolved by Sprint 055b T2 inline fold-in: `SPRINT_PROTOCOLS.md` Step 1.5b § Counter-stale guard codifies "release-debt depth count refreshes atomically with this scan; do NOT trust pre-cached values from prior session memory." Anti-pattern lock #1 preserves row in audit trail. **Source:** Sprint 052b retro Friction #1.

---

### P3 — Closed sub-blocks (CHANGELOG references only)

> All historical TASK-NNN clusters and closed EPICs are archived in `docs/CHANGELOG.md`. Per Backlog hygiene rules: closed sub-blocks >1 sprint old are collapsed; >2 sprints old are deleted from Backlog (history lives in CHANGELOG + sprint files).
>
> - **EPIC-Audit (closed Sprint 047)** — `docs/CHANGELOG.md` § Sprint 047 + ADR-025 + `docs/audit/EPIC-Audit-retro.md`.
> - **TASK-104 / 117 / 118 (closed Sprint 045)** — `docs/CHANGELOG.md` § Sprint 045.
> - **EPIC-E TASK-086..090 (closed Sprint 028-029)** — `docs/CHANGELOG.md` (pre-Sprint-040 entries).

---

## Changelog

> Current in-progress sprint only. Completed sprints archived in `docs/CHANGELOG.md`.
> Sprints 0–27 archived → `docs/CHANGELOG.md`.

*All closed sprints archived → `docs/CHANGELOG.md` (Sprint 047 T1 batch-archive of 040-046; previously archived 0-039).*

---

## Quick Rules
> Key conventions for any contributor (human or AI) working on dev-flow itself.

```
SCAFFOLD WORK
- Never write a script that touches Claude Code hooks without verifying the input
  contract against context/research/CC_SPEC.md.
- Skill frontmatter: `name` and `description` are spec-required. Document extras
  (version, last-validated, type, agent, spawns) in CONTEXT.md, mark required vs optional.
- Skill `description`: third-person, starts "Use when…", ≤500 chars,
  NEVER summarizes internal process.
- Every SKILL.md that depends on AI not rationalizing gets a "Red Flags" section.
- Heavy reference content (>100 lines) goes in skills/<name>/references/, NOT inline in SKILL.md.
- Scripts: Node.js ≥18. No bash-only constructs. Tested on Windows Git Bash + Linux.
- Every script under scripts/ gets a sibling __tests__/<name>.test.js.

DOC WORK
- Line caps: CLAUDE.md ≤80 · SKILL.md ≤100 · agents ≤30. Trim before commit — do not raise caps.
- Every doc file gets ownership header (owner, last_updated, update_trigger, status).
- HOW → code comment. WHY → DECISIONS.md. WHERE → ARCHITECTURE.md or README.md.

GOVERNANCE
- Version bumps follow semver:
  MAJOR = phase/gate/hook contract change
  MINOR = new mode / new agent / new skill
  PATCH = clarification / prompt rewording / fix
- Skill changes that alter agent behavior require eval evidence before merge.
```

---

## Roadmap (informational)

```
Sprint 0–13  →  Foundation through governance         (done)
Sprint 14–17 →  Audit passes + blueprint decomp        (done)
Sprint 18–20 →  Plugin foundation + dogfood            (done)
Sprint 21–24 →  Audit Pass 2 + plugin release          (done)
Sprint 25–26 →  Workflow gaps + read-guard guardrail    (done)
Sprint 27    →  Marketplace schema fix                  (done — TASK-111, TASK-112)
Sprint 28    →  Wrap-or-replace CC primitives           (done — TASK-086..089, ADR-012)
Sprint 29    →  EPIC-E close — consistency sweep        (done — TASK-090)
Sprint 30    →  P0 safety + truth-in-docs               (done — read-guard removed, hooks dedup, ADR sweep)
Sprint 31    →  P0 workflow contract                    (done — agent trim, phase naming, rotate, SECURITY.md)
Sprint 32    →  P1 consistency sweep                    (done — vocab + dispatch + skill-desc fixes)
Sprint 33    →  P2 polish sweep                         (done — copywriting + naming alignment)
Sprint 34    →  EPIC-Audit Phase 0 (audit reconcile + baseline + plan)  (planning)
Sprint 35-37 →  EPIC-Audit Phases 1-3 (rename / wiring / trim)         (done)
Sprint 38    →  Foundation Hardening (kill Node hooks + PS replacement + lean-doc cache)  (done)
Sprint 39    →  Codemap + Modes + Skills (codemap base / sprint-bulk mode / /prime / /release-patch)  (done)
Sprint 40-47 →  EPIC-Audit (Phases 4a-6 + close — ADR-019..025 · 7 ADRs · 9 research notes — see `docs/CHANGELOG.md`)  (done — EPIC-Audit COMPLETE)
Sprint 48    →  User-Project Outcome Lens (ISSUE-03 reframe + USER-OUTCOMES.md + ADR-026 + G1 outcome item) (done — `38035d8`)
Sprint 49    →  Plugin Coherence Cleanup + Rename + release-patch Generalize (F1 drop dev-flow-compress · F2 generalize release-patch 6-mode · architecture-grill rename · ADR-027)  (done — `7b04875`)
Sprint 50    →  F3 init scaffold full (.gitignore + docs/codemap/+adr/ dirs + skill init phase aligned to canonical bin/dev-flow-init.js + ADR-028)  (done — `8940f01`)
Sprint 51a   →  Lean Architecture Foundation (STACK_PRESETS CA+DDD migration + createProjectSkeleton + ADR-029)  (done — `460175b`)
Sprint 51b   →  Lean Architecture Templates + Primer (TASK-122b applySubstitutions extension w/ 5 tokens + CLAUDE.md/ARCHITECTURE.md rewrites + 06c sync + blueprint/11-lean-architecture.md primer + lean-doc wire) · TASK-127 workflow vision (blueprint/12-session-workflow.md + README Daily Pattern expansion + CLAUDE.md Session Workflow block) · in-sprint expansion: 03/08 blueprint refresh to 4-mode/2-gate model (done — `fb8e389`)
Sprint 52    →  F4 wire orphan skills into orchestrator skill-dispatch + phases (6 orphans · 4→10 rows Always-On) + F5 tech-debt rollover loop (TD-NNN section · Friction→TD prompt · mid-sprint fix/defer/block · Sprint Promote scan + auto-escalate · 5 anti-pattern locks) (TASK-123) (done — `fb8e389`)
Sprint 52b   →  release-debt resolution (10-sprint chain reconcile: 1 MINOR Sprint 049 + 9 PATCH 050/051a/051b/052/053/053b/053c/054/054b · manual MINOR 2.5.0→2.6.0 + ADR-032 5-decision lock + 7 053b T2 audit findings closed)  (done — `26543d7`)
Sprint 53    →  F6 task-decomposer ↔ lean-doc-generator collaboration audit + Sprint 052 T7 carry-forward (TASK-124) — ADR-030 template canonical ownership · decomposition-spec.md template-pointer · SPRINT_PROTOCOLS.md Step 1.2 backflow · lean-doc Step 6 + task-decomposer Step 6 template-read · validation pass (done — `a9b1f05`)
Sprint 54    →  TASK-130 Anti-Slip Discipline at G1 + Phase Guards (ADR-031 + 4 new G1 fields focus/context-budget/explicit-gaps/done-confirmation + sprint-bulk Phase 0 Active Sprint guard + Friction Protocol 5 AI triggers + 3 human shortcuts) (done — `932d700`)
Sprint 53b   →  Broader feature-usage audit sweep (TASK-125 — all skill/agent pairs: prime↔init / release-manager↔release-patch / pr-reviewer↔code-reviewer / security-auditor↔security-analyst / architecture-grill↔design-analyst) — runs AFTER 054 anti-slip closes user pain
Sprint 54b   →  TASK-131 Orchestrator Doc-Wire Cleanup (ADR-030 init citation + Path B citation + orphan invocation verification)
Sprint 55    →  v1 prereq #1 — TASK-116-v2 Node port acceptance harness (incl. anti-slip lint + retroactive eval-evidence release-patch v2.0.0 + skeleton + Sprint 053 alignment)
Sprint 55-2  →  v1 prereq #2 — TASK-115-v2 Node port caveman 3-arm eval
Sprint 55b   →  Token usage optimization audit (TASK-128 — pre-v1-ship quality gate; CLAUDE.md/CONTEXT.md/skills bloat scan)
Sprint 56    →  v1 SHIP — CHANGELOG outcome-led release notes + lockstep bump + git push
```
