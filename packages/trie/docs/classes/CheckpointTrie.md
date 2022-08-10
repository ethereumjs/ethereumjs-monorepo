[@ethereumjs/trie](../README.md) / CheckpointTrie

# Class: CheckpointTrie

Adds checkpointing to the [Trie](Trie.md)

## Hierarchy

- [`Trie`](Trie.md)

  ↳ **`CheckpointTrie`**

  ↳↳ [`SecureTrie`](SecureTrie.md)

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
- [prove](CheckpointTrie.md#prove)
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

[packages/trie/src/trie/checkpoint.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L12)

## Properties

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Buffer`

The root for an empty trie

#### Inherited from

[Trie](Trie.md).[EMPTY_TRIE_ROOT](Trie.md#empty_trie_root)

#### Defined in

[packages/trie/src/trie/trie.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L38)

___

### db

• **db**: [`CheckpointDB`](CheckpointDB.md)

The backend DB

#### Overrides

[Trie](Trie.md).[db](Trie.md#db)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L9)

___

### dbStorage

• **dbStorage**: [`DB`](../interfaces/DB.md)

#### Defined in

[packages/trie/src/trie/checkpoint.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L10)

## Accessors

### isCheckpoint

• `get` **isCheckpoint**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Overrides

Trie.isCheckpoint

#### Defined in

[packages/trie/src/trie/checkpoint.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L21)

___

### root

• `get` **root**(): `Buffer`

Gets the current root of the `trie`

#### Returns

`Buffer`

#### Inherited from

Trie.root

#### Defined in

[packages/trie/src/trie/trie.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L104)

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

[packages/trie/src/trie/trie.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L92)

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

[packages/trie/src/trie/trie.ts:630](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L630)

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

[packages/trie/src/trie/trie.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L111)

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/checkpoint.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L29)

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

[packages/trie/src/trie/checkpoint.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L38)

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

[packages/trie/src/trie/checkpoint.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L69)

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

[packages/trie/src/trie/trie.ts:679](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L679)

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

[packages/trie/src/trie/trie.ts:740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L740)

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

[packages/trie/src/trie/trie.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L183)

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

[packages/trie/src/trie/trie.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L199)

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

[packages/trie/src/trie/trie.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L648)

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

[packages/trie/src/trie/trie.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L137)

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

[packages/trie/src/trie/trie.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L290)

___

### persistRoot

▸ **persistRoot**(): `Promise`<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`<`void`\>

#### Inherited from

[Trie](Trie.md).[persistRoot](Trie.md#persistroot)

#### Defined in

[packages/trie/src/trie/trie.ts:760](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L760)

___

### prove

▸ **prove**(`key`): `Promise`<[`Proof`](../README.md#proof)\>

prove has been renamed to [createProof](Trie.md#createproof).

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Buffer` |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Inherited from

[Trie](Trie.md).[prove](Trie.md#prove)

#### Defined in

[packages/trie/src/trie/trie.ts:671](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L671)

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

[packages/trie/src/trie/trie.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L153)

___

### revert

▸ **revert**(): `Promise`<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/trie/checkpoint.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/checkpoint.ts#L54)

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

[packages/trie/src/trie/trie.ts:695](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L695)

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

[packages/trie/src/trie/trie.ts:717](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L717)

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

[packages/trie/src/trie/trie.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L270)

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`Trie`](Trie.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`TrieOpts`](../interfaces/TrieOpts.md) |

#### Returns

`Promise`<[`Trie`](Trie.md)\>

#### Inherited from

[Trie](Trie.md).[create](Trie.md#create)

#### Defined in

[packages/trie/src/trie/trie.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/trie.ts#L73)
