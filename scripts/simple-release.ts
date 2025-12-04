#!/usr/bin/env tsx
/**
 * Simple release script for in-between releases (nightly, alpha, etc.)
 * 
 * Usage:
 *   tsx scripts/simple-release.ts <version> <npm_token> <tag>
 * 
 * Example:
 *   tsx scripts/simple-release.ts 10.1.1-nightly.1 abc123 nightly
 */

import { readFileSync, writeFileSync, unlinkSync } from 'fs'
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

function parseArgs(): { version: string; npmToken: string; tag: string } {
  const args = process.argv.slice(2)
  
  if (args.length !== 3) {
    console.error('Usage: tsx scripts/simple-release.ts <version> <npm_token> <tag>')
    console.error('Example: tsx scripts/simple-release.ts 10.1.1-nightly.1 abc123 nightly')
    process.exit(1)
  }

  return {
    version: args[0],
    npmToken: args[1],
    tag: args[2],
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

function revertChanges(): void {
  console.log('\n🔄 Reverting version changes...\n')
  
  try {
    // Revert all package.json files
    execSync('git checkout -- packages/*/package.json', {
      stdio: 'inherit',
    })
    console.log('\n✅ Version changes reverted\n')
  } catch (error) {
    console.error('\n❌ Failed to revert changes')
    console.error('You may need to manually revert package.json files')
    throw error
  }
}

async function main(): Promise<void> {
  const { version, npmToken, tag } = parseArgs()

  console.log('\n' + '='.repeat(60))
  console.log('Simple Release Script')
  console.log('='.repeat(60))
  console.log(`Version: ${version}`)
  console.log(`Tag: ${tag}`)
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

    // Step 2: Publish packages
    publishPackages(packages, npmToken, tag)

    // Step 3: Revert changes
    revertChanges()

    console.log('\n' + '='.repeat(60))
    console.log('✅ Release completed successfully!')
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('\n' + '='.repeat(60))
    console.error('❌ Release failed!')
    console.error('='.repeat(60))
    console.error(error)
    
    // Try to revert changes even on error
    console.error('\nAttempting to revert changes...')
    try {
      revertChanges()
    } catch (revertError) {
      console.error('Failed to revert changes automatically')
      console.error('Please manually revert package.json files')
    }
    
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

