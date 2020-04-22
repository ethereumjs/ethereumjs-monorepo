[ethereumjs-tx](../README.md) › ["types"](../modules/_types_.md) › [ChainOptions](_types_.chainoptions.md)

# Interface: ChainOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Hierarchy

- **ChainOptions**

## Index

### Properties

- [chain](_types_.chainoptions.md#optional-chain)
- [common](_types_.chainoptions.md#optional-common)
- [hardfork](_types_.chainoptions.md#optional-hardfork)

## Properties

### `Optional` chain

• **chain**? : _number | string_

_Defined in [types.ts:95](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L95)_

The chain of the transaction, default: 'mainnet'

---

### `Optional` common

• **common**? : _Common_

_Defined in [types.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L90)_

A Common object defining the chain and the hardfork a transaction belongs to.

---

### `Optional` hardfork

• **hardfork**? : _undefined | string_

_Defined in [types.ts:100](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L100)_

The hardfork of the transaction, default: 'petersburg'
