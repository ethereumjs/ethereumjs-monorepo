import { type ChainConfig, Common, Hoodi } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { bls12_381 } from '@noble/curves/bls12-381.js'

const blsLong = bls12_381.longSignatures
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'

import {
  ETH_BLS_DST,
  ZERO_HASHES,
  computeSigningRoot,
  computeSyncCommitteeDomain,
  hashTreeRootBeaconBlockHeader,
  hashTreeRootExecutionPayloadHeader,
  hashTreeRootSyncCommittee,
  proofLayoutAtEpoch,
  stateRootForMerkleLeaf,
} from '../../src/index.ts'

import type {
  BeaconBlockHeader,
  ExecutionPayloadHeaderSummary,
  LightClientBootstrap,
  LightClientHeader,
  SyncAggregate,
  SyncCommittee,
} from '../../src/types.ts'

export const testCommon = new Common({ chain: Hoodi })
export const sha256 = nobleSha256

function executionPayloadFork(common: Common, slot: number): 'capella' | 'deneb' {
  const slotsPerEpoch = common.beaconLightClient()?.slotsPerEpoch ?? 32
  const epoch = Math.floor(slot / slotsPerEpoch)
  const denebEpoch =
    common.beaconLightClient()?.forks.find((f) => f.name === 'deneb')?.epoch ??
    Number.MAX_SAFE_INTEGER
  return epoch >= denebEpoch ? 'deneb' : 'capella'
}

export function deterministicSecretKey(index: number): Uint8Array {
  const digest = nobleSha256(new TextEncoder().encode(`ethereumjs-beacon-light-test-${index}`))
  const seed = new Uint8Array(48)
  seed.set(digest, 0)
  seed.set(nobleSha256(digest).subarray(0, 16), 32)
  return bls12_381.utils.randomSecretKey(seed)
}

const UNIQUE_TEST_KEYS = 8
let cachedCommittee:
  | {
      committee: SyncCommittee
      secretKeys: Uint8Array[]
    }
  | undefined

export function buildTestSyncCommittee(): {
  committee: SyncCommittee
  secretKeys: Uint8Array[]
} {
  if (cachedCommittee !== undefined) {
    return {
      committee: {
        publicKeys: cachedCommittee.committee.publicKeys.map((pk) => new Uint8Array(pk)),
        aggregatePubkey: new Uint8Array(cachedCommittee.committee.aggregatePubkey),
      },
      secretKeys: cachedCommittee.secretKeys,
    }
  }
  const baseSecretKeys: Uint8Array[] = []
  const basePublicKeys: Uint8Array[] = []
  for (let i = 0; i < UNIQUE_TEST_KEYS; i++) {
    const sk = deterministicSecretKey(i + 1)
    baseSecretKeys.push(sk)
    basePublicKeys.push(blsLong.getPublicKey(sk).toBytes())
  }
  const secretKeys: Uint8Array[] = []
  const publicKeys: Uint8Array[] = []
  for (let i = 0; i < 512; i++) {
    secretKeys.push(baseSecretKeys[i % UNIQUE_TEST_KEYS]!)
    publicKeys.push(new Uint8Array(basePublicKeys[i % UNIQUE_TEST_KEYS]!))
  }
  const aggregatePubkey = new Uint8Array(basePublicKeys[0]!)
  cachedCommittee = {
    committee: { publicKeys, aggregatePubkey },
    secretKeys,
  }
  return buildTestSyncCommittee()
}

export function zeroExecutionPayload(blockNumber: number): ExecutionPayloadHeaderSummary {
  const zero32 = new Uint8Array(32)
  const zero20 = new Uint8Array(20)
  return {
    parentHash: zero32,
    feeRecipient: zero20,
    stateRoot: zero32,
    receiptsRoot: zero32,
    logsBloom: new Uint8Array(256),
    prevRandao: zero32,
    blockNumber,
    gasLimit: 30_000_000,
    gasUsed: 0,
    timestamp: 1_700_000_000,
    extraData: new Uint8Array(0),
    baseFeePerGas: 1_000_000_000n,
    blockHash: nobleSha256(new Uint8Array([blockNumber & 0xff])),
    transactionsRoot: zero32,
    withdrawalsRoot: zero32,
    blobGasUsed: 0,
    excessBlobGas: 0,
  }
}

