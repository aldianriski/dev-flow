---
owner: Tech Lead
last_updated: 2026-04-29
update_trigger: Sprint lifecycle rules change; new promote/execute/close steps added
status: current
---

# Sprint Lifecycle Protocols

> On-demand reference for sprint promote, execute, and close operations.
> Load this file only when a sprint command is triggered — not for initial doc generation (Steps 0–7).

---

> **Commit strategy:** One sprint = **two commits**.
> - `sprint(NNN): plan locked` — at promote, after plan approval
> - `sprint(NNN): <summary>` — squash commit at close
>
> PR opens when the full PRD is done — may span multiple sprints.
> Reviewer sees plan diff separate from execution.

---

## Sprint Promote Protocol

**Trigger phrases:** "promote backlog", "start sprint", "execute active sprint", "begin sprint", "kick off sprint", "let's start [task X]"

**Steps:**

1. **Read** TODO.md § Backlog. Confirm `Active Sprint` pointer = `— none —`. If pointing to file with `status: active` → block with: "Sprint NNN still active. Close it before promoting next."
2. **Pick** top priority items (P0 → P1 → P2). Apply sprint sizing rules: 2–3 tasks min, more if lightweight. Confirm pick with user.
3. **Decompose** each task. Ask in single message:

   ```
   Decomposing T1 — [task name]. Need confirm:

   - Scope: in-scope vs out-of-scope?
   - Acceptance: what observable outcome = done?
   - Edge cases: empty / null / large / concurrent / error path?
   - Files (likely): paths or "tbd"?
   - Tests: what scenarios add to TEST_SCENARIOS.md?
   - Risk: low / med / high — reason?
   - Depends on: other task in this sprint?
   - ADR needed: yes / no / maybe — topic?
   - Definition of done: code merged + tests green + which docs update?
   - Existing pattern to mirror: file path or —?

   My confidence on this task: NN% — uncertainty area: [X].
   ```

4. **Repeat** decompose for each task. Wait for full answers before proceeding.
5. **Generate** `docs/sprint/SPRINT-NNN-<slug>.md` from sprint file template (see `DOCS_Guide.md` §3.9):
   - NNN = next zero-padded sequence (read existing files in `docs/sprint/`)
   - `<slug>` = kebab-case theme, ≤30 chars
   - `status: planning`. Plan section filled with decomposed tasks. Execution Log / Files Changed / Decisions / Open Questions / Retro = empty stubs.
   - Ownership header: `last_updated: <today>`, `update_trigger: sprint open / close / status change`
6. **Update** TODO.md:
   - `Active Sprint` → `→ docs/sprint/SPRINT-NNN-<slug>.md`
   - Remove promoted tasks from Backlog
7. **Pause** for user review of plan. Surface confidence ratings + open uncertainty.
8. **On approval** → flip sprint file `status: active`, fill `plan_commit: <sha>` after user runs `sprint(NNN): plan locked` commit. Provide commit message ready to paste:

   ```
   sprint(NNN): plan locked — [theme]

   Plan: [brief one-line]
   Tasks: T1, T2, T3
   PRD: [link]

   Plan frozen at this commit. Execution log + retro append in subsequent commits, squashed at close.
   ```

9. **Block** any further plan edit. From this point all changes go to Execution Log § Surprise.

---

## Sprint Execute Protocol

**Trigger:** AI doing coding work during sprint with `status: active`.

**Steps applied continuously:**

1. **Before each task:** read sprint file Plan § T<N>. Re-confirm acceptance + DoD.
2. **On significant decision** (architectural-level, file structure, library pick): append to § Decisions with reason. If global-scope → also write ADR in DECISIONS.md, link from sprint file.
3. **On surprise** (plan deviation, unexpected finding, blocker): append `### YYYY-MM-DD HH:MM | Surprise during T<N>` block to § Execution Log with discovery + resolution.
4. **For each file touched:** add row to § Files Changed (`File | Task | Change (one-line WHY) | Risk | Test added`). One row per file, NOT per edit.
5. **On test added/modified:** also update TEST_SCENARIOS.md § Coverage Map.
6. **Task complete:** append `### YYYY-MM-DD HH:MM | T<N> done` block confirming acceptance verified + DoD met. Tick `[ ] → [x]` only in DoD line.
7. **Open question for user:** add to § Open Questions for Review. Surface to user at next pause.
8. **Refuse:** any edit to § Plan. Plan frozen. Direct user to log in § Execution Log instead.
9. **Refuse:** code dumps, function explanations, HOW prose in sprint file. Sprint file = WHY/WHERE only.

---

## Sprint Close Protocol

**Trigger phrases:** "close sprint", "sprint done", "wrap sprint", "finalize sprint NNN"

**Steps:**

1. **Verify** every task in § Plan has:
   - Matching `### T<N> done` entry in § Execution Log
   - All DoD line items ticked `[x]`
   - Acceptance verified
   - If gap → block close, list incomplete items.
2. **Verify** § Files Changed covers every file in current `git diff` since `plan_commit`. If file changed but not logged → prompt user to add row.
3. **Verify** docs sync. For each row in § Files Changed:
   - Touched architecture → ARCHITECTURE.md updated this sprint?
   - Added pattern/convention → AI_CONTEXT.md § Patterns / § Conventions updated?
   - Added do-not / anti-pattern → AI_CONTEXT.md § Do Not updated?
   - § Decisions has ADR-needed → DECISIONS.md ADR written?
   - § Files Changed has test row → TEST_SCENARIOS.md updated?
   - If gap → list and prompt to fix before close.
4. **Fill** § Retro:
   - Worked: what went well
   - Friction: what was slow / wrong assumption / missing context
   - Pattern candidate: rule worth keeping permanently — surface to user, ask confirm, on yes → add to `reference/VALIDATED_PATTERNS.md` with session date
5. **Flip** sprint file `status: closed`. Update `last_updated: <today>`.
6. **Write** pointer row in CHANGELOG.md (prepend, newest first):

   ```markdown
   ## Sprint NNN — [theme] (YYYY-MM-DD)
   - Sprint file: [docs/sprint/SPRINT-NNN-<slug>.md](sprint/SPRINT-NNN-<slug>.md)
   - PRD: [link]
   - Plan commit: <plan_sha>
   - Close commit: <close_sha>   *(filled after step 8)*
   - Summary: [one line — what shipped]
   - Docs updated: [list, e.g. ARCHITECTURE.md §Auth, AI_CONTEXT.md §Patterns]
   - ADRs: ADR-NNN, ADR-MMM (or —)
   - Files changed: NN
   - Tests added: NN
   ```

7. **Clear** TODO.md `Active Sprint` → `— none —`.
8. **Provide** squash-commit message ready to paste:

   ```
   sprint(NNN): <summary>

   Theme: [theme]
   PRD: [link]
   Tasks: T1 ✓ T2 ✓ T3 ✓
   ADRs: ADR-NNN
   Docs: ARCHITECTURE.md §X, AI_CONTEXT.md §Y, TEST_SCENARIOS.md
   Files changed: NN | Tests added: NN

   Sprint file: docs/sprint/SPRINT-NNN-<slug>.md
   ```

9. **After** user commit → fill `close_commit: <sha>` in sprint file ownership header AND in CHANGELOG.md row.
10. **PR check:** ask user — is parent PRD now fully done? If yes → suggest open PR with body referencing all sprint files in this PRD slice.
11. **Run** Step 7 (Session Close summary from SKILL.md) as final step.
