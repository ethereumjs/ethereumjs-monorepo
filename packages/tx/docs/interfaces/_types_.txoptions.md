[@ethereumjs/tx](../README.md) › ["types"](../modules/_types_.md) › [TxOptions](_types_.txoptions.md)

# Interface: TxOptions

The options for initializing a Transaction.

## Hierarchy

* **TxOptions**

## Index

### Properties

* [common](_types_.txoptions.md#optional-common)
* [freeze](_types_.txoptions.md#optional-freeze)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L15)*

A Common object defining the chain and hardfork for the transaction.

Default: `Common` object set to `mainnet` and the default hardfork as defined in the `Common` class.

Current default hardfork: `istanbul`

___

### `Optional` freeze

• **freeze**? : *undefined | false | true*

*Defined in [types.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L26)*

A transaction object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the tx parameters.

If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
add aditional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true
