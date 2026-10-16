import type { RunnerCliOptions } from './cli.ts'
import { RECENT_FORKS } from './forks.ts'
import { loadManifest } from './manifest.ts'
import { groupCasesByFile } from './select.ts'
import type { CaseResult, ConsensusTestCase } from './types.ts'

export type CaseCountSummary = {
  total: number
  fileCount: number
  byFork: Record<string, number>
  byFormat: Record<string, number>
}

export function summarizeCaseCounts(cases: ConsensusTestCase[]): CaseCountSummary {
  const byFork: Record<string, number> = {}
  const byFormat: Record<string, number> = {}
  for (const c of cases) {
    byFork[c.fork] = (byFork[c.fork] ?? 0) + 1
    byFormat[c.format] = (byFormat[c.format] ?? 0) + 1
  }
  return {
    total: cases.length,
    fileCount: groupCasesByFile(cases).size,
    byFork,
    byFormat,
  }
}

function formatForkScope(options: RunnerCliOptions): string {
  if (options.source === 'legacy') {
    return `legacy blockchain · ${options.legacyFork ?? 'Prague'}`
  }
  if (options.forkPreset === 'recent') {
    return `recent (${RECENT_FORKS.join(', ')})`
  }
  if (options.forkPreset === 'all') {
    return 'all EST forks'
  }
  const filter = options.forkFilter
  if (filter !== undefined && filter.size > 0) {
    const names = [...filter].sort()
    if (names.length <= 6) return names.join(', ')
    return `${names.slice(0, 5).join(', ')}, +${names.length - 5} more`
  }
  const manifest = loadManifest()
  const source = manifest.sources[options.source]
  if (source?.kind === 'release' && source.defaultForks !== undefined) {
    return source.defaultForks.join(', ')
  }
  return '(index default)'
}

function formatSourceLine(options: RunnerCliOptions): string {
  if (options.fixtureRoot !== undefined) {
    return `${options.source} · local fixture-root`
  }
  const manifest = loadManifest()
  const source = manifest.sources[options.source]
  if (source?.kind === 'release') {
    return `${options.source} · ${source.tag}`
  }
  return options.source
}

function formatFormatLine(format: RunnerCliOptions['format']): string {
  if (format === 'all') return 'state + blockchain'
  if (format === 'state_tests') return 'state'
  return 'blockchain'
}

function padLabel(label: string, width = 12): string {
  return `${label}`.padEnd(width)
}

/** Compact fork breakdown for the banner (top forks by count). */
function forkBreakdown(byFork: Record<string, number>, maxLines = 6): string[] {
  return Object.entries(byFork)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxLines)
    .map(([fork, n]) => `${fork}: ${n.toLocaleString('en-US')}`)
}

export function printRunBanner(
  options: RunnerCliOptions,
  summary: CaseCountSummary,
  rootLabel: string,
): void {
  const lines: string[] = []
  lines.push('╔══════════════════════════════════════════════════════════════════════╗')
  lines.push('║  EthereumJS consensus run                                            ║')
  lines.push('╠══════════════════════════════════════════════════════════════════════╣')
  lines.push(`║  ${padLabel('source')}${formatSourceLine(options).slice(0, 54).padEnd(54)} ║`)
  lines.push(`║  ${padLabel('scope')}${formatForkScope(options).slice(0, 54).padEnd(54)} ║`)
  lines.push(
    `║  ${padLabel('format')}${formatFormatLine(options.format).slice(0, 54).padEnd(54)} ║`,
  )
  if (options.shard !== undefined) {
    lines.push(`║  ${padLabel('shard')}${options.shard.slice(0, 54).padEnd(54)} ║`)
  }
  lines.push(`║  ${padLabel('workers')}${String(options.jobs).padEnd(54)} ║`)
  if (options.rerunFailedPath !== undefined) {
    lines.push(`║  ${padLabel('rerun')}${options.rerunFailedPath.slice(0, 54).padEnd(54)} ║`)
  }
  lines.push(
    `║  ${padLabel('selected')}${`${summary.total.toLocaleString('en-US')} cases · ${summary.fileCount.toLocaleString('en-US')} files`.padEnd(54)} ║`,
  )
  const breakdown = forkBreakdown(summary.byFork)
  if (breakdown.length > 0) {
    lines.push('╟──────────────────────────────────────────────────────────────────────╢')
    for (const row of breakdown) {
      lines.push(`║    ${row.padEnd(66)} ║`)
    }
  }
  lines.push('╚══════════════════════════════════════════════════════════════════════╝')
  const fixtureHint = rootLabel.length > 72 ? `…${rootLabel.slice(-71)}` : rootLabel
  lines.push(`fixtures: ${fixtureHint}`)
  process.stdout.write(`${lines.join('\n')}\n\n`)
}

