// __tests__/validate-scaffold.test.js
// node --test .claude/scripts/__tests__/validate-scaffold.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'validate-scaffold.js');

function run(dir) {
  return spawnSync('node', [SCRIPT, dir], { encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'vs-test-'));
  mkdirSync(join(dir, '.claude', 'skills'), { recursive: true });
  mkdirSync(join(dir, 'docs'), { recursive: true });
  return dir;
}

function scaffold(dir) {
  writeFileSync(join(dir, '.claude', 'CLAUDE.md'), Array(10).fill('line').join('\n'));
  writeFileSync(join(dir, '.claude', 'settings.json'), '{}');
  writeFileSync(join(dir, 'TODO.md'), [
    '---',
    'owner: Tech Lead',
    'last_updated: 2026-01-01',
    'update_trigger: Sprint completed',
    'status: current',
    '---',
    '## Active Sprint',
  ].join('\n'));
  writeFileSync(join(dir, '.claude', 'skills', 'MANIFEST.json'), JSON.stringify({
    version: '1.0',
    skills: [{ name: 'my-skill', path: 'my-skill/SKILL.md', 'last-validated': '2026-01-01', 'user-invocable': true }],
  }));
  mkdirSync(join(dir, '.claude', 'skills', 'my-skill'), { recursive: true });
  writeFileSync(
    join(dir, '.claude', 'skills', 'my-skill', 'SKILL.md'),
    '---\nname: my-skill\ndescription: Use when testing.\n---\n'
  );
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

test('passes on valid scaffold', () => {
  const dir = setup();
  try {
    scaffold(dir);
    const result = run(dir);
    assert.equal(result.status, 0, result.stdout);
    assert.ok(result.stdout.includes('RESULT: all checks passed'));
  } finally {
    teardown(dir);
  }
});

test('fails when CLAUDE.md missing', () => {
  const dir = setup();
  try {
    scaffold(dir);
    rmSync(join(dir, '.claude', 'CLAUDE.md'));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('[FAIL]'));
    assert.ok(result.stdout.includes('.claude/CLAUDE.md'));
  } finally {
    teardown(dir);
  }
});

test('fails when CLAUDE.md exceeds 200 lines', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, '.claude', 'CLAUDE.md'), Array(202).fill('line').join('\n'));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('CLAUDE.md exceeds 200-line limit'));
  } finally {
    teardown(dir);
  }
});

test('fails when TODO.md missing', () => {
  const dir = setup();
  try {
    scaffold(dir);
    rmSync(join(dir, 'TODO.md'));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('TODO.md'));
  } finally {
    teardown(dir);
  }
});

test('fails when TODO.md missing ownership header fields', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, 'TODO.md'), '## Active Sprint\n');
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('ownership header'));
  } finally {
    teardown(dir);
  }
});

test('fails when TODO.md missing Active Sprint section', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, 'TODO.md'), [
      '---', 'owner: Tech Lead', 'last_updated: 2026-01-01',
      'update_trigger: Sprint completed', 'status: current', '---',
      '# No sprint here',
    ].join('\n'));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('Active Sprint'));
  } finally {
    teardown(dir);
  }
});

test('fails when MANIFEST.json is invalid JSON', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, '.claude', 'skills', 'MANIFEST.json'), 'not json {{{');
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('MANIFEST.json'));
  } finally {
    teardown(dir);
  }
});

test('fails when MANIFEST.json missing required version field', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, '.claude', 'skills', 'MANIFEST.json'), JSON.stringify({ skills: [] }));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('MANIFEST.json'));
  } finally {
    teardown(dir);
  }
});

test('fails when skill frontmatter missing description', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, '.claude', 'skills', 'my-skill', 'SKILL.md'), '---\nname: my-skill\n---\n');
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('frontmatter'));
  } finally {
    teardown(dir);
  }
});

test('fails when doc exceeds line limit', () => {
  const dir = setup();
  try {
    scaffold(dir);
    writeFileSync(join(dir, 'README.md'), Array(90).fill('line').join('\n'));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('README.md'));
    assert.ok(result.stdout.includes('line limit'));
  } finally {
    teardown(dir);
  }
});

test('output always contains SCAFFOLD VALIDATION header', () => {
  const dir = setup();
  try {
    scaffold(dir);
    const result = run(dir);
    assert.ok(result.stdout.includes('=== SCAFFOLD VALIDATION ==='));
  } finally {
    teardown(dir);
  }
});
