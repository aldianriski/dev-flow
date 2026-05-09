# dev-flow — Development Tracker

---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint or task state change
status: current
sprint: none
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
> - Closed sub-blocks (e.g., closed EPIC, closed TASK-NNN cluster) collapse to ≤1 done-line pointer to `docs/CHANGELOG.md` after 1 sprint of cooldown. Don't accumulate done rows.
> - Closed sub-blocks >2 sprints old → DELETE entirely (history lives in `docs/CHANGELOG.md` + sprint files; backlog is for OPEN work).
> - When promoting a P1 cluster, leave only the 1-line summary; details go in sprint plan.

> **Layer values** (meta-repo, no app code)
> `governance, docs, scripts, skills, agents, templates, examples, ci`

---

## Active Sprint

→ — none —

> Sprint 052 closed `fb8e389`. TASK-123 fully delivered: F4 wires 6 orphan skills (prime/zoom-out/tdd/diagnose/refactor-advisor/release-manager) into orchestrator phase detection (skill-dispatch.md Always-On 4→10 rows + phases.md advisory hints + G1 task-type line). F5 ships 4-mechanic tech-debt rollover loop (TD-NNN section in TODO.md + templates · Sprint Close Friction→TD prompt · Sprint Execute mid-sprint fix/defer/block · Sprint Promote Step 1.5 TD scan + auto-escalate) + 5 anti-pattern locks colocated in SPRINT_PROTOCOLS.md.
>
> **Carried forward to TASK-116-v2** (Sprint 054 acceptance harness): TD anti-pattern lock automated enforcement (currently behavioral-only via skill type:rigid contract). 5 locks: never-delete · never-auto-promote-low · never-age-past-6-sprints · never-write-without-severity-source · never-merge-escalated-without-Backlog-match.
>
> Next: Sprint 052b — release-debt resolution (5-sprint MINOR+PATCH chain: Sprint 049 MINOR + 050/051a/051b/052 PATCH). Manual reconcile or release-patch --minor flag decision.

---

## Backlog

### P0 — v1 ship prep (post-EPIC-Audit, post-ISSUE-03 reframe, post-coherence-audit)

- [x] **TASK-119** — User-Project Outcome Lens (closed Sprint 048 `38035d8`).
- [x] **TASK-120** — Plugin Coherence Cleanup + Rename + release-patch Generalize (closed Sprint 049 `7b04875`).
- [x] **TASK-121** — F3 init scaffold full (closed Sprint 050 `8940f01` — gitignore template + docs/codemap+adr dirs + ADR-028).
- [x] **TASK-122a** — Lean Architecture Foundation (closed Sprint 051a `460175b`).
- [x] **TASK-122b** — Lean Architecture Templates + Primer (closed Sprint 051b `2266b9d`): templates/CLAUDE.md.template (74/80 cap held, Session Workflow block fold-in) · templates/ARCHITECTURE.md.template · docs/blueprint/11-lean-architecture.md primer (236/250) · 06c snapshot synced · applySubstitutions extended w/ 5 new tokens (3 scalar + 3 conditional-line for go-gin parity) · lean-doc-generator wired (T4.5 fold-in).
- [x] **TASK-123** — F4 wire orphan skills + F5 tech-debt rollover loop (closed Sprint 052 `fb8e389`): F4 — skill-dispatch.md Always-On table 4→10 rows + phases.md advisory hints; F5 — TD-NNN section in TODO.md + templates · Sprint Close Friction→TD prompt · Sprint Execute mid-sprint fix/defer/block protocol · Sprint Promote Step 1.5 TD scan w/ auto-escalate · 5 anti-pattern locks. Behavioral enforcement only; automated lint deferred TASK-116-v2 Sprint 054. Original spec preserved below for archive:
  - (A) NEW `## Tech Debt` section in TODO.md, distinct from Backlog. Different schema: `TD-NNN` ID prefix (collision prevention) · severity tier required (trivial/minor/medium/high) · source explicit (sprint retro line OR mid-sprint prompt timestamp) · acceptance criteria + sprint placement OPTIONAL (vs required for Backlog).
  - (B) **Sprint Close Protocol** (`lean-doc-generator` Sprint Close): for each Retro § Friction item, prompt user "TD row? (Y/N/already-resolved)". Y → write TD-NNN row. Don't auto-promote ALL friction (some is one-off pattern observation).
  - (C) **Sprint Execute Protocol** (`orchestrator` mid-sprint): when AI flags issue OR human surfaces friction, orchestrator/dispatcher prompts "fix now / defer / block" — `fix` halts task to address; `defer <one-line-reason>` writes TD row + continues; `block` halts sprint per existing first-blocker rule.
  - (D) **Sprint Promote Protocol** (`lean-doc-generator` Sprint Promote): scan TD section; high-severity auto-escalate → Backlog (no human review); aging >6 sprints triggers re-review (escalate / downgrade / resolve); resolved → mark `Status: resolved → TASK-NNN`, do NOT delete (audit trail).
  - (E) **Anti-pattern locks:** never delete TD rows on resolution (preserve trail); never auto-promote low-severity to Backlog (human gate); never let aging exceed 6 sprints without re-review.

  Layers `skills, docs, governance`. → Sprint 052.
