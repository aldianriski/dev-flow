#!/usr/bin/env node
/**
 * eval-acceptance.js — TASK-116-v2 (Sprint 055)
 *
 * Skill-triggering acceptance harness — Node port of superpowers run-test.sh
 * pattern per docs/research/superpowers-acceptance-harness-2026-05-04.md.
 *
 * For each prompt file under tests/skill-triggering/prompts/<skill>.txt:
 *   1. Spawn `claude -p "<prompt>" --dangerously-skip-permissions --max-turns N --output-format stream-json`
 *   2. Capture stream-json transcript to tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json
 *   3. Regex-match pass condition: `"name":"Skill"` AND `"skill":"<skill>"` (or "<ns>:<skill>")
 *   4. 3 runs per prompt; pass = ≥2/3 trigger detection (per OQ(D) quorum)
 *
 * Usage:
 *   node scripts/eval-acceptance.js                     # run all prompts/*.txt
 *   node scripts/eval-acceptance.js --skill prime       # run one
 *   node scripts/eval-acceptance.js --runs 3            # override quorum size
 *   node scripts/eval-acceptance.js --max-turns 5
 *   node scripts/eval-acceptance.js --plugin-dir <path> # override auto-detect
 *   node scripts/eval-acceptance.js --cap-headroom-warn # also lint SKILL.md cap-headroom (T3 fold-in)
 *   node scripts/eval-acceptance.js --dry-run           # write skeleton report; do NOT spawn claude
 *
 * Operator-run note: this script invokes the `claude` CLI. Cost = real API tokens.
 * Default mode = --dry-run absent → live runs. Use --dry-run for skeleton-only.
 *
 * Risks (per research §gaps):
 *   R1 — pin `claude --version` in audit report
 *   R2 — --plugin-dir may not work for in-development plugin; fallback = run from repo root w/ plugin installed
 *   R3 — stream-json shape is brittle; regex fallback when jq absent
 *   R4 — non-deterministic trigger; ≥2/3 quorum mitigation
 *   R5 — Windows space-in-path; use $env:TEMP-style paths (or repo-relative)
 */

'use strict';

const { spawnSync, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const opt = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : dflt;
};
const has = (flag) => args.includes(flag);

const PROMPTS_DIR = 'tests/skill-triggering/prompts';
const LOGS_DIR = 'tests/skill-triggering/logs';
const SKILL_FILTER = opt('--skill', null);
const NUM_RUNS = parseInt(opt('--runs', '3'), 10);
const MAX_TURNS = parseInt(opt('--max-turns', '5'), 10);
const PLUGIN_DIR = opt('--plugin-dir', process.env.DEVFLOW_PLUGIN_DIR || '');
const CAP_HEADROOM = has('--cap-headroom-warn');
const DRY_RUN = has('--dry-run');
const TODAY = opt('--date', new Date().toISOString().slice(0, 10));
const OUT_REPORT = opt('--out', `docs/audit/eval-acceptance-${TODAY}.md`);

// Skills line cap from CLAUDE.md governance rule
const SKILL_LINE_CAP = 100;
const HEADROOM_WARN = 5;

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function getClaudeVersion() {
  return sh('claude --version') || '_(claude CLI not found in PATH)_';
}

function listPrompts() {
  if (!fs.existsSync(PROMPTS_DIR)) return [];
  return fs.readdirSync(PROMPTS_DIR)
    .filter(f => f.endsWith('.txt'))
    .map(f => ({ skill: f.replace(/\.txt$/, ''), file: path.join(PROMPTS_DIR, f) }))
    .filter(p => !SKILL_FILTER || p.skill === SKILL_FILTER);
}

function buildClaudeArgs(prompt) {
  const a = [
    '-p', prompt,
    '--dangerously-skip-permissions',
    '--max-turns', String(MAX_TURNS),
    '--output-format', 'stream-json',
  ];
  if (PLUGIN_DIR) a.push('--plugin-dir', PLUGIN_DIR);
  return a;
}

