#!/usr/bin/env node
// .claude/scripts/set-phase.js
// Orchestrator-managed writer for .claude/.phase — closes the Thin-Coordinator
// Rule loop (blueprint §1, AUD-001, ADR-003).
//
// Usage:
//   node .claude/scripts/set-phase.js <phase>   # write phase name (lowercase, validated)
//   node .claude/scripts/set-phase.js clear     # remove .claude/.phase (idempotent)
//
// Exit 0 = success. Exit 1 = invalid arg or write failure.
// Pure Node (>=18), CommonJS. Cross-platform (Windows Git Bash + Linux).
'use strict';

const { existsSync, lstatSync, mkdirSync, writeFileSync, rmSync } = require('fs');
const { dirname } = require('path');
const { PHASE_FILE, VALID_PHASES } = require('./phase-constants');

// Reject if the target path exists and is a symlink. Prevents an attacker (or stray
// tooling) from redirecting our write/delete onto a sensitive file (e.g. CLAUDE.md,
// ~/.ssh/authorized_keys). The phase file lives in a gitignored, user-writable dir.
function rejectIfSymlink(path) {
  if (!existsSync(path)) return null;
  try {
    const st = lstatSync(path);
    if (st.isSymbolicLink()) {
      return `set-phase: refusing to operate on '${path}' — it is a symlink (potential traversal). Remove it manually if expected.`;
    }
  } catch (err) {
    return `set-phase: failed to stat '${path}': ${err.message}`;
  }
  return null;
}

function usage(stream) {
  stream.write('Usage: node .claude/scripts/set-phase.js <phase|clear>\n');
  stream.write(`  Valid phases: ${[...VALID_PHASES].join(', ')}\n`);
}

function main(argv) {
  const arg = argv[2];

  if (!arg) {
    usage(process.stderr);
    return 1;
  }

  const normalized = String(arg).trim().toLowerCase();

  if (normalized === 'clear') {
    const symlinkErr = rejectIfSymlink(PHASE_FILE);
    if (symlinkErr) {
      process.stderr.write(symlinkErr + '\n');
      return 1;
    }
    try {
      if (existsSync(PHASE_FILE)) rmSync(PHASE_FILE);
      return 0;
    } catch (err) {
      process.stderr.write(`set-phase: failed to clear ${PHASE_FILE}: ${err.message}\n`);
      return 1;
    }
  }

  if (!VALID_PHASES.has(normalized)) {
    // Note: arg printed verbatim; sink is stderr in a CLI context, no log amplification.
    process.stderr.write(`set-phase: invalid phase '${arg}'\n`);
    usage(process.stderr);
    return 1;
  }

  const symlinkErr = rejectIfSymlink(PHASE_FILE);
  if (symlinkErr) {
    process.stderr.write(symlinkErr + '\n');
    return 1;
  }
  try {
    mkdirSync(dirname(PHASE_FILE), { recursive: true });
    writeFileSync(PHASE_FILE, normalized + '\n', 'utf8');
    return 0;
  } catch (err) {
    process.stderr.write(`set-phase: failed to write ${PHASE_FILE}: ${err.message}\n`);
    return 1;
  }
}

if (require.main === module) {
  process.exit(main(process.argv));
}

module.exports = { main, VALID_PHASES, PHASE_FILE };
