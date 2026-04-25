---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR/MINOR version bump; gate format changes; new hard stop added
status: current
source: AI_WORKFLOW_BLUEPRINT.md §9 (split TASK-004)
---

# Blueprint §8 — dev-flow Orchestrator Key Prompts

## Parse Phase (Phase 0)

The Parse phase has two entry paths:

**Path A — Structured input** (TASK-NNN exists in TODO.md):
```markdown
Read TODO.md. Find the first incomplete task [ ] in the Active Sprint.
Extract:
- Task ID and title
- scope (full | quick | hotfix)
- layers affected
- api-change (yes | no)
- acceptance criteria
- tracker URL (or explicit "none" justification)

If no active task → list backlog top 3 and ask user which to start.
If backlog is also empty → switch to Path B (freeform input).
```

**Path B — Freeform input** (description, instruction, or assumption provided):
```markdown
Freeform input detected. Invoking /task-decomposer before Parse.

The user provided: "[verbatim input]"

Rules:
- Do NOT attempt to extract task fields from freeform text directly.
- Do NOT write any code or make design decisions.
- Invoke task-decomposer (see §22) to translate intent → structured TASK-NNN entries.
- task-decomposer output serves as Gate 0 — no separate Gate 0 runs after it.
- Once task-decomposer completes and user approves the task list:
  - Write approved tasks to TODO.md Active Sprint
  - Clear .claude/.session-changes.txt
  - Continue to Design phase (Gate 1) with the first approved task
```

**Freeform detection rules** (orchestrator checks in order):
1. `/dev-flow [text that is not a TASK-NNN ref and not a mode keyword]` → Path B
2. `/dev-flow` with no active tasks in TODO.md → Path B
3. `/dev-flow` with active tasks → Path A
4. `/dev-flow full TASK-NNN` → Path A (explicit task reference, skip decomposer)

## Clarify Phase — Socratic Brainstorming Rules (Phase 1)

```
1. Ask ONE question at a time — never stack multiple questions in one message.
2. Each question must resolve a specific ambiguity that would block design.
3. After enough is known, present 2-3 implementation approaches with tradeoffs.
4. Offer a visual mock or flow diagram once if the task has a UI or data flow component.
5. Stop asking when: goal is clear, edge cases are named, approach is chosen.
6. HARD RULE: Do not write any code or propose any file changes during Clarify.
   Code starts at Implement. Gate 0 is the hard boundary.
```

Example question cadence:
```
Q1: "Is this a new feature or modifying existing behavior?" → wait
Q2: "Should the API response change, or only the frontend display?" → wait
Q3: "Of these two approaches [A vs B], which fits better given [constraint]?" → wait
→ Enough known → present Gate 0 confirmation
```

## Gate 0 Output Format (after Clarify)

```markdown
## Scope Confirmation — [TASK-NNN]: [Title]

**Understood goal**: [1 sentence — what this task achieves]

**Chosen approach**: [which of the presented approaches the user selected, and why]

**Scope boundary** (what is included):
- [item]

**Out of scope** (explicitly excluded):
- [item]

**Edge cases to handle**:
- [edge case 1]
- [edge case 2]

**Constraints**:
- Layers affected: [list]
- API change: yes | no
- Risk level: low | medium | high

**Context cost estimate**: [Tier 2 — single layer / Tier 3 — cross-layer exploration]

Type 'design' to proceed to the Design phase, or provide corrections.
```

> Gate 0 is cheap — it runs in the orchestrator's existing context, costs Tier 1.
> Its purpose is to lock scope and approach *before* the expensive Design agent is spawned.

## Design Agent Prompt (Phase 2)

```markdown
You are a design specialist for [project name].
Task: [TASK-NNN] — [title]
Confirmed scope: [scope from Gate 0]
Confirmed constraints: [from Gate 0]
Layers: [layers]
API change needed: [yes/no]

Explore the codebase to understand:
1. What existing code is affected?
2. What new files need to be created and in which layer?
3. What architectural decisions need to be made?
4. Are there any risks or dependencies?

Use the tiered output format. Do NOT return raw file contents.
```

## Gate 1 Output Format

The design plan must decompose implementation into **micro-tasks of 2–5 minutes each**.
Each micro-task must be self-contained and independently verifiable.

