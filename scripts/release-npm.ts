#!/usr/bin/env tsx
/**
 * Release script for EthereumJS monorepo packages
 *
 * Supports both regular releases and in-between releases (nightly, alpha, etc.)
 * Optionally publishes under a different npm scope (e.g. for fork releases).
 *
 * Usage:
 *   tsx scripts/release-npm.ts [--bump-version=<version>] [--publish=<tag>] [--scope=<scope>]
 *
 * Examples:
 *   # Bump versions only (no publish)
 *   tsx scripts/release-npm.ts --bump-version=10.1.0
 *
 *   # Bump versions and publish
 *   tsx scripts/release-npm.ts --bump-version=10.1.1-nightly.1 --publish=nightly
 *
 *   # Publish current versions (no bump)
 *   tsx scripts/release-npm.ts --publish=latest
 *
 *   # Fork release under a different npm scope
 *   tsx scripts/release-npm.ts --scope=feelyourprotocol --bump-version=8141.0.0 --publish=latest
 *
 *   # Publish with 2FA one-time password
 *   tsx scripts/release-npm.ts --publish=latest --otp=123456
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const DEFAULT_SCOPE = 'ethereumjs'

// Active packages from README.md (version + dependencies updated, published)
const ACTIVE_PACKAGES = [
  'binarytree',
  'block',
  'blockchain',
  'common',
  'evm',
  'genesis',
  'mpt',
  'rlp',
  'statemanager',
  'tx',
  'util',
  'vm',
]

// Deprecated packages + testdata (only dependencies updated, not published)
// These packages keep their own version but need @ethereumjs/* deps updated
const DEPS_ONLY_PACKAGES = [
  'client',
  'devp2p',
  'ethash',
  'wallet',
  'testdata',
]

interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: unknown
}

interface PackageInfo {
  name: string
  path: string
  oldVersion: string
  packageJson: PackageJson
}

interface ParsedArgs {
  version?: string
  tag?: string
  scope: string
  otp?: string
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)

  // Extract named arguments
  const versionArg = args.find((arg) => arg.startsWith('--bump-version='))
  const publishArg = args.find((arg) => arg.startsWith('--publish='))
  const scopeArg = args.find((arg) => arg.startsWith('--scope='))
  const otpArg = args.find((arg) => arg.startsWith('--otp='))

  const version = versionArg?.split('=')[1]
  const tag = publishArg?.split('=')[1]
  const scope = scopeArg?.split('=')[1] ?? DEFAULT_SCOPE
  const otp = otpArg?.split('=')[1]

  // Validate: at least one action must be specified
  if (!version && !tag) {
    console.error('Usage: tsx scripts/release-npm.ts [--bump-version=<version>] [--publish=<tag>] [--scope=<scope>] [--otp=<code>]')
    console.error('')
    console.error('Examples:')
    console.error('  tsx scripts/release-npm.ts --bump-version=10.1.0')
    console.error('  tsx scripts/release-npm.ts --bump-version=10.1.1-nightly.1 --publish=nightly')
    console.error('  tsx scripts/release-npm.ts --publish=latest')
    console.error('  tsx scripts/release-npm.ts --scope=feelyourprotocol --bump-version=8141.0.0 --publish=latest')
    console.error('  tsx scripts/release-npm.ts --publish=latest --otp=123456')
    process.exit(1)
  }

  return { version, tag, scope, otp }
}

function readPackageJson(packagePath: string): PackageJson {
  const filePath = join(packagePath, 'package.json')
  const content = readFileSync(filePath, 'utf-8')
  return JSON.parse(content) as PackageJson
}

function writePackageJson(packagePath: string, packageJson: PackageJson): void {
  const filePath = join(packagePath, 'package.json')
  writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')
}

function updateDependencies(
  deps: Record<string, string> | undefined,
  newVersion: string,
  targetScope: string
): Record<string, string> | undefined {
  if (!deps) return undefined

  const updated: Record<string, string> = {}
  for (const [depName, depVersion] of Object.entries(deps)) {
    if (depName.startsWith(`@${DEFAULT_SCOPE}/`)) {
      const packageName = depName.replace(`@${DEFAULT_SCOPE}/`, '')
      if (!ACTIVE_PACKAGES.includes(packageName)) {
        updated[depName] = depVersion
        continue
      }

      const prefixMatch = depVersion.match(/^([\^~])?/)
      const prefix = prefixMatch?.[1] || ''
      const newDepName = `@${targetScope}/${packageName}`
      updated[newDepName] = prefix ? `${prefix}${newVersion}` : newVersion
    } else {
      updated[depName] = depVersion
    }
  }
  return updated
}

function updatePackages(
  packages: PackageInfo[],
  newVersion: string,
  targetScope: string,
  updateVersion: boolean = true
): void {
  const isFork = targetScope !== DEFAULT_SCOPE
  const mode = updateVersion ? 'version + deps' : 'deps only'
  console.log(`\n📦 Updating packages (${mode}) to ${newVersion}...\n`)

  for (const pkg of packages) {
    if (updateVersion) {
      console.log(`  Updating ${pkg.name}...`)
      pkg.packageJson.version = newVersion
    } else {
      console.log(`  Updating deps in ${pkg.name} (version stays at ${pkg.oldVersion})...`)
    }

    if (isFork && updateVersion) {
      pkg.packageJson.name = pkg.packageJson.name.replace(
        `@${DEFAULT_SCOPE}/`,
        `@${targetScope}/`
      )
    }

    if (pkg.packageJson.dependencies) {
      pkg.packageJson.dependencies =
        updateDependencies(pkg.packageJson.dependencies, newVersion, targetScope) ||
        pkg.packageJson.dependencies
    }

    if (pkg.packageJson.devDependencies) {
      pkg.packageJson.devDependencies =
        updateDependencies(pkg.packageJson.devDependencies, newVersion, targetScope) ||
        pkg.packageJson.devDependencies
    }

    writePackageJson(pkg.path, pkg.packageJson)
  }

  console.log(`\n✅ All packages updated (${mode})\n`)
}

/**
 * Rewrites all `@ethereumjs/` references to `@<targetScope>/` across source,
 * compiled output, and type declarations for each active package.
 */
