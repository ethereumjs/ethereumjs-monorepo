[@ethereumjs/blockchain](../README.md) › ["index"](../modules/_index_.md) › [BlockchainOptions](_index_.blockchainoptions.md)

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Hierarchy

* **BlockchainOptions**

## Index

### Properties

* [common](_index_.blockchainoptions.md#optional-common)
* [db](_index_.blockchainoptions.md#optional-db)
* [validateBlocks](_index_.blockchainoptions.md#optional-validateblocks)
* [validatePow](_index_.blockchainoptions.md#optional-validatepow)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [index.ts:66](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L66)*

Specify the chain and hardfork by passing a Common instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

___

### `Optional` db

• **db**? : *LevelUp*

*Defined in [index.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L71)*

Database to store blocks and metadata. Should be an abstract-leveldown compliant store.

___

### `Optional` validateBlocks

• **validateBlocks**? : *undefined | false | true*

*Defined in [index.ts:83](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L83)*

This flags indicates if blocks should be validated. See Block#validate for details. If
`validate` is provided, this option takes its value. If neither `validate` nor this option are
provided, it defaults to `true`.

___

### `Optional` validatePow

• **validatePow**? : *undefined | false | true*

*Defined in [index.ts:76](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L76)*

This flags indicates if Proof-of-work should be validated. Defaults to `true`.
