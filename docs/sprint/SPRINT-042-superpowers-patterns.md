---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: pending
close_commit: pending
---

# Sprint 042 — EPIC-Audit Phase 4c (Superpowers patterns)

**Theme:** Deep-audit `obra/superpowers` against dev-flow — diff hooks contract (`startup|clear|compact` matcher + `run-hook` shim), evaluate skill-auto-trigger acceptance harness, lift PR template + tests/ floor, lock decisions in ADR-021. Adopt-or-reject each candidate with rationale; no skill behavior change without eval evidence.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 041 closed `6640eb0`.
**Successor:** Sprint 043 (EPIC-Audit Phase 4d — Mattpocock skill library).

---

## Why this sprint exists

Sprint 034 external-refs probe (`docs/audit/external-refs-probe.md` §80–112) classified `obra/superpowers` as the second-highest-leverage external ref after caveman. Five concrete adopt candidates surfaced in the probe; none decided. Sprint 042 lands them as research notes + ADR-021. Recommended phase ordering (probe line 169) explicitly placed 4c before 4d because superpowers has the **lowest-risk, fastest** lift (hooks contract + PR template + tests/ floor) and unblocks the broader skill-bucket question slated for Phase 4d.

Five probe-flagged candidates:

1. **`hooks/hooks.json` SessionStart matcher = `startup|clear|compact`** — dev-flow currently uses `startup|resume|clear|compact` (one extra). Confirm reconciliation strategy: superset-OK or align-to-probe?
2. **`hooks/run-hook.cmd` dispatcher shim** — single entrypoint that routes to named hook scripts. dev-flow calls `scripts/session-start.ps1` directly via PowerShell. Adoption may simplify adding hooks but trades direct-invocation simplicity.
3. **Skill-auto-trigger acceptance harness** — superpowers mandates a session transcript proving the brainstorming skill auto-triggers when given a specific prompt. dev-flow has zero auto-trigger acceptance tests for its 18 skills. This is the most concrete unblock for ADR-016's "skill changes that alter agent behavior require eval evidence" rule.
4. **`.github/PULL_REQUEST_TEMPLATE.md`** — gates PR submission with explicit DoD checklist. dev-flow has none (only `.github/workflows`). Mechanical lift; no behavior change.
5. **`tests/` directory at plugin root** — even smoke tests for `session-start.ps1` and `codemap-refresh.ps1` would be a dignity floor. dev-flow has none.

This sprint is decision-only for items 1, 2, 3, 5 (research notes + ADR), and a **single mechanical lift** for item 4 (PR template). No skill behavior changes; no scripts written this sprint. Item 5 implementation deferred to its own sprint if adopted.

---

## Open Questions (lock at promote)

*(All approved by user 2026-05-04 per "approve all" pattern. Resolutions:)*

- (a) **External fetch tool** — resolved: gh CLI primary (no local cache for `obra/superpowers`). Source = `gh api repos/obra/superpowers/contents/...` exclusively. SHA pin mandatory in each research note. WebFetch fallback on gh failure; cached probe (`docs/audit/external-refs-probe.md` §80–112) on both fail.
- (b) **`hooks.json` matcher reconciliation** — resolved at promote: **keep-superset** (option ii). Rationale: dev-flow's extra `resume` matcher is harmless; aligning down would lose Claude Code harness signal coverage. T1 to confirm via probe + record divergence in research note. No upstream PR to superpowers in this sprint (out of scope).
- (c) **`run-hook` shim adoption depth** — resolved at promote: **note-only this sprint, defer implementation**. Per Sprint 041 DEC-4 research-vs-implementation split. If T2 recommends adoption, lands as backlog task with link to research note.
- (d) **Acceptance harness 3-skill seed** — resolved at promote: `prime`, `orchestrator`, `tdd`. Highest auto-trigger value (prime = session-start, orchestrator = sprint workflow entry, tdd = explicit "implement new behavior" trigger). T3 design-doc only; implementation = future sprint per ADR-016 ("eval evidence required for skill behavior changes").

---

## Plan

