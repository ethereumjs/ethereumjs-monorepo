[@ethereumjs/blockchain](../README.md) / EthashConsensus

# Class: EthashConsensus

This class encapsulates Ethash-related consensus functionality when used with the Blockchain class.

## Implements

- [`Consensus`](../interfaces/Consensus.md)

## Table of contents

### Constructors

- [constructor](EthashConsensus.md#constructor)

### Properties

- [\_ethash](EthashConsensus.md#_ethash)
- [algorithm](EthashConsensus.md#algorithm)
- [blockchain](EthashConsensus.md#blockchain)

### Methods

- [genesisInit](EthashConsensus.md#genesisinit)
- [newBlock](EthashConsensus.md#newblock)
- [setup](EthashConsensus.md#setup)
- [validateConsensus](EthashConsensus.md#validateconsensus)
- [validateDifficulty](EthashConsensus.md#validatedifficulty)

## Constructors

### constructor

• **new EthashConsensus**()

#### Defined in

[consensus/ethash.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L16)

## Properties

### \_ethash

• **\_ethash**: `undefined` \| `Ethash`

#### Defined in

[consensus/ethash.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L14)

___

### algorithm

• **algorithm**: `ConsensusAlgorithm`

#### Implementation of

[Consensus](../interfaces/Consensus.md).[algorithm](../interfaces/Consensus.md#algorithm)

#### Defined in

[consensus/ethash.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L13)

___

### blockchain

• **blockchain**: `undefined` \| [`Blockchain`](Blockchain.md)

#### Defined in

[consensus/ethash.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L12)

## Methods

### genesisInit

▸ **genesisInit**(): `Promise`<`void`\>

Initialize genesis for consensus mechanism

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[genesisInit](../interfaces/Consensus.md#genesisinit)

#### Defined in

[consensus/ethash.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L44)

___

### newBlock

▸ **newBlock**(): `Promise`<`void`\>

Update consensus on new block

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[newBlock](../interfaces/Consensus.md#newblock)

#### Defined in

[consensus/ethash.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L49)

___

### setup

▸ **setup**(`__namedParameters`): `Promise`<`void`\>

Set up consensus mechanism

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `ConsensusOptions` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[setup](../interfaces/Consensus.md#setup)

#### Defined in

[consensus/ethash.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L45)

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

[consensus/ethash.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L20)

___

### validateDifficulty

▸ **validateDifficulty**(`header`): `Promise`<`void`\>

Checks that the block's `difficulty` matches the canonical difficulty of the parent header.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | header of block to be checked |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[validateDifficulty](../interfaces/Consensus.md#validatedifficulty)

#### Defined in

[consensus/ethash.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/ethash.ts#L34)
