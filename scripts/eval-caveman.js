#!/usr/bin/env node
/**
 * eval-caveman.js — TASK-115-v2 (Sprint 055-2)
 *
 * Caveman 3-arm eval harness — Node port of caveman upstream `evals/llm_run.py`.
 * Snapshot schema 1:1 with caveman per `docs/research/caveman-eval-harness-port-notes-2026-05-04.md`
 * §snapshot-schema-for-dev-flow-port. Cross-tool validation either direction
 * (caveman's measure.py reads dev-flow snapshots; dev-flow's eval-measure.js reads caveman snapshots).
 *
 * 3 arms per prompt:
 *   1. __baseline__   — no system prompt
 *   2. __terse__      — system="Answer concisely."
 *   3. <skill>        — system="Answer concisely.\n\n{SKILL.md content}"
 *
 * Honest delta = (3) vs (2): how much the SKILL adds on top of plain "be terse" instruction.
 *
 * Snapshots are point-in-time. `claude -p` is non-deterministic. Re-run for new measurement.
 *
 * Usage:
 *   node scripts/eval-caveman.js                                # live run; default skill = caveman
 *   node scripts/eval-caveman.js --dry-run                      # skeleton snapshot; no claude invocation
 *   node scripts/eval-caveman.js --prompts evals/prompts/en.txt # override prompts file
 *   node scripts/eval-caveman.js --out <path>                   # override snapshot output path
 *   node scripts/eval-caveman.js --model claude-opus-4-7        # pass through to claude --model
 *   node scripts/eval-caveman.js --skill caveman-commit         # eval different caveman skill
 *   node scripts/eval-caveman.js --plugin caveman               # override plugin name (default: --skill value)
 *
 * Env overrides:
 *   CAVEMAN_EVAL_MODEL  — same as --model flag
 *   CAVEMAN_SKILL_PATH  — explicit absolute path to SKILL.md (skips plugin-cache glob)
 *
 * Operator-run note: live mode invokes `claude` CLI for (3 arms × N prompts) calls. Cost = real API tokens.
 * Default mode = --dry-run absent → live runs.
 *
 * Caveman SKILL.md source (per Sprint 055-2 OQ(M) user-locked decision):
 *   Plugin-cache path resolution. Hard-fail with clear message if unresolvable.
 *   NO silent fallback to inline copy (drift risk worse than fail-fast).
 *   Operator setup precondition: caveman plugin installed via Claude Code marketplace.
 *
 * Snapshot schema (per OQ(C); 1:1 with caveman upstream):
 *   {
 *     "metadata": { generated_at, claude_cli_version, model, n_prompts, terse_prefix },
 *     "prompts": [...],
 *     "arms": { "__baseline__": [...], "__terse__": [...], "<skill>": [...] }
 *   }
 */

'use strict';

const { spawnSync, execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const args = process.argv.slice(2);
const opt = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : dflt;
};
const has = (flag) => args.includes(flag);

const SKILL = opt('--skill', 'caveman');
const PLUGIN = opt('--plugin', SKILL);
const PROMPTS_PATH = opt('--prompts', 'evals/prompts/en.txt');
const MODEL = opt('--model', process.env.CAVEMAN_EVAL_MODEL || '');
const DRY_RUN = has('--dry-run');
const TS = new Date().toISOString().replace(/[:.]/g, '-');
const OUT_PATH = opt('--out', `evals/snapshots/results-${TS}.json`);
const TERSE_PREFIX = 'Answer concisely.';

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function getClaudeVersion() {
  return sh('claude --version') || 'unknown';
}

/**
 * Resolve caveman SKILL.md via plugin-cache glob (per OQ(M) hard-fail decision).
 * Cache layout: ~/.claude/plugins/cache/<marketplace>/<plugin>/<version-hash>/skills/<skill>/SKILL.md
 * Returns absolute path or throws with clear operator-actionable message.
 */
