[@ethereumjs/tx](../README.md) / TxOptions

# Interface: TxOptions

The options for initializing a [Transaction](../classes/Transaction.md).

## Table of contents

### Properties

- [allowUnlimitedInitCodeSize](TxOptions.md#allowunlimitedinitcodesize)
- [common](TxOptions.md#common)
- [freeze](TxOptions.md#freeze)

## Properties

### allowUnlimitedInitCodeSize

• `Optional` **allowUnlimitedInitCodeSize**: `boolean`

Allows unlimited contract code-size init while debugging. This (partially) disables EIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

#### Defined in

[types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L98)

___

### common

• `Optional` **common**: `Common`

A Common object defining the chain and hardfork for the transaction.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the default hardfork as defined in the Common class.

Current default hardfork: `istanbul`

#### Defined in

[types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L80)

___

### freeze

• `Optional` **freeze**: `boolean`

A transaction object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the tx parameters.
It also enables tx hash caching when the `hash()` method is called multiple times.

If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Defined in

[types.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L92)
