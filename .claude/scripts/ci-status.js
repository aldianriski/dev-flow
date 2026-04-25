// .claude/scripts/ci-status.js
// PostToolUse hook: polls CI pipeline status after git push.
// Requires: gh CLI (GitHub Actions) or glab CLI (GitLab CI), installed + authenticated.
//
// CI_PROVIDER env var: 'github' | 'gitlab' | 'skip' (default: 'skip')
// Exit 0 = green / skip / timeout. Exit 1 = CI failed (blocks Session Close).
'use strict';

const { execSync } = require('child_process');

const CI_PROVIDER = process.env.CI_PROVIDER || 'skip';
const MAX_POLLS   = 20;
const POLL_DELAY  = 30; // seconds

if (CI_PROVIDER === 'skip') {
  console.log('CI_PROVIDER=skip — CI status check disabled.');
  process.exit(0);
}

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function pollGitHub() {
  for (let i = 0; i < MAX_POLLS; i++) {
    try {
      const raw = execSync('gh run list --limit 1 --json status,conclusion,name,url', { encoding: 'utf8' });
      const [run] = JSON.parse(raw);
      if (!run) { await sleep(POLL_DELAY); continue; }

      if (run.status === 'completed') {
        if (run.conclusion === 'success') {
          console.log(`\n✓ CI PASSED: ${run.name}\n  ${run.url}`);
          return 0;
        }
        console.log(`\n❌ CI FAILED (${run.conclusion}): ${run.name}\n  ${run.url}`);
        console.log('BLOCK: Session Close blocked. Fix CI before proceeding.');
        return 1;
      }

      process.stdout.write(`  CI ${run.status}... (poll ${i + 1}/${MAX_POLLS})\r`);
      await sleep(POLL_DELAY);
    } catch (err) {
      console.log(`\nWARN: gh CLI error on poll ${i + 1}: ${err.message}. Retrying...`);
      await sleep(POLL_DELAY);
    }
  }
  console.log('\nWARN: CI poll timed out. Verify manually before Session Close.');
  return 0;
}

async function pollGitLab() {
  for (let i = 0; i < MAX_POLLS; i++) {
    try {
      const pipeline = JSON.parse(execSync('glab ci status --output json', { encoding: 'utf8' }));
      if (pipeline.status === 'success') {
        console.log(`\n✓ CI PASSED: ${pipeline.web_url}`);
        return 0;
      }
      if (['failed', 'canceled'].includes(pipeline.status)) {
        console.log(`\n❌ CI FAILED (${pipeline.status}): ${pipeline.web_url}`);
        console.log('BLOCK: Session Close blocked.');
        return 1;
      }
      process.stdout.write(`  CI ${pipeline.status}... (poll ${i + 1}/${MAX_POLLS})\r`);
      await sleep(POLL_DELAY);
    } catch (err) {
      console.log(`\nWARN: glab CLI error on poll ${i + 1}: ${err.message}. Retrying...`);
      await sleep(POLL_DELAY);
    }
  }
  console.log('\nWARN: CI poll timed out. Verify manually before Session Close.');
  return 0;
}

const poll = CI_PROVIDER === 'gitlab' ? pollGitLab : pollGitHub;
poll()
  .then(code => process.exit(code))
  .catch(err => {
    console.log(`WARN: CI check failed to run: ${err.message}. Verify manually.`);
    process.exit(0);
  });
