import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(SCRIPT_DIR, '..')
const MANIFEST_PATH = path.join(REPO_ROOT, 'config', 'legacy-ethereum-tests.json')

export function loadLegacyTestsManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
}

export function defaultLegacyTestsCacheRoot() {
  return (
    process.env.LEGACY_ETHEREUM_TESTS_CACHE ??
    path.join(os.homedir(), '.cache', 'ethereumjs', 'legacy-ethereum-tests')
  )
}

/** Root of the pinned ethereum/tests tree (TransactionTests + BlockchainTests when fetched). */
export function legacyTestsTreeRoot(cacheRoot = defaultLegacyTestsCacheRoot()) {
  const { commit } = loadLegacyTestsManifest()
  return path.join(cacheRoot, commit)
}

export function sliceCompleteMarker(treeRoot, sliceName) {
  return path.join(treeRoot, `.complete-${sliceName}`)
}

export function slicePathsReady(treeRoot, sliceName) {
  const manifest = loadLegacyTestsManifest()
  const slice = manifest.slices[sliceName]
  if (slice === undefined) {
    throw new Error(`Unknown legacy ethereum/tests slice "${sliceName}"`)
  }
  if (!fs.existsSync(sliceCompleteMarker(treeRoot, sliceName))) {
    return false
  }
  for (const rel of slice.sparsePaths) {
    if (!fs.existsSync(path.join(treeRoot, rel))) {
      return false
    }
  }
  return true
}

function runGit(cwd, args) {
  const result = spawnSync('git', args, { cwd, stdio: 'inherit', env: process.env })
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed with ${result.status}`)
  }
}

/**
 * Sparse-clone only the directories for `sliceName` into the shared cache tree.
 * Idempotent when the slice marker and paths exist.
 */
export function fetchLegacyTestsSlice(sliceName, options = {}) {
  const { force = false, cacheRoot = defaultLegacyTestsCacheRoot() } = options
  const manifest = loadLegacyTestsManifest()
  const slice = manifest.slices[sliceName]
  if (slice === undefined) {
    throw new Error(`Unknown slice "${sliceName}"`)
  }

  const treeRoot = path.join(cacheRoot, manifest.commit)
  if (
    force !== true &&
    slicePathsReady(treeRoot, sliceName)
  ) {
    return treeRoot
  }

  fs.mkdirSync(treeRoot, { recursive: true })

  const gitDir = path.join(treeRoot, '.git')
  if (!fs.existsSync(gitDir)) {
    runGit(treeRoot, ['init'])
  }
  const remoteCheck = spawnSync('git', ['remote', 'get-url', 'origin'], {
    cwd: treeRoot,
    encoding: 'utf8',
  })
  if (remoteCheck.status !== 0) {
    runGit(treeRoot, ['remote', 'add', 'origin', manifest.repo])
  } else {
    runGit(treeRoot, ['remote', 'set-url', 'origin', manifest.repo])
  }

  const sparsePaths = new Set(slice.sparsePaths)
  for (const other of Object.keys(manifest.slices)) {
    if (other === sliceName) continue
    if (slicePathsReady(treeRoot, other)) {
      for (const p of manifest.slices[other].sparsePaths) {
        sparsePaths.add(p)
      }
    }
  }

  runGit(treeRoot, ['fetch', '--depth', '1', 'origin', manifest.commit])
  runGit(treeRoot, ['sparse-checkout', 'init', '--cone'])
  runGit(treeRoot, ['sparse-checkout', 'set', ...sparsePaths])
  runGit(treeRoot, ['checkout', 'FETCH_HEAD'])

  fs.writeFileSync(sliceCompleteMarker(treeRoot, sliceName), `${new Date().toISOString()}\n`)
  return treeRoot
}

function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const positional = args.filter((a) => a !== '--force')
  const sliceName = positional[0]
  if (sliceName === undefined) {
    console.error('Usage: legacyEthereumTests.mjs [--force] <transaction|blockchain>')
    process.exit(1)
  }
  const root = fetchLegacyTestsSlice(sliceName, { force })
  console.log(`Legacy ethereum/tests slice "${sliceName}" ready at ${root}`)
}

const isMain =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (isMain) {
  main()
}
