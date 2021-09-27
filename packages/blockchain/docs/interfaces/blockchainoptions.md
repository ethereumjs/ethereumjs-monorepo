[@ethereumjs/blockchain](../README.md) / BlockchainOptions

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Table of contents

### Properties

- [common](BlockchainOptions.md#common)
- [db](BlockchainOptions.md#db)
- [genesisBlock](BlockchainOptions.md#genesisblock)
- [hardforkByHeadBlockNumber](BlockchainOptions.md#hardforkbyheadblocknumber)
- [validateBlocks](BlockchainOptions.md#validateblocks)
- [validateConsensus](BlockchainOptions.md#validateconsensus)

## Properties

### common

• `Optional` **common**: `default`

Specify the chain and hardfork by passing a {@link Common} instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

#### Defined in

[index.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L71)

___

### db

• `Optional` **db**: `LevelUp`<`AbstractLevelDOWN`<`any`, `any`\>, `AbstractIterator`<`any`, `any`\>\>

Database to store blocks and metadata.
Should be an `abstract-leveldown` compliant store
wrapped with `encoding-down`.
For example:
  `levelup(encode(leveldown('./db1')))`
or use the `level` convenience package:
  `level('./db1')`

#### Defined in

[index.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L93)

___

### genesisBlock

• `Optional` **genesisBlock**: `Block`

The blockchain only initializes succesfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

#### Defined in

[index.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L121)

___

### hardforkByHeadBlockNumber

• `Optional` **hardforkByHeadBlockNumber**: `boolean`

Set the HF to the fork determined by the head block and update on head updates.

Note: for HFs where the transition is also determined by a total difficulty
threshold (merge HF) the calculated TD is additionally taken into account
for HF determination.

Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)

#### Defined in

[index.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L82)

___

### validateBlocks

• `Optional` **validateBlocks**: `boolean`

This flag indicates if protocol-given consistency checks on
block headers and included uncles and transactions should be performed,
see Block#validate for details.

#### Defined in

[index.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L112)

___

### validateConsensus

• `Optional` **validateConsensus**: `boolean`

This flags indicates if a block should be validated along the consensus algorithm
or protocol used by the chain, e.g. by verifying the PoW on the block.

Supported consensus types and algorithms (taken from the `Common` instance):
- 'pow' with 'ethash' algorithm (validates the proof-of-work)
- 'poa' with 'clique' algorithm (verifies the block signatures)
Default: `true`.

#### Defined in

[index.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/index.ts#L104)
