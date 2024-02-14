[@ethereumjs/vm](../README.md) / BlockBuilder

# Class: BlockBuilder

## Table of contents

### Constructors

- [constructor](BlockBuilder.md#constructor)

### Properties

- [blobGasUsed](BlockBuilder.md#blobgasused)
- [gasUsed](BlockBuilder.md#gasused)

### Accessors

- [minerValue](BlockBuilder.md#minervalue)
- [transactionReceipts](BlockBuilder.md#transactionreceipts)

### Methods

- [addTransaction](BlockBuilder.md#addtransaction)
- [build](BlockBuilder.md#build)
- [getStatus](BlockBuilder.md#getstatus)
- [initState](BlockBuilder.md#initstate)
- [logsBloom](BlockBuilder.md#logsbloom)
- [receiptTrie](BlockBuilder.md#receipttrie)
- [revert](BlockBuilder.md#revert)
- [transactionsTrie](BlockBuilder.md#transactionstrie)

## Constructors

### constructor

• **new BlockBuilder**(`vm`, `opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | [`VM`](VM.md) |
| `opts` | [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md) |

#### Defined in

[vm/src/buildBlock.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L75)

## Properties

### blobGasUsed

• **blobGasUsed**: `bigint` = `BIGINT_0`

The cumulative blob gas used by the blobs in a block

#### Defined in

[vm/src/buildBlock.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L51)

___

### gasUsed

• **gasUsed**: `bigint` = `BIGINT_0`

The cumulative gas used by the transactions added to the block.

#### Defined in

[vm/src/buildBlock.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L47)

## Accessors

### minerValue

• `get` **minerValue**(): `bigint`

#### Returns

`bigint`

#### Defined in

[vm/src/buildBlock.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L71)

___

### transactionReceipts

• `get` **transactionReceipts**(): [`TxReceipt`](../README.md#txreceipt)[]

#### Returns

[`TxReceipt`](../README.md#txreceipt)[]

#### Defined in

[vm/src/buildBlock.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L67)

## Methods

### addTransaction

▸ **addTransaction**(`tx`, `__namedParameters?`): `Promise`<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TypedTransaction` |
| `__namedParameters` | `Object` |
| `__namedParameters.skipHardForkValidation?` | `boolean` |

#### Returns

`Promise`<[`RunTxResult`](../interfaces/RunTxResult.md)\>

#### Defined in

[vm/src/buildBlock.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L202)

___

### build

▸ **build**(`sealOpts?`): `Promise`<`Block`\>

This method returns the finalized block.
It also:
 - Assigns the reward for miner (PoW)
 - Commits the checkpoint on the StateManager
 - Sets the tip of the VM's blockchain to this block
For PoW, optionally seals the block with params `nonce` and `mixHash`,
which is validated along with the block number and difficulty by ethash.
For PoA, please pass `blockOption.cliqueSigner` into the buildBlock constructor,
as the signer will be awarded the txs amount spent on gas as they are added.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sealOpts?` | [`SealBlockOpts`](../interfaces/SealBlockOpts.md) |

#### Returns

`Promise`<`Block`\>

#### Defined in

[vm/src/buildBlock.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L292)

___

### getStatus

▸ **getStatus**(): `BlockStatus`

#### Returns

`BlockStatus`

#### Defined in

[vm/src/buildBlock.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L127)

___

### initState

▸ **initState**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[vm/src/buildBlock.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L356)

___

### logsBloom

▸ **logsBloom**(): `Uint8Array`

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`

#### Defined in

[vm/src/buildBlock.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L141)

___

### receiptTrie

▸ **receiptTrie**(): `Promise`<`Uint8Array`\>

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[vm/src/buildBlock.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L153)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`<`void`\>

#### Defined in

[vm/src/buildBlock.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L273)

___

### transactionsTrie

▸ **transactionsTrie**(): `Promise`<`Uint8Array`\>

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[vm/src/buildBlock.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L134)
