[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / CheckpointDB

# Class: CheckpointDB

Defined in: [db/checkpoint.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L11)

DB is a thin wrapper around the underlying levelup db,
which validates inputs and sets encoding type.

## Implements

- `DB`

## Constructors

### Constructor

> **new CheckpointDB**(`opts`): `CheckpointDB`

Defined in: [db/checkpoint.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L43)

Initialize a DB instance.

#### Parameters

##### opts

[`CheckpointDBOpts`](../interfaces/CheckpointDBOpts.md)

#### Returns

`CheckpointDB`

## Properties

### \_stats

> **\_stats**: `object`

Defined in: [db/checkpoint.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L27)

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

Defined in: [db/checkpoint.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L14)

***

### checkpoints

> **checkpoints**: [`Checkpoint`](../type-aliases/Checkpoint.md)[]

Defined in: [db/checkpoint.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L12)

***

### db

> **db**: `DB`\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [db/checkpoint.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L13)

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L217)

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

Defined in: [db/checkpoint.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L83)

Adds a new checkpoint to the stack

#### Parameters

##### root

`Uint8Array`

#### Returns

`void`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L90)

Commits the latest checkpoint

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L195)

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

> **get**(`key`): `Promise`\<`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [db/checkpoint.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L134)

#### Parameters

##### key

`Uint8Array`

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherit Doc

#### Implementation of

`DB.get`

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [db/checkpoint.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L75)

Is the DB during a checkpoint phase?

#### Returns

`boolean`

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L268)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

#### Implementation of

`DB.open`

***

### put()

> **put**(`key`, `value`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L173)

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

Defined in: [db/checkpoint.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L126)

Reverts the latest checkpoint

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### setCheckpoints()

> **setCheckpoints**(`checkpoints`): `void`

Defined in: [db/checkpoint.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L61)

Flush the checkpoints and use the given checkpoints instead.

#### Parameters

##### checkpoints

[`Checkpoint`](../type-aliases/Checkpoint.md)[]

#### Returns

`void`

***

### shallowCopy()

> **shallowCopy**(): `CheckpointDB`

Defined in: [db/checkpoint.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L264)

#### Returns

`CheckpointDB`

#### Inherit Doc

#### Implementation of

`DB.shallowCopy`

***

### stats()

> **stats**(`reset`): `object`

Defined in: [db/checkpoint.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/db/checkpoint.ts#L242)

#### Parameters

##### reset

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
