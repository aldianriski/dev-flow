---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); split from 10-modes.md (TASK-059)
---

## §18 — Session Resume Protocol

### Invocation

```bash
/dev-flow resume TASK-NNN
```

### Resume Algorithm

**Step 1 — State Detection** (Tier 1):
```markdown
Read TODO.md. Find TASK-NNN.
Read the approved design plan for TASK-NNN from the last Gate 1 output.

If design plan NOT found in context:
  → HARD STOP: "Design plan for TASK-NNN not found. Options:
     (a) Provide the Gate 1 plan manually (paste it here)
     (b) Re-run Gate 1 from the last known design-analyst output
     (c) Start from Gate 0 if the scope has changed"

If design plan found:
  → Find the first incomplete micro-task [ ] in the plan
  → Report: "Resuming at micro-task [N]: [description]"
  → Ask: "Does this match where you left off, or has something changed?"
```

**Step 2 — Context Reconstruction** (Tier 1-2):
```markdown
- Load only files relevant to the current micro-task (not the whole task)
- Do NOT re-read previously completed micro-tasks' files
- Run validation check: typecheck + lint on already-written files
  If validation fails → report failures before resuming implementation
```

**Step 3 — Continue from micro-task N**:
```markdown
Proceed with micro-task [N] as if Gate 1 just approved.
No re-design. No re-clarification.
If a decision needs to be re-made, ask ONE targeted question — do not re-run the full Clarify phase.
```

### Resume Output Format

```markdown
## Session Resume — TASK-NNN: [Title]

**Interrupted at**: [phase name + micro-task number]
**Context reconstructed**: [Y files loaded]
**Validation on existing work**: [pass | N failures — listed below]

**Resuming at micro-task [N]**: [description]
**Verification command**: [command from Gate 1 plan]

[if validation failures]:
**Must fix before resuming**:
- [file:line] — [issue]

Type 'continue' to resume implementation, or provide corrections.
```

---
