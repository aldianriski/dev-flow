// __tests__/session-start.test.js
// node --test .claude/scripts/__tests__/session-start.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { spawnSync } = require('child_process');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const SCRIPT = join(__dirname, '..', 'session-start.js');

function run(cwd) {
  return spawnSync('node', [SCRIPT], { cwd, encoding: 'utf8' });
}

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'ss-test-'));
  mkdirSync(join(dir, '.claude', 'skills'), { recursive: true });
  mkdirSync(join(dir, 'docs'), { recursive: true });
  return dir;
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

// Check 1: BLOCK when settings.local.json is absent
test('Check 1 — errors when settings.local.json missing', () => {
  const dir = setup();
  try {
    const result = run(dir);
    assert.equal(result.status, 1, 'should exit 1 on blocking error');
    assert.ok(result.stderr.includes('BLOCK:'), 'should include BLOCK message');
    assert.ok(result.stderr.includes('settings.local.json'), 'should mention settings.local.json');
  } finally {
    teardown(dir);
  }
});

// Check 1: passes when settings.local.json exists
test('Check 1 — passes when settings.local.json present', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    const result = run(dir);
    assert.ok(result.stdout.includes('✓ settings.local.json present'));
  } finally {
    teardown(dir);
  }
});

// Check 2: WARN when CLAUDE.md exceeds 200 lines
test('Check 2 — warns when CLAUDE.md exceeds 200 lines', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    const longContent = Array(202).fill('line').join('\n');
    writeFileSync(join(dir, '.claude', 'CLAUDE.md'), longContent);
    const result = run(dir);
    assert.ok(result.stdout.includes('WARN: CLAUDE.md'));
  } finally {
    teardown(dir);
  }
});

// Check 2: no warn when CLAUDE.md within budget
test('Check 2 — no warn when CLAUDE.md within 200 lines', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, '.claude', 'CLAUDE.md'), Array(10).fill('line').join('\n'));
    const result = run(dir);
    assert.ok(result.stdout.includes('✓ CLAUDE.md within budget'));
  } finally {
    teardown(dir);
  }
});

// Check 3: warns about skill with no last-validated
test('Check 3 — warns about skill missing last-validated', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    mkdirSync(join(dir, '.claude', 'skills', 'my-skill'), { recursive: true });
    writeFileSync(join(dir, '.claude', 'skills', 'my-skill', 'SKILL.md'), '---\nname: my-skill\n---\n');
    const result = run(dir);
    assert.ok(result.stdout.includes('no last-validated field'));
  } finally {
    teardown(dir);
  }
});

// Check 3: all-clear when skill has fresh last-validated
test('Check 3 — all clear with fresh last-validated', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    mkdirSync(join(dir, '.claude', 'skills', 'my-skill'), { recursive: true });
    const recentDate = new Date().toISOString().slice(0, 10);
    writeFileSync(
      join(dir, '.claude', 'skills', 'my-skill', 'SKILL.md'),
      `---\nname: my-skill\nlast-validated: "${recentDate}"\n---\n`
    );
    const result = run(dir);
    assert.ok(result.stdout.includes('✓ All skills within staleness window'));
  } finally {
    teardown(dir);
  }
});

// Check 7: warns when TODO.md has no Active Sprint
test('Check 7 — warns when TODO.md has no Active Sprint section', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, 'TODO.md'), '# no sprint here\n');
    const result = run(dir);
    assert.ok(result.stdout.includes('WARN: TODO.md has no Active Sprint section'));
  } finally {
    teardown(dir);
  }
});

// Check 7: reports next task from Active Sprint
test('Check 7 — reports next open task from Active Sprint', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, 'TODO.md'), '## Active Sprint\n\n- [ ] **TASK-007: do the thing**\n');
    const result = run(dir);
    assert.ok(result.stdout.includes('TASK-007: do the thing'));
  } finally {
    teardown(dir);
  }
});

// Check 7: WARN when Active Sprint AND Backlog both have no open tasks
test('Check 7 — warns when Active Sprint and Backlog both empty', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, 'TODO.md'),
      '## Active Sprint\n\n- [x] **TASK-001: done**\n\n## Backlog\n\n- [x] **TASK-002: also done**\n');
    const result = run(dir);
    assert.ok(result.stdout.includes('WARN: Active Sprint and Backlog both empty'), 'should warn when both sections empty');
    assert.equal(result.status, 0, 'WARN should not fail the script');
  } finally {
    teardown(dir);
  }
});

// Check 7: info (not WARN) when Active Sprint empty but Backlog has tasks
test('Check 7 — info (not WARN) when sprint empty but backlog has tasks', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, 'TODO.md'),
      '## Active Sprint\n\n- [x] **TASK-001: done**\n\n## Backlog\n\n- [ ] **TASK-002: pending**\n');
    const result = run(dir);
    assert.ok(result.stdout.includes('ℹ Active Sprint exists but has no open tasks'), 'should emit info not warn');
    assert.ok(!result.stdout.includes('WARN: Active Sprint and Backlog both empty'), 'should not emit both-empty warn');
  } finally {
    teardown(dir);
  }
});

// Check 8: reports session changes count
test('Check 8 — reports session change count', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, '.claude', '.session-changes.txt'), 'a.js\nb.js\na.js\n');
    const result = run(dir);
    assert.ok(result.stdout.includes('2 unique file(s) modified'));
  } finally {
    teardown(dir);
  }
});

// Check 9: warns on compact-vulnerable phase
test('Check 9 — warns when stale phase file exists with compact-vulnerable phase', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, '.claude', '.phase'), 'implement');
    const result = run(dir);
    assert.ok(result.stdout.includes("phase 'implement'"), 'mentions detected phase');
    assert.ok(result.stdout.includes('compact-vulnerable'), 'flags as compact-vulnerable');
    assert.ok(result.stdout.includes('set-phase.js clear'), 'suggests the clear command');
  } finally {
    teardown(dir);
  }
});

// Check 9: no warn on safe phase
test('Check 9 — no warn on non-vulnerable phase', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, '.claude', '.phase'), 'parse');
    const result = run(dir);
    assert.ok(!result.stdout.includes("Resuming into phase 'parse'"));
    assert.ok(result.stdout.includes('Current workflow phase: parse'));
  } finally {
    teardown(dir);
  }
});

// Output format
test('output always contains SESSION START REPORT header', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    const result = run(dir);
    assert.ok(result.stdout.includes('=== SESSION START REPORT ==='));
  } finally {
    teardown(dir);
  }
});

// Check 5: YYYY-MM-DD placeholder in TODO.md must not trigger "no ownership header" warning
test('Check 5 — no ownership warning when last_updated is YYYY-MM-DD placeholder', () => {
  const dir = setup();
  try {
    writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}');
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'owner: [role]',
      'last_updated: YYYY-MM-DD',
      'update_trigger: Sprint completed',
      'status: current',
      '---',
      '## Active Sprint',
    ].join('\n'));
    const result = run(dir);
    assert.ok(!result.stdout.includes('no ownership header'), 'YYYY-MM-DD placeholder should not trigger ownership warning');
  } finally {
    teardown(dir);
  }
});
