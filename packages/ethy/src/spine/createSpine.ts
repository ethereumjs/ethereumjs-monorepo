import { ETHY_CLIENT_NAME, getEthyClientVersion } from '../clientMeta.ts'
import { createSnapBuckets, formatSnapCapabilityLabel } from './buckets.ts'
import type { EthyPhase, EthySpine } from './types.ts'

export function deriveCapabilities(spine: EthySpine): void {
  const peerCount = spine.peers.size

  switch (spine.phase) {
    case 'BOOTING':
      spine.capabilities.p2p = { status: 'locked', label: 'Starting' }
      spine.capabilities.snap = { status: 'locked', label: 'Waiting' }
      spine.capabilities.head = { status: 'locked', label: 'Locked' }
      break
    case 'P2P_WARMUP':
      spine.capabilities.p2p =
        peerCount >= 1
          ? { status: 'ready', label: `${peerCount} Peers` }
          : { status: 'partial', label: 'Connecting' }
      spine.capabilities.snap = { status: 'locked', label: 'Waiting' }
      spine.capabilities.head = { status: 'locked', label: 'Locked' }
      break
    case 'SNAP_SYNCING': {
      spine.capabilities.p2p = { status: 'ready', label: `${peerCount} Peers` }
      const snapLabel = formatSnapCapabilityLabel(spine.snapBuckets, {
        peerCount,
        phase: spine.phase,
      })
      spine.capabilities.snap = { status: 'partial', label: snapLabel }
      spine.capabilities.head = { status: 'locked', label: 'Locked' }
      break
    }
    case 'BAL_CATCHUP':
      spine.capabilities.p2p = { status: 'ready', label: `${peerCount} Peers` }
      spine.capabilities.snap = { status: 'ready', label: 'Synced' }
      spine.capabilities.head = { status: 'partial', label: 'Catch-up' }
      break
    case 'HEAD_FOLLOWING':
      spine.capabilities.p2p = { status: 'ready', label: `${peerCount} Peers` }
      spine.capabilities.snap = { status: 'ready', label: 'Synced' }
      spine.capabilities.head = { status: 'ready', label: 'Following' }
      break
  }

  spine.capabilities.ai = { status: 'partial', label: 'Slash/Rule Mode' }
}

export function createSpine(network: string, chainId: bigint): EthySpine {
  const spine: EthySpine = {
    clientName: ETHY_CLIENT_NAME,
    clientVersion: getEthyClientVersion(),
    network,
    chainId,
    phase: 'BOOTING',
    currentSlot: 0,
    capabilities: {
      p2p: { status: 'locked', label: 'Starting' },
      snap: { status: 'locked', label: 'Waiting' },
      head: { status: 'locked', label: 'Locked' },
      ai: { status: 'partial', label: 'Slash/Rule Mode' },
    },
    peers: new Map(),
    snapBuckets: createSnapBuckets(),
    totalAccountsSynced: 0,
    accountsPerSec: 0,
    codesSynced: 0,
    codesQueued: 0,
    storageSlotsSynced: 0,
    storageQueued: 0,
    balWindow: [],
    snapPaused: false,
    diagnosticRingBuffer: [],
  }
  deriveCapabilities(spine)
  return spine
}

export function setPhase(spine: EthySpine, phase: EthyPhase): void {
  spine.phase = phase
  deriveCapabilities(spine)
}
