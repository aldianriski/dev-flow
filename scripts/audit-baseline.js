// scripts/audit-baseline.js
// Phase 0 baseline metrics — frozen snapshot for Phase 3 token-reduction comparison.
// Pure Node >=18, CJS, no external deps. Runnable: `node scripts/audit-baseline.js`.
'use strict';

const { readFileSync, readdirSync, statSync, existsSync, writeFileSync } = require('fs');
const { join, relative, sep } = require('path');

const ROOT = process.cwd();
const OUT_MD   = 'docs/audit/baseline-metrics.md';
const OUT_JSON = 'docs/audit/baseline-metrics.json';

const CAP = { skill: 100, agent: 30, claude: 80, sprint: null, ai_context: 100, architecture: 150 };

function walkMd(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function read(path) { return readFileSync(path, 'utf8').replace(/\r\n/g, '\n'); }
function lines(s) { return s.split('\n').length; }
function chars(s) { return s.length; }

function parseFrontmatter(s) {
  const m = s.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  const fmLines = m[1].split('\n');
  for (let i = 0; i < fmLines.length; i++) {
    const kv = fmLines[i].match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].replace(/^["']|["']$/g, '').trim();
    // YAML block scalar (`|`, `|-`, `>`, `>-`) — concat indented continuation lines
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

function descCharCount(fm) {
  if (!fm?.description) return 0;
  return fm.description.length;
}

function tokensApprox(s) { return Math.ceil(s.length / 4); } // ~4 chars/token

// ─── Skills ──────────────────────────────────────────────────────────────────
const skills = [];
for (const dir of readdirSync('skills', { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const skillFile = join('skills', dir.name, 'SKILL.md');
  if (!existsSync(skillFile)) continue;
  const content = read(skillFile);
  const fm = parseFrontmatter(content);
  const refDir = join('skills', dir.name, 'references');
  const refFiles = existsSync(refDir) ? walkMd(refDir).map(f => relative(ROOT, f).split(sep).join('/')) : [];
  skills.push({
    name: dir.name,
    file: skillFile.split(sep).join('/'),
    lines: lines(content),
    chars: chars(content),
    tokens_approx: tokensApprox(content),
    desc_chars: descCharCount(fm),
    has_red_flags: /^##\s+Red Flags/m.test(content),
    has_use_when: !!fm?.description?.startsWith('Use when'),
    over_cap: lines(content) > CAP.skill,
    references: refFiles,
  });
}

// ─── Agents ──────────────────────────────────────────────────────────────────
const agents = [];
for (const file of readdirSync('agents').filter(f => f.endsWith('.md'))) {
  const path = join('agents', file);
  const content = read(path);
  const fm = parseFrontmatter(content);
  agents.push({
    name: file.replace(/\.md$/, ''),
    file: path.split(sep).join('/'),
    lines: lines(content),
    chars: chars(content),
    tokens_approx: tokensApprox(content),
    desc_chars: descCharCount(fm),
    over_cap: lines(content) > CAP.agent,
  });
}

// ─── Scripts ─────────────────────────────────────────────────────────────────
const scripts = [];
for (const file of readdirSync('scripts').filter(f => f.endsWith('.js'))) {
  const path = join('scripts', file);
  const content = read(path);
  scripts.push({
    name: file,
    file: path.split(sep).join('/'),
    lines: lines(content),
    chars: chars(content),
  });
}

// ─── Governance docs ─────────────────────────────────────────────────────────
const govDocs = [];
const govList = ['.claude/CLAUDE.md', '.claude/CONTEXT.md', 'docs/ARCHITECTURE.md', 'docs/AI_CONTEXT.md',
  'docs/DECISIONS.md', 'docs/CHANGELOG.md', 'README.md', 'TODO.md'];
for (const path of govList) {
  if (!existsSync(path)) continue;
  const content = read(path);
  const fm = parseFrontmatter(content);
  govDocs.push({
    file: path.split(sep).join('/'),
    lines: lines(content),
    chars: chars(content),
    tokens_approx: tokensApprox(content),
    status: fm?.status || 'unknown',
    last_updated: fm?.last_updated || 'unknown',
  });
}

// ─── Aggregates ──────────────────────────────────────────────────────────────
const sum = a => a.reduce((n, x) => n + x, 0);
const aggregate = {
  generated: new Date().toISOString(),
  skill_count: skills.length,
  agent_count: agents.length,
  script_count: scripts.length,
  skill_lines_total: sum(skills.map(s => s.lines)),
  agent_lines_total: sum(agents.map(a => a.lines)),
  skill_tokens_total: sum(skills.map(s => s.tokens_approx)),
  agent_tokens_total: sum(agents.map(a => a.tokens_approx)),
  skills_over_cap: skills.filter(s => s.over_cap).map(s => s.name),
  agents_over_cap: agents.filter(a => a.over_cap).map(a => a.name),
  skills_missing_red_flags: skills.filter(s => !s.has_red_flags).map(s => s.name),
  skills_desc_not_use_when: skills.filter(s => !s.has_use_when).map(s => s.name),
  skills_desc_over_500: skills.filter(s => s.desc_chars > 500).map(s => s.name),
};

// ─── Output JSON snapshot (machine-readable) ─────────────────────────────────
writeFileSync(OUT_JSON, JSON.stringify({ aggregate, skills, agents, scripts, govDocs }, null, 2));

// ─── Output Markdown report (human-readable) ─────────────────────────────────
const md = [];
md.push('---');
md.push('owner: Tech Lead (Aldian Rizki)');
md.push('last_updated: 2026-05-01');
md.push('purpose: Phase 0 baseline — frozen snapshot for Phase 3 token-reduction comparison');
md.push('status: current');
md.push('generator: scripts/audit-baseline.js');
md.push('---');
md.push('');
md.push('# Baseline Metrics — ' + aggregate.generated);
md.push('');
md.push('## Aggregate');
md.push('');
md.push(`- Skills: **${aggregate.skill_count}** · total lines: ${aggregate.skill_lines_total} · approx tokens: ${aggregate.skill_tokens_total}`);
md.push(`- Agents: **${aggregate.agent_count}** · total lines: ${aggregate.agent_lines_total} · approx tokens: ${aggregate.agent_tokens_total}`);
md.push(`- Scripts: **${aggregate.script_count}**`);
md.push(`- Skills over 100-line cap: ${aggregate.skills_over_cap.length || 'none'} ${aggregate.skills_over_cap.length ? '(' + aggregate.skills_over_cap.join(', ') + ')' : ''}`);
md.push(`- Agents over 30-line cap: ${aggregate.agents_over_cap.length || 'none'} ${aggregate.agents_over_cap.length ? '(' + aggregate.agents_over_cap.join(', ') + ')' : ''}`);
md.push(`- Skills missing Red Flags section: ${aggregate.skills_missing_red_flags.length || 'none'}${aggregate.skills_missing_red_flags.length ? ' (' + aggregate.skills_missing_red_flags.join(', ') + ')' : ''}`);
md.push(`- Skills with description not starting "Use when": ${aggregate.skills_desc_not_use_when.length || 'none'}${aggregate.skills_desc_not_use_when.length ? ' (' + aggregate.skills_desc_not_use_when.join(', ') + ')' : ''}`);
md.push(`- Skills with description >500 chars: ${aggregate.skills_desc_over_500.length || 'none'}`);
md.push('');
md.push('## Skills');
md.push('');
md.push('| Skill | Lines | Cap | Chars | Tokens~ | Desc chars | Use-when | Red Flags | Refs |');
md.push('|:------|------:|----:|------:|--------:|-----------:|:--------:|:---------:|-----:|');
for (const s of skills) {
  md.push(`| ${s.name} | ${s.lines} | 100 | ${s.chars} | ${s.tokens_approx} | ${s.desc_chars} | ${s.has_use_when ? '✓' : '✗'} | ${s.has_red_flags ? '✓' : '✗'} | ${s.references.length} |`);
}
md.push('');
md.push('## Agents');
md.push('');
md.push('| Agent | Lines | Cap | Chars | Tokens~ | Desc chars |');
md.push('|:------|------:|----:|------:|--------:|-----------:|');
for (const a of agents) {
  md.push(`| ${a.name} | ${a.lines}${a.over_cap ? ' ❌' : ''} | 30 | ${a.chars} | ${a.tokens_approx} | ${a.desc_chars} |`);
}
md.push('');
md.push('## Scripts');
md.push('');
md.push('| Script | Lines |');
md.push('|:-------|------:|');
for (const s of scripts) {
  md.push(`| ${s.name} | ${s.lines} |`);
}
md.push('');
md.push('## Governance Docs');
md.push('');
md.push('| File | Lines | Status | last_updated | Tokens~ |');
md.push('|:-----|------:|:-------|:-------------|--------:|');
for (const d of govDocs) {
  md.push(`| ${d.file} | ${d.lines} | ${d.status} | ${d.last_updated} | ${d.tokens_approx} |`);
}
md.push('');
md.push('---');
md.push('');
md.push('Re-run: `node scripts/audit-baseline.js`. JSON snapshot at `' + OUT_JSON + '`.');

writeFileSync(OUT_MD, md.join('\n') + '\n');

console.log(`baseline written: ${OUT_MD} (${aggregate.skill_count} skills, ${aggregate.agent_count} agents, ${aggregate.script_count} scripts)`);
console.log(`JSON snapshot: ${OUT_JSON}`);
if (aggregate.skills_over_cap.length || aggregate.agents_over_cap.length) {
  console.log(`OVER-CAP: ${aggregate.skills_over_cap.length} skills, ${aggregate.agents_over_cap.length} agents`);
}
