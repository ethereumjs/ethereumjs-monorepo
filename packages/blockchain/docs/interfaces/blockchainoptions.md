[@ethereumjs/blockchain](../README.md) / BlockchainOptions

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Table of contents

### Properties

- [common](blockchainoptions.md#common)
- [db](blockchainoptions.md#db)
- [genesisBlock](blockchainoptions.md#genesisblock)
- [hardforkByHeadBlockNumber](blockchainoptions.md#hardforkbyheadblocknumber)
- [validateBlocks](blockchainoptions.md#validateblocks)
- [validateConsensus](blockchainoptions.md#validateconsensus)

## Properties

### common

• `Optional` **common**: *default*

Specify the chain and hardfork by passing a Common instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

Defined in: [index.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L70)

___

### db

• `Optional` **db**: *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Database to store blocks and metadata.
Should be an `abstract-leveldown` compliant store
wrapped with `encoding-down`.
For example:
  `levelup(encode(leveldown('./db1')))`
or use the `level` convenience package:
  `level('./db1')`

Defined in: [index.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L88)

___

### genesisBlock

• `Optional` **genesisBlock**: *Block*

The blockchain only initializes succesfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

Defined in: [index.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L116)

___

### hardforkByHeadBlockNumber

• `Optional` **hardforkByHeadBlockNumber**: *boolean*

Set the HF to the fork determined by the head block and update on head updates

Default: `false` (HF is set to whatever default HF is set by the Common instance)

Defined in: [index.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L77)

___

### validateBlocks

• `Optional` **validateBlocks**: *boolean*

This flag indicates if protocol-given consistency checks on
block headers and included uncles and transactions should be performed,
see Block#validate for details.

Defined in: [index.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L107)

___

### validateConsensus

• `Optional` **validateConsensus**: *boolean*

This flags indicates if a block should be validated along the consensus algorithm
or protocol used by the chain, e.g. by verifying the PoW on the block.

Supported consensus types and algorithms (taken from the `Common` instance):
- 'pow' with 'ethash' algorithm (validates the proof-of-work)
- 'poa' with 'clique' algorithm (verifies the block signatures)
Default: `true`.

Defined in: [index.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L99)