### T1 — Diff superpowers `hooks/hooks.json` + reconcile matcher with dev-flow
**Scope:** quick · **Layers:** docs, governance · **Risk:** low · **AFK**
**Acceptance:** `docs/research/superpowers-hooks-diff-2026-05-04.md` exists with: (a) verbatim superpowers `hooks.json` (gh raw fetch + SHA pin), (b) side-by-side matcher comparison (superpowers `startup|clear|compact` vs dev-flow `startup|resume|clear|compact`), (c) hook-event coverage matrix (SessionStart, PreToolUse, PostToolUse, others), (d) recommendation for matcher reconciliation (align / superset / upstream PR) with rationale, (e) `${CLAUDE_PLUGIN_ROOT}` quoting check (Windows-space-in-path — locked in MEMORY:feedback_windows_hook_quoting). § Decisions row in sprint file: matcher reconciliation choice + rationale.
**Source:** `gh api repos/obra/superpowers/contents/hooks/hooks.json` (primary, raw fetch).
**Depends on:** none.
**Note:** READ-ONLY audit. dev-flow `hooks/hooks.json` quoted — verify no regression in superpowers' contract. If superpowers uses `${CLAUDE_PLUGIN_ROOT}` unquoted, flag in research note (does NOT affect dev-flow but may matter if shim adopted).

### T2 — Audit superpowers `hooks/run-hook.cmd` dispatcher + design dev-flow shim shape
**Scope:** quick · **Layers:** docs, scripts (research only) · **Risk:** low · **AFK**
**Acceptance:** `docs/research/superpowers-run-hook-shim-2026-05-04.md` exists with: (a) verbatim `run-hook.cmd` source (gh raw fetch + SHA pin), (b) dispatch-pattern walkthrough (how it routes script-name to file path), (c) Windows compatibility note (`.cmd` vs PowerShell `.ps1` — dev-flow standard), (d) dev-flow shim equivalent SHAPE (no implementation): proposed `scripts/run-hook.ps1` parameter contract + path resolution rules, (e) adopt/defer recommendation with rationale (worth maintenance? simplifies what?). § Decisions row: shim adopt Y/N + if Y, deferred-to-own-sprint flag.
**Source:** `gh api repos/obra/superpowers/contents/hooks/run-hook.cmd` (primary).
**Depends on:** none (parallel with T1).
**Note:** READ-ONLY audit. No `scripts/run-hook.ps1` written this sprint. If adoption recommended, it lands as a backlog task with reference back to this research note (Sprint 041 DEC-4 precedent).

### T3 — Design skill-auto-trigger acceptance harness for dev-flow (3-skill seed)
**Scope:** quick · **Layers:** docs, scripts (design only) · **Risk:** medium · **HITL**
**Acceptance:** `docs/research/superpowers-acceptance-harness-2026-05-04.md` exists with: (a) verbatim superpowers brainstorming-skill acceptance pattern (gh raw fetch + SHA pin), (b) test-format spec (input prompt → expected skill-trigger transcript marker), (c) 3-skill seed pick from dev-flow with trigger phrases listed (recommend `prime`, `orchestrator`, `tdd`), (d) integration target: where in dev-flow do these tests live (`tests/acceptance/<skill>.md` proposed), (e) measurement loop: how to verify pass/fail (manual session run vs automated evidence file), (f) gaps/risks for the dedicated implementation sprint. § Decisions row: adopt acceptance-harness pattern Y/N + 3-skill picks + implementation sprint flag.
**Source:** `gh api repos/obra/superpowers/contents/skills/brainstorming/SKILL.md` (primary) + `gh api repos/obra/superpowers/contents/tests/...` if test files exist.
**Depends on:** T1, T2 (T3 references hooks contract for trigger semantics).
**Note:** READ-ONLY design. NO test files written this sprint. NO skill behavior changed. Implementation = its own sprint, scoped per ADR-016 ("eval evidence required for skill behavior changes" — acceptance harness IS the eval evidence).

### T4 — Lift `.github/PULL_REQUEST_TEMPLATE.md` + ADR-021 (Superpowers patterns adoption decisions)
**Scope:** quick · **Layers:** governance, docs, ci · **Risk:** low · **HITL** *(reviewer must verify ADR completeness + PR template alignment with DoD)*
**Acceptance:**
1. `.github/PULL_REQUEST_TEMPLATE.md` exists, lifted from superpowers (gh raw fetch + SHA pin in commit msg) and adapted to dev-flow's DoD checklist (`CLAUDE.md` § Definition of Done).
2. `docs/adr/ADR-021-superpowers-patterns.md` exists, status Accepted, format follows ADR-019/020 precedent (Context / Decision / Alternatives / Consequences / References). Captures: (a) T1 matcher reconciliation choice; (b) T2 shim adopt/defer; (c) T3 acceptance harness adoption + 3-skill seed; (d) PR template lift + adaptation rationale; (e) `tests/` directory adoption decision with first-test scope (`session-start.ps1` smoke OR defer entirely).
**Depends on:** T1, T2, T3.
**Note:** ADR-021 sequential — confirmed via `ls docs/adr/` (max = 020). PR template is the ONLY non-doc/non-research file written this sprint. Lineage credit: superpowers MIT verified via `gh api repos/obra/superpowers/license` before T4 commit.

