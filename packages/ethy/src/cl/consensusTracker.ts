import {
  BeaconLightStore,
  BeaconLightTransport,
  LightClientRunner,
  createBeaconLightClient,
  defaultLightClientPath,
} from '@ethereumjs/beacon-light'
import { Common } from '@ethereumjs/common'
import { bytesToHex, equalsBytes } from '@ethereumjs/util'

import { chainConfigForNetwork } from '../net/chainHardfork.ts'
import type { NoticeBoard } from '../notify/board.ts'
import { raiseBestPeerHead } from '../spine/chainHead.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'

export type ConsensusTrackerOpts = {
  spine: EthySpine
  network: string
  dataDir?: string
  notices?: NoticeBoard
  fetchImpl?: typeof fetch
  disabled?: boolean
  pollIntervalMs?: number
  onOptimisticHead?: (blockNumber: bigint, slot: number) => void
}

export type ConsensusTrackerHandle = {
  stop: () => void
  notePeerHeader: (blockNumber: bigint, blockHash: Uint8Array) => void
}

export function syncSpineFromClient(
  spine: EthySpine,
  common: Common,
  client: ReturnType<typeof createBeaconLightClient>,
  endpoint?: string,
  onOptimisticHead?: (blockNumber: bigint, slot: number) => void,
): void {
  const head = client.getHeadExecution()
  const fin = client.getFinalizedExecution()
  if (head === undefined) {
    spine.clStatus = spine.clStatus === 'mismatch' ? 'mismatch' : 'syncing'
    return
  }
  spine.clStatus = spine.clStatus === 'mismatch' ? 'mismatch' : 'verified'
  spine.clOptimisticSlot = head.slot
  spine.currentSlot = head.slot
  if (head.blockNumber > 0) {
    const bn = BigInt(head.blockNumber)
    const prevBest = spine.bestPeerHead ?? 0n
    spine.clOptimisticBlockNumber = bn
    if (bn > prevBest) {
      raiseBestPeerHead(spine, bn)
      onOptimisticHead?.(bn, head.slot)
    }
  }
  if (fin !== undefined) {
    spine.clFinalizedSlot = fin.slot
    spine.clFinalizedBlockHash = new Uint8Array(fin.blockHash)
    if (fin.blockNumber > 0) {
      spine.clFinalizedBlockNumber = BigInt(fin.blockNumber)
    }
  }
  if (head.participantCount > 0) {
    spine.clParticipationPct = Math.round((head.participantCount / 512) * 1000) / 10
  }
  spine.clPeriod = common.syncCommitteePeriodAtSlot(head.slot)
  spine.clHeadBlockHash = new Uint8Array(head.blockHash)
  spine.clEndpoint = endpoint
}

export function witnessPeerExecutionHeader(
  spine: EthySpine,
  blockNumber: bigint,
  blockHash: Uint8Array,
  notices?: NoticeBoard,
): void {
  if (
    spine.clFinalizedBlockHash !== undefined &&
    equalsBytes(blockHash, spine.clFinalizedBlockHash)
  ) {
    spine.clFinalizedBlockNumber = blockNumber
  }
  const clHash = spine.clHeadBlockHash
  if (clHash === undefined) return
  if (equalsBytes(blockHash, clHash)) {
    spine.clOptimisticBlockNumber = blockNumber
    spine.clStatus = 'verified'
    notices?.post(
      {
        key: 'cl-verify-ok',
        level: 'info',
        text: `CL verified head #${blockNumber.toString()} (${spine.clParticipationPct ?? '?'}% BLS)`,
        relevantForMs: 12_000,
      },
      Date.now(),
    )
    return
  }
  const clNum = spine.clOptimisticBlockNumber ?? spine.clFinalizedBlockNumber
  if (clNum === undefined || clNum === 0n || blockNumber !== clNum) return
  const expectedHash =
    blockNumber === spine.clOptimisticBlockNumber ? clHash : (spine.clFinalizedBlockHash ?? clHash)
  if (equalsBytes(blockHash, expectedHash)) return
  spine.clStatus = 'mismatch'
  recordDiagnostic(spine, {
    subsystem: 'cl',
    severity: 'error',
    message: `P2P block hash mismatch at #${blockNumber.toString()}: peer ${bytesToHex(blockHash)} vs CL ${bytesToHex(expectedHash)}`,
  })
}

export function startConsensusTracker(opts: ConsensusTrackerOpts): ConsensusTrackerHandle {
  if (opts.disabled === true) {
    return {
      stop: () => {},
      notePeerHeader: (blockNumber, blockHash) =>
        witnessPeerExecutionHeader(opts.spine, blockNumber, blockHash, opts.notices),
    }
  }

  const chain = chainConfigForNetwork(opts.network)
  if (chain.beaconLightClient === undefined) {
    opts.spine.clStatus = 'p2p_only'
    return {
      stop: () => {},
      notePeerHeader: () => {},
    }
  }

  const common = new Common({ chain })
  const client = createBeaconLightClient({ common })
  const transport = new BeaconLightTransport({
    common,
    fetchImpl: opts.fetchImpl,
  })
  const storePath =
    opts.dataDir !== undefined
      ? `${opts.dataDir}/cl/light-client.json`
      : defaultLightClientPath(opts.network)
  const runner = new LightClientRunner({
    common,
    client,
    transport,
    store: new BeaconLightStore(storePath),
  })

  opts.spine.clStatus = 'syncing'
  let stopped = false
  const slotMs = opts.pollIntervalMs ?? (common.beaconLightClient()?.secondsPerSlot ?? 12) * 1000

  const notePeerHeader = (blockNumber: bigint, blockHash: Uint8Array) =>
    witnessPeerExecutionHeader(opts.spine, blockNumber, blockHash, opts.notices)

  void (async () => {
    let liveVerified = false
    try {
      await runner.ensureBootstrapped()
      if (transport.activeEndpoint !== undefined) {
        syncSpineFromClient(
          opts.spine,
          common,
          client,
          transport.activeEndpoint,
          opts.onOptimisticHead,
        )
        liveVerified = true
        opts.notices?.post(
          {
            key: 'cl-ready',
            level: 'info',
            text: 'Consensus light client bootstrapped',
            relevantForMs: 8_000,
          },
          Date.now(),
        )
      }
    } catch (e) {
      opts.spine.clStatus = 'p2p_only'
      recordDiagnostic(opts.spine, {
        subsystem: 'cl',
        severity: 'warn',
        message: `Light client offline: ${(e as Error).message}`,
      })
      return
    }

    while (!stopped) {
      try {
        const res = await runner.pollOnce()
        if (res.error === undefined && transport.activeEndpoint !== undefined) {
          syncSpineFromClient(
            opts.spine,
            common,
            client,
            transport.activeEndpoint,
            opts.onOptimisticHead,
          )
          if (!liveVerified) {
            liveVerified = true
            opts.notices?.post(
              {
                key: 'cl-ready',
                level: 'info',
                text: 'Consensus light client synced to live slot',
                relevantForMs: 8_000,
              },
              Date.now(),
            )
          }
        } else if (!liveVerified) {
          opts.spine.clStatus = 'p2p_only'
        }
      } catch {
        if (!liveVerified) {
          opts.spine.clStatus = 'p2p_only'
        }
      }
      await new Promise((r) => setTimeout(r, slotMs))
    }
  })()

  return {
    stop: () => {
      stopped = true
      runner.persist()
    },
    notePeerHeader,
  }
}
