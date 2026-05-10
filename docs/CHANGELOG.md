---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10 (Sprint 055 closed — acceptance harness + TD-002 fold-in)
update_trigger: Sprint completed; blueprint version bumped
status: current
---

# Changelog

> Entries are prepended (newest first). Each sprint block is moved here from `TODO.md` once its changes are reflected in docs.
>
> **Path note:** Pre-v2 entries (before Sprint 32) reference `.claude/skills/`; canonical path is `skills/` since v2.0. Pre-Sprint-35 entries reference skill `dev-flow` (renamed to `orchestrator`) and agent `orchestrator` (renamed to `dispatcher`) — see ADR-014.
>
> **Semver bump rules** (also in `CONTRIBUTING.md` when it exists):
> - `MAJOR` — phase model / gate model / hook contract change
> - `MINOR` — new mode / new agent / new skill / new hard stop
> - `PATCH` — clarification / prompt rewording / fix

---

## Sprint 055 — Acceptance Harness Node Port + TD-002 Cap-Headroom Lint Fold-In (2026-05-10)

- Sprint file: [docs/sprint/SPRINT-055-acceptance-harness.md](sprint/SPRINT-055-acceptance-harness.md)
- Plan commit: `fa4b784` (backfilled `5fcf2a6`)
- Close commit: `TBD` *(filled after step 8 squash)*
- Tasks: T1 ✓ (`9607cf8`) · T2 ✓ (`a195ac0`) · T3 ✓ (`158b0ce`) · T4 ✓ (`3f83dbc`) · T5 ✓ (close)
- ADRs: — (ADR-035 explicitly NOT written per D3 — Mode-A-vs-B branch did not surface; design decision already covered by ADR-021 DEC-4 + Sprint 042 T3 research note)
- Files changed: 17 (3 NEW scripts/tests · 8 NEW prompts · 1 NEW audit report · 5 modifications) · Tests added: 0 (dry-run validation; live runs operator-pending Mode A)
- Summary: T1 shipped `scripts/eval-acceptance.js` (273 lines, no deps; 3-run quorum harness with `--dry-run` + `--cap-headroom-warn` pre-wire) + 3-skill seed (prime/orchestrator/tdd) + tests/skill-triggering/ scaffold (README ≤40 + .gitignore + log dir); T2 staged 5 lift-candidate prompts (release-patch/lean-doc/task-decomposer/refactor-advisor/zoom-out) + 3 DEFERRED-with-rationale per ADR-031 anti-slip explicit-skip + audit report rewritten as frozen harness contract + ADR-021 § Consequences pointer (mid-sprint friction-fix replaced stale ADR-016 cite); T3 cap-headroom lint inline (16 skills · 13 OK · 2 WARN · 1 BREACH) — surfaced release-patch 101/100 BREACH + orchestrator 100/100 + lean-doc 97/100 drift; TD-002 resolved via Path B harness lint; T4 conditional ADR-035 SKIPPED (no branch surfaced) + lean-doc SKILL pointer SKIPPED (cap-pressure 97/100 per OQ(H)) → README scripts table updated.
- Decisions (6): D1 ADR-021 canonical (not ADR-016) for eval-evidence pointer · D2 Path B lint for cap-headroom (TD-002) · D3 ADR-035 NOT written (no branch) · D4 lean-doc SKILL pointer skipped (cap-pressure) · D5 audit reports as frozen contracts · D6 release-patch BREACH NOT remediated (scope-creep guard).
- Pattern candidates (3): PC-1 harness contract + prompt catalog as frozen audit deliverable · PC-2 Path B lint over frontmatter for cross-cutting drift detection · PC-3 Mode A operator-pending pattern for cost-gated harnesses.
- Open Questions (4) for Sprint 056 promote: OQ-1 release-patch 101/100 BREACH (HIGH) · OQ-2 orchestrator 100/100 EXACT (MEDIUM) · OQ-3 lean-doc 97/100 (MEDIUM) · OQ-4 release-debt depth=7 BLOCK threshold (CRITICAL — Sprint 056 v1-ship is natural reconcile per ADR-032 DEC-2).
- TD-002 status: `resolved → TASK-116-v2 Sprint 055 T3` (Path B adopted; Path A frontmatter rejected per OQ(F)).
- Friction events (2): F1 plan T2 AC-4 wrong-ADR cite (recovered via Friction Protocol fix-now ~5min; no TD row — one-off) · F2 cap-headroom +1 drift across 3 files since Sprint 055b T3.4 (lint mechanism now live; root-cause deferred to Sprint 056 OQ-1/2/3 remediation).
- Blueprint version: 2.6.0 unchanged (no plugin manifest contract change). Release-debt depth: 7 PATCH-only sprints since 2.5.0→2.6.0 (Sprint 055 added) — HITS ≥7 BLOCK threshold per Step 1.5b. MUST address pre-Sprint-056-promote (Sprint 056 v1-ship is the natural reconcile per ADR-032 DEC-2).

---

## Sprint 055c — History Hygiene Plugin Principle + Legacy-Doc Scan (2026-05-10)

- Sprint file: [docs/sprint/SPRINT-055c-history-hygiene.md](sprint/SPRINT-055c-history-hygiene.md)
- Plan commit: `cf1fb37` (backfilled `5e55424`)
- Close commit: `a197a47` (backfilled `5a3f079`)
- Tasks: T1 TASK-134a Phase 1 ✓ (`0875c87`) · T2 TASK-134a Phase 2-4 ✓ (`c178d55`) · T3 TASK-134b Phase 1 ✓ (`d6702bb`) · T4 TASK-134b Phase 2-3 ✓ (`4459338`)
- ADRs: ADR-034 History Hygiene (5 DECs: principle home in `.claude/CONTEXT.md` § · 5 per-surface rules · 2-trigger apply-when Sprint Close + Promote Step 1.5c · 3-action collapse/archive/delete policy · re-litigation lock per ADR-031)
- Files changed: 11 (1 new ADR · 1 new script · 1 new audit report · 4 archive moves · 4 modifications) · Tests added: 0 (governance + tooling sprint)
- Summary: T1 codified plugin-wide History Hygiene principle (CONTEXT.md § +17 lines · ADR-034 · pattern shape mirrors ADR-033 Output Discipline); T2 applied rules to TODO.md (ribbon trim 8→3 · 12 closed-row collapses · 10 row deletes per DEC-4 · CHANGELOG/Roadmap audit clean · sprint-files retro caps audit clean · cross-ref grep verified); T3 wrote zero-dep `scripts/scan-legacy-docs.js` (267 lines · refs + age + status + verdicts · cross-platform); T4 ran scan (161 files · 6 repo-root anomalies) → user verdicts 4 ARCHIVE (AUDIT/AUDIT_PASS2/BASELINE_ASPECT/READINESS → `docs/archive/`) + 2 KEEP (AI_WORKFLOW_BLUEPRINT redirect-stub · STRATEGY_REVIEW strategic ref); frontmatter annotations applied; cross-refs verified clean.
- Pattern candidates (3): plugin-principle paired sprint shape (codify-then-apply same cycle · 2nd instance after Sprint 055b) · repo-root anomaly rule for legacy scans · frontmatter annotation on archive (preserves provenance at file).
- 0 friction (mid-T2 rule clarification absorbed in-scope per ADR-034 DEC-2 codify+apply pattern; no Mid-Sprint Friction Protocol invocation).
- Blueprint version: 2.6.0 unchanged (no plugin manifest contract change). Release-debt depth: 6 PATCH-only sprints since 2.5.0→2.6.0 (Sprint 055c added) · still <7 BLOCK threshold; reconcile deferred to Sprint 056 v1-ship per Open Question verdict at promote.

---

## Sprint 055b — Token Audit + Output Discipline + Release-Debt Scan (2026-05-10)

- Sprint file: [docs/sprint/SPRINT-055b-token-output-discipline.md](sprint/SPRINT-055b-token-output-discipline.md)
- Plan commit: `b05ae9a`
- Close commit: `be46f3f`
- Tasks: T1 TASK-128 ✓ · T2 TASK-NEW DEC-3 codify ✓ · T3 TASK-133 Output Discipline ✓
- ADRs: ADR-033 Output Discipline (5 decisions: principle home + pointer propagation + O8 anchor + zero-headroom handling + re-litigation lock)
- Skill version bumps: lean-doc-generator 2.2.0 → 2.3.0 MINOR (Step 1.5b release-debt scan)
- Files changed: 28 modified + 5 new (audit script + propagate script + ADR-033 + 2 audit reports) · Tests added: 0 (audit + codification sprint)
- Summary: T1 token audit (37 files · 35,549 → 36,856 tokens after T3) surfaced 8 ranked bloat candidates + 3 verdicts (caveman KEEP · sprint-close commit-ID DEFER · planner compress DEFER); T2 codified ADR-032 DEC-3 release-debt scan (Step 1.5b: depth ≥3 P1 · ≥5 auto-escalate · ≥7 BLOCK + counter-stale guard + pre-release MINOR clause); T3 codified Output Discipline plugin-wide (`.claude/CONTEXT.md` § Output Discipline + ADR-033 + 22/23-file pointer fan-out via `scripts/propagate-output-discipline.js`; release-patch SKILL.md sole exception per DEC-4 zero-headroom).
- Pattern candidates (4): verify-per-file fan-out via Node script · plugin-principle 4-step shape (CONTEXT.md + ADR + propagation script + cap-validation) · mid-sprint scope deferral via Surprise log · audit-then-codify sequence.
- Mid-Sprint Friction Protocol invoked once (post-T3): user-surfaced History Hygiene scope expansion → DEFER per ADR-031 anti-slip → TASK-134a + TASK-134b written to Backlog (Sprint 055c candidate).
- Blueprint version: 2.6.0 unchanged (no plugin manifest contract change; lean-doc skill MINOR is internal contract only).

---

## Sprint 052b — Release-Debt Resolution (10-sprint MINOR reconcile) (2026-05-09)

- Sprint file: [docs/sprint/SPRINT-052b-release-debt-resolution.md](sprint/SPRINT-052b-release-debt-resolution.md)
- Plan-lock `e175dca` · T1 close — see commit log
- **Blueprint version:** MINOR bump 2.5.0 → 2.6.0 lockstep (`plugin.json` + `marketplace.json`) per semver MINOR rule. Consolidates 1 MINOR-class (Sprint 049) + 9 PATCH (Sprints 050/051a/051b/052/053/053b/053c/054/054b) since last bump. See per-sprint blocks below for full detail. **Rationale:** Sprint 049 introduced 3 MINOR-class behavioral changes (release-patch generalize ADR-027 + dev-flow-compress drop + architecture-grill rename) but bumped via release-patch (PATCH-only by design — release-patch HARD-rejects MINOR per ADR-027 boundary); 9 subsequent sprints accumulated as PATCH; chain crossed P0 threshold at Sprint 052 + grew to 10 by 2026-05-09. Reload activates on next plugin reinstall.
- **Consolidated reconcile by class** (since 2.5.0):
  - **Features:** F3 init scaffold (TASK-121) · F4 wire 6 orphan skills (TASK-123) · F5 tech-debt rollover loop (TASK-123) · session-workflow primer (TASK-127) · 11-lean-architecture primer (TASK-122a/b) · prime/release-patch/Architecture-Grill universal-skill rows.
  - **Behavioral (skill MINORs):** lean-doc-generator 2.0→2.2 (Step 0b date-sanity · template-load contract) · task-decomposer 1.0→1.1 (template-load contract) · orchestrator 2.0→2.1 (Phase 0 Active Sprint guard · Mid-Sprint Friction Protocol triggers · G1 anti-slip 4-field).
  - **Fixes:** 053b T7 17-edit primer propagation · 053c init-primer cleanup (TASK-132) · 054b orchestrator doc-wire (TASK-131) · 053b T6 wire-fixes (security-auditor ADR-015 cite · phases.md `/prime` handoff).
  - **Docs:** 6 ADRs since 2.5.0 — 027 generalize · 028 init contract · 029 lean-arch · 030 template canonical · 031 anti-slip · 032 release-debt (this sprint, T5).
