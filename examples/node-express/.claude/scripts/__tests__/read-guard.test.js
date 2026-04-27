// __tests__/read-guard.test.js
// node --test .claude/scripts/__tests__/read-guard.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'read-guard.js');

function run(cwd, stdinJson) {
  const input = typeof stdinJson === 'string' ? stdinJson : JSON.stringify(stdinJson);
  return spawnSync('node', [SCRIPT], {
    cwd,
    input,
    encoding: 'utf8',
  });
}

function setup(phase) {
  const dir = mkdtempSync(join(tmpdir(), 'rg-test-'));
  mkdirSync(join(dir, '.claude'), { recursive: true });
  if (phase) writeFileSync(join(dir, '.claude', '.phase'), phase);
  return dir;
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

// No .phase file → allow
test('allows when no .phase file exists', () => {
  const dir = setup(null);
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/index.js' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

// Non-vulnerable phase → allow
test('allows when phase is not compact-vulnerable', () => {
  const dir = setup('parse');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/index.js' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

// Vulnerable phase + non-allowlisted path → block (exit 2)
test('blocks during implement phase for non-allowlisted path', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/service.js' } });
    assert.equal(result.status, 2, 'should exit 2 for blocked read');
  } finally {
    teardown(dir);
  }
});

test('blocks during test phase', () => {
  const dir = setup('test');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/service.js' } });
    assert.equal(result.status, 2);
  } finally {
    teardown(dir);
  }
});

test('blocks during review phase', () => {
  const dir = setup('review');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/service.js' } });
    assert.equal(result.status, 2);
  } finally {
    teardown(dir);
  }
});

test('blocks during security phase', () => {
  const dir = setup('security');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/service.js' } });
    assert.equal(result.status, 2);
  } finally {
    teardown(dir);
  }
});

test('blocks during docs phase', () => {
  const dir = setup('docs');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/service.js' } });
    assert.equal(result.status, 2);
  } finally {
    teardown(dir);
  }
});

// Allowlisted paths → allow even in vulnerable phase
test('allows TODO.md even in implement phase', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'TODO.md' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

test('allows .claude/.phase in implement phase', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: '.claude/.phase' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

test('allows .claude/CLAUDE.md in implement phase', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: '.claude/CLAUDE.md' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

test('allows .claude/skills/MANIFEST.json in implement phase', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: '.claude/skills/MANIFEST.json' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

// Block emits structured JSON with decision: block
test('blocked response contains decision:block JSON', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'src/service.js' } });
    assert.equal(result.status, 2);
    const parsed = JSON.parse(result.stdout.trim());
    assert.equal(parsed.decision, 'block');
    assert.ok(typeof parsed.reason === 'string' && parsed.reason.length > 0);
  } finally {
    teardown(dir);
  }
});

// Empty stdin → allow (fail-open)
test('allows when stdin is empty (fail-open)', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, '');
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

// Supports `path` field as fallback (for Grep/Glob)
test('blocks on tool_input.path fallback for Grep tool', () => {
  const dir = setup('review');
  try {
    const result = run(dir, { tool_name: 'Grep', tool_input: { path: 'src/', pattern: 'foo' } });
    assert.equal(result.status, 2);
  } finally {
    teardown(dir);
  }
});

// .claude/scripts/ allowlist → allow even in compact-vulnerable phase
test('allows .claude/scripts/ files in implement phase', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: '.claude/scripts/session-start.js' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

// Plugin-root allowlist entries (no .claude/ prefix)
test('allows skills/MANIFEST.json in implement phase (plugin layout)', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'skills/MANIFEST.json' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});

test('allows scripts/ files in implement phase (plugin layout)', () => {
  const dir = setup('implement');
  try {
    const result = run(dir, { tool_name: 'Read', tool_input: { file_path: 'scripts/session-start.js' } });
    assert.equal(result.status, 0);
  } finally {
    teardown(dir);
  }
});
