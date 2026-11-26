import { type Devp2pWorkerClient, EthyMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, intToUnpaddedBytes } from '@ethereumjs/util'

import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'

/** Background ETHY/0 code + storage plane sync for custody buckets (WP-16d). */
export class EthyCodeStorageSynchronizer {
  private readonly spine: EthySpine
  private readonly client: Devp2pWorkerClient
  private readonly snapStore?: SnapPivotStore
  private running = false

  constructor(opts: {
    spine: EthySpine
    client: Devp2pWorkerClient
    stateManager: FlatStateManager
    snapStore?: SnapPivotStore
    buckets: number[]
  }) {
    this.spine = opts.spine
    this.client = opts.client
    this.snapStore = opts.snapStore
    void opts.stateManager
    void opts.buckets
  }

  start(): void {
    this.running = true
    this.spine.custodyBackgroundActive = true
    if (this.snapStore !== undefined) {
      const root = this.snapStore.activePivotRootDir()
      if (root !== undefined) {
        this.client.setSharedCodeDir(`${root}/code`)
        this.client.setEthyStorageDir(`${root}/storage`)
      }
    }
  }

  stop(): void {
    this.running = false
    this.spine.custodyBackgroundActive = false
  }

  isRunning(): boolean {
    return this.running
  }

  requestCode(peerId: string, reqId: bigint, codeHash: Uint8Array): void {
    if (!this.running) return
    this.client.sendEthyMessage(
      peerIdToBytes(peerId),
      EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE,
      RLP.encode([bigIntToUnpaddedBytes(reqId), intToUnpaddedBytes(0), [codeHash]] as never),
    )
  }

  /** Inbound ETHY responses for background code/storage fetch (stub until full verify). */
  handleEthyResponse(_peerId: string, _code: number, _payload: Uint8Array): void {
    void _peerId
    void _code
    void _payload
  }
}
