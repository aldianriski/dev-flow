// scripts/__tests__/session-start.test.js
// Tests for session-start.js. Runnable: `node --test scripts/__tests__/session-start.test.js`.
//
// Strategy: each test builds an isolated tempdir representing a fake repo
// state, runs session-start.js with cwd set to that tempdir, and asserts
// on the captured stdout. Avoid asserting on exact line counts — the
// script grows new checks; assert on substring presence/absence.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const SCRIPT = join(process.cwd(), 'scripts', 'session-start.js');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'devflow-session-'));
  mkdirSync(join(dir, '.claude'), { recursive: true });
  mkdirSync(join(dir, 'docs', 'sprint'), { recursive: true });
  mkdirSync(join(dir, 'skills'), { recursive: true });
  // settings.local.json must exist (Check 1)
  writeFileSync(join(dir, '.claude', 'settings.local.json'), '{}\n');
  // CLAUDE.md within budget (Check 2)
  writeFileSync(join(dir, '.claude', 'CLAUDE.md'), '# CLAUDE\n');
  return dir;
}

function runScript(dir) {
  // Capture both stdout and stderr; never throw on non-zero (we assert exit code separately).
  let stdout = '', stderr = '', code = 0;
  try {
    stdout = execFileSync('node', [SCRIPT], { cwd: dir, stdio: 'pipe' }).toString();
  } catch (e) {
    stdout = (e.stdout || Buffer.from('')).toString();
    stderr = (e.stderr || Buffer.from('')).toString();
    code = e.status ?? 1;
  }
  return { stdout, stderr, code, all: stdout + stderr };
}

function cleanup(dir) {
  rmSync(dir, { recursive: true, force: true });
}

// ─── T4 Fixture (a) — Sprint 35 retro regex fix ──────────────────────────────
// Active Sprint section uses sprint-pointer format with no TASK- bullets.
// Old regex emits false-positive "both empty" warning. New regex must NOT.

test('T4(a): sprint-pointer format does not trigger both-empty warning', () => {
  const dir = makeRepo();
  try {
    writeFileSync(join(dir, 'docs', 'sprint', 'SPRINT-099-test.md'), '---\nstatus: active\n---\n# Test\n');
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'sprint: 99',
      'last_updated: 2026-05-01',
      '---',
      '',
      '## Active Sprint',
      '',
      '→ **Sprint 99 — Test Sprint** (EPIC-Test) · `status: active`',
      '> Plan: docs/sprint/SPRINT-099-test.md',
      '',
      '## Backlog',
      '',
      '- [ ] **Phase 2 — Some future phase**',
      ''
    ].join('\n'));
    const { all } = runScript(dir);
    assert.doesNotMatch(all, /Active Sprint and Backlog both empty/,
      'sprint-pointer must not trigger both-empty warning');
  } finally {
    cleanup(dir);
  }
});

// ─── T4 Fixture (b) — sprint-named + missing plan doc → BLOCK ────────────────

test('T4(b): sprint named in TODO.md frontmatter but no plan doc → BLOCK exit', () => {
  const dir = makeRepo();
  try {
    // docs/sprint/ exists (created by makeRepo) but contains no SPRINT-099-*.md
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'sprint: 99',
      'last_updated: 2026-05-01',
      '---',
      '',
      '## Active Sprint',
      '',
      '→ **Sprint 99 — Missing Plan**',
      '',
      '## Backlog',
      ''
    ].join('\n'));
    const { all, code } = runScript(dir);
    assert.match(all, /SPRINT-099/, 'BLOCK message must name the missing sprint');
    assert.match(all, /BLOCK|missing plan doc/i, 'BLOCK severity expected');
    assert.equal(code, 1, 'must exit non-zero on BLOCK');
  } finally {
    cleanup(dir);
  }
});

// ─── T4 Fixture (c) — sprint-named + plan doc exists → no error ──────────────

test('T4(c): sprint named + matching plan doc exists → clean run', () => {
  const dir = makeRepo();
  try {
    writeFileSync(join(dir, 'docs', 'sprint', 'SPRINT-099-existing.md'),
      '---\nstatus: active\n---\n# Sprint 99\n');
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'sprint: 99',
      'last_updated: 2026-05-01',
      '---',
      '',
      '## Active Sprint',
      '',
      '→ **Sprint 99 — Existing Plan**',
      '',
      '## Backlog',
      '- [ ] **Phase 2 — Future**',
      ''
    ].join('\n'));
    const { all, code } = runScript(dir);
    assert.doesNotMatch(all, /missing plan doc/i,
      'matching plan doc must not trigger missing-plan warning');
    assert.equal(code, 0, 'clean run expected');
  } finally {
    cleanup(dir);
  }
});

// ─── T4 Fixture (d) — adopter bootstrap (no docs/sprint/ at all) → soft warn ─

