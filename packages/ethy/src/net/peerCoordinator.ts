import * as fs from 'node:fs'
import * as path from 'node:path'

import {
  type Devp2pWorkerClient,
  EthyMessageCodes,
  type WorkerChainId,
  type WorkerPeerSnapshot,
  type WorkerTelemetrySnapshot,
  createThreadedNetwork,
  genPrivateKey,
  networkProfilesEqual,
  pk2id,
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
import { secp256k1 } from '@noble/curves/secp256k1.js'

import { DEFAULT_CUSTODY_COUNT } from '../cli/args.ts'
import { getEthyClientVersion } from '../clientMeta.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { CustodyMissDelegate } from '../custody/custodyMissDelegate.ts'
import {
  beginCustodyBalOnboarding,
  custodyFastPathEnabled,
  custodyOnboardingPivotBlock,
  desiredCustodyBucketsMask,
} from '../custody/custodyOnboarding.ts'
import { loadOrAssignCustody } from '../custody/custodyPlan.ts'
import {
  CustodyStateResolver,
  createCustodyResolverHooks,
} from '../custody/custodyStateResolver.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { NoticeBoard } from '../notify/board.ts'
import {
  discoveryLooksBlocked,
  initialP2pLinkState,
  syncP2pLinkNotices,
} from '../notify/p2pLink.ts'
import { copyBalTailRange } from '../persist/balTailArchive.ts'
import type { BalTailBatchEntry } from '../persist/balTailArchive.ts'
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
import { computeAccountRangeFraction, createSnapBuckets } from '../spine/buckets.ts'
import { localVerifiedBlock, raiseBestPeerHead } from '../spine/chainHead.ts'
import { deriveCapabilities, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, PeerTelemetry } from '../spine/types.ts'
import { StatyWriteIndex } from '../staty/writeIndex.ts'
import { SnapAccountSynchronizer } from '../sync/accountSync.ts'
import {
  BalChainStreamer,
  LAPTOP_WAKE_BLOCK_GAP,
  type VerifiedBalBlock,
  growBalCatchUpTarget,
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
import { selectCanonicalSnapPivotTarget } from '../sync/canonicalPivotGrid.ts'
import { SnapCodeAndStorageSynchronizer } from '../sync/codeAndStorageSync.ts'
import { pickEthyAnchorForStaleResume } from '../sync/ethyAnchorResume.ts'
import { EthyCodeStorageSynchronizer } from '../sync/ethyCodeStorageSync.ts'
import { seederFromWorkerStatus } from '../sync/ethySeederSchedule.ts'
import { EthySwarmSynchronizer } from '../sync/ethySwarmSync.ts'
import {
  type MachinePlan,
  bootNetworkProfile,
  buildMachineObservation,
  createMachineState,
  stepMachineOrchestrator,
} from '../sync/machineOrchestrator.ts'
import { createMinterHeaderBook, noteMinterHeaderVerified } from '../sync/minterHeaderBook.ts'
import { createMinterLivenessBook, noteMinterEthyServe } from '../sync/minterLiveness.ts'
import { notePivotBridgingProgress, shouldReleaseSnapBridge } from '../sync/resumeCoordinator.ts'
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
import {
  type ShadowPivotSession,
  advanceShadowPivotSession,
  pickShadowEthySeeder,
  shadowEthySeedMaskSatisfied,
  startShadowBalTailCopy,
} from '../sync/shadowPivotRunner.ts'
import {
  type ShadowSnapMintSession,
  computePartialMinterMask,
  createShadowMintBuckets,
  nextShadowMintBucketCap,
  selectShadowMintPivotBlock,
  shadowSnapMintProgressPct,
  shadowSnapMintReadyToFlip,
} from '../sync/shadowSnapMint.ts'
import { SnapPeerFlightTracker } from '../sync/snapFlight.ts'
import { createLiveSnapTransport } from '../sync/snapTransport.ts'
import { SNAP_VERIFY_POOL_MODULE_URL, SnapVerifyPool } from '../sync/snapVerifyWorker.ts'
import {
  BAL_CATCHUP_STALE_WARN_GAP,
  BAL_CATCHUP_STALE_WARN_MS,
  classifyHydratedDiskState,
  classifySavedDiskState,
  planNetworkHeadResume,
  planPostHydration,
  resolveLiveNetworkHead,
  shouldReenterBalCatchUp,
} from '../sync/startupStateMachine.ts'
import { MACRO_GENERATION_GRID_BLOCKS } from '../sync/swarmGenerationPolicy.ts'
import {
  type GenerationElectionHandle,
  applyBackupElectionStaggerOnSuppressionLift,
  armGenerationElection,
  ensureGenerationElectionArmed,
  minHealPruneBlock,
  refreshSpineSwarmTelemetry,
  tickGenerationElection,
} from '../sync/swarmRuntime.ts'
import {
  type EthySeederView,
  type SyncMode,
  freshestEthyPivot,
  isFreshEthyPreemptCandidate,
  pickAllUsableEthySeeders,
  pickUsableEthySeeder,
  preferCanonicalSnapOverEthy,
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
import {
  refreshEthyWorkerAdvertisement,
  refreshShadowMinterAdvertisement,
  syncEthyPivotServeDir,
} from './ethyAdvertise.ts'
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
const SHADOW_MINT_HEADER_TIMEOUT_MS = 20_000
const VIP_RECONNECT_INTERVAL_MS = 5_000
const RESTORED_CONTRACTS_CHUNK = 2_000
/** RLPx table during snap. Wide tables get the client dropped for too many peers. */
function countEthyBucketBits(mask: number): number {
  let n = 0
  for (let b = 0; b < 16; b++) {
    if ((mask & (1 << b)) !== 0) n++
  }
  return n
}

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
  /** Background shadow pivot refresh (WP-11b). */
  shadowRefreshEnabled?: boolean
  /** CL poll cadence from the machine reconciler (WP-13). */
  setConsensusPollInterval?: (ms: number) => void
  /** WP-16d custody dial count (default 2). */
  custodyCount?: number
  /** WP-16d explicit `snap/1` dial (also on when `syncMode === 'snap'`). */
  snapBootstrap?: boolean
  custodyMissDelegate?: CustodyMissDelegate
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
        balLatestBlock: BigInt(st.balLatestBlock ?? st.basePivotBlock),
      },
    })
  }
  return out
}

