[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / MerklePatriciaTrie

# Class: MerklePatriciaTrie

Defined in: [packages/mpt/src/mpt.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L73)

Merkle Patricia Trie - a space-optimized trie where each node with only one child
is merged with its parent. Used for Ethereum state and storage.

Node types:
- Branch: 16-way branch + optional value (for keys ending at this node)
- Extension: short path (nibbles) → child node
- Leaf: remaining path (nibbles) → value

## Constructors

### Constructor

> **new MerklePatriciaTrie**(`opts?`): `MerklePatriciaTrie`

Defined in: [packages/mpt/src/mpt.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L105)

Creates a new trie.

#### Parameters

##### opts?

[`MPTOpts`](../interfaces/MPTOpts.md)

Options for instantiating the trie

Note: in most cases, [createMPT](../functions/createMPT.md) constructor should be used.  It uses the same API but provides sensible defaults

#### Returns

`MerklePatriciaTrie`

## Properties

### EMPTY\_TRIE\_ROOT

> **EMPTY\_TRIE\_ROOT**: `Uint8Array`

Defined in: [packages/mpt/src/mpt.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L86)

The root for an empty trie

***

### walkTrieIterable()

> **walkTrieIterable**: (...`args`) => `AsyncIterable`

Defined in: [packages/mpt/src/mpt.ts:436](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L436)

#### Parameters

##### args

...\[`Uint8Array`\<`ArrayBufferLike`\>, `number`[], `OnFound`, `NodeFilter`, `Set`\<`string`\>\]

#### Returns

`AsyncIterable`

## Methods

### \_formatNode()

> **\_formatNode**(`node`, `topLevel`, `opStack`, `remove`): [`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md) \| [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[] \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/mpt/src/mpt.ts:790](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L790)

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

##### remove

`boolean` = `false`

if true, schedule del (used when pruning)

#### Returns

[`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md) \| [`BranchMPTNodeBranchValue`](../type-aliases/BranchMPTNodeBranchValue.md)[] \| `Uint8Array`\<`ArrayBufferLike`\>

hash (for references) or raw encoding (for inline)

***

### batch()

> **batch**(`ops`, `skipKeyTransform?`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:829](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L829)

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### ops

`BatchDBOp`[]

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

Defined in: [packages/mpt/src/mpt.ts:1003](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1003)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [packages/mpt/src/mpt.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L182)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:1013](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1013)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### database()

> **database**(`db?`, `valueEncoding?`): [`CheckpointDB`](CheckpointDB.md)

Defined in: [packages/mpt/src/mpt.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L147)

#### Parameters

##### db?

`DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

##### valueEncoding?

`ValueEncoding`

#### Returns

[`CheckpointDB`](CheckpointDB.md)

***

### del()

> **del**(`key`, `skipKeyTransform`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L269)

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### key

`Uint8Array`

##### skipKeyTransform

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is deleted.

***

### findPath()

> **findPath**(`key`, `throwIfMissing`, `partialPath`): `Promise`\<[`Path`](../interfaces/Path.md)\>

Defined in: [packages/mpt/src/mpt.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L302)

Finds the path from root to the node for the given key.
Walks the trie, matching nibbles at each level. Returns the target node (if found)
and the stack of nodes along the path (needed for updates/deletes).

#### Parameters

##### key

`Uint8Array`

the search key (bytes)

##### throwIfMissing

`boolean` = `false`

if true, throws when nodes are missing (e.g. proof verification)

##### partialPath

optional pre-loaded stack for resuming from a mid-path node

###### stack

[`MPTNode`](../type-aliases/MPTNode.md)[]

#### Returns

`Promise`\<[`Path`](../interfaces/Path.md)\>

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Defined in: [packages/mpt/src/mpt.ts:1045](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1045)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### get()

> **get**(`key`, `throwIfMissing`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [packages/mpt/src/mpt.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L201)

Gets a value given a `key`

#### Parameters

##### key

`Uint8Array`

the key to search for

##### throwIfMissing

`boolean` = `false`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

***

### getValueMap()

> **getValueMap**(`startKey`, `limit?`): `Promise`\<\{ `nextKey`: `string` \| `null`; `values`: \{\[`key`: `string`\]: `string`; \}; \}\>

Defined in: [packages/mpt/src/mpt.ts:1057](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1057)

Returns a list of values stored in the trie

#### Parameters

##### startKey

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

Defined in: [packages/mpt/src/mpt.ts:995](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L995)

Is the trie during a checkpoint phase?

#### Returns

`boolean`

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

Defined in: [packages/mpt/src/mpt.ts:487](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L487)

Retrieves a node from db by hash.

#### Parameters

##### node

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:929](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L929)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `value`, `skipKeyTransform`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L219)

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### key

`Uint8Array`

##### value

`Uint8Array`\<`ArrayBufferLike`\> | `null`

##### skipKeyTransform

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:1029](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1029)

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Defined in: [packages/mpt/src/mpt.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L162)

Gets and/or Sets the current root of the `trie`

#### Parameters

##### value?

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`pathNibbles`, `stack`, `opStack`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:752](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L752)

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

> **shallowCopy**(`includeCheckpoints`, `opts?`): `MerklePatriciaTrie`

Defined in: [packages/mpt/src/mpt.ts:912](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L912)

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

##### includeCheckpoints

`boolean` = `true`

If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.

##### opts?

[`TrieShallowCopyOpts`](../interfaces/TrieShallowCopyOpts.md)

#### Returns

`MerklePatriciaTrie`

***

### verifyPrunedIntegrity()

> **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

Defined in: [packages/mpt/src/mpt.ts:847](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L847)

Verifies that every key in the DB is reachable from the root. Used to ensure
pruning is correct – unreachable keys indicate a bug or corrupt state.

#### Returns

`Promise`\<`boolean`\>

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L443)

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

Defined in: [packages/mpt/src/mpt.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L454)

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

Defined in: [packages/mpt/src/mpt.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L432)

Walks a trie until finished.

#### Parameters

##### root

`Uint8Array`

##### onFound

[`FoundNodeFunction`](../type-aliases/FoundNodeFunction.md)

callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.