function resolveSkillPath(skillName, pluginName) {
  if (process.env.CAVEMAN_SKILL_PATH) {
    if (!fs.existsSync(process.env.CAVEMAN_SKILL_PATH)) {
      throw new Error(`CAVEMAN_SKILL_PATH set but file not found: ${process.env.CAVEMAN_SKILL_PATH}`);
    }
    return process.env.CAVEMAN_SKILL_PATH;
  }
  const cacheRoot = path.join(os.homedir(), '.claude', 'plugins', 'cache');
  if (!fs.existsSync(cacheRoot)) {
    throw new Error(
      `Plugin cache not found: ${cacheRoot}\n` +
      `Install ${pluginName} plugin via Claude Code marketplace, OR set CAVEMAN_SKILL_PATH env var to absolute SKILL.md path.`
    );
  }
  const marketplaceDir = path.join(cacheRoot, pluginName);
  if (!fs.existsSync(marketplaceDir)) {
    throw new Error(
      `Plugin marketplace dir not found: ${marketplaceDir}\n` +
      `Install ${pluginName} plugin via Claude Code marketplace, OR set CAVEMAN_SKILL_PATH env var to absolute SKILL.md path.`
    );
  }
  const pluginDir = path.join(marketplaceDir, pluginName);
  if (!fs.existsSync(pluginDir)) {
    throw new Error(
      `Plugin dir not found: ${pluginDir}\n` +
      `Plugin layout unexpected. Set CAVEMAN_SKILL_PATH env var to absolute SKILL.md path.`
    );
  }
  const versionDirs = fs.readdirSync(pluginDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({
      name: d.name,
      mtime: fs.statSync(path.join(pluginDir, d.name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const v of versionDirs) {
    const candidate = path.join(pluginDir, v.name, 'skills', skillName, 'SKILL.md');
    if (fs.existsSync(candidate)) return candidate;
  }
  const tried = versionDirs.map(v => path.join(pluginDir, v.name, 'skills', skillName, 'SKILL.md')).join('\n  ');
  throw new Error(
    `SKILL.md not found for skill="${skillName}" in plugin="${pluginName}".\n` +
    `Tried (newest version first):\n  ${tried || '(no version dirs)'}\n` +
    `Either install/update the plugin, or set CAVEMAN_SKILL_PATH env var to absolute SKILL.md path.`
  );
}

function runClaude(prompt, system) {
  const cmd = ['-p'];
  if (system) cmd.push('--system-prompt', system);
  if (MODEL) cmd.push('--model', MODEL);
  cmd.push(prompt);
  const res = spawnSync('claude', cmd, { encoding: 'utf8' });
  if (res.error) throw res.error;
  if (res.status !== 0) {
    throw new Error(`claude exit ${res.status}: ${(res.stderr || '').slice(0, 500)}`);
  }
  return (res.stdout || '').trim();
}

function loadPrompts(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompts file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));
}

function dryRunPlaceholder(prompt, arm) {
  return `[dry-run placeholder · arm=${arm} · prompt=${prompt.slice(0, 40)}...]`;
}

function main() {
  console.log(`eval-caveman: skill=${SKILL} plugin=${PLUGIN} model=${MODEL || 'default'}${DRY_RUN ? ' · DRY RUN' : ''}`);

  let skillPath = '';
  let skillContent = '';
  try {
    skillPath = resolveSkillPath(SKILL, PLUGIN);
    skillContent = fs.readFileSync(skillPath, 'utf8');
    console.log(`[skill] ${skillPath} (${skillContent.length} chars)`);
  } catch (e) {
    console.error(`\n[FATAL] ${e.message}\n`);
    process.exit(2);
  }

  const prompts = loadPrompts(PROMPTS_PATH);
  console.log(`[prompts] ${prompts.length} loaded from ${PROMPTS_PATH}`);

  const claudeVersion = DRY_RUN ? '(dry-run)' : getClaudeVersion();
  const snapshot = {
    metadata: {
      generated_at: new Date().toISOString(),
      claude_cli_version: claudeVersion,
      model: MODEL || 'default',
      n_prompts: prompts.length,
      terse_prefix: TERSE_PREFIX,
    },
    prompts,
    arms: {},
  };

  const armSpec = [
    { name: '__baseline__', system: null },
    { name: '__terse__', system: TERSE_PREFIX },
    { name: SKILL, system: `${TERSE_PREFIX}\n\n${skillContent}` },
  ];

  for (const arm of armSpec) {
    console.log(`[arm] ${arm.name}${arm.system ? ` (system: ${arm.system.slice(0, 40).replace(/\n/g, ' ')}...)` : ' (no system prompt)'}`);
    snapshot.arms[arm.name] = [];
    for (let i = 0; i < prompts.length; i++) {
      const p = prompts[i];
      if (DRY_RUN) {
        snapshot.arms[arm.name].push(dryRunPlaceholder(p, arm.name));
        process.stdout.write('.');
      } else {
        try {
          const out = runClaude(p, arm.system);
          snapshot.arms[arm.name].push(out);
          process.stdout.write('.');
        } catch (e) {
          console.error(`\n[FAIL] arm=${arm.name} prompt=${i}: ${e.message}`);
          snapshot.arms[arm.name].push(`[ERROR] ${e.message}`);
        }
      }
    }
    process.stdout.write('\n');
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(snapshot, null, 2), 'utf8');
  console.log(`\n[out] ${OUT_PATH}`);
  console.log(`[summary] ${prompts.length} prompts × ${armSpec.length} arms = ${prompts.length * armSpec.length} responses`);
}

main();
