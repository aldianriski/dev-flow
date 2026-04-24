---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MAJOR version bump; hook contract changes; new script added
status: current
source: AI_WORKFLOW_BLUEPRINT.md §6 + §7 (split TASK-004); TASK-005 fix: read-guard.js
  corrected to use stdin JSON (env-var version was broken — see context/research/CC_SPEC.md)
---

# Blueprint §6 — Harness Configuration & CLAUDE.md Template

> **Hook input contract** (verified against CC_SPEC — Sprint 0 TASK-001):
> Claude Code hooks receive tool input via **stdin as JSON**, not via environment variables.
> The `process.env.CLAUDE_TOOL_INPUT_FILE_PATH` pattern used in v1.7.0 scripts is incorrect.
> Sprint 2 (TASK-008, TASK-009) rewrites the scripts against the verified contract.
> The templates below reflect the **corrected** approach.

## `.claude/settings.json` (git-tracked — applies to all team members)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/session-start.js",
            "description": "Bootstrap: verify settings.local, CLAUDE.md size, skill staleness, doc line counts, pending migrations, active sprint"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/ci-status.js",
            "description": "Poll CI status after push — block Session Close if pipeline is non-green"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/track-change.js",
            "description": "Append written file path to .claude/.session-changes.txt for scope guard and context tracking"
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/track-change.js",
            "description": "Append edited file path to .claude/.session-changes.txt for scope guard and context tracking"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read|Grep|Glob",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/.claude/scripts/read-guard.js",
            "description": "Block orchestrator source-file Reads during compact-vulnerable phases (§1 Thin-Coordinator Rule)"
          }
        ]
      },
      {
        "matcher": "Bash(git commit*)",
        "hooks": [
          {
            "type": "command",
            "command": "[your-lint-command]",
            "description": "Lint check before commit"
          }
        ]
      },
      {
        "matcher": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "[your-typecheck-command]",
            "description": "Type check before push"
          }
        ]
      }
    ]
  }
}
```

> **`${CLAUDE_PLUGIN_ROOT}`**: resolves to the plugin root at runtime. Use this in all hook commands
> for portable paths. See `context/research/CC_SPEC.md` for the verified variable list.

## `.claude/scripts/session-start.js` (git-tracked)

All checks are non-blocking warnings except where noted. The script writes a structured report to stdout.

```js
// .claude/scripts/session-start.js
// v2.1 — bootstrap: settings, CLAUDE.md, skills, docs line counts,
//         pending migrations, active sprint validation, context budget signal, compaction audit
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const warnings = [];
const errors   = [];
const info     = [];

function countLines(filePath) {
  return readFileSync(filePath, 'utf8').split('\n').length;
}

function globSkillsNode() {
  // Pure Node — no shell-outs; cross-platform (Windows Git Bash + Linux)
  const results = [];
  function walk(dir) {
    try {
      const { readdirSync, statSync } = require('fs');
      for (const entry of readdirSync(dir)) {
        const full = `${dir}/${entry}`;
        if (statSync(full).isDirectory()) walk(full);
        else if (entry === 'SKILL.md') results.push(full);
      }
    } catch { /* unreadable dir — skip */ }
  }
  walk('.claude/skills');
  return results;
}

// ─── Check 1: settings.local.json ───────────────────────────────────────────
if (!existsSync('.claude/settings.local.json')) {
  errors.push(
    'BLOCK: .claude/settings.local.json not found. ' +
    'Copy from .claude/settings.local.example.json and customize.'
  );
} else {
  info.push('✓ settings.local.json present');
}

// ─── Check 2: CLAUDE.md line count ──────────────────────────────────────────
if (existsSync('.claude/CLAUDE.md')) {
  const lines = countLines('.claude/CLAUDE.md');
  if (lines > 200) {
    warnings.push(`WARN: CLAUDE.md is ${lines} lines (hard limit: 200). Trim it.`);
  } else {
    info.push(`✓ CLAUDE.md within budget (${lines}/200 lines)`);
  }
}

// ─── Check 3: Skill staleness (last-validated > 6 months) ───────────────────
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const staleSkills = [];

for (const skillPath of globSkillsNode()) {
  const content = readFileSync(skillPath, 'utf8');
  const match = content.match(/last-validated:\s*"?(\d{4}-\d{2}-\d{2})"?/);
  if (match) {
    if (new Date(match[1]) < sixMonthsAgo) staleSkills.push(`  • ${skillPath} — last validated ${match[1]}`);
  } else {
    warnings.push(`WARN: ${skillPath} has no last-validated field — cannot assess staleness.`);
  }
}

