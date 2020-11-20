[ethereumjs-client](../README.md) › ["blockchain/chain"](../modules/_blockchain_chain_.md) › [ChainOptions](_blockchain_chain_.chainoptions.md)

# Interface: ChainOptions

The options that the Blockchain constructor can receive.

## Hierarchy

* **ChainOptions**

## Index

### Properties

* [blockchain](_blockchain_chain_.chainoptions.md#optional-blockchain)
* [config](_blockchain_chain_.chainoptions.md#config)
* [db](_blockchain_chain_.chainoptions.md#optional-db)

## Properties

### `Optional` blockchain

• **blockchain**? : *Blockchain*

*Defined in [lib/blockchain/chain.ts:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L25)*

Specify a blockchain which implements the Chain interface

___

###  config

• **config**: *[Config](../classes/_config_.config.md)*

*Defined in [lib/blockchain/chain.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L15)*

Client configuration instance

___

### `Optional` db

• **db**? : *LevelUp*

*Defined in [lib/blockchain/chain.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L20)*

Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
