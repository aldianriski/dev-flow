# dev-flow Hard Stops — Full List

All hard stops enforced by the dev-flow orchestrator. Any ❌ condition blocks progress until resolved.

```
❌ Gate 0 skipped — tracker "none" without justification
❌ Typecheck fails — show error, wait for fix
❌ Lint fails — show error, wait for fix
❌ Unit or integration tests fail — show error, wait for fix
❌ CRITICAL finding (review or security) — show full finding, require explicit override
❌ Architecture violation BLOCKING tier — require explicit acknowledgment
❌ quick mode: >3 files changed — confirm or upgrade to full
❌ Skill last-validated >6 months — warn, require acknowledgment before running
❌ Same fix attempted 3 times without passing — stop, question the architecture
❌ Session Close skipped — Phase 10 is mandatory after every commit
❌ HOW content in any doc file — redirect to code comment, never commit
❌ Migration file changed, migration-analyst not invoked — block commit
❌ CI non-green after push — block Session Close
❌ risk:high + api/repository/service layer, performance-analyst not invoked — block Gate 2
❌ resume mode invoked, design plan not found — re-run Gate 1 before proceeding
❌ init mode: code written before Gate B approval — hard stop, revert writes
❌ CLAUDE.md exceeds 200 lines — trim before proceeding
❌ Context turns >40 before a new phase — prune to 3-bullet summary, state this aloud
❌ Sprint mode: ≥28 turns (≈70% budget) before next phase entry — prune prior phase to 3-bullet summary first
```

## Context Threshold Warning

```
⚠️ CONTEXT THRESHOLD: [N] turns. Pruning previous phase.
   Summary (3 bullets): [bullet 1] / [bullet 2] / [bullet 3]
   Carried forward: [what is preserved]
   Dropped: [what is cleared]
```
