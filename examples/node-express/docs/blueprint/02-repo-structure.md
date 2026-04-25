---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR version bump; new agent/skill/script added to the scaffold
status: current
source: AI_WORKFLOW_BLUEPRINT.md §2 (split TASK-004)
---

# Blueprint §2 — Repository File Structure

```
[repo-root]/
├── .claude/
│   ├── CLAUDE.md                    ← always-loaded AI context (project conventions)
│   ├── settings.json                ← harness hooks (session-start, lint on commit, typecheck on push)
│   ├── settings.local.json          ← tool allow-list (gitignored — per machine)
│   ├── scripts/
│   │   ├── session-start.js         ← bootstrap validation (settings.local, CLAUDE.md size, skill staleness)
│   │   ├── read-guard.js            ← PreToolUse hook: enforces Thin-Coordinator Rule (see §1, §6)
│   │   ├── track-change.js          ← PostToolUse hook: file change tracker for scope guard
│   │   └── ci-status.js             ← PostToolUse hook: CI pipeline poller after git push
│   ├── agents/                      ← subagent definitions (specialist workers)
│   │   ├── design-analyst.md        ← Phase 2: read-only codebase explorer (standalone)
│   │   ├── init-analyst.md          ← INIT mode: preloads system-design-reviewer
│   │   ├── code-reviewer.md         ← Phase 6: thin wrapper — preloads pr-reviewer skill
│   │   ├── security-analyst.md      ← Phase 7: thin wrapper — preloads security-auditor skill
│   │   ├── migration-analyst.md     ← conditional (§19): migration safety checker
│   │   ├── performance-analyst.md   ← conditional (§20): performance gate agent
│   │   └── scope-analyst.md         ← spawned by task-decomposer: read-only impact reader
│   └── skills/                      ← ALL skills live here (git-tracked, team-shared)
│       ├── MANIFEST.json            ← machine-readable phase→skill binding registry (see §5)
│       ├── dev-flow/
│       │   └── SKILL.md             ← orchestrator slash command
│       ├── task-decomposer/
│       │   └── SKILL.md             ← freeform intent → structured TASK-NNN (see §22)
│       ├── adr-writer/
│       │   └── SKILL.md             ← universal
│       ├── refactor-advisor/
│       │   └── SKILL.md             ← universal (context: fork)
│       ├── security-auditor/
│       │   └── SKILL.md             ← customize per stack (context: fork)
│       ├── pr-reviewer/
│       │   └── SKILL.md             ← customize per project architecture (context: fork)
│       ├── system-design-reviewer/
│       │   └── SKILL.md             ← customize per architecture principles (context: fork)
│       ├── lean-doc-generator/
│       │   ├── SKILL.md             ← universal
│       │   └── reference/
│       │       ├── DOCS_Guide.md    ← lean documentation standard (supporting file)
│       │       └── VALIDATED_PATTERNS.md ← doc pattern templates (supporting file)
│       ├── release-manager/
│       │   └── SKILL.md             ← customize per VCS (Bitbucket/GitHub/GitLab)
│       └── [stack-specific skills]/
│           └── SKILL.md             ← see §5 for stack-specific skill list
│
│   NOTE: `/simplify` is a Claude Code bundled skill — no SKILL.md needed.
│
├── TODO.md                          ← unified tracker: dev-flow tasks + session protocol + sprint log
│                                       (parsed by dev-flow orchestrator AND lean-doc-generator)
├── docs/
│   ├── README.md                    ← navigation hub (50 lines max — lean doc standard)
│   ├── ARCHITECTURE.md              ← WHY the system is structured this way (150 lines max)
│   ├── DECISIONS.md                 ← ADR records (unlimited — one entry per decision)
│   ├── SETUP.md                     ← getting started (100 lines max)
│   ├── AI_CONTEXT.md                ← machine-readable AI assistant context (100 lines max)
│   ├── CHANGELOG.md                 ← permanent sprint history archive (append-only, newest first)
│   └── TEST_SCENARIOS.md            ← test coverage map + gap analysis (Tier 2+)
└── context/
    └── workflow/
        └── AGENTS.md               ← WHY/WHERE for the workflow itself

NOTE: All docs/ files follow the LEAN DOCUMENTATION STANDARD (WHY and WHERE only, never HOW).
      Generated and maintained by `/lean-doc-generator`. See §8 for the unified TODO.md format.
```
