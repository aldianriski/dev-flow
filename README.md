---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Component or outcome registry change
status: current
---

# dev-flow — Agentic Engineering Workflow Starter

Claude Code plugin: gate-driven workflow + skill library + agent roster for any software project. **v2.5.0**

Drop into any repo to get a human-gated AI workflow. Dispatcher delegates to specialists. Humans approve gates. No app code required.

## What Your Project Gets

dev-flow is a means; **your project is the end**. The plugin claims 8 user-project outcomes — every component supports ≥1 outcome and ships with a counter-evidence ("skip when…") row in [`docs/USER-OUTCOMES.md`](docs/USER-OUTCOMES.md).

| Outcome | What it means | How dev-flow delivers |
|:--------|:--------------|:----------------------|
| **onboard** — faster onboarding | New contributor productive day-1 in unfamiliar repo | `/prime` ordered context load · `/zoom-out` module map · codemap L0 in CLAUDE.md |
| **doc-rot** — less doc rot | Docs reflect current code; stale frontmatter caught | `lean-doc-generator` frontmatter discipline · PostToolUse codemap-refresh · `last_updated` triggers |
| **architecture** — clearer architecture | Shared mental model of modules, boundaries, decisions | `system-design-reviewer` grill mode · `adr-writer` registry · 3-tier codemap |
| **rework** — fewer rework cycles | Scope/design issues caught BEFORE implementation | G1 Scope + G2 Design gates · `task-decomposer` vertical slices |
| **flow** — optimal harness flow | Workflow runs end-to-end without friction | `dispatcher` orchestration · 4 modes · 3 hooks · skill auto-discovery |
| **correction** — workflow correction | Mid-flight redirect when work goes off-track | `BLOCKED` analyst findings · skill red flags · grill mode |
| **template** — init / template audit | Every new project starts from same scaffold baseline | `/orchestrator init` deterministic scaffold · sprint+ADR templates · `write-a-skill` standards |
| **reliability** — plugin reliability | Plugin updates don't regress your project's workflows | Eval harness (acceptance + caveman 3-arm; queued v1 prereq) · skill-trigger discipline · ADR-016 eval-evidence rule |

What dev-flow does **NOT** claim: app-code generation · CI/CD pipeline · automated coverage tooling · project-management replacement · telemetry of user-project metrics. Honest scope → [`docs/USER-OUTCOMES.md` § Anti-outcomes](docs/USER-OUTCOMES.md).

## What You Get

Plugin auto-discovers components at repo root after install. All counts verified against filesystem.

| Component | Count | What it does |
|:----------|:------|:-------------|
| Gates     | 2     | G1 Scope + G2 Design checkpoints before any commit |
| Modes     | 4     | `init` · `quick` · `mvp` · `sprint-bulk` (operational context) |
| Skills    | 16    | User-invokable slash commands (`skills/<name>/SKILL.md`) |
| Agents    | 7     | dispatcher + 6 specialists (design / code-reviewer / scope / security / performance / migration) |
| Hooks     | 3     | SessionStart bootstrap · PreToolUse chain-guard · PostToolUse codemap-refresh |
| Scripts   | 4     | 2 Node (`audit-baseline.js`, `eval-skills.js`) + 2 PowerShell (`session-start.ps1`, `codemap-refresh.ps1`) |

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

## First Sprint Walkthrough

Zero → first sprint complete in 7 steps:

1. **Install + scaffold** — see § How to Adopt above.
2. **`/prime`** — load context (CLAUDE.md, CONTEXT.md, MEMORY.md, active sprint, codemap L0) before any work session.
3. **`/task-decomposer`** — convert a feature request, ticket URL, or PRD into structured TASK-NNN entries in `TODO.md`.
4. **Pick a mode** — see cheat-sheet below.
5. **G1 Scope** — restate goal as verifiable outcome; estimate size (S ≤2h / M ≤1d / L >1d → split); name constraints; check skill red flags.
6. **G2 Design** *(mvp only)* — `design-analyst` returns `DONE` / `DONE_WITH_CONCERNS`; write ADR via `/adr-writer` for any hard-to-reverse decision.
7. **Implement → review → commit** — execute plan; propose `code-reviewer` agent (or `/pr-reviewer` skill); commit with structured message.

| Mode          | Gates fired      | Use when |
|:--------------|:-----------------|:---------|
| `init`        | none             | first-time scaffold (no `.claude/` exists) |
| `quick`       | G1               | single task, S size, low risk |
| `mvp`         | G1 + G2          | feature work, M+ size, multi-task |
| `sprint-bulk` | G1 + G2 (batched once per sprint) | multi-task sprint; auto-loop Active Sprint |

