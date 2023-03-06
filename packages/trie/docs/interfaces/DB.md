[@ethereumjs/trie](../README.md) / DB

# Interface: DB

## Implemented by

- [`CheckpointDB`](../classes/CheckpointDB.md)
- [`MapDB`](../classes/MapDB.md)

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

[packages/trie/src/types.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L110)

___

### copy

▸ **copy**(): [`DB`](DB.md)

Returns a copy of the DB instance, with a reference
to the **same** underlying leveldb instance.

#### Returns

[`DB`](DB.md)

#### Defined in

[packages/trie/src/types.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L116)

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

[packages/trie/src/types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L104)

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

[packages/trie/src/types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L91)

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

[packages/trie/src/types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L98)
