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
| `cacheDB?` | `DB`<`number`, `DBObject`\> |

#### Defined in

[index.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L168)

## Properties

### cache

• **cache**: `Uint8Array`[]

#### Defined in

[index.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L162)

___

### cacheDB

• `Optional` **cacheDB**: `DB`<`number`, `DBObject`\>

#### Defined in

[index.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L161)

___

### cacheSize

• `Optional` **cacheSize**: `number`

#### Defined in

[index.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L165)

___

### dbOpts

• **dbOpts**: `Object`

#### Defined in

[index.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L160)

___

### epoc

• `Optional` **epoc**: `number`

#### Defined in

[index.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L163)

___

### fullSize

• `Optional` **fullSize**: `number`

#### Defined in

[index.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L164)

___

### seed

• `Optional` **seed**: `Uint8Array`

#### Defined in

[index.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L166)

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

[index.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L368)

___

### cacheHash

▸ **cacheHash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[index.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L256)

___

### calcDatasetItem

▸ **calcDatasetItem**(`i`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`Uint8Array`

#### Defined in

[index.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L196)

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

[index.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L364)

___

### headerHash

▸ **headerHash**(`rawHeader`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawHeader` | `Uint8Array`[] |

#### Returns

`Uint8Array`

#### Defined in

[index.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L271)

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

[index.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L278)

___

### mkcache

▸ **mkcache**(`cacheSize`, `seed`): `Uint8Array`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheSize` | `number` |
| `seed` | `Uint8Array` |

#### Returns

`Uint8Array`[]

#### Defined in

[index.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L176)

___

### run

▸ **run**(`val`, `nonce`, `fullSize?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `Uint8Array` |
| `nonce` | `Uint8Array` |
| `fullSize?` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `hash` | `Uint8Array` |
| `mix` | `Uint8Array` |

#### Defined in

[index.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L210)

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

[index.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L378)
