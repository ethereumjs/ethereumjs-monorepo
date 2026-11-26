import {
  EthyChunkStore,
  EthyMessageCodeNames,
  EthyMessageCodes,
  type EthyStorageStore,
  EthySubtreeRootBook,
  type EthyWitnessStore,
  RollingBlockStore,
  type SharedCodeDisk,
  SnapMessageCodes,
  tryServeEthyGet,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import {
  CustodyStateResolver,
  createCustodyResolverHooks,
} from '../../src/custody/custodyStateResolver.ts'
import type { EthySpine } from '../../src/spine/types.ts'
import type { StatyWriteIndex } from '../../src/staty/writeIndex.ts'
import type { SeedDemoStateResult } from '../../src/sync/seedDemoState.ts'

const CUSTODIAN_NODE_ID = new Uint8Array(32).fill(0xcd)

export type CustodyLoopbackHandles = {
  resolver: CustodyStateResolver
  ethySendCount: () => number
  snapSendCount: () => number
  stateManager: ReturnType<typeof createFlatStateManager>
}

export function custodianPeerId(): string {
  return `0x${bytesToUnprefixedHex(CUSTODIAN_NODE_ID)}`
}

export function stubCustodianPeer(bucket: number, pivotBlock: bigint) {
  const mask = 1 << bucket
  return {
    id: custodianPeerId(),
    clientId: 'custody-loopback',
    caps: [],
    ethySession: true,
    ethyStatus: {
      basePivotBlock: pivotBlock.toString(),
      basePivotStateRoot: `${'aa'.repeat(64)}`,
      bucketsBitmask: `0x${mask.toString(16)}`,
      codeBucketsBitmask: '0xffff',
      storageBucketsBitmask: '0xffff',
      balEarliestBlock: '0',
      balLatestBlock: pivotBlock.toString(),
      latestBlockHash: `${'bb'.repeat(64)}`,
    },
  }
}

export function createCustodyLoopback(opts: {
  seed: SeedDemoStateResult
  spine: EthySpine
  writeIndex: StatyWriteIndex
  bucket: number
  chunks: EthyChunkStore
  storageStore: EthyStorageStore
  codeDisk: SharedCodeDisk
  witnessStore: EthyWitnessStore
  witnessBatchWindowMs?: number
}): CustodyLoopbackHandles {
  const peerId = custodianPeerId()
  let ethySends = 0
  let snapSends = 0

  const resolver = new CustodyStateResolver({
    getClient: () =>
      ({
        sendEthyMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
          if (
            code === SnapMessageCodes.GET_ACCOUNT_RANGE ||
            code === SnapMessageCodes.GET_STORAGE_RANGES
          ) {
            snapSends += 1
            return
          }
          ethySends += 1
          const name = EthyMessageCodeNames[code as EthyMessageCodes]
          if (!name.startsWith('GET_')) return
          const decoded = RLP.decode(payload) as unknown
          const served = tryServeEthyGet(
            opts.chunks,
            new RollingBlockStore(),
            [],
            CUSTODIAN_NODE_ID,
            undefined,
            name,
            decoded,
            opts.codeDisk,
            opts.storageStore,
            {
              witnessStore: opts.witnessStore,
              subtreeBook: new EthySubtreeRootBook(),
              remoteBucketsBitmask: 0xffff,
              witnessThrottle: { windowStartMs: 0, count: 0 },
            },
          )
          if (served === undefined) return
          resolver.handleEthyResponse(peerId, served.code, RLP.encode(served.rlp as never))
        },
      }) as never,
    getPeers: () => [stubCustodianPeer(opts.bucket, opts.seed.pivotBlock)],
    spine: opts.spine,
    writeIndex: opts.writeIndex,
    snapBootstrapEnabled: false,
    balEarliestBlock: () => 0n,
    witnessBatchWindowMs: opts.witnessBatchWindowMs ?? 0,
  })

  const stateManager = createFlatStateManager({
    closedBucketsMask: 0x0000,
    resolutionPolicy: 'full',
    ...createCustodyResolverHooks(resolver),
  })

  return {
    resolver,
    ethySendCount: () => ethySends,
    snapSendCount: () => snapSends,
    stateManager,
  }
}
