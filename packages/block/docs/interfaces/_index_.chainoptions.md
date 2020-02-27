[ethereumjs-block](../README.md) › ["index"](../modules/_index_.md) › [ChainOptions](_index_.chainoptions.md)

# Interface: ChainOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Hierarchy

- **ChainOptions**

## Index

### Properties

- [chain](_index_.chainoptions.md#optional-chain)
- [common](_index_.chainoptions.md#optional-common)
- [hardfork](_index_.chainoptions.md#optional-hardfork)

## Properties

### `Optional` chain

• **chain**? : _number | string_

_Defined in [types.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L19)_

The chain of the block/block header, default: 'mainnet'

---

### `Optional` common

• **common**? : _Common_

_Defined in [types.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L14)_

A Common object defining the chain and the hardfork a block/block header belongs to.

---

### `Optional` hardfork

• **hardfork**? : _undefined | string_

_Defined in [types.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L24)_

The hardfork of the block/block header, default: 'petersburg'
