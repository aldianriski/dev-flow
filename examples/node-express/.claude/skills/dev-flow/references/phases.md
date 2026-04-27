# dev-flow Phase Checklists

Full detail for Phases 0–10. Loaded on demand from `dev-flow/SKILL.md`.

---

## Phase Markers (orchestrator-managed)

`read-guard.js` blocks Read/Grep/Glob during compact-vulnerable phases. The orchestrator must write the active phase to `.claude/.phase` at each phase entry, then clear it after Phase 9 commit. See ADR-003. Phase names + the compact-vulnerable subset live in `${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/phase-constants.js` (single source of truth).
- Set: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js <phase>` (valid: parse, clarify, design, implement, validate, test, review, security, docs, commit, close)
- Clear: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js clear` (idempotent; refuses to operate on symlinks)
- Compact-vulnerable phases (must be marked): Implement, Test, Review, Security, Docs.
- Stale-state recovery: Phase 0 first sub-bullet runs `clear` to release any stuck phase from a previous crashed session; `session-start.js` also warns if `.claude/.phase` exists at startup.

---

## Phase 0 — Parse

- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js clear` (Phase Markers — pre-flight, releases any stale phase from a crashed prior session)
- [ ] Read TODO.md, find first `[ ]` task in Active Sprint
- [ ] Extract: task ID, title, `scope`, `layers`, `api-change`, `acceptance`, `tracker`
- [ ] `tracker` is "none" without justification → **HARD STOP**

## Phase 1 — Clarify

- [ ] Ask ONE question at a time — never stack multiple questions
- [ ] Stop when: goal clear, edge cases named, approach chosen
- [ ] **HARD RULE**: zero code or file changes during Clarify

## Gate 0 — Scope Confirmation

```
## Scope Confirmation — [TASK-NNN]: [Title]
**Understood goal**: [1 sentence]
**Chosen approach**: [which approach + why]
**Scope boundary**: [bullet list — what is included]
**Out of scope**: [explicitly excluded items]
**Edge cases to handle**: [list]
**Constraints**: Layers: [list] | API change: yes/no | Risk: low/medium/high
**Context cost estimate**: [Tier 2 — single layer | Tier 3 — cross-layer]
Type 'design' to proceed, or provide corrections.
```

## Phase 2 — Design

- [ ] Spawn `design-analyst` (background Tier 3) — **HARD STOP if Gate 0 not confirmed**
- [ ] Receive tiered report + micro-task implementation plan

## Gate 1 — Design Plan Approval

```
## Design Plan — [TASK-NNN]: [Title]
**Implementation approach**: [2–3 sentences]
**Files to create/modify**:
| Action | File | Layer | Why |
|:-------|:-----|:------|:----|
**Micro-tasks** (2–5 min each, independently verifiable):
- [ ] Task 1: [exact action] in `[exact/file/path]`
  - Verification: `[exact runnable command]`
**Decisions needed**: [list]
**Risks**: [list]
**Context dropped**: design exploration, codebase summaries
**Context carried forward**: micro-task list, file map, decisions
Type 'yes' to proceed, or provide feedback.
```

Micro-task rules: exact file paths only, no TBD, every verification runnable as-is.

## Phase 3 — Implement

- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js implement` (Phase Markers)
- [ ] Execute micro-tasks from Gate 1 plan in order; mark each `[x]` when verification passes
- [ ] `quick` mode scope guard: >3 files changed → **HARD STOP**, confirm or upgrade to `full`

## Phase 4 — Validate

- [ ] Typecheck → pass or **HARD STOP**
- [ ] Lint → pass or **HARD STOP**

## Phase 5 — Test (TDD contract)

- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js test` (Phase Markers)

```
RED:    Write test first. Run it — MUST fail. If it passes immediately → test is wrong.
GREEN:  Write minimum code to pass. Run — MUST pass. Show output.
REGRESS: Run full suite. All prior tests must still pass.
REFACTOR: Clean up. Re-run full suite.
```

- [ ] Same fix fails 3× in a row → **HARD STOP**, question the architecture

## Phase 6 — Review (parallel with Phase 7)

- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js review` (Phase Markers)
- [ ] Spawn `code-reviewer` (background Tier 3)
- [ ] Two stages: [S1] spec compliance first, [S2] code quality only if S1 passes

