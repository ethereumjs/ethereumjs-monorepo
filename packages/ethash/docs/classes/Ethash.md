[**@ethereumjs/ethash**](../README.md)

***

[@ethereumjs/ethash](../README.md) / Ethash

# Class: Ethash

Defined in: [index.ts:159](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L159)

## Constructors

### new Ethash()

> **new Ethash**(`cacheDB`?): [`Ethash`](Ethash.md)

Defined in: [index.ts:168](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L168)

#### Parameters

##### cacheDB?

`DB`\<`number`, `DBObject`\>

#### Returns

[`Ethash`](Ethash.md)

## Properties

### cache

> **cache**: `Uint8Array`[]

Defined in: [index.ts:162](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L162)

***

### cacheDB?

> `optional` **cacheDB**: `DB`\<`number`, `DBObject`\>

Defined in: [index.ts:161](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L161)

***

### cacheSize?

> `optional` **cacheSize**: `number`

Defined in: [index.ts:165](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L165)

***

### dbOpts

> **dbOpts**: `Object`

Defined in: [index.ts:160](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L160)

***

### epoc?

> `optional` **epoc**: `number`

Defined in: [index.ts:163](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L163)

***

### fullSize?

> `optional` **fullSize**: `number`

Defined in: [index.ts:164](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L164)

***

### seed?

> `optional` **seed**: `Uint8Array`

Defined in: [index.ts:166](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L166)

## Methods

### \_verifyPOW()

> **\_verifyPOW**(`header`): `Promise`\<`boolean`\>

Defined in: [index.ts:368](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L368)

#### Parameters

##### header

`BlockHeader`

#### Returns

`Promise`\<`boolean`\>

***

### cacheHash()

> **cacheHash**(): `Uint8Array`

Defined in: [index.ts:256](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L256)

#### Returns

`Uint8Array`

***

### calcDatasetItem()

> **calcDatasetItem**(`i`): `Uint8Array`

Defined in: [index.ts:196](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L196)

#### Parameters

##### i

`number`

#### Returns

`Uint8Array`

***

### getMiner()

> **getMiner**(`mineObject`): [`Miner`](Miner.md)

Defined in: [index.ts:364](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L364)

Returns a `Miner` object
To mine a `BlockHeader` or `Block`, use the one-liner `await ethash.getMiner(block).mine(-1)`

#### Parameters

##### mineObject

Object to mine on, either a `BlockHeader` or a `Block`

`BlockHeader` | `Block`

#### Returns

[`Miner`](Miner.md)

- A miner object

***

### headerHash()

> **headerHash**(`rawHeader`): `Uint8Array`

Defined in: [index.ts:271](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L271)

#### Parameters

##### rawHeader

`Uint8Array`[]

#### Returns

`Uint8Array`

***

### loadEpoc()

> **loadEpoc**(`number`): `Promise`\<`void`\>

Defined in: [index.ts:278](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L278)

Loads the seed and cache given a block number.

#### Parameters

##### number

`bigint`

#### Returns

`Promise`\<`void`\>

***

### mkcache()

> **mkcache**(`cacheSize`, `seed`): `Uint8Array`[]

Defined in: [index.ts:176](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L176)

#### Parameters

##### cacheSize

`number`

##### seed

`Uint8Array`

#### Returns

`Uint8Array`[]

***

### run()

> **run**(`val`, `nonce`, `fullSize`?): `object`

Defined in: [index.ts:210](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L210)

#### Parameters

##### val

`Uint8Array`

##### nonce

`Uint8Array`

##### fullSize?

`number`

#### Returns

`object`

##### hash

> **hash**: `Uint8Array`

##### mix

> **mix**: `Uint8Array` = `cmix`

***

### verifyPOW()

> **verifyPOW**(`block`): `Promise`\<`boolean`\>

Defined in: [index.ts:378](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L378)

#### Parameters

##### block

`Block`

#### Returns

`Promise`\<`boolean`\>