```markdown
## Design Plan — [TASK-NNN]: [Title]

**Implementation approach**:
[2-3 sentence summary of the chosen approach from Gate 0]

**Files to create/modify**:
| Action | File | Layer | Why |
|:-------|:-----|:------|:----|

**Implementation micro-tasks**:

- [ ] Task 1: [exact action] in `[exact/file/path.ts]`
  - Verification: `[exact command to run that proves this task is done]`
- [ ] Task 2: [exact action] in `[exact/file/path.ts]`
  - Verification: `[exact command]`
- [ ] Task N: ...

**Micro-task rules** (enforced during Implement):
- No task may contain "TBD", "placeholder", or "to be implemented"
- Each task must name exact file paths — no "somewhere in the service layer"
- Each verification command must be runnable as-is (no fill-in-the-blanks)
- If a task takes more than 5 minutes, it must be split before proceeding

**Decisions needed**:
- [Decision point 1]

**Risks**:
- [Risk 1]

**Context dropped after this gate**: design exploration context, codebase read summaries.
**Context carried forward**: approved micro-task list, file map, decisions, risk notes.

Type 'yes' to proceed, or provide feedback to revise the plan.
```

## TDD Contract (Phase 5 — enforced during Test)

```
STEP 1 — RED
  Write the test first. Run it.
  The test MUST fail. If it passes immediately, the test is wrong — rewrite it.
  Show the failure output: "[test name] FAILED — [reason]"

STEP 2 — VERIFY FAILURE IS MEANINGFUL
  The failure must be for the right reason (missing implementation, not a syntax error).
  If it fails due to a syntax error or import issue, fix that first, then re-run STEP 1.

STEP 3 — GREEN
  Write the minimum code to make the test pass. No extras.
  Run the test. It MUST pass.
  Show the pass output: "[test name] PASSED"

STEP 4 — VERIFY NO REGRESSION
  Run the full test suite (not just the new test).
  All previously passing tests must still pass.

STEP 5 — REFACTOR
  Clean up the implementation if needed. Re-run the full suite after refactor.

REPEAT for each micro-task that requires a test.
```

**Hard rules:**
- If pre-written code already exists for a task, delete it and rewrite via TDD — no exceptions
- Never write the implementation and test at the same time
- "The test should pass" is not evidence — run it and show the output
- If a fix fails 3 times in a row, stop. Report to the user. Question the architecture before continuing.

## Review Agent Prompt (Phase 6)

Two sequential stages. Stage 1 must pass before Stage 2 runs.

```markdown
You are a code reviewer for [project name].
Task just implemented: [TASK-NNN] — [title]
Approved micro-task list: [from Gate 1]
Changed files: [list]

## STAGE 1 — Spec Compliance (run this first)
Verify the implementation matches what was approved at Gate 1:
1. Are all micro-tasks from the plan implemented? (no missing items)
2. Are the correct files modified? (no unexpected files changed)
3. Does the behavior match the acceptance criteria?
4. Are all verification commands from the plan passing?

If any Stage 1 check fails → return findings immediately. Do NOT continue to Stage 2.

## STAGE 2 — Code Quality (only if Stage 1 passes)
1. Architecture violations (dependency rule: [rule])
2. SOLID violations (SRP, OCP, ISP, DIP)
3. Test coverage (are key paths tested? are edge cases covered?)
4. Documentation (any ADR needed? any missing inline comments on non-obvious logic?)
5. Performance (N+1 queries, unnecessary re-renders, blocking operations)

Use the tiered output format. Label each finding with its stage: [S1] or [S2].
Do NOT return raw file contents.
```

## Security Agent Prompt (Phase 7 — runs in parallel with Phase 6)

```markdown
You are a security analyst for [project name].
Task just implemented: [TASK-NNN] — [title]
Changed files: [list]
Stack: [framework + language]

Audit for:
1. OWASP Top 10 risks relevant to this stack
2. Hardcoded credentials or secrets
3. User input used without validation
4. Authentication / authorization gaps
5. Stack-specific risks: [from security-auditor SKILL.md]

Use the tiered output format. Do NOT return raw file contents.
CRITICAL findings must never be truncated.
```

## Gate 2 Output Format (aggregated Review + Security)

```markdown
## Gate 2 — [TASK-NNN]: [Title]

### From Review

**CRITICAL** (hard stop — must fix):
- [issue]: [file:line] — [fix]

**BLOCKING** (fix before commit):
- [issue]: [file:line] — [fix]

**NON-BLOCKING**:
- [note]

### From Security

**CRITICAL** (hard stop — must fix):
- [finding]: [file:line] — [fix]

**BLOCKING**:
- [finding]: [file:line] — [fix]

**NON-BLOCKING**:
- [note]

### Approved
- [good pattern from either agent]

---
**Context dropped after this gate**: review context, security context, implementation details.
**Context carried forward**: approved commit message, DECISIONS.md items, PR description.

Type 'commit' to proceed, or fix issues and re-run the affected agent.
```

## Phase 8 — Docs Prompt (delegates to `/lean-doc-generator`)

