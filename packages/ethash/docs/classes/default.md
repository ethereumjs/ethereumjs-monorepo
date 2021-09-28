[@ethereumjs/ethash](../README.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [cache](default.md#cache)
- [cacheDB](default.md#cachedb)
- [cacheSize](default.md#cachesize)
- [dbOpts](default.md#dbopts)
- [epoc](default.md#epoc)
- [fullSize](default.md#fullsize)
- [seed](default.md#seed)

### Methods

- [\_verifyPOW](default.md#_verifypow)
- [cacheHash](default.md#cachehash)
- [calcDatasetItem](default.md#calcdatasetitem)
- [getMiner](default.md#getminer)
- [headerHash](default.md#headerhash)
- [loadEpoc](default.md#loadepoc)
- [mkcache](default.md#mkcache)
- [run](default.md#run)
- [verifyPOW](default.md#verifypow)

## Constructors

### constructor

• **new default**(`cacheDB?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheDB?` | `LevelUp`<`AbstractLevelDOWN`<`any`, `any`\>, `AbstractIterator`<`any`, `any`\>\> |

#### Defined in

[index.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L144)

## Properties

### cache

• **cache**: `Buffer`[]

#### Defined in

[index.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L138)

___

### cacheDB

• `Optional` **cacheDB**: `LevelUp`<`AbstractLevelDOWN`<`any`, `any`\>, `AbstractIterator`<`any`, `any`\>\>

#### Defined in

[index.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L137)

___

### cacheSize

• `Optional` **cacheSize**: `number`

#### Defined in

[index.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L141)

___

### dbOpts

• **dbOpts**: `Object`

#### Defined in

[index.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L136)

___

### epoc

• `Optional` **epoc**: `number`

#### Defined in

[index.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L139)

___

### fullSize

• `Optional` **fullSize**: `number`

#### Defined in

[index.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L140)

___

### seed

• `Optional` **seed**: `Buffer`

#### Defined in

[index.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L142)

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

[index.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L319)

___

### cacheHash

▸ **cacheHash**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[index.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L227)

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

[index.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L175)

___

### getMiner

▸ **getMiner**(`mineObject`): `Miner`

Returns a `Miner` object
To mine a `BlockHeader` or `Block`, use the one-liner `await ethash.getMiner(block).mine(-1)`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mineObject` | `BlockHeader` \| `Block` | Object to mine on, either a `BlockHeader` or a `Block` |

#### Returns

`Miner`

- A miner object

#### Defined in

[index.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L315)

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

[index.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L231)

___

### loadEpoc

▸ **loadEpoc**(`number`): `Promise`<`void`\>

Loads the seed and cache given a block number.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L238)

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

[index.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L152)

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

[index.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L188)

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

[index.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L330)
