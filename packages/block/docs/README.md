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
| `blockHash` | `PrefixedHexString` |
| `blockNumber` | `PrefixedHexString` |
| `dataGasUsed?` | `PrefixedHexString` |
| `excessDataGas?` | `PrefixedHexString` |
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
