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
- [createAsyncReadStream](Trie.md#createasyncreadstream)
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
- [updateFromProof](Trie.md#updatefromproof)
- [verifyProof](Trie.md#verifyproof)
- [verifyPrunedIntegrity](Trie.md#verifyprunedintegrity)
- [verifyRangeProof](Trie.md#verifyrangeproof)
- [walkAllNodes](Trie.md#walkallnodes)
- [walkAllValueNodes](Trie.md#walkallvaluenodes)
- [walkTrie](Trie.md#walktrie)
- [create](Trie.md#create)
- [createFromProof](Trie.md#createfromproof)
- [fromProof](Trie.md#fromproof-1)
- [verifyProof](Trie.md#verifyproof-1)
- [verifyRangeProof](Trie.md#verifyrangeproof-1)

## Constructors

### constructor

• **new Trie**(`opts?`)

Creates a new trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | Options for instantiating the trie  Note: in most cases, the static [create](Trie.md#create) constructor should be used.  It uses the same API but provides sensible defaults |

#### Defined in

[packages/trie/src/trie.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L99)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Uint8Array`

The root for an empty trie

#### Defined in

[packages/trie/src/trie.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L80)

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

[packages/trie/src/trie.ts:566](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L566)

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

[packages/trie/src/trie.ts:967](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L967)

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

[packages/trie/src/trie.ts:305](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L305)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1277)

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

[packages/trie/src/trie.ts:1287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1287)

___

### createAsyncReadStream

▸ **createAsyncReadStream**(): `ReadableStream`<`any`\>

Use asynchronous iteration over the chunks in a web stream using the for await...of syntax.

#### Returns

`ReadableStream`<`any`\>

Returns a [web stream](https://nodejs.org/api/webstreams.html#example-readablestream) of the contents of the `trie`

#### Defined in

[packages/trie/src/trie.ts:1182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1182)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof from a trie and key that can be verified using [verifyProof](Trie.md#verifyproof-1).

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[packages/trie/src/trie.ts:1035](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1035)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

**`Deprecated`**

Use `createAsyncReadStream`

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

[packages/trie/src/trie.ts:1174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1174)

___

### database

▸ **database**(`db?`, `valueEncoding?`): [`CheckpointDB`](CheckpointDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `db?` | `DB`<`string`, `string` \| `Uint8Array`\> |
| `valueEncoding?` | `ValueEncoding` |

#### Returns

[`CheckpointDB`](CheckpointDB.md)

#### Defined in

[packages/trie/src/trie.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L272)

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

[packages/trie/src/trie.ts:406](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L406)

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

[packages/trie/src/trie.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L446)

___

### flushCheckpoints

▸ **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie.ts:1319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1319)

___

### fromProof

▸ **fromProof**(`proof`): `Promise`<`void`\>

Saves the nodes from a proof into the trie. A static version of this function exists with the same name.

**`Deprecated`**

Use `updateFromProof`

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:986](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L986)

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

[packages/trie/src/trie.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L324)

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

[packages/trie/src/trie.ts:1269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1269)

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

[packages/trie/src/trie.ts:615](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L615)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1216)

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

[packages/trie/src/trie.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L342)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie.ts:1303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1303)

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

[packages/trie/src/trie.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L287)

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

[packages/trie/src/trie.ts:881](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L881)

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

[packages/trie/src/trie.ts:1199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1199)

___

### updateFromProof

▸ **updateFromProof**(`proof`, `shouldVerifyRoot?`): `Promise`<`undefined` \| `Uint8Array`\>

Updates a trie from a proof

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | `undefined` | The proof |
| `shouldVerifyRoot` | `boolean` | `false` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`<`undefined` \| `Uint8Array`\>

The root of the proof

#### Defined in

[packages/trie/src/trie.ts:1005](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1005)

___

### verifyProof

▸ **verifyProof**(`rootHash`, `key`, `proof`): `Promise`<``null`` \| `Uint8Array`\>

Verifies a proof. A static version of this function exists with the same name.

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

[packages/trie/src/trie.ts:1053](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1053)

___

### verifyPrunedIntegrity

▸ **verifyPrunedIntegrity**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:1119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1119)

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

[packages/trie/src/trie.ts:1096](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L1096)

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

[packages/trie/src/trie.ts:573](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L573)

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

[packages/trie/src/trie.ts:584](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L584)

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

[packages/trie/src/trie.ts:562](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L562)

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

[packages/trie/src/trie.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L190)

___

### createFromProof

▸ `Static` **createFromProof**(`proof`, `trieOpts?`): `Promise`<[`Trie`](Trie.md)\>

Create a trie from a given proof

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) | proof to create trie from |
| `trieOpts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | trie opts to be applied to returned trie |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

new trie created from given proof

#### Defined in

[packages/trie/src/trie.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L156)

___

### fromProof

▸ `Static` **fromProof**(`proof`, `opts?`): `Promise`<[`Trie`](Trie.md)\>

Static version of fromProof function with the same behavior.

**`Deprecated`**

Use `updateFromProof`

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

#### Defined in

[packages/trie/src/trie.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L236)

___

### verifyProof

▸ `Static` **verifyProof**(`key`, `proof`, `opts?`): `Promise`<``null`` \| `Uint8Array`\>

Static version of verifyProof function with the same behavior.

**`Throws`**

If proof is found to be invalid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` |  |
| `proof` | [`Proof`](../README.md#proof) |  |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) | Trie options |

#### Returns

`Promise`<``null`` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Defined in

[packages/trie/src/trie.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L256)

___

### verifyRangeProof

▸ `Static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `opts?`): `Promise`<`boolean`\>

Static version of [verifyRangeProof](../README.md#verifyrangeproof) function with the same behavior

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Uint8Array` |
| `firstKey` | ``null`` \| `Uint8Array` |
| `lastKey` | ``null`` \| `Uint8Array` |
| `keys` | `Uint8Array`[] |
| `values` | `Uint8Array`[] |
| `proof` | ``null`` \| `Uint8Array`[] |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/trie/src/trie.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie.ts#L167)