if (staleSkills.length > 0) {
  warnings.push(`WARN: ${staleSkills.length} skill(s) last validated >6 months ago:\n` + staleSkills.join('\n'));
} else {
  info.push('✓ All skills within staleness window');
}

// ─── Check 4: Docs line count limits ────────────────────────────────────────
const DOC_LIMITS = {
  'docs/README.md': 50, 'docs/ARCHITECTURE.md': 150,
  'docs/SETUP.md': 100, 'docs/AI_CONTEXT.md': 100,
};
for (const [docPath, limit] of Object.entries(DOC_LIMITS)) {
  if (!existsSync(docPath)) continue;
  const lines = countLines(docPath);
  if (lines > limit) warnings.push(`WARN: ${docPath} is ${lines} lines (limit: ${limit}). Trim before next commit.`);
}

// ─── Check 5: Docs ownership header freshness ────────────────────────────────
const sixtyDaysAgo = new Date();
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
const docFiles = [
  'docs/README.md', 'docs/ARCHITECTURE.md', 'docs/DECISIONS.md',
  'docs/SETUP.md', 'docs/AI_CONTEXT.md', 'docs/CHANGELOG.md',
  'docs/TEST_SCENARIOS.md', 'TODO.md',
];
for (const docPath of docFiles) {
  if (!existsSync(docPath)) continue;
  const content = readFileSync(docPath, 'utf8');
  const statusMatch  = content.match(/status:\s*(stale|needs-review|current)/);
  const updatedMatch = content.match(/last_updated:\s*(\d{4}-\d{2}-\d{2})/);
  if (statusMatch?.[1] === 'stale') warnings.push(`WARN: ${docPath} is marked status: stale.`);
  else if (statusMatch?.[1] === 'needs-review') warnings.push(`WARN: ${docPath} is marked status: needs-review.`);
  if (updatedMatch && new Date(updatedMatch[1]) < sixtyDaysAgo && statusMatch?.[1] !== 'stale') {
    warnings.push(`WARN: ${docPath} last updated ${updatedMatch[1]} (>60 days) — verify accuracy.`);
  } else if (!updatedMatch) {
    warnings.push(`WARN: ${docPath} has no ownership header — treat as unverified.`);
  }
}

// ─── Check 6: Pending database migrations ────────────────────────────────────
const migrationDirs = ['migrations', 'src/migrations', 'db/migrations', 'database/migrations'];
for (const dir of migrationDirs) {
  if (!existsSync(dir)) continue;
  try {
    const { readdirSync } = require('fs');
    const files = readdirSync(dir).map(f => f.toString());
    const upFiles   = files.filter(f => f.includes('up') || (!f.includes('down') && f.endsWith('.sql')));
    const downFiles = files.filter(f => f.includes('down'));
    if (upFiles.length > downFiles.length) {
      warnings.push(`WARN: ${dir}/ has ${upFiles.length} up-migration(s) but ${downFiles.length} down-migration(s).`);
    } else {
      info.push(`✓ Migration parity OK in ${dir}/`);
    }
  } catch { /* unreadable — skip */ }
}

// ─── Check 7: Active sprint validation ───────────────────────────────────────
if (existsSync('TODO.md')) {
  const todo = readFileSync('TODO.md', 'utf8');
  const hasActiveTask   = /- \[ \] \*\*TASK-/.test(todo);
  const hasActiveSprint = /## Active Sprint/.test(todo);
  if (!hasActiveSprint) {
    warnings.push('WARN: TODO.md has no Active Sprint section.');
  } else if (!hasActiveTask) {
    info.push('ℹ Active Sprint exists but has no open tasks — promote from Backlog or start new sprint.');
  } else {
    const nextTask = todo.match(/- \[ \] \*\*(.+?)\*\*/)?.[1];
    if (nextTask) info.push(`ℹ Next task: ${nextTask}`);
  }
}

// ─── Check 8: Context budget signal ──────────────────────────────────────────
const changesFile = '.claude/.session-changes.txt';
if (existsSync(changesFile)) {
  const changes = readFileSync(changesFile, 'utf8').trim().split('\n').filter(Boolean);
  const unique  = [...new Set(changes)];
  if (unique.length > 10) {
    warnings.push(`WARN: ${unique.length} files changed this session — context budget high.`);
  }
  info.push(`ℹ Session changes tracker: ${unique.length} unique file(s) modified`);
}

