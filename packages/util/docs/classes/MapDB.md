[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / MapDB

# Class: MapDB\<TKey, TValue\>

Defined in: [packages/util/src/mapDB.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L6)

In-memory [DB](../interfaces/DB.md) backed by a JavaScript `Map`.

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

Defined in: [packages/util/src/mapDB.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L13)

#### Parameters

##### database?

`Map`\<`TKey`, `TValue`\>

#### Returns

`MapDB`\<`TKey`, `TValue`\>

## Properties

### \_database

> **\_database**: `Map`\<`TKey`, `TValue`\>

Defined in: [packages/util/src/mapDB.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L11)

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L34)

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

Defined in: [packages/util/src/mapDB.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L28)

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

> **get**(`key`): `Promise`\<`TValue` \| `undefined`\>

Defined in: [packages/util/src/mapDB.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L17)

Retrieves a raw value from db.

#### Parameters

##### key

`TKey`

#### Returns

`Promise`\<`TValue` \| `undefined`\>

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

#### Implementation of

[`DB`](../interfaces/DB.md).[`get`](../interfaces/DB.md#get)

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L55)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`DB`](../interfaces/DB.md).[`open`](../interfaces/DB.md#open)

***

### put()

> **put**(`key`, `val`): `Promise`\<`void`\>

Defined in: [packages/util/src/mapDB.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L22)

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

Defined in: [packages/util/src/mapDB.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L51)

Note that the returned shallow copy will share the underlying database with the original

#### Returns

[`DB`](../interfaces/DB.md)\<`TKey`, `TValue`\>

DB

#### Implementation of

[`DB`](../interfaces/DB.md).[`shallowCopy`](../interfaces/DB.md#shallowcopy)
