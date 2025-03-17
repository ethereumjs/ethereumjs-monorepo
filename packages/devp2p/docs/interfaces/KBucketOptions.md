[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / KBucketOptions

# Interface: KBucketOptions

Defined in: [packages/devp2p/src/types.ts:214](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L214)

## Properties

### arbiter()?

> `optional` **arbiter**: (`incumbent`, `candidate`) => [`Contact`](Contact.md)

Defined in: [packages/devp2p/src/types.ts:240](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L240)

An optional arbiter function that given two `contact` objects with the same `id`,
returns the desired object to be used for updating the k-bucket.
Defaults to vectorClock arbiter function.

#### Parameters

##### incumbent

[`Contact`](Contact.md)

##### candidate

[`Contact`](Contact.md)

#### Returns

[`Contact`](Contact.md)

***

### distance()?

> `optional` **distance**: (`firstId`, `secondId`) => `number`

Defined in: [packages/devp2p/src/types.ts:234](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L234)

An optional distance function that gets two id Uint8Arrays and return distance between them as a number.

#### Parameters

##### firstId

`Uint8Array`

##### secondId

`Uint8Array`

#### Returns

`number`

***

### localNodeId?

> `optional` **localNodeId**: `Uint8Array`

Defined in: [packages/devp2p/src/types.ts:219](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L219)

An optional Uint8Array representing the local node id.
If not provided, a local node id will be created via `randomBytes(20)`.

***

### metadata?

> `optional` **metadata**: `object`

Defined in: [packages/devp2p/src/types.ts:247](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L247)

Optional satellite data to include
with the k-bucket. `metadata` property is guaranteed not be altered by,
it is provided as an explicit container for users of k-bucket to store
implementation-specific data.

***

### numberOfNodesPerKBucket?

> `optional` **numberOfNodesPerKBucket**: `number`

Defined in: [packages/devp2p/src/types.ts:224](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L224)

The number of nodes that a k-bucket can contain before being full or split.
Defaults to 20.

***

### numberOfNodesToPing?

> `optional` **numberOfNodesToPing**: `number`

Defined in: [packages/devp2p/src/types.ts:230](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L230)

The number of nodes to ping when a bucket that should not be split becomes full.
KBucket will emit a `ping` event that contains `numberOfNodesToPing` nodes that have not been contacted the longest.
Defaults to 3.