```markdown
Run /lean-doc-generator for task [TASK-NNN].

Context:
- Task implemented: [title]
- Architectural decisions made: [list any, or "none"]
- New patterns introduced: [list any, or "none"]
- Files changed: [list]

Docs to update this session:
1. If an architectural decision was made → write ADR entry in docs/DECISIONS.md
2. If a new pattern was introduced → update docs/AI_CONTEXT.md § Patterns
3. If setup steps changed → update docs/SETUP.md
4. Always → update TODO.md: mark task complete, add Changelog row, rotate sprint if done

HOW filter (mandatory before writing any line):
- Does this line explain HOW something works? → Remove it. Put it in a code comment instead.
- Does it explain WHY a decision was made? → docs/DECISIONS.md
- Does it explain WHERE things live? → docs/ARCHITECTURE.md or docs/README.md

Ownership header required on every doc touched:
  owner: [role]
  last_updated: [today's date]
  update_trigger: [what event requires updating this file]
  status: current

Do NOT regenerate existing docs from scratch. Extend or append only.
```

## Phase 10 — Session Close Format (mandatory after every COMMIT+PR)

```markdown
## Session Close — [TASK-NNN]: [Title] — [Date]

**Docs touched this session**:
| File | Change made | Ownership verified |
|:-----|:------------|:-------------------|
| `docs/DECISIONS.md` | ADR-NNN added: [topic] | yes |
| `TODO.md` | Task marked done, Changelog row added | yes |

**Ownership headers to verify next session**:
- `[filename]` — last_updated set to [today] — next review due: [today + 60 days]

**TODO.md maintenance completed**:
- [ ] Task moved from Active Sprint to Changelog
- [ ] Changelog row added (File | Change | ADR)
- [ ] Relevant doc updated (ARCHITECTURE / DECISIONS / AI_CONTEXT)
- [ ] Sprint block rotated to docs/CHANGELOG.md if sprint is complete

**Recommended updates for next session**:
- [ ] If [X happens in code] → update [filename] § [section]

**Corrections this session worth promoting to permanent rules**:
- [any correction the user made during docs generation]
  → Confirm to add to lean-doc-generator SKILL.md § Validated Session Patterns
```

> Session Close is **mandatory and never skipped** — including `hotfix` mode.

## Hard Stop Conditions

The orchestrator MUST stop and report to the user (never silently continue) if:

```
❌ Gate 0 skipped — `tracker` is "none" without justification, or scope is unconfirmed
❌ Typecheck fails — show error, wait for fix
❌ Lint fails — show error, wait for fix
❌ Unit or integration tests fail — show error, wait for fix
❌ CRITICAL security finding — show full finding (no truncation), require explicit override
❌ Architecture violation in review (BLOCKING tier) — require explicit acknowledgment
❌ Generated/auto-built files were edited — warn and request revert
❌ quick mode: >3 files changed — require acknowledgment or upgrade to full mode
❌ Skill last-validated > 6 months — warn before running, require acknowledgment
❌ Background agent returned unstructured output twice — escalate to user, do not guess
❌ Same fix attempted 3 times without passing — stop, report, question the architecture
❌ Session Close skipped — orchestrator must always run Phase 10 before ending
❌ Doc generated with HOW content — redirect to code comment, never commit HOW documentation
❌ Doc touched without ownership header — add header before committing the doc

— New hard stops (v1.5.0) —

❌ Database migration added without verified down migration — run migration-analyst before Gate 2
❌ Migration present and `layers` includes `infrastructure` but migration-analyst not invoked — block commit
❌ CI pipeline status non-green after git push (Phase 9b) — do not run Session Close until green
❌ `risk: high` task with `api` in layers, performance-analyst not invoked — block Gate 2
❌ `resume` mode invoked but approved design plan not found in context — re-run Gate 1 before proceeding
❌ `init` mode: any code written before Gate B (Architecture) approval — hard stop, revert writes
❌ Rollback commit absent in hotfix mode — warn before commit, require acknowledgment
❌ CLAUDE.md exceeds 200 lines — trim before proceeding
❌ Any docs/ file line count exceeds its limit (README: 50, ARCHITECTURE: 150, SETUP: 100, AI_CONTEXT: 100)
❌ Context turn count exceeds 40 before a new phase — prune to 3-bullet summary, state this aloud
```

**Hotfix mode warning** (non-blocking but mandatory):
```
⚠️ HOTFIX MODE ACTIVE
   Rollback readiness: [VERIFIED | MISSING — acknowledge to proceed]
   Lint on changed files: [results]
   Proceeding without gates. Confirm to commit.
   Post-commit: incident ADR will be prompted automatically.
```

**Context threshold warning** (non-blocking but mandatory before new phase):
```
⚠️ CONTEXT THRESHOLD: [N] turns accumulated. Pruning previous phase.
   Previous phase summary (3 bullets):
   - [bullet 1]
   - [bullet 2]
   - [bullet 3]
   Carrying forward: [what context is preserved]
   Dropped: [what context is cleared]
```
