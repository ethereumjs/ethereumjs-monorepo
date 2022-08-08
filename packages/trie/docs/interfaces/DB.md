[@ethereumjs/trie](../README.md) / DB

# Interface: DB

## Implemented by

- [`CheckpointDB`](../classes/CheckpointDB.md)
- [`LevelDB`](../classes/LevelDB.md)

## Table of contents

### Methods

- [batch](DB.md#batch)
- [copy](DB.md#copy)
- [del](DB.md#del)
- [get](DB.md#get)
- [put](DB.md#put)

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

#### Defined in

[packages/trie/src/types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L87)

___

### copy

▸ **copy**(): [`DB`](DB.md)

Returns a copy of the DB instance, with a reference
to the **same** underlying leveldb instance.

#### Returns

[`DB`](DB.md)

#### Defined in

[packages/trie/src/types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L93)

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

#### Defined in

[packages/trie/src/types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L81)

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

#### Defined in

[packages/trie/src/types.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L68)

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

#### Defined in

[packages/trie/src/types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L75)
