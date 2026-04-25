// .claude/scripts/track-change.js
// PostToolUse hook: appends changed file path to .claude/.session-changes.txt.
//
// Hook input contract (CC_SPEC.md §1): JSON on stdin.
//   { tool_name, tool_input: { file_path, ... } }
// Exit 0 always — tracker failures must never block writes.
'use strict';

const { appendFileSync, mkdirSync, readFileSync } = require('fs');

const IGNORED_PREFIXES = ['.claude/', 'node_modules/', '.git/'];
const IGNORED_FILES    = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

let filePath = '';
try {
  const raw = readStdin();
  if (raw.trim()) {
    const input = JSON.parse(raw);
    filePath = input?.tool_input?.file_path || input?.tool_input?.path || '';
  }
} catch {
  process.exit(0);
}

if (!filePath) process.exit(0);

const normalized = filePath.replace(/\\/g, '/');

// Skip internal files — changes to them are harness maintenance, not task scope
if (IGNORED_PREFIXES.some(p => normalized.startsWith(p))) process.exit(0);
if (IGNORED_FILES.some(f => normalized.endsWith(f))) process.exit(0);

try {
  mkdirSync('.claude', { recursive: true });
  appendFileSync('.claude/.session-changes.txt', normalized + '\n', 'utf8');
} catch {
  // Non-fatal — tracker unavailability must not interrupt workflow
}

process.exit(0);