Full gate checklists → [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Gates · full mode definitions → [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Modes.

## Skills

| Skill                     | Trigger                  | Purpose | Outcomes |
|:--------------------------|:-------------------------|:--------|:---------|
| `orchestrator`            | `/orchestrator`          | Core workflow — gates, modes, agent dispatch | flow · correction · rework |
| `task-decomposer`         | `/task-decomposer`       | Freeform intent → TASK-NNN entries + vertical slices | rework · template |
| `prime`                   | `/prime`                 | Ordered context loader at session start | onboard · flow |
| `architecture-grill`      | `/architecture-grill`    | Architecture stress-test + grill mode (ad-hoc; distinct from design-analyst auto-G2) | architecture · rework |
| `pr-reviewer`             | `/pr-reviewer`           | Structured 7-lens code review | rework · reliability |
| `security-auditor`        | `/security-review`       | OWASP audit (separate session) | reliability · rework |
| `refactor-advisor`        | `/refactor-advisor`      | Code smells + deep-module opportunities | architecture · rework |
| `zoom-out`                | `/zoom-out`              | Bird's-eye module map before diving in | onboard · architecture |
| `diagnose`                | `/diagnose`              | 6-phase systematic debugging | rework · correction |
| `tdd`                     | `/tdd`                   | Tracer bullet → red-green-refactor | rework · reliability |
| `lean-doc-generator`      | `/lean-doc-generator`    | WHY/WHERE docs · sprint lifecycle (start/promote/close) | doc-rot · template · architecture |
| `adr-writer`              | `/adr-writer`            | Architectural decision records | architecture · doc-rot |
| `release-manager`         | `/release-manager`       | Semver + changelog generation | reliability · flow |
| `release-patch`           | `/release-patch`         | PATCH bump — auto-detects manifest (plugin / npm / python / cargo / go / flat); HARD STOP at push | reliability · flow |
| `write-a-skill`           | `/write-a-skill`         | Author new skills with quality constraints | template · reliability |
| `codemap-refresh`         | `/codemap-refresh`       | Regenerate `docs/codemap/` (also auto on commit) | onboard · doc-rot |

Full authoring standards → [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Skill Authoring Standards.

## Agents

`dispatcher` is the only user-facing agent (entry point for `/orchestrator`). The 6 specialists are dispatcher-spawned only; skills do not spawn agents directly (ADR-015).

| Agent                  | Spawned by             | Trigger | Outcomes |
|:-----------------------|:-----------------------|:--------|:---------|
| `dispatcher`           | user (`/orchestrator`) | every workflow run | flow · correction |
| `design-analyst`       | dispatcher (auto)      | G2 in `mvp` mode | architecture · rework |
| `code-reviewer`        | dispatcher (propose)   | post-implementation, human approves | rework · reliability |
| `scope-analyst`        | dispatcher (auto)      | G1 if size unclear | rework |
| `performance-analyst`  | dispatcher (propose)   | hot-path / api / db touched + high risk | reliability · rework |
| `migration-analyst`    | dispatcher (propose)   | DB schema change detected | reliability |
| `security-analyst`     | user (`/security-review`) | separate session — never same-context | reliability |

Full trigger conditions → [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Agent Roster · one-way dispatch detail → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § Key Patterns.

## Hooks and Scripts

| Hook        | Fires on                | What it does |
|:------------|:------------------------|:-------------|
| SessionStart | `startup`/`resume`/`clear`/`compact` | Verify CLAUDE.md (fail) + settings + active sprint (warn) |
| PreToolUse   | `Bash(git add*)`        | Block `git add && git commit` chains so lint hook fires |
| PostToolUse  | `Bash(git commit*)`     | Regenerate `docs/codemap/CODEMAP.md` + `handoff.json` |

| Script                   | Runtime    | Purpose |
|:-------------------------|:-----------|:--------|
| `audit-baseline.js`      | Node ≥18   | Repo metrics snapshot for audits |
| `eval-skills.js`         | Node ≥18   | Skill structural eval (behavioral 3-arm port queued, TASK-115) |
| `session-start.ps1`      | PowerShell ≥5.1 | SessionStart hook target |
| `codemap-refresh.ps1`    | PowerShell ≥5.1 | PostToolUse hook target — codemap regen |

PowerShell hooks require Windows (ADR-016). Node scripts cross-platform. Hook-to-script wiring → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § Component Map.

## Working on This Repo

**Every session →** read [`TODO.md`](TODO.md) first to see active sprint state.

**Daily workflow pattern** (3 steps, in order):
1. `/prime` — load ordered context (CLAUDE.md → CONTEXT.md → MEMORY.md → TODO.md → sprint file → CODEMAP.md L0)
2. `/lean-doc-generator` — align docs to current code state (frontmatter, codemap, CHANGELOG)
3. `/orchestrator` — execute next task (mode: `init` / `quick` / `mvp` / `sprint-bulk`)

Step 1 is never skipped. Steps 2 + 3 are conditionally skippable — see [`docs/blueprint/12-session-workflow.md`](docs/blueprint/12-session-workflow.md) for the full pattern guide.

Contribution flow (versioning, skill-change protocol, breaking-change policy) → [`CONTRIBUTING.md`](CONTRIBUTING.md). Friction reports (file before opening a GitHub issue) → [`docs/SUPPORT.md`](docs/SUPPORT.md).

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
