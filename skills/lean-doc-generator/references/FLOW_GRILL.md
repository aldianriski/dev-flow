# Flow Grill — terminal-first planning convergence

> Canonical reference for the iterative Q&A loop that converges sprint OQs BEFORE any sprint document is written. Loaded by `lean-doc-generator` Sprint Promote, consumed by `orchestrator` sprint-bulk Phase 1. Anchor: ADR-036.

---

## Overview

Replaces three context-forking stages (`task-decomposer` → `lean-doc Sprint Promote` Steps 3-7 → `orchestrator sprint-bulk` G1+G2 batch) with one terminal-first iterative loop. Open Questions live in conversation as a session-scoped ledger; sprint file written ONLY after `lock` keyword consumed.

**User-Project Outcome:** O5 flow + O8 plugin reliability (`docs/USER-OUTCOMES.md`).

---

## Q&A Discipline

**Batched + follow-up pattern** (per ADR-036 DEC-3):

- **Batch independent questions** — ≤5 per terminal turn, grouped by concern (scope / risk / acceptance / handoff / anti-slip).
- **Solo dependent questions** — Q whose framing depends on a prior answer goes in next turn after that answer lands.
- **Solo open-ended questions** — "what should X be?" produces summary glosses if batched. Always 1-per-turn.
- **Follow-up trigger** — answer matching `<8 chars` OR `/maybe|sort of|kinda|whatever|i guess|probably/i` fires a clarification turn before next batch.
- **Distinct from `architecture-grill`** — that skill keeps strict 1-per-turn for high-stakes design where question dependence is the norm. Flow Grill batched form is for routine planning convergence.

---

## Open Questions Ledger Schema

Session-scoped JSON-shaped block (NOT persisted until `lock`):

```
{
  "sprint": "057", "iteration": 3, "seed_source": "task-decomposer | cold-start",
  "tasks": [{ "id": "T1", "title": "...", "size": "S|M|L", "risk": "low|medium|high", "layers": [...], "acceptance": "..." }],
  "assumptions": [{ "id": "A1", "statement": "...", "confirmed": bool, "source": "decompose-seed | grill-iter-N" }],
  "open_questions": [{ "id": "Q1", "concern": "scope|risk|acceptance|handoff|anti-slip", "text": "...", "answer": "..." | null, "follow_up_fired": bool }],
  "anti_slip": { "focus": "...", "context_budget": "~25k | no-limit", "explicit_gaps": [...], "done_confirmation": "[X] WHEN [Y]" },
  "decisions_pre_locked": [{ "id": "D-A", "statement": "..." }],
  "status": "iterating | reviewing | locked"
}
```

Rendered to terminal compactly per CONTEXT.md § Output Discipline.

---

## Iteration Loop

```
Step 1 — Hydrate
  if task-decomposer seed present (## Flow Grill Seed JSON block):
    populate ledger.tasks + assumptions + risk + layers from seed; skip already-confirmed Qs
  else: cold-start

Step 2 — Surface batch
  emit ≤5 independent Qs per Q&A Discipline rules; one terminal turn → wait for batch answer

Step 3 — Ingest answers
  for each answer:
    if matches follow-up trigger → fire clarification turn (solo Q)
    else → write to ledger.open_questions[id].answer
  advance ledger.iteration

Step 4 — Detect convergence
  all required fields populated (tasks · assumptions · risk · layers · anti_slip 4 · decisions_pre_locked)?
    yes → Step 5 (Review)
    no  → Step 2 (next batch)

Step 5 — Review (see Review-Before-Lock)
```

---

## Review-Before-Lock Step

Non-skippable per ADR-036 DEC-4. Between iteration and `lock`:

1. **Emit converged ledger summary** — tasks (id+title+size+risk) · assumptions confirmed count · risk score · anti-slip 4 fields · decisions pre-locked · open uncertainty.
2. **Prompt** — three keywords accepted:
   ```
   confirm        — acknowledge review (no-op pass; lets you read once more before lock)
   revise <field> — re-enter loop at named field
   lock           — freeze ledger and write sprint file
   ```
3. **`confirm`** — re-emit summary; re-prompt. Acknowledgment without write.
4. **`revise <field>`** — re-enter Step 2 at named field; preserve unrelated state.
5. **`lock`** — irreversible. Ledger frozen. Hand off to Sprint Promote Step 5.

---

## Lock Semantics

Mirrors `task-decomposer approve` keyword (`task-decomposer/SKILL.md:52`).

- **Pre-lock:** ledger session-scoped, NOT on disk. Abandoning session loses ledger (intentional convergence pressure).
- **Post-lock:** ledger consumed by Sprint Promote Step 5 → sprint file written → frontmatter `status: planning`.
- **Plan-locked commit** (existing `sprint(NNN): plan locked` convention) follows write; `status: planning → active` on SHA fill.
- **Post-lock edits** go to § Execution Log § Surprise per existing protocol; ledger itself not edited post-lock.

---

## Handoff Envelope (to Sprint Promote Step 5)

