[@ethereumjs/ethash](../README.md) / Ethash

# Class: Ethash

## Table of contents

### Constructors

- [constructor](Ethash.md#constructor)

### Properties

- [cache](Ethash.md#cache)
- [cacheDB](Ethash.md#cachedb)
- [cacheSize](Ethash.md#cachesize)
- [dbOpts](Ethash.md#dbopts)
- [epoc](Ethash.md#epoc)
- [fullSize](Ethash.md#fullsize)
- [seed](Ethash.md#seed)

### Methods

- [\_verifyPOW](Ethash.md#_verifypow)
- [cacheHash](Ethash.md#cachehash)
- [calcDatasetItem](Ethash.md#calcdatasetitem)
- [getMiner](Ethash.md#getminer)
- [headerHash](Ethash.md#headerhash)
- [loadEpoc](Ethash.md#loadepoc)
- [mkcache](Ethash.md#mkcache)
- [run](Ethash.md#run)
- [verifyPOW](Ethash.md#verifypow)

## Constructors

### constructor

• **new Ethash**(`cacheDB?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheDB?` | [`EthashCacheDB`](../README.md#ethashcachedb) |

#### Defined in

[index.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L169)

## Properties

### cache

• **cache**: `Buffer`[]

#### Defined in

[index.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L163)

___

### cacheDB

• `Optional` **cacheDB**: [`EthashCacheDB`](../README.md#ethashcachedb)

#### Defined in

[index.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L162)

___

### cacheSize

• `Optional` **cacheSize**: `number`

#### Defined in

[index.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L166)

___

### dbOpts

• **dbOpts**: `Object`

#### Defined in

[index.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L161)

___

### epoc

• `Optional` **epoc**: `number`

#### Defined in

[index.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L164)

___

### fullSize

• `Optional` **fullSize**: `number`

#### Defined in

[index.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L165)

___

### seed

• `Optional` **seed**: `Buffer`

#### Defined in

[index.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L167)

## Methods

### \_verifyPOW

▸ **_verifyPOW**(`header`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `BlockHeader` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[index.ts:341](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L341)

___

### cacheHash

▸ **cacheHash**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[index.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L250)

___

### calcDatasetItem

▸ **calcDatasetItem**(`i`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`Buffer`

#### Defined in

[index.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L198)

___

### getMiner

▸ **getMiner**(`mineObject`): [`Miner`](Miner.md)

Returns a `Miner` object
To mine a `BlockHeader` or `Block`, use the one-liner `await ethash.getMiner(block).mine(-1)`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mineObject` | `BlockHeader` \| `Block` | Object to mine on, either a `BlockHeader` or a `Block` |

#### Returns

[`Miner`](Miner.md)

- A miner object

#### Defined in

[index.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L337)

___

### headerHash

▸ **headerHash**(`rawHeader`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawHeader` | `Buffer`[] |

#### Returns

`Buffer`

#### Defined in

[index.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L254)

___

### loadEpoc

▸ **loadEpoc**(`number`): `Promise`<`void`\>

Loads the seed and cache given a block number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L261)

___

### mkcache

▸ **mkcache**(`cacheSize`, `seed`): `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheSize` | `number` |
| `seed` | `Buffer` |

#### Returns

`Buffer`[]

#### Defined in

[index.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L177)

___

### run

▸ **run**(`val`, `nonce`, `fullSize?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `Buffer` |
| `nonce` | `Buffer` |
| `fullSize?` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `hash` | `Buffer` |
| `mix` | `Buffer` |

#### Defined in

[index.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L211)

___

### verifyPOW

▸ **verifyPOW**(`block`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[index.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L352)
