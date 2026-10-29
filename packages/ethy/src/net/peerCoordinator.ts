import {
  type Devp2pWorkerClient,
  type WorkerChainId,
  type WorkerPeerSnapshot,
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
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
import { SnapPivotStore, snapBucketsUnfinished } from '../persist/snapStore.ts'
import { deriveCapabilities, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, PeerTelemetry } from '../spine/types.ts'
import { SnapAccountSynchronizer } from '../sync/accountSync.ts'
import { createLiveSnapTransport } from '../sync/snapTransport.ts'
import { activeHardfork, advertisedForkHash, chainConfigForNetwork } from './chainHardfork.ts'
import { p2pHandshakeStatusFields } from './genesisStatus.ts'
import {
  EthMessageCodes,
  encodeGetBlockHeadersByNumberPayload,
  encodeGetBlockHeadersPayload,
  highestEthVersion,
  parsePivotHeaderFromBlockHeadersPayload,
  peerIdToBytes,
} from './pivotHeader.ts'
import { ethyCallerModuleUrl } from './workerModuleUrl.ts'

const PIVOT_STALE_BLOCKS = 96n
const PIVOT_IN_FLIGHT_TIMEOUT_MS = 15_000

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
  const { spine, network, stateManager, snapStore } = opts
  let snapSync: SnapAccountSynchronizer | undefined
  if (spine.pivotStateRoot === undefined) {
    setPhase(spine, 'P2P_WARMUP')
  }

  const ensureSnapSync = (clientRef: Devp2pWorkerClient) => {
    if (snapSync !== undefined || spine.pivotStateRoot === undefined) return
    const transport = createLiveSnapTransport(clientRef)
    snapSync = new SnapAccountSynchronizer({
      spine,
      stateManager,
      transport,
      snapStore,
      getSnapPeers: () =>
        [...spine.peers.values()]
          .filter((p) => p.snapSession === true)
          .map((p) => ({ id: p.id, caps: p.caps })),
    })
    snapSync.start()
  }

  const chain = chainConfigForNetwork(network)
  const hardfork = activeHardfork(chain)
  const privateKey = genPrivateKey()

  let client: Devp2pWorkerClient
  let inFlightPeerId: string | undefined
  let inFlightHash: string | undefined
  let inFlightBlockNumber: bigint | undefined
  let inFlightEthVersion = 68
  let inFlightStartedAt = 0
  const pivotBlockedPeers = new Set<string>()
  let lastTelemetryPeers: WorkerPeerSnapshot[] = []
  let lastDiagTs = 0
  let dnsTimedOut = false
  let link = initialP2pLinkState()
  const linkStartedAt = Date.now()

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
    })
  }

  const clearPivotInFlight = () => {
    inFlightPeerId = undefined
    inFlightHash = undefined
    inFlightBlockNumber = undefined
    inFlightStartedAt = 0
  }

  const requestPivotFromPeer = (peer: WorkerPeerSnapshot, mode: 'hash' | 'number' = 'hash') => {
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

  const maybeRefreshPivot = (peers: WorkerPeerSnapshot[]) => {
    if (snapBucketsUnfinished(spine.snapBuckets)) return
    const best = pickBestPeer(peers, pivotBlockedPeers)
    if (best?.latestBlock === undefined || spine.pivotBlockNumber === undefined) return
    const bestNum = BigInt(best.latestBlock)
    if (bestNum > spine.pivotBlockNumber + PIVOT_STALE_BLOCKS) {
      clearPivotInFlight()
      requestPivotFromPeer(best)
    }
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
      maxPeers: 25,
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
    },
    workerModuleUrl,
  )

  client.events.on('telemetry', (snap) => {
    lastTelemetryPeers = snap.peers
    const prev = spine.peers
    spine.peers.clear()
    for (const p of snap.peers) {
      spine.peers.set(p.id, mapPeer(p, prev.get(p.id)))
    }
    spine.discovery = snap.discovery
    for (const d of snap.diagnostics) {
      if (d.timestamp <= lastDiagTs) continue
      lastDiagTs = d.timestamp
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: d.severity === 'error' ? 'error' : d.severity === 'warn' ? 'warn' : 'info',
        message: d.message,
        peerId: d.peerId,
      })
      noteDiscovery(d.message)
    }
    syncLink()
    deriveCapabilities(spine)
    maybePivotInFlightTimeout(snap.peers)
    updatePivotStatusHint(spine, snap.peers)
    if (inFlightPeerId === undefined && spine.pivotBlockNumber === undefined) {
      const best = pickBestPeer(snap.peers, pivotBlockedPeers)
      if (best !== undefined) requestPivotFromPeer(best)
    }
    maybeRefreshPivot(snap.peers)
    ensureSnapSync(client)
  })

  client.events.on('protocol', (msg) => {
    if (msg.protocol !== 'eth' || msg.code !== EthMessageCodes.BLOCK_HEADERS) return
    if (inFlightPeerId === undefined || msg.peerId !== inFlightPeerId) {
      return
    }
    const parsed = parsePivotHeaderFromBlockHeadersPayload(
      inFlightEthVersion,
      msg.payload,
      inFlightHash,
      chain,
    )
    const failedPeerId = inFlightPeerId
    const triedByHash = inFlightHash !== undefined
    clearPivotInFlight()
    if (parsed === null) {
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: 'warn',
        message: 'Pivot header response empty or hash mismatch',
        peerId: failedPeerId,
      })
      if (triedByHash) {
        const peerRow = lastTelemetryPeers.find((p) => p.id === failedPeerId)
        if (peerRow?.latestBlock !== undefined) {
          requestPivotFromPeer(peerRow, 'number')
          return
        }
      }
      pivotBlockedPeers.add(failedPeerId)
      const best = pickBestPeer(lastTelemetryPeers, pivotBlockedPeers)
      if (best !== undefined) requestPivotFromPeer(best)
      return
    }
    const unfinished = snapBucketsUnfinished(spine.snapBuckets)
    if (
      spine.pivotStateRoot !== undefined &&
      unfinished &&
      !equalsBytes(spine.pivotStateRoot, parsed.stateRoot)
    ) {
      recordDiagnostic(spine, {
        subsystem: 'snap',
        severity: 'info',
        message: `Keeping anchored pivot root while buckets unfinished (#${spine.pivotBlockNumber?.toString() ?? '?'})`,
      })
      spine.currentSlot = Number(parsed.number)
      ensureSnapSync(client)
      deriveCapabilities(spine)
      return
    }
    const firstAnchor = spine.pivotStateRoot === undefined
    spine.pivotStatusHint = undefined
    spine.pivotBlockNumber = parsed.number
    spine.pivotStateRoot = parsed.stateRoot
    spine.currentSlot = Number(parsed.number)
    if (firstAnchor) {
      snapStore?.activatePivot({
        blockNumber: parsed.number,
        blockHash: parsed.hash,
        stateRoot: parsed.stateRoot,
      })
    }
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: `Pivot anchored at #${parsed.number.toString()}`,
    })
    client.setBlockRange(intToUnpaddedBytes(0), bigIntToUnpaddedBytes(parsed.number), parsed.hash)
    ensureSnapSync(client)
    deriveCapabilities(spine)
  })

  client.events.on('error', (err) => {
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
      snapSync?.stop()
      snapStore?.flushBuckets(spine.snapBuckets)
      if (linkTimer !== undefined) clearInterval(linkTimer)
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
