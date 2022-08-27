[@ethereumjs/trie](../README.md) / CheckpointTrie

# Class: CheckpointTrie

Adds checkpointing to the [Trie](Trie.md)

## Hierarchy

- [`Trie`](Trie.md)

  ↳ **`CheckpointTrie`**

## Table of contents

### Constructors

- [constructor](CheckpointTrie.md#constructor)

### Properties

- [EMPTY\_TRIE\_ROOT](CheckpointTrie.md#empty_trie_root)
- [db](CheckpointTrie.md#db)
- [dbStorage](CheckpointTrie.md#dbstorage)

### Accessors

- [isCheckpoint](CheckpointTrie.md#ischeckpoint)
- [root](CheckpointTrie.md#root)

### Methods

- [batch](CheckpointTrie.md#batch)
- [checkRoot](CheckpointTrie.md#checkroot)
- [checkpoint](CheckpointTrie.md#checkpoint)
- [commit](CheckpointTrie.md#commit)
- [copy](CheckpointTrie.md#copy)
- [createProof](CheckpointTrie.md#createproof)
- [createReadStream](CheckpointTrie.md#createreadstream)
- [del](CheckpointTrie.md#del)
- [findPath](CheckpointTrie.md#findpath)
- [fromProof](CheckpointTrie.md#fromproof)
- [get](CheckpointTrie.md#get)
- [lookupNode](CheckpointTrie.md#lookupnode)
- [persistRoot](CheckpointTrie.md#persistroot)
- [put](CheckpointTrie.md#put)
- [revert](CheckpointTrie.md#revert)
- [verifyProof](CheckpointTrie.md#verifyproof)
- [verifyRangeProof](CheckpointTrie.md#verifyrangeproof)
- [walkTrie](CheckpointTrie.md#walktrie)
- [create](CheckpointTrie.md#create)

## Constructors

### constructor

• **new CheckpointTrie**(`opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Overrides

[Trie](Trie.md).[constructor](Trie.md#constructor)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L15)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[Trie](Trie.md).[EMPTY_TRIE_ROOT](Trie.md#empty_trie_root)

#### Defined in

[packages/trie/src/trie/trie.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L41)

___

### db

• **db**: [`CheckpointDB`](CheckpointDB.md)

The backend DB

#### Overrides

[Trie](Trie.md).[db](Trie.md#db)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L12)

___

### dbStorage

• **dbStorage**: [`DB`](../interfaces/DB.md)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L13)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Overrides

Trie.isCheckpoint

#### Defined in

[packages/trie/src/trie/checkpoint.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L28)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Inherited from

Trie.root

#### Defined in

[packages/trie/src/trie/trie.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L93)

• `set` **root**(`value`): `void`

Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Buffer` |

#### Returns

`void`

#### Inherited from

Trie.root

#### Defined in

[packages/trie/src/trie/trie.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L81)

## Methods

### batch

▸ **batch**(`ops`): `Promise`<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

**`Example`**

```ts
const ops = [
   { type: 'del', key: Buffer.from('father') }
 , { type: 'put', key: Buffer.from('name'), value: Buffer.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Buffer.from('dob'), value: Buffer.from('16 February 1941') }
 , { type: 'put', key: Buffer.from('spouse'), value: Buffer.from('Kim Young-sook') }
 , { type: 'put', key: Buffer.from('occupation'), value: Buffer.from('Clown') }
]
await trie.batch(ops)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | [`BatchDBOp`](../README.md#batchdbop)[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Trie](Trie.md).[batch](Trie.md#batch)

#### Defined in

[packages/trie/src/trie/trie.ts:621](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L621)

___

### checkRoot

▸ **checkRoot**(`root`): `Promise`<`boolean`\>

Checks if a given root exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Buffer` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[Trie](Trie.md).[checkRoot](Trie.md#checkroot)

#### Defined in

[packages/trie/src/trie/trie.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L100)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/checkpoint.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L36)

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

[packages/trie/src/trie/checkpoint.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L45)

___

### copy

▸ **copy**(`includeCheckpoints?`): [`CheckpointTrie`](CheckpointTrie.md)

Returns a copy of the underlying trie with the interface of CheckpointTrie.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `includeCheckpoints` | `boolean` | `true` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |

#### Returns

[`CheckpointTrie`](CheckpointTrie.md)

#### Overrides

[Trie](Trie.md).[copy](Trie.md#copy)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L76)

___

### createProof

▸ **createProof**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

Creates a proof from a trie and key that can be verified using [verifyProof](Trie.md#verifyproof).

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Inherited from

[Trie](Trie.md).[createProof](Trie.md#createproof)

#### Defined in

[packages/trie/src/trie/trie.ts:661](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L661)

___

### createReadStream

▸ **createReadStream**(): [`TrieReadStream`](TrieReadStream.md)

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.

#### Returns

[`TrieReadStream`](TrieReadStream.md)

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Inherited from

[Trie](Trie.md).[createReadStream](Trie.md#createreadstream)

#### Defined in

[packages/trie/src/trie/trie.ts:725](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L725)

___

### del

▸ **del**(`key`): `Promise`<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is deleted.

#### Inherited from

[Trie](Trie.md).[del](Trie.md#del)

#### Defined in

[packages/trie/src/trie/trie.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L173)

___

### findPath

▸ **findPath**(`key`, `throwIfMissing?`): `Promise`<`Path`\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Buffer` | `undefined` | the search key |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<`Path`\>

#### Inherited from

[Trie](Trie.md).[findPath](Trie.md#findpath)

#### Defined in

[packages/trie/src/trie/trie.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L190)

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

#### Inherited from

[Trie](Trie.md).[fromProof](Trie.md#fromproof)

#### Defined in

[packages/trie/src/trie/trie.ts:639](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L639)

___

### get

▸ **get**(`key`, `throwIfMissing?`): `Promise`<``null`` \| `Buffer`\>

Gets a value given a `key`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `Buffer` | `undefined` | the key to search for |
| `throwIfMissing` | `boolean` | `false` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`<``null`` \| `Buffer`\>

A Promise that resolves to `Buffer` if a value was found or `null` if no value was found.

#### Inherited from

[Trie](Trie.md).[get](Trie.md#get)

#### Defined in

[packages/trie/src/trie/trie.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L126)

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`<``null`` \| [`TrieNode`](../README.md#trienode)\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Buffer` \| `Buffer`[] |

#### Returns

`Promise`<``null`` \| [`TrieNode`](../README.md#trienode)\>

#### Inherited from

[Trie](Trie.md).[lookupNode](Trie.md#lookupnode)

#### Defined in

[packages/trie/src/trie/trie.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L281)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Inherited from

[Trie](Trie.md).[persistRoot](Trie.md#persistroot)

#### Defined in

[packages/trie/src/trie/trie.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L746)

___

### put

▸ **put**(`key`, `value`): `Promise`<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

A Promise that resolves once value is stored.

#### Inherited from

[Trie](Trie.md).[put](Trie.md#put)

#### Defined in

[packages/trie/src/trie/trie.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L142)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie/checkpoint.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L61)

___

### verifyProof

▸ **verifyProof**(`rootHash`, `key`, `proof`): `Promise`<``null`` \| `Buffer`\>

Verifies a proof.

**`Throws`**

If proof is found to be invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Buffer` |
| `key` | `Buffer` |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<``null`` \| `Buffer`\>

The value from the key, or null if valid proof of non-existence.

#### Inherited from

[Trie](Trie.md).[verifyProof](Trie.md#verifyproof)

#### Defined in

[packages/trie/src/trie/trie.ts:677](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L677)

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`<`boolean`\>

[verifyRangeProof](../README.md#verifyrangeproof)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `Buffer` |
| `firstKey` | ``null`` \| `Buffer` |
| `lastKey` | ``null`` \| `Buffer` |
| `keys` | `Buffer`[] |
| `values` | `Buffer`[] |
| `proof` | ``null`` \| `Buffer`[] |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[Trie](Trie.md).[verifyRangeProof](Trie.md#verifyrangeproof)

#### Defined in

[packages/trie/src/trie/trie.ts:702](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L702)

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Buffer` |  |
| `onFound` | [`FoundNodeFunction`](../README.md#foundnodefunction) | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`<`void`\>

Resolves when finished walking trie.

#### Inherited from

[Trie](Trie.md).[walkTrie](Trie.md#walktrie)

#### Defined in

[packages/trie/src/trie/trie.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L261)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`CheckpointTrie`](CheckpointTrie.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<[`CheckpointTrie`](CheckpointTrie.md)\>

#### Overrides

[Trie](Trie.md).[create](Trie.md#create)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L21)
