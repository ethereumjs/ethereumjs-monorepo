[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / CLRequest

# Class: CLRequest\<T\>

Defined in: [packages/util/src/request.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L20)

## Type Parameters

### T

`T` *extends* [`CLRequestType`](../type-aliases/CLRequestType.md)

## Constructors

### Constructor

> **new CLRequest**\<`T`\>(`requestType`, `requestData`): `CLRequest`\<`T`\>

Defined in: [packages/util/src/request.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L32)

#### Parameters

##### requestType

`T`

##### requestData

`Uint8Array`

#### Returns

`CLRequest`\<`T`\>

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: [packages/util/src/request.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L22)

## Accessors

### data

#### Get Signature

> **get** **data**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/request.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L28)

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### type

#### Get Signature

> **get** **type**(): `T`

Defined in: [packages/util/src/request.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L24)

##### Returns

`T`
