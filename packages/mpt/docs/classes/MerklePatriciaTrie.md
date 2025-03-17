[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / MerklePatriciaTrie

# Class: MerklePatriciaTrie

Defined in: [packages/mpt/src/mpt.ts:54](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L54)

The basic trie interface, use with `import { MerklePatriciaTrie } from '@ethereumjs/mpt'`.

## Constructors

### new MerklePatriciaTrie()

> **new MerklePatriciaTrie**(`opts`?): [`MerklePatriciaTrie`](MerklePatriciaTrie.md)

Defined in: [packages/mpt/src/mpt.ts:85](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L85)

Creates a new trie.

#### Parameters

##### opts?

[`MPTOpts`](../interfaces/MPTOpts.md)

Options for instantiating the trie

Note: in most cases, [createMPT](../functions/createMPT.md) constructor should be used.  It uses the same API but provides sensible defaults

#### Returns

[`MerklePatriciaTrie`](MerklePatriciaTrie.md)

## Properties

### EMPTY\_TRIE\_ROOT

> **EMPTY\_TRIE\_ROOT**: `Uint8Array`

Defined in: [packages/mpt/src/mpt.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L66)

The root for an empty trie

***

### walkTrieIterable()

> **walkTrieIterable**: (...`args`) => `AsyncIterable`\<\{ `currentKey`: `number`[]; `node`: [`MPTNode`](../type-aliases/MPTNode.md); \}\>

Defined in: [packages/mpt/src/mpt.ts:461](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L461)

#### Parameters

##### args

...\[`Uint8Array`, `number`[], `OnFound`, `NodeFilter`, `Set`\<`string`\>\]

#### Returns

`AsyncIterable`\<\{ `currentKey`: `number`[]; `node`: [`MPTNode`](../type-aliases/MPTNode.md); \}\>

## Methods

### batch()

> **batch**(`ops`, `skipKeyTransform`?): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:869](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L869)

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

Defined in: [packages/mpt/src/mpt.ts:1033](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1033)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [packages/mpt/src/mpt.ts:171](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L171)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:1043](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1043)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### database()

> **database**(`db`?, `valueEncoding`?): [`CheckpointDB`](CheckpointDB.md)

Defined in: [packages/mpt/src/mpt.ts:136](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L136)

#### Parameters

##### db?

`DB`\<`string`, `string` \| `Uint8Array`\>

##### valueEncoding?

`ValueEncoding`

#### Returns

[`CheckpointDB`](CheckpointDB.md)

***

### del()

> **del**(`key`, `skipKeyTransform`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:275](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L275)

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

Defined in: [packages/mpt/src/mpt.ts:318](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L318)

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

##### key

`Uint8Array`

the search key

##### throwIfMissing

`boolean` = `false`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

##### partialPath

###### stack

[`MPTNode`](../type-aliases/MPTNode.md)[]

#### Returns

`Promise`\<[`Path`](../interfaces/Path.md)\>

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Defined in: [packages/mpt/src/mpt.ts:1075](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1075)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### get()

> **get**(`key`, `throwIfMissing`): `Promise`\<`null` \| `Uint8Array`\>

Defined in: [packages/mpt/src/mpt.ts:190](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L190)

Gets a value given a `key`

#### Parameters

##### key

`Uint8Array`

the key to search for

##### throwIfMissing

`boolean` = `false`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

***

### getValueMap()

> **getValueMap**(`startKey`, `limit`?): `Promise`\<\{ `nextKey`: `null` \| `string`; `values`: \{\}; \}\>

Defined in: [packages/mpt/src/mpt.ts:1087](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1087)

Returns a list of values stored in the trie

#### Parameters

##### startKey

`bigint` = `BIGINT_0`

first unhashed key in the range to be returned (defaults to 0).  Note, all keys must be of the same length or undefined behavior will result

##### limit?

`number`

the number of keys to be returned (undefined means all keys)

#### Returns

`Promise`\<\{ `nextKey`: `null` \| `string`; `values`: \{\}; \}\>

an object with two properties (a map of all key/value pairs in the trie - or in the specified range) and then a `nextKey` reference if a range is specified

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [packages/mpt/src/mpt.ts:1025](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1025)

Is the trie during a checkpoint phase?

#### Returns

`boolean`

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

Defined in: [packages/mpt/src/mpt.ts:512](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L512)

Retrieves a node from db by hash.

#### Parameters

##### node

`Uint8Array` | `Uint8Array`[]

#### Returns

`Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:972](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L972)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `value`, `skipKeyTransform`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:208](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L208)

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### key

`Uint8Array`

##### value

`null` | `Uint8Array`

##### skipKeyTransform

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:1059](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1059)

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value`?): `Uint8Array`

Defined in: [packages/mpt/src/mpt.ts:151](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L151)

Gets and/or Sets the current root of the `trie`

#### Parameters

##### value?

`null` | `Uint8Array`

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`key`, `stack`, `opStack`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:783](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L783)

Saves a stack of nodes to the database.

#### Parameters

##### key

[`Nibbles`](../type-aliases/Nibbles.md)

the key. Should follow the stack

##### stack

[`MPTNode`](../type-aliases/MPTNode.md)[]

a stack of nodes to the value given by the key

##### opStack

`BatchDBOp`[]

a stack of levelup operations to commit at the end of this function

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`, `opts`?): [`MerklePatriciaTrie`](MerklePatriciaTrie.md)

Defined in: [packages/mpt/src/mpt.ts:955](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L955)

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

[`MerklePatriciaTrie`](MerklePatriciaTrie.md)

***

### verifyPrunedIntegrity()

> **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

Defined in: [packages/mpt/src/mpt.ts:887](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L887)

#### Returns

`Promise`\<`boolean`\>

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:468](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L468)

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

Defined in: [packages/mpt/src/mpt.ts:479](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L479)

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

Defined in: [packages/mpt/src/mpt.ts:457](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L457)

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
