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
const warnings = [];

function pass(msg) { passes.push(msg); }
function fail(msg) { failures.push(msg); }
function warn(msg) { warnings.push(msg); }

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

// ─── Check 3: Blueprint doc 250-line cap ─────────────────────────────────────
// Any file in docs/blueprint/ that exceeds 250 lines is flagged as a warning.
// Index files (root 01–10 files) are exempt because they are intentionally short.
// Sub-files (10a-, 10b-, 06a-, 06b-, etc.) must stay ≤250 lines.
const { readdirSync, statSync } = require('fs');
const blueprintDir = join(root, 'docs/blueprint');
const BLUEPRINT_LINE_CAP = 250;
// Only true index files (short table-of-contents files) are exempt from the 250-line cap.
const INDEX_FILES = new Set(['10-modes.md', '06-harness.md']);

if (existsSync(blueprintDir)) {
  let capViolations = 0;
  let capChecked = 0;
  for (const entry of readdirSync(blueprintDir)) {
    if (!entry.endsWith('.md')) continue;
    if (INDEX_FILES.has(entry)) continue; // only true index files are exempt
    const filePath = join(blueprintDir, entry);
    if (!statSync(filePath).isFile()) continue;
    const lineCount = readFileSync(filePath, 'utf8').split('\n').length;
    capChecked++;
    if (lineCount > BLUEPRINT_LINE_CAP) {
      warn(`Blueprint sub-file "${entry}" is ${lineCount} lines (cap: ${BLUEPRINT_LINE_CAP}) — consider splitting`);
      capViolations++;
    }
  }
  if (capChecked > 0 && capViolations === 0) {
    pass(`All ${capChecked} blueprint sub-file(s) within ${BLUEPRINT_LINE_CAP}-line cap`);
  } else if (capChecked === 0) {
    pass('Blueprint 250-line cap: no sub-files found to check');
  }
}

// ─── Check (deferred): Phase number range ─────────────────────────────────────
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

// ─── Check 5: Blueprint VERSION file in changelist when blueprint docs changed ─
// In CI, CHANGED_FILES env var contains newline-separated file paths.
// If any blueprint doc changed (docs/blueprint/**) but docs/blueprint/VERSION
// did not → warn. Non-blocking (WARN only — human confirms if bump needed).
const changedFilesEnv = process.env.CHANGED_FILES;
if (changedFilesEnv) {
  const changedFiles = changedFilesEnv.split('\n').map(f => f.trim()).filter(Boolean);
  const versionFile = 'docs/blueprint/VERSION';
  const blueprintDocChanged = changedFiles.some(
    f => f.startsWith('docs/blueprint/') && f !== versionFile
  );
  const versionChanged = changedFiles.includes(versionFile);
  if (blueprintDocChanged && !versionChanged) {
    warn('Blueprint docs changed — verify docs/blueprint/VERSION is updated if this is a MINOR/MAJOR change (CONTRIBUTING.md).');
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────
console.log('\n=== BLUEPRINT VALIDATION ===\n');
for (const p of passes) console.log(`[PASS] ${p}`);
if (warnings.length > 0) {
  for (const w of warnings) console.log(`[WARN] ${w}`);
}
if (failures.length > 0) {
  for (const f of failures) console.log(`[FAIL] ${f}`);
  console.log(`\nRESULT: ${failures.length} failure(s)\n`);
  process.exit(1);
} else {
  console.log('\nRESULT: all checks passed\n');
}
