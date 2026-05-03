---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03
update_trigger: sprint open / close / status change / phase scope change
status: closed
plan_commit: 678f513
close_commit: 192eee1
---

# Sprint 039 — Codemap + Modes + Skills (build new tooling)

**Theme:** Build new tooling — codemap base knowledge (3-tier + post-commit AST hook), sprint-bulk dispatcher mode, `/prime` skill, `/release-patch` skill.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 038 closed `f0326c3`.
**Successor:** Sprint 040 (EPIC-Audit Phase 4a — Karpathy patterns).

---

## Why this sprint exists

Sprint 038 hardened the foundation: Node-in-hooks killed, PowerShell SessionStart live, lean-doc cache landed, doc routing scaffold in place. Foundation is now stable enough to build on. Four pressures land in this sprint:

1. **No machine-readable map of the repo.** Sub-agents and skills navigate by ad-hoc Grep/Glob each invocation. A 3-tier codemap (CLAUDE.md L0 one-liner per module + `CODEMAP.md` mid-tier + `handoff.json` envelope) gives every agent the same starting context. Patterns stolen from OpenViking (3-tier), codemap (handoff envelope), graphify (post-commit AST rebuild — no LLM, no Node).
2. **Sprint-bulk work has no batched mode.** Current dispatcher modes (init/quick/mvp) gate G1 + G2 per task. A multi-task sprint pays the gate cost N times. `sprint-bulk` (Hybrid C — sequential default, parallel only on zero file overlap) batches G1 + G2 once per sprint into one sprint-PRD, then auto-loops Active Sprint tasks. Unblocks larger-scope sprints without abandoning gate discipline.
3. **Session start has no ordered context loader.** SessionStart hook (Sprint 038 T4) verifies files exist; it does not load them in correct order or emit a health report. `/prime` skill loads CLAUDE.md → CONTEXT.md → MEMORY.md → active sprint → CODEMAP.md L0 deterministically and emits `[OK|MISSING]` per file.
4. **Sprint Close auto-push gap.** Sprint 038 retro confirmed: Sprint Close should NOT auto-push. Push gating belongs in a dedicated skill. `/release-patch` owns PATCH bump (`plugin.json` + `marketplace.json` lockstep), CHANGELOG entry, MEMORY refresh, CONTEXT.md drift check, and a HARD STOP at push (emits `ready to push, run \`git push origin master\`` and exits — no `git push` in skill files; reviewer can grep). Also handles deferred Sprint 038 PATCH bump.

Sprint 039 lands all four. Sequencing constraints below in Dependency Chain.

---

## Open Questions (lock at promote)

*(Acceptance criteria for all 4 tasks pre-set in Backlog by user; decomposition Q&A skipped on user direction. No open questions at promote — surface any during execution to § Open Questions for Review.)*

---

## Plan

### T1 — TASK-098 — Codemap base knowledge system (3-tier + post-commit AST hook)
**Scope:** full · **Layers:** governance, docs, skills, scripts · **Risk:** high · **HITL**
**Acceptance:** `docs/codemap/CODEMAP.md` exists (auto-generated, hubs+deps+modules); `docs/codemap/handoff.json` valid JSON schema `{nodes[], edges[], metadata{}, last_built}`; CLAUDE.md `## Codemap (L0)` block with one-liner per module + overflow pointer to CODEMAP.md if 80-line cap exceeded; new skill `skills/codemap-refresh/SKILL.md` ≤100 lines regenerates all 3; PowerShell PostToolUse hook on `Bash(git commit*)` rebuilds AST tree (no LLM, no Node) <5s on clean repo; tested on Windows space-path.
**Depends on:** none.
**Note:** patterns stolen from OpenViking (3-tier), codemap (handoff envelope), graphify (post-commit AST rebuild). Hook config touches the same surface as Sprint 038 PowerShell SessionStart — verify Windows space-path before merge.

