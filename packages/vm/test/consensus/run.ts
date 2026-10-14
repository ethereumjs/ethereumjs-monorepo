#!/usr/bin/env node
import fs from 'node:fs'

import { parseRunnerArgv } from './cli.ts'
import { runCasePool } from './pool.ts'
import { buildReport, printListCounts, printReport, writeReportJSON } from './report.ts'
import { selectTestCases } from './select.ts'
import type { ConsensusTestCase } from './types.ts'

async function loadRerunCases(path: string): Promise<Partial<ConsensusTestCase>[]> {
  const raw = JSON.parse(fs.readFileSync(path, 'utf8')) as { failures?: ConsensusTestCase[] }
  return raw.failures ?? []
}

async function main(): Promise<number> {
  const options = parseRunnerArgv(process.argv.slice(2))
  let { cases, rootLabel } = await selectTestCases(options)

  if (options.rerunFailedPath !== undefined) {
    const failed = await loadRerunCases(options.rerunFailedPath)
    const keys = new Set(failed.map((f) => `${f.fork}:${f.id}:${f.filePath}`))
    cases = cases.filter((c) => keys.has(`${c.fork}:${c.id}:${c.filePath}`))
  }

  if (options.list) {
    printListCounts(cases)
    return 0
  }

  if (cases.length === 0) {
    process.stderr.write('No test cases selected.\n')
    return 0
  }

  const start = performance.now()
  const results = await runCasePool(cases, rootLabel, options.jobs)
  const durationMs = performance.now() - start

  const report = buildReport(rootLabel, results, durationMs)
  printReport(report, options.jobs)

  if (options.reportPath !== undefined) {
    writeReportJSON(options.reportPath, report)
  }

  if (report.failed > 0) {
    if (options.bail) return 1
    return 1
  }
  return 0
}

main()
  .then((code) => {
    process.exit(code)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
