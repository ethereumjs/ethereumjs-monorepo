[@ethereumjs/vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [RunTxOpts](_runtx_.runtxopts.md)

# Interface: RunTxOpts

Options for the `runTx` method.

## Hierarchy

* **RunTxOpts**

## Index

### Properties

* [block](_runtx_.runtxopts.md#optional-block)
* [reportAccessList](_runtx_.runtxopts.md#optional-reportaccesslist)
* [skipBalance](_runtx_.runtxopts.md#optional-skipbalance)
* [skipBlockGasLimitValidation](_runtx_.runtxopts.md#optional-skipblockgaslimitvalidation)
* [skipNonce](_runtx_.runtxopts.md#optional-skipnonce)
* [tx](_runtx_.runtxopts.md#tx)

## Properties

### `Optional` block

• **block**? : *Block*

*Defined in [runTx.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L29)*

The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.

___

### `Optional` reportAccessList

• **reportAccessList**? : *undefined | false | true*

*Defined in [runTx.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L59)*

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom `StateManager` implementation
the `generateAccessList()` method must be implemented.

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runTx.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L41)*

If true, skips the balance check

___

### `Optional` skipBlockGasLimitValidation

• **skipBlockGasLimitValidation**? : *undefined | false | true*

*Defined in [runTx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L47)*

If true, skips the validation of the tx's gas limit
agains the block's gas limit.

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runTx.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L37)*

If true, skips the nonce check

___

###  tx

• **tx**: *TypedTransaction*

*Defined in [runTx.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L33)*

An `@ethereumjs/tx` to run
