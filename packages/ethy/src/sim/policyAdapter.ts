/** Bridge to production sync policy (WP-11a) — sole `src/sync` importer here. */

import { pruneFloor } from '../sync/balRetentionPolicy.ts'
import { selectCanonicalSnapPivotTarget } from '../sync/canonicalPivotGrid.ts'
import {
  type AssignBucketsResult,
  type EthySeederDescriptor,
  assignBuckets,
} from '../sync/ethySeederSchedule.ts'
import { shouldStartShadowRefresh } from '../sync/shadowRefresh.ts'
import type { NetworkHeadResumeAction } from '../sync/startupStateMachine.ts'
import { classifySavedDiskState, planNetworkHeadResume } from '../sync/startupStateMachine.ts'
import { SOFT_REFRESH_AGE_BLOCKS, macroGenerationBlock } from '../sync/swarmGenerationPolicy.ts'
import {
  ETHY_DISCOVERY_EXTENDED_GRACE_MS,
  ETHY_DISCOVERY_GRACE_MS,
  type EthySeederView,
  MAX_ETHY_BAL_TAIL_BLOCKS,
  type SyncMode,
  type SyncTransport,
  isUsableEthySeeder,
  preferCanonicalSnapOverEthy,
  shouldLockSnapAfterGrace,
} from '../sync/syncSourceSelector.ts'
import type { PolicyPreset } from './types.ts'
import { LEGACY_SNAP_CLIFF_BLOCKS, RAM_BAL_BLOCKS } from './types.ts'

export type SwarmPolicyAdapter = {
  preset: PolicyPreset
  selectSyncSource(input: {
    syncMode: SyncMode
    syncTransport: SyncTransport
    bestPeerHead: bigint
    explicitConnect: boolean
    hasSnapPeer: boolean
    graceElapsedMs: number
    ethyDialInFlight: boolean
    seeders: Array<{ peerId: string; seeder: EthySeederView }>
  }): { transport: SyncTransport; seeders: Array<{ peerId: string; seeder: EthySeederView }> }
  selectSnapPivot(head: bigint): ReturnType<typeof selectCanonicalSnapPivotTarget>
  assignBuckets(
    seeders: EthySeederDescriptor[],
    assignedLoad: Map<string, number>,
    localNodeId?: Uint8Array,
  ): AssignBucketsResult | undefined
  classifyResume(
    saved: Parameters<typeof classifySavedDiskState>[0],
    fresh: boolean,
  ): ReturnType<typeof classifySavedDiskState>
  planResume(opts: Parameters<typeof planNetworkHeadResume>[0]): NetworkHeadResumeAction
  isUsableSeeder(seeder: EthySeederView, bestPeerHead: bigint, syncMode: SyncMode): boolean
  evaluateGenerationRefresh(input: {
    phase: 'HEAD_FOLLOWING'
    head: bigint
    localPivot: bigint
    enabled: boolean
    freeBytes: bigint
    pivotBytes: bigint
    balEarliest: bigint
  }): { action: 'hold' | 'shadow' }
  evaluateBalRetention(input: {
    minChunkBlock?: bigint
    lastVerified?: bigint
    shadowDisabled: boolean
  }): { mode: 'ram' | 'disk'; floor?: bigint; windowBlocks: number }
  shouldPreemptSnapForEthy(seeder: EthySeederView, bestPeerHead: bigint): boolean
}

function preferCanonicalSnapLegacy(opts: {
  syncMode: SyncMode
  explicitConnect: boolean
  bestPeerHead: bigint
  freshestEthyPivotBlock: bigint | undefined
  hasSnapPeer: boolean
}): boolean {
  if (opts.syncMode === 'ethy' || opts.explicitConnect || !opts.hasSnapPeer) return false
  if (opts.syncMode !== 'auto') return false
  if (opts.freshestEthyPivotBlock === undefined) return false
  if (opts.bestPeerHead <= opts.freshestEthyPivotBlock) return false
  return opts.bestPeerHead - opts.freshestEthyPivotBlock > LEGACY_SNAP_CLIFF_BLOCKS
}

function isUsableSeederLegacy(
  seeder: EthySeederView,
  bestPeerHead: bigint,
  syncMode: SyncMode,
): boolean {
  if (seeder.bucketsBitmask === 0xffff && seeder.balEarliestBlock > seeder.basePivotBlock + 1n) {
    if (syncMode !== 'ethy' && seeder.basePivotBlock > 0n) {
      if (bestPeerHead > seeder.basePivotBlock) {
        const tail = bestPeerHead - seeder.basePivotBlock
        if (tail > MAX_ETHY_BAL_TAIL_BLOCKS) return false
      }
      return true
    }
  }
  return isUsableEthySeeder(seeder, bestPeerHead, syncMode)
}

