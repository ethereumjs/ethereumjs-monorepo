[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / Consensus

# Interface: Consensus

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L217)

Interface that a consensus class needs to implement.

## Properties

### algorithm

> **algorithm**: `string`

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L218)

## Methods

### genesisInit()

> **genesisInit**(`genesisBlock`): `Promise`\<`void`\>

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L223)

Initialize genesis for consensus mechanism

#### Parameters

##### genesisBlock

`Block`

genesis block

#### Returns

`Promise`\<`void`\>

***

### newBlock()

> **newBlock**(`block`, `commonAncestor?`, `ancientHeaders?`): `Promise`\<`void`\>

Defined in: [types.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L244)

Update consensus on new block

#### Parameters

##### block

`Block`

new block

##### commonAncestor?

`BlockHeader`

common ancestor block header (optional)

##### ancientHeaders?

`BlockHeader`[]

array of ancestor block headers (optional)

#### Returns

`Promise`\<`void`\>

***

### setup()

> **setup**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L228)

Set up consensus mechanism

#### Parameters

##### \_\_namedParameters

[`ConsensusOptions`](ConsensusOptions.md)

#### Returns

`Promise`\<`void`\>

***

### validateConsensus()

> **validateConsensus**(`block`): `Promise`\<`void`\>

Defined in: [types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L234)

Validate block consensus parameters

#### Parameters

##### block

`Block`

block to be validated

#### Returns

`Promise`\<`void`\>

***

### validateDifficulty()

> **validateDifficulty**(`header`): `Promise`\<`void`\>

Defined in: [types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L236)

#### Parameters

##### header

`BlockHeader`

#### Returns

`Promise`\<`void`\>
