[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / CliqueConsensus

# Class: CliqueConsensus

Defined in: [consensus/clique.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L66)

This class encapsulates Clique-related consensus functionality when used with the Blockchain class.
Note: reorgs which happen between epoch transitions, which change the internal voting state over the reorg
will result in failure and is currently not supported.
The hotfix for this could be: re-load the latest epoch block (this has the clique state in the extraData of the header)
Now replay all blocks on top of it. This should validate the chain up to the new/reorged tip which previously threw.

## Implements

- [`Consensus`](../interfaces/Consensus.md)

## Constructors

### new CliqueConsensus()

> **new CliqueConsensus**(): [`CliqueConsensus`](CliqueConsensus.md)

Defined in: [consensus/clique.ts:118](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L118)

#### Returns

[`CliqueConsensus`](CliqueConsensus.md)

## Properties

### \_cliqueLatestBlockSigners

> **\_cliqueLatestBlockSigners**: `CliqueLatestBlockSigners` = `[]`

Defined in: [consensus/clique.ts:115](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L115)

List of signers for the last consecutive Blockchain.cliqueSignerLimit blocks.
Kept as a snapshot for quickly checking for "recently signed" error.
Format: [ [BLOCK_NUMBER, SIGNER_ADDRESS], ...]

On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

***

### \_cliqueLatestSignerStates

> **\_cliqueLatestSignerStates**: `CliqueLatestSignerStates` = `[]`

Defined in: [consensus/clique.ts:90](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L90)

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

Defined in: [consensus/clique.ts:106](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L106)

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

Defined in: [consensus/clique.ts:68](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L68)

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`algorithm`](../interfaces/Consensus.md#algorithm)

***

### blockchain

> **blockchain**: `undefined` \| [`Blockchain`](Blockchain.md)

Defined in: [consensus/clique.ts:67](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L67)

***

### DEBUG

> **DEBUG**: `boolean`

Defined in: [consensus/clique.ts:117](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L117)

## Methods

### cliqueActiveSigners()

> **cliqueActiveSigners**(`blockNum`): `Address`[]

Defined in: [consensus/clique.ts:445](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L445)

Returns a list with the current block signers

#### Parameters

##### blockNum

`bigint`

#### Returns

`Address`[]

***

### cliqueSignerInTurn()

> **cliqueSignerInTurn**(`signer`, `blockNum`): `Promise`\<`boolean`\>

Defined in: [consensus/clique.ts:617](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L617)

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

Defined in: [consensus/clique.ts:141](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L141)

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

Defined in: [consensus/clique.ts:205](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L205)

Update consensus on new block

#### Parameters

##### block

`Block`

new block

##### commonAncestor

common ancestor block header (optional)

`undefined` | `BlockHeader`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`newBlock`](../interfaces/Consensus.md#newblock)

***

### setup()

> **setup**(`param`): `Promise`\<`void`\>

Defined in: [consensus/clique.ts:133](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L133)

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

Defined in: [consensus/clique.ts:145](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L145)

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

Defined in: [consensus/clique.ts:176](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L176)

#### Parameters

##### header

`BlockHeader`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`validateDifficulty`](../interfaces/Consensus.md#validatedifficulty)