- T1 reconcile (this commit): manifest 2.5.0 → 2.6.0 lockstep + this CHANGELOG block prepend. NO release-patch invocation (DEC-1 — manual reconcile this sprint; `--minor` flag deferred to TASK-NEW post-v1).
- T2-T5 (in-flight): release-manager + release-patch SKILL.md wire-fixes (053b T2 findings #1-#5) · 05-skills.md primer drift (053b T2 findings #6-#7) · Sprint 053b factual close-out · ADR-032 5-decision lock (flag scope · release-manager role · prevention mechanism · mode boundary · re-litigation lock).
- release-debt: RESOLVED at T1. Chain depth 10 → 0. Prevention mechanism per ADR-032 DEC-3 (Sprint Promote Step 1.5 release-debt scan + auto-escalate at 3+ depth) — locked T5.

## Sprint 054b — Orchestrator Doc-Wire Cleanup (TASK-131) (2026-05-09)

- Sprint file: [docs/sprint/SPRINT-054b-orchestrator-doc-wire-cleanup.md](sprint/SPRINT-054b-orchestrator-doc-wire-cleanup.md)
- Plan/T1+T2 `511959b` · T3 `c054d3f` · close `65e74c5`
- Summary: TASK-131 closed (Sprint 054 carry-forward; doc-coherence). **T1+T2** — orchestrator/SKILL.md init Phase Step 2 + Mode Dispatch Path B note both extended w/ ADR-030 + Sprint 053 T4 procedure.md Step 6 citations. In-place single-line edits; cap held 97/100 (≤97 budget exact). **T3** — skill-dispatch.md Always-On table tightened: 3 vague rows (tdd · lean-doc-generator · adr-writer) made explicit w/ "fires when X" concrete conditions; NEW Invocation column distinguishes 4 patterns (auto-fires · proposed→human y/n · user-invoked · agent-output-triggered); refactor task-type added to mutual-exclusivity note. All 6 orphans (prime · zoom-out · diagnose · tdd · refactor-advisor · release-manager) now have explicit trigger + invocation pattern.
- ADRs: none (doc-coherence sprint; no behavioral contract change).
- No skill version bumps (orchestrator stays 2.1.0 — no new mode/agent/skill/hard stop).
- Carry-forward: same as Sprint 054 — TASK-125 Sprint 053b · Sprint 052b release-debt · TASK-116-v2 Sprint 055.
- Final sprint of session 2026-05-09. 5 sprints closed (051b · 052 · 053 · 054 · 054b) + 4 ADRs added (027 was prior; 028-031 this lineage). Plugin manifest reload required next session for Sprint 049-054b accumulated behavioral contracts to take effect.

## Sprint 054 — Anti-Slip Discipline at G1 + Phase Guards (TASK-130) (2026-05-09)

- Sprint file: [docs/sprint/SPRINT-054-anti-slip-discipline-phase-guards.md](sprint/SPRINT-054-anti-slip-discipline-phase-guards.md)
- Plan/T0.5 `eb6ad7f` · T1 `36972bb` · T2 `3decd4f` · T3 `7cd1a5c` · T4 (validation; no commit) · close `932d700`
- Summary: TASK-130 fully delivered. **T0.5 ADR-031 anti-slip discipline at G1** — G1 Scope Checklist gains 4 new fields canonical (focus · context-budget · explicit-gaps · done-confirmation); all required at PASS — partial fill = BLOCK. acceptance + done-confirmation kept SEPARATE (different concerns: completion criteria vs observable test). Behavioral enforcement via type:rigid skill contract; automated lint deferred to TASK-116-v2 Sprint 055. ADR-031 99/120 cap held. **T1 sprint-bulk Phase 0 Active Sprint guard** — orchestrator SKILL.md gained Step 0 reference-delegation form (cap 94→97/100; ≤97 budget exact; 3-line margin); phases.md gained full Step 0 prompt format with soft-guard default halt redirecting to /lean-doc Sprint Promote. **Coordination loop NOW BIDIRECTIONAL**: Sprint 053 T2 added /lean-doc Sprint Promote → /task-decomposer backflow when Backlog empty; Sprint 054 T1 added /orchestrator sprint-bulk → /lean-doc Sprint Promote backflow when Active Sprint empty. **T2 Mid-Sprint Friction Protocol explicit triggers** — Trigger section extended with 5 AI invocation conditions (scope-creep detected · 3+ failed runs · unexpected file changes · ambiguity blocking task · context-budget exceeded) + 3 human invocation shortcuts at task boundary (`friction` neutral / `defer <reason>` direct / `block` direct). Existing fix/defer/block flow preserved verbatim. **T3 G1 Scope Checklist 4 new fields** — focus · context-budget · explicit-gaps · done-confirmation inserted after `red flags:` before `status:`; anti-slip note added. **T4 validation pass** — synthetic dry-run "Add user profile page" task; all 4 fields meaningful + non-conflicting; Phase 0 + Friction triggers verified; Sprint 053 + Sprint 052 protocols intact (separate file). **No drift findings.**
- ADRs: ADR-031 (anti-slip discipline at G1) — 5 decisions + 5 alternatives + cross-links to ADR-030 + ADR-029 + Sprint 052 F5(C) + Sprint 053 T0.5 ADR-first pattern + TASK-116-v2 + TASK-125.
- **Two-layer slip handling complete**: anti-slip at G1 (Sprint 054 ADR-031) prevents slip BEFORE; Mid-Sprint Friction Protocol (Sprint 052 F5(C)) handles slip AFTER. Behavioral enforcement only this sprint; automated lint deferred to TASK-116-v2 Sprint 055.
- Skill version bump: orchestrator 2.0.0→2.1.0 (MINOR — new Phase 0 + new G1 fields + new Friction Protocol explicit triggers; qualifies as "new mode/agent/skill/hard stop").
- Carry-forward: TASK-131 Sprint 054b doc-wire cleanup (ADR-030 init citation + Path B citation + orphan invocation verification) · TASK-125 Sprint 053b broader feature-usage audit (DECISIONS.md.template drift + other skill/agent pairs) · TASK-116-v2 Sprint 055 acceptance harness (anti-slip lint + automated divergence lint).
- release-debt: depth grew to 7 sprints (Sprint 049 MINOR + 050/051a/051b/052/053/054 PATCH chain) + new orchestrator MINOR. Sprint 052b release-debt resolution increasingly urgent.

## Sprint 053 — F6 task-decomposer ↔ lean-doc-generator Collaboration Audit + Template-Loader Integration (2026-05-09)

- Sprint file: [docs/sprint/SPRINT-053-task-decomposer-lean-doc-collaboration-audit.md](sprint/SPRINT-053-task-decomposer-lean-doc-collaboration-audit.md)
- Plan/T0.5 `986a3b3` · T1 `8831ef3` · T2 `335447a` · T3 `370bb9a` · T4 `bafc73b` · T5 `a5f83f8` · close `a9b1f05`
- Summary: TASK-124 fully delivered. **T0.5 ADR-030 template canonical ownership** — lean-doc owns templates as canonical format; task-decomposer + orchestrator init CONSUME via Read-before-write at gen time; inline format examples non-authoritative; template wins on divergence; missing template degrades gracefully. **F6a (T3 + T4)** — lean-doc Step 6 reference-delegation form + DOCS_Guide.md §2 3-step Template-load protocol (read · missing fallback · divergence resolution). task-decomposer procedure.md Step 6 mirrors contract. Behavioral for type:rigid skills. Caps held: lean-doc SKILL.md 94/100 unchanged · task-decomposer SKILL.md 71/100 unchanged. **F6b (T2)** — SPRINT_PROTOCOLS.md Sprint Promote Step 1.2 backflow: Backlog-empty → soft prompt redirects to /task-decomposer (default halt). Coordination loop closed (task-decomposer→lean-doc existing; lean-doc→task-decomposer new). **T1** — decomposition-spec.md TASK row inline format (12 lines) replaced w/ template-pointer + 8-field summary. **T5 validation** — 2 drift findings: Finding #1 fixed inline (TODO.md.template TASK row 6→8 fields — direct T4 dependency); Finding #2 deferred to TASK-125 (DECISIONS.md.template ADR format 5 vs spec 6-7 fields).
- ADRs: ADR-030 (template canonical ownership) · 5 decisions + 5 alternatives + cross-links to ADR-029 + Sprint 051b + Sprint 052 T7 + TASK-116-v2 + TASK-125.
- Behavioral enforcement only this sprint (type:rigid skill contract). **Automated lint deferred to TASK-116-v2** Sprint 054 acceptance harness.
- Skill version bumps: lean-doc-generator 2.1.0→2.2.0 · task-decomposer 1.0.0→1.1.0 (MINOR per new behavioral contracts: new hard stop = template-load gate).
- Carry-forward: Finding #2 (DECISIONS.md.template) → TASK-125 Sprint 053b · automated divergence lint → TASK-116-v2 Sprint 054.
- release-debt: depth grew to 6 sprints (Sprint 049 MINOR + 050/051a/051b/052/053 PATCH chain). Sprint 052b release-debt resolution increasingly urgent.

## Sprint 052 — F4 Wire Orphan Skills + F5 Tech-Debt Rollover Loop (2026-05-09)

- Sprint file: [docs/sprint/SPRINT-052-orphan-skill-wiring-tech-debt-rollover.md](sprint/SPRINT-052-orphan-skill-wiring-tech-debt-rollover.md)
- Plan/T1 `ffcc3e4` · T2 `2b462c7` · T3 `ba64493` · T5 `ccba56f` · T4 `c4b2c83` · T7 fold-in `122c98d` · close `fb8e389`
- Summary: TASK-123 fully delivered. **F4** — wired 6 orphan skills (`prime` · `zoom-out` · `tdd` · `diagnose` · `refactor-advisor` · `release-manager`) into orchestrator phase detection. `skills/orchestrator/references/skill-dispatch.md` Always-On table grew 4→10 rows in lifecycle order. `skills/orchestrator/references/phases.md` gained advisory hints block (6 bullets) at start of sprint-bulk Phase + `task-type:` advisory line in G1 Scope Checklist template. orchestrator SKILL.md unchanged (cap 95/100 held). **F5** — 4-mechanic tech-debt rollover loop. (A) NEW `## Tech Debt` section in `TODO.md` + `templates/TODO.md.template` (TD-NNN namespace · severity tiers trivial/minor/medium/high · status open/escalated/resolved permanent · sprint-created field · optional AC). (B) Sprint Close Protocol Step 4 § Retro Friction items now prompt `"TD row? (Y/N/already-resolved)"`. (C) NEW `## Mid-Sprint Friction Protocol` section in phases.md — fix/defer/block prompt; defer writes TD row immediately + continues task. (D) Sprint Promote Step 1.5 TD Scan inserted between Steps 1 and 2 — severity:high auto-escalates Backlog P1; aging >6 sprints triggers re-review prompt; trivial/minor/medium human-gate. (E) `## Tech Debt Anti-Pattern Locks` section appended to SPRINT_PROTOCOLS.md (5 numbered locks mirroring Anti-Drift Hard Stops style).
- ADRs: none. Decisions inherit from TASK-123 backlog row spec (user-locked at session 2026-05-08 expansion).
- Behavioral enforcement only this sprint; **automated lint carried forward to TASK-116-v2** (Sprint 054 acceptance harness).
- Carried forward: dual-track during escalation window (TD row + Backlog row both exist until resolution) is acceptable audit-trail cost; anti-pattern lock #5 (HARD STOP if escalated lacks Backlog match) prevents desync.
- **T7 in-sprint fold-in** (user-surfaced 2026-05-09): closed `templates/` ↔ lean-doc-generator wiring gap. `DOCS_Guide.md` § Core Files now maps each doc type to its `templates/<X>.md.template` (Canonical template column + template-as-canonical-format rule). Closes drift risk for Sprint 051b template rewrites. Deeper integration (lean-doc Step 6 Generate actually READING templates/) deferred to **TASK-124** Sprint 053 (F6a template lineage scope).
- release-debt: depth grew to 5 sprints (Sprint 049 MINOR + 050/051a/051b/052 PATCH chain). Sprint 052b release-debt resolution increasingly urgent.

## Sprint 051b — Lean Architecture Templates + Primer + Workflow Vision Fold-in (2026-05-09)

- Sprint file: [docs/sprint/SPRINT-051b-lean-architecture-templates-primer.md](sprint/SPRINT-051b-lean-architecture-templates-primer.md)
- Plan/T1 `2eb437f` · T2 `f40900e` · T3 `0cf9cad` · T4 `d5aa753` · T5 `879e013` · T5.5 `0c970ff` · close `2266b9d`
- Summary: ISSUE-04 second half closed. ADR-029 CA+DDD canonical now visible in user-project surfaces. T1 — extend `applySubstitutions` (5 new tokens: 3 scalar `[Project Name]`-style passthrough + 3 full-line conditional `[app-root-line]`/`[cmd-root-line]`/`[test-root-line]` for stack-specific extras vanishing cleanly when absent); 49→51 tests pass. T2 — `templates/CLAUDE.md.template` 74/80 cap held (Behavioral Guidelines compressed to single-line subsections); Session Workflow block (TASK-127 fold-in) placed after Project Overview; CA arrow Dependency Rule; File Structure uses new substitution tokens; `06c-claude-md-template.md` snapshot fully synced (was pre-frontmatter older version). T3 — `templates/ARCHITECTURE.md.template` rewritten with CA arrow + per-layer purpose + new substitution tokens. T4 — NEW `docs/blueprint/11-lean-architecture.md` (236/250 cap) — CA+DDD primer (5-layer table · per-stack roots · react-next variant · multi-context upgrade · 3 anti-patterns · per-stack examples). T4.5 in-sprint fold-in — wired 11-primer into lean-doc-generator skill (DOCS_Guide.md § Core Files + SPRINT_PROTOCOLS.md § Sprint Close architecture check) closing orphan-primer risk. T5 — NEW `docs/blueprint/12-session-workflow.md` (163/200 cap) — 3-step session pattern primer (`/prime → /lean-doc-generator → /orchestrator`); README.md line 152 expansion. T5.5 in-sprint expansion — `docs/blueprint/03-workflow-phases.md` (87→103) + `docs/blueprint/08-orchestrator-prompts.md` (397→210) refreshed from stale 6-mode/3-gate to current 4-mode/2-gate model (CONTEXT.md + orchestrator SKILL.md authoritative); deprecated phase prompts trimmed.
- ADRs: none (all decisions inherit from ADR-029 Sprint 051a). Mid-execution scope expansions (T4.5 + T5.5) handled via explicit AskUserQuestion + user-approval.
- Carried forward to **TASK-125** (Sprint 053b): self-reported-current frontmatter ≠ actually-current — lean-doc staleness scan needs cross-validation against authoritative source files (CONTEXT.md for modes/gates). Additional blueprint files candidate for next audit pass: `04-subagents.md` · `05-skills.md` · `06a-settings.md` · `06b-scripts.md` · `09-customization.md` · `10*-modes.md`.
- release-debt: NOT bumped (Sprint 049 MINOR + 050 PATCH + 051a PATCH + 051b PATCH chain — 4 sprints accumulating). Sprint 052b release-debt resolution remains queued.

## Sprint 047 — EPIC-Audit Phase 6 close (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-047-epic-audit-close.md](sprint/SPRINT-047-epic-audit-close.md)
- Plan-lock `04785a6` · T1 `715d855` · T2 `61f828c` · T3 `0191bd1` · T4 `4334bb9` · close (this commit)
- Summary: EPIC-Audit closed. 4 tasks: T1 batch-archive 7 sprints (040-046) → docs/CHANGELOG.md (closes 7-sprint stranded-archive friction structurally for this batch); T2 TODO.md trim (External Refs block removed + EPIC-Audit Backlog 3 rows collapsed to single done line); T3 ADR-025 EPIC-Audit close (7 decisions: EPIC done · lineage roster · 5 pattern-stability findings · deferred work registry · `.out-of-scope/` discipline · `docs/adr/` convention LOCKED + extended · v1 ship prep unblocked); T4 docs/audit/EPIC-Audit-retro.md (127-line cross-sprint synthesis spanning Sprints 034-046).
- ADRs: ADR-025 — EPIC-Audit close. **EPIC-Audit COMPLETE.** 13 EPIC sprints (034-047) + 2 in-window foundation (038-039) = 15 total. 6 ext-refs / 7 ADRs (019-024 + 025) / 9 research notes / 9 bidirectional findings / 8 TASK-116 lift candidates accumulated / 3 conventions adopted as documented standards.

## Sprint 046 — EPIC-Audit Phase 5 stale doc refresh (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-046-stale-doc-refresh.md](sprint/SPRINT-046-stale-doc-refresh.md)
- Plan-lock `4a70efe` · T1 `b782584` · T2 `8c7d869` · close `2a99d82`
- Summary: refreshed `docs/ARCHITECTURE.md` (87→75 lines; ASCII collapsed, Component Map row-by-row rewrite, init-analyst/MANIFEST.json/blueprint refs/24-hard-stops claim removed) + `docs/AI_CONTEXT.md` (87→100 lines cap exact; Sprint 18/23/24 references replaced with EPIC-Audit Phase 5 active context). Both stale → current. Cross-doc verification zero contradictions.
- ADRs: — (refresh ≠ decision; max stays 024)

## Sprint 045 — Phase 4f skill-creator + TASK-104/117/118 (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-045-skill-creator-and-context-lifts.md](sprint/SPRINT-045-skill-creator-and-context-lifts.md)
- Plan-lock `89d2389` · T1 `6b094bf` · T2 `736c6bc` · T3 `fe30013` · T4 `2d1fbb6` · close `80920ef`
- Summary: anthropics/skills/skill-creator (Apache 2.0, FIRST non-MIT ext-ref) 5-axis diff vs dev-flow write-a-skill — 3 lift candidates queued to TASK-116 (iteration loop / description-pushiness / TOC convention) + 4 bidirectional findings. TASK-104 closed (CONTEXT.md ownership header). TASK-117 closed (3 additive CONTEXT.md sections: `_Avoid_` annotations + § Relationships + § Flagged Ambiguities; 129/130 lines). TASK-118 closed (lean-doc-generator Step 0b date-sanity pre-flight; v2.0.0→2.1.0; closes 4-sprint recurring friction).
- ADRs: ADR-024 — skill-creator patterns (7 decisions). EPIC-Audit Phase 4 deep-dive series (4a-4f) COMPLETE.

## Sprint 044 — EPIC-Audit Phase 4e GSD patterns (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-044-gsd-patterns.md](sprint/SPRINT-044-gsd-patterns.md)
- Plan-lock `aed05f0` · T1 `30a0c4f` · T2 `526c0af` · T3 `54d492f` · close `8931230`
- Summary: gsd-build/get-shit-done deep audit (164+ assets vs dev-flow 24, 6.8× scale gap). 9-phase pipeline + commands namespace + contexts/+plans/+CONTEXT.md reconcile. 5 NO LIFT + 2 DEFER + 2 bidirectional findings. Zero `.out-of-scope/` pointers (defers are scale-driven, not concept-rejecting).
- ADRs: ADR-023 — GSD patterns (9 decisions, scale-driven defer with explicit re-eval triggers).

## Sprint 043 — EPIC-Audit Phase 4d Mattpocock skill library (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-043-mattpocock-skill-library.md](sprint/SPRINT-043-mattpocock-skill-library.md)
- Plan-lock `2813289` · T1 `db88a40` · T2 `39a56f4` · T3 `5d2c2e7` · T4 `cacc199` · close `0a69140`
- Summary: mattpocock/skills 4-skill diff (tdd/diagnose/zoom-out/task-decomposer) — 5 trigger-phrase lift candidates queued to TASK-116; bidirectional zoom-out finding (dev-flow > mattpocock). Bucket migration deferred (17-skill scale; threshold 20). 3 ADDITIVE CONTEXT.md lifts recommended (queued as TASK-117). NEW `.out-of-scope/` directory + 3 negative-space pointers (run-hook-shim / tests-dir-empty-scaffold / statusline-savings-badge).
- ADRs: ADR-022 — mattpocock patterns (7 decisions; LOCKS `docs/adr/` convention as documented standard for ≥016).

## Sprint 042 — EPIC-Audit Phase 4c Superpowers patterns (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-042-superpowers-patterns.md](sprint/SPRINT-042-superpowers-patterns.md)
- Plan-lock `828b200` · T1 `c66e4b7` · T2 `cf3cbc8` · T3 `2caa3bd` · T4 `c11eb34` · close `74e1e50`
- Summary: obra/superpowers hooks.json + run-hook.cmd shim + acceptance harness audit. Matcher reconciliation = keep-superset (dev-flow `startup|resume|clear|compact` HARMLESS extension). Shim adoption DEFERRED (cross-platform polyglot solves problem dev-flow doesn't have per ADR-016 PowerShell-only). Skill-triggering acceptance harness pattern adopted; 3-skill seed (prime/orchestrator/tdd) queued as TASK-116. PR template lifted from superpowers + adapted (drop frustration tone, add dev-flow DoD + ADR-016 skill rule).
- ADRs: ADR-021 — superpowers patterns (6 decisions).

## Sprint 041 — EPIC-Audit Phase 4b Caveman compare (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-041-caveman-compare.md](sprint/SPRINT-041-caveman-compare.md)
- Plan-lock `87bb523` · T1 `0ee6f8d` · T2 `b79815f` · T3 `7ab9ff6` · close `6640eb0`
- Summary: caveman dual-source diff (juliusbrussee `ef6050c5e184` + mattpocock `b843cb5ea74b` — both MIT). NO fork (both freely installable; juliusbrussee already in user plugin cache). 3-arm eval methodology adopted; port deferred to TASK-115 (gpt-tokenizer + snapshot schema 1:1 + 5-risk matrix). caveman-shrink MCP middleware REJECTED (transport-level rewrite conflates skill discipline with bytes-on-wire mutation; review signal lost). Statusline-badge contract DEFERRED per probe direction.
- ADRs: ADR-020 — caveman patterns (5 decisions).

## Sprint 040 — EPIC-Audit Phase 4a Karpathy patterns (2026-05-04)

- Sprint file: [docs/sprint/SPRINT-040-karpathy-patterns.md](sprint/SPRINT-040-karpathy-patterns.md)
- Plan-lock `7e06c72` · T1 `1b7741b` · T2 `54c88b1` · T3 `8261847` · T4 `eed5126` · close `3fec973`
- Summary: karpathy CLAUDE.md 4-principle Behavioral Guidelines lineage locked in `.claude/CONTEXT.md` (MIT, upstream SHA `2c606141936f`, adaptation table). Verify-step micro-protocol confirmed at G2 design-analyst MICRO-TASKS (already shipped Sprint 035 retroactively credited). Per-skill EXAMPLES.md convention REJECTED (meta-repo has no app-code domain).
- ADRs: ADR-019 — karpathy patterns (3-decision: lineage lock + verify-step retro credit + EXAMPLES.md reject).

## EPIC-Audit milestone — Phase 4 deep-dive series complete (Sprints 040-045)

6 external references audited (karpathy / caveman / superpowers / mattpocock / GSD / skill-creator) across 6 sprints. 6 ADRs landed (019-024). 9 research notes. 9 bidirectional findings (where dev-flow > upstream). Pattern fully stable across 5 sprints of "decision-only sprint with 0-2 mechanical lifts" + 5 sprints of "pre-resolve OQs at promote per approve all". TASK-115 / TASK-116 queued for v1 ship prep (ADR-016 eval-evidence rule).

---

## Sprint 39 — Codemap + Modes + Skills (2026-05-03)

- Sprint file: [docs/sprint/SPRINT-039-codemap-modes-skills.md](sprint/SPRINT-039-codemap-modes-skills.md)
- PRD: — (tooling sprint; no parent PRD)
- Plan commit: `678f513`
- Close commit: `192eee1`
- Summary: Built four pieces of new tooling — codemap base knowledge (3-tier L0/L1/L2 + PowerShell PostToolUse AST rebuild on `git commit`), `sprint-bulk` dispatcher mode (Hybrid C — G1+G2 batched once per sprint, sequential default, parallel only on zero file overlap), `/prime` skill (ordered context loader + health check), `/release-patch` skill (PATCH bump lockstep + CHANGELOG + MEMORY refresh + CONTEXT drift warn + stale-doc auto-clear + HARD STOP push gate).
- Docs updated: `.claude/CLAUDE.md` §Codemap (L0) NEW · `.claude/CONTEXT.md` Modes table 3→4 rows + Vocabulary · `agents/dispatcher.md` (4-mode dispatch) · `skills/orchestrator/SKILL.md` + `references/phases.md` (sprint-bulk Phase) · `docs/codemap/CODEMAP.md` (regenerated) · `docs/codemap/handoff.json` NEW · `hooks/hooks.json` + `.claude/settings.json` (PostToolUse on `Bash(git commit*)`)
- ADRs: — (no new ADR; T1 references ADR-016 PS-only hook policy)
- Files changed: 17 (incl. 4 NEW: codemap-refresh.ps1, handoff.json, codemap-refresh/SKILL.md, prime/SKILL.md, release-patch/SKILL.md)
- Tests added: 0 (manual smoke — codemap-refresh ~140 ms cold; PostToolUse hook silent on test commit `98bbe4a` per known harness cache behavior)

**Blueprint version:** **MINOR** bump 2.3.0 → 2.4.0 lockstep (`plugin.json` + `marketplace.json`) — `sprint-bulk` is a new dispatcher mode + three new skills (`codemap-refresh`, `prime`, `release-patch`) per semver MINOR rule. Reload activates on next plugin reinstall.

| File | Change | ADR |
|:-----|:-------|:----|
| `scripts/codemap-refresh.ps1` | T1 NEW (~145 lines) — pure-regex 3-tier rebuild; UTF-8 no-BOM via `[IO.File]::WriteAllText` | — |
| `skills/codemap-refresh/SKILL.md` | T1 NEW (61 lines) — manual trigger doc | — |
| `docs/codemap/CODEMAP.md` | T1 REGEN — Hubs / Deps / Modules / L0-overflow (replaces TASK-091 stub) | — |
| `docs/codemap/handoff.json` | T1 NEW — generated L2 envelope (nodes/edges/metadata/last_built) | — |
| `.claude/CLAUDE.md` | T1 `## Codemap (L0)` block + overflow pointer + Commands entry | — |
| `hooks/hooks.json` | T1 PostToolUse `Bash(git commit*)` → codemap-refresh.ps1 | ADR-016 |
| `.claude/settings.json` | T1 mirrored PostToolUse with `$CLAUDE_PROJECT_DIR` variant | ADR-016 |
| `agents/dispatcher.md` | T2 26 lines — 4-mode dispatch + code-reviewer propose-rule | — |
| `skills/orchestrator/SKILL.md` | T2 94 lines — Mode Dispatch row + sprint-bulk Phase block | — |
| `skills/orchestrator/references/phases.md` | T2 sprint-bulk Phase section + overlap derivation + first-blocker definition | — |
| `.claude/CONTEXT.md` | T2 Modes table 3→4 rows + Vocabulary mode def | — |
| `.claude-plugin/plugin.json` | T2 2.3.0 → 2.4.0 (MINOR — new mode + new skills) | — |
| `.claude-plugin/marketplace.json` | T2 2.3.0 → 2.4.0 lockstep | — |
| `skills/prime/SKILL.md` | T3 NEW (81 lines) — ordered context loader + health check | — |
| `skills/release-patch/SKILL.md` | T4 NEW (81 lines) — 7-step PATCH release flow + HARD STOP push gate | — |
| `TODO.md` | T1–T4 housekeeping commits — `[ ]` → `[x]` per task | — |
| `docs/sprint/SPRINT-039-codemap-modes-skills.md` | sprint open + active + close; execution log + retro filled | — |

**Retro highlights** (full retro in sprint file):
- **Worked:** decompose-skip on user direction was safe (acceptance pre-set in Backlog held); pattern theft over invention (OpenViking + codemap + graphify); doc-only skills T3/T4 trivial; lockstep version-bump rule held.
- **Friction:** PostToolUse hook silent on test commit `98bbe4a` due to harness cache — `settings.json` reload requires session restart, `hooks.json` reload requires plugin reinstall (known behavior, not bug); PS 5.1 `Out-File -Encoding utf8` writes BOM and broke node `JSON.parse` (switched to `[IO.File]::WriteAllText` + `new UTF8Encoding($false)`); ADR drafted as `ADR-013` collided with existing ADR-013 in DECISIONS.md (5 prior cross-refs) — renumbered to `ADR-016`.
- **Pattern candidates** (pending user confirm for VALIDATED_PATTERNS):
  - PS 5.1 → JSON for node consumers: always `[IO.File]::WriteAllText` + `new UTF8Encoding($false)`, never `Out-File -Encoding utf8`.
  - Always grep DECISIONS.md for max ADR number before allocating a new ADR ID.
  - Plugin MINOR bump (new mode/agent/skill) — schedule between tasks, never mid-task.
  - PostToolUse / SessionStart hook config changes require session restart (settings.json) or plugin reinstall (hooks.json); document inline in hook config comments.

---

## Sprint 38 — Foundation Hardening (hook surgery + cache) (2026-05-03)

- Sprint file: [docs/sprint/SPRINT-038-foundation-hardening.md](sprint/SPRINT-038-foundation-hardening.md)
- PRD: — (foundation work; no parent PRD)
- Plan commit: `e8a475b`
- Close commit: `f0326c3`
- Summary: Killed Node SessionStart + read-guard hooks (Windows space-path loader:1368 unfixable); replaced with PowerShell SessionStart; added doc routing scaffold and lean-doc in-session SHA1 cache. Foundation for Sprint 039.
- Docs updated: ADR-016 NEW · DECISIONS.md (ADR-016 link) · ARCHITECTURE.md, AI_CONTEXT.md, SETUP.md, README.md, CLAUDE.md (read-guard + Node hook scrub) · audit/wiring-map.md · TEST_SCENARIOS.md · codemap/CODEMAP.md · _routing.json NEW
- ADRs: ADR-016
- Files changed: 22 (incl. 2 deletes — `scripts/session-start.js` + sibling test)
- Tests added: 0 (manual Windows session smoke for hooks; deleted 270-line Node test file alongside the script)

**Blueprint version:** PATCH-equivalent bump owed (no phase/gate/contract change). Version sync deferred to Sprint 039 TASK-103 (`/release-patch` skill).

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/_routing.json` | T1 NEW — placement schema (HOW/WHY/WHERE/WHO + L0 overflow) | — |
| `skills/lean-doc-generator/SKILL.md` | T1 reads `_routing.json`; T5 SHA1 cache wired | — |
| `hooks/hooks.json` | T2 Node session-start removed; T4 PS replacement registered | ADR-016 |
| `.claude/settings.json` | T2 local Node hook invocation removed | ADR-016 |
| `.claude/CLAUDE.md` | T2/T3 Node + read-guard refs scrubbed from Commands | ADR-016 |
| `scripts/session-start.js` | T2 DELETED (240 lines) | ADR-016 |
| `scripts/__tests__/session-start.test.js` | T2 DELETED (270 lines) | ADR-016 |
| `scripts/session-start.ps1` | T4 NEW (64 lines) — PowerShell SessionStart hook | ADR-016 |
| `docs/adr/ADR-016-kill-node-hook-scripts.md` | T2+T3 NEW — kill rationale + read-guard absorption | ADR-016 |
| `docs/DECISIONS.md` | T2 ADR-016 link | ADR-016 |
| `docs/ARCHITECTURE.md`, `docs/AI_CONTEXT.md`, `docs/SETUP.md`, `README.md` | T3 read-guard refs scrubbed | — |
| `docs/audit/wiring-map.md` | T3 hook-wiring map refreshed | — |
| `docs/TEST_SCENARIOS.md` | T3 session-start/read-guard test rows removed | — |
| `docs/codemap/CODEMAP.md` | routing + hooks lines refreshed | — |
| `.gitignore` | T5 `.claude/.lean-doc-cache.json` excluded | — |
| `skills/orchestrator/SKILL.md` + `references/skill-dispatch.md` | bonus `f43f094` — code-reviewer dispatch propose → human approves | — |
| `docs/sprint/SPRINT-038-foundation-hardening.md` | NEW — sprint plan + execution log + retro | — |

**Retro highlights** (full retro in sprint file):
- **Worked:** removal beat patching after 5 failed fix attempts; T2→T4 sequencing kept SessionStart dark for one working session; ADR-016 single-source covered both kills.
- **Friction:** PowerShell 5.1 silently parses UTF-8 no-BOM `.ps1` files as ANSI — em-dashes broke the parser (~20 min lost). `loader:1368` misdiagnosed as Node version issue twice before space-path root cause confirmed.
- **Pattern candidates** (pending user confirm for VALIDATED_PATTERNS):
  - PowerShell scripts must be ASCII-only or BOM-tagged on Windows 5.1.
  - Code-reviewer dispatch is propose-only; auto-dispatch is the wrong default.
  - Sprint Close MUST NOT auto-push — version-bump + push gate belongs to `release-patch` skill (TASK-103 / Sprint 039).

---

## Sprint 37 — EPIC-Audit Phase 3 — token/redundancy reduction (2026-05-01)

**Blueprint version:** PATCH-equivalent (description normalizations + agent line trims; no phase/gate/contract change).

| File | Change | ADR |
|:-----|:-------|:----|
| `agents/dispatcher.md` | T1 — body trim (31 → 30 lines, OVER-CAP closed); T4 — description "Use as lead..." → "Use when running..." (P2-7 closed) | — |
| `agents/design-analyst.md` | T1 — body trim (31 → 29 lines, OVER-CAP closed) | — |
| `skills/system-design-reviewer/SKILL.md` | T2 — description preamble swap "Use before..." → "Use when reviewing..." (R4 violation cleared, eval-skills 13/14 → 14/14) | — |
| `skills/orchestrator/SKILL.md` | T3 — description appended "Do not use" clause (P1-9 closed) | — |
| `skills/task-decomposer/SKILL.md` | T3 — description appended "Do not use" clause (P1-9 closed) | — |
| `docs/audit/baseline-metrics.md` + `.json` | T5+T6+T7 — regenerated; delta section + Overlap review + References audit appended | — |
| `docs/audit/skill-eval-report.md` | T7 — regenerated (14/14 pass) | — |
| `.github/workflows/validate.yml` | T7 — `continue-on-error: true` removed from eval-skills step (Sprint 36 stopgap retired) | — |
| `docs/sprint/SPRINT-037-token-redundancy-reduction.md` | NEW — sprint plan + execution log + retro | — |

**Audit closures:**
- P0-5 (cap violations) — closed via T1 trim, no ADR-016 cap amend needed.
- P1-9 (Do-not-use clauses) — closed via T3 on `orchestrator` + `task-decomposer`.
- P2-7 (agent description normalize) — closed via T4 on `dispatcher`.
- Sprint 36 R4 carryover — closed via T2 on `system-design-reviewer`.

**Quality gate (Q7):** zero OVER-CAP + 14/14 eval-skills pass — **PASS**. Token reduction modest (≈140 tokens / 1.1% on agents+skills total), achieved without forcing cosmetic trims.

---

## Sprint 36 — EPIC-Audit Phase 2 — workflow wiring verification (2026-05-01)

**Blueprint version:** PATCH-equivalent (governance check + table fixes; no phase/gate/contract change). Plus ADR-015 (workflow wiring contract — one-way dispatch + dispatch-table membership).

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/audit/wiring-map.md` | NEW — end-to-end wiring trace; modes × phases × agents × skills × hooks; orphan analysis | ADR-015 |
| `skills/orchestrator/references/skill-dispatch.md` | T2 — 3 fixes: `pipeline-builder` row removed (not bundled); `security-auditor` moved out of adopter section into Always-On; `code-reviewer` row clarified as agent + preloaded skill | ADR-015 |
| `scripts/session-start.js` | T4+T5 — Check 7 regex extended for sprint-pointer format; new Check 9 (sprint-plan-doc must exist; BLOCK/soft-warn per DEC-6); new Check 10 (sprint-anchor staleness vs CHANGELOG, deduped against Check 5 60-day rule) | — |
| `scripts/__tests__/session-start.test.js` | NEW — 8 fixtures covering regex fix, sprint-plan-doc check (4 paths), sprint-anchor staleness (3 paths), self-smoke | — |
| `docs/DECISIONS.md` | T6 — ADR-015 appended (workflow wiring contract); `last_updated` advanced | ADR-015 |
| `docs/sprint/SPRINT-036-workflow-wiring-verification.md` | NEW — sprint plan + execution log + retro | — |

**Test status:** `node --test scripts/__tests__/session-start.test.js` 8/8 pass. Live session-start now also enforces sprint-plan-doc presence + sprint-anchor staleness signal.

---

## Sprint 35 — EPIC-Audit Phase 1 — atomic naming rename (2026-05-01)

**Blueprint version:** PATCH-equivalent (rename only — no phase/gate/contract change). Plugin name `dev-flow`, binary `bin/dev-flow-init.js`, namespace `dev-flow:` all preserved.

| File | Change | ADR |
|:-----|:-------|:----|
| `skills/dev-flow/` → `skills/orchestrator/` (3 files, `git mv`) | T1 — skill rename; SKILL.md frontmatter `name: orchestrator`; H1 + self-refs updated | ADR-014 |
| `agents/orchestrator.md` → `agents/dispatcher.md` (`git mv`) | T2 — agent rename; frontmatter `name: dispatcher`; description + body self-refs updated | ADR-014 |
| `skills/{pr-reviewer,task-decomposer,zoom-out,system-design-reviewer}/SKILL.md` | T3 — sweep (description + body refs to skill name / agent role) | ADR-014 |
| `agents/{security,scope,design,performance,code,migration}-{analyst,reviewer}.md` | T3 — sweep (`from orchestrator` → `from dispatcher`; output paths updated) | ADR-014 |
| `.claude/CLAUDE.md` + `.claude/CONTEXT.md` | T3 — File Structure comment + Vocabulary + Principles + Agent Roster table updated | ADR-014 |
| `README.md` + `CONTRIBUTING.md` + `TODO.md` + `templates/{TODO,SETUP}.md.template` | T3 — adopt commands, slash command refs, role refs swept | ADR-014 |
| `docs/{ARCHITECTURE,AI_CONTEXT,SETUP}.md` + `docs/research/r9-primitive-audit.md` | T3 — paths + slash commands + role refs swept (ARCHITECTURE/AI_CONTEXT remain `status: stale` for Phase 5) | ADR-014 |
| `scripts/session-start.js` | T3 — warning string slash-command literal updated | ADR-014 |
| `docs/audit/v2-rewrite-plan.md` | T3 — `superseded_partly_by: ADR-014` frontmatter + supersede banner; historical content preserved (DEC-6) | ADR-014 |
| `docs/audit/AUDIT-2026-05-01-RECONCILED.md` | T3 — selective forward-looking refs only (lines 88, 94); historical findings preserved (DEC-6) | ADR-014 |
| `docs/audit/baseline-metrics.{md,json}` + `docs/audit/skill-eval-report.md` | T5 — regenerated by `audit-baseline.js` + `eval-skills.js` (DEC-7) | — |
| `docs/DECISIONS.md` | T4 — ADR-014 appended (atomic naming rename); `superseded-in-part by ADR-014 (naming only)` markers on ADR-011/012/013 (DEC-8) | ADR-014 |
| `docs/sprint/SPRINT-035-atomic-naming-rename.md` | NEW — sprint plan + execution log + retro | — |

**Eval status:** 13/14 skills pass `eval-skills.js` (R4 violation on `system-design-reviewer` is a pre-existing carryover to Phase 3 / Sprint 37). 2 agents over 30-line cap (`dispatcher`=31, `design-analyst`=31) — same carryover.

---

## Sprint 34 — EPIC-Audit Phase 0 — audit reconcile + baseline + roadmap (2026-05-01)

**Blueprint version:** MINOR (new scripts: `audit-baseline.js`, `eval-skills.js`; new SPRINT_PROTOCOLS.md hard stops; new docs/audit/ artifacts).

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/sprint/SPRINT-034-audit-and-plan.md` | NEW — Sprint 34 plan + Phase 1-6 refined roadmap | — |
| `docs/audit/AUDIT-2026-05-01-RECONCILED.md` | NEW — audit finding-by-finding reconciliation (24/28 closed) | — |
| `docs/audit/baseline-metrics.md` + `.json` | NEW — frozen Phase 3 comparison baseline | — |
| `docs/audit/skill-eval-report.md` | NEW — minimal structural eval (13/14 pass) | — |
| `docs/audit/external-refs-probe.md` | NEW — 4-repo surface scan + adopt/reject + phase reorder | — |
| `scripts/audit-baseline.js` + `__tests__/audit-baseline.test.js` | NEW — baseline collector, 5 unit tests | — |
| `scripts/eval-skills.js` + `__tests__/eval-skills.test.js` | NEW — minimal structural eval harness, 5 unit tests | — |
| `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | Anti-Drift Hard Stops section added | — |
| `docs/sprint/SPRINT-028-wrap-or-replace.md` | NEW — committed (was untracked) | — |
| `docs/sprint/SPRINT-029-epic-e-close.md` | NEW — committed (was untracked) | — |
| `docs/sprint/SPRINT-030..033-*.md` | NEW — backfilled retroactively from commit messages | — |
| `docs/research/r9-primitive-audit.md` | NEW — committed (was untracked Sprint 28 artifact) | — |
| `TODO.md` | Sprint 34 entry + EPIC-Audit Phase 1-6 backlog + roadmap update | — |

**ADRs:** none (deferred — ADR-014..019 reserved for Phases 1-4d).
**Tests added:** 10 (5 audit-baseline + 5 eval-skills).
**Findings carried forward:**
- Phase 3: system-design-reviewer R4 fix; 2 agents 1-line over cap; P1-9 + P2-7 partial closes.
- Phase 4b: P2-10 caveman statusline runtime check.
- Phase 5: stale ARCHITECTURE.md + AI_CONTEXT.md refresh.

**Phase reorder per external-refs-probe synthesis:** 4c → 4b → 4d → 4a (lowest-risk-first; 4b unblocks eval harness extension).

---

## Sprint 33 — P2 polish sweep (2026-05-01)

**Blueprint version:** PATCH (copywriting, headers, install docs; no phase/gate/mode changes).

| File | Change | ADR |
|:-----|:-------|:----|
| `TODO.md` | P2-3: Removed stale archive stubs from Changelog section | — |
| `scripts/session-start.js` | P2-5: Added precedence comment to SKILLS_DIR dual-path check | — |
| `agents/code-reviewer.md` | P2-7: Description normalized to "Use when" form | — |
| `agents/security-analyst.md` | P2-7: Description normalized to "Use when" form | — |
| `docs/CHANGELOG.md` | P2-8: Pre-v2 path note added to intro | — |
| `README.md` | P2-1: Plugin install step → `/dev-flow init`; P2-11: removed broken v2-rewrite-plan link | — |

---

## Sprint 32 — P1 consistency sweep (2026-05-01)

**Blueprint version:** PATCH (descriptions, paths, reference dirs; no phase/gate/mode changes).

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/CONTEXT.md` | P1-1: `skill` vocab updated — reflects both `skills/` (plugin) and `.claude/skills/` (scaffold) | — |
| `skills/lean-doc-generator/` | P1-2: `reference/` renamed `references/`; all SKILL.md paths updated | — |
| `skills/dev-flow/references/skill-dispatch.md` | P1-3: Adopter section labeled "Skills Not Bundled With dev-flow" | — |
| `agents/code-reviewer.md` | P1-4: Removed ADR-012 ref from description | — |
| `skills/pr-reviewer/SKILL.md` | P1-5: Trimmed 120 → 89 lines; severity examples + hard rules extracted | — |
| `skills/pr-reviewer/references/review-standards.md` | P1-5: New — extracted finding severity examples and hard rules | — |
| `.claude/settings.local.json` | P1-7: Removed 4 no-op PreToolUse hooks (git commit/push silent allow) | — |
| `docs/audit/v2-rewrite-plan.md` | P1-8: Moved from `docs/` to `docs/audit/` | — |
| 9 SKILL.md files | P1-9: `Do not use when` clause added to all skills missing it | — |

---

## Sprint 28 — Wrap-or-replace CC primitives (2026-05-01)

**Blueprint version:** PATCH (skill/agent notes added; no phase/gate/mode changes).

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/r9-primitive-audit.md` | TASK-086: created — 3-row CC primitive overlap audit | ADR-012 |
| `docs/DECISIONS.md` | TASK-086: ADR-012 appended — Replace over Wrap across all CC primitives | ADR-012 |
| `skills/dev-flow/SKILL.md` | TASK-087/088/089: Replaces note — CC `/init`, `/review`, TaskCreate/TaskList all replaced | ADR-012 |
| `agents/code-reviewer.md` | TASK-087: description references ADR-012 | — |
| `skills/dev-flow/references/phases.md` | TASK-088: Session Close notes TODO.md canonical; CC task tools not used | — |

---

## Sprint 27 — Marketplace schema fix (2026-05-01)

**Blueprint version:** PATCH (config-only changes; no phase/gate/mode changes).

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude-plugin/marketplace.json` | TASK-111: schema fixed — name, owner, source fields corrected | — |
| `README.md` | TASK-111: install steps updated to two-step `claude plugin marketplace add` flow | — |
| `context/research/CC_SPEC.md` | TASK-111: marketplace.json schema section added | — |
| `.claude-plugin/marketplace.json` | TASK-112: source changed to explicit github object — fix BUG-008 | — |
| `context/research/CC_SPEC.md` | TASK-112: source types table + BUG-008 note added | — |

---

## Sprint 26 — Read-guard behavioral guardrail (2026-04-30)

**Blueprint version:** PATCH (Red Flags row added to SKILL.md; no phase/gate/mode changes).

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/dev-flow/SKILL.md` | TASK-109: Red Flags row — read-guard blocks are enforcement events, not bugs to log | — |
| `docs/BUGS.md` | TASK-109: BUG-005 root cause corrected; BUG-005 resolved | — |
| `.claude/scripts/read-guard.js` | TASK-109: comment clarifying hook runtime consumption of block JSON | — |

---

## Sprint 25 — Workflow gap closure (2026-04-30)

**Blueprint version:** PATCH (Phase 0/10 advisory additions; skill-dispatch table; read-guard allowlist).

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/scripts/read-guard.js` | TASK-110: `docs/DECISIONS.md` + `docs/blueprint/*.md` added to ORCHESTRATOR_ALLOWLIST; path traversal fix | — |
| `.claude/scripts/__tests__/read-guard.test.js` | TASK-110: 3 new tests (DECISIONS.md allow, blueprint allow, traversal block); 20/20 pass | — |
| `docs/BUGS.md` | BUG-006 resolved | — |
| `.claude/skills/dev-flow/references/phases.md` | TASK-105: Phase 10 advisory doc-sync review table; TASK-106: Phase 0 session warm-up bullet; TASK-107: Gate 0 "Required skills" advisory field + dispatch lookup | — |
| `.claude/skills/dev-flow/references/skill-dispatch.md` | TASK-107: new — layers-to-skills dispatch table (meta-repo + product layers) | ADR-011 |
| `docs/DECISIONS.md` | TASK-107: ADR-011 skill-dispatch governance | ADR-011 |
| `.claude/skills/dev-flow/references/mode-sprint.md` | TASK-108: Step 2 Sprint Plan table gains Skills column; Step 3 gains skill-dispatch advisory per task | — |

**Resolved bugs:**
| Bug | Root cause | Fix |
|:----|:-----------|:----|
| BUG-005: model transcribes read-guard blocks to BUGS.md | Model misinterpreted enforcement events as bugs to document | TASK-109: Red Flags row in SKILL.md; BUG-005 root cause corrected |

---

## Sprint 24 — Plugin distribution layout + lean-doc v2 adoption (2026-04-29)

**Blueprint version:** PATCH (plugin layout, validate-scaffold Check 9).
**Note:** Smoke test (TASK-102 AC8) + README manual verify pending human confirmation at Gate 2.

| File | Change | ADR |
|:-----|:-------|:----|
| `skills/` `agents/` `hooks/` (root) | TASK-102: plugin distribution layout per CC_SPEC §5 — mirrors `.claude/` | ADR-010 |
| `.claude-plugin/marketplace.json` | TASK-102: new — marketplace schema v1.0 | — |
| `.claude-plugin/plugin.json` | TASK-102: version 1.8.0 → 1.9.0 | — |
| `.claude/scripts/validate-scaffold.js` | TASK-102: Check 9 — plugin root dirs; 18/18 tests green | — |
| `README.md` | TASK-102: two-step plugin install replaces broken single command | — |
| `docs/AI_CONTEXT.md` | TASK-104: Current Focus updated Sprint 18→Sprint 24; v2 sections verified | — |
| `docs/sprint/SPRINT-024-plugin-lean-doc.md` | TASK-104: sprint file format established (first entry in docs/sprint/) | — |
| `.claude/skills/lean-doc-generator/` | TASK-103 (Sprint 23 remainder): SPRINT_PROTOCOLS.md added; eval baseline updated | — |

---

## Sprint 23 — Design thinking quality + lean-doc consolidation (2026-04-29)

**Blueprint version:** MINOR (1.9.0 — ADR-009 batch clarify) + PATCH (lean-doc skill merge).
**Note:** TASK-091/092 removed from tracker — moved to GitHub issues; testing via separate project repo.

| File | Change | ADR |
|:-----|:-------|:----|
| `phases.md`, `SKILL.md` | TASK-100: Task Brief + batch clarify + expert persona + adversarial challenge + iteration loop | ADR-009 |
| `docs/DECISIONS.md`, `docs/blueprint/VERSION` | ADR-009 added; VERSION 1.8.0 → 1.9.0 (MINOR) | ADR-009 |
| `evals/snapshots/dev-flow/TASK-100-{before,after}.json`, `evals/runs/TASK-100.md` | Eval evidence: terse_isolation_delta +1122.2% vs +379.2% baseline | — |
| `phases.md` (Phase 0/2/3) | TASK-101: Read budget + orchestrator boundary rules (3 bullets) | — |
| `.claude/skills/lean-doc-generator/` | TASK-103: v1+v2 merged — Steps 0-7 flow, sprint protocols, pre-delivery checklist; v2 folder deleted; `context:fork` + `type:rigid` restored; version 1.1.0 | — |
| `evals/snapshots/lean-doc-generator/baseline-001.json` | TASK-103: Eval snapshot updated to skill_version 1.1.0; skill arm reflects Step 5 clarification behavior | — |
| `docs/DECISIONS.md` | ADR-010: plugin-first distribution decision | ADR-010 |

---

## Sprint 22 — Pass 2 fixes: HOW violations + blueprint correctness (2026-04-27)

**Blueprint version:** PATCH — HOW content moved to references, script fix, §23 extraction; no phase/gate/mode changes.
**Note:** TASK-091 (team validation) remains open — human-blocked. Carried to Sprint 23.

| File | Change | ADR |
|:-----|:-------|:----|
| `6× skills/*/SKILL.md` | TASK-098: procedural HOW sections removed; pointer to `references/procedure.md` added | AUD-P2-001 |
| `6× skills/*/references/procedure.md` | TASK-098: new — step logic moved from SKILL.md (not deleted) | AUD-P2-001 |
| `.claude/scripts/validate-blueprint.js` | TASK-099: INDEX_FILE_RE → explicit `Set(['10-modes.md', '06-harness.md'])`; `05-skills.md` now emits cap warning | AUD-P2-003 |
| `docs/blueprint/10f-task-decomposer.md` | TASK-099: 9th validation rule added; §23 Sprint Mode extracted; 294 → 206 lines | AUD-P2-002, AUD-P2-004 |
| `docs/blueprint/10g-sprint-mode.md` | TASK-099: new — §23 Sprint Mode content | AUD-P2-004 |
| `docs/blueprint/10-modes.md` | TASK-099: added `10g-sprint-mode.md` index row | AUD-P2-004 |
| `TODO.md` | Sprint 22 closed; Sprint 23 started (TASK-091 carried + TASK-100 promoted) | — |

---

## Sprint 21 — Audit Pass 2 + Pass 1 re-verification (2026-04-27)

**Blueprint version:** PATCH — docs only; no phase/gate/mode changes.
**Note:** TASK-091 (team validation) remains open — human-blocked. Carried to Sprint 22.

| File | Change | ADR |
|:-----|:-------|:----|
| `AUDIT_PASS2.md` | TASK-096: new — Pass 2 findings (AUD-P2-001..004: 2×P1, 2×P2); cross-check results; coverage table | — |
| `docs/CHANGELOG.md` | TASK-096: AUD-001..017 re-verification table appended to Sprint 17 block (all 17 CLOSED) | — |
| `READINESS.md` | TASK-096: TASK-096 row → [x]; last_updated → 2026-04-27 | — |
| `AUDIT.md` | TASK-096: audit_pass → 2 (complete); "not covered" section closed; last_updated → 2026-04-27 | — |
| `TODO.md` | TASK-096: TASK-098 + TASK-099 added to P2 backlog; sprint rotated 21→22 | — |

---

## Sprint 20 — E2E smoke + dogfood E2E + friction log + MVP mode (2026-04-27)

**Blueprint version: 1.7.0 → 1.8.0 (MINOR — new mode `mvp`)**

| File | Change | ADR |
|:-----|:-------|:----|
| `.github/workflows/validate.yml` | TASK-069: drift check replaced with plugin manifest validation | — |
| `examples/README.md` | TASK-069: E2E smoke test steps documented | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-097: `mvp` row in Mode Dispatch; flowchart + freeform rules updated; description updated | ADR-007 |
| `.claude/skills/dev-flow/references/mode-mvp.md` | TASK-097: new — phases, gates, escalation threshold, fence-line vs quick | — |
| `.claude/scripts/__tests__/mode-dispatch.test.js` | TASK-097: 3 mvp assertions added (table row, flowchart edges) | — |
| `docs/DECISIONS.md` | TASK-097: ADR-007 — mvp mode rationale, fence-line, alternatives | ADR-007 |
| `docs/blueprint/VERSION` | TASK-097: 1.7.0 → 1.8.0 | ADR-007 |
| `.claude-plugin/plugin.json` | TASK-097: version 1.7.0 → 1.8.0 | ADR-007 |
| `README.md` | TASK-097: 6 Modes → 7 Modes; mvp added to mode list | — |
| `examples/node-express/src/middleware/error-handler.js` | TASK-076: dogfood — error handler middleware | — |
| `examples/node-express/src/index.js` | TASK-076: dogfood — wire error handler after routes | — |
| `examples/node-express/src/__tests__/error-handler.test.js` | TASK-076: dogfood — 3 unit tests | — |
| `examples/node-express/TODO.md` | TASK-076: TASK-001 marked [x] | — |
| `docs/research/dogfood-session-notes.md` | TASK-076: all 14 phase rows filled; friction observed | — |
| `docs/research/dogfood-friction-log.md` | TASK-077: friction items, what worked, follow-up tasks | — |
| `STRATEGY_REVIEW.md` | TASK-077: R-10 outcome paragraph added | — |
| `TODO.md` | TASK-077: EPIC-C marked [x]; Sprint 20 changelog entries | — |
| `docs/DECISIONS.md` | TASK-077: ADR-008 — dogfood outcome | ADR-008 |

---

## Sprint 19 — Path rewrite + default-mode flip + ADR-006 + dogfood bootstrap (2026-04-27)

**Blueprint version:** MINOR — default invocation `/dev-flow TASK-N` now dispatches quick mode (5 phases) instead of full (10 phases); full mode requires explicit `/dev-flow full TASK-N`. Default behavior change is user-visible.

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/scripts/read-guard.js` | TASK-067: plugin-root allowlist entries (`skills/`, `scripts/`) added alongside `.claude/` | — |
| `.claude/scripts/session-start.js` | TASK-067: CLAUDE_PLUGIN_ROOT support — SKILLS_DIR + MANIFEST_PATH vars | — |
| `.claude/skills/dev-flow/references/phases.md` | TASK-067: `node .claude/scripts/` → `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/` (12 occurrences) | — |
| `.claude/skills/dev-flow-compress/SKILL.md` | TASK-067: compress.py invocation uses plugin-relative var | — |
| `.claude/scripts/__tests__/read-guard.test.js` | TASK-067: 2 plugin-layout allowlist tests added | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-067: fix pre-existing stderr vs stdout assertion bug | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-093: `quick` marked default; `full` requires explicit keyword; dot + freeform rules updated | — |
| `.claude/scripts/__tests__/mode-dispatch.test.js` | TASK-093: new — 5 content-validation tests for mode dispatch defaults | — |
| `docs/DECISIONS.md` | TASK-094: ADR-006 — plugin.json as canonical adopter pin; semver-to-blueprint mapping | ADR-006 |
| `CONTRIBUTING.md` | TASK-094: "Breaking change policy" section added, links ADR-006 | ADR-006 |
| `examples/node-express/.claude/` | TASK-075: full scaffold generated (skills, agents, scripts, CLAUDE.md, settings) | — |
| `examples/node-express/TODO.md` | TASK-075: Sprint 1 with 2 real tasks (TASK-001 error handler, TASK-002 users CRUD) | — |
| `examples/node-express/.gitignore` | TASK-075: exclude dev-flow runtime files | — |
| `examples/README.md` | TASK-075: updated to reflect checked-in .claude/ tree; immediate-use instructions | — |

---

## Sprint 18 — Plugin foundation + support docs (2026-04-27)

**Blueprint version:** PATCH — plugin manifest scaffolded; plugin layout contract documented; support channel + friction-report template added; README plugin-first install path. No phase/gate/mode changes.

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/research/cc-plugin-spec.md` | TASK-065: new — plugin layout contract; Assumptions 1+4 CONFIRMED | — |
| `.claude-plugin/plugin.json` | TASK-066: new — plugin manifest (name, description, version, skills[], agents[], hooks) | — |
| `.claude/scripts/validate-plugin.js` | TASK-066: new — manifest validator (4 checks; exit 0/1) | — |
| `.claude/scripts/__tests__/validate-plugin.test.js` | TASK-066: new — 11 unit tests, all pass | — |
| `README.md` | TASK-068: plugin-first install path primary; scaffold-copy fallback; plugin/init table | — |
| `CONTRIBUTING.md` | TASK-068 + TASK-095: no old paths found; Feedback section added | — |
| `docs/SUPPORT.md` | TASK-095: new — #dev-flow Slack channel, 2-day SLA, friction-report filing rules | — |
| `docs/templates/friction-report.md` | TASK-095: new — friction report template (phase/expected/observed/fix/severity) | — |

---

## Sprint 17 — Blueprint decomp + SSOT version (2026-04-26)

**Blueprint version:** PATCH — mega-files split; VERSION SSOT established; BUG-003/004 fixed.

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/VERSION` | TASK-060: Created — canonical blueprint version SSOT (1.7.0) | ADR-005 |
| `AI_WORKFLOW_BLUEPRINT.md` | TASK-060: Body version line replaced with redirect to VERSION file | — |
| `.claude/scripts/validate-blueprint.js` | TASK-060: Check 5 — warns when blueprint docs change without VERSION update | — |
| `.claude/scripts/__tests__/validate-blueprint.test.js` | TASK-060: 2 tests for Check 5 | — |
| `docs/DECISIONS.md` | TASK-060: ADR-005 — package.json vs blueprint VERSION independence | ADR-005 |
| `docs/blueprint/10-modes.md` | TASK-059: 943→19 line index; 6 sub-files extracted | — |
| `docs/blueprint/10a-init.md` | TASK-059: NEW — §16 INIT Mode (237 lines) | — |
| `docs/blueprint/10b-harness-improvement.md` | TASK-059: NEW — §17 Harness CI Protocol (84 lines) | — |
| `docs/blueprint/10c-resume.md` | TASK-059: NEW — §18 Session Resume (70 lines) | — |
| `docs/blueprint/10d-migration-performance.md` | TASK-059: NEW — §19 Migration + §20 Performance (137 lines) | — |
| `docs/blueprint/10e-hotfix.md` | TASK-059: NEW — §21 Hardened Hotfix (149 lines) | — |
| `docs/blueprint/10f-task-decomposer.md` | TASK-059: NEW — §22 Task Decomposer + §23 Sprint Mode (294 lines) | — |
| `docs/blueprint/06-harness.md` | TASK-059: 565→16 line index; 3 sub-files extracted | — |
| `docs/blueprint/06a-settings.md` | TASK-059: NEW — settings.json + settings.local.json (118 lines) | — |
| `docs/blueprint/06b-scripts.md` | TASK-059: NEW — all 5 scripts + evals/measure.py (415 lines) | — |
| `docs/blueprint/06c-claude-md-template.md` | TASK-059: NEW — §7 CLAUDE.md Template (64 lines) | — |
| `.claude/scripts/validate-blueprint.js` | TASK-059: Check 4 — 250-line cap WARN for blueprint sub-files | — |
| `.claude/scripts/__tests__/validate-blueprint.test.js` | TASK-059: 3 tests for 250-line cap | — |
| `IMPROVEMENT_LOG.md` | TASK-063: Deleted — archived to docs/archive/ | — |
| `docs/archive/2026-04-20-session-1-critique.md` | TASK-063: NEW — archived Session 1 critique (status:archived) | — |
| `.claude/scripts/session-start.js` | TASK-063: Check 7 WARN when both Sprint + Backlog empty | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-063: 2 tests for WARN path | — |
| `docs/BUGS.md` | BUG-003 + BUG-004 resolved — "No open bugs" | — |
| `.claude/scripts/scaffold-checks.js` | BUG-003: skill.path traversal guard in checkManifest | — |
| `.claude/scripts/__tests__/validate-scaffold.test.js` | BUG-003: traversal-attempt test | — |
| `.claude/scripts/read-guard.js` | BUG-004: `.claude/scripts/` prefix added to ORCHESTRATOR_ALLOWLIST | — |
| `.claude/scripts/__tests__/read-guard.test.js` | BUG-004: allowlist coverage test | — |

**Resolved bugs**: BUG-003 (skill.path traversal) · BUG-004 (read-guard over-blocking)

**AUD-001..017 Pass 1 re-verification (TASK-096, 2026-04-27)**

| ID | Title (abbreviated) | Pass 1 sprint | Re-verified state |
|:---|:--------------------|:--------------|:------------------|
| AUD-001 | Phase-file write side never implemented | Sprint 14 | ✓ CLOSED — `set-phase.js` (79 lines) writes `.claude/.phase`; invocations in `phases.md` |
| AUD-002 | Placeholder hooks in settings.json | Sprint 14 | ✓ CLOSED — no `[your-lint-command]` strings in `settings.json` |
| AUD-003 | CI runs only 2 validators | Sprint 15 | ✓ CLOSED — `validate.yml` runs `node --test` suite + Node 18/20/22 matrix |
| AUD-004 | Skill change protocol not enforced | Sprint 15 | ✓ CLOSED — `check-eval-gate.js` CI gate + backfill snapshots committed |
| AUD-005 | README teaches manual `cp -r` | Sprint 15 | ✓ CLOSED — `node bin/dev-flow-init.js` is primary path in README |
| AUD-006 | `examples/node-express/` full mirror | Sprint 16 | ✓ CLOSED (monitor) — mirror deleted (ADR-004 Sprint 16); re-generated intentionally by TASK-075 (Sprint 19) for dogfood; drift check CI step active |
| AUD-007 | `dev-flow/SKILL.md` at 335 lines | Sprint 16 | ✓ CLOSED — trimmed to 122 lines; detail in `references/` sub-files |
| AUD-008 | Blueprint mega-files >500 lines | Sprint 17 | ✓ CLOSED — `10-modes.md` and `06-harness.md` split to sub-files |
| AUD-009 | Blueprint version SSOT split 3 ways | Sprint 17 | ✓ CLOSED — `docs/blueprint/VERSION` = 1.8.0; ADR-005 documents independence |
| AUD-010 | `dev-flow-init.js` does not render settings | Sprint 15 | ✓ CLOSED — `STACK_PRESETS` with `lintCommand`/`typecheckCommand` renders `settings.json` |
| AUD-011 | SKILL.md files lack GraphViz flowcharts | Sprint 16 | ✓ CLOSED — `pr-reviewer` flowchart added; exemption policy in `05-skills.md` |
| AUD-012 | Subagent files duplicate 70% of skill content | Sprint 16 | ✓ CLOSED — `code-reviewer.md` 89→17 lines; `security-analyst.md` 77→17 lines |
| AUD-013 | `BUGS.md` references closed tasks | Sprint 17 | ✓ CLOSED — BUGS.md = "No open bugs." |
| AUD-014 | README numbers drift from SSOT | Sprint 15 | ✓ CLOSED — README = "24 Hard Stops", "10 project-local skills" (matches actual) |
| AUD-015 | `IMPROVEMENT_LOG.md` unmanaged at root | Sprint 17 | ✓ CLOSED — archived at `docs/archive/2026-04-20-session-1-critique.md` |
| AUD-016 | Session-start: no actionable next step | Sprint 17 | ✓ CLOSED — `session-start.js` emits WARN when Sprint + Backlog both empty |
| AUD-017 | `package.json` version untracked | Sprint 17 | ✓ CLOSED — ADR-005: package.json and blueprint VERSION are intentionally independent |

---

## Sprint 16 — Skills decomp + P2 cleanup (2026-04-26)

**Blueprint version:** PATCH — dev-flow SKILL.md decomposed to reference files; examples/ mirror removed per ADR-004; agent thin-wrappers applied; GraphViz flowchart policy documented.

| File | Change | ADR |
|:-----|:-------|:----|
| `examples/node-express/.claude/` | TASK-057: Deleted mirror tree (60 files) — SSOT policy, generated by dev-flow-init.js | ADR-004 |
| `examples/node-express/docs/blueprint/` | TASK-057: Deleted mirror docs (10 files) | ADR-004 |
| `examples/README.md` | TASK-057: Updated — project-specific files only; `.claude/` generated by dev-flow-init.js | ADR-004 |
| `.github/workflows/validate.yml` | TASK-057: Add examples mirror drift check step | ADR-004 |
| `docs/DECISIONS.md` | TASK-057: ADR-004 appended — examples/ mirror deletion decision | ADR-004 |
| `.claude/skills/dev-flow/SKILL.md` | TASK-058: Trimmed 372→116 lines; detail split to references/ | none |
| `.claude/skills/dev-flow/references/phases.md` | TASK-058: NEW — full Phase 0-10 checklists + Gate templates (185 lines) | none |
| `.claude/skills/dev-flow/references/hard-stops.md` | TASK-058: NEW — full 19-item hard stop list + context threshold template | none |
| `.claude/skills/dev-flow/references/mode-hotfix.md` | TASK-058: NEW — hotfix banner + workflow sequence | none |
| `.claude/skills/dev-flow/references/mode-resume.md` | TASK-058: NEW — resume prompt template | none |
| `.claude/skills/dev-flow/references/mode-sprint.md` | TASK-058: NEW — full Sprint Mode scoring/classification/execute | none |
| `evals/snapshots/dev-flow/TASK-058-{before,after}.json` | TASK-058: Eval snapshots; terse_isolation_delta +0.0% | none |
| `evals/runs/TASK-058.md` | TASK-058: Eval run narrative RED→GREEN→REFACTOR | none |
| `.claude/agents/code-reviewer.md` | TASK-061: Trimmed 89→17 lines — thin wrapper referencing pr-reviewer skill | none |
| `.claude/agents/security-analyst.md` | TASK-061: Trimmed 77→17 lines — thin wrapper referencing security-auditor skill | none |
| `.claude/agents/migration-analyst.md` | TASK-061: Trimmed 90→23 lines — condensed inline checklist | none |
| `.claude/agents/performance-analyst.md` | TASK-061: Trimmed 79→22 lines — condensed inline checklist | none |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-062: Add Stage 1→2 gating GraphViz flowchart | none |
| `docs/blueprint/05-skills.md` | TASK-062: Add GraphViz Flowchart Policy section; document exemptions | none |
| `evals/snapshots/pr-reviewer/TASK-062-{before,after}.json` | TASK-062: Eval snapshots | none |
| `evals/runs/TASK-062.md` | TASK-062: Eval run narrative | none |

---

## Sprint 15 — Adoption + CI hardening (2026-04-26)

**Blueprint version:** MINOR bump — Sprint Mode Phase 9c completion prompt added (Phase 9c continue/close flow, context-budget gate ≥28 turns); `next-blocked`/`commit-each`/`commit-sprint` dispatch; §23 added to `10-modes.md`.

| File | Change | ADR |
|:-----|:-------|:----|
| `.github/workflows/validate.yml` | TASK-054: Add Node 18/20/22 matrix, `node --test` suite, `py_compile` syntax check, direct Python test execution; `permissions: read-all`; SHA-pinned actions; `fail-fast: false` | none |
| `.github/workflows/scheduled.yml` | TASK-054: New — weekly cron (Mon 08:00 UTC) for `audit-skill-staleness.js`; `workflow_dispatch` trigger; SHA-pinned actions | none |
| `.claude/scripts/check-eval-gate.js` | TASK-055: New — CI gate script; per-skill task-id matching for after-snapshot + run file; CHANGED_FILES env override for tests | none |
| `.claude/scripts/__tests__/check-eval-gate.test.js` | TASK-055: New — 9 unit tests including regression case for shared-runsPattern bug | none |
| `.github/workflows/validate.yml` | TASK-055: Add PR-only eval gate step + fetch-depth: 0 on checkout | none |
| `evals/snapshots/dev-flow/TASK-044-after.json` | TASK-055: Sprint 11 backfill — post-Sprint-11 state; backfill:true flag | none |
| `evals/snapshots/dev-flow-compress/TASK-036-after.json` | TASK-055: Sprint 11 backfill — new skill, no before; backfill:true flag | none |
| `evals/runs/TASK-044.md` | TASK-055: Sprint 11 run record (narrative backfill) | none |
| `evals/runs/TASK-036.md` | TASK-055: Sprint 11 run record for new skill (narrative backfill) | none |
| `CONTRIBUTING.md` | TASK-055: Add Eval gate section — 3 required files, new-skill exception, gate script path | none |
| `README.md` | TASK-056: Replace "How to adopt" — `node bin/dev-flow-init.js` primary; add 8-file "What gets created" table; `cp -r` demoted to fallback; "What it is not" + "Blueprint structure" sections removed (outdated/absorbed) | none |
| `.claude/skills/dev-flow/SKILL.md` | TASK-064: Sprint Mode — Phase 9c-style completion prompt; context gate ≥28 turns → prune; `next-blocked`/`commit-each`/`commit-sprint` dispatch; hard stop added | none |
| `docs/blueprint/10-modes.md` | TASK-064: Add §23 Sprint Mode — weight scoring, phase classification, execution flow, Phase Complete prompt | none |
| `evals/runs/TASK-064.md` | TASK-064: Eval run record (RED-GREEN-REFACTOR) | none |
| `evals/snapshots/dev-flow/TASK-064-before.json` | TASK-064: Eval baseline snapshot | none |
| `evals/snapshots/dev-flow/TASK-064-after.json` | TASK-064: Eval after snapshot | none |

---

## Sprint 14 — Audit Pass 1: P0 fixes + drift cleanup (2026-04-25)

**Blueprint version:** PATCH bump — Phase Markers added to dev-flow/SKILL.md (Phase 0/3/5/6/7/8/9); ADR-003 records orchestrator-managed phase state. Counts as PATCH (mechanism is harness-only; phase model unchanged).

| File | Change | ADR |
|:-----|:-------|:----|
| `AUDIT.md` | New: 17-finding tactical audit (pass 1, quick scan) — 2 P0, 8 P1, 7 P2; suggested sprint plan | none |
| `STRATEGY_REVIEW.md` | New: strategic critique (pros, cons, 10 radical alternatives R-1..R-10) — companion to AUDIT.md | none |
| `TODO.md` | Sprint 14 populated (TASK-050..053 P0+P2 cleanup); Backlog populated with TASK-054..063 (P1+P2), TASK-064 (workflow self-audit), and EPIC-A..E (P3 strategic) | none |
| `.claude/settings.json` | TASK-051: Remove 4 `[your-X]` placeholder PreToolUse hooks (`Bash(git commit*)`, `Bash(git -C * commit*)`, `Bash(git push*)`, `Bash(git -C * push*)`); committed file is now runnable as-is | none |
| `.claude/settings.local.example.json` | TASK-051: Promote to canonical template — embed full PreToolUse hook block with `[your-X]` tokens; rendered per-stack by `dev-flow-init.js` | none |
| `bin/dev-flow-init.js` | TASK-051: Replace `LAYER_PRESETS` with `STACK_PRESETS` (layers + lintCommand + typecheckCommand + packageManager); add `renderSettingsLocal()`; add `isHookCommandSafe()` shell-metachar guard for custom prompts | none |
| `bin/__tests__/dev-flow-init.test.js` | TASK-051: Replace `getLayersForPreset` tests with `getStackPreset` + `renderSettingsLocal` + `isHookCommandSafe` tests (24 cases) | none |
| `.claude/scripts/validate-scaffold.js` | TASK-051: Add Check 8 — fail on `[your-` substring in any settings.json hook command; explicit fail when settings.json absent | none |
| `.claude/scripts/__tests__/validate-scaffold.test.js` | TASK-051: Add 4 cases (placeholder fail, clean pass, invalid JSON, missing file) | none |
| `.claude/settings.local.json` | TASK-051: Regenerate this repo's local — replace `[package-manager]` with `npm`, render 4 hooks with `node -e "process.exit(0)"` no-op (meta-repo has no app code to lint/typecheck) | none |
| `docs/BUGS.md` | TASK-052: Trim to rule line; TASK-051 audit: open BUG-003 (validate-blueprint.js MANIFEST `skill.path` traversal) | none |
| `docs/CHANGELOG.md` | TASK-052: Add Sprint 7 "Resolved bugs" sub-table with BUG-001 + BUG-002 fix verification; TASK-051: fix stale `getLayersForPreset` reference in Sprint 12 row | none |
| `README.md` | TASK-053: "27 Hard Stops" → "24 Hard Stops"; "9+ project-local … skills" → "10 project-local … skills" | none |
| `.claude/scripts/validate-blueprint.js` | TASK-053: Add Check 4 — count ❌ in 08-orchestrator-prompts.md and skills in MANIFEST; fail when README claims drift or are missing | none |
| `.claude/scripts/__tests__/validate-blueprint.test.js` | TASK-053: Add 7 cases (match, drift, N+ phrasing, missing claims) | none |
| `.claude/scripts/phase-constants.js` | TASK-050: New — single source of truth for `VALID_PHASES` (11) + `COMPACT_VULNERABLE` (5) + `PHASE_FILE`. Imported by set-phase.js, read-guard.js, session-start.js | ADR-003 |
| `.claude/scripts/set-phase.js` | TASK-050: New — orchestrator-managed writer for `.claude/.phase` (set/clear modes); rejects symlinks via `lstatSync` guard; allowlist-validated phase names | ADR-003 |
| `.claude/scripts/__tests__/set-phase.test.js` | TASK-050: New — 11 unit tests (write, normalize, trim, mkdir, reject, usage, clear, idempotent, all 11 phases, exports, single-source invariant) | none |
| `.claude/scripts/__tests__/phase-cycle.integration.test.js` | TASK-050: New — 6 integration tests (full cycle, allowlist pass, parse non-block, all compact-vulnerable phases via shared Set, idempotent clear, symlink refusal) | none |
| `.claude/scripts/read-guard.js` | TASK-050: Import `PHASE_FILE` + `COMPACT_VULNERABLE` from phase-constants instead of hardcoded literals | none |
| `.claude/scripts/session-start.js` | TASK-050: Check 9 — import `COMPACT_VULNERABLE` from phase-constants; escalate stale-phase warn message to suggest `set-phase.js clear` | none |
| `.claude/skills/dev-flow/SKILL.md` | TASK-050: Add §Phase Markers intro; mark Phase 0 (clear pre-flight), 3, 5, 6, 7, 8 with `set-phase.js` calls; add `set-phase.js clear` after Phase 9 commit | ADR-003 |
| `docs/DECISIONS.md` | TASK-050: Append ADR-003 — orchestrator-managed phase state via `set-phase.js`; rejected harness-managed PostToolUse alternative documented | ADR-003 |

---

## Sprint 13 — Governance + Automation (2026-04-25)

**Blueprint version:** PATCH bump — canonical files governance rule; skill-staleness audit script

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/05-skills.md` | Added §Canonical Files Governance (SSOT rule + table + loop usage example) | none |
| `.claude/CLAUDE.md` | Updated anti-pattern with §5 cross-reference | none |
| `.claude/scripts/audit-skill-staleness.js` | New script: audits last-validated dates on all skills, exits 1 on stale/missing | none |
| `.claude/scripts/__tests__/audit-skill-staleness.test.js` | 13 unit tests (TDD RED→GREEN) | none |

---

## Sprint 12 — TDD Framework + Init Script + Worked Example (2026-04-25)

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/measure.py` | Added `compare` sub-command (before/after snapshot delta) | — |
| `docs/blueprint/05-skills.md` | Added Skill Change Protocol (RED-GREEN-REFACTOR) section | — |
| `CONTRIBUTING.md` | Resolved TASK-026 forward-refs; governance rule made concrete | — |
| `.claude/CLAUDE.md` | Removed pending qualifier from eval evidence anti-pattern line | — |
| `evals/README.md` | Documented `compare` usage + bumped last_updated | — |
| `bin/dev-flow-init.js` | New CLI: copies scaffold into target repo with stack prompts | ADR-002 |
| `bin/__tests__/dev-flow-init.test.js` | Unit tests for applySubstitutions + getStackPreset (renamed from getLayersForPreset in Sprint 14 TASK-051) | — |
| `package.json` | New: bin field + engines ≥18 | — |
| `docs/DECISIONS.md` | Added ADR-002: no external deps in bin/ | — |
| `examples/node-express/` | Worked example: scaffold + minimal Express server | — |
| `examples/README.md` | Pattern explanation for bootstrap workflow | — |

---

## Sprint 11 — Sprint Mode + Context Compression (2026-04-24)

**Blueprint version:** MINOR bump — `/dev-flow sprint` auto-run mode; `/dev-flow:compress` sub-skill + Python compression script

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/dev-flow/SKILL.md` | TASK-044: Add sprint mode — weight scoring, Sprint Plan template, single/two-phase split, hard stop for scope:full+risk:high | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-036: Add Sub-commands dispatch section for `:compress` | — |
| `.claude/skills/dev-flow-compress/SKILL.md` | TASK-036: New sub-skill — `/dev-flow:compress` spec, pass-through rules, compression rules, Red Flags | — |
| `.claude/scripts/compress.py` | TASK-036: Python 3.10+ compress script — path traversal guard, `.md` guard, backup-before-write, CRLF-safe, 17 tests | — |
| `.claude/scripts/__tests__/compress.test.py` | TASK-036: 17 unittest tests — backup, guards, pass-through, compression, CRLF | — |
| `.claude/skills/MANIFEST.json` | TASK-036: Bind dev-flow-compress skill (user-invocable: false) | — |
| `.claude/CLAUDE.md` | TASK-036: Add Python 3.10+ to stack + commands section; align scripts convention | — |

---

## Sprint 10 — Eval Baseline + CI Gate (2026-04-24)

**Blueprint version:** MINOR bump — first full eval coverage across all 9 skills; GitHub Actions CI gate enforcing scaffold + blueprint integrity on every PR

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/snapshots/*/baseline-001.json` | TASK-048: Three-arm baseline snapshots for all 9 skills (8 new); measure.py runs clean across all | — |
| `evals/README.md` | TASK-048: Baseline Anomalies section — brevity_delta pattern documented for structured-output skills | — |
| `.github/workflows/validate.yml` | TASK-025: GitHub Actions CI gate — validate-scaffold.js + validate-blueprint.js on every PR to master | — |

---

## Sprint 9 — Workflow Continuity + Compat (2026-04-24)

**Blueprint version:** PATCH bump — Phase 9c continue/done prompt; Phase 10 sprint-complete detection + rotation checklist; `measure.py` Python 3.8+ fallback

| File | Change | ADR |
|:-----|:-------|:----|
| `evals/measure.py` | TASK-047: Guard `Path.is_relative_to()` with `Path.parents` fallback for Python < 3.9 | — |
| `evals/README.md` | TASK-047: Document Python 3.8+ compatibility note | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-049: Add Phase 9c continue/done prompt — 'next' chains to next task, 'done' runs Phase 10, no tasks → sprint-complete Phase 10 | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-046: Add sprint-complete detection to Phase 10 — rotation checklist + proposed Sprint N+1 output; human approves before TODO.md written | — |

---

## Sprint 8 — Scripts + Harness Polish (2026-04-24)

**Blueprint version:** PATCH bump — stale line-limit fix, session-start false-warning fix, cp/mkdir harness tracking

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/scripts/validate-scaffold.js` | Fix README.md + docs/README.md line limit 80 → 50; all 11 tests pass | — |
| `.claude/scripts/session-start.js` | Fix false ownership warning: use `hasLastUpdated` field-presence check instead of date regex for "no header" guard | — |
| `.claude/scripts/__tests__/session-start.test.js` | Add regression test: YYYY-MM-DD placeholder must not trigger ownership warning | — |
| `.claude/settings.json` | Add `Bash(cp*)` and `Bash(mkdir*)` to permissions.allow — prevent init-flow permission prompts | — |
| `.claude/settings.local.example.json` | Add `Bash(cp*)` and `Bash(mkdir*)` to permissions.allow | — |

---

## Sprint 7 — Harness Init Fixes (2026-04-24)

**Blueprint version:** PATCH bump — hook path fix, allowedTools additions, git -C matcher coverage, chain-guard, README adoption corrections

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/settings.json` | TASK-041: Replace `${CLAUDE_PLUGIN_ROOT}` → `$CLAUDE_PROJECT_DIR` in all 5 hook commands | — |
| `.claude/settings.json` | TASK-043: Add `permissions.allow: ["Bash(node .claude/scripts/*)"]` — suppress hook permission prompts | — |
| `.claude/settings.json` | TASK-045: Add `Bash(git -C * commit*)` + `Bash(git -C * push*)` PreToolUse matchers; inline chain-guard on `Bash(git add*)` blocks `&& git commit` chains | — |
| `.claude/settings.local.example.json` | TASK-045: Add `Bash(git -C *)` to permissions.allow | — |
| `README.md` | TASK-039: Add settings.local.json copy step to "How to adopt" | — |
| `README.md` | TASK-040: Fix stale paths → templates/; collapse blueprint listing; trim to 47 lines | — |
| `templates/SETUP.md.template` | TASK-039: Add "First session (Claude Code harness)" section | — |

**Resolved bugs:**

| Bug | Fixed by | Verified | Notes |
|:----|:---------|:---------|:------|
| BUG-001: `${CLAUDE_PLUGIN_ROOT}` fails in project-local settings.json hooks | TASK-041 (Sprint 7) | TASK-052 (2026-04-25) — confirmed token absent from `.claude/settings.json`; all 5 hooks use `$CLAUDE_PROJECT_DIR` | rotated from `docs/BUGS.md` |
| BUG-002: Harness node scripts not in `allowedTools` — permission prompt on every hook fire | TASK-043 (Sprint 7) | TASK-052 (2026-04-25) — confirmed `Bash(node .claude/scripts/*)` present in `permissions.allow` | rotated from `docs/BUGS.md` |

---

## Sprint 6 — Doc Templates + Eval Harness (2026-04-24)

**Blueprint version:** MINOR bump — new eval harness (§17 Channel 4); new `docs/DECISIONS.md`; six doc templates shipped

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/README.md.template` | New — README template, 50-line limit, License section | — |
| `templates/ARCHITECTURE.md.template` | New — Architecture template, 150-line limit | — |
| `templates/DECISIONS.md.template` | New — Decision log template, ADR-001 example | — |
| `templates/SETUP.md.template` | New — Setup template, env vars table | — |
| `templates/AI_CONTEXT.md.template` | New — AI context template, Domain Glossary | — |
| `templates/CHANGELOG.md.template` | New — Changelog template, filled sprint example | — |
| `evals/measure.py` | New — offline three-arm skill eval harness, stdlib only, path-traversal guard | ADR-001 |
| `evals/README.md` | New — eval methodology doc, snapshot schema, usage | — |
| `evals/snapshots/lean-doc-generator/baseline-001.json` | New — first committed baseline snapshot | — |
| `docs/DECISIONS.md` | New — decision log; ADR-001: Python + three-arm methodology | ADR-001 |
| `docs/BUGS.md` | New — structured bug log: BUG-001 (PLUGIN_ROOT), BUG-002 (allowedTools) | — |
| `docs/blueprint/06-harness.md` | Added eval harness Channel 4 section | ADR-001 |
| `TODO.md` | TASK-024 smoke test: 4 P0 doc issues + 3 harness bugs captured (TASK-037–045) | — |

---

## Sprint 5 — Templates + Validation (2026-04-22)

**Blueprint version:** PATCH bump — new harness scripts and templates; no new skills, modes, or gates

| File | Change | ADR |
|:-----|:-------|:----|
| `templates/TODO.md.template` | TASK-020 — Created — worked example sprint with all 6 required task fields and `[CUSTOMIZE]` markers throughout | — |
| `.claude/scripts/scaffold-checks.js` | TASK-022 — Created shared validation util: `countLines`, `globSkills`, `checkManifest`, `checkOwnershipHeader`, `checkDocLineLimits`, `checkRequiredFiles` | — |
| `.claude/scripts/validate-scaffold.js` | TASK-022 — CI hard-gate: 7 checks (required files, CLAUDE.md lines, MANIFEST schema, TODO.md ownership+sprint, skill count+frontmatter, doc limits); exits 1 on any failure; 11 tests | — |
| `.claude/scripts/validate-blueprint.js` | TASK-023 — Blueprint integrity: MANIFEST skill paths × filesystem; §4 agents × `.claude/agents/`; exits 1 on any failure; 6 tests | — |
| `.claude/scripts/session-start.js` | TASK-022 — Refactored: imports `countLines`, `globSkills`, `checkManifest`, `checkDocLineLimits` from scaffold-checks util; no duplicate logic | — |
| `docs/blueprint/07-todo-format.md` | Added Sprint Creation Checklist and Required Task Fields table | — |
| `TODO.md` | TASK-034 deferred to P3 (blocked on TASK-027 multi-platform sync); task fields added to all Sprint 5 tasks | — |

---

## Sprint 4 — Skills Craft + Description Audit + Behavioral Template (2026-04-22)

**Blueprint version:** PATCH bump — no new skills or gates; description rewrites, Red Flags additions, HOW-filter flowchart, behavioral guidelines template

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/skills/task-decomposer/SKILL.md` | TASK-015 — Replaced stub with full §22 implementation — input type table, dot flowchart, 6-step execution protocol, risk scoring, scope assignment, 5 Red Flags, 5 hard rules | — |
| `.claude/skills/task-decomposer/references/decomposition-spec.md` | TASK-015 — Created — output format template, assumption registry format, granularity rules, 9 validation hard stops, `--from-architecture` spec, credential degradation spec | — |
| `.claude/skills/adr-writer/SKILL.md` | TASK-018 — Added Red Flags table (4 rows) — "obvious decisions", late recording, code-as-docs, one-liner rationalization | — |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-018/019 — Fixed description (removed process summary); added Red Flags table (4 rows); added Finding Severity Examples (CRITICAL vs NON-BLOCKING contrast) | — |
| `.claude/skills/lean-doc-generator/SKILL.md` | TASK-018/019 — Fixed description (removed HOW summary); added HOW-filter dot flowchart (3-branch decision tree); added Red Flags table (4 rows) | — |
| `.claude/skills/release-manager/SKILL.md` | TASK-018 — Added Red Flags table (4 rows) — breaking change bump, post-tag changelog, missing version file, vague commit intent | — |
| `.claude/skills/refactor-advisor/SKILL.md` | TASK-019 — Fixed description (removed process/output summary) | — |
| `.claude/skills/security-auditor/SKILL.md` | TASK-018/019 — Fixed description (removed scope summary); added Red Flags table (4 rows) — silent skips, stale approval, partial disclosure, internal-service blind spot | — |
| `.claude/skills/system-design-reviewer/SKILL.md` | TASK-018/019 — Fixed description (removed mode-summary); added Red Flags table (4 rows) — deferred details, operational correctness, brownfield doc check, status downgrade | — |
| `.claude/CLAUDE.md` | TASK-032 — Replaced placeholder template with populated dev-flow project context; added Behavioral Guidelines section (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) | — |
| `templates/CLAUDE.md.template` | TASK-032 — Created — adopter-facing template with [CUSTOMIZE] markers, ownership header, behavioral guidelines section | — |

---

## Sprint 3 — Agents + Skills (2026-04-21)

**Blueprint version:** MINOR bump — 7 full agent system prompts; 7 project-local skills; `regenerate-manifest.js`; `dev-flow` orchestrator skill live

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/agents/design-analyst.md` | TASK-016 — full Phase 2 system prompt: codebase exploration, micro-task plan, ≤300 token return | — |
| `.claude/agents/init-analyst.md` | TASK-016 — full INIT system prompt: Role A (Discovery) + Role B (Architecture); preloads system-design-reviewer | — |
| `.claude/agents/code-reviewer.md` | TASK-016 — full Phase 6 system prompt: two-stage [S1]/[S2] review; preloads pr-reviewer | — |
| `.claude/agents/security-analyst.md` | TASK-016 — full Phase 7 system prompt: OWASP audit; preloads security-auditor; CRITICAL never truncated | — |
| `.claude/agents/migration-analyst.md` | TASK-016 — full §19 system prompt: structural safety + concurrency + rollback stages | — |
| `.claude/agents/performance-analyst.md` | TASK-016 — full §20 system prompt: query analysis + API profile + caching + baseline | — |
| `.claude/agents/scope-analyst.md` | TASK-016 — full §22 system prompt: read-only impact assessment; risk scoring table | — |
| `.claude/skills/adr-writer/SKILL.md` | TASK-013 — full skill: ADR format, 5-step procedure, hard rules; context: inline | — |
| `.claude/skills/refactor-advisor/SKILL.md` | TASK-013 — full skill: 4 lenses, before/after format, risk tiers, Red Flags table | — |
| `.claude/skills/lean-doc-generator/SKILL.md` | TASK-013 — full skill: HOW filter, ownership header, Phase 8 procedure, line limits | — |
| `.claude/skills/lean-doc-generator/reference/DOCS_Guide.md` | TASK-013 — full lean doc standard: HOW filter examples, file reference, line-limit enforcement, checklist | — |
| `.claude/skills/lean-doc-generator/reference/VALIDATED_PATTERNS.md` | TASK-013 — 7 validated patterns + 2 anti-patterns from session-close promotions | — |
| `.claude/skills/release-manager/SKILL.md` | TASK-013 — full skill: SemVer rules, CHANGELOG format, hard rules; context: fork | — |
| `.claude/skills/system-design-reviewer/SKILL.md` | TASK-013 — full skill: 5 review lenses, greenfield/brownfield modes, output format | — |
| `.claude/skills/pr-reviewer/SKILL.md` | TASK-013 — full skill: 7-lens review, [S1]/[S2] labeling, hard rules; agent: code-reviewer | — |
| `.claude/skills/security-auditor/SKILL.md` | TASK-013 — full skill: OWASP Top 10 table, additional checks, CRITICAL never truncated | — |
| `.claude/scripts/regenerate-manifest.js` | TASK-017 — new: walks `skills/*/SKILL.md`, emits `MANIFEST.json`; testable via skillsDir param | — |
| `.claude/scripts/__tests__/regenerate-manifest.test.js` | TASK-017 — 7 passing tests: discovery, null last-validated, idempotency, JSON validity | — |
| `.claude/skills/MANIFEST.json` | TASK-017 — regenerated: 9 skills, all within staleness window | — |
| `.claude/skills/dev-flow/SKILL.md` | TASK-014 — full orchestrator: 6-mode dispatch, dot flowchart, Gate 0/1/2 prompts, Phase 0–10 checklist, 18 hard stops, hotfix/resume protocols, Red Flags table | — |

---

## Sprint 2 — Scaffold + Scripts (2026-04-21)

**Blueprint version:** MINOR bump — scaffold materialized; 4 harness scripts shipped; hook contract corrected

| File | Change | ADR |
|:-----|:-------|:----|
| `.claude/CLAUDE.md` | TASK-007 — stub template per blueprint §7; ownership header; ≤200-line budget | — |
| `.claude/settings.json` | TASK-012 — valid JSON; corrected hook commands with `${CLAUDE_PLUGIN_ROOT}`; SessionStart `startup\|resume\|clear\|compact` matcher added | — |
| `.claude/settings.local.example.json` | TASK-012 — example with `[package-manager]` placeholder and inline instructions | — |
| `.claude/agents/*.md` | TASK-007 — 7 agent stubs: design-analyst, init-analyst, code-reviewer, security-analyst, migration-analyst, performance-analyst, scope-analyst | — |
| `.claude/skills/MANIFEST.json` | TASK-007 — empty stub registry; Sprint 3 TASK-017 populates it | — |
| `.claude/skills/*/SKILL.md` | TASK-007 — 9 skill stubs with valid CC_SPEC frontmatter and Sprint 3 stub markers | — |
| `.claude/scripts/session-start.js` | TASK-008 — pure Node CommonJS; all 9 checks; no shell-outs; `globSkills()` uses `readdirSync`; exit 1 on blocking errors | — |
| `.claude/scripts/read-guard.js` | TASK-009 — rewrite from scratch; stdin JSON via fd 0 (cross-platform); exit 2 block; structured `{"decision":"block","reason":"..."}` output; fail-open on empty/unknown path | — |
| `.claude/scripts/track-change.js` | TASK-010 — stdin JSON; normalized backslash→forward-slash; ignores `.claude/`, `node_modules/`, lock files | — |
| `.claude/scripts/ci-status.js` | TASK-010 — `CI_PROVIDER=skip` default; GitHub Actions + GitLab CI poll paths; error-resilient | — |
| `.claude/scripts/__tests__/session-start.test.js` | TASK-011 — 12 tests covering all 9 checks; temp-dir isolation; `node --test` passes | — |
| `.claude/scripts/__tests__/read-guard.test.js` | TASK-011 — 14 tests: block/allow/allowlist/missing-phase/fail-open/JSON-output scenarios | — |
| `.claude/scripts/__tests__/track-change.test.js` | TASK-011 — 9 tests: append, accumulate, ignore rules, empty stdin, backslash normalization | — |
| `.claude/scripts/__tests__/ci-status.test.js` | TASK-011 — 3 tests: default-skip, explicit-skip, timeout guard | — |

---

## Sprint 1 — Documentation Refactor + Governance (2026-04-20)

**Blueprint version:** 1.7.0 → infrastructure split (no behavior change; PATCH bump)

| File | Change | ADR |
|:-----|:-------|:----|
| `docs/blueprint/01–10-*.md` | TASK-004 — blueprint split into 10 modular files; ownership headers on each | — |
| `AI_WORKFLOW_BLUEPRINT.md` | TASK-004 — reduced to ≤20-line redirect to `docs/blueprint/` | — |
| `docs/blueprint/01-philosophy.md` | TASK-005 — phase I/O table renumbered 0–10; violation protocol phases corrected | — |
| `docs/blueprint/04-subagents.md` | TASK-005 — `scope.phase` enum: added parse/clarify/validate/close; `status:` enum added to output contract | — |
| `docs/blueprint/05-skills.md` | TASK-005 — `type:`, `when_to_use:`, `context: fork` documented as project-convention fields (required vs optional) | — |
| `docs/blueprint/06-harness.md` | TASK-005 — read-guard.js corrected to use stdin JSON (env-var approach was broken); `${CLAUDE_PLUGIN_ROOT}` in all hook paths | — |
| `README.md` | TASK-006 — root README, ≤80 lines, public-GitHub-ready, HOW-filter clean | — |
| `CONTRIBUTING.md` | TASK-006 — blueprint change process, semver bump criteria (MAJOR/MINOR/PATCH) | — |
| `LICENSE` | TASK-006 — MIT 2026, Aldian Rizki | — |
| `.gitignore` | TASK-006 — covers settings.local.json, .phase, .session-changes.txt, node_modules | — |
| `docs/CHANGELOG.md` | Created in Sprint 0 handoff; Sprint 1 block added here | — |

---

## Sprint 0 — Research & Foundation (2026-04-20)

**Blueprint version:** pre-v1.8.0 (no scaffold changes this sprint — research only)

| File | Change | ADR |
|:-----|:-------|:----|
| `TODO.md` | Initial creation — Sprint 0 active, Sprints 1–5 in backlog, scaffold roadmap captured | — |
| `context/research/CC_SPEC.md` | TASK-001 — binding CC spec reference: hook stdin JSON contract, exit-code 2 semantics, subagent `preload-skills` field, skill frontmatter per agentskills.io, 7 concrete implications for scaffold plan | — |
| `context/research/ADAPTATION_NOTES.md` | TASK-002 — superpowers pattern import plan: 20 patterns adopted (flowcharts, Red Flags, Good/Bad pairs, rigid/flexible, model tiers, status enum, RED-GREEN-REFACTOR, etc.) with target dev-flow home; 10 architecture elements we keep; 7 patterns rejected/deferred; acceptance-criterion deltas for TASK-005, 013–019, 026–027 | — |
| `context/workflow/DESIGN_PHILOSOPHY.md` | TASK-003 — three non-negotiables (gate-driven, mode-modal, 27-stop catalog) with rationale + consequence per contributor; 8 superpowers patterns explicitly rejected with one-line why; reviewer guardrails; change-criteria for the philosophy itself | — |
