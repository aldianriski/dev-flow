// .claude/scripts/session-start.js
// v2.1 — bootstrap: settings, CLAUDE.md, skills, docs line counts,
//         pending migrations, active sprint validation, context budget signal, compaction audit
// Pure Node (>=18), CommonJS, no shell-outs — runs on Windows Git Bash + Linux.
'use strict';

const { existsSync, readFileSync, readdirSync } = require('fs');
const { countLines, globSkills, checkManifest, checkDocLineLimits } = require('./scaffold-checks');

const warnings = [];
const errors   = [];
const info     = [];

// ─── Check 1: settings.local.json ───────────────────────────────────────────
if (!existsSync('.claude/settings.local.json')) {
  errors.push(
    'BLOCK: .claude/settings.local.json not found. ' +
    'Copy from .claude/settings.local.example.json and customize.'
  );
} else {
  info.push('✓ settings.local.json present');
}

// ─── Check 2: CLAUDE.md line count ──────────────────────────────────────────
if (existsSync('.claude/CLAUDE.md')) {
  const lines = countLines('.claude/CLAUDE.md');
  if (lines > 200) {
    warnings.push(`WARN: CLAUDE.md is ${lines} lines (hard limit: 200). Trim it.`);
  } else {
    info.push(`✓ CLAUDE.md within budget (${lines}/200 lines)`);
  }
}

// ─── Check 3: Skill staleness (last-validated > 6 months) ───────────────────
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const staleSkills = [];

for (const skillPath of globSkills('.claude/skills')) {
  const content = readFileSync(skillPath, 'utf8');
  const match = content.match(/last-validated:\s*"?(\d{4}-\d{2}-\d{2})"?/);
  if (match) {
    if (new Date(match[1]) < sixMonthsAgo) {
      staleSkills.push(`  • ${skillPath} — last validated ${match[1]}`);
    }
  } else {
    warnings.push(`WARN: ${skillPath} has no last-validated field — cannot assess staleness.`);
  }
}

if (staleSkills.length > 0) {
  warnings.push(
    `WARN: ${staleSkills.length} skill(s) last validated >6 months ago:\n` +
    staleSkills.join('\n')
  );
} else {
  info.push('✓ All skills within staleness window');
}

// ─── Check 4: Docs line count limits ────────────────────────────────────────
const DOC_LIMITS = {
  'docs/README.md': 50,
  'docs/ARCHITECTURE.md': 150,
  'docs/SETUP.md': 100,
  'docs/AI_CONTEXT.md': 100,
};
for (const v of checkDocLineLimits('.', DOC_LIMITS)) {
  warnings.push(`WARN: ${v.path} is ${v.lines} lines (limit: ${v.limit}). Trim before next commit.`);
}

// ─── Check 5: Docs ownership header freshness ────────────────────────────────
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
  const statusMatch    = content.match(/status:\s*(stale|needs-review|current)/);
  const hasLastUpdated = /last_updated:\s*\S+/.test(content);
  const updatedMatch   = content.match(/last_updated:\s*(\d{4}-\d{2}-\d{2})/);
  if (statusMatch?.[1] === 'stale') {
    warnings.push(`WARN: ${docPath} is marked status: stale.`);
  } else if (statusMatch?.[1] === 'needs-review') {
    warnings.push(`WARN: ${docPath} is marked status: needs-review.`);
  }
  if (updatedMatch && new Date(updatedMatch[1]) < sixtyDaysAgo && statusMatch?.[1] !== 'stale') {
    warnings.push(`WARN: ${docPath} last updated ${updatedMatch[1]} (>60 days) — verify accuracy.`);
  } else if (!hasLastUpdated) {
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
      warnings.push(
        `WARN: ${dir}/ has ${upFiles.length} up-migration(s) but ${downFiles.length} down-migration(s).`
      );
    } else {
      info.push(`✓ Migration parity OK in ${dir}/`);
    }
  } catch { /* unreadable — skip */ }
}

// ─── Check 7: Active sprint validation ───────────────────────────────────────
if (existsSync('TODO.md')) {
  const todo = readFileSync('TODO.md', 'utf8');
  const hasActiveTask   = /- \[ \] \*\*TASK-/.test(todo);
  const hasActiveSprint = /## Active Sprint/.test(todo);
  if (!hasActiveSprint) {
    warnings.push('WARN: TODO.md has no Active Sprint section.');
  } else if (!hasActiveTask) {
    info.push('ℹ Active Sprint exists but has no open tasks — promote from Backlog or start new sprint.');
  } else {
    const nextTask = todo.match(/- \[ \] \*\*(.+?)\*\*/)?.[1];
    if (nextTask) info.push(`ℹ Next task: ${nextTask}`);
  }
}

// ─── Check 8: Context budget signal ──────────────────────────────────────────
const changesFile = '.claude/.session-changes.txt';
if (existsSync(changesFile)) {
  const changes = readFileSync(changesFile, 'utf8').trim().split('\n').filter(Boolean);
  const unique  = [...new Set(changes)];
  if (unique.length > 10) {
    warnings.push(`WARN: ${unique.length} files changed this session — context budget high.`);
  }
  info.push(`ℹ Session changes tracker: ${unique.length} unique file(s) modified`);
}

// ─── Check 9: Compaction audit ───────────────────────────────────────────────
// Re-uses the canonical Set from phase-constants.js so a new compact-vulnerable
// phase landing in read-guard.js is picked up here automatically.
const { PHASE_FILE: phaseFile, COMPACT_VULNERABLE } = require('./phase-constants');
if (existsSync(phaseFile)) {
  const phase = readFileSync(phaseFile, 'utf8').trim().toLowerCase();
  if (COMPACT_VULNERABLE.has(phase)) {
    warnings.push(
      `WARN: ${phaseFile} exists at session start with phase '${phase}' (compact-vulnerable). ` +
      `Likely stale from a crashed prior session — Read/Grep/Glob will be blocked until cleared. ` +
      `Resume? Run \`node .claude/scripts/set-phase.js clear\` before continuing, or accept the lock and dispatch the phase subagent.`
    );
  }
  info.push(`ℹ Current workflow phase: ${phase}`);
}

const manifestPath = '.claude/skills/MANIFEST.json';
const mResult = checkManifest(manifestPath);
if (mResult.pass) {
  info.push(`✓ Skill manifest present (${mResult.count} skills registered)`);
} else if (mResult.reason === 'missing') {
  warnings.push('WARN: .claude/skills/MANIFEST.json missing — phase→skill resolution will fall back to blueprint tables.');
} else {
  warnings.push(`WARN: ${manifestPath} is not valid JSON — regenerate.`);
}

// ─── Output ──────────────────────────────────────────────────────────────────
console.log('\n=== SESSION START REPORT ===');
if (info.length)     { console.log('\n[INFO]');     info.forEach(i => console.log(i)); }
if (warnings.length) { console.log('\n[WARNINGS]'); warnings.forEach(w => console.log(w)); }
if (errors.length) {
  console.error('\n[ERRORS — resolve before proceeding]');
  errors.forEach(e => console.error(e));
}
console.log('\n============================\n');
if (errors.length > 0) process.exit(1);
