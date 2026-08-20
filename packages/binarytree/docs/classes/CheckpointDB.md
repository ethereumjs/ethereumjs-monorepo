[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / CheckpointDB

# Class: CheckpointDB

Defined in: [db/checkpoint.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L15)

Checkpoint-aware DB wrapper with optional LRU node cache for binary trees.

## Implements

- `DB`

## Constructors

### Constructor

> **new CheckpointDB**(`opts`): `CheckpointDB`

Defined in: [db/checkpoint.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L49)

Initialize a DB instance.

#### Parameters

##### opts

[`CheckpointDBOpts`](../interfaces/CheckpointDBOpts.md)

#### Returns

`CheckpointDB`

## Properties

### \_stats

> **\_stats**: `object`

Defined in: [db/checkpoint.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L33)

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

Defined in: [db/checkpoint.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L18)

***

### checkpoints

> **checkpoints**: [`Checkpoint`](../type-aliases/Checkpoint.md)[]

Defined in: [db/checkpoint.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L16)

***

### db

> **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [db/checkpoint.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L17)

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L241)

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

Defined in: [db/checkpoint.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L92)

Push a new checkpoint onto the stack.

#### Parameters

##### root

`Uint8Array`

Tree root hash at this checkpoint boundary

#### Returns

`void`

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L99)

Commits the latest checkpoint

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L218)

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

Defined in: [db/checkpoint.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L139)

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

Defined in: [db/checkpoint.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L303)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

#### Implementation of

`DB.open`

***

### put()

> **put**(`key`, `value`): `Promise`\<`void`\>

Defined in: [db/checkpoint.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L193)

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

Defined in: [db/checkpoint.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L131)

Reverts the latest checkpoint

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### setCheckpoints()

> **setCheckpoints**(`checkpoints`): `void`

Defined in: [db/checkpoint.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L69)

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

Defined in: [db/checkpoint.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L295)

#### Returns

`CheckpointDB`

#### Inherit Doc

#### Implementation of

`DB.shallowCopy`

***

### stats()

> **stats**(`reset?`): `object`

Defined in: [db/checkpoint.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/db/checkpoint.ts#L273)

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
