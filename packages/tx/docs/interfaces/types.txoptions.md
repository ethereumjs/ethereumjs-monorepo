[@ethereumjs/tx](../README.md) / [types](../modules/types.md) / TxOptions

# Interface: TxOptions

[types](../modules/types.md).TxOptions

The options for initializing a Transaction.

## Table of contents

### Properties

- [common](types.txoptions.md#common)
- [freeze](types.txoptions.md#freeze)

## Properties

### common

• `Optional` **common**: *default*

A Common object defining the chain and hardfork for the transaction.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: `Common` object set to `mainnet` and the default hardfork as defined in the `Common` class.

Current default hardfork: `istanbul`

Defined in: [types.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L21)

___

### freeze

• `Optional` **freeze**: *boolean*

A transaction object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the tx parameters.

If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
add aditional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

Defined in: [types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L32)
