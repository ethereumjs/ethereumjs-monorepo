[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / CliqueConsensus

# Class: CliqueConsensus

Defined in: [consensus/clique.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L70)

This class encapsulates Clique-related consensus functionality when used with the Blockchain class.
Note: reorgs which happen between epoch transitions, which change the internal voting state over the reorg
will result in failure and is currently not supported.
The hotfix for this could be: re-load the latest epoch block (this has the clique state in the extraData of the header)
Now replay all blocks on top of it. This should validate the chain up to the new/reorged tip which previously threw.

## Implements

- [`Consensus`](../interfaces/Consensus.md)

## Constructors

### Constructor

> **new CliqueConsensus**(): `CliqueConsensus`

Defined in: [consensus/clique.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L122)

#### Returns

`CliqueConsensus`

## Properties

### \_cliqueLatestBlockSigners

> **\_cliqueLatestBlockSigners**: `CliqueLatestBlockSigners` = `[]`

Defined in: [consensus/clique.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L119)

List of signers for the last consecutive Blockchain.cliqueSignerLimit blocks.
Kept as a snapshot for quickly checking for "recently signed" error.
Format: [ [BLOCK_NUMBER, SIGNER_ADDRESS], ...]

On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

***

### \_cliqueLatestSignerStates

> **\_cliqueLatestSignerStates**: `CliqueLatestSignerStates` = `[]`

Defined in: [consensus/clique.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L94)

List with the latest signer states checkpointed on blocks where
a change (added new or removed a signer) occurred.

Format:
[ [BLOCK_NUMBER_1, [SIGNER1, SIGNER 2,]], [BLOCK_NUMBER2, [SIGNER1, SIGNER3]], ...]

The top element from the array represents the list of current signers.
On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

Always keep at least one item on the stack.

***

### \_cliqueLatestVotes

> **\_cliqueLatestVotes**: `CliqueLatestVotes` = `[]`

Defined in: [consensus/clique.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L110)

List with the latest signer votes.

Format:
[ [BLOCK_NUMBER_1, [SIGNER, BENEFICIARY, AUTH]], [BLOCK_NUMBER_1, [SIGNER, BENEFICIARY, AUTH]] ]
where AUTH = CLIQUE_NONCE_AUTH | CLIQUE_NONCE_DROP

For votes all elements here must be taken into account with a
block number >= LAST_EPOCH_BLOCK
(nevertheless keep entries with blocks before EPOCH_BLOCK in case a reorg happens
during an epoch change)

On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

***

### algorithm

> **algorithm**: `ConsensusAlgorithm`

Defined in: [consensus/clique.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L72)

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`algorithm`](../interfaces/Consensus.md#algorithm)

***

### blockchain

> **blockchain**: [`Blockchain`](Blockchain.md) \| `undefined`

Defined in: [consensus/clique.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L71)

***

### DEBUG

> **DEBUG**: `boolean`

Defined in: [consensus/clique.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L121)

## Methods

### cliqueActiveSigners()

> **cliqueActiveSigners**(`blockNum`): `Address`[]

Defined in: [consensus/clique.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L449)

Returns a list with the current block signers

#### Parameters

##### blockNum

`bigint`

#### Returns

`Address`[]

***

### cliqueSignerInTurn()

> **cliqueSignerInTurn**(`signer`, `blockNum`): `Promise`\<`boolean`\>

Defined in: [consensus/clique.ts:624](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L624)

Helper to determine if a signer is in or out of turn for the next block.

#### Parameters

##### signer

`Address`

The signer address

##### blockNum

`bigint`

#### Returns

`Promise`\<`boolean`\>

***

### genesisInit()

> **genesisInit**(`genesisBlock`): `Promise`\<`void`\>

Defined in: [consensus/clique.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L145)

Initialize genesis for consensus mechanism

#### Parameters

##### genesisBlock

`Block`

genesis block

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`genesisInit`](../interfaces/Consensus.md#genesisinit)

***

### newBlock()

> **newBlock**(`block`, `commonAncestor`): `Promise`\<`void`\>

Defined in: [consensus/clique.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L209)

Update consensus on new block

#### Parameters

##### block

`Block`

new block

##### commonAncestor

common ancestor block header (optional)

`BlockHeader` | `undefined`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`newBlock`](../interfaces/Consensus.md#newblock)

***

### setup()

> **setup**(`param`): `Promise`\<`void`\>

Defined in: [consensus/clique.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L137)

#### Parameters

##### param

[`ConsensusOptions`](../interfaces/ConsensusOptions.md)

dictionary containing a [Blockchain](Blockchain.md) object

Note: this method must be called before consensus checks are used or type errors will occur

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`setup`](../interfaces/Consensus.md#setup)

***

### validateConsensus()

> **validateConsensus**(`block`): `Promise`\<`void`\>

Defined in: [consensus/clique.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L149)

Validate block consensus parameters

#### Parameters

##### block

`Block`

block to be validated

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`validateConsensus`](../interfaces/Consensus.md#validateconsensus)

***

### validateDifficulty()

> **validateDifficulty**(`header`): `Promise`\<`void`\>

Defined in: [consensus/clique.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L180)

#### Parameters

##### header

`BlockHeader`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`validateDifficulty`](../interfaces/Consensus.md#validatedifficulty)
