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

[packages/trie/src/db/checkpoint.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L50)

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

[packages/trie/src/db/checkpoint.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L34)

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

• **db**: `DB`<`string`, `string` \| `Uint8Array`\>

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

[packages/trie/src/db/checkpoint.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L230)

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

[packages/trie/src/db/checkpoint.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L92)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits the latest checkpoint

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L99)

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

[packages/trie/src/db/checkpoint.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L208)

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

[packages/trie/src/db/checkpoint.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L139)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the DB during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/db/checkpoint.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L84)

___

### open

▸ **open**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

DB.open

#### Defined in

[packages/trie/src/db/checkpoint.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L291)

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

[packages/trie/src/db/checkpoint.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L184)

___

### revert

▸ **revert**(): `Promise`<`Uint8Array`\>

Reverts the latest checkpoint

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[packages/trie/src/db/checkpoint.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L131)

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

[packages/trie/src/db/checkpoint.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L70)

___

### shallowCopy

▸ **shallowCopy**(): [`CheckpointDB`](CheckpointDB.md)

**`Inherit Doc`**

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Implementation of

DB.shallowCopy

#### Defined in

[packages/trie/src/db/checkpoint.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L283)

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

[packages/trie/src/db/checkpoint.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/db/checkpoint.ts#L261)
