[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / VerkleTree

# Class: VerkleTree

Defined in: [verkleTree.ts:24](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L24)

The basic verkle tree interface, use with `import { VerkleTree } from '@ethereumjs/verkle'`.

## Constructors

### new VerkleTree()

> **new VerkleTree**(`opts`): [`VerkleTree`](VerkleTree.md)

Defined in: [verkleTree.ts:48](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L48)

Creates a new verkle tree.

#### Parameters

##### opts

[`VerkleTreeOpts`](../interfaces/VerkleTreeOpts.md)

Options for instantiating the verkle tree

Note: in most cases, the static [createVerkleTree](../functions/createVerkleTree.md) constructor should be used. It uses the same API but provides sensible defaults

#### Returns

[`VerkleTree`](VerkleTree.md)

## Properties

### \_opts

> **\_opts**: [`VerkleTreeOpts`](../interfaces/VerkleTreeOpts.md)

Defined in: [verkleTree.ts:25](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L25)

***

### EMPTY\_TREE\_ROOT

> **EMPTY\_TREE\_ROOT**: `Uint8Array`

Defined in: [verkleTree.ts:28](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L28)

The root for an empty tree

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [verkleTree.ts:625](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L625)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [verkleTree.ts:108](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L108)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:634](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L634)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createReadStream()

> **createReadStream**(): `any`

Defined in: [verkleTree.ts:575](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L575)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`any`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`

***

### createRootNode()

> **createRootNode**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:509](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L509)

Create empty root node for initializing an empty tree.

#### Returns

`Promise`\<`void`\>

***

### createVerkleProof()

> **createVerkleProof**(`_key`): `Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Defined in: [verkleTree.ts:551](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L551)

Creates a proof from a tree and key that can be verified using [VerkleTree.verifyVerkleProof](VerkleTree.md#verifyverkleproof).

#### Parameters

##### \_key

`Uint8Array`

#### Returns

`Promise`\<[`Proof`](../type-aliases/Proof.md)\>

***

### del()

> **del**(`stem`, `suffixes`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:318](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L318)

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

Defined in: [verkleTree.ts:411](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L411)

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

Defined in: [verkleTree.ts:664](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L664)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### fromProof()

> **fromProof**(`_proof`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:543](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L543)

Saves the nodes from a proof into the tree.

#### Parameters

##### \_proof

[`Proof`](../type-aliases/Proof.md)

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`stem`, `suffixes`): `Promise`\<(`undefined` \| `Uint8Array`)[]\>

Defined in: [verkleTree.ts:128](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L128)

Gets values at a given verkle `stem` and set of suffixes

#### Parameters

##### stem

`Uint8Array`

the stem of the leaf node where we're seeking values

##### suffixes

`number`[]

an array of suffixes corresponding to the values desired

#### Returns

`Promise`\<(`undefined` \| `Uint8Array`)[]\>

A Promise that resolves to an array of `Uint8Array`s if a value
was found or `undefined` if no value was found at a given suffixes.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [verkleTree.ts:617](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L617)

Is the tree during a checkpoint phase?

#### Returns

`boolean`

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:608](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L608)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`stem`, `suffixes`, `values`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:158](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L158)

Stores given `values` at the given `stem` and `suffixes` or do a delete if `value` is empty Uint8Array

#### Parameters

##### stem

`Uint8Array`

##### suffixes

`number`[]

array of suffixes at which to store individual values

##### values

(`Uint8Array` \| [`Untouched`](../enumerations/LeafVerkleNodeValue.md#untouched))[] = `[]`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value(s) are stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [verkleTree.ts:650](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L650)

Reverts the tree to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value`?): `Uint8Array`

Defined in: [verkleTree.ts:89](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L89)

Gets and/or Sets the current root of the `tree`

#### Parameters

##### value?

`null` | `Uint8Array`

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`putStack`): `Promise`\<`void`\>

Defined in: [verkleTree.ts:528](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L528)

Saves a stack of nodes to the database.

#### Parameters

##### putStack

\[`Uint8Array`, `null` \| [`VerkleNode`](../type-aliases/VerkleNode.md)\][]

an array of tuples of keys (the partial path of the node in the trie) and nodes (VerkleNodes)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`): [`VerkleTree`](VerkleTree.md)

Defined in: [verkleTree.ts:591](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L591)

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

[`VerkleTree`](VerkleTree.md)

***

### updateParent()

> **updateParent**(`leafNode`, `nearestNode`, `pathToNode`): `Promise`\<`undefined` \| \{ `lastPath`: `Uint8Array`; `node`: [`VerkleNode`](../type-aliases/VerkleNode.md); \}\>

Defined in: [verkleTree.ts:330](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L330)

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

> **verifyVerkleProof**(`_rootHash`, `_key`, `_proof`): `Promise`\<`null` \| `Uint8Array`\>

Defined in: [verkleTree.ts:563](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/verkleTree.ts#L563)

Verifies a proof.

#### Parameters

##### \_rootHash

`Uint8Array`

##### \_key

`Uint8Array`

##### \_proof

[`Proof`](../type-aliases/Proof.md)

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.
