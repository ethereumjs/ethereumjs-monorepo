/**
 * Per-Directory Test Reporter (vitest custom reporter)
 *
 * Aggregates execution-spec test results by the top-level subdirectory of each
 * fixture under a given base path (typically per-EIP or per-topic folders) and
 * prints a colored summary table once the entire test run finishes.
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
 * Tests that do not annotate fixture metadata are silently ignored; the
 * reporter prints nothing when no annotated tests were collected.
 */

import path from 'path'
import type { Reporter, TestCase } from 'vitest/node'

interface DirStats {
  passed: number
  failed: number
}

interface TaskWithMeta {
  meta: object
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
    const s = this.stats.get(dir) ?? { passed: 0, failed: 0 }
    if (state === 'passed') s.passed++
    else s.failed++
    this.stats.set(dir, s)
  }

  onTestRunEnd(): void {
    if (this.stats.size === 0) return
    process.stdout.write(renderSummary(this.label, this.stats))
  }
}

function renderSummary(label: string, stats: Map<string, DirStats>): string {
  // Sort by failures desc, then name asc — worst-performing buckets first
  const entries = Array.from(stats.entries()).sort(([aDir, a], [bDir, b]) => {
    if (b.failed !== a.failed) return b.failed - a.failed
    return aDir.localeCompare(bDir)
  })

  const dirHeader = 'Directory'
  const dirWidth = Math.max(dirHeader.length, 5, ...entries.map(([d]) => d.length))
  const numWidth = 8

  const totalPassed = entries.reduce((sum, [, s]) => sum + s.passed, 0)
  const totalFailed = entries.reduce((sum, [, s]) => sum + s.failed, 0)
  const totalTests = totalPassed + totalFailed

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
  lines.push(c(COLORS.bold, `Per-Directory Test Summary — ${label}`))
  lines.push(sep)
  lines.push(
    `| ${cell(dirHeader, dirWidth)} | ${cell('Passed', numWidth, 'r')} | ${cell(
      'Failed',
      numWidth,
      'r',
    )} | ${cell('Total', numWidth, 'r')} | ${cell('Pass %', numWidth, 'r')} |`,
  )
  lines.push(sep)

  for (const [dir, s] of entries) {
    const total = s.passed + s.failed
    const passedCell = cell(String(s.passed), numWidth, 'r')
    const failedCell = cell(String(s.failed), numWidth, 'r')
    const rateCell = cell(formatRate(s.passed, total), numWidth, 'r')
    lines.push(
      `| ${cell(dir, dirWidth)} | ${s.passed > 0 ? c(COLORS.green, passedCell) : passedCell} | ${
        s.failed > 0 ? c(COLORS.red, failedCell) : failedCell
      } | ${cell(String(total), numWidth, 'r')} | ${c(rateColor(s.passed, s.failed), rateCell)} |`,
    )
  }

  lines.push(sep)
  const totalDir = c(COLORS.bold, cell('TOTAL', dirWidth))
  const totalPassedCell = c(COLORS.green, cell(String(totalPassed), numWidth, 'r'))
  const totalFailedCell = c(COLORS.red, cell(String(totalFailed), numWidth, 'r'))
  const totalTotalCell = cell(String(totalTests), numWidth, 'r')
  const totalRateCell = c(
    rateColor(totalPassed, totalFailed),
    cell(formatRate(totalPassed, totalTests), numWidth, 'r'),
  )
  lines.push(
    `| ${totalDir} | ${totalPassedCell} | ${totalFailedCell} | ${totalTotalCell} | ${totalRateCell} |`,
  )
  lines.push(sep)
  lines.push('')

  return lines.join('\n') + '\n'
}
