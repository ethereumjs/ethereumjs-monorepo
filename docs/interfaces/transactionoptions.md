[ethereumjs-tx](../README.md) > [TransactionOptions](../interfaces/transactionoptions.md)

# Interface: TransactionOptions

The transaction's options. This could be specified using a Common object, or `chain` and `hardfork`. Defaults to mainnet.

## Hierarchy

**TransactionOptions**

## Index

### Properties

* [chain](transactionoptions.md#chain)
* [common](transactionoptions.md#common)
* [hardfork](transactionoptions.md#hardfork)

---

## Properties

<a id="chain"></a>

### `<Optional>` chain

**● chain**: *`number` \| `string`*

*Defined in [types.ts:99](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L99)*

The chain of the transaction.

___
<a id="common"></a>

### `<Optional>` common

**● common**: *`Common`*

*Defined in [types.ts:94](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L94)*

A Common object defining the chain and the hardfork a transaction belongs to.

___
<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: *`undefined` \| `string`*

*Defined in [types.ts:104](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L104)*

The hardfork of the transaction.

___

