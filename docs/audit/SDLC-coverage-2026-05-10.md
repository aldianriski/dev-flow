---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint 058 close
status: in-progress (T1 done · T2/T3 pending)
sprint: 058
---

# SDLC Coverage Audit — dev-flow plugin (2026-05-10)

Read-only audit per Sprint 058 plan. Maps 6 SDLC phases (Requirements / Design / Implementation / Testing / Deployment / Maintenance) against 23 components (16 skills + 7 agents). Sprint 058 ships this audit; remediation lands Sprint 059 (v4.0.0 MAJOR cleanup batch) + Sprint 060 (v4.1.0 MINOR testing skill).

**Anchor:** `refined-task-list.md` Workstream C item 8.
**Sprint plan:** [SPRINT-058-sdlc-audit.md](../sprint/SPRINT-058-sdlc-audit.md) · plan_commit `b81b2a6`.
**Pre-locked decisions** (D-A..D-G): see sprint plan § Pre-locked decisions.

---

## Coverage Matrix (T1 / TASK-140)

**Cell schema (per D-E):** `P` = PRIMARY · `S` = SECONDARY · `·` = NONE
**Phase columns:** Req = Requirements · Des = Design · Imp = Implementation · Tst = Testing · Dep = Deployment · Mnt = Maintenance
**Auto-fire column:** `auto` = fires without human gate · `propose` = proposed → human y/n · `user` = user-invoked slash command only · `agent` = invoked by another agent's output
**Invoked-by column (agents only):** comma-separated invocation source (`zero` if file exists with no invocation found)

### Skills (16)

| Skill | Req | Des | Imp | Tst | Dep | Mnt | Auto-fire | Evidence |
|:------|:---:|:---:|:---:|:---:|:---:|:---:|:----------|:---------|
| `adr-writer` | · | **P** | · | · | · | S | auto on `design-analyst: adr needed` flag · user otherwise | skill-dispatch.md L50 |
| `architecture-grill` | · | **P** | · | · | · | S | user (`/architecture-grill`) | SKILL.md desc; no auto-fire trigger |
| `codemap-refresh` | · | S | · | · | · | **P** | auto (PostToolUse on `git commit`) · user fallback | hooks.json L29-37 + SKILL.md desc |
| `diagnose` | · | · | S | S | · | **P** | propose at G1 task-type=bug-fix | skill-dispatch.md L45 |
| `lean-doc-generator` | S | · | · | · | S | **P** | auto post-commit · user for sprint-promote/close | skill-dispatch.md L49 |
| `orchestrator` | S | S | **P** | S | S | · | user (`/orchestrator`) | SKILL.md desc; gate-driven dispatch |
| `pr-reviewer` | · | · | S | **P** | · | · | agent (preloaded by `code-reviewer` agent at Review phase) | skill-dispatch.md L47 + SKILL.md desc |
| `prime` | S | · | · | · | · | **P** | user (`/prime`) · session-start hook NOT wired | skill-dispatch.md L43 |
| `refactor-advisor` | · | S | · | · | · | **P** | propose post-Review on complexity-smell flag | skill-dispatch.md L48 |
| `release-manager` | · | · | · | · | **P** | · | propose at sprint close on MINOR/MAJOR bump | skill-dispatch.md L51 |
| `release-patch` | · | · | · | · | **P** | · | user (`/release-patch`) · auto-skip docs-only | SKILL.md desc + Sprint 047 ADR-025 DEC-8 |
| `security-auditor` | · | S | · | **P** | · | · | agent (preloaded by `security-analyst` in separate session) | skill-dispatch.md L52 |
| `task-decomposer` | **P** | S | · | · | · | · | user (`/task-decomposer`) · auto via orchestrator Path B | SKILL.md desc + ADR-030 DEC-5 |
| `tdd` | · | · | **P** | **P** | · | · | propose at G1 task-type=feature | skill-dispatch.md L46 |
| `write-a-skill` | · | **P** | S | · | · | · | user (`/write-a-skill`) | SKILL.md desc; new-skill authoring |
| `zoom-out` | · | **P** | · | · | · | S | propose pre-G1 on unfamiliar/cross-cutting | skill-dispatch.md L44 |

### Agents (7)

