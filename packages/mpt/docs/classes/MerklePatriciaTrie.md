[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / MerklePatriciaTrie

# Class: MerklePatriciaTrie

Defined in: [packages/mpt/src/mpt.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L59)

The basic trie interface, use with `import { MerklePatriciaTrie } from '@ethereumjs/mpt'`.
A trie can be created with one of the following constructor methods:

* [createMPT](../functions/createMPT.md)
* [createMPTFromProof](../functions/createMPTFromProof.md)

## Constructors

### Constructor

> **new MerklePatriciaTrie**(`opts?`): `MerklePatriciaTrie`

Defined in: [packages/mpt/src/mpt.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L90)

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

Defined in: [packages/mpt/src/mpt.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L71)

The root for an empty trie

***

### walkTrieIterable()

> **walkTrieIterable**: (...`args`) => `AsyncIterable`

Defined in: [packages/mpt/src/mpt.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L468)

#### Parameters

##### args

...\[`Uint8Array`\<`ArrayBufferLike`\>, `number`[], `OnFound`, `NodeFilter`, `Set`\<`string`\>\]

#### Returns

`AsyncIterable`

## Methods

### batch()

> **batch**(`ops`, `skipKeyTransform?`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:876](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L876)

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

Defined in: [packages/mpt/src/mpt.ts:1040](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1040)

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: [packages/mpt/src/mpt.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L176)

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:1050](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1050)

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### database()

> **database**(`db?`, `valueEncoding?`): [`CheckpointDB`](CheckpointDB.md)

Defined in: [packages/mpt/src/mpt.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L141)

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

Defined in: [packages/mpt/src/mpt.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L282)

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

Defined in: [packages/mpt/src/mpt.ts:325](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L325)

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

Defined in: [packages/mpt/src/mpt.ts:1082](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1082)

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### get()

> **get**(`key`, `throwIfMissing`): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/mpt/src/mpt.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L195)

Gets a value given a `key`

#### Parameters

##### key

`Uint8Array`

the key to search for

##### throwIfMissing

`boolean` = `false`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

***

### getValueMap()

> **getValueMap**(`startKey`, `limit?`): `Promise`\<\{ `nextKey`: `null` \| `string`; `values`: \{[`key`: `string`]: `string`; \}; \}\>

Defined in: [packages/mpt/src/mpt.ts:1094](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1094)

Returns a list of values stored in the trie

#### Parameters

##### startKey

`bigint` = `BIGINT_0`

first unhashed key in the range to be returned (defaults to 0).  Note, all keys must be of the same length or undefined behavior will result

##### limit?

`number`

the number of keys to be returned (undefined means all keys)

#### Returns

`Promise`\<\{ `nextKey`: `null` \| `string`; `values`: \{[`key`: `string`]: `string`; \}; \}\>

an object with two properties (a map of all key/value pairs in the trie - or in the specified range) and then a `nextKey` reference if a range is specified

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: [packages/mpt/src/mpt.ts:1032](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1032)

Is the trie during a checkpoint phase?

#### Returns

`boolean`

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

Defined in: [packages/mpt/src/mpt.ts:519](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L519)

Retrieves a node from db by hash.

#### Parameters

##### node

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<[`MPTNode`](../type-aliases/MPTNode.md)\>

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:979](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L979)

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `value`, `skipKeyTransform`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L213)

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### key

`Uint8Array`

##### value

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### skipKeyTransform

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:1066](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L1066)

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Defined in: [packages/mpt/src/mpt.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L156)

Gets and/or Sets the current root of the `trie`

#### Parameters

##### value?

`null` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`key`, `stack`, `opStack`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:790](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L790)

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

> **shallowCopy**(`includeCheckpoints`, `opts?`): `MerklePatriciaTrie`

Defined in: [packages/mpt/src/mpt.ts:962](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L962)

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

Defined in: [packages/mpt/src/mpt.ts:894](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L894)

#### Returns

`Promise`\<`boolean`\>

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/mpt.ts:475](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L475)

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

Defined in: [packages/mpt/src/mpt.ts:486](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L486)

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

Defined in: [packages/mpt/src/mpt.ts:464](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/mpt.ts#L464)

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
