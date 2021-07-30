[@ethereumjs/vm](../README.md) / [buildBlock](../modules/buildblock.md) / BlockBuilder

# Class: BlockBuilder

[buildBlock](../modules/buildblock.md).BlockBuilder

## Table of contents

### Constructors

- [constructor](buildblock.blockbuilder.md#constructor)

### Properties

- [gasUsed](buildblock.blockbuilder.md#gasused)

### Methods

- [addTransaction](buildblock.blockbuilder.md#addtransaction)
- [build](buildblock.blockbuilder.md#build)
- [revert](buildblock.blockbuilder.md#revert)

## Constructors

### constructor

• **new BlockBuilder**(`vm`, `opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | [default](index.default.md) |
| `opts` | [BuildBlockOpts](../interfaces/buildblock.buildblockopts.md) |

#### Defined in

[buildBlock.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L62)

## Properties

### gasUsed

• **gasUsed**: `BN`

The cumulative gas used by the transactions added to the block.

#### Defined in

[buildBlock.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L53)

## Methods

### addTransaction

▸ **addTransaction**(`tx`): `Promise`<[RunTxResult](../interfaces/runtx.runtxresult.md)\>

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TypedTransaction` |

#### Returns

`Promise`<[RunTxResult](../interfaces/runtx.runtxresult.md)\>

#### Defined in

[buildBlock.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L148)

___

### build

▸ **build**(`sealOpts?`): `Promise`<Block\>

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
| `sealOpts?` | [SealBlockOpts](../interfaces/buildblock.sealblockopts.md) |

#### Returns

`Promise`<Block\>

#### Defined in

[buildBlock.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L202)

___

### revert

▸ **revert**(): `Promise`<void\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`<void\>

#### Defined in

[buildBlock.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L183)