| Agent | Req | Des | Imp | Tst | Dep | Mnt | Invoked-by | Evidence |
|:------|:---:|:---:|:---:|:---:|:---:|:---:|:-----------|:---------|
| `code-reviewer` | · | · | S | **P** | · | · | dispatcher (proposed → human y/n at Review phase) | dispatcher.md L17 + skill-dispatch.md L47 |
| `design-analyst` | · | **P** | · | · | · | · | dispatcher (auto at G2 mvp / sprint-bulk) | dispatcher.md L17 + orchestrator SKILL.md L67 |
| `dispatcher` | S | S | **P** | S | S | · | **zero** (file exists; orchestrator skill IS the logic — no `Agent({subagent_type:'dispatcher'})` call across plugin per R3 grep 2026-05-10) | grep evidence: 0 invocations |
| `migration-analyst` | · | **P** | · | S | S | · | dispatcher (proposed → human y/n on DB schema detected) | dispatcher.md L17 + orchestrator SKILL.md L70 |
| `performance-analyst` | · | · | S | **P** | S | · | dispatcher (proposed → human y/n on api/db/hot-path + high risk) | dispatcher.md L17 + orchestrator SKILL.md L69 |
| `scope-analyst` | **P** | S | · | · | · | · | dispatcher (auto at G1 if size unclear) + `task-decomposer` Step 1 | dispatcher.md L17 + procedure.md Step 1 |
| `security-analyst` | · | S | · | **P** | · | · | user (separate `/security-review` session per ADR-015) | dispatcher.md L19 + ADR-015 one-way contract |

---

## Phase coverage tally (raw counts before gap analysis)

| Phase | PRIMARY count | SECONDARY count | NONE count |
|:------|:-------------:|:---------------:|:----------:|
| **Requirements** | 2 (`task-decomposer`, `scope-analyst`) | 5 | 16 |
| **Design** | 7 (`adr-writer`, `architecture-grill`, `write-a-skill`, `zoom-out`, `design-analyst`, `migration-analyst`, plus `dispatcher` S) | 9 | 7 |
| **Implementation** | 3 (`orchestrator`, `tdd`, `dispatcher`) | 6 | 14 |
| **Testing** | 5 (`pr-reviewer`, `tdd`, `security-auditor`, `code-reviewer`, `performance-analyst`, `security-analyst` — 6 if dispatcher S counted) | 6 | 12 |
| **Deployment** | 2 (`release-manager`, `release-patch`) | 5 | 16 |
| **Maintenance** | 5 (`codemap-refresh`, `diagnose`, `lean-doc-generator`, `prime`, `refactor-advisor`) | 5 | 13 |

**First-pass observations** (NOT verdicts — those land in T2):

1. **Testing PRIMARY count = 5** — actually decent coverage. But all 5 are *gates / reviews* (pr-reviewer, code-reviewer, security-auditor, security-analyst, performance-analyst); only `tdd` produces tests during Implementation. **Gap candidate:** no skill explicitly plans / groups / categorizes tests (item 7 from refined-task-list — testing skill).
2. **Requirements PRIMARY count = 2** — task-decomposer + scope-analyst cover intake/blast-radius. Adequate.
3. **Deployment PRIMARY count = 2** — release-manager + release-patch cover MINOR/MAJOR + PATCH. ADR-027 boundary clean.
4. **Maintenance PRIMARY count = 5** — strong coverage (codemap, diagnose, doc-rot, prime, refactor).
5. **Design PRIMARY count = 7** — highest coverage; **suggests potential overlap** (R1/R2 candidates land here in T2).
6. **`dispatcher` agent — zero invocations confirmed** — strongest R3 evidence; orchestrator skill IS the role.

---

## Gap Analysis (T2 / TASK-141)

### Phase-coverage gaps ranked (highest gap first)

1. **Testing — high gap.** PRIMARY count = 5 (decent on paper) BUT all 5 are gates/reviews (pr-reviewer, code-reviewer, security-auditor, security-analyst, performance-analyst). Only `tdd` actively produces tests during Implementation; even tdd is propose-only (not auto-fire). **Missing surface:** test PLANNING / GROUPING (unit / integration / e2e / regression). Maps to refined-list item 7 → Sprint 060.
2. **Requirements — moderate gap.** Only 2 PRIMARY (`task-decomposer` user-invoked + `scope-analyst` agent at G1). No always-on requirements-review surface; once decomposed, requirements freeze without re-validation as work progresses. Acceptable given vertical-slice discipline (ADR-031); not a Sprint-059/060 candidate.
3. **Deployment — adequate.** 2 PRIMARY (`release-manager` MINOR/MAJOR + `release-patch` PATCH) covers full semver matrix per ADR-027 boundary. No gap.
4. **Design — over-served.** 7 PRIMARY suggests overlap candidates (R1 lands here). Not a gap; signals consolidation opportunity.
5. **Implementation — adequate.** `orchestrator` (workflow driver) + `tdd` (test-first coding) + `dispatcher` (orchestration role). Implementation-time linting/formatting handled by adopter-supplied PreToolUse hooks (per `.claude/settings.local.json` stack presets); not a plugin-internal gap.
6. **Maintenance — strong.** 5 PRIMARY (codemap-refresh, diagnose, lean-doc, prime, refactor-advisor); doc-rot, debugging, code-smell all well-covered.