export function printRunStart(summary: CaseCountSummary, jobs: number): void {
  process.stdout.write(
    `▶ Executing ${summary.total.toLocaleString('en-US')} cases · ${summary.fileCount.toLocaleString('en-US')} files · ${jobs} worker${jobs === 1 ? '' : 's'}\n`,
  )
}

const CI_PROGRESS = process.env.GITHUB_ACTIONS === 'true' || process.stdout.isTTY !== true

/** Live progress for long CI runs (stdout, line-based in CI). */
export class ConsensusRunProgress {
  readonly #total: number
  readonly #jobs: number
  readonly #batchMode: boolean
  readonly #start = performance.now()
  #completed = 0
  #failed = 0
  #lastLogAt = 0
  #lastLoggedPct = -1

  constructor(total: number, jobs: number) {
    this.#total = total
    this.#jobs = jobs
    this.#batchMode = jobs > 1
  }

  /** One worker thread finished its file batch (parallel mode). */
  completeWorkerBatch(workerIndex: number, results: CaseResult[]): void {
    this.#completed += results.length
    this.#failed += results.filter((r) => !r.pass).length
    const elapsed = (performance.now() - this.#start) / 1000
    const pct = this.#pct()
    const rate = this.#completed / Math.max(elapsed, 0.001)
    process.stdout.write(
      `  ◆ worker ${workerIndex + 1}/${this.#jobs} batch done (+${results.length.toLocaleString('en-US')}) · ` +
        `${this.#completed.toLocaleString('en-US')}/${this.#total.toLocaleString('en-US')} (${pct}%) · ` +
        `${this.#failed} failed · ${elapsed.toFixed(0)}s · ${rate.toFixed(0)}/s\n`,
    )
    this.#lastLogAt = performance.now()
    this.#lastLoggedPct = pct
  }

  recordCase(result: CaseResult): void {
    this.#completed += 1
    if (!result.pass) this.#failed += 1
    this.#maybeLog(false)
  }

  finish(): void {
    if (this.#batchMode) {
      const elapsed = (performance.now() - this.#start) / 1000
      const rate = this.#completed / Math.max(elapsed, 0.001)
      process.stdout.write(
        `[consensus] done · ${this.#completed.toLocaleString('en-US')}/${this.#total.toLocaleString('en-US')} · ` +
          `${this.#failed} failed · ${elapsed.toFixed(0)}s · ${rate.toFixed(0)}/s\n`,
      )
    } else if (this.#lastLoggedPct < 100) {
      this.#maybeLog(true)
    }
    process.stdout.write('\n')
  }

  #pct(): number {
    if (this.#total === 0) return 100
    return Math.min(100, Math.floor((100 * this.#completed) / this.#total))
  }

  #maybeLog(force: boolean): void {
    if (this.#total === 0 || this.#batchMode) return
    const now = performance.now()
    const pct = this.#pct()
    const elapsed = (now - this.#start) / 1000
    const sinceLog = (now - this.#lastLogAt) / 1000
    const pctStep = pct - this.#lastLoggedPct

    const timeDue = CI_PROGRESS && sinceLog >= 30
    const pctDue = pctStep >= 5 || (CI_PROGRESS && pctStep >= 2)
    const first = this.#completed === 1

    if (!force && !first && !timeDue && !pctDue) return

    this.#lastLogAt = now
    this.#lastLoggedPct = pct
    const rate = this.#completed / Math.max(elapsed, 0.001)
    process.stdout.write(
      `[consensus] ${this.#completed.toLocaleString('en-US')}/${this.#total.toLocaleString('en-US')} (${pct}%) · ` +
        `${this.#failed} failed · ${elapsed.toFixed(0)}s · ${rate.toFixed(0)}/s\n`,
    )
  }
}
