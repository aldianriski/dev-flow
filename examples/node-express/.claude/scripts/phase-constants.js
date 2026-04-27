// .claude/scripts/phase-constants.js
// Single source of truth for phase names + compact-vulnerable subset.
// Imported by set-phase.js (writer) and read-guard.js (PreToolUse hook).
// Drift between writer and reader was the original AUD-001 risk; centralizing here closes it.
'use strict';

const PHASE_FILE = '.claude/.phase';

// All phases the orchestrator may write. Order mirrors dev-flow/SKILL.md Phase Checklist 0–10.
const VALID_PHASES = new Set([
  'parse', 'clarify', 'design',
  'implement', 'validate', 'test',
  'review', 'security',
  'docs', 'commit', 'close',
]);

// Subset where Read/Grep/Glob are blocked by read-guard.js (§1 Thin-Coordinator Rule).
// Every entry MUST also be in VALID_PHASES.
const COMPACT_VULNERABLE = new Set([
  'implement', 'test', 'review', 'security', 'docs',
]);

module.exports = { PHASE_FILE, VALID_PHASES, COMPACT_VULNERABLE };
