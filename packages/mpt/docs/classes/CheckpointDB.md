[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / CheckpointDB

# Class: CheckpointDB

Defined in: [db/checkpointDB.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L18)

Checkpoint-aware DB wrapper with optional LRU node cache.

Writes during a checkpoint go to an in-memory diff map; commit flushes to the
underlying DB.

## Implements

- `DB`

## Constructors

### Constructor

> **new CheckpointDB**(`opts`): `CheckpointDB`

Defined in: [db/checkpointDB.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L52)

Initialize a DB instance.

#### Parameters

##### opts

[`CheckpointDBOpts`](../interfaces/CheckpointDBOpts.md)

#### Returns

`CheckpointDB`

## Properties

### \_stats

> **\_stats**: `object`

Defined in: [db/checkpointDB.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L36)

#### cache

> **cache**: `object`

##### cache.hits

> **hits**: `number` = `0`

##### cache.reads

> **reads**: `number` = `0`

##### cache.writes

> **writes**: `number` = `0`

#### db

> **db**: `object`

##### db.hits

> **hits**: `number` = `0`

##### db.reads

> **reads**: `number` = `0`

##### db.writes

> **writes**: `number` = `0`

***

### cacheSize

> `readonly` **cacheSize**: `number`

Defined in: [db/checkpointDB.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L21)

***

### checkpoints

> **checkpoints**: [`Checkpoint`](../type-aliases/Checkpoint.md)[]

Defined in: [db/checkpointDB.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L19)

***

### db

> **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [db/checkpointDB.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L20)

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [db/checkpointDB.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L244)

#### Parameters

##### opStack

`BatchDBOp`[]

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

`DB.batch`

***

### checkpoint()

> **checkpoint**(`root`): `void`

Defined in: [db/checkpointDB.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L95)

Push a new checkpoint onto the stack.

#### Parameters

##### root

`Uint8Array`

Trie root hash at this checkpoint boundary

#### Returns

`void`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [db/checkpointDB.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L102)

Commits the latest checkpoint

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`): `Promise`\<`void`\>

Defined in: [db/checkpointDB.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L221)

#### Parameters

##### key

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

`DB.del`

***

### get()

> **get**(`key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Defined in: [db/checkpointDB.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L142)

#### Parameters

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

#### Inherit Doc

#### Implementation of

`DB.get`

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [db/checkpointDB.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L86)

Is the DB during a checkpoint phase?

#### Returns

`boolean`

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: [db/checkpointDB.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L307)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

#### Implementation of

`DB.open`

***

### put()

> **put**(`key`, `value`): `Promise`\<`void`\>

Defined in: [db/checkpointDB.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L196)

#### Parameters

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

`DB.put`

***

### revert()

> **revert**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [db/checkpointDB.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L134)

Reverts the latest checkpoint

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### setCheckpoints()

> **setCheckpoints**(`checkpoints`): `void`

Defined in: [db/checkpointDB.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L72)

Replace the checkpoint stack with a copy of the given checkpoints.

#### Parameters

##### checkpoints

[`Checkpoint`](../type-aliases/Checkpoint.md)[]

Checkpoints to adopt (maps are cloned)

#### Returns

`void`

***

### shallowCopy()

> **shallowCopy**(): `CheckpointDB`

Defined in: [db/checkpointDB.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L299)

#### Returns

`CheckpointDB`

#### Inherit Doc

#### Implementation of

`DB.shallowCopy`

***

### stats()

> **stats**(`reset?`): `object`

Defined in: [db/checkpointDB.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/db/checkpointDB.ts#L277)

#### Parameters

##### reset?

`boolean` = `true`

#### Returns

`object`

##### cache

> **cache**: `object`

###### cache.hits

> **hits**: `number` = `0`

###### cache.reads

> **reads**: `number` = `0`

###### cache.writes

> **writes**: `number` = `0`

##### db

> **db**: `object`

###### db.hits

> **hits**: `number` = `0`

###### db.reads

> **reads**: `number` = `0`

###### db.writes

> **writes**: `number` = `0`

##### size

> **size**: `number`
