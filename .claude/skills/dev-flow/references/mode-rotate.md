# dev-flow — Rotate Mode

Entry: `/dev-flow rotate`

Closes the current sprint, archives it to CHANGELOG.md, and defines Sprint N+1.

---

## Pre-condition Check

Before any step:
- Read `TODO.md` Active Sprint pointer → locate sprint file.
- Read sprint file → count `[ ]` DoD checkboxes. Any unchecked → **HARD STOP**: sprint not complete. Run pending tasks first.
- No Active Sprint pointer in TODO.md → **HARD STOP**: nothing to rotate.

---

## Step 1 — Close Sprint File

1. Read sprint file (`docs/sprint/SPRINT-NNN-*.md`) — collect **Files Changed** table.
2. Set `status: complete`, `last_updated: [today]` in sprint file frontmatter.

---

## Step 2 — Archive to docs/CHANGELOG.md

Determine blueprint version bump:
- Any new mode / skill / agent / hard stop → `MINOR`
- Any phase / gate / hook contract change → `MAJOR`
- Clarification / doc-only / additive fix → `PATCH`

Build sprint block:

```
## Sprint N — [Sprint Name] ([date])

**Blueprint version:** [MAJOR|MINOR|PATCH] ([rationale])

| File | Change | ADR |
|:-----|:-------|:----|
| [one row per entry from sprint Files Changed table] |
```

1. Prepend sprint block immediately after CHANGELOG.md header/intro section (before first existing `## Sprint` entry).
2. Update CHANGELOG.md frontmatter: `last_updated: [date] (Sprint N archived)`.

---

## Step 3 — Update TODO.md

1. Replace Sprint N Changelog block in TODO.md with: `### Sprint N — Archived to docs/CHANGELOG.md ([date])`
2. Update TODO.md frontmatter: `last_updated: [date] (Sprint N closed)`, `sprint: N+1`.
3. Update Roadmap line N: append `(done — [task IDs])`.
4. Add Roadmap line: `Sprint N+1 → TBD — define next`.
5. Active Sprint section → `_Sprint N closed [date] — rotating to Sprint N+1_`.

---

## Step 4 — Auto-Promote from Backlog

Scan Backlog `[ ]` tasks P0 → P1 → P2 → P3. Skip:
- Tasks tagged `v2-deferred`
- Tasks with unresolved `depends-on` (dependency not yet done)

Collect 2–5 eligible tasks. Apply sprint weight scoring:

| Field | Score |
|:------|:------|
| `scope:quick` | 1 |
| `scope:full` | 3 |
| `risk:low` | 0 |
| `risk:medium` | 1 |
| `risk:high` | 2 |

Present proposed sprint (await `yes` or corrections; re-present on correction):

```
## Proposed Sprint N+1

**Theme**: [3–5 word label inferred from top tasks]
**Tasks**:
| Task | Title | Scope | Risk | Weight | Skills |
|:-----|:------|:------|:-----|:-------|:-------|
| [rows — weight = scope score + risk score] |
**Total weight**: N → [single-phase ≤6 | two-phase 7–12 | blocked]

Backlog <2 eligible → note this and list tasks to add manually.

Type 'yes' to create Sprint N+1, or adjust task list.
```

---

## Step 5 — Create Sprint N+1

On `yes`:

1. Generate sprint slug: kebab-case from theme, ≤25 chars.
2. Determine next sprint number (TODO.md `sprint:` field).
3. Create `docs/sprint/SPRINT-NNN-<slug>.md` using T-card format:

```markdown
---
owner: [from TODO.md owner field]
last_updated: [today]
update_trigger: sprint open / close / status change
status: active
plan_commit: —
close_commit: —
---

# Sprint NNN — <slug>

**Theme:** [theme]
**PRD:** Internal — [source of tasks]

---

## Plan

### T1 — TASK-NNN: [Title]

**Why:** [one sentence — rationale from task or acceptance context]

**Acceptance:**
[numbered list from task `acceptance` field]

**Files (likely):** [from task scope or "TBD"]

**Tests:** [none (doc-only) | unit | integration]

**Risk:** [low | medium | high]

**Depends on:** [TASK-NNN | none]

**ADR needed:** [yes | no]

**DoD:**
- [ ] [one checkbox per acceptance criterion]

**Confidence:** [80–95%]

---

[repeat for T2..T5]

---

## Execution Log

*(append during sprint — one line per task: TASK-NNN done [date]: [what changed])*

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|

---

## Decisions

*(append during sprint)*

---

## Open Questions for Review

*(append during sprint)*

---

## Retro

*(fill at sprint close — Worked / Friction / Pattern candidate)*
```

4. Mark promoted tasks in TODO.md Backlog: `~~TASK-NNN~~ promoted to Sprint N+1`.
5. Update TODO.md Active Sprint pointer: `→ [docs/sprint/SPRINT-NNN-<slug>.md](docs/sprint/SPRINT-NNN-<slug>.md)`.
6. Update TODO.md `last_updated` + `sprint: N+1`.

---

## Step 6 — Done

Output:

```
## Rotate Complete — Sprint N → Sprint N+1

Sprint N closed    → docs/sprint/SPRINT-NNN-<slug>.md (status: complete)
Archived           → docs/CHANGELOG.md (Sprint N block prepended)
Sprint N+1 created → docs/sprint/SPRINT-NNN-<slug>.md
Tasks promoted     : [TASK-NNN, ...]

Run `/dev-flow sprint` to execute Sprint N+1.
```
