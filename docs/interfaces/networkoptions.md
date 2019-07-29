[ethereumjs-block](../README.md) > [NetworkOptions](../interfaces/networkoptions.md)

# Interface: NetworkOptions

An object to set to which network blocks and their headers belong. This could be specified using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a hardfork.

## Hierarchy

**NetworkOptions**

## Index

### Properties

- [chain](networkoptions.md#chain)
- [common](networkoptions.md#common)
- [hardfork](networkoptions.md#hardfork)

---

## Properties

<a id="chain"></a>

### `<Optional>` chain

**● chain**: _`number` \| `string`_

_Defined in [types.ts:18](https://github.com/ethereumjs/ethereumjs-block/blob/4769f90/src/types.ts#L18)_

The chain of the block/block header, default: 'mainnet'

---

<a id="common"></a>

### `<Optional>` common

**● common**: _`Common`_

_Defined in [types.ts:13](https://github.com/ethereumjs/ethereumjs-block/blob/4769f90/src/types.ts#L13)_

A Common object defining the chain and the hardfork a block/block header belongs to.

---

<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: _`undefined` \| `string`_

_Defined in [types.ts:23](https://github.com/ethereumjs/ethereumjs-block/blob/4769f90/src/types.ts#L23)_

The hardfork of the block/block header, default: 'petersburg'

---
