# Orchestrator Phase Reference

Loaded on demand from `orchestrator/SKILL.md`.

---

## G1 — Scope Checklist

```
## G1 Scope — [task title]
goal: <verifiable outcome, 1 sentence>
size: S | M | L  (S=≤2h, M=≤1d, L=>1d → BLOCK: split first)
constraints: <list>
layers: <list> → advisory skills: <from skill-dispatch.md>
task-type: feature | bug-fix | refactor  → advisory: tdd | diagnose | refactor-advisor (advisory; not required)
red flags: none | <list>
status: PASS | BLOCK — <reason>
```

## G2 — Design Checklist *(mvp only)*

```
## G2 Design — [task title]
approach: <≤10 bullets>
design-analyst: DONE | DONE_WITH_CONCERNS | BLOCKED
adr needed: yes | no
status: PASS | BLOCK — <reason>
Type 'proceed' to implement, or provide feedback.
```

---

## Review Gate

```
## Review — [task title]
code-reviewer: DONE | DONE_WITH_CONCERNS | CRITICAL
CRITICAL: <finding> — <file:line>  (no cap)
BLOCKING: <finding> — <file:line>  (max 5)
NON-BLOCKING: <note>
status: PASS | BLOCK
Type 'commit' to proceed, or fix and re-run code-reviewer.
```

---

## Commit Format

```
[type]([scope]): [what changed — one line]

Acceptance: [task acceptance criteria]
Refs: [tracker URL or "none — reason"]
```

---

## init Phase *(canonical scaffold contract — ADR-028)*

Full output of `/orchestrator init` = canonical scaffold contract per ADR-028 DEC-1. Both invocation paths (plugin install via `/orchestrator init`; scaffold copy via `node bin/dev-flow-init.js`) converge on the same outputs.

**Scaffold output (11 files + 2 empty dirs):**

| Path | Source | Purpose |
|:-----|:-------|:--------|
| `.claude/CLAUDE.md` | `templates/CLAUDE.md.template` (rendered) | Project AI context |
| `.claude/CONTEXT.md` | copied from dev-flow `.claude/CONTEXT.md` | Vocab · gates · modes · agent roster |
| `.claude/settings.json` | copied from dev-flow `.claude/settings.json` | CC harness config + hook registration |
| `.claude/settings.local.json` | rendered from `.claude/settings.local.example.json` | Per-machine settings + lint/typecheck commands per stack preset |
| `TODO.md` | `templates/TODO.md.template` (rendered) | Sprint tracker |
| `docs/ARCHITECTURE.md` | `templates/ARCHITECTURE.md.template` | Component map · key patterns |
| `docs/CHANGELOG.md` | `templates/CHANGELOG.md.template` | Release history (Keep-a-Changelog format) |
| `docs/DECISIONS.md` | `templates/DECISIONS.md.template` | ADR registry index |
| `docs/AI_CONTEXT.md` | `templates/AI_CONTEXT.md.template` | Patterns · conventions · current focus |
| `docs/SETUP.md` | `templates/SETUP.md.template` | Local dev setup guide |
| `docs/codemap/.gitkeep` | empty file | Codemap-refresh hook target dir (populated on first commit) |
| `docs/adr/.gitkeep` | empty file | adr-writer skill target dir (populated when first ADR lands) |
| `README.md` | `templates/README.md.template` (rendered) | Project README |
| `.gitignore` | `templates/gitignore.template` | dev-flow harness + node common entries |

**Stack preset selection** (script prompt at `bin/dev-flow-init.js` runtime):

| Preset | Layers | lint | typecheck | pkg manager |
|:-------|:-------|:-----|:----------|:------------|
| `node-express` | api, service, repository, middleware, model | `npm run lint` | `npx tsc --noEmit` | `npm` |
| `react-next` | api, hook, component, page, store, infrastructure | `npm run lint` | `npx tsc --noEmit` | `npm` |
| `python-fastapi` | api, service, repository, middleware, model | `ruff check .` | `mypy .` | `pip` |
| `go-gin` | api, service, repository, middleware, model | `go vet ./...` | `go build ./...` | `go` |
| `custom` | user-supplied | user-supplied | user-supplied | user-supplied |

`lint` + `typecheck` are wired into `.claude/settings.local.json` PreToolUse hooks for `Bash(git commit*)` — fire before any commit lands.

**Convergence (plugin install vs scaffold copy):** plugin install path delivers hooks via `hooks/hooks.json` auto-discovery (no settings.json required). Scaffold copy path delivers same hooks via `.claude/settings.json` (since user has no plugin install). bin/dev-flow-init.js copies dev-flow's `.claude/settings.json` verbatim, ensuring identical hook registration content for both paths. `settings.local.json` (per-machine) is rendered from `settings.local.example.json` with stack-specific lint/typecheck substituted.

**Idempotency:** `createEmptyScaffoldDirs` is safe to re-run — preserves existing `.gitkeep` files; does not clobber user content. `renderSettingsLocal` writes `.new` suffix if existing `settings.local.json` present (per-machine config not overwritten). Other templates DO overwrite — `init` is intended for first-time scaffold; re-running on a populated repo requires user to confirm overwrite at first prompt.

