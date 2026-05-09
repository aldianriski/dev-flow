---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Skill or mode change in /prime, /lean-doc-generator, or /orchestrator; new session pattern emerges
status: current
source: TASK-127 (Sprint 051b fold-in); session 2026-05-08 user finding "vision is not visible"
---

## §12 — Session Workflow Pattern Primer

dev-flow's intended session pattern is a 3-step sequence: `/prime` → `/lean-doc-generator` → `/orchestrator`. This primer codifies the pattern user-facing so it's not scattered across SKILL.md files. Companion: [`11-lean-architecture.md`](11-lean-architecture.md).

---

## The Problem

Three failure modes that the 3-step pattern prevents:

1. **AI context resets between sessions.** Without an ordered context load, the AI starts cold each session — re-reads files in arbitrary order, mismatches active sprint state, asks questions whose answers are already in `MEMORY.md` or sprint plan. Wasted tokens; wasted human time.
2. **Stale docs cause AI to reason against wrong state.** ARCHITECTURE.md last updated 60 sprints ago describes a layer set the code no longer uses. AI generates suggestions against the doc, not the code. Drift compounds.
3. **Executing without planning leads to scope drift.** Direct-to-implementation skips G1 Scope + G2 Design gates. Missing constraints surface mid-task; rework follows.

The 3-step pattern is the standing-order remedy: load context → align docs → execute with gates.

---

## The 3-Step Pattern

```
/prime                  →   /lean-doc-generator      →   /orchestrator
(load context)              (align docs)                 (execute task with gates)
```

**Pattern invariants:**
- **Always in this order.** Reversing fails: orchestrator without prime executes against stale CLAUDE.md; lean-doc without prime can miss the active sprint plan.
- **Steps 2 and 3 are conditionally skippable** (see § When Each Step Is Optional below). Step 1 is never skipped.
- **One pass per session.** Run the full sequence at session start; subsequent tasks within the same session don't re-run /prime unless context was cleared.

---

## When Each Step Is Optional

| Step | Skip when |
|:-----|:----------|
| `/prime` | **Never.** First action of every session. |
| `/lean-doc-generator` | No code landed since last run AND docs frontmatter all `current` AND no architectural decisions pending → skip. Otherwise run. |
| `/orchestrator` | Task is a direct skill invocation (e.g., `/zoom-out` for orientation, `/adr-writer` for a decision, `/diagnose` for debugging) → skip. Orchestrator is for gate-driven task execution. |

---

## Step 1 — `/prime` Detail

**What it reads (ordered):**
1. `.claude/CLAUDE.md` — project AI context (file structure, anti-patterns, commands)
2. `.claude/CONTEXT.md` — vocabulary, gates, modes, agent roster
3. `MEMORY.md` (auto-memory index) — past sessions' user preferences + project state
4. `TODO.md` — backlog + Active Sprint
5. `docs/sprint/SPRINT-NNN-*.md` — active sprint plan (if frontmatter `sprint: NNN`)
6. `docs/codemap/CODEMAP.md` — L0 module map

**What it outputs:** PRIME HEALTH report (file presence + active sprint state + open task count + flow continuation hint).

**Anti-patterns:**
- Don't skip /prime "to save time" — re-loading context costs less than reasoning against stale state.
- Don't re-read files within same session that haven't changed (SHA1 cache handles this; trust it).
- Don't summarize files inline — emit pointers, not paraphrases (per `skills/prime/SKILL.md` Step 6).

---

## Step 2 — `/lean-doc-generator` Detail

**What it checks:**
- Ownership header frontmatter on every doc (owner role, last_updated, update_trigger, status).
- Staleness flags (`status: stale`, `status: needs-review`, `last_updated >60 days`).
- Codemap freshness (auto-fired post-commit; verify L0 reflects current module map).
- Sprint state alignment with TODO.md (frontmatter `sprint:` matches Active Sprint pointer).

**Three modes:**
- **Sprint Promote** — write sprint plan, flip frontmatter, populate Active Sprint.
- **Sprint Close** — verify DoD, sync § Files Changed against `git diff`, fill Retro, flip frontmatter back to `none`.
- **Mid-sprint doc-align** — generate or update individual docs (ARCHITECTURE.md, ADR, README) per Core Files spec.

