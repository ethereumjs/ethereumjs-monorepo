[ethereumjs-vm](../README.md) > [RunTxOpts](../interfaces/runtxopts.md)

# Interface: RunTxOpts

Options for the `runTx` method.

## Hierarchy

**RunTxOpts**

## Index

### Properties

* [block](runtxopts.md#block)
* [skipBalance](runtxopts.md#skipbalance)
* [skipNonce](runtxopts.md#skipnonce)
* [tx](runtxopts.md#tx)

---

## Properties

<a id="block"></a>

### `<Optional>` block

**● block**: *`any`*

*Defined in [runTx.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runTx.ts#L20)*

The block to which the `tx` belongs

___
<a id="skipbalance"></a>

### `<Optional>` skipBalance

**● skipBalance**: *`undefined` \| `false` \| `true`*

*Defined in [runTx.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runTx.ts#L32)*

If true, skips the balance check

___
<a id="skipnonce"></a>

### `<Optional>` skipNonce

**● skipNonce**: *`undefined` \| `false` \| `true`*

*Defined in [runTx.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runTx.ts#L28)*

If true, skips the nonce check

___
<a id="tx"></a>

###  tx

**● tx**: *`Transaction`*

*Defined in [runTx.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/runTx.ts#L24)*

A [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run

___

