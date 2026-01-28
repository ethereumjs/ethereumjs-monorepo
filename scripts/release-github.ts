#!/usr/bin/env tsx
/**
 * GitHub Release script for EthereumJS monorepo packages
 *
 * Creates GitHub releases for all active packages after npm releases are done.
 * Extracts release notes from CHANGELOG.md files.
 *
 * Usage:
 *   tsx scripts/release-github.ts --version=<version> [--start-with=<package>]
 *
 * Examples:
 *   tsx scripts/release-github.ts --version=10.1.1
 *   tsx scripts/release-github.ts --version=10.1.1 --start-with=evm
 *
 * Options:
 *   --version=<version>    Version to release (required)
 *   --start-with=<package> Package to start with (for resuming interrupted releases)
 *
 * Authentication:
 *   Set GITHUB_TOKEN environment variable or be authenticated via `gh` CLI.
 */

import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import * as readline from 'readline'

// Active packages from README.md (same as release.ts)
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

const REPO_OWNER = 'ethereumjs'
const REPO_NAME = 'ethereumjs-monorepo'
const TARGET_BRANCH = 'master'

interface ParsedArgs {
  version: string
  startWith?: string
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)

  const versionArg = args.find((arg) => arg.startsWith('--version='))
  const startWithArg = args.find((arg) => arg.startsWith('--start-with='))

  const version = versionArg?.split('=')[1]
  const startWith = startWithArg?.split('=')[1]

  if (!version) {
    console.error('Usage: tsx scripts/release-github.ts --version=<version> [--start-with=<package>]')
    console.error('')
    console.error('Examples:')
    console.error('  tsx scripts/release-github.ts --version=10.1.1')
    console.error('  tsx scripts/release-github.ts --version=10.1.1 --start-with=evm')
    console.error('')
    console.error('Options:')
    console.error('  --version=<version>    Version to release (required)')
    console.error('  --start-with=<package> Package to start with (for resuming interrupted releases)')
    console.error('')
    console.error('Authentication:')
    console.error('  Set GITHUB_TOKEN environment variable or be authenticated via `gh` CLI.')
    process.exit(1)
  }

  // Validate --start-with package if provided
  if (startWith && !ACTIVE_PACKAGES.includes(startWith)) {
    console.error(`Error: Unknown package "${startWith}"`)
    console.error(`Valid packages: ${ACTIVE_PACKAGES.join(', ')}`)
    process.exit(1)
  }

  return { version, startWith }
}

/**
 * Prompt user for confirmation
 */
