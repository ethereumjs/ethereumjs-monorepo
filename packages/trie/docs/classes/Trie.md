[@ethereumjs/trie](../README.md) / Trie

# Class: Trie

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.

## Table of contents

### Constructors

- [constructor](Trie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](Trie.md#empty_trie_root)
- [walkTrieIterable](Trie.md#walktrieiterable)

### Methods

- [batch](Trie.md#batch)
- [checkRoot](Trie.md#checkroot)
- [checkpoint](Trie.md#checkpoint)
- [commit](Trie.md#commit)
- [createProof](Trie.md#createproof)
- [createReadStream](Trie.md#createreadstream)
- [database](Trie.md#database)
- [del](Trie.md#del)
- [findPath](Trie.md#findpath)
- [flushCheckpoints](Trie.md#flushcheckpoints)
- [fromProof](Trie.md#fromproof)
- [get](Trie.md#get)
- [hasCheckpoints](Trie.md#hascheckpoints)
- [lookupNode](Trie.md#lookupnode)
- [persistRoot](Trie.md#persistroot)
- [put](Trie.md#put)
- [revert](Trie.md#revert)
- [root](Trie.md#root)
- [saveStack](Trie.md#savestack)
- [shallowCopy](Trie.md#shallowcopy)
- [verifyProof](Trie.md#verifyproof)
- [verifyPrunedIntegrity](Trie.md#verifyprunedintegrity)
- [verifyRangeProof](Trie.md#verifyrangeproof)
- [walkAllNodes](Trie.md#walkallnodes)
- [walkAllValueNodes](Trie.md#walkallvaluenodes)
- [walkTrie](Trie.md#walktrie)
- [create](Trie.md#create)

## Constructors

### constructor

• **new Trie**(`opts?`)

Creates a new trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | Options for instantiating the trie  Note: in most cases, the static [create](Trie.md#create) constructor should be used.  It uses the same API but provides sensible defaults |

#### Defined in

[packages/trie/src/trie.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L75)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Uint8Array`

The root for an empty trie

#### Defined in

[packages/trie/src/trie.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L61)

___

### walkTrieIterable

• **walkTrieIterable**: (...`args`: [nodeHash: Uint8Array, currentKey: number[], onFound: OnFound, filter: NodeFilter, visited: Set<string\>]) => `AsyncIterable`<{ `currentKey`: `number`[] ; `node`: [`TrieNode`](../README.md#trienode)  }\>

#### Type declaration

▸ (...`args`): `AsyncIterable`<{ `currentKey`: `number`[] ; `node`: [`TrieNode`](../README.md#trienode)  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [nodeHash: Uint8Array, currentKey: number[], onFound: OnFound, filter: NodeFilter, visited: Set<string\>] |

##### Returns

`AsyncIterable`<{ `currentKey`: `number`[] ; `node`: [`TrieNode`](../README.md#trienode)  }\>

#### Defined in

[packages/trie/src/trie.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L355)

## Methods

### batch

▸ **batch**(`ops`): `Promise`<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
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
await trie.batch(ops)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | `BatchDBOp`<`Uint8Array`, `Uint8Array`\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:755](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L755)

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

[packages/trie/src/trie.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L150)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1001](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1001)

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

[packages/trie/src/trie.ts:1010](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1010)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof from a trie and key that can be verified using [verifyProof](Trie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[packages/trie/src/trie.ts:795](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L795)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

[packages/trie/src/trie.ts:917](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L917)

___

### database

▸ **database**(`db?`): [`CheckpointDB`](CheckpointDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `db?` | `DB`<`string`, `string`\> |

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Defined in

[packages/trie/src/trie.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L116)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is deleted.

#### Defined in

[packages/trie/src/trie.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L242)

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

[packages/trie/src/trie.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L280)

___

### flushCheckpoints

▸ **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1040](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1040)

___

### fromProof

▸ **fromProof**(`proof`): `Promise`<`void`\>

Saves the nodes from a proof into the trie.

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:773](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L773)

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

[packages/trie/src/trie.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L169)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/trie.ts:993](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L993)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<``null`` \| [`TrieNode`](../README.md#trienode)\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

`Promise`<``null`` \| [`TrieNode`](../README.md#trienode)\>

#### Defined in

[packages/trie/src/trie.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L402)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:949](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L949)

___

### put

▸ **put**(`key`, `value`): `Promise`<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is stored.

#### Defined in

[packages/trie/src/trie.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L185)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1026](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1026)

___

### root

▸ **root**(`value?`): `Uint8Array`

Gets and/or Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | ``null`` \| `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/trie/src/trie.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L131)

___

### saveStack

▸ **saveStack**(`key`, `stack`, `opStack`): `Promise`<`void`\>

Saves a stack of nodes to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) | the key. Should follow the stack |
| `stack` | [`TrieNode`](../README.md#trienode)[] | a stack of nodes to the value given by the key |
| `opStack` | `BatchDBOp`<`Uint8Array`, `Uint8Array`\>[] | a stack of levelup operations to commit at the end of this function |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:670](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L670)

___

### shallowCopy

▸ **shallowCopy**(`includeCheckpoints?`): [`Trie`](Trie.md)

Returns a copy of the underlying trie.

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

[`Trie`](Trie.md)

#### Defined in

[packages/trie/src/trie.ts:933](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L933)

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

[packages/trie/src/trie.ts:811](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L811)

___

### verifyPrunedIntegrity

▸ **verifyPrunedIntegrity**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:863](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L863)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

[verifyRangeProof](../README.md#verifyrangeproof)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Uint8Array` |
| `firstKey` | ``null`` \| `Uint8Array` |
| `lastKey` | ``null`` \| `Uint8Array` |
| `keys` | `Uint8Array`[] |
| `values` | `Uint8Array`[] |
| `proof` | ``null`` \| `Uint8Array`[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:840](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L840)

___

### walkAllNodes

▸ **walkAllNodes**(`onFound`): `Promise`<`void`\>

Executes a callback for each node in the trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Defined in

[packages/trie/src/trie.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L362)

___

### walkAllValueNodes

▸ **walkAllValueNodes**(`onFound`): `Promise`<`void`\>

Executes a callback for each value node in the trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Defined in

[packages/trie/src/trie.ts:373](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L373)

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Uint8Array` |  |
| `onFound` | [`FoundNodeFunction`](../README.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Defined in

[packages/trie/src/trie.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L351)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`Trie`](Trie.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

#### Defined in

[packages/trie/src/trie.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L91)
