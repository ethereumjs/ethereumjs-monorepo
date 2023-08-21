[@ethereumjs/devp2p](../README.md) / KBucketOptions

# Interface: KBucketOptions

## Table of contents

### Properties

- [arbiter](KBucketOptions.md#arbiter)
- [distance](KBucketOptions.md#distance)
- [localNodeId](KBucketOptions.md#localnodeid)
- [metadata](KBucketOptions.md#metadata)
- [numberOfNodesPerKBucket](KBucketOptions.md#numberofnodesperkbucket)
- [numberOfNodesToPing](KBucketOptions.md#numberofnodestoping)

## Properties

### arbiter

• `Optional` **arbiter**: (`incumbent`: [`Contact`](Contact.md), `candidate`: [`Contact`](Contact.md)) => [`Contact`](Contact.md)

#### Type declaration

▸ (`incumbent`, `candidate`): [`Contact`](Contact.md)

An optional arbiter function that given two `contact` objects with the same `id`,
returns the desired object to be used for updating the k-bucket.
Defaults to vectorClock arbiter function.

##### Parameters

| Name | Type |
| :------ | :------ |
| `incumbent` | [`Contact`](Contact.md) |
| `candidate` | [`Contact`](Contact.md) |

##### Returns

[`Contact`](Contact.md)

#### Defined in

[packages/devp2p/src/types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L162)

___

### distance

• `Optional` **distance**: (`firstId`: `Uint8Array`, `secondId`: `Uint8Array`) => `number`

#### Type declaration

▸ (`firstId`, `secondId`): `number`

An optional distance function that gets two id Uint8Arrays and return distance between them as a number.

##### Parameters

| Name | Type |
| :------ | :------ |
| `firstId` | `Uint8Array` |
| `secondId` | `Uint8Array` |

##### Returns

`number`

#### Defined in

[packages/devp2p/src/types.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L156)

___

### localNodeId

• `Optional` **localNodeId**: `Uint8Array`

An optional Uint8Array representing the local node id.
If not provided, a local node id will be created via `randomBytes(20)`.

#### Defined in

[packages/devp2p/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L141)

___

### metadata

• `Optional` **metadata**: `object`

Optional satellite data to include
with the k-bucket. `metadata` property is guaranteed not be altered by,
it is provided as an explicit container for users of k-bucket to store
implementation-specific data.

#### Defined in

[packages/devp2p/src/types.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L169)

___

### numberOfNodesPerKBucket

• `Optional` **numberOfNodesPerKBucket**: `number`

The number of nodes that a k-bucket can contain before being full or split.
Defaults to 20.

#### Defined in

[packages/devp2p/src/types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L146)

___

### numberOfNodesToPing

• `Optional` **numberOfNodesToPing**: `number`

The number of nodes to ping when a bucket that should not be split becomes full.
KBucket will emit a `ping` event that contains `numberOfNodesToPing` nodes that have not been contacted the longest.
Defaults to 3.

#### Defined in

[packages/devp2p/src/types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L152)
