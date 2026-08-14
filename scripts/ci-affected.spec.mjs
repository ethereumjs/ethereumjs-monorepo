import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import {
  COVERAGE_JOBS,
  SKIPPABLE_JOBS,
  buildRuntimeDependentsMap,
  changedPackagesFromFiles,
  computeAffected,
  coverageFlags,
  expandDependents,
  extraPackagesFromPath,
  isForceAllPath,
  isIgnorablePath,
  jobsFromAffected,
  loadWorkspace,
  npmWorkspacesFromAffected,
  packageDirFromPath,
  shouldForceAllEvent,
  REPO_ROOT,
} from './ci-affected.mjs'

function workspaceFromGraph(graph, devGraph = {}) {
  const packages = new Map()
  for (const [dir, deps] of Object.entries(graph)) {
    packages.set(dir, {
      dir,
      name: `@ethereumjs/${dir}`,
      deps,
      devDeps: devGraph[dir] ?? [],
    })
  }
  return packages
}

const STACK = workspaceFromGraph({
  rlp: [],
  util: ['rlp'],
  mpt: ['rlp', 'util'],
  vm: ['mpt', 'util'],
  client: ['vm', 'mpt', 'util'],
  wallet: ['util'],
})

describe('path classification', () => {
  it('forces all on shared CI / config / lockfile paths', () => {
    assert.equal(isForceAllPath('.github/workflows/build.yml'), true)
    assert.equal(isForceAllPath('config/vitest.config.mts'), true)
    assert.equal(isForceAllPath('scripts/ci-affected.mjs'), true)
    assert.equal(isForceAllPath('package-lock.json'), true)
    assert.equal(isForceAllPath('eslint.config.mjs'), true)
    assert.equal(isForceAllPath('packages/vm/src/runBlock.ts'), false)
  })

  it('ignores markdown-only changes', () => {
    assert.equal(isIgnorablePath('packages/mpt/README.md'), true)
    assert.equal(isIgnorablePath('DEVELOPER.md'), true)
    assert.equal(isIgnorablePath('packages/vm/src/runBlock.ts'), false)
  })

  it('maps package and fixture paths', () => {
    assert.equal(packageDirFromPath('packages/vm/src/runBlock.ts'), 'vm')
    assert.equal(packageDirFromPath('README.md'), null)
    assert.deepEqual(extraPackagesFromPath('packages/execution-spec-tests/dev/foo.json'), ['vm'])
    assert.deepEqual(extraPackagesFromPath('packages/ethereum-tests'), [
      'vm',
      'block',
      'tx',
      'evm',
    ])
  })
})

describe('dependents expansion', () => {
  it('runs lowest-touched package tests and everything above', () => {
    const dependents = buildRuntimeDependentsMap(STACK)
    const fromVm = expandDependents(new Set(['vm']), dependents)
    assert.deepEqual([...fromVm].sort(), ['client', 'vm'])

    const fromMpt = expandDependents(new Set(['mpt']), dependents)
    assert.deepEqual([...fromMpt].sort(), ['client', 'mpt', 'vm'])

    const fromUtil = expandDependents(new Set(['util']), dependents)
    assert.deepEqual([...fromUtil].sort(), ['client', 'mpt', 'util', 'vm', 'wallet'])
  })

  it('maps affected packages onto skippable CI jobs', () => {
    const vmJobs = jobsFromAffected(new Set(['vm', 'client']))
    assert.equal(vmJobs['vm-pr'], true)
    assert.equal(vmJobs.client, true)
    assert.equal(vmJobs.noCompile, true)
    assert.equal(vmJobs.browser, true)
    assert.equal(vmJobs.mpt, false)
    assert.equal(vmJobs.util, false)
    assert.equal(vmJobs.static, false)
    assert.equal(vmJobs.examples, true)
  })
})

