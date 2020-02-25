[ethereumjs-block](../README.md) > [ChainOptions](../interfaces/chainoptions.md)

# Interface: ChainOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a hardfork.

## Hierarchy

**ChainOptions**

## Index

### Properties

- [chain](chainoptions.md#chain)
- [common](chainoptions.md#common)
- [hardfork](chainoptions.md#hardfork)

---

## Properties

<a id="chain"></a>

### `<Optional>` chain

**● chain**: _`number` \| `string`_

_Defined in [types.ts:19](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L19)_

The chain of the block/block header, default: 'mainnet'

---

<a id="common"></a>

### `<Optional>` common

**● common**: _`Common`_

_Defined in [types.ts:14](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L14)_

A Common object defining the chain and the hardfork a block/block header belongs to.

---

<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: _`undefined` \| `string`_

_Defined in [types.ts:24](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/types.ts#L24)_

The hardfork of the block/block header, default: 'petersburg'

---
