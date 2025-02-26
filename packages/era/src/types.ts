import * as ssz from 'micro-eth-signer/ssz'

export type e2StoreEntry = {
  type: Uint8Array
  data: Uint8Array
}

/** Era 1 Type Identifiers */
export const Era1Types = {
  Version: new Uint8Array([0x65, 0x32]),
  CompressedHeader: new Uint8Array([0x03, 0x00]),
  CompressedBody: new Uint8Array([0x04, 0x00]),
  CompressedReceipts: new Uint8Array([0x05, 0x00]),
  TotalDifficulty: new Uint8Array([0x06, 0x00]),
  AccumulatorRoot: new Uint8Array([0x07, 0x00]),
  BlockIndex: new Uint8Array([0x66, 0x32]),
} as const

export const VERSION = {
  type: Era1Types.Version,
  data: new Uint8Array([]),
}

/** Era1 SSZ containers */
export const HeaderRecord = ssz.container({
  blockHash: ssz.bytevector(32),
  totalDifficulty: ssz.uint256,
})

export const EpochAccumulator = ssz.list(8192, HeaderRecord)

/** Era Type Identifiers */
export const EraTypes = {
  CompressedSignedBeaconBlockType: new Uint8Array([0x01, 0x00]),
  CompressedBeaconState: new Uint8Array([0x02, 0x00]),
  Empty: new Uint8Array([0x00, 0x00]),
  SlotIndex: new Uint8Array([0x69, 0x32]),
}

export type SlotIndex = {
  startSlot: number
  recordStart: number
  slotOffsets: number[]
}

/** Consensus Layer Constants */
export enum ForkSlots {
  Phase0 = 0,
  Altair = 2375680,
  Bellatrix = 4700013,
  Capella = 6209536,
  Deneb = 8626176,
}

const SLOTS_PER_HISTORICAL_ROOT = 8192
const HISTORICAL_ROOTS_LIMIT = 16777216
const SLOTS_PER_EPOCH = 32
const VALIDATOR_REGISTRY_LIMIT = 1099511627776
const EPOCHS_PER_HISTORICAL_VECTOR = 65536
const EPOCHS_PER_ETH1_VOTING_PERIOD = 64
const EPOCHS_PER_SLASHINGS_VECTOR = 8192
const JUSTIFICATION_BITS_LENGTH = 4
const BYTES_PER_LOGS_BLOOM = 256
const MAX_EXTRA_DATA_BYTES = 32

export const CapellaExecutionPayloadHeader = ssz.container({
  parent_hash: ssz.ETH2_TYPES.Hash32,
  fee_recipient: ssz.ETH2_TYPES.ExecutionAddress,
  state_root: ssz.ETH2_TYPES.Bytes32,
  receipts_root: ssz.ETH2_TYPES.Bytes32,
  logs_bloom: ssz.bytevector(BYTES_PER_LOGS_BLOOM),
  prev_randao: ssz.ETH2_TYPES.Bytes32,
  block_number: ssz.uint64,
  gas_limit: ssz.uint64,
  gas_used: ssz.uint64,
  timestamp: ssz.uint64,
  extra_data: ssz.bytelist(MAX_EXTRA_DATA_BYTES),
  base_fee_per_gas: ssz.uint256,
  block_hash: ssz.ETH2_TYPES.Hash32,
  transactions_root: ssz.ETH2_TYPES.Root,
  withdrawals_root: ssz.ETH2_TYPES.Root,
})

export const BellatrixExecutionPayloadHeader = ssz.container({
  parent_hash: ssz.ETH2_TYPES.Hash32,
  fee_recipient: ssz.ETH2_TYPES.ExecutionAddress,
  state_root: ssz.ETH2_TYPES.Bytes32,
  receipts_root: ssz.ETH2_TYPES.Bytes32,
  logs_bloom: ssz.bytevector(BYTES_PER_LOGS_BLOOM),
  prev_randao: ssz.ETH2_TYPES.Bytes32,
  block_number: ssz.uint64,
  gas_limit: ssz.uint64,
  gas_used: ssz.uint64,
  timestamp: ssz.uint64,
  extra_data: ssz.bytelist(MAX_EXTRA_DATA_BYTES),
  base_fee_per_gas: ssz.uint256,
  block_hash: ssz.ETH2_TYPES.Hash32,
  transactions_root: ssz.ETH2_TYPES.Root,
})

export const CapellaBeaconState = ssz.container({
  genesis_time: ssz.uint64,
  genesis_validators_root: ssz.ETH2_TYPES.Root,
  slot: ssz.ETH2_TYPES.Slot,
  fork: ssz.ETH2_TYPES.Fork,
  latest_block_header: ssz.ETH2_TYPES.BeaconBlockHeader,
  block_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  state_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  historical_roots: ssz.list(HISTORICAL_ROOTS_LIMIT, ssz.ETH2_TYPES.Root),
  eth1_data: ssz.ETH2_TYPES.Eth1Data,
  eth1_data_votes: ssz.list(
    EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH,
    ssz.ETH2_TYPES.Eth1Data,
  ),
  eth1_deposit_index: ssz.uint64,
  validators: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Validator),
  balances: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Gwei),
  randao_mixes: ssz.vector(EPOCHS_PER_HISTORICAL_VECTOR, ssz.ETH2_TYPES.Bytes32),
  slashings: ssz.vector(EPOCHS_PER_SLASHINGS_VECTOR, ssz.ETH2_TYPES.Gwei),
  previous_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  current_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  justification_bits: ssz.bitvector(JUSTIFICATION_BITS_LENGTH),
  previous_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  current_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  finalized_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  inactivity_scores: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.uint64),
  current_sync_committee: ssz.ETH2_TYPES.SyncCommittee,
  next_sync_committee: ssz.ETH2_TYPES.SyncCommittee,
  latest_execution_payload_header: CapellaExecutionPayloadHeader,
  next_withdrawal_index: ssz.uint64,
  next_withdrawal_validator_index: ssz.uint64,
  historical_summaries: ssz.list(HISTORICAL_ROOTS_LIMIT, ssz.ETH2_TYPES.HistoricalSummary),
})

