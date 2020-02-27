[ethereumjs-blockchain](../README.md) › ["index"](../modules/_index_.md) › [BlockchainOptions](_index_.blockchainoptions.md)

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Hierarchy

- **BlockchainOptions**

## Index

### Properties

- [chain](_index_.blockchainoptions.md#optional-chain)
- [common](_index_.blockchainoptions.md#optional-common)
- [db](_index_.blockchainoptions.md#optional-db)
- [hardfork](_index_.blockchainoptions.md#optional-hardfork)
- [validate](_index_.blockchainoptions.md#optional-validate)
- [validateBlocks](_index_.blockchainoptions.md#optional-validateblocks)
- [validatePow](_index_.blockchainoptions.md#optional-validatepow)

## Properties

### `Optional` chain

• **chain**? : _string | number_

_Defined in [index.ts:76](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L76)_

The chain id or name. Default: `"mainnet"`.

---

### `Optional` common

• **common**? : _Common_

_Defined in [index.ts:87](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L87)_

An alternative way to specify the chain and hardfork is by passing a Common instance.

---

### `Optional` db

• **db**? : _any_

_Defined in [index.ts:93](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L93)_

Database to store blocks and metadata. Should be a
[levelup](https://github.com/rvagg/node-levelup) instance.

---

### `Optional` hardfork

• **hardfork**? : _string | null_

_Defined in [index.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L82)_

Hardfork for the blocks. If `undefined` or `null` is passed, it gets computed based on block
numbers.

---

### `Optional` validate

• **validate**? : _undefined | false | true_

_Defined in [index.ts:101](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L101)_

This the flag indicates if blocks and Proof-of-Work should be validated.
This option can't be used in conjunction with `validatePow` nor `validateBlocks`.

**`deprecated`**

---

### `Optional` validateBlocks

• **validateBlocks**? : _undefined | false | true_

_Defined in [index.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L115)_

This flags indicates if blocks should be validated. See Block#validate for details. If
`validate` is provided, this option takes its value. If neither `validate` nor this option are
provided, it defaults to `true`.

---

### `Optional` validatePow

• **validatePow**? : _undefined | false | true_

_Defined in [index.ts:108](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L108)_

This flags indicates if Proof-of-work should be validated. If `validate` is provided, this
option takes its value. If neither `validate` nor this option are provided, it defaults to
`true`.