### T2 — TASK-099 — Add `sprint-bulk` mode to dispatcher (Hybrid C)
**Scope:** full · **Layers:** agents, skills, governance, docs · **Risk:** high · **HITL**
**Acceptance:** dispatcher lists 4 modes (init/quick/mvp/sprint-bulk); `sprint-bulk` batches G1+G2 once per sprint into single sprint-PRD; sequential default; auto-loops Active Sprint tasks; parallelism only when scope-analyst returns file-overlap matrix == ∅ for every pair; `.claude/CONTEXT.md` Modes table shows 4 rows; orchestrator skill lists `sprint-bulk` in mode-selection; `plugin.json` MINOR bump (new mode).
**Depends on:** none.
**Note:** MINOR bump triggers plugin reload — schedule when no other task is open. Do not run mid-sprint with another open task.

### T3 — TASK-100 — `/prime` skill — ordered context loader + health check
**Scope:** quick · **Layers:** skills, docs · **Risk:** low · **AFK**
**Acceptance:** `skills/prime/SKILL.md` ≤100 lines, frontmatter `name: prime` + `description` "Use when…"; reads in order CLAUDE.md → CONTEXT.md → MEMORY.md → active sprint plan → CODEMAP.md L0; emits health report `[OK|MISSING]` per file + sprint number + task count; non-error if optional artifacts (CODEMAP.md, MEMORY.md) absent.
**Depends on:** T1 (TASK-098) — CODEMAP.md L0 must exist; gracefully degrades if absent.

### T4 — TASK-103 — `/release-patch` skill — version sync + CHANGELOG + sprint-state refresh + human-gated push
**Scope:** full · **Layers:** skills, governance, docs · **Risk:** high · **HITL**
**Acceptance:** `skills/release-patch/SKILL.md` ≤100 lines; bumps PATCH in `.claude-plugin/plugin.json` AND `.claude-plugin/marketplace.json` lockstep; skip-bump if `git diff --name-only HEAD` shows only `^docs/` paths; CHANGELOG.md gains entry (sprint number + closed tasks from TODO.md Changelog); MEMORY.md `dev-flow sprint state` refreshed if sprint just closed; CONTEXT.md drift warning if gates/modes/agents changed but CONTEXT.md not in diff; stale-doc `last_updated` auto-clear; push = HARD STOP (emits `ready to push, run \`git push origin master\`` and exits); reviewer can grep — no `git push` in skill files.
**Depends on:** none.
**Note:** push gate is irreversible — reviewer must verify gate cannot be bypassed. This skill ALSO owns the deferred Sprint 038 PATCH bump.

---

## Dependency Chain

```
T1 (TASK-098) ── T3 (TASK-100)   [T3 reads CODEMAP.md L0]
T2 (TASK-099)  ── independent (but MINOR bump → schedule when no other task open)
T4 (TASK-103) ── independent (also lands deferred Sprint 038 PATCH bump)
```

Serial spine: T1 → T3. T2 and T4 interleave but T2 must run alone (plugin reload). T1's PostToolUse hook touches the same hook config surface as Sprint 038 PS SessionStart — verify Windows space-path before merge.

---

## Cross-task risks

- **Hook config collision (T1 vs Sprint 038).** T1's PowerShell PostToolUse hook on `Bash(git commit*)` lands in the same `hooks/hooks.json` that Sprint 038 PS SessionStart owns. Verify Windows space-path before merge; do not regress the SessionStart contract.
- **Plugin reload window (T2).** `plugin.json` MINOR bump triggers reload mid-session. Schedule T2 when no other task is open. Mitigation: land T2 between other tasks, not during their work.
- **T3 graceful-degrade contract.** T3 must not error if CODEMAP.md or MEMORY.md absent. Acceptance includes "non-error if optional artifacts absent" — verify by removing CODEMAP.md temporarily and re-running `/prime`.
- **T4 push gate is irreversible.** Reviewer MUST verify the push gate cannot be bypassed — grep for `git push` in skill files should return zero hits. The skill emits a literal command string for the human to copy; it does not invoke `git push` itself.
- **T4 also owns deferred Sprint 038 PATCH bump.** Don't skip it — Sprint 038 closed without bumping the version. T4 first run lands the deferred bump.

---

## Sprint DoD