### R1 verdict — `architecture-grill`

**Verdict:** `MERGE` into `design-analyst` agent
**Outcome served:** O3 architecture (clearer model) + O5 flow (one less skill to learn)
**Rationale:**
1. Empirically zero auto-fires across plugin (user-invoked only path; never spawned in standard flow per Sprint 057 R1 conversation 2026-05-10).
2. 5 review lenses (correctness · scalability · coupling · operational · resilience) overlap heavily with `design-analyst`'s G2 architectural-review responsibilities — currently inconsistent: design-analyst fires automatically, architecture-grill waits for human invocation that rarely happens.
3. Folding the 5 lenses into `design-analyst` means EVERY G2 mvp/sprint-bulk run gets the lens checks (currently optional ad-hoc); strengthens O3 from "hope user invokes grill" to "always applies at G2".
4. Risk of MERGE: lose the strict 1-question-at-a-time grill mode for high-stakes ad-hoc design review. Mitigation: design-analyst can offer a `--grill` flag preserving the strict mode for explicit invocation; default is auto-G2 batched plan.

### R2 verdicts — overlap pairs

| Pair | Verdict | Rationale | Outcome |
|:-----|:--------|:----------|:--------|
| `prime` ↔ `init` (orchestrator mode) | **KEEP both** | Different lifecycle stages — `init` is one-time scaffold bootstrap; `prime` runs every session. Not actually overlapping. | O1 onboard (init) + O5 flow (prime) |
| `release-manager` ↔ `release-patch` | **KEEP both** | Clean ADR-027 boundary: release-manager = MINOR/MAJOR explicit; release-patch = PATCH auto-detect + manifest cascade + docs-only skip. Boundary validated by 4 manual MINOR/MAJOR bumps Sprints 052b/056/057 + countless PATCH auto-runs. | O8 reliability + O5 flow |
| `pr-reviewer` (skill) ↔ `code-reviewer` (agent) | **KEEP both** | Intentional skill/agent pairing per ADR-015 one-way dispatch contract. Agent = thin wrapper that loads skill in dispatch context. Removing the agent breaks the dispatcher's invocation surface. | O4 rework + O8 reliability |
| `security-auditor` (skill) ↔ `security-analyst` (agent) | **KEEP both** | Same skill/agent pairing pattern as `pr-reviewer ↔ code-reviewer`. Agent enforces the SEPARATE-SESSION contract (ADR-015) that prevents context contamination during security review. | O8 reliability + O4 rework |

**R2 summary:** 0 of 4 listed pairs are actually redundant — all are intentional separations (lifecycle / boundary / skill-agent pairing). Real redundancy candidates land in R1 (arch-grill) and R3 (dispatcher).

### R3 verdict — `agents/dispatcher.md`

**Verdict:** `REMOVE` (consolidate role description into `skills/orchestrator/SKILL.md`)
**Outcome served:** O3 architecture (1 less component to learn) + O5 flow (matches actual invocation surface)
**Grep evidence (2026-05-10):**
- `subagent_type.*dispatcher` invocations: **0**
- `Agent\([^)]*dispatcher\)` invocations: **0**
- Bare prose references to "dispatcher" outside the agent file itself: 2 (architecture-grill SKILL.md L88 + phases.md L225) — both descriptive, not invocation calls

**Rationale:** the file describes a role that the orchestrator skill IS, not a separately-spawned agent. Misleads readers into thinking dispatcher is invocable when it isn't. Removing the file simplifies agent roster from 7 → 6 (matches actual `Agent({subagent_type:...})` surface). Role description (responsibilities, dispatch rules) folds into `skills/orchestrator/SKILL.md` § Agent Dispatch + § Skill Dispatch which already cover it. CONTEXT.md § Agent Roster row removed lockstep.

### Items 3/4/5/7 scope-clarification entries

