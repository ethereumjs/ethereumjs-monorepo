#!/usr/bin/env npx tsx
/**
 * Test Analysis Report Tool
 *
 * Runs execution-spec blockchain tests file-by-file and produces a summary table
 * showing test results along with metadata from each test file. Searches for
 * test files recursively in all subdirectories.
 *
 * Usage:
 *   npm run test:analysis:report -- --folder=<path-to-test-folder>
 *
 * Example:
 *   npm run test:analysis:report -- --folder=../execution-spec-tests/dev/blockchain_tests/amsterdam
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
}

interface TestFileInfo {
  fileName: string
  displayName: string // File name or relative path for display
  filePath: string
  network: string
  description: string
  testCount: number
}

interface TestResult extends TestFileInfo {
  passed: number
  failed: number
  status: 'PASS' | 'FAIL' | 'ERROR'
  errorMessage?: string
}

/**
 * Parse command line arguments
 */
function parseArgs(): { folder: string } {
  const args = process.argv.slice(2)
  let folder = ''

  for (const arg of args) {
    if (arg.startsWith('--folder=')) {
      folder = arg.substring('--folder='.length)
    }
  }

  if (!folder) {
    console.error('Error: --folder argument is required')
    console.error('Usage: npm run test:analysis:report -- --folder=<path-to-test-folder>')
    process.exit(1)
  }

  return { folder }
}

/**
 * Find all JSON test files in a directory (searches recursively)
 */
