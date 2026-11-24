#!/usr/bin/env tsx
/**
 * Summarize ai-runs.jsonl and tail llama-server.log under an Ethy data dir.
 * Usage: tsx scripts/inspect-ai-runs.ts <dataDir> [network] [limit]
 */
import * as fs from 'node:fs'
import * as path from 'node:path'

import { flightRecorderPaths } from '../src/persist/flightRecorder.ts'
import type { AiRunTraceRecord } from '../src/ai/aiRunTrace.ts'
import { llamaServerLogPath, tailTextFile } from '../src/ai/aiRunTrace.ts'

const dataDir = process.argv[2]
if (dataDir === undefined || dataDir.length === 0) {
  console.error('Usage: inspect-ai-runs.ts <dataDir> [network] [limit]')
  process.exit(1)
}
const network = process.argv[3] ?? 'mainnet'
const limit = Math.min(50, Math.max(1, Number(process.argv[4] ?? 12) || 12))

const runsPath = path.join(flightRecorderPaths(dataDir, network).logsDir, 'ai-runs.jsonl')
if (!fs.existsSync(runsPath)) {
  console.log(`No ${runsPath}`)
  process.exit(0)
}

const lines = fs.readFileSync(runsPath, 'utf8').trim().split('\n').filter(Boolean)
const rows: AiRunTraceRecord[] = []
for (const line of lines.slice(-limit)) {
  try {
    rows.push(JSON.parse(line) as AiRunTraceRecord)
  } catch {
    // skip corrupt
  }
}

console.log(`\n=== AI runs (${network}) last ${rows.length} ===\n`)
for (const r of rows) {
  const beat = (r.director as { beat?: string } | undefined)?.beat ?? '—'
  const model = r.modelLabel ?? r.modelTier
  const head = (r.headline ?? r.fallbackReason ?? '—').slice(0, 48)
  console.log(
    `${new Date(r.ts).toISOString()} ${r.source.padEnd(8)} ${r.trigger.padEnd(8)} beat=${beat} ${model} ${(r.totalLatencyMs / 1000).toFixed(1)}s ${head}`,
  )
  const errs = r.llmCalls.filter((c) => c.errorKind !== undefined)
  if (errs.length > 0) {
    for (const e of errs) {
      console.log(`  llm ${e.stage}: ${e.errorKind} ${(e.errorMessage ?? '').slice(0, 60)}`)
    }
  }
}

const llama = llamaServerLogPath(dataDir, network)
const tail = tailTextFile(llama, 8)
if (tail.length > 0) {
  console.log(`\n=== llama-server tail ===\n`)
  for (const l of tail) console.log(l)
}