import type { Common } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { bls12_381 } from '@noble/curves/bls12-381.js'
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'

import { ETH_BLS_DST } from '../bls.ts'
import { stateRootForMerkleLeaf } from '../client.ts'
import { computeSigningRoot, computeSyncCommitteeDomain } from '../domain.ts'
import { ZERO_HASHES, gindexToMerklePosition } from '../merkle.ts'
import { amsterdamActivationEpoch, epochAtSlot, proofLayoutAtEpoch } from '../proofLayout.ts'
import {
  hashTreeRootBeaconBlockHeader,
  hashTreeRootExecutionPayloadHeader,
  hashTreeRootSyncCommittee,
} from '../ssz.ts'
import type {
  BeaconBlockHeader,
  ExecutionPayloadHeaderSummary,
  LightClientBootstrap,
  LightClientHeader,
  LightClientOptimisticUpdate,
  SyncCommittee,
} from '../types.ts'

const blsLong = bls12_381.longSignatures

function demoHeaderAt(
  common: Common,
  slot: number,
  blockNumber: number,
  stateRoot: Uint8Array,
): LightClientHeader {
  const epoch = epochAtSlot(slot, common)
  const layout = proofLayoutAtEpoch(common, epoch)
  const { depth } = gindexToMerklePosition(layout.executionPayloadGindex)
  const branch = ZERO_HASHES.slice(0, depth)
  const blockHash = nobleSha256(new Uint8Array([blockNumber & 0xff, (blockNumber >> 8) & 0xff]))

  if (epoch >= amsterdamActivationEpoch(common)) {
    const bodyRoot = stateRootForMerkleLeaf(blockHash, layout.executionPayloadGindex, nobleSha256)
    const beacon: BeaconBlockHeader = {
      slot,
      proposerIndex: 42,
      parentRoot: new Uint8Array(32),
      stateRoot,
      bodyRoot,
    }
    return {
      beacon,
      executionBlockHash: blockHash,
      executionBranch: branch,
    }
  }

  const zero32 = new Uint8Array(32)
  const execution: ExecutionPayloadHeaderSummary = {
    parentHash: zero32,
    feeRecipient: new Uint8Array(20),
    stateRoot: nobleSha256(new Uint8Array([slot & 0xff])),
    receiptsRoot: zero32,
    logsBloom: new Uint8Array(256),
    prevRandao: zero32,
    blockNumber,
    gasLimit: 36_000_000,
    gasUsed: 15_000_000,
    timestamp: 1_750_000_000 + slot * 12,
    extraData: new Uint8Array(0),
    baseFeePerGas: 1_000_000_000n,
    blockHash,
    transactionsRoot: zero32,
    withdrawalsRoot: zero32,
    blobGasUsed: 0,
    excessBlobGas: 0,
  }
  const denebEpoch =
    common.beaconLightClient()?.forks.find((f) => f.name === 'deneb')?.epoch ??
    Number.MAX_SAFE_INTEGER
  const fork = epoch >= denebEpoch ? 'deneb' : 'capella'
  const execRoot = hashTreeRootExecutionPayloadHeader(execution, fork, nobleSha256)
  const bodyRoot = stateRootForMerkleLeaf(execRoot, layout.executionPayloadGindex, nobleSha256)
  const beacon: BeaconBlockHeader = {
    slot,
    proposerIndex: 42,
    parentRoot: new Uint8Array(32),
    stateRoot,
    bodyRoot,
  }
  return { beacon, execution, executionBranch: branch }
}

/** Build a deterministic offline bootstrap + signed optimistic update for `--demo`. */
export function buildDemoScenario(common: Common): {
  bootstrap: LightClientBootstrap
  optimisticUpdate: LightClientOptimisticUpdate
} {
  const cfg = common.beaconLightClient()!
  const capellaEpoch = cfg.forks.find((f) => f.name === 'capella')?.epoch ?? 0
  const electraEpoch = cfg.forks.find((f) => f.name === 'electra')?.epoch ?? capellaEpoch
  const slot = Math.max(capellaEpoch, electraEpoch) * cfg.slotsPerEpoch + 64
  const epoch = epochAtSlot(slot, common)
  const layout = proofLayoutAtEpoch(common, epoch)

  const sk = nobleSha256(new TextEncoder().encode('ethereumjs-beacon-light-demo-key'))
  const pk = blsLong.getPublicKey(sk).toBytes()
  const publicKeys = Array.from({ length: 512 }, () => new Uint8Array(pk))
  const committee: SyncCommittee = {
    publicKeys,
    aggregatePubkey: new Uint8Array(pk),
  }
  const committeeRoot = hashTreeRootSyncCommittee(committee, nobleSha256)
  const stateRoot = stateRootForMerkleLeaf(
    committeeRoot,
    layout.currentSyncCommitteeGindex,
    nobleSha256,
  )
  const header = demoHeaderAt(common, slot, 12_062_000, stateRoot)
  const branchDepth = gindexToMerklePosition(layout.currentSyncCommitteeGindex).depth
  const bootstrap: LightClientBootstrap = {
    header,
    currentSyncCommittee: committee,
    currentSyncCommitteeBranch: ZERO_HASHES.slice(0, branchDepth),
  }

  const attestedHeader = demoHeaderAt(common, slot + 1, 12_062_001, stateRoot)
  const signatureSlot = slot + 2
  const forkEpoch = epochAtSlot(signatureSlot - 1, common)
  const forkVersion = common.forkVersionAtEpoch(forkEpoch)
  const gvr = hexToBytes(cfg.genesisValidatorsRoot)
  const domain = computeSyncCommitteeDomain(forkVersion, gvr, nobleSha256)
  const signingRoot = computeSigningRoot(
    hashTreeRootBeaconBlockHeader(attestedHeader.beacon, nobleSha256),
    domain,
    nobleSha256,
  )
  const hashedMsg = blsLong.hash(signingRoot, ETH_BLS_DST)
  const singleSig = blsLong.sign(hashedMsg, sk).toBytes()
  const participantCount = 496
  const sigs = Array.from({ length: participantCount }, () => singleSig)
  const signature = blsLong.aggregateSignatures(sigs).toBytes()
  const bits = new Uint8Array(64)
  for (let i = 0; i < participantCount; i++) {
    bits[i >> 3]! |= 1 << (i & 7)
  }

  return {
    bootstrap,
    optimisticUpdate: {
      attestedHeader,
      syncAggregate: { syncCommitteeBits: bits, signature },
      signatureSlot,
    },
  }
}
