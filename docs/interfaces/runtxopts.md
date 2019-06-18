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

*Defined in [runTx.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/runTx.ts#L19)*

The block to which the `tx` belongs

___
<a id="skipbalance"></a>

### `<Optional>` skipBalance

**● skipBalance**: *`undefined` \| `false` \| `true`*

*Defined in [runTx.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/runTx.ts#L31)*

If true, skips the balance check

___
<a id="skipnonce"></a>

### `<Optional>` skipNonce

**● skipNonce**: *`undefined` \| `false` \| `true`*

*Defined in [runTx.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/runTx.ts#L27)*

If true, skips the nonce check

___
<a id="tx"></a>

###  tx

**● tx**: *`any`*

*Defined in [runTx.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/runTx.ts#L23)*

A [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run

___