// ─── Check 9: Compaction audit ───────────────────────────────────────────────
const phaseFile = '.claude/.phase';
const COMPACT_VULNERABLE = ['implement', 'test', 'review', 'security', 'docs'];
if (existsSync(phaseFile)) {
  const phase = readFileSync(phaseFile, 'utf8').trim().toLowerCase();
  if (COMPACT_VULNERABLE.includes(phase)) {
    warnings.push(
      `WARN: Resuming into phase '${phase}' (compact-vulnerable). ` +
      'Per §1 Thin-Coordinator Rule: dispatch the phase subagent, do NOT Read source files in orchestrator.'
    );
  }
  info.push(`ℹ Current workflow phase: ${phase}`);
}

const manifestPath = '.claude/skills/MANIFEST.json';
if (existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    info.push(`✓ Skill manifest present (${(manifest.skills || []).length} skills registered)`);
  } catch { warnings.push(`WARN: ${manifestPath} is not valid JSON — regenerate.`); }
} else {
  warnings.push('WARN: .claude/skills/MANIFEST.json missing — phase→skill resolution will fall back to blueprint tables.');
}

// ─── Output ──────────────────────────────────────────────────────────────────
console.log('\n=== SESSION START REPORT ===');
if (info.length)     { console.log('\n[INFO]');     info.forEach(i => console.log(i)); }
if (warnings.length) { console.log('\n[WARNINGS]'); warnings.forEach(w => console.log(w)); }
if (errors.length)   { console.log('\n[ERRORS — resolve before proceeding]'); errors.forEach(e => console.log(e)); }
console.log('\n============================\n');
if (errors.length > 0) process.exit(1);
```

> **v2.1 changes**: `globSkills()` replaced with pure-Node `globSkillsNode()` (no shell-outs — cross-platform).
> Hook command lines use `${CLAUDE_PLUGIN_ROOT}` for portable paths.
> Sprint 2 TASK-008 will complete the rewrite with full test coverage.

## `.claude/scripts/read-guard.js` (git-tracked)

PreToolUse hook that mechanically enforces the Thin-Coordinator Rule (§1).
Blocks `Read`/`Grep`/`Glob` calls during compact-vulnerable phases.

> **⚠ v1.7.0 was broken**: it read `process.env.CLAUDE_TOOL_INPUT_FILE_PATH` which is not populated
> by the CC hook harness. Hook input arrives via **stdin as JSON** (verified in `context/research/CC_SPEC.md`).
> The corrected version below reads stdin. Sprint 2 TASK-009 completes the rewrite with tests.

```js
// .claude/scripts/read-guard.js
// Blocks orchestrator source-file Reads during compact-vulnerable phases.
// Hook input arrives via stdin as JSON: { tool_name, tool_input: { path, ... } }
import { existsSync, readFileSync } from 'fs';

const phaseFile = '.claude/.phase';
const COMPACT_VULNERABLE = new Set(['implement', 'test', 'review', 'security', 'docs']);

const ORCHESTRATOR_ALLOWLIST = [
  /^TODO\.md$/,
  /^\.claude\/\.phase$/,
  /^\.claude\/\.session-changes\.txt$/,
  /^\.claude\/skills\/MANIFEST\.json$/,
  /^\.claude\/STATE\.ya?ml$/,
  /^CLAUDE\.md$/,
  /^\.claude\/CLAUDE\.md$/,
];

// Read tool input from stdin (CC hook contract — verified in CC_SPEC.md)
let targetPath = '';
try {
  const chunks = [];
  // Synchronous stdin read for hook context
  const stdinContent = readFileSync('/dev/stdin', 'utf8');
  const input = JSON.parse(stdinContent);
  targetPath = input?.tool_input?.path || input?.tool_input?.file_path || '';
} catch { /* no stdin or parse error — allow (fail-open for safety) */ }

const normalized = targetPath.replace(/\\/g, '/');

if (!existsSync(phaseFile)) process.exit(0);
const phase = readFileSync(phaseFile, 'utf8').trim().toLowerCase();
if (!COMPACT_VULNERABLE.has(phase)) process.exit(0);
if (ORCHESTRATOR_ALLOWLIST.some(rx => rx.test(normalized))) process.exit(0);

