// scripts/__tests__/eval-measure.test.js
// Smoke tests for eval-measure.js. Runnable: `node --test scripts/__tests__/eval-measure.test.js`.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { existsSync, writeFileSync, mkdtempSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const SCRIPT = join(process.cwd(), 'scripts', 'eval-measure.js');

function fixtureSnapshot() {
  return {
    metadata: {
      generated_at: '2026-05-10T00:00:00.000Z',
      claude_cli_version: '2.0.0 (test)',
      model: 'test-model',
      n_prompts: 2,
      terse_prefix: 'Answer concisely.',
    },
    prompts: ['What is 2+2?', 'Explain TCP.'],
    arms: {
      __baseline__: [
        'Two plus two equals four. This is a basic arithmetic operation.',
        'TCP is a connection-oriented transport protocol that provides reliable, ordered, and error-checked delivery of data between applications running on hosts.',
      ],
      __terse__: [
        'Four.',
        'TCP is connection-oriented, reliable, ordered transport.',
      ],
      caveman: [
        '4',
        'TCP: reliable, ordered. Slow.',
      ],
    },
  };
}

test('script exists', () => {
  assert.ok(existsSync(SCRIPT), 'eval-measure.js must exist');
});

test('exits 2 without --snapshot flag', () => {
  const res = spawnSync('node', [SCRIPT], { encoding: 'utf8' });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /--snapshot/);
});

test('exits 2 when snapshot file missing', () => {
  const res = spawnSync('node', [SCRIPT, '--snapshot', '/does/not/exist.json'], { encoding: 'utf8' });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /not found|Snapshot not found/);
});

test('produces markdown report with expected sections', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-measure-test-'));
  const snap = join(tmpDir, 'snap.json');
  writeFileSync(snap, JSON.stringify(fixtureSnapshot()), 'utf8');
  const res = spawnSync('node', [SCRIPT, '--snapshot', snap], { encoding: 'utf8' });
  assert.equal(res.status, 0, `eval-measure failed: ${res.stderr}`);
  assert.match(res.stdout, /Reference arms/);
  assert.match(res.stdout, /baseline/);
  assert.match(res.stdout, /terse control/);
  assert.match(res.stdout, /\| Skill \| n \| Median \| Mean/);
  assert.match(res.stdout, /\*\*caveman\*\*/);
});

test('--format json produces valid JSON with required fields', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-measure-test-'));
  const snap = join(tmpDir, 'snap.json');
  writeFileSync(snap, JSON.stringify(fixtureSnapshot()), 'utf8');
  const res = spawnSync('node', [SCRIPT, '--snapshot', snap, '--format', 'json'], { encoding: 'utf8' });
  assert.equal(res.status, 0);
  const out = JSON.parse(res.stdout);
  assert.ok(out.metadata);
  assert.equal(out.metadata.encoding, 'o200k_base');
  assert.equal(out.metadata.snapshot, snap);
  assert.ok(typeof out.metadata.baseline_total_tokens === 'number');
  assert.ok(typeof out.metadata.terse_total_tokens === 'number');
  assert.ok(out.metadata.terse_total_tokens < out.metadata.baseline_total_tokens, 'terse should compress vs baseline in fixture');
  assert.ok(Array.isArray(out.skills));
  assert.equal(out.skills.length, 1);
  assert.equal(out.skills[0].skill, 'caveman');
});

test('caveman arm shows positive savings vs terse in fixture (caveman is shorter)', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-measure-test-'));
  const snap = join(tmpDir, 'snap.json');
  writeFileSync(snap, JSON.stringify(fixtureSnapshot()), 'utf8');
  const res = spawnSync('node', [SCRIPT, '--snapshot', snap, '--format', 'json'], { encoding: 'utf8' });
  assert.equal(res.status, 0);
  const out = JSON.parse(res.stdout);
  const cm = out.skills[0];
  assert.ok(cm.median > 0, `caveman median savings should be > 0 (got ${cm.median})`);
  assert.ok(cm.mean > 0, `caveman mean savings should be > 0 (got ${cm.mean})`);
  assert.ok(cm.skillTotal < cm.terseTotal, 'caveman total tokens should be less than terse total');
});

test('exits 3 when snapshot missing required arms', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-measure-test-'));
  const snap = join(tmpDir, 'snap.json');
  writeFileSync(snap, JSON.stringify({ metadata: {}, prompts: [], arms: { caveman: ['x'] } }), 'utf8');
  const res = spawnSync('node', [SCRIPT, '--snapshot', snap], { encoding: 'utf8' });
  assert.equal(res.status, 3);
  assert.match(res.stderr, /__baseline__|__terse__/);
});

test('--format invalid value rejected', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-measure-test-'));
  const snap = join(tmpDir, 'snap.json');
  writeFileSync(snap, JSON.stringify(fixtureSnapshot()), 'utf8');
  const res = spawnSync('node', [SCRIPT, '--snapshot', snap, '--format', 'csv'], { encoding: 'utf8' });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /md or json/);
});
