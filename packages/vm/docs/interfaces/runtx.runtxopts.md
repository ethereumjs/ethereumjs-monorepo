[@ethereumjs/vm](../README.md) / [runTx](../modules/runtx.md) / RunTxOpts

# Interface: RunTxOpts

[runTx](../modules/runtx.md).RunTxOpts

Options for the `runTx` method.

## Table of contents

### Properties

- [block](runtx.runtxopts.md#block)
- [reportAccessList](runtx.runtxopts.md#reportaccesslist)
- [skipBalance](runtx.runtxopts.md#skipbalance)
- [skipBlockGasLimitValidation](runtx.runtxopts.md#skipblockgaslimitvalidation)
- [skipNonce](runtx.runtxopts.md#skipnonce)
- [tx](runtx.runtxopts.md#tx)

## Properties

### block

• `Optional` **block**: *Block*

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.
To obtain an accurate `TxReceipt`, please pass a block
with the header field `gasUsed` set to the value
prior to this tx being run.

Defined in: [runTx.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L35)

___

### reportAccessList

• `Optional` **reportAccessList**: *boolean*

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom `StateManager` implementation
the `generateAccessList()` method must be implemented.

Defined in: [runTx.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L65)

___

### skipBalance

• `Optional` **skipBalance**: *boolean*

If true, skips the balance check

Defined in: [runTx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L47)

___

### skipBlockGasLimitValidation

• `Optional` **skipBlockGasLimitValidation**: *boolean*

If true, skips the validation of the tx's gas limit
agains the block's gas limit.

Defined in: [runTx.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L53)

___

### skipNonce

• `Optional` **skipNonce**: *boolean*

If true, skips the nonce check

Defined in: [runTx.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L43)

___

### tx

• **tx**: TypedTransaction

An `@ethereumjs/tx` to run

Defined in: [runTx.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L39)
