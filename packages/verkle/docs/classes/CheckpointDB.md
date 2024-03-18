[@ethereumjs/verkle](../README.md) / CheckpointDB

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

[db/checkpoint.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L43)

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

[db/checkpoint.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L27)

___

### cacheSize

• `Readonly` **cacheSize**: `number`

#### Defined in

[db/checkpoint.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L14)

___

### checkpoints

• **checkpoints**: [`Checkpoint`](../README.md#checkpoint)[]

#### Defined in

[db/checkpoint.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L12)

___

### db

• **db**: `DB`<`Uint8Array`, `Uint8Array`\>

#### Defined in

[db/checkpoint.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L13)

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

[db/checkpoint.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L217)

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

[db/checkpoint.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L83)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the latest checkpoint

#### Returns

`Promise`<`void`\>

#### Defined in

[db/checkpoint.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L90)

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

[db/checkpoint.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L195)

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

[db/checkpoint.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L134)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the DB during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[db/checkpoint.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L75)

___

### open

▸ **open**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

DB.open

#### Defined in

[db/checkpoint.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L267)

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

[db/checkpoint.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L173)

___

### revert

▸ **revert**(): `Promise`<`Uint8Array`\>

Reverts the latest checkpoint

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[db/checkpoint.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L126)

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

[db/checkpoint.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L61)

___

### shallowCopy

▸ **shallowCopy**(): [`CheckpointDB`](CheckpointDB.md)

**`Inherit Doc`**

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Implementation of

DB.shallowCopy

#### Defined in

[db/checkpoint.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L263)

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

[db/checkpoint.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L241)
