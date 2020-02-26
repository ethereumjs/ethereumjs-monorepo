[ethereumjs-vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [RunTxOpts](_runtx_.runtxopts.md)

# Interface: RunTxOpts

Options for the `runTx` method.

## Hierarchy

* **RunTxOpts**

## Index

### Properties

* [block](_runtx_.runtxopts.md#optional-block)
* [skipBalance](_runtx_.runtxopts.md#optional-skipbalance)
* [skipNonce](_runtx_.runtxopts.md#optional-skipnonce)
* [tx](_runtx_.runtxopts.md#tx)

## Properties

### `Optional` block

• **block**? : *any*

*Defined in [runTx.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L20)*

The block to which the `tx` belongs

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runTx.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L32)*

If true, skips the balance check

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runTx.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L28)*

If true, skips the nonce check

___

###  tx

• **tx**: *Transaction*

*Defined in [runTx.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L24)*

A [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run
