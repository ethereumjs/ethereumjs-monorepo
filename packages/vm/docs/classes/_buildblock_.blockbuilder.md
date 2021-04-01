[@ethereumjs/vm](../README.md) › ["buildBlock"](../modules/_buildblock_.md) › [BlockBuilder](_buildblock_.blockbuilder.md)

# Class: BlockBuilder

## Hierarchy

* **BlockBuilder**

## Index

### Constructors

* [constructor](_buildblock_.blockbuilder.md#constructor)

### Properties

* [gasUsed](_buildblock_.blockbuilder.md#gasused)

### Methods

* [addTransaction](_buildblock_.blockbuilder.md#addtransaction)
* [build](_buildblock_.blockbuilder.md#build)
* [revert](_buildblock_.blockbuilder.md#revert)

## Constructors

###  constructor

\+ **new BlockBuilder**(`vm`: [VM](_index_.vm.md), `opts`: [BuildBlockOpts](../interfaces/_buildblock_.buildblockopts.md)): *[BlockBuilder](_buildblock_.blockbuilder.md)*

*Defined in [buildBlock.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`vm` | [VM](_index_.vm.md) |
`opts` | [BuildBlockOpts](../interfaces/_buildblock_.buildblockopts.md) |

**Returns:** *[BlockBuilder](_buildblock_.blockbuilder.md)*

## Properties

###  gasUsed

• **gasUsed**: *BN‹›* = new BN(0)

*Defined in [buildBlock.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L53)*

The cumulative gas used by the transactions added to the block.

## Methods

###  addTransaction

▸ **addTransaction**(`tx`: TypedTransaction): *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*

*Defined in [buildBlock.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L144)*

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

**Parameters:**

Name | Type |
------ | ------ |
`tx` | TypedTransaction |

**Returns:** *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*

___

###  build

▸ **build**(`sealOpts?`: [SealBlockOpts](../interfaces/_buildblock_.sealblockopts.md)): *Promise‹Block‹››*

*Defined in [buildBlock.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L194)*

This method returns the finalized block.
It also:
 - Assigns the reward for miner (PoW)
 - Commits the checkpoint on the StateManager
 - Sets the tip of the VM's blockchain to this block
For PoW, optionally seals the block with params `nonce` and `mixHash`,
which is validated along with the block number and difficulty by ethash.
For PoA, please pass `blockOption.cliqueSigner` into the buildBlock constructor,
as the signer will be awarded the txs amount spent on gas as they are added.

**Parameters:**

Name | Type |
------ | ------ |
`sealOpts?` | [SealBlockOpts](../interfaces/_buildblock_.sealblockopts.md) |

**Returns:** *Promise‹Block‹››*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Defined in [buildBlock.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/buildBlock.ts#L175)*

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

**Returns:** *Promise‹void›*
