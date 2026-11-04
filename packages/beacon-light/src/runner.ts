import type { Common } from '@ethereumjs/common'
import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'

import type { BeaconLightClient } from './client.ts'
import type { BeaconLightStore } from './store.ts'
import type { BeaconLightTransport } from './transport.ts'

export type LightClientPollResult = {
  optimisticApplied: boolean
  finalityApplied: boolean
  updatesApplied: number
  participantCount: number
  error?: string
}

export type LightClientRunnerOpts = {
  common: Common
  client: BeaconLightClient
  transport: BeaconLightTransport
  store?: BeaconLightStore
}

export class LightClientRunner {
  private readonly common: Common
  private readonly client: BeaconLightClient
  private readonly transport: BeaconLightTransport
  private readonly store?: BeaconLightStore
  private finalityPollCounter = 0

  constructor(opts: LightClientRunnerOpts) {
    this.common = opts.common
    this.client = opts.client
    this.transport = opts.transport
    this.store = opts.store
  }

  tryRestoreFromStore(): boolean {
    if (this.store === undefined) return false
    const snap = this.store.load()
    if (snap === undefined || !snap.bootstrapped) return false
    this.client.importState(snap)
    return true
  }

  persist(): void {
    if (this.store === undefined || !this.client.isBootstrapped()) return
    this.store.save(this.client.exportState())
  }

  async ensureBootstrapped(checkpointRootHex?: string): Promise<void> {
    if (this.client.isBootstrapped()) return
    if (this.tryRestoreFromStore()) return

    const root =
      checkpointRootHex ??
      this.common.beaconLightClient()?.defaultCheckpointRoot ??
      (await this.transport.discoverBootstrapBlockRoot())
    const bootstrap = await this.transport.fetchBootstrap(root)
    this.client.bootstrap(bootstrap)
    this.persist()
  }

  async catchUpUpdates(maxCount = 4): Promise<number> {
    if (!this.client.isBootstrapped()) return 0
    const head = this.client.getFinalizedExecution()
    const slot = head?.slot ?? 0
    const period = this.common.syncCommitteePeriodAtSlot(slot)
    let applied = 0
    try {
      const updates = await this.transport.fetchUpdates(period, maxCount)
      for (const update of updates) {
        try {
          this.client.applyUpdate(update)
          applied++
        } catch {
          // skip invalid update entries from untrusted REST
        }
      }
    } catch {
      // updates are optional on resume
    }
    if (applied > 0) this.persist()
    return applied
  }

  async pollOnce(): Promise<LightClientPollResult> {
    if (!this.client.isBootstrapped()) {
      throw EthereumJSErrorWithoutCode('light client not bootstrapped')
    }
    let optimisticApplied = false
    let finalityApplied = false
    let participantCount = 0
    try {
      const opt = await this.transport.fetchOptimisticUpdate()
      try {
        const optResult = this.client.applyOptimisticUpdate(opt)
        optimisticApplied = optResult.optimisticUpdated
      } catch (applyErr) {
        return {
          optimisticApplied: false,
          finalityApplied: false,
          updatesApplied: 0,
          participantCount: 0,
          error: (applyErr as Error).message,
        }
      }
    } catch (e) {
      return {
        optimisticApplied: false,
        finalityApplied: false,
        updatesApplied: 0,
        participantCount: 0,
        error: (e as Error).message,
      }
    }

    this.finalityPollCounter++
    const slotsPerEpoch = this.common.beaconLightClient()?.slotsPerEpoch ?? 32
    if (this.finalityPollCounter >= slotsPerEpoch) {
      this.finalityPollCounter = 0
      try {
        const fin = await this.transport.fetchFinalityUpdate()
        const finResult = this.client.applyFinalityUpdate(fin)
        finalityApplied = finResult.finalizedUpdated || finResult.periodAdvanced
      } catch {
        // finality may lag; optimistic still counts
      }
    }

    const updatesApplied = await this.catchUpUpdates(2)
    const head = this.client.getHeadExecution()
    if (head !== undefined) participantCount = head.participantCount
    this.persist()
    return { optimisticApplied, finalityApplied, updatesApplied, participantCount }
  }
}