test('T4(d): no docs/sprint/ dir at all → soft warn, not BLOCK', () => {
  const dir = makeRepo();
  try {
    // Remove docs/sprint/ to simulate adopter bootstrap
    rmSync(join(dir, 'docs', 'sprint'), { recursive: true, force: true });
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'sprint: 1',
      'last_updated: 2026-05-01',
      '---',
      '',
      '## Active Sprint',
      '',
      '→ **Sprint 1 — Bootstrap**',
      '',
      '## Backlog',
      ''
    ].join('\n'));
    const { all, code } = runScript(dir);
    // Adopter bootstrap: must not BLOCK; may emit soft warn.
    assert.notEqual(code, 1, 'must not exit non-zero when docs/sprint/ absent (adopter bootstrap)');
    // Soft-warn pattern is acceptable but not required to assert exact text.
  } finally {
    cleanup(dir);
  }
});

// ─── T5 Fixture (a) — current doc, last_updated < CHANGELOG anchor ───────────

test('T5(a): status:current doc with last_updated older than anchor → sprint-anchor warning', () => {
  const dir = makeRepo();
  try {
    writeFileSync(join(dir, 'docs', 'sprint', 'SPRINT-099-x.md'), '---\nstatus: active\n---\n');
    // CHANGELOG anchor = 2026-05-01
    mkdirSync(join(dir, 'docs'), { recursive: true });
    writeFileSync(join(dir, 'docs', 'CHANGELOG.md'),
      '# Changelog\n\n## Sprint 35 — Test (2026-05-01)\n\nbody\n');
    // TODO.md last_updated 2026-04-01 — only 30 days old, so Check 5 60-day does NOT fire,
    // but it IS older than the sprint anchor — sprint-anchor warning expected.
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'last_updated: 2026-04-01',
      'status: current',
      'sprint: 99',
      '---',
      '',
      '## Active Sprint',
      '→ **Sprint 99 — X**',
      '',
      '## Backlog',
      ''
    ].join('\n'));
    const { all } = runScript(dir);
    assert.match(all, /older than most-recent sprint|sprint anchor/i,
      'sprint-anchor staleness warning expected');
  } finally {
    cleanup(dir);
  }
});

// ─── T5 Fixture (b) — current doc, last_updated == anchor → no warn ──────────

test('T5(b): status:current doc with last_updated matching anchor → no sprint-anchor warning', () => {
  const dir = makeRepo();
  try {
    writeFileSync(join(dir, 'docs', 'sprint', 'SPRINT-099-x.md'), '---\nstatus: active\n---\n');
    writeFileSync(join(dir, 'docs', 'CHANGELOG.md'),
      '# Changelog\n\n## Sprint 35 — Test (2026-05-01)\n\nbody\n');
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'last_updated: 2026-05-01',
      'status: current',
      'sprint: 99',
      '---',
      '',
      '## Active Sprint',
      '→ **Sprint 99 — X**',
      '',
      '## Backlog',
      ''
    ].join('\n'));
    const { all } = runScript(dir);
    assert.doesNotMatch(all, /older than most-recent sprint/i,
      'matching last_updated must not trigger sprint-anchor warning');
  } finally {
    cleanup(dir);
  }
});

// ─── T5 Fixture (c) — status:stale doc → no duplicate warning ────────────────

test('T5(c): status:stale doc does not trigger sprint-anchor warning (already handled)', () => {
  const dir = makeRepo();
  try {
    writeFileSync(join(dir, 'docs', 'sprint', 'SPRINT-099-x.md'), '---\nstatus: active\n---\n');
    writeFileSync(join(dir, 'docs', 'CHANGELOG.md'),
      '# Changelog\n\n## Sprint 35 — Test (2026-05-01)\n\nbody\n');
    // TODO.md status:stale, last_updated old. Check 5 emits "marked status: stale".
    // T5 sprint-anchor check must NOT also fire.
    writeFileSync(join(dir, 'TODO.md'), [
      '---',
      'last_updated: 2026-04-01',
      'status: stale',
      'sprint: 99',
      '---',
      '',
      '## Active Sprint',
      '→ **Sprint 99 — X**',
      '',
      '## Backlog',
      ''
    ].join('\n'));
    const { all } = runScript(dir);
    assert.doesNotMatch(all, /older than most-recent sprint/i,
      'status:stale doc must not trigger sprint-anchor warning (already handled by Check 5)');
  } finally {
    cleanup(dir);
  }
});

// ─── Smoke: script runs against this repo without crashing ───────────────────

test('smoke: script exits cleanly against the dev-flow repo itself', () => {
  let code = 0;
  try { execFileSync('node', [SCRIPT], { stdio: 'pipe' }); }
  catch (e) { code = e.status ?? 1; }
  assert.notEqual(code, 1, 'session-start must not BLOCK on this repo at HEAD');
});
