# Task Decomposer — Execution Procedure

**Step 1 — Intent Extraction**: detect input type; fetch ticket via env credentials (degrade gracefully if missing); spawn `scope-analyst` (READ-ONLY) for codebase impact — files, layers, API/DB change signals.

**Step 2 — Socratic Clarification** (freeform + ticket only): ask ONE question at a time; each resolves an ambiguity affecting scope, risk, or acceptance criteria; stop when goal is unambiguous; max 4 questions then present best-guess with explicit assumptions. PRD and `--from-architecture` skip this step.

**Step 3 — Assumption Registry**: surface all assumptions; human confirms or corrects before decomposing. Auth/security assumptions → always flag CRITICAL, require explicit confirmation. Format: `${CLAUDE_SKILL_DIR}/references/decomposition-spec.md` §Assumption Registry Format.

**Step 4 — Risk Scoring**:
```
BASE: low
→ medium: 2+ layers | API change | external service | new DB table
→ high:   3+ layers | auth/permission modified | existing DB schema altered |
          core shared middleware (>3 dependents) | data migration required
```

**Step 5 — Scope Assignment**: `full` if risk:high or layers>2 or api-change with cross-layer; `quick` if risk:low/medium and layers≤2 and single concern. Never assign `hotfix` — declared by human only.

**Step 6 — Granularity + Output**: apply granularity rules; run all 8 validation hard stops; **before presenting decomposition for human approval — read `templates/TODO.md.template` to confirm TASK row field alignment** (canonical source per ADR-030; mirrors lean-doc Step 6 template-load contract). If template missing → fallback to decomposition-spec.md inline spec; log as friction at sprint close. Present decomposition for human approval. See `${CLAUDE_SKILL_DIR}/references/decomposition-spec.md` for output template framing, validation rules, and granularity rules.

After `approve`: read TODO.md for next TASK number → insert into Backlog under correct P-level section → clear `.claude/.session-changes.txt` → emit **Flow Grill Seed** block to terminal (see Step 7). Sprint formation happens via `/lean-doc-generator` Sprint Promote, not here.

**Step 7 — Flow Grill Seed handoff** *(per ADR-036 DEC-7 · TASK-138 · v1.2.0+)*: after Backlog write, emit a `## Flow Grill Seed` block to the terminal as next-step handoff to `/lean-doc-generator` Sprint Promote. Block hydrates the Flow Grill ledger (see `lean-doc-generator/references/FLOW_GRILL.md` § Iteration Loop Step 1 Hydrate) so Promote does not re-ask confirmed assumptions, risk, or layers. Cold-start fallback: if Sprint Promote runs without seed (e.g. user invokes Promote without preceding decompose), Flow Grill iterates from empty ledger.

Seed shape (JSON-block in fenced code, additive output — does not change Backlog write contract):

```
## Flow Grill Seed

{
  "tasks": [
    { "id": "T1", "title": "...", "size": "S|M|L", "risk": "low|medium|high", "layers": [...], "acceptance": "..." }
  ],
  "assumptions": [
    { "id": "A1", "statement": "...", "confirmed": true, "source": "decompose-seed" }
  ],
  "risk": "low|medium|high",
  "layers": ["..."]
}
```

Field rules:
- `tasks[]` — one per Backlog row written; `id` matches sprint-positional T-number Promote will assign (T1..TN); `acceptance` = one-line AC summary.
- `assumptions[]` — confirmed assumptions from Step 3 Assumption Registry (any flagged-but-rejected during human review excluded); `confirmed: true` always at this stage; `source: "decompose-seed"` invariant for hydration provenance.
- `risk` — sprint-wide max from Step 4 Risk Scoring (e.g. if 2 tasks high + 3 medium → `high`).
- `layers` — union of all task layers (deduplicated).

Suppress seed block if zero tasks written (defensive guard; Backlog write returned empty under edge case).
