[ethereumjs-client](../README.md) › ["blockchain/chain"](../modules/_blockchain_chain_.md) › [ChainOptions](_blockchain_chain_.chainoptions.md)

# Interface: ChainOptions

The options that the Blockchain constructor can receive.

## Hierarchy

- **ChainOptions**

## Index

### Properties

- [blockchain](_blockchain_chain_.chainoptions.md#optional-blockchain)
- [config](_blockchain_chain_.chainoptions.md#config)
- [db](_blockchain_chain_.chainoptions.md#optional-db)

## Properties

### `Optional` blockchain

• **blockchain**? : _Blockchain_

_Defined in [lib/blockchain/chain.ts:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L25)_

Specify a blockchain which implements the Chain interface

---

### config

• **config**: _[Config](../classes/_config_.config.md)_

_Defined in [lib/blockchain/chain.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L15)_

Client configuration instance

---

### `Optional` db

• **db**? : _LevelUp_

_Defined in [lib/blockchain/chain.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/blockchain/chain.ts#L20)_

Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
