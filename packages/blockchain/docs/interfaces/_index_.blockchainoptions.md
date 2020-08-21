[@ethereumjs/blockchain](../README.md) › ["index"](../modules/_index_.md) › [BlockchainOptions](_index_.blockchainoptions.md)

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Hierarchy

* **BlockchainOptions**

## Index

### Properties

* [chain](_index_.blockchainoptions.md#optional-chain)
* [common](_index_.blockchainoptions.md#optional-common)
* [db](_index_.blockchainoptions.md#optional-db)
* [hardfork](_index_.blockchainoptions.md#optional-hardfork)
* [validateBlocks](_index_.blockchainoptions.md#optional-validateblocks)
* [validatePow](_index_.blockchainoptions.md#optional-validatepow)

## Properties

### `Optional` chain

• **chain**? : *string | number*

*Defined in [index.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L63)*

The chain id or name. Default: `"mainnet"`.

___

### `Optional` common

• **common**? : *Common*

*Defined in [index.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L74)*

An alternative way to specify the chain and hardfork is by passing a Common instance.

___

### `Optional` db

• **db**? : *LevelUp*

*Defined in [index.ts:79](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L79)*

Database to store blocks and metadata. Should be an abstract-leveldown compliant store.

___

### `Optional` hardfork

• **hardfork**? : *string | null*

*Defined in [index.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L69)*

Hardfork for the blocks. If `undefined` or `null` is passed, it gets computed based on block
numbers.

___

### `Optional` validateBlocks

• **validateBlocks**? : *undefined | false | true*

*Defined in [index.ts:91](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L91)*

This flags indicates if blocks should be validated. See Block#validate for details. If
`validate` is provided, this option takes its value. If neither `validate` nor this option are
provided, it defaults to `true`.

___

### `Optional` validatePow

• **validatePow**? : *undefined | false | true*

*Defined in [index.ts:84](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L84)*

This flags indicates if Proof-of-work should be validated. Defaults to `true`.