- [ ] **TASK-124** — F6 task-decomposer ↔ lean-doc-generator collaboration audit + pattern alignment. Origin: user session 2026-05-08 finding "this 2 skills not colaborate and have different pattern. this skills also when trigger is not create complete docs properly with the right template." Audit scope: read both SKILL.md + references; identify pattern divergence (output style · template ownership · I/O conventions · sprint-promote handoff); decide canonical (lean-doc owns templates; task-decomposer + orchestrator init consume; sprint-promote convergence with TODO.md state). Update both skills to align. Note: F6a (template lineage — lean-doc as canonical template owner) is partially addressed by Sprint 051b template re-render; F6b (collaboration pattern alignment) remains. ADR if hard-to-reverse decisions. Estimated M, layers `skills, docs`. → Sprint 053.
- [ ] **TASK-125** — Broader feature-usage audit sweep (covers gap from F6's narrow scope). Audit ALL skill/agent pairs for collaboration patterns + naming consistency + dispatch wiring: `prime` ↔ `/orchestrator init` · `release-manager` ↔ `release-patch` · `pr-reviewer` skill ↔ `code-reviewer` agent · `security-auditor` skill ↔ `security-analyst` agent · `architecture-grill` ↔ `design-analyst` agent. Surface any other slipped pairs. Origin: user session 2026-05-08 — "audit all feature usage" was broader than F6 alone (TASK-124 covers ONE pair). Estimated M, layers `skills, docs`. → Sprint 053b.
- [x] **TASK-126** — Untracked-files reconcile (closed direct-commit `c18b779`): 30 files staged + tracked. All confirmed legitimate dev-flow artifacts with proper frontmatter + `status: current`; none warranted .gitignore or delete. Repo root (6 files) — AI_WORKFLOW_BLUEPRINT.md / AUDIT.md / AUDIT_PASS2.md / BASELINE_ASPECT.md / READINESS.md / STRATEGY_REVIEW.md. docs/blueprint/ (21 files + VERSION) — CRITICAL fix: plugin install via bin/dev-flow-init.js copyScaffold now ships complete. docs/context/ (3 files) — research/ADAPTATION_NOTES.md + research/CC_SPEC.md + workflow/DESIGN_PHILOSOPHY.md. **Sprint 051b unblocked.**
- [x] **TASK-127** — Optimal usage workflow vision (closed Sprint 051b `2266b9d`): docs/blueprint/12-session-workflow.md primer (163/200 cap) · README.md Daily Pattern expansion · CLAUDE.md template Session Workflow block (3-step `/prime → /lean-doc-generator → /orchestrator`).
- [ ] **TASK-128** — Token usage optimization audit (pre-v1-ship quality gate). Origin: user session 2026-05-08 — "we must track again the token usage optimization after all task don." Audit all skill/agent/CLAUDE.md/CONTEXT.md token footprints; identify bloat candidates; ensure caps still discipline post-feature growth. Generates audit report + targeted trim recommendations. Run AFTER all v1 prereqs land (Sprint 055), BEFORE v1 ship (Sprint 056). Estimated S, layers `governance, scripts, docs`. → Sprint 055b.
- [x] **TASK-129** — `/prime` behavior fix (closed direct-commit; single-task fix per Sprint Sizing Rules "never plan a sprint with only 1 task"): Next: line emitted per detection branch (4 branches: active-sprint+open / active-sprint+done / no-sprint+backlog / no-sprint+empty); 3 anti-patterns added (no inline summarize · no re-read unchanged via SHA1 cache · no full sprint-plan read — partial via `limit: 50`); Read order table updated; Step 6 added; output format includes `[cache hit]` + `(partial)` markers. Cap held 86/100. Skill version 1.0.0 → 1.1.0. last-validated bumped 2026-05-08.
- [ ] **TASK-116-v2** — Skill-triggering acceptance harness: Node port (`scripts/eval-acceptance.js`). **Outcome:** O8 plugin reliability. Verifies 8 lift candidates from Sprints 043 + 045 + retroactive eval-evidence for release-patch v2.0.0 (ADR-027 DEC-2 gap) + skeleton creation Sprint 051a + lean-doc/task-decomposer alignment Sprint 053. Design input: [`docs/research/superpowers-acceptance-harness-2026-05-04.md`](docs/research/superpowers-acceptance-harness-2026-05-04.md). Satisfies ADR-016 + ADR-021 DEC-4. Estimated S-M, layers `scripts, ci, docs`. → Sprint 054.
- [ ] **TASK-115-v2** — Caveman 3-arm eval harness Node port (`scripts/eval-caveman.js` + `scripts/eval-measure.js`). Tokenizer `gpt-tokenizer`. Snapshot schema 1:1 with caveman. **Outcome:** O8 plugin reliability. Depends on TASK-116-v2. Estimated M, layers `scripts, docs`. → Sprint 055.
- [ ] **release-debt resolution sprint** — Sprint 049 MINOR (skill drop + rename + behavior change in release-patch) + Sprint 050 PATCH + Sprint 051a PATCH + Sprint 051b PATCH (pending) chain accumulating. release-patch SKILL handles PATCH only by design. Reconcile manual MINOR + chained PATCHes; OR extend release-patch with `--minor` flag (separate decision). PROMOTED from P2 (was deferred indefinitely; depth growing). → Sprint 052b (own sprint between F4+F5 and F6).
- [ ] **v1 ship** — CHANGELOG release notes lead with user-project outcomes per ADR-026; plugin/marketplace lockstep bump (MINOR if new surface introduced; PATCH otherwise); git push per release-patch HARD STOP. → Sprint 056.

### P2 — Tooling friction backlog (optional, not blocking v1)

- [ ] **release-patch skip-bump-on-docs-only fix** — extend `skills/release-patch/SKILL.md` to detect "EPIC close" / "sprint close" events and trigger archive flush even on docs-only diff. Closes stranded-archive friction structurally (per Sprint 047 ADR-025 DEC-8). Estimated S, layers `skills, scripts`.
- [x] **release-debt** — PROMOTED to P0 (Sprint 052b) per session 2026-05-08 audit; depth grew to 4 sprints; deferring indefinitely was risk. See P0 row above.
- [x] **CONTEXT.md cap pressure** — closed Sprint 048 T5 (Behavioral Guidelines Lineage relocated to `.claude/references/behavioral-guidelines-lineage.md`; CONTEXT.md now 121/130).

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

*(no entries yet — section ready)*

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
Sprint 40    →  EPIC-Audit Phase 4a — Karpathy patterns (lineage lock + ADR-019 + verify-step retro credit)  (done)
Sprint 41    →  EPIC-Audit Phase 4b — Caveman compare (dual-lineage + 3-arm port plan + ADR-020 + caveman-shrink reject)  (done)
Sprint 42    →  EPIC-Audit Phase 4c — Superpowers patterns (hooks lineage + acceptance harness + PR template lift + ADR-021)  (done)
Sprint 43    →  EPIC-Audit Phase 4d — Mattpocock skill library (4-skill diff + bucket defer + CONTEXT.md lifts + .out-of-scope/ + ADR-022 + docs/adr/ convention lock)  (done)
Sprint 44    →  EPIC-Audit Phase 4e — GSD patterns (9 decisions: 5 NO LIFT + 2 DEFER + 2 bidirectional findings; ADR-023 scale-driven defer)  (done)
Sprint 45    →  Phase 4f skill-creator + TASK-104/117/118 (ADR-024 + CONTEXT.md frontmatter+lifts + lean-doc Step 0b date-sanity v2.1.0)  (done)
Sprint 46    →  EPIC-Audit Phase 5 — stale doc refresh (ARCHITECTURE.md + AI_CONTEXT.md restored to current)  (done)
Sprint 47    →  EPIC-Audit Phase 6 close (batch-archive 040-046 + TODO trim + ADR-025 + EPIC-Audit-retro.md)  (done — EPIC-Audit COMPLETE)
Sprint 48    →  User-Project Outcome Lens (ISSUE-03 reframe + USER-OUTCOMES.md + ADR-026 + G1 outcome item) (done — `38035d8`)
Sprint 49    →  Plugin Coherence Cleanup + Rename + release-patch Generalize (F1 drop dev-flow-compress · F2 generalize release-patch 6-mode · architecture-grill rename · ADR-027)  (done — `7b04875`)
Sprint 50    →  F3 init scaffold full (.gitignore + docs/codemap/+adr/ dirs + skill init phase aligned to canonical bin/dev-flow-init.js + ADR-028)  (done — `8940f01`)
Sprint 51a   →  Lean Architecture Foundation (STACK_PRESETS CA+DDD migration + createProjectSkeleton + ADR-029)  (done — `460175b`)
Sprint 51b   →  Lean Architecture Templates + Primer (TASK-122b applySubstitutions extension w/ 5 tokens + CLAUDE.md/ARCHITECTURE.md rewrites + 06c sync + blueprint/11-lean-architecture.md primer + lean-doc wire) · TASK-127 workflow vision (blueprint/12-session-workflow.md + README Daily Pattern expansion + CLAUDE.md Session Workflow block) · in-sprint expansion: 03/08 blueprint refresh to 4-mode/2-gate model (done — `fb8e389`)
Sprint 52    →  F4 wire orphan skills into orchestrator skill-dispatch + phases (6 orphans · 4→10 rows Always-On) + F5 tech-debt rollover loop (TD-NNN section · Friction→TD prompt · mid-sprint fix/defer/block · Sprint Promote scan + auto-escalate · 5 anti-pattern locks) (TASK-123) (done — `fb8e389`)
Sprint 52b   →  release-debt resolution (Sprint 049 MINOR + 050/051a/051b PATCH chain reconcile; manual or release-patch --minor flag decision)
Sprint 53    →  F6 task-decomposer ↔ lean-doc-generator collaboration audit (TASK-124 — narrow pair audit per user finding 2026-05-08)
Sprint 53b   →  Broader feature-usage audit sweep (TASK-125 — all skill/agent pairs: prime↔init / release-manager↔release-patch / pr-reviewer↔code-reviewer / security-auditor↔security-analyst / architecture-grill↔design-analyst)
Sprint 54    →  v1 prereq #1 — TASK-116-v2 Node port acceptance harness (retroactive eval-evidence release-patch v2.0.0 + skeleton + Sprint 053 alignment)
Sprint 55    →  v1 prereq #2 — TASK-115-v2 Node port caveman 3-arm eval
Sprint 55b   →  Token usage optimization audit (TASK-128 — pre-v1-ship quality gate; CLAUDE.md/CONTEXT.md/skills bloat scan)
Sprint 56    →  v1 SHIP — CHANGELOG outcome-led release notes + lockstep bump + git push
```
