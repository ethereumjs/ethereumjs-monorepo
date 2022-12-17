[@ethereumjs/trie](../README.md) / CheckpointDB

# Class: CheckpointDB

DB is a thin wrapper around the underlying levelup db,
which validates inputs and sets encoding type.

## Implements

- [`DB`](../interfaces/DB.md)

## Table of contents

### Constructors

- [constructor](CheckpointDB.md#constructor)

### Properties

- [checkpoints](CheckpointDB.md#checkpoints)
- [db](CheckpointDB.md#db)

### Methods

- [batch](CheckpointDB.md#batch)
- [checkpoint](CheckpointDB.md#checkpoint)
- [commit](CheckpointDB.md#commit)
- [copy](CheckpointDB.md#copy)
- [del](CheckpointDB.md#del)
- [get](CheckpointDB.md#get)
- [hasCheckpoints](CheckpointDB.md#hascheckpoints)
- [put](CheckpointDB.md#put)
- [revert](CheckpointDB.md#revert)
- [setCheckpoints](CheckpointDB.md#setcheckpoints)

## Constructors

### constructor

• **new CheckpointDB**(`db`)

Initialize a DB instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | [`DB`](../interfaces/DB.md) |

#### Defined in

[packages/trie/src/db/checkpoint.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L14)

## Properties

### checkpoints

• **checkpoints**: [`Checkpoint`](../README.md#checkpoint)[]

#### Defined in

[packages/trie/src/db/checkpoint.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L8)

___

### db

• **db**: [`DB`](../interfaces/DB.md)

#### Defined in

[packages/trie/src/db/checkpoint.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L9)

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

[packages/trie/src/db/checkpoint.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L140)

___

### checkpoint

▸ **checkpoint**(`root`): `void`

Adds a new checkpoint to the stack

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/db/checkpoint.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L46)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the latest checkpoint

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L53)

___

### copy

▸ **copy**(): [`CheckpointDB`](CheckpointDB.md)

Returns a copy of the DB instance, with a reference
to the **same** underlying leveldb instance.

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Implementation of

[DB](../interfaces/DB.md).[copy](../interfaces/DB.md#copy)

#### Defined in

[packages/trie/src/db/checkpoint.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L157)

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

[packages/trie/src/db/checkpoint.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L127)

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

[packages/trie/src/db/checkpoint.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L93)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the DB during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/db/checkpoint.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L38)

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

[packages/trie/src/db/checkpoint.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L115)

___

### revert

▸ **revert**(): `Promise`<`Buffer`\>

Reverts the latest checkpoint

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L85)

___

### setCheckpoints

▸ **setCheckpoints**(`checkpoints`): `void`

Flush the checkpoints and use the given checkpoints instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `checkpoints` | [`Checkpoint`](../README.md#checkpoint)[] |

#### Returns

`void`

#### Defined in

[packages/trie/src/db/checkpoint.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L24)
