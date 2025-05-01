[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / BinaryTree

# Class: BinaryTree

Defined in: [binaryTree.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L34)

The basic binary tree interface, use with `import { BinaryTree } from '@ethereumjs/binarytree'`.

## Constructors

### Constructor

> **new BinaryTree**(`opts`): `BinaryTree`

Defined in: [binaryTree.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L55)

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

Defined in: [binaryTree.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L39)

The root for an empty tree

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [binaryTree.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L648)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [binaryTree.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L113)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:657](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L657)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createBinaryProof()

> **createBinaryProof**(`key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

Defined in: [binaryTree.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L581)

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

Defined in: [binaryTree.ts:599](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L599)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`any`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `tree`

***

### createRootNode()

> **createRootNode**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L534)

Create empty root node for initializing an empty tree.

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`stem`, `suffixes`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:526](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L526)

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

Defined in: [binaryTree.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L413)

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

Defined in: [binaryTree.ts:687](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L687)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### get()

> **get**(`stem`, `suffixes`): `Promise`\<(`null` \| `Uint8Array`\<`ArrayBufferLike`\>)[]\>

Defined in: [binaryTree.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L133)

Gets values at a given binary tree `stem` and set of suffixes

#### Parameters

##### stem

`Uint8Array`

the stem of the stem node where we're seeking values

##### suffixes

`number`[]

an array of suffixes corresponding to the values desired

#### Returns

`Promise`\<(`null` \| `Uint8Array`\<`ArrayBufferLike`\>)[]\>

A Promise that resolves to an array of `Uint8Array`s or `null` depending on if values were found.
If the stem is not found, will return an empty array.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [binaryTree.ts:640](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L640)

Is the tree during a checkpoint phase?

#### Returns

`boolean`

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:631](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L631)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`stem`, `suffixes`, `values`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L163)

Stores a given `value` at the given `key` or performs a deletion if `value` is null.

#### Parameters

##### stem

`Uint8Array`

the stem (must be 31 bytes) to store the value at.

##### suffixes

`number`[]

array of suffixes at which to store individual values.

##### values

(`null` \| `Uint8Array`\<`ArrayBufferLike`\>)[]

the value(s) to store (or null for deletion).

#### Returns

`Promise`\<`void`\>

A Promise that resolves once the value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [binaryTree.ts:673](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L673)

Reverts the tree to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Defined in: [binaryTree.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L94)

Gets and/or Sets the current root of the `tree`

#### Parameters

##### value?

`null` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`putStack`): `Promise`\<`void`\>

Defined in: [binaryTree.ts:566](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L566)

Saves a stack of nodes to the database.

#### Parameters

##### putStack

\[`Uint8Array`\<`ArrayBufferLike`\>, `null` \| [`BinaryNode`](../type-aliases/BinaryNode.md)\][]

an array of tuples of keys (the partial path of the node in the trie) and nodes (BinaryNodes)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`): `BinaryTree`

Defined in: [binaryTree.ts:615](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L615)

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

> **updateBranch**(`stemNode`, `nearestNode`, `pathToNode`, `pathToParent`): `undefined` \| `object`[]

Defined in: [binaryTree.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/binaryTree.ts#L349)

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
