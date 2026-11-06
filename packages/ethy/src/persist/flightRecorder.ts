import * as fs from 'node:fs'
import * as path from 'node:path'

import { computeSnapProgressPct, snapBucketsDoneCount } from '../spine/buckets.ts'
import type { DiagnosticEvent, EthySpine } from '../spine/types.ts'
import { networkPersistDir } from './peerBook.ts'

/** Cap each log file at 4 MiB, rotating once (`*.log` -> `*.1.log`). */
export const MAX_LOG_FILE_BYTES = 4 * 1024 * 1024
export const PULSE_LOG_INTERVAL_MS = 5_000

export type FlightRecorderPaths = {
  logsDir: string
  generalLogPath: string
  errorsLogPath: string
  jsonlLogPath: string
}

export function flightRecorderPaths(dataDir: string, network: string): FlightRecorderPaths {
  const logsDir = path.join(networkPersistDir(dataDir, network), 'logs')
  return {
    logsDir,
    generalLogPath: path.join(logsDir, 'ethy.log'),
    errorsLogPath: path.join(logsDir, 'errors.log'),
    jsonlLogPath: path.join(logsDir, 'events.jsonl'),
  }
}

function rotateIfOverCap(filePath: string, maxBytes: number): void {
  try {
    if (!fs.existsSync(filePath)) return
    const stat = fs.statSync(filePath)
    if (stat.size < maxBytes) return
    const backup = filePath.replace(/(\.[^.]+)$/, '.1$1')
    fs.renameSync(filePath, backup)
  } catch {
    // ignore rotation race
  }
}

function formatHumanLine(
  iso: string,
  level: string,
  subsystem: string,
  message: string,
  extra?: string,
): string {
  const suffix = extra !== undefined && extra.length > 0 ? ` (${extra})` : ''
  return `${iso} [${level.toUpperCase().padEnd(5, ' ')}] [${subsystem.padEnd(6, ' ')}] ${message}${suffix}\n`
}

export type FlightRecorderOpts = {
  dataDir: string
  network: string
  spine: EthySpine
  enabled?: boolean
  maxFileBytes?: number
  pulseIntervalMs?: number
}

/**
 * Asynchronous size-capped Flight Recorder writing human-readable (`ethy.log`, `errors.log`)
 * and AI-agent-friendly structured NDJSON (`events.jsonl`) logs under `networks/<net>/logs/`.
 */
export class EthyFlightRecorder {
  readonly paths: FlightRecorderPaths
  private readonly spine: EthySpine
  private readonly enabled: boolean
  private readonly maxFileBytes: number
  private readonly pulseIntervalMs: number
  private generalQueue: string[] = []
  private errorQueue: string[] = []
  private jsonlQueue: string[] = []
  private flushScheduled = false
  private pulseTimer?: ReturnType<typeof setInterval>
  private lastPhase?: string
  private lastPivot?: bigint

  constructor(opts: FlightRecorderOpts) {
    this.paths = flightRecorderPaths(opts.dataDir, opts.network)
    this.spine = opts.spine
    this.enabled = opts.enabled ?? true
    this.maxFileBytes = opts.maxFileBytes ?? MAX_LOG_FILE_BYTES
    this.pulseIntervalMs = opts.pulseIntervalMs ?? PULSE_LOG_INTERVAL_MS
  }

  start(): void {
    if (!this.enabled) return
    try {
      fs.mkdirSync(this.paths.logsDir, { recursive: true })
    } catch {
      return
    }
    this.recordSnapshot('session_start', 'Ethy session started')
    this.pulseTimer = setInterval(() => {
      this.recordPulse()
    }, this.pulseIntervalMs)
    this.pulseTimer.unref?.()
  }

  stop(): void {
    if (this.pulseTimer !== undefined) {
      clearInterval(this.pulseTimer)
      this.pulseTimer = undefined
    }
    if (!this.enabled) return
    this.recordSnapshot('session_stop', 'Ethy session stopped')
    this.flushSync()
  }

  recordDiagnostic(entry: DiagnosticEvent): void {
    if (!this.enabled) return
    const iso = new Date(entry.timestamp).toISOString()
    const peerExtra = entry.peerId !== undefined ? `peer=${entry.peerId.slice(0, 12)}` : undefined
    const bucketExtra = entry.bucketIndex !== undefined ? `bucket=${entry.bucketIndex}` : undefined
    const extra = [peerExtra, bucketExtra].filter(Boolean).join(' ')
    const line = formatHumanLine(iso, entry.severity, entry.subsystem, entry.message, extra)
    this.generalQueue.push(line)
    if (entry.severity === 'warn' || entry.severity === 'error' || entry.severity === 'anomaly') {
      this.errorQueue.push(line)
    }
    const jsonRow = {
      ts: iso,
      kind: 'diag',
      sev: entry.severity,
      sub: entry.subsystem,
      msg: entry.message,
      ...(entry.peerId !== undefined ? { peer: entry.peerId.slice(0, 16) } : {}),
      ...(entry.bucketIndex !== undefined ? { bucket: entry.bucketIndex } : {}),
      phase: this.spine.phase,
      accounts: this.spine.totalAccountsSynced,
      rate: Math.round(this.spine.accountsPerSec),
      pivot: this.spine.pivotBlockNumber?.toString(),
    }
    this.jsonlQueue.push(`${JSON.stringify(jsonRow)}\n`)
    this.scheduleFlush()
  }

