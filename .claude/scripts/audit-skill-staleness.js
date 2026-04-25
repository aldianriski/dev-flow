// .claude/scripts/audit-skill-staleness.js
// Audits last-validated dates on all skills in .claude/skills/.
// Usage:  node .claude/scripts/audit-skill-staleness.js
// Loop:   /loop 90d node .claude/scripts/audit-skill-staleness.js
// Exit 0 = all skills current. Exit 1 = stale or missing last-validated fields found.
'use strict';

const fs   = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const STALE_DAYS = 180;

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = val;
  }
  return fm;
}

function daysSince(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function auditSkills(skillsDir = SKILLS_DIR) {
  const results = { stale: [], ok: [], missing: [] };
  let entries;
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    const content = fs.readFileSync(skillPath, 'utf8');
    const fm      = parseFrontmatter(content);
    const lv      = fm['last-validated'];
    if (!lv) {
      results.missing.push({ name: entry.name, path: skillPath });
      continue;
    }
    const age    = daysSince(lv);
    const record = { name: entry.name, lastValidated: lv, ageDays: age };
    if (age >= STALE_DAYS) {
      results.stale.push(record);
    } else {
      results.ok.push(record);
    }
  }
  return results;
}

function report(results) {
  const total = results.stale.length + results.ok.length + results.missing.length;
  if (results.stale.length === 0 && results.missing.length === 0) {
    console.log(`✓ All ${total} skill(s) current (none older than ${STALE_DAYS} days)`);
    return 0;
  }
  if (results.stale.length > 0) {
    console.log(`⚠ STALE (>${STALE_DAYS} days since last-validated):`);
    for (const s of results.stale) {
      console.log(`  • ${s.name}: last-validated ${s.lastValidated} (${s.ageDays} days ago)`);
    }
  }
  if (results.missing.length > 0) {
    console.log('⚠ MISSING last-validated:');
    for (const m of results.missing) {
      console.log(`  • ${m.name}`);
    }
  }
  console.log(`\n${results.stale.length} stale, ${results.missing.length} missing, ${results.ok.length} ok (${total} total)`);
  return 1;
}

if (require.main === module) {
  const results = auditSkills();
  process.exit(report(results));
}

module.exports = { auditSkills, parseFrontmatter, daysSince, report };
