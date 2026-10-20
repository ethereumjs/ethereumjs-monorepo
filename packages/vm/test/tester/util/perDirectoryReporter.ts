/**
 * Per-Directory Test Reporter (vitest custom reporter)
 *
 * Aggregates execution-spec test results by the top-level subdirectory of each
 * fixture under a given base path (typically per-EIP or per-topic folders) and
 * prints a colored summary table once the entire test run finishes.
 *
 * Also clusters failure messages (hex / large integers normalized) so a first
 * fixture bump does not require grepping thousands of vitest stack traces.
 *
 * Unlike a worker-side `afterAll` hook (whose output gets re-emitted by vitest
 * before failure stack traces and thus scrolls off the screen for large runs),
 * a reporter runs in the main process and emits its output *after* the default
 * reporter has finished printing all test results.
 *
 * Usage:
 *
 *   1) In your test file, annotate each `it()` with fixture metadata:
 *
 *        import { annotateFixture } from './util/perDirectoryReporter.ts'
 *        ...
 *        it(name, async ({ task }) => {
 *          annotateFixture(task, fixture.filePath, fixturesPath, 'blockchain tests')
 *          // ...run test
 *        })
 *
 *   2) Enable this reporter for the relevant npm script(s):
 *
 *        npx vitest run \
 *          --reporter=default \
 *          --reporter=./test/tester/util/perDirectoryReporter.ts \
 *          test/tester/myTest.test.ts
 *
 *   First-round / agent-friendly (no per-test dump). Optionally write JSON:
 *
 *        NO_COLOR=1 EST_SUMMARY_JSON=/tmp/est-summary.json \
 *          npx vitest run --reporter=./test/tester/util/perDirectoryReporter.ts \
 *          test/tester/executionSpecBlockchain.test.ts
 *
 * Tests that do not annotate fixture metadata are silently ignored; the
 * reporter prints nothing when no annotated tests were collected.
 */

import fs from 'fs'
import path from 'path'
import type { Reporter, TestCase } from 'vitest/node'

interface DirStats {
  passed: number
  failed: number
  errors: Map<string, number>
}

interface TaskWithMeta {
  meta: object
}

export interface ErrorCluster {
  message: string
  count: number
}

export interface DirectorySummary {
  dir: string
  passed: number
  failed: number
  total: number
  errors: ErrorCluster[]
}

export interface RunSummary {
  label: string
  passed: number
  failed: number
  total: number
  directories: DirectorySummary[]
  errors: ErrorCluster[]
}

export function mergeRunSummaries(summaries: RunSummary[]): RunSummary {
  const stats = new Map<string, DirStats>()
  let label = 'tests'
  for (const summary of summaries) {
    if (summary.label.length > 0 && summary.label !== 'tests') label = summary.label
    for (const d of summary.directories) {
      const s = stats.get(d.dir) ?? emptyStats()
      s.passed += d.passed
      s.failed += d.failed
      for (const e of d.errors) {
        s.errors.set(e.message, (s.errors.get(e.message) ?? 0) + e.count)
      }
      stats.set(d.dir, s)
    }
  }
  return buildRunSummary(label, stats)
}

export function renderRunSummary(summary: RunSummary): string {
  return renderSummary(summary)
}

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
}

const META_KEY_PATH = 'fixturePath'
const META_KEY_BASE = 'fixtureBasePath'
const META_KEY_LABEL = 'fixtureLabel'

const TOP_GLOBAL_ERRORS = 15
const TOP_DIR_ERRORS = 3

// Honor the de facto standard NO_COLOR env var as well as non-TTY stdout
const useColor = process.env.NO_COLOR === undefined && process.stdout.isTTY === true
const c = (code: string, s: string) => (useColor ? `${code}${s}${COLORS.reset}` : s)

/**
 * Resolve the bucket key for a fixture file path: the top-level subdirectory
 * under `basePath`, or '.' if the fixture is directly in `basePath`.
 */
function bucketFor(filePath: string, basePath: string): string {
  const rel = path.relative(basePath, filePath)
  if (rel === '' || rel.startsWith('..')) return '.'
  const first = rel.split(path.sep)[0]
  return first === '' ? '.' : first
}

/**
 * Collapse addresses / large integers so the same failure mode counts as one
 * cluster (e.g. INTRINSIC_GAS_TOO_LOW with different gas figures).
 */
export function normalizeErrorKey(message: string): string {
  const firstLine = message.split('\n')[0] ?? message
  return firstLine
    .replace(/\x1b\[[0-9;]*m/g, '')
    .replace(/^(?:Error|AssertionError):\s*/u, '')
    .replace(/0x[a-fA-F0-9]{8,}/g, '0x…')
    .replace(/\b\d{4,}\b/g, 'N')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
}

function emptyStats(): DirStats {
  return { passed: 0, failed: 0, errors: new Map() }
}

function bumpError(stats: DirStats, message: string): void {
  const key = normalizeErrorKey(message)
  if (key.length === 0) return
  stats.errors.set(key, (stats.errors.get(key) ?? 0) + 1)
}

function clustersFrom(map: Map<string, number>, limit: number): ErrorCluster[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([message, count]) => ({ message, count }))
}

