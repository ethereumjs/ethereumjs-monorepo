[@ethereumjs/vm](../README.md) / RunTxOpts

# Interface: RunTxOpts

Options for the `runTx` method.

## Table of contents

### Properties

- [block](RunTxOpts.md#block)
- [blockGasUsed](RunTxOpts.md#blockgasused)
- [reportAccessList](RunTxOpts.md#reportaccesslist)
- [reportPreimages](RunTxOpts.md#reportpreimages)
- [skipBalance](RunTxOpts.md#skipbalance)
- [skipBlockGasLimitValidation](RunTxOpts.md#skipblockgaslimitvalidation)
- [skipHardForkValidation](RunTxOpts.md#skiphardforkvalidation)
- [skipNonce](RunTxOpts.md#skipnonce)
- [tx](RunTxOpts.md#tx)

## Properties

### block

• `Optional` **block**: `Block`

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

#### Defined in

[vm/src/types.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L342)

___

### blockGasUsed

• `Optional` **blockGasUsed**: `bigint`

To obtain an accurate tx receipt input the block gas used up until this tx.

#### Defined in

[vm/src/types.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L390)

___

### reportAccessList

• `Optional` **reportAccessList**: `boolean`

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom StateManager implementation
StateManager.generateAccessList must be implemented.

#### Defined in

[vm/src/types.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L379)

___

### reportPreimages

• `Optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Defined in

[vm/src/types.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L385)

___

### skipBalance

• `Optional` **skipBalance**: `boolean`

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

#### Defined in

[vm/src/types.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L355)

___

### skipBlockGasLimitValidation

• `Optional` **skipBlockGasLimitValidation**: `boolean`

If true, skips the validation of the tx's gas limit
against the block's gas limit.

#### Defined in

[vm/src/types.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L361)

___

### skipHardForkValidation

• `Optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Defined in

[vm/src/types.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L367)

___

### skipNonce

• `Optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[vm/src/types.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L350)

___

### tx

• **tx**: `TypedTransaction`

An `@ethereumjs/tx` to run

#### Defined in

[vm/src/types.ts:346](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L346)
