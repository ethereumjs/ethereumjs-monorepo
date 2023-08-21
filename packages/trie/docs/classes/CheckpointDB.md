[@ethereumjs/trie](../README.md) / CheckpointDB

# Class: CheckpointDB

DB is a thin wrapper around the underlying levelup db,
which validates inputs and sets encoding type.

## Implements

- `DB`

## Table of contents

### Constructors

- [constructor](CheckpointDB.md#constructor)

### Properties

- [\_stats](CheckpointDB.md#_stats)
- [cacheSize](CheckpointDB.md#cachesize)
- [checkpoints](CheckpointDB.md#checkpoints)
- [db](CheckpointDB.md#db)

### Methods

- [batch](CheckpointDB.md#batch)
- [checkpoint](CheckpointDB.md#checkpoint)
- [commit](CheckpointDB.md#commit)
- [del](CheckpointDB.md#del)
- [get](CheckpointDB.md#get)
- [hasCheckpoints](CheckpointDB.md#hascheckpoints)
- [open](CheckpointDB.md#open)
- [put](CheckpointDB.md#put)
- [revert](CheckpointDB.md#revert)
- [setCheckpoints](CheckpointDB.md#setcheckpoints)
- [shallowCopy](CheckpointDB.md#shallowcopy)
- [stats](CheckpointDB.md#stats)

## Constructors

### constructor

• **new CheckpointDB**(`opts`)

Initialize a DB instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CheckpointDBOpts`](../interfaces/CheckpointDBOpts.md) |

#### Defined in

[packages/trie/src/db/checkpoint.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L49)

## Properties

### \_stats

• **\_stats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cache` | { `hits`: `number` = 0; `reads`: `number` = 0; `writes`: `number` = 0 } |
| `cache.hits` | `number` |
| `cache.reads` | `number` |
| `cache.writes` | `number` |
| `db` | { `hits`: `number` = 0; `reads`: `number` = 0; `writes`: `number` = 0 } |
| `db.hits` | `number` |
| `db.reads` | `number` |
| `db.writes` | `number` |

#### Defined in

[packages/trie/src/db/checkpoint.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L33)

___

### cacheSize

• `Readonly` **cacheSize**: `number`

#### Defined in

[packages/trie/src/db/checkpoint.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L19)

___

### checkpoints

• **checkpoints**: [`Checkpoint`](../README.md#checkpoint)[]

#### Defined in

[packages/trie/src/db/checkpoint.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L17)

___

### db

• **db**: `DB`<`string`, `string`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L18)

## Methods

### batch

▸ **batch**(`opStack`): `Promise`<`void`\>

**`Inherit Doc`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `opStack` | `BatchDBOp`<`Uint8Array`, `Uint8Array`\>[] |

#### Returns

`Promise`<`void`\>

#### Implementation of

DB.batch

#### Defined in

[packages/trie/src/db/checkpoint.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L222)

___

### checkpoint

▸ **checkpoint**(`root`): `void`

Adds a new checkpoint to the stack

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/trie/src/db/checkpoint.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L90)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the latest checkpoint

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L97)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

**`Inherit Doc`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Implementation of

DB.del

#### Defined in

[packages/trie/src/db/checkpoint.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L200)

___

### get

▸ **get**(`key`): `Promise`<`undefined` \| `Uint8Array`\>

**`Inherit Doc`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Promise`<`undefined` \| `Uint8Array`\>

#### Implementation of

DB.get

#### Defined in

[packages/trie/src/db/checkpoint.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L137)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the DB during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/db/checkpoint.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L82)

___

### open

▸ **open**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

DB.open

#### Defined in

[packages/trie/src/db/checkpoint.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L272)

___

### put

▸ **put**(`key`, `value`): `Promise`<`void`\>

**`Inherit Doc`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Implementation of

DB.put

#### Defined in

[packages/trie/src/db/checkpoint.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L177)

___

### revert

▸ **revert**(): `Promise`<`Uint8Array`\>

Reverts the latest checkpoint

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L129)

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

[packages/trie/src/db/checkpoint.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L68)

___

### shallowCopy

▸ **shallowCopy**(): [`CheckpointDB`](CheckpointDB.md)

**`Inherit Doc`**

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Implementation of

DB.shallowCopy

#### Defined in

[packages/trie/src/db/checkpoint.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L268)

___

### stats

▸ **stats**(`reset?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `reset` | `boolean` | `true` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cache` | { `hits`: `number` = 0; `reads`: `number` = 0; `writes`: `number` = 0 } |
| `cache.hits` | `number` |
| `cache.reads` | `number` |
| `cache.writes` | `number` |
| `db` | { `hits`: `number` = 0; `reads`: `number` = 0; `writes`: `number` = 0 } |
| `db.hits` | `number` |
| `db.reads` | `number` |
| `db.writes` | `number` |
| `size` | `number` |

#### Defined in

[packages/trie/src/db/checkpoint.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L246)