function rewriteImports(packages: PackageInfo[], targetScope: string): void {
  console.log(`\n🔄 Rewriting imports: @${DEFAULT_SCOPE}/ → @${targetScope}/...\n`)

  const dirs = ['src', 'dist/esm', 'dist/cjs']
  const extensions = ['.ts', '.js', '.d.ts', '.d.ts.map', '.js.map']

  let totalFiles = 0
  for (const pkg of packages) {
    let pkgCount = 0

    for (const dir of dirs) {
      const targetDir = join(pkg.path, dir)
      if (!existsSync(targetDir)) continue

      let files: string[]
      try {
        files = readdirSync(targetDir, { recursive: true, encoding: 'utf-8' })
          .filter((f) => extensions.some((ext) => f.endsWith(ext)))
      } catch {
        continue
      }

      for (const file of files) {
        const filePath = join(targetDir, file)
        const content = readFileSync(filePath, 'utf-8')
        const rewritten = content.split(`@${DEFAULT_SCOPE}/`).join(`@${targetScope}/`)
        if (rewritten !== content) {
          writeFileSync(filePath, rewritten, 'utf-8')
          pkgCount++
        }
      }
    }

    if (pkgCount > 0) {
      console.log(`  ${pkg.name}: ${pkgCount} file(s) rewritten`)
      totalFiles += pkgCount
    }
  }

  console.log(`\n✅ Imports rewritten (${totalFiles} files total)\n`)
}

/**
 * Builds all packages under the current (original) scope so that TypeScript
 * can resolve all monorepo-internal imports. Must run BEFORE any rewriting.
 *
 * Clears dist/ first to remove stale tsbuildinfo from previous (possibly
 * partially-rewritten) runs that would cause incremental compilation failures.
 */
function buildPackages(packages: PackageInfo[]): void {
  console.log('\n🧹 Cleaning dist/ directories...')
  for (const pkg of packages) {
    const distDir = join(pkg.path, 'dist')
    if (existsSync(distDir)) {
      execSync(`rm -rf ${distDir}`)
    }
  }

  console.log('\n🔨 Building all packages (pre-rewrite)...\n')
  for (const pkg of packages) {
    console.log(`  Building ${pkg.name}...`)
    try {
      execSync('npm run build', { cwd: pkg.path, stdio: 'pipe' })
    } catch (error: any) {
      console.error(`  ❌ Build failed for ${pkg.name}`)
      if (error.stdout) console.error(error.stdout.toString())
      throw error
    }
  }

  console.log('\n✅ All packages built\n')
}

