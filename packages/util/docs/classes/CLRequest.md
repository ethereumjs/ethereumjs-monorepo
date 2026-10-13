[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / CLRequest

# Class: CLRequest\<T\>

Defined in: [packages/util/src/request.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L33)

Typed wrapper around a consensus-layer request byte payload.

## Type Parameters

### T

`T` *extends* [`CLRequestType`](../type-aliases/CLRequestType.md)

## Constructors

### Constructor

> **new CLRequest**\<`T`\>(`requestType`, `requestData`): `CLRequest`\<`T`\>

Defined in: [packages/util/src/request.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L45)

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

Defined in: [packages/util/src/request.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L35)

## Accessors

### data

#### Get Signature

> **get** **data**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/request.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L41)

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### type

#### Get Signature

> **get** **type**(): `T`

Defined in: [packages/util/src/request.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L37)

##### Returns

`T`
