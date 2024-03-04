import { UNKNOWN_PAYLOAD } from '../../error-code'

import type { Skeleton } from '../../../service'
import type { Block, ExecutionPayload } from '@ethereumjs/block'

export enum Status {
  ACCEPTED = 'ACCEPTED',
  INVALID = 'INVALID',
  INVALID_BLOCK_HASH = 'INVALID_BLOCK_HASH',
  SYNCING = 'SYNCING',
  VALID = 'VALID',
}

export type Bytes8 = string
export type Bytes20 = string
export type Bytes32 = string
// type Root = Bytes32
export type Blob = Bytes32
export type Bytes48 = string
export type Uint64 = string
export type Uint256 = string

type WithdrawalV1 = Exclude<ExecutionPayload['withdrawals'], undefined>[number]

// ExecutionPayload has higher version fields as optionals to make it easy for typescript
export type ExecutionPayloadV1 = ExecutionPayload
export type ExecutionPayloadV2 = ExecutionPayloadV1 & { withdrawals: WithdrawalV1[] }
// parentBeaconBlockRoot comes separate in new payloads and needs to be added to payload data
export type ExecutionPayloadV3 = ExecutionPayloadV2 & { excessBlobGas: Uint64; blobGasUsed: Uint64 }

export type ForkchoiceStateV1 = {
  headBlockHash: Bytes32
  safeBlockHash: Bytes32
  finalizedBlockHash: Bytes32
}

// PayloadAttributes has higher version fields as optionals to make it easy for typescript
export type PayloadAttributes = {
  timestamp: Uint64
  prevRandao: Bytes32
  suggestedFeeRecipient: Bytes20
  // add higher version fields as optionals to make it easy for typescript
  withdrawals?: WithdrawalV1[]
  parentBeaconBlockRoot?: Bytes32
}

export type PayloadAttributesV1 = Omit<PayloadAttributes, 'withdrawals' | 'parentBeaconBlockRoot'>
export type PayloadAttributesV2 = PayloadAttributesV1 & { withdrawals: WithdrawalV1[] }
export type PayloadAttributesV3 = PayloadAttributesV2 & { parentBeaconBlockRoot: Bytes32 }

export type PayloadStatusV1 = {
  status: Status
  latestValidHash: Bytes32 | null
  validationError: string | null
}

export type ForkchoiceResponseV1 = {
  payloadStatus: PayloadStatusV1
  payloadId: Bytes8 | null
}

export type TransitionConfigurationV1 = {
  terminalTotalDifficulty: Uint256
  terminalBlockHash: Bytes32
  terminalBlockNumber: Uint64
}

export type BlobsBundleV1 = {
  commitments: Bytes48[]
  blobs: Blob[]
  proofs: Bytes48[]
}

export type ExecutionPayloadBodyV1 = {
  transactions: string[]
  withdrawals: WithdrawalV1[] | null
}

export type ChainCache = {
  remoteBlocks: Map<String, Block>
  executedBlocks: Map<String, Block>
  invalidBlocks: Map<String, Error>
  skeleton: Skeleton
}

export const EngineError = {
  UnknownPayload: {
    code: UNKNOWN_PAYLOAD,
    message: 'Unknown payload',
  },
}
