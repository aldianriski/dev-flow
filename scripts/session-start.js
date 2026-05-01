// .claude/scripts/session-start.js
// v3.0 — bootstrap: settings, CLAUDE.md, skills staleness, docs line counts,
//         pending migrations, active sprint, context budget signal.
// Pure Node (>=18), CommonJS, no external deps.
'use strict';

const { existsSync, readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const warnings = [];
const errors   = [];
const info     = [];

// ─── Utilities ───────────────────────────────────────────────────────────────

function countLines(filePath) {
  const content = readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

function globSkills(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const skillFile = join(dir, entry.name, 'SKILL.md');
      if (existsSync(skillFile)) results.push(skillFile);
    }
  }
  return results;
}

function checkDocLineLimits(root, limits) {
  const violations = [];
  for (const [rel, limit] of Object.entries(limits)) {
    const full = join(root, rel);
    if (!existsSync(full)) continue;
    const lines = countLines(full);
    if (lines > limit) violations.push({ path: rel, lines, limit });
  }
  return violations;
}

// ─── Check 1: settings.local.json ────────────────────────────────────────────
if (!existsSync('.claude/settings.local.json')) {
  errors.push(
    'BLOCK: .claude/settings.local.json not found. ' +
    'Copy from .claude/settings.local.example.json and customize.'
  );
} else {
  info.push('✓ settings.local.json present');
}

// ─── Check 2: CLAUDE.md line count ───────────────────────────────────────────
if (existsSync('.claude/CLAUDE.md')) {
  const lines = countLines('.claude/CLAUDE.md');
  if (lines > 80) {
    warnings.push(`WARN: CLAUDE.md is ${lines} lines (limit: 80). Trim it.`);
  } else {
    info.push(`✓ CLAUDE.md within budget (${lines}/80 lines)`);
  }
}

// ─── Check 3: Skill staleness (last-validated > 6 months) ────────────────────
// .claude/skills takes precedence: scaffold-copy users win; plugin-install users land on 'skills'
const SKILLS_DIR = existsSync('.claude/skills') ? '.claude/skills' : 'skills';
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const staleSkills = [];

for (const skillPath of globSkills(SKILLS_DIR)) {
  const content = readFileSync(skillPath, 'utf8');
  const match = content.match(/last-validated:\s*"?(\d{4}-\d{2}-\d{2})"?/);
  if (match) {
    if (new Date(match[1]) < sixMonthsAgo) staleSkills.push(`  • ${skillPath} — ${match[1]}`);
  } else {
    warnings.push(`WARN: ${skillPath} has no last-validated field.`);
  }
}

if (staleSkills.length > 0) {
  warnings.push(`WARN: ${staleSkills.length} skill(s) last validated >6 months ago:\n${staleSkills.join('\n')}`);
} else {
  info.push('✓ All skills within staleness window');
}

// ─── Check 4: Docs line limits ────────────────────────────────────────────────
const DOC_LIMITS = {
  'docs/README.md': 50,
  'docs/ARCHITECTURE.md': 150,
  'docs/SETUP.md': 100,
  'docs/AI_CONTEXT.md': 100,
};
for (const v of checkDocLineLimits('.', DOC_LIMITS)) {
  warnings.push(`WARN: ${v.path} is ${v.lines} lines (limit: ${v.limit}). Trim before next commit.`);
}

