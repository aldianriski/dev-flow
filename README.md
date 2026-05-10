---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Component or outcome registry change
status: current
---

# dev-flow — Agentic Engineering Workflow Starter

Claude Code plugin: gate-driven workflow + skill library + agent roster for any software project. **v4.0.0 — Flow Grill + audit-driven cleanup (15 skills · 6 agents)**

Drop into any repo to get a human-gated AI workflow. Dispatcher delegates to specialists. Humans approve gates. No app code required.

## What Your Project Gets

dev-flow is a means; **your project is the end**. The plugin claims 8 user-project outcomes — every component supports ≥1 outcome and ships with a counter-evidence ("skip when…") row in [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md).

| Outcome | What it means | How dev-flow delivers |
|:--------|:--------------|:----------------------|
| **onboard** — faster onboarding | New contributor productive day-1 in unfamiliar repo | `/prime` ordered context load · `/zoom-out` module map · codemap L0 in CLAUDE.md |
| **doc-rot** — less doc rot | Docs reflect current code; stale frontmatter caught | `lean-doc-generator` frontmatter discipline · PostToolUse codemap-refresh · `last_updated` triggers |
| **architecture** — clearer architecture | Shared mental model of modules, boundaries, decisions | `architecture-grill` grill mode · `adr-writer` registry · 3-tier codemap |
| **rework** — fewer rework cycles | Scope/design issues caught BEFORE implementation | G1 Scope + G2 Design gates · `task-decomposer` vertical slices |
| **flow** — optimal harness flow | Workflow runs end-to-end without friction | `dispatcher` orchestration · 4 modes · 3 hooks · skill auto-discovery |
| **correction** — workflow correction | Mid-flight redirect when work goes off-track | `BLOCKED` analyst findings · skill red flags · grill mode |
| **template** — init / template audit | Every new project starts from same scaffold baseline | `/orchestrator init` deterministic scaffold · sprint+ADR templates · `write-a-skill` standards |
| **reliability** — plugin reliability | Plugin updates don't regress your project's workflows | Eval harness shipped (acceptance Mode A · caveman 3-arm token-compression · cap-headroom lint 16/16 OK) · skill-trigger discipline · ADR-016 eval-evidence rule |

What dev-flow does **NOT** claim: app-code generation · CI/CD pipeline · automated coverage tooling · project-management replacement · telemetry of user-project metrics. Honest scope → [`docs/USER-OUTCOMES.md` § Anti-outcomes](docs/USER-OUTCOMES.md).

## What You Get

Plugin auto-discovers components at repo root after install. All counts verified against filesystem.

| Component | Count | What it does |
|:----------|:------|:-------------|
| Gates     | 2     | G1 Scope + G2 Design checkpoints before any commit |
| Modes     | 4     | `init` · `quick` · `mvp` · `sprint-bulk` (operational context) |
| Skills    | 15    | User-invokable slash commands (`skills/<name>/SKILL.md`) — architecture-grill merged into design-analyst v4.0.0 per ADR-037 |
| Agents    | 6     | 6 specialists (design / code-reviewer / scope / security / performance / migration) — dispatcher role lives in orchestrator skill per ADR-037 |
| Hooks     | 3     | SessionStart bootstrap · PreToolUse chain-guard · PostToolUse codemap-refresh |
| Scripts   | 10    | 8 Node (`audit-baseline` · `audit-tokens` · `eval-acceptance` · `eval-caveman` · `eval-measure` · `eval-skills` · `propagate-output-discipline` · `scan-legacy-docs`) + 2 PowerShell (`session-start.ps1` · `codemap-refresh.ps1`) |

[`.claude/CONTEXT.md`](.claude/CONTEXT.md) is the single source of truth for vocabulary, gates, modes, and agent roster.

## How to Adopt

**Plugin install (recommended):**

```bash
claude plugin marketplace add https://github.com/aldianriski/dev-flow
# in your project directory:
/orchestrator init
```

`/orchestrator init` scaffolds three files into your project root:

| Provided by plugin                        | Created by `init`                  |
|:------------------------------------------|:-----------------------------------|
| `skills/`, `agents/`, `hooks/` (auto-loaded) | `CLAUDE.md`, `CONTEXT.md`, `TODO.md` |

**Scaffold copy (fallback):**

```bash
git clone https://github.com/aldianriski/dev-flow.git
node bin/dev-flow-init.js
```

**Requirements:** Claude Code CLI · Node.js ≥18 · PowerShell ≥5.1 (Windows hooks). Full dependency list → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § Integration Points.

## How You Use It

A gated workflow: you give intent → plugin converts to tasks → executes with human checkpoints → ships. You only type ~5 commands per feature; everything else runs inside those commands.

| Daily entry points | When |
|:-------------------|:-----|
| `/prime` | every session start |
| `/task-decomposer "<intent>"` | new feature/bug |
| `/lean-doc-generator` (sprint promote/close) | per sprint |
| `/orchestrator sprint-bulk` | execute the sprint |
| `/diagnose` · `/refactor-advisor` · `/release-patch` · `/security-review` | as needed |

Full helicopter view (3-layer mental model · entry-points table · end-to-end lifecycle ASCII · good-behavior rules) → [`docs/HOW-YOU-USE-IT.md`](docs/HOW-YOU-USE-IT.md).

## First Sprint Walkthrough

Zero → first sprint complete: install (above) → `/prime` → `/task-decomposer` → `/lean-doc-generator` sprint promote → `/orchestrator` sprint-bulk → `/lean-doc-generator` sprint close. Full step-by-step + lifecycle ASCII → [`docs/HOW-YOU-USE-IT.md`](docs/HOW-YOU-USE-IT.md).

## Skills · Agents · Hooks · Scripts

15 skills + 6 specialist agents (dispatcher role lives in orchestrator skill per ADR-037) + 3 hooks (SessionStart · PreToolUse chain-guard · PostToolUse codemap-refresh) + 10 scripts (Node + PowerShell).

Canonical mappings:
- Per-component **outcomes + skip-when** → [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md)
- Trigger conditions + agent roster + dispatch rules → [`.claude/CONTEXT.md`](.claude/CONTEXT.md)
- Hook wiring → [`hooks/hooks.json`](hooks/hooks.json) · script index → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § Component Map

## Working on This Repo

Read [`TODO.md`](TODO.md) first to see active sprint state. Contribution flow (versioning · skill-change protocol · breaking-change policy) → [`CONTRIBUTING.md`](CONTRIBUTING.md). Friction reports → [`docs/SUPPORT.md`](docs/SUPPORT.md). Full session-workflow pattern guide → [`docs/blueprint/12-session-workflow.md`](docs/blueprint/12-session-workflow.md).

## Further Reading

- [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md) — user-project outcome registry (every component → outcome + counter-evidence)
- [`.claude/CONTEXT.md`](.claude/CONTEXT.md) — vocabulary · gates · modes · agent roster (single source of truth)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — component map · key patterns · integration points · security boundaries
- [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md) — patterns · conventions · current focus
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — versioning · change process · breaking-change policy
- [`docs/SUPPORT.md`](docs/SUPPORT.md) — friction reports · support channel
- [`docs/adr/`](docs/adr/) — ADR registry (architectural decision records ≥016; ≤015 frozen in [`docs/DECISIONS.md`](docs/DECISIONS.md))
- [`docs/codemap/CODEMAP.md`](docs/codemap/CODEMAP.md) — 3-tier codemap (L0 in CLAUDE.md · mid-tier here · `handoff.json` envelope)

## License

MIT — see [LICENSE](LICENSE).