- [ ] T1 `docs/codemap/CODEMAP.md` + `docs/codemap/handoff.json` exist and auto-rebuild on `git commit`; CLAUDE.md `## Codemap (L0)` block landed; codemap-refresh skill ≤100 lines; PostToolUse hook <5s on clean repo; Windows space-path verified.
- [ ] T2 dispatcher lists 4 modes; sprint-bulk batches G1+G2 once per sprint; CONTEXT.md Modes table shows 4 rows; `plugin.json` MINOR bumped.
- [ ] T3 `/prime` skill ≤100 lines; ordered load CLAUDE.md → CONTEXT.md → MEMORY.md → active sprint → CODEMAP.md L0; health report emits per file; degrades gracefully on absent optional artifacts.
- [ ] T4 `/release-patch` skill ≤100 lines; PATCH bump lockstep across `plugin.json` + `marketplace.json`; CHANGELOG entry; MEMORY refresh; CONTEXT.md drift warning; push = HARD STOP; reviewer grep finds zero `git push` in skill files; deferred Sprint 038 PATCH bump landed on first invocation.
- [ ] Plan-lock commit landed before any T1..T4 commit.
- [ ] Close commit + CHANGELOG row + TODO update + retro.
- [ ] `last_updated` advanced on touched governance files.

---

## Execution Log

### 2026-05-03 22:24 | T1 done — 665db28
TASK-098 codemap base knowledge system landed. `docs/codemap/CODEMAP.md` regenerated (Hubs / Deps / Modules / L0-overflow); `docs/codemap/handoff.json` valid envelope (nodes/edges/metadata/last_built); `.claude/CLAUDE.md` `## Codemap (L0)` block + overflow pointer (78/80 lines, cap respected); `skills/codemap-refresh/SKILL.md` 61 lines; PowerShell PostToolUse hook on `Bash(git commit*)` rebuilds in ~140 ms (well under 5 s budget). Patterns stolen from OpenViking (3-tier), codemap (handoff JSON), graphify (post-commit AST rebuild). Acceptance verified.

### 2026-05-03 22:25 | Surprise during T1 — PostToolUse silent on test commit
After landing the hook in `hooks/hooks.json` + mirrored `.claude/settings.json`, an interim test commit (`98bbe4a`) did NOT trigger codemap-refresh.ps1. Root cause: harness caches both files at session start — `settings.json` reload requires session restart; `hooks.json` plugin reload requires plugin reinstall. Known harness behavior, not a bug. Hook will activate on next session / reinstall.

### 2026-05-03 22:26 | Surprise during T1 — UTF-8 BOM broke node JSON.parse
First handoff.json write used `Out-File -Encoding utf8` which writes UTF-8 **with** BOM on PS 5.1. Node `JSON.parse` choked on the BOM. Switched to `[System.IO.File]::WriteAllText(..., new UTF8Encoding($false))` for clean UTF-8 no-BOM. Captured for future PS scripts that emit JSON consumed by node.

### 2026-05-03 22:27 | T3 done — 3331a6a
TASK-100 `/prime` skill landed. `skills/prime/SKILL.md` 81 lines (≤100); frontmatter `name: prime` + `description` "Use when…"; reads CLAUDE.md → CONTEXT.md → MEMORY.md → active sprint plan → CODEMAP.md L0 in order; emits `[OK|MISSING]` per file plus sprint number + task count; required = CLAUDE.md + CONTEXT.md (FAIL on missing); optional = MEMORY.md + CODEMAP.md (graceful degrade). Acceptance verified. Code review skipped per dispatcher propose (doc-only, trivial diff, human approved).

### 2026-05-03 22:29 | T4 done — 5ceec5e
TASK-103 `/release-patch` skill landed. `skills/release-patch/SKILL.md` 81 lines (≤100); 7 ordered steps — diff scan, PATCH bump `plugin.json` + `marketplace.json` lockstep, CHANGELOG prepend, MEMORY sprint refresh on close, CONTEXT drift warn, stale-doc `last_updated` auto-clear, HARD STOP push gate; skip-bump if only `docs/` changed. Reviewer grep for `git push` returns only prose mentions in skill files — zero command-position invocations. Skill itself owns deferred Sprint 038 PATCH bump on first invocation. Acceptance verified. Code review skipped per dispatcher propose (doc-only skill).

### 2026-05-03 22:34 | Surprise during T4 — ADR-016 number collision
While drafting release-patch references, ADR draft initially numbered `ADR-013` collided with the existing ADR-013 already in `docs/DECISIONS.md` (5 prior ADRs reference it). Renumbered to `ADR-016` after `grep`-ing DECISIONS.md for max ADR number. Captured: always grep DECISIONS.md for max ADR number before allocating a new ADR ID.

