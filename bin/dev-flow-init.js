#!/usr/bin/env node
// bin/dev-flow-init.js — copies dev-flow scaffold into a target repo.
// Node >=18. No external deps. Invoke: node bin/dev-flow-init.js
'use strict';

const fs   = require('fs');
const path = require('path');
const rl   = require('readline');

// ─── Constants ───────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '..');

const LAYER_PRESETS = {
  'node-express':   'api, service, repository, middleware, model',
  'react-next':     'api, hook, component, page, store, infrastructure',
  'python-fastapi': 'api, service, repository, middleware, model',
  'go-gin':         'api, service, repository, middleware, model',
};

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

function getLayersForPreset(preset, custom) {
  if (preset === 'custom') return (custom || '').trim();
  return LAYER_PRESETS[preset] || '';
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
  const preset = (await ask(iface, 'Stack', 'node-express')).toLowerCase();

  let customLayers = '';
  if (preset === 'custom') {
    customLayers = await ask(iface, 'Layers (comma-separated)', '');
  }

  iface.close();

  const vars = {
    projectName,
    ownerRole,
    date:   new Date().toISOString().slice(0, 10),
    layers: getLayersForPreset(preset, customLayers),
  };

  fs.mkdirSync(target, { recursive: true });
  copyScaffold(target);
  renderTemplates(target, vars);

  console.log('\nScaffold written to: ' + target);
  console.log('Next: open .claude/CLAUDE.md and customize the [CUSTOMIZE] sections.');
}

module.exports = { applySubstitutions, getLayersForPreset };

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write('Error: ' + err.message + '\n');
    process.exit(1);
  });
}