// ─── Check 5: Doc ownership header freshness ─────────────────────────────────
const sixtyDaysAgo = new Date();
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
const docFiles = [
  'docs/README.md', 'docs/ARCHITECTURE.md', 'docs/DECISIONS.md',
  'docs/SETUP.md', 'docs/AI_CONTEXT.md', 'docs/CHANGELOG.md',
  'docs/TEST_SCENARIOS.md', 'TODO.md',
];
for (const docPath of docFiles) {
  if (!existsSync(docPath)) continue;
  const content = readFileSync(docPath, 'utf8');
  const statusMatch  = content.match(/status:\s*(stale|needs-review|current)/);
  const updatedMatch = content.match(/last_updated:\s*(\d{4}-\d{2}-\d{2})/);
  if (statusMatch?.[1] === 'stale')        warnings.push(`WARN: ${docPath} is marked status: stale.`);
  if (statusMatch?.[1] === 'needs-review') warnings.push(`WARN: ${docPath} is marked status: needs-review.`);
  if (updatedMatch && new Date(updatedMatch[1]) < sixtyDaysAgo && statusMatch?.[1] !== 'stale') {
    warnings.push(`WARN: ${docPath} last updated ${updatedMatch[1]} (>60 days) — verify accuracy.`);
  } else if (!updatedMatch) {
    warnings.push(`WARN: ${docPath} has no ownership header — treat as unverified.`);
  }
}

// ─── Check 6: Pending database migrations ────────────────────────────────────
const migrationDirs = ['migrations', 'src/migrations', 'db/migrations', 'database/migrations'];
for (const dir of migrationDirs) {
  if (!existsSync(dir)) continue;
  try {
    const files    = readdirSync(dir).map(f => f.toString());
    const upFiles  = files.filter(f => f.includes('up') || (!f.includes('down') && f.endsWith('.sql')));
    const downFiles = files.filter(f => f.includes('down'));
    if (upFiles.length > downFiles.length) {
      warnings.push(`WARN: ${dir}/ has ${upFiles.length} up-migration(s) but ${downFiles.length} down-migration(s).`);
    } else {
      info.push(`✓ Migration parity OK in ${dir}/`);
    }
  } catch { /* unreadable — skip */ }
}

// ─── Check 7: Active sprint validation ───────────────────────────────────────
if (existsSync('TODO.md')) {
  const todo = readFileSync('TODO.md', 'utf8');
  const hasActiveSprint = /## Active Sprint/.test(todo);
  const sprintSection   = todo.split(/\n## Backlog/)[0];
  const hasActiveTask   = /- \[ \] \*\*TASK-/.test(sprintSection);
  const backlogSection  = todo.split(/## Backlog/)[1] ?? '';
  const hasBacklogTask  = /- \[ \] \*\*TASK-/.test(backlogSection);
  if (!hasActiveSprint) {
    warnings.push('WARN: TODO.md has no Active Sprint section.');
  } else if (!hasActiveTask && !hasBacklogTask) {
    warnings.push('WARN: Active Sprint and Backlog both empty — run /task-decomposer or /dev-flow to plan next work.');
  } else if (!hasActiveTask) {
    info.push('ℹ Active Sprint exists but has no open tasks — promote from Backlog or start new sprint.');
  } else {
    const nextTask = sprintSection.match(/- \[ \] \*\*(.+?)\*\*/)?.[1];
    if (nextTask) info.push(`ℹ Next task: ${nextTask}`);
  }
}

// ─── Check 8: Context budget signal ──────────────────────────────────────────
const changesFile = '.claude/.session-changes.txt';
if (existsSync(changesFile)) {
  const changes = readFileSync(changesFile, 'utf8').trim().split('\n').filter(Boolean);
  const unique  = [...new Set(changes)];
  if (unique.length > 10) warnings.push(`WARN: ${unique.length} files changed this session — context budget high.`);
  info.push(`ℹ Session changes tracker: ${unique.length} unique file(s) modified`);
}

// ─── Output ───────────────────────────────────────────────────────────────────
console.log('\n=== SESSION START REPORT ===');
if (info.length)     { console.log('\n[INFO]');     info.forEach(i => console.log(i)); }
if (warnings.length) { console.log('\n[WARNINGS]'); warnings.forEach(w => console.log(w)); }
if (errors.length) {
  console.error('\n[ERRORS — resolve before proceeding]');
  errors.forEach(e => console.error(e));
}
console.log('\n============================\n');
if (errors.length > 0) process.exit(1);
