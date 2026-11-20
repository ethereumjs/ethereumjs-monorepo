/** Swarm simulator types (WP-11a) — no Node built-ins. */

export type PolicyPreset = 'legacy' | 'v2'

export type ScenarioId =
  | 'thundering-herd-age-cliff'
  | 'laptop-every-3-days'
  | 'flash-crowd-launch'
  | 'low-density-dht-bootstrap'
  | 'minter-crash-failover'
  | 'fake-minter-suppression'
  | 'cross-snapshot-churn'
  | 'total-swarm-hibernation'
  | 'seeder-bandwidth-cap'
  | 'long-horizon-soak'

export type NodeProfile = 'always-on' | 'desktop' | 'laptop' | 'burst-joiner' | 'byzantine'

export type SimPhase = 'offline' | 'P2P_WARMUP' | 'SNAP_SYNCING' | 'BAL_CATCHUP' | 'HEAD_FOLLOWING'

export type SyncTransport = 'unset' | 'ethy' | 'snap'

export type SimNode = {
  id: number
  profile: NodeProfile
  public: boolean
  online: boolean
  phase: SimPhase
  syncTransport: SyncTransport
  basePivotBlock: bigint
  bucketsBitmask: number
  balEarliestBlock: bigint
  balLatestBlock: bigint
  lastVerifiedBlock: bigint
  joinVirtualMs: number
  graceStartMs: number
  syncCompleteMs?: number
  isByzantineFakeMinter: boolean
  isBlackHole: boolean
  bytesDownloaded: number
  bytesUploaded: number
  bucketsDone: number
  stuck: boolean
  laptopGapCounted?: boolean
}

export type SimScale = 'ci' | 'demo'

export type ScenarioSpec = {
  id: ScenarioId
  ci: ScenarioParams
  demo: ScenarioParams
  description: string
}

export type ScenarioParams = {
  nodes: number
  virtualDays: number
  /** Optional scenario knobs */
  seeders?: number
  joiners?: number
  snapCap?: number
  backboneDht?: number
  stopBlocksPastPivot?: bigint
  seederMbps?: number
  ethyInDht?: number
}

export type SimConfig = {
  seed: number
  policy: PolicyPreset
  params: ScenarioParams
  scenarioId: ScenarioId
}

export const SLOT_MS = 12_000
export const DISCOVERY_SAMPLE_MS = 1_000
export const RAM_BAL_BLOCKS = 64
export const SNAP_SYNC_SLOTS_HEALTHY = 150
export const LEGACY_SNAP_CLIFF_BLOCKS = 2048n
export const ETHY_BUCKET_SLOTS = 16