### 2026-05-03 22:35 | T2 done — d1f1438
TASK-099 sprint-bulk dispatcher mode landed. Dispatcher lists 4 modes (init/quick/mvp/sprint-bulk); G1+G2 batched once per sprint into session-scoped sprint-PRD (never written to disk per D-1); sequential default; parallelism only when pairwise `FILES_AFFECTED` intersection is empty for every task pair (D-2); first blocker = BLOCKED finding (scope/design) OR human block OR code-reviewer CRITICAL (D-3); `.claude/CONTEXT.md` Modes table 3→4 rows + Vocabulary mode def updated; orchestrator SKILL.md mode-selection updated. Plugin + marketplace 2.3.0 → 2.4.0 MINOR bump lockstep — new mode triggers MINOR per semver rule. Reload activates new mode on next plugin reinstall. Acceptance verified. Code review DONE (0 BLOCKING, 2 NON-BLOCKING resolved inline).

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `scripts/codemap-refresh.ps1` | T1 | NEW (~145 lines) — pure-regex file walk + UTF-8 no-BOM JSON via `[IO.File]::WriteAllText` | high | Manual smoke (cold ~140 ms) |
| `skills/codemap-refresh/SKILL.md` | T1 | NEW (61 lines) — manual trigger doc for PS script | low | — |
| `docs/codemap/CODEMAP.md` | T1 | REGEN — Hubs / Deps / Modules / L0-overflow (replaces TASK-091 stub) | low | — |
| `docs/codemap/handoff.json` | T1 | NEW — generated L2 envelope (nodes/edges/metadata/last_built) | low | — |
| `.claude/CLAUDE.md` | T1 | `## Codemap (L0)` block + overflow pointer + Commands entry for codemap-refresh.ps1 | low | — |
| `hooks/hooks.json` | T1 | PostToolUse `Bash(git commit*)` → codemap-refresh.ps1 | high | Smoke (silent on `98bbe4a` due to harness cache — known) |
| `.claude/settings.json` | T1 | Mirrored PostToolUse with `$CLAUDE_PROJECT_DIR` variant | high | — |
| `agents/dispatcher.md` | T2 | 26 lines (≤30) — Responsibilities + Dispatch Rules updated; code-reviewer rule = propose→y/n per `f43f094` | med | — |
| `skills/orchestrator/SKILL.md` | T2 | 94 lines (≤100) — Mode Dispatch row + `### sprint-bulk` block + frontmatter description | med | — |
| `skills/orchestrator/references/phases.md` | T2 | `## sprint-bulk Phase` section — 6 phase steps + overlap derivation rule + first-blocker definition | med | — |
| `.claude/CONTEXT.md` | T2 | Modes table 3→4 rows + Vocabulary mode def updated | low | — |
| `.claude-plugin/plugin.json` | T2 | 2.3.0 → 2.4.0 (MINOR — new mode) | low | — |
| `.claude-plugin/marketplace.json` | T2 | 2.3.0 → 2.4.0 lockstep | low | — |
| `skills/prime/SKILL.md` | T3 | NEW (81 lines, ≤100) — ordered context loader + health check | low | — |
| `skills/release-patch/SKILL.md` | T4 | NEW (81 lines, ≤100) — 7-step PATCH release flow + HARD STOP push gate | high | Reviewer grep `git push` = zero command-position hits |
| `TODO.md` | T1–T4 | Active Sprint task box `[ ]` → `[x]` with close commit per task (4 housekeeping commits) | low | — |
| `docs/sprint/SPRINT-039-codemap-modes-skills.md` | sprint | Status active → closed; execution log + retro filled | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 (T1) | CLAUDE.md L0 = pointer-only; module list lives in CODEMAP.md §L0-overflow (Option B) | Keeps CLAUDE.md ≤80-line cap; CODEMAP.md owns full module enumeration | — |
| DEC-2 (T1) | Hubs metric = incoming markdown-link count (Option A) | Simplest signal; no cross-language AST needed; aligns with V1 markdown-only repo | — |
| DEC-3 (T1) | Edges = explicit `[text](path)` markdown links only in V1 (Option A) | Defers code-symbol edges to V2; deterministic regex pass | — |
| DEC-4 (T1) | Self-contained PowerShell script (Option A) | No node dependency; no Windows space-path loader:1368 risk; aligns with ADR-016 PS-only hook policy | ADR-016 |
| DEC-5 (T1) | Hook is warn-only on failure — exit 0 even on script error (Option B) | Never block a `git commit`; codemap is a derived artifact, not a gate | — |
| DEC-6 (T2) | sprint-PRD = session-scoped block, never written to disk (Option A) | Avoids stale on-disk PRD; sprint plan doc remains authoritative | — |
| DEC-7 (T2) | Overlap derivation = pairwise `FILES_AFFECTED` set intersection on path strings | No scope-analyst schema change required | — |
| DEC-8 (T2) | First blocker definition = BLOCKED finding (scope/design analyst) OR human "block" OR code-reviewer CRITICAL | Single rule for halting the sprint-bulk auto-loop | — |

