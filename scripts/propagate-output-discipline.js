// scripts/propagate-output-discipline.js
// TASK-133 T3.3 — append Output Discipline pointer line to 16 SKILL.md + 7 agent.md.
// Verify-per-file: read line count, check cap headroom, append OR skip with reason.
// Idempotent: skips files already containing the pointer.
// Runnable: `node scripts/propagate-output-discipline.js`.
'use strict';

const { readFileSync, writeFileSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');

const POINTER = '> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../../.claude/CONTEXT.md#output-discipline).';
const POINTER_AGENT = '> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline](../.claude/CONTEXT.md#output-discipline).';
const MARKER = 'Output Discipline: see';

const SKILLS_DIR = 'skills';
const AGENTS_DIR = 'agents';
const SKILL_CAP = 100;
const AGENT_CAP = 30;
// Pointer adds 2 lines (blank + pointer). Need ≥2 headroom; release-patch (0) is the documented exception.

function read(p) { return readFileSync(p, 'utf8').replace(/\r\n/g, '\n'); }
function lineCount(s) { return s.split('\n').length; }

function targets() {
  const out = [];
  for (const e of readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const f = join(SKILLS_DIR, e.name, 'SKILL.md');
    if (existsSync(f)) out.push({ path: f, cap: SKILL_CAP, kind: 'skill', pointer: POINTER });
  }
  for (const f of readdirSync(AGENTS_DIR)) {
    if (!f.endsWith('.md')) continue;
    out.push({ path: join(AGENTS_DIR, f), cap: AGENT_CAP, kind: 'agent', pointer: POINTER_AGENT });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

const results = [];
for (const t of targets()) {
  const before = read(t.path);
  // wc-equivalent line count: count newlines (POSIX: file ends with \n → N lines = N newlines)
  const wcLines = (before.match(/\n/g) || []).length;
  const headroom = t.cap - wcLines;

  if (before.includes(MARKER)) {
    results.push({ path: t.path, status: 'skip-already-present', wc: wcLines, cap: t.cap, headroom });
    continue;
  }
  if (headroom < 2) {
    results.push({ path: t.path, status: 'skip-zero-headroom', wc: wcLines, cap: t.cap, headroom, note: 'documented exception per ADR-033 DEC-4' });
    continue;
  }

  // Append pattern: ensure single trailing newline + blank-line separator + pointer line.
  // Adds exactly 2 lines (one blank + pointer) so cap-pressure files fit (e.g., agent 28/30 → 30/30).
  const stripped = before.replace(/\n+$/, '');
  const after = stripped + '\n\n' + t.pointer + '\n';
  // Re-check post-write line count vs cap
  const newWc = (after.match(/\n/g) || []).length;
  if (newWc > t.cap) {
    results.push({ path: t.path, status: 'skip-would-breach-cap', wc: wcLines, cap: t.cap, headroom, projected: newWc });
    continue;
  }

  writeFileSync(t.path, after);
  results.push({ path: t.path, status: 'written', wc: wcLines, cap: t.cap, headroom, projected: newWc });
}

const counts = results.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
console.log('propagation summary:');
for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
console.log('\nper-file:');
for (const r of results) {
  const status = r.status.padEnd(28);
  const cap = `${r.wc}/${r.cap}`.padStart(8);
  const h = `h=${r.headroom}`.padStart(6);
  const proj = r.projected != null ? `→${r.projected}` : '';
  console.log(`  ${status} ${cap} ${h}  ${proj.padEnd(5)}  ${r.path}`);
}
console.log('\ndone.');
