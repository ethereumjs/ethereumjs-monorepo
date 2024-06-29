import { bigIntToHex } from '@ethereumjs/util'

import type { ExecutionPayload } from './types.js'
import type { PrefixedHexString, VerkleExecutionWitness } from '@ethereumjs/util'

type BeaconWithdrawal = {
  index: PrefixedHexString
  validator_index: PrefixedHexString
  address: PrefixedHexString
  amount: PrefixedHexString
}

type BeaconDepositRequest = {
  pubkey: PrefixedHexString
  withdrawal_credentials: PrefixedHexString
  amount: PrefixedHexString
  signature: PrefixedHexString
  index: PrefixedHexString
}

type BeaconWithdrawalRequest = {
  source_address: PrefixedHexString
  validator_pubkey: PrefixedHexString
  amount: PrefixedHexString
}

type BeaconConsolidationRequest = {
  source_address: PrefixedHexString
  source_pubkey: PrefixedHexString
  target_pubkey: PrefixedHexString
}

// Payload json that one gets using the beacon apis
// curl localhost:5052/eth/v2/beacon/blocks/56610 | jq .data.message.body.execution_payload
export type BeaconPayloadJson = {
  parent_hash: PrefixedHexString
  fee_recipient: PrefixedHexString
  state_root: PrefixedHexString
  receipts_root: PrefixedHexString
  logs_bloom: PrefixedHexString
  prev_randao: PrefixedHexString
  block_number: PrefixedHexString
  gas_limit: PrefixedHexString
  gas_used: PrefixedHexString
  timestamp: PrefixedHexString
  extra_data: PrefixedHexString
  base_fee_per_gas: PrefixedHexString
  block_hash: PrefixedHexString
  transactions: PrefixedHexString[]
  withdrawals?: BeaconWithdrawal[]
  blob_gas_used?: PrefixedHexString
  excess_blob_gas?: PrefixedHexString
  parent_beacon_block_root?: PrefixedHexString
  // requests data
  deposit_requests?: BeaconDepositRequest[]
  withdrawal_requests?: BeaconWithdrawalRequest[]
  consolidation_requests?: BeaconConsolidationRequest[]

  // the casing of VerkleExecutionWitness remains same camel case for now
  execution_witness?: VerkleExecutionWitness
}

type VerkleProofSnakeJson = {
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

type VerkleStateDiffSnakeJson = {
  stem: PrefixedHexString
  suffix_diffs: {
    current_value: PrefixedHexString | null
    new_value: PrefixedHexString | null
    suffix: number | string
  }[]
}

type VerkleExecutionWitnessSnakeJson = {
  state_diff: VerkleStateDiffSnakeJson[]
  verkle_proof: VerkleProofSnakeJson
}

function parseExecutionWitnessFromSnakeJson({
  state_diff,
  verkle_proof,
}: VerkleExecutionWitnessSnakeJson): VerkleExecutionWitness {
  return {
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

  // requests
  if (payload.deposit_requests !== undefined && payload.deposit_requests !== null) {
    executionPayload.depositRequests = payload.deposit_requests.map((breq) => ({
      pubkey: breq.pubkey,
      withdrawalCredentials: breq.withdrawal_credentials,
      amount: breq.amount,
      signature: breq.signature,
      index: breq.index,
    }))
  }
  if (payload.withdrawal_requests !== undefined && payload.withdrawal_requests !== null) {
    executionPayload.withdrawalRequests = payload.withdrawal_requests.map((breq) => ({
      sourceAddress: breq.source_address,
      validatorPubkey: breq.validator_pubkey,
      amount: breq.amount,
    }))
  }
  if (payload.consolidation_requests !== undefined && payload.consolidation_requests !== null) {
    executionPayload.consolidationRequests = payload.consolidation_requests.map((breq) => ({
      sourceAddress: breq.source_address,
      sourcePubkey: breq.source_pubkey,
      targetPubkey: breq.target_pubkey,
    }))
  }

  if (payload.execution_witness !== undefined && payload.execution_witness !== null) {
    // the casing structure in payload could be camel case or snake depending upon the CL
    executionPayload.executionWitness =
      payload.execution_witness.verkleProof !== undefined
        ? payload.execution_witness
        : parseExecutionWitnessFromSnakeJson(
            payload.execution_witness as unknown as VerkleExecutionWitnessSnakeJson
          )
  }

  return executionPayload
}
