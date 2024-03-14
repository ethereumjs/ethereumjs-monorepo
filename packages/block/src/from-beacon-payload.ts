import { bigIntToHex } from '@ethereumjs/util'

import type { ExecutionPayload, VerkleExecutionWitness } from './types.js'

type BeaconWithdrawal = {
  index: string
  validator_index: string
  address: string
  amount: string
}

// Payload json that one gets using the beacon apis
// curl localhost:5052/eth/v2/beacon/blocks/56610 | jq .data.message.body.execution_payload
export type BeaconPayloadJson = {
  parent_hash: string
  fee_recipient: string
  state_root: string
  receipts_root: string
  logs_bloom: string
  prev_randao: string
  block_number: string
  gas_limit: string
  gas_used: string
  timestamp: string
  extra_data: string
  base_fee_per_gas: string
  block_hash: string
  transactions: string[]
  withdrawals?: BeaconWithdrawal[]
  blob_gas_used?: string
  excess_blob_gas?: string
  parent_beacon_block_root?: string
  // the casing of VerkleExecutionWitness remains same camel case for now
  execution_witness?: VerkleExecutionWitness
}

/**
 * Converts a beacon block execution payload JSON object {@link BeaconPayloadJson} to the {@link ExecutionPayload} data needed to construct a {@link Block}.
 * The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`
 */
export function executionPayloadFromBeaconPayload(payload: BeaconPayloadJson): ExecutionPayload {
  const executionPayload: ExecutionPayload = {
    parentHash: payload.parent_hash,
    feeRecipient: payload.fee_recipient,
    stateRoot: payload.state_root,
    receiptsRoot: payload.receipts_root,
    logsBloom: payload.logs_bloom,
    prevRandao: payload.prev_randao,
    blockNumber: bigIntToHex(BigInt(payload.block_number)),
    gasLimit: bigIntToHex(BigInt(payload.gas_limit)),
    gasUsed: bigIntToHex(BigInt(payload.gas_used)),
    timestamp: bigIntToHex(BigInt(payload.timestamp)),
    extraData: payload.extra_data,
    baseFeePerGas: bigIntToHex(BigInt(payload.base_fee_per_gas)),
    blockHash: payload.block_hash,
    transactions: payload.transactions,
  }

  if (payload.withdrawals !== undefined && payload.withdrawals !== null) {
    executionPayload.withdrawals = payload.withdrawals.map((wd) => ({
      index: bigIntToHex(BigInt(wd.index)),
      validatorIndex: bigIntToHex(BigInt(wd.validator_index)),
      address: wd.address,
      amount: bigIntToHex(BigInt(wd.amount)),
    }))
  }

  if (payload.blob_gas_used !== undefined && payload.blob_gas_used !== null) {
    executionPayload.blobGasUsed = bigIntToHex(BigInt(payload.blob_gas_used))
  }
  if (payload.excess_blob_gas !== undefined && payload.excess_blob_gas !== null) {
    executionPayload.excessBlobGas = bigIntToHex(BigInt(payload.excess_blob_gas))
  }
  if (payload.parent_beacon_block_root !== undefined && payload.parent_beacon_block_root !== null) {
    executionPayload.parentBeaconBlockRoot = payload.parent_beacon_block_root
  }
  if (payload.execution_witness !== undefined && payload.execution_witness !== null) {
    // the casing structure in payload is already camel case, might be updated in
    // kaustinen relaunch
    executionPayload.executionWitness = payload.execution_witness
  }

  return executionPayload
}