---

## Dependency Chain

```
T1 ─┐
    ├─→ T3 ─→ T4
T2 ─┘
```

T1 + T2 parallelizable (independent gh fetches: T1 = `hooks.json`, T2 = `run-hook.cmd`; separate output files). T3 depends on both because acceptance-harness design references hooks-contract + dispatcher semantics. T4 (ADR + PR template) depends on T1+T2+T3 outputs.

---

## Cross-task risks

- **gh CLI primary policy** (Sprint 040 codified, Sprint 041 confirmed). Drop leading slash on Git Bash. Fallback: WebFetch → cached probe summary (`docs/audit/external-refs-probe.md` §80–112).
- **No local plugin cache** for `obra/superpowers` — gh CLI is the ONLY source. Rate-limit risk if many fetches; bundle gh calls per task. SHA pin mandatory per Sprint 041 dual-source pattern (gh-only this sprint; SHA stands alone).
- **Windows-space-in-path** (MEMORY: `feedback_windows_hook_quoting`) — if T2 recommends shim adoption, the proposed `scripts/run-hook.ps1` MUST quote `${CLAUDE_PLUGIN_ROOT}`. Bake this into T2 design recommendation upfront.
- **Decision-only sprint mostly** — only T4 lifts a real file (PR template). Routing: T1+T2+T3 → `docs/research/`, T4 → `docs/adr/` + `.github/`. release-patch should NOT skip-bump (PR template is a contributor-visible change; PATCH justified, not docs-only).
- **ADR-021 sequential numbering** — max ADR = 020 (Sprint 041 just landed). ADR-021 confirmed safe via `ls docs/adr/`.
- **`tests/` adoption is a slippery slope** — T4 ADR must lock the **scope** explicitly (smoke-only? acceptance harness only? unit tests for scripts?) to prevent scope drift in a future "add tests" sprint.
- **PR template adaptation risk** — superpowers' "94% PR rejection rate" framing (probe line 105) is irrelevant to a single-author repo. Lift the **structure**, not the **frustration tone**. T4 must adapt, not copy verbatim.

---

## Sprint DoD

- [ ] T1 `docs/research/superpowers-hooks-diff-2026-05-04.md` exists with side-by-side matcher comparison + reconciliation recommendation. § Decisions row landed.
- [ ] T2 `docs/research/superpowers-run-hook-shim-2026-05-04.md` exists with dispatcher walkthrough + dev-flow shim shape + adopt/defer recommendation. § Decisions row landed.
- [ ] T3 `docs/research/superpowers-acceptance-harness-2026-05-04.md` exists with acceptance-pattern spec + 3-skill seed picks + implementation gaps. § Decisions row landed.
- [ ] T4a `.github/PULL_REQUEST_TEMPLATE.md` exists, adapted to dev-flow DoD (not verbatim superpowers copy).
- [ ] T4b `docs/adr/ADR-021-superpowers-patterns.md` exists, status Accepted, captures T1+T2+T3 + PR template lift + tests/ scope decision. Lineage credit (MIT verified).
- [ ] Plan-lock commit landed before any T1..T4 commit.
- [ ] Close commit + CHANGELOG row + TODO update + retro.
- [ ] Open questions (a–d above) resolved on promote, recorded as locked decisions.

---

## Execution Log

### 2026-05-04 | T1 done — pending commit
superpowers `hooks/hooks.json` fetched via gh CLI raw (upstream SHA `e7a2d16476bf`, 16 lines). License MIT confirmed via `gh api repos/obra/superpowers/license`.

Output: `docs/research/superpowers-hooks-diff-2026-05-04.md` — full matcher comparison, hook-event coverage matrix, `${CLAUDE_PLUGIN_ROOT}` quoting check, recommendation.

**Key findings:**
- Matcher diff: dev-flow has extra `resume` (`startup|resume|clear|compact` vs `startup|clear|compact`). HARMLESS per locked OQ(b).
- Coverage diff: dev-flow has 3 hooks (SessionStart + PreToolUse `Bash(git add*)` chain-guard + PostToolUse `Bash(git commit*)` codemap-refresh); superpowers has 1 hook (SessionStart only). dev-flow surface is RICHER than upstream.
- Both quote `${CLAUDE_PLUGIN_ROOT}` (Windows-space-in-path safe).
- Invocation divergence: superpowers uses shim (`run-hook.cmd` polyglot); dev-flow uses direct PowerShell call. T2 audits the shim.
- superpowers SessionStart injects `using-superpowers` SKILL.md as `additionalContext`; dev-flow SessionStart does verification only (no injection). Different design — dev-flow's `/prime` skill handles ordered loads on demand.

