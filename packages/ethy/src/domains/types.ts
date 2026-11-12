import type { DomainPermission, EconomySnapshot } from '../economy/types.ts'

export type { EconomySnapshot }

export type { DomainPermission }

export type NodePulseSnapshot = {
  phase: string
  syncTransport?: string
  pivotBlockNumber?: string
  headBlockNumber?: string
  progressPct: number
  snapEtaMinutes?: number
  snapPaused: boolean
  snapPeersResting?: number
}

export type P2pDomainSnapshot = {
  connected: number
  snapSession: number
  ethySession: number
  clientFamilies: string
  avgLatencyMs: number
  servedLatest?: string
  servedEarliest?: string
}

export type SnapDomainSnapshot = {
  bucketsDone: number
  bucketsSyncing: number
  bucketsStalled: number
  totalAccountsSynced: number
  accountsPerSec: number
  codesSynced: number
  codesTotal?: number
  storageAccountsSynced?: number
  storageAccountsTotal?: number
  contractsPerSec?: number
}

export type HeadDomainSnapshot = {
  headBlockNumber?: string
  pivotBlockNumber?: string
  clStatus?: string
  balWindowBlocks: number
  latestBalAccountCount: number
}

/** Read-only snapshot consumed by the TUI cockpit and future LLM pulse. */
export interface EthyDomainSnapshots {
  pulse: NodePulseSnapshot
  economy: EconomySnapshot
  p2p: P2pDomainSnapshot
  snap: SnapDomainSnapshot
  head: HeadDomainSnapshot
}

export type DomainWriteActionId = 'dropPeer' | 'reassignBucket' | 'pauseSnapSync' | 'resumeSnapSync'

export interface DomainWriteAccess {
  permission: 'write'
  actions: DomainWriteActionId[]
}
