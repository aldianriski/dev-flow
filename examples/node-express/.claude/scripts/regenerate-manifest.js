// regenerate-manifest.js — walks .claude/skills/*/SKILL.md frontmatter,
// emits MANIFEST.json consumed by session-start.js Check 9 and the dev-flow orchestrator.
// Pure Node CommonJS (>=18). No shell-outs. Idempotent — safe to re-run.
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_SKILLS_DIR = path.resolve(__dirname, '../skills');

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = value;
  }
  return fm;
}

function discoverSkills(skillsDir) {
  const skills = [];
  let entries;
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch {
    return skills;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;
    const content = fs.readFileSync(skillFile, 'utf8');
    const fm = parseYamlFrontmatter(content);
    if (!fm.name) continue;
    skills.push({
      name: fm.name,
      path: `${entry.name}/SKILL.md`,
      'last-validated': fm['last-validated'] || null,
      'user-invocable': fm['user-invocable'] === 'true',
    });
  }
  return skills;
}

function generateManifest(skillsDir) {
  const dir = skillsDir || DEFAULT_SKILLS_DIR;
  const manifestPath = path.join(dir, 'MANIFEST.json');
  const skills = discoverSkills(dir);
  const manifest = {
    version: '1.0',
    generated: new Date().toISOString().split('T')[0],
    skills,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Manifest written: ${manifestPath}`);
  console.log(`Skills discovered: ${skills.length}`);
  return manifest;
}

if (require.main === module) {
  generateManifest();
}

module.exports = { parseYamlFrontmatter, discoverSkills, generateManifest };