function mergeErrors(stats: Map<string, DirStats>): Map<string, number> {
  const global = new Map<string, number>()
  for (const s of stats.values()) {
    for (const [key, n] of s.errors) {
      global.set(key, (global.get(key) ?? 0) + n)
    }
  }
  return global
}

function firstErrorMessage(testCase: TestCase): string | undefined {
  const result = testCase.result() as { errors?: Array<{ message?: string }> }
  const fromResult = result.errors?.[0]?.message
  if (typeof fromResult === 'string' && fromResult.length > 0) return fromResult

  const errorsFn = (testCase as { errors?: () => Array<{ message?: string }> }).errors
  if (typeof errorsFn === 'function') {
    const fromMethod = errorsFn.call(testCase)?.[0]?.message
    if (typeof fromMethod === 'string' && fromMethod.length > 0) return fromMethod
  }
  return undefined
}

function buildRunSummary(label: string, stats: Map<string, DirStats>): RunSummary {
  const directories = Array.from(stats.entries())
    .sort(([aDir, a], [bDir, b]) => {
      if (b.failed !== a.failed) return b.failed - a.failed
      return aDir.localeCompare(bDir)
    })
    .map(([dir, s]) => ({
      dir,
      passed: s.passed,
      failed: s.failed,
      total: s.passed + s.failed,
      errors: clustersFrom(s.errors, TOP_DIR_ERRORS),
    }))

  const passed = directories.reduce((sum, d) => sum + d.passed, 0)
  const failed = directories.reduce((sum, d) => sum + d.failed, 0)

  return {
    label,
    passed,
    failed,
    total: passed + failed,
    directories,
    errors: clustersFrom(mergeErrors(stats), TOP_GLOBAL_ERRORS),
  }
}

/**
 * Annotate a vitest task's metadata with fixture info so the
 * PerDirectoryReporter can aggregate results. Call this once per test, as the
 * first line of the `it()` callback.
 */
export function annotateFixture(
  task: TaskWithMeta,
  filePath: string,
  basePath: string,
  label: string,
): void {
  const meta = task.meta as Record<string, unknown>
  meta[META_KEY_PATH] = filePath
  meta[META_KEY_BASE] = basePath
  meta[META_KEY_LABEL] = label
}

/**
 * Vitest reporter. Wire up via `--reporter=./path/to/perDirectoryReporter.ts`
 * on the command line, or in `vitest.config.ts` under `test.reporters`.
 *
 * Note: vitest's CLI `--reporter=<path>` loader requires a default export, so
 * we keep one here despite the project-wide `import/no-default-export` rule.
 */
// eslint-disable-next-line import/no-default-export
export default class PerDirectoryReporter implements Reporter {
  private stats = new Map<string, DirStats>()
  private label = 'tests'

  onTestCaseResult(testCase: TestCase): void {
    const meta = testCase.meta() as Record<string, unknown>
    const fp = meta[META_KEY_PATH]
    const base = meta[META_KEY_BASE]
    if (typeof fp !== 'string' || typeof base !== 'string') return

    const state = testCase.result().state
    if (state !== 'passed' && state !== 'failed') return

    const labelMeta = meta[META_KEY_LABEL]
    if (typeof labelMeta === 'string') this.label = labelMeta

    const dir = bucketFor(fp, path.resolve(base))
    const s = this.stats.get(dir) ?? emptyStats()
    if (state === 'passed') {
      s.passed++
    } else {
      s.failed++
      const message = firstErrorMessage(testCase)
      if (message !== undefined) bumpError(s, message)
      if (process.env.PRINT_TEST_FAILURES === '1' || process.env.LEGACY_PRINT_FAILURES === '1') {
        printFailure(testCase, fp, message)
      }
    }
    this.stats.set(dir, s)
  }

  onTestRunEnd(): void {
    const hasJSON =
      process.env.EST_SUMMARY_JSON !== undefined && process.env.EST_SUMMARY_JSON.length > 0
    if (this.stats.size === 0 && hasJSON === false) return
    const summary = buildRunSummary(this.label, this.stats)
    if (process.env.EST_SUMMARY_QUIET !== '1') {
      process.stdout.write(renderSummary(summary))
    }
    writeSummaryJSON(summary)
  }
}

