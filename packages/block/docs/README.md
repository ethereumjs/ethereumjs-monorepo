@ethereumjs/block

# @ethereumjs/block

## Table of contents

### Classes

- [Block](classes/Block.md)
- [BlockHeader](classes/BlockHeader.md)

### Interfaces

- [BlockData](interfaces/BlockData.md)
- [BlockOptions](interfaces/BlockOptions.md)
- [HeaderData](interfaces/HeaderData.md)
- [JsonBlock](interfaces/JsonBlock.md)
- [JsonHeader](interfaces/JsonHeader.md)
- [JsonRpcBlock](interfaces/JsonRpcBlock.md)
- [VerkleExecutionWitness](interfaces/VerkleExecutionWitness.md)
- [VerkleProof](interfaces/VerkleProof.md)
- [VerkleStateDiff](interfaces/VerkleStateDiff.md)

### Type Aliases

- [BlockBodyBytes](README.md#blockbodybytes)
- [BlockBytes](README.md#blockbytes)
- [BlockHeaderBytes](README.md#blockheaderbytes)
- [ExecutionPayload](README.md#executionpayload)
- [ExecutionWitnessBytes](README.md#executionwitnessbytes)
- [TransactionsBytes](README.md#transactionsbytes)
- [UncleHeadersBytes](README.md#uncleheadersbytes)
- [WithdrawalV1](README.md#withdrawalv1)
- [WithdrawalsBytes](README.md#withdrawalsbytes)

### Functions

- [executionPayloadFromBeaconPayload](README.md#executionpayloadfrombeaconpayload)

## Type Aliases

### BlockBodyBytes

Ƭ **BlockBodyBytes**: [[`TransactionsBytes`](README.md#transactionsbytes), [`UncleHeadersBytes`](README.md#uncleheadersbytes), WithdrawalsBytes?]

#### Defined in

[types.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L174)

___

### BlockBytes

Ƭ **BlockBytes**: [[`BlockHeaderBytes`](README.md#blockheaderbytes), [`TransactionsBytes`](README.md#transactionsbytes), [`UncleHeadersBytes`](README.md#uncleheadersbytes)] \| [[`BlockHeaderBytes`](README.md#blockheaderbytes), [`TransactionsBytes`](README.md#transactionsbytes), [`UncleHeadersBytes`](README.md#uncleheadersbytes), [`WithdrawalsBytes`](README.md#withdrawalsbytes)] \| [[`BlockHeaderBytes`](README.md#blockheaderbytes), [`TransactionsBytes`](README.md#transactionsbytes), [`UncleHeadersBytes`](README.md#uncleheadersbytes), [`WithdrawalsBytes`](README.md#withdrawalsbytes), [`ExecutionWitnessBytes`](README.md#executionwitnessbytes)]

#### Defined in

[types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L159)

___

### BlockHeaderBytes

Ƭ **BlockHeaderBytes**: `Uint8Array`[]

BlockHeaderBuffer is a Buffer array, except for the Verkle PreState which is an array of prestate arrays.

#### Defined in

[types.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L173)

___

### ExecutionPayload

Ƭ **ExecutionPayload**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `baseFeePerGas` | `PrefixedHexString` |
| `blobGasUsed?` | `PrefixedHexString` |
| `blockHash` | `PrefixedHexString` |
| `blockNumber` | `PrefixedHexString` |
| `excessBlobGas?` | `PrefixedHexString` |
| `executionWitness?` | [`VerkleExecutionWitness`](interfaces/VerkleExecutionWitness.md) \| ``null`` |
| `extraData` | `PrefixedHexString` |
| `feeRecipient` | `PrefixedHexString` |
| `gasLimit` | `PrefixedHexString` |
| `gasUsed` | `PrefixedHexString` |
| `logsBloom` | `PrefixedHexString` |
| `parentBeaconBlockRoot?` | `PrefixedHexString` |
| `parentHash` | `PrefixedHexString` |
| `prevRandao` | `PrefixedHexString` |
| `receiptsRoot` | `PrefixedHexString` |
| `stateRoot` | `PrefixedHexString` |
| `timestamp` | `PrefixedHexString` |
| `transactions` | `PrefixedHexString`[] |
| `withdrawals?` | [`WithdrawalV1`](README.md#withdrawalv1)[] |

#### Defined in

[types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L263)

___

### ExecutionWitnessBytes

Ƭ **ExecutionWitnessBytes**: `Uint8Array`

#### Defined in

[types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L157)

___

### TransactionsBytes

Ƭ **TransactionsBytes**: `Uint8Array`[][] \| `Uint8Array`[]

TransactionsBytes can be an array of serialized txs for Typed Transactions or an array of Uint8Array Arrays for legacy transactions.

#### Defined in

[types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L178)

___

### UncleHeadersBytes

Ƭ **UncleHeadersBytes**: `Uint8Array`[][]

#### Defined in

[types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L179)

___

### WithdrawalV1

Ƭ **WithdrawalV1**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `PrefixedHexString` |
| `amount` | `PrefixedHexString` |
| `index` | `PrefixedHexString` |
| `validatorIndex` | `PrefixedHexString` |

#### Defined in

[types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L255)

___

### WithdrawalsBytes

Ƭ **WithdrawalsBytes**: `WithdrawalBytes`[]

#### Defined in

[types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L156)

## Functions

### executionPayloadFromBeaconPayload

▸ **executionPayloadFromBeaconPayload**(`payload`): [`ExecutionPayload`](README.md#executionpayload)

Converts a beacon block execution payload JSON object BeaconPayloadJson to the [ExecutionPayload](README.md#executionpayload) data needed to construct a [Block](classes/Block.md).
The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `BeaconPayloadJson` |

#### Returns

[`ExecutionPayload`](README.md#executionpayload)

#### Defined in

[from-beacon-payload.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/from-beacon-payload.ts#L41)