/** Fixed `0..15` striping for legacy baseline (pre rarest-first WP-11b). */
function assignBucketsLegacyOrder(
  seeders: EthySeederDescriptor[],
  assignedLoad: Map<string, number>,
): AssignBucketsResult | undefined {
  return assignBuckets(seeders, assignedLoad, { localNodeId: new Uint8Array(32) })
}

export function createPolicyAdapter(preset: PolicyPreset): SwarmPolicyAdapter {
  const isLegacy = preset === 'legacy'
  return {
    preset,
    selectSyncSource(input) {
      const usable = input.seeders.filter((row) =>
        isLegacy
          ? isUsableSeederLegacy(row.seeder, input.bestPeerHead, input.syncMode)
          : isUsableEthySeeder(row.seeder, input.bestPeerHead, input.syncMode),
      )
      usable.sort((a, b) =>
        a.seeder.basePivotBlock === b.seeder.basePivotBlock
          ? 0
          : a.seeder.basePivotBlock > b.seeder.basePivotBlock
            ? -1
            : 1,
      )
      if (input.syncTransport !== 'unset') {
        return { transport: input.syncTransport, seeders: usable }
      }
      const preferSnap = isLegacy
        ? preferCanonicalSnapLegacy({
            syncMode: input.syncMode,
            explicitConnect: input.explicitConnect,
            bestPeerHead: input.bestPeerHead,
            freshestEthyPivotBlock: usable[0]?.seeder.basePivotBlock,
            hasSnapPeer: input.hasSnapPeer,
          })
        : preferCanonicalSnapOverEthy({
            syncMode: input.syncMode,
            explicitConnect: input.explicitConnect,
            bestPeerHead: input.bestPeerHead,
            freshestEthyPivotBlock: usable[0]?.seeder.basePivotBlock,
            hasSnapPeer: input.hasSnapPeer,
          })
      if (
        shouldLockSnapAfterGrace(
          input.syncMode,
          input.syncTransport,
          input.graceElapsedMs,
          usable.length > 0,
          input.ethyDialInFlight,
        ) ||
        preferSnap
      ) {
        return { transport: 'snap', seeders: usable }
      }
      if (usable.length > 0) {
        return { transport: 'ethy', seeders: usable }
      }
      return { transport: 'unset', seeders: usable }
    },
    selectSnapPivot: selectCanonicalSnapPivotTarget,
    assignBuckets(seeders, assignedLoad, localNodeId) {
      if (isLegacy) {
        return assignBucketsLegacyOrder(seeders, assignedLoad)
      }
      return assignBuckets(seeders, assignedLoad, { localNodeId })
    },
    classifyResume: classifySavedDiskState,
    planResume: planNetworkHeadResume,
    isUsableSeeder(seeder, bestPeerHead, syncMode) {
      return isLegacy
        ? isUsableSeederLegacy(seeder, bestPeerHead, syncMode)
        : isUsableEthySeeder(seeder, bestPeerHead, syncMode)
    },
    evaluateGenerationRefresh(input) {
      if (isLegacy) return { action: 'hold' as const }
      const start = shouldStartShadowRefresh({
        phase: input.phase,
        freeBytes: input.freeBytes,
        pivotBytes: input.pivotBytes,
        head: input.head,
        localPivot: input.localPivot,
        balEarliest: input.balEarliest,
        enabled: input.enabled,
      })
      return start ? { action: 'shadow' as const } : { action: 'hold' as const }
    },
    evaluateBalRetention(input) {
      if (isLegacy) {
        return { mode: 'ram' as const, windowBlocks: RAM_BAL_BLOCKS }
      }
      const floor = pruneFloor(input.minChunkBlock, input.lastVerified, input.shadowDisabled)
      return { mode: 'disk' as const, floor, windowBlocks: RAM_BAL_BLOCKS }
    },
    shouldPreemptSnapForEthy(seeder, bestPeerHead) {
      if (isLegacy) return false
      if (bestPeerHead <= seeder.basePivotBlock) return true
      return bestPeerHead - seeder.basePivotBlock <= SOFT_REFRESH_AGE_BLOCKS
    },
  }
}

export function macroGen(head: bigint): bigint {
  return macroGenerationBlock(head)
}

export const DISCOVERY_GRACE_MS = ETHY_DISCOVERY_GRACE_MS
export const DISCOVERY_EXTENDED_MS = ETHY_DISCOVERY_EXTENDED_GRACE_MS