export function capellaLightClientHeader(
  slot: number,
  stateRoot: Uint8Array,
  bodyRoot: Uint8Array,
  execution: ExecutionPayloadHeaderSummary,
  common: Common = testCommon,
): LightClientHeader {
  const beacon: BeaconBlockHeader = {
    slot,
    proposerIndex: 0,
    parentRoot: new Uint8Array(32),
    stateRoot,
    bodyRoot,
  }
  const execRoot = hashTreeRootExecutionPayloadHeader(
    execution,
    executionPayloadFork(common, slot),
    sha256,
  )
  const layout = proofLayoutAtEpoch(common, Math.floor(slot / 32))
  const { depth } = { depth: Math.floor(Math.log2(layout.executionPayloadGindex)) }
  const branch = ZERO_HASHES.slice(0, depth)
  return { beacon, execution, executionBranch: branch }
}

export function buildBootstrap(slot = 100_000, chain: ChainConfig = Hoodi): LightClientBootstrap {
  const common = new Common({ chain })
  const { committee } = buildTestSyncCommittee()
  const committeeRoot = hashTreeRootSyncCommittee(committee, sha256)
  const epoch = Math.floor(slot / 32)
  const layout = proofLayoutAtEpoch(common, epoch)
  const stateRoot = stateRootForMerkleLeaf(committeeRoot, layout.currentSyncCommitteeGindex, sha256)
  const execution = zeroExecutionPayload(42)
  const execFork = executionPayloadFork(common, slot)
  const execRoot = hashTreeRootExecutionPayloadHeader(execution, execFork, sha256)
  const bodyRoot = stateRootForMerkleLeaf(execRoot, layout.executionPayloadGindex, sha256)
  const header = capellaLightClientHeader(slot, stateRoot, bodyRoot, execution, common)
  const branch = ZERO_HASHES.slice(0, Math.floor(Math.log2(layout.currentSyncCommitteeGindex)))
  return {
    header,
    currentSyncCommittee: committee,
    currentSyncCommitteeBranch: branch,
  }
}

export function signAttestedHeader(
  header: LightClientHeader,
  signatureSlot: number,
  participantIndices: number[],
  secretKeys: Uint8Array[],
): SyncAggregate {
  const forkEpoch = Math.floor(Math.max(0, signatureSlot - 1) / 32)
  const forkVersion = testCommon.forkVersionAtEpoch(forkEpoch)
  const gvr = hexToBytes(testCommon.beaconLightClient()!.genesisValidatorsRoot)
  const domain = computeSyncCommitteeDomain(forkVersion, gvr, sha256)
  const signingRoot = computeSigningRoot(
    hashTreeRootBeaconBlockHeader(header.beacon, sha256),
    domain,
    sha256,
  )
  const signingMessage = blsLong.hash(signingRoot, ETH_BLS_DST)
  const sigBySecret = new Map<Uint8Array, Uint8Array>()
  const sigs = participantIndices.map((i) => {
    const sk = secretKeys[i]!
    let sig = sigBySecret.get(sk)
    if (sig === undefined) {
      sig = blsLong.sign(signingMessage, sk).toBytes()
      sigBySecret.set(sk, sig)
    }
    return sig
  })
  const signature = sigs.length === 1 ? sigs[0]! : blsLong.aggregateSignatures(sigs).toBytes()
  const bits = new Uint8Array(64)
  for (const i of participantIndices) {
    bits[i >> 3]! |= 1 << (i & 7)
  }
  return {
    syncCommitteeBits: bits,
    signature,
  }
}
