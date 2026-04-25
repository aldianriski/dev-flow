// __tests__/validate-blueprint.test.js
// node --test .claude/scripts/__tests__/validate-blueprint.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'validate-blueprint.js');

const EXPECTED_AGENTS = [
  'design-analyst.md',
  'init-analyst.md',
  'code-reviewer.md',
  'security-analyst.md',
  'migration-analyst.md',
  'performance-analyst.md',
  'scope-analyst.md',
];

function run(dir) {
  return spawnSync('node', [SCRIPT, dir], { encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'vb-test-'));
  mkdirSync(join(dir, '.claude', 'skills', 'my-skill'), { recursive: true });
  mkdirSync(join(dir, '.claude', 'agents'), { recursive: true });
  return dir;
}

function scaffoldManifest(dir, skills) {
  const entries = skills || [{ name: 'my-skill', path: 'my-skill/SKILL.md', 'last-validated': '2026-01-01' }];
  writeFileSync(join(dir, '.claude', 'skills', 'MANIFEST.json'), JSON.stringify({ version: '1.0', skills: entries }));
}

function scaffoldSkill(dir) {
  writeFileSync(join(dir, '.claude', 'skills', 'my-skill', 'SKILL.md'), '---\nname: my-skill\n---\n');
}

function scaffoldAgents(dir) {
  for (const f of EXPECTED_AGENTS) {
    writeFileSync(join(dir, '.claude', 'agents', f), '---\n---\n');
  }
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

test('passes with all skills and agents present', () => {
  const dir = setup();
  try {
    scaffoldManifest(dir);
    scaffoldSkill(dir);
    scaffoldAgents(dir);
    const result = run(dir);
    assert.equal(result.status, 0, result.stdout);
    assert.ok(result.stdout.includes('RESULT: all checks passed'));
  } finally {
    teardown(dir);
  }
});

test('fails when MANIFEST.json is missing', () => {
  const dir = setup();
  try {
    scaffoldAgents(dir);
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('MANIFEST.json'));
  } finally {
    teardown(dir);
  }
});

test('fails when a MANIFEST skill path is missing on filesystem', () => {
  const dir = setup();
  try {
    scaffoldManifest(dir, [{ name: 'ghost-skill', path: 'ghost-skill/SKILL.md', 'last-validated': '2026-01-01' }]);
    scaffoldAgents(dir);
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('ghost-skill'));
  } finally {
    teardown(dir);
  }
});

test('fails when an expected agent file is missing', () => {
  const dir = setup();
  try {
    scaffoldManifest(dir);
    scaffoldSkill(dir);
    // Agents intentionally not created
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('Agent file missing'));
  } finally {
    teardown(dir);
  }
});

test('reports each missing agent separately', () => {
  const dir = setup();
  try {
    scaffoldManifest(dir);
    scaffoldSkill(dir);
    // Create only one agent — rest missing
    writeFileSync(join(dir, '.claude', 'agents', 'code-reviewer.md'), '---\n---\n');
    const result = run(dir);
    assert.equal(result.status, 1);
    const missingCount = (result.stdout.match(/\[FAIL\]/g) || []).length;
    assert.ok(missingCount >= EXPECTED_AGENTS.length - 1, `expected ≥${EXPECTED_AGENTS.length - 1} failures`);
  } finally {
    teardown(dir);
  }
});

test('output always contains BLUEPRINT VALIDATION header', () => {
  const dir = setup();
  try {
    scaffoldManifest(dir);
    scaffoldSkill(dir);
    scaffoldAgents(dir);
    const result = run(dir);
    assert.ok(result.stdout.includes('=== BLUEPRINT VALIDATION ==='));
  } finally {
    teardown(dir);
  }
});
