import { bigIntToHex } from '@ethereumjs/util'

import type { NumericString, PrefixedHexString, VerkleExecutionWitness } from '@ethereumjs/util'
import type { ExecutionPayload } from './types.ts'

type BeaconWithdrawal = {
  index: PrefixedHexString
  validator_index: PrefixedHexString
  address: PrefixedHexString
  amount: PrefixedHexString
}

// Payload JSON that one gets using the beacon apis
// curl localhost:5052/eth/v2/beacon/blocks/56610 | jq .data.message.body.execution_payload
export type BeaconPayloadJSON = {
  parent_hash: PrefixedHexString
  fee_recipient: PrefixedHexString
  state_root: PrefixedHexString
  receipts_root: PrefixedHexString
  logs_bloom: PrefixedHexString
  prev_randao: PrefixedHexString
  block_number: NumericString
  gas_limit: NumericString
  gas_used: NumericString
  timestamp: NumericString
  extra_data: PrefixedHexString
  base_fee_per_gas: NumericString
  block_hash: PrefixedHexString
  transactions: PrefixedHexString[]
  withdrawals?: BeaconWithdrawal[]
  blob_gas_used?: NumericString
  excess_blob_gas?: NumericString
  parent_beacon_block_root?: PrefixedHexString
  requests_hash?: PrefixedHexString
  // the casing of VerkleExecutionWitness remains same camel case for now
  execution_witness?: VerkleExecutionWitness
}

type VerkleProofSnakeJSON = {
  commitments_by_path: PrefixedHexString[]
  d: PrefixedHexString
  depth_extension_present: PrefixedHexString
  ipa_proof: {
    cl: PrefixedHexString[]
    cr: PrefixedHexString[]
    final_evaluation: PrefixedHexString
  }
  other_stems: PrefixedHexString[]
}

type VerkleStateDiffSnakeJSON = {
  stem: PrefixedHexString
  suffix_diffs: {
    current_value: PrefixedHexString | null
    new_value: PrefixedHexString | null
    suffix: number | string
  }[]
}

type VerkleExecutionWitnessSnakeJSON = {
  parent_state_root: PrefixedHexString
  state_diff: VerkleStateDiffSnakeJSON[]
  verkle_proof: VerkleProofSnakeJSON
}

function parseExecutionWitnessFromSnakeJSON({
  parent_state_root,
  state_diff,
  verkle_proof,
}: VerkleExecutionWitnessSnakeJSON): VerkleExecutionWitness {
  return {
    parentStateRoot: parent_state_root,
    stateDiff: state_diff.map(({ stem, suffix_diffs }) => ({
      stem,
      suffixDiffs: suffix_diffs.map(({ current_value, new_value, suffix }) => ({
        currentValue: current_value,
        newValue: new_value,
        suffix,
      })),
    })),
    verkleProof: {
      commitmentsByPath: verkle_proof.commitments_by_path,
      d: verkle_proof.d,
      depthExtensionPresent: verkle_proof.depth_extension_present,
      ipaProof: {
        cl: verkle_proof.ipa_proof.cl,
        cr: verkle_proof.ipa_proof.cr,
        finalEvaluation: verkle_proof.ipa_proof.final_evaluation,
      },
      otherStems: verkle_proof.other_stems,
    },
  }
}

/**
 * Converts a beacon block execution payload JSON object {@link BeaconPayloadJSON} to the {@link ExecutionPayload} data needed to construct a {@link Block}.
 * The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`
 */
export function executionPayloadFromBeaconPayload(payload: BeaconPayloadJSON): ExecutionPayload {
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
  if (payload.requests_hash !== undefined && payload.requests_hash !== null) {
    executionPayload.requestsHash = payload.requests_hash
  }

  if (payload.execution_witness !== undefined && payload.execution_witness !== null) {
    // the casing structure in payload could be camel case or snake depending upon the CL
    executionPayload.executionWitness =
      payload.execution_witness.verkleProof !== undefined
        ? payload.execution_witness
        : parseExecutionWitnessFromSnakeJSON(
            payload.execution_witness as unknown as VerkleExecutionWitnessSnakeJSON,
          )
  }

  return executionPayload
}
