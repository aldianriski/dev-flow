// __tests__/validate-plugin.test.js
// node --test .claude/scripts/__tests__/validate-plugin.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'validate-plugin.js');

function run(dir) {
  return spawnSync('node', [SCRIPT, dir], { encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'vp-test-'));
  mkdirSync(join(dir, '.claude-plugin'), { recursive: true });
  return dir;
}

function writeManifest(dir, content) {
  writeFileSync(join(dir, '.claude-plugin', 'plugin.json'), content);
}

function validManifest() {
  return JSON.stringify({
    name: 'dev-flow',
    description: 'Gate-driven AI workflow system.',
    version: '1.7.0',
    skills: ['dev-flow', 'adr-writer'],
    agents: ['code-reviewer'],
    hooks: 'hooks/hooks.json',
  });
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

test('passes on valid plugin.json', () => {
  const dir = setup();
  try {
    writeManifest(dir, validManifest());
    const result = run(dir);
    assert.equal(result.status, 0, result.stdout);
    assert.ok(result.stdout.includes('RESULT: all checks passed'));
    assert.ok(result.stdout.includes('[PASS]'));
  } finally {
    teardown(dir);
  }
});

test('fails when plugin.json missing', () => {
  const dir = setup();
  try {
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('[FAIL]'));
    assert.ok(result.stdout.includes('.claude-plugin/plugin.json missing'));
  } finally {
    teardown(dir);
  }
});

test('fails on invalid JSON', () => {
  const dir = setup();
  try {
    writeManifest(dir, '{ not valid json');
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('[FAIL]'));
    assert.ok(result.stdout.includes('invalid JSON'));
  } finally {
    teardown(dir);
  }
});

test('fails when name missing', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    delete m.name;
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('name'));
  } finally {
    teardown(dir);
  }
});

test('fails when description missing', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    delete m.description;
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('description'));
  } finally {
    teardown(dir);
  }
});

test('fails when version missing', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    delete m.version;
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('version'));
  } finally {
    teardown(dir);
  }
});

test('fails when skills is empty array', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    m.skills = [];
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('skills'));
  } finally {
    teardown(dir);
  }
});

test('fails when skills is not array', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    m.skills = 'dev-flow';
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('skills'));
  } finally {
    teardown(dir);
  }
});

test('fails when agents is not array', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    m.agents = 'code-reviewer';
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('agents'));
  } finally {
    teardown(dir);
  }
});

test('fails when hooks missing', () => {
  const dir = setup();
  try {
    const m = JSON.parse(validManifest());
    delete m.hooks;
    writeManifest(dir, JSON.stringify(m));
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes('hooks'));
  } finally {
    teardown(dir);
  }
});

test('output header present', () => {
  const dir = setup();
  try {
    writeManifest(dir, validManifest());
    const result = run(dir);
    assert.ok(result.stdout.includes('=== PLUGIN MANIFEST VALIDATION ==='));
  } finally {
    teardown(dir);
  }
});