---

## Session Close *(after commit)*

Task state written to `TODO.md` only — CC TaskCreate/TaskList not used (ADR-012).

```
## Session Close — [task] — [date]
docs touched: <file> | <change>
TODO.md: task marked [x] | changelog row added
next: <next open task or "sprint complete — run /lean-doc-generator Sprint Close">
```

Sprint complete path: all tasks `[x]` → run `/lean-doc-generator` Sprint Close, then `/lean-doc-generator` Sprint Promote next session.

---

## Orchestrator Output

```
[MODE: quick|mvp]

G1 SCOPE
goal: <verifiable outcome>
size: S|M|L
constraints: <list>
red flags: none | <list>
status: PASS | BLOCK — <reason>

G2 DESIGN (mvp only)
approach: <≤10 bullets>
design-analyst: DONE | DONE_WITH_CONCERNS | BLOCKED
adr needed: yes | no
status: PASS | BLOCK — <reason>

NEXT: <single actionable instruction to human>
```

---

## Design Analyst Output

```
status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

CRITICAL: <issue> — <file:line> — <required fix>  (no cap, show all)
BLOCKING: <issue> — <file:line>  (max 5)
NON-BLOCKING: <brief note>

FILES: <action> | <path> | <why>

MICRO-TASKS:
- [ ] <exact action> in <exact/path>  verify: <runnable command>

DECISIONS: <point> — <options> → <recommendation>

RECOMMENDATION: <one actionable next step, ≤2 sentences>
```

---

## Scope Analyst Output

```
status: DONE | NEEDS_CONTEXT

FILES AFFECTED: <path> — <why>  (max 10)
LAYERS TOUCHED: <list>
NEW FILES: <path> — <what it contains>
PATTERNS TO REUSE: <name> in <path>

size: S | M | L
cross-layer: yes | no
api-change: yes | no
db-change: yes | no
auth-change: yes | no

risk: low | medium | high — <one-sentence rationale>

RECOMMENDATION: <one task or split? — ≤2 sentences>
```

---

## sprint-bulk Phase (mvp-class, batched)

Use when running a multi-task sprint end-to-end. Replaces per-task G1+G2 with a single batched gate pass + auto-loop.

**Advisory skill hints** (fire per detection at session-start / pre-G1 / G1 / Implement / Review / close):
- `prime` — runs at session start before any orchestrator dispatch (NOT orchestrator-triggered; user-invoked or session-start hook)
- `zoom-out` — propose before G1 if any task touches an unfamiliar module OR is cross-cutting
- `diagnose` — propose at Implement phase if G1 task-type = bug-fix / failing test
- `tdd` — propose at Implement phase if G1 task-type = feature / new behavior requiring tests
- `refactor-advisor` — propose post-Review if code-reviewer flags complexity smells
- `release-manager` — propose at sprint close if MINOR or MAJOR bump required; else `release-patch` (PATCH auto-detect path)

**1. Sprint Scope Batch (G1 once)**
- Read all `[ ]` tasks under `## Active Sprint` in TODO.md.
- Run G1 checklist for the sprint as a whole: combined goal, total size (must be ≤ M when summed; L → split sprint), shared constraints, sprint-wide red flags.
- BLOCK if any sprint-level red flag fails.

**2. Sprint Design Batch (G2 once)**
- Auto-dispatch `scope-analyst` ONCE with the full task list. Expect FILES AFFECTED list per task.
- Auto-dispatch `design-analyst` ONCE with combined task list — produces a session-scoped sprint-PRD block (not written to disk; persistent artifact = separate task).
- BLOCK on any `BLOCKED` finding. Hard-to-reverse decision → dispatch `adr-writer`.

**3. Overlap derivation (parallelism gate)**
- For each task pair `(Ti, Tj)`, compute `FILES_AFFECTED(Ti) ∩ FILES_AFFECTED(Tj)`.
- If ANY pair has non-empty intersection → run sequentially (default).
- If ALL pairs have empty intersection → fan out tasks to parallel subagents.
- Pure set intersection on path strings; no schema change to scope-analyst needed.

**4. Sequential auto-loop (default path)**
- Iterate Active Sprint tasks `[ ]` in declared order.
- Per-task: run Implement → propose `code-reviewer` y/n (per dispatcher dispatch rules; never auto-fire) → Commit → mark `[x]`.
- After each task close, advance to next `[ ]`.

**5. First-blocker halt**
- Halt loop on first of: scope-analyst returns `BLOCKED`, design-analyst returns `BLOCKED`, human types `block` at any task boundary, code-reviewer returns `CRITICAL`.
- Do NOT auto-skip blocked task. Report which task halted, why, and the remaining task list. Wait for human direction.

**6. Sprint close**
- When all tasks are `[x]`: run `/lean-doc-generator` Sprint Close, then prompt for `/release-patch` if version bump applicable.

**Note**: sprint-PRD is session-scoped — emitted as a formatted block in the conversation, never written to disk. Persistent artifact creation is out of scope; separate task if needed.
