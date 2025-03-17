[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / CLRequest

# Class: CLRequest\<T\>

Defined in: [packages/util/src/request.ts:18](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L18)

## Type Parameters

• **T** *extends* [`CLRequestType`](../enumerations/CLRequestType.md)

## Constructors

### new CLRequest()

> **new CLRequest**\<`T`\>(`requestType`, `requestData`): [`CLRequest`](CLRequest.md)\<`T`\>

Defined in: [packages/util/src/request.ts:30](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L30)

#### Parameters

##### requestType

`T`

##### requestData

`Uint8Array`

#### Returns

[`CLRequest`](CLRequest.md)\<`T`\>

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: [packages/util/src/request.ts:20](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L20)

## Accessors

### data

#### Get Signature

> **get** **data**(): `Uint8Array`

Defined in: [packages/util/src/request.ts:26](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L26)

##### Returns

`Uint8Array`

***

### type

#### Get Signature

> **get** **type**(): `T`

Defined in: [packages/util/src/request.ts:22](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/request.ts#L22)

##### Returns

`T`
