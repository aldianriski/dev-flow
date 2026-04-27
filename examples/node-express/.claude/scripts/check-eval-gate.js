#!/usr/bin/env node
// Exits 0 when no SKILL.md changed, or all changed skills have paired eval artifacts in PR diff.
// Exits 1 when any changed skill is missing *-after.json or a matching evals/runs/<task-id>.md.
// Set CHANGED_FILES env var (newline-separated) to override git diff (used in tests).

'use strict';

const { execSync } = require('child_process');

const SKILL_PATTERN = /^\.claude\/skills\/([^/]+)\/SKILL\.md$/;

function afterPattern(skill) {
  return new RegExp(`^evals/snapshots/${skill}/(.+)-after\\.json$`);
}

function getChangedFiles() {
  if (process.env.CHANGED_FILES !== undefined) {
    return process.env.CHANGED_FILES.split('\n').filter(Boolean);
  }
  const baseRef = process.env.GITHUB_BASE_REF;
  if (!baseRef) {
    return null; // not a PR event — caller handles skip
  }
  return execSync(`git diff origin/${baseRef}...HEAD --name-only`, { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
}

function main() {
  const changedFiles = getChangedFiles();

  if (changedFiles === null) {
    console.log('Eval gate: skipped (GITHUB_BASE_REF not set — not a pull_request event)');
    process.exit(0);
  }

  const changedSkills = changedFiles
    .map(f => { const m = f.match(SKILL_PATTERN); return m ? m[1] : null; })
    .filter(Boolean);

  if (changedSkills.length === 0) {
    console.log('Eval gate: no SKILL.md changes — skipped');
    process.exit(0);
  }

  let failed = false;

  for (const skill of changedSkills) {
    const pat = afterPattern(skill);

    // Collect task-ids from after-snapshots for this skill in the diff
    const taskIds = changedFiles
      .map(f => { const m = f.match(pat); return m ? m[1] : null; })
      .filter(Boolean);

    if (taskIds.length === 0) {
      console.error(`FAIL [${skill}]: missing evals/snapshots/${skill}/<task-id>-after.json in PR diff`);
      failed = true;
      continue;
    }

    // Each task-id must have a matching evals/runs/<task-id>.md
    for (const taskId of taskIds) {
      const runFile = `evals/runs/${taskId}.md`;
      if (!changedFiles.includes(runFile)) {
        console.error(`FAIL [${skill}]: missing ${runFile} for task-id "${taskId}"`);
        failed = true;
      }
    }
  }

  if (failed) {
    console.error('\nSee CONTRIBUTING.md §Eval gate and docs/blueprint/05-skills.md §Skill Change Protocol.');
    process.exit(1);
  }

  console.log(`Eval gate: ${changedSkills.length} skill change(s) — all have paired artifacts.`);
}

main();
