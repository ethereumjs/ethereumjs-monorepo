[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [TransactionOptions](_index_.transactionoptions.md)

# Interface: TransactionOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object.

Defaults to `mainnet` and the current default hardfork from Common

## Hierarchy

* **TransactionOptions**

## Index

### Properties

* [common](_index_.transactionoptions.md#optional-common)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L90)*

A Common object defining the chain and the hardfork a transaction belongs to.
