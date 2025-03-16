import { validators } from '../../validation.ts'

export const executionPayloadV1FieldValidators = {
  parentHash: validators.blockHash,
  feeRecipient: validators.address,
  stateRoot: validators.bytes32,
  receiptsRoot: validators.bytes32,
  logsBloom: validators.bytes256,
  prevRandao: validators.bytes32,
  blockNumber: validators.uint64,
  gasLimit: validators.uint64,
  gasUsed: validators.uint64,
  timestamp: validators.uint64,
  extraData: validators.variableBytes32,
  baseFeePerGas: validators.uint256,
  blockHash: validators.blockHash,
  transactions: validators.array(validators.hex),
}
export const executionPayloadV2FieldValidators = {
  ...executionPayloadV1FieldValidators,
  withdrawals: validators.array(validators.withdrawal()),
}
export const executionPayloadV3FieldValidators = {
  ...executionPayloadV2FieldValidators,
  blobGasUsed: validators.uint64,
  excessBlobGas: validators.uint64,
}

export const forkchoiceFieldValidators = {
  headBlockHash: validators.blockHash,
  safeBlockHash: validators.blockHash,
  finalizedBlockHash: validators.blockHash,
}

export const payloadAttributesFieldValidatorsV1 = {
  timestamp: validators.uint64,
  prevRandao: validators.bytes32,
  suggestedFeeRecipient: validators.address,
}
export const payloadAttributesFieldValidatorsV2 = {
  ...payloadAttributesFieldValidatorsV1,
  // withdrawals is optional in V2 because its backward forward compatible with V1
  withdrawals: validators.optional(validators.array(validators.withdrawal())),
}
export const payloadAttributesFieldValidatorsV3 = {
  ...payloadAttributesFieldValidatorsV1,
  withdrawals: validators.array(validators.withdrawal()),
  parentBeaconBlockRoot: validators.bytes32,
}
