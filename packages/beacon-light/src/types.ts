export type BeaconBlockHeader = {
  slot: number
  proposerIndex: number
  parentRoot: Uint8Array
  stateRoot: Uint8Array
  bodyRoot: Uint8Array
}

export type SyncCommittee = {
  publicKeys: Uint8Array[]
  aggregatePubkey: Uint8Array
}

export type SyncAggregate = {
  syncCommitteeBits: Uint8Array
  signature: Uint8Array
}

export type ExecutionPayloadHeaderSummary = {
  parentHash: Uint8Array
  feeRecipient: Uint8Array
  stateRoot: Uint8Array
  receiptsRoot: Uint8Array
  logsBloom: Uint8Array
  prevRandao: Uint8Array
  blockNumber: number
  gasLimit: number
  gasUsed: number
  timestamp: number
  extraData: Uint8Array
  baseFeePerGas: bigint
  blockHash: Uint8Array
  transactionsRoot: Uint8Array
  withdrawalsRoot: Uint8Array
  blobGasUsed?: number
  excessBlobGas?: number
}

export type LightClientHeader = {
  beacon: BeaconBlockHeader
  execution?: ExecutionPayloadHeaderSummary
  /** 32-byte `execution_block_hash` in Amsterdam / EIP-7732 ePBS light-client headers. */
  executionBlockHash?: Uint8Array
  executionBranch?: Uint8Array[]
}

export type LightClientBootstrap = {
  header: LightClientHeader
  currentSyncCommittee: SyncCommittee
  currentSyncCommitteeBranch: Uint8Array[]
}

export type LightClientUpdate = {
  attestedHeader: LightClientHeader
  nextSyncCommittee: SyncCommittee
  nextSyncCommitteeBranch: Uint8Array[]
  finalizedHeader: LightClientHeader
  finalityBranch: Uint8Array[]
  syncAggregate: SyncAggregate
  signatureSlot: number
}

export type LightClientFinalityUpdate = {
  attestedHeader: LightClientHeader
  finalizedHeader: LightClientHeader
  finalityBranch: Uint8Array[]
  syncAggregate: SyncAggregate
  signatureSlot: number
}

export type LightClientOptimisticUpdate = {
  attestedHeader: LightClientHeader
  syncAggregate: SyncAggregate
  signatureSlot: number
}

export type VerifiedExecutionHead = {
  slot: number
  beaconBlockRoot: Uint8Array
  blockNumber: number
  blockHash: Uint8Array
  stateRoot: Uint8Array
  parentHash: Uint8Array
  timestamp: number
  participantCount: number
}

export type ApplyUpdateResult = {
  periodAdvanced: boolean
  finalizedUpdated: boolean
  optimisticUpdated: boolean
}
