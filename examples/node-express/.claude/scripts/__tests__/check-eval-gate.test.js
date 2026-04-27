'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const SCRIPT = path.resolve(__dirname, '../check-eval-gate.js');

function run(changedFiles, baseRef) {
  const env = { ...process.env };
  env.CHANGED_FILES = changedFiles.join('\n');
  if (baseRef !== undefined) env.GITHUB_BASE_REF = baseRef;
  else delete env.GITHUB_BASE_REF;

  try {
    const out = execFileSync(process.execPath, [SCRIPT], { env, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (err) {
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
}

const { test } = require('node:test');
const assert = require('node:assert/strict');

test('skips when GITHUB_BASE_REF absent', () => {
  const { code, out } = run([], undefined);
  assert.equal(code, 0);
  assert.ok(out.includes('skipped'));
});

test('skips when no SKILL.md in diff', () => {
  const files = ['README.md', 'docs/CHANGELOG.md'];
  const { code, out } = run(files, 'master');
  assert.equal(code, 0);
  assert.ok(out.includes('skipped'));
});

test('passes when skill has after.json and matching runs/*.md', () => {
  const files = [
    '.claude/skills/dev-flow/SKILL.md',
    'evals/snapshots/dev-flow/TASK-055-after.json',
    'evals/runs/TASK-055.md',
  ];
  const { code, out } = run(files, 'master');
  assert.equal(code, 0);
  assert.ok(out.includes('1 skill change'));
});

test('fails when after.json missing', () => {
  const files = [
    '.claude/skills/pr-reviewer/SKILL.md',
    'evals/runs/TASK-099.md',
  ];
  const { code, err } = run(files, 'master');
  assert.equal(code, 1);
  assert.ok(err.includes('missing evals/snapshots/pr-reviewer'));
});

test('fails when runs/*.md missing for task-id', () => {
  const files = [
    '.claude/skills/pr-reviewer/SKILL.md',
    'evals/snapshots/pr-reviewer/TASK-099-after.json',
  ];
  const { code, err } = run(files, 'master');
  assert.equal(code, 1);
  assert.ok(err.includes('evals/runs/TASK-099.md'));
});

test('fails when both artifacts missing', () => {
  const files = ['.claude/skills/adr-writer/SKILL.md'];
  const { code, err } = run(files, 'master');
  assert.equal(code, 1);
  assert.ok(err.includes('missing evals/snapshots/adr-writer'));
});

test('passes multiple skills when all have matching artifacts', () => {
  const files = [
    '.claude/skills/dev-flow/SKILL.md',
    '.claude/skills/pr-reviewer/SKILL.md',
    'evals/snapshots/dev-flow/TASK-055-after.json',
    'evals/snapshots/pr-reviewer/TASK-055-after.json',
    'evals/runs/TASK-055.md',
  ];
  const { code, out } = run(files, 'master');
  assert.equal(code, 0);
  assert.ok(out.includes('2 skill change'));
});

test('after.json for wrong skill does not satisfy', () => {
  const files = [
    '.claude/skills/adr-writer/SKILL.md',
    'evals/snapshots/dev-flow/TASK-055-after.json', // wrong skill
    'evals/runs/TASK-055.md',
  ];
  const { code, err } = run(files, 'master');
  assert.equal(code, 1);
  assert.ok(err.includes('missing evals/snapshots/adr-writer'));
});

test('run file for different task-id does not satisfy (regression: shared runsPattern bug)', () => {
  // dev-flow uses TASK-055, pr-reviewer uses TASK-056 — only TASK-055.md present
  const files = [
    '.claude/skills/dev-flow/SKILL.md',
    '.claude/skills/pr-reviewer/SKILL.md',
    'evals/snapshots/dev-flow/TASK-055-after.json',
    'evals/snapshots/pr-reviewer/TASK-056-after.json',
    'evals/runs/TASK-055.md',  // satisfies dev-flow only
  ];
  const { code, err } = run(files, 'master');
  assert.equal(code, 1);
  assert.ok(err.includes('TASK-056'));
});
