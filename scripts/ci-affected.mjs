#!/usr/bin/env node
/**
 * PR CI selection: run tests for the lowest-touched workspace packages and
 * everything that depends on them. Master / workflow_dispatch / shared-config
 * changes still run the full suite.
 *
 * Usage:
 *   node scripts/ci-affected.mjs
 *   node scripts/ci-affected.mjs --files packages/vm/src/runBlock.ts
 *
 * Env (GitHub Actions):
 *   EVENT_NAME, BASE_SHA, HEAD_SHA, GITHUB_OUTPUT
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = join(SCRIPT_DIR, '..')

/** Paths that can affect any package — force the full test matrix. */
export const FORCE_ALL_PREFIXES = ['.github/', 'config/', 'scripts/', '.githooks/']
export const FORCE_ALL_FILES = new Set([
  'package.json',
  'package-lock.json',
  'eslint.config.mjs',
  'biome.json',
  'tsconfig.json',
  'tsconfig.lint.json',
  'tsconfig.prod.cjs.json',
  'tsconfig.prod.esm.json',
  'lint-staged.config.js',
  'codecov.yml',
])

/** Fixture / submodule dirs that are not workspace packages but feed tests. */
export const EXTRA_PATH_PACKAGES = {
  'packages/execution-spec-tests': ['vm'],
  'packages/ethereum-tests': ['vm', 'block', 'tx', 'evm'],
}

/**
 * Skippable jobs in `.github/workflows/build.yml`.
 * A job runs if any listed package is in the affected set (changed ∪ dependents).
 * `browser` and `examples` run when any workspace package is affected.
 *
 * Always-on (not listed here): lint, typecheck, audit.
 */
export const SKIPPABLE_JOBS = {
  binarytree: ['binarytree'],
  block: ['block'],
  blockchain: ['blockchain'],
  browser: '*',
  client: ['client'],
  common: ['common'],
  devp2p: ['devp2p'],
  evm: ['evm'],
  examples: '*',
  mpt: ['mpt'],
  static: ['rlp', 'ethash', 'genesis', 'wallet'],
  statemanager: ['statemanager'],
  tx: ['tx'],
  util: ['util'],
  'vm-pr': ['vm'],
  noCompile: ['client'],
}

/** Jobs that collect coverage only when a listed package was directly changed. */
export const COVERAGE_JOBS = [
  'binarytree',
  'block',
  'blockchain',
  'common',
  'evm',
  'mpt',
  'static',
  'statemanager',
  'tx',
  'util',
  'vm-pr',
]

export function isIgnorablePath(file) {
  return file.replaceAll('\\', '/').endsWith('.md')
}

