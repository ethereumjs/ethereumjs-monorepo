[@ethereumjs/trie](../README.md) / MapDB

# Class: MapDB

## Implements

- [`DB`](../interfaces/DB.md)

## Table of contents

### Constructors

- [constructor](MapDB.md#constructor)

### Properties

- [\_database](MapDB.md#_database)

### Methods

- [batch](MapDB.md#batch)
- [copy](MapDB.md#copy)
- [del](MapDB.md#del)
- [get](MapDB.md#get)
- [put](MapDB.md#put)

## Constructors

### constructor

• **new MapDB**(`database?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `database?` | `Map`<`string`, `Buffer`\> |

#### Defined in

[packages/trie/src/db/map.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L6)

## Properties

### \_database

• **\_database**: `Map`<`string`, `Buffer`\>

#### Defined in

[packages/trie/src/db/map.ts:4](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L4)

## Methods

### batch

▸ **batch**(`opStack`): `Promise`<`void`\>

Performs a batch operation on db.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opStack` | [`BatchDBOp`](../README.md#batchdbop)[] | A stack of levelup operations |

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[batch](../interfaces/DB.md#batch)

#### Defined in

[packages/trie/src/db/map.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L28)

___

### copy

▸ **copy**(): [`DB`](../interfaces/DB.md)

Returns a copy of the DB instance, with a reference
to the **same** underlying leveldb instance.

#### Returns

[`DB`](../interfaces/DB.md)

#### Implementation of

[DB](../interfaces/DB.md).[copy](../interfaces/DB.md#copy)

#### Defined in

[packages/trie/src/db/map.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L40)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

Removes a raw value in the underlying leveldb.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[del](../interfaces/DB.md#del)

#### Defined in

[packages/trie/src/db/map.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L24)

___

### get

▸ **get**(`key`): `Promise`<``null`` \| `Buffer`\>

Retrieves a raw value from leveldb.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<``null`` \| `Buffer`\>

A Promise that resolves to `Buffer` if a value is found or `null` if no value is found.

#### Implementation of

[DB](../interfaces/DB.md).[get](../interfaces/DB.md#get)

#### Defined in

[packages/trie/src/db/map.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L10)

___

### put

▸ **put**(`key`, `val`): `Promise`<`void`\>

Writes a value directly to leveldb.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Buffer` | The key as a `Buffer` |
| `val` | `Buffer` | - |

#### Returns

`Promise`<`void`\>

#### Implementation of

[DB](../interfaces/DB.md).[put](../interfaces/DB.md#put)

#### Defined in

[packages/trie/src/db/map.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/map.ts#L20)
