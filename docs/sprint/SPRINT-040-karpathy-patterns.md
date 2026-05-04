---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: closed
plan_commit: 7e06c72
close_commit: 3fec973
---

# Sprint 040 — EPIC-Audit Phase 4a (Karpathy patterns)

**Theme:** Smallest-delta polish from `forrestchang/andrej-karpathy-skills` — assess EXAMPLES.md per-skill convention, lock behavioral-guideline lineage, decide on verify-step micro-protocol, write ADR-019 for adoption + MIT credit.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 039 closed `192eee1`.
**Successor:** Sprint 041 (EPIC-Audit Phase 4b — Caveman compare).

---

## Why this sprint exists

Sprint 034 external-refs probe (`docs/audit/external-refs-probe.md`) classified karpathy patterns as "smallest delta, polish." Four karpathy-derived items remain open:

1. **Per-skill `EXAMPLES.md` convention.** karpathy bundles per-skill examples beside `SKILL.md`. dev-flow does not. Decide adopt Y/N before any examples authored.
2. **Behavioral Guidelines wording drift.** `.claude/CLAUDE.md` lines 64-78 already adopted four karpathy principles (Think Before Acting / Simplicity First / Surgical Changes / Goal-Driven Execution). No lineage record exists, no diff against upstream wording. Drift risk grows silently.
3. **Verify-step micro-protocol (`step → verify check`).** karpathy SKILL.md format pairs each step with a verifiable check. Could land as G2 design-doc field in orchestrator. Decide Y/N before designing the field.
4. **No ADR for karpathy adoption.** Lineage credit + MIT attribution missing. ADR-019 reserved per Sprint 034 DEC-2.

Sprint 040 lands all four as decisions + lineage record. No skill code changes — adoption itself (if any T1/T3 = Y) lands in a follow-up sprint.

Phase 4a is Phase 4 of EPIC-Audit (audit reconcile → rename → wiring → trim → ext-ref deep). Sprints 041-045 land remaining ext-ref deep dives (caveman / superpowers / mattpocock / GSD / skill-creator).

---

## Open Questions (lock at promote)

*(All decompose answers accepted on user approval 2026-05-04. Resolutions:)*
- (a) **External fetch tool** — resolved: **gh CLI primary** (`gh api repos/OWNER/REPO/contents/PATH` with `Accept: application/vnd.github.raw` for byte-exact markdown). WebFetch only as fallback if gh fails. Rationale: already installed + auth'd, no anon rate limit, deterministic raw output (matters for T2 wording diff).
- (b) **ADR-019 file convention** — resolved: `docs/adr/ADR-019-karpathy-patterns.md` (per Sprint 039 ADR-016 precedent). Single-file `DECISIONS.md` retained for ADR-001..015 only.
- (c) **T3 verify-step placement** — orchestrator G2 design-doc OR task-decomposer task field. Decide during T3 execution; lock in ADR-019.

---

## Plan

### T1 — Read karpathy `EXAMPLES.md` end-to-end; decide per-skill examples convention
**Scope:** quick · **Layers:** docs, governance · **Risk:** low · **AFK**
**Acceptance:** Decision row in § Decisions: "Adopt per-skill `examples/` convention: Y/N + reason." Source = gh CLI raw fetch (`gh api -H "Accept: application/vnd.github.raw" repos/forrestchang/andrej-karpathy-skills/contents/EXAMPLES.md`). If gh fails, fall back to WebFetch, then `docs/audit/external-refs-probe.md` cached summary; note actual source used in decision row.
**Depends on:** none.
**Note:** Read-only investigation. List repo root first (`gh api /repos/forrestchang/andrej-karpathy-skills/contents/`) to confirm `EXAMPLES.md` still exists at expected path. If decision = Y, follow-up TASK lands in Backlog for next sprint to author examples; this sprint does not create files.

