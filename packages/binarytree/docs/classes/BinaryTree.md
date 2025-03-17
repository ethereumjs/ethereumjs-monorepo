[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / BinaryTree

# Class: BinaryTree

Defined in: [binaryTree.ts:33](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L33)

The basic binary tree interface, use with `import { BinaryTree } from '@ethereumjs/binarytree'`.

## Constructors

### new BinaryTree()

> **new BinaryTree**(`opts`): [`BinaryTree`](BinaryTree.md)

Defined in: [binaryTree.ts:54](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L54)

Creates a new binary tree.

#### Parameters

##### opts

[`BinaryTreeOpts`](../interfaces/BinaryTreeOpts.md)

Options for instantiating the binary tree

Note: in most cases, the static [createBinaryTree](../functions/createBinaryTree.md) constructor should be used. It uses the same API but provides sensible defaults

#### Returns

[`BinaryTree`](BinaryTree.md)

## Properties

### EMPTY\_TREE\_ROOT

> **EMPTY\_TREE\_ROOT**: `Uint8Array`

Defined in: [binaryTree.ts:38](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L38)

The root for an empty tree

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [binaryTree.ts:660](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L660)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [binaryTree.ts:112](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L112)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:669](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L669)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createBinaryProof()

> **createBinaryProof**(`_key`): `Promise`\<`any`\>

Defined in: [binaryTree.ts:587](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L587)

Creates a proof from a tree and key that can be verified using [BinaryTree.verifyBinaryProof](BinaryTree.md#verifybinaryproof).

#### Parameters

##### \_key

`Uint8Array`

#### Returns

`Promise`\<`any`\>

***

### createReadStream()

> **createReadStream**(): `any`

Defined in: [binaryTree.ts:611](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L611)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`any`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`

***

### createRootNode()

> **createRootNode**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:532](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L532)

Create empty root node for initializing an empty tree.

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`stem`, `suffixes`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:524](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L524)

Deletes a given `key` from the tree.

#### Parameters

##### stem

`Uint8Array`

the stem of the stem node to delete from

##### suffixes

`number`[]

the suffixes to delete

#### Returns

`Promise`\<`void`\>

A Promise that resolves once the key is deleted.

***

### findPath()

> **findPath**(`keyInBytes`): `Promise`\<`Path`\>

Defined in: [binaryTree.ts:408](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L408)

Tries to find a path to the node for the given key.
It returns a `Path` object containing:
  - `node`: the found node (if any),
  - `stack`: an array of tuples [node, path] representing the nodes encountered,
  - `remaining`: the bits of the key that were not matched.

#### Parameters

##### keyInBytes

`Uint8Array`

the search key as a byte array.

#### Returns

`Promise`\<`Path`\>

A Promise that resolves to a Path object.

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Defined in: [binaryTree.ts:699](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L699)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### fromProof()

> **fromProof**(`_proof`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:579](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L579)

Saves the nodes from a proof into the tree.

#### Parameters

##### \_proof

`any`

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`stem`, `suffixes`): `Promise`\<(`null` \| `Uint8Array`)[]\>

Defined in: [binaryTree.ts:132](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L132)

Gets values at a given binary tree `stem` and set of suffixes

#### Parameters

##### stem

`Uint8Array`

the stem of the stem node where we're seeking values

##### suffixes

`number`[]

an array of suffixes corresponding to the values desired

#### Returns

`Promise`\<(`null` \| `Uint8Array`)[]\>

A Promise that resolves to an array of `Uint8Array`s or `null` depending on if values were found.
If the stem is not found, will return an empty array.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [binaryTree.ts:652](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L652)

Is the tree during a checkpoint phase?

#### Returns

`boolean`

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:643](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L643)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`stem`, `suffixes`, `values`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:161](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L161)

Stores a given `value` at the given `key` or performs a deletion if `value` is null.

#### Parameters

##### stem

`Uint8Array`

the stem (must be 31 bytes) to store the value at.

##### suffixes

`number`[]

array of suffixes at which to store individual values.

##### values

(`null` \| `Uint8Array`)[]

the value(s) to store (or null for deletion).

#### Returns

`Promise`\<`void`\>

A Promise that resolves once the value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:685](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L685)

Reverts the tree to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value`?): `Uint8Array`

Defined in: [binaryTree.ts:93](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L93)

Gets and/or Sets the current root of the `tree`

#### Parameters

##### value?

`null` | `Uint8Array`

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`putStack`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:564](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L564)

Saves a stack of nodes to the database.

#### Parameters

##### putStack

\[`Uint8Array`, `null` \| [`BinaryNode`](../type-aliases/BinaryNode.md)\][]

an array of tuples of keys (the partial path of the node in the trie) and nodes (BinaryNodes)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`): [`BinaryTree`](BinaryTree.md)

Defined in: [binaryTree.ts:627](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L627)

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

[`BinaryTree`](BinaryTree.md)

***

### updateBranch()

> **updateBranch**(`stemNode`, `nearestNode`, `pathToNode`, `pathToParent`): `undefined` \| `object`[]

Defined in: [binaryTree.ts:344](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L344)

Helper method for updating or creating the parent internal node for a given stem node.
If the nearest node is a stem node with a different stem, a new internal node is created
to branch at the first differing bit.
If the nearest node is an internal node, its child reference is updated.

#### Parameters

##### stemNode

`StemBinaryNode`

The child stem node that will be referenced by the new/updated internal node.

##### nearestNode

[`BinaryNode`](../type-aliases/BinaryNode.md)

The nearest node to the new stem node.

##### pathToNode

`number`[]

The path (in bits) to `nearestNode` as known from the trie.

##### pathToParent

`number`[]

#### Returns

`undefined` \| `object`[]

An array of nodes and their partial paths from the new stem node to the branch parent node
         or `undefined` if no changes were made.

***

### verifyBinaryProof()

> **verifyBinaryProof**(`_rootHash`, `_key`, `_proof`): `Promise`\<`null` \| `Uint8Array`\>

Defined in: [binaryTree.ts:599](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L599)

Verifies a proof.

#### Parameters

##### \_rootHash

`Uint8Array`

##### \_key

`Uint8Array`

##### \_proof

`any`

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.
