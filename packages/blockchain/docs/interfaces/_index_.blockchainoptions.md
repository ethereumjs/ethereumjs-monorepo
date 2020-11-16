[@ethereumjs/blockchain](../README.md) › ["index"](../modules/_index_.md) › [BlockchainOptions](_index_.blockchainoptions.md)

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Hierarchy

* **BlockchainOptions**

## Index

### Properties

* [common](_index_.blockchainoptions.md#optional-common)
* [db](_index_.blockchainoptions.md#optional-db)
* [genesisBlock](_index_.blockchainoptions.md#optional-genesisblock)
* [validateBlocks](_index_.blockchainoptions.md#optional-validateblocks)
* [validateConsensus](_index_.blockchainoptions.md#optional-validateconsensus)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [index.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L57)*

Specify the chain and hardfork by passing a Common instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

___

### `Optional` db

• **db**? : *LevelUp*

*Defined in [index.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L63)*

Database to store blocks and metadata. Should be an abstract-leveldown
compliant store.

___

### `Optional` genesisBlock

• **genesisBlock**? : *Block*

*Defined in [index.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L89)*

The blockchain only initializes succesfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used

___

### `Optional` validateBlocks

• **validateBlocks**? : *undefined | false | true*

*Defined in [index.ts:80](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L80)*

This flag indicates if protocol-given consistency checks on
block headers and included uncles and transactions should be performed,
see Block#validate for details.

___

### `Optional` validateConsensus

• **validateConsensus**? : *undefined | false | true*

*Defined in [index.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/blockchain/src/index.ts#L72)*

This flags indicates if a block should be validated along the consensus algorithm
or protocol used by the chain, e.g. by verifying the PoW on the block.

Supported: 'pow' with 'ethash' algorithm (taken from the `Common` instance)
Default: `true`.