function runOnce(skill, prompt, runIdx, runDir) {
  const logFile = path.join(runDir, `run-${runIdx}.json`);
  const errFile = path.join(runDir, `run-${runIdx}.stderr`);

  if (DRY_RUN) {
    fs.writeFileSync(logFile, JSON.stringify({ dry_run: true, skill, runIdx }, null, 2));
    return { passed: false, reason: 'dry-run (no claude invocation)', logFile };
  }

  const result = spawnSync('claude', buildClaudeArgs(prompt), {
    encoding: 'utf8',
    timeout: 5 * 60 * 1000,  // 5min per run
    maxBuffer: 50 * 1024 * 1024,
  });

  fs.writeFileSync(logFile, result.stdout || '');
  if (result.stderr) fs.writeFileSync(errFile, result.stderr);

  if (result.error) {
    return { passed: false, reason: `spawn error: ${result.error.message}`, logFile };
  }
  if (result.status !== 0) {
    return { passed: false, reason: `claude exit ${result.status}`, logFile };
  }

  const transcript = result.stdout || '';
  const skillToolInvoked = /"name":"Skill"/.test(transcript);
  // Match either bare skill name OR namespaced (dev-flow:<skill>)
  const skillNameRe = new RegExp(`"skill":"(?:[\\w-]+:)?${skill}"`);
  const targetSkillTriggered = skillNameRe.test(transcript);
  const passed = skillToolInvoked && targetSkillTriggered;

  return {
    passed,
    reason: passed ? 'matched' : `Skill-tool=${skillToolInvoked} target-match=${targetSkillTriggered}`,
    logFile,
  };
}

function evalSkill(skill, file, ts) {
  const prompt = fs.readFileSync(file, 'utf8').trim();
  const runDir = path.join(LOGS_DIR, ts, skill);
  fs.mkdirSync(runDir, { recursive: true });

  const runs = [];
  for (let i = 1; i <= NUM_RUNS; i++) {
    process.stdout.write(`  run ${i}/${NUM_RUNS}... `);
    const r = runOnce(skill, prompt, i, runDir);
    runs.push(r);
    process.stdout.write(`${r.passed ? 'PASS' : 'FAIL'} (${r.reason})\n`);
  }

  const passes = runs.filter(r => r.passed).length;
  const verdict = passes >= Math.ceil(NUM_RUNS * 2 / 3) ? 'PASS' : 'FAIL';
  return { skill, runs, passes, verdict };
}

function lintCapHeadroom() {
  const skillsDir = 'skills';
  if (!fs.existsSync(skillsDir)) return [];
  const rows = [];
  for (const dir of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const file = path.join(skillsDir, dir.name, 'SKILL.md');
    if (!fs.existsSync(file)) continue;
    const lines = fs.readFileSync(file, 'utf8').split('\n').length;
    const headroom = SKILL_LINE_CAP - lines;
    let verdict = 'OK';
    if (headroom === 0) verdict = 'EXEMPT';     // grandfathered (release-patch per ADR-032)
    else if (headroom < HEADROOM_WARN) verdict = 'WARN';
    rows.push({ skill: dir.name, lines, headroom, verdict });
  }
  return rows;
}

