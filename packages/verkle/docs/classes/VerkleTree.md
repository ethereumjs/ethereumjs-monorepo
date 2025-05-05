[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / VerkleTree

# Class: VerkleTree

Defined in: [verkleTree.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L31)

The basic verkle tree interface, use with `import { VerkleTree } from '@ethereumjs/verkle'`.

## Constructors

### Constructor

> **new VerkleTree**(`opts`): `VerkleTree`

Defined in: [verkleTree.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L55)

Creates a new verkle tree.

#### Parameters

##### opts

[`VerkleTreeOpts`](../interfaces/VerkleTreeOpts.md)

Options for instantiating the verkle tree

Note: in most cases, the static [createVerkleTree](../functions/createVerkleTree.md) constructor should be used. It uses the same API but provides sensible defaults

#### Returns

`VerkleTree`

## Properties

### \_opts

> **\_opts**: [`VerkleTreeOpts`](../interfaces/VerkleTreeOpts.md)

Defined in: [verkleTree.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L32)

***

### EMPTY\_TREE\_ROOT

> **EMPTY\_TREE\_ROOT**: `Uint8Array`

Defined in: [verkleTree.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L35)

The root for an empty tree

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [verkleTree.ts:639](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L639)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [verkleTree.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L115)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L648)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createReadStream()

> **createReadStream**(): `any`

Defined in: [verkleTree.ts:589](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L589)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`any`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`

***

### createRootNode()

> **createRootNode**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L523)

Create empty root node for initializing an empty tree.

#### Returns

`Promise`\<`void`\>

***

### createVerkleProof()

> **createVerkleProof**(`_key`): `Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Defined in: [verkleTree.ts:565](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L565)

Creates a proof from a tree and key that can be verified using [VerkleTree.verifyVerkleProof](#verifyverkleproof).

#### Parameters

##### \_key

`Uint8Array`

#### Returns

`Promise`\<[`Proof`](../type-aliases/Proof.md)\>

***

### del()

> **del**(`stem`, `suffixes`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L329)

#### Parameters

##### stem

`Uint8Array`

##### suffixes

`number`[]

#### Returns

`Promise`\<`void`\>

***

### findPath()

> **findPath**(`key`): `Promise`\<`Path`\>

Defined in: [verkleTree.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L424)

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

##### key

`Uint8Array`

the search key

#### Returns

`Promise`\<`Path`\>

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Defined in: [verkleTree.ts:678](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L678)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### fromProof()

> **fromProof**(`_proof`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:557](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L557)

Saves the nodes from a proof into the tree.

#### Parameters

##### \_proof

[`Proof`](../type-aliases/Proof.md)

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`stem`, `suffixes`): `Promise`\<(`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>)[]\>

Defined in: [verkleTree.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L135)

Gets values at a given verkle `stem` and set of suffixes

#### Parameters

##### stem

`Uint8Array`

the stem of the leaf node where we're seeking values

##### suffixes

`number`[]

an array of suffixes corresponding to the values desired

#### Returns

`Promise`\<(`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>)[]\>

A Promise that resolves to an array of `Uint8Array`s if a value
was found or `undefined` if no value was found at a given suffixes.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [verkleTree.ts:631](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L631)

Is the tree during a checkpoint phase?

#### Returns

`boolean`

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:622](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L622)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`stem`, `suffixes`, `values`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L166)

Stores given `values` at the given `stem` and `suffixes` or do a delete if `value` is empty Uint8Array

#### Parameters

##### stem

`Uint8Array`

##### suffixes

`number`[]

array of suffixes at which to store individual values

##### values

(`0` \| `Uint8Array`\<`ArrayBufferLike`\>)[] = `[]`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value(s) are stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:664](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L664)

Reverts the tree to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Defined in: [verkleTree.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L96)

Gets and/or Sets the current root of the `tree`

#### Parameters

##### value?

`null` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`putStack`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:542](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L542)

Saves a stack of nodes to the database.

#### Parameters

##### putStack

\[`Uint8Array`\<`ArrayBufferLike`\>, `null` \| [`VerkleNode`](../type-aliases/VerkleNode.md)\][]

an array of tuples of keys (the partial path of the node in the trie) and nodes (VerkleNodes)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`): `VerkleTree`

Defined in: [verkleTree.ts:605](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L605)

Returns a copy of the underlying tree.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will not
recreate a new LRU cache but initialize with cache
being deactivated.

#### Parameters

##### includeCheckpoints

`boolean` = `true`

If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.

#### Returns

`VerkleTree`

***

### updateParent()

> **updateParent**(`leafNode`, `nearestNode`, `pathToNode`): `Promise`\<`undefined` \| \{ `lastPath`: `Uint8Array`; `node`: [`VerkleNode`](../type-aliases/VerkleNode.md); \}\>

Defined in: [verkleTree.ts:341](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L341)

Helper method for updating or creating the parent internal node for a given leaf node

#### Parameters

##### leafNode

[`LeafVerkleNode`](LeafVerkleNode.md)

the child leaf node that will be referenced by the new/updated internal node
returned by this method

##### nearestNode

[`VerkleNode`](../type-aliases/VerkleNode.md)

the nearest node to the new leaf node

##### pathToNode

`Uint8Array`

the path to `nearestNode`

#### Returns

`Promise`\<`undefined` \| \{ `lastPath`: `Uint8Array`; `node`: [`VerkleNode`](../type-aliases/VerkleNode.md); \}\>

a tuple of the updated parent node and the path to that parent (i.e. the partial stem of the leaf node that leads to the parent)

***

### verifyVerkleProof()

> **verifyVerkleProof**(`_rootHash`, `_key`, `_proof`): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [verkleTree.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L577)

Verifies a proof.

#### Parameters

##### \_rootHash

`Uint8Array`

##### \_key

`Uint8Array`

##### \_proof

[`Proof`](../type-aliases/Proof.md)

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.
