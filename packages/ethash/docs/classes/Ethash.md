[**@ethereumjs/ethash**](../README.md)

***

[@ethereumjs/ethash](../README.md) / Ethash

# Class: Ethash

Defined in: [index.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L160)

## Constructors

### Constructor

> **new Ethash**(`cacheDB?`): `Ethash`

Defined in: [index.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L169)

#### Parameters

##### cacheDB?

`DB`\<`number`, `DBObject`\>

#### Returns

`Ethash`

## Properties

### cache

> **cache**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [index.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L163)

***

### cacheDB?

> `optional` **cacheDB**: `DB`\<`number`, `DBObject`\>

Defined in: [index.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L162)

***

### cacheSize?

> `optional` **cacheSize**: `number`

Defined in: [index.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L166)

***

### dbOpts

> **dbOpts**: `object`

Defined in: [index.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L161)

***

### epoc?

> `optional` **epoc**: `number`

Defined in: [index.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L164)

***

### fullSize?

> `optional` **fullSize**: `number`

Defined in: [index.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L165)

***

### seed?

> `optional` **seed**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L167)

## Methods

### \_verifyPOW()

> **\_verifyPOW**(`header`): `Promise`\<`boolean`\>

Defined in: [index.ts:369](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L369)

#### Parameters

##### header

`BlockHeader`

#### Returns

`Promise`\<`boolean`\>

***

### cacheHash()

> **cacheHash**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L257)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### calcDatasetItem()

> **calcDatasetItem**(`i`): `Uint8Array`

Defined in: [index.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L197)

#### Parameters

##### i

`number`

#### Returns

`Uint8Array`

***

### getMiner()

> **getMiner**(`mineObject`): [`Miner`](Miner.md)

Defined in: [index.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L365)

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

> **headerHash**(`rawHeader`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L272)

#### Parameters

##### rawHeader

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### loadEpoc()

> **loadEpoc**(`number`): `Promise`\<`void`\>

Defined in: [index.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L279)

Loads the seed and cache given a block number.

#### Parameters

##### number

`bigint`

#### Returns

`Promise`\<`void`\>

***

### mkcache()

> **mkcache**(`cacheSize`, `seed`): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [index.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L177)

#### Parameters

##### cacheSize

`number`

##### seed

`Uint8Array`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

***

### run()

> **run**(`val`, `nonce`, `fullSize?`): `object`

Defined in: [index.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L211)

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

> **hash**: `Uint8Array`\<`ArrayBufferLike`\>

##### mix

> **mix**: `Uint8Array`\<`ArrayBuffer`\> = `cmix`

***

### verifyPOW()

> **verifyPOW**(`block`): `Promise`\<`boolean`\>

Defined in: [index.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L379)

#### Parameters

##### block

`Block`

#### Returns

`Promise`\<`boolean`\>