console.error(
  `BLOCKED: orchestrator attempted to Read '${normalized}' during phase '${phase}'. ` +
  `Per §1 Thin-Coordinator Rule, source-file I/O must happen inside a subagent. ` +
  `Dispatch the phase subagent (implementer / test-writer / code-reviewer / security-analyst / docs-writer). ` +
  `If this path is orchestrator-scoped state, add it to ORCHESTRATOR_ALLOWLIST.`
);
process.exit(2);
```

> **Exit code 2**: non-zero exit blocks the tool use. Exit 0 = allow. Exit 1 = error in script itself.
> Using exit 2 for "blocked by rule" distinguishes rule-blocks from script failures in logs.

**Phase tracking contract**: the orchestrator writes the current phase name (lowercase) to `.claude/.phase`
on every transition. At Session Close, the file is written as `idle`. The `dev-flow` skill owns this file.

## `.claude/scripts/track-change.js` (git-tracked)

Called by PostToolUse Write/Edit hooks. Reads the changed file path from stdin JSON.

```js
// .claude/scripts/track-change.js
// PostToolUse hook: appends changed file path to session tracker.
// Hook input arrives via stdin as JSON: { tool_name, tool_input: { path, ... } }
import { appendFileSync, mkdirSync, readFileSync } from 'fs';

let filePath = '';
try {
  const input = JSON.parse(readFileSync('/dev/stdin', 'utf8'));
  filePath = input?.tool_input?.path || input?.tool_input?.file_path || '';
} catch { process.exit(0); }

if (!filePath) process.exit(0);

const ignored = ['.claude/', 'node_modules/', 'package-lock.json', 'pnpm-lock.yaml', '.git/'];
if (ignored.some(p => filePath.includes(p))) process.exit(0);

try {
  mkdirSync('.claude', { recursive: true });
  appendFileSync('.claude/.session-changes.txt', filePath + '\n', 'utf8');
} catch { /* non-fatal */ }
```

> Add `.claude/.session-changes.txt` to `.gitignore`. Cleared at the start of each new
> task in the dev-flow Parse phase.

## `.claude/scripts/ci-status.js` (git-tracked)

Called by PostToolUse `Bash(git push*)` hook. Polls CI pipeline status.

```js
// .claude/scripts/ci-status.js
// Polls CI status after push. Supports GitHub Actions and GitLab CI.
// Requires: gh CLI (GitHub) or glab CLI (GitLab), installed and authenticated.
import { execSync } from 'child_process';

const CI_PROVIDER = process.env.CI_PROVIDER || 'skip'; // 'github' | 'gitlab' | 'skip'

if (CI_PROVIDER === 'skip') {
  console.log('CI_PROVIDER=skip — CI status check disabled.');
  process.exit(0);
}

const MAX_POLLS = 20;
const POLL_DELAY = 30;

function sleep(s) { return new Promise(r => setTimeout(r, s * 1000)); }

async function pollGitHub() {
  for (let i = 0; i < MAX_POLLS; i++) {
    const raw = execSync('gh run list --limit 1 --json status,conclusion,name,url', { encoding: 'utf8' });
    const [run] = JSON.parse(raw);
    if (!run) { await sleep(POLL_DELAY); continue; }
    if (run.status === 'completed') {
      if (run.conclusion === 'success') { console.log(`\n✓ CI PASSED: ${run.name}\n  ${run.url}`); return 0; }
      console.log(`\n❌ CI FAILED (${run.conclusion}): ${run.name}\n  ${run.url}`);
      console.log('BLOCK: Session Close blocked. Fix CI before proceeding.');
      return 1;
    }
    process.stdout.write(`  CI ${run.status}... (poll ${i + 1}/${MAX_POLLS})\r`);
    await sleep(POLL_DELAY);
  }
  console.log('\nWARN: CI poll timed out. Verify manually before Session Close.');
  return 0;
}

async function pollGitLab() {
  for (let i = 0; i < MAX_POLLS; i++) {
    const pipeline = JSON.parse(execSync('glab ci status --output json', { encoding: 'utf8' }));
    if (pipeline.status === 'success') { console.log(`\n✓ CI PASSED: ${pipeline.web_url}`); return 0; }
    if (['failed', 'canceled'].includes(pipeline.status)) {
      console.log(`\n❌ CI FAILED (${pipeline.status}): ${pipeline.web_url}`);
      console.log('BLOCK: Session Close blocked.'); return 1;
    }
    await sleep(POLL_DELAY);
  }
  console.log('\nWARN: CI poll timed out.'); return 0;
}