| Item | Scope clarification (one-line) | Sprint placement |
|:-----|:-------------------------------|:-----------------|
| **Item 3** Codemap user-scope | Rewrite `scripts/codemap-refresh.ps1` to scan adopter's repo (default), not dev-flow's own docs; add explicit `--internal` flag for plugin self-audit. SKILL.md description updated lockstep. | Sprint 059 |
| **Item 4** History-rule scope | Add explicit Scope section to ADR-034 / CONTEXT.md § History Hygiene clarifying: "Rules apply to dev-flow internal sprint artifacts; adopter projects MAY adopt patterns via copying ADR-034 framework but are NOT enforced." Closes user-vs-internal ambiguity. | Sprint 059 |
| **Item 5** TODO history persistence | Audit TODO.md collapse pattern for CHANGELOG link integrity (every closed task row → CHANGELOG row pointer); add TODO.md preamble note "history archive: see docs/CHANGELOG.md" reinforcing ADR-034 DEC-4 design. No data loss expected — collapse-then-delete is intentional per ADR-034. | Sprint 059 |
| **Item 7** Testing skill | NEW skill `test-planner` (or similar name) at Sprint 060; covers test PLANNING + GROUPING (unit / integration / e2e / regression) before writing tests; complements `tdd` (writes) + `pr-reviewer` (reviews). Distinct surface from existing 16. | Sprint 060 |

### Outcome-tagging summary (per D-G)

All 6 verdicts above tagged with user-project outcomes (O1-O8 per ADR-026). Outcome distribution:
- **O3 architecture:** R1, R3, items 3+4
- **O5 flow:** R1, R3, R2-prime/init, R2-release
- **O8 reliability:** R2-release, R2-pr-reviewer, R2-security
- **O4 rework:** R2-pr-reviewer, R2-security, item 7
- **O1 onboard:** R2-prime/init, items 3+4 (clearer adopter expectations)
- **O2 doc-rot:** item 5 (TODO history persistence)

No verdict serves zero outcomes — D-G constraint satisfied.

---

## Remediation Plan (T3 / TASK-142)

### Sprint 059 task seeds — v4.0.0 MAJOR (single-MAJOR consolidation per release-debt discipline)

6 task seeds. Single MAJOR bump consolidates all hard-to-reverse cleanup (skill removal + agent removal + scope-clarify edits). Per ADR-027 boundary: release-patch HARD-rejects MAJOR; manual sprint-less bump (5th instance pattern) on T6.

| Seed | Title (1-line) | Size | Risk | Depends on (T2 verdict) | Outcome |
|:-----|:---------------|:-----|:-----|:------------------------|:--------|
| **T1** | Fold arch-grill 5 review lenses into `design-analyst` agent; remove `skills/architecture-grill/`; preserve `--grill` flag for strict 1-Q-at-a-time mode on explicit invocation | M | high | R1 MERGE | O3 + O5 |
| **T2** | Remove `agents/dispatcher.md`; fold role description (responsibilities + dispatch rules) into `skills/orchestrator/SKILL.md` § Agent Dispatch + Skill Dispatch; CONTEXT.md § Agent Roster row removed lockstep | S | medium | R3 REMOVE | O3 + O5 |
| **T3** | Rewrite `scripts/codemap-refresh.ps1` to scan adopter's repo by default (not dev-flow's own docs); add `--internal` flag for plugin self-audit; SKILL.md description + ADR-034 scope notes updated lockstep | M | medium | item 3 | O1 + O3 |
| **T4** | Add explicit Scope section to ADR-034 § History Hygiene + CONTEXT.md History Hygiene block clarifying "rules apply to dev-flow internal artifacts; adopter projects MAY adopt patterns but NOT enforced" | S | low | item 4 | O1 + O2 |
| **T5** | Audit TODO.md collapse pattern → CHANGELOG link integrity (every closed task row points to CHANGELOG row); add TODO.md preamble note "history archive: see docs/CHANGELOG.md" reinforcing ADR-034 DEC-4 design | S | low | item 5 | O2 + O1 |
| **T6** | Plugin propagation + lockstep MAJOR bump 3.1.0 → 4.0.0 (`plugin.json` + `marketplace.json` + CHANGELOG v4.0.0 prepend); CONTEXT.md § Agent Roster reduce 7 → 6; CONTEXT.md § Vocabulary `grill` row simplified (architecture-grill removed); USER-OUTCOMES.md skills row 16 → 15; eval gates verify no NEW breach | M | medium | T1..T5 | O8 + O5 |

**Total Sprint 059 size estimate:** L (3M + 3S = ~3 days). May need to split into 059a + 059b if execution exceeds. ADR required for arch-grill removal (hard-to-reverse skill removal); reuse ADR pattern from ADR-034 / ADR-036.