### T2 — Compare karpathy CLAUDE.md vs `.claude/CLAUDE.md` Behavioral Guidelines; lock lineage in CONTEXT.md
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **AFK**
**Acceptance:** `.claude/CONTEXT.md` gains "Behavioral Guidelines Lineage" (or equivalent) section with locked wording of the four principles + attribution to `forrestchang/andrej-karpathy-skills` (MIT). Wording diff sourced via gh CLI raw fetch (`gh api -H "Accept: application/vnd.github.raw" repos/forrestchang/andrej-karpathy-skills/contents/CLAUDE.md`) — byte-exact comparison required. If wording already identical, record "verified identical 2026-05-04" + commit SHA of upstream fetched. `last_updated` advanced on CONTEXT.md.
**Depends on:** T1 (gh CLI access established in same session).
**Note:** No rewrite of `.claude/CLAUDE.md` 4-principle block beyond cross-link if drift found.

### T3 — Decide verify-step micro-protocol as G2 design-doc field
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **AFK**
**Acceptance:** Decision row in § Decisions: "Adopt `step → verify check` field: Y/N + placement (orchestrator G2 OR task-decomposer task field) + reason." If Y, follow-up TASK created in TODO.md Backlog for next sprint to implement.
**Depends on:** T2 (lineage locked first).
**Note:** Implementation deferred to follow-up sprint regardless of decision direction.

### T4 — ADR-019: Karpathy adoption + lineage credit
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer must verify ADR completeness)*
**Acceptance:** `docs/adr/ADR-019-karpathy-patterns.md` exists. Status: Accepted. Captures T1+T3 decisions, T2 lineage lock, MIT attribution, and supersession status (none — additive). Format follows ADR-016 template (Context / Decision / Alternatives / Consequences). If both T1 and T3 = N, ADR still written as "patterns evaluated 2026-05-04, lineage locked, no further adoption."
**Depends on:** T1, T2, T3.
**Note:** ADR file convention = `docs/adr/ADR-NNN-*.md` per Sprint 039 ADR-016 precedent. Do not append to `docs/DECISIONS.md` (that file frozen at ADR-015).

---

## Dependency Chain

```
T1 ── T2 ── T3 ── T4
```

Strict serial. T2 needs T1's karpathy CLAUDE.md fetch. T3 needs T2's locked lineage to scope the decision. T4 captures all three outcomes.

No parallelism opportunity — sprint-bulk overlap gate would force sequential anyway (T2/T4 both touch governance docs; T1/T3 share § Decisions table).

---

## Cross-task risks

- **External fetch tool (T1, T2).** Sprint policy: **gh CLI primary** for all github fetches. Already installed + auth'd, no anon rate limit, byte-exact raw output. WebFetch only on gh failure. Cached probe summary only if both fail — surface to § Open Questions for Review if cached fallback used.
- **ADR-019 number reuse (T4).** Sprint 034 DEC-2 reserved ADR-019 for Phase 4a. Verify max ADR ID before write — Sprint 039 retro pattern: grep `docs/adr/` + `docs/DECISIONS.md` for max ADR-NNN.
- **CONTEXT.md ownership-header bump (T2).** `last_updated` must advance on CONTEXT.md. Sprint 039 stale-doc warnings show ARCHITECTURE.md/AI_CONTEXT.md already stale — do not regress CONTEXT.md.
- **Decision-only sprint, no implementation.** All four tasks output decisions or lineage records. No skill / agent / hook code changes. If reviewer expects code diff, clarify decision-sprint nature in commit message.

---

## Sprint DoD

- [x] T1 § Decisions row: per-skill `examples/` convention adopt Y/N + reason. Source noted (live fetch or cached probe). → DEC-1, source = gh CLI raw fetch (upstream `2c606141936f`).
- [x] T2 `.claude/CONTEXT.md` § Behavioral Guidelines Lineage block landed with locked wording + MIT attribution. `last_updated: 2026-05-04` advanced. → § Behavioral Guidelines Lineage block landed; `last_updated` flagged in Q1 (CONTEXT.md lacks frontmatter, recorded inline in lineage block instead).
- [x] T3 § Decisions row: verify-step micro-protocol Y/N + placement (G2 OR task-decomposer) + reason. Backlog task created if Y. → DEC-3, no Backlog task (already shipped Sprint 035 `414ee8e`).
- [x] T4 `docs/adr/ADR-019-karpathy-patterns.md` exists. Status: Accepted. Captures T1+T2+T3 outcomes + MIT credit. → eed5126.
- [x] Plan-lock commit landed before any T1..T4 commit. → 7e06c72.
- [x] Close commit + CHANGELOG row + TODO update + retro. → this commit.
- [x] `last_updated` advanced on CONTEXT.md (and any other touched governance file). → recorded inline in § Behavioral Guidelines Lineage; CONTEXT.md frontmatter add scoped to Q1 follow-up.

