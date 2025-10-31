[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / CheckpointDB

# Class: CheckpointDB

Defined in: [db/checkpoint.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L16)

DB is a thin wrapper around the underlying levelup db,
which validates inputs and sets encoding type.

## Implements

- `DB`

## Constructors

### Constructor

> **new CheckpointDB**(`opts`): `CheckpointDB`

Defined in: [db/checkpoint.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L50)

Initialize a DB instance.

#### Parameters

##### opts

[`CheckpointDBOpts`](../interfaces/CheckpointDBOpts.md)

#### Returns

`CheckpointDB`

## Properties

### \_stats

> **\_stats**: `object`

Defined in: [db/checkpoint.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L34)

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

Defined in: [db/checkpoint.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L19)

***

### checkpoints

> **checkpoints**: [`Checkpoint`](../type-aliases/Checkpoint.md)[]

Defined in: [db/checkpoint.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L17)

***

### db

> **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [db/checkpoint.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L18)

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L229)

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

Defined in: [db/checkpoint.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L91)

Adds a new checkpoint to the stack

#### Parameters

##### root

`Uint8Array`

#### Returns

`void`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L98)

Commits the latest checkpoint

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L207)

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

Defined in: [db/checkpoint.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L138)

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

Defined in: [db/checkpoint.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L83)

Is the DB during a checkpoint phase?

#### Returns

`boolean`

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L291)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

#### Implementation of

`DB.open`

***

### put()

> **put**(`key`, `value`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L183)

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

Defined in: [db/checkpoint.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L130)

Reverts the latest checkpoint

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### setCheckpoints()

> **setCheckpoints**(`checkpoints`): `void`

Defined in: [db/checkpoint.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L69)

Flush the checkpoints and use the given checkpoints instead.

#### Parameters

##### checkpoints

[`Checkpoint`](../type-aliases/Checkpoint.md)[]

#### Returns

`void`

***

### shallowCopy()

> **shallowCopy**(): `CheckpointDB`

Defined in: [db/checkpoint.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L283)

#### Returns

`CheckpointDB`

#### Inherit Doc

#### Implementation of

`DB.shallowCopy`

***

### stats()

> **stats**(`reset`): `object`

Defined in: [db/checkpoint.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L261)

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
