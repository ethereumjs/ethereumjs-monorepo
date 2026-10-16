import fs from 'node:fs'
import path from 'node:path'

import type { CaseResult } from './types.ts'

export const CI_CONSENSUS_ARTIFACT_PREFIX = 'consensus-est-failures'
export const CI_BOGOTA_ARTIFACT_PREFIX = 'consensus-bogota-failures'

export const CI_FAILURE_ARTIFACT_PREFIXES = [
  CI_CONSENSUS_ARTIFACT_PREFIX,
  CI_BOGOTA_ARTIFACT_PREFIX,
] as const

export type FailuresDocument = {
  failures: CaseResult[]
}

function failureKey(f: Pick<CaseResult, 'fork' | 'id' | 'filePath'>): string {
  return `${f.fork}:${f.id}:${f.filePath}`
}

/** Read a full consensus report or a `{ failures }` document. */
export function readFailuresFromReportFile(filePath: string): CaseResult[] {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as FailuresDocument & {
    failures?: CaseResult[]
    failed?: number
  }
  if (Array.isArray(raw.failures)) return raw.failures
  return []
}

/** Merge fork (or legacy shard) reports; dedupe by fork + id + filePath. */
export function mergeFailureReports(filePaths: string[]): FailuresDocument {
  const byKey = new Map<string, CaseResult>()
  for (const p of filePaths) {
    if (!fs.existsSync(p)) continue
    for (const f of readFailuresFromReportFile(p)) {
      byKey.set(failureKey(f), f)
    }
  }
  return { failures: [...byKey.values()] }
}

export function writeFailuresDocument(outPath: string, doc: FailuresDocument): void {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`)
}
