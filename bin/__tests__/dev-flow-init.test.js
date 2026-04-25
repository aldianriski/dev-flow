// bin/__tests__/dev-flow-init.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const fs       = require('fs');
const os       = require('os');
const path     = require('path');

const { applySubstitutions, getLayersForPreset } = require('../dev-flow-init.js');

// ─── applySubstitutions ───────────────────────────────────────────────────────

test('applySubstitutions: replaces [Project Name]', () => {
  const result = applySubstitutions('# [Project Name] — Context', {
    projectName: 'MyApp', ownerRole: '', date: '', layers: '',
  });
  assert.equal(result, '# MyApp — Context');
});

test('applySubstitutions: replaces CLAUDE.md role token', () => {
  const result = applySubstitutions('owner: [role — not personal name]', {
    projectName: '', ownerRole: 'Tech Lead', date: '', layers: '',
  });
  assert.equal(result, 'owner: Tech Lead');
});

test('applySubstitutions: replaces TODO.md role token', () => {
  const result = applySubstitutions('[role — e.g. "Tech Lead", "Dev Lead"] here', {
    projectName: '', ownerRole: 'Dev Lead', date: '', layers: '',
  });
  assert.equal(result, 'Dev Lead here');
});

test('applySubstitutions: replaces YYYY-MM-DD', () => {
  const result = applySubstitutions('last_updated: YYYY-MM-DD', {
    projectName: '', ownerRole: '', date: '2026-04-25', layers: '',
  });
  assert.equal(result, 'last_updated: 2026-04-25');
});

test('applySubstitutions: replaces multi-line layer block', () => {
  const tmpl = [
    '> **Layer values** [CUSTOMIZE]',
    "> `[list your stack's layer names — see docs/blueprint/09-customization.md for stack-specific examples]`",
    '> Example — Node/Express: `api, service, repository, middleware, model`',
    '> Example — React/Next.js: `api, hook, component, page, store, infrastructure`',
    '> end',
  ].join('\n');

  const result = applySubstitutions(tmpl, {
    projectName: '', ownerRole: '', date: '', layers: 'api, service, repo',
  });

  assert.ok(result.includes('> `api, service, repo`'), 'layer line present');
  assert.ok(!result.includes('Example —'), 'example lines removed');
  assert.ok(result.includes('> end'), 'content after block preserved');
});

test('applySubstitutions: keeps [CUSTOMIZE] tokens untouched', () => {
  const result = applySubstitutions('[CUSTOMIZE] section header', {
    projectName: '', ownerRole: '', date: '', layers: '',
  });
  assert.equal(result, '[CUSTOMIZE] section header');
});

test('applySubstitutions: unknown placeholder passes through', () => {
  const result = applySubstitutions('[Some Unknown Token]', {
    projectName: '', ownerRole: '', date: '', layers: '',
  });
  assert.equal(result, '[Some Unknown Token]');
});

test('applySubstitutions: replaces multiple occurrences', () => {
  const result = applySubstitutions('[Project Name] and [Project Name]', {
    projectName: 'Acme', ownerRole: '', date: '', layers: '',
  });
  assert.equal(result, 'Acme and Acme');
});

// ─── getLayersForPreset ───────────────────────────────────────────────────────

test('getLayersForPreset: node-express includes repository', () => {
  assert.ok(getLayersForPreset('node-express').includes('repository'));
});

test('getLayersForPreset: react-next includes hook', () => {
  assert.ok(getLayersForPreset('react-next').includes('hook'));
});

test('getLayersForPreset: python-fastapi includes service', () => {
  assert.ok(getLayersForPreset('python-fastapi').includes('service'));
});

test('getLayersForPreset: go-gin includes api', () => {
  assert.ok(getLayersForPreset('go-gin').includes('api'));
});

test('getLayersForPreset: custom returns provided value', () => {
  assert.equal(getLayersForPreset('custom', 'domain, infra, api'), 'domain, infra, api');
});

test('getLayersForPreset: custom trims whitespace', () => {
  assert.equal(getLayersForPreset('custom', '  layers  '), 'layers');
});

test('getLayersForPreset: unknown preset returns empty string', () => {
  assert.equal(getLayersForPreset('unknown-stack'), '');
});
