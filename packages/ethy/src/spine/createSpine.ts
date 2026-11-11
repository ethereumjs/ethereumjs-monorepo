import { ETHY_CLIENT_NAME, getEthyClientVersion } from '../clientMeta.ts'
import { createSnapBuckets, formatSnapCapabilityLabel } from './buckets.ts'
import type { EthyPhase, EthySpine } from './types.ts'

function deriveStateCapability(spine: EthySpine): void {
  const { phase, totalAccountsSynced, pivotBlockNumber } = spine
  if (phase === 'BOOTING') {
    spine.capabilities.state = { status: 'locked', label: 'Starting' }
    return
  }
  if (phase === 'P2P_WARMUP') {
    if (totalAccountsSynced > 0 || pivotBlockNumber !== undefined) {
      spine.capabilities.state = { status: 'partial', label: 'Warming' }
    } else {
      spine.capabilities.state = { status: 'locked', label: 'Waiting' }
    }
    return
  }
  if (phase === 'SNAP_SYNCING' || phase === 'BAL_CATCHUP') {
    const label =
      phase === 'BAL_CATCHUP'
        ? 'BAL Catch-Up'
        : formatSnapCapabilityLabel(spine.snapBuckets, {
            peerCount: spine.peers.size,
            phase,
          })
    spine.capabilities.state = { status: 'partial', label }
    return
  }
  if (phase === 'HEAD_FOLLOWING') {
    spine.capabilities.state = { status: 'ready', label: 'Following' }
    return
  }
  spine.capabilities.state = { status: 'locked', label: 'Starting' }
}

function deriveEconomyCapability(spine: EthySpine): void {
  const econ = spine.economy
  if (econ?.hasBlocks !== true) {
    spine.capabilities.economy = { status: 'locked', label: 'No blocks' }
    return
  }
  const recent = econ.recentBlocks.length
  if (econ.hasTxBody === true && recent >= 4) {
    spine.capabilities.economy = { status: 'ready', label: 'Live' }
    return
  }
  spine.capabilities.economy = { status: 'partial', label: 'Warming' }
}

function deriveP2pCapability(spine: EthySpine): void {
  const n = spine.peers.size
  if (n === 0) {
    spine.capabilities.p2p = { status: 'locked', label: 'None' }
  } else if (n === 1) {
    spine.capabilities.p2p = { status: 'partial', label: '1 Peer' }
  } else {
    spine.capabilities.p2p = { status: 'ready', label: `${n} Peers` }
  }
}

function deriveAiCapability(spine: EthySpine): void {
  if (spine.llmPulseReady === true) {
    spine.capabilities.ai = { status: 'ready', label: 'Local LLM' }
  } else {
    spine.capabilities.ai = { status: 'partial', label: 'Slash/Rule' }
  }
}

export function deriveCapabilities(spine: EthySpine): void {
  deriveStateCapability(spine)
  deriveEconomyCapability(spine)
  deriveP2pCapability(spine)
  deriveAiCapability(spine)
}

export function createSpine(network: string, chainId: bigint): EthySpine {
  const spine: EthySpine = {
    clientName: ETHY_CLIENT_NAME,
    clientVersion: getEthyClientVersion(),
    network,
    chainId,
    phase: 'BOOTING',
    syncTransport: 'unset',
    ethyBucketsBitmask: 0,
    currentSlot: 0,
    capabilities: {
      state: { status: 'locked', label: 'Starting' },
      economy: { status: 'locked', label: 'No blocks' },
      p2p: { status: 'locked', label: 'None' },
      ai: { status: 'partial', label: 'Slash/Rule' },
    },
    peers: new Map(),
    snapBuckets: createSnapBuckets(),
    totalAccountsSynced: 0,
    accountsPerSec: 0,
    accountsPerMin: 0,
    codesSynced: 0,
    codesTotal: 0,
    codesQueued: 0,
    storageSlotsSynced: 0,
    storageAccountsSynced: 0,
    storageAccountsTotal: 0,
    storageQueued: 0,
    contractsPerSec: 0,
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
