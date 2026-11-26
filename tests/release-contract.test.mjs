import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8')
const deploy = readFileSync(new URL('../scripts/deploy-production.sh', import.meta.url), 'utf8')

test('CI verifies dev and main while releases and remote checkouts use only main', () => {
  for (const trigger of ['push', 'pull_request']) {
    const block = workflow.split(`  ${trigger}:`)[1]?.split(/\n  [a-z_]+:/)[0] ?? ''
    assert.match(block, /- dev\b/)
    assert.match(block, /- main\b/)
  }
  assert.doesNotMatch(workflow, /\bmaster\b/)
  assert.match(workflow, /github\.ref == 'refs\/heads\/main'/)
  assert.match(workflow, /git fetch origin main --prune/)
  assert.match(workflow, /git checkout main/)
  assert.match(workflow, /git pull --ff-only origin main/)
  assert.match(workflow, /inputs\.update_snapshots != true/)
  assert.doesNotMatch(workflow, /git checkout[^\n]*--force|StrictHostKeyChecking=no|accept-new/)
})

test('SSH uses an isolated verified key file rather than trusting the whole scan', () => {
  assert.match(workflow, /scripts\/pin-host-key\.sh/)
  assert.match(workflow, /StrictHostKeyChecking=yes/)
  assert.match(workflow, /UserKnownHostsFile=/)
  assert.match(workflow, /GlobalKnownHostsFile=\/dev\/null/)
  assert.match(workflow, /HostKeyAlgorithms=ssh-ed25519/)
  assert.doesNotMatch(workflow, /cat \/tmp\/vps_known_hosts/)
})

test('successful deployment does not recursively remove unrelated legacy folders', () => {
  assert.doesNotMatch(deploy, /rm -rf "\$\{ROOT_DIR\}\/dist"|rm -rf[^\n]*\$\{ROOT_DIR\}\/config/)
  assert.doesNotMatch(deploy, /rm -f "\$\{ROOT_DIR\}\/docker-compose\.yml"/)
})
