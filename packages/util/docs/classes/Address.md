[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Address

# Class: Address

Defined in: [packages/util/src/address.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L24)

Handling and generating Ethereum addresses

## Constructors

### Constructor

> **new Address**(`bytes`): `Address`

Defined in: [packages/util/src/address.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L27)

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`Address`

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: [packages/util/src/address.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L25)

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: [packages/util/src/address.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L37)

Is address equal to another.

#### Parameters

##### address

`Address`

#### Returns

`boolean`

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: [packages/util/src/address.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L52)

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

***

### isZero()

> **isZero**(): `boolean`

Defined in: [packages/util/src/address.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L44)

Is address zero.

#### Returns

`boolean`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: [packages/util/src/address.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L69)

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: [packages/util/src/address.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L62)

Returns hex encoding of address.

#### Returns

`` `0x${string}` ``
