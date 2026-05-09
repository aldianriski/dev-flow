#!/usr/bin/env node
// bin/dev-flow-init.js — copies dev-flow scaffold into a target repo.
// Node >=18. No external deps. Invoke: node bin/dev-flow-init.js
'use strict';

const fs   = require('fs');
const path = require('path');
const rl   = require('readline');

// ─── Constants ───────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '..');

// Per-stack defaults. lintCommand/typecheckCommand wire into settings.local.json
// PreToolUse hooks for Bash(git commit*) / Bash(git push*).
//
// Layer set = Clean Architecture + DDD canonical (ADR-029):
//   domain         — entities, value objects, aggregates, domain events, repo interfaces
//   application    — use cases, application services, DTOs, ports
//   infrastructure — repo implementations, framework adapters, db, external clients
//   interface      — HTTP/CLI/UI entry (controllers, routes, presenters)
//   shared         — cross-cutting (errors, types, value objects shared across contexts)
//
// react-next variant: 4 layers (interface collapses into Next.js app/ routing).
// go-gin: tests live alongside source per Go convention; testRoot omitted.
const STACK_PRESETS = {
  'node-express': {
    layers: 'domain, application, infrastructure, interface, shared',
    sourceRoot: 'src',
    testRoot: 'tests',
    lintCommand: 'npm run lint',
    typecheckCommand: 'npx tsc --noEmit',
    packageManager: 'npm',
  },
  'react-next': {
    layers: 'domain, application, infrastructure, shared',
    sourceRoot: 'src',
    appRoot: 'app',
    testRoot: 'tests',
    lintCommand: 'npm run lint',
    typecheckCommand: 'npx tsc --noEmit',
    packageManager: 'npm',
  },
  'python-fastapi': {
    layers: 'domain, application, infrastructure, interface, shared',
    sourceRoot: 'app',
    testRoot: 'tests',
    lintCommand: 'ruff check .',
    typecheckCommand: 'mypy .',
    packageManager: 'pip',
  },
  'go-gin': {
    layers: 'domain, application, infrastructure, interface, shared',
    sourceRoot: 'internal',
    cmdRoot: 'cmd',
    lintCommand: 'go vet ./...',
    typecheckCommand: 'go build ./...',
    packageManager: 'go',
  },
};

const NOOP_COMMAND = 'node -e "process.exit(0)"';

const TEMPLATE_MAP = [
  { src: 'templates/CLAUDE.md.template',       dest: '.claude/CLAUDE.md' },
  { src: 'templates/TODO.md.template',          dest: 'TODO.md' },
  { src: 'templates/CHANGELOG.md.template',    dest: 'docs/CHANGELOG.md' },
  { src: 'templates/ARCHITECTURE.md.template', dest: 'docs/ARCHITECTURE.md' },
  { src: 'templates/DECISIONS.md.template',    dest: 'docs/DECISIONS.md' },
  { src: 'templates/AI_CONTEXT.md.template',   dest: 'docs/AI_CONTEXT.md' },
  { src: 'templates/SETUP.md.template',        dest: 'docs/SETUP.md' },
  { src: 'templates/README.md.template',       dest: 'README.md' },
  { src: 'templates/gitignore.template',       dest: '.gitignore' },
];

// Empty dirs created by createEmptyScaffoldDirs(target). Tracked via .gitkeep.
// docs/codemap/ — codemap-refresh hook target; populated on first commit.
// docs/adr/ — adr-writer skill target; populated when first hard-to-reverse decision lands.
const EMPTY_SCAFFOLD_DIRS = ['docs/codemap', 'docs/adr'];

// ─── Substitution ────────────────────────────────────────────────────────────

// Replaces known template tokens; leaves [CUSTOMIZE] and unknown placeholders untouched.
function applySubstitutions(template, vars) {
  let out = template;

  out = out.replaceAll('[Project Name]', vars.projectName || '[Project Name]');
  out = out.replaceAll('[role — not personal name]', vars.ownerRole || '[role — not personal name]');
  out = out.replaceAll('[role — e.g. "Tech Lead", "Dev Lead"]', vars.ownerRole || '[role — e.g. "Tech Lead", "Dev Lead"]');
  out = out.replaceAll('YYYY-MM-DD', vars.date || 'YYYY-MM-DD');

  // Multi-line layer block: placeholder line + trailing Example lines replaced atomically.
  const layerBlockRe = /> `\[list your stack's layer names[^\]]*\]`\n(?:> Example[^\n]*\n)*/;
  const layers = vars.layers || '';
  out = out.replace(layerBlockRe, () => '> `' + layers + '`\n');

  if (out.includes("[list your stack's layer names")) {
    process.stderr.write('WARNING: layer block placeholder not replaced — template format may have changed\n');
  }

  return out;
}

