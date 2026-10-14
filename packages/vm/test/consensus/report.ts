import fs from 'node:fs'
import path from 'node:path'

import type { CaseResult } from './types.ts'

export type ConsensusReport = {
  rootLabel: string
  passed: number
  failed: number
  total: number
  durationMs: number
  byFork: Record<string, { pass: number; fail: number }>
  byFormat: Record<string, { pass: number; fail: number }>
  failures: CaseResult[]
}

export function buildReport(
  rootLabel: string,
  results: CaseResult[],
  durationMs: number,
): ConsensusReport {
  const byFork: Record<string, { pass: number; fail: number }> = {}
  const byFormat: Record<string, { pass: number; fail: number }> = {}
  const failures: CaseResult[] = []

  for (const r of results) {
    byFork[r.fork] ??= { pass: 0, fail: 0 }
    byFormat[r.format] ??= { pass: 0, fail: 0 }
    if (r.pass) {
      byFork[r.fork].pass++
      byFormat[r.format].pass++
    } else {
      byFork[r.fork].fail++
      byFormat[r.format].fail++
      failures.push(r)
    }
  }

  const passed = results.filter((r) => r.pass).length
  return {
    rootLabel,
    passed,
    failed: results.length - passed,
    total: results.length,
    durationMs,
    byFork,
    byFormat,
    failures,
  }
}

export function printReport(report: ConsensusReport, jobs: number): void {
  const { passed, failed, total, durationMs } = report
  process.stdout.write(
    `\nConsensus: ${jobs} worker(s) · ${passed} passed · ${failed} failed · ${total} total · ${(durationMs / 1000).toFixed(1)}s\n`,
  )

  if (failed > 0) {
    process.stdout.write('\nFailures (first 20):\n')
    for (const f of report.failures.slice(0, 20)) {
      process.stdout.write(
        `  ${f.fork} ${f.format} ${f.id}\n    ${f.error?.split('\n')[0] ?? ''}\n`,
      )
    }
  }

  process.stdout.write('\nPer fork:\n')
  for (const [fork, counts] of Object.entries(report.byFork).sort()) {
    process.stdout.write(`  ${fork}: ${counts.pass} pass, ${counts.fail} fail\n`)
  }
}

export function writeReportJson(reportPath: string, report: ConsensusReport): void {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
}

export function printListCounts(cases: { fork: string; format: string }[]): void {
  const byFork: Record<string, number> = {}
  const byFormat: Record<string, number> = {}
  for (const c of cases) {
    byFork[c.fork] = (byFork[c.fork] ?? 0) + 1
    byFormat[c.format] = (byFormat[c.format] ?? 0) + 1
  }
  process.stdout.write(`Selected ${cases.length} cases\n`)
  for (const [fork, n] of Object.entries(byFork).sort()) {
    process.stdout.write(`  ${fork}: ${n}\n`)
  }
  for (const [format, n] of Object.entries(byFormat).sort()) {
    process.stdout.write(`  ${format}: ${n}\n`)
  }
}
