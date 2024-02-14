[@ethereumjs/util](../README.md) / MapDB

# Class: MapDB<TKey, TValue\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `Uint8Array` \| `string` \| `number` |
| `TValue` | extends `Uint8Array` \| `string` \| [`DBObject`](../README.md#dbobject) |

## Implements

- [`DB`](../interfaces/DB.md)<`TKey`, `TValue`\>

## Table of contents

### Constructors

- [constructor](MapDB.md#constructor)

### Properties

- [\_database](MapDB.md#_database)

### Methods

- [batch](MapDB.md#batch)
- [del](MapDB.md#del)
- [get](MapDB.md#get)
- [open](MapDB.md#open)
- [put](MapDB.md#put)
- [shallowCopy](MapDB.md#shallowcopy)

## Constructors

### constructor

• **new MapDB**<`TKey`, `TValue`\>(`database?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `string` \| `number` \| `Uint8Array` |
| `TValue` | extends `string` \| `Uint8Array` \| [`DBObject`](../README.md#dbobject) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `database?` | `Map`<`TKey`, `TValue`\> |

#### Defined in

[packages/util/src/mapDB.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L12)

## Properties

### \_database

• **\_database**: `Map`<`TKey`, `TValue`\>

#### Defined in

[packages/util/src/mapDB.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L10)

## Methods

### batch

▸ **batch**(`opStack`): `Promise`<`void`\>

Performs a batch operation on db.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opStack` | [`BatchDBOp`](../README.md#batchdbop)<`TKey`, `TValue`\>[] | A stack of levelup operations |

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[batch](../interfaces/DB.md#batch)

#### Defined in

[packages/util/src/mapDB.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L31)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

Removes a raw value in the underlying db.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `TKey` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[del](../interfaces/DB.md#del)

#### Defined in

[packages/util/src/mapDB.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L26)

___

### get

▸ **get**(`key`): `Promise`<`undefined` \| `TValue`\>

Retrieves a raw value from db.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `TKey` |

#### Returns

`Promise`<`undefined` \| `TValue`\>

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

#### Implementation of

[DB](../interfaces/DB.md).[get](../interfaces/DB.md#get)

#### Defined in

[packages/util/src/mapDB.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L16)

___

### open

▸ **open**(): `Promise`<`void`\>

Opens the database -- if applicable

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[open](../interfaces/DB.md#open)

#### Defined in

[packages/util/src/mapDB.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L52)

___

### put

▸ **put**(`key`, `val`): `Promise`<`void`\>

Writes a value directly to db.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `TKey` | The key as a `TValue` |
| `val` | `TValue` | - |

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[put](../interfaces/DB.md#put)

#### Defined in

[packages/util/src/mapDB.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L21)

___

### shallowCopy

▸ **shallowCopy**(): [`DB`](../interfaces/DB.md)<`TKey`, `TValue`\>

Note that the returned shallow copy will share the underlying database with the original

#### Returns

[`DB`](../interfaces/DB.md)<`TKey`, `TValue`\>

DB

#### Implementation of

[DB](../interfaces/DB.md).[shallowCopy](../interfaces/DB.md#shallowcopy)

#### Defined in

[packages/util/src/mapDB.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/mapDB.ts#L48)
