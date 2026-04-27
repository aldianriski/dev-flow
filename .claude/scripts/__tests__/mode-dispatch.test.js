// __tests__/mode-dispatch.test.js
// node --test .claude/scripts/__tests__/mode-dispatch.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { readFileSync } = require('fs');
const { join } = require('path');

const SKILL = join(__dirname, '..', '..', 'skills', 'dev-flow', 'SKILL.md');
const content = readFileSync(SKILL, 'utf8');

test('quick mode is marked as default in Mode Dispatch table', () => {
  assert.ok(/\|\s*`quick`\s*\|[^|]*\*\*\(default\)\*\*/.test(content), 'quick row must contain **(default)**');
});

test('full mode requires explicit keyword in Mode Dispatch table', () => {
  assert.ok(/\|\s*`full`\s*\|[^|]*[Ee]xplicit/.test(content), 'full row must contain "Explicit"');
});

test('dot flowchart default path leads to quick, not full', () => {
  assert.ok(/task\s*->\s*quick/.test(content), 'task -> quick edge must exist in flowchart');
  assert.ok(!/task\s*->\s*full/.test(content), 'task -> full edge must NOT exist in flowchart');
});

test('dot flowchart has full as explicit keyword route', () => {
  assert.ok(/kw\s*->\s*full/.test(content), 'kw -> full edge must exist for explicit override');
});

test('freeform detection rule 4 names quick as default for active-task path', () => {
  assert.ok(/4\.\s+.*TASK-NNN.*quick/.test(content), 'rule 4 must reference quick as default');
});

test('mvp mode present in Mode Dispatch table', () => {
  assert.ok(/\|\s*`mvp`\s*\|/.test(content), 'mvp row must exist in Mode Dispatch table');
});

test('dot flowchart has mvp as keyword route', () => {
  assert.ok(/kw\s*->\s*mvp/.test(content), 'kw -> mvp edge must exist in flowchart');
});

test('mvp mode escalation path references quick', () => {
  assert.ok(/mvp\s*->\s*quick/.test(content), 'mvp -> quick escalation edge must exist');
});
