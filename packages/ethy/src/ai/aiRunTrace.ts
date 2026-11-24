import * as fs from 'node:fs'
import * as path from 'node:path'

import { flightRecorderPaths } from '../persist/flightRecorder.ts'

export type AiRunTrigger = 'welcome' | 'pulse' | 'manual' | 'interactive'

export type AiRunSource = 'llm' | 'fallback'

export type AiLlmCallTrace = {
  stage: 'scout' | 'story' | 'intent'
  promptChars: number
  maxTokens: number
  temperature: number
  responseMode: string
  timeoutMs: number
  httpStatus?: number
  durationMs: number
  rawOutputChars: number
  rawOutputPreview?: string
  reasoningChars?: number
  parsedOk: boolean
  errorKind?: string
  errorMessage?: string
}

export type AiRunTraceRecord = {
  runId: string
  ts: number
  trigger: AiRunTrigger
  network: string
  blockNumber?: string
  aiMode: string
  modelLabel?: string
  modelTier: string
  baseUrl?: string
  director?: Record<string, unknown>
  dossier?: Record<string, unknown>
  toolCalls?: Array<{
    name: string
    durationMs?: number
    ok?: boolean
    error?: string
  }>
  llmCalls: AiLlmCallTrace[]
  source: AiRunSource
  fallbackReason?: string
  headline?: string
  bodyChars?: number
  pointersCount?: number
  totalLatencyMs: number
}

const AI_RUNS_MAX_BYTES = 5 * 1024 * 1024
const RAW_PREVIEW_CAP = 4096

export type AiRunLog = {
  append: (record: AiRunTraceRecord) => void
  readRecent: (limit: number) => AiRunTraceRecord[]
}

function rotateIfNeeded(filePath: string, maxBytes: number): void {
  try {
    if (!fs.existsSync(filePath)) return
    if (fs.statSync(filePath).size < maxBytes) return
    const backup = filePath.replace(/\.jsonl$/, '.1.jsonl')
    if (fs.existsSync(backup)) fs.unlinkSync(backup)
    fs.renameSync(filePath, backup)
  } catch {
    // ignore rotation race
  }
}

export function capRawPreview(raw: string): string {
  if (raw.length <= RAW_PREVIEW_CAP) return raw
  return `${raw.slice(0, RAW_PREVIEW_CAP)}…`
}

function safeParseLine(line: string): AiRunTraceRecord | undefined {
  try {
    return JSON.parse(line) as AiRunTraceRecord
  } catch {
    return undefined
  }
}

export function createAiRunLog(dataDir: string | undefined, network: string): AiRunLog {
  if (dataDir === undefined) {
    return { append: () => {}, readRecent: () => [] }
  }
  const filePath = path.join(flightRecorderPaths(dataDir, network).logsDir, 'ai-runs.jsonl')
  const queue: string[] = []
  let flushScheduled = false

  const flush = () => {
    flushScheduled = false
    if (queue.length === 0) return
    rotateIfNeeded(filePath, AI_RUNS_MAX_BYTES)
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.appendFileSync(filePath, queue.splice(0, queue.length).join(''))
    } catch {
      // ignore disk errors on narrator path
    }
  }

  return {
    append(record: AiRunTraceRecord) {
      queue.push(`${JSON.stringify(record)}\n`)
      if (!flushScheduled) {
        flushScheduled = true
        setImmediate(flush)
      }
    },
    readRecent(limit: number): AiRunTraceRecord[] {
      if (!fs.existsSync(filePath)) return []
      try {
        const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n')
        const out: AiRunTraceRecord[] = []
        for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
          const row = safeParseLine(lines[i]!)
          if (row !== undefined) out.push(row)
        }
        return out.reverse()
      } catch {
        return []
      }
    },
  }
}

export function llamaServerLogPath(dataDir: string, network: string): string {
  return path.join(flightRecorderPaths(dataDir, network).logsDir, 'llama-server.log')
}

export function tailTextFile(filePath: string, maxLines: number): string[] {
  if (!fs.existsSync(filePath)) return []
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const lines = raw.split('\n').filter((l) => l.length > 0)
    return lines.slice(-maxLines)
  } catch {
    return []
  }
}
