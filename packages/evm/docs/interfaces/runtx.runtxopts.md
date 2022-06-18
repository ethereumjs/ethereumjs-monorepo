[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [runTx](../modules/runTx.md) / RunTxOpts

# Interface: RunTxOpts

[runTx](../modules/runTx.md).RunTxOpts

Options for the `runTx` method.

## Table of contents

### Properties

- [block](runTx.RunTxOpts.md#block)
- [blockGasUsed](runTx.RunTxOpts.md#blockgasused)
- [reportAccessList](runTx.RunTxOpts.md#reportaccesslist)
- [skipBalance](runTx.RunTxOpts.md#skipbalance)
- [skipBlockGasLimitValidation](runTx.RunTxOpts.md#skipblockgaslimitvalidation)
- [skipNonce](runTx.RunTxOpts.md#skipnonce)
- [tx](runTx.RunTxOpts.md#tx)

## Properties

### block

• `Optional` **block**: `Block`

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

#### Defined in

[runTx.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L39)

___

### blockGasUsed

• `Optional` **blockGasUsed**: `BN`

To obtain an accurate tx receipt input the block gas used up until this tx.

#### Defined in

[runTx.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L74)

___

### reportAccessList

• `Optional` **reportAccessList**: `boolean`

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom [StateManager](state_interface.StateManager.md) implementation
{@link StateManager.generateAccessList} must be implemented.

#### Defined in

[runTx.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L69)

___

### skipBalance

• `Optional` **skipBalance**: `boolean`

If true, skips the balance check

#### Defined in

[runTx.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L51)

___

### skipBlockGasLimitValidation

• `Optional` **skipBlockGasLimitValidation**: `boolean`

If true, skips the validation of the tx's gas limit
agains the block's gas limit.

#### Defined in

[runTx.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L57)

___

### skipNonce

• `Optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[runTx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L47)

___

### tx

• **tx**: `TypedTransaction`

An `@ethereumjs/tx` to run

#### Defined in

[runTx.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L43)
