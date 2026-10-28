import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'

export type CapabilityId = 'p2p' | 'snap' | 'head' | 'ai'

export type EthyPhase = 'BOOTING' | 'P2P_WARMUP' | 'SNAP_SYNCING' | 'HEAD_FOLLOWING'

export type CapabilityReadiness = 'locked' | 'partial' | 'ready'

export type SnapBucketStatus = 'pending' | 'syncing' | 'verifying_proof' | 'done' | 'stalled'

export interface PeerTelemetry {
  id: string
  clientName: string
  caps: string[]
  snapRequestsSent: number
  snapResponsesOk: number
  snapTimeouts: number
  avgLatencyMs: number
  lastError?: string
}

export interface SnapBucket {
  index: number
  prefix: string
  status: SnapBucketStatus
  accountsLoaded: number
  startHash: Uint8Array
  currentLastHash: Uint8Array
  limitHash: Uint8Array
  assignedPeerId?: string
  lastStallReason?: string
}

export type DiagnosticSubsystem = 'devp2p' | 'snap' | 'bal' | 'mpt' | 'cl' | 'ai'

export interface DiagnosticEvent {
  timestamp: number
  subsystem: DiagnosticSubsystem
  severity: 'info' | 'warn' | 'error' | 'anomaly'
  peerId?: string
  bucketIndex?: number
  message: string
  rawPayloadHex?: string
}

export interface CapabilityState {
  status: CapabilityReadiness
  label: string
  progressPct?: number
}

export interface EthySpine {
  clientName: string
  clientVersion: string
  network: string
  chainId: bigint
  phase: EthyPhase
  currentSlot: number
  pivotBlockNumber?: bigint
  pivotStateRoot?: Uint8Array
  headBlockNumber?: bigint
  headStateRoot?: Uint8Array
  capabilities: {
    p2p: CapabilityState
    snap: CapabilityState
    head: CapabilityState
    ai: CapabilityState
  }
  peers: Map<string, PeerTelemetry>
  /** Latest worker discovery counters (live P2P only). */
  discovery?: WorkerDiscoverySnapshot
  snapBuckets: SnapBucket[]
  totalAccountsSynced: number
  accountsPerSec: number
  diagnosticRingBuffer: DiagnosticEvent[]
}

export type WidgetSpec =
  | {
      kind: 'onboarding_carousel'
      lines: Array<{ group: 'P2P' | 'SNAP' | 'HEAD'; command: string; prose: string }>
      assistantComment?: string
    }
  | {
      kind: 'table'
      title?: string
      headers: string[]
      rows: string[][]
      assistantComment?: string
    }
  | {
      kind: 'key_value'
      title?: string
      entries: Array<{ key: string; value: string }>
      assistantComment?: string
    }

export interface TuiViewState {
  activeDomain: CapabilityId
  activeWidget: WidgetSpec | null
  promptDraft: string
  carouselTick: number
  history: string[]
  historyIndex: number
  shouldExit: boolean
}
