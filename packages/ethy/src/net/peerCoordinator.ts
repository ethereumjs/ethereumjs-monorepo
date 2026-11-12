import * as fs from 'node:fs'
import * as path from 'node:path'

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
  hexToBytes,
  intToUnpaddedBytes,
  utf8ToBytes,
} from '@ethereumjs/util'

import { getEthyClientVersion } from '../clientMeta.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { NoticeBoard } from '../notify/board.ts'
import {
  discoveryLooksBlocked,
  initialP2pLinkState,
  syncP2pLinkNotices,
} from '../notify/p2pLink.ts'
import { resolveEthyDataDir } from '../persist/ethyDataRoot.ts'
import {
  PEER_BOOK_STARTUP_DIALS,
  clientFamilyFromClientId,
  discoveryNodeStorePath,
} from '../persist/peerBook.ts'
import type { PeerBookStore } from '../persist/peerBook.ts'
import { SnapPivotStore, snapBucketsUnfinished } from '../persist/snapStore.ts'
import type { JsonRpcError } from '../rpc/types.ts'
import type { RpcBundleNote } from '../rpc/types.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import { ResourceBudgetWatchdog } from '../runtime/resourceBudget.ts'
import { createSnapBuckets } from '../spine/buckets.ts'
import { raiseBestPeerHead } from '../spine/chainHead.ts'
import { deriveCapabilities, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, PeerTelemetry } from '../spine/types.ts'
import { SnapAccountSynchronizer } from '../sync/accountSync.ts'
import {
  BalChainStreamer,
  LAPTOP_WAKE_BLOCK_GAP,
  type VerifiedBalBlock,
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
import { EthySwarmSynchronizer } from '../sync/ethySwarmSync.ts'
import {
  notePivotBridgingProgress,
  planResumeStart,
  shouldReleaseSnapBridge,
} from '../sync/resumeCoordinator.ts'
import {
  type SnapResumeDecision,
  decideSnapResume,
  ethyBalTailAvailable,
  savedPivotExceedsResumeGap,
  shouldDeferLivePivotRequest,
  shouldEnsureSnapSync,
  shouldRefreshStaleSnapPivot,
  snapResumeProgressPct,
} from '../sync/resumePolicy.ts'
import { SnapPeerFlightTracker } from '../sync/snapFlight.ts'
import { createLiveSnapTransport } from '../sync/snapTransport.ts'
import { SNAP_VERIFY_POOL_MODULE_URL, SnapVerifyPool } from '../sync/snapVerifyWorker.ts'
import {
  type EthySeederView,
  type SyncMode,
  pickUsableEthySeeder,
  shouldLockSnapAfterGrace,
} from '../sync/syncSourceSelector.ts'
import { livePlazaWidget } from '../tools/livePlaza.ts'
import { createEthyTxPool } from '../txpool/pool.ts'
import { activeHardfork, advertisedForkHash, chainConfigForNetwork } from './chainHardfork.ts'
import {
  VIP_SNAP_PEER_TARGET,
  countSnapPeersTowardVipTarget,
  shouldVipReconnect,
  wantSnapDiscoveryHold,
} from './discoveryHold.ts'
import { refreshEthyWorkerAdvertisement, syncEthyPivotServeDir } from './ethyAdvertise.ts'
import { p2pHandshakeStatusFields } from './genesisStatus.ts'
import { parseEnodeUrl } from './parseEnode.ts'
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
  hasBalHash: boolean
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
  /** Direct `enode://` dials after worker start (WP-06b). */
  connectEnodeUrls?: string[]
  economy?: ETHEconomyDataManager
  onRpcBundle?: (note: RpcBundleNote) => void
  /** Base-state download preference (WP-06c). */
  syncMode?: SyncMode
}

export type PeerCoordinatorHandle = {
  stop: () => void
  refreshPivotHeader: () => void
  disconnectPeer: (peerId: string) => void
  noteChainHead: (blockNumber: bigint) => void
  submitRawTransaction: (hex: string) => Promise<{ result: string } | { error: JsonRpcError }>
}

function workerChainId(network: string): WorkerChainId {
  const key = network.toLowerCase()
  if (key === 'mainnet' || key === 'sepolia' || key === 'hoodi' || key === 'holesky') {
    return key
  }
  throw new Error(`Unsupported worker chain: ${network}`)
}