function findTestFiles(folderPath: string): string[] {
  const resolvedPath = path.resolve(folderPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Folder not found: ${resolvedPath}`)
    process.exit(1)
  }

  const results: string[] = []

  function scanDirectory(dirPath: string): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        results.push(fullPath)
      }
    }
  }

  scanDirectory(resolvedPath)
  return results.sort()
}

/**
 * Extract metadata from a test JSON file (from first test case)
 * @param filePath - Full path to the test file
 * @param baseFolderPath - Base folder path for calculating relative display name
 */
function extractTestInfo(filePath: string, baseFolderPath: string): TestFileInfo {
  const fileName = path.basename(filePath)
  // Calculate relative path from base folder for display
  const relativePath = path.relative(baseFolderPath, filePath)
  const displayName = relativePath !== fileName ? relativePath : fileName

  let network = 'Unknown'
  let description = 'No description'
  let testCount = 0

  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(content)
    const testCases = Object.entries(parsed)
    testCount = testCases.length

    if (testCases.length > 0) {
      const [, firstTestData] = testCases[0] as [string, any]
      network = firstTestData.network ?? 'Unknown'
      // Clean description: strip line breaks and limit to 60 chars
      let rawDescription: string = firstTestData._info?.description ?? 'No description'
      rawDescription = rawDescription
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      description =
        rawDescription.length > 60 ? rawDescription.substring(0, 57) + '...' : rawDescription
    }
  } catch {
    // Keep defaults if parsing fails
  }

  return { fileName, displayName, filePath, network, description, testCount }
}

/**
 * Run vitest for a single test file and capture results
 */
function runTestFile(filePath: string): { passed: number; failed: number; error?: string } {
  const fileName = path.basename(filePath)
  const folderPath = path.dirname(filePath)

  // Get the relative path from the vm package root
  const vmPackageRoot = path.resolve(__dirname, '../../..')
  const testRunnerPath = path.join(vmPackageRoot, 'test/tester/executionSpecBlockchain.test.ts')

  try {
    // Run vitest with TEST_PATH and TEST_FILE environment variables
    const result = execSync(`npx vitest run "${testRunnerPath}" --reporter=json --no-color 2>&1`, {
      cwd: vmPackageRoot,
      env: {
        ...process.env,
        TEST_PATH: folderPath,
        TEST_FILE: fileName,
      },
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large outputs
      timeout: 600000, // 10 minutes timeout per file
    })

    // Parse JSON output to get pass/fail counts
    return parseVitestOutput(result)
  } catch (e: unknown) {
    // vitest returns non-zero exit code on test failures, but we still want the output
    const execError = e as { stdout?: string; message?: string }
    if (execError.stdout !== undefined && execError.stdout !== '') {
      const result = parseVitestOutput(execError.stdout)
      if (result.passed > 0 || result.failed > 0) {
        return result
      }
    }
    const errorMsg =
      execError.message !== undefined ? execError.message.substring(0, 100) : 'Unknown error'
    return { passed: 0, failed: 0, error: errorMsg }
  }
}

/**
 * Parse vitest JSON output to extract pass/fail counts
 */
function parseVitestOutput(output: string): { passed: number; failed: number; error?: string } {
  try {
    // vitest JSON output may have some non-JSON lines before/after
    // Find the JSON object in the output
    const jsonMatch = output.match(/\{[\s\S]*"testResults"[\s\S]*\}/)
    if (jsonMatch !== null) {
      const jsonData = JSON.parse(jsonMatch[0]) as {
        testResults?: Array<{ assertionResults?: Array<{ status: string }> }>
      }
      let passed = 0
      let failed = 0

      const testResults = jsonData.testResults ?? []
      for (const testFile of testResults) {
        const assertions = testFile.assertionResults ?? []
        for (const assertion of assertions) {
          if (assertion.status === 'passed') {
            passed++
          } else if (assertion.status === 'failed') {
            failed++
          }
        }
      }

      return { passed, failed }
    }

    // Fallback: try to parse summary line from standard output
    // e.g., "Tests  5 passed (5)"
    const passMatch = output.match(/(\d+)\s+passed/)
    const failMatch = output.match(/(\d+)\s+failed/)

    return {
      passed: passMatch ? parseInt(passMatch[1], 10) : 0,
      failed: failMatch ? parseInt(failMatch[1], 10) : 0,
    }
  } catch {
    return { passed: 0, failed: 0, error: 'Failed to parse test output' }
  }
}

/**
 * Colorize a value based on type (passed = green, failed = red)
 */
function colorize(value: string, type: 'passed' | 'failed' | 'status', status?: string): string {
  if (type === 'passed') {
    return `${colors.green}${value}${colors.reset}`
  } else if (type === 'failed') {
    // Only colorize if there are actual failures (not "0")
    const num = parseInt(value.trim(), 10)
    if (num > 0) {
      return `${colors.red}${value}${colors.reset}`
    }
    return value
  } else if (type === 'status') {
    if (status === 'PASS') {
      return `${colors.green}${value}${colors.reset}`
    } else if (status === 'FAIL') {
      return `${colors.red}${value}${colors.reset}`
    } else if (status === 'ERROR') {
      return `${colors.yellow}${value}${colors.reset}`
    }
  }
  return value
}

/**
 * Format a table row with fixed column widths (no colors for header)
 */
function formatRowHeader(
  fileName: string,
  network: string,
  description: string,
  tests: string,
  passed: string,
  failed: string,
  status: string,
): string {
  const cols = [
    fileName.padEnd(50).substring(0, 50),
    network.padEnd(12).substring(0, 12),
    description.padEnd(60).substring(0, 60),
    tests.padStart(5),
    passed.padStart(6),
    failed.padStart(6),
    status.padEnd(6),
  ]
  return `| ${cols.join(' | ')} |`
}

/**
 * Format a table row with fixed column widths and colors for passed/failed/status
 */
function formatRowData(
  fileName: string,
  network: string,
  description: string,
  tests: string,
  passed: number,
  failed: number,
  status: 'PASS' | 'FAIL' | 'ERROR' | '',
): string {
  const passedStr = passed.toString().padStart(6)
  const failedStr = failed.toString().padStart(6)
  const statusStr = status.padEnd(6)

  const cols = [
    fileName.padEnd(50).substring(0, 50),
    network.padEnd(12).substring(0, 12),
    description.padEnd(60).substring(0, 60),
    tests.padStart(5),
    colorize(passedStr, 'passed'),
    colorize(failedStr, 'failed'),
    colorize(statusStr, 'status', status),
  ]
  return `| ${cols.join(' | ')} |`
}

/**
 * Print the summary table (only showing files with failures)
 */
function printSummaryTable(results: TestResult[]): void {
  const divider =
    '+' +
    '-'.repeat(52) +
    '+' +
    '-'.repeat(14) +
    '+' +
    '-'.repeat(62) +
    '+' +
    '-'.repeat(7) +
    '+' +
    '-'.repeat(8) +
    '+' +
    '-'.repeat(8) +
    '+' +
    '-'.repeat(8) +
    '+'

  // Filter to only show files with failures
  const failedResults = results.filter((r) => r.status !== 'PASS')

  console.log('\n' + '='.repeat(165))
  console.log(' TEST ANALYSIS REPORT (showing failures only)')
  console.log('='.repeat(165))
  console.log(divider)
  console.log(
    formatRowHeader('File', 'Network', 'Description', 'Tests', 'Passed', 'Failed', 'Status'),
  )
  console.log(divider)

  if (failedResults.length === 0) {
    console.log('| ' + 'All tests passed!'.padEnd(161) + ' |')
  } else {
    for (const result of failedResults) {
      console.log(
        formatRowData(
          result.displayName,
          result.network,
          result.description,
          result.testCount.toString(),
          result.passed,
          result.failed,
          result.status,
        ),
      )
    }
  }

  console.log(divider)

  // Summary totals (from all results, not just failures)
  const totalTests = results.reduce((sum, r) => sum + r.testCount, 0)
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
  const filesWithFailures = failedResults.length

  console.log(
    formatRowData(
      `TOTAL (${results.length} files)`,
      '',
      `${filesWithFailures} files with failures`,
      totalTests.toString(),
      totalPassed,
      totalFailed,
      '',
    ),
  )
  console.log(divider)
  console.log('')
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const { folder } = parseArgs()

  console.log(`\nTest Analysis Report`)
  console.log(`Scanning folder: ${path.resolve(folder)}`)

  const testFiles = findTestFiles(folder)
  console.log(`Found ${testFiles.length} test file(s)\n`)

  if (testFiles.length === 0) {
    console.log('No test files found.')
    return
  }

  const results: TestResult[] = []

  const baseFolderPath = path.resolve(folder)

  for (let i = 0; i < testFiles.length; i++) {
    const filePath = testFiles[i]
    const info = extractTestInfo(filePath, baseFolderPath)

    // Show progress
    process.stdout.write(`[${i + 1}/${testFiles.length}] Running ${info.displayName}... `)

    const { passed, failed, error } = runTestFile(filePath)

    const result: TestResult = {
      ...info,
      passed,
      failed,
      status: error !== undefined ? 'ERROR' : failed > 0 ? 'FAIL' : 'PASS',
      errorMessage: error,
    }

    results.push(result)

    // Show inline result with colors
    let statusIcon: string
    if (result.status === 'PASS') {
      statusIcon = `${colors.green}✓${colors.reset}`
    } else if (result.status === 'FAIL') {
      statusIcon = `${colors.red}✗${colors.reset}`
    } else {
      statusIcon = `${colors.yellow}!${colors.reset}`
    }
    console.log(`${statusIcon} (${passed}/${passed + failed} passed)`)
  }

  printSummaryTable(results)
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
