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

### Type Aliases

- [BlockBodyBytes](README.md#blockbodybytes)
- [BlockBytes](README.md#blockbytes)
- [BlockHeaderBytes](README.md#blockheaderbytes)
- [ExecutionPayload](README.md#executionpayload)
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

[types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L119)

___

### BlockBytes

Ƭ **BlockBytes**: [[`BlockHeaderBytes`](README.md#blockheaderbytes), [`TransactionsBytes`](README.md#transactionsbytes), [`UncleHeadersBytes`](README.md#uncleheadersbytes)] \| [[`BlockHeaderBytes`](README.md#blockheaderbytes), [`TransactionsBytes`](README.md#transactionsbytes), [`UncleHeadersBytes`](README.md#uncleheadersbytes), [`WithdrawalsBytes`](README.md#withdrawalsbytes)]

#### Defined in

[types.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L115)

___

### BlockHeaderBytes

Ƭ **BlockHeaderBytes**: `Uint8Array`[]

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L118)

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

[types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L206)

___

### TransactionsBytes

Ƭ **TransactionsBytes**: `Uint8Array`[][] \| `Uint8Array`[]

TransactionsBytes can be an array of serialized txs for Typed Transactions or an array of Uint8Array Arrays for legacy transactions.

#### Defined in

[types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L123)

___

### UncleHeadersBytes

Ƭ **UncleHeadersBytes**: `Uint8Array`[][]

#### Defined in

[types.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L124)

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

[types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L198)

___

### WithdrawalsBytes

Ƭ **WithdrawalsBytes**: `WithdrawalBytes`[]

#### Defined in

[types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L113)

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

[from-beacon-payload.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/from-beacon-payload.ts#L39)