// Reject the shell metacharacters that enable command chaining or substitution.
// Allow `&&` / `||` / `|` for legitimate composition (e.g. `npm run lint && tsc --noEmit`).
const FORBIDDEN_HOOK_META = /[\n\r;`]|\$\(/;

function isHookCommandSafe(cmd) {
  return typeof cmd === 'string' && cmd.length > 0 && !FORBIDDEN_HOOK_META.test(cmd);
}

function getStackPreset(preset, custom) {
  if (preset === 'custom') {
    return {
      layers: (custom?.layers || '').trim(),
      lintCommand: custom?.lintCommand || NOOP_COMMAND,
      typecheckCommand: custom?.typecheckCommand || NOOP_COMMAND,
      packageManager: custom?.packageManager || 'npm',
    };
  }
  return STACK_PRESETS[preset] || null;
}

// ─── Copy ────────────────────────────────────────────────────────────────────

function normSep(p) {
  return p.replace(/\\/g, '/');
}

function copyScaffold(target) {
  // .claude/ — exclude settings.local.json (project-private, not for target repos)
  fs.cpSync(
    path.join(REPO_ROOT, '.claude'),
    path.join(target, '.claude'),
    {
      recursive: true,
      dereference: false,
      filter: (src) => !normSep(src).endsWith('.claude/settings.local.json'),
    }
  );

  fs.cpSync(
    path.join(REPO_ROOT, 'docs', 'blueprint'),
    path.join(target, 'docs', 'blueprint'),
    { recursive: true, dereference: false }
  );
}

// ─── Render settings.local.json from preset ──────────────────────────────────

function renderSettingsLocal(target, preset) {
  const examplePath = path.join(REPO_ROOT, '.claude', 'settings.local.example.json');
  if (!fs.existsSync(examplePath)) return { skipped: true, reason: 'example missing' };

  const raw = fs.readFileSync(examplePath, 'utf8');
  const rendered = raw
    .replaceAll('[your-lint-command]', preset.lintCommand)
    .replaceAll('[your-typecheck-command]', preset.typecheckCommand)
    .replaceAll('[package-manager]', preset.packageManager);

  // Strip the _instructions block (rendered file should not carry user-facing prompts)
  const parsed = JSON.parse(rendered);
  delete parsed._instructions;
  const finalText = JSON.stringify(parsed, null, 2) + '\n';

  const destPath = path.join(target, '.claude', 'settings.local.json');
  if (fs.existsSync(destPath)) {
    const newPath = destPath + '.new';
    fs.writeFileSync(newPath, finalText, 'utf8');
    return { skipped: false, wrote: newPath, preserved: destPath };
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, finalText, 'utf8');
  return { skipped: false, wrote: destPath };
}

// ─── Render templates ─────────────────────────────────────────────────────────

function renderTemplates(target, vars) {
  for (const { src, dest } of TEMPLATE_MAP) {
    const srcPath  = path.join(REPO_ROOT, src);
    const destPath = path.join(target, dest);
    if (!fs.existsSync(srcPath)) continue;
    const rendered = applySubstitutions(fs.readFileSync(srcPath, 'utf8'), vars);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, rendered, 'utf8');
  }
}

// ─── Create empty scaffold dirs ───────────────────────────────────────────────

// Idempotent: re-runs do not error or duplicate. Existing .gitkeep preserved
// (do not overwrite — user may have added intentional content alongside).
function createEmptyScaffoldDirs(target) {
  for (const relDir of EMPTY_SCAFFOLD_DIRS) {
    const dirPath  = path.join(target, relDir);
    const keepPath = path.join(dirPath, '.gitkeep');
    fs.mkdirSync(dirPath, { recursive: true });
    if (!fs.existsSync(keepPath)) {
      fs.writeFileSync(keepPath, '', 'utf8');
    }
  }
}

// ─── Create lean architecture skeleton (ADR-029) ──────────────────────────────

// Materializes per-stack project skeleton: CA+DDD layer dirs under sourceRoot,
// optional appRoot (Next.js) / cmdRoot (Go), and tests/{unit,integration,e2e}/
// when testRoot is set. Custom presets without sourceRoot are skipped silently
// (user owns project shape).
//
// Idempotent: preserves user content alongside .gitkeep files.
function createProjectSkeleton(target, preset) {
  if (!preset || !preset.sourceRoot) return;

  const writeKeep = (dirPath) => {
    fs.mkdirSync(dirPath, { recursive: true });
    const keepPath = path.join(dirPath, '.gitkeep');
    if (!fs.existsSync(keepPath)) {
      fs.writeFileSync(keepPath, '', 'utf8');
    }
  };

  // Layer dirs under sourceRoot
  const layerList = (preset.layers || '')
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean);
  for (const layer of layerList) {
    writeKeep(path.join(target, preset.sourceRoot, layer));
  }

  // Next.js App Router (react-next)
  if (preset.appRoot) {
    writeKeep(path.join(target, preset.appRoot));
  }

  // Go cmd entry root (go-gin)
  if (preset.cmdRoot) {
    writeKeep(path.join(target, preset.cmdRoot));
  }

  // Test dirs (skipped for stacks where tests live alongside source — Go)
  if (preset.testRoot) {
    for (const testDir of ['unit', 'integration', 'e2e']) {
      writeKeep(path.join(target, preset.testRoot, testDir));
    }
  }
}

// ─── Prompts ─────────────────────────────────────────────────────────────────

function ask(iface, question, defaultVal) {
  const hint = defaultVal ? ` (${defaultVal})` : '';
  return new Promise((resolve) => {
    iface.question(`${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultVal || '');
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: node bin/dev-flow-init.js');
    console.log('Copies the dev-flow scaffold into a target directory with stack prompts.');
    process.exit(0);
  }

  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });

  const targetAnswer = await ask(iface, 'Target directory', process.cwd());
  const target = path.resolve(targetAnswer);

  if (target === REPO_ROOT) {
    process.stderr.write('Error: target directory cannot be the dev-flow repo itself.\n');
    iface.close();
    return;
  }

  if (fs.existsSync(path.join(target, '.claude'))) {
    const confirm = await ask(iface, target + '/.claude already exists. Overwrite?', 'N');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Aborted.');
      iface.close();
      return;
    }
  }

  const projectName = await ask(iface, 'Project name', path.basename(target));
  const ownerRole   = await ask(iface, 'Owner role', 'Tech Lead');

  console.log('Stack presets: node-express | react-next | python-fastapi | go-gin | custom');
  const presetName = (await ask(iface, 'Stack', 'node-express')).toLowerCase();

  let preset;
  if (presetName === 'custom') {
    const layers = await ask(iface, 'Layers (comma-separated)', '');
    const lintCommand = await ask(iface, 'Lint command', NOOP_COMMAND);
    const typecheckCommand = await ask(iface, 'Typecheck command', NOOP_COMMAND);
    const packageManager = await ask(iface, 'Package manager', 'npm');
    if (!isHookCommandSafe(lintCommand) || !isHookCommandSafe(typecheckCommand)) {
      process.stderr.write('Error: lint/typecheck command contains disallowed shell metacharacters (newline, ;, backtick, $()). Use && or || to chain commands instead.\n');
      iface.close();
      return;
    }
    preset = getStackPreset('custom', { layers, lintCommand, typecheckCommand, packageManager });
  } else {
    preset = getStackPreset(presetName);
    if (!preset) {
      process.stderr.write(`Error: unknown stack '${presetName}'.\n`);
      iface.close();
      return;
    }
  }

  iface.close();

  const vars = {
    projectName,
    ownerRole,
    date:   new Date().toISOString().slice(0, 10),
    layers: preset.layers,
  };

  fs.mkdirSync(target, { recursive: true });
  copyScaffold(target);
  const settingsResult = renderSettingsLocal(target, preset);
  renderTemplates(target, vars);
  createEmptyScaffoldDirs(target);
  createProjectSkeleton(target, preset);

  console.log('\nScaffold written to: ' + target);
  console.log(`Hooks configured for ${presetName}: lint=${preset.lintCommand} | typecheck=${preset.typecheckCommand}`);
  console.log('Empty dirs created: docs/codemap/ + docs/adr/ (.gitkeep tracked)');
  if (preset.sourceRoot) {
    const extras = [];
    if (preset.appRoot) extras.push(preset.appRoot + '/');
    if (preset.cmdRoot) extras.push(preset.cmdRoot + '/');
    if (preset.testRoot) extras.push(preset.testRoot + '/{unit,integration,e2e}/');
    const extraStr = extras.length ? ' + ' + extras.join(' + ') : '';
    console.log(`Lean architecture skeleton (ADR-029): ${preset.sourceRoot}/{${preset.layers}}/${extraStr}`);
  } else {
    console.log('Lean architecture skeleton: skipped (custom preset — user owns project shape)');
  }
  if (settingsResult.preserved) {
    console.log(`Existing settings.local.json preserved; rendered output at ${settingsResult.wrote}`);
  }
  console.log('Next: open .claude/CLAUDE.md and customize the [CUSTOMIZE] sections.');
}

module.exports = {
  applySubstitutions,
  getStackPreset,
  renderSettingsLocal,
  renderTemplates,
  createEmptyScaffoldDirs,
  createProjectSkeleton,
  isHookCommandSafe,
  STACK_PRESETS,
  NOOP_COMMAND,
  TEMPLATE_MAP,
  EMPTY_SCAFFOLD_DIRS,
};

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write('Error: ' + err.message + '\n');
    process.exit(1);
  });
}
