[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [TxOptions](_index_.txoptions.md)

# Interface: TxOptions

The options for initializing a Transaction.

## Hierarchy

* **TxOptions**

## Index

### Properties

* [common](_index_.txoptions.md#optional-common)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L15)*

A Common object defining the chain and hardfork for the transaction.

Default: `Common` object set to `mainnet` and the default hardfork as defined in the `Common` class.

Current default hardfork: `istanbul`
