[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / MerklePatriciaTrie

# Class: MerklePatriciaTrie

Defined in: [mpt.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L61)

The basic trie interface, use with `import { MerklePatriciaTrie } from '@ethereumjs/mpt'`.

Preferred entry point: [createMPT](../functions/createMPT.md). For proof-backed sparse tries: [createMPTFromProof](../functions/createMPTFromProof.md).

Merkle Patricia Trie — a space-optimized trie where single-child nodes merge with their parent.
Node types: branch (16-way + optional value), extension (shared path), leaf (terminal value).

## Constructors

### Constructor

> **new MerklePatriciaTrie**(`opts?`): `MerklePatriciaTrie`

Defined in: [mpt.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L92)

Creates a new trie.

#### Parameters

##### opts?

[`MPTOpts`](../interfaces/MPTOpts.md)

#### Returns

`MerklePatriciaTrie`

#### Deprecated

Use [createMPT](../functions/createMPT.md) instead; it applies the same options with sensible defaults.

## Properties

### EMPTY\_TRIE\_ROOT

> **EMPTY\_TRIE\_ROOT**: `Uint8Array`

Defined in: [mpt.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L74)

The root for an empty trie

***

### walkTrieIterable

> **walkTrieIterable**: (...`args`) => `AsyncIterable`

Defined in: [mpt.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L422)

#### Parameters

##### args

...\[`Uint8Array`\<`ArrayBufferLike`\>, `number`[], `OnFound`, `NodeFilter`, `Set`\<`string`\>\]

#### Returns

`AsyncIterable`

## Methods

### \_formatNode()

> **\_formatNode**(`node`, `topLevel`, `opStack`, `remove?`): `Uint8Array`\<`ArrayBufferLike`\> \| [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md) \| [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

Defined in: [mpt.ts:810](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L810)

Serializes a node and either stores it (put) or schedules removal (del).
Nodes ≥32 bytes (or top-level) are hashed and stored; smaller nodes are inlined as raw.

#### Parameters

##### node

[`MPTNode`](../type-aliases/MPTNode.md)

the node to persist

##### topLevel

`boolean`

if true, always store (root must be in DB)

##### opStack

`BatchDBOp`[]

accumulates put/del operations for batch commit

##### remove?

`boolean` = `false`

if true, schedule del (used when pruning)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md) \| [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[]

hash (for references) or raw encoding (for inline)

***

### batch()

> **batch**(`ops`, `skipKeyTransform?`): `Promise`\<`void`\>

Defined in: [mpt.ts:849](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L849)

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### ops

`BatchDBOp`[]

Put/delete operations applied in order

##### skipKeyTransform?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Example

```ts
const ops = [
   { type: 'del', key: Uint8Array.from('father') }
 , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') } // cspell:disable-line
 , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
 , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') } // cspell:disable-line
 , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
]
await trie.batch(ops)
```

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: [mpt.ts:1025](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1025)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [mpt.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L169)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [mpt.ts:1035](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1035)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### database()

> **database**(`db?`, `valueEncoding?`): [`CheckpointDB`](CheckpointDB.md)

Defined in: [mpt.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L134)

#### Parameters

##### db?

`DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

##### valueEncoding?

`ValueEncoding`

#### Returns

[`CheckpointDB`](CheckpointDB.md)

***

### del()

> **del**(`key`, `skipKeyTransform?`): `Promise`\<`void`\>

Defined in: [mpt.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L253)

Deletes the value at `key`.

Physical DB deletes occur only when node pruning is enabled.

#### Parameters

##### key

`Uint8Array`

##### skipKeyTransform?

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

***

### findPath()

> **findPath**(`key`, `throwIfMissing?`, `partialPath?`): `Promise`\<[`Path`](../interfaces/Path.md)\>

Defined in: [mpt.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L288)

Finds the path from root to the node for the given key.
Walks the trie, matching nibbles at each level. Returns the target node (if found)
and the stack of nodes along the path (needed for updates/deletes).

#### Parameters

##### key

`Uint8Array`

the search key (bytes)

##### throwIfMissing?

`boolean` = `false`

if true, throws when nodes are missing (e.g. proof verification)

##### partialPath?

optional pre-loaded stack for resuming from a mid-path node

###### stack

[`MPTNode`](../type-aliases/MPTNode.md)[]

#### Returns

`Promise`\<[`Path`](../interfaces/Path.md)\>

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Defined in: [mpt.ts:1067](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1067)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### get()

> **get**(`key`, `throwIfMissing?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [mpt.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L188)

Gets a value given a `key`

#### Parameters

##### key

`Uint8Array`

the key to search for

##### throwIfMissing?

`boolean` = `false`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

***

### getValueMap()

> **getValueMap**(`startKey?`, `limit?`): `Promise`\<\{ `nextKey`: `string` \| `null`; `values`: \{\[`key`: `string`\]: `string`; \}; \}\>

Defined in: [mpt.ts:1079](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1079)

Returns a list of values stored in the trie

#### Parameters

##### startKey?

`bigint` = `BIGINT_0`

first unhashed key in the range to be returned (defaults to 0).  Note, all keys must be of the same length or undefined behavior will result

##### limit?

`number`

the number of keys to be returned (undefined means all keys)

#### Returns

`Promise`\<\{ `nextKey`: `string` \| `null`; `values`: \{\[`key`: `string`\]: `string`; \}; \}\>

an object with two properties (a map of all key/value pairs in the trie - or in the specified range) and then a `nextKey` reference if a range is specified

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [mpt.ts:1017](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1017)

Is the trie during a checkpoint phase?

#### Returns

`boolean`

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

Defined in: [mpt.ts:473](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L473)

Retrieves a node from db by hash.

#### Parameters

##### node

`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [mpt.ts:951](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L951)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `value`, `skipKeyTransform?`): `Promise`\<`void`\>

Defined in: [mpt.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L204)

Stores `value` at `key`, or deletes the key when `value` is empty.

Deletes only reach the backing DB when node pruning is enabled.

#### Parameters

##### key

`Uint8Array`

##### value

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

##### skipKeyTransform?

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [mpt.ts:1051](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1051)

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Defined in: [mpt.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L149)

Gets and/or Sets the current root of the `trie`

#### Parameters

##### value?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`pathNibbles`, `stack`, `opStack`): `Promise`\<`void`\>

Defined in: [mpt.ts:772](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L772)

Persists the modified node stack to the DB. Processes nodes from leaf toward root,
wiring each node's references (extension value, branch slot) to its child's hash.

#### Parameters

##### pathNibbles

[`Nibbles`](../type-aliases/Nibbles.md)

##### stack

[`MPTNode`](../type-aliases/MPTNode.md)[]

nodes from findPath/update, bottom (leaf) to top (root)

##### opStack

`BatchDBOp`[]

put/del operations accumulated by _formatNode

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints?`, `opts?`): `MerklePatriciaTrie`

Defined in: [mpt.ts:934](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L934)

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

##### includeCheckpoints?

`boolean` = `true`

If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.

##### opts?

[`TrieShallowCopyOpts`](../interfaces/TrieShallowCopyOpts.md)

#### Returns

`MerklePatriciaTrie`

***

### verifyPrunedIntegrity()

> **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

Defined in: [mpt.ts:867](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L867)

Verifies that every key in the DB is reachable from the root. Used to ensure
pruning is correct – unreachable keys indicate a bug or corrupt state.

#### Returns

`Promise`\<`boolean`\>

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Defined in: [mpt.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L429)

Executes a callback for each node in the trie.

#### Parameters

##### onFound

`OnFound`

callback to call when a node is found.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### walkAllValueNodes()

> **walkAllValueNodes**(`onFound`): `Promise`\<`void`\>

Defined in: [mpt.ts:440](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L440)

Executes a callback for each value node in the trie.

#### Parameters

##### onFound

`OnFound`

callback to call when a node is found.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### walkTrie()

> **walkTrie**(`root`, `onFound`): `Promise`\<`void`\>

Defined in: [mpt.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L418)

Walk the trie from `root`, invoking `onFound` for each visited node.

#### Parameters

##### root

`Uint8Array`

Root hash to start from

##### onFound

[`FoundNodeFunction`](../type-aliases/FoundNodeFunction.md)

Callback that may schedule further child visits via the walk controller

#### Returns

`Promise`\<`void`\>
