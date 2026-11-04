import {
  type Devp2pWorkerClient,
  type WorkerChainId,
  type WorkerPeerSnapshot,
  type WorkerTelemetrySnapshot,
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  type BALJSONBlockAccessList,
  bytesToUnprefixedHex,
  equalsBytes,
  intToUnpaddedBytes,
  utf8ToBytes,
} from '@ethereumjs/util'

import { getEthyClientVersion } from '../clientMeta.ts'
import type { NoticeBoard } from '../notify/board.ts'
import {
  discoveryLooksBlocked,
  initialP2pLinkState,
  syncP2pLinkNotices,
} from '../notify/p2pLink.ts'
import { resolveEthyDataDir } from '../persist/ethyDataRoot.ts'
import { PEER_BOOK_STARTUP_DIALS, discoveryNodeStorePath } from '../persist/peerBook.ts'
import type { PeerBookStore } from '../persist/peerBook.ts'
import { SnapPivotStore, snapBucketsUnfinished } from '../persist/snapStore.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import { ResourceBudgetWatchdog } from '../runtime/resourceBudget.ts'
import { createSnapBuckets } from '../spine/buckets.ts'
import { deriveCapabilities, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, PeerTelemetry } from '../spine/types.ts'
import { SnapAccountSynchronizer } from '../sync/accountSync.ts'
import {
  BalChainStreamer,
  LAPTOP_WAKE_BLOCK_GAP,
  replayAppliedBalBlocksForSlab,
  seedBalCatchUp,
  tryEnterBalCatchUp,
} from '../sync/balSync.ts'
import {
  type PivotHealSequence,
  advanceBlockBundleEthMessage,
  finalizeBlockBundle,
  startBlockBundleByNumber,
} from '../sync/blockBundle.ts'
import { SnapCodeAndStorageSynchronizer } from '../sync/codeAndStorageSync.ts'
import {
  decideSnapResume,
  shouldDeferLivePivotRequest,
  shouldEnsureSnapSync,
  snapResumeProgressPct,
} from '../sync/resumePolicy.ts'
import { SnapPeerFlightTracker } from '../sync/snapFlight.ts'
import { createLiveSnapTransport } from '../sync/snapTransport.ts'
import { SNAP_VERIFY_POOL_MODULE_URL, SnapVerifyPool } from '../sync/snapVerifyWorker.ts'
import { activeHardfork, advertisedForkHash, chainConfigForNetwork } from './chainHardfork.ts'
import {
  VIP_SNAP_PEER_TARGET,
  countSnapPeersTowardVipTarget,
  shouldVipReconnect,
  wantSnapDiscoveryHold,
} from './discoveryHold.ts'
import { p2pHandshakeStatusFields } from './genesisStatus.ts'
import {
  EthMessageCodes,
  encodeGetBlockAccessListsPayload,
  encodeGetBlockBodiesPayload,
  encodeGetBlockHeadersByNumberPayload,
  encodeGetBlockHeadersPayload,
  encodeGetReceiptsPayload,
  firstHeaderRlpFromBlockHeadersPayload,
  highestEthVersion,
  parseFirstBalFromBlockAccessListsPayload,
  parseFirstBodyFromBlockBodiesPayload,
  parsePivotHeaderFromBlockHeadersPayload,
  parseReceiptsReplyPayload,
  peerIdToBytes,
} from './pivotHeader.ts'
import { ethyCallerModuleUrl } from './workerModuleUrl.ts'

const PIVOT_IN_FLIGHT_TIMEOUT_MS = 15_000
const VIP_RECONNECT_INTERVAL_MS = 5_000
const RESTORED_CONTRACTS_CHUNK = 2_000
/** Head-following peers before pausing discovery (hysteresis with DISCOVERY_HOLD_RESUME_BELOW). */
const DISCOVERY_HOLD_PAUSE_AT = 4
const DISCOVERY_HOLD_RESUME_BELOW = 2
/** RLPx table during snap. Wide tables get the client dropped for too many peers. */
const SYNC_MAX_PEERS = 20
const SYNC_MAX_INBOUND_PEERS = 4
/** Leave discovery off until the table has fallen well below the cap. */
const SYNC_DISCOVERY_LOW_WATER = 4
const PIVOT_BUNDLE_TIMEOUT_MS = 15_000

type PivotBundleFetch = {
  peerId: string
  ethVersion: number
  number: bigint
  hash: Uint8Array
  headerRlp: Uint8Array
  stage: 'bodies' | 'receipts' | 'bal'
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balRlp?: Uint8Array
  startedAt: number
}

export type StartPeerCoordinatorOptions = {
  spine: EthySpine
  stateManager: FlatStateManager
  network: string
  workerModuleUrl?: string
  inProcess?: boolean
  /** Test override: dial this peer after start. */
  dial?: { address: string; udpPort: number; tcpPort: number; id: Uint8Array }
  shouldFindNeighbours?: boolean
  goodCitizen?: boolean
  listenPort?: number
  /** When set, peer reachability is posted for the TUI notice box. */
  notices?: NoticeBoard
  snapStore?: SnapPivotStore
  peerBook?: PeerBookStore
  dataDir?: string
  /** Test override for pivot bundle fetch timeout (default 15s). */
  pivotBundleTimeoutMs?: number
  /** Cross-check EL headers against consensus light client (WP-05b). */
  witnessExecutionHeader?: (blockNumber: bigint, blockHash: Uint8Array) => void
  /** Wipe pivot state before sync (WP-04a). */
  fresh?: boolean
}

export type PeerCoordinatorHandle = {
  stop: () => void
  refreshPivotHeader: () => void
  disconnectPeer: (peerId: string) => void
}

function workerChainId(network: string): WorkerChainId {
  const key = network.toLowerCase()
  if (key === 'mainnet' || key === 'sepolia' || key === 'hoodi' || key === 'holesky') {
    return key
  }
  throw new Error(`Unsupported worker chain: ${network}`)
}