(CI_PROVIDER === 'gitlab' ? pollGitLab() : pollGitHub())
  .then(code => process.exit(code))
  .catch(() => { console.log('WARN: CI check failed to run. Verify manually.'); process.exit(0); });
```

**[CUSTOMIZE]** `CI_PROVIDER` environment variable:

| CI System | Value |
|:----------|:------|
| GitHub Actions | `export CI_PROVIDER=github` |
| GitLab CI | `export CI_PROVIDER=gitlab` |
| No CI / local only | `export CI_PROVIDER=skip` (default) |

**[CUSTOMIZE]** Replace `[your-lint-command]` and `[your-typecheck-command]`:

| Stack | Lint | Typecheck |
|:------|:-----|:---------|
| Nuxt 3 / Vue | `pnpm lint` | `pnpm typecheck` |
| Next.js / React | `npm run lint` | `npm run type-check` |
| NestJS | `npm run lint` | `npm run build --noEmit` |
| Python (FastAPI) | `ruff check .` | `mypy .` |
| Go | `golangci-lint run` | `go build ./...` |

## `.claude/settings.local.json` (gitignored — per machine)

```json
{
  "permissions": {
    "allow": [
      "Bash([package-manager] *)",
      "Bash(git add *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git stash *)"
    ]
  }
}
```

**[CUSTOMIZE]** Replace `[package-manager]` with `pnpm`, `npm`, `yarn`, `pip`, `go`, etc.

Add `.claude/settings.local.json` to `.gitignore`.

---

## `evals/measure.py` — Skill Eval Harness (Channel 4)

Offline three-arm eval harness. Reads committed JSON snapshot fixtures; no API calls.

**When to run**: before merging any skill change (per §17 Channel 2 Skill Staleness). Evidence of no regression required at Gate 2 for `risk: medium/high` skill tasks.

```bash
# single snapshot
python evals/measure.py evals/snapshots/<skill>/<label>.json

# full harness
python evals/measure.py evals/snapshots/

# lint gate (stdlib only — no external deps)
python -m py_compile evals/measure.py
```

**Three arms**: `baseline` (no skill) → `terse_control` (brevity only) → `skill` (full prompt).
`terse_isolation_delta` = skill vs terse_control. Isolates skill signal from brevity pressure.

Snapshot schema and methodology: `evals/README.md`
ADR: `docs/DECISIONS.md` — ADR-001

---

## §7 — CLAUDE.md Template

This file is always loaded into every AI session. Keep it under 200 lines.

```markdown
# [Project Name] — AI Context

## Project Overview
- **Name**: [Project name]
- **Type**: [Web app / API / Library / Mobile]
- **Stack**: [Framework + Language + Key libraries]
- **Architecture**: [Clean Architecture / MVC / Hexagonal / Layered]

## Dependency Rule [CUSTOMIZE]
[Outer Layer] → [Middle Layer] → [Inner Layer] → [External]
- [Specific rule 1]
- [Specific rule 2]

## File Structure [CUSTOMIZE]
/[source-root]
  /[layer-1]/    # [what goes here]
  /[layer-2]/    # [what goes here]

## Code Generation Order [CUSTOMIZE]
1. [First thing to create] → 2. [Second] → 3. [Third] → ...

## Naming Conventions [CUSTOMIZE]
- Files: [kebab-case / snake_case / PascalCase]
- [Component/Class/Function]: [naming rule]
- [Test]: [naming rule]

## Anti-Patterns (Avoid) [CUSTOMIZE]
❌ [Anti-pattern 1]
❌ [Anti-pattern 2]

## Commands [CUSTOMIZE]
[install-command]
[run-command]
[test-command]
[lint-command]
[build-command]

## Definition of Done
Every task must satisfy all of these before commit:
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Unit + integration tests pass
- [ ] Review: 0 blocking issues
- [ ] Security: 0 critical findings
- [ ] DECISIONS.md updated if an architectural decision was made
- [ ] Acceptance criteria verified by human at Gate 2

## Context Memory Instructions
1. [Rule 1 for AI to follow]
2. [Rule 2 for AI to follow]
```
