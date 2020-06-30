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
* [validate](_index_.blockchainoptions.md#optional-validate)
* [validateBlocks](_index_.blockchainoptions.md#optional-validateblocks)
* [validatePow](_index_.blockchainoptions.md#optional-validatepow)

## Properties

### `Optional` chain

• **chain**? : *string | number*

*Defined in [index.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L74)*

The chain id or name. Default: `"mainnet"`.

___

### `Optional` common

• **common**? : *Common*

*Defined in [index.ts:85](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L85)*

An alternative way to specify the chain and hardfork is by passing a Common instance.

___

### `Optional` db

• **db**? : *any*

*Defined in [index.ts:91](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L91)*

Database to store blocks and metadata. Should be a
[levelup](https://github.com/rvagg/node-levelup) instance.

___

### `Optional` hardfork

• **hardfork**? : *string | null*

*Defined in [index.ts:80](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L80)*

Hardfork for the blocks. If `undefined` or `null` is passed, it gets computed based on block
numbers.

___

### `Optional` validate

• **validate**? : *undefined | false | true*

*Defined in [index.ts:99](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L99)*

This the flag indicates if blocks and Proof-of-Work should be validated.
This option can't be used in conjunction with `validatePow` nor `validateBlocks`.

**`deprecated`** 

___

### `Optional` validateBlocks

• **validateBlocks**? : *undefined | false | true*

*Defined in [index.ts:113](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L113)*

This flags indicates if blocks should be validated. See Block#validate for details. If
`validate` is provided, this option takes its value. If neither `validate` nor this option are
provided, it defaults to `true`.

___

### `Optional` validatePow

• **validatePow**? : *undefined | false | true*

*Defined in [index.ts:106](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L106)*

This flags indicates if Proof-of-work should be validated. If `validate` is provided, this
option takes its value. If neither `validate` nor this option are provided, it defaults to
`true`.
