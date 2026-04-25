// .claude/scripts/validate-blueprint.js
// Validates dev-flow blueprint integrity against the filesystem:
//   - Every skill in MANIFEST.json has its SKILL.md present
//   - Every agent declared in blueprint §4 exists in .claude/agents/
// Usage: node .claude/scripts/validate-blueprint.js [root-dir]
// Exit 0: all checks pass. Exit 1: any check fails.
// Pure Node (>=18), CommonJS, no shell-outs — cross-platform (Windows Git Bash + Linux).
'use strict';

const { existsSync, readFileSync } = require('fs');
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

// ─── Check 4: README marketing numbers match source-of-truth ─────────────────
// README claims hard-stop count and skill count. Both must match the actual
// counts in docs/blueprint/08-orchestrator-prompts.md (❌ lines) and
// MANIFEST.json (skills array length). Drift = fail.
const readmePath = join(root, 'README.md');
const hardStopsPath = join(root, 'docs/blueprint/08-orchestrator-prompts.md');

if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, 'utf8');

  // Hard stops: count lines starting with ❌ in 08-orchestrator-prompts.md
  if (existsSync(hardStopsPath)) {
    const hsContent = readFileSync(hardStopsPath, 'utf8');
    const actualHardStops = (hsContent.match(/^❌/gm) || []).length;
    const hsClaim = readme.match(/(\d+)\+?\s+Hard Stops/i);
    if (hsClaim) {
      const claimed = parseInt(hsClaim[1], 10);
      const isPlus = /\d+\+/.test(hsClaim[0]);
      const ok = isPlus ? actualHardStops >= claimed : claimed === actualHardStops;
      if (ok) {
        pass(`README hard-stop count matches source (${actualHardStops})`);
      } else {
        fail(`README claims "${hsClaim[0].trim()}" but docs/blueprint/08-orchestrator-prompts.md has ${actualHardStops} ❌ lines`);
      }
    } else {
      fail('README missing "N Hard Stops" claim — required for source-of-truth check (use a number to enable counting, or remove this check from CI when the project shrinks)');
    }
  }

  // Skill count: skills.length in MANIFEST.json vs README claim
  if (mResult.pass) {
    const actualSkills = mResult.data.skills.length;
    const skillClaim = readme.match(/(\d+)\+?\s+project-local[^\n]*skills/i);
    if (skillClaim) {
      const claimed = parseInt(skillClaim[1], 10);
      const isPlus = /\d+\+/.test(skillClaim[0]);
      const ok = isPlus ? actualSkills >= claimed : actualSkills === claimed;
      if (ok) {
        pass(`README skill count matches MANIFEST (${actualSkills})`);
      } else {
        fail(`README claims "${skillClaim[0].trim()}" but MANIFEST.json has ${actualSkills} skills`);
      }
    } else {
      fail('README missing "N project-local … skills" claim — required for source-of-truth check');
    }
  }
}

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