function buildUsableEthyDescriptors(
  peers: WorkerPeerSnapshot[],
  bestPeerHead: bigint,
  syncMode: SyncMode,
  explicitConnect: boolean,
): import('../sync/ethySeederSchedule.ts').EthySeederDescriptor[] {
  const rows = ethySeederRows(peers)
  const modeForPick: SyncMode = explicitConnect ? 'ethy' : syncMode
  const usable = pickAllUsableEthySeeders(rows, bestPeerHead, modeForPick)
  const out: import('../sync/ethySeederSchedule.ts').EthySeederDescriptor[] = []
  for (const row of usable) {
    const peer = peers.find((p) => p.id === row.peerId)
    if (peer?.ethyStatus === undefined) continue
    const desc = seederFromWorkerStatus(row.peerId, peer.ethyStatus)
    if (desc !== undefined) out.push(desc)
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
  const shadowMintFlightTracker = new SnapPeerFlightTracker()
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
  const initialDiskResumeKind = classifySavedDiskState(savedSnapPeek, opts.fresh === true)
  spine.diskResumeKind = initialDiskResumeKind
  spine.diskResumeBlock =
    savedSnapPeek !== undefined
      ? (savedSnapPeek.lastVerifiedBlockNumber ?? savedSnapPeek.pivotBlockNumber)
      : undefined
  /** Saved snap journals replayed from disk (head used only for stale / BAL handoff). */
  let diskHydrated = savedSnapPeek === undefined
  spine.diskHydrated = diskHydrated
  let resumeDecided = savedSnapPeek === undefined
  let resumeHeadHandled = savedSnapPeek === undefined
  let pendingRestoredHealBlocks: VerifiedBalBlock[] = []
  let restoredContractsDrained = false
  let balCatchUpStallStartedAt = 0
  let balCatchUpStallWarned = false
  let balCatchUpLastApplied = -1
  let balCatchUpNoProgressSince = 0
  let balCatchUpProgressStalled = false
  let lastSnapProgressAt = Date.now()
  let lastSnapProgressAccounts = spine.totalAccountsSynced
  let resumeHydrateStarted = false
  let rollingStatusAdvertised = false
  const syncMode: SyncMode = opts.syncMode ?? 'auto'
  const snapBootstrap = opts.snapBootstrap === true || syncMode === 'snap'
  const custodyCount = opts.custodyCount ?? DEFAULT_CUSTODY_COUNT
  const custodyBaseComplete = savedSnapPeek?.baseSyncComplete === true
  const custodyFastOnboard = custodyFastPathEnabled({
    snapBootstrap,
    baseSyncComplete: custodyBaseComplete,
  })
  let custodyLiveReached = false
  let custodyOnboardingPivotRequested = false
  const statyWriteIndex = new StatyWriteIndex(ethyKeccak256)
  let custodyResolver: CustodyStateResolver | undefined
  let custodyCodeSync: EthyCodeStorageSynchronizer | undefined
  let firstEthStatusAtMs = 0
  let ethySwarm: EthySwarmSynchronizer | undefined
  let ethySeederPeerId: string | undefined
  let ethyAnchorBlock: bigint | undefined
  let ethyAnchorRoot: Uint8Array | undefined
  let ethyAnchorPending = false
  let pendingCanonicalSnapTarget: bigint | undefined
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

  const custodyAssign = loadOrAssignCustody(snapStore?.getCustodyMeta(), privateKey, custodyCount)
  spine.custodyBuckets = custodyAssign.buckets
  spine.closedBucketsMask = snapStore?.closedBucketsMaskFromPlanes() ?? 0
  spine.ethyBucketsBitmask = spine.closedBucketsMask
  stateManager.setClosedBucketsMask(spine.closedBucketsMask)
  if (snapStore?.getCustodyMeta() !== undefined) {
    snapStore.persistCustodyAssignment(
      custodyAssign.nodeIdHex,
      custodyAssign.count,
      custodyAssign.buckets,
    )
  }
  spine.custodyBalOnboarding = custodyFastOnboard
  const desiredEthyMask = desiredCustodyBucketsMask(custodyAssign.buckets)
  const localNodeId = pk2id(secp256k1.getPublicKey(privateKey, false))
  const shadowRefreshEnabled = opts.shadowRefreshEnabled !== false
  const processStartedAtMs = Date.now()
  let generationElection: GenerationElectionHandle | undefined
  const minterLiveness = createMinterLivenessBook()
  const minterHeaderBook = createMinterHeaderBook()
  let shadowPivotSession: ShadowPivotSession | undefined
  let shadowSnapMintSession: ShadowSnapMintSession | undefined
  let shadowSnapMintSync: SnapAccountSynchronizer | undefined
  let shadowMintHeaderFlight:
    | { peerId: string; targetBlock: bigint; ethVersion: number; startedAt: number }
    | undefined
  let shadowEthySwarm: EthySwarmSynchronizer | undefined
  let shadowEthyBuckets: import('../spine/types.ts').SnapBucket[] = []
  const shadowEthyBucketsDone = new Set<number>()
  let shadowLowDiskWarned = false

  const advertisePartialMinter = (
    clientRef: Devp2pWorkerClient,
    targetBlock: bigint,
    stateRootHex: string,
    bucketsMask: number,
  ) => {
    if (spine.swarm?.shadowRefresh !== undefined) {
      spine.swarm.shadowRefresh.partialMinterMask = bucketsMask
    }
    const root = hexToBytes(
      (stateRootHex.startsWith('0x') ? stateRootHex : `0x${stateRootHex}`) as `0x${string}`,
    )
    const balLatest = spine.lastVerifiedBlockNumber ?? targetBlock
    refreshShadowMinterAdvertisement(clientRef, {
      pivotBlock: targetBlock,
      stateRoot: root,
      bucketsMask,
      balEarliest: targetBlock + 1n,
      balLatest,
    })
  }

  const finishShadowPivotFlip = (
    clientRef: Devp2pWorkerClient,
    stateRootHex: string,
    targetPivotBlock: bigint,
  ): boolean => {
    if (snapStore === undefined) return false
    if (!snapStore.promoteShadowPivotToActive(stateRootHex)) return false
    snapStore.setShadowPersistRoot(undefined)
    const normalizedHex = (
      stateRootHex.startsWith('0x') ? stateRootHex : `0x${stateRootHex}`
    ) as `0x${string}`
    spine.pivotBlockNumber = targetPivotBlock
    spine.pivotStateRoot = hexToBytes(normalizedHex)
    spine.ethyBucketsBitmask = 0xffff
    generationElection = undefined
    syncEthyPivotServeDir(clientRef, snapStore.activePivotAccountsDir())
    refreshEthyWorkerAdvertisement(clientRef, spine)
    shadowEthySwarm?.stop()
    shadowEthySwarm = undefined
    if (spine.swarm?.shadowRefresh) {
      spine.swarm.shadowRefresh.mode = 'idle'
      spine.swarm.shadowRefresh.progressPct = 100
      spine.swarm.shadowRefresh.mintBucket = undefined
      spine.swarm.shadowRefresh.partialMinterMask = undefined
    }
    recordDiagnostic(spine, {
      subsystem: 'ethy',
      severity: 'info',
      message: `Shadow pivot flip → #${targetPivotBlock.toString()} (${stateRootHex.slice(0, 14)}…)`,
    })
    return true
  }

  const maybeShadowPivotWork = (clientRef: Devp2pWorkerClient, peers: WorkerPeerSnapshot[]) => {
    if (!shadowRefreshEnabled || snapStore === undefined) return
    if (spine.phase !== 'HEAD_FOLLOWING') return
    const mode = spine.swarm?.shadowRefresh?.mode
    if (mode !== 'ethy-shadow') return
    const head = spine.bestPeerHead ?? 0n
    const localPivot = spine.pivotBlockNumber ?? 0n
    const activeRoot = snapStore.activePivotStateRoot()
    if (activeRoot === undefined) return
    if (shadowPivotSession === undefined) {
      const target = pickShadowEthySeeder(peers, head, localPivot)
      if (target === undefined) return
      const peerRow = peers.find((p) => p.id === target.peerId)
      const seeder =
        peerRow?.ethyStatus !== undefined
          ? seederFromWorkerStatus(peerRow.id, peerRow.ethyStatus)
          : undefined
      if (seeder === undefined) return
      const lastVer = localVerifiedBlock(spine) ?? localPivot
      const from = target.basePivotBlock + 1n
      const copied =
        lastVer >= from
          ? startShadowBalTailCopy({
              snapStore,
              sourceStateRootHex: activeRoot,
              shadowStateRootHex: target.stateRootHex,
              fromBlock: from,
              throughBlock: lastVer,
            })
          : 0
      snapStore.prepareShadowPivotFromSeeder({
        blockNumber: target.basePivotBlock,
        stateRoot: seeder.basePivotRoot,
      })
      snapStore.setShadowPersistRoot(target.stateRootHex)
      shadowEthyBuckets = createSnapBuckets()
      shadowEthyBucketsDone.clear()
      shadowPivotSession = {
        stateRootHex: target.stateRootHex,
        targetPivotBlock: target.basePivotBlock,
        balBlocksCopied: copied,
        seederPeerId: target.peerId,
        bucketsBitmask: target.bucketsBitmask,
        bucketsDone: 0,
        accountsComplete: false,
        stage: 'await-accounts',
      }
      if (spine.swarm?.shadowRefresh) {
        spine.swarm.shadowRefresh.progressPct = copied > 0 ? 35 : 12
      }
      recordDiagnostic(spine, {
        subsystem: 'ethy',
        severity: 'info',
        peerId: target.peerId,
        message: `Shadow BAL copy: ${copied} blocks into pivot ${target.stateRootHex.slice(0, 10)}…`,
      })
      startShadowEthySwarm(clientRef, seeder)
    }
    if (shadowPivotSession.stage === 'done') return
    advanceShadowPivotSession({ snapStore, session: shadowPivotSession })
    if (shadowPivotSession.stage === 'await-accounts' && spine.swarm?.shadowRefresh) {
      const doneBits = shadowEthyBucketsDone.size
      const need = countEthyBucketBits(shadowPivotSession.bucketsBitmask)
      spine.swarm.shadowRefresh.progressPct = Math.min(
        85,
        22 + Math.round((doneBits / Math.max(1, need)) * 55),
      )
    }
    if (shadowPivotSession.stage === 'ready-to-flip') {
      if (
        finishShadowPivotFlip(
          clientRef,
          shadowPivotSession.stateRootHex,
          shadowPivotSession.targetPivotBlock,
        )
      ) {
        shadowPivotSession = undefined
      }
    }
  }

  const startShadowEthySwarm = (
    clientRef: Devp2pWorkerClient,
    seeder: import('../sync/ethySeederSchedule.ts').EthySeederDescriptor,
  ) => {
    if (shadowPivotSession === undefined) return
    shadowEthySwarm?.stop()
    const pivotBlock = shadowPivotSession.targetPivotBlock
    shadowEthySwarm = new EthySwarmSynchronizer({
      spine,
      stateManager,
      client: clientRef,
      snapStore,
      verifyPool,
      pivotBlockNumber: pivotBlock,
      initialSeeders: [seeder],
      balThroughBlock: pivotBlock,
      backgroundMode: true,
      skipBalCatchUp: true,
      persistBuckets: shadowEthyBuckets,
      backgroundMaxChunksInFlight: 4,
      onBucketDone: (idx) => {
        if (shadowPivotSession === undefined) return
        shadowEthyBucketsDone.add(idx)
        shadowPivotSession.bucketsDone = shadowEthyBucketsDone.size
        const partial = computePartialMinterMask(shadowEthyBuckets)
        advertisePartialMinter(clientRef, pivotBlock, shadowPivotSession.stateRootHex, partial)
        if (shadowEthySeedMaskSatisfied(shadowPivotSession.bucketsBitmask, shadowEthyBucketsDone)) {
          shadowPivotSession.accountsComplete = true
        }
      },
      onSwarmComplete: () => {
        if (shadowPivotSession !== undefined) {
          shadowPivotSession.accountsComplete = true
        }
        shadowEthySwarm?.stop()
        shadowEthySwarm = undefined
      },
    })
    shadowEthySwarm.start()
    recordDiagnostic(spine, {
      subsystem: 'ethy',
      severity: 'info',
      peerId: seeder.peerId,
      message: `Shadow ETHY swarm sync → ${shadowPivotSession.stateRootHex.slice(0, 12)}…`,
    })
  }

  const shadowSnapGetPeers = () =>
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

  const ensureShadowSnapMintSync = (clientRef: Devp2pWorkerClient) => {
    if (shadowSnapMintSession === undefined || shadowSnapMintSync !== undefined) return
    const rootHex = shadowSnapMintSession.stateRootHex
    const root = hexToBytes((rootHex.startsWith('0x') ? rootHex : `0x${rootHex}`) as `0x${string}`)
    const transport = createLiveSnapTransport(clientRef)
    shadowSnapMintSync = new SnapAccountSynchronizer({
      spine,
      stateManager,
      transport,
      flightTracker: shadowMintFlightTracker,
      snapStore,
      peerBook,
      getSnapPeers: shadowSnapGetPeers,
      verifyPool,
      accountBuckets: shadowSnapMintSession.buckets,
      pivotAnchor: { blockNumber: shadowSnapMintSession.targetPivotBlock, stateRoot: root },
      backgroundMode: true,
      mintBucketCap: shadowSnapMintSession.mintBucketCap,
      onBucketDone: (_bucketIndex) => {
        if (shadowSnapMintSession === undefined) return
        const cap = nextShadowMintBucketCap(shadowSnapMintSession.buckets)
        shadowSnapMintSession.mintBucketCap = cap
        shadowSnapMintSync?.setMintBucketCap(cap)
        if (spine.swarm?.shadowRefresh) {
          spine.swarm.shadowRefresh.mintBucket = shadowSnapMintSession.buckets.filter(
            (b) => b.status === 'done',
          ).length
        }
        const partial = computePartialMinterMask(shadowSnapMintSession.buckets)
        advertisePartialMinter(
          clientRef,
          shadowSnapMintSession.targetPivotBlock,
          shadowSnapMintSession.stateRootHex,
          partial,
        )
      },
    })
    shadowSnapMintSync.start()
  }

  const maybeShadowSnapMintWork = (clientRef: Devp2pWorkerClient, peers: WorkerPeerSnapshot[]) => {
    if (!shadowRefreshEnabled || snapStore === undefined) return
    if (spine.phase !== 'HEAD_FOLLOWING') return
    if (shadowPivotSession !== undefined && shadowPivotSession.stage !== 'done') return
    const swarmMode = spine.swarm?.shadowRefresh?.mode
    const electionReady = tickGenerationElection(client, spine, generationElection)
    if (
      shadowSnapMintSession === undefined &&
      shadowMintHeaderFlight === undefined &&
      swarmMode === 'snap-mint' &&
      electionReady
    ) {
      const head = spine.bestPeerHead ?? 0n
      const targetBlock = selectShadowMintPivotBlock(head)
      const peer = pickBestPeer(peers, pivotBlockedPeers)
      if (peer === undefined || peer.latestBlock === undefined) return
      if (BigInt(peer.latestBlock) < targetBlock) return
      const ethVersion = highestEthVersion(peer.caps)
      shadowMintHeaderFlight = {
        peerId: peer.id,
        targetBlock,
        ethVersion,
        startedAt: Date.now(),
      }
      const payload = encodeGetBlockHeadersByNumberPayload(ethVersion, targetBlock)
      client.sendEthMessage(peerIdToBytes(peer.id), EthMessageCodes.GET_BLOCK_HEADERS, payload)
      recordDiagnostic(spine, {
        subsystem: 'ethy',
        severity: 'info',
        peerId: peer.id,
        message: `Shadow SNAP mint: header #${targetBlock.toString()}`,
      })
      return
    }
    if (
      shadowMintHeaderFlight !== undefined &&
      Date.now() - shadowMintHeaderFlight.startedAt > SHADOW_MINT_HEADER_TIMEOUT_MS
    ) {
      pivotBlockedPeers.add(shadowMintHeaderFlight.peerId)
      shadowMintHeaderFlight = undefined
    }
    if (shadowSnapMintSession === undefined) return
    ensureShadowSnapMintSync(clientRef)
    if (spine.swarm?.shadowRefresh) {
      spine.swarm.shadowRefresh.progressPct = shadowSnapMintProgressPct(
        shadowSnapMintSession.buckets,
      )
    }
    if (
      shadowSnapMintReadyToFlip(shadowSnapMintSession.buckets) &&
      shadowSnapMintSession.stage !== 'done'
    ) {
      shadowSnapMintSync?.stop()
      shadowSnapMintSync = undefined
      if (
        finishShadowPivotFlip(
          clientRef,
          shadowSnapMintSession.stateRootHex,
          shadowSnapMintSession.targetPivotBlock,
        )
      ) {
        shadowSnapMintSession = undefined
      }
    }
  }

  const ensureHeadFollower = (clientRef: Devp2pWorkerClient) => {
    if (spine.pivotStateRoot === undefined) return
    if (handoffCatchup && ethySwarm !== undefined && ethySwarm.isActive()) {
      return
    }
    if (
      spine.syncTransport === 'ethy' &&
      !handoffCatchup &&
      (ethySwarm === undefined || ethySwarm.isActive())
    ) {
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
        appendBalTailBatch: bundleBalHooks.appendBalTailBatch,
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
          snapStore?.pruneHealBundlesUpTo(
            minHealPruneBlock(snapStore, newPivot.blockNumber, !shadowRefreshEnabled),
          )
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
              void drainRestoredContractsIntoCodeSync()
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
        onDiagnostic: (severity, message, peerId) => {
          recordDiagnostic(spine, { subsystem: 'bal', severity, message, peerId })
        },
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
    if (!snapBootstrap) return
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
  let seenAtLastDiagTs = new Set<string>()
  /** Peer ids we dialed via VIP redial; skip until handshake or expiry. */
  const pendingVipDials = new Map<string, number>()
  let bundleFetch: PivotBundleFetch | undefined
  let healSeq: PivotHealSequence | undefined
  let dnsTimedOut = false
  let link = initialP2pLinkState()
  const linkStartedAt = Date.now()
  let discoveryHoldActive: boolean | undefined
  let lastAppliedProfile = bootNetworkProfile(syncMode, snapBootstrap)
  if (desiredEthyMask !== undefined) {
    lastAppliedProfile = { ...lastAppliedProfile, desiredEthyBucketsMask: desiredEthyMask }
  }
  let machineState = createMachineState()
  let lastMachinePlan: MachinePlan | undefined
  let lastClPollMs: number | undefined

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
    spine.diskResumeKind = 'cold'
    spine.diskResumeBlock = undefined
    spine.diskHydrated = true
    pendingRestoredHealBlocks = []
    restoredContractsDrained = true
    setPhase(spine, 'P2P_WARMUP')
  }

  const drainRestoredContractsIntoCodeSync = async (): Promise<void> => {
    if (restoredContractsDrained || snapStore === undefined || codeSync === undefined) return
    if (spine.diskResumeKind === 'base-complete' || spine.pivotStateRoot === undefined) return
    restoredContractsDrained = true
    const contracts = snapStore.drainRestoredContracts()
    for (let i = 0; i < contracts.length; i += RESTORED_CONTRACTS_CHUNK) {
      codeSync?.noteAccounts(contracts.slice(i, i + RESTORED_CONTRACTS_CHUNK))
      if (i + RESTORED_CONTRACTS_CHUNK < contracts.length) {
        await new Promise<void>((resolve) => setImmediate(resolve))
      }
    }
  }

  const restorePendingHealBlocks = (): void => {
    if (pendingRestoredHealBlocks.length === 0) return
    const blocks = pendingRestoredHealBlocks
    pendingRestoredHealBlocks = []
    headFollower?.restoreBuffered(blocks)
  }

  const finishDiskResumeWithHead = (
    headBlock: bigint,
    peers: WorkerPeerSnapshot[] = lastTelemetryPeers,
  ): void => {
    if (snapStore === undefined || !diskHydrated) return
    raiseBestPeerHead(spine, headBlock)
    const kind = spine.diskResumeKind ?? (handoffCatchup ? 'base-complete' : 'cold')
    const pivotNum = spine.pivotBlockNumber ?? savedSnapPeek?.pivotBlockNumber
    const ethyTail =
      pivotNum !== undefined
        ? ethyBalTailAvailable(pivotNum, headBlock, spine.peers.values(), spine.syncTransport)
        : false
    const ethyAnchor =
      pivotNum !== undefined && kind !== 'base-complete'
        ? pickEthyAnchorForStaleResume(peers, headBlock, pivotNum, syncMode)
        : undefined
    const resumeAction = planNetworkHeadResume({
      kind,
      localVerifiedBlock: localVerifiedBlock(spine),
      pivotBlock: pivotNum,
      bucketsDoneCount: spine.snapBuckets.filter((b) => b.status === 'done').length,
      liveHead: headBlock,
      ethyBalTail: ethyTail,
      ethyAnchorPeerId: ethyAnchor?.peerId,
      ethyAnchorPivot: ethyAnchor?.basePivotBlock,
    })

    if (resumeAction.action === 'anchor-fresh') {
      deriveCapabilities(spine)
      return
    }
    if (resumeAction.action === 'anchor-ethy') {
      anchorEthyStaleResume(headBlock, peers, resumeAction)
      return
    }
    if (resumeAction.action === 'enter-head-following') {
      seedBalCatchUp(spine, resumeAction.targetHead)
      if (spine.phase === 'HEAD_FOLLOWING') {
        populateHeadFlipSummary(resumeAction.targetHead)
      }
      ensureHeadFollower(client)
      headFollower?.noteChainHead(resumeAction.targetHead)
      deriveCapabilities(spine)
      return
    }
    if (resumeAction.action === 'enter-bal-catchup') {
      seedBalCatchUp(spine, resumeAction.targetHead)
      ensureHeadFollower(client)
      headFollower?.noteChainHead(resumeAction.targetHead)
      opts.notices?.post(
        {
          key: 'snap-handoff',
          level: 'info',
          text: `Resuming from #${spine.lastVerifiedBlockNumber?.toString() ?? '?'} toward head #${resumeAction.targetHead.toString()} (+${resumeAction.gap.toString()} blk)`,
          relevantForMs: 8_000,
        },
        Date.now(),
      )
      deriveCapabilities(spine)
      return
    }
    if (resumeAction.action === 'reset-stale') {
      abandonStaleSnapPivot(headBlock, peers, resumeAction.savedPivot)
      return
    }
    if (resumeAction.action === 'bridge-pivot') {
      spine.pivotBridging = resumeAction.pivotBridging
      setPhase(spine, 'SNAP_SYNCING')
      const gap = resumeAction.pivotBridging.targetBlock - resumeAction.pivotBridging.fromBlock
      opts.notices?.post(
        {
          key: 'snap-bridge',
          level: 'info',
          text: `Bridging snap pivot #${pivotNum?.toString() ?? '?'} toward #${resumeAction.pivotBridging.targetBlock.toString()} (+${gap.toString()} BALs)`,
          relevantForMs: 10_000,
        },
        Date.now(),
      )
      ensureHeadFollower(client)
      restorePendingHealBlocks()
      deriveCapabilities(spine)
      return
    }
    // resumeAction.action === 'resume-snap'
    spine.pivotBridging = undefined
    setPhase(spine, 'SNAP_SYNCING')
    const pct = snapResumeProgressPct(savedSnapPeek)
    opts.notices?.post(
      {
        key: 'snap-resume',
        level: 'info',
        text: `Resuming snap sync at #${spine.pivotBlockNumber?.toString() ?? '?'} (${pct}% complete)`,
        relevantForMs: 8_000,
      },
      Date.now(),
    )
    ensureHeadFollower(client)
    restorePendingHealBlocks()
    ensureSnapSync(client)
    void drainRestoredContractsIntoCodeSync()
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

  const anchorEthyStaleResume = (
    headBlock: bigint,
    peers: WorkerPeerSnapshot[],
    action: Extract<
      import('../sync/startupStateMachine.ts').NetworkHeadResumeAction,
      { action: 'anchor-ethy' }
    >,
  ): void => {
    const gap = headBlock - action.savedPivot
    snapStore?.discardPivots()
    clearSpinePivotForFreshAnchor()
    diskHydrated = true
    resumeHeadHandled = true
    lastSnapProgressAt = Date.now()
    lastSnapProgressAccounts = spine.totalAccountsSynced
    opts.notices?.post(
      {
        key: 'snap-ethy-anchor',
        level: 'info',
        text: `Stale partial snap (+${gap.toString()} blk) — anchoring ETHY/0 at #${action.targetPivot.toString()}`,
        relevantForMs: 10_000,
      },
      Date.now(),
    )
    recordDiagnostic(spine, {
      subsystem: 'ethy',
      severity: 'info',
      peerId: action.peerId,
      message: `anchor-ethy resume: pivot #${action.savedPivot.toString()} → ETHY #${action.targetPivot.toString()}`,
    })
    spine.syncTransport = 'ethy'
    ethySeederPeerId = action.peerId
    const row = peers.find((p) => p.id === action.peerId)
    if (row !== undefined) anchorEthyPivotFromStatus(row)
    deriveCapabilities(spine)
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
      const anchor = pickEthyAnchorForStaleResume(peers, headBlock, peek.pivotBlockNumber, syncMode)
      if (anchor !== undefined) {
        anchorEthyStaleResume(headBlock, peers, {
          action: 'anchor-ethy',
          peerId: anchor.peerId,
          targetPivot: anchor.basePivotBlock,
          savedPivot: peek.pivotBlockNumber,
        })
        return
      }
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
    spine.diskHydrated = true
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

    const hydratedKind = classifyHydratedDiskState(peek, spine.snapBuckets)
    spine.diskResumeKind = hydratedKind
    spine.diskResumeBlock = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber

    const liveNetworkHead = resolveLiveNetworkHead({
      bestPeerHead: spine.bestPeerHead,
      clOptimisticBlockNumber: spine.clOptimisticBlockNumber,
      pendingResumeHead,
      peerLatestBlocks: lastTelemetryPeers.map((p) =>
        p.latestBlock !== undefined ? BigInt(p.latestBlock) : undefined,
      ),
      ethyLatestBlocks: lastTelemetryPeers.map((p) =>
        p.ethyStatus?.balLatestBlock !== undefined && p.ethyStatus.balLatestBlock.length > 0
          ? BigInt(p.ethyStatus.balLatestBlock)
          : undefined,
      ),
    })

    const postHydrate = planPostHydration({
      kind: hydratedKind,
      liveNetworkHead,
    })
    handoffCatchup = postHydrate.handoffCatchup

    if (hydratedKind === 'base-complete') {
      if (spine.syncTransport === 'unset') {
        spine.syncTransport = (spine.ethyBucketsBitmask ?? 0) > 0 ? 'ethy' : 'snap'
      }
      if (restored > 0) {
        recordDiagnostic(spine, {
          subsystem: 'snap',
          severity: 'info',
          message: `Restored ${restored.toLocaleString('en-US')} accounts from disk (base sync complete at #${(spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber ?? 0n).toString()} — awaiting network head)`,
        })
      }
      // Stay in P2P_WARMUP until a live network head verifies whether we are at head or behind.
      setPhase(spine, postHydrate.phase)
      ensureHeadFollower(client)
    } else {
      setPhase(spine, postHydrate.phase)
      if (restored > 0) {
        recordDiagnostic(spine, {
          subsystem: 'snap',
          severity: 'info',
          message: `Restored ${restored.toLocaleString('en-US')} accounts from disk (${hydratedKind === 'partial-contracts' ? 'awaiting head to finish contracts' : 'awaiting head to resume snap'})`,
        })
      }
      pendingRestoredHealBlocks = snapStore!.takeRestoredHealBlocks()
    }
    deriveCapabilities(spine)

    if (!resumeHeadHandled && postHydrate.readyForHeadTransition && liveNetworkHead !== undefined) {
      resumeHeadHandled = true
      finishDiskResumeWithHead(liveNetworkHead, lastTelemetryPeers)
    }
  }

  const maybeMarkBaseSyncComplete = () => {
    if (
      handoffCatchup ||
      baseSyncCompletePosted ||
      markingBaseSyncComplete ||
      snapStore === undefined ||
      !diskHydrated ||
      (!resumeHeadHandled && savedSnapPeek !== undefined)
    ) {
      return
    }
    if (!custodyFastOnboard && snapBucketsUnfinished(spine.snapBuckets)) return
    if (spine.syncTransport === 'ethy' && ethySwarm?.isActive()) return
    if (spine.syncTransport !== 'ethy') {
      // If we resumed a partial-contracts state, codeSync must run and finish before marking complete.
      if (codeSync === undefined) return
      if (!codeSync.pendingDone()) return
    }
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
        handoffCatchup = true
        spine.diskResumeKind = 'base-complete'
        opts.notices?.post(
          {
            key: 'snap-base-done',
            level: 'info',
            text: `Snap base sync complete at #${pivot.toString()}`,
            relevantForMs: 8_000,
          },
          Date.now(),
        )
        const liveHead = resolveLiveNetworkHead({
          bestPeerHead: spine.bestPeerHead,
          clOptimisticBlockNumber: spine.clOptimisticBlockNumber,
          peerLatestBlocks: lastTelemetryPeers.map((p) =>
            p.latestBlock !== undefined ? BigInt(p.latestBlock) : undefined,
          ),
        })
        if (liveHead === undefined) {
          // Do not claim HEAD_FOLLOWING if no live network head has been observed.
          setPhase(spine, 'P2P_WARMUP')
          resumeHeadHandled = false
          ensureHeadFollower(client)
          deriveCapabilities(spine)
          return
        }
        const bestHead = liveHead > pivot ? liveHead : pivot
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
    const peerList = [...spine.peers.values()]
    if (lastMachinePlan?.mode === 'live-calm') {
      const healthy = peerList.filter((p) => p.hasHead === true).length
      if (healthy >= lastMachinePlan.vipTarget) return
    }
    const inHeadOrCatchup =
      spine.phase === 'HEAD_FOLLOWING' ||
      spine.phase === 'BAL_CATCHUP' ||
      handoffCatchup ||
      spine.diskResumeKind === 'base-complete'
    const target = lastMachinePlan?.vipTarget ?? (inHeadOrCatchup ? 6 : VIP_SNAP_PEER_TARGET)
    const towardTarget = inHeadOrCatchup
      ? peerList.filter((p) => p.hasHead === true).length
      : countSnapPeersTowardVipTarget(peerList)
    if (!shouldVipReconnect({ snapPeersTowardTarget: towardTarget, target })) return
    const connected = new Set(spine.peers.keys())
    // At 0 peers, keep 4 of RLPx's 6 pending dial slots open for fresh DNS/discv4 discovery peers.
    const maxBatch = peerList.length === 0 ? 2 : peerList.length < 3 ? 3 : 2
    const need = Math.min(maxBatch, target - towardTarget)
    let dialed = 0
    for (const peer of peerBook.vipDialCandidates(now, 64, { requireSnap: !inHeadOrCatchup })) {
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
      if (spine.phase === 'SNAP_SYNCING') {
        codeSync?.noteBalApplied(bal)
      }
      if (
        custodyFastOnboard &&
        spine.lastVerifiedBlockNumber !== undefined &&
        spine.lastVerifiedBlockNumber > 0n
      ) {
        statyWriteIndex.ingestVerifiedBal(Number(spine.lastVerifiedBlockNumber), bal)
      }
    },
    appendHealBal: (blockNumber: bigint, balRlp: Uint8Array) => {
      snapStore?.appendHealBal(blockNumber, balRlp)
    },
    appendHealBundle: (entry: VerifiedBalBlock) => {
      const pivot = spine.pivotBlockNumber
      if (pivot === undefined || entry.blockNumber <= pivot) return
      snapStore?.appendHealBundle(entry)
    },
    appendBalTailBatch: (entries: BalTailBatchEntry[]) => {
      const pivot = spine.pivotBlockNumber
      if (pivot === undefined) return
      const filtered = entries.filter((e: BalTailBatchEntry) => e.blockNumber > pivot)
      if (filtered.length === 0) return
      snapStore?.appendBalTailBatch(filtered)
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
      if (custodyFastOnboard && firstAnchor) {
        const head = spine.bestPeerHead ?? parsed.number
        beginCustodyBalOnboarding(spine, head)
        handoffCatchup = true
        spine.diskResumeKind = 'base-complete'
      } else {
        setPhase(spine, 'SNAP_SYNCING')
      }
    }
    if (
      !anchorOpts.skipServableBundle &&
      headerRlp !== null &&
      peerId !== undefined &&
      bundleFetch === undefined
    ) {
      startPivotBundleFetch(peerId, ethVersion, parsed, headerRlp)
    }
    if (snapBootstrap) ensureSnapSync(client)
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

  const maybeRequestCanonicalSnapPivot = (
    peer: WorkerPeerSnapshot,
    peers: WorkerPeerSnapshot[],
  ) => {
    if (peer.latestBlock === undefined) {
      requestPivotFromPeer(peer)
      return
    }
    const head = BigInt(peer.latestBlock)
    const { targetBlock, waitBlocks } = selectCanonicalSnapPivotTarget(head)
    if (waitBlocks > 0n) {
      pendingCanonicalSnapTarget = targetBlock
      spine.pivotStatusHint = `Aligning SNAP pivot to canonical grid #${targetBlock.toString()} (+${waitBlocks.toString()} blk)`
      const ready = peers.some(
        (p) => p.latestBlock !== undefined && BigInt(p.latestBlock) >= targetBlock,
      )
      if (!ready) return
      pendingCanonicalSnapTarget = undefined
      spine.pivotStatusHint = undefined
    }
    requestPivotHeaderAt(peer, targetBlock)
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
      capabilities: [...lastAppliedProfile.capabilities],
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
      minEthyPeers: 4,
      nodeStorePath: discoveryNodeStorePath(dataDir, network),
      ethyPivotDir: snapStore?.activePivotAccountsDir(),
    },
    workerModuleUrl,
  )
  client.setNetworkProfile(lastAppliedProfile)

  custodyResolver = new CustodyStateResolver({
    getClient: () => client,
    getPeers: () => lastTelemetryPeers,
    spine,
    writeIndex: statyWriteIndex,
    snapBootstrapEnabled: snapBootstrap,
    balEarliestBlock: () => {
      const w = spine.balWindow
      if (w.length > 0) return w[0]!.blockNumber
      const pivot = spine.pivotBlockNumber ?? 0n
      return pivot > 0n ? pivot + 1n : 0n
    },
  })
  if (opts.custodyMissDelegate !== undefined) {
    Object.assign(opts.custodyMissDelegate, createCustodyResolverHooks(custodyResolver))
  }

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

  const syncEthySeedersFromPeers = (peers: WorkerPeerSnapshot[]) => {
    if (spine.syncTransport !== 'ethy' || ethySwarm === undefined) return
    const head = spine.bestPeerHead ?? 0n
    const descriptors = buildUsableEthyDescriptors(
      peers,
      head,
      syncMode,
      explicitConnectPeerIds.size > 0,
    )
    ethySwarm.syncSeeders(descriptors)
  }

  const startCustodyBackgroundSync = (peers: WorkerPeerSnapshot[]) => {
    if (custodyLiveReached || !custodyFastOnboard) return
    if (spine.pivotBlockNumber === undefined || spine.pivotStateRoot === undefined) return
    custodyLiveReached = true
    const head = spine.bestPeerHead ?? spine.pivotBlockNumber
    const initialSeeders = buildUsableEthyDescriptors(
      peers,
      head,
      syncMode,
      explicitConnectPeerIds.size > 0,
    )
    if (initialSeeders.length === 0) {
      custodyLiveReached = false
      return
    }
    ethySwarm?.stop()
    ethySwarm = new EthySwarmSynchronizer({
      spine,
      stateManager,
      client,
      snapStore,
      verifyPool,
      pivotBlockNumber: spine.pivotBlockNumber,
      initialSeeders,
      initialBucketPivotBlocks: snapStore?.getBucketPivotBlocks(),
      balThroughBlock: head,
      custodyBuckets: spine.custodyBuckets,
      backgroundMode: true,
      skipBalCatchUp: true,
      onAccountsIngested: (entries) => codeSync?.noteAccounts(entries),
      onBucketDone: (idx) => {
        noteBucketAdvertised(client, idx)
        snapStore?.updateCustodyPlane(idx, { accounts: true })
      },
      onBucketPivot: (idx, pivotBlock) => snapStore?.noteBucketPivot(idx, pivotBlock),
      economy: opts.economy,
    })
    custodyCodeSync = new EthyCodeStorageSynchronizer({
      spine,
      client,
      stateManager,
      snapStore,
      buckets: spine.custodyBuckets ?? [],
    })
    custodyCodeSync.start()
    ethySwarm.start()
    spine.custodyBackgroundActive = true
    recordDiagnostic(spine, {
      subsystem: 'ethy',
      severity: 'info',
      message: `Custody background sync for buckets ${(spine.custodyBuckets ?? []).join(',')}`,
    })
    deriveCapabilities(spine)
  }

  const maybeRequestCustodyOnboardingPivot = (peers: WorkerPeerSnapshot[]) => {
    if (!custodyFastOnboard || custodyLiveReached) return
    if (spine.pivotBlockNumber !== undefined) return
    if (custodyOnboardingPivotRequested || inFlightPeerId !== undefined) return
    const head = spine.bestPeerHead
    if (head === undefined || head === 0n) return
    const best = pickBestPeer(peers, pivotBlockedPeers)
    if (best === undefined) return
    custodyOnboardingPivotRequested = true
    spine.pivotStatusHint = `Custody BAL anchor #${custodyOnboardingPivotBlock(head).toString()}`
    requestPivotHeaderAt(best, custodyOnboardingPivotBlock(head))
  }

  const startEthySwarmSync = (peers: WorkerPeerSnapshot[]) => {
    if (custodyFastOnboard) return
    if (
      ethyAnchorBlock === undefined ||
      ethyAnchorRoot === undefined ||
      spine.pivotStateRoot === undefined
    ) {
      return
    }
    const head = spine.bestPeerHead ?? ethyAnchorBlock
    const initialSeeders = buildUsableEthyDescriptors(
      peers,
      head,
      syncMode,
      explicitConnectPeerIds.size > 0,
    )
    if (initialSeeders.length === 0) return
    ethySwarm?.stop()
    ethySwarm = new EthySwarmSynchronizer({
      spine,
      stateManager,
      client,
      snapStore,
      verifyPool,
      pivotBlockNumber: ethyAnchorBlock,
      initialSeeders,
      initialBucketPivotBlocks: snapStore?.getBucketPivotBlocks(),
      balThroughBlock: head,
      onAccountsIngested: (entries) => codeSync?.noteAccounts(entries),
      onBucketDone: (idx) => noteBucketAdvertised(client, idx),
      onBucketPivot: (idx, pivotBlock) => snapStore?.noteBucketPivot(idx, pivotBlock),
      onAccountsComplete: () => {
        if (!ethySwarm?.isActive()) {
          maybeMarkBaseSyncComplete()
          ensureSnapSync(client)
        }
      },
      onSwarmComplete: () => {
        const pivot = spine.pivotBlockNumber
        if (pivot !== undefined && snapStore !== undefined) {
          const verified =
            spine.lastVerifiedBlockNumber !== undefined && spine.lastVerifiedBlockNumber > pivot
              ? spine.lastVerifiedBlockNumber
              : pivot
          snapStore.markBaseSyncComplete(verified)
        }
        maybeMarkBaseSyncComplete()
        handoffCatchup = true
        spine.diskResumeKind = 'base-complete'
        const liveHead = resolveLiveNetworkHead({
          bestPeerHead: spine.bestPeerHead,
          clOptimisticBlockNumber: spine.clOptimisticBlockNumber,
          peerLatestBlocks: lastTelemetryPeers.map((p) =>
            p.latestBlock !== undefined ? BigInt(p.latestBlock) : undefined,
          ),
        })
        if (liveHead !== undefined) {
          seedBalCatchUp(spine, liveHead)
          if (spine.phase === 'HEAD_FOLLOWING') {
            populateHeadFlipSummary(liveHead)
          }
        } else {
          setPhase(spine, 'P2P_WARMUP')
          resumeHeadHandled = false
        }
        ensureHeadFollower(client)
        ensureSnapSync(client)
        deriveCapabilities(spine)
      },
      economy: opts.economy,
    })
    setPhase(spine, 'SNAP_SYNCING')
    ethySwarm.start()
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
    if (custodyFastOnboard) return
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
    startEthySwarmSync([peer])
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
    if (handoffCatchup) {
      if (spine.syncTransport === 'unset') {
        spine.syncTransport = (spine.ethyBucketsBitmask ?? 0) > 0 ? 'ethy' : 'snap'
      }
      if (
        ethySwarm === undefined &&
        spine.phase !== 'HEAD_FOLLOWING' &&
        spine.pivotBlockNumber !== undefined &&
        spine.pivotStateRoot !== undefined
      ) {
        const lastVer = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber
        const seeders = ethySeederRows(peers)
        const balSeeder = seeders.find(
          (s) =>
            s.seeder.balEarliestBlock <= lastVer + 1n && (s.seeder.balLatestBlock ?? 0n) > lastVer,
        )
        if (balSeeder !== undefined) {
          spine.syncTransport = 'ethy'
          ethySeederPeerId = balSeeder.peerId
          ethyAnchorBlock = spine.pivotBlockNumber
          ethyAnchorRoot = spine.pivotStateRoot
          headFollower?.stop()
          headFollower = undefined
          startEthySwarmSync(peers)
        }
      }
      return
    }
    if (!snapBucketsUnfinished(spine.snapBuckets)) {
      if (spine.syncTransport === 'unset') {
        spine.syncTransport = (spine.ethyBucketsBitmask ?? 0) > 0 ? 'ethy' : 'snap'
      }
      return
    }
    const bucketsDone = spine.snapBuckets.filter((b) => b.status === 'done').length
    const earlySnapProgress =
      bucketsDone === 0 && computeAccountRangeFraction(spine.snapBuckets) < 0.05
    const canPreemptSnapForEthy =
      spine.syncTransport === 'snap' &&
      syncMode !== 'snap' &&
      !handoffCatchup &&
      spine.phase !== 'HEAD_FOLLOWING' &&
      spine.phase !== 'BAL_CATCHUP' &&
      earlySnapProgress
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
    const hasSnapPeer = peers.some((p) => p.snapSession === true && p.latestBlock !== undefined)
    const ethyDialInFlight = peers.some((p) => p.ethySession === true && p.ethyStatus === undefined)
    const freshest = freshestEthyPivot(seeders)
    if (
      preferCanonicalSnapOverEthy({
        syncMode,
        explicitConnect: explicitConnectPeerIds.size > 0,
        bestPeerHead: head,
        freshestEthyPivotBlock: freshest,
        hasSnapPeer,
      })
    ) {
      if (spine.syncTransport === 'unset' && firstEthStatusAtMs > 0) {
        const elapsed = Date.now() - firstEthStatusAtMs
        if (
          shouldLockSnapAfterGrace(syncMode, spine.syncTransport, elapsed, false, ethyDialInFlight)
        ) {
          spine.syncTransport = 'snap'
        }
      }
      return
    }
    const pick =
      explicitSeeders.length > 0
        ? pickUsableEthySeeder(explicitSeeders, head, 'ethy')
        : pickUsableEthySeeder(seeders, head, syncMode)
    if (pick !== undefined) {
      if (canPreemptSnapForEthy) {
        if (!isFreshEthyPreemptCandidate(pick.seeder, head)) return
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
      if (row !== undefined && !custodyFastOnboard) {
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
    if (shouldLockSnapAfterGrace(syncMode, spine.syncTransport, elapsed, false, ethyDialInFlight)) {
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
    const requireSnapAtBoot = initialDiskResumeKind !== 'base-complete'
    for (const peer of peerBook.dialCandidates(now, undefined, {
      requireSnap: requireSnapAtBoot,
    })) {
      const id = bytesToUnprefixedHex(peer.id as Uint8Array).toLowerCase()
      peerBook.noteDialAttempt(id, now)
      pendingVipDials.set(id, now + VIP_RECONNECT_INTERVAL_MS)
      client.connectPeer(peer)
    }
  }

  if (opts.fresh !== true && savedSnapPeek !== undefined) {
    startResumeHydrate()
  }

  const reconcileMachine = (
    clientRef: Devp2pWorkerClient,
    snap: WorkerTelemetrySnapshot,
    nowMs: number,
  ) => {
    let snapDiscoveryHold = false
    if (spine.phase === 'SNAP_SYNCING') {
      const snapSessions = snap.peers.filter((p) => p.snapSession === true).length
      const servingSnapPeers = snap.peers.filter(
        (p) => p.snapSession === true && (spine.peers.get(p.id)?.snapResponsesOk ?? 0) > 0,
      ).length
      snapDiscoveryHold = wantSnapDiscoveryHold({
        snapSessions,
        servingSnapPeers,
        held: discoveryHoldActive === true,
      })
    }
    discoveryHoldActive = snapDiscoveryHold

    const head = spine.bestPeerHead ?? spine.lastVerifiedBlockNumber ?? 0n
    const localPivot = spine.pivotBlockNumber ?? 0n
    const usableSeeder = pickUsableEthySeeder(ethySeederRows(snap.peers), head, syncMode)
    const hasGNew =
      usableSeeder !== undefined &&
      usableSeeder.seeder.basePivotBlock >= localPivot + MACRO_GENERATION_GRID_BLOCKS

    const prevServingEthy = lastMachinePlan?.servingEthy
    const { plan, nextState, snapshot } = stepMachineOrchestrator(
      machineState,
      buildMachineObservation({
        spine,
        peerSnapshots: snap.peers,
        syncMode,
        snapBootstrap,
        shadowRefreshEnabled,
        clDisabled: opts.setConsensusPollInterval === undefined,
        nowMs,
        snapDiscoveryHold,
        ethySwarmActive: ethySwarm?.isActive() === true,
        degradedStall: balCatchUpProgressStalled || balCatchUpStallWarned,
        hasUsableEthyGNew: hasGNew,
      }),
    )
    machineState = nextState
    lastMachinePlan = plan
    spine.machine = snapshot

    if (prevServingEthy !== plan.servingEthy) {
      refreshEthyWorkerAdvertisement(clientRef, spine)
    }

    if (!networkProfilesEqual(lastAppliedProfile, plan.profile)) {
      clientRef.setNetworkProfile(plan.profile)
      lastAppliedProfile = { ...plan.profile, capabilities: [...plan.profile.capabilities] }
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: 'info',
        message: `Network profile ${plan.mode} (${plan.profile.discoveryMode})`,
      })
    }

    if (opts.setConsensusPollInterval !== undefined && spine.clStatus !== 'p2p_only') {
      const pollMs = plan.planes.cl === 'active' ? 12_000 : 60_000
      if (plan.planes.cl !== 'off' && lastClPollMs !== pollMs) {
        opts.setConsensusPollInterval(pollMs)
        lastClPollMs = pollMs
      }
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
    const prev = new Map(spine.peers)
    spine.peers.clear()
    const localSnapAdvertised = lastAppliedProfile.capabilities.includes('snap1')
    for (const p of snap.peers) {
      spine.peers.set(p.id, mapPeer(p, prev.get(p.id), spine.pivotBlockNumber))
      pendingVipDials.delete(p.id.toLowerCase())
      peerBook?.noteTelemetryPeer(p, Date.now(), { localSnapAdvertised })
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
      if (d.timestamp < lastDiagTs) continue
      const key = `${d.peerId ?? ''}:${d.message}`
      if (d.timestamp === lastDiagTs) {
        if (seenAtLastDiagTs.has(key)) continue
        seenAtLastDiagTs.add(key)
      } else {
        lastDiagTs = d.timestamp
        seenAtLastDiagTs = new Set([key])
      }
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
    const ethyActive = snap.peers.filter(
      (p) =>
        p.ethySession === true && p.ethyStatus !== undefined && p.ethyStatus.bucketsBitmask !== '0',
    ).length
    const nowTelemetry = Date.now()
    generationElection = ensureGenerationElectionArmed(
      generationElection,
      armGenerationElection({
        spine,
        nodeId: localNodeId,
        bestHead: spine.bestPeerHead ?? 0n,
        knownActiveEthyPeers: ethyActive,
        publicEndpoint: (opts.listenPort ?? 0) > 0,
        snapPeerCount: snap.peers.filter((p) => p.snapSession === true).length,
        uptimeMs: nowTelemetry - processStartedAtMs,
      }),
    )
    const bestVerifiedHead =
      spine.lastVerifiedBlockNumber ?? spine.headBlockNumber ?? spine.bestPeerHead
    const shadowRefreshInProgress =
      shadowPivotSession !== undefined ||
      shadowSnapMintSession !== undefined ||
      shadowMintHeaderFlight !== undefined
    refreshSpineSwarmTelemetry({
      spine,
      snapStore,
      shadowRefreshEnabled,
      shadowRefreshInProgress,
      nodeId: localNodeId,
      processStartedAtMs,
      peers: snap.peers,
      electionHandle: generationElection,
      minterLiveness,
      minterHeaders: minterHeaderBook,
      bestVerifiedHead,
      nowMs: nowTelemetry,
    })
    const shadowTelemetry = spine.swarm?.shadowRefresh
    if (shadowTelemetry?.blockedReason === 'low-disk') {
      if (!shadowLowDiskWarned) {
        shadowLowDiskWarned = true
        const freeGib =
          shadowTelemetry.freeBytes !== undefined
            ? (Number(shadowTelemetry.freeBytes) / 1024 ** 3).toFixed(1)
            : '?'
        const needGib =
          shadowTelemetry.requiredFreeBytes !== undefined
            ? (Number(shadowTelemetry.requiredFreeBytes) / 1024 ** 3).toFixed(1)
            : '?'
        recordDiagnostic(spine, {
          subsystem: 'ethy',
          severity: 'warn',
          message: `Shadow refresh paused: low disk (${freeGib} GiB free, need ${needGib} GiB)`,
        })
      }
      if (shadowRefreshInProgress) {
        shadowSnapMintSync?.stop()
        shadowSnapMintSync = undefined
        shadowSnapMintSession = undefined
        shadowMintHeaderFlight = undefined
        shadowEthySwarm?.stop()
        shadowEthySwarm = undefined
        shadowPivotSession = undefined
        snapStore?.setShadowPersistRoot(undefined)
      }
    } else {
      shadowLowDiskWarned = false
    }
    const suppressionState = spine.swarm?.shadowRefresh?.suppressionState
    if (generationElection !== undefined && suppressionState !== undefined) {
      generationElection = applyBackupElectionStaggerOnSuppressionLift({
        handle: generationElection,
        nodeId: localNodeId,
        suppressionState,
        nowMs: nowTelemetry,
      })
    }
    tickGenerationElection(client, spine, generationElection)
    maybeShadowPivotWork(client, snap.peers)
    maybeShadowSnapMintWork(client, snap.peers)
    deriveCapabilities(spine)
    maybePivotInFlightTimeout(snap.peers)
    maybePivotBundleTimeout()
    if (pendingCanonicalSnapTarget === undefined) {
      updatePivotStatusHint(spine, snap.peers)
    }
    maybeApplyResumeFromPeers(snap.peers)
    maybeRefreshUnservedPivot(snap.peers)
    const bestPeer = pickBestPeer(snap.peers, pivotBlockedPeers)
    if (bestPeer?.latestBlock !== undefined) {
      const liveHead = BigInt(bestPeer.latestBlock)
      raiseBestPeerHead(spine, liveHead)
      const peerHead = spine.bestPeerHead
      if (peerHead !== undefined) {
        growBalCatchUpTarget(spine, peerHead)
      }
      if (
        shouldReenterBalCatchUp({
          phase: spine.phase,
          localVerifiedBlock: localVerifiedBlock(spine),
          liveHead: peerHead,
          wakeGapBlocks: LAPTOP_WAKE_BLOCK_GAP,
        })
      ) {
        seedBalCatchUp(spine, peerHead!)
        ensureHeadFollower(client)
        headFollower?.noteChainHead(peerHead!)
      }
    }
    if (spine.phase === 'BAL_CATCHUP' && spine.balCatchUp !== undefined) {
      const hasHeadPeers = snap.peers.some((p) => p.latestBlock !== undefined)
      const gap = BigInt(Math.max(0, spine.balCatchUp.total - spine.balCatchUp.applied))
      const now = Date.now()
      if (!hasHeadPeers || spine.balCatchUp.applied !== balCatchUpLastApplied) {
        balCatchUpLastApplied = spine.balCatchUp.applied
        balCatchUpNoProgressSince = hasHeadPeers ? now : 0
        balCatchUpProgressStalled = false
      } else if (balCatchUpNoProgressSince > 0 && now - balCatchUpNoProgressSince >= 30_000) {
        balCatchUpProgressStalled = true
      }
      if (spine.balCatchUp.applied > 0 || !hasHeadPeers || gap <= BAL_CATCHUP_STALE_WARN_GAP) {
        balCatchUpStallStartedAt = 0
      } else {
        if (balCatchUpStallStartedAt === 0) {
          balCatchUpStallStartedAt = now
        } else if (
          !balCatchUpStallWarned &&
          now - balCatchUpStallStartedAt >= BAL_CATCHUP_STALE_WARN_MS
        ) {
          balCatchUpStallWarned = true
          opts.notices?.post(
            {
              key: 'bal-catchup-stale',
              level: 'warn',
              text: `State is +${gap.toLocaleString('en-US')} blocks behind and peers are not serving old BALs — run with --fresh to re-sync`,
              relevantForMs: 30_000,
            },
            now,
          )
        }
      }
    } else {
      balCatchUpStallStartedAt = 0
      balCatchUpStallWarned = false
      balCatchUpLastApplied = -1
      balCatchUpNoProgressSince = 0
      balCatchUpProgressStalled = false
    }
    noteRemoteEthyPeers(snap.peers)
    tryLockSyncTransport(snap.peers)
    syncEthySeedersFromPeers(snap.peers)
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
      } else if (custodyFastOnboard && bestPeer !== undefined) {
        maybeRequestCustodyOnboardingPivot(snap.peers)
      } else if (spine.syncTransport === 'snap' && bestPeer !== undefined) {
        maybeRequestCanonicalSnapPivot(bestPeer, snap.peers)
      }
    }
    if (spine.phase === 'HEAD_FOLLOWING' && custodyFastOnboard && !custodyLiveReached) {
      startCustodyBackgroundSync(snap.peers)
    }
    reconcileMachine(client, snap, nowTelemetry)
    ensureSnapSync(client)
    maybeMarkBaseSyncComplete()
    maybeEnableRollingStatus()
  }

  client.events.on('protocol', (msg) => {
    if (msg.protocol === 'ethy') {
      if (
        msg.code === EthyMessageCodes.BUCKET_MANIFEST ||
        msg.code === EthyMessageCodes.PROVEN_ACCOUNT_CHUNK ||
        msg.code === EthyMessageCodes.BAL_RANGE
      ) {
        noteMinterEthyServe(minterLiveness, msg.peerId, Date.now())
      }
      shadowEthySwarm?.handleMessage(msg.peerId, msg.code, msg.payload)
      ethySwarm?.handleMessage(msg.peerId, msg.code, msg.payload)
      if (
        msg.code === EthyMessageCodes.PROVEN_STORAGE_OR_CODE ||
        msg.code === EthyMessageCodes.STATE_WITNESS
      ) {
        custodyResolver?.handleEthyResponse(msg.peerId, msg.code, msg.payload)
      }
      if (
        msg.code === EthyMessageCodes.PROVEN_ACCOUNT_CHUNK ||
        msg.code === EthyMessageCodes.PROVEN_STORAGE_OR_CODE
      ) {
        custodyCodeSync?.handleEthyResponse(msg.peerId, msg.code, msg.payload)
      }
      return
    }
    if (msg.protocol !== 'eth') return
    if (headFollower?.handleEthMessage(msg)) return
    if (handleBundleEthMessage(msg)) return
    if (msg.code !== EthMessageCodes.BLOCK_HEADERS) return
    if (
      shadowMintHeaderFlight !== undefined &&
      msg.peerId === shadowMintHeaderFlight.peerId &&
      snapStore !== undefined
    ) {
      const flight = shadowMintHeaderFlight
      shadowMintHeaderFlight = undefined
      const parsed = parsePivotHeaderFromBlockHeadersPayload(
        flight.ethVersion,
        msg.payload,
        undefined,
        chain,
      )
      if (parsed === null || parsed.number !== flight.targetBlock) {
        recordDiagnostic(spine, {
          subsystem: 'snap',
          severity: 'warn',
          peerId: flight.peerId,
          message: 'Shadow SNAP mint header mismatch or empty',
        })
        pivotBlockedPeers.add(flight.peerId)
        return
      }
      const hex = snapStore.prepareShadowPivotFromHeader({
        blockNumber: parsed.number,
        blockHash: parsed.hash,
        stateRoot: parsed.stateRoot,
      })
      const activeRoot = snapStore.activePivotStateRoot()
      const localPivot = spine.pivotBlockNumber ?? 0n
      const lastVer = localVerifiedBlock(spine) ?? localPivot
      const from = parsed.number + 1n
      let copied = 0
      if (activeRoot !== undefined && lastVer >= from) {
        copied = copyBalTailRange(
          snapStore.pivotDirForRoot(activeRoot),
          snapStore.pivotDirForRoot(hex),
          from,
          lastVer,
        )
      }
      snapStore.setShadowPersistRoot(hex)
      shadowSnapMintSession = {
        stateRootHex: hex,
        targetPivotBlock: parsed.number,
        balBlocksCopied: copied,
        mintBucketCap: 0,
        buckets: createShadowMintBuckets(),
        stage: 'minting',
      }
      if (spine.swarm?.shadowRefresh) {
        spine.swarm.shadowRefresh.targetBlock = parsed.number
        spine.swarm.shadowRefresh.progressPct = copied > 0 ? 18 : 8
        spine.swarm.shadowRefresh.mintBucket = 0
      }
      recordDiagnostic(spine, {
        subsystem: 'ethy',
        severity: 'info',
        message: `Shadow SNAP mint at #${parsed.number.toString()} (BAL ${copied} blocks)`,
      })
      ensureShadowSnapMintSync(client)
      return
    }
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
      noteMinterHeaderVerified(
        minterHeaderBook,
        successPeerId,
        parsed.number,
        bytesToUnprefixedHex(parsed.stateRoot),
      )
      startEthySwarmSync(lastTelemetryPeers)
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
      shadowSnapMintSync?.stop()
      shadowEthySwarm?.stop()
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
      if (blockNumber <= 0n) return
      raiseBestPeerHead(spine, blockNumber)
      growBalCatchUpTarget(spine, blockNumber)
      if (!resumeHeadHandled && diskHydrated) {
        resumeHeadHandled = true
        finishDiskResumeWithHead(blockNumber, lastTelemetryPeers)
      } else if (
        shouldReenterBalCatchUp({
          phase: spine.phase,
          localVerifiedBlock: localVerifiedBlock(spine),
          liveHead: spine.bestPeerHead,
          wakeGapBlocks: LAPTOP_WAKE_BLOCK_GAP,
        })
      ) {
        seedBalCatchUp(spine, spine.bestPeerHead!)
        ensureHeadFollower(client)
      }
      if (handoffCatchup) {
        ensureHeadFollower(client)
      }
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