export function isForceAllPath(file) {
  const normalized = file.replaceAll('\\', '/').replace(/^\.\//, '')
  if (FORCE_ALL_FILES.has(normalized)) return true
  return FORCE_ALL_PREFIXES.some(
    (prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix),
  )
}

export function packageDirFromPath(file) {
  const normalized = file.replaceAll('\\', '/').replace(/^\.\//, '')
  const match = normalized.match(/^packages\/([^/]+)/)
  return match === null ? null : match[1]
}

export function extraPackagesFromPath(file) {
  const normalized = file.replaceAll('\\', '/').replace(/^\.\//, '')
  for (const [prefix, packages] of Object.entries(EXTRA_PATH_PACKAGES)) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return packages
    }
  }
  return []
}

export function npmNameToDir(name) {
  return name.startsWith('@ethereumjs/') ? name.slice('@ethereumjs/'.length) : null
}

function workspaceDirsFromDepMap(depMap) {
  if (depMap === undefined) return []
  return Object.keys(depMap)
    .map(npmNameToDir)
    .filter((dir) => dir !== null)
}

export function runtimeDepsFromPackageJson(pkgJson) {
  return [
    ...workspaceDirsFromDepMap(pkgJson.dependencies),
    ...workspaceDirsFromDepMap(pkgJson.peerDependencies),
  ]
}

export function devDepsFromPackageJson(pkgJson) {
  return workspaceDirsFromDepMap(pkgJson.devDependencies)
}

export function loadWorkspace(root = REPO_ROOT) {
  const packagesDir = join(root, 'packages')
  const packages = new Map()

  for (const dir of readdirSync(packagesDir)) {
    const pkgPath = join(packagesDir, dir, 'package.json')
    if (!existsSync(pkgPath)) continue
    const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8'))
    packages.set(dir, {
      dir,
      name: pkgJson.name,
      deps: runtimeDepsFromPackageJson(pkgJson),
      devDeps: devDepsFromPackageJson(pkgJson),
    })
  }

  return packages
}

/** dir -> packages that depend on it (reverse of `dependencies` / `peerDependencies`). */
export function buildRuntimeDependentsMap(packages) {
  return buildReverseMap(packages, (pkg) => pkg.deps)
}

/**
 * dir -> packages that list it in `devDependencies`.
 * Used only for the originally changed packages so test-helper cycles
 * (testdata ↔ block/util) do not pull the whole stack.
 */
export function buildDevConsumersMap(packages) {
  return buildReverseMap(packages, (pkg) => pkg.devDeps ?? [])
}

function buildReverseMap(packages, edges) {
  const reverse = new Map()
  for (const dir of packages.keys()) {
    reverse.set(dir, new Set())
  }
  for (const [dir, pkg] of packages) {
    for (const dep of edges(pkg)) {
      if (!reverse.has(dep)) reverse.set(dep, new Set())
      reverse.get(dep).add(dir)
    }
  }
  return reverse
}

export function expandDependents(changed, dependentsMap) {
  const affected = new Set(changed)
  const stack = [...changed]
  while (stack.length > 0) {
    const current = stack.pop()
    for (const dependent of dependentsMap.get(current) ?? []) {
      if (!affected.has(dependent)) {
        affected.add(dependent)
        stack.push(dependent)
      }
    }
  }
  return affected
}

export function changedPackagesFromFiles(files, workspaceDirs) {
  const changed = new Set()
  for (const file of files) {
    if (isIgnorablePath(file)) continue
    const dir = packageDirFromPath(file)
    if (dir !== null && workspaceDirs.has(dir)) {
      changed.add(dir)
    }
    for (const extra of extraPackagesFromPath(file)) {
      changed.add(extra)
    }
  }
  return changed
}

export function jobsFromAffected(affected) {
  const jobs = {}
  for (const [job, packages] of Object.entries(SKIPPABLE_JOBS)) {
    jobs[job] = packages === '*' ? affected.size > 0 : packages.some((pkg) => affected.has(pkg))
  }
  return jobs
}

export function allJobs(run) {
  const jobs = {}
  for (const job of Object.keys(SKIPPABLE_JOBS)) {
    jobs[job] = run
  }
  return jobs
}

/**
 * Coverage for a skippable job only when one of its packages was directly changed.
 * Dependents still run tests, but without coverage instrumentation.
 */
export function coverageFlags(changed, jobs) {
  const flags = {}
  for (const job of COVERAGE_JOBS) {
    const pkgs = SKIPPABLE_JOBS[job]
    flags[`${job}_coverage`] =
      jobs[job] === true && Array.isArray(pkgs) && pkgs.some((pkg) => changed.has(pkg))
  }
  return flags
}

/** Comma-separated npm workspace names for `--workspace=` filters. */
export function npmWorkspacesFromAffected(affected, packages) {
  return sorted(affected)
    .map((dir) => packages.get(dir)?.name)
    .filter((name) => name != null && name !== '')
    .join(',')
}

export function computeAffected({ files, forceAll, packages }) {
  if (forceAll) {
    return {
      forceAll: true,
      changed: new Set(packages.keys()),
      affected: new Set(packages.keys()),
      jobs: allJobs(true),
    }
  }

  const changed = changedPackagesFromFiles(files, packages)
  const runtimeDependents = buildRuntimeDependentsMap(packages)
  const devConsumers = buildDevConsumersMap(packages)
  const seeds = new Set(changed)
  for (const pkg of changed) {
    for (const consumer of devConsumers.get(pkg) ?? []) {
      seeds.add(consumer)
    }
  }
  const affected = expandDependents(seeds, runtimeDependents)
  return {
    forceAll: false,
    changed,
    affected,
    jobs: jobsFromAffected(affected),
  }
}

export function shouldForceAllEvent(eventName) {
  return eventName !== 'pull_request'
}

function parseFilesArg(argv) {
  const idx = argv.indexOf('--files')
  if (idx === -1) return null
  return argv.slice(idx + 1).filter((arg) => !arg.startsWith('--'))
}

function gitChangedFiles(baseSha, headSha) {
  const output = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=ACDMR', baseSha, headSha],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  )
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function writeOutputs(
  jobs,
  { githubOutput, stepSummary, forceAll, changed, affected, files, coverage, workspaces },
) {
  const lines = [
    ...Object.entries(jobs).map(([job, run]) => `${job}=${run ? 'true' : 'false'}`),
    ...Object.entries(coverage).map(([key, run]) => `${key}=${run ? 'true' : 'false'}`),
    `workspaces=${workspaces}`,
  ]
  const running = Object.entries(jobs)
    .filter(([, run]) => run)
    .map(([job]) => job)
  const coverageJobs = Object.entries(coverage)
    .filter(([, run]) => run)
    .map(([key]) => key.replace(/_coverage$/, ''))
  const summary = [
    `Force all: ${forceAll ? 'yes' : 'no'}`,
    `Changed files: ${files.length}`,
    `Changed packages: ${sorted(changed).join(', ') || '(none)'}`,
    `Affected packages: ${sorted(affected).join(', ') || '(none)'}`,
    `Jobs: ${running.join(', ') || '(none skippable)'}`,
    `Coverage: ${coverageJobs.join(', ') || '(none)'}`,
  ].join('\n')

  if (githubOutput !== undefined) {
    appendFileSync(githubOutput, `${lines.join('\n')}\n`)
  }
  if (stepSummary !== undefined) {
    appendFileSync(stepSummary, `## Affected CI jobs\n\n\`\`\`\n${summary}\n\`\`\`\n`)
  }

  console.log(summary)
  for (const line of lines) {
    console.log(line)
  }
}

function sorted(set) {
  return [...set].sort()
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const packages = loadWorkspace(REPO_ROOT)
  const filesArg = parseFilesArg(argv)
  let forceAll = filesArg === null && shouldForceAllEvent(env.EVENT_NAME ?? env.GITHUB_EVENT_NAME)
  let files = filesArg ?? []

  if (!forceAll && filesArg === null) {
    try {
      const baseSha = env.BASE_SHA
      const headSha = env.HEAD_SHA
      if (baseSha === undefined || baseSha === '' || headSha === undefined || headSha === '') {
        console.warn('Missing BASE_SHA/HEAD_SHA; forcing full suite')
        forceAll = true
      } else {
        files = gitChangedFiles(baseSha, headSha)
      }
    } catch (err) {
      console.warn(`git diff failed (${err.message}); forcing full suite`)
      forceAll = true
    }
  }

  if (!forceAll && files.some(isForceAllPath)) {
    forceAll = true
  }

  const result = computeAffected({ files, forceAll, packages })
  const coverage = coverageFlags(result.changed, result.jobs)
  const workspaces = npmWorkspacesFromAffected(result.affected, packages)
  writeOutputs(result.jobs, {
    githubOutput: env.GITHUB_OUTPUT,
    stepSummary: env.GITHUB_STEP_SUMMARY,
    forceAll: result.forceAll,
    changed: result.changed,
    affected: result.affected,
    files,
    coverage,
    workspaces,
  })
  return result
}

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  main()
}
