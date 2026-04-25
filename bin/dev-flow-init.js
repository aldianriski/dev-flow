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
const STACK_PRESETS = {
  'node-express': {
    layers: 'api, service, repository, middleware, model',
    lintCommand: 'npm run lint',
    typecheckCommand: 'npx tsc --noEmit',
    packageManager: 'npm',
  },
  'react-next': {
    layers: 'api, hook, component, page, store, infrastructure',
    lintCommand: 'npm run lint',
    typecheckCommand: 'npx tsc --noEmit',
    packageManager: 'npm',
  },
  'python-fastapi': {
    layers: 'api, service, repository, middleware, model',
    lintCommand: 'ruff check .',
    typecheckCommand: 'mypy .',
    packageManager: 'pip',
  },
  'go-gin': {
    layers: 'api, service, repository, middleware, model',
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
];

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

  console.log('\nScaffold written to: ' + target);
  console.log(`Hooks configured for ${presetName}: lint=${preset.lintCommand} | typecheck=${preset.typecheckCommand}`);
  if (settingsResult.preserved) {
    console.log(`Existing settings.local.json preserved; rendered output at ${settingsResult.wrote}`);
  }
  console.log('Next: open .claude/CLAUDE.md and customize the [CUSTOMIZE] sections.');
}

module.exports = {
  applySubstitutions,
  getStackPreset,
  renderSettingsLocal,
  isHookCommandSafe,
  STACK_PRESETS,
  NOOP_COMMAND,
};

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write('Error: ' + err.message + '\n');
    process.exit(1);
  });
}