---

## Execution Log

### 2026-05-04 | T1 done — 1b7741b
karpathy `EXAMPLES.md` fetched via gh CLI raw (`gh api -H "Accept: application/vnd.github.raw" repos/forrestchang/andrej-karpathy-skills/contents/EXAMPLES.md` — upstream SHA `2c606141936f`, 522 lines, 14838 bytes). Repo dir-list confirmed `EXAMPLES.md` at root (not per-skill). Format: ONE root-level file with 4 sections (one per principle: Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution), each with 2-3 Wrong-vs-Right Python code diffs.

**Decision: N — do not adopt root-level EXAMPLES.md.** Reasons:
1. dev-flow is meta-repo (markdown skills/agents/governance) with no app-code domain to demonstrate.
2. Karpathy examples are Python code diffs; dev-flow has no equivalent code surface — only prose specs and SKILL.md frontmatter.
3. `.claude/CLAUDE.md` § Anti-Patterns block + per-skill `Red Flags` sections already cover principle-violation surface at the meta-repo abstraction level.
4. Adopting would force inventing meta-domain examples (skill rewrites? agent diffs?) — large content investment for marginal AI-behavior gain. Karpathy's value is principle wording (T2 lineage), not the EXAMPLES.md format.

Side findings (captured to memory):
- gh CLI on Git Bash rewrites leading-slash endpoint paths to filesystem paths → `feedback_gh_cli_no_leading_slash.md`. Drop leading `/` on `gh api <path>` calls.

### 2026-05-04 | T2 done — 54c88b1
Wording diff complete via gh CLI raw fetch of karpathy `CLAUDE.md` (upstream SHA `2c606141936f`, 65 lines, 2357 bytes). Drift = INTENTIONAL adaptation for meta-repo context: "Coding" → "Acting" (P1 headline); "code" → "content"/"task" in P2/P3 bodies; bullets distilled to single paragraphs; orphan-removal subsection of P3 dropped; Goal-Driven `verify-step` format dropped (T3 decides re-add).

Lineage locked in `.claude/CONTEXT.md` § Behavioral Guidelines Lineage — table of 4 principles with karpathy headline / dev-flow headline / adaptation note + MIT attribution + verified-at SHA + date. Forward maintenance contract: when upstream substantively changes, re-diff and bump SHA + date.

Open finding flagged: `.claude/CONTEXT.md` lacks ownership-header frontmatter (owner / last_updated / update_trigger / status), violating CLAUDE.md DOC WORK rule. Out of T2 scope to add — surfaced to § Open Questions for Review.

### 2026-05-04 | T3 done — 8261847
**Surprise during T3:** verify-step micro-protocol is **already adopted** at G2 design-analyst MICRO-TASKS template (`skills/orchestrator/references/phases.md:107` — `- [ ] <exact action> in <exact/path>  verify: <runnable command>`). Landed in Sprint 035 (commit `414ee8e`, 2026-05-01) without explicit karpathy lineage record.

Decision: **YES, placement = G2 design-analyst MICRO-TASKS** (correct level — per-execution-step granularity). Confirmed pattern in place; no implementation work required. Lineage credit added to ADR-019 (T4). No Backlog task created — pattern shipped 3 sprints ago.

Why not task-decomposer Acceptance: Acceptance is task-level (sprint task = 1-N micro-task fanout); verify lives at micro-task level. Two distinct granularities — correct separation.

