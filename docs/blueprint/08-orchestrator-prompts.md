---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Gate format changes; new hard stop added; mode added/removed; orchestrator phase contract changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §9 (split TASK-004); refreshed Sprint 051b T5.5 to align with current 4-mode/2-gate model (was 6-mode/3-gate; CONTEXT.md + orchestrator SKILL.md authoritative)
---

# Blueprint §8 — dev-flow Orchestrator Key Prompts

Phase prompt templates aligned with current 4-mode workflow (`init` / `quick` / `mvp` / `sprint-bulk`) and 2-gate model (`G1 Scope` / `G2 Design`). For mode/gate definitions see [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md). For phase mechanics see [`03-workflow-phases.md`](03-workflow-phases.md).

---

## Parse Phase

**Path A — Active task in TODO.md:**
```markdown
Read TODO.md. Find the first incomplete task `[ ]` in Active Sprint.
Extract: task ID + title · layers · risk · acceptance criteria · dependencies.
If no active task → list backlog top 3 and ask user which to start.
If backlog empty → switch to Path B (freeform decomposition).
```

**Path B — Freeform input:**
```markdown
Freeform input detected. Invoking /task-decomposer before Parse.
User input: "[verbatim]"
Rules:
- Do NOT extract task fields directly from freeform text.
- Do NOT write code or make design decisions yet.
- Invoke task-decomposer → translates intent → structured TASK-NNN entries.
- task-decomposer output is reviewed by user; approved tasks land in TODO.md.
- Continue to G1 Scope with the first approved task.
```

---

## G1 Scope Gate

```markdown
## G1 Scope — [TASK-NNN]: [Title]

- [ ] Goal stated as verifiable outcome: [one sentence]
- [ ] User-project outcome named: [≥1 from docs/USER-OUTCOMES.md]
- [ ] Size estimated: S ≤2h / M ≤1d / L >1d → must split
- [ ] Constraints + dependencies named: [list]
- [ ] Skill red flags checked: [any triggered? list]

**Layers affected**: [list]
**Risk level**: low | medium | high
**Out of scope** (explicitly excluded): [list]

Type 'approve' to proceed, or provide corrections.
```

> G1 is cheap — runs in orchestrator's existing context. Locks scope before expensive G2 design exploration.

---

## Grill Phase (mvp only, when requirements unclear)

```
1. Ask ONE question at a time — never stack multiple questions.
2. Each question must resolve a specific ambiguity that would block design.
3. Explore codebase BEFORE asking — many questions answer themselves from existing patterns.
4. Offer recommended answer with each question — user redirects, doesn't author.
5. Stop when: goal is clear, edge cases named, approach chosen.
6. HARD RULE: Do not write code or propose file changes during Grill.
```

---

## G2 Design Gate (Design Analyst Dispatch)

```markdown
You are design-analyst for [project name].
Task: [TASK-NNN] — [title]
Confirmed scope (G1): [scope]
Confirmed constraints (G1): [list]
Layers: [list]

Explore codebase to understand:
1. What existing code is affected?
2. What new files need creating; in which layer?
3. What architectural decisions need making?
4. What risks or dependencies exist?

Return: implementation plan (micro-tasks 2-5 min each, exact file paths,
verification commands). Status: DONE / DONE_WITH_CONCERNS / BLOCKED.
Do NOT return raw file contents.
```

**G2 output format:**
```markdown
## G2 Design — [TASK-NNN]: [Title]
Status: DONE | DONE_WITH_CONCERNS | BLOCKED

**Implementation approach**: [2-3 sentences]
**Files to create/modify**: [table — Action | File | Layer | Why]
**Implementation micro-tasks**:
- [ ] T1: [exact action] in `[file]` — Verification: `[command]`
- [ ] T2: ...
**Decisions needed**: [list — any hard-to-reverse → adr-writer dispatch]
**Risks**: [list]

Type 'yes' to proceed to Implement, or provide feedback.
```

> BLOCKED → halt sprint; human resolves before proceeding.

---

## Sprint-Bulk Batched G1 + G2

```markdown
## Sprint Scope Batch (G1 once)
**Combined goal**: [sprint-wide outcome]
**Tasks**: [T1..TN with layers + risk]
**Sprint-wide red flags**: [list]
**Size**: M (multi-task; all tasks S each)

## Sprint Design Batch (G2 once)
Dispatched: scope-analyst + design-analyst on full task list.
Output: session-scoped sprint-PRD.
**Overlap gate**: pairwise FILES_AFFECTED intersection.
  All empty → parallel-eligible.
  Else → sequential (default).
**Auto-loop**: iterate [ ] tasks; halt on first BLOCKED or human `block`.
```

---

## Implement Phase

- Execute design-analyst's micro-task list in order.
- Mark each `[x]` when verification command passes.
- Flag scope creep immediately — do not silently expand.
- If a fix fails 3× in a row → halt; question architecture before continuing.

---

## Review Dispatch (post-implement, propose → human approves)

```markdown
You are code-reviewer for [project name].
Task: [TASK-NNN] — [title]
Approved micro-task list (G2): [list]
Changed files: [list]

Run 7-lens review: spec compliance · architecture · SOLID · tests · docs · perf · security-surface.
For each finding, label tier: CRITICAL | BLOCKING | NON-BLOCKING.
Do NOT return raw file contents.
```

> Skip review (`n`) for doc-only / delete-only / trivial diffs.

---

## Commit Phase

Structured message format:
```
<type>(<scope>): TASK-NNN — <one-line summary>

<body — why, not what>

Refs <ADR-NNN if applicable>.

Co-Authored-By: Claude <model> <email>
```

Types: `feat` · `fix` · `docs` · `refactor` · `test` · `chore` · `sprint` (sprint promote/close).

---

## Sprint Close (sprint-bulk only)

When all sprint tasks `[x]`:
1. Run `/lean-doc-generator` Sprint Close protocol — verify DoD, sync § Files Changed against `git diff`, fill Retro.
2. Flip TODO.md frontmatter `sprint: NNN` → `sprint: none`; clear Active Sprint; rotate sprint block to `docs/CHANGELOG.md`.
3. Prompt `/release-patch` if version bump needed (skip on docs-only diff per ADR-027).

---

## Hard Stops

The orchestrator MUST halt and report on:

- ❌ G1 skipped — unconfirmed scope causes regressions
- ❌ Size L not split in `mvp` — un-reviewable
- ❌ CRITICAL finding not resolved — requires explicit human override
- ❌ Grill skipped on ambiguous requirements — builds wrong thing
- ❌ Security run in same session — context contamination (use separate `/security-review`)
- ❌ Typecheck / lint / unit tests fail — show error, wait for fix
- ❌ Generated/auto-built files were edited — warn and request revert
- ❌ DB migration added without verified down migration — dispatch `migration-analyst` before commit
- ❌ Skill `last-validated` >6 months — warn before running, require acknowledgment
- ❌ CLAUDE.md / SKILL.md / agent line caps exceeded — trim before proceeding (per CLAUDE.md DoD)
- ❌ Same fix attempted 3× without passing — stop, report, question architecture

---

## Cross-References

- Phase mechanics → [`03-workflow-phases.md`](03-workflow-phases.md)
- Mode + gate definitions → [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md) § Modes / § Gates
- Outer session pattern → [`12-session-workflow.md`](12-session-workflow.md)
- Orchestrator skill → [`skills/orchestrator/SKILL.md`](../../skills/orchestrator/SKILL.md) + [`references/phases.md`](../../skills/orchestrator/references/phases.md)
- Agent roster → [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md) § Agent Roster