function renderReport({ results, capHeadroomRows, ts, claudeVersion }) {
  const lines = [
    '---',
    'owner: Tech Lead (Aldian Rizki)',
    `last_updated: ${TODAY}`,
    'update_trigger: Re-run acceptance harness',
    'status: current',
    'task: TASK-116-v2',
    'sprint: 055',
    '---',
    '',
    `# Skill-Triggering Acceptance Eval — ${TODAY}`,
    '',
    `> Source: \`scripts/eval-acceptance.js\` · per \`docs/research/superpowers-acceptance-harness-2026-05-04.md\``,
    `> Pass rule: stream-json contains \`"name":"Skill"\` AND target skill name; ≥${Math.ceil(NUM_RUNS * 2 / 3)}/${NUM_RUNS} runs (Mode A quorum per OQ(D)).`,
    `> Run timestamp: \`${ts}\` · claude version: \`${claudeVersion}\` (pin per research §gaps R1)`,
    '',
    '## Summary',
    '',
    `- Skills evaluated: **${results.length}**`,
    `- Pass: **${results.filter(r => r.verdict === 'PASS').length}**`,
    `- Fail: **${results.filter(r => r.verdict === 'FAIL').length}**`,
    '',
    '## Per-Skill Results',
    '',
  ];

  if (results.length === 0) {
    lines.push('_No prompts found under `tests/skill-triggering/prompts/`._');
  } else {
    lines.push('| Skill | Runs | Passes | Verdict | Log dir |');
    lines.push('|:------|-----:|-------:|:--------|:--------|');
    for (const r of results) {
      lines.push(`| \`${r.skill}\` | ${r.runs.length} | ${r.passes} | **${r.verdict}** | \`${LOGS_DIR}/${ts}/${r.skill}/\` |`);
    }
  }

  lines.push('', '## Per-Run Detail', '');
  for (const r of results) {
    lines.push(`### \`${r.skill}\``);
    lines.push('');
    for (let i = 0; i < r.runs.length; i++) {
      const run = r.runs[i];
      lines.push(`- run ${i + 1}: **${run.passed ? 'PASS' : 'FAIL'}** — ${run.reason} (\`${run.logFile}\`)`);
    }
    lines.push('');
  }

  if (capHeadroomRows && capHeadroomRows.length > 0) {
    lines.push('## Cap Headroom (TD-002 lint fold-in)', '');
    lines.push(`> Rule: \`headroom = ${SKILL_LINE_CAP} - line_count\`. OK ≥${HEADROOM_WARN} · WARN <${HEADROOM_WARN} · EXEMPT = 0 (grandfathered, e.g. release-patch per ADR-032).`);
    lines.push('');
    lines.push('| Skill | Lines | Headroom | Verdict |');
    lines.push('|:------|------:|---------:|:--------|');
    for (const r of capHeadroomRows) {
      lines.push(`| \`${r.skill}\` | ${r.lines} | ${r.headroom} | **${r.verdict}** |`);
    }
    const warnCount = capHeadroomRows.filter(r => r.verdict === 'WARN').length;
    const exemptCount = capHeadroomRows.filter(r => r.verdict === 'EXEMPT').length;
    lines.push('', `Summary: ${capHeadroomRows.length} skills · ${warnCount} WARN · ${exemptCount} EXEMPT.`);
  }

  lines.push('', '## Operator Notes', '');
  lines.push('- Re-run: `node scripts/eval-acceptance.js [--skill <name>] [--runs N] [--cap-headroom-warn]`');
  lines.push('- Logs: `tests/skill-triggering/logs/<timestamp>/<skill>/run-N.json` (gitignored).');
  lines.push('- Mode A (manual) per ADR-021 DEC-4. Mode B (CI on every PR) deferred until ≥10 skills triggering OR cost gate flips per research §recommendation.');
  lines.push('- Pass-rate baseline: ≥6/8 lift candidates pass for v1-ship gate (Sprint 056). <6/8 → remediation candidates surface to Sprint 055-2.');
  lines.push('');

  return lines.join('\n');
}

function main() {
  const prompts = listPrompts();
  if (prompts.length === 0) {
    console.error(`No prompts found under ${PROMPTS_DIR}/. Run from repo root.`);
    process.exit(1);
  }

  console.log(`eval-acceptance: ${prompts.length} prompt(s) · ${NUM_RUNS} runs each · max-turns ${MAX_TURNS}${DRY_RUN ? ' · DRY RUN' : ''}`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const claudeVersion = DRY_RUN ? '_(dry-run)_' : getClaudeVersion();
  fs.mkdirSync(LOGS_DIR, { recursive: true });

  const results = [];
  for (const p of prompts) {
    console.log(`\n[${p.skill}]`);
    results.push(evalSkill(p.skill, p.file, ts));
  }

  const capHeadroomRows = CAP_HEADROOM ? lintCapHeadroom() : null;

  const report = renderReport({ results, capHeadroomRows, ts, claudeVersion });
  fs.mkdirSync(path.dirname(OUT_REPORT), { recursive: true });
  fs.writeFileSync(OUT_REPORT, report);

  const passCount = results.filter(r => r.verdict === 'PASS').length;
  const failCount = results.length - passCount;
  console.log(`\nReport: ${OUT_REPORT}`);
  console.log(`pass=${passCount} fail=${failCount} of ${results.length} skills`);

  if (failCount > 0 && !DRY_RUN) process.exit(1);
}

main();