  recordPulse(): void {
    if (!this.enabled) return
    const s = this.spine
    const iso = new Date().toISOString()
    const peers = [...s.peers.values()]
    const snapPeers = peers.filter((p) => p.snapSession === true).length
    const servingSnap = peers.filter((p) => p.snapSession === true && p.snapResponsesOk > 0).length
    const ethyPeers = peers.filter((p) => p.ethySession === true).length
    const doneBuckets = snapBucketsDoneCount(s.snapBuckets)
    const stalledBuckets = s.snapBuckets.filter((b) => b.status === 'stalled').map((b) => b.prefix)
    const pct = Math.round(computeSnapProgressPct(s) * 10) / 10
    const rate = Math.round(s.accountsPerSec)

    const phaseChanged = s.phase !== this.lastPhase
    const pivotChanged = s.pivotBlockNumber !== this.lastPivot
    this.lastPhase = s.phase
    this.lastPivot = s.pivotBlockNumber

    const resting = s.snapPeersResting ?? 0
    const summary = `phase=${s.phase} transport=${s.syncTransport ?? 'unset'} pct=${pct}% acc=${s.totalAccountsSynced} rate=${rate}/s buckets=${doneBuckets}/16 peers=${peers.length}(snap:${snapPeers},serving:${servingSnap},resting:${resting},ethy:${ethyPeers}) pivot=${s.pivotBlockNumber?.toString() ?? '-'} steps=${s.pivotStepsCompleted ?? 0} bal=${s.streamedBalCount ?? 0}/${s.appliedBalCount ?? 0} cl=${s.clStatus ?? '-'}`
    this.generalQueue.push(
      formatHumanLine(
        iso,
        phaseChanged || pivotChanged ? 'info' : 'pulse',
        'spine',
        summary,
        stalledBuckets.length > 0 ? `stalled=${stalledBuckets.join(',')}` : undefined,
      ),
    )

    const jsonRow = {
      ts: iso,
      kind: 'pulse',
      phase: s.phase,
      transport: s.syncTransport ?? 'unset',
      pct,
      accounts: s.totalAccountsSynced,
      rate,
      rateMin: Math.round(s.accountsPerMin ?? 0),
      etaMin: s.snapEtaMinutes !== undefined ? Math.round(s.snapEtaMinutes * 10) / 10 : undefined,
      bucketsDone: doneBuckets,
      stalled: stalledBuckets,
      peers: {
        total: peers.length,
        snap: snapPeers,
        servingSnap,
        resting,
        ethy: ethyPeers,
      },
      pivot: s.pivotBlockNumber?.toString(),
      pivotSteps: s.pivotStepsCompleted ?? 0,
      balStreamed: s.streamedBalCount ?? 0,
      balApplied: s.appliedBalCount ?? 0,
      cl: s.clStatus ?? 'p2p_only',
      rlpx: s.discovery?.rlpx
        ? {
            dials: s.discovery.rlpx.dials,
            conn: s.discovery.rlpx.connected,
            statusOk: s.discovery.rlpx.statusOk,
            slotsReject: s.discovery.rlpx.handshakeRejects?.slots ?? 0,
          }
        : undefined,
    }
    this.jsonlQueue.push(`${JSON.stringify(jsonRow)}\n`)
    this.scheduleFlush()
  }

  private recordSnapshot(kind: 'session_start' | 'session_stop', msg: string): void {
    const iso = new Date().toISOString()
    this.generalQueue.push(formatHumanLine(iso, 'info', 'node', msg))
    this.jsonlQueue.push(
      `${JSON.stringify({
        ts: iso,
        kind,
        network: this.spine.network,
        phase: this.spine.phase,
        accounts: this.spine.totalAccountsSynced,
      })}\n`,
    )
    this.scheduleFlush()
  }

  private scheduleFlush(): void {
    if (this.flushScheduled) return
    this.flushScheduled = true
    setTimeout(() => {
      this.flushScheduled = false
      void this.flushAsync()
    }, 250).unref?.()
  }

  private async flushAsync(): Promise<void> {
    if (this.generalQueue.length > 0) {
      const batch = this.generalQueue.join('')
      this.generalQueue = []
      rotateIfOverCap(this.paths.generalLogPath, this.maxFileBytes)
      await fs.promises.appendFile(this.paths.generalLogPath, batch).catch(() => {})
    }
    if (this.errorQueue.length > 0) {
      const batch = this.errorQueue.join('')
      this.errorQueue = []
      rotateIfOverCap(this.paths.errorsLogPath, this.maxFileBytes)
      await fs.promises.appendFile(this.paths.errorsLogPath, batch).catch(() => {})
    }
    if (this.jsonlQueue.length > 0) {
      const batch = this.jsonlQueue.join('')
      this.jsonlQueue = []
      rotateIfOverCap(this.paths.jsonlLogPath, this.maxFileBytes)
      await fs.promises.appendFile(this.paths.jsonlLogPath, batch).catch(() => {})
    }
  }

  flushSync(): void {
    try {
      fs.mkdirSync(this.paths.logsDir, { recursive: true })
      if (this.generalQueue.length > 0) {
        const batch = this.generalQueue.join('')
        this.generalQueue = []
        rotateIfOverCap(this.paths.generalLogPath, this.maxFileBytes)
        fs.appendFileSync(this.paths.generalLogPath, batch)
      }
      if (this.errorQueue.length > 0) {
        const batch = this.errorQueue.join('')
        this.errorQueue = []
        rotateIfOverCap(this.paths.errorsLogPath, this.maxFileBytes)
        fs.appendFileSync(this.paths.errorsLogPath, batch)
      }
      if (this.jsonlQueue.length > 0) {
        const batch = this.jsonlQueue.join('')
        this.jsonlQueue = []
        rotateIfOverCap(this.paths.jsonlLogPath, this.maxFileBytes)
        fs.appendFileSync(this.paths.jsonlLogPath, batch)
      }
    } catch {
      // ignore on shutdown
    }
  }
}