### Sprint 060 task seeds — v4.1.0 MINOR (testing skill)

3 task seeds. MINOR bump per skill addition (Quick Rules § GOVERNANCE).

| Seed | Title (1-line) | Size | Test grouping | Outcome |
|:-----|:---------------|:-----|:--------------|:--------|
| **T1** | NEW skill `test-planner` — test PLANNING + GROUPING (distinct from `tdd` writes / `pr-reviewer` reviews); SKILL.md ≤100 with `references/TEST_GROUPING.md` body | M | covers all 4: unit / integration / e2e / regression | O8 + O4 |
| **T2** | Wire `test-planner` into orchestrator skill-dispatch table (G1 task-type=feature OR test-coverage<X% triggers propose); update CONTEXT.md § Vocabulary + § Skills count 15 → 16; USER-OUTCOMES.md skills row | S | N/A (wiring) | O5 + O8 |
| **T3** | Plugin propagation + lockstep MINOR bump 4.0.0 → 4.1.0; CHANGELOG v4.1.0 prepend; eval gates verify no NEW breach; smoke-test test-planner via mental trace 3-task feature plan | S | N/A | O8 + O5 |

**Total Sprint 060 size estimate:** M (1M + 2S = ~1 day).

### Sprint sequencing — 058 → 059 → 060

```
Sprint 058 (this · 2026-05-10)
  audit-only · docs-only · 4 tasks · 0 version bump · 0 code change
  └─ produces: SDLC-coverage-2026-05-10.md (Matrix + Gap + Remediation)
       │
       ▼
Sprint 059 (next · estimated ~2026-05-11..12)
  cleanup batch · v4.0.0 MAJOR (single MAJOR per release-debt)
  6 tasks: T1 arch-grill MERGE → T2 dispatcher REMOVE → T3 codemap user-scope
           → T4 history scope · T5 TODO history audit (parallel) → T6 propagation+bump
  ADR required: ADR-037 (arch-grill removal + dispatcher consolidation rationale)
       │
       ▼
Sprint 060 (after · estimated ~2026-05-12..13)
  testing skill · v4.1.0 MINOR
  3 tasks: T1 test-planner skill → T2 wire into dispatch → T3 propagation+bump
       │
       ▼
Workstream A/B/C all closed. Refined-task-list.md fully addressed.
```

**Push gate cadence:** per release-patch HARD STOP — operator runs `git push origin master` after each sprint close. Currently ~37+ commits unpushed (Sprints 056+057+058 plan-locked). Push before Sprint 059 promote recommended (clean baseline for v4.0.0 MAJOR cut).

### Deferred / out-of-scope list

These verdicts/observations did NOT generate Sprint 059/060 seeds:

- **R2 prime↔init** — KEEP both (lifecycle separation is intentional). No action.
- **R2 release-manager↔release-patch** — KEEP both (ADR-027 boundary clean). No action.
- **R2 pr-reviewer↔code-reviewer skill/agent pair** — KEEP both (ADR-015 one-way contract). No action.
- **R2 security-auditor↔security-analyst skill/agent pair** — KEEP both (ADR-015 separate-session contract). No action.
- **Requirements moderate gap** — accepted; vertical-slice discipline (ADR-031) substitutes for always-on requirements review. No action.
- **Implementation phase Implementation-time linting** — adopter-supplied PreToolUse hooks per stack preset; not plugin-internal scope. No action.
- **TD-003 + TD-004 carry-forward from Sprint 057** — Sprint 059 candidates; surface at Sprint 059 promote Step 1.5 TD scan rather than pre-allocating. No 058 action.
- **Mode A live eval-acceptance runs** — operator-pending since Sprint 055; not unblocked by this audit. No 058/059/060 action.
- **Push of Sprints 056/057 commits** — operator gate per pre-locked D-F (Sprint 057 + 058); not in any sprint scope.

---

## References

- [SPRINT-058-sdlc-audit.md](../sprint/SPRINT-058-sdlc-audit.md) — sprint plan + 7 pre-locked decisions
- [USER-OUTCOMES.md](../USER-OUTCOMES.md) — outcome registry (O1-O8) for D-G tagging
- [ADR-026](../adr/ADR-026-user-project-outcome-lens.md) — outcome lens decision record
- [skill-dispatch.md](../../skills/orchestrator/references/skill-dispatch.md) — invocation map for skills + agents
- [hooks/hooks.json](../../hooks/hooks.json) — auto-fire flag source for hook-driven skills
- `refined-task-list.md` — Workstream C item 8 origin
