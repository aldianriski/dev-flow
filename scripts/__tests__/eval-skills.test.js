// scripts/__tests__/eval-skills.test.js
// Smoke tests for eval-skills.js. Runnable: `node --test scripts/__tests__/eval-skills.test.js`.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const SCRIPT = join(process.cwd(), 'scripts', 'eval-skills.js');

test('script exists', () => {
  assert.ok(existsSync(SCRIPT), 'eval-skills.js must exist');
});

test('script writes report to docs/audit/skill-eval-report.md', () => {
  // May exit non-zero if violations exist — accept that, just assert the file.
  try { execFileSync('node', [SCRIPT], { stdio: 'pipe' }); } catch {}
  assert.ok(existsSync('docs/audit/skill-eval-report.md'));
});

test('passes synthetic compliant skill', () => {
  const dir = mkdtempSync(join(tmpdir(), 'devflow-eval-'));
  try {
    mkdirSync(join(dir, 'skills', 'fake-skill'), { recursive: true });
    mkdirSync(join(dir, 'docs', 'audit'), { recursive: true });
    const skillBody = [
      '---',
      'name: fake-skill',
      'description: Use when testing the eval harness. Does nothing.',
      '---',
      '',
      '# fake-skill',
      '',
      '## Red Flags',
      '- none',
      ''
    ].join('\n');
    writeFileSync(join(dir, 'skills', 'fake-skill', 'SKILL.md'), skillBody);
    const out = execFileSync('node', [SCRIPT], { cwd: dir, stdio: 'pipe' }).toString();
    assert.match(out, /pass=1 fail=0/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('fails synthetic non-compliant skill (missing Red Flags)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'devflow-eval-'));
  try {
    mkdirSync(join(dir, 'skills', 'bad-skill'), { recursive: true });
    mkdirSync(join(dir, 'docs', 'audit'), { recursive: true });
    const skillBody = [
      '---',
      'name: bad-skill',
      'description: Use when testing failure path.',
      '---',
      '',
      '# bad-skill',
      ''
    ].join('\n');
    writeFileSync(join(dir, 'skills', 'bad-skill', 'SKILL.md'), skillBody);
    let exited = 0;
    try { execFileSync('node', [SCRIPT], { cwd: dir, stdio: 'pipe' }); }
    catch (e) { exited = e.status; }
    assert.equal(exited, 1, 'exit non-zero when violations exist');
    const report = readFileSync(join(dir, 'docs/audit/skill-eval-report.md'), 'utf8');
    assert.match(report, /R7/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('fails when description does not start with "Use when"', () => {
  const dir = mkdtempSync(join(tmpdir(), 'devflow-eval-'));
  try {
    mkdirSync(join(dir, 'skills', 'wrong-desc'), { recursive: true });
    mkdirSync(join(dir, 'docs', 'audit'), { recursive: true });
    const skillBody = [
      '---',
      'name: wrong-desc',
      'description: Does stuff when called.',
      '---',
      '',
      '# wrong-desc',
      '',
      '## Red Flags',
      '- none'
    ].join('\n');
    writeFileSync(join(dir, 'skills', 'wrong-desc', 'SKILL.md'), skillBody);
    let exited = 0;
    try { execFileSync('node', [SCRIPT], { cwd: dir, stdio: 'pipe' }); }
    catch (e) { exited = e.status; }
    assert.equal(exited, 1);
    const report = readFileSync(join(dir, 'docs/audit/skill-eval-report.md'), 'utf8');
    assert.match(report, /R4/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