describe('computeAffected', () => {
  it('skips lower-stack tests when only VM source changes', () => {
    const result = computeAffected({
      files: ['packages/vm/src/runBlock.ts'],
      forceAll: false,
      packages: STACK,
    })
    assert.equal(result.jobs['vm-pr'], true)
    assert.equal(result.jobs.client, true)
    assert.equal(result.jobs.mpt, false)
    assert.equal(result.jobs.util, false)
    assert.equal(result.jobs.wallet, undefined)
    assert.equal(result.jobs.static, false)
  })

  it('runs MPT and dependents when MPT source changes', () => {
    const result = computeAffected({
      files: ['packages/mpt/src/trie.ts'],
      forceAll: false,
      packages: STACK,
    })
    assert.equal(result.jobs.mpt, true)
    assert.equal(result.jobs['vm-pr'], true)
    assert.equal(result.jobs.client, true)
    assert.equal(result.jobs.util, false)
    assert.equal(result.jobs.static, false)
  })

  it('does not treat README-only package edits as a code change', () => {
    const result = computeAffected({
      files: ['packages/mpt/README.md', 'DEVELOPER.md'],
      forceAll: false,
      packages: STACK,
    })
    assert.equal(result.jobs.mpt, false)
    assert.equal(result.jobs['vm-pr'], false)
    assert.equal(result.jobs.browser, false)
    assert.equal(result.jobs.examples, false)
  })

  it('treats EST fixture changes as a VM change', () => {
    const result = computeAffected({
      files: ['packages/execution-spec-tests/dev/blockchain_tests/foo.json'],
      forceAll: false,
      packages: STACK,
    })
    assert.equal(result.jobs['vm-pr'], true)
    assert.equal(result.jobs.client, true)
    assert.equal(result.jobs.mpt, false)
  })

  it('forces every skippable job when requested', () => {
    const result = computeAffected({
      files: ['packages/vm/src/runBlock.ts'],
      forceAll: true,
      packages: STACK,
    })
    for (const job of Object.keys(SKIPPABLE_JOBS)) {
      assert.equal(result.jobs[job], true, job)
    }
  })

  it('force-all is off for pull_request and on otherwise', () => {
    assert.equal(shouldForceAllEvent('pull_request'), false)
    assert.equal(shouldForceAllEvent('push'), true)
    assert.equal(shouldForceAllEvent('workflow_dispatch'), true)
  })
})

