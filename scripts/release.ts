#!/usr/bin/env tsx
/**
 * Release script for EthereumJS monorepo packages
 *
 * Supports both regular releases and in-between releases (nightly, alpha, etc.)
 *
 * Usage:
 *   tsx scripts/release.ts <version> <tag> [--publish] [--npm-token=<token>]
 *
 * Examples:
 *   # Update versions only (no publish)
 *   tsx scripts/release.ts 10.1.0 latest
 *
 *   # Update versions and publish
 *   tsx scripts/release.ts 10.1.1-nightly.1 nightly --publish --npm-token=abc123
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

// Active packages from README.md
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

function parseArgs(): { version: string; tag: string; publish: boolean; npmToken?: string } {
  const args = process.argv.slice(2)

  // Extract flags
  const publish = args.includes('--publish')
  const npmTokenArg = args.find((arg) => arg.startsWith('--npm-token='))
  const npmToken = npmTokenArg?.split('=')[1]

  // Filter out flags to get positional args
  const positionalArgs = args.filter(
    (arg) => !arg.startsWith('--publish') && !arg.startsWith('--npm-token=')
  )

  if (positionalArgs.length !== 2) {
    console.error('Usage: tsx scripts/release.ts <version> <tag> [--publish] [--npm-token=<token>]')
    console.error('')
    console.error('Examples:')
    console.error('  tsx scripts/release.ts 10.1.0 latest')
    console.error('  tsx scripts/release.ts 10.1.1-nightly.1 nightly --publish --npm-token=abc123')
    process.exit(1)
  }

  if (publish && !npmToken) {
    console.error('Error: --npm-token is required when using --publish')
    process.exit(1)
  }

  return {
    version: positionalArgs[0],
    tag: positionalArgs[1],
    publish,
    npmToken,
  }
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
      // Preserve the version prefix (^, ~, etc.) if present
      const prefixMatch = depVersion.match(/^([\^~])?/)
      const prefix = prefixMatch?.[1] || ''
      updated[depName] = prefix ? `${prefix}${newVersion}` : newVersion
    }
  }
  return updated
}

function updatePackageVersions(
  packages: PackageInfo[],
  newVersion: string
): void {
  console.log(`\n📦 Updating package versions to ${newVersion}...\n`)

  for (const pkg of packages) {
    console.log(`  Updating ${pkg.name}...`)
    
    // Update main version
    pkg.packageJson.version = newVersion

    // Update dependencies
    if (pkg.packageJson.dependencies) {
      pkg.packageJson.dependencies = updateDependencyVersion(
        pkg.packageJson.dependencies,
        newVersion
      ) || pkg.packageJson.dependencies
    }

    // Update devDependencies
    if (pkg.packageJson.devDependencies) {
      pkg.packageJson.devDependencies = updateDependencyVersion(
        pkg.packageJson.devDependencies,
        newVersion
      ) || pkg.packageJson.devDependencies
    }

    // Write updated package.json
    writePackageJson(pkg.path, pkg.packageJson)
  }

  console.log('\n✅ All package versions updated\n')
}

function publishPackages(packages: PackageInfo[], npmToken: string, tag: string): void {
  console.log(`\n🚀 Publishing packages with tag "${tag}"...\n`)

  for (const pkg of packages) {
    console.log(`  Publishing ${pkg.name}...`)
    
    try {    
      execSync(`npm publish --tag=${tag}`, {
        cwd: pkg.path,
        stdio: 'inherit',
        env: {
          ...process.env,
          NPM_TOKEN: npmToken,
        },
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
  const { version, tag, publish, npmToken } = parseArgs()

  console.log('\n' + '='.repeat(60))
  console.log('EthereumJS Release Script')
  console.log('='.repeat(60))
  console.log(`Version: ${version}`)
  console.log(`Tag: ${tag}`)
  console.log(`Publish: ${publish ? 'yes' : 'no (dry run)'}`)
  console.log('='.repeat(60) + '\n')

  const rootPath = process.cwd()
  const packagesPath = join(rootPath, 'packages')

  // Read all package.json files
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

  // Display current versions
  console.log('Current package versions:')
  for (const pkg of packages) {
    console.log(`  ${pkg.name}: ${pkg.oldVersion}`)
  }

  try {
    // Step 1: Update versions
    updatePackageVersions(packages, version)

    // Step 2: Publish packages (if --publish flag is set)
    if (publish) {
      publishPackages(packages, npmToken!, tag)
    } else {
      console.log('\n📋 Skipping publish (use --publish to publish packages)\n')
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Release completed successfully!')
    if (!publish) {
      console.log('Note: Packages were NOT published. Use --publish to publish.')
    }
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