async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} [y/N] `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

/**
 * Extract release notes for a specific version from CHANGELOG.md
 */
function extractReleaseNotes(changelogPath: string, version: string): string {
  const content = readFileSync(changelogPath, 'utf-8')
  const lines = content.split('\n')

  let capturing = false
  let releaseNotes: string[] = []

  for (const line of lines) {
    // Check for version header (e.g., "## 10.1.1 - 2025-01-28")
    if (line.startsWith('## ')) {
      if (capturing) {
        // We've reached the next version section, stop capturing
        break
      }

      // Check if this is the version we're looking for
      const versionMatch = line.match(/^## (\d+\.\d+\.\d+(?:-[^\s]+)?)/)
      if (versionMatch && versionMatch[1] === version) {
        capturing = true
        continue // Skip the header line itself
      }
    }

    if (capturing) {
      releaseNotes.push(line)
    }
  }

  // Trim leading/trailing empty lines
  while (releaseNotes.length > 0 && releaseNotes[0].trim() === '') {
    releaseNotes.shift()
  }
  while (releaseNotes.length > 0 && releaseNotes[releaseNotes.length - 1].trim() === '') {
    releaseNotes.pop()
  }

  if (releaseNotes.length === 0) {
    return `Release ${version}`
  }

  return releaseNotes.join('\n')
}

/**
 * Create a GitHub release using the gh CLI
 */
async function createGitHubRelease(
  packageName: string,
  version: string,
  releaseNotes: string
): Promise<boolean> {
  const fullPackageName = `@ethereumjs/${packageName}`
  const tag = `${fullPackageName}@${version}`
  const title = `${fullPackageName} v${version}`

  // Write release notes to a temp file to avoid shell escaping issues
  const tempFile = `/tmp/release-notes-${packageName}.md`
  writeFileSync(tempFile, releaseNotes, 'utf-8')

  const command = `gh release create "${tag}" \\
    --repo="${REPO_OWNER}/${REPO_NAME}" \\
    --title="${title}" \\
    --target="${TARGET_BRANCH}" \\
    --notes-file="${tempFile}"`

  console.log(`\n  📋 Release details:`)
  console.log(`     Title: ${title}`)
  console.log(`     Tag: ${tag}`)
  console.log(`     Target: ${TARGET_BRANCH}`)
  console.log(`\n  🔧 Command to execute:`)
  console.log(`     ${command.replace(/\\\n\s+/g, ' ')}\n`)

  const confirmed = await confirm('  Proceed with this release?')

  if (!confirmed) {
    console.log('  ⏭️  Skipped\n')
    // Clean up temp file
    try {
      unlinkSync(tempFile)
    } catch {
      // Ignore cleanup errors
    }
    return false
  }

  try {
    execSync(command, {
      stdio: 'inherit',
      shell: '/bin/bash',
    })
    console.log(`  ✅ Release created successfully\n`)
    return true
  } finally {
    // Clean up temp file
    try {
      unlinkSync(tempFile)
    } catch {
      // Ignore cleanup errors
    }
  }
}

async function main(): Promise<void> {
  const { version, startWith } = parseArgs()

  console.log('\n' + '='.repeat(60))
  console.log('EthereumJS GitHub Release Script')
  console.log('='.repeat(60))
  console.log(`Version: ${version}`)
  console.log(`Target branch: ${TARGET_BRANCH}`)
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}`)
  if (startWith) {
    console.log(`Starting with: ${startWith}`)
  }
  console.log('='.repeat(60) + '\n')

  // Check if gh CLI is available and authenticated
  try {
    execSync('gh auth status', { stdio: 'pipe' })
  } catch {
    console.error('❌ GitHub CLI (gh) is not authenticated.')
    console.error('   Please run `gh auth login` or set GITHUB_TOKEN environment variable.')
    process.exit(1)
  }

  const rootPath = process.cwd()
  const packagesPath = join(rootPath, 'packages')

  // Determine which packages to process
  let packagesToProcess = ACTIVE_PACKAGES
  if (startWith) {
    const startIndex = ACTIVE_PACKAGES.indexOf(startWith)
    packagesToProcess = ACTIVE_PACKAGES.slice(startIndex)
    console.log(`📦 Resuming GitHub releases from "${startWith}" (${packagesToProcess.length} packages remaining)...\n`)
  } else {
    console.log(`📦 Creating GitHub releases for ${ACTIVE_PACKAGES.length} active packages...\n`)
  }

  let successCount = 0
  let skipCount = 0
  let failCount = 0

  for (const packageName of packagesToProcess) {
    const packagePath = join(packagesPath, packageName)
    const changelogPath = join(packagePath, 'CHANGELOG.md')

    console.log(`\n${'─'.repeat(50)}`)
    console.log(`📦 Package: ${packageName} (${packagesToProcess.indexOf(packageName) + 1}/${packagesToProcess.length})`)
    console.log('─'.repeat(50))

    try {
      // Extract release notes from CHANGELOG
      const releaseNotes = extractReleaseNotes(changelogPath, version)

      // Create GitHub release (with confirmation)
      const created = await createGitHubRelease(packageName, version, releaseNotes)
      if (created) {
        successCount++
      } else {
        skipCount++
      }
    } catch (error) {
      console.error(`  ❌ Failed to create release for ${packageName}`)
      console.error(`     ${error}`)
      failCount++

      // Ask if user wants to continue after a failure
      const continueAfterError = await confirm('\n  Continue with remaining packages?')
      if (!continueAfterError) {
        console.log('\n  Aborting release process.')
        const nextIndex = packagesToProcess.indexOf(packageName) + 1
        if (nextIndex < packagesToProcess.length) {
          console.log(`  To resume, run: tsx scripts/release-github.ts --version=${version} --start-with=${packagesToProcess[nextIndex]}`)
        }
        break
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`   ✅ Created: ${successCount}`)
  console.log(`   ⏭️  Skipped: ${skipCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log('='.repeat(60) + '\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