function printFailure(testCase: TestCase, filePath: string, message: string | undefined): void {
  const name =
    (testCase as { fullName?: string; name?: string }).fullName ??
    (testCase as { name?: string }).name ??
    'unknown'
  const lines = [`FAIL  ${name}`, `      ${filePath}`]
  if (message !== undefined && message.length > 0) {
    for (const line of message.split('\n')) {
      lines.push(`      ${line}`)
    }
  }
  process.stderr.write(`${lines.join('\n')}\n`)
}

function renderErrorTable(title: string, clusters: ErrorCluster[]): string[] {
  if (clusters.length === 0) return []
  const countWidth = Math.max(5, ...clusters.map((e) => String(e.count).length))
  const lines: string[] = ['', c(COLORS.bold, title)]
  for (const { message, count } of clusters) {
    lines.push(`  ${c(COLORS.red, String(count).padStart(countWidth))}  ${message}`)
  }
  return lines
}

function renderSummary(summary: RunSummary): string {
  const entries = summary.directories
  const dirHeader = 'Directory'
  const dirWidth = Math.max(dirHeader.length, 5, ...entries.map((d) => d.dir.length))
  const numWidth = 8

  const sep =
    '+' + '-'.repeat(dirWidth + 2) + '+' + ('+' + '-'.repeat(numWidth + 2)).repeat(4).slice(1) + '+'

  const cell = (s: string, w: number, align: 'l' | 'r' = 'l') =>
    align === 'r' ? s.padStart(w) : s.padEnd(w)

  const formatRate = (p: number, total: number) =>
    total > 0 ? `${((p / total) * 100).toFixed(1)}%` : '-'

  const rateColor = (passed: number, failed: number) => {
    if (failed === 0) return COLORS.green
    if (passed === 0) return COLORS.red
    return COLORS.yellow
  }

  const lines: string[] = []
  lines.push('')
  lines.push(c(COLORS.bold, `Per-Directory Test Summary — ${summary.label}`))
  lines.push(sep)
  lines.push(
    `| ${cell(dirHeader, dirWidth)} | ${cell('Passed', numWidth, 'r')} | ${cell(
      'Failed',
      numWidth,
      'r',
    )} | ${cell('Total', numWidth, 'r')} | ${cell('Pass %', numWidth, 'r')} |`,
  )
  lines.push(sep)

  for (const d of entries) {
    const passedCell = cell(String(d.passed), numWidth, 'r')
    const failedCell = cell(String(d.failed), numWidth, 'r')
    const rateCell = cell(formatRate(d.passed, d.total), numWidth, 'r')
    lines.push(
      `| ${cell(d.dir, dirWidth)} | ${d.passed > 0 ? c(COLORS.green, passedCell) : passedCell} | ${
        d.failed > 0 ? c(COLORS.red, failedCell) : failedCell
      } | ${cell(String(d.total), numWidth, 'r')} | ${c(rateColor(d.passed, d.failed), rateCell)} |`,
    )
  }

  lines.push(sep)
  const totalDir = c(COLORS.bold, cell('TOTAL', dirWidth))
  const totalPassedCell = c(COLORS.green, cell(String(summary.passed), numWidth, 'r'))
  const totalFailedCell = c(COLORS.red, cell(String(summary.failed), numWidth, 'r'))
  const totalTotalCell = cell(String(summary.total), numWidth, 'r')
  const totalRateCell = c(
    rateColor(summary.passed, summary.failed),
    cell(formatRate(summary.passed, summary.total), numWidth, 'r'),
  )
  lines.push(
    `| ${totalDir} | ${totalPassedCell} | ${totalFailedCell} | ${totalTotalCell} | ${totalRateCell} |`,
  )
  lines.push(sep)

  lines.push(...renderErrorTable('Error clusters (normalized, top 15)', summary.errors))

  const failingDirs = entries.filter((d) => d.failed > 0 && d.errors.length > 0)
  if (failingDirs.length > 0) {
    lines.push('')
    lines.push(c(COLORS.bold, 'Per-directory top errors (up to 3)'))
    for (const d of failingDirs) {
      lines.push(`  ${d.dir}`)
      for (const { message, count } of d.errors) {
        lines.push(`    ${c(COLORS.red, String(count).padStart(5))}  ${message}`)
      }
    }
  }

  lines.push('')
  return lines.join('\n') + '\n'
}

function writeSummaryJSON(summary: RunSummary): void {
  const out = process.env.EST_SUMMARY_JSON
  if (out === undefined || out.length === 0) return
  try {
    fs.writeFileSync(out, `${JSON.stringify(summary, null, 2)}\n`)
    if (process.env.EST_SUMMARY_QUIET !== '1') {
      process.stdout.write(`Wrote EST summary JSON to ${out}\n`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    process.stderr.write(`Failed to write EST_SUMMARY_JSON (${out}): ${msg}\n`)
  }
}
