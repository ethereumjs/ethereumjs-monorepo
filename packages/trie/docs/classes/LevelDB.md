[@ethereumjs/trie](../README.md) / LevelDB

# Class: LevelDB

LevelDB is a thin wrapper around the underlying levelup db,
which validates inputs and sets encoding type.

## Implements

- [`DB`](../interfaces/DB.md)

## Table of contents

### Constructors

- [constructor](LevelDB.md#constructor)

### Properties

- [\_leveldb](LevelDB.md#_leveldb)

### Methods

- [batch](LevelDB.md#batch)
- [copy](LevelDB.md#copy)
- [del](LevelDB.md#del)
- [get](LevelDB.md#get)
- [put](LevelDB.md#put)

## Constructors

### constructor

• **new LevelDB**(`leveldb?`)

Initialize a DB instance. If `leveldb` is not provided, DB
defaults to an [in-memory store](https://github.com/Level/memdown).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `leveldb?` | ``null`` \| `AbstractLevel`<`string` \| `Uint8Array` \| `Buffer`, `string` \| `Buffer`, `string` \| `Buffer`\> | An abstract-leveldown compliant store |

#### Defined in

[packages/trie/src/db/level.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L22)

## Properties

### \_leveldb

• **\_leveldb**: `AbstractLevel`<`string` \| `Uint8Array` \| `Buffer`, `string` \| `Buffer`, `string` \| `Buffer`\>

#### Defined in

[packages/trie/src/db/level.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L15)

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

[packages/trie/src/db/level.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L62)

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

[packages/trie/src/db/level.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L69)

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

[packages/trie/src/db/level.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L55)

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

[packages/trie/src/db/level.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L31)

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

[packages/trie/src/db/level.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/level.ts#L48)
