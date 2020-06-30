[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [TransactionOptions](_index_.transactionoptions.md)

# Interface: TransactionOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Hierarchy

* **TransactionOptions**

## Index

### Properties

* [chain](_index_.transactionoptions.md#optional-chain)
* [common](_index_.transactionoptions.md#optional-common)
* [hardfork](_index_.transactionoptions.md#optional-hardfork)

## Properties

### `Optional` chain

• **chain**? : *number | string*

*Defined in [types.ts:94](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L94)*

The chain of the transaction, default: 'mainnet'

___

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L89)*

A Common object defining the chain and the hardfork a transaction belongs to.

___

### `Optional` hardfork

• **hardfork**? : *undefined | string*

*Defined in [types.ts:99](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L99)*

The hardfork of the transaction, default: 'petersburg'
