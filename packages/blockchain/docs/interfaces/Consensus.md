[@ethereumjs/blockchain](../README.md) / Consensus

# Interface: Consensus

Interface that a consensus class needs to implement.

## Implemented by

- [`CasperConsensus`](../classes/CasperConsensus.md)
- [`CliqueConsensus`](../classes/CliqueConsensus.md)
- [`EthashConsensus`](../classes/EthashConsensus.md)

## Table of contents

### Properties

- [algorithm](Consensus.md#algorithm)

### Methods

- [genesisInit](Consensus.md#genesisinit)
- [newBlock](Consensus.md#newblock)
- [setup](Consensus.md#setup)
- [validateConsensus](Consensus.md#validateconsensus)
- [validateDifficulty](Consensus.md#validatedifficulty)

## Properties

### algorithm

• **algorithm**: `string`

#### Defined in

[consensus/interface.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/interface.ts#L9)

## Methods

### genesisInit

▸ **genesisInit**(`genesisBlock`): `Promise`<`void`\>

Initialize genesis for consensus mechanism

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisBlock` | `Block` | genesis block |

#### Returns

`Promise`<`void`\>

#### Defined in

[consensus/interface.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/interface.ts#L14)

___

### newBlock

▸ **newBlock**(`block`, `commonAncestor?`, `ancientHeaders?`): `Promise`<`void`\>

Update consensus on new block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | new block |
| `commonAncestor?` | `BlockHeader` | common ancestor block header (optional) |
| `ancientHeaders?` | `BlockHeader`[] | array of ancestor block headers (optional) |

#### Returns

`Promise`<`void`\>

#### Defined in

[consensus/interface.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/interface.ts#L35)

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

#### Defined in

[consensus/interface.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/interface.ts#L19)

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

#### Defined in

[consensus/interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/interface.ts#L25)

___

### validateDifficulty

▸ **validateDifficulty**(`header`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `BlockHeader` |

#### Returns

`Promise`<`void`\>

#### Defined in

[consensus/interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/consensus/interface.ts#L27)