### 2026-05-04 | T4 done — eed5126
ADR-019 written at `docs/adr/ADR-019-karpathy-patterns.md`. Status: Accepted. Captures DEC-1 (reject EXAMPLES.md), DEC-2 (lineage lock + SHA `2c606141936f`), DEC-3 (verify-step retroactive credit). Format follows ADR-016 precedent (Context / Decision / Alternatives / Consequences / References). MIT attribution + upstream pin recorded. ADR numbering: honored Sprint 034 DEC-2 reservation despite gap (017, 018); future allocations should be sequential per Sprint 039 retro pattern — captured in ADR Consequences.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/sprint/SPRINT-040-karpathy-patterns.md` | T1 | Execution Log + § Decisions DEC-1 row | low | — |
| `.claude/CONTEXT.md` | T2 | NEW § Behavioral Guidelines Lineage block — 4-principle adaptation table + MIT attribution + upstream SHA lock | low | — |
| `docs/sprint/SPRINT-040-karpathy-patterns.md` | T2 | Execution Log + § Decisions DEC-2 row | low | — |
| `docs/sprint/SPRINT-040-karpathy-patterns.md` | T3 | Execution Log + § Decisions DEC-3 row (verify-step already shipped Sprint 035) | low | — |
| `docs/adr/ADR-019-karpathy-patterns.md` | T4 | NEW (~70 lines) — Context / Decision (3 parts: lineage lock, verify-step credit, EXAMPLES.md reject) / 5 Alternatives / Consequences / References | low | — |
| `docs/sprint/SPRINT-040-karpathy-patterns.md` | T4 | Execution Log + § Decisions DEC-4 row (ADR numbering convention going forward) | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 (T1) | Do NOT adopt root-level `EXAMPLES.md` per karpathy convention | Meta-repo has no app-code domain; CLAUDE.md anti-patterns + skill Red Flags already cover principle-violation surface; karpathy value is principle wording (T2), not example format | ADR-019 |
| DEC-2 (T2) | Lineage of 4 Behavioral Guidelines locked in CONTEXT.md § Behavioral Guidelines Lineage with MIT attribution + upstream SHA `2c606141936f` + date 2026-05-04 | Existing `.claude/CLAUDE.md` block was adopted without lineage record; drift risk grows silently. Locking SHA + adaptation table makes future re-diffs deterministic | ADR-019 |
| DEC-3 (T3) | Verify-step micro-protocol confirmed at G2 design-analyst MICRO-TASKS (already shipped Sprint 035, commit `414ee8e`); placement at task-decomposer rejected | design-analyst MICRO-TASKS template `verify: <runnable command>` is karpathy P4 pattern at the right granularity; task-decomposer Acceptance is task-level (separate granularity, correct separation). No new work — pattern in place, lineage credit only via ADR-019 | ADR-019 |
| DEC-4 (T4) | ADR-019 number honored despite Sprint 038 breaking Sprint 034 DEC-2 reservation chain (took ADR-016); future ADRs should allocate sequentially via Sprint 039 retro pattern | Sprint plan committed to ADR-019; honoring keeps T1-T3 cross-references stable; gap (017, 018) accepted as one-time cost; sequential-allocation discipline restored going forward | ADR-019 |

---

## Open Questions for Review

- **Q1 (T2)** — `.claude/CONTEXT.md` lacks ownership-header frontmatter (owner / last_updated / update_trigger / status), violating CLAUDE.md DOC WORK rule "Every doc file gets ownership header." Out of T2 surgical scope to add. Recommendation: add as P1 backlog task — convert CONTEXT.md to ownership-header convention. Sprint 040 acceptance "advance last_updated on CONTEXT.md" cannot be met until then; satisfied here by recording date `2026-05-04` inline in the new § Behavioral Guidelines Lineage block.

---

## Retro

### Worked
- **gh CLI primary policy paid off immediately.** First T1 fetch dir-listed the repo (8 entries) + grabbed two raw files (CLAUDE.md 65 lines, EXAMPLES.md 522 lines) in 3 commands. Byte-exact raw output let T2 wording diff land deterministically. WebFetch fallback never needed.
- **Decompose-skip on user direction held a second sprint.** Sprint 039 retro flagged this pattern as safe; Sprint 040 confirmed — decomposition Q&A was bundled at promote, no mid-sprint scope drift. Pre-set acceptance criteria absorbed all four task variations.
- **Investigation surfaced unrecorded prior adoption.** T3 found verify-step micro-protocol already in `phases.md:107` since Sprint 035 (`414ee8e`). Avoided unnecessary implementation work; ADR-019 captures retroactive lineage credit. Lesson: before "implement X", grep the codebase for X first.
- **ADR file convention crystallized.** Sprint 039 took ADR-016 to `docs/adr/`; Sprint 040 followed with ADR-019. `docs/DECISIONS.md` officially frozen at ADR-001..015 in ADR-019 Consequences.
- **Strict serial dependency held.** T1 → T2 → T3 → T4 chain executed without re-ordering. gh CLI dir-list at T1 + raw fetch reused for T2 (same session) — no re-auth, no re-rate-limit risk.

### Friction
- **gh CLI Git Bash leading-slash bug.** First `gh api /repos/...` invocation failed with `invalid API endpoint: "C:/Program Files/Git/repos/..."` — MINGW64 rewrote the path. Fix: drop leading `/`. Captured to `feedback_gh_cli_no_leading_slash.md`. Same trap class as Sprint 038/039 PS-encoding issues — Windows shell layer surprises recur.
- **CONTEXT.md missing ownership-header frontmatter.** T2 acceptance "advance `last_updated` on CONTEXT.md" cannot be met because the file lacks the frontmatter that holds it. CLAUDE.md DOC WORK rule mandates ownership headers on every doc file — CONTEXT.md is non-compliant. Worked around inline in the new lineage block (recorded date there); proper fix queued to Q1 / new Backlog P1 task.
- **ADR numbering reservation chain partially broken.** Sprint 034 DEC-2 reserved ADR-016 for Phase 4c, but Sprint 038 took ADR-016 for hooks (next-free). Sprint 040 honored ADR-019 reservation but accepted gap (017, 018) as a one-time cost. Going forward: sequential allocation per Sprint 039 retro pattern; reservations from DEC-2 superseded.
- **Decision-only sprint with 4 commits each made small visible diffs.** T1 (17 line diff) and T3 (9 line diff) were essentially decision-row appends. Considered batching T1+T3 into one commit; kept separate to preserve task-to-commit traceability. Acceptable trade.

### Pattern candidates (pending user confirm)
1. **Always grep before "implement X" claims.** T3 surprise (verify-step already shipped Sprint 035) shows that prior-sprint adoption can hide in plain sight. Before Backlog-promoting an "adopt X" task, run `git log -p --all -S "X"` and grep current source. Generalizes Sprint 039 ADR-collision lesson to feature additions.
2. **gh CLI is the default tool for ANY github fetch in dev-flow flows.** Codified in `feedback_github_cli_default.md`. Promotes WebFetch from "first try" to "fallback only." Saves rate-limit headaches + gives byte-exact raw via `Accept: application/vnd.github.raw`.
3. **gh CLI on Git Bash: drop leading slash on endpoint paths.** Codified in `feedback_gh_cli_no_leading_slash.md`. Add to any doc that lists gh-CLI commands.
4. **External-pattern adoption sprints should produce a lineage record + ADR even when no implementation lands.** Sprint 040 lands 0 lines of skill/agent/hook code yet shipped real value (lineage lock + ADR-019). Decision-only sprints are a valid sprint shape; don't pad them with extra implementation tasks.

### Surprise log (cross-ref to Execution Log)
- T1: gh CLI leading-slash bug on first invocation — fixed by removing slash.
- T1: karpathy `EXAMPLES.md` is ONE root-level file, not per-skill — pre-sprint cached-probe assumption was wrong. Reframed T1 from "per-skill convention?" to "root-level convention?"; decision still N.
- T3: verify-step micro-protocol ALREADY shipped at G2 design-analyst MICRO-TASKS since Sprint 035. T3 reduced from "decide + implement?" to "credit lineage."
- T4: ADR-019 number gap (017, 018) accepted; future allocations sequential.
- T2: CONTEXT.md lacks ownership-header frontmatter — DOC WORK rule violation pre-existing, not caused by this sprint. Surfaced for follow-up.