export const BellatrixBeaconState = ssz.container({
  genesis_time: ssz.uint64,
  genesis_validators_root: ssz.ETH2_TYPES.Root,
  slot: ssz.ETH2_TYPES.Slot,
  fork: ssz.ETH2_TYPES.Fork,
  latest_block_header: ssz.ETH2_TYPES.BeaconBlockHeader,
  block_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  state_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  historical_roots: ssz.list(HISTORICAL_ROOTS_LIMIT, ssz.ETH2_TYPES.Root),
  eth1_data: ssz.ETH2_TYPES.Eth1Data,
  eth1_data_votes: ssz.list(
    EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH,
    ssz.ETH2_TYPES.Eth1Data,
  ),
  eth1_deposit_index: ssz.uint64,
  validators: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Validator),
  balances: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Gwei),
  randao_mixes: ssz.vector(EPOCHS_PER_HISTORICAL_VECTOR, ssz.ETH2_TYPES.Bytes32),
  slashings: ssz.vector(EPOCHS_PER_SLASHINGS_VECTOR, ssz.ETH2_TYPES.Gwei),
  previous_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  current_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  justification_bits: ssz.bitvector(JUSTIFICATION_BITS_LENGTH),
  previous_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  current_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  finalized_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  inactivity_scores: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.uint64),
  current_sync_committee: ssz.ETH2_TYPES.SyncCommittee,
  next_sync_committee: ssz.ETH2_TYPES.SyncCommittee,
  latest_execution_payload_header: BellatrixExecutionPayloadHeader,
})

export const AltairBeaconState = ssz.container({
  genesis_time: ssz.uint64,
  genesis_validators_root: ssz.ETH2_TYPES.Root,
  slot: ssz.ETH2_TYPES.Slot,
  fork: ssz.ETH2_TYPES.Fork,
  latest_block_header: ssz.ETH2_TYPES.BeaconBlockHeader,
  block_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  state_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  historical_roots: ssz.list(HISTORICAL_ROOTS_LIMIT, ssz.ETH2_TYPES.Root),
  eth1_data: ssz.ETH2_TYPES.Eth1Data,
  eth1_data_votes: ssz.list(
    EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH,
    ssz.ETH2_TYPES.Eth1Data,
  ),
  eth1_deposit_index: ssz.uint64,
  validators: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Validator),
  balances: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Gwei),
  randao_mixes: ssz.vector(EPOCHS_PER_HISTORICAL_VECTOR, ssz.ETH2_TYPES.Bytes32),
  slashings: ssz.vector(EPOCHS_PER_SLASHINGS_VECTOR, ssz.ETH2_TYPES.Gwei),
  previous_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  current_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  justification_bits: ssz.bitvector(JUSTIFICATION_BITS_LENGTH),
  previous_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  current_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  finalized_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  inactivity_scores: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.uint64),
  current_sync_committee: ssz.ETH2_TYPES.SyncCommittee,
  next_sync_committee: ssz.ETH2_TYPES.SyncCommittee,
})

export const Phase0BeaconState = ssz.container({
  genesis_time: ssz.uint64,
  genesis_validators_root: ssz.ETH2_TYPES.Root,
  slot: ssz.ETH2_TYPES.Slot,
  fork: ssz.ETH2_TYPES.Fork,
  latest_block_header: ssz.ETH2_TYPES.BeaconBlockHeader,
  block_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  state_roots: ssz.vector(SLOTS_PER_HISTORICAL_ROOT, ssz.ETH2_TYPES.Root),
  historical_roots: ssz.list(HISTORICAL_ROOTS_LIMIT, ssz.ETH2_TYPES.Root),
  eth1_data: ssz.ETH2_TYPES.Eth1Data,
  eth1_data_votes: ssz.list(
    EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH,
    ssz.ETH2_TYPES.Eth1Data,
  ),
  eth1_deposit_index: ssz.uint64,
  validators: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Validator),
  balances: ssz.list(VALIDATOR_REGISTRY_LIMIT, ssz.ETH2_TYPES.Gwei),
  randao_mixes: ssz.vector(EPOCHS_PER_HISTORICAL_VECTOR, ssz.ETH2_TYPES.Bytes32),
  slashings: ssz.vector(EPOCHS_PER_SLASHINGS_VECTOR, ssz.ETH2_TYPES.Gwei),
  previous_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  current_epoch_participation: ssz.list(
    VALIDATOR_REGISTRY_LIMIT,
    ssz.ETH2_TYPES.ParticipationFlags,
  ),
  justification_bits: ssz.bitvector(JUSTIFICATION_BITS_LENGTH),
  previous_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  current_justified_checkpoint: ssz.ETH2_TYPES.Checkpoint,
  finalized_checkpoint: ssz.ETH2_TYPES.Checkpoint,
})
