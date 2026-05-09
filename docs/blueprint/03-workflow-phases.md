---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR version bump; new phase, gate, or workflow mode added
status: current
source: AI_WORKFLOW_BLUEPRINT.md §3 (split TASK-004)
---

# Blueprint §3 — Workflow Phases

```
Path A (structured input — TASK-NNN exists):
  PARSE → CLARIFY → [GATE 0] → DESIGN → [GATE 1] → IMPLEMENT → VALIDATE → TEST
    → [REVIEW ‖ SECURITY] → [GATE 2] → DOCS → COMMIT+PR → CI VERIFY → SESSION CLOSE

Path B (freeform input — description/instruction/assumption):
  INTENT → [TASK-DECOMPOSER + GATE 0 combined] → PARSE → DESIGN → [GATE 1] → IMPLEMENT
    → VALIDATE → TEST → [REVIEW ‖ SECURITY] → [GATE 2] → DOCS → COMMIT+PR → CI VERIFY → SESSION CLOSE

Path B skips the separate Clarify phase — task-decomposer performs its own Socratic
clarification during decomposition. Gate 0 is absorbed into the task-decomposer approval step.
```

## Phase Breakdown

| Phase | Who Runs It | What Happens | Output | Context Cost |
|:------|:-----------|:-------------|:-------|:------------|
| **0 Parse** | Orchestrator (main) | Read TODO.md, extract next task fields | Task context loaded | Tier 1 — cheap |
| **1 Clarify** | Orchestrator | Socratic single-question brainstorming until spec is fully chunked; offer 2-3 approaches with tradeoffs | Confirmed scope + constraints | Tier 1 — cheap |
| **GATE 0** | Human | Confirm scope, approach chosen, constraints, edge cases before Design agent runs | Locked scope + chosen approach | — |
| **2 Design** | Background agent | Explore codebase, propose implementation plan | Structured summary to orchestrator | Tier 3 — expensive |
| **GATE 1** | Human | Review design, approve or redirect | Approved plan | — |
| **3 Implement** | Inline (main) | Write code using skills | Code files created/modified | Tier 2 — medium |
| **4 Validate** | Inline (main) | Run typecheck + lint | Pass or hard stop | Tier 1 — cheap |
| **5 Test** | Inline (main) | TDD cycle: RED → verify failure → GREEN → verify pass → REFACTOR | Pass or hard stop | Tier 2 — medium |
| **6 Review** | Background agent (parallel) | 7-lens PR review | Tiered findings summary | Tier 3 — expensive |
| **7 Security** | Background agent (parallel) | Security audit | Tiered findings summary | Tier 3 — expensive |
| **GATE 2** | Human | Review combined findings (Review + Security), approve or iterate | Approved for commit | — |
| **8 Docs** | Inline skill (`/lean-doc-generator`) | WHY/WHERE docs only — DECISIONS.md ADR, ownership headers on every touched doc | Docs updated | Tier 2 — medium |
| **9 Commit+PR** | Inline (main) | Git commit + PR description | Commit created | Tier 1 — cheap |
| **10 Session Close** | Inline (main) | Extract session summary: docs delivered, ownership headers to verify, recommended next-session updates, corrections to promote | Session close report | Tier 1 — cheap |

> **Note on phases 6 + 7**: Review and Security run in parallel as two background agents spawned simultaneously. Gate 2 waits for both to complete before presenting aggregated findings to the human.
>
> **Note on phase 8**: Docs is driven by `/lean-doc-generator`. The skill enforces the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. If content explains HOW something works, it belongs in code comments, not docs.
>
> **Note on phase 10**: Session Close is mandatory and never skipped — even for `hotfix` mode. It takes less than 2 minutes and prevents doc drift across sessions.

## Context Cost Tiers

| Tier | Cost | Operations |
|:-----|:-----|:-----------|
| **Tier 1 — Cheap** | Low token impact | Text reads, short clarifications, lint/typecheck runs, git commands |
| **Tier 2 — Medium** | Moderate token impact | Inline skill execution, targeted file reads, test runs |
| **Tier 3 — Expensive** | High token impact | Background agent spawning, large codebase exploration, parallel agents |

**Rule**: Tier 3 operations must always be preceded by a human gate. Never spawn a background agent without a confirmed gate approval.

## Workflow Modes

| Mode | Gates | Safety Net | Use When |
|:-----|:------|:-----------|:---------|
| `init` | Gate A + Gate B + Gate C + Gate 1 + Gate 2 | Scope guard: no code before Gate B | Greenfield project — no repo, no architecture yet |
| `full` | Gate 0 + Gate 1 + Gate 2 | — | New features, cross-layer changes |
| `quick` | Gate 0 + Gate 2 | Scope guard (>3 files → force `full`) | Small bugs, single-file changes |
| `hotfix` | No gates | Rollback check + lint warn + incident ADR prompt | Production emergency only |
| `review` | Gate 2 only | Accepts PR number or file list — no TODO.md parse | Review-only pass on existing code or open PR |
| `resume` | Resumes at last incomplete micro-task | Gate re-runs if design plan not found | Interrupted session recovery |

> **`init` mode flow**: `DISCOVERY → ARCHITECTURE → INFRA → SPRINT 0` then hands off to `full` permanently.
> See **§16** for full INIT mode specification.
>
> **`quick` mode scope guard**: After Implement, if `git diff --name-only` shows more than 3 files
> changed, the orchestrator must stop and require explicit confirmation or upgrade to `full` mode.
>
> **`hotfix` safety net**: Orchestrator runs rollback readiness check + fast lint on changed files.
> Lint failures are warnings, not hard stops — but MUST be shown before commit. Auto-prompts for
> incident ADR after commit. See **§21** for full hardened hotfix specification.
>
> **`review` mode entry**: Invoked as `/dev-flow review [PR-number | file1 file2 ...]`.
> Skips Parse phase entirely. Loads changed files directly into Review + Security agents.
> Gate 2 aggregates findings. Docs phase runs if ADR is needed.
>
> **`resume` mode entry**: Invoked as `/dev-flow resume [TASK-NNN]`.
> Reads last approved design plan, finds first incomplete micro-task `[ ]`, resumes from there.
> If design plan is missing or corrupted → hard stop, re-run Gate 1 before proceeding.
