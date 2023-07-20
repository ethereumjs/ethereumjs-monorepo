[@ethereumjs/blockchain](../README.md) / BlockchainOptions

# Interface: BlockchainOptions

This are the options that the Blockchain constructor can receive.

## Hierarchy

- [`GenesisOptions`](GenesisOptions.md)

  ↳ **`BlockchainOptions`**

## Table of contents

### Properties

- [common](BlockchainOptions.md#common)
- [consensus](BlockchainOptions.md#consensus)
- [db](BlockchainOptions.md#db)
- [genesisBlock](BlockchainOptions.md#genesisblock)
- [genesisState](BlockchainOptions.md#genesisstate)
- [genesisStateRoot](BlockchainOptions.md#genesisstateroot)
- [hardforkByHeadBlockNumber](BlockchainOptions.md#hardforkbyheadblocknumber)
- [validateBlocks](BlockchainOptions.md#validateblocks)
- [validateConsensus](BlockchainOptions.md#validateconsensus)

## Properties

### common

• `Optional` **common**: `Common`

Specify the chain and hardfork by passing a Common instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

#### Defined in

[types.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L136)

___

### consensus

• `Optional` **consensus**: [`Consensus`](Consensus.md)

Optional custom consensus that implements the [Consensus](Consensus.md) class

#### Defined in

[types.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L177)

___

### db

• `Optional` **db**: `DB`<`string` \| `number` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

Database to store blocks and metadata.
Can be any database implementation that adheres to the `DB` interface

#### Defined in

[types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L153)

___

### genesisBlock

• `Optional` **genesisBlock**: `Block`

The blockchain only initializes successfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

#### Inherited from

[GenesisOptions](GenesisOptions.md).[genesisBlock](GenesisOptions.md#genesisblock)

#### Defined in

[types.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L92)

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

#### Inherited from

[GenesisOptions](GenesisOptions.md).[genesisState](GenesisOptions.md#genesisstate)

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L118)

___

### genesisStateRoot

• `Optional` **genesisStateRoot**: `Uint8Array`

State root of the genesis state

#### Inherited from

[GenesisOptions](GenesisOptions.md).[genesisStateRoot](GenesisOptions.md#genesisstateroot)

#### Defined in

[types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L123)

___

### hardforkByHeadBlockNumber

• `Optional` **hardforkByHeadBlockNumber**: `boolean`

Set the HF to the fork determined by the head block and update on head updates.

Note: for HFs where the transition is also determined by a total difficulty
threshold (merge HF) the calculated TD is additionally taken into account
for HF determination.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L147)

___

### validateBlocks

• `Optional` **validateBlocks**: `boolean`

This flag indicates if protocol-given consistency checks on
block headers and included uncles and transactions should be performed,
see Block#validate for details.

#### Defined in

[types.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L172)

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

[types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L164)
