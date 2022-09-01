[@ethereumjs/blockchain](../README.md) / BlockchainOptions

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Table of contents

### Properties

- [common](BlockchainOptions.md#common)
- [consensus](BlockchainOptions.md#consensus)
- [db](BlockchainOptions.md#db)
- [genesisBlock](BlockchainOptions.md#genesisblock)
- [genesisState](BlockchainOptions.md#genesisstate)
- [hardforkByHeadBlockNumber](BlockchainOptions.md#hardforkbyheadblocknumber)
- [validateBlocks](BlockchainOptions.md#validateblocks)
- [validateConsensus](BlockchainOptions.md#validateconsensus)

## Properties

### common

• `Optional` **common**: `Common`

Specify the chain and hardfork by passing a Common instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

#### Defined in

[types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L88)

___

### consensus

• `Optional` **consensus**: [`Consensus`](Consensus.md)

Optional custom consensus that implements the [Consensus](Consensus.md) class

#### Defined in

[types.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L169)

___

### db

• `Optional` **db**: `AbstractLevel`<`string` \| `Uint8Array` \| `Buffer`, `string` \| `Buffer`, `string` \| `Buffer`\>

Database to store blocks and metadata.
Should be an `abstract-leveldown` compliant store
wrapped with `encoding-down`.
For example:
  `levelup(encode(leveldown('./db1')))`
or use the `level` convenience package:
  `new MemoryLevel('./db1')`

#### Defined in

[types.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L110)

___

### genesisBlock

• `Optional` **genesisBlock**: `Block`

The blockchain only initializes successfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

#### Defined in

[types.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L138)

___

### genesisState

• `Optional` **genesisState**: `GenesisState`

If you are using a custom chain Common, pass the genesis state.

Pattern 1 (with genesis state see GenesisState for format):

```javascript
{
  '0x0...01': '0x100', // For EoA
}
```

Pattern 2 (with complex genesis state, containing contract accounts and storage).
Note that in AccountState there are two
accepted types. This allows to easily insert accounts in the genesis state:

A complex genesis state with Contract and EoA states would have the following format:

```javascript
{
  '0x0...01': '0x100', // For EoA
  '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
}
```

#### Defined in

[types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L164)

___

### hardforkByHeadBlockNumber

• `Optional` **hardforkByHeadBlockNumber**: `boolean`

Set the HF to the fork determined by the head block and update on head updates.

Note: for HFs where the transition is also determined by a total difficulty
threshold (merge HF) the calculated TD is additionally taken into account
for HF determination.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L99)

___

### validateBlocks

• `Optional` **validateBlocks**: `boolean`

This flag indicates if protocol-given consistency checks on
block headers and included uncles and transactions should be performed,
see Block#validate for details.

#### Defined in

[types.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L129)

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

[types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L121)
