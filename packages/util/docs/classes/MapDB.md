[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / MapDB

# Class: MapDB\<TKey, TValue\>

Defined in: [packages/util/src/mapDB.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L5)

## Type Parameters

### TKey

`TKey` *extends* `Uint8Array` \| `string` \| `number`

### TValue

`TValue` *extends* `Uint8Array` \| `string` \| [`DBObject`](../type-aliases/DBObject.md)

## Implements

- [`DB`](../interfaces/DB.md)\<`TKey`, `TValue`\>

## Constructors

### Constructor

> **new MapDB**\<`TKey`, `TValue`\>(`database?`): `MapDB`\<`TKey`, `TValue`\>

Defined in: [packages/util/src/mapDB.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L12)

#### Parameters

##### database?

`Map`\<`TKey`, `TValue`\>

#### Returns

`MapDB`\<`TKey`, `TValue`\>

## Properties

### \_database

> **\_database**: `Map`\<`TKey`, `TValue`\>

Defined in: [packages/util/src/mapDB.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L10)

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L31)

Performs a batch operation on db.

#### Parameters

##### opStack

[`BatchDBOp`](../type-aliases/BatchDBOp.md)\<`TKey`, `TValue`\>[]

A stack of levelup operations

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`DB`](../interfaces/DB.md).[`batch`](../interfaces/DB.md#batch)

***

### del()

> **del**(`key`): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L26)

Removes a raw value in the underlying db.

#### Parameters

##### key

`TKey`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`DB`](../interfaces/DB.md).[`del`](../interfaces/DB.md#del)

***

### get()

> **get**(`key`): `Promise`\<`undefined` \| `TValue`\>

Defined in: [packages/util/src/mapDB.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L16)

Retrieves a raw value from db.

#### Parameters

##### key

`TKey`

#### Returns

`Promise`\<`undefined` \| `TValue`\>

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

#### Implementation of

[`DB`](../interfaces/DB.md).[`get`](../interfaces/DB.md#get)

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L52)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`DB`](../interfaces/DB.md).[`open`](../interfaces/DB.md#open)

***

### put()

> **put**(`key`, `val`): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L21)

Writes a value directly to db.

#### Parameters

##### key

`TKey`

The key as a `TValue`

##### val

`TValue`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`DB`](../interfaces/DB.md).[`put`](../interfaces/DB.md#put)

***

### shallowCopy()

> **shallowCopy**(): [`DB`](../interfaces/DB.md)\<`TKey`, `TValue`\>

Defined in: [packages/util/src/mapDB.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L48)

Note that the returned shallow copy will share the underlying database with the original

#### Returns

[`DB`](../interfaces/DB.md)\<`TKey`, `TValue`\>

DB

#### Implementation of

[`DB`](../interfaces/DB.md).[`shallowCopy`](../interfaces/DB.md#shallowcopy)
