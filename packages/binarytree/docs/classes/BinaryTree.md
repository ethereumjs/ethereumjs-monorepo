[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / BinaryTree

# Class: BinaryTree

Defined in: [binaryTree.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L38)

The basic binary tree interface, use with `import { BinaryTree } from '@ethereumjs/binarytree'`.

A BinaryTree object can be created with the constructor method:

- [createBinaryTree](../functions/createBinaryTree.md)

## Constructors

### Constructor

> **new BinaryTree**(`opts`): `BinaryTree`

Defined in: [binaryTree.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L59)

Creates a new binary tree.

#### Parameters

##### opts

[`BinaryTreeOpts`](../interfaces/BinaryTreeOpts.md)

Options for instantiating the binary tree

Note: in most cases, the static [createBinaryTree](../functions/createBinaryTree.md) constructor should be used. It uses the same API but provides sensible defaults

#### Returns

`BinaryTree`

## Properties

### EMPTY\_TREE\_ROOT

> **EMPTY\_TREE\_ROOT**: `Uint8Array`

Defined in: [binaryTree.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L43)

The root for an empty tree

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [binaryTree.ts:652](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L652)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [binaryTree.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L117)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:661](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L661)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createBinaryProof()

> **createBinaryProof**(`key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

Defined in: [binaryTree.ts:585](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L585)

Creates a proof from a tree and key that can be verified using BinaryTree.verifyBinaryProof.

#### Parameters

##### key

`Uint8Array`

a 32 byte binary tree key (31 byte stem + 1 byte suffix)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

***

### createReadStream()

> **createReadStream**(): `any`

Defined in: [binaryTree.ts:603](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L603)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`any`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`

***

### createRootNode()

> **createRootNode**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L538)

Create empty root node for initializing an empty tree.

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`stem`, `suffixes`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:530](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L530)

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

Defined in: [binaryTree.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L417)

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

Defined in: [binaryTree.ts:691](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L691)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### get()

> **get**(`stem`, `suffixes`): `Promise`\<(`Uint8Array`\<`ArrayBufferLike`\> \| `null`)[]\>

Defined in: [binaryTree.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L137)

Gets values at a given binary tree `stem` and set of suffixes

#### Parameters

##### stem

`Uint8Array`

the stem of the stem node where we're seeking values

##### suffixes

`number`[]

an array of suffixes corresponding to the values desired

#### Returns

`Promise`\<(`Uint8Array`\<`ArrayBufferLike`\> \| `null`)[]\>

A Promise that resolves to an array of `Uint8Array`s or `null` depending on if values were found.
If the stem is not found, will return an empty array.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [binaryTree.ts:644](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L644)

Is the tree during a checkpoint phase?

#### Returns

`boolean`

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:635](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L635)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`stem`, `suffixes`, `values`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L167)

Stores a given `value` at the given `key` or performs a deletion if `value` is null.

#### Parameters

##### stem

`Uint8Array`

the stem (must be 31 bytes) to store the value at.

##### suffixes

`number`[]

array of suffixes at which to store individual values.

##### values

(`Uint8Array`\<`ArrayBufferLike`\> \| `null`)[]

the value(s) to store (or null for deletion).

#### Returns

`Promise`\<`void`\>

A Promise that resolves once the value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:677](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L677)

Reverts the tree to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Defined in: [binaryTree.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L98)

Gets and/or Sets the current root of the `tree`

#### Parameters

##### value?

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`putStack`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:570](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L570)

Saves a stack of nodes to the database.

#### Parameters

##### putStack

\[`Uint8Array`\<`ArrayBufferLike`\>, [`BinaryNode`](../type-aliases/BinaryNode.md) \| `null`\][]

an array of tuples of keys (the partial path of the node in the trie) and nodes (BinaryNodes)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`): `BinaryTree`

Defined in: [binaryTree.ts:619](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L619)

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

`BinaryTree`

***

### updateBranch()

> **updateBranch**(`stemNode`, `nearestNode`, `pathToNode`, `pathToParent`): `object`[] \| `undefined`

Defined in: [binaryTree.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L353)

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

`object`[] \| `undefined`

An array of nodes and their partial paths from the new stem node to the branch parent node
         or `undefined` if no changes were made.
