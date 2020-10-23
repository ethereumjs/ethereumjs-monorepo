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

• **block**? : *Block*

*Defined in [runTx.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L17)*

The block to which the `tx` belongs

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runTx.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L29)*

If true, skips the balance check

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runTx.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L25)*

If true, skips the nonce check

___

###  tx

• **tx**: *Transaction*

*Defined in [runTx.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L21)*

An [`@ethereumjs/tx`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/tx) to run
