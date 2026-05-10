#!/usr/bin/env node
/**
 * eval-measure.js — TASK-115-v2 (Sprint 055-2)
 *
 * Token-compression measurer — Node port of caveman upstream `evals/measure.py`.
 * Reads snapshot produced by `scripts/eval-caveman.js`; reports real token compression
 * per skill against the terse control arm — i.e. how much the SKILL adds on top of a
 * plain "Answer concisely." instruction (per Sprint 034 ADR-001 honest-delta principle).
 *
 * Tokenizer note: gpt-tokenizer o200k_base = OpenAI's BPE; only an approximation of
 * Claude's BPE. Ratios are meaningful for cross-skill comparison; absolute numbers
 * are "approximate output-length reduction", not "exact Claude tokens".
 *
 * Tokenizer parity verification (one-line node command; per research §tiktoken-parity-verification-step):
 *   node -e "const{encode}=require('gpt-tokenizer/encoding/o200k_base'); console.log(encode('Hello, world!').length, 'tokens')"
 * Run once to confirm gpt-tokenizer matches Python tiktoken for short test strings.
 * Document result in `docs/audit/eval-caveman-2026-05-10.md` § Tokenizer Parity.
 *
 * Usage:
 *   node scripts/eval-measure.js --snapshot evals/snapshots/results-<ts>.json
 *   node scripts/eval-measure.js --snapshot <path> --format json
 *   node scripts/eval-measure.js --snapshot <path> --encoding o200k_base
 *
 * Dependencies:
 *   gpt-tokenizer (npm; in package.json devDependencies per ADR-035 carve-out from ADR-002).
 *   Operator install: `npm install`.
 */

'use strict';

const fs = require('node:fs');

const args = process.argv.slice(2);
const opt = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : dflt;
};

const SNAPSHOT_PATH = opt('--snapshot', '');
const ENCODING = opt('--encoding', 'o200k_base');
const FORMAT = opt('--format', 'md');

if (!SNAPSHOT_PATH) {
  console.error('[FATAL] --snapshot <path> required. Run scripts/eval-caveman.js first to produce one.');
  process.exit(2);
}
if (!fs.existsSync(SNAPSHOT_PATH)) {
  console.error(`[FATAL] Snapshot not found: ${SNAPSHOT_PATH}`);
  process.exit(2);
}
if (!['md', 'json'].includes(FORMAT)) {
  console.error(`[FATAL] --format must be md or json (got ${FORMAT})`);
  process.exit(2);
}

let encode;
try {
  ({ encode } = require(`gpt-tokenizer/encoding/${ENCODING}`));
} catch (e) {
  console.error(
    `[FATAL] Failed to load gpt-tokenizer encoding "${ENCODING}": ${e.message}\n` +
    `Run \`npm install\` to install dependencies (per ADR-035; gpt-tokenizer is a devDependency in package.json).`
  );
  process.exit(2);
}

function count(text) {
  return encode(String(text || '')).length;
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  if (n === 0) return 0;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

function mean(xs) {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdev(xs) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const variance = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

function fmtPct(x) {
  const sign = x < 0 ? '−' : '+';
  return `${sign}${Math.round(Math.abs(x) * 100)}%`;
}

function statsTuple(savings) {
  return {
    median: median(savings),
    mean: mean(savings),
    min: Math.min(...savings),
    max: Math.max(...savings),
    stdev: stdev(savings),
  };
}

function main() {
  const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  const arms = data.arms || {};
  const meta = data.metadata || {};

  if (!arms.__baseline__ || !arms.__terse__) {
    console.error('[FATAL] Snapshot missing required arms __baseline__ and/or __terse__');
    process.exit(3);
  }

  const baselineTokens = arms.__baseline__.map(count);
  const terseTokens = arms.__terse__.map(count);
  const baselineTotal = baselineTokens.reduce((a, b) => a + b, 0);
  const terseTotal = terseTokens.reduce((a, b) => a + b, 0);
  const terseVsBaseline = baselineTotal > 0 ? 1 - terseTotal / baselineTotal : 0;

  const skillRows = [];
  for (const [skill, outputs] of Object.entries(arms)) {
    if (skill === '__baseline__' || skill === '__terse__') continue;
    const skillTokens = outputs.map(count);
    const savings = skillTokens.map((s, i) => (terseTokens[i] ? 1 - s / terseTokens[i] : 0));
    const st = statsTuple(savings);
    skillRows.push({
      skill,
      ...st,
      skillTotal: skillTokens.reduce((a, b) => a + b, 0),
      terseTotal,
    });
  }
  skillRows.sort((a, b) => b.median - a.median);

  if (FORMAT === 'json') {
    process.stdout.write(JSON.stringify({
      metadata: {
        ...meta,
        encoding: ENCODING,
        snapshot: SNAPSHOT_PATH,
        baseline_total_tokens: baselineTotal,
        terse_total_tokens: terseTotal,
        terse_vs_baseline: terseVsBaseline,
      },
      skills: skillRows,
    }, null, 2) + '\n');
    return;
  }

  const lines = [];
  lines.push(`_Generated: ${meta.generated_at || '?'}_`);
  lines.push(`_Model: ${meta.model || '?'} · CLI: ${meta.claude_cli_version || '?'}_`);
  lines.push(`_Tokenizer: gpt-tokenizer ${ENCODING} (approximation of Claude's BPE)_`);
  lines.push(`_n = ${meta.n_prompts || baselineTokens.length} prompts, single run per arm_`);
  lines.push(`_Snapshot: ${SNAPSHOT_PATH}_`);
  lines.push('');
  lines.push('**Reference arms (no skill):**');
  lines.push(`- baseline (no system prompt): ${baselineTotal} tokens total`);
  lines.push(`- terse control (\`Answer concisely.\`): ${terseTotal} tokens total (${fmtPct(terseVsBaseline)} vs baseline)`);
  lines.push('');
  lines.push('**Skills, measured as additional reduction on top of the terse control:**');
  lines.push('');
  lines.push('| Skill | n | Median | Mean | Min | Max | Stdev | Tokens (skill / terse) |');
  lines.push('|-------|---|--------|------|-----|-----|-------|-------------------------|');
  for (const r of skillRows) {
    lines.push(
      `| **${r.skill}** | ${baselineTokens.length} | ${fmtPct(r.median)} | ${fmtPct(r.mean)} | ` +
      `${fmtPct(r.min)} | ${fmtPct(r.max)} | ${Math.round(r.stdev * 100)}% | ${r.skillTotal} / ${r.terseTotal} |`
    );
  }
  lines.push('');
  lines.push('_Savings = `1 - skill_tokens / terse_tokens` per prompt (negative = skill made output LONGER)._');
  lines.push(`_Refresh snapshot with \`node scripts/eval-caveman.js\`._`);

  process.stdout.write(lines.join('\n') + '\n');
}

main();
