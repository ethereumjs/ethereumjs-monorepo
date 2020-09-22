[@ethereumjs/tx](../README.md) › ["types"](../modules/_types_.md) › [TransactionOptions](_types_.transactionoptions.md)

# Interface: TransactionOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object.

Defaults to `mainnet` and the current default hardfork from Common

## Hierarchy

* **TransactionOptions**

## Index

### Properties

* [common](_types_.transactionoptions.md#optional-common)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L90)*

A Common object defining the chain and the hardfork a transaction belongs to.
