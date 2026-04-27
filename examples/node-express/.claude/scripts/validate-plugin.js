// .claude/scripts/validate-plugin.js
// CI hard-gate: validates the .claude-plugin/plugin.json manifest exists and has required fields.
// Usage: node .claude/scripts/validate-plugin.js [root-dir]
// Exit 0: all checks pass. Exit 1: any check fails.
// Pure Node (>=18), CommonJS, no shell-outs — cross-platform.
'use strict';

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const root = process.argv[2] || '.';

const passes = [];
const failures = [];

function pass(msg) { passes.push(msg); }
function fail(msg) { failures.push(msg); }

// ─── Check 1: plugin.json exists ─────────────────────────────────────────────
const pluginPath = join(root, '.claude-plugin', 'plugin.json');
if (!existsSync(pluginPath)) {
  fail('.claude-plugin/plugin.json missing');
} else {
  pass('.claude-plugin/plugin.json present');

  // ─── Check 2: Valid JSON ────────────────────────────────────────────────────
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(pluginPath, 'utf8'));
    pass('plugin.json is valid JSON');
  } catch (e) {
    fail(`plugin.json invalid JSON: ${e.message}`);
  }

  if (manifest) {
    // ─── Check 3: Required CC spec fields ──────────────────────────────────────
    const CC_REQUIRED = ['name', 'description', 'version'];
    const missingCC = CC_REQUIRED.filter(f => !manifest[f] || typeof manifest[f] !== 'string' || manifest[f].trim() === '');
    if (missingCC.length > 0) {
      fail(`plugin.json missing required CC fields: ${missingCC.join(', ')}`);
    } else {
      pass(`CC required fields present (name="${manifest.name}", version="${manifest.version}")`);
    }

    // ─── Check 4: dev-flow convention fields ───────────────────────────────────
    const conventionFailures = [];
    if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) {
      conventionFailures.push('skills[] must be a non-empty array');
    }
    if (!Array.isArray(manifest.agents)) {
      conventionFailures.push('agents[] must be an array');
    }
    if (!manifest.hooks || typeof manifest.hooks !== 'string' || manifest.hooks.trim() === '') {
      conventionFailures.push('hooks must be a non-empty string');
    }
    if (conventionFailures.length > 0) {
      for (const msg of conventionFailures) fail(`plugin.json convention: ${msg}`);
    } else {
      pass(`Convention fields valid (${manifest.skills.length} skills, ${manifest.agents.length} agents)`);
    }
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────
console.log('=== PLUGIN MANIFEST VALIDATION ===\n');
for (const msg of passes)   console.log(`[PASS] ${msg}`);
for (const msg of failures) console.log(`[FAIL] ${msg}`);
console.log('');

if (failures.length === 0) {
  console.log('RESULT: all checks passed');
  process.exit(0);
} else {
  console.log(`RESULT: ${failures.length} failure(s) — fix before merge`);
  process.exit(1);
}
