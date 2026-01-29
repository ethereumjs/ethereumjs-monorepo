#!/usr/bin/env tsx
/**
 * Release script for EthereumJS monorepo packages
 *
 * Supports both regular releases and in-between releases (nightly, alpha, etc.)
 *
 * Usage:
 *   tsx scripts/release.ts [--bump-version=<version>] [--publish=<tag>]
 *
 * Examples:
 *   # Bump versions only (no publish)
 *   tsx scripts/release.ts --bump-version=10.1.0
 *
 *   # Bump versions and publish
 *   tsx scripts/release.ts --bump-version=10.1.1-nightly.1 --publish=nightly
 *
 *   # Publish current versions (no bump)
 *   tsx scripts/release.ts --publish=latest
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

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
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)

  // Extract named arguments
  const versionArg = args.find((arg) => arg.startsWith('--bump-version='))
  const publishArg = args.find((arg) => arg.startsWith('--publish='))

  const version = versionArg?.split('=')[1]
  const tag = publishArg?.split('=')[1]

  // Validate: at least one action must be specified
  if (!version && !tag) {
    console.error('Usage: tsx scripts/release.ts [--bump-version=<version>] [--publish=<tag>]')
    console.error('')
    console.error('Examples:')
    console.error('  tsx scripts/release.ts --bump-version=10.1.0')
    console.error('  tsx scripts/release.ts --bump-version=10.1.1-nightly.1 --publish=nightly')
    console.error('  tsx scripts/release.ts --publish=latest')
    process.exit(1)
  }

  return { version, tag }
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

function updateDependencyVersion(
  deps: Record<string, string> | undefined,
  newVersion: string
): Record<string, string> | undefined {
  if (!deps) return undefined

  const updated: Record<string, string> = { ...deps }
  for (const [depName, depVersion] of Object.entries(updated)) {
    if (depName.startsWith('@ethereumjs/')) {
      // Only update references to active packages
      const packageName = depName.replace('@ethereumjs/', '')
      if (!ACTIVE_PACKAGES.includes(packageName)) continue

      // Preserve the version prefix (^, ~, etc.) if present
      const prefixMatch = depVersion.match(/^([\^~])?/)
      const prefix = prefixMatch?.[1] || ''
      updated[depName] = prefix ? `${prefix}${newVersion}` : newVersion
    }
  }
  return updated
}

function updatePackages(
  packages: PackageInfo[],
  newVersion: string,
  updateVersion: boolean = true
): void {
  const mode = updateVersion ? 'version + deps' : 'deps only'
  console.log(`\n📦 Updating packages (${mode}) to ${newVersion}...\n`)

  for (const pkg of packages) {
    if (updateVersion) {
      console.log(`  Updating ${pkg.name}...`)
      pkg.packageJson.version = newVersion
    } else {
      console.log(`  Updating deps in ${pkg.name} (version stays at ${pkg.oldVersion})...`)
    }

    // Update dependencies
    if (pkg.packageJson.dependencies) {
      pkg.packageJson.dependencies =
        updateDependencyVersion(pkg.packageJson.dependencies, newVersion) ||
        pkg.packageJson.dependencies
    }

    // Update devDependencies
    if (pkg.packageJson.devDependencies) {
      pkg.packageJson.devDependencies =
        updateDependencyVersion(pkg.packageJson.devDependencies, newVersion) ||
        pkg.packageJson.devDependencies
    }

    writePackageJson(pkg.path, pkg.packageJson)
  }

  console.log(`\n✅ All packages updated (${mode})\n`)
}

function publishPackages(packages: PackageInfo[], tag: string): void {
  console.log(`\n🚀 Publishing packages with tag "${tag}"...\n`)

  for (const pkg of packages) {
    console.log(`  Publishing ${pkg.name}...`)
    
    try {    
      execSync(`npm publish --tag=${tag}`, {
        cwd: pkg.path,
        stdio: 'inherit',
      })
      
      console.log(`  ✅ ${pkg.name} published successfully\n`)
    } catch (error) {
      console.error(`  ❌ Failed to publish ${pkg.name}`)
      throw error
    }
  }

  console.log('\n✅ All packages published\n')
}

async function main(): Promise<void> {
  const { version, tag } = parseArgs()

  console.log('\n' + '='.repeat(60))
  console.log('EthereumJS Release Script')
  console.log('='.repeat(60))
  console.log(`Bump version: ${version ?? 'no'}`)
  console.log(`Publish: ${tag ? `yes (tag: ${tag})` : 'no'}`)
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
  const depsOnlyPackages: PackageInfo[] = []
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

  // Display current versions
  console.log('Active packages:')
  for (const pkg of packages) {
    console.log(`  ${pkg.name}: ${pkg.oldVersion}`)
  }
  console.log('\nDeps-only packages (deprecated + testdata):')
  for (const pkg of depsOnlyPackages) {
    console.log(`  ${pkg.name}: ${pkg.oldVersion}`)
  }

  try {
    // Step 1: Bump versions (if --bump-version is set)
    if (version) {
      // Update versions + deps for active packages
      updatePackages(packages, version, true)
      // Update deps only for deprecated/special packages
      updatePackages(depsOnlyPackages, version, false)
    } else {
      console.log('\n📋 Skipping version bump (use --bump-version to update versions)\n')
    }

    // Step 2: Publish packages (if --publish is set)
    if (tag) {
      publishPackages(packages, tag)
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