function publishPackages(packages: PackageInfo[], tag: string, isFork: boolean, otp?: string): void {
  const ignoreScripts = isFork ? ' --ignore-scripts' : ''
  const otpFlag = otp ? ` --otp=${otp}` : ''
  console.log(`\n🚀 Publishing packages with tag "${tag}"${isFork ? ' (--ignore-scripts)' : ''}...\n`)

  for (const pkg of packages) {
    const displayName = pkg.packageJson.name
    console.log(`  Publishing ${displayName}...`)
    
    try {    
      execSync(`npm publish --tag=${tag} --access=public${ignoreScripts}${otpFlag}`, {
        cwd: pkg.path,
        stdio: 'inherit',
      })
      
      console.log(`  ✅ ${displayName} published successfully\n`)
    } catch (error) {
      console.error(`  ❌ Failed to publish ${displayName}`)
      throw error
    }
  }

  console.log('\n✅ All packages published\n')
}

async function main(): Promise<void> {
  const { version, tag, scope, otp } = parseArgs()
  const isFork = scope !== DEFAULT_SCOPE

  console.log('\n' + '='.repeat(60))
  console.log('EthereumJS Release Script')
  console.log('='.repeat(60))
  console.log(`Bump version: ${version ?? 'no'}`)
  console.log(`Publish: ${tag ? `yes (tag: ${tag})` : 'no'}`)
  if (isFork) {
    console.log(`Scope: @${scope} (fork release)`)
  }
  console.log('='.repeat(60) + '\n')

  const rootPath = process.cwd()
  const packagesPath = join(rootPath, 'packages')

  // Read all package.json files for active packages
  const packages: PackageInfo[] = []
  for (const packageName of ACTIVE_PACKAGES) {
    const packagePath = join(packagesPath, packageName)
    const packageJson = readPackageJson(packagePath)
    packages.push({
      name: packageName,
      path: packagePath,
      oldVersion: packageJson.version,
      packageJson,
    })
  }

  // Read package.json files for deps-only packages (deprecated + testdata)
  // Skipped entirely for fork releases (not published, rewriting would break local dev)
  const depsOnlyPackages: PackageInfo[] = []
  if (!isFork) {
    for (const packageName of DEPS_ONLY_PACKAGES) {
      const packagePath = join(packagesPath, packageName)
      const packageJson = readPackageJson(packagePath)
      depsOnlyPackages.push({
        name: packageName,
        path: packagePath,
        oldVersion: packageJson.version,
        packageJson,
      })
    }
  }

  // Display current versions
  console.log('Active packages:')
  for (const pkg of packages) {
    console.log(`  ${pkg.name}: ${pkg.oldVersion}`)
  }
  if (!isFork) {
    console.log('\nDeps-only packages (deprecated + testdata):')
    for (const pkg of depsOnlyPackages) {
      console.log(`  ${pkg.name}: ${pkg.oldVersion}`)
    }
  }

  try {
    // Step 0: For fork releases, restore all package files to their committed
    // state. A previous failed run may have left rewritten source files and
    // modified package.json files that would break the build.
    if (isFork) {
      console.log('\n🔄 Restoring packages/ to committed state...')
      try {
        execSync('git checkout -- packages/', { cwd: rootPath, stdio: 'pipe' })
        for (const pkg of packages) {
          pkg.packageJson = readPackageJson(pkg.path)
          pkg.oldVersion = pkg.packageJson.version
        }
        console.log('  ✅ Restored\n')
      } catch {
        console.log('  ⚠️  git checkout failed (not a git repo?), continuing...\n')
      }
    }

    // Step 1: For fork releases, build all packages FIRST under the original
    // scope so TypeScript can resolve monorepo-internal dependencies.
    // After this, dist/ contains compiled output with @ethereumjs/ imports.
    if (isFork && tag) {
      buildPackages(packages)
    }

    // Step 2: Bump versions (if --bump-version is set)
    if (version) {
      updatePackages(packages, version, scope, true)
      if (!isFork) {
        updatePackages(depsOnlyPackages, version, scope, false)
      }
    } else {
      console.log('\n📋 Skipping version bump (use --bump-version to update versions)\n')
    }

    // Step 3: Rewrite imports in src/ AND dist/ (fork releases only)
    if (isFork) {
      rewriteImports(packages, scope)
    }

    // Step 4: Publish packages (if --publish is set)
    // Fork releases use --ignore-scripts to skip prepublishOnly (which would
    // clean + rebuild and fail since TS can't resolve the rewritten scope).
    if (tag) {
      publishPackages(packages, tag, isFork, otp)
    } else {
      console.log('\n📋 Skipping publish (use --publish=<tag> to publish packages)\n')
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Release completed successfully!')
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('\n' + '='.repeat(60))
    console.error('❌ Release failed!')
    console.error('='.repeat(60))
    console.error(error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

