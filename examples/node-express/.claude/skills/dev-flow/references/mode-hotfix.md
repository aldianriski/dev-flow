# dev-flow — Hotfix Mode

No gates — safety checks mandatory.

```
⚠️ HOTFIX MODE ACTIVE
   Rollback readiness: [VERIFIED | MISSING — acknowledge to proceed]
   Lint on changed files: [results — non-blocking]
   >3 files? Pause and confirm with human.
   Post-commit: /adr-writer incident ADR prompted automatically.
```

Workflow: `TRIAGE → ROLLBACK CHECK → IMPLEMENT → FAST VALIDATE → COMMIT → SMOKE TEST → INCIDENT ADR → SESSION CLOSE`
