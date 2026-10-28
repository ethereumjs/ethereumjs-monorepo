import {
  type Devp2pWorkerClient,
  type WorkerChainId,
  type WorkerPeerSnapshot,
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { bigIntToBytes, intToBytes, utf8ToBytes } from '@ethereumjs/util'

import { getEthyClientVersion } from '../clientMeta.ts'
import type { NoticeBoard } from '../notify/board.ts'
import {
  discoveryLooksBlocked,
  initialP2pLinkState,
  syncP2pLinkNotices,
} from '../notify/p2pLink.ts'
import { deriveCapabilities, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, PeerTelemetry } from '../spine/types.ts'
import { activeHardfork, chainConfigForNetwork } from './chainHardfork.ts'
import { p2pHandshakeStatusFields } from './genesisStatus.ts'
import {
  EthMessageCodes,
  encodeGetBlockHeadersPayload,
  highestEthVersion,
  parsePivotHeaderFromBlockHeadersPayload,
  peerIdToBytes,
} from './pivotHeader.ts'

const PIVOT_STALE_BLOCKS = 96n

export type StartPeerCoordinatorOptions = {
  spine: EthySpine
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
}

export type PeerCoordinatorHandle = {
  stop: () => void
  refreshPivotHeader: () => void
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
    snapRequestsSent: prev?.snapRequestsSent ?? 0,
    snapResponsesOk: prev?.snapResponsesOk ?? 0,
    snapTimeouts: prev?.snapTimeouts ?? 0,
    avgLatencyMs: snapshot.rttMs ?? prev?.avgLatencyMs ?? 0,
    lastError: prev?.lastError,
  }
}

function pickBestPeer(peers: WorkerPeerSnapshot[]): WorkerPeerSnapshot | undefined {
  let best: WorkerPeerSnapshot | undefined
  let bestBlock = 0n
  for (const p of peers) {
    if (p.bestHash === undefined) continue
    const block = p.latestBlock !== undefined ? BigInt(p.latestBlock) : 0n
    if (best === undefined || block > bestBlock) {
      best = p
      bestBlock = block
    }
  }
  return best
}

export async function startPeerCoordinator(
  opts: StartPeerCoordinatorOptions,
): Promise<PeerCoordinatorHandle> {
  const { spine, network } = opts
  setPhase(spine, 'P2P_WARMUP')

  const chain = chainConfigForNetwork(network)
  const hardfork = activeHardfork(chain)
  const privateKey = genPrivateKey()

  let client: Devp2pWorkerClient
  let inFlightPeerId: string | undefined
  let inFlightHash: string | undefined
  let inFlightEthVersion = 68
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

  const requestPivotFromPeer = (peer: WorkerPeerSnapshot) => {
    if (peer.bestHash === undefined || inFlightPeerId !== undefined) return
    const ethVersion = highestEthVersion(peer.caps)
    inFlightPeerId = peer.id
    inFlightHash = peer.bestHash
    inFlightEthVersion = ethVersion
    const payload = encodeGetBlockHeadersPayload(ethVersion, peer.bestHash)
    client.sendEthMessage(peerIdToBytes(peer.id), EthMessageCodes.GET_BLOCK_HEADERS, payload)
  }

  const maybeRefreshPivot = (peers: WorkerPeerSnapshot[]) => {
    const best = pickBestPeer(peers)
    if (best?.latestBlock === undefined || spine.pivotBlockNumber === undefined) return
    const bestNum = BigInt(best.latestBlock)
    if (bestNum > spine.pivotBlockNumber + PIVOT_STALE_BLOCKS) {
      inFlightPeerId = undefined
      requestPivotFromPeer(best)
    }
  }

  const workerModuleUrl =
    opts.inProcess === true
      ? undefined
      : (opts.workerModuleUrl ?? resolveThreadedNetworkModuleUrl(import.meta.url))

  client = await createThreadedNetwork(
    {
      inProcess: opts.inProcess,
      privateKey,
      chain: workerChainId(network),
      hardfork,
      maxPeers: 25,
      capabilities: ['eth68', 'eth69', 'eth70', 'eth71', 'snap1'],
      goodCitizen: opts.goodCitizen ?? true,
      shouldFindNeighbours: opts.shouldFindNeighbours ?? true,
      clientId: utf8ToBytes(`ethy/v${getEthyClientVersion()}`),
      status: p2pHandshakeStatusFields(network),
      listenPort: opts.listenPort ?? 0,
      endpoint: { address: '0.0.0.0', udpPort: 0, tcpPort: opts.listenPort ?? 0 },
      throttleDiscovery: true,
    },
    workerModuleUrl,
  )

  client.events.on('telemetry', (snap) => {
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
    if (inFlightPeerId === undefined) {
      const best = pickBestPeer(snap.peers)
      if (best !== undefined) requestPivotFromPeer(best)
    }
    maybeRefreshPivot(snap.peers)
  })

  client.events.on('protocol', (msg) => {
    if (msg.protocol !== 'eth' || msg.code !== EthMessageCodes.BLOCK_HEADERS) return
    if (
      inFlightPeerId === undefined ||
      msg.peerId !== inFlightPeerId ||
      inFlightHash === undefined
    ) {
      return
    }
    const parsed = parsePivotHeaderFromBlockHeadersPayload(
      inFlightEthVersion,
      msg.payload,
      inFlightHash,
      chain,
    )
    inFlightPeerId = undefined
    inFlightHash = undefined
    if (parsed === null) {
      recordDiagnostic(spine, {
        subsystem: 'devp2p',
        severity: 'warn',
        message: 'Pivot header response empty or hash mismatch',
        peerId: msg.peerId,
      })
      return
    }
    spine.pivotBlockNumber = parsed.number
    spine.pivotStateRoot = parsed.stateRoot
    spine.currentSlot = Number(parsed.number)
    recordDiagnostic(spine, {
      subsystem: 'devp2p',
      severity: 'info',
      message: `Pivot anchored at #${parsed.number.toString()}`,
    })
    client.setBlockRange(intToBytes(0), bigIntToBytes(parsed.number), parsed.hash)
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
      if (linkTimer !== undefined) clearInterval(linkTimer)
      client.stop()
    },
    refreshPivotHeader: () => {
      inFlightPeerId = undefined
      inFlightHash = undefined
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
  const body = ethVersion >= 66 ? [intToBytes(requestId), inner] : inner
  return RLP.encode(body as never)
}