function mapPeer(snapshot: WorkerPeerSnapshot, prev?: PeerTelemetry): PeerTelemetry {
  return {
    id: snapshot.id,
    clientName: snapshot.clientId || 'unknown',
    caps: [...snapshot.caps],
    snapSession: snapshot.snapSession === true,
    hasHead: snapshot.bestHash !== undefined,
    latestBlock:
      snapshot.latestBlock !== undefined ? BigInt(snapshot.latestBlock) : prev?.latestBlock,
    snapRequestsSent: prev?.snapRequestsSent ?? 0,
    snapResponsesOk: prev?.snapResponsesOk ?? 0,
    snapTimeouts: prev?.snapTimeouts ?? 0,
    avgLatencyMs: snapshot.rttMs ?? prev?.avgLatencyMs ?? 0,
    lastError: prev?.lastError,
  }
}

function pickBestPeer(
  peers: WorkerPeerSnapshot[],
  skipIds: ReadonlySet<string>,
): WorkerPeerSnapshot | undefined {
  let best: WorkerPeerSnapshot | undefined
  let bestBlock = 0n
  for (const p of peers) {
    if (p.bestHash === undefined || skipIds.has(p.id)) continue
    const block = p.latestBlock !== undefined ? BigInt(p.latestBlock) : 0n
    if (best === undefined || block > bestBlock) {
      best = p
      bestBlock = block
    }
  }
  return best
}

function updatePivotStatusHint(spine: EthySpine, peers: WorkerPeerSnapshot[]): void {
  if (spine.pivotBlockNumber !== undefined) {
    spine.pivotStatusHint = undefined
    return
  }
  const withHead = peers.filter((p) => p.bestHash !== undefined).length
  const statusOk = spine.discovery?.rlpx.statusOk ?? 0
  if (peers.length === 0) {
    spine.pivotStatusHint = 'Discovering peers…'
  } else if (withHead === 0) {
    spine.pivotStatusHint =
      statusOk === 0
        ? `Await ETH STATUS (${peers.length} RLPx)`
        : `No peer head yet (${peers.length} RLPx)`
  } else {
    spine.pivotStatusHint = `Fetching header (${withHead} with head)`
  }
}

