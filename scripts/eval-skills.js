// scripts/eval-skills.js
// Phase 0 minimal eval harness — structural checks only.
// Validates each skills/*/SKILL.md against governance contract.
// Exit non-zero on violation. Runnable: `node scripts/eval-skills.js`.
'use strict';

const { readFileSync, readdirSync, existsSync, writeFileSync } = require('fs');
const { join } = require('path');

const SKILLS_DIR = 'skills';
const OUT_MD = 'docs/audit/skill-eval-report.md';
const SKILL_LINE_CAP = 100;
const DESC_CHAR_CAP = 500;

function read(p) { return readFileSync(p, 'utf8').replace(/\r\n/g, '\n'); }

function parseFrontmatter(s) {
  const m = s.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  const fmLines = m[1].split('\n');
  for (let i = 0; i < fmLines.length; i++) {
    const kv = fmLines[i].match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].replace(/^["']|["']$/g, '').trim();
    if (/^[|>][-+]?$/.test(val)) {
      const parts = [];
      while (i + 1 < fmLines.length && /^\s+/.test(fmLines[i + 1])) {
        parts.push(fmLines[++i].trim());
      }
      val = parts.join(val.startsWith('>') ? ' ' : '\n');
    }
    fm[kv[1]] = val;
  }
  return fm;
}

const RULES = [
  { id: 'R1', desc: 'frontmatter present',                    check: (c) => parseFrontmatter(c) !== null },
  { id: 'R2', desc: 'name field present',                     check: (c) => !!parseFrontmatter(c)?.name },
  { id: 'R3', desc: 'description field present',              check: (c) => !!parseFrontmatter(c)?.description },
  { id: 'R4', desc: 'description starts with "Use when"',     check: (c) => parseFrontmatter(c)?.description?.startsWith('Use when') },
  { id: 'R5', desc: `description ≤${DESC_CHAR_CAP} chars`,    check: (c) => (parseFrontmatter(c)?.description?.length || 0) <= DESC_CHAR_CAP },
  { id: 'R6', desc: `SKILL.md ≤${SKILL_LINE_CAP} lines`,      check: (c) => c.split('\n').length <= SKILL_LINE_CAP },
  { id: 'R7', desc: 'has "## Red Flags" section',             check: (c) => /^##\s+Red Flags/m.test(c) },
];

function evalSkill(name, content) {
  const violations = [];
  for (const rule of RULES) {
    let passed = false;
    try { passed = !!rule.check(content); } catch { passed = false; }
    if (!passed) violations.push({ id: rule.id, desc: rule.desc });
  }
  return { name, violations, lines: content.split('\n').length };
}

// ─── Run ─────────────────────────────────────────────────────────────────────
const results = [];
for (const dir of readdirSync(SKILLS_DIR, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const skillFile = join(SKILLS_DIR, dir.name, 'SKILL.md');
  if (!existsSync(skillFile)) continue;
  const content = read(skillFile);
  results.push(evalSkill(dir.name, content));
}

const totalViolations = results.reduce((n, r) => n + r.violations.length, 0);
const skillsWithViolations = results.filter(r => r.violations.length > 0);

// ─── Report ──────────────────────────────────────────────────────────────────
const md = [];
md.push('---');
md.push('owner: Tech Lead (Aldian Rizki)');
md.push('last_updated: 2026-05-01');
md.push('purpose: Phase 0 minimal eval harness — structural skill validation');
md.push('status: current');
md.push('generator: scripts/eval-skills.js');
md.push('---');
md.push('');
md.push('# Skill Eval Report — ' + new Date().toISOString());
md.push('');
md.push(`- Skills evaluated: **${results.length}**`);
md.push(`- Pass: **${results.length - skillsWithViolations.length}**`);
md.push(`- Fail: **${skillsWithViolations.length}**`);
md.push(`- Total violations: ${totalViolations}`);
md.push('');
md.push('## Rules');
md.push('');
for (const r of RULES) md.push(`- **${r.id}**: ${r.desc}`);
md.push('');
md.push('## Per-skill results');
md.push('');
md.push('| Skill | Lines | Status | Violations |');
md.push('|:------|------:|:-------|:-----------|');
for (const r of results) {
  const status = r.violations.length === 0 ? '✓ pass' : `✗ fail (${r.violations.length})`;
  const v = r.violations.map(x => x.id).join(', ') || '—';
  md.push(`| ${r.name} | ${r.lines} | ${status} | ${v} |`);
}

if (skillsWithViolations.length > 0) {
  md.push('');
  md.push('## Violation details');
  md.push('');
  for (const r of skillsWithViolations) {
    md.push(`### ${r.name}`);
    md.push('');
    for (const v of r.violations) md.push(`- **${v.id}** — ${v.desc}`);
    md.push('');
  }
}

writeFileSync(OUT_MD, md.join('\n') + '\n');

console.log(`eval written: ${OUT_MD}`);
console.log(`pass=${results.length - skillsWithViolations.length} fail=${skillsWithViolations.length} violations=${totalViolations}`);

if (totalViolations > 0) process.exit(1);
