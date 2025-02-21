[@ethereumjs/verkle](../README.md) / VerkleTree

# Class: VerkleTree

The basic verkle tree interface, use with `import { VerkleTree } from '@ethereumjs/verkle'`.

## Table of contents

### Constructors

- [constructor](VerkleTree.md#constructor)

### Properties

- [EMPTY\_TREE\_ROOT](VerkleTree.md#empty_tree_root)

### Methods

- [batch](VerkleTree.md#batch)
- [checkRoot](VerkleTree.md#checkroot)
- [checkpoint](VerkleTree.md#checkpoint)
- [commit](VerkleTree.md#commit)
- [createProof](VerkleTree.md#createproof)
- [createReadStream](VerkleTree.md#createreadstream)
- [database](VerkleTree.md#database)
- [findLeafNode](VerkleTree.md#findleafnode)
- [findPath](VerkleTree.md#findpath)
- [flushCheckpoints](VerkleTree.md#flushcheckpoints)
- [fromProof](VerkleTree.md#fromproof)
- [get](VerkleTree.md#get)
- [hasCheckpoints](VerkleTree.md#hascheckpoints)
- [lookupNode](VerkleTree.md#lookupnode)
- [persistRoot](VerkleTree.md#persistroot)
- [put](VerkleTree.md#put)
- [revert](VerkleTree.md#revert)
- [root](VerkleTree.md#root)
- [saveStack](VerkleTree.md#savestack)
- [shallowCopy](VerkleTree.md#shallowcopy)
- [verifyProof](VerkleTree.md#verifyproof)
- [walkTree](VerkleTree.md#walktree)
- [create](VerkleTree.md#create)

## Constructors

### constructor

• **new VerkleTree**(`opts?`)

Creates a new verkle tree.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | [`VerkleTreeOpts`](../interfaces/VerkleTreeOpts.md) | Options for instantiating the verkle tree  Note: in most cases, the static [create](VerkleTree.md#create) constructor should be used.  It uses the same API but provides sensible defaults |

#### Defined in

[verkleTree.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L50)

## Properties

### EMPTY\_TREE\_ROOT

• **EMPTY\_TREE\_ROOT**: `Uint8Array`

The root for an empty tree

#### Defined in

[verkleTree.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L36)

## Methods

### batch

▸ **batch**(`ops`): `Promise`<`void`\>

The given hash of operations (key additions or deletions) are executed on the tree
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

**`Example`**

```ts
const ops = [
   { type: 'del', key: Uint8Array.from('father') }
 , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
 , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') }
 , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
]
await tree.batch(ops)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | `BatchDBOp`<`Uint8Array`, `Uint8Array`\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[verkleTree.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L366)

___

### checkRoot

▸ **checkRoot**(`root`): `Promise`<`boolean`\>

Checks if a given root exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[verkleTree.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L120)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[verkleTree.ts:465](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L465)

___

### commit

▸ **commit**(): `Promise`<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

**`Throws`**

If not during a checkpoint phase

#### Returns

`Promise`<`void`\>

#### Defined in

[verkleTree.ts:474](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L474)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof from a tree and key that can be verified using [verifyProof](VerkleTree.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[verkleTree.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L382)

___

### createReadStream

▸ **createReadStream**(): `any`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`any`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`

#### Defined in

[verkleTree.ts:406](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L406)

___

### database

▸ **database**(`db?`): [`CheckpointDB`](CheckpointDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `db?` | `DB`<`Uint8Array`, `Uint8Array`\> |

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Defined in

[verkleTree.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L86)

___

### findLeafNode

▸ **findLeafNode**(`key`, `throwIfMissing?`): `Promise`<``null`` \| [`LeafNode`](LeafNode.md)\>

Tries to find the leaf node leading up to the given key, or null if not found.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | the search key |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<``null`` \| [`LeafNode`](LeafNode.md)\>

#### Defined in

[verkleTree.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L267)

___

### findPath

▸ **findPath**(`key`, `throwIfMissing?`): `Promise`<`Path`\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | the search key |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<`Path`\>

#### Defined in

[verkleTree.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L196)

___

### flushCheckpoints

▸ **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

[verkleTree.ts:504](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L504)

___

### fromProof

▸ **fromProof**(`proof`): `Promise`<`void`\>

Saves the nodes from a proof into the tree.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<`void`\>

#### Defined in

[verkleTree.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L374)

___

### get

▸ **get**(`key`, `throwIfMissing?`): `Promise`<``null`` \| `Uint8Array`\>

Gets a value given a `key`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` | the key to search for |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<``null`` \| `Uint8Array`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

#### Defined in

[verkleTree.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L139)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the tree during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[verkleTree.ts:457](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L457)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<``null`` \| [`VerkleNode`](../README.md#verklenode)\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

`Promise`<``null`` \| [`VerkleNode`](../README.md#verklenode)\>

#### Defined in

[verkleTree.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L289)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Defined in

[verkleTree.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L438)

___

### put

▸ **put**(`key`, `value`): `Promise`<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | the key to store the value at |
| `value` | `Uint8Array` | the value to store |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is stored.

#### Defined in

[verkleTree.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L159)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the tree to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[verkleTree.ts:490](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L490)

___

### root

▸ **root**(`value?`): `Uint8Array`

Gets and/or Sets the current root of the `tree`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | ``null`` \| `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[verkleTree.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L101)

___

### saveStack

▸ **saveStack**(`key`, `stack`, `opStack`): `Promise`<`void`\>

Saves a stack of nodes to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | the key. Should follow the stack |
| `stack` | [`VerkleNode`](../README.md#verklenode)[] | a stack of nodes to the value given by the key |
| `opStack` | `PutBatch`<`Uint8Array`, `Uint8Array`\>[] | a stack of levelup operations to commit at the end of this function |

#### Returns

`Promise`<`void`\>

#### Defined in

[verkleTree.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L326)

___

### shallowCopy

▸ **shallowCopy**(`includeCheckpoints?`): [`VerkleTree`](VerkleTree.md)

Returns a copy of the underlying tree.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will not
recreate a new LRU cache but initialize with cache
being deactivated.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

#### Returns

[`VerkleTree`](VerkleTree.md)

#### Defined in

[verkleTree.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L422)

___

### verifyProof

▸ **verifyProof**(`rootHash`, `key`, `proof`): `Promise`<``null`` \| `Uint8Array`\>

Verifies a proof.

**`Throws`**

If proof is found to be invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Uint8Array` |
| `key` | `Uint8Array` |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<``null`` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Defined in

[verkleTree.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L394)

___

### walkTree

▸ **walkTree**(`root`, `onFound`): `Promise`<`void`\>

Walks a tree until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Uint8Array` |  |
| `onFound` | [`FoundNodeFunction`](../README.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking tree.

#### Defined in

[verkleTree.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L258)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`VerkleTree`](VerkleTree.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`VerkleTreeOpts`](../interfaces/VerkleTreeOpts.md) |

#### Returns

`Promise`<[`VerkleTree`](VerkleTree.md)\>

#### Defined in

[verkleTree.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L66)
