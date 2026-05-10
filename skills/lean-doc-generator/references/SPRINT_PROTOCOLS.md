---
owner: Tech Lead
last_updated: 2026-05-04 (Sprint 045 T4 — Date-Sanity section added per TASK-118)
update_trigger: Sprint lifecycle rules change; new promote/execute/close steps added
status: current
---

# Sprint Lifecycle Protocols

> On-demand reference for sprint promote, execute, and close operations.
> Load this file only when a sprint command is triggered — not for initial doc generation (Steps 0–7).

---

## ⚠️ Anti-Drift Hard Stops

**Observed drift (Sprints 30-33):** Four consecutive sprints shipped governance changes via `fix(governance):` / `docs(governance):` commits **without ever creating a `docs/sprint/SPRINT-NNN-*.md` plan doc**. Sprint Promote Protocol was bypassed; Sprint Close Protocol was inert because there was no plan to verify against. Backfilled retroactively in Sprint 034 (TASK-117).

**Hard stops to prevent recurrence:**

1. **Before any commit message starting `sprint(NNN):` OR `fix(governance):` OR `docs(governance):` OR scope-touching multi-skill/agent edit:** verify `docs/sprint/SPRINT-NNN-<slug>.md` exists with `status: active` and a Plan section. **If missing → STOP and run Sprint Promote Protocol before committing.**

2. **Audit-driven sprints count too.** A sprint that resolves audit findings (P0/P1/P2 sweep) is still a sprint. Same protocol applies.

3. **Single-task sprints.** Even one-task remediation work needs a plan doc — protocol is a forcing function for "what does done look like" before changing files.

4. **Backfill discipline.** If a sprint shipped without a plan doc (drift detected), backfill it retroactively with `backfilled: <date>` in frontmatter, plan reconstructed from commit message, retro acknowledging the drift. Never silently leave it.

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

1.2. **Backlog check** (TASK-124 F6b · ADR-030 DEC-5). Scan `TODO.md § Backlog` for open `[ ]` rows across `P0 / P1 / P2`. If zero open rows found → prompt:

   > "Backlog has no open tasks (P0/P1/P2 all empty). Run `/task-decomposer` first to surface tasks, then return to Sprint Promote. Continue anyway? Default: halt (n). (y/n)"

   - `n` (default) → **halt** Sprint Promote; remind user to invoke `/task-decomposer` with their intent.
   - `y` → proceed (user may be promoting a P3-only item or manually inserted task; soft guard preserves edge cases).

