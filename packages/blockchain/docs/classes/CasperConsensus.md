[@ethereumjs/blockchain](../README.md) / CasperConsensus

# Class: CasperConsensus

This class encapsulates Casper-related consensus functionality when used with the Blockchain class.

## Implements

- [`Consensus`](../interfaces/Consensus.md)

## Table of contents

### Constructors

- [constructor](CasperConsensus.md#constructor)

### Properties

- [algorithm](CasperConsensus.md#algorithm)

### Methods

- [genesisInit](CasperConsensus.md#genesisinit)
- [newBlock](CasperConsensus.md#newblock)
- [setup](CasperConsensus.md#setup)
- [validateConsensus](CasperConsensus.md#validateconsensus)
- [validateDifficulty](CasperConsensus.md#validatedifficulty)

## Constructors

### constructor

• **new CasperConsensus**()

#### Defined in

[consensus/casper.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L12)

## Properties

### algorithm

• **algorithm**: `ConsensusAlgorithm`

#### Implementation of

[Consensus](../interfaces/Consensus.md).[algorithm](../interfaces/Consensus.md#algorithm)

#### Defined in

[consensus/casper.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L10)

## Methods

### genesisInit

▸ **genesisInit**(): `Promise`<`void`\>

Initialize genesis for consensus mechanism

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[genesisInit](../interfaces/Consensus.md#genesisinit)

#### Defined in

[consensus/casper.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L16)

___

### newBlock

▸ **newBlock**(): `Promise`<`void`\>

Update consensus on new block

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[newBlock](../interfaces/Consensus.md#newblock)

#### Defined in

[consensus/casper.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L28)

___

### setup

▸ **setup**(): `Promise`<`void`\>

Set up consensus mechanism

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[setup](../interfaces/Consensus.md#setup)

#### Defined in

[consensus/casper.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L18)

___

### validateConsensus

▸ **validateConsensus**(): `Promise`<`void`\>

Validate block consensus parameters

#### Returns

`Promise`<`void`\>

#### Implementation of

[Consensus](../interfaces/Consensus.md).[validateConsensus](../interfaces/Consensus.md#validateconsensus)

#### Defined in

[consensus/casper.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L20)

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

[consensus/casper.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/casper.ts#L22)