**Recommendation locked:** keep-superset, no change to dev-flow `hooks.json` matcher.

### 2026-05-04 | T2 done — pending commit
superpowers `hooks/run-hook.cmd` (47 lines, polyglot cmd+bash) + companion `hooks/session-start` (57 lines, bash) fetched via gh CLI raw (upstream SHA `e7a2d16476bf`).

Output: `docs/research/superpowers-run-hook-shim-2026-05-04.md` — verbatim source, dispatch-pattern walkthrough, Windows compatibility matrix, proposed dev-flow shim shape (UNIMPLEMENTED), adopt-vs-defer evaluation.

**Key findings:**
- superpowers shim solves Windows + Unix polyglot via clever `: << 'CMDBLOCK'` bash heredoc trick that cmd.exe ignores. Tries Git for Windows bash → PATH bash → silent exit 0 graceful degrade.
- dev-flow is Windows-only per ADR-016 — no polyglot need. Current direct-call pattern (`powershell -File <script>`) is simpler, fewer indirection layers, more debuggable.
- Shim adoption justified only if dev-flow grows past ~5 hooks (current: 3) OR reconsiders cross-platform. Neither on roadmap.
- 3 lessons worth keeping even without adoption: extensionless filenames (Claude Code Windows auto-detect avoidance), silent graceful degradation (already adopted Sprint 039 DEC-5), polyglot trick (clever but unneeded).

**Decision:** DEFER shim adoption per locked OQ(c). No backlog task — re-evaluate trigger conditions documented in research note.

### 2026-05-04 | T3 done — pending commit
superpowers `tests/skill-triggering/run-test.sh` (88 lines) + `run-all.sh` (60 lines) + sample prompt fetched via gh CLI raw (upstream SHA `e7a2d16476bf`).

Output: `docs/research/superpowers-acceptance-harness-2026-05-04.md` — verbatim acceptance pattern, test-format spec, 3-skill seed (prime/orchestrator/tdd) with naturalistic prompts, integration target `tests/skill-triggering/`, manual-vs-automated mode comparison, 6-risk matrix.

