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

[packages/trie/src/trie.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L86)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Uint8Array`

The root for an empty trie

#### Defined in

[packages/trie/src/trie.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L67)

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

[packages/trie/src/trie.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L443)

## Methods

### batch

▸ **batch**(`ops`, `skipKeyTransform?`): `Promise`<`void`\>

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
| `skipKeyTransform?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:844](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L844)

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

[packages/trie/src/trie.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L182)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1124)

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

[packages/trie/src/trie.ts:1134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1134)

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

[packages/trie/src/trie.ts:892](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L892)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

[packages/trie/src/trie.ts:1029](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1029)

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

[packages/trie/src/trie.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L149)

___

### del

▸ **del**(`key`, `skipKeyTransform?`): `Promise`<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` |
| `skipKeyTransform` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is deleted.

#### Defined in

[packages/trie/src/trie.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L283)

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

[packages/trie/src/trie.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L323)

___

### flushCheckpoints

▸ **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1166)

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

[packages/trie/src/trie.ts:862](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L862)

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

[packages/trie/src/trie.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L201)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/trie.ts:1116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1116)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<[`TrieNode`](../README.md#trienode)\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

`Promise`<[`TrieNode`](../README.md#trienode)\>

#### Defined in

[packages/trie/src/trie.ts:492](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L492)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1063](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1063)

___

### put

▸ **put**(`key`, `value`, `skipKeyTransform?`): `Promise`<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | `undefined` |
| `value` | ``null`` \| `Uint8Array` | `undefined` |
| `skipKeyTransform` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is stored.

#### Defined in

[packages/trie/src/trie.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L219)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1150)

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

[packages/trie/src/trie.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L164)

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

[packages/trie/src/trie.ts:758](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L758)

___

### shallowCopy

▸ **shallowCopy**(`includeCheckpoints?`, `opts?`): [`Trie`](Trie.md)

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |
| `opts?` | [`TrieShallowCopyOpts`](../interfaces/TrieShallowCopyOpts.md) | `undefined` | - |

#### Returns

[`Trie`](Trie.md)

#### Defined in

[packages/trie/src/trie.ts:1046](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1046)

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

[packages/trie/src/trie.ts:910](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L910)

___

### verifyPrunedIntegrity

▸ **verifyPrunedIntegrity**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:975](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L975)

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

[packages/trie/src/trie.ts:952](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L952)

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

[packages/trie/src/trie.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L450)

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

[packages/trie/src/trie.ts:461](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L461)

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

[packages/trie/src/trie.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L439)

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

[packages/trie/src/trie.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L121)
