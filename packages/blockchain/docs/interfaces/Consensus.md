[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / Consensus

# Interface: Consensus

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L220)

Interface that a consensus class needs to implement.

## Properties

### algorithm

> **algorithm**: `string`

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L221)

## Methods

### genesisInit()

> **genesisInit**(`genesisBlock`): `Promise`\<`void`\>

Defined in: [types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L226)

Initialize genesis for consensus mechanism

#### Parameters

##### genesisBlock

[`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

genesis block

#### Returns

`Promise`\<`void`\>

***

### newBlock()

> **newBlock**(`block`, `commonAncestor?`, `ancientHeaders?`): `Promise`\<`void`\>

Defined in: [types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L248)

Update consensus on new block

#### Parameters

##### block

[`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

new block

##### commonAncestor?

[`BlockHeader`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/BlockHeader.md)

common ancestor block header (optional)

##### ancientHeaders?

[`BlockHeader`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/BlockHeader.md)[]

array of ancestor block headers (optional)

#### Returns

`Promise`\<`void`\>

***

### setup()

> **setup**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L231)

Set up consensus mechanism

#### Parameters

##### \_\_namedParameters

[`ConsensusOptions`](ConsensusOptions.md)

#### Returns

`Promise`\<`void`\>

***

### validateConsensus()

> **validateConsensus**(`block`): `Promise`\<`void`\>

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L237)

Validate block consensus parameters

#### Parameters

##### block

[`Block`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/Block.md)

block to be validated

#### Returns

`Promise`\<`void`\>

***

### validateDifficulty()

> **validateDifficulty**(`header`): `Promise`\<`void`\>

Defined in: [types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L240)

Validates header difficulty against parent and consensus rules.

#### Parameters

##### header

[`BlockHeader`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/classes/BlockHeader.md)

#### Returns

`Promise`\<`void`\>
