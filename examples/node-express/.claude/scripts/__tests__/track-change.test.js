// __tests__/track-change.test.js
// node --test .claude/scripts/__tests__/track-change.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'track-change.js');

function run(cwd, stdinJson) {
  const input = typeof stdinJson === 'string' ? stdinJson : JSON.stringify(stdinJson);
  return spawnSync('node', [SCRIPT], { cwd, input, encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'tc-test-'));
  mkdirSync(join(dir, '.claude'), { recursive: true });
  return dir;
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

function changesContent(dir) {
  const f = join(dir, '.claude', '.session-changes.txt');
  return existsSync(f) ? readFileSync(f, 'utf8') : '';
}

// Normal file → appended
test('appends file path to session-changes.txt', () => {
  const dir = setup();
  try {
    const result = run(dir, { tool_name: 'Write', tool_input: { file_path: 'src/index.js' } });
    assert.equal(result.status, 0);
    assert.ok(changesContent(dir).includes('src/index.js'));
  } finally {
    teardown(dir);
  }
});

// Multiple files accumulate
test('accumulates multiple file entries', () => {
  const dir = setup();
  try {
    run(dir, { tool_name: 'Write', tool_input: { file_path: 'src/a.js' } });
    run(dir, { tool_name: 'Edit',  tool_input: { file_path: 'src/b.js' } });
    const content = changesContent(dir);
    assert.ok(content.includes('src/a.js'));
    assert.ok(content.includes('src/b.js'));
  } finally {
    teardown(dir);
  }
});

// .claude/ files → ignored
test('ignores .claude/ internal files', () => {
  const dir = setup();
  try {
    run(dir, { tool_name: 'Write', tool_input: { file_path: '.claude/settings.json' } });
    assert.equal(changesContent(dir), '');
  } finally {
    teardown(dir);
  }
});

// node_modules/ → ignored
test('ignores node_modules/', () => {
  const dir = setup();
  try {
    run(dir, { tool_name: 'Write', tool_input: { file_path: 'node_modules/foo/index.js' } });
    assert.equal(changesContent(dir), '');
  } finally {
    teardown(dir);
  }
});

// Lock files → ignored
test('ignores package-lock.json', () => {
  const dir = setup();
  try {
    run(dir, { tool_name: 'Write', tool_input: { file_path: 'package-lock.json' } });
    assert.equal(changesContent(dir), '');
  } finally {
    teardown(dir);
  }
});

test('ignores pnpm-lock.yaml', () => {
  const dir = setup();
  try {
    run(dir, { tool_name: 'Write', tool_input: { file_path: 'pnpm-lock.yaml' } });
    assert.equal(changesContent(dir), '');
  } finally {
    teardown(dir);
  }
});

// Empty stdin → exit 0, no write
test('exits 0 cleanly on empty stdin', () => {
  const dir = setup();
  try {
    const result = run(dir, '');
    assert.equal(result.status, 0);
    assert.equal(changesContent(dir), '');
  } finally {
    teardown(dir);
  }
});

// Missing file_path field → exit 0, no write
test('exits 0 when tool_input has no file_path', () => {
  const dir = setup();
  try {
    const result = run(dir, { tool_name: 'Write', tool_input: {} });
    assert.equal(result.status, 0);
    assert.equal(changesContent(dir), '');
  } finally {
    teardown(dir);
  }
});

// Windows-style backslash paths → normalized to forward slash
test('normalizes backslash paths to forward slashes', () => {
  const dir = setup();
  try {
    run(dir, { tool_name: 'Write', tool_input: { file_path: 'src\\components\\Button.js' } });
    const content = changesContent(dir);
    assert.ok(content.includes('src/components/Button.js'));
  } finally {
    teardown(dir);
  }
});
