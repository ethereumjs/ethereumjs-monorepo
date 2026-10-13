[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / EthashConsensus

# Class: EthashConsensus

Defined in: [consensus/ethash.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L19)

This class encapsulates Ethash-related consensus functionality when used with the Blockchain class.

## Implements

- [`Consensus`](../interfaces/Consensus.md)

## Constructors

### Constructor

> **new EthashConsensus**(`ethash`): `EthashConsensus`

Defined in: [consensus/ethash.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L27)

#### Parameters

##### ethash

`MinimalEthashInterface`

#### Returns

`EthashConsensus`

## Properties

### \_ethash

> **\_ethash**: `MinimalEthashInterface`

Defined in: [consensus/ethash.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L22)

***

### algorithm

> **algorithm**: `ConsensusAlgorithm`

Defined in: [consensus/ethash.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L21)

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`algorithm`](../interfaces/Consensus.md#algorithm)

***

### blockchain

> **blockchain**: [`Blockchain`](Blockchain.md) \| `undefined`

Defined in: [consensus/ethash.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L20)

## Methods

### genesisInit()

> **genesisInit**(): `Promise`\<`void`\>

Defined in: [consensus/ethash.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L64)

Initialize genesis for consensus mechanism

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`genesisInit`](../interfaces/Consensus.md#genesisinit)

***

### newBlock()

> **newBlock**(): `Promise`\<`void`\>

Defined in: [consensus/ethash.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L69)

Update consensus on new block

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`newBlock`](../interfaces/Consensus.md#newblock)

***

### setup()

> **setup**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [consensus/ethash.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L65)

Set up consensus mechanism

#### Parameters

##### \_\_namedParameters

[`ConsensusOptions`](../interfaces/ConsensusOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`setup`](../interfaces/Consensus.md#setup)

***

### validateConsensus()

> **validateConsensus**(`block`): `Promise`\<`void`\>

Defined in: [consensus/ethash.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L35)

Validate block consensus parameters

#### Parameters

##### block

[`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

block to be validated

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`validateConsensus`](../interfaces/Consensus.md#validateconsensus)

***

### validateDifficulty()

> **validateDifficulty**(`header`): `Promise`\<`void`\>

Defined in: [consensus/ethash.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L50)

Checks that the block's `difficulty` matches the canonical difficulty of the parent header.

#### Parameters

##### header

[`BlockHeader`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/BlockHeader.md)

header of block to be checked

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Consensus`](../interfaces/Consensus.md).[`validateDifficulty`](../interfaces/Consensus.md#validatedifficulty)