**Anti-patterns:**
- Never write HOW content — redirect to code comments. lean-doc-generator's Golden Rule.
- Never raise line caps to fit content — split or compress.
- Don't run before /prime (skill expects loaded context).

---

## Step 3 — `/orchestrator` Detail

**Mode selection:**

| Mode | Gates | Use |
|:-----|:------|:----|
| `init` | none | First-time scaffold (no `.claude/` exists). |
| `quick` | G1 | Single task, S size (≤2h), low risk. |
| `mvp` | G1 + G2 | Feature work, M+ size (≤1d), multi-task. |
| `sprint-bulk` | G1 + G2 (batched once per sprint) | Multi-task sprint; auto-loops Active Sprint tasks. |

**How dispatcher routes:**
- G1 may auto-spawn `scope-analyst` (size unclear) → reports back to dispatcher.
- G2 (mvp + sprint-bulk) auto-spawns `design-analyst` → returns DONE / DONE_WITH_CONCERNS / BLOCKED.
- Post-implementation, dispatcher proposes `code-reviewer`; human approves.
- DB schema change detected → dispatcher proposes `migration-analyst`.
- Hot-path / api / db touched + high risk → dispatcher proposes `performance-analyst`.
- Security audit → user runs separate `/security-review` session (never same context per ADR-015).

**Gate behavior:**
- G1 Scope gate: human reviews goal + size + constraints + red flags before any implementation.
- G2 Design gate: human reviews design-analyst report; BLOCKED finding halts sprint.
- Auto-loop in sprint-bulk: iterates Active Sprint `[ ]` tasks; halts on first BLOCKED or human "block".

**Anti-patterns:**
- Don't skip G1 — unconfirmed scope causes regressions.
- Don't run mvp on L-size task — split first.
- Don't override BLOCKED finding without explicit human decision recorded in sprint plan.

---

## Full Session Example

```
[session start]
> /prime
PRIME HEALTH: CLAUDE.md ✓  CONTEXT.md ✓  MEMORY.md ✓  sprint: 051b ✓
Active Sprint: 6 tasks · 2 open · next = T5 (blueprint/12 + README expansion)

> /lean-doc-generator
[Sprint Execute mode — mid-sprint doc-align]
Staleness scan: all docs current. No action needed before T5.

> /orchestrator
[Resume Active Sprint 051b · sprint-bulk mode · T5 next]
G1 already passed at sprint promote. G2 already batched. Auto-loop continues.
T5 — write docs/blueprint/12-session-workflow.md + expand README.md line 152
Implementing... (commits T5) → propose code-reviewer? [y/n]

> n  (doc-only diff)
T5 closed. T6 (sprint close) is next.
```

**When to stop and ask:**
- Mid-sprint, ANY analyst returns BLOCKED — orchestrator halts; human decides.
- Mid-sprint, AI surfaces unexpected scope — orchestrator prompts "fix now / defer / block" (TASK-123 F5 mechanic).
- Mid-sprint, requirements feel ambiguous — invoke grill mode (one-question-at-a-time interview before G2).

---

## Quick Reference

| Step | Command | Purpose |
|:-----|:--------|:--------|
| 1 | `/prime` | Load ordered context (always first) |
| 2 | `/lean-doc-generator` | Align docs to current code state |
| 3 | `/orchestrator` | Execute task with gates (mode: init / quick / mvp / sprint-bulk) |

**See also:**
- [`11-lean-architecture.md`](11-lean-architecture.md) — CA+DDD canonical primer
- [`skills/prime/SKILL.md`](../../skills/prime/SKILL.md) — /prime detailed spec
- [`skills/lean-doc-generator/SKILL.md`](../../skills/lean-doc-generator/SKILL.md) — /lean-doc-generator spec
- [`skills/orchestrator/SKILL.md`](../../skills/orchestrator/SKILL.md) — /orchestrator spec
- [`.claude/CONTEXT.md`](../../.claude/CONTEXT.md) — gates, modes, agent roster
