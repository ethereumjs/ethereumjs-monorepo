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

[index.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L174)

## Properties

### cache

• **cache**: `Buffer`[]

#### Defined in

[index.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L168)

___

### cacheDB

• `Optional` **cacheDB**: [`EthashCacheDB`](../README.md#ethashcachedb)

#### Defined in

[index.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L167)

___

### cacheSize

• `Optional` **cacheSize**: `number`

#### Defined in

[index.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L171)

___

### dbOpts

• **dbOpts**: `Object`

#### Defined in

[index.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L166)

___

### epoc

• `Optional` **epoc**: `number`

#### Defined in

[index.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L169)

___

### fullSize

• `Optional` **fullSize**: `number`

#### Defined in

[index.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L170)

___

### seed

• `Optional` **seed**: `Buffer`

#### Defined in

[index.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L172)

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

[index.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L347)

___

### cacheHash

▸ **cacheHash**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[index.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L256)

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

[index.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L203)

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

[index.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L343)

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

[index.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L260)

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

[index.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L267)

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

[index.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L182)

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

[index.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L216)

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

[index.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L358)
