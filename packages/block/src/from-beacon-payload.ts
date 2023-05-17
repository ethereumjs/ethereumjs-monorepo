import { bigIntToHex } from '@ethereumjs/util'

import type { ExecutionPayload } from './types'

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
  excess_data_gas?: string
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
    extraData: bigIntToHex(BigInt(payload.extra_data)),
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

  if (payload.excess_data_gas !== undefined && payload.excess_data_gas !== null) {
    executionPayload.excessDataGas = bigIntToHex(BigInt(payload.excess_data_gas))
  }

  return executionPayload
}
