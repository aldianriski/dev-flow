// scripts/audit-tokens.js
// TASK-128 token usage audit — gpt-tokenizer-based per-file count.
// Scope: skills + agents + CLAUDE.md + CONTEXT.md + reference files.
// Output: docs/audit/token-counts-2026-05-09.json (machine-readable).
// Runnable: `node scripts/audit-tokens.js`.
'use strict';

const { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } = require('fs');
const { join, relative } = require('path');
const { encode } = require('gpt-tokenizer');

const ROOT = process.cwd();
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_JSON = `docs/audit/token-counts-${TODAY}.json`;

const TARGETS = [
  { group: 'skills',          glob: 'skills/*/SKILL.md',          cap: 100 },
  { group: 'skill-references', glob: 'skills/*/references/*.md',  cap: null },
  { group: 'agents',          glob: 'agents/*.md',                 cap: 30 },
  { group: 'project-claude',  glob: '.claude/CLAUDE.md',           cap: 80 },
  { group: 'project-context', glob: '.claude/CONTEXT.md',          cap: null },
];

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

function expandGlob(pattern) {
  // Handle limited glob shapes used in TARGETS only
  if (pattern.includes('*')) {
    if (pattern === 'skills/*/SKILL.md') {
      return readdirSync('skills', { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => `skills/${e.name}/SKILL.md`)
        .filter(existsSync);
    }
    if (pattern === 'skills/*/references/*.md') {
      const out = [];
      for (const e of readdirSync('skills', { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        const refDir = `skills/${e.name}/references`;
        if (!existsSync(refDir)) continue;
        for (const f of readdirSync(refDir)) {
          if (f.endsWith('.md')) out.push(`${refDir}/${f}`);
        }
      }
      return out;
    }
    if (pattern === 'agents/*.md') {
      return readdirSync('agents')
        .filter(f => f.endsWith('.md'))
        .map(f => `agents/${f}`);
    }
  }
  return existsSync(pattern) ? [pattern] : [];
}

function read(path) { return readFileSync(path, 'utf8').replace(/\r\n/g, '\n'); }
function tokens(s) { return encode(s).length; }
function lineCount(s) { return s.split('\n').length; }

const report = {
  generated: TODAY,
  tokenizer: 'gpt-tokenizer (cl100k_base / o200k default)',
  groups: {},
  totals: { files: 0, tokens: 0, lines: 0 },
};

for (const t of TARGETS) {
  const files = expandGlob(t.glob);
  const groupRows = [];
  let groupTokens = 0, groupLines = 0;
  for (const f of files) {
    const content = read(f);
    const tk = tokens(content);
    const ln = lineCount(content);
    const headroom = t.cap == null ? null : (t.cap - ln);
    groupRows.push({
      path: f.replace(/\\/g, '/'),
      tokens: tk,
      lines: ln,
      cap: t.cap,
      headroom,
      tokens_per_line: ln > 0 ? Math.round((tk / ln) * 10) / 10 : 0,
    });
    groupTokens += tk;
    groupLines += ln;
  }
  groupRows.sort((a, b) => b.tokens - a.tokens);
  report.groups[t.group] = {
    file_count: files.length,
    total_tokens: groupTokens,
    total_lines: groupLines,
    files: groupRows,
  };
  report.totals.files += files.length;
  report.totals.tokens += groupTokens;
  report.totals.lines += groupLines;
}

// Session-start context load synthesis (subset of measured groups)
report.session_start_load = {
  description: 'Files loaded automatically on every new session via CLAUDE.md project memory + MEMORY.md auto-memory + skill metadata (descriptions only, NOT bodies — bodies load on Skill invoke).',
  components: {
    'project-claude': report.groups['project-claude']?.total_tokens ?? 0,
    'auto-memory-MEMORY.md': null, // measured separately below; lives outside repo
    'skill-descriptions-only': null, // ≈100 tokens × 23 plugin skills, measured via /context not file content
  },
  note: 'Skill BODIES (SKILL.md content) load on demand when skill triggers — not session-start. Skill DESCRIPTIONS load always (~2-3k tokens for 23 skills per /context view).',
};

mkdirSync('docs/audit', { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

// Compact stdout summary
console.log(`token audit complete — ${report.totals.files} files · ${report.totals.tokens} tokens · ${report.totals.lines} lines`);
for (const [g, data] of Object.entries(report.groups)) {
  console.log(`  ${g.padEnd(20)} ${String(data.file_count).padStart(3)} files · ${String(data.total_tokens).padStart(6)} tokens`);
}
console.log(`output: ${OUT_JSON}`);
