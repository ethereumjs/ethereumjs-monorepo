[@ethereumjs/vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [RunTxOpts](_runtx_.runtxopts.md)

# Interface: RunTxOpts

Options for the `runTx` method.

## Hierarchy

* **RunTxOpts**

## Index

### Properties

* [block](_runtx_.runtxopts.md#optional-block)
* [skipBalance](_runtx_.runtxopts.md#optional-skipbalance)
* [skipBlockGasLimitValidation](_runtx_.runtxopts.md#optional-skipblockgaslimitvalidation)
* [skipNonce](_runtx_.runtxopts.md#optional-skipnonce)
* [tx](_runtx_.runtxopts.md#tx)

## Properties

### `Optional` block

• **block**? : *Block*

*Defined in [runTx.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L24)*

The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runTx.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L36)*

If true, skips the balance check

___

### `Optional` skipBlockGasLimitValidation

• **skipBlockGasLimitValidation**? : *undefined | false | true*

*Defined in [runTx.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L42)*

If true, skips the validation of the tx's gas limit
agains the block's gas limit.

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runTx.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L32)*

If true, skips the nonce check

___

###  tx

• **tx**: *TypedTransaction*

*Defined in [runTx.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L28)*

An `@ethereumjs/tx` to run
