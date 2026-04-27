// __tests__/phase-cycle.integration.test.js
// Integration test: set-phase.js + read-guard.js full cycle.
// Verifies the Thin-Coordinator Rule loop is closed in real sessions:
//   set-phase → Read attempt during compact-vulnerable phase → blocked → clear → allowed.
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, rmSync, symlinkSync, writeFileSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const { COMPACT_VULNERABLE } = require('../phase-constants');

const SET_PHASE  = join(__dirname, '..', 'set-phase.js');
const READ_GUARD = join(__dirname, '..', 'read-guard.js');

function setPhase(cwd, phase) {
  return spawnSync('node', [SET_PHASE, phase], { cwd, encoding: 'utf8' });
}

function readGuard(cwd, toolInput) {
  const stdin = JSON.stringify({ tool_name: 'Read', tool_input: toolInput });
  return spawnSync('node', [READ_GUARD], { cwd, encoding: 'utf8', input: stdin });
}

function setup() {
  return mkdtempSync(join(tmpdir(), 'pc-itest-'));
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

test('full cycle: set implement → blocked → clear → allowed', () => {
  const dir = setup();
  try {
    // Arrange: phase = implement (compact-vulnerable)
    const setResult = setPhase(dir, 'implement');
    assert.equal(setResult.status, 0, setResult.stderr);

    // Act 1: attempt to Read a non-allowlisted source file → must block
    const blocked = readGuard(dir, { file_path: 'src/foo.js' });
    assert.equal(blocked.status, 2, `expected exit 2, got ${blocked.status}: ${blocked.stdout}`);
    assert.ok(blocked.stdout.includes('"decision":"block"'), 'block decision in stdout');
    assert.ok(blocked.stdout.includes('Thin-Coordinator Rule'), 'reason cites the §1 rule');

    // Act 2: clear phase → Read should now be allowed
    const clearResult = setPhase(dir, 'clear');
    assert.equal(clearResult.status, 0, clearResult.stderr);

    const allowed = readGuard(dir, { file_path: 'src/foo.js' });
    assert.equal(allowed.status, 0, `expected exit 0 after clear, got ${allowed.status}: ${allowed.stdout}`);
  } finally {
    teardown(dir);
  }
});

test('orchestrator-allowlisted paths pass even during implement phase', () => {
  const dir = setup();
  try {
    setPhase(dir, 'implement');
    const result = readGuard(dir, { file_path: 'TODO.md' });
    assert.equal(result.status, 0, `TODO.md should pass, got ${result.status}: ${result.stdout}`);
  } finally {
    teardown(dir);
  }
});

test('non-vulnerable phase (parse) does not block source-file Reads', () => {
  const dir = setup();
  try {
    setPhase(dir, 'parse');
    const result = readGuard(dir, { file_path: 'src/foo.js' });
    assert.equal(result.status, 0, `parse should not block, got ${result.status}: ${result.stdout}`);
  } finally {
    teardown(dir);
  }
});

test('all compact-vulnerable phases block source-file Reads', () => {
  // Loop over the canonical Set imported from phase-constants — drift
  // between writer and reader will surface here, not in this test's literals.
  for (const phase of COMPACT_VULNERABLE) {
    const dir = setup();
    try {
      setPhase(dir, phase);
      const result = readGuard(dir, { file_path: 'src/foo.js' });
      assert.equal(result.status, 2, `phase '${phase}' should block, got ${result.status}`);
      assert.ok(result.stdout.includes('"decision":"block"'), `phase '${phase}' missing block decision`);
    } finally {
      teardown(dir);
    }
  }
});

test('set-phase refuses to write through a symlink', { skip: process.platform === 'win32' && !process.env.CI ? 'symlink creation requires admin on Windows; skipped locally' : false }, () => {
  const dir = setup();
  try {
    // Plant a symlink in place of .claude/.phase pointing to a sentinel file.
    const claudeDir = join(dir, '.claude');
    require('fs').mkdirSync(claudeDir, { recursive: true });
    const sentinel = join(dir, 'sentinel.txt');
    writeFileSync(sentinel, 'untouched');
    symlinkSync(sentinel, join(claudeDir, '.phase'));

    const r = setPhase(dir, 'implement');
    assert.equal(r.status, 1, `expected refusal, got ${r.status}: ${r.stderr}`);
    assert.ok(r.stderr.includes('symlink'), `error mentions symlink: ${r.stderr}`);

    const after = require('fs').readFileSync(sentinel, 'utf8');
    assert.equal(after, 'untouched', 'sentinel file was not written through symlink');
  } finally {
    teardown(dir);
  }
});

test('clear is idempotent: second clear keeps Read allowed', () => {
  const dir = setup();
  try {
    setPhase(dir, 'implement');
    setPhase(dir, 'clear');
    const c2 = setPhase(dir, 'clear');
    assert.equal(c2.status, 0, c2.stderr);
    const result = readGuard(dir, { file_path: 'src/foo.js' });
    assert.equal(result.status, 0, result.stdout);
  } finally {
    teardown(dir);
  }
});