On `lock`, ledger consumed with these mappings:

| Ledger field | Sprint file destination |
|---|---|
| `tasks[]` | § Plan task list |
| `assumptions[].confirmed=true` | § Decisions pre-locked at promote |
| `anti_slip.{focus, context_budget, explicit_gaps, done_confirmation}` | § Plan / G1 rows (4 anti-slip fields) |
| `decisions_pre_locked[]` | § Decisions pre-locked block |
| `open_questions[].answer=null` | § Open Questions for Review (only unresolved) |

**No re-asking at orchestrator sprint-bulk Phase 1.** G1 batch reads anti-slip fields from frozen sprint file; G2 batch consumes locked tasks list directly. Phase 1+2 collapse into "consume locked Flow Grill ledger" — see `orchestrator/references/phases.md § sprint-bulk`.

---

## Context Budget Across Skills

Quantifies the 3× → 1× collapse target (ADR-036 DEC-6):

| Stage | Pre-Flow-Grill loads | Post-Flow-Grill loads |
|---|---|---|
| `task-decomposer` (fork) | CONTEXT.md · TODO.md · decomposition-spec.md · scope-analyst output (~6 files) | CONTEXT.md · TODO.md · decomposition-spec.md (~3 files); emits seed |
| `lean-doc Sprint Promote` (fork) | CONTEXT.md · TODO.md · DOCS_Guide.md · SPRINT_PROTOCOLS.md · sprint template (~5 files) | FLOW_GRILL.md · SPRINT_PROTOCOLS.md (~2 files; CONTEXT.md cached) |
| `orchestrator sprint-bulk` G1+G2 batch | CONTEXT.md · TODO.md · phases.md · skill-dispatch.md + 2 agent forks | reads locked sprint frontmatter only (0 fresh loads, 0 forks) |
| **Total per planning cycle** | **3× CONTEXT.md · 3× TODO.md · 3× protocol-doc · 2 agent forks** | **1× CONTEXT.md · 1× TODO.md · 1-2× protocol-doc · 0 forks** |

**Caveat:** measured in file-loads, not raw tokens. SPRINT_PROTOCOLS.md (~1k lines) eliminating one re-load saves ~5-7k tokens. Estimated savings per planning cycle: ~20-30k tokens (Sprint 055b T1 audit baseline).

---

## Anti-Slip Field Mapping (ADR-031)

The 4 anti-slip fields (`focus` · `context-budget` · `explicit-gaps` · `done-confirmation`) are NOT duplicated between G1 and ledger — gathered iteratively in the ledger (concern: anti-slip), READ from frozen sprint frontmatter at orchestrator sprint-bulk Phase 1. Single mechanism replaces parallel collection. Backward compatible: G1 fields persist in sprint file frontmatter as before; only the COLLECTION path changes.

---

## Hard Rules

- **Never write sprint file before `lock`** — pre-lock ledger session-scoped only.
- **Never batch dependent or open-ended questions** — solo only. Failure: one-word glosses miss edge cases.
- **Never skip review-before-lock** — even if all Qs resolved cleanly, emit summary + prompt.
- **Never persist pre-lock ledger to disk** — no "draft" file. Convergence pressure depends on session-scoping.
- **Anti-slip 4 fields ALL required at lock** — partial fill blocks lock; re-enter loop at missing field.
- **Seed hydration is opt-in** — if `task-decomposer` seed missing, cold-start; do not error.

---

## Red Flags

| Rationalization | Reality |
|:---|:---|
| "User said 'sure' to all 5 — done" | Vague answers slip; follow-up trigger MUST fire on `<8 chars` OR vague-tokens regex |
| "I'll write sprint file now, review later" | Pre-lock disk write violates DEC-2 |
| "Anti-slip not gathered, tasks clear — lock" | DEC-5 requires all 4 at lock; re-enter loop |
| "Batched Q3 dependent on Q1 — fine" | Forces premature commitment; solo dependent Qs always |
| "Skip review — user saw answers in batches" | DEC-4 non-skippable; review surfaces accumulated state |

---

## References

- ADR-036 — anchor decision (3-into-1 collapse · DEC-1..DEC-7).
- ADR-031 — anti-slip discipline (4 fields preserved as ledger rows).
- ADR-033 — Output Discipline (compact terminal rendering).
- ADR-034 — History Hygiene (plugin-principle pattern shape source).
- `task-decomposer/references/procedure.md` Step 6 — Flow Grill Seed emission (T4 / TASK-138).
- `lean-doc-generator/references/SPRINT_PROTOCOLS.md` § Sprint Promote Steps 3-7 — replaced by this loop (T2 / TASK-136).
- `orchestrator/references/phases.md` § sprint-bulk Steps 1+2 — collapsed to consume-locked-ledger (T3 / TASK-137).
- `agents/dispatcher.md` — reads locked ledger before dispatching scope-analyst + design-analyst (T3 / TASK-137).
- Memory: `feedback_plugin_principle_pattern.md` — pattern source.
