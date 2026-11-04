export {
  BeaconLightClient,
  createBeaconLightClient,
  emptyLightClientHeader,
  emptySyncCommittee,
  stateRootForMerkleLeaf,
} from './client.ts'
export type { ApplyContext, BeaconLightClientOpts } from './client.ts'
export { verifySyncCommitteeSignature } from './bls.ts'
export type { VerifySyncCommitteeSignatureOpts, VerifySyncCommitteeSignatureResult } from './bls.ts'
export { computeSigningRoot, computeSyncCommitteeDomain, DOMAIN_SYNC_COMMITTEE } from './domain.ts'
export {
  gindexToMerklePosition,
  isValidMerkleBranch,
  isValidNormalizedMerkleBranch,
  merkleRootFromZeroBranch,
  normalizeMerkleBranch,
  ZERO_HASHES,
} from './merkle.ts'
export {
  EXECUTION_PAYLOAD_GINDEX,
  capellaActivationEpoch,
  epochAtSlot,
  proofLayoutAtEpoch,
} from './proofLayout.ts'
export type { ProofLayout } from './proofLayout.ts'
export {
  hashTreeRootBeaconBlockHeader,
  hashTreeRootExecutionPayloadHeader,
  hashTreeRootSyncCommittee,
} from './ssz.ts'
export type { Sha256Fn } from './ssz.ts'
export type {
  ApplyUpdateResult,
  BeaconBlockHeader,
  ExecutionPayloadHeaderSummary,
  LightClientBootstrap,
  LightClientFinalityUpdate,
  LightClientHeader,
  LightClientOptimisticUpdate,
  LightClientUpdate,
  SyncAggregate,
  SyncCommittee,
  VerifiedExecutionHead,
} from './types.ts'
