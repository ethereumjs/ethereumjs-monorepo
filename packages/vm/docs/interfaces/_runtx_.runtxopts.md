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

*Defined in [runTx.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L22)*

The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.

___

### `Optional` skipBalance

• **skipBalance**? : *undefined | false | true*

*Defined in [runTx.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L34)*

If true, skips the balance check

___

### `Optional` skipBlockGasLimitValidation

• **skipBlockGasLimitValidation**? : *undefined | false | true*

*Defined in [runTx.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L40)*

If true, skips the validation of the tx's gas limit
agains the block's gas limit.

___

### `Optional` skipNonce

• **skipNonce**? : *undefined | false | true*

*Defined in [runTx.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L30)*

If true, skips the nonce check

___

###  tx

• **tx**: *Transaction*

*Defined in [runTx.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/runTx.ts#L26)*

An `@ethereumjs/tx` to run