function mapPeer(
  snapshot: WorkerPeerSnapshot,
  prev?: PeerTelemetry,
  pivotFloor?: bigint,
): PeerTelemetry {
  const snapBlock = snapshot.latestBlock !== undefined ? BigInt(snapshot.latestBlock) : undefined
  const prevBlock = prev?.latestBlock
  let latestBlock =
    snapBlock !== undefined && prevBlock !== undefined
      ? snapBlock > prevBlock
        ? snapBlock
        : prevBlock
      : (snapBlock ?? prevBlock)
  if (
    pivotFloor !== undefined &&
    latestBlock !== undefined &&
    latestBlock > 0n &&
    latestBlock < pivotFloor &&
    prev !== undefined &&
    prev.snapResponsesOk > 0
  ) {
    latestBlock = pivotFloor
  }
  return {
    id: snapshot.id,
    clientName: snapshot.clientId || 'unknown',
    caps: [...snapshot.caps],
    snapSession: snapshot.snapSession === true,
    ethySession: snapshot.ethySession === true,
    ethyStatus: snapshot.ethyStatus,
    hasHead: snapshot.bestHash !== undefined,
    latestBlock,
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

function ethySeederRows(
  peers: WorkerPeerSnapshot[],
): Array<{ peerId: string; seeder: EthySeederView }> {
  const out: Array<{ peerId: string; seeder: EthySeederView }> = []
  for (const p of peers) {
    if (p.ethySession !== true || p.ethyStatus === undefined) continue
    const st = p.ethyStatus
    const maskRaw = st.bucketsBitmask
    const mask = maskRaw.startsWith('0x')
      ? Number.parseInt(maskRaw, 16)
      : Number.parseInt(maskRaw, 10)
    out.push({
      peerId: p.id,
      seeder: {
        bucketsBitmask: mask,
        basePivotBlock: BigInt(st.basePivotBlock),
        balEarliestBlock: BigInt(st.balEarliestBlock ?? st.basePivotBlock),
      },
    })
  }
  return out
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
  const dataDir = opts.dataDir ?? snapStore?.root ?? resolveEthyDataDir()
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
  let handoffCatchup = false
  let pendingResumeDecision: SnapResumeDecision | undefined
  let pendingResumeHead: bigint | undefined
  let lastBalProgressAt = Date.now()
  let baseSyncCompletePosted = false
  let markingBaseSyncComplete = false
  let headFlipSummaryPosted = false

  const populateHeadFlipSummary = (head: bigint) => {
    if (headFlipSummaryPosted) return
    headFlipSummaryPosted = true
    spine.headFlipSummary = livePlazaWidget(spine)
  }
  const rawSavedPeek = opts.fresh === true ? undefined : snapStore?.peekActive()
  const discardPartialSnapForEthy =
    rawSavedPeek !== undefined &&
    !rawSavedPeek.baseSyncComplete &&
    rawSavedPeek.bucketsDoneCount < 4 &&
    (opts.syncMode === 'ethy' || (opts.connectEnodeUrls?.length ?? 0) > 0)
  const savedSnapPeek = discardPartialSnapForEthy ? undefined : rawSavedPeek
  if (opts.fresh === true || discardPartialSnapForEthy) {
    snapStore?.discardPivots()
  }
  /** Saved snap journals replayed from disk (head used only for stale / BAL handoff). */
  let diskHydrated = savedSnapPeek === undefined
  let resumeDecided = savedSnapPeek === undefined
  let resumeHeadHandled = false
  let lastSnapProgressAt = Date.now()
  let lastSnapProgressAccounts = spine.totalAccountsSynced
  let resumeHydrateStarted = false
  let rollingStatusAdvertised = false
  const syncMode: SyncMode = opts.syncMode ?? 'auto'
  let firstEthStatusAtMs = 0
  let ethySwarm: EthySwarmSynchronizer | undefined
  let ethySeederPeerId: string | undefined
  let ethyAnchorBlock: bigint | undefined
  let ethyAnchorRoot: Uint8Array | undefined
  let ethyAnchorPending = false
  const bucketsAdvertised = new Set<number>()
  const verifyPool = new SnapVerifyPool({
    inProcess: opts.inProcess === true,
    moduleUrl: opts.inProcess === true ? undefined : SNAP_VERIFY_POOL_MODULE_URL,
  })
  if (spine.pivotStateRoot === undefined) {
    setPhase(spine, 'P2P_WARMUP')
  }

  const chain = chainConfigForNetwork(network)
  const hardfork = activeHardfork(chain)
  const privateKey = (() => {
    if (opts.inProcess === true || snapStore === undefined || !snapStore.enabled) {
      return genPrivateKey()
    }
    const keyPath = path.join(dataDir, 'node-key.txt')
    try {
      if (fs.existsSync(keyPath)) {
        const raw = fs.readFileSync(keyPath, 'utf8').trim().replace(/^0x/i, '')
        if (/^[0-9a-f]{64}$/i.test(raw)) {
          return hexToBytes(`0x${raw}`)
        }
      }
      const generated = genPrivateKey()
      fs.mkdirSync(dataDir, { recursive: true })
      fs.writeFileSync(keyPath, `${bytesToUnprefixedHex(generated)}\n`, { mode: 0o600 })
      return generated
    } catch {
      return genPrivateKey()
    }
  })()

  const ensureHeadFollower = (clientRef: Devp2pWorkerClient) => {
    if (spine.pivotStateRoot === undefined) return
    if (spine.syncTransport === 'ethy' && (ethySwarm === undefined || ethySwarm.isActive())) {
      return
    }
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
          let effectiveBlock = best.latestBlock !== undefined ? BigInt(best.latestBlock) : undefined
          if (
            spine.phase === 'SNAP_SYNCING' &&
            spine.pivotBridging === undefined &&
            effectiveBlock !== undefined
          ) {
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
            if (safeSnapHead !== undefined && safeSnapHead < effectiveBlock) {
              effectiveBlock = safeSnapHead
            }
          }
          return {
            id: best.id,
            ethVersion: highestEthVersion(best.caps),
            latestBlock: effectiveBlock !== undefined ? Number(effectiveBlock) : undefined,
          }
        },
        putServableBlock: (bundle) => clientRef.putServableBlock(bundle),
        onBalApplied: bundleBalHooks.onBalApplied,
        appendHealBal: bundleBalHooks.appendHealBal,
        appendHealBundle: bundleBalHooks.appendHealBundle,
        noteVerifiedBlock: (n) => snapStore?.noteVerifiedBlock(n),
        onSyncedToHead: (head) => {
          populateHeadFlipSummary(head)
          refreshEthyWorkerAdvertisement(clientRef, spine)
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
        economy: opts.economy,
        onRpcBundle: opts.onRpcBundle,
        onPivotStep: (newPivot) => {
          snapStore?.updatePivotHead({
            blockNumber: newPivot.blockNumber,
            blockHash: newPivot.blockHash,
            stateRoot: newPivot.stateRoot,
          })
          snapStore?.pruneHealBundlesUpTo(newPivot.blockNumber)
          lastBalProgressAt = Date.now()
          if (spine.pivotBridging !== undefined) {
            spine.pivotBridging = notePivotBridgingProgress(
              spine.pivotBridging,
              newPivot.blockNumber,
            )
            const head =
              spine.bestPeerHead ??
              pendingResumeHead ??
              spine.headBlockNumber ??
              newPivot.blockNumber
            if (shouldReleaseSnapBridge(head, newPivot.blockNumber)) {
              spine.pivotBridging = undefined
              ensureSnapSync(clientRef)
              opts.notices?.post(
                {
                  key: 'snap-bridge-done',
                  level: 'info',
                  text: `Pivot bridged to #${newPivot.blockNumber.toString()} — resuming snap/1`,
                  relevantForMs: 8_000,
                },
                Date.now(),
              )
            }
          }
          refreshEthyWorkerAdvertisement(clientRef, spine)
          deriveCapabilities(spine)
        },
        onBalBlockBuffered: () => {
          lastBalProgressAt = Date.now()
          deriveCapabilities(spine)
        },
        onVerifiedExecutionHeader: opts.witnessExecutionHeader,
      })
    }
    headFollower.start()
  }

  const noteBucketAdvertised = (clientRef: Devp2pWorkerClient, bucketIndex: number) => {
    if (bucketsAdvertised.has(bucketIndex)) return
    bucketsAdvertised.add(bucketIndex)
    const mask = snapStore?.ethyBucketsBitmaskFromBuckets(spine.snapBuckets) ?? 0
    spine.ethyBucketsBitmask = mask
    snapStore?.persistEthyBucketsBitmask(mask)
    refreshEthyWorkerAdvertisement(clientRef, spine)
    syncEthyPivotServeDir(clientRef, snapStore?.activePivotAccountsDir())
  }

  const ensureSnapSync = (clientRef: Devp2pWorkerClient) => {
    if (spine.syncTransport === 'ethy' && (ethySwarm === undefined || ethySwarm.isActive())) {
      return
    }
    if (spine.pivotBridging !== undefined) {
      return
    }
    if (savedSnapPeek !== undefined && !resumeHeadHandled) {
      return
    }
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
        .filter((p) => p.snapSession === true && (p.hasHead === true || p.snapResponsesOk > 0))
        .map((p) => ({
          id: p.id,
          caps: p.caps,
          snapResponsesOk: p.snapResponsesOk,
          snapTimeouts: p.snapTimeouts,
          avgLatencyMs: p.avgLatencyMs,
          latestBlock: p.latestBlock,
          clientFamily: clientFamilyFromClientId(p.clientName),
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
        onBucketDone: (bucketIndex) => noteBucketAdvertised(clientRef, bucketIndex),
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
      const contractProgress = snapStore?.takeContractProgress()
      if (contractProgress !== undefined) {
        codeSync.restoreContractTotals(contractProgress)
      }
      codeSync.start()
    }
    if (spine.syncTransport === 'ethy' && codeSync.pendingDone() && getSnapPeers().length === 0) {
      codeSync.clearPending()
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
    snapSync?.bumpRootGeneration()
    codeSync?.clearPending()
    headFollower?.resetForFreshPivot()
    stateManager.clearAccountsAndStorage()
    spine.pivotBlockNumber = undefined
    spine.pivotStateRoot = undefined
    spine.pivotStatusHint = undefined
    spine.pivotBridging = undefined
    spine.lastVerifiedBlockNumber = undefined
    spine.headBlockNumber = undefined
    spine.headStateRoot = undefined
    spine.streamedBalCount = 0
    spine.bufferedBalCount = 0
    spine.appliedBalCount = 0
    spine.pivotStepsCompleted = 0
    spine.ethyBucketsBitmask = 0
    bucketsAdvertised.clear()
    spine.snapBuckets = createSnapBuckets()
    spine.totalAccountsSynced = 0
    setPhase(spine, 'P2P_WARMUP')
  }

  const finishDiskResumeWithHead = (
    headBlock: bigint,
    peers: WorkerPeerSnapshot[] = lastTelemetryPeers,
  ): void => {
    if (snapStore === undefined || !diskHydrated) return
    raiseBestPeerHead(spine, headBlock)
    if (handoffCatchup) {
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
      deriveCapabilities(spine)
      return
    }
    const pivotNum = spine.pivotBlockNumber ?? savedSnapPeek?.pivotBlockNumber
    if (pivotNum !== undefined) {
      const ethyTail = ethyBalTailAvailable(
        pivotNum,
        headBlock,
        spine.peers.values(),
        spine.syncTransport,
      )
      const decision = decideSnapResume({
        fresh: false,
        saved: {
          pivotBlockNumber: pivotNum,
          baseSyncComplete: false,
          bucketsDoneCount: spine.snapBuckets.filter((b) => b.status === 'done').length,
        },
        head: headBlock,
        ethyBalTail: ethyTail,
      })
      if (decision === 'reset-stale') {
        abandonStaleSnapPivot(headBlock, peers, pivotNum)
        return
      }
      const plan = planResumeStart(decision, pivotNum, headBlock)
      if (plan.pivotBridging !== undefined) {
        spine.pivotBridging = plan.pivotBridging
        const gap = plan.pivotBridging.targetBlock - plan.pivotBridging.fromBlock
        opts.notices?.post(
          {
            key: 'snap-bridge',
            level: 'info',
            text: `Bridging snap pivot #${pivotNum.toString()} toward #${plan.pivotBridging.targetBlock.toString()} (+${gap.toString()} BALs)`,
            relevantForMs: 10_000,
          },
          Date.now(),
        )
      } else {
        spine.pivotBridging = undefined
      }
      if (plan.startBal) {
        ensureHeadFollower(client)
      }
      if (plan.startSnap) {
        ensureSnapSync(client)
      }
    }
    deriveCapabilities(spine)
  }

  const startResumeHydrate = (): void => {
    if (snapStore === undefined || resumeHydrateStarted) return
    const peek = snapStore.peekActive()
    if (peek === undefined) return
    resumeHydrateStarted = true
    const hydratePromise = snapStore.loadIntoAsync(spine, stateManager)
    if ((spine.ethyBucketsBitmask ?? 0) > 0) {
      syncEthyPivotServeDir(client, snapStore.activePivotAccountsDir())
      refreshEthyWorkerAdvertisement(client, spine)
    }
    void hydratePromise.then(
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

  const abandonStaleSnapPivot = (
    headBlock: bigint,
    peers: WorkerPeerSnapshot[],
    savedPivot: bigint,
  ): void => {
    const gap = headBlock - savedPivot
    snapStore?.discardPivots()
    clearSpinePivotForFreshAnchor()
    diskHydrated = true
    resumeHeadHandled = true
    lastSnapProgressAt = Date.now()
    lastSnapProgressAccounts = spine.totalAccountsSynced
    opts.notices?.clear('snap-resume', Date.now())
    opts.notices?.post(
      {
        key: 'snap-stale-reset',
        level: 'warn',
        text: `Saved partial snap (#${savedPivot.toString()}, +${gap.toString()} blocks) expired — starting fresh at #${headBlock.toString()}`,
        relevantForMs: 8_000,
      },
      Date.now(),
    )
    recordDiagnostic(spine, {
      subsystem: 'snap',
      severity: 'warn',
      message: `Saved snap pivot #${savedPivot.toString()} is ${gap.toString()} blocks behind head with no usable serve — anchoring fresh`,
    })
    const best = pickBestPeer(peers, pivotBlockedPeers)
    if (best !== undefined) requestPivotFromPeer(best)
    deriveCapabilities(spine)
  }

  const handleSnapResumeAtHead = (headBlock: bigint, peers: WorkerPeerSnapshot[]) => {
    if (resumeDecided) {
      if (diskHydrated && !resumeHeadHandled) {
        resumeHeadHandled = true
        finishDiskResumeWithHead(headBlock, peers)
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
    const ethyTail = ethyBalTailAvailable(
      peek.pivotBlockNumber,
      headBlock,
      spine.peers.values(),
      spine.syncTransport,
    )
    const decision = decideSnapResume({
      fresh: false,
      saved: peek,
      head: headBlock,
      ethyBalTail: ethyTail,
    })
    resumeDecided = true
    if (decision === 'reset-stale' && !resumeHydrateStarted) {
      abandonStaleSnapPivot(headBlock, peers, peek.pivotBlockNumber)
      return
    }
    if (decision === 'anchor-fresh') {
      diskHydrated = true
      return
    }
    pendingResumeDecision = decision
    pendingResumeHead = headBlock
    startResumeHydrate()
  }

  const maybeApplyResumeFromPeers = (peers: WorkerPeerSnapshot[]) => {
    const best = pickBestPeer(peers, pivotBlockedPeers)
    let headBlock = best?.latestBlock !== undefined ? BigInt(best.latestBlock) : undefined
    if (headBlock === undefined) {
      for (const p of peers) {
        const raw = p.ethyStatus?.balLatestBlock
        if (raw !== undefined && raw.length > 0) {
          const b = BigInt(raw)
          if (headBlock === undefined || b > headBlock) headBlock = b
        }
      }
    }
    if (headBlock === undefined || headBlock === 0n) return
    handleSnapResumeAtHead(headBlock, peers)
  }

  const maybeRefreshUnservedPivot = (peers: WorkerPeerSnapshot[]) => {
    if (spine.syncTransport === 'ethy' && ethySwarm?.isActive()) return
    const now = Date.now()
    const servingSnapPeers = [...spine.peers.values()].filter(
      (p) => p.snapSession === true && p.snapResponsesOk > 0,
    ).length
    if (spine.totalAccountsSynced !== lastSnapProgressAccounts || servingSnapPeers > 0) {
      lastSnapProgressAccounts = spine.totalAccountsSynced
      lastSnapProgressAt = now
    }
    const best = pickBestPeer(peers, pivotBlockedPeers)
    const headBlock =
      best?.latestBlock !== undefined ? BigInt(best.latestBlock) : spine.bestPeerHead
    if (
      !shouldRefreshStaleSnapPivot({
        phase: spine.phase,
        handoffCatchup,
        pivotBridging: spine.pivotBridging !== undefined,
        pivotBlock: spine.pivotBlockNumber,
        headBlock,
        servingSnapPeers,
        msSinceProgress: now - lastSnapProgressAt,
        msSinceBalProgress: now - lastBalProgressAt,
        ethyBalTail:
          spine.pivotBlockNumber !== undefined && headBlock !== undefined
            ? ethyBalTailAvailable(
                spine.pivotBlockNumber,
                headBlock,
                spine.peers.values(),
                spine.syncTransport,
              )
            : false,
      })
    ) {
      return
    }
    abandonStaleSnapPivot(headBlock!, peers, spine.pivotBlockNumber!)
  }

  const finishDiskHydrate = async (
    restored: number,
    peek: NonNullable<ReturnType<SnapPivotStore['peekActive']>>,
  ) => {
    diskHydrated = true
    resumeDecided = true
    if (snapStore !== undefined) {
      const mask =
        spine.ethyBucketsBitmask ?? snapStore.ethyBucketsBitmaskFromBuckets(spine.snapBuckets)
      if (mask > 0) {
        spine.ethyBucketsBitmask = mask
        syncEthyPivotServeDir(client, snapStore.activePivotAccountsDir())
        refreshEthyWorkerAdvertisement(client, spine)
      }
    }
    const contractProgress = snapStore?.takeContractProgress()
    if (contractProgress !== undefined) {
      spine.codesSynced = contractProgress.codesSynced
      spine.codesTotal = contractProgress.codesTotal
      spine.storageAccountsSynced = contractProgress.storageAccountsSynced
      spine.storageAccountsTotal = contractProgress.storageAccountsTotal
      spine.storageSlotsSynced = contractProgress.storageSlotsSynced
    }
    if (peek.baseSyncComplete || !snapBucketsUnfinished(spine.snapBuckets)) {
      handoffCatchup = true
      if (spine.syncTransport === 'unset') {
        spine.syncTransport = (spine.ethyBucketsBitmask ?? 0) > 0 ? 'ethy' : 'snap'
      }
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
      const blocks = snapStore!.takeRestoredHealBlocks()
      ensureHeadFollower(client)
      headFollower?.restoreBuffered(blocks)
    }
    deriveCapabilities(spine)
    if (!resumeHeadHandled) {
      const best = pickBestPeer(lastTelemetryPeers, pivotBlockedPeers)
      let ethyHead: bigint | undefined
      for (const p of lastTelemetryPeers) {
        const raw = p.ethyStatus?.balLatestBlock
        if (raw !== undefined && raw.length > 0) {
          const b = BigInt(raw)
          if (ethyHead === undefined || b > ethyHead) ethyHead = b
        }
      }
      const headBlock =
        best?.latestBlock !== undefined
          ? BigInt(best.latestBlock)
          : (pendingResumeHead ?? spine.bestPeerHead ?? ethyHead)
      if (headBlock !== undefined && headBlock > 0n) {
        resumeHeadHandled = true
        finishDiskResumeWithHead(headBlock, lastTelemetryPeers)
      }
    }
    if (!peek.baseSyncComplete && spine.pivotStateRoot !== undefined) {
      const contracts = snapStore!.drainRestoredContracts()
      for (let i = 0; i < contracts.length; i += RESTORED_CONTRACTS_CHUNK) {
        codeSync?.noteAccounts(contracts.slice(i, i + RESTORED_CONTRACTS_CHUNK))
        if (i + RESTORED_CONTRACTS_CHUNK < contracts.length) {
          await new Promise<void>((resolve) => setImmediate(resolve))
        }
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
    if (spine.syncTransport === 'ethy' && ethySwarm?.isActive()) return
    if (spine.syncTransport !== 'ethy' && codeSync !== undefined && !codeSync.pendingDone()) return
    if (spine.pivotBlockNumber === undefined) return
    markingBaseSyncComplete = true
    void (async () => {
      try {
        await headFollower?.flushBufferedBlocks()
        const pivot = spine.pivotBlockNumber
        if (pivot === undefined) return
        const verified =
          spine.lastVerifiedBlockNumber !== undefined && spine.lastVerifiedBlockNumber > pivot
            ? spine.lastVerifiedBlockNumber
            : pivot
        snapStore.markBaseSyncComplete(verified)
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
        raiseBestPeerHead(spine, bestHead)
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
    for (const peer of explicitConnectPeers) {
      if (!spine.peers.has(peer.idHex)) {
        client.connectPeer({
          id: peer.id,
          address: peer.address,
          tcpPort: peer.tcpPort,
          udpPort: peer.udpPort,
        })
      }
    }
    if (peerBook === undefined) return
    for (const [id, until] of pendingVipDials) {
      if (until <= now) pendingVipDials.delete(id)
    }
    const towardTarget = countSnapPeersTowardVipTarget([...spine.peers.values()])
    if (!shouldVipReconnect({ snapPeersTowardTarget: towardTarget })) return
    const connected = new Set(spine.peers.keys())
    const need = Math.min(2, VIP_SNAP_PEER_TARGET - towardTarget)
    let dialed = 0
    for (const peer of peerBook.vipDialCandidates(now, 64)) {
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
    appendHealBundle: (entry: VerifiedBalBlock) => {
      const pivot = spine.pivotBlockNumber
      if (pivot === undefined || entry.blockNumber <= pivot) return
      snapStore?.appendHealBundle(entry)
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
      economy: opts.economy,
      onRpcBundle: opts.onRpcBundle,
    })
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: `Servable pivot bundle registered at #${bundleFetch.number.toString()}`,
    })
    bundleFetch = undefined
  }

  const commitPivotAnchor = (
    parsed: {
      number: bigint
      hash: Uint8Array
      stateRoot: Uint8Array
      blockAccessListHash?: Uint8Array
    },
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
    opts.witnessExecutionHeader?.(parsed.number, parsed.hash)
    if (firstAnchor || (prevRoot !== undefined && !equalsBytes(prevRoot, parsed.stateRoot))) {
      opts.notices?.clear('snap-resume', Date.now())
      snapStore?.activatePivot({
        blockNumber: parsed.number,
        blockHash: parsed.hash,
        stateRoot: parsed.stateRoot,
      })
      // Cursors live in memory. The new directory must not reboot them at nibble zero.
      snapStore?.flushBuckets(spine.snapBuckets)
      syncEthyPivotServeDir(client, snapStore?.activePivotAccountsDir())
      refreshEthyWorkerAdvertisement(client, spine)
    }
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: `Pivot anchored at #${parsed.number.toString()}`,
    })
    // A stale-pivot reset drops the phase to P2P_WARMUP. Snap sync may already
    // be running, so start() will not set the phase again.
    if (spine.phase === 'BOOTING' || spine.phase === 'P2P_WARMUP') {
      setPhase(spine, 'SNAP_SYNCING')
    }
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
      economy: opts.economy,
      onRpcBundle: opts.onRpcBundle,
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
    parsed: { number: bigint; hash: Uint8Array; blockAccessListHash?: Uint8Array },
    headerRlp: Uint8Array,
  ) => {
    if (bundleFetch !== undefined) return
    bundleFetch = {
      peerId,
      ethVersion,
      number: parsed.number,
      hash: parsed.hash,
      headerRlp,
      hasBalHash: parsed.blockAccessListHash !== undefined && parsed.blockAccessListHash.length > 0,
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
      if (bundleFetch.ethVersion >= 71 && bundleFetch.hasBalHash) {
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

  const livePivotAllowed = (): boolean => {
    if (spine.syncTransport === 'unset') return false
    if (spine.syncTransport === 'ethy' && spine.pivotStateRoot === undefined) return false
    return !shouldDeferLivePivotRequest({
      fresh: opts.fresh === true,
      diskHydrated,
      spinePivotBlockNumber: spine.pivotBlockNumber,
      saved: snapStore?.peekActive(),
    })
  }

  const requestPivotHeaderAt = (
    peer: WorkerPeerSnapshot,
    blockNumber: bigint,
    anchorOpts: { ethyAnchor?: boolean } = {},
  ) => {
    if (anchorOpts.ethyAnchor !== true && !livePivotAllowed()) return
    if (inFlightPeerId !== undefined) return
    if (peer.bestHash === undefined) return
    const ethVersion = highestEthVersion(peer.caps)
    inFlightPeerId = peer.id
    inFlightEthVersion = ethVersion
    inFlightStartedAt = Date.now()
    inFlightBlockNumber = blockNumber
    inFlightHash = undefined
    if (anchorOpts.ethyAnchor === true) ethyAnchorPending = true
    const payload = encodeGetBlockHeadersByNumberPayload(ethVersion, blockNumber)
    client.sendEthMessage(peerIdToBytes(peer.id), EthMessageCodes.GET_BLOCK_HEADERS, payload)
  }

  const requestPivotFromPeer = (peer: WorkerPeerSnapshot, mode: 'hash' | 'number' = 'hash') => {
    if (mode === 'number') {
      if (peer.latestBlock === undefined) return
      requestPivotHeaderAt(peer, BigInt(peer.latestBlock))
      return
    }
    if (!livePivotAllowed()) return
    if (inFlightPeerId !== undefined) return
    if (peer.bestHash === undefined) return
    const ethVersion = highestEthVersion(peer.caps)
    inFlightPeerId = peer.id
    inFlightEthVersion = ethVersion
    inFlightStartedAt = Date.now()
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

  let txPool: ReturnType<typeof createEthyTxPool> | undefined

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
      capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1', 'ethy0'],
      listenPort: opts.listenPort ?? 0,
      goodCitizen: opts.goodCitizen ?? true,
      // An empty account proof is not valid snap, so inbound GETs stay unanswered.
      // Outbound ranges are small, and the pong deadline is 30s, so a busy server can stay up.
      answerEmptySnap: false,
      // DNS ENR tree + EIP-868 ENR-verified discv4 neighbour crawl.
      shouldFindNeighbours: opts.shouldFindNeighbours ?? true,
      chainDirectoryDiscovery: opts.shouldFindNeighbours === false ? false : true,
      clientId: utf8ToBytes(`ethy/v${getEthyClientVersion()}`),
      status,
      endpoint: { address: '0.0.0.0', udpPort: 0, tcpPort: opts.listenPort ?? 0 },
      throttleDiscovery: true,
      nodeStorePath: discoveryNodeStorePath(dataDir, network),
      ethyPivotDir: snapStore?.activePivotAccountsDir(),
    },
    workerModuleUrl,
  )

  txPool = createEthyTxPool({
    stateManager,
    chain,
    hardfork,
    chainId: spine.chainId,
    worker: client,
    getEthPeerIds: () =>
      lastTelemetryPeers
        .filter((p) => p.bestHash !== undefined && p.bestHash.length > 2)
        .map((p) => p.id),
    sendEth: sendEthToPeer,
  })

  const startEthySwarmSync = () => {
    if (
      ethySeederPeerId === undefined ||
      ethyAnchorBlock === undefined ||
      ethyAnchorRoot === undefined ||
      spine.pivotStateRoot === undefined
    ) {
      return
    }
    const peer = lastTelemetryPeers.find((p) => p.id === ethySeederPeerId)
    const maskRaw = peer?.ethyStatus?.bucketsBitmask ?? '0'
    const seedMask = maskRaw.startsWith('0x')
      ? Number.parseInt(maskRaw, 16)
      : Number.parseInt(maskRaw, 10)
    const head = spine.bestPeerHead ?? ethyAnchorBlock
    ethySwarm?.stop()
    ethySwarm = new EthySwarmSynchronizer({
      spine,
      stateManager,
      client,
      snapStore,
      verifyPool,
      seederPeerId: ethySeederPeerId,
      seedBucketsBitmask: seedMask,
      chunkStateRoot: ethyAnchorRoot,
      pivotBlockNumber: ethyAnchorBlock,
      balThroughBlock: head,
      onAccountsIngested: (entries) => codeSync?.noteAccounts(entries),
      onBucketDone: (idx) => noteBucketAdvertised(client, idx),
      onAccountsComplete: () => {
        if (!ethySwarm?.isActive()) {
          maybeMarkBaseSyncComplete()
          ensureSnapSync(client)
        }
      },
      onSwarmComplete: () => {
        maybeMarkBaseSyncComplete()
        ensureSnapSync(client)
      },
      economy: opts.economy,
    })
    ethySwarm.start()
    setPhase(spine, 'SNAP_SYNCING')
    deriveCapabilities(spine)
  }

  const loggedEthyPeers = new Set<string>()
  const noteRemoteEthyPeers = (peers: WorkerPeerSnapshot[]) => {
    for (const p of peers) {
      if (p.ethySession !== true || p.ethyStatus === undefined) continue
      const key = `${p.id}:${p.ethyStatus.basePivotBlock}:${p.ethyStatus.bucketsBitmask}`
      if (loggedEthyPeers.has(key)) continue
      loggedEthyPeers.add(key)
      recordDiagnostic(spine, {
        subsystem: 'ethy',
        severity: 'info',
        peerId: p.id,
        message: `ETHY STATUS in: pivot #${p.ethyStatus.basePivotBlock} mask ${p.ethyStatus.bucketsBitmask} bal #${p.ethyStatus.balEarliestBlock ?? '?'}..#${p.ethyStatus.balLatestBlock ?? '?'}`,
      })
    }
  }

  const anchorEthyPivotFromStatus = (peer: WorkerPeerSnapshot) => {
    const st = peer.ethyStatus
    if (st === undefined) return
    const rootHex = st.basePivotStateRoot
    if (rootHex.length === 0) return
    const root = hexToBytes((rootHex.startsWith('0x') ? rootHex : `0x${rootHex}`) as `0x${string}`)
    const block = BigInt(st.basePivotBlock)
    ethyAnchorBlock = block
    ethyAnchorRoot = root
    commitPivotAnchor(
      { number: block, hash: new Uint8Array(32), stateRoot: root },
      null,
      peer.id,
      highestEthVersion(peer.caps),
      { skipServableBundle: true, firstAnchor: true },
    )
    startEthySwarmSync()
  }

  const requestEthyPivotHeader = () => {
    if (ethySeederPeerId === undefined || ethyAnchorBlock === undefined) return
    const peer = lastTelemetryPeers.find((p) => p.id === ethySeederPeerId)
    if (peer === undefined) return
    requestPivotHeaderAt(peer, ethyAnchorBlock, { ethyAnchor: true })
  }

  const explicitConnectPeers = (opts.connectEnodeUrls ?? []).map((url) => {
    const enode = parseEnodeUrl(url)
    return {
      id: enode.id,
      idHex: bytesToUnprefixedHex(enode.id).toLowerCase(),
      address: enode.address,
      tcpPort: enode.tcpPort,
      udpPort: enode.udpPort ?? enode.tcpPort,
    }
  })
  const explicitConnectPeerIds = new Set(explicitConnectPeers.map((p) => p.idHex))

  const tryLockSyncTransport = (peers: WorkerPeerSnapshot[]) => {
    if (handoffCatchup || !snapBucketsUnfinished(spine.snapBuckets)) {
      if (spine.syncTransport === 'unset') {
        spine.syncTransport = (spine.ethyBucketsBitmask ?? 0) > 0 ? 'ethy' : 'snap'
      }
      return
    }
    const bucketsDone = spine.snapBuckets.filter((b) => b.status === 'done').length
    const canPreemptSnapForEthy =
      spine.syncTransport === 'snap' &&
      syncMode !== 'snap' &&
      !handoffCatchup &&
      spine.phase !== 'HEAD_FOLLOWING' &&
      spine.phase !== 'BAL_CATCHUP' &&
      bucketsDone < 4
    if (spine.syncTransport !== 'unset' && !canPreemptSnapForEthy) return
    if (!diskHydrated && spine.pivotStateRoot === undefined) return
    if (syncMode === 'snap') {
      spine.syncTransport = 'snap'
      return
    }
    const statusOk = spine.discovery?.rlpx.statusOk ?? 0
    const withHead = peers.filter((p) => p.bestHash !== undefined).length
    if ((statusOk > 0 || withHead > 0) && firstEthStatusAtMs === 0) {
      firstEthStatusAtMs = Date.now()
    }
    const head = spine.bestPeerHead ?? 0n
    const seeders = ethySeederRows(peers)
    const explicitSeeders = seeders.filter((s) =>
      explicitConnectPeerIds.has(s.peerId.toLowerCase()),
    )
    const pick =
      explicitSeeders.length > 0
        ? pickUsableEthySeeder(explicitSeeders, head, 'ethy')
        : pickUsableEthySeeder(seeders, head, syncMode)
    if (pick !== undefined) {
      if (canPreemptSnapForEthy) {
        snapSync?.stop()
        snapSync = undefined
        codeSync?.stop()
        codeSync = undefined
        headFollower?.stop()
        headFollower = undefined
        snapStore?.discardPivots()
        clearSpinePivotForFreshAnchor()
        recordDiagnostic(spine, {
          subsystem: 'ethy',
          severity: 'info',
          peerId: pick.peerId,
          message: `ETHY seeder connected — preempting early SNAP sync to anchor at #${pick.seeder.basePivotBlock.toString()}`,
        })
      }
      spine.syncTransport = 'ethy'
      ethySeederPeerId = pick.peerId
      ethyAnchorBlock = pick.seeder.basePivotBlock
      const row = peers.find((p) => p.id === pick.peerId)
      if (row !== undefined) {
        anchorEthyPivotFromStatus(row)
      }
      return
    }
    if (spine.syncTransport !== 'unset') return
    if (syncMode === 'ethy') return
    if (firstEthStatusAtMs === 0) return
    const elapsed = Date.now() - firstEthStatusAtMs
    if (
      explicitConnectPeerIds.size > 0 &&
      elapsed < 30_000 &&
      !peers.some((p) => explicitConnectPeerIds.has(p.id.toLowerCase()))
    ) {
      return
    }
    if (shouldLockSnapAfterGrace(syncMode, spine.syncTransport, elapsed, false)) {
      spine.syncTransport = 'snap'
    }
  }

  for (const peer of explicitConnectPeers) {
    client.connectPeer({
      id: peer.id,
      address: peer.address,
      tcpPort: peer.tcpPort,
      udpPort: peer.udpPort,
    })
  }

  const maybeEnableRollingStatus = () => {
    if (rollingStatusAdvertised) return
    if (
      spine.phase === 'SNAP_SYNCING' ||
      spine.phase === 'BAL_CATCHUP' ||
      spine.phase === 'HEAD_FOLLOWING'
    ) {
      if ((spine.serving?.blocksStored ?? 0) > 0) {
        client.setAdvertiseBlockRange(true)
        rollingStatusAdvertised = true
      }
    }
  }

  if (peerBook !== undefined) {
    const now = Date.now()
    peerBook.pruneOnStart(now)
    for (const peer of peerBook.dialCandidates(now)) {
      client.connectPeer(peer)
    }
  }

  if (opts.fresh !== true && savedSnapPeek !== undefined) {
    startResumeHydrate()
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
      spine.peers.set(p.id, mapPeer(p, prev.get(p.id), spine.pivotBlockNumber))
      pendingVipDials.delete(p.id.toLowerCase())
      peerBook?.noteTelemetryPeer(p, Date.now())
    }
    spine.discovery = snap.discovery
    const prevServingLatest = spine.serving?.latestBlock
    spine.serving = snap.serving
    if (
      spine.serving?.latestBlock !== undefined &&
      spine.serving.latestBlock !== prevServingLatest
    ) {
      refreshEthyWorkerAdvertisement(client, spine)
    }
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
    maybeRefreshUnservedPivot(snap.peers)
    const bestPeer = pickBestPeer(snap.peers, pivotBlockedPeers)
    if (bestPeer?.latestBlock !== undefined) {
      raiseBestPeerHead(spine, BigInt(bestPeer.latestBlock))
      const peerHead = spine.bestPeerHead
      if (
        spine.phase === 'HEAD_FOLLOWING' &&
        spine.headBlockNumber !== undefined &&
        peerHead !== undefined &&
        peerHead > spine.headBlockNumber + LAPTOP_WAKE_BLOCK_GAP
      ) {
        seedBalCatchUp(spine, peerHead)
        ensureHeadFollower(client)
      }
    }
    noteRemoteEthyPeers(snap.peers)
    tryLockSyncTransport(snap.peers)
    if (spine.syncTransport === 'ethy' && spine.pivotStateRoot === undefined) {
      const row = ethySeederPeerId
        ? lastTelemetryPeers.find((p) => p.id === ethySeederPeerId)
        : undefined
      if (row !== undefined) anchorEthyPivotFromStatus(row)
    }
    if (
      inFlightPeerId === undefined &&
      spine.pivotBlockNumber === undefined &&
      !ethyAnchorPending
    ) {
      if (spine.syncTransport === 'unset' && syncMode === 'ethy') {
        // Wait for a usable ETHY STATUS (selector locks transport).
      } else if (spine.syncTransport !== 'ethy' && bestPeer !== undefined) {
        requestPivotFromPeer(bestPeer)
      }
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
      if (spine.syncTransport === 'ethy' && ethySwarm?.isActive()) {
        if (discoveryHoldActive !== true) {
          clientRef.setDiscoveryPaused(true)
          discoveryHoldActive = true
          recordDiagnostic(spine, {
            subsystem: 'devp2p',
            severity: 'info',
            message: 'Discovery paused (ETHY swarm sync active)',
          })
        }
        return
      }
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
    if (msg.protocol === 'ethy') {
      ethySwarm?.handleMessage(msg.peerId, msg.code, msg.payload)
      return
    }
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
    const wasEthyAnchor = ethyAnchorPending
    clearPivotInFlight()
    if (wasEthyAnchor) {
      ethyAnchorPending = false
      if (
        parsed === null ||
        ethyAnchorRoot === undefined ||
        !equalsBytes(parsed.stateRoot, ethyAnchorRoot)
      ) {
        recordDiagnostic(spine, {
          subsystem: 'devp2p',
          severity: 'warn',
          message: 'ETHY anchor header missing or state root mismatch',
          peerId: successPeerId,
        })
        return
      }
      commitPivotAnchor(parsed, headerRlp, successPeerId, successEthVersion, {
        skipServableBundle: true,
        firstAnchor: true,
      })
      startEthySwarmSync()
      return
    }
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
    noteChainHead: (blockNumber: bigint) => {
      headFollower?.noteChainHead(blockNumber)
    },
    refreshPivotHeader: () => {
      clearPivotInFlight()
      pivotBlockedPeers.clear()
    },
    submitRawTransaction: (hex) => {
      if (txPool === undefined) {
        return Promise.resolve({ error: { code: -32000, message: 'P2P not ready' } })
      }
      return txPool.submitRawTransactionHex(hex)
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
