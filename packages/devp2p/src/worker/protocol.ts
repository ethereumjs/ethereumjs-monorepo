import type { PeerInfo } from '../types.ts'

/** Chain names supported by {@link createThreadedNetwork} worker init (clone-safe). */
export type WorkerChainId = 'mainnet' | 'sepolia' | 'hoodi' | 'holesky'

/** JSON-friendly STATUS fields for worker init. */
export interface ThreadedEthStatusFields {
  td: string
  bestHash: string
  genesisHash: string
  latestBlock?: string
  earliestBlock?: string
  latestBlockHash?: string
}

export interface ThreadedNetworkInitOptions {
  privateKey: Uint8Array
  chain: WorkerChainId
  hardfork?: string
  maxPeers?: number
  /** Cap inbound TCP handshakes; unset shares the full {@link maxPeers} pool. */
  maxInboundPeers?: number
  capabilities?: string[]
  endpoint?: PeerInfo
  listenPort?: number | null
  bootnodes?: PeerInfo[]
  clientId?: Uint8Array
  status?: ThreadedEthStatusFields
  throttleDiscovery?: boolean
  discoveryLowWaterMark?: number
  maxInFlightPings?: number
  telemetryIntervalMs?: number
  goodCitizen?: boolean
  /**
   * When false, inbound SNAP requests are left unanswered.
   * An empty account proof is not a valid snap reply and gets the session dropped.
   */
  answerEmptySnap?: boolean
  shouldFindNeighbours?: boolean
  /**
   * Dial the chain DNS ENR tree and bootstrap nodes without discv4 neighbour crawl.
   * Neighbour lookup stays off so other networks cannot fill RLPx slots.
   */
  chainDirectoryDiscovery?: boolean
  /** Persist DPT bond store to this path (JSON). */
  nodeStorePath?: string
  /** Read-only pivot dir for `accounts/*.proof.idx` (optional). */
  ethyPivotDir?: string
}

/** Remote ETHY/0 STATUS fields exposed on worker telemetry. */
export interface WorkerEthyPeerStatus {
  basePivotBlock: string
  basePivotStateRoot: string
  bucketsBitmask: string
  balEarliestBlock: string
  balLatestBlock: string
  latestBlockHash: string
}

/** Local ETHY/0 advertisement pushed via {@link setEthyStatus}. */
export interface WorkerEthyLocalStatus {
  basePivotBlock?: string
  basePivotStateRoot?: string
  bucketsBitmask?: string
  balEarliestBlock?: string
  balLatestBlock?: string
  latestBlockHash?: string
}

export type WorkerCommand =
  | { type: 'boot'; options: ThreadedNetworkInitOptions }
  | { type: 'init'; options: ThreadedNetworkInitOptions }
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'connectPeer'; peer: PeerInfo }
  | { type: 'disconnectPeer'; peerId: Uint8Array; reason?: number }
  | { type: 'sendEthMessage'; peerId: Uint8Array; code: number; payload: Uint8Array }
  | { type: 'sendSnapMessage'; peerId: Uint8Array; code: number; payload: Uint8Array }
  | { type: 'sendEthyMessage'; peerId: Uint8Array; code: number; payload: Uint8Array }
  | { type: 'setEthyStatus'; status: WorkerEthyLocalStatus }
  | { type: 'setEthyPivotAccountsDir'; dir?: string }
  | {
      type: 'putEthyAccountChunk'
      chunk: {
        bucketIndex: number
        originHash: Uint8Array
        lastHash: Uint8Array
        hasRight: number
        chunkStateRoot: Uint8Array
        chunkBlockNumber: string
        binaryAccountsSlab: Uint8Array
        proofNodes: Uint8Array[]
      }
    }
  | {
      type: 'setBlockRange'
      earliest: Uint8Array
      latest: Uint8Array
      latestHash: Uint8Array
    }
  | {
      type: 'putServableBlock'
      block: {
        number: string
        hash: Uint8Array
        headerRlp: Uint8Array
        bodyRlp: Uint8Array
        receiptsEth69Rlp: Uint8Array
        balRlp?: Uint8Array
      }
    }
  | { type: 'setDiscoveryPaused'; paused: boolean }
  | { type: 'setAdvertiseBlockRange'; enabled: boolean }
  | { type: 'notePooledTx'; hashHex: string; raw: Uint8Array }
  | { type: 'dropPooledTx'; hashHex: string }

