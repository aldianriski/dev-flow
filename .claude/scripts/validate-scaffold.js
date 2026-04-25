// .claude/scripts/validate-scaffold.js
// CI hard-gate: validates a dev-flow scaffold is correctly set up in any target repo.
// Usage: node .claude/scripts/validate-scaffold.js [root-dir]
// Exit 0: all checks pass. Exit 1: any check fails.
// Pure Node (>=18), CommonJS, no shell-outs — cross-platform (Windows Git Bash + Linux).
'use strict';

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');
const {
  countLines,
  globSkills,
  checkRequiredFiles,
  checkManifest,
  checkOwnershipHeader,
  checkDocLineLimits,
} = require('./scaffold-checks');

const root = process.argv[2] || '.';

const passes = [];
const failures = [];

function pass(msg) { passes.push(msg); }
function fail(msg) { failures.push(msg); }

// ─── Check 1: Required files present ────────────────────────────────────────
const REQUIRED = [
  '.claude/CLAUDE.md',
  '.claude/settings.json',
  'TODO.md',
  '.claude/skills/MANIFEST.json',
];
for (const f of checkRequiredFiles(root, REQUIRED)) {
  fail(`Missing required file: ${f}`);
}
if (checkRequiredFiles(root, REQUIRED).length === 0) {
  pass('Required files present');
}

// ─── Check 2: CLAUDE.md line count ──────────────────────────────────────────
const claudePath = join(root, '.claude/CLAUDE.md');
if (existsSync(claudePath)) {
  const lines = countLines(claudePath);
  if (lines > 200) {
    fail(`CLAUDE.md exceeds 200-line limit (${lines} lines)`);
  } else {
    pass(`CLAUDE.md within 200-line limit (${lines} lines)`);
  }
}

// ─── Check 3: MANIFEST.json structure ────────────────────────────────────────
const manifestPath = join(root, '.claude/skills/MANIFEST.json');
const mResult = checkManifest(manifestPath);
if (mResult.pass) {
  pass(`MANIFEST.json valid (${mResult.count} skills)`);
} else {
  fail(`MANIFEST.json: ${mResult.message}`);
}

// ─── Check 4: TODO.md ownership header + Active Sprint section ───────────────
const todoPath = join(root, 'TODO.md');
if (existsSync(todoPath)) {
  const content = readFileSync(todoPath, 'utf8');
  const missingFields = checkOwnershipHeader(content);
  if (missingFields.length > 0) {
    fail(`TODO.md missing ownership header field(s): ${missingFields.join(', ')}`);
  } else {
    pass('TODO.md ownership header valid');
  }
  if (!/## Active Sprint/.test(content)) {
    fail('TODO.md missing "## Active Sprint" section');
  } else {
    pass('TODO.md has Active Sprint section');
  }
}

// ─── Check 5: At least one skill present ─────────────────────────────────────
const skillsDir = join(root, '.claude/skills');
if (existsSync(skillsDir)) {
  const skills = globSkills(skillsDir);
  if (skills.length === 0) {
    fail('No SKILL.md files found under .claude/skills/');
  } else {
    pass(`${skills.length} skill(s) found`);
  }

  // ─── Check 6: Skill frontmatter spec-required fields ──────────────────────
  const SKILL_REQUIRED = ['name', 'description'];
  let allValid = true;
  for (const skillPath of skills) {
    const content = readFileSync(skillPath, 'utf8');
    const missing = SKILL_REQUIRED.filter(f => !new RegExp(`^${f}:`, 'm').test(content));
    if (missing.length > 0) {
      fail(`${skillPath}: missing frontmatter field(s): ${missing.join(', ')}`);
      allValid = false;
    }
  }
  if (allValid) pass('All skill frontmatter valid');
}

// ─── Check 7: Doc line limits ────────────────────────────────────────────────
const DOC_LIMITS = {
  'README.md': 50,
  'docs/README.md': 50,
  'docs/ARCHITECTURE.md': 150,
  'docs/SETUP.md': 100,
  'docs/AI_CONTEXT.md': 100,
};
const violations = checkDocLineLimits(root, DOC_LIMITS);
if (violations.length === 0) {
  pass('Doc line limits respected');
} else {
  for (const v of violations) {
    fail(`${v.path} exceeds line limit: ${v.lines}/${v.limit}`);
  }
}

// ─── Check 8: settings.json hooks contain no [your-X] placeholders ───────────
// Committed settings.json must be runnable as-is. Placeholder commands like
// [your-lint-command] break adopters silently. Per-stack hooks belong in
// settings.local.json (rendered by bin/dev-flow-init.js).
const settingsPath = join(root, '.claude/settings.json');
if (!existsSync(settingsPath)) {
  fail('.claude/settings.json missing — placeholder check skipped (Check 1 should have caught this)');
} else {
  let settings;
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (err) {
    fail(`.claude/settings.json: invalid JSON — ${err.message}`);
    settings = null;
  }
  if (settings && settings.hooks && typeof settings.hooks === 'object') {
    const offenders = [];
    for (const eventName of Object.keys(settings.hooks)) {
      const groups = settings.hooks[eventName];
      if (!Array.isArray(groups)) continue;
      for (const group of groups) {
        const hooks = Array.isArray(group?.hooks) ? group.hooks : [];
        for (const h of hooks) {
          if (typeof h?.command === 'string' && h.command.includes('[your-')) {
            offenders.push(`${eventName}/${group.matcher || '?'}`);
          }
        }
      }
    }
    if (offenders.length === 0) {
      pass('settings.json hooks free of [your-] placeholders');
    } else {
      fail(`settings.json contains placeholder hook command(s) at: ${offenders.join(', ')} — move per-stack hooks to settings.local.json (render via bin/dev-flow-init.js)`);
    }
  } else if (settings) {
    pass('settings.json has no hooks block — placeholder check vacuously passes');
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────
console.log('\n=== SCAFFOLD VALIDATION ===\n');
for (const p of passes) console.log(`[PASS] ${p}`);
if (failures.length > 0) {
  for (const f of failures) console.log(`[FAIL] ${f}`);
  console.log(`\nRESULT: ${failures.length} failure(s) — fix before merge\n`);
  process.exit(1);
} else {
  console.log('\nRESULT: all checks passed\n');
}