export async function startPeerCoordinator(
  opts: StartPeerCoordinatorOptions,
): Promise<PeerCoordinatorHandle> {
  const { spine, network, stateManager, snapStore, peerBook } = opts
  const dataDir = opts.dataDir ?? resolveEthyDataDir()
  const resourceWatchdog = new ResourceBudgetWatchdog({
    spine,
    stateManager,
    maxResidentAccounts: 500_000,
  })
  resourceWatchdog.start()
  const snapFlightTracker = new SnapPeerFlightTracker()
  let snapSync: SnapAccountSynchronizer | undefined
  let codeSync: SnapCodeAndStorageSynchronizer | undefined
  let headFollower: BalChainStreamer | undefined
  let resumeDecided = false
  let handoffCatchup = false
  let baseSyncCompletePosted = false
  let markingBaseSyncComplete = false
  let headFlipSummaryPosted = false

  const populateHeadFlipSummary = (head: bigint) => {
    if (headFlipSummaryPosted) return
    headFlipSummaryPosted = true
    spine.headFlipSummary = {
      kind: 'key_value',
      title: `★ Synced to Live Head #${head.toLocaleString('en-US')}`,
      entries: [
        { key: 'Accounts', value: spine.totalAccountsSynced.toLocaleString('en-US') },
        { key: 'Code', value: spine.codesSynced.toLocaleString('en-US') },
        { key: 'Storage slots', value: spine.storageSlotsSynced.toLocaleString('en-US') },
        {
          key: 'Pivot steps',
          value: String(spine.pivotStepsCompleted ?? 0),
        },
        {
          key: 'BALs applied',
          value: String(spine.appliedBalCount ?? spine.streamedBalCount ?? 0),
        },
      ],
    }
  }
  /** Saved snap journals replayed from disk (head used only for stale / BAL handoff). */
  let diskHydrated = false
  let resumeHeadHandled = false
  let resumeHydrateStarted = false
  let rollingStatusAdvertised = false
  const savedSnapPeek = opts.fresh === true ? undefined : snapStore?.peekActive()
  const verifyPool = new SnapVerifyPool({
    inProcess: opts.inProcess === true,
    moduleUrl: opts.inProcess === true ? undefined : SNAP_VERIFY_POOL_MODULE_URL,
  })
  if (spine.pivotStateRoot === undefined) {
    setPhase(spine, 'P2P_WARMUP')
  }

  const chain = chainConfigForNetwork(network)
  const hardfork = activeHardfork(chain)
  const privateKey = genPrivateKey()

  const ensureHeadFollower = (clientRef: Devp2pWorkerClient) => {
    if (spine.pivotStateRoot === undefined) return
    if (headFollower === undefined) {
      headFollower = new BalChainStreamer({
        spine,
        stateManager,
        chain,
        hardfork,
        getClient: () => clientRef,
        sendEthMessage: sendEthToPeer,
        pickEthPeer: () => {
          const best = pickBestPeer(lastTelemetryPeers, pivotBlockedPeers)
          if (best === undefined) return undefined
          const snapPeersWithHead = lastTelemetryPeers.filter(
            (p) => p.snapSession === true && p.latestBlock !== undefined,
          )
          let safeSnapHead: bigint | undefined
          for (const p of snapPeersWithHead) {
            const b = BigInt(p.latestBlock!)
            if (safeSnapHead === undefined || b < safeSnapHead) {
              safeSnapHead = b
            }
          }
          const bestBlock = best.latestBlock !== undefined ? BigInt(best.latestBlock) : undefined
          const effectiveBlock =
            safeSnapHead !== undefined && bestBlock !== undefined && safeSnapHead < bestBlock
              ? safeSnapHead
              : bestBlock
          return {
            id: best.id,
            ethVersion: highestEthVersion(best.caps),
            latestBlock: effectiveBlock !== undefined ? Number(effectiveBlock) : undefined,
          }
        },
        putServableBlock: (bundle) => clientRef.putServableBlock(bundle),
        onBalApplied: bundleBalHooks.onBalApplied,
        appendHealBal: bundleBalHooks.appendHealBal,
        noteVerifiedBlock: (n) => snapStore?.noteVerifiedBlock(n),
        onSyncedToHead: (head) => {
          populateHeadFlipSummary(head)
          opts.notices?.post(
            {
              key: 'bal-synced-head',
              level: 'info',
              text: `Synced to head #${head.toString()}`,
              relevantForMs: 8_000,
            },
            Date.now(),
          )
          deriveCapabilities(spine)
        },
        onPivotStep: (newPivot) => {
          snapStore?.updatePivotHead({
            blockNumber: newPivot.blockNumber,
            blockHash: newPivot.blockHash,
            stateRoot: newPivot.stateRoot,
          })
          deriveCapabilities(spine)
        },
        onBalBlockBuffered: () => {
          deriveCapabilities(spine)
        },
        onVerifiedExecutionHeader: opts.witnessExecutionHeader,
      })
    }
    headFollower.start()
  }

  const ensureSnapSync = (clientRef: Devp2pWorkerClient) => {
    if (
      !shouldEnsureSnapSync({
        pivotStateRoot: spine.pivotStateRoot,
        diskHydrated,
        handoffCatchup,
      })
    ) {
      return
    }
    const transport = createLiveSnapTransport(clientRef)
    const getSnapPeers = () =>
      [...spine.peers.values()]
        .filter((p) => p.snapSession === true && p.hasHead === true)
        .map((p) => ({
          id: p.id,
          caps: p.caps,
          snapResponsesOk: p.snapResponsesOk,
          snapTimeouts: p.snapTimeouts,
          avgLatencyMs: p.avgLatencyMs,
          latestBlock: p.latestBlock,
        }))
    if (snapSync === undefined) {
      snapSync = new SnapAccountSynchronizer({
        spine,
        stateManager,
        transport,
        flightTracker: snapFlightTracker,
        snapStore,
        peerBook,
        getSnapPeers,
        verifyPool,
        onAccountsIngested: (entries) => codeSync?.noteAccounts(entries),
        onSlabCommitted: (flight, lastKey) => {
          const blocks = headFollower?.appliedBlocksSince(flight.pivotBlockNumber) ?? []
          void replayAppliedBalBlocksForSlab(
            blocks,
            stateManager,
            spine.snapBuckets,
            flight.origin,
            lastKey,
          )
        },
      })
      snapSync.start()
    }
    if (codeSync === undefined) {
      codeSync = new SnapCodeAndStorageSynchronizer({
        spine,
        stateManager,
        transport,
        flightTracker: snapFlightTracker,
        snapStore,
        getSnapPeers,
        verifyPool,
        peerBusy: (peerId) => snapSync?.peerBusy(peerId) ?? false,
        onBalRefreshAccount: (hash) => snapSync?.enqueueAccountRefreshCursor(hash),
      })
      codeSync.start()
    }
  }

  let client: Devp2pWorkerClient
  let inFlightPeerId: string | undefined
  let inFlightHash: string | undefined
  let inFlightBlockNumber: bigint | undefined
  let inFlightEthVersion = 68
  let inFlightStartedAt = 0
  const pivotBlockedPeers = new Set<string>()
  const pivotBundleTimeoutMs = opts.pivotBundleTimeoutMs ?? PIVOT_BUNDLE_TIMEOUT_MS
  let lastTelemetryPeers: WorkerPeerSnapshot[] = []
  let lastDiagTs = 0
  /** Peer ids we dialed via VIP redial; skip until handshake or expiry. */
  const pendingVipDials = new Map<string, number>()
  let bundleFetch: PivotBundleFetch | undefined
  let healSeq: PivotHealSequence | undefined
  let dnsTimedOut = false
  let link = initialP2pLinkState()
  const linkStartedAt = Date.now()
  let discoveryHoldActive: boolean | undefined

  const noteDiscovery = (message: string) => {
    if (discoveryLooksBlocked(message)) dnsTimedOut = true
  }

  const syncLink = () => {
    if (opts.notices === undefined) return
    link = syncP2pLinkNotices(opts.notices, link, {
      peerCount: spine.peers.size,
      startedAt: linkStartedAt,
      now: Date.now(),
      dnsTimedOut,
      discovery: spine.discovery,
    })
  }

  const clearPivotInFlight = () => {
    inFlightPeerId = undefined
    inFlightHash = undefined
    inFlightBlockNumber = undefined
    inFlightStartedAt = 0
  }

  const sendEthToPeer = (peerId: string, code: number, payload: Uint8Array) => {
    client.sendEthMessage(peerIdToBytes(peerId), code, payload)
  }

  const clearSpinePivotForFreshAnchor = (): void => {
    spine.pivotBlockNumber = undefined
    spine.pivotStateRoot = undefined
    spine.pivotStatusHint = undefined
    spine.snapBuckets = createSnapBuckets()
    spine.totalAccountsSynced = 0
    setPhase(spine, 'P2P_WARMUP')
  }

  const finishDiskResumeWithHead = (headBlock: bigint): void => {
    if (snapStore === undefined || !diskHydrated) return
    if (handoffCatchup) {
      spine.bestPeerHead = headBlock
      seedBalCatchUp(spine, headBlock)
      ensureHeadFollower(client)
      opts.notices?.post(
        {
          key: 'snap-handoff',
          level: 'info',
          text: `Resuming from #${spine.lastVerifiedBlockNumber?.toString() ?? '?'} toward head #${headBlock.toString()}`,
          relevantForMs: 8_000,
        },
        Date.now(),
      )
    }
    deriveCapabilities(spine)
  }

  const startResumeHydrate = (): void => {
    if (snapStore === undefined || resumeHydrateStarted) return
    const peek = snapStore.peekActive()
    if (peek === undefined) return
    resumeHydrateStarted = true
    void snapStore.loadIntoAsync(spine, stateManager).then(
      async (restored) => {
        await finishDiskHydrate(restored, peek)
      },
      (err) => {
        recordDiagnostic(spine, {
          subsystem: 'snap',
          severity: 'error',
          message: err instanceof Error ? err.message : 'Disk resume hydrate failed',
        })
      },
    )
  }

  const handleSnapResumeAtHead = (headBlock: bigint, peers: WorkerPeerSnapshot[]) => {
    if (resumeDecided) {
      if (diskHydrated && !resumeHeadHandled) {
        resumeHeadHandled = true
        finishDiskResumeWithHead(headBlock)
      }
      return
    }
    if (snapStore === undefined || opts.fresh === true) {
      resumeDecided = true
      diskHydrated = true
      return
    }
    const peek = savedSnapPeek ?? snapStore.peekActive()
    if (peek === undefined) {
      resumeDecided = true
      diskHydrated = true
      return
    }
    const decision = decideSnapResume({
      fresh: false,
      saved: peek,
      head: headBlock,
    })
    resumeDecided = true
    if (decision === 'reset-stale') {
      const gap = headBlock - peek.pivotBlockNumber
      snapStore.discardPivots()
      clearSpinePivotForFreshAnchor()
      diskHydrated = true
      resumeHeadHandled = true
      opts.notices?.clear('snap-resume', Date.now())
      opts.notices?.post(
        {
          key: 'snap-stale-reset',
          level: 'warn',
          text: `Saved partial snap (#${peek.pivotBlockNumber.toString()}, +${gap.toString()} blocks) expired — starting fresh at #${headBlock.toString()}`,
          relevantForMs: 8_000,
        },
        Date.now(),
      )
      const best = pickBestPeer(peers, pivotBlockedPeers)
      if (best !== undefined) requestPivotFromPeer(best)
      deriveCapabilities(spine)
      return
    }
    if (decision === 'anchor-fresh') {
      diskHydrated = true
      return
    }
    startResumeHydrate()
  }

  const maybeApplyResumeFromPeers = (peers: WorkerPeerSnapshot[]) => {
    const best = pickBestPeer(peers, pivotBlockedPeers)
    if (best?.latestBlock === undefined) return
    const headBlock = BigInt(best.latestBlock)
    handleSnapResumeAtHead(headBlock, peers)
  }

  const finishDiskHydrate = async (
    restored: number,
    peek: NonNullable<ReturnType<SnapPivotStore['peekActive']>>,
  ) => {
    diskHydrated = true
    resumeDecided = true
    if (peek.baseSyncComplete) {
      handoffCatchup = true
      if (restored > 0) {
        recordDiagnostic(spine, {
          subsystem: 'snap',
          severity: 'info',
          message: `Restored ${restored.toLocaleString('en-US')} accounts from disk (base sync complete)`,
        })
      }
    } else {
      setPhase(spine, 'SNAP_SYNCING')
      if (restored > 0) {
        recordDiagnostic(spine, {
          subsystem: 'snap',
          severity: 'info',
          message: `Restored ${restored.toLocaleString('en-US')} accounts from disk`,
        })
      }
      const pct = snapResumeProgressPct(peek)
      opts.notices?.post(
        {
          key: 'snap-resume',
          level: 'info',
          text: `Resuming snap sync at #${spine.pivotBlockNumber?.toString() ?? '?'} (${pct}% complete)`,
          relevantForMs: 8_000,
        },
        Date.now(),
      )
      ensureSnapSync(client)
      const contracts = snapStore!.drainRestoredContracts()
      for (let i = 0; i < contracts.length; i += RESTORED_CONTRACTS_CHUNK) {
        codeSync?.noteAccounts(contracts.slice(i, i + RESTORED_CONTRACTS_CHUNK))
        if (i + RESTORED_CONTRACTS_CHUNK < contracts.length) {
          await new Promise<void>((resolve) => setImmediate(resolve))
        }
      }
    }
    deriveCapabilities(spine)
    if (!resumeHeadHandled) {
      const best = pickBestPeer(lastTelemetryPeers, pivotBlockedPeers)
      if (best?.latestBlock !== undefined) {
        resumeHeadHandled = true
        finishDiskResumeWithHead(BigInt(best.latestBlock))
      }
    }
  }

  const maybeMarkBaseSyncComplete = () => {
    if (
      handoffCatchup ||
      baseSyncCompletePosted ||
      markingBaseSyncComplete ||
      snapStore === undefined
    ) {
      return
    }
    if (snapBucketsUnfinished(spine.snapBuckets)) return
    if (codeSync !== undefined && !codeSync.pendingDone()) return
    if (spine.pivotBlockNumber === undefined) return
    markingBaseSyncComplete = true
    void (async () => {
      try {
        await headFollower?.flushBufferedBlocks()
        const pivot = spine.pivotBlockNumber
        if (pivot === undefined) return
        snapStore.markBaseSyncComplete(pivot)
        baseSyncCompletePosted = true
        opts.notices?.post(
          {
            key: 'snap-base-done',
            level: 'info',
            text: `Snap base sync complete at #${pivot.toString()}`,
            relevantForMs: 8_000,
          },
          Date.now(),
        )
        const best = pickBestPeer(lastTelemetryPeers, pivotBlockedPeers)
        const peerHead =
          best?.latestBlock !== undefined ? BigInt(best.latestBlock) : (spine.bestPeerHead ?? pivot)
        const bestHead = peerHead > pivot ? peerHead : pivot
        spine.bestPeerHead = bestHead
        const flipped = tryEnterBalCatchUp(spine, snapSync, codeSync, bestHead)
        ensureHeadFollower(client)
        if (flipped && spine.phase === 'HEAD_FOLLOWING') {
          populateHeadFlipSummary(bestHead)
        }
        deriveCapabilities(spine)
      } finally {
        markingBaseSyncComplete = false
      }
    })()
  }

  const maybeVipReconnect = (now: number) => {
    if (peerBook === undefined) return
    for (const [id, until] of pendingVipDials) {
      if (until <= now) pendingVipDials.delete(id)
    }
    const towardTarget = countSnapPeersTowardVipTarget([...spine.peers.values()])
    if (!shouldVipReconnect({ snapPeersTowardTarget: towardTarget })) return
    const connected = new Set(spine.peers.keys())
    const need = VIP_SNAP_PEER_TARGET - towardTarget
    let dialed = 0
    for (const peer of peerBook.vipDialCandidates(now, PEER_BOOK_STARTUP_DIALS)) {
      const id = bytesToUnprefixedHex(peer.id as Uint8Array).toLowerCase()
      if (connected.has(id)) continue
      const pendingUntil = pendingVipDials.get(id)
      if (pendingUntil !== undefined && pendingUntil > now) continue
      peerBook.noteDialAttempt(id, now)
      client.connectPeer(peer)
      pendingVipDials.set(id, now + VIP_RECONNECT_INTERVAL_MS)
      dialed++
      if (dialed >= need) break
    }
  }

  const bundleBalHooks = {
    onBalApplied: (bal: BALJSONBlockAccessList) => {
      codeSync?.noteBalApplied(bal)
    },
    appendHealBal: (blockNumber: bigint, balRlp: Uint8Array) => {
      snapStore?.appendHealBal(blockNumber, balRlp)
    },
  }

  const completePivotBundle = () => {
    if (bundleFetch === undefined) return
    if (bundleFetch.bodyRlp === undefined || bundleFetch.receiptsEth69Rlp === undefined) {
      bundleFetch = undefined
      return
    }
    const bundle = {
      peerId: bundleFetch.peerId,
      ethVersion: bundleFetch.ethVersion,
      blockNumber: bundleFetch.number,
      hash: bundleFetch.hash,
      headerRlp: bundleFetch.headerRlp,
      bodyRlp: bundleFetch.bodyRlp,
      receiptsEth69Rlp: bundleFetch.receiptsEth69Rlp,
      balRlp: bundleFetch.balRlp,
      stage: 'bal' as const,
      startedAt: bundleFetch.startedAt,
    }
    void finalizeBlockBundle({
      spine,
      stateManager,
      chain,
      hardfork,
      bundle,
      putServableBlock: (b) => client.putServableBlock(b),
      ...bundleBalHooks,
    })
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: `Servable pivot bundle registered at #${bundleFetch.number.toString()}`,
    })
    bundleFetch = undefined
  }

  const commitPivotAnchor = (
    parsed: { number: bigint; hash: Uint8Array; stateRoot: Uint8Array },
    headerRlp: Uint8Array | null,
    peerId: string | undefined,
    ethVersion: number,
    anchorOpts: { skipServableBundle?: boolean; firstAnchor?: boolean; prevRoot?: Uint8Array } = {},
  ) => {
    const firstAnchor = anchorOpts.firstAnchor ?? spine.pivotStateRoot === undefined
    const prevRoot = anchorOpts.prevRoot ?? spine.pivotStateRoot
    spine.pivotStatusHint = undefined
    spine.pivotBlockNumber = parsed.number
    spine.pivotStateRoot = parsed.stateRoot
    spine.currentSlot = Number(parsed.number)
    if (firstAnchor || (prevRoot !== undefined && !equalsBytes(prevRoot, parsed.stateRoot))) {
      opts.notices?.clear('snap-resume', Date.now())
      snapStore?.activatePivot({
        blockNumber: parsed.number,
        blockHash: parsed.hash,
        stateRoot: parsed.stateRoot,
      })
      // Cursors live in memory. The new directory must not reboot them at nibble zero.
      snapStore?.flushBuckets(spine.snapBuckets)
    }
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: `Pivot anchored at #${parsed.number.toString()}`,
    })
    if (
      !anchorOpts.skipServableBundle &&
      headerRlp !== null &&
      peerId !== undefined &&
      bundleFetch === undefined
    ) {
      startPivotBundleFetch(peerId, ethVersion, parsed, headerRlp)
    }
    ensureSnapSync(client)
    ensureHeadFollower(client)
    deriveCapabilities(spine)
  }

  const publishHeal = () => {
    const seq = healSeq
    if (seq === undefined) {
      spine.pivotHeal = undefined
      return
    }
    spine.pivotHeal = {
      fromBlock: seq.fromBlock,
      nextBlock: seq.nextBlock,
      toBlock: seq.toBlock,
    }
  }

  const finishHeal = (seq: PivotHealSequence) => {
    healSeq = undefined
    publishHeal()
    if (spine.pivotCarry?.kind !== 'previous' && spine.totalAccountsSynced > 0) {
      spine.pivotCarry = { kind: 'kept', accounts: spine.totalAccountsSynced }
    }
    commitPivotAnchor(seq.targetPivot, seq.finalHeaderRlp ?? null, seq.peerId, seq.ethVersion, {
      skipServableBundle: true,
    })
  }

  const advanceHealSequence = () => {
    if (healSeq === undefined) return
    const seq = healSeq
    if (seq.nextBlock <= seq.toBlock) {
      publishHeal()
      seq.inFlight = startBlockBundleByNumber(client, seq.peerId, seq.ethVersion, seq.nextBlock)
      return
    }
    finishHeal(seq)
  }

  const completeHealBlock = () => {
    if (healSeq?.inFlight === undefined) return
    const bundle = healSeq.inFlight
    void finalizeBlockBundle({
      spine,
      stateManager,
      chain,
      hardfork,
      bundle,
      putServableBlock: (b) => client.putServableBlock(b),
      ...bundleBalHooks,
    }).then(() => {
      if (healSeq === undefined) return
      healSeq.nextBlock += 1n
      publishHeal()
      recordDiagnostic(spine, {
        subsystem: 'bal',
        severity: 'info',
        message: `Heal block #${(healSeq.nextBlock - 1n).toString()} applied`,
      })
      advanceHealSequence()
    })
  }

  const startPivotBundleFetch = (
    peerId: string,
    ethVersion: number,
    parsed: { number: bigint; hash: Uint8Array },
    headerRlp: Uint8Array,
  ) => {
    if (bundleFetch !== undefined) return
    bundleFetch = {
      peerId,
      ethVersion,
      number: parsed.number,
      hash: parsed.hash,
      headerRlp,
      stage: 'bodies',
      startedAt: Date.now(),
    }
    const payload = encodeGetBlockBodiesPayload(ethVersion, parsed.hash)
    client.sendEthMessage(peerIdToBytes(peerId), EthMessageCodes.GET_BLOCK_BODIES, payload)
  }

  const maybePivotBundleTimeout = () => {
    if (bundleFetch === undefined || bundleFetch.startedAt === 0) return
    if (Date.now() - bundleFetch.startedAt < pivotBundleTimeoutMs) return
    const peerId = bundleFetch.peerId
    bundleFetch = undefined
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'warn',
      message: 'Pivot block bundle fetch timed out',
      peerId,
    })
  }

  const handleHealEthMessage = (msg: {
    peerId: string
    code: number
    payload: Uint8Array
  }): boolean => {
    const inFlight = healSeq?.inFlight
    if (inFlight === undefined) return false
    const result = advanceBlockBundleEthMessage(chain, inFlight, msg, (peerId, code, payload) => {
      client.sendEthMessage(peerIdToBytes(peerId), code, payload)
    })
    if (result === 'ignore') return false
    if (result === 'failed') {
      recordDiagnostic(spine, {
        subsystem: 'bal',
        severity: 'warn',
        message: `Pivot heal block #${inFlight.blockNumber.toString()} fetch failed; snap keeps the new root`,
        peerId: msg.peerId,
      })
      healSeq = undefined
      publishHeal()
      return true
    }
    if (result === 'progress') return true
    completeHealBlock()
    return true
  }

  const handleBundleEthMessage = (msg: {
    peerId: string
    code: number
    payload: Uint8Array
  }): boolean => {
    if (handleHealEthMessage(msg)) return true
    if (bundleFetch === undefined || msg.peerId !== bundleFetch.peerId) return false
    if (msg.code === EthMessageCodes.BLOCK_BODIES && bundleFetch.stage === 'bodies') {
      const bodyRlp = parseFirstBodyFromBlockBodiesPayload(msg.payload)
      if (bodyRlp === null) {
        bundleFetch = undefined
        recordDiagnostic(spine, {
          subsystem: 'devp2p',
          severity: 'warn',
          message: 'Pivot block body response empty',
          peerId: msg.peerId,
        })
        return true
      }
      bundleFetch.bodyRlp = bodyRlp
      bundleFetch.stage = 'receipts'
      bundleFetch.startedAt = Date.now()
      const payload = encodeGetReceiptsPayload(bundleFetch.ethVersion, bundleFetch.hash)
      client.sendEthMessage(
        peerIdToBytes(bundleFetch.peerId),
        EthMessageCodes.GET_RECEIPTS,
        payload,
      )
      return true
    }
    if (msg.code === EthMessageCodes.RECEIPTS && bundleFetch.stage === 'receipts') {
      const parsed = parseReceiptsReplyPayload(bundleFetch.ethVersion, msg.payload)
      if (parsed === null || parsed.lastBlockIncomplete) {
        bundleFetch = undefined
        recordDiagnostic(spine, {
          subsystem: 'devp2p',
          severity: 'warn',
          message: parsed?.lastBlockIncomplete
            ? 'Pivot receipts incomplete (paginated)'
            : 'Pivot receipts response empty',
          peerId: msg.peerId,
        })
        return true
      }
      bundleFetch.receiptsEth69Rlp = parsed.receiptsListRlp
      if (bundleFetch.ethVersion >= 71) {
        bundleFetch.stage = 'bal'
        bundleFetch.startedAt = Date.now()
        const payload = encodeGetBlockAccessListsPayload(bundleFetch.ethVersion, bundleFetch.hash)
        client.sendEthMessage(
          peerIdToBytes(bundleFetch.peerId),
          EthMessageCodes.GET_BLOCK_ACCESS_LISTS,
          payload,
        )
        return true
      }
      completePivotBundle()
      return true
    }
    if (msg.code === EthMessageCodes.BLOCK_ACCESS_LISTS && bundleFetch.stage === 'bal') {
      bundleFetch.balRlp = parseFirstBalFromBlockAccessListsPayload(msg.payload)
      completePivotBundle()
      return true
    }
    return false
  }

  const livePivotAllowed = (): boolean =>
    !shouldDeferLivePivotRequest({
      fresh: opts.fresh === true,
      diskHydrated,
      spinePivotBlockNumber: spine.pivotBlockNumber,
      saved: snapStore?.peekActive(),
    })

  const requestPivotFromPeer = (peer: WorkerPeerSnapshot, mode: 'hash' | 'number' = 'hash') => {
    if (!livePivotAllowed()) return
    if (inFlightPeerId !== undefined) return
    if (mode === 'number' && peer.latestBlock === undefined) return
    if (mode === 'hash' && peer.bestHash === undefined) return
    const ethVersion = highestEthVersion(peer.caps)
    inFlightPeerId = peer.id
    inFlightEthVersion = ethVersion
    inFlightStartedAt = Date.now()
    if (mode === 'number') {
      inFlightBlockNumber = BigInt(peer.latestBlock!)
      inFlightHash = undefined
      const payload = encodeGetBlockHeadersByNumberPayload(ethVersion, inFlightBlockNumber)
      client.sendEthMessage(peerIdToBytes(peer.id), EthMessageCodes.GET_BLOCK_HEADERS, payload)
      return
    }
    inFlightHash = peer.bestHash
    inFlightBlockNumber = undefined
    const payload = encodeGetBlockHeadersPayload(ethVersion, peer.bestHash!)
    client.sendEthMessage(peerIdToBytes(peer.id), EthMessageCodes.GET_BLOCK_HEADERS, payload)
  }

  const maybePivotInFlightTimeout = (peers: WorkerPeerSnapshot[]) => {
    if (inFlightPeerId === undefined || inFlightStartedAt === 0) return
    if (Date.now() - inFlightStartedAt < PIVOT_IN_FLIGHT_TIMEOUT_MS) return
    const peerId = inFlightPeerId
    pivotBlockedPeers.add(peerId)
    clearPivotInFlight()
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'warn',
      message: 'Pivot header request timed out',
      peerId,
    })
    const best = pickBestPeer(peers, pivotBlockedPeers)
    if (best !== undefined) requestPivotFromPeer(best)
  }

  const workerModuleUrl =
    opts.inProcess === true
      ? undefined
      : (opts.workerModuleUrl ?? resolveThreadedNetworkModuleUrl(ethyCallerModuleUrl()))

  const status = p2pHandshakeStatusFields(network)
  recordDiagnostic(spine, {
    subsystem: 'devp2p',
    severity: 'info',
    message: `ETH STATUS out: hardfork ${hardfork} genesis ${status.genesisHash} fork ${advertisedForkHash(chain, hardfork)}`,
  })

  client = await createThreadedNetwork(
    {
      inProcess: opts.inProcess,
      privateKey,
      chain: workerChainId(network),
      hardfork,
      maxPeers: SYNC_MAX_PEERS,
      maxInboundPeers: SYNC_MAX_INBOUND_PEERS,
      discoveryLowWaterMark: SYNC_DISCOVERY_LOW_WATER,
      // Current Sepolia clients speak eth/69 and later. eth/68 fills dial slots
      // with peers that cannot serve this chain.
      capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1'],
      goodCitizen: opts.goodCitizen ?? true,
      // An empty account proof is not valid snap, so inbound GETs stay unanswered.
      // Outbound ranges are small, and the pong deadline is 30s, so a busy server can stay up.
      answerEmptySnap: false,
      // DNS ENR tree + bootnodes are chain-scoped. Unfiltered discv4 neighbors
      // are other networks and crowd out Sepolia sessions.
      shouldFindNeighbours: opts.shouldFindNeighbours ?? false,
      chainDirectoryDiscovery: opts.shouldFindNeighbours === true ? false : true,
      clientId: utf8ToBytes(`ethy/v${getEthyClientVersion()}`),
      status,
      listenPort: opts.listenPort ?? 0,
      endpoint: { address: '0.0.0.0', udpPort: 0, tcpPort: opts.listenPort ?? 0 },
      throttleDiscovery: true,
      nodeStorePath: discoveryNodeStorePath(dataDir, network),
    },
    workerModuleUrl,
  )

  const maybeEnableRollingStatus = () => {
    if (rollingStatusAdvertised) return
    if (spine.phase === 'BAL_CATCHUP' || spine.phase === 'HEAD_FOLLOWING') {
      client.setAdvertiseBlockRange(true)
      rollingStatusAdvertised = true
    }
  }

  if (peerBook !== undefined) {
    const now = Date.now()
    peerBook.pruneOnStart(now)
    for (const peer of peerBook.dialCandidates(now)) {
      client.connectPeer(peer)
    }
  }

  let pendingTelemetry: WorkerTelemetrySnapshot | undefined
  let telemetryQueued = false
  client.events.on('telemetry', (snap) => {
    // Keep only the newest snapshot. Applying every 150ms tick inline rewrote
    // the peer book and ran pivot logic on the same turn as keypress.
    pendingTelemetry = snap
    if (telemetryQueued) return
    telemetryQueued = true
    enqueueProtocol(() => {
      telemetryQueued = false
      const next = pendingTelemetry
      pendingTelemetry = undefined
      if (next !== undefined) applyTelemetry(next)
    })
  })

  const applyTelemetry = (snap: WorkerTelemetrySnapshot) => {
    lastTelemetryPeers = snap.peers
    const prev = spine.peers
    spine.peers.clear()
    for (const p of snap.peers) {
      spine.peers.set(p.id, mapPeer(p, prev.get(p.id)))
      pendingVipDials.delete(p.id.toLowerCase())
      peerBook?.noteTelemetryPeer(p, Date.now())
    }
    spine.discovery = snap.discovery
    spine.serving = snap.serving
    for (const d of snap.diagnostics) {
      if (d.timestamp <= lastDiagTs) continue
      lastDiagTs = d.timestamp
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: d.severity === 'error' ? 'error' : d.severity === 'warn' ? 'warn' : 'info',
        message: d.message,
        peerId: d.peerId,
      })
      peerBook?.noteDisconnect(d.peerId, d.message, Date.now())
      noteDiscovery(d.message)
    }
    syncLink()
    deriveCapabilities(spine)
    maybePivotInFlightTimeout(snap.peers)
    maybePivotBundleTimeout()
    updatePivotStatusHint(spine, snap.peers)
    maybeApplyResumeFromPeers(snap.peers)
    const bestPeer = pickBestPeer(snap.peers, pivotBlockedPeers)
    if (bestPeer?.latestBlock !== undefined) {
      spine.bestPeerHead = BigInt(bestPeer.latestBlock)
      if (
        spine.phase === 'HEAD_FOLLOWING' &&
        spine.headBlockNumber !== undefined &&
        spine.bestPeerHead > spine.headBlockNumber + LAPTOP_WAKE_BLOCK_GAP
      ) {
        seedBalCatchUp(spine, spine.bestPeerHead)
        ensureHeadFollower(client)
      }
    }
    if (inFlightPeerId === undefined && spine.pivotBlockNumber === undefined) {
      if (bestPeer !== undefined) requestPivotFromPeer(bestPeer)
    }
    syncDiscoveryHold(client)
    ensureSnapSync(client)
    maybeMarkBaseSyncComplete()
    maybeEnableRollingStatus()
  }

  function syncDiscoveryHold(clientRef: Devp2pWorkerClient): void {
    if (spine.phase === 'P2P_WARMUP' || spine.phase === 'BOOTING') {
      if (discoveryHoldActive === true) {
        clientRef.setDiscoveryPaused(false)
        discoveryHoldActive = false
      }
      return
    }
    let proven = 0
    if (spine.phase === 'SNAP_SYNCING') {
      const peers = [...spine.peers.values()]
      const snapSessions = peers.filter((p) => p.snapSession === true).length
      const servingSnapPeers = peers.filter(
        (p) => p.snapSession === true && p.snapResponsesOk > 0,
      ).length
      const wantHold = wantSnapDiscoveryHold({
        snapSessions,
        servingSnapPeers,
        held: discoveryHoldActive === true,
      })
      if (wantHold === discoveryHoldActive) return
      clientRef.setDiscoveryPaused(wantHold)
      discoveryHoldActive = wantHold
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: 'info',
        message: wantHold ? 'Discovery paused (snap peer serving)' : 'Discovery resumed',
      })
      return
    } else if (spine.phase === 'HEAD_FOLLOWING' || spine.phase === 'BAL_CATCHUP') {
      proven = lastTelemetryPeers.filter((p) => p.latestBlock !== undefined).length
    } else {
      if (discoveryHoldActive === true) {
        clientRef.setDiscoveryPaused(false)
        discoveryHoldActive = false
      }
      return
    }
    const wantHold =
      proven >= DISCOVERY_HOLD_PAUSE_AT
        ? true
        : proven < DISCOVERY_HOLD_RESUME_BELOW
          ? false
          : (discoveryHoldActive ?? false)
    if (wantHold === discoveryHoldActive) return
    clientRef.setDiscoveryPaused(wantHold)
    discoveryHoldActive = wantHold
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: wantHold ? 'Discovery paused (enough sync peers)' : 'Discovery resumed',
    })
  }

  client.events.on('protocol', (msg) => {
    if (msg.protocol !== 'eth') return
    if (headFollower?.handleEthMessage(msg)) return
    if (handleBundleEthMessage(msg)) return
    if (msg.code !== EthMessageCodes.BLOCK_HEADERS) return
    if (inFlightPeerId === undefined || msg.peerId !== inFlightPeerId) {
      return
    }
    const headerRlp = firstHeaderRlpFromBlockHeadersPayload(inFlightEthVersion, msg.payload)
    const parsed = parsePivotHeaderFromBlockHeadersPayload(
      inFlightEthVersion,
      msg.payload,
      inFlightHash,
      chain,
    )
    const successPeerId = inFlightPeerId
    const successEthVersion = inFlightEthVersion
    const triedByHash = inFlightHash !== undefined
    clearPivotInFlight()
    if (parsed === null) {
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: 'warn',
        message: 'Pivot header response empty or hash mismatch',
        peerId: successPeerId,
      })
      if (triedByHash) {
        const peerRow = lastTelemetryPeers.find((p) => p.id === successPeerId)
        if (peerRow?.latestBlock !== undefined) {
          requestPivotFromPeer(peerRow, 'number')
          return
        }
      }
      pivotBlockedPeers.add(successPeerId!)
      const best = pickBestPeer(lastTelemetryPeers, pivotBlockedPeers)
      if (best !== undefined) requestPivotFromPeer(best)
      return
    }
    const unfinished = snapBucketsUnfinished(spine.snapBuckets)
    const firstAnchor = spine.pivotStateRoot === undefined
    const prevRoot = spine.pivotStateRoot
    if (
      spine.pivotStateRoot !== undefined &&
      unfinished &&
      !equalsBytes(spine.pivotStateRoot, parsed.stateRoot)
    ) {
      const pivotNum = spine.pivotBlockNumber ?? 0n
      recordDiagnostic(spine, {
        subsystem: 'snap',
        severity: 'info',
        message: `Keeping anchored pivot #${pivotNum.toString()} while account buckets unfinished`,
      })
      spine.currentSlot = Number(parsed.number)
      ensureSnapSync(client)
      deriveCapabilities(spine)
      return
    }
    commitPivotAnchor(parsed, headerRlp, successPeerId, successEthVersion, {
      firstAnchor,
      prevRoot,
    })
  })

  client.events.on('error', (err) => {
    if (err.message === 'Already connected') return
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'warn',
      message: err.message,
    })
    noteDiscovery(err.message)
    syncLink()
  })

  const linkTimer = opts.notices !== undefined ? setInterval(syncLink, 1_000) : undefined
  linkTimer?.unref()
  const vipTimer = setInterval(() => maybeVipReconnect(Date.now()), VIP_RECONNECT_INTERVAL_MS)
  vipTimer.unref?.()

  if (opts.dial !== undefined) {
    client.connectPeer({
      id: opts.dial.id,
      address: opts.dial.address,
      udpPort: opts.dial.udpPort,
      tcpPort: opts.dial.tcpPort,
    })
  }

  return {
    stop: () => {
      resourceWatchdog.stop()
      snapSync?.stop()
      codeSync?.stop()
      headFollower?.stop()
      snapStore?.flushBuckets(spine.snapBuckets)
      peerBook?.flush()
      if (linkTimer !== undefined) clearInterval(linkTimer)
      clearInterval(vipTimer)
      void verifyPool.close()
      client.stop()
    },
    disconnectPeer: (peerId: string) => {
      client.disconnectPeer(peerIdToBytes(peerId))
    },
    refreshPivotHeader: () => {
      clearPivotInFlight()
      pivotBlockedPeers.clear()
    },
  }
}

/** Reply to GET_BLOCK_HEADERS in tests (RLP-encoded header list). */
export function encodeBlockHeadersReply(
  ethVersion: number,
  headerRlp: Uint8Array,
  requestId = 1,
): Uint8Array {
  const inner = [headerRlp]
  const body = ethVersion >= 66 ? [intToUnpaddedBytes(requestId), inner] : inner
  return RLP.encode(body as never)
}