1.5. **TD Scan** (TASK-123 F5(D)). Read `TODO.md § Tech Debt`. For each open TD row:
   - **`severity: high`** → auto-escalate to Backlog P1 (no human review). Write Backlog row `TASK-NNN` from TD-NNN AC. Mark TD row `status: escalated`. Note: TD row stays in § Tech Debt (audit trail per anti-pattern lock #1) — escalation does NOT delete.
   - **Aging `>6` sprints** (current sprint - sprint-created): prompt user `"TD-NNN is [N] sprints old (severity: X). Escalate / Downgrade / Mark resolved?"`. Apply user choice.
   - **Missing `sprint-created:` field**: treat as requires-re-review immediately (defensive default per anti-pattern lock #3). Prompt as above.
   - **`severity: trivial | minor | medium`** + not aging: surface count summary to user (`"N open TD rows; human review required to promote to Backlog"`). Do NOT auto-promote.
   - **`status: escalated`** without corresponding Backlog `TASK-NNN`: HARD STOP per anti-pattern lock #5. Fix before continuing.

1.5b. **Release-debt scan** (Sprint 052b ADR-032 DEC-3 codification · TASK-NEW Sprint 055b T2). Read `docs/CHANGELOG.md`. Count completed sprints since last `MINOR` OR `MAJOR` plugin release (`plugin.json` + `marketplace.json` lockstep bump). Apply rules:
   - **Depth `≥3` sprints**: surface as P1 candidate. Prompt user `"Release-debt depth = [N] PATCH-only sprints since last MINOR. Promote release-debt resolution to Backlog P1? (y/n)"`.
   - **Depth `≥5` sprints**: auto-escalate to Backlog P0 (no human review). Write `release-debt resolution sprint` row in Backlog § P0 with reconcile AC = manual MINOR/MAJOR lockstep bump per ADR-032 DEC-2.
   - **Depth `≥7` sprints**: HARD STOP Sprint Promote. Block message: `"Release-debt depth = [N]. Promote release-debt resolution sprint FIRST per ADR-032 DEC-3 (≥7 = block threshold)."` Resume Sprint Promote only after release-debt sprint promoted + status=active.
   - **Counter-stale guard** (TD-001 codify): release-debt depth count refreshes atomically with this scan; do NOT trust pre-cached values from prior session memory.
   - **Pre-release versions** (alpha/beta/rc): treat as MINOR for depth-counting purposes (release effort already happened).

2. **Pick** top priority items (P0 → P1 → P2). Apply sprint sizing rules: 2–3 tasks min, more if lightweight. Confirm pick with user.

3. **Flow Grill — iteration loop** (per ADR-036 / `FLOW_GRILL.md`). Hydrate Open Questions ledger from `task-decomposer` seed (`## Flow Grill Seed` JSON block emitted on `approve`) if present; cold-start otherwise. Iterate batched Q&A loop per `FLOW_GRILL.md` § Q&A Discipline (≤5 independent Qs/turn; follow-up turn on ambiguous answer; never batch dependent or open-ended Qs) until all required ledger fields populated (tasks · assumptions · risk · layers · anti-slip 4 fields per ADR-031 · decisions_pre_locked). **Ledger is session-scoped; NOT persisted to disk pre-lock.**

4. **Review-before-lock** (per ADR-036 DEC-4 / `FLOW_GRILL.md` § Review-Before-Lock Step). Emit converged ledger summary to terminal (tasks · assumptions · risk · anti-slip 4 fields · decisions pre-locked · open uncertainty). Prompt three keywords: `confirm` (no-op review pass; re-emits summary; lets user read once more) · `revise <field>` (re-enter loop at named field; preserve unrelated state) · `lock` (irreversible write trigger). **Non-skippable.** Replaces old "Pause for user review" + "On approval" steps.

5. **On `lock`** — generate `docs/sprint/SPRINT-NNN-<slug>.md` from sprint file template (see `DOCS_Guide.md` §3.9). Hydrate sections from frozen ledger per `FLOW_GRILL.md` § Handoff Envelope mapping (tasks → § Plan · confirmed assumptions → § Decisions pre-locked · anti-slip 4 fields → G1 rows · unresolved Qs → § Open Questions for Review). Update TODO.md: `Active Sprint` → `→ docs/sprint/SPRINT-NNN-<slug>.md`; remove promoted tasks from Backlog.
   - NNN = next zero-padded sequence (read existing files in `docs/sprint/`)
   - `<slug>` = kebab-case theme, ≤30 chars
   - `status: planning`. Execution Log / Files Changed / Decisions / Open Questions / Retro = empty stubs.
   - Ownership header: `last_updated: <today>`, `update_trigger: sprint open / close / status change`

6. **Plan-locked commit** — flip sprint file `status: planning → active`, fill `plan_commit: <sha>` after user runs commit. Provide commit message ready to paste:

   ```
   sprint(NNN): plan locked — [theme]

   Plan: [brief one-line]
   Tasks: T1, T2, T3
   PRD: [link]

   Plan frozen at this commit. Execution log + retro append in subsequent commits, squashed at close.
   ```

7. **Block** any further plan edit. From this point all changes go to Execution Log § Surprise.

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
   - Touched architecture → ARCHITECTURE.md updated this sprint? Layer changes → verify against ADR-029 (`docs/blueprint/11-lean-architecture.md`).
   - Added pattern/convention → AI_CONTEXT.md § Patterns / § Conventions updated?
   - Added do-not / anti-pattern → AI_CONTEXT.md § Do Not updated?
   - § Decisions has ADR-needed → DECISIONS.md ADR written?
   - § Files Changed has test row → TEST_SCENARIOS.md updated?
   - If gap → list and prompt to fix before close.
4. **Fill** § Retro:
   - Worked: what went well
   - Friction: what was slow / wrong assumption / missing context
   - **For each Friction item, prompt** (TASK-123 F5(B)):
     ```
     TD row for: [friction one-liner]? (Y / N / already-resolved)
     ```
     - `Y` → write TD-NNN row in `TODO.md § Tech Debt` (severity user-supplied + source: `Sprint-NNN retro Friction #N` + status: `open` + sprint-created: NNN)
     - `N` → one-off observation; no row
     - `already-resolved` → no row; note in retro text
     - **Anti-rule:** do NOT auto-promote ALL friction. One-off pattern observations don't warrant a row.
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

---

## Date-Sanity (Step 0b protocol)

Added Sprint 045 T4 (TASK-118) to close 3-sprint recurring friction (Sprint 042/043/044 retros stamped wrong date in sprint frontmatter + research filenames; required manual fix at promote each time).

**Trigger:** any sprint-lifecycle operation (promote / execute / close) about to write a `last_updated:` frontmatter value OR a dated research filename (`<topic>-<YYYY-MM-DD>.md`).

**Comparison logic (prose):**
1. Read today's date from environment context (system memo `currentDate`, `<env>` block, or equivalent reliable source).
2. For each new `last_updated:` value about to be written, compare to today.
3. For each new dated filename about to be created (research notes, sprint files, ADRs if dated), parse the date suffix and compare to today.
4. If ANY mismatch ≥1 day → enter WARN+CONFIRM flow.

**Warning format template:**
```
[date-sanity] today = 2026-05-04, writing = 2026-05-03 in <file or filename>.
Auto-correct? (y/n)
```

**Auto-correct rules:**
- ONLY on explicit `y` from user.
- Apply to ALL files with the same drift in current operation (single confirm covers batch).
- Never silently rewrite. Never bypass even if user is AFK — surface and stop.

**Out of scope:** date corrections to ALREADY-WRITTEN files (those go through normal Step 0 staleness scan + ownership-header `last_updated` updates). Step 0b only guards NEW writes.

**Recurring-friction citation:** Sprint 042 retro Friction #1 + Sprint 043 retro Friction #1 + Sprint 044 retro Friction #1 (TASK-118 promoted to P0 per Sprint 044 retro Pattern Candidate #4).

---

## Tech Debt Anti-Pattern Locks

Mirrors `## Anti-Drift Hard Stops` above. Prevent recurring misuse of the TD mechanic (TASK-123 F5(E)).

1. **Never delete TD rows.** Resolved rows stay in `TODO.md § Tech Debt` with `status: resolved → TASK-NNN`. History is the audit trail. If a row is missing → backfill from git history; never silently lose.
2. **Never auto-promote low-severity to Backlog.** `trivial`, `minor`, `medium` rows require human decision at Sprint Promote Step 1.5. Only `severity: high` auto-escalates without review.
3. **Never let a TD row age past 6 sprints without re-review.** Sprint Promote Step 1.5 fires the re-review prompt (`Escalate / Downgrade / Mark resolved`). If a row has no `sprint-created:` field → treat as requires-re-review immediately (defensive default).
4. **Never write a TD row without `severity:` + `source:`.** Rows missing either field are invalid — fix before continuing. Both fields populate by construction in F5(B) Sprint Close write path and F5(C) mid-sprint defer path.
5. **Never merge a `status: escalated` TD row without a corresponding Backlog `TASK-NNN`.** Escalation is incomplete until the Backlog row exists. Sprint Promote Step 1.5 hard-stops if escalated row lacks Backlog match.

**Enforcement:** behavioral (read at Sprint Promote / Sprint Close / Sprint Execute by `lean-doc-generator` skill type: rigid). Automated lint deferred to TASK-116-v2 acceptance harness (Sprint 054).
