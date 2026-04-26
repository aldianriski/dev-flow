---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); split from 10-modes.md (TASK-059)
---

## §21 — Hardened Hotfix Mode

> No gates, but mandatory safety checks that cannot be skipped.

### Invocation

```bash
/dev-flow hotfix
```

### Hotfix Workflow

```
TRIAGE → ROLLBACK CHECK → IMPLEMENT → FAST VALIDATE → COMMIT → POST-DEPLOY VERIFY → INCIDENT ADR → SESSION CLOSE
```

### Phase H-1: Triage

```markdown
HOTFIX MODE ACTIVE — no gates, production emergency protocol.

Answer:
1. What is broken? (one sentence — observable symptom, not assumed cause)
2. What is the blast radius? (users affected, revenue impact, data at risk?)
3. When did it start? (time + what changed before it started)
4. Is there a known rollback available? (revert commit, feature flag, config change)
5. Fastest fix hypothesis: [likely cause, stated as hypothesis not fact]
```

### Phase H-2: Rollback Readiness Check

```markdown
Rollback option A — Revert commit:
  git log --oneline -10
  Revert command: git revert [SHA] --no-edit

Rollback option B — Feature flag:
  [flag name] = false → disables the broken feature

Rollback option C — Config change:
  [config key] → [rollback value]

If NO rollback is available:
  ⚠️ WARN: No rollback path identified. Human must acknowledge before implementation starts.
```

### Phase H-3: Implement

```
- Fix the minimal change that addresses the root cause — not a refactor
- If the fix requires touching >3 files: pause and confirm with human
- State the hypothesis being tested before writing code
- After writing: state what the code changes and why it fixes the symptom
```

### Phase H-4: Fast Validate (non-blocking warnings)

```bash
[lint-command] --only-changed
[typecheck-command]
[unit-test-command] --only-changed
```

Output:
```
⚠️ HOTFIX VALIDATION (non-blocking):
   Lint:      [pass | N warnings]
   Typecheck: [pass | N errors]
   Tests:     [pass | N failures]
   
   [If any failures]: Must be resolved in a follow-up task immediately after hotfix.
   Proceeding — human confirms to commit.
```

### Phase H-5: Commit + Deploy

```
hotfix([scope]): [what was fixed — one line]

Root cause: [one sentence]
Symptom: [what was observed]
Fix: [what code change resolves it]
Rollback: git revert [this-commit-SHA]

Refs: [incident ticket URL if available]
```

After commit → git push → ci-status.js runs automatically.

### Phase H-6: Post-Deploy Smoke Test

```markdown
Deploy complete. Run these smoke tests to verify the fix:

- [ ] [Specific endpoint or action that was broken] → expected: [result]
- [ ] [Adjacent feature most likely to regress] → expected: [result]
- [ ] [Monitoring check] → expected: error rate < [threshold]%

Report results. If any fail: run rollback procedure (documented in Phase H-2).
```

### Phase H-7: Incident ADR (mandatory)

```markdown
Run /adr-writer for incident ADR.

Context:
- Incident: [title from triage]
- Root cause: [identified cause]
- Fix applied: [commit SHA + description]
- Rollback plan: [from Phase H-2]
- Time to resolve: [triage start → deploy confirmation]
- Follow-up tasks needed: [lint/typecheck failures, regression prevention, monitoring]

ADR format for incidents:
## ADR-NNN: [Incident Title] — Post-Mortem Decision

**Status**: decided
**Date**: [today]
**Context**: [what happened and why]
**Decision**: [what fix was applied and why this approach]
**Consequences**:
- Positive: [incident resolved]
- Negative: [technical debt created, if any]
- Follow-up: [tasks to prevent recurrence]
```

### Phase H-8: Session Close

Standard Phase 10 plus:

```markdown
**Hotfix post-mortem checklist**:
- [ ] Incident ADR written and committed
- [ ] Follow-up tasks added to TODO.md Backlog (P0)
- [ ] Monitoring/alerting verified (error rate returned to baseline)
- [ ] Team notified (if applicable)
- [ ] Rollback procedure documented in incident ADR
```

---
