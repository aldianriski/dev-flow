---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: New mode/agent/skill added · adoption flow changes · counts drift from filesystem
status: current
---

# dev-flow — Agentic Engineering Workflow Starter

Claude Code plugin: gate-driven workflow + skill library + agent roster for any software project. **v2.5.0**

Drop into any repo to get a human-gated AI workflow. Dispatcher delegates to specialists. Humans approve gates. No app code required.

## What You Get

Plugin auto-discovers components at repo root after install. All counts verified against filesystem.

| Component | Count | What it does |
|:----------|:------|:-------------|
| Gates     | 2     | G1 Scope + G2 Design checkpoints before any commit |
| Modes     | 4     | `init` · `quick` · `mvp` · `sprint-bulk` (operational context) |
| Skills    | 17    | User-invokable slash commands (`skills/<name>/SKILL.md`) |
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

| Skill                     | Trigger                  | Purpose |
|:--------------------------|:-------------------------|:--------|
| `orchestrator`            | `/orchestrator`          | Core workflow — gates, modes, agent dispatch |
| `task-decomposer`         | `/task-decomposer`       | Freeform intent → TASK-NNN entries + vertical slices |
| `prime`                   | `/prime`                 | Ordered context loader at session start |
| `system-design-reviewer`  | `/system-design-reviewer`| Architecture review + grill mode |
| `pr-reviewer`             | `/pr-reviewer`           | Structured 7-lens code review |
| `security-auditor`        | `/security-review`       | OWASP audit (separate session) |
| `refactor-advisor`        | `/refactor-advisor`      | Code smells + deep-module opportunities |
| `zoom-out`                | `/zoom-out`              | Bird's-eye module map before diving in |
| `diagnose`                | `/diagnose`              | 6-phase systematic debugging |
| `tdd`                     | `/tdd`                   | Tracer bullet → red-green-refactor |
| `lean-doc-generator`      | `/lean-doc-generator`    | WHY/WHERE docs · sprint lifecycle (start/promote/close) |
| `adr-writer`              | `/adr-writer`            | Architectural decision records |
| `release-manager`         | `/release-manager`       | Semver + changelog generation |
| `release-patch`           | `/release-patch`         | PATCH bump (`plugin.json` + `marketplace.json` lockstep), HARD STOP at push |
| `dev-flow-compress`       | `/dev-flow-compress`     | Compress CLAUDE.md / memory files (caveman style) |
| `write-a-skill`           | `/write-a-skill`         | Author new skills with quality constraints |
| `codemap-refresh`         | `/codemap-refresh`       | Regenerate `docs/codemap/` (also auto on commit) |

Full authoring standards → [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § Skill Authoring Standards.

## Agents

`dispatcher` is the only user-facing agent (entry point for `/orchestrator`). The 6 specialists are dispatcher-spawned only; skills do not spawn agents directly (ADR-015).

| Agent                  | Spawned by             | Trigger |
|:-----------------------|:-----------------------|:--------|
| `dispatcher`           | user (`/orchestrator`) | every workflow run |
| `design-analyst`       | dispatcher (auto)      | G2 in `mvp` mode |
| `code-reviewer`        | dispatcher (propose)   | post-implementation, human approves |
| `scope-analyst`        | dispatcher (auto)      | G1 if size unclear |
| `performance-analyst`  | dispatcher (propose)   | hot-path / api / db touched + high risk |
| `migration-analyst`    | dispatcher (propose)   | DB schema change detected |
| `security-analyst`     | user (`/security-review`) | separate session — never same-context |

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

Daily pattern: `/prime` to load ordered context, then check TODO.md `Active Sprint` block.

Contribution flow (versioning, skill-change protocol, breaking-change policy) → [`CONTRIBUTING.md`](CONTRIBUTING.md). Friction reports (file before opening a GitHub issue) → [`docs/SUPPORT.md`](docs/SUPPORT.md).

## Further Reading

- [`.claude/CONTEXT.md`](.claude/CONTEXT.md) — vocabulary · gates · modes · agent roster (single source of truth)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — component map · key patterns · integration points · security boundaries
- [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md) — patterns · conventions · current focus
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — versioning · change process · breaking-change policy
- [`docs/SUPPORT.md`](docs/SUPPORT.md) — friction reports · support channel
- [`docs/adr/`](docs/adr/) — ADR registry (architectural decision records ≥016; ≤015 frozen in [`docs/DECISIONS.md`](docs/DECISIONS.md))
- [`docs/codemap/CODEMAP.md`](docs/codemap/CODEMAP.md) — 3-tier codemap (L0 in CLAUDE.md · mid-tier here · `handoff.json` envelope)

## License

MIT — see [LICENSE](LICENSE).