## Phase 7 — Security (parallel with Phase 6)

- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js security` (Phase Markers)
- [ ] Spawn `security-analyst` (background Tier 3)
- [ ] Migration file in diff → also spawn `migration-analyst` → **HARD STOP if not done**
- [ ] `risk: high` + `api|repository|service` in layers → spawn `performance-analyst` → **HARD STOP if not done**

## Gate 2 — Aggregated Review + Security

```
## Gate 2 — [TASK-NNN]: [Title]
### From Review     [CRITICAL | BLOCKING | NON-BLOCKING | APPROVED PATTERNS]
### From Security   [CRITICAL | BLOCKING | NON-BLOCKING]
### From Migration  [if applicable — GO / NO-GO]
**Context dropped**: review/security context, implementation details
**Context carried forward**: approved commit message, DECISIONS.md items, PR description
Type 'commit' to proceed, or fix issues and re-run the affected agent.
```

- [ ] Any CRITICAL finding → **HARD STOP** (cannot be overridden by orchestrator)
- [ ] BLOCKING findings → require explicit human acknowledgment before proceeding

## Phase 8 — Docs

- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js docs` (Phase Markers)
- [ ] Run `/lean-doc-generator` — HOW filter mandatory
- [ ] Architectural decision made → run `/adr-writer`
- [ ] Update `TODO.md`: mark task `[x]`, add Changelog row (File | Change | ADR)

## Phase 9 — Commit + PR

- [ ] `git commit` (structured message, see below) + `git push`
- [ ] Run: `node ${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js clear` (Phase Markers — release the lock)
- [ ] Phase 9b — CI check: poll `scripts/ci-status.js`
  - **HARD STOP**: CI non-green after push → do not proceed to Session Close until green
- [ ] Phase 9c — Continue or Close:
  - Open `[ ]` tasks remain in Active Sprint → output:
    ```
    Next: [TASK-NNN]: [Title] (scope: [X] | risk: [X])
    Type 'next' to continue or 'done' to close session.
    ```
    `next` → skip Phase 10, go directly to Phase 0 of next task
    `done` → run Phase 10 Session Close
  - No open `[ ]` tasks remain → skip prompt, run Phase 10 with sprint-complete flag

**Commit message format**:

```
[type]([scope]): [what changed — one line]

Acceptance: [task acceptance criteria]
Refs: [tracker URL or "none — [reason]"]
```

## Phase 10 — Session Close (mandatory — never skip)

- [ ] Count open `[ ]` tasks in Active Sprint — zero → sprint-complete path below; any open → normal close

```
## Session Close — [TASK-NNN]: [Title] — [Date]
**Docs touched**:
| File | Change made | Ownership verified |
**TODO.md maintenance**:
  - [ ] Task marked [x]
  - [ ] Changelog row added (File | Change | ADR)
  - [ ] Sprint block rotated to docs/CHANGELOG.md if sprint complete
**Recommended next-session updates**: [list]
**Corrections worth promoting to Validated Session Patterns**: [list]
```

**Sprint-complete path** (all Active Sprint tasks `[x]`):

```
## Sprint N Complete — [Sprint Name]
**Rotation checklist**:
  - [ ] Sprint Changelog block moved: TODO.md → docs/CHANGELOG.md (prepend)
  - [ ] TODO.md Active Sprint replaced with Sprint N+1 tasks (2–5 from top Backlog)
  - [ ] Promoted tasks removed from Backlog
  - [ ] TODO.md header: last_updated + sprint number updated
  - [ ] Memory updated: sprint state reflects Sprint N+1
**Proposed Sprint N+1** (top Backlog items by priority):
  | Task | Title | Scope | Risk |
  |:-----|:------|:------|:-----|
  | [top P0/P1 items — 2–5 tasks, ordered by dependency then priority] |
  Backlog empty → list tasks to add manually before next session.
Type 'rotate' to apply, or provide corrections.
```
