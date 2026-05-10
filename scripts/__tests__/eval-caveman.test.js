// scripts/__tests__/eval-caveman.test.js
// Smoke tests for eval-caveman.js. Runnable: `node --test scripts/__tests__/eval-caveman.test.js`.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync, readdirSync, mkdtempSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const SCRIPT = join(process.cwd(), 'scripts', 'eval-caveman.js');

test('script exists', () => {
  assert.ok(existsSync(SCRIPT), 'eval-caveman.js must exist');
});

test('--dry-run produces snapshot without invoking claude (caveman skill resolves)', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-caveman-test-'));
  const outPath = join(tmpDir, 'snap.json');
  const res = spawnSync('node', [SCRIPT, '--dry-run', '--out', outPath], { encoding: 'utf8' });
  assert.equal(res.status, 0, `eval-caveman --dry-run failed: ${res.stderr}`);
  assert.ok(existsSync(outPath), 'snapshot file must be written');
  const snap = JSON.parse(readFileSync(outPath, 'utf8'));
  assert.ok(snap.metadata, 'snapshot.metadata must exist');
  assert.equal(snap.metadata.terse_prefix, 'Answer concisely.');
  assert.ok(snap.metadata.n_prompts > 0, 'n_prompts must be > 0');
  assert.ok(Array.isArray(snap.prompts), 'snapshot.prompts must be array');
  assert.ok(snap.arms.__baseline__, 'arms.__baseline__ required');
  assert.ok(snap.arms.__terse__, 'arms.__terse__ required');
  assert.ok(snap.arms.caveman, 'default skill arm "caveman" required');
  assert.equal(snap.arms.__baseline__.length, snap.metadata.n_prompts);
  assert.equal(snap.arms.__terse__.length, snap.metadata.n_prompts);
  assert.equal(snap.arms.caveman.length, snap.metadata.n_prompts);
});

test('--skill flag overrides default arm name', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-caveman-test-'));
  const outPath = join(tmpDir, 'snap.json');
  // caveman-commit also exists in plugin cache; use it as alternate skill target
  const res = spawnSync('node', [SCRIPT, '--dry-run', '--skill', 'caveman-commit', '--plugin', 'caveman', '--out', outPath], { encoding: 'utf8' });
  assert.equal(res.status, 0, `--skill caveman-commit failed: ${res.stderr}`);
  const snap = JSON.parse(readFileSync(outPath, 'utf8'));
  assert.ok(snap.arms['caveman-commit'], 'arm name should match --skill value');
  assert.equal(snap.arms.caveman, undefined, 'default "caveman" arm should NOT be present');
});

test('# comment lines in prompts file are filtered', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-caveman-test-'));
  const promptsPath = join(tmpDir, 'prompts.txt');
  const outPath = join(tmpDir, 'snap.json');
  writeFileSync(promptsPath, '# comment line 1\n# comment line 2\nReal prompt.\n# tail comment\n', 'utf8');
  const res = spawnSync('node', [SCRIPT, '--dry-run', '--prompts', promptsPath, '--out', outPath], { encoding: 'utf8' });
  assert.equal(res.status, 0, `dry-run with custom prompts failed: ${res.stderr}`);
  const snap = JSON.parse(readFileSync(outPath, 'utf8'));
  assert.equal(snap.metadata.n_prompts, 1, '# comment lines must be filtered; only "Real prompt." remains');
  assert.equal(snap.prompts[0], 'Real prompt.');
});

test('CAVEMAN_SKILL_PATH env override is honored', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-caveman-test-'));
  const fakeSkill = join(tmpDir, 'fake-SKILL.md');
  const outPath = join(tmpDir, 'snap.json');
  writeFileSync(fakeSkill, '# fake skill content\nThis is a test SKILL.md.', 'utf8');
  const res = spawnSync('node', [SCRIPT, '--dry-run', '--out', outPath], {
    encoding: 'utf8',
    env: { ...process.env, CAVEMAN_SKILL_PATH: fakeSkill },
  });
  assert.equal(res.status, 0, `CAVEMAN_SKILL_PATH override failed: ${res.stderr}`);
  // dry-run still produces the snapshot; we just confirm exit was clean
  assert.ok(existsSync(outPath));
});

test('hard-fails when skill cannot be resolved (no silent fallback per OQ(M))', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'eval-caveman-test-'));
  const outPath = join(tmpDir, 'snap.json');
  const res = spawnSync('node', [SCRIPT, '--dry-run', '--skill', 'definitely-nonexistent-skill', '--plugin', 'definitely-nonexistent-plugin', '--out', outPath], { encoding: 'utf8' });
  assert.notEqual(res.status, 0, 'must hard-fail when skill unresolvable');
  assert.match(res.stderr, /not found|FATAL/, 'error message should be operator-actionable');
  assert.ok(!existsSync(outPath), 'snapshot must NOT be written on resolution failure');
});
