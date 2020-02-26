[ethereumjs-tx](../README.md) › ["types"](../modules/_types_.md) › [TransactionOptions](_types_.transactionoptions.md)

# Interface: TransactionOptions

The transaction's options. This could be specified using a Common object, or `chain` and `hardfork`. Defaults to
mainnet.

## Hierarchy

- **TransactionOptions**

## Index

### Properties

- [chain](_types_.transactionoptions.md#optional-chain)
- [common](_types_.transactionoptions.md#optional-common)
- [hardfork](_types_.transactionoptions.md#optional-hardfork)

## Properties

### `Optional` chain

• **chain**? : _number | string_

_Defined in [types.ts:94](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L94)_

The chain of the transaction, default: 'mainnet'

---

### `Optional` common

• **common**? : _Common_

_Defined in [types.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L89)_

A Common object defining the chain and the hardfork a transaction belongs to.

---

### `Optional` hardfork

• **hardfork**? : _undefined | string_

_Defined in [types.ts:99](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L99)_

The hardfork of the transaction, default: 'petersburg'
