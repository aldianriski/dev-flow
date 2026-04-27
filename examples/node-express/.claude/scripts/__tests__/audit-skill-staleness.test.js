// __tests__/audit-skill-staleness.test.js
// node --test .claude/scripts/__tests__/audit-skill-staleness.test.js
'use strict';

const { test }  = require('node:test');
const assert    = require('node:assert/strict');
const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join }  = require('path');

const { auditSkills, parseFrontmatter, daysSince } = require('../audit-skill-staleness');

function setup() {
  return mkdtempSync(join(tmpdir(), 'audit-test-'));
}

function teardown(dir) {
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

function addSkill(dir, name, frontmatterBody) {
  const skillDir = join(dir, name);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), `---\n${frontmatterBody}\n---\n# ${name}`);
}

// ── parseFrontmatter ──────────────────────────────────────────────────────────

test('parseFrontmatter: extracts last-validated from quoted value', () => {
  const fm = parseFrontmatter('---\nname: foo\nlast-validated: "2024-01-01"\n---\n');
  assert.equal(fm['last-validated'], '2024-01-01');
});

test('parseFrontmatter: extracts last-validated from unquoted value', () => {
  const fm = parseFrontmatter('---\nname: foo\nlast-validated: 2024-01-01\n---\n');
  assert.equal(fm['last-validated'], '2024-01-01');
});

test('parseFrontmatter: returns empty object when no frontmatter block', () => {
  const fm = parseFrontmatter('# Just a heading\nno frontmatter');
  assert.deepEqual(fm, {});
});

// ── daysSince ─────────────────────────────────────────────────────────────────

test('daysSince: returns Infinity for invalid date string', () => {
  assert.equal(daysSince('not-a-date'), Infinity);
});

test('daysSince: returns 0 or 1 for today', () => {
  const today = new Date().toISOString().slice(0, 10);
  assert.ok(daysSince(today) <= 1);
});

test('daysSince: returns ~365 for a date one year ago', () => {
  const d = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const days = daysSince(d.toISOString().slice(0, 10));
  assert.ok(days >= 364 && days <= 366);
});

// ── auditSkills ───────────────────────────────────────────────────────────────

test('auditSkills: flags skill with last-validated > 180 days as stale', () => {
  const dir = setup();
  try {
    addSkill(dir, 'old-skill', 'name: old-skill\nlast-validated: "2020-01-01"');
    const r = auditSkills(dir);
    assert.equal(r.stale.length, 1);
    assert.equal(r.stale[0].name, 'old-skill');
    assert.equal(r.ok.length, 0);
    assert.equal(r.missing.length, 0);
  } finally { teardown(dir); }
});

test('auditSkills: marks skill with recent last-validated as ok', () => {
  const dir = setup();
  try {
    const today = new Date().toISOString().slice(0, 10);
    addSkill(dir, 'fresh-skill', `name: fresh-skill\nlast-validated: "${today}"`);
    const r = auditSkills(dir);
    assert.equal(r.ok.length, 1);
    assert.equal(r.stale.length, 0);
    assert.equal(r.missing.length, 0);
  } finally { teardown(dir); }
});

test('auditSkills: flags skill missing last-validated field', () => {
  const dir = setup();
  try {
    addSkill(dir, 'no-date-skill', 'name: no-date-skill\ndescription: test');
    const r = auditSkills(dir);
    assert.equal(r.missing.length, 1);
    assert.equal(r.missing[0].name, 'no-date-skill');
  } finally { teardown(dir); }
});

test('auditSkills: empty dir returns zero findings', () => {
  const dir = setup();
  try {
    const r = auditSkills(dir);
    assert.equal(r.stale.length + r.ok.length + r.missing.length, 0);
  } finally { teardown(dir); }
});

test('auditSkills: skips subdirs without SKILL.md', () => {
  const dir = setup();
  try {
    mkdirSync(join(dir, 'no-skill-file'), { recursive: true });
    const r = auditSkills(dir);
    assert.equal(r.stale.length + r.ok.length + r.missing.length, 0);
  } finally { teardown(dir); }
});

test('auditSkills: handles mixed stale / ok / missing skills', () => {
  const dir = setup();
  try {
    const today = new Date().toISOString().slice(0, 10);
    addSkill(dir, 'old-skill',     'name: old-skill\nlast-validated: "2020-01-01"');
    addSkill(dir, 'fresh-skill',   `name: fresh-skill\nlast-validated: "${today}"`);
    addSkill(dir, 'no-date-skill', 'name: no-date-skill');
    const r = auditSkills(dir);
    assert.equal(r.stale.length,   1);
    assert.equal(r.ok.length,      1);
    assert.equal(r.missing.length, 1);
  } finally { teardown(dir); }
});

test('auditSkills: stale entry includes ageDays field', () => {
  const dir = setup();
  try {
    addSkill(dir, 'old-skill', 'name: old-skill\nlast-validated: "2020-01-01"');
    const r = auditSkills(dir);
    assert.ok(typeof r.stale[0].ageDays === 'number');
    assert.ok(r.stale[0].ageDays >= 180);
  } finally { teardown(dir); }
});
