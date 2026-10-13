[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / BlockchainOptions

# Interface: BlockchainOptions

Defined in: [types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L146)

This are the options that the Blockchain constructor can receive.

## Extends

- [`GenesisOptions`](GenesisOptions.md)

## Properties

### common?

> `optional` **common?**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L153)

Specify the chain and hardfork by passing a [@ethereumjs/common!Common](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md) instance.

If not provided this defaults to chain `mainnet` and hardfork `chainstart`

***

### consensusDict?

> `optional` **consensusDict?**: [`ConsensusDict`](../type-aliases/ConsensusDict.md)

Defined in: [types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L214)

Optional dictionary with consensus objects (adhering to the [Consensus](Consensus.md) interface)
if consensus validation is wished for certain consensus algorithms.

Since consensus validation moved to the Ethereum consensus layer with Proof-of-Stake
consensus is not validated by default. For `ConsensusAlgorithm.Ethash` and
`ConsensusAlgorithm.Clique` consensus validation can be activated by passing in the
respective consensus validation objects `EthashConsensus` or `CliqueConsensus`.

```ts
import { CliqueConsensus, createBlockchain } from '@ethereumjs/blockchain'
import type { ConsensusDict } from '@ethereumjs/blockchain'

const consensusDict: ConsensusDict = {}
consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
const blockchain = await createBlockchain({ common, consensusDict })
```

Additionally it is possible to provide a fully custom consensus implementation.
Note that this needs a custom `Common` object passed to the blockchain where
the `ConsensusAlgorithm` string matches the string used here.

***

### db?

> `optional` **db?**: [`DB`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/interfaces/DB.md)\<`string` \| `number` \| `Uint8Array`\<`ArrayBufferLike`\>, `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| `DBObject`\>

Defined in: [types.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L170)

Database to store blocks and metadata.
Can be any database implementation that adheres to the `DB` interface

***

### genesisBlock?

> `optional` **genesisBlock?**: [`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

Defined in: [types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L104)

The blockchain only initializes successfully if it has a genesis block. If
there is no block available in the DB and a `genesisBlock` is provided,
then the provided `genesisBlock` will be used as genesis. If no block is
present in the DB and no block is provided, then the genesis block as
provided from the `common` will be used.

#### Inherited from

[`GenesisOptions`](GenesisOptions.md).[`genesisBlock`](GenesisOptions.md#genesisblock)

***

### genesisState?

> `optional` **genesisState?**: [`GenesisState`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/GenesisState.md)

Defined in: [types.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L130)

If you are using a custom chain [@ethereumjs/common!Common](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md), pass the genesis state.

Pattern 1 (with genesis state see [GenesisState](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/GenesisState.md) for format):

```javascript
{
  '0x0...01': '0x100', // For EoA
}
```

Pattern 2 (with complex genesis state, containing contract accounts and storage).
Note that in [@ethereumjs/common!AccountState](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/type-aliases/AccountState.md) there are two
accepted types. This allows to easily insert accounts in the genesis state:

A complex genesis state with Contract and EoA states would have the following format:

```javascript
{
  '0x0...01': '0x100', // For EoA
  '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
}
```

#### Inherited from

[`GenesisOptions`](GenesisOptions.md).[`genesisState`](GenesisOptions.md#genesisstate)

***

### genesisStateRoot?

> `optional` **genesisStateRoot?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L135)

State root of the genesis state

#### Inherited from

[`GenesisOptions`](GenesisOptions.md).[`genesisStateRoot`](GenesisOptions.md#genesisstateroot)

***

### hardforkByHeadBlockNumber?

> `optional` **hardforkByHeadBlockNumber?**: `boolean`

Defined in: [types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L164)

Set the HF to the fork determined by the head block and update on head updates.

Note: for HFs where the transition is also determined by a total difficulty
threshold (merge HF) the calculated TD is additionally taken into account
for HF determination.

Default: `false` (HF is set to whatever default HF is set by the [@ethereumjs/common!Common](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md) instance)

***

### validateBlocks?

> `optional` **validateBlocks?**: `boolean`

Defined in: [types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L178)

This flag indicates if protocol-given consistency checks on
block headers and included uncles and transactions should be performed,
see Block#validate for details.

***

### validateConsensus?

> `optional` **validateConsensus?**: `boolean`

Defined in: [types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L190)

Validate the consensus with the respective consensus implementation passed
to `consensusDict` (see respective option) `CasperConsensus` (which effectively
does nothing) is available by default.

For the build-in validation classes the following validations take place.
- 'pow' with 'ethash' algorithm (validates the proof-of-work)
- 'poa' with 'clique' algorithm (verifies the block signatures)
Default: `false`.
