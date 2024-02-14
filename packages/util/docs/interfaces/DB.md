[@ethereumjs/util](../README.md) / DB

# Interface: DB<TKey, TValue\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TKey` | extends `Uint8Array` \| `string` \| `number` = `Uint8Array` |
| `TValue` | extends `Uint8Array` \| `string` \| [`DBObject`](../README.md#dbobject) = `Uint8Array` |

## Implemented by

- [`MapDB`](../classes/MapDB.md)

## Table of contents

### Methods

- [batch](DB.md#batch)
- [del](DB.md#del)
- [get](DB.md#get)
- [open](DB.md#open)
- [put](DB.md#put)
- [shallowCopy](DB.md#shallowcopy)

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

#### Defined in

[packages/util/src/db.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L69)

___

### del

▸ **del**(`key`, `opts?`): `Promise`<`void`\>

Removes a raw value in the underlying db.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `TKey` |
| `opts?` | [`EncodingOpts`](../README.md#encodingopts) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/util/src/db.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L63)

___

### get

▸ **get**(`key`, `opts?`): `Promise`<`undefined` \| `TValue`\>

Retrieves a raw value from db.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `TKey` |
| `opts?` | [`EncodingOpts`](../README.md#encodingopts) |

#### Returns

`Promise`<`undefined` \| `TValue`\>

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

#### Defined in

[packages/util/src/db.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L50)

___

### open

▸ **open**(): `Promise`<`void`\>

Opens the database -- if applicable

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/util/src/db.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L80)

___

### put

▸ **put**(`key`, `val`, `opts?`): `Promise`<`void`\>

Writes a value directly to db.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `TKey` | The key as a `TValue` |
| `val` | `TValue` | - |
| `opts?` | [`EncodingOpts`](../README.md#encodingopts) | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/util/src/db.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L57)

___

### shallowCopy

▸ **shallowCopy**(): [`DB`](DB.md)<`TKey`, `TValue`\>

Returns a copy of the DB instance, with a reference
to the **same** underlying db instance.

#### Returns

[`DB`](DB.md)<`TKey`, `TValue`\>

#### Defined in

[packages/util/src/db.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L75)
