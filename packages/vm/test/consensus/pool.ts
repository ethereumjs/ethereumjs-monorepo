import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'

import { runCases } from './cases/runFile.ts'
import { groupCasesByFile } from './select.ts'
import type { CaseResult, ConsensusTestCase } from './types.ts'

function chunkFiles<T>(entries: T[], jobs: number): T[][] {
  if (jobs <= 1) return [entries]
  const buckets: T[][] = Array.from({ length: jobs }, () => [])
  entries.forEach((entry, i) => {
    buckets[i % jobs].push(entry)
  })
  return buckets.filter((b) => b.length > 0)
}

function runWorker(cases: ConsensusTestCase[], rootLabel: string): Promise<CaseResult[]> {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'worker.ts')
    const worker = new Worker(workerPath, {
      workerData: { cases, rootLabel },
      execArgv: ['--import', 'tsx/esm'],
    })
    let settled = false
    worker.on('message', (msg: { results: CaseResult[] }) => {
      settled = true
      resolve(msg.results)
    })
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (!settled && code !== 0) reject(new Error(`Worker exited ${code}`))
    })
  })
}

export async function runCasePool(
  cases: ConsensusTestCase[],
  rootLabel: string,
  jobs: number,
): Promise<CaseResult[]> {
  if (cases.length === 0) return []
  if (jobs <= 1) {
    return runCases(cases, rootLabel)
  }

  const byFile = groupCasesByFile(cases)
  const fileGroups = chunkFiles([...byFile.entries()], jobs)
  const batches = fileGroups.map((group) => group.flatMap(([, fileCases]) => fileCases))

  const parts = await Promise.all(batches.map((batch) => runWorker(batch, rootLabel)))
  return parts.flat()
}