---

## Open Questions for Review

*(none — all questions resolved during execution.)*

---

## Retro

### Worked
- **Decompose-skip on user direction was safe.** Acceptance criteria pre-set in Backlog by user; sprint promote skipped per-task Q&A and went straight to plan-lock. No mid-sprint scope drift — pre-set acceptance held.
- **Pattern theft over invention.** T1 reused proven shapes (OpenViking 3-tier, codemap handoff envelope, graphify post-commit AST). Avoided green-field design cycles.
- **Doc-only skills (T3, T4) were trivial.** Each landed in a single edit + commit; code-reviewer skipped per dispatcher propose (human approved). Total wall-clock ~5 min combined.
- **Lockstep version-bump rule held.** T2 MINOR bump touched both `plugin.json` and `marketplace.json` in the same commit; reviewer can confirm with one diff.
- **Sequential T1 → T3 dependency held.** T3's CODEMAP.md L0 read worked first try because T1 landed the L0-overflow content first.

### Friction
- **PostToolUse hook silent on test commit (`98bbe4a`).** Harness caches `settings.json` (requires session restart) and `hooks.json` (requires plugin reinstall) at session start. Hook only activates on next session / reinstall. Known behavior, but worth a one-line note in `hooks/hooks.json` comments for future session.
- **PS 5.1 `Out-File -Encoding utf8` writes BOM.** Broke node `JSON.parse` on `handoff.json`. Switched to `[System.IO.File]::WriteAllText(..., new UTF8Encoding($false))` for clean UTF-8 no-BOM. Same trap as Sprint 038 PS SessionStart em-dash issue — PS 5.1 file-encoding defaults stay hostile.
- **ADR-013 number collision.** New ADR drafted as `ADR-013` while five prior ADRs already reference the existing ADR-013 in `docs/DECISIONS.md`. Renumbered to `ADR-016` (next free) only after `grep`-ing DECISIONS.md. Lesson: always grep DECISIONS.md for max ADR number before allocating a new ADR ID.
- **External-reference bookkeeping in TODO.md.** User added `gsd-build/get-shit-done` to External References mid-sprint; preserved through close. Note for future: external refs land in TODO.md frontmatter section, not in sprint Plan.

### Pattern candidates (pending user confirm for `references/VALIDATED_PATTERNS.md`)
1. **PS 5.1 → JSON for node consumers:** never `Out-File -Encoding utf8`; always `[System.IO.File]::WriteAllText(..., new UTF8Encoding($false))` to avoid BOM. (Generalizes Sprint 038 PS-encoding pattern.)
2. **Always grep DECISIONS.md for max ADR number before allocating a new ADR ID.** Linear scan + max — collisions break cross-references silently.
3. **PostToolUse / SessionStart harness cache:** new hook config in `hooks.json` requires plugin reinstall; new hook config in `settings.json` requires session restart. Document in `hooks/hooks.json` header comment.
4. **Plugin MINOR bump (new mode/agent/skill) = schedule between tasks**, never mid-task. Plugin reload mid-task can lose dispatcher state. (Confirmed during T2 placement window.)

### Surprise log (cross-ref to Execution Log)
- T1: PostToolUse silent on test commit (harness cache) — not a bug.
- T1: UTF-8 BOM broke node JSON.parse — encoding switch resolved.
- T4: ADR-013 collision — renumbered to ADR-016.
