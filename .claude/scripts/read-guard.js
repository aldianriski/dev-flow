// .claude/scripts/read-guard.js
// PreToolUse hook: enforces Thin-Coordinator Rule (blueprint §1).
// Blocks Read/Grep/Glob calls during compact-vulnerable phases.
//
// Hook input contract (CC_SPEC.md §1): JSON on stdin.
//   { tool_name, tool_input: { file_path, ... } }
// Exit 0 = allow. Exit 2 = blocked by rule. Exit 1 = script error.
'use strict';

const { existsSync, readFileSync } = require('fs');

const PHASE_FILE = '.claude/.phase';
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

function readStdin() {
  // fd 0 = stdin — cross-platform (Windows Git Bash + Linux, Node >=18)
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

let targetPath = '';
try {
  const raw = readStdin();
  if (raw.trim()) {
    const input = JSON.parse(raw);
    targetPath = input?.tool_input?.file_path || input?.tool_input?.path || '';
  }
} catch {
  // Parse failure — fail-open (allow) to avoid blocking on script errors
  process.exit(0);
}

// No phase file → not in a workflow phase → allow
if (!existsSync(PHASE_FILE)) process.exit(0);

const phase = readFileSync(PHASE_FILE, 'utf8').trim().toLowerCase();

// Non-vulnerable phase → allow
if (!COMPACT_VULNERABLE.has(phase)) process.exit(0);

// Normalize path separators for cross-platform matching
const normalized = targetPath.replace(/\\/g, '/');

// Unknown path — fail-open: cannot block what we can't identify
if (!normalized) process.exit(0);

// Allowlisted orchestrator-scoped state files → allow
if (ORCHESTRATOR_ALLOWLIST.some(rx => rx.test(normalized))) process.exit(0);

// Block: emit structured JSON feedback and exit 2
const reason =
  `Orchestrator attempted to Read '${normalized || '(unknown path)'}' during phase '${phase}'. ` +
  `Per §1 Thin-Coordinator Rule, source-file I/O must happen inside a subagent. ` +
  `Dispatch the phase subagent (implementer / test-writer / code-reviewer / security-analyst / docs-writer). ` +
  `If this path is orchestrator-scoped state, add it to ORCHESTRATOR_ALLOWLIST in read-guard.js.`;

// Prefer structured JSON output (CC hook spec §1) so Claude sees structured feedback
try {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }) + '\n');
} catch {
  process.stderr.write(`BLOCKED: ${reason}\n`);
}

process.exit(2);
