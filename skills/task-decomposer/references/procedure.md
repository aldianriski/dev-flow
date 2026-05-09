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

After `approve`: read TODO.md for next TASK number → insert into Backlog under correct P-level section → clear `.claude/.session-changes.txt`. Sprint formation happens via `/lean-doc-generator` Sprint Promote, not here.
