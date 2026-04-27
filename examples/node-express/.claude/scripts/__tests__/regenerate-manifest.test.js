'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { parseYamlFrontmatter, discoverSkills, generateManifest } = require('../regenerate-manifest.js');

test('parseYamlFrontmatter extracts standard frontmatter fields', () => {
  const content = `---
name: test-skill
description: A test skill
last-validated: "2026-04-21"
user-invocable: true
---
Body content here.`;

  const fm = parseYamlFrontmatter(content);
  assert.strictEqual(fm.name, 'test-skill');
  assert.strictEqual(fm['last-validated'], '2026-04-21');
  assert.strictEqual(fm['user-invocable'], 'true');
});

test('parseYamlFrontmatter returns empty object when no frontmatter block', () => {
  const fm = parseYamlFrontmatter('# Just a title\n\nNo frontmatter here.');
  assert.deepStrictEqual(fm, {});
});

test('discoverSkills finds SKILL.md files and maps frontmatter correctly', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-test-'));
  try {
    const skillDir = path.join(tmpDir, 'my-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: my-skill\ndescription: Test skill\nlast-validated: "2026-04-21"\nuser-invocable: true\n---\nBody.\n`
    );

    const skills = discoverSkills(tmpDir);
    assert.strictEqual(skills.length, 1);
    assert.strictEqual(skills[0].name, 'my-skill');
    assert.strictEqual(skills[0].path, 'my-skill/SKILL.md');
    assert.strictEqual(skills[0]['last-validated'], '2026-04-21');
    assert.strictEqual(skills[0]['user-invocable'], true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('discoverSkills sets last-validated to null when field is missing', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-test-'));
  try {
    const skillDir = path.join(tmpDir, 'no-date-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: no-date-skill\ndescription: Test skill without date\n---\nBody.\n`
    );

    const skills = discoverSkills(tmpDir);
    assert.strictEqual(skills.length, 1);
    assert.strictEqual(skills[0]['last-validated'], null);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('discoverSkills skips directories with no SKILL.md', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-test-'));
  try {
    fs.mkdirSync(path.join(tmpDir, 'no-skill-dir'));
    const skills = discoverSkills(tmpDir);
    assert.strictEqual(skills.length, 0);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('generateManifest writes valid JSON with correct shape', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-test-'));
  try {
    const skillDir = path.join(tmpDir, 'skill-a');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: skill-a\ndescription: Skill A\nlast-validated: "2026-04-21"\nuser-invocable: false\n---\nBody.\n`
    );

    generateManifest(tmpDir);

    const manifestPath = path.join(tmpDir, 'MANIFEST.json');
    assert.ok(fs.existsSync(manifestPath), 'MANIFEST.json should be created');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.strictEqual(manifest.version, '1.0');
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(manifest.generated), 'generated should be ISO date');
    assert.ok(Array.isArray(manifest.skills), 'skills should be an array');
    assert.strictEqual(manifest.skills.length, 1);
    assert.strictEqual(manifest.skills[0].name, 'skill-a');
    assert.strictEqual(manifest.skills[0]['user-invocable'], false);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('generateManifest is idempotent — running twice produces the same skill count', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-test-'));
  try {
    const skillDir = path.join(tmpDir, 'idempotent-skill');
    fs.mkdirSync(skillDir);
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      `---\nname: idempotent-skill\ndescription: Test\nlast-validated: "2026-04-21"\nuser-invocable: true\n---\nBody.\n`
    );

    const first = generateManifest(tmpDir);
    const second = generateManifest(tmpDir);
    assert.strictEqual(first.skills.length, second.skills.length);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});
