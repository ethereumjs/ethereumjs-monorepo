[@ethereumjs/blockchain](../README.md) / CliqueConsensus

# Class: CliqueConsensus

This class encapsulates Clique-related consensus functionality when used with the Blockchain class.

## Implements

- [`Consensus`](../interfaces/Consensus.md)

## Table of contents

### Constructors

- [constructor](CliqueConsensus.md#constructor)

### Properties

- [\_cliqueLatestBlockSigners](CliqueConsensus.md#_cliquelatestblocksigners)
- [\_cliqueLatestSignerStates](CliqueConsensus.md#_cliquelatestsignerstates)
- [\_cliqueLatestVotes](CliqueConsensus.md#_cliquelatestvotes)
- [algorithm](CliqueConsensus.md#algorithm)
- [blockchain](CliqueConsensus.md#blockchain)

### Methods

- [cliqueActiveSigners](CliqueConsensus.md#cliqueactivesigners)
- [cliqueSignerInTurn](CliqueConsensus.md#cliquesignerinturn)
- [genesisInit](CliqueConsensus.md#genesisinit)
- [newBlock](CliqueConsensus.md#newblock)
- [setup](CliqueConsensus.md#setup)
- [validateConsensus](CliqueConsensus.md#validateconsensus)
- [validateDifficulty](CliqueConsensus.md#validatedifficulty)

## Constructors

### constructor

• **new CliqueConsensus**()

#### Defined in

[consensus/clique.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L100)

## Properties

### \_cliqueLatestBlockSigners

• **\_cliqueLatestBlockSigners**: `CliqueLatestBlockSigners` = `[]`

List of signers for the last consecutive Blockchain.cliqueSignerLimit blocks.
Kept as a snapshot for quickly checking for "recently signed" error.
Format: [ [BLOCK_NUMBER, SIGNER_ADDRESS], ...]

On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

#### Defined in

[consensus/clique.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L98)

___

### \_cliqueLatestSignerStates

• **\_cliqueLatestSignerStates**: `CliqueLatestSignerStates` = `[]`

List with the latest signer states checkpointed on blocks where
a change (added new or removed a signer) occurred.

Format:
[ [BLOCK_NUMBER_1, [SIGNER1, SIGNER 2,]], [BLOCK_NUMBER2, [SIGNER1, SIGNER3]], ...]

The top element from the array represents the list of current signers.
On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

Always keep at least one item on the stack.

#### Defined in

[consensus/clique.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L73)

___

### \_cliqueLatestVotes

• **\_cliqueLatestVotes**: `CliqueLatestVotes` = `[]`

List with the latest signer votes.

Format:
[ [BLOCK_NUMBER_1, [SIGNER, BENEFICIARY, AUTH]], [BLOCK_NUMBER_1, [SIGNER, BENEFICIARY, AUTH]] ]
where AUTH = CLIQUE_NONCE_AUTH | CLIQUE_NONCE_DROP

For votes all elements here must be taken into account with a
block number >= LAST_EPOCH_BLOCK
(nevertheless keep entries with blocks before EPOCH_BLOCK in case a reorg happens
during an epoch change)

On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.

#### Defined in

[consensus/clique.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L89)

___

### algorithm

• **algorithm**: `ConsensusAlgorithm`

#### Implementation of

[Consensus](../interfaces/Consensus.md).[algorithm](../interfaces/Consensus.md#algorithm)

#### Defined in

[consensus/clique.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L51)

___

### blockchain

• **blockchain**: `undefined` \| [`Blockchain`](Blockchain.md)

#### Defined in

[consensus/clique.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L50)

## Methods

### cliqueActiveSigners

▸ **cliqueActiveSigners**(): `Address`[]

Returns a list with the current block signers

#### Returns

`Address`[]

#### Defined in

[consensus/clique.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L403)

___

### cliqueSignerInTurn

▸ **cliqueSignerInTurn**(`signer`): `Promise`<`boolean`\>

Helper to determine if a signer is in or out of turn for the next block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Address` | The signer address |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[consensus/clique.ts:598](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L598)

___

### genesisInit

▸ **genesisInit**(`genesisBlock`): `Promise`<`void`\>

Initialize genesis for consensus mechanism

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisBlock` | `Block` | genesis block |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[genesisInit](../interfaces/Consensus.md#genesisinit)

#### Defined in

[consensus/clique.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L117)

___

### newBlock

▸ **newBlock**(`block`, `commonAncestor`): `Promise`<`void`\>

Update consensus on new block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | new block |
| `commonAncestor` | `undefined` \| `BlockHeader` | common ancestor block header (optional) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[newBlock](../interfaces/Consensus.md#newblock)

#### Defined in

[consensus/clique.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L181)

___

### setup

▸ **setup**(`param`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param` | `ConsensusOptions` | dictionary containin a [Blockchain](Blockchain.md) object  Note: this method must be called before consensus checks are used or type errors will occur |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[setup](../interfaces/Consensus.md#setup)

#### Defined in

[consensus/clique.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L110)

___

### validateConsensus

▸ **validateConsensus**(`block`): `Promise`<`void`\>

Validate block consensus parameters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | block to be validated |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[validateConsensus](../interfaces/Consensus.md#validateconsensus)

#### Defined in

[consensus/clique.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L121)

___

### validateDifficulty

▸ **validateDifficulty**(`header`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `BlockHeader` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[validateDifficulty](../interfaces/Consensus.md#validatedifficulty)

#### Defined in

[consensus/clique.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/clique.ts#L152)
