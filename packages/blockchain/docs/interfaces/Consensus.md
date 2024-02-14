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

[types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L193)

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

[types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L198)

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

[types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L219)

___

### setup

▸ **setup**(`__namedParameters`): `Promise`<`void`\>

Set up consensus mechanism

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ConsensusOptions`](ConsensusOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L203)

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

[types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L209)

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

[types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L211)
