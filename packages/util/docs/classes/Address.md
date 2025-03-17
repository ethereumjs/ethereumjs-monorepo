[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / Address

# Class: Address

Defined in: [packages/util/src/address.ts:23](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L23)

Handling and generating Ethereum addresses

## Constructors

### new Address()

> **new Address**(`bytes`): [`Address`](Address.md)

Defined in: [packages/util/src/address.ts:26](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L26)

#### Parameters

##### bytes

`Uint8Array`

#### Returns

[`Address`](Address.md)

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: [packages/util/src/address.ts:24](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L24)

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: [packages/util/src/address.ts:36](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L36)

Is address equal to another.

#### Parameters

##### address

[`Address`](Address.md)

#### Returns

`boolean`

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: [packages/util/src/address.ts:51](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L51)

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

***

### isZero()

> **isZero**(): `boolean`

Defined in: [packages/util/src/address.ts:43](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L43)

Is address zero.

#### Returns

`boolean`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: [packages/util/src/address.ts:68](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L68)

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: [packages/util/src/address.ts:61](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L61)

Returns hex encoding of address.

#### Returns

`` `0x${string}` ``
