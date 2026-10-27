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
  shouldFindNeighbours?: boolean
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
  | {
      type: 'setBlockRange'
      earliest: Uint8Array
      latest: Uint8Array
      latestHash: Uint8Array
    }

export interface WorkerPeerSnapshot {
  id: string
  clientId: string
  caps: string[]
  rttMs?: number
}

export interface WorkerDiagnosticEntry {
  timestamp: number
  severity: 'info' | 'warn' | 'error'
  message: string
  peerId?: string
}

export interface WorkerTelemetrySnapshot {
  peers: WorkerPeerSnapshot[]
  diagnostics: WorkerDiagnosticEntry[]
}

export type WorkerEvent =
  | { type: 'ready'; udpPort: number; tcpPort: number }
  | {
      type: 'protocol'
      protocol: 'eth' | 'snap'
      peerId: string
      code: number
      payload: Uint8Array
    }
  | { type: 'telemetry'; snapshot: WorkerTelemetrySnapshot }
  | { type: 'error'; message: string }
  | { type: 'stopped' }
