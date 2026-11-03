import v8 from 'node:v8'

import type { FlatStateManager } from '@ethereumjs/statemanager'

import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'

const WATCH_INTERVAL_MS = 2_000
const HEAP_PRESSURE_RATIO = 0.65

export type ResourceBudgetOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  maxResidentAccounts: number
}

/** Samples V8 heap pressure and trims unpinned resident snap accounts (WP-04g). */
export class ResourceBudgetWatchdog {
  private readonly spine: EthySpine
  private readonly stateManager: FlatStateManager
  private readonly maxResidentAccounts: number
  private timer?: ReturnType<typeof setInterval>

  constructor(opts: ResourceBudgetOpts) {
    this.spine = opts.spine
    this.stateManager = opts.stateManager
    this.maxResidentAccounts = opts.maxResidentAccounts
  }

  start(): void {
    if (this.timer !== undefined) return
    this.timer = setInterval(() => this.tick(), WATCH_INTERVAL_MS)
    this.timer.unref?.()
  }

  stop(): void {
    if (this.timer === undefined) return
    clearInterval(this.timer)
    this.timer = undefined
  }

  private tick(): void {
    const mem = process.memoryUsage()
    const stats = v8.getHeapStatistics()
    const limit = stats.heap_size_limit
    if (limit <= 0) return
    const ratio = mem.heapUsed / limit
    if (ratio <= HEAP_PRESSURE_RATIO) return
    const target = Math.floor(this.maxResidentAccounts * 0.25)
    const freed = this.stateManager.trimUnpinnedResident(target)
    if (freed > 0) {
      const heapMb = Math.round(mem.heapUsed / (1024 * 1024))
      recordDiagnostic(this.spine, {
        subsystem: 'snap',
        severity: 'warn',
        message: `Memory watchdog trimmed resident state cache (heap ${heapMb} MB)`,
      })
    }
  }
}
