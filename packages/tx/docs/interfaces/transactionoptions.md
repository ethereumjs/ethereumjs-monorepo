[ethereumjs-tx](../README.md) > [TransactionOptions](../interfaces/transactionoptions.md)

# Interface: TransactionOptions

The transaction's options. This could be specified using a Common object, or `chain` and `hardfork`. Defaults to mainnet.

## Hierarchy

**TransactionOptions**

## Index

### Properties

- [chain](transactionoptions.md#chain)
- [common](transactionoptions.md#common)
- [hardfork](transactionoptions.md#hardfork)

---

## Properties

<a id="chain"></a>

### `<Optional>` chain

**● chain**: _`number` \| `string`_

_Defined in [types.ts:94](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L94)_

The chain of the transaction, default: 'mainnet'

---

<a id="common"></a>

### `<Optional>` common

**● common**: _`Common`_

_Defined in [types.ts:89](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L89)_

A Common object defining the chain and the hardfork a transaction belongs to.

---

<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: _`undefined` \| `string`_

_Defined in [types.ts:99](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L99)_

The hardfork of the transaction, default: 'petersburg'

---
