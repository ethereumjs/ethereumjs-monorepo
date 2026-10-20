[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / Bloom

# Class: Bloom

Defined in: [vm/src/bloom/index.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L9)

2048-bit Ethereum bloom filter used in block headers and transaction receipts.

## Constructors

### Constructor

> **new Bloom**(`bitvector?`, `common?`): `Bloom`

Defined in: [vm/src/bloom/index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L16)

Represents a Bloom filter.

#### Parameters

##### bitvector?

`Uint8Array`\<`ArrayBufferLike`\>

##### common?

[`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

#### Returns

`Bloom`

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [vm/src/bloom/index.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L10)

***

### keccakFunction

> **keccakFunction**: (`msg`) => `Uint8Array`

Defined in: [vm/src/bloom/index.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L11)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

## Methods

### add()

> **add**(`e`): `void`

Defined in: [vm/src/bloom/index.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L34)

Adds a 20-byte log topic or address entry to the bloom filter.

#### Parameters

##### e

`Uint8Array`

#### Returns

`void`

***

### check()

> **check**(`e`): `boolean`

Defined in: [vm/src/bloom/index.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L51)

Checks if an element is in the bloom.

#### Parameters

##### e

`Uint8Array`

The element to check

#### Returns

`boolean`

***

### multiCheck()

> **multiCheck**(`topics`): `boolean`

Defined in: [vm/src/bloom/index.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L70)

Returns true when every topic is present in the bloom.

#### Parameters

##### topics

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`boolean`

***

### or()

> **or**(`bloom`): `void`

Defined in: [vm/src/bloom/index.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/bloom/index.ts#L77)

Bitwise or blooms together.

#### Parameters

##### bloom

`Bloom`

#### Returns

`void`
