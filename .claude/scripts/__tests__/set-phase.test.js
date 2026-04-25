// __tests__/set-phase.test.js
// node --test .claude/scripts/__tests__/set-phase.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'set-phase.js');

function run(cwd, ...args) {
  return spawnSync('node', [SCRIPT, ...args], { cwd, encoding: 'utf8' });
}

function setup() {
  return mkdtempSync(join(tmpdir(), 'sp-test-'));
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

test('writes phase name to .claude/.phase', () => {
  const dir = setup();
  try {
    const r = run(dir, 'implement');
    assert.equal(r.status, 0, r.stderr);
    const content = readFileSync(join(dir, '.claude', '.phase'), 'utf8').trim();
    assert.equal(content, 'implement');
  } finally {
    teardown(dir);
  }
});

test('normalizes phase name to lowercase', () => {
  const dir = setup();
  try {
    const r = run(dir, 'IMPLEMENT');
    assert.equal(r.status, 0, r.stderr);
    const content = readFileSync(join(dir, '.claude', '.phase'), 'utf8').trim();
    assert.equal(content, 'implement');
  } finally {
    teardown(dir);
  }
});

test('trims whitespace from phase name', () => {
  const dir = setup();
  try {
    const r = run(dir, '  test  ');
    assert.equal(r.status, 0, r.stderr);
    const content = readFileSync(join(dir, '.claude', '.phase'), 'utf8').trim();
    assert.equal(content, 'test');
  } finally {
    teardown(dir);
  }
});

test('creates .claude directory if absent', () => {
  const dir = setup();
  try {
    const r = run(dir, 'design');
    assert.equal(r.status, 0, r.stderr);
    assert.ok(existsSync(join(dir, '.claude')));
    assert.ok(existsSync(join(dir, '.claude', '.phase')));
  } finally {
    teardown(dir);
  }
});

test('rejects invalid phase name with exit 1', () => {
  const dir = setup();
  try {
    const r = run(dir, 'nonsense-phase');
    assert.equal(r.status, 1);
    assert.ok(r.stderr.includes('invalid phase'));
    assert.ok(!existsSync(join(dir, '.claude', '.phase')));
  } finally {
    teardown(dir);
  }
});

test('shows usage when called with no argument', () => {
  const dir = setup();
  try {
    const r = run(dir);
    assert.equal(r.status, 1);
    assert.ok(r.stderr.includes('Usage:'));
  } finally {
    teardown(dir);
  }
});

test('clear removes existing phase file', () => {
  const dir = setup();
  try {
    mkdirSync(join(dir, '.claude'), { recursive: true });
    writeFileSync(join(dir, '.claude', '.phase'), 'implement\n');
    const r = run(dir, 'clear');
    assert.equal(r.status, 0, r.stderr);
    assert.ok(!existsSync(join(dir, '.claude', '.phase')));
  } finally {
    teardown(dir);
  }
});

test('clear is idempotent when phase file absent', () => {
  const dir = setup();
  try {
    const r = run(dir, 'clear');
    assert.equal(r.status, 0, r.stderr);
    assert.ok(!existsSync(join(dir, '.claude', '.phase')));
  } finally {
    teardown(dir);
  }
});

test('all 11 spec phases are accepted', () => {
  const phases = ['parse','clarify','design','implement','validate','test','review','security','docs','commit','close'];
  for (const p of phases) {
    const dir = setup();
    try {
      const r = run(dir, p);
      assert.equal(r.status, 0, `phase '${p}' rejected: ${r.stderr}`);
      const content = readFileSync(join(dir, '.claude', '.phase'), 'utf8').trim();
      assert.equal(content, p);
    } finally {
      teardown(dir);
    }
  }
});

test('module exports VALID_PHASES and PHASE_FILE', () => {
  const mod = require('../set-phase.js');
  assert.ok(mod.VALID_PHASES instanceof Set);
  assert.equal(mod.PHASE_FILE, '.claude/.phase');
  assert.ok(mod.VALID_PHASES.has('implement'));
  assert.ok(!mod.VALID_PHASES.has('clear'));
});

test('phase-constants is single source of truth — read-guard and set-phase agree', () => {
  const constants = require('../phase-constants.js');
  const setPhase  = require('../set-phase.js');
  assert.strictEqual(setPhase.VALID_PHASES, constants.VALID_PHASES, 'set-phase imports the same Set instance');
  assert.strictEqual(setPhase.PHASE_FILE,   constants.PHASE_FILE,   'set-phase imports the same PHASE_FILE');
  // COMPACT_VULNERABLE must be a subset of VALID_PHASES — invariant check.
  for (const p of constants.COMPACT_VULNERABLE) {
    assert.ok(constants.VALID_PHASES.has(p), `COMPACT_VULNERABLE phase '${p}' missing from VALID_PHASES`);
  }
});
