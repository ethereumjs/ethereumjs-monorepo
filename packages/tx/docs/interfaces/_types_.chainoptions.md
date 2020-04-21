[ethereumjs-tx](../README.md) › ["types"](../modules/_types_.md) › [ChainOptions](_types_.chainoptions.md)

# Interface: ChainOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Hierarchy

* **ChainOptions**

## Index

### Properties

* [chain](_types_.chainoptions.md#optional-chain)
* [common](_types_.chainoptions.md#optional-common)
* [hardfork](_types_.chainoptions.md#optional-hardfork)

## Properties

### `Optional` chain

• **chain**? : *number | string*

*Defined in [types.ts:95](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L95)*

The chain of the transaction, default: 'mainnet'

___

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L90)*

A Common object defining the chain and the hardfork a transaction belongs to.

___

### `Optional` hardfork

• **hardfork**? : *undefined | string*

*Defined in [types.ts:100](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L100)*

The hardfork of the transaction, default: 'petersburg'
