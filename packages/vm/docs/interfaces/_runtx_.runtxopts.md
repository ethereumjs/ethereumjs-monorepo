[@ethereumjs/vm](../README.md) › ["runTx"](../modules/_runtx_.md) › [RunTxOpts](_runtx_.runtxopts.md)

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

*Defined in [runTx.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L19)*

The block to which the `tx` belongs

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runTx.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L31)*

If true, skips the balance check

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runTx.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L27)*

If true, skips the nonce check

___

###  tx

• **tx**: *Transaction*

*Defined in [runTx.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L23)*

A [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run