**Key findings:**
- Acceptance test = `claude -p <naive-prompt> --plugin-dir <dev-flow> --output-format stream-json` then grep stream-json for `"name":"Skill"` + `"skill":"<skill-name>"`. Pass = both present.
- Naive prompts must NOT name the skill — they describe a task, and a well-tuned skill description should auto-select.
- 3-skill seed locked per OQ(d): `prime` (session-bootstrap, highest-frequency), `orchestrator` (workflow entry), `tdd` (code-implementation, reuses superpowers' validated prompt).
- Recommendation = Mode A (manual run before skill-description changes ship); upgrade to Mode B (CI on every PR) if seed grows past ~10 skills.
- 6 implementation risks documented for TASK-116: stream-json shape drift (medium), `--plugin-dir` for in-dev plugin (medium), regex brittleness (low), non-determinism (medium — run 3× require 2/3 pass), Windows space-in-path (low), permission-skip risk acceptance (low).

**Decision:** Adopt acceptance harness pattern; implementation deferred to TASK-116 (future sprint per ADR-016 eval-evidence rule).

### 2026-05-04 | T4 done — pending commit
PR template fetched via gh CLI raw (superpowers `.github/PULL_REQUEST_TEMPLATE.md`, 126 lines, upstream SHA `e7a2d16476bf`). Adapted + landed at `.github/PULL_REQUEST_TEMPLATE.md`. ADR-021 written at `docs/adr/ADR-021-superpowers-patterns.md`.

**PR template adaptation:**
- LIFTED: structure (problem → change → alternatives → multi-change check → rigor → human review).
- DROPPED: maintainer-frustration tone ("PRs will be closed without review", "94% rejection rate" framing); superpowers-specific sections (core-library appropriateness, new-harness bootstrap acceptance test for `brainstorming` skill).
- ADDED: dev-flow specifics — sprint reference, DoD checklist from CLAUDE.md, ADR-016 skill-change eval requirement (cross-link to TASK-116 future harness), layer values from CLAUDE.md, Windows path-with-spaces + gh CLI leading-slash reminders from memory.
- Attribution preserved in HTML comment header.

**ADR-021 captures 6 decisions:**
- DEC-1: keep-superset matcher (no `hooks.json` change)
- DEC-2: hook-surface divergence documented (dev-flow richer than superpowers)
- DEC-3: DEFER run-hook shim adoption
- DEC-4: adopt acceptance harness pattern, TASK-116 deferred, prime/orchestrator/tdd seed
- DEC-5: PR template lifted + adapted (this commit)
- DEC-6: `tests/` dir adoption deferred to TASK-116 (no empty-dir scaffold)

ADR sequential per Sprint 040/041 retro pattern; max-ADR check confirmed = 020 before allocation.

---

## Files Changed

*(Empty — one row per file as work lands.)*

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/research/superpowers-hooks-diff-2026-05-04.md` | T1 | NEW (~80 lines) — verbatim superpowers hooks.json + side-by-side matcher + coverage matrix + reconciliation rec | low | — |
| `docs/sprint/SPRINT-042-superpowers-patterns.md` | T1 | Execution Log + § Decisions DEC-1, DEC-2 rows | low | — |
| `docs/research/superpowers-run-hook-shim-2026-05-04.md` | T2 | NEW (~110 lines) — verbatim shim source + dispatch walkthrough + proposed dev-flow shape (unimplemented) + adopt/defer matrix | low | — |
| `docs/sprint/SPRINT-042-superpowers-patterns.md` | T2 | Execution Log + § Decisions DEC-3 row | low | — |
| `docs/research/superpowers-acceptance-harness-2026-05-04.md` | T3 | NEW (~120 lines) — pattern walkthrough + 3-skill seed + integration layout + 6-risk matrix for TASK-116 | low | — |
| `docs/sprint/SPRINT-042-superpowers-patterns.md` | T3 | Execution Log + § Decisions DEC-4 row | low | — |
| `.github/PULL_REQUEST_TEMPLATE.md` | T4 | NEW (~70 lines) — adapted from superpowers (lift structure, drop frustration tone, add dev-flow DoD + ADR-016 skill rule + layer values) | low | — |
| `docs/adr/ADR-021-superpowers-patterns.md` | T4 | NEW (~110 lines) — 6-decision ADR (matcher / divergence / shim defer / acceptance harness / PR template lift / tests dir defer) | low | — |
| `docs/sprint/SPRINT-042-superpowers-patterns.md` | T4 | Execution Log + § Decisions DEC-5, DEC-6 rows | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 (T1) | SessionStart matcher reconciliation = **keep-superset** (`startup\|resume\|clear\|compact`); no change to dev-flow `hooks.json` | Extra `resume` matcher is harmless; covers session-resume signal coverage that align-down would lose; upstream PR out of scope | ADR-021 |
| DEC-2 (T1) | Document hook-surface divergence in research note: dev-flow has RICHER hook surface (3 hooks vs superpowers' 1) — PreToolUse chain-guard + PostToolUse codemap-refresh are dev-flow value-adds | Audit framing assumed dev-flow learns FROM superpowers; reality is bidirectional — record it for future re-diff cadence | ADR-021 |
| DEC-3 (T2) | DEFER `run-hook.ps1` shim adoption; no backlog task | superpowers shim solves cross-platform polyglot; dev-flow Windows-only per ADR-016. Direct-call simpler, fewer indirection layers, adequate at 3-hook scale. Re-eval if hook count >5 OR cross-platform reconsidered | ADR-021 |
| DEC-4 (T3) | Adopt skill-triggering acceptance harness pattern; 3-skill seed = `prime`, `orchestrator`, `tdd`; Mode A (manual); implementation deferred to TASK-116 | Pattern satisfies ADR-016 eval-evidence requirement for skill-description changes. Manual mode adequate at 3-skill scale; CI mode worthwhile if seed >10. Per Sprint 041 DEC-4 research-vs-implementation split | ADR-021 |
| DEC-5 (T4) | Lift `.github/PULL_REQUEST_TEMPLATE.md` from superpowers, adapted to dev-flow | Structure is good (problem → change → alternatives → rigor → review); tone is hostile (single-author repo) — drop frustration framing, keep checklist; add DoD + ADR-016 skill-change rule + sprint reference | ADR-021 |
| DEC-6 (T4) | DEFER `tests/` directory creation to TASK-116 implementation sprint | Empty directories don't survive git; first test files land WITH the skill-triggering harness; no value in empty scaffold now | ADR-021 |

---

## Open Questions for Review

*(Empty — populated for items surfaced during execution that need user decision.)*

---

## Retro

*(Empty — filled at close per Sprint Close Protocol.)*

### Worked
### Friction
### Pattern candidates (pending user confirm)
### Surprise log (cross-ref to Execution Log)