export interface WorkerServingSnapshot {
  earliestBlock?: string
  latestBlock?: string
  blocksStored: number
  headersServed: number
  bodiesServed: number
  receiptsServed: number
  accessListsServed: number
  totalRequestsServed: number
  totalBytesServed: number
  ethyChunksServed: number
  ethyBalBlocksServed: number
  ethyBytesServed: number
}

export interface WorkerPeerSnapshot {
  id: string
  clientId: string
  caps: string[]
  /** True when snap/1 was negotiated, not merely listed in HELLO. */
  snapSession?: boolean
  rttMs?: number
  /** Remote head block hash from ETH STATUS (`0x` + hex). */
  bestHash?: string
  /** Remote latest block number from ETH STATUS (decimal string). */
  latestBlock?: string
  /** Remote TCP host after connect (for client peer books). */
  address?: string
  udpPort?: number
  tcpPort?: number
  ethySession?: boolean
  ethyStatus?: WorkerEthyPeerStatus
}

export interface WorkerDiagnosticEntry {
  timestamp: number
  severity: 'info' | 'warn' | 'error'
  message: string
  peerId?: string
}

export interface WorkerDiscoveryBootstrapSnapshot {
  attempts: number
  ok: number
  fail: number
  lastError?: string
}

export interface WorkerDiscoveryDnsSnapshot {
  attempts: number
  peersAdded: number
  lastError?: string
  resolver?: string
}

export interface WorkerDiscoveryRlpxSnapshot {
  dials: number
  connected: number
  statusOk: number
  /** ETH STATUS messages this node wrote after HELLO. */
  statusSent?: number
  /** TCP resets that happened after HELLO, included in `handshakeRejects.reset`. */
  resetAfterHello?: number
  /** Keys are `REASON (we dropped remote)` or `REASON (remote dropped us)`. */
  disconnects: Record<string, number>
  /** Counts of why sessions died before a validated ETH STATUS. */
  handshakeRejects?: Partial<
    Record<'genesis' | 'network' | 'fork' | 'reset' | 'slots' | 'timeout', number>
  >
  /**
   * Drops after HELLO, keyed by `Client/version eth/N`.
   * `remote` — they sent SUBPROTOCOL or PROTOCOL error.
   * `we` — we sent that error. `reset` — TCP reset after HELLO.
   */
  peerFates?: Record<string, { remote?: number; we?: number; reset?: number }>
  lastSubprotocolError?: string
}

export interface WorkerDiscoveryDptSnapshot {
  /** `addPeer` skipped because the remote node is already on our ban list. */
  banSkips: number
  /** New bans we applied to a remote discovery endpoint. */
  bansIssued: number
  lastRemote?: string
  lastCause?: string
}

export interface WorkerDiscoverySnapshot {
  boundAddress: string
  boundUdpPort: number
  boundTcpPort: number
  /** `enode://` URL for this node (loopback-friendly). */
  localEnode?: string
  tablePeers: number
  /** True when DPT neighbour lookup and DNS batches are paused. */
  discoveryPaused?: boolean
  /** Hardfork, EIP-2124 hash, and next fork this node puts in ETH STATUS. */
  advertisedFork?: { hardfork: string; hash: string; next?: string }
  bootstrap: WorkerDiscoveryBootstrapSnapshot
  dns: WorkerDiscoveryDnsSnapshot
  rlpx: WorkerDiscoveryRlpxSnapshot
  dpt: WorkerDiscoveryDptSnapshot
}

export interface WorkerTelemetrySnapshot {
  peers: WorkerPeerSnapshot[]
  diagnostics: WorkerDiagnosticEntry[]
  discovery?: WorkerDiscoverySnapshot
  serving: WorkerServingSnapshot
}

export type WorkerEvent =
  | { type: 'ready'; udpPort: number; tcpPort: number }
  | {
      type: 'protocol'
      protocol: 'eth' | 'snap' | 'ethy'
      peerId: string
      code: number
      payload: Uint8Array
    }
  | { type: 'telemetry'; snapshot: WorkerTelemetrySnapshot }
  | { type: 'error'; message: string }
  | { type: 'stopped' }