describe('real workspace graph', () => {
  it('VM-only source does not mark MPT affected; MPT-only does mark VM', () => {
    const packages = loadWorkspace()
    assert.ok(packages.has('vm'))
    assert.ok(packages.has('mpt'))

    const vmOnly = computeAffected({
      files: ['packages/vm/src/runBlock.ts'],
      forceAll: false,
      packages,
    })
    assert.equal(vmOnly.affected.has('vm'), true)
    assert.equal(vmOnly.affected.has('client'), true)
    assert.equal(vmOnly.affected.has('mpt'), false)
    assert.equal(vmOnly.jobs.mpt, false)
    assert.equal(vmOnly.jobs['vm-pr'], true)

    const mptOnly = computeAffected({
      files: ['packages/mpt/src/index.ts'],
      forceAll: false,
      packages,
    })
    assert.equal(mptOnly.affected.has('mpt'), true)
    assert.equal(mptOnly.affected.has('vm'), true)
    assert.equal(mptOnly.affected.has('statemanager'), true)
    assert.equal(mptOnly.jobs.mpt, true)
    assert.equal(mptOnly.jobs['vm-pr'], true)
    assert.equal(mptOnly.jobs.util, false)
    assert.equal(mptOnly.affected.has('util'), false)
  })

  it('collects coverage only for directly changed packages', () => {
    const packages = loadWorkspace()
    const vmOnly = computeAffected({
      files: ['packages/vm/src/runBlock.ts'],
      forceAll: false,
      packages,
    })
    const vmCoverage = coverageFlags(vmOnly.changed, vmOnly.jobs)
    assert.equal(vmCoverage['vm-pr_coverage'], true)
    assert.equal(vmCoverage.mpt_coverage, false)
    assert.equal(vmCoverage.client_coverage, undefined)

    const mptOnly = computeAffected({
      files: ['packages/mpt/src/index.ts'],
      forceAll: false,
      packages,
    })
    const mptCoverage = coverageFlags(mptOnly.changed, mptOnly.jobs)
    assert.equal(mptCoverage.mpt_coverage, true)
    assert.equal(mptCoverage['vm-pr_coverage'], false)
    assert.equal(mptOnly.jobs['vm-pr'], true)

    const workspaces = npmWorkspacesFromAffected(vmOnly.affected, packages)
    assert.equal(workspaces.includes('@ethereumjs/vm'), true)
    assert.equal(workspaces.includes('@ethereumjs/client'), true)
    assert.equal(workspaces.includes('@ethereumjs/mpt'), false)
  })

  it('force-all enables coverage for every coverage job', () => {
    const packages = loadWorkspace()
    const result = computeAffected({
      files: ['packages/vm/src/runBlock.ts'],
      forceAll: true,
      packages,
    })
    const flags = coverageFlags(result.changed, result.jobs)
    for (const job of COVERAGE_JOBS) {
      assert.equal(flags[`${job}_coverage`], true, job)
    }
  })

  it('testdata changes run test consumers without a block→util cycle', () => {
    const packages = loadWorkspace()
    const testdataOnly = computeAffected({
      files: ['packages/testdata/src/index.ts'],
      forceAll: false,
      packages,
    })
    assert.equal(testdataOnly.jobs.util, true)
    assert.equal(testdataOnly.jobs.block, true)
    assert.equal(testdataOnly.jobs['vm-pr'], true)

    const blockOnly = computeAffected({
      files: ['packages/block/src/index.ts'],
      forceAll: false,
      packages,
    })
    assert.equal(blockOnly.jobs['vm-pr'], true)
    assert.equal(blockOnly.jobs.util, false)
  })

  it('changedPackagesFromFiles ignores unknown package dirs without package.json', () => {
    const packages = loadWorkspace()
    const changed = changedPackagesFromFiles(
      ['packages/ethereum-tests/src/foo.json', 'packages/vm/src/runBlock.ts'],
      packages,
    )
    assert.equal(changed.has('ethereum-tests'), false)
    assert.equal(changed.has('vm'), true)
    assert.equal(changed.has('block'), true)
  })
})

describe('loadWorkspace', () => {
  it('skips directories without package.json', () => {
    const root = mkdtempSync(join(tmpdir(), 'ci-affected-'))
    mkdirSync(join(root, 'packages', 'vm'), { recursive: true })
    mkdirSync(join(root, 'packages', 'ethereum-tests'), { recursive: true })
    writeFileSync(
      join(root, 'packages', 'vm', 'package.json'),
      JSON.stringify({
        name: '@ethereumjs/vm',
        dependencies: { '@ethereumjs/mpt': '1.0.0' },
      }),
    )
    const packages = loadWorkspace(root)
    assert.deepEqual([...packages.keys()], ['vm'])
    assert.deepEqual(packages.get('vm').deps, ['mpt'])
    assert.deepEqual(packages.get('vm').devDeps, [])
  })
})

describe('CI workflow sync', () => {
  it('every skippable job is gated in build.yml', () => {
    const yml = readFileSync(join(REPO_ROOT, '.github/workflows/build.yml'), 'utf8')
    for (const job of Object.keys(SKIPPABLE_JOBS)) {
      const dotted = `needs.detect.outputs.${job}`
      const bracket = `needs.detect.outputs['${job}']`
      assert.ok(
        yml.includes(dotted) || yml.includes(bracket),
        `build.yml should gate job "${job}" on detect output`,
      )
    }
    for (const job of COVERAGE_JOBS) {
      assert.ok(
        yml.includes(`${job}_coverage`) || yml.includes(`'${job}_coverage'`),
        `build.yml should pass coverage flag for "${job}"`,
      )
    }
    assert.ok(yml.includes('workspaces:'), 'build.yml should pass affected workspaces')
  })
})
