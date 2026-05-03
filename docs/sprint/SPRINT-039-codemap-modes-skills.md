---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-03
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: 678f513
close_commit: <pending>
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

*(empty — append `### YYYY-MM-DD HH:MM | T<N> done — <sha>` blocks during execution.)*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|

*(empty — populate during execution; one row per file touched, not per edit.)*

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|

*(empty — append DEC-N rows for architectural-level decisions during execution.)*

---

## Open Questions for Review

*(none at promote — surface during execution.)*

---

## Retro

*(empty — fill at close: Worked / Friction / Pattern candidates / Surprise log.)*
