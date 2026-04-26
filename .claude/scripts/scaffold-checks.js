// .claude/scripts/scaffold-checks.js
// Shared validation functions for session-start.js, validate-scaffold.js, validate-blueprint.js.
// Pure Node (>=18), CommonJS, no shell-outs — cross-platform (Windows Git Bash + Linux).
'use strict';

const { existsSync, readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const OWNERSHIP_FIELDS = ['owner', 'last_updated', 'update_trigger', 'status'];

function countLines(filePath) {
  return readFileSync(filePath, 'utf8').split('\n').length;
}

function globSkills(dir) {
  const results = [];
  function walk(d) {
    try {
      for (const entry of readdirSync(d)) {
        const full = join(d, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry === 'SKILL.md') results.push(full);
      }
    } catch { /* unreadable dir — skip */ }
  }
  walk(dir);
  return results;
}

// Returns array of relative paths missing from root
function checkRequiredFiles(root, required) {
  return required.filter(f => !existsSync(join(root, f)));
}

// Returns { pass, reason, message, count?, data? }
// reason: 'ok' | 'missing' | 'invalid-json' | 'invalid'
function checkManifest(manifestPath) {
  if (!existsSync(manifestPath)) {
    return { pass: false, reason: 'missing', message: `${manifestPath} not found` };
  }
  let raw;
  try {
    raw = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    return { pass: false, reason: 'invalid-json', message: `invalid JSON: ${e.message}` };
  }
  if (!raw.version) {
    return { pass: false, reason: 'invalid', message: 'MANIFEST.json missing "version" field' };
  }
  if (!Array.isArray(raw.skills)) {
    return { pass: false, reason: 'invalid', message: 'MANIFEST.json "skills" must be an array' };
  }
  for (const skill of raw.skills) {
    if (typeof skill.path === 'string' && (skill.path.includes('..') || /^[/\\]/.test(skill.path))) {
      return { pass: false, reason: 'invalid', message: `MANIFEST.json skill.path unsafe: "${skill.path}"` };
    }
  }
  return { pass: true, reason: 'ok', count: raw.skills.length, data: raw };
}

// Returns array of field names absent from content's ownership header
function checkOwnershipHeader(content, fields) {
  const check = fields || OWNERSHIP_FIELDS;
  return check.filter(f => !new RegExp(`^${f}:`, 'm').test(content));
}

// Returns array of {path, lines, limit} where actual lines exceed limit
// limits: { 'relative/path.md': maxLines, ... } — skips files that do not exist
function checkDocLineLimits(root, limits) {
  const violations = [];
  for (const [relPath, limit] of Object.entries(limits)) {
    const full = join(root, relPath);
    if (!existsSync(full)) continue;
    const lines = countLines(full);
    if (lines > limit) violations.push({ path: relPath, lines, limit });
  }
  return violations;
}

module.exports = {
  OWNERSHIP_FIELDS,
  countLines,
  globSkills,
  checkRequiredFiles,
  checkManifest,
  checkOwnershipHeader,
  checkDocLineLimits,
};
