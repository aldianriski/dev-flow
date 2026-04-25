// .claude/scripts/validate-blueprint.js
// Validates dev-flow blueprint integrity against the filesystem:
//   - Every skill in MANIFEST.json has its SKILL.md present
//   - Every agent declared in blueprint §4 exists in .claude/agents/
// Usage: node .claude/scripts/validate-blueprint.js [root-dir]
// Exit 0: all checks pass. Exit 1: any check fails.
// Pure Node (>=18), CommonJS, no shell-outs — cross-platform (Windows Git Bash + Linux).
'use strict';

const { existsSync } = require('fs');
const { join } = require('path');
const { checkManifest } = require('./scaffold-checks');

const root = process.argv[2] || '.';

const passes = [];
const failures = [];

function pass(msg) { passes.push(msg); }
function fail(msg) { failures.push(msg); }

// ─── Check 1: MANIFEST.json skills → filesystem ──────────────────────────────
const manifestPath = join(root, '.claude/skills/MANIFEST.json');
const mResult = checkManifest(manifestPath);

if (!mResult.pass) {
  fail(`MANIFEST.json: ${mResult.message}`);
} else {
  let allPresent = true;
  for (const skill of mResult.data.skills) {
    const skillFile = join(root, '.claude/skills', skill.path);
    if (!existsSync(skillFile)) {
      fail(`Skill "${skill.name}": path ".claude/skills/${skill.path}" not found on filesystem`);
      allPresent = false;
    }
  }
  if (allPresent) {
    pass(`All ${mResult.data.skills.length} MANIFEST skill path(s) exist on filesystem`);
  }
}

// ─── Check 2: Expected agents (blueprint §4) → filesystem ────────────────────
// Canonical list from blueprint §4 "Agent file map" table.
const EXPECTED_AGENTS = [
  'design-analyst.md',
  'init-analyst.md',
  'code-reviewer.md',
  'security-analyst.md',
  'migration-analyst.md',
  'performance-analyst.md',
  'scope-analyst.md',
];

let allAgentsPresent = true;
for (const agentFile of EXPECTED_AGENTS) {
  const agentPath = join(root, '.claude/agents', agentFile);
  if (!existsSync(agentPath)) {
    fail(`Agent file missing: .claude/agents/${agentFile}`);
    allAgentsPresent = false;
  }
}
if (allAgentsPresent) {
  pass(`All ${EXPECTED_AGENTS.length} blueprint §4 agent(s) present`);
}

// ─── Check 3: Phase number range — deferred ──────────────────────────────────
// MANIFEST.json does not yet include phase assignments.
// Phase range validation (0–10) is deferred until MANIFEST includes a phase field.
pass('Phase range check: deferred (MANIFEST.json does not yet include phase field)');

// ─── Output ───────────────────────────────────────────────────────────────────
console.log('\n=== BLUEPRINT VALIDATION ===\n');
for (const p of passes) console.log(`[PASS] ${p}`);
if (failures.length > 0) {
  for (const f of failures) console.log(`[FAIL] ${f}`);
  console.log(`\nRESULT: ${failures.length} failure(s)\n`);
  process.exit(1);
} else {
  console.log('\nRESULT: all checks passed\n');
}
